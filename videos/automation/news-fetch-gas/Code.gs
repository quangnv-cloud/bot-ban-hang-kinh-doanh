/**
 * BOT BÁN HÀNG · KINH DOANH — News Fetch Proxy (Google Apps Script)
 *
 * Fetches RSS feeds from the channel's approved sources on a schedule, dedupes
 * against a Sheet, and exposes a small HTTP API so the Claude cloud routine
 * (running 7h/12h30/19h30) can pull unused candidate headlines and mark the
 * one it picks as used — without needing an MCP connector or local access.
 *
 * Also serves, through the same always-reachable script.google.com endpoint:
 *  - GET ?image=<newsId>       the article's lead photo (fetched + cached
 *                              server-side, so the sandbox never hits a news
 *                              CDN — see the News-image cache section)
 *  - POST {"action":"claim_style"}  the next construction-style slot, handed
 *                              out under a lock so parallel runs don't collide
 *
 * Setup: see SETUP.md in this same folder.
 */

// ---- Config -----------------------------------------------------------

// All URLs verified reachable + valid RSS on 2026-08-25. If a feed 404s later
// (sites restructure their RSS paths periodically), fix the URL here — the
// fetch loop skips a broken feed instead of failing the whole run.
var FEEDS = [
  { source: 'VnExpress',   category: 'general',  url: 'https://vnexpress.net/rss/tin-moi-nhat.rss' },
  { source: 'VnExpress',   category: 'business',  url: 'https://vnexpress.net/rss/kinh-doanh.rss' },
  { source: 'Dan Tri',     category: 'general',  url: 'https://dantri.com.vn/rss/home.rss' },
  { source: 'Dan Tri',     category: 'business',  url: 'https://dantri.com.vn/rss/kinh-doanh.rss' },
  { source: 'Tuoi Tre',    category: 'general',  url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss' },
  { source: 'Znews',       category: 'business',  url: 'https://znews.vn/rss/kinh-doanh-tai-chinh.rss' }
  // Bao Moi: no working public RSS found as of 2026-08-25 (common guessed
  // paths all 404 — it's an aggregator, may need a different integration).
  // Add here if a working feed/API turns up later.
];

var SHEET_NAME = 'news_queue';
var MAX_AGE_HOURS_FOR_API = 30; // doGet only returns items published within this window
// 'imageUrl'   — lead photo URL parsed straight from the RSS item (enclosure / <img> in
//                description). Filled at fetchAndStore time.
// 'imageFileId'— Drive file id of that photo once it has been cached server-side (lazily, on
//                the first GET ?image=<id> request). Blank until then.
var HEADERS = ['id', 'title', 'link', 'source', 'category', 'pubDate', 'fetchedAt', 'used', 'usedAt', 'usedByVideo', 'imageUrl', 'imageFileId'];
var NEWS_IMAGE_FOLDER_NAME = 'BBH_NEWS_IMAGES';
var NEWS_IMAGE_MAX_AGE_DAYS = 7; // cached photos older than this are purged on each fetchAndStore run

// ---- Construction-style rotation --------------------------------------------
// Source of truth for "which of the 10 construction styles the next video uses" — moved here
// 2026-09-04 from videos/style-rotation-state.json in the repo, because two routines running
// close together kept reading the same last_used_index from the file before either committed,
// so both picked the same style slot (incidents 2026-08-30 and 2026-09-03). The Apps Script
// claim_style action hands out the next index under a LockService lock, so concurrent runs get
// distinct slots. The JSON file is kept as a human-readable mirror/log only.
var STYLE_ROTATION = [
  '1-card-and-bar', '2-chip-and-leaderboard', '3-ticker-tape', '4-split-comparison',
  '5-map-and-geo', '6-ring-progress', '7-timeline-chronology', '8-icon-grid',
  '9-editorial-clipping', '10-stock-terminal'
];
// Seed used only if the STYLE_CURSOR Script Property has never been set. 6 = the last index the
// JSON file recorded as used (style 7 — Timeline Chronology, video vn-index-thung-1800-diem,
// 2026-09-04), so the first claim_style call returns index 7 (style 8 — Icon Grid).
var STYLE_CURSOR_SEED = 6;

// Cross-channel posting log (Facebook + future TikTok/YouTube) — same
// spreadsheet as news_queue, separate tab. See logPost_ + POSTS_HEADERS below.
var POSTS_SHEET_NAME = 'posts_log';
var POSTS_HEADERS = [
  'posted_at', 'channel', 'post_type', 'video_project', 'title',
  'caption', 'platform_post_id', 'permalink', 'status', 'posted_by', 'notes'
];

// ---- Sheet helpers ------------------------------------------------------

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SPREADSHEET_ID');
  var ss;
  if (ssId) {
    ss = SpreadsheetApp.openById(ssId);
  } else {
    ss = SpreadsheetApp.create('BBH News Queue');
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return sheet;
  }
  // Reconcile the header row so a sheet created before a column was added still lines up with
  // HEADERS (existing data rows just carry blanks in the new columns). Only ever appends new
  // header cells at the end — never reorders or renames — so column indexes stay stable.
  var width = sheet.getLastColumn();
  var current = width > 0 ? sheet.getRange(1, 1, 1, width).getValues()[0] : [];
  if (current.length < HEADERS.length) {
    var missing = HEADERS.slice(current.length);
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
  }
  return sheet;
}

function hashLink_(link) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, link);
  return digest.map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, '0'); }).join('').slice(0, 12);
}

// ---- Cross-channel posting log (Facebook / TikTok / YouTube) --------------

function getPostsSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SPREADSHEET_ID');
  var ss = ssId ? SpreadsheetApp.openById(ssId) : SpreadsheetApp.create('BBH News Queue');
  if (!ssId) props.setProperty('SPREADSHEET_ID', ss.getId());
  var sheet = ss.getSheetByName(POSTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(POSTS_SHEET_NAME);
    sheet.appendRow(POSTS_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Appends one row to posts_log. `fields` may omit any column — missing ones
 * are left blank. `posted_at` defaults to now if not given.
 */
function logPost_(fields) {
  var sheet = getPostsSheet_();
  var row = POSTS_HEADERS.map(function (h) {
    if (h === 'posted_at') return fields.posted_at || new Date().toISOString();
    var v = fields[h];
    return (v === undefined || v === null) ? '' : v;
  });
  sheet.appendRow(row);
}

/**
 * Idempotency guard — added 2026-08-29 after a duplicate-posting incident
 * (a manual test call during thumbnail debugging left a second live Reel on
 * the Facebook Page for the same video, undetected because nothing checked
 * posts_log before publishing). Scans posts_log for an existing row with
 * this exact channel + video_project + post_type combo already marked
 * 'published'. Returns that row (as a plain object) if found, else null.
 * A 'failed' or 'deleted' row for the same combo does NOT block — only a
 * live 'published' one does, so a genuine retry after a real failure still
 * works. Every publish_* action in doPost calls this first; a caller can
 * force through anyway with {"force": true} in the request body (e.g. a
 * deliberate intentional re-post), which skips the check entirely.
 */
function alreadyPublished_(channel, videoProject, postType) {
  if (!videoProject) return null; // nothing to key on — can't guard, let it through
  var sheet = getPostsSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  var data = sheet.getRange(2, 1, lastRow - 1, POSTS_HEADERS.length).getValues();
  for (var i = data.length - 1; i >= 0; i--) { // most recent first
    var rec = {};
    POSTS_HEADERS.forEach(function (h, j) { rec[h] = data[i][j]; });
    if (rec.channel === channel && rec.video_project === videoProject &&
        rec.post_type === postType && rec.status === 'published') {
      return rec;
    }
  }
  return null;
}

// ---- Fetch + store --------------------------------------------------------

/**
 * Run this on a time-driven trigger (see SETUP.md). Pulls every feed in
 * FEEDS, adds any link not already in the sheet as a new unused row.
 */
function fetchAndStore() {
  var sheet = getSheet_();
  var existingLinks = {};
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var linkCol = sheet.getRange(2, HEADERS.indexOf('link') + 1, lastRow - 1, 1).getValues();
    linkCol.forEach(function (row) { existingLinks[row[0]] = true; });
  }

  var newRows = [];
  var now = new Date();

  FEEDS.forEach(function (feed) {
    try {
      var resp = UrlFetchApp.fetch(feed.url, { muteHttpExceptions: true, followRedirects: true });
      if (resp.getResponseCode() !== 200) {
        Logger.log('Feed failed (%s): HTTP %s — %s', feed.source, resp.getResponseCode(), feed.url);
        return;
      }
      var doc = XmlService.parse(resp.getContentText());
      var items = doc.getRootElement().getChild('channel').getChildren('item');

      items.forEach(function (item) {
        var link = (item.getChildText('link') || '').trim();
        if (!link || existingLinks[link]) return;

        var title = (item.getChildText('title') || '').trim();
        var pubDateRaw = item.getChildText('pubDate') || '';
        var pubDate = pubDateRaw ? new Date(pubDateRaw) : now;

        newRows.push([
          hashLink_(link),
          title,
          link,
          feed.source,
          feed.category,
          pubDate.toISOString(),
          now.toISOString(),
          false,
          '',
          '',
          extractImageUrl_(item),
          ''
        ]);
        existingLinks[link] = true;
      });
    } catch (err) {
      Logger.log('Feed error (%s): %s — %s', feed.source, err, feed.url);
    }
  });

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, HEADERS.length).setValues(newRows);
  }
  Logger.log('fetchAndStore: added %s new item(s)', newRows.length);

  try { purgeOldNewsImages_(); } catch (pErr) { Logger.log('purgeOldNewsImages_ failed: %s', pErr); }
}

/**
 * Pulls the lead-photo URL out of one RSS <item>. VnExpress and Tuổi Trẻ put it in
 * <enclosure url="..." type="image/*">, Dân Trí and Znews embed a single <img src="..."> at the
 * top of the CDATA <description>, and some feeds use the Media RSS <media:content>/<media:thumbnail>.
 * Returns '' if none is found. The host is always a news-site image CDN
 * (icdn.dantri.com.vn, i1-*.vnecdn.net, cdn*.tuoitre.vn, photo.znews.vn, ...) — it is only ever
 * fetched later, server-side, by serveNewsImage_ for an item this feed itself selected.
 */
function extractImageUrl_(item) {
  try {
    var enc = item.getChild('enclosure');
    if (enc) {
      var typeAttr = enc.getAttribute('type');
      var urlAttr = enc.getAttribute('url');
      if (urlAttr && (!typeAttr || /^image\//i.test(typeAttr.getValue()))) {
        return urlAttr.getValue().trim();
      }
    }
  } catch (e) {}

  try {
    var mediaNs = XmlService.getNamespace('http://search.yahoo.com/mrss/');
    var mc = item.getChild('content', mediaNs) || item.getChild('thumbnail', mediaNs);
    if (mc && mc.getAttribute('url')) return mc.getAttribute('url').getValue().trim();
  } catch (e) {}

  var blobs = [];
  try { blobs.push(item.getChildText('description') || ''); } catch (e) {}
  try {
    var contentNs = XmlService.getNamespace('http://purl.org/rss/1.0/modules/content/');
    blobs.push(item.getChildText('encoded', contentNs) || '');
  } catch (e) {}
  for (var i = 0; i < blobs.length; i++) {
    var m = blobs[i].match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && /^https?:\/\//i.test(m[1])) return m[1].trim();
  }
  return '';
}

// ---- News-image cache ----------------------------------------------------
//
// The video routine used to curl the article photo straight off the news CDN
// (icdn.dantri.com.vn, i1-*.vnecdn.net, cdn*.tuoitre.vn, photo.znews.vn, ...) from the cloud
// sandbox. That sandbox goes through an egress proxy with a hostname allowlist, and those exact
// CDN subdomains kept being off it / unstable — every few days a whole run would abort at step 1
// with no photo (2026-09-01..02 five in a row, again 2026-09-04). Fix: fetch the photo here
// instead. Apps Script runs on Google's own IPs (not the sandbox, not the proxy) and the news
// CDNs serve those fine — same reason all the social publishing already goes through this script.

function getNewsImageFolder_() {
  var props = PropertiesService.getScriptProperties();
  var fid = props.getProperty('NEWS_IMAGE_FOLDER_ID');
  if (fid) {
    try { return DriveApp.getFolderById(fid); } catch (e) { /* fall through and recreate */ }
  }
  var it = DriveApp.getFoldersByName(NEWS_IMAGE_FOLDER_NAME);
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder(NEWS_IMAGE_FOLDER_NAME);
  props.setProperty('NEWS_IMAGE_FOLDER_ID', folder.getId());
  return folder;
}

/**
 * GET ?image=<newsId> handler. Looks the id up in news_queue, returns the item's lead photo as
 * base64 in JSON. Fetches + caches to Drive on first call, serves the cached copy after.
 */
function serveNewsImage_(newsId) {
  var out = function (obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  };
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return out({ ok: false, error: 'news_queue empty' });

  var idIdx = HEADERS.indexOf('id');
  var urlIdx = HEADERS.indexOf('imageUrl');
  var fileIdx = HEADERS.indexOf('imageFileId');
  var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var rowNum = -1, rec = null;
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][idIdx]) === newsId) { rowNum = i + 2; rec = data[i]; break; }
  }
  if (rowNum === -1) return out({ ok: false, error: 'news id not found: ' + newsId });

  var cachedId = rec[fileIdx];
  if (cachedId) {
    try {
      var f = DriveApp.getFileById(cachedId);
      var b = f.getBlob();
      return out({ ok: true, mime: b.getContentType() || 'image/jpeg', filename: f.getName(),
        cached: true, data: Utilities.base64Encode(b.getBytes()) });
    } catch (e) { /* cached file gone — re-fetch below */ }
  }

  var imageUrl = String(rec[urlIdx] || '').trim();
  if (!imageUrl) return out({ ok: false, error: 'no imageUrl parsed from the RSS item for ' + newsId });

  var resp;
  try {
    resp = UrlFetchApp.fetch(imageUrl, { muteHttpExceptions: true, followRedirects: true });
  } catch (e) {
    return out({ ok: false, error: 'fetch threw: ' + e, imageUrl: imageUrl });
  }
  if (resp.getResponseCode() !== 200) {
    return out({ ok: false, error: 'source returned HTTP ' + resp.getResponseCode(), imageUrl: imageUrl });
  }
  var blob = resp.getBlob();
  var ct = (blob.getContentType() || '').toLowerCase();
  if (ct && ct.indexOf('image/') !== 0) {
    return out({ ok: false, error: 'source is not an image (content-type ' + ct + ')', imageUrl: imageUrl });
  }
  var ext = ct.indexOf('png') > -1 ? 'png' : (ct.indexOf('webp') > -1 ? 'webp' : 'jpg');
  try {
    var file = getNewsImageFolder_().createFile(blob.setName(newsId + '.' + ext));
    sheet.getRange(rowNum, fileIdx + 1).setValue(file.getId());
    cachedId = file.getId();
  } catch (e) {
    Logger.log('serveNewsImage_: Drive cache failed (%s) — serving bytes without caching', e);
  }
  return out({ ok: true, mime: ct || 'image/jpeg', filename: newsId + '.' + ext,
    cached: !!cachedId, data: Utilities.base64Encode(blob.getBytes()) });
}

/**
 * Trashes cached photos for news_queue rows older than NEWS_IMAGE_MAX_AGE_DAYS and clears their
 * imageFileId cell. Called at the end of fetchAndStore (hourly). Bounded work — only touches
 * rows that actually have a cached file id.
 */
function purgeOldNewsImages_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var fetchedIdx = HEADERS.indexOf('fetchedAt');
  var fileIdx = HEADERS.indexOf('imageFileId');
  var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var cutoff = Date.now() - NEWS_IMAGE_MAX_AGE_DAYS * 24 * 3600 * 1000;
  var purged = 0;
  for (var i = 0; i < data.length; i++) {
    var fid = data[i][fileIdx];
    if (!fid) continue;
    var fetchedAt = new Date(data[i][fetchedIdx]).getTime();
    if (isNaN(fetchedAt) || fetchedAt >= cutoff) continue;
    try { DriveApp.getFileById(fid).setTrashed(true); } catch (e) {}
    sheet.getRange(i + 2, fileIdx + 1).setValue('');
    purged++;
  }
  if (purged) Logger.log('purgeOldNewsImages_: trashed %s cached photo(s)', purged);
}

// ---- Construction-style rotation cursor --------------------------------------

function styleState_() {
  var cur = parseInt(PropertiesService.getScriptProperties().getProperty('STYLE_CURSOR'), 10);
  if (isNaN(cur)) cur = STYLE_CURSOR_SEED;
  var next = (cur + 1) % STYLE_ROTATION.length;
  return { ok: true, last_used_index: cur, last_used_style: STYLE_ROTATION[cur],
    next_index: next, next_style: STYLE_ROTATION[next], rotation: STYLE_ROTATION };
}

/**
 * Atomically hands out the next construction-style slot. POST {"action":"claim_style",
 * "video":"<slug>"} → {"ok":true,"index":N,"style":"N-name"}. LockService serialises concurrent
 * routine runs so they can't both grab the same slot. A claimed slot that never ships a video
 * (run aborts later) is simply skipped — acceptable, the rotation just advances one extra.
 */
function claimStyle_(videoSlug) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (e) {
    return { ok: false, error: 'could not acquire style lock (another run holds it) — retry shortly' };
  }
  try {
    var props = PropertiesService.getScriptProperties();
    var cur = parseInt(props.getProperty('STYLE_CURSOR'), 10);
    if (isNaN(cur)) cur = STYLE_CURSOR_SEED;
    var next = (cur + 1) % STYLE_ROTATION.length;
    props.setProperty('STYLE_CURSOR', String(next));
    var log = [];
    try { log = JSON.parse(props.getProperty('STYLE_CLAIM_LOG') || '[]'); } catch (e) {}
    log.push({ index: next, style: STYLE_ROTATION[next], video: videoSlug || '', at: new Date().toISOString() });
    props.setProperty('STYLE_CLAIM_LOG', JSON.stringify(log.slice(-20)));
    return { ok: true, index: next, style: STYLE_ROTATION[next], claimed_at: new Date().toISOString() };
  } finally {
    lock.releaseLock();
  }
}

// ---- HTTP API -------------------------------------------------------------

/**
 * GET ?category=business|general (omit for both)
 * Returns unused items published within MAX_AGE_HOURS_FOR_API, newest first.
 */
function doGet(e) {
  // GET ?image=<news id from the items list> — returns that item's lead photo as
  //   {"ok": true, "mime": "image/jpeg", "filename": "...", "data": "<base64>"}.
  // The photo is fetched server-side (from Google's IPs, which the news CDNs don't block) and
  // cached to Drive on first request. This is what the video routine calls for the Hook photo —
  // it never touches a news CDN directly, so the cloud sandbox's egress allowlist is irrelevant.
  // NOT an arbitrary-URL proxy: the parameter is an opaque 12-char row id that must already
  // exist in news_queue; the URL actually fetched is the one this script parsed from its own
  // hardcoded RSS feeds at ingest, never anything the caller supplies.
  if (e && e.parameter && e.parameter.image) {
    return serveNewsImage_(String(e.parameter.image));
  }
  // GET ?style_state — read-only peek at the construction-style rotation cursor (diagnostic).
  if (e && e.parameter && e.parameter.style_state) {
    return ContentService.createTextOutput(JSON.stringify(styleState_()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  var result = [];

  if (lastRow > 1) {
    var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    var cutoff = new Date(Date.now() - MAX_AGE_HOURS_FOR_API * 3600 * 1000);
    var categoryFilter = e && e.parameter && e.parameter.category;

    data.forEach(function (row) {
      var rec = {};
      HEADERS.forEach(function (h, i) { rec[h] = row[i]; });
      if (rec.used === true || rec.used === 'TRUE') return;
      if (new Date(rec.pubDate) < cutoff) return;
      if (categoryFilter && rec.category !== categoryFilter) return;
      // 'hasImage' tells the routine whether an article photo is available for this item
      // (fetch the bytes with GET ?image=<id>); imageFileId is an internal Drive id, not exposed.
      rec.hasImage = !!String(rec.imageUrl || '').trim();
      delete rec.imageFileId;
      result.push(rec);
    });

    result.sort(function (a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });
  }

  return ContentService.createTextOutput(JSON.stringify({ items: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST body EITHER:
 *   {"id": "<id from doGet>", "video": "<optional project folder name>"}
 *     — marks that news item used so later runs don't pick it again.
 * OR:
 *   {"action": "publish_facebook", "video_url": "<public mp4 URL>", "caption": "<text>",
 *    "thumbnail_url": "<public jpg/png URL>" (optional)}
 *     — publishes to Reels only (see fbPublish_ below — was Feed+Reels until
 *       2026-08-28, changed after Feed posts turned out to duplicate Reels).
 *       thumbnail_url, if given, is set as the Reel's cover via
 *       fbSetThumbnail_ (Facebook otherwise auto-picks its own frame, which
 *       can land on a near-black moment) — pass the same output/thumbnail.jpg
 *       used for YouTube/Instagram for a consistent cover.
 * OR:
 *   {"action": "publish_facebook_photo", "image_url": "<public jpg/png URL>", "caption": "<text>"}
 *     — publishes the image as a Page STORY only ("Tin" in the FB Vietnamese
 *       UI, expires ~24h). The channel's full content set per video is
 *       exactly 2 pieces: 1 Reel (video, via publish_facebook) + 1 Story
 *       (this action) — confirmed explicitly by the user 2026-08-28 after a
 *       brief detour where this also posted a permanent Feed photo (removed
 *       again). See fbPublishPhotoStory_ below; do not add a Feed photo call
 *       here without the user asking for a 3rd content type again.
 * OR:
 *   {"action": "publish_youtube", "video_url": "<public mp4 URL>", "title": "<text>",
 *    "description": "<text>", "thumbnail_url": "<public jpg/png URL>" (optional),
 *    "privacy": "public"|"unlisted"|"private" (optional, default "public")}
 *     — uploads the video to YouTube (Shorts, since our videos are 9:16 under
 *       60s) via OAuth2 refresh token (YOUTUBE_CLIENT_ID/SECRET/REFRESH_TOKEN
 *       Script Properties — a different Google account than the one running
 *       this script; see ytAccessToken_ below). Title is force-uppercased
 *       (user preference, 2026-08-28) — pass it any case, it comes out ALL
 *       CAPS on YouTube regardless. thumbnail_url, if given, is set as the
 *       video's custom thumbnail via a second API call after upload — if
 *       that call fails the video upload itself still counts as success (see
 *       result.thumbnail for its own separate status). Logs to posts_log
 *       automatically.
 * OR:
 *   {"action": "publish_instagram", "video_url": "<public mp4 URL>", "caption": "<text>",
 *    "thumbnail_url": "<public jpg/png URL>" (optional)}
 *     — publishes the video as an Instagram Reel on the Business/Creator
 *       account linked to the Facebook Page (see igPublishReel_ below).
 *       Reuses the same FB_PAGE_ACCESS_TOKEN as Facebook — no separate
 *       OAuth/consent step needed, but the System User must have
 *       instagram_basic + instagram_content_publish permission (see
 *       SETUP.md). Synchronous call — Instagram needs to process the video
 *       before it can publish, so this can take up to ~2.5 minutes.
 *       thumbnail_url, if given, is passed as the Reel's cover image
 *       (Instagram otherwise auto-picks its own frame, which can land on a
 *       near-black moment) — pass the same output/thumbnail.jpg used for
 *       Facebook/YouTube for a consistent cover.
 * OR:
 *   {"action": "publish_threads", "video_url": "<public mp4 URL>", "caption": "<text>"}
 *     — publishes the video to Threads (@bbhkinhteso) via the Threads API
 *       (separate product/App ID from Facebook/Instagram Graph API — see
 *       threadsPublishReel_ below). Uses THREADS_ACCESS_TOKEN/THREADS_USER_ID
 *       Script Properties (a long-lived, 60-day user token generated for the
 *       Threads Tester account via Meta's built-in User Token Generator —
 *       dev-mode, no App Review needed; must be regenerated roughly every 60
 *       days, see SETUP.md). Synchronous — Threads needs to process the video
 *       before it can publish, same async container flow as Instagram.
 *       NOTE: unlike Facebook/Instagram, the Threads API has NO cover/
 *       thumbnail parameter for video posts as of 2026-08-28 — Threads always
 *       auto-picks its own frame and there is currently no way to override
 *       it via API.
 * OR:
 *   {"action": "log_post", ...POSTS_HEADERS fields...}
 *     — appends one row directly to posts_log (for channels/backfill not
 *       covered by the actions above, e.g. TikTok, or a post made manually
 *       outside this script). See POSTS_HEADERS for fields.
 * OR:
 *   {"action": "claim_style", "video": "<slug>"}
 *     — atomically returns the next construction-style slot
 *       ({"ok":true,"index":N,"style":"N-name"}), serialised across concurrent
 *       routine runs by LockService. The routine calls this instead of reading
 *       videos/style-rotation-state.json. See claimStyle_ / STYLE_ROTATION.
 *   {"action": "style_state"} — read-only peek at the rotation cursor.
 *   {"action": "set_style_cursor", "index": N} — admin: force the cursor.
 *
 * (GET side: ?image=<newsId> returns that item's article photo as base64 JSON;
 *  ?style_state mirrors the style_state action.)
 *
 * publish_facebook, publish_facebook_photo, publish_youtube,
 * publish_instagram, and publish_threads log to posts_log automatically on
 * every attempt (success or failure) — no separate log_post call needed for
 * those.
 *
 * All 5 publish_* actions above also run an idempotency guard
 * (alreadyPublished_) before doing anything: if posts_log already has a
 * 'published' row for this exact channel + video (the "video" field in the
 * request body) + content type (reel/story/short), the call is refused with
 * {"ok": false, "error": "already published..."} instead of creating a real
 * duplicate post — added 2026-08-29 after a manual test call left a
 * duplicate Reel live on the Facebook Page. Pass {"force": true} in the
 * request body to bypass this and publish anyway (for a genuine deliberate
 * re-post).
 */
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'bad json' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_facebook') {
    if (!body.video_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!body.force) {
      var fbDup = alreadyPublished_('facebook', body.video || '', 'reel');
      if (fbDup) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: 'already published — skipping duplicate (pass {"force":true} to override)',
          existing: fbDup
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var publishResult = fbPublish_(body.video_url, body.caption || '', body.thumbnail_url || '');
    var videoProject = body.video || '';
    try {
      var reelOk = publishResult.reel && !publishResult.reel.error && publishResult.reel.code === 200;
      logPost_({
        channel: 'facebook', post_type: 'reel', video_project: videoProject,
        title: body.title || '', caption: body.caption || '',
        platform_post_id: (publishResult.reel && publishResult.reel.video_id) || '',
        permalink: '', status: reelOk ? 'published' : 'failed', posted_by: 'auto',
        notes: reelOk ? '' : JSON.stringify(publishResult.reel)
      });
    } catch (logErr) { Logger.log('logPost_ failed (publish_facebook): %s', logErr); }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: publishResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_facebook_photo') {
    if (!body.image_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'image_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!body.force) {
      var fbpDup = alreadyPublished_('facebook', body.video || '', 'story');
      if (fbpDup) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: 'already published — skipping duplicate (pass {"force":true} to override)',
          existing: fbpDup
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var photoProject = body.video || '';
    var photoResult;
    try { photoResult = fbPublishPhotoStory_(body.image_url); }
    catch (e2) { photoResult = { error: String(e2) }; }
    try {
      var storyOk = photoResult && !photoResult.error && photoResult.code === 200;
      var storyPostId = (photoResult.body && (photoResult.body.post_id || photoResult.body.id)) || '';
      logPost_({
        channel: 'facebook', post_type: 'story', video_project: photoProject,
        title: body.title || '', caption: body.caption || '',
        platform_post_id: storyPostId,
        permalink: storyPostId ? ('https://www.facebook.com/stories/' + storyPostId) : '',
        status: storyOk ? 'published' : 'failed', posted_by: 'auto',
        notes: (storyOk ? '' : JSON.stringify(photoResult) + ' ') + 'Story — expires ~24h, not permanent like Feed/Reels.'
      });
    } catch (logErr) { Logger.log('logPost_ failed (publish_facebook_photo): %s', logErr); }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: photoResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_youtube') {
    if (!body.video_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!body.force) {
      var ytDup = alreadyPublished_('youtube', body.video || '', 'short');
      if (ytDup) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: 'already published — skipping duplicate (pass {"force":true} to override)',
          existing: ytDup
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var ytProject = body.video || '';
    var ytResult;
    try {
      ytResult = ytPublishVideo_(
        body.video_url, body.title || '', body.description || '',
        body.privacy || 'public', body.thumbnail_url || ''
      );
    } catch (e3) { ytResult = { error: String(e3) }; }
    try {
      var ytOk = ytResult && !ytResult.error && ytResult.code === 200 && ytResult.body && ytResult.body.id;
      var ytId = (ytResult.body && ytResult.body.id) || '';
      logPost_({
        channel: 'youtube', post_type: 'short', video_project: ytProject,
        title: body.title || '', caption: body.description || '',
        platform_post_id: ytId,
        permalink: ytId ? ('https://youtube.com/shorts/' + ytId) : '',
        status: ytOk ? 'published' : 'failed', posted_by: 'auto',
        notes: ytOk ? '' : JSON.stringify(ytResult)
      });
    } catch (logErr) { Logger.log('logPost_ failed (publish_youtube): %s', logErr); }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: ytResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_instagram') {
    if (!body.video_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!body.force) {
      var igDup = alreadyPublished_('instagram', body.video || '', 'reel');
      if (igDup) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: 'already published — skipping duplicate (pass {"force":true} to override)',
          existing: igDup
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var igProject = body.video || '';
    var igResult;
    try { igResult = igPublishReel_(body.video_url, body.caption || '', body.thumbnail_url || ''); }
    catch (e4) { igResult = { error: String(e4) }; }
    try {
      var igOk = igResult && !igResult.error && igResult.phase === 'publish' && igResult.code === 200 && igResult.body && igResult.body.id;
      var igId = (igResult.body && igResult.body.id) || '';
      logPost_({
        channel: 'instagram', post_type: 'reel', video_project: igProject,
        title: body.title || '', caption: body.caption || '',
        platform_post_id: igId,
        permalink: igResult.permalink || '',
        status: igOk ? 'published' : 'failed', posted_by: 'auto',
        notes: igOk ? '' : JSON.stringify(igResult)
      });
    } catch (logErr) { Logger.log('logPost_ failed (publish_instagram): %s', logErr); }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: igResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_threads') {
    if (!body.video_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (!body.force) {
      var thDup = alreadyPublished_('threads', body.video || '', 'reel');
      if (thDup) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: 'already published — skipping duplicate (pass {"force":true} to override)',
          existing: thDup
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    var thProject = body.video || '';
    var thResult;
    try { thResult = threadsPublishReel_(body.video_url, body.caption || ''); }
    catch (e9) { thResult = { error: String(e9) }; }
    try {
      var thOk = thResult && !thResult.error && thResult.phase === 'publish' && thResult.code === 200 && thResult.body && thResult.body.id;
      var thId = (thResult.body && thResult.body.id) || '';
      logPost_({
        channel: 'threads', post_type: 'reel', video_project: thProject,
        title: body.title || '', caption: body.caption || '',
        platform_post_id: thId,
        permalink: thResult.permalink || '',
        status: thOk ? 'published' : 'failed', posted_by: 'auto',
        notes: thOk ? '' : JSON.stringify(thResult)
      });
    } catch (logErr) { Logger.log('logPost_ failed (publish_threads): %s', logErr); }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: thResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'list_fb_content') {
    // Read-only diagnostic — does NOT publish/delete anything. Lists the
    // Page's actual live videos + posts straight from the Graph API (added
    // 2026-08-29 to investigate a reported duplicate-posting issue — the
    // posts_log sheet's own 'deleted' status only reflects what was manually
    // corrected in the SHEET, not necessarily what still exists live on the
    // Page, so this cross-checks against the real source of truth).
    var lfcResult;
    try {
      var lfcToken = fbPageAccessToken_();
      var lfcPageId = fbPageId_();
      var lfcVideosUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + lfcPageId +
        '/videos?fields=id,title,description,created_time,length,permalink_url&limit=' + (body.limit || 25) +
        '&access_token=' + encodeURIComponent(lfcToken);
      var lfcVideosResp = UrlFetchApp.fetch(lfcVideosUrl, { muteHttpExceptions: true });
      var lfcPostsUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + lfcPageId +
        '/posts?fields=id,created_time,message,permalink_url,status_type&limit=' + (body.limit || 25) +
        '&access_token=' + encodeURIComponent(lfcToken);
      var lfcPostsResp = UrlFetchApp.fetch(lfcPostsUrl, { muteHttpExceptions: true });
      lfcResult = {
        ok: true,
        videos: safeJsonParse_(lfcVideosResp.getContentText()),
        posts: safeJsonParse_(lfcPostsResp.getContentText())
      };
    } catch (e10) { lfcResult = { ok: false, error: String(e10) }; }
    return ContentService.createTextOutput(JSON.stringify(lfcResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'fb_delete_content') {
    // Deletes ONE Facebook video/post by id via DELETE /{id} — added
    // 2026-08-29 to clean up a duplicate-posting incident (see SETUP.md).
    // Requires an explicit id; never bulk-deletes. Uses the same derived
    // Page token as every other publish call — no separate credential.
    if (!body.id) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'id required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var fdcResult;
    try {
      var fdcToken = fbPageAccessToken_();
      var fdcUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + body.id +
        '?access_token=' + encodeURIComponent(fdcToken);
      var fdcResp = UrlFetchApp.fetch(fdcUrl, { method: 'delete', muteHttpExceptions: true });
      fdcResult = { ok: true, code: fdcResp.getResponseCode(), body: safeJsonParse_(fdcResp.getContentText()) };
    } catch (e11) { fdcResult = { ok: false, error: String(e11) }; }
    return ContentService.createTextOutput(JSON.stringify(fdcResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'list_yt_content') {
    // Read-only diagnostic — does NOT publish/delete anything. Lists the
    // channel's actual live videos straight from the YouTube Data API
    // (search.list forMine=true) — added 2026-08-29 to find videos that
    // were uploaded manually (outside this script, so never logged in
    // posts_log) and are therefore invisible to refresh_metrics.
    var lycResult;
    try {
      var lycToken = ytAccessToken_();
      var lycUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true' +
        '&type=video&order=date&maxResults=' + (body.limit || 50);
      var lycResp = UrlFetchApp.fetch(lycUrl, {
        headers: { Authorization: 'Bearer ' + lycToken }, muteHttpExceptions: true
      });
      lycResult = { ok: true, data: safeJsonParse_(lycResp.getContentText()) };
    } catch (e11) { lycResult = { ok: false, error: String(e11) }; }
    return ContentService.createTextOutput(JSON.stringify(lycResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'yt_set_thumbnail') {
    // Utility — calls ytSetThumbnail_ directly against an already-live video
    // and returns the RAW result (code + body), unlike publish_youtube whose
    // doPost handler silently drops thumbnail-specific errors into an empty
    // 'notes' column whenever the video upload itself succeeded (added
    // 2026-09-02 to diagnose why 4 recent videos kept YouTube's own
    // auto-picked thumbnail instead of the branded one). Params:
    // {"video_id": "<id>", "thumbnail_url": "<public jpg url>"}.
    if (!body.video_id || !body.thumbnail_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_id and thumbnail_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ystResult;
    try {
      var ystToken = ytAccessToken_();
      ystResult = { ok: true, result: ytSetThumbnail_(body.video_id, body.thumbnail_url, ystToken) };
    } catch (e12) { ystResult = { ok: false, error: String(e12) }; }
    return ContentService.createTextOutput(JSON.stringify(ystResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'yt_set_thumbnail_b64') {
    // Same as yt_set_thumbnail but takes the image as inline base64 instead
    // of a public URL — added 2026-09-03 as a one-off recovery path (e.g.
    // restoring a thumbnail from an image that only exists client-side).
    // Params: {"video_id": "<id>", "image_base64": "<base64 bytes, no data:
    // URI prefix>", "mime_type": "image/jpeg" (optional, defaults to jpeg)}.
    if (!body.video_id || !body.image_base64) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'video_id and image_base64 required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ystbResult;
    try {
      var ystbToken = ytAccessToken_();
      var ystbBytes = Utilities.base64Decode(body.image_base64);
      var ystbBlob = Utilities.newBlob(ystbBytes, body.mime_type || 'image/jpeg', 'thumb.jpg');
      ystbResult = { ok: true, result: ytSetThumbnailFromBlob_(body.video_id, ystbBlob, ystbToken) };
    } catch (e12b) { ystbResult = { ok: false, error: String(e12b) }; }
    return ContentService.createTextOutput(JSON.stringify(ystbResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'refresh_metrics') {
    // Rebuilds the engagement_metrics sheet tab from posts_log — see
    // refreshEngagementMetrics() above. Read-only against every platform,
    // upserts (never appends duplicates) into engagement_metrics.
    var rmResult;
    try { rmResult = refreshEngagementMetrics(); }
    catch (e13) { rmResult = { ok: false, error: String(e13) }; }
    return ContentService.createTextOutput(JSON.stringify(rmResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'threads_delete_content') {
    // Deletes ONE Threads post by id via DELETE /{id} — added 2026-08-29
    // alongside fb_delete_content, same cleanup-utility pattern. Requires an
    // explicit id; never bulk-deletes. Uses THREADS_ACCESS_TOKEN.
    if (!body.id) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'id required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var tdcResult;
    try {
      var tdcToken = threadsAccessToken_();
      var tdcUrl = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + body.id +
        '?access_token=' + encodeURIComponent(tdcToken);
      var tdcResp = UrlFetchApp.fetch(tdcUrl, { method: 'delete', muteHttpExceptions: true });
      tdcResult = { ok: true, code: tdcResp.getResponseCode(), body: safeJsonParse_(tdcResp.getContentText()) };
    } catch (e12) { tdcResult = { ok: false, error: String(e12) }; }
    return ContentService.createTextOutput(JSON.stringify(tdcResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'check_instagram') {
    // Read-only diagnostic — does NOT publish anything. Confirms whether the
    // Facebook Page token can currently see a linked Instagram Business
    // Account (added 2026-08-28 while debugging the initial "no linked
    // Instagram Business Account" error before the IG account had been
    // converted to Business/Creator).
    var igCheckResult;
    try { igCheckResult = { ok: true, instagram_business_account_id: igBusinessAccountId_() }; }
    catch (e6) { igCheckResult = { ok: false, error: String(e6) }; }
    return ContentService.createTextOutput(JSON.stringify(igCheckResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'list_posts') {
    // Read-only diagnostic — does NOT publish anything. Returns the last N
    // rows of posts_log as JSON (default 20, optional {"limit": N,
    // "channel": "facebook"} filter) — added 2026-08-28 to look up
    // video_project/posted_at for existing posts without having to eyeball
    // the raw Sheet (columns get visually truncated there for long values).
    try {
      var lpSheet = getPostsSheet_();
      var lpLastRow = lpSheet.getLastRow();
      var lpRows = [];
      if (lpLastRow > 1) {
        var lpData = lpSheet.getRange(2, 1, lpLastRow - 1, POSTS_HEADERS.length).getValues();
        lpData.forEach(function (row) {
          var rec = {};
          POSTS_HEADERS.forEach(function (h, i) { rec[h] = row[i]; });
          if (body.channel && rec.channel !== body.channel) return;
          lpRows.push(rec);
        });
      }
      var lpLimit = body.limit || 20;
      lpRows = lpRows.slice(-lpLimit);
      return ContentService.createTextOutput(JSON.stringify({ ok: true, rows: lpRows }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (e7) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(e7) }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (body.action === 'claim_style') {
    // Atomic construction-style slot handout — see claimStyle_ / STYLE_ROTATION above.
    return ContentService.createTextOutput(JSON.stringify(claimStyle_(body.video || '')))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'style_state') {
    return ContentService.createTextOutput(JSON.stringify(styleState_()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'set_style_cursor') {
    // Admin recovery: force the rotation cursor to a specific last-used index.
    // {"action":"set_style_cursor","index":N}
    var sci = parseInt(body.index, 10);
    if (isNaN(sci) || sci < 0 || sci >= STYLE_ROTATION.length) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'index must be 0..' + (STYLE_ROTATION.length - 1) }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    PropertiesService.getScriptProperties().setProperty('STYLE_CURSOR', String(sci));
    return ContentService.createTextOutput(JSON.stringify(styleState_()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'get_sheet_url') {
    var props0 = PropertiesService.getScriptProperties();
    var ssId0 = props0.getProperty('SPREADSHEET_ID');
    var url0 = ssId0 ? SpreadsheetApp.openById(ssId0).getUrl() : '';
    return ContentService.createTextOutput(JSON.stringify({ ok: true, url: url0 }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'log_post') {
    try {
      logPost_(body);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (logErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(logErr) }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1 && body.id) {
    var idCol = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < idCol.length; i++) {
      if (idCol[i][0] === body.id) {
        var rowIndex = i + 2;
        sheet.getRange(rowIndex, HEADERS.indexOf('used') + 1).setValue(true);
        sheet.getRange(rowIndex, HEADERS.indexOf('usedAt') + 1).setValue(new Date().toISOString());
        if (body.video) sheet.getRange(rowIndex, HEADERS.indexOf('usedByVideo') + 1).setValue(body.video);
        return ContentService.createTextOutput(JSON.stringify({ ok: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'id not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Facebook publish (Feed + Reels) ---------------------------------------
//
// Reads FB_PAGE_ACCESS_TOKEN + FB_PAGE_ID from Script Properties (Project
// Settings → Script Properties in the Apps Script editor) — never hard-coded
// here, never committed to the repo. Page token must be a long-lived/System
// User token with at least: pages_manage_posts, pages_read_engagement,
// pages_show_list. See ../../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md for the
// full setup checklist and the reasoning behind this design (token isolated
// in Apps Script, separate from the Claude cloud environment's own secrets).

var FB_GRAPH_VERSION = 'v20.0';

// FB_PAGE_ACCESS_TOKEN holds a SYSTEM USER token (never-expiring, from Business
// Manager). Facebook's content-publishing endpoints (/videos, /video_reels)
// reject a System User token used directly even when it has pages_manage_posts
// and the System User has Full Control on the Page — confirmed via live testing
// 2026-08-27 (error #100 "No permission to publish the video" / #200 "does not
// have permission to post videos on this target"). The fix: derive the actual
// PAGE token via GET /{page-id}?fields=access_token using the System User
// token, then use THAT page token for the actual publish call. Page tokens
// derived this way inherit the System User token's never-expiring property.
function fbSystemUserToken_() {
  return PropertiesService.getScriptProperties().getProperty('FB_PAGE_ACCESS_TOKEN');
}
function fbPageId_() {
  return PropertiesService.getScriptProperties().getProperty('FB_PAGE_ID');
}
function fbPageAccessToken_() {
  var pageId = fbPageId_();
  var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId +
    '?fields=access_token&access_token=' + encodeURIComponent(fbSystemUserToken_());
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = safeJsonParse_(resp.getContentText());
  if (!data || !data.access_token) {
    throw new Error('Could not derive Page access token: ' + resp.getContentText());
  }
  return data.access_token;
}

/**
 * Publishes a video to the Page's regular Feed via `file_url` — Facebook
 * fetches the video server-side from the given public URL (our GitHub raw
 * URL), so Apps Script never has to buffer the video bytes for this one.
 *
 * NOT CALLED by fbPublish_ as of 2026-08-28: confirmed via live testing that
 * Facebook auto-converts any vertical (9:16) video uploaded through this
 * endpoint into Reel format anyway (permalink comes back as `/reel/...`,
 * identical in every way to a post made through fbPublishReel_). Calling
 * BOTH this and fbPublishReel_ for the same video therefore posted the exact
 * same content twice — two visually identical Reels with the same caption —
 * which is what the "duplicate posts" report on 2026-08-28 turned out to be.
 * Fix: fbPublish_ now calls fbPublishReel_ only. Left this function defined
 * (unused) in case a future need for a true non-Reel Feed video post arises
 * — don't wire it back into fbPublish_ without re-verifying Facebook's
 * current behavior first, since a duplicate-post regression is easy to
 * reintroduce here.
 */
function fbPublishFeed_(videoUrl, caption) {
  var token = fbPageAccessToken_();
  var pageId = fbPageId_();
  var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId + '/videos';
  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { file_url: videoUrl, description: caption, access_token: token }
  });
  return { code: resp.getResponseCode(), body: safeJsonParse_(resp.getContentText()) };
}

/**
 * Publishes a video as a Facebook Reel. Reels do NOT support the simple
 * file_url shortcut — they require the resumable start → upload bytes →
 * finish flow (Meta's Video Reels Publishing API).
 *
 * `coverUrl`, if given, is set as the video's cover/thumbnail via
 * fbSetThumbnail_ after a successful finish — Facebook otherwise
 * auto-selects a frame from the video itself, which can land on a
 * near-black moment (same class of issue hit on Instagram, 2026-08-28; the
 * Facebook Reels tab showed several thumbnails that were solid black). Its
 * result is attached as `.thumbnail` without affecting the overall success
 * of the video publish itself.
 */
function fbPublishReel_(videoUrl, caption, coverUrl) {
  var token = fbPageAccessToken_();
  var pageId = fbPageId_();
  var base = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId + '/video_reels';

  var startResp = UrlFetchApp.fetch(base, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { upload_phase: 'start', access_token: token }
  });
  var startData = safeJsonParse_(startResp.getContentText());
  if (!startData || !startData.video_id || !startData.upload_url) {
    return { phase: 'start', code: startResp.getResponseCode(), body: startData };
  }

  var videoBytes = UrlFetchApp.fetch(videoUrl, { muteHttpExceptions: true }).getBlob().getBytes();
  var uploadResp = UrlFetchApp.fetch(startData.upload_url, {
    method: 'post',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'OAuth ' + token,
      offset: '0',
      file_size: String(videoBytes.length)
    },
    contentType: 'application/octet-stream',
    payload: videoBytes
  });
  if (uploadResp.getResponseCode() !== 200) {
    return { phase: 'upload', code: uploadResp.getResponseCode(), body: uploadResp.getContentText() };
  }

  var finishResp = UrlFetchApp.fetch(base, {
    method: 'post',
    muteHttpExceptions: true,
    payload: {
      upload_phase: 'finish',
      video_id: startData.video_id,
      video_state: 'PUBLISHED',
      description: caption,
      access_token: token
    }
  });
  var result = {
    phase: 'finish',
    code: finishResp.getResponseCode(),
    body: safeJsonParse_(finishResp.getContentText()),
    video_id: startData.video_id
  };

  if (coverUrl && result.code === 200) {
    try { result.thumbnail = fbSetThumbnail_(startData.video_id, coverUrl, token); }
    catch (e) { result.thumbnail = { error: String(e) }; }
  }

  return result;
}

/**
 * Sets a video's (Reel's) cover/thumbnail via POST /{video-id}/thumbnails —
 * a plain multipart upload (`source` = the image bytes, `is_preferred=true`
 * so it's actually shown instead of just added to the candidate list).
 * UrlFetchApp auto-encodes the payload as multipart/form-data because one of
 * the values is a Blob, same trick used elsewhere in this file for other
 * multipart calls. See https://developers.facebook.com/docs/graph-api/reference/video-thumbnail/.
 */
function fbSetThumbnail_(videoId, coverUrl, token) {
  var imageBlob = UrlFetchApp.fetch(coverUrl, { muteHttpExceptions: true }).getBlob();
  var resp = UrlFetchApp.fetch(
    'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + videoId + '/thumbnails',
    {
      method: 'post',
      muteHttpExceptions: true,
      payload: { source: imageBlob, is_preferred: 'true', access_token: token }
    }
  );
  return { code: resp.getResponseCode(), body: safeJsonParse_(resp.getContentText()) };
}

/**
 * Publishes a regular photo+caption post to the Page's Feed — a normal,
 * permanent status-style post (NOT the "Tin"/Story — see fbPublishPhotoStory_
 * for that). Uses POST /{page-id}/photos published normally (no
 * `published:false`), same pattern as fbPublishFeed_/fbPublishReel_ for video.
 *
 * NOT CALLED as of 2026-08-28 (later same day): briefly wired into
 * fbPublishPhotoBoth_ so publish_facebook_photo posted both this AND a
 * Story, but the user clarified the channel's content set per video is
 * exactly 2 pieces — 1 Reel + 1 Story — not 3. Reverted; publish_facebook_photo
 * now calls fbPublishPhotoStory_ directly. Left defined (unused) in case a
 * real need for a permanent Feed photo post comes up later — don't wire it
 * back in without the user explicitly asking for it again.
 */
function fbPublishPhotoFeed_(imageUrl, caption) {
  var token = fbPageAccessToken_();
  var pageId = fbPageId_();
  var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId + '/photos';
  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { url: imageUrl, caption: caption, access_token: token }
  });
  return { code: resp.getResponseCode(), body: safeJsonParse_(resp.getContentText()) };
}

/**
 * Publishes an image as a Facebook Page STORY ("Tin" in the Vietnamese
 * Facebook UI — Trang > Tin — genuinely different from a Feed post, see
 * fbPublishPhotoFeed_). Two-step Stories API:
 *   1. Upload the image UNPUBLISHED: POST /{page-id}/photos with
 *      published=false — returns a photo id that isn't on the Feed/Timeline
 *      at all, just staged.
 *   2. POST /{page-id}/photo_stories with that photo_id — attaches it to the
 *      Page's Story tray ("Tin"), separate from Feed/Reels/Photos tabs.
 * Note: Stories expire after ~24h (Facebook's own behavior, not something
 * this script controls) — unlike Feed/Reels posts, which are permanent. No
 * `caption` param — the Stories API has no text-caption field, which is fine
 * here since the source image (the video's thumbnail) already has the
 * headline/source baked in visually.
 */
function fbPublishPhotoStory_(imageUrl) {
  var token = fbPageAccessToken_();
  var pageId = fbPageId_();

  var uploadUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId + '/photos';
  var uploadResp = UrlFetchApp.fetch(uploadUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { url: imageUrl, published: 'false', access_token: token }
  });
  var uploadData = safeJsonParse_(uploadResp.getContentText());
  if (!uploadData || !uploadData.id) {
    return { phase: 'upload', code: uploadResp.getResponseCode(), body: uploadData };
  }

  var storyUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId + '/photo_stories';
  var storyResp = UrlFetchApp.fetch(storyUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { photo_id: uploadData.id, access_token: token }
  });
  return {
    phase: 'publish',
    code: storyResp.getResponseCode(),
    body: safeJsonParse_(storyResp.getContentText()),
    photo_id: uploadData.id
  };
}

/**
 * NOT CALLED as of 2026-08-28 — see note on fbPublishPhotoFeed_ above. Left
 * defined in case a genuine need for Feed+Story-in-parallel returns.
 */
function fbPublishPhotoBoth_(imageUrl, caption) {
  var feed, story;
  try { feed = fbPublishPhotoFeed_(imageUrl, caption); } catch (e) { feed = { error: String(e) }; }
  try { story = fbPublishPhotoStory_(imageUrl); } catch (e) { story = { error: String(e) }; }
  return { feed: feed, story: story };
}

function safeJsonParse_(text) {
  try { return JSON.parse(text); } catch (e) { return { parseError: String(e), raw: text }; }
}

/**
 * Publishes the video via Reels only — see note above fbPublishFeed_. Kept as
 * a thin wrapper (rather than calling fbPublishReel_ directly from doPost) so
 * the return shape (`{reel: ...}`) and error handling stay in one place.
 */
function fbPublish_(videoUrl, caption, coverUrl) {
  var reel;
  try { reel = fbPublishReel_(videoUrl, caption, coverUrl); } catch (e) { reel = { error: String(e) }; }
  return { reel: reel };
}

// ---- Instagram publish (Reels) -----------------------------------------------
//
// Reuses the same Facebook Page token (fbPageAccessToken_) — no separate
// OAuth/consent step. The Instagram account must be a Business/Creator
// account linked to the Facebook Page (Settings → Linked accounts), and the
// System User behind FB_PAGE_ACCESS_TOKEN must have instagram_basic +
// instagram_content_publish permission on that Page's assets in Business
// Manager (added 2026-08-28 alongside the Page permissions — see SETUP.md).

/**
 * Looks up the Instagram Business Account ID linked to the Facebook Page.
 * Not cached in Script Properties — this is a cheap GET and the link could
 * change if the user re-links a different Instagram account later.
 */
function igBusinessAccountId_() {
  var token = fbPageAccessToken_();
  var pageId = fbPageId_();
  var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + pageId +
    '?fields=instagram_business_account&access_token=' + encodeURIComponent(token);
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = safeJsonParse_(resp.getContentText());
  if (!data || !data.instagram_business_account || !data.instagram_business_account.id) {
    throw new Error('No linked Instagram Business Account found on this Page: ' + resp.getContentText());
  }
  return data.instagram_business_account.id;
}

/**
 * Publishes a video to Instagram as a Reel via the Content Publishing API —
 * a 3-step flow (unlike Facebook's Reels API, this ALWAYS needs the poll
 * step; Instagram fetches+processes the video async from video_url before it
 * can be published):
 *   1. POST /{ig-user-id}/media  (video_url, caption, media_type=REELS,
 *      cover_url) → returns a creation_id (container), not yet live.
 *   2. Poll GET /{creation-id}?fields=status_code until FINISHED — Instagram
 *      is still downloading/transcoding the video server-side. Capped at 30
 *      attempts * 5s = 150s; well inside the Apps Script web app time limit.
 *   3. POST /{ig-user-id}/media_publish (creation_id) → goes live.
 * If step 2 never reaches FINISHED (still IN_PROGRESS after the cap, or
 * ERROR), step 3 is skipped and the container's last known status is
 * returned instead — treat as failed, do not retry publish with a stale id.
 *
 * `coverUrl`, if given, is passed as `cover_url` so Instagram uses that exact
 * image as the Reel's cover/thumbnail instead of auto-picking its own frame
 * (which was landing on a near-black moment — reported 2026-08-28). Pass the
 * same output/thumbnail.jpg already used for Facebook/YouTube (extracted at
 * t≈3.5s, after the Hook animation settles) for a consistent cover across
 * every channel.
 */
function igPublishReel_(videoUrl, caption, coverUrl) {
  var token = fbPageAccessToken_();
  var igUserId = igBusinessAccountId_();

  var createPayload = { video_url: videoUrl, caption: caption, media_type: 'REELS', access_token: token };
  if (coverUrl) createPayload.cover_url = coverUrl;

  var createUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + igUserId + '/media';
  var createResp = UrlFetchApp.fetch(createUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: createPayload
  });
  var createData = safeJsonParse_(createResp.getContentText());
  if (!createData || !createData.id) {
    return { phase: 'create', code: createResp.getResponseCode(), body: createData };
  }
  var creationId = createData.id;

  var statusUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + creationId +
    '?fields=status_code&access_token=' + encodeURIComponent(token);
  var statusCode = 'IN_PROGRESS';
  var attempts = 0;
  while (statusCode === 'IN_PROGRESS' && attempts < 30) {
    Utilities.sleep(5000);
    var statusResp = UrlFetchApp.fetch(statusUrl, { muteHttpExceptions: true });
    var statusData = safeJsonParse_(statusResp.getContentText());
    statusCode = statusData && statusData.status_code;
    attempts++;
  }
  if (statusCode !== 'FINISHED') {
    return { phase: 'process', code: 200, body: { status_code: statusCode }, creation_id: creationId };
  }

  var publishUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + igUserId + '/media_publish';
  var publishResp = UrlFetchApp.fetch(publishUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { creation_id: creationId, access_token: token }
  });
  var publishData = safeJsonParse_(publishResp.getContentText());

  // The id returned by media_publish is NOT the shortcode used in instagram.com
  // URLs — fetch the real permalink separately (best-effort; publish itself
  // already succeeded above regardless of whether this lookup works).
  var permalink = '';
  if (publishData && publishData.id) {
    try {
      var permUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + publishData.id +
        '?fields=permalink&access_token=' + encodeURIComponent(token);
      var permResp = UrlFetchApp.fetch(permUrl, { muteHttpExceptions: true });
      var permData = safeJsonParse_(permResp.getContentText());
      permalink = (permData && permData.permalink) || '';
    } catch (e5) { /* best-effort only */ }
  }

  return {
    phase: 'publish',
    code: publishResp.getResponseCode(),
    body: publishData,
    creation_id: creationId,
    permalink: permalink
  };
}

// ---- Threads publish -----------------------------------------------------
//
// Reads THREADS_ACCESS_TOKEN + THREADS_USER_ID from Script Properties. The
// Threads API is a separate Meta product (its own App ID/Secret, under the
// same "Retain Agency AI" app as Facebook/Instagram) — added 2026-08-28.
// Token is a long-lived (~60-day) user access token generated directly via
// the Threads API's built-in "User Token Generator" tool for the Threads
// Tester account @bbhkinhteso (dev-mode; no App Review needed since the
// target account is a registered tester, not a public user). It does NOT
// auto-refresh — regenerate via the same tool and update THREADS_ACCESS_TOKEN
// roughly every 60 days (see SETUP.md). THREADS_APP_ID/THREADS_APP_SECRET are
// stored for that future maintenance step but are not needed for ordinary
// publish calls.

var THREADS_GRAPH_VERSION = 'v1.0';

function threadsAccessToken_() {
  return PropertiesService.getScriptProperties().getProperty('THREADS_ACCESS_TOKEN');
}
function threadsUserId_() {
  return PropertiesService.getScriptProperties().getProperty('THREADS_USER_ID');
}

/**
 * Publishes a video to Threads — same 3-step async container flow as
 * Instagram Reels (igPublishReel_ above):
 *   1. POST /{threads-user-id}/threads (media_type=VIDEO, video_url, text)
 *      → returns a creation id (container), not yet live.
 *   2. Poll GET /{creation-id}?fields=status,error_message until FINISHED —
 *      Threads is still downloading/transcoding the video server-side.
 *      Capped at 30 attempts * 5s = 150s.
 *   3. POST /{threads-user-id}/threads_publish (creation_id) → goes live.
 * No cover/thumbnail parameter exists for Threads video posts as of
 * 2026-08-28 — Threads always auto-picks its own cover frame.
 */
function threadsPublishReel_(videoUrl, caption) {
  var token = threadsAccessToken_();
  var userId = threadsUserId_();

  var createUrl = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + userId + '/threads';
  var createResp = UrlFetchApp.fetch(createUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { media_type: 'VIDEO', video_url: videoUrl, text: caption, access_token: token }
  });
  var createData = safeJsonParse_(createResp.getContentText());
  if (!createData || !createData.id) {
    return { phase: 'create', code: createResp.getResponseCode(), body: createData };
  }
  var creationId = createData.id;

  var statusUrl = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + creationId +
    '?fields=status,error_message&access_token=' + encodeURIComponent(token);
  var status = 'IN_PROGRESS';
  var attempts = 0;
  while (status === 'IN_PROGRESS' && attempts < 30) {
    Utilities.sleep(5000);
    var statusResp = UrlFetchApp.fetch(statusUrl, { muteHttpExceptions: true });
    var statusData = safeJsonParse_(statusResp.getContentText());
    status = statusData && statusData.status;
    attempts++;
  }
  if (status !== 'FINISHED') {
    return { phase: 'process', code: 200, body: { status: status }, creation_id: creationId };
  }

  var publishUrl = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + userId + '/threads_publish';
  var publishResp = UrlFetchApp.fetch(publishUrl, {
    method: 'post',
    muteHttpExceptions: true,
    payload: { creation_id: creationId, access_token: token }
  });
  var publishData = safeJsonParse_(publishResp.getContentText());

  // permalink lookup is best-effort — publish itself already succeeded above
  // regardless of whether this works.
  var permalink = '';
  if (publishData && publishData.id) {
    try {
      var permUrl = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + publishData.id +
        '?fields=permalink&access_token=' + encodeURIComponent(token);
      var permResp = UrlFetchApp.fetch(permUrl, { muteHttpExceptions: true });
      var permData = safeJsonParse_(permResp.getContentText());
      permalink = (permData && permData.permalink) || '';
    } catch (e8) { /* best-effort only */ }
  }

  return {
    phase: 'publish',
    code: publishResp.getResponseCode(),
    body: publishData,
    creation_id: creationId,
    permalink: permalink
  };
}

// ---- YouTube publish (Shorts) -----------------------------------------------
//
// Reads YOUTUBE_CLIENT_ID + YOUTUBE_CLIENT_SECRET + YOUTUBE_REFRESH_TOKEN from
// Script Properties. Unlike Facebook's Page token, the YouTube channel here is
// on a DIFFERENT Google account than the one this Apps Script project runs
// under, so we can't use the script's own implicit identity (ScriptApp.get
// OAuthToken()) — instead this is a standalone OAuth2 refresh-token flow set
// up manually via Google Cloud Console + OAuth Playground on 2026-08-28:
//   1. OAuth Client (ID+secret) created under a Cloud project — can be ANY
//      Google account with Cloud project-creation rights, doesn't need to be
//      the channel's own account (only the consent step below does).
//   2. Consent granted via OAuth Playground, logged in AS the channel's
//      Google account, scope https://www.googleapis.com/auth/youtube.upload
//      → yields a refresh token that's tied to that channel's account
//      regardless of which account owns the OAuth Client.
// The refresh token here does not expire on its own (until revoked), so this
// mints a fresh access token on every call, same pattern as fbPageAccessToken_.

function ytAccessToken_() {
  var props = PropertiesService.getScriptProperties();
  var resp = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    muteHttpExceptions: true,
    payload: {
      client_id: props.getProperty('YOUTUBE_CLIENT_ID'),
      client_secret: props.getProperty('YOUTUBE_CLIENT_SECRET'),
      refresh_token: props.getProperty('YOUTUBE_REFRESH_TOKEN'),
      grant_type: 'refresh_token'
    }
  });
  var data = safeJsonParse_(resp.getContentText());
  if (!data || !data.access_token) {
    throw new Error('Could not refresh YouTube access token: ' + resp.getContentText());
  }
  return data.access_token;
}

/**
 * Uploads a video to YouTube via a hand-built multipart/related request
 * (metadata JSON + video bytes in one call) — Apps Script's UrlFetchApp
 * doesn't have native multipart/related support, so the body is assembled
 * manually with a boundary string, same general approach as any other
 * language's raw HTTP client would need for this endpoint.
 * `privacy` defaults to 'public'; pass 'private' or 'unlisted' for testing
 * before a video is meant to go live to real subscribers.
 * categoryId 25 = News & Politics (fits this channel's content).
 * `title` is force-uppercased here (String.toUpperCase() handles Vietnamese
 * diacritics correctly) — user preference 2026-08-28, applies regardless of
 * what case the caller sends.
 * `thumbnailUrl`, if given, is set via ytSetThumbnail_ after a successful
 * upload; its result is attached as `.thumbnail` without affecting the
 * overall success of the video upload itself. The set is RETRIED with a
 * growing delay (2026-09-04): a thumbnail set fired the instant videos.insert
 * returns often 4xx's or gets discarded because the video is still processing
 * — the CPI + VN-Index videos both ended up showing a YouTube auto-picked
 * mid-frame despite the routine reporting success. Retrying over ~3 min lets
 * processing settle. A later manual {"action":"yt_set_thumbnail"} still works
 * as a fallback if all retries fail.
 */
function ytPublishVideo_(videoUrl, title, description, privacy, thumbnailUrl) {
  var token = ytAccessToken_();
  var videoBlob = UrlFetchApp.fetch(videoUrl, { muteHttpExceptions: true }).getBlob();

  var metadata = {
    snippet: { title: (title || '').toUpperCase(), description: description, categoryId: '25' },
    status: { privacyStatus: privacy || 'public', selfDeclaredMadeForKids: false }
  };

  var boundary = 'bbh_yt_upload_boundary_' + new Date().getTime();
  var delimiter = '\r\n--' + boundary + '\r\n';
  var closeDelim = '\r\n--' + boundary + '--';

  var metadataPart = Utilities.newBlob(
    delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata)
  ).getBytes();
  var videoPartHeader = Utilities.newBlob(
    delimiter + 'Content-Type: ' + (videoBlob.getContentType() || 'video/mp4') + '\r\n\r\n'
  ).getBytes();
  var closePart = Utilities.newBlob(closeDelim).getBytes();

  var bodyBytes = metadataPart.concat(videoPartHeader).concat(videoBlob.getBytes()).concat(closePart);

  var resp = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
    {
      method: 'post',
      contentType: 'multipart/related; boundary="' + boundary + '"',
      headers: { Authorization: 'Bearer ' + token },
      payload: Utilities.newBlob(bodyBytes),
      muteHttpExceptions: true
    }
  );
  var result = { code: resp.getResponseCode(), body: safeJsonParse_(resp.getContentText()) };

  if (thumbnailUrl && result.code === 200 && result.body && result.body.id) {
    var thumbBlob;
    try { thumbBlob = UrlFetchApp.fetch(thumbnailUrl, { muteHttpExceptions: true }).getBlob(); }
    catch (e) { thumbBlob = null; }
    var attempts = [];
    // First try immediately, then wait 25/45/60s before the next tries — a thumbnail set right
    // after upload frequently fails or gets dropped while the video is still processing. Total
    // sleep ~130s keeps the whole doPost well under Apps Script's 6-minute execution limit.
    var waits = [0, 25000, 45000, 60000];
    for (var t = 0; t < waits.length; t++) {
      if (waits[t]) Utilities.sleep(waits[t]);
      var tr;
      try {
        tr = thumbBlob ? ytSetThumbnailFromBlob_(result.body.id, thumbBlob, token)
                       : ytSetThumbnail_(result.body.id, thumbnailUrl, token);
      } catch (e) { tr = { error: String(e) }; }
      attempts.push(tr);
      result.thumbnail = tr;
      if (tr && tr.code === 200) break;
    }
    result.thumbnail_attempts = attempts.length;
  }

  return result;
}

/**
 * Sets a video's custom thumbnail via POST /upload/youtube/v3/thumbnails/set
 * — a plain media upload (just the image bytes, no metadata/multipart
 * needed), separate call from the video insert above. Covered by the same
 * youtube.upload scope already granted, no extra OAuth consent needed.
 */
function ytSetThumbnail_(videoId, thumbnailUrl, token) {
  var imageBlob = UrlFetchApp.fetch(thumbnailUrl, { muteHttpExceptions: true }).getBlob();
  return ytSetThumbnailFromBlob_(videoId, imageBlob, token);
}

/**
 * Same as ytSetThumbnail_ but takes an already-in-hand Blob instead of
 * fetching one from a public URL — used by the yt_set_thumbnail_b64 doPost
 * action (2026-09-03) to restore/set a thumbnail from raw image bytes sent
 * directly in the request body, for the rare case where the source image
 * only exists client-side and isn't reachable at a public URL.
 */
function ytSetThumbnailFromBlob_(videoId, imageBlob, token) {
  var resp = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=' + encodeURIComponent(videoId),
    {
      method: 'post',
      contentType: imageBlob.getContentType() || 'image/jpeg',
      headers: { Authorization: 'Bearer ' + token },
      payload: imageBlob,
      muteHttpExceptions: true
    }
  );
  return { code: resp.getResponseCode(), body: safeJsonParse_(resp.getContentText()) };
}

// ---- Engagement metrics tracker --------------------------------------------
//
// Separate sheet tab ("engagement_metrics") tracking views/likes/comments/
// shares per published video across all 4 channels — added 2026-08-29.
// Refreshed on demand via {"action":"refresh_metrics"} (doPost), or
// automatically once installDailyMetricsTrigger() has been run once. One row
// per (channel, video_project) — only the primary video post_type per
// channel is tracked (facebook: 'reel', youtube: 'short', instagram: 'reel',
// threads: 'reel') since Stories/photo companion posts expire after 24h and
// aren't comparable video metrics anyway. Each platform call is wrapped in
// its own try/catch so one platform's API/permission hiccup never blocks the
// others — a metric that couldn't be fetched is left blank with the raw
// error noted in the 'notes' column instead of aborting the whole refresh
// (e.g. views/shares need extra insights permissions — pages_read_engagement
// + read_insights for Facebook, instagram_manage_insights for Instagram,
// threads_manage_insights for Threads — that may not be granted yet; likes/
// comments use more basic fields and are more likely to work regardless).

var ENGAGEMENT_SHEET_NAME = 'engagement_metrics';
// channel is column A on purpose — rows are grouped by channel (see the sort
// in refreshEngagementMetrics), so keeping it first makes that grouping
// visually obvious when the sheet is opened.
var ENGAGEMENT_HEADERS = [
  'channel', 'video_project', 'post_type', 'platform_post_id', 'permalink',
  'title', 'posted_at', 'posted_date', 'posted_time',
  'views', 'likes', 'reactions', 'comments', 'shares',
  'last_checked', 'notes'
];
// Vietnamese display labels for row 1 — same order/length as ENGAGEMENT_HEADERS (index i here
// labels column i there). Internal code always keys off ENGAGEMENT_HEADERS (English, stable);
// this array only ever touches what a human/Looker Studio sees in the header row. Added
// 2026-09-05 at user request — sentence case (first letter only), Vietnamese except loanwords
// ("video") / acronyms ("UTC") that read fine as-is.
var ENGAGEMENT_HEADER_LABELS = [
  'Kênh', 'Dự án video', 'Loại bài đăng', 'Mã bài đăng', 'Liên kết bài đăng',
  'Tiêu đề', 'Thời gian đăng (UTC)', 'Ngày đăng', 'Giờ đăng',
  'Lượt xem', 'Lượt thích', 'Cảm xúc', 'Bình luận', 'Lượt chia sẻ',
  'Lần kiểm tra cuối', 'Ghi chú'
];
// views/likes/reactions/comments/shares are always numeric in the sheet —
// a metric that couldn't be fetched (permission gap, deleted post, etc.)
// shows as 0 rather than a blank cell (the 'notes' column still records why).
var ENGAGEMENT_NUMERIC_FIELDS = ['views', 'likes', 'reactions', 'comments', 'shares'];
function numOrZero_(v) { return (v === '' || v === undefined || v === null) ? 0 : v; }

// Capitalized display name written into the sheet's channel column — the
// lowercase form (posts_log's own convention) is used everywhere else
// (candidate matching, token selection) and only swapped to this at the
// point of writing a row.
var CHANNEL_DISPLAY_NAMES = {
  facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', threads: 'Threads'
};
// Fixed group order the sheet is sorted into — every row for one channel
// sits together instead of interleaved by posting time.
var CHANNEL_SORT_ORDER = ['facebook', 'instagram', 'youtube', 'threads'];

// Which post_type(s) per channel count as "the video" for metrics — keeps
// the sheet to one row per channel per video instead of also tracking
// Stories/photo companion posts. Facebook accepts more than just 'reel':
// 'video_feed'/'video' are older post types from before the channel's
// Reels-only policy (see SETUP.md) — several early videos only ever
// published under those types (or their 'reel' has since been deleted),
// so restricting to 'reel' alone silently dropped them from the tracker.
var ENGAGEMENT_TRACKED_POST_TYPE = {
  facebook: ['reel', 'video_feed', 'video'],
  youtube: ['short'], instagram: ['reel'], threads: ['reel']
};

function getEngagementSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SPREADSHEET_ID');
  var ss = ssId ? SpreadsheetApp.openById(ssId) : SpreadsheetApp.create('BBH News Queue');
  if (!ssId) props.setProperty('SPREADSHEET_ID', ss.getId());
  // Pin the spreadsheet's own locale/timezone to Vietnam — added 2026-09-05. Root cause of
  // `posted_date` showing up wrong in Looker Studio: refreshEngagementMetrics() used to write
  // posted_date as a formatted STRING ("dd/MM/yyyy"), which Sheets then re-parses into an actual
  // date using the SPREADSHEET's OWN locale — if that locale defaults to en_US, "03/09/2026" gets
  // read back as MM/DD (March 9) instead of the intended DD/MM (September 3). Idempotent, cheap,
  // safe to call every refresh; only this function ever writes real Date values into the sheet
  // (news_queue/posts_log store plain ISO strings, unaffected).
  try { ss.setSpreadsheetLocale('vi_VN'); } catch (e) {}
  try { ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh'); } catch (e) {}
  var sheet = ss.getSheetByName(ENGAGEMENT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ENGAGEMENT_SHEET_NAME);
    sheet.setFrozenRows(1);
  }
  // Always (re)write the header row, not just on first creation — lets a header-label change
  // (like this Vietnamese pass) apply to the sheet in production without deleting/recreating it.
  sheet.getRange(1, 1, 1, ENGAGEMENT_HEADER_LABELS.length).setValues([ENGAGEMENT_HEADER_LABELS]);
  return sheet;
}

function fbVideoMetrics_(videoId, token) {
  var out = { views: '', likes: '', reactions: '', comments: '', shares: '', notes: '' };
  try {
    var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + videoId +
      '?fields=likes.summary(true).limit(0),comments.summary(true).limit(0)' +
      '&access_token=' + encodeURIComponent(token);
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var data = safeJsonParse_(resp.getContentText());
    if (data && !data.error) {
      out.likes = (data.likes && data.likes.summary && data.likes.summary.total_count) || 0;
      out.comments = (data.comments && data.comments.summary && data.comments.summary.total_count) || 0;
    } else {
      out.notes += 'engagement:' + JSON.stringify(data && data.error) + ';';
    }
    out.reactions = out.likes; // confirmed live 2026-08-29: 'reactions' is NOT
    // a valid field on a video/Reels node ("(#100) Tried accessing
    // nonexistent field (reactions)") — only the classic 'likes' edge works
    // here, unlike a Feed post node which does expose full reaction-type
    // breakdown. Mirroring likes is the closest available number.
  } catch (e) { out.notes += 'engagement:' + String(e) + ';'; }

  // 'shares' isn't a valid field on every video node (errors the whole
  // request if combined with the fields above) — fetched separately so a
  // rejection here never costs us likes/comments.
  try {
    var sUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + videoId +
      '?fields=shares&access_token=' + encodeURIComponent(token);
    var sResp = UrlFetchApp.fetch(sUrl, { muteHttpExceptions: true });
    var sData = safeJsonParse_(sResp.getContentText());
    if (sData && !sData.error) {
      out.shares = (sData.shares && sData.shares.count) || 0;
    } else {
      out.notes += 'shares:' + JSON.stringify(sData && sData.error) + ';';
    }
  } catch (e3) { out.notes += 'shares:' + String(e3) + ';'; }

  // Reels use 'blue_reels_play_count', not the older 'total_video_views' —
  // request both and take whichever one actually has data.
  try {
    var vUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + videoId +
      '/video_insights?metric=blue_reels_play_count,total_video_views&access_token=' +
      encodeURIComponent(token);
    var vResp = UrlFetchApp.fetch(vUrl, { muteHttpExceptions: true });
    var vData = safeJsonParse_(vResp.getContentText());
    var found = false;
    if (vData && vData.data) {
      vData.data.forEach(function (m) {
        var v = m.values && m.values[0] && m.values[0].value;
        if (v || v === 0) { out.views = v; found = true; }
      });
    }
    if (!found) out.notes += 'views:' + JSON.stringify(vData) + ';';
  } catch (e2) { out.notes += 'views:' + String(e2) + ';'; }

  return out;
}

function igMediaMetrics_(mediaId, token) {
  var out = { views: '', likes: '', reactions: '', comments: '', shares: '', notes: '' };
  try {
    var url = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + mediaId +
      '?fields=like_count,comments_count&access_token=' + encodeURIComponent(token);
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var data = safeJsonParse_(resp.getContentText());
    if (data && !data.error) {
      out.likes = data.like_count || 0;
      out.reactions = out.likes; // Instagram has one reaction type (heart) — same as likes
      out.comments = data.comments_count || 0;
    } else {
      out.notes += 'engagement:' + JSON.stringify(data && data.error) + ';';
    }
  } catch (e) { out.notes += 'engagement:' + String(e) + ';'; }

  try {
    // 'plays' is deprecated — current metric name is 'views' (confirmed
    // live 2026-08-29: the old name errors with the full valid-metric list,
    // which includes 'views' but not 'plays').
    var iUrl = 'https://graph.facebook.com/' + FB_GRAPH_VERSION + '/' + mediaId +
      '/insights?metric=views,shares&access_token=' + encodeURIComponent(token);
    var iResp = UrlFetchApp.fetch(iUrl, { muteHttpExceptions: true });
    var iData = safeJsonParse_(iResp.getContentText());
    if (iData && iData.data) {
      iData.data.forEach(function (m) {
        var v = m.values && m.values[0] && m.values[0].value;
        if (m.name === 'views') out.views = v || 0;
        if (m.name === 'shares') out.shares = v || 0;
      });
    } else {
      out.notes += 'views:' + JSON.stringify(iData) + ';';
    }
  } catch (e2) { out.notes += 'views:' + String(e2) + ';'; }

  return out;
}

function threadsMediaMetrics_(mediaId, token) {
  var out = { views: '', likes: '', reactions: '', comments: '', shares: '', notes: '' };
  try {
    var url = 'https://graph.threads.net/' + THREADS_GRAPH_VERSION + '/' + mediaId +
      '/insights?metric=views,likes,replies,reposts&access_token=' + encodeURIComponent(token);
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var data = safeJsonParse_(resp.getContentText());
    if (data && data.data) {
      data.data.forEach(function (m) {
        var v = m.values && m.values[0] && m.values[0].value;
        if (m.name === 'views') out.views = v || 0;
        if (m.name === 'likes') out.likes = v || 0;
        if (m.name === 'replies') out.comments = v || 0;
        if (m.name === 'reposts') out.shares = v || 0;
      });
      out.reactions = out.likes; // Threads has one reaction type (heart) — same as likes
    } else {
      out.notes += JSON.stringify(data) + ';';
    }
  } catch (e) { out.notes += String(e) + ';'; }
  return out;
}

function ytVideoMetrics_(videoId, token) {
  var out = { views: '', likes: '', reactions: '', comments: '', shares: '', notes: '' };
  try {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' +
      encodeURIComponent(videoId);
    var resp = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
    });
    var data = safeJsonParse_(resp.getContentText());
    var stats = data && data.items && data.items[0] && data.items[0].statistics;
    if (stats) {
      out.views = stats.viewCount || 0;
      out.likes = stats.likeCount || 0;
      out.reactions = out.likes; // YouTube has one reaction type (thumbs-up) — same as likes
      out.comments = stats.commentCount || 0;
    } else {
      out.notes += JSON.stringify(data) + ';';
    }
  } catch (e) { out.notes += String(e) + ';'; }
  return out;
}

/**
 * Rebuilds engagement_metrics from posts_log — one row per (channel,
 * video_project), keyed on the channel's tracked post_type(s) (see
 * ENGAGEMENT_TRACKED_POST_TYPE). Skips rows with status !== 'published' or a
 * blank platform_post_id. Clears and rewrites all data rows every run
 * (rather than upserting in place) so the channel grouping stays correct as
 * new videos appear — see CHANNEL_SORT_ORDER.
 */
function refreshEngagementMetrics() {
  var postsSheet = getPostsSheet_();
  var lastRow = postsSheet.getLastRow();
  var candidates = {}; // key: channel|video_project -> latest matching row
  if (lastRow > 1) {
    var data = postsSheet.getRange(2, 1, lastRow - 1, POSTS_HEADERS.length).getValues();
    data.forEach(function (row) {
      var rec = {};
      POSTS_HEADERS.forEach(function (h, i) { rec[h] = row[i]; });
      if (rec.status !== 'published') return;
      if (!rec.platform_post_id) return;
      var trackedTypes = ENGAGEMENT_TRACKED_POST_TYPE[rec.channel] || [];
      if (trackedTypes.indexOf(rec.post_type) === -1) return;
      var key = rec.channel + '|' + rec.video_project;
      if (!candidates[key] || rec.posted_at > candidates[key].posted_at) candidates[key] = rec;
    });
  }

  var fbToken, threadsToken, ytToken;
  var results = [];
  Object.keys(candidates).forEach(function (key) {
    var rec = candidates[key];
    var m = { views: '', likes: '', reactions: '', comments: '', shares: '', notes: '' };
    try {
      if (rec.channel === 'facebook') {
        fbToken = fbToken || fbPageAccessToken_();
        m = fbVideoMetrics_(rec.platform_post_id, fbToken);
      } else if (rec.channel === 'instagram') {
        fbToken = fbToken || fbPageAccessToken_();
        m = igMediaMetrics_(rec.platform_post_id, fbToken);
      } else if (rec.channel === 'threads') {
        threadsToken = threadsToken || threadsAccessToken_();
        m = threadsMediaMetrics_(rec.platform_post_id, threadsToken);
      } else if (rec.channel === 'youtube') {
        ytToken = ytToken || ytAccessToken_();
        m = ytVideoMetrics_(rec.platform_post_id, ytToken);
      }
    } catch (e) { m.notes = String(e); }

    var posted = rec.posted_at ? new Date(rec.posted_at) : null;
    results.push({
      channel: CHANNEL_DISPLAY_NAMES[rec.channel] || rec.channel,
      channelSort: CHANNEL_SORT_ORDER.indexOf(rec.channel),
      video_project: rec.video_project, post_type: rec.post_type,
      platform_post_id: rec.platform_post_id, permalink: rec.permalink, title: rec.title,
      posted_at: rec.posted_at,
      // Real Date object, NOT a formatted string — see the locale note on getEngagementSheet_().
      // Writing a string here would just re-trigger the same DD/MM-vs-MM/DD ambiguity on Sheets'
      // side when it re-parses it; a genuine Date value has no parsing step to get ambiguous.
      posted_date: posted || '',
      posted_time: posted ? Utilities.formatDate(posted, 'Asia/Ho_Chi_Minh', 'HH:mm') : '',
      views: numOrZero_(m.views), likes: numOrZero_(m.likes),
      reactions: numOrZero_(m.reactions), comments: numOrZero_(m.comments),
      shares: numOrZero_(m.shares),
      last_checked: new Date().toISOString(), notes: m.notes
    });
  });

  // Full rebuild every time (not an incremental upsert) — the sheet is
  // small (one row per channel per video) and this is the simplest way to
  // guarantee the channel grouping below stays correct as new videos are
  // added, rather than new rows always landing at the bottom regardless of
  // channel.
  results.sort(function (a, b) {
    if (a.channelSort !== b.channelSort) return a.channelSort - b.channelSort;
    return a.posted_at < b.posted_at ? -1 : a.posted_at > b.posted_at ? 1 : 0;
  });

  var sheet = getEngagementSheet_();
  var eLastRow = sheet.getLastRow();
  if (eLastRow > 1) sheet.getRange(2, 1, eLastRow - 1, ENGAGEMENT_HEADERS.length).clearContent();
  if (results.length) {
    var rows = results.map(function (r) {
      return ENGAGEMENT_HEADERS.map(function (h) { return r[h] === undefined ? '' : r[h]; });
    });
    sheet.getRange(2, 1, rows.length, ENGAGEMENT_HEADERS.length).setValues(rows);
    // Explicit display format for the real-Date posted_date column — independent of whatever
    // locale/format a viewer's own Sheets UI defaults to, always renders zero-padded dd/MM/yyyy.
    var postedDateCol = ENGAGEMENT_HEADERS.indexOf('posted_date') + 1;
    sheet.getRange(2, postedDateCol, rows.length, 1).setNumberFormat('dd/mm/yyyy');
  }

  return { ok: true, updated: results.length };
}

/**
 * Run this ONCE manually from the Apps Script editor to install a daily
 * trigger that keeps engagement_metrics fresh automatically (6am). Re-running
 * is safe — removes any prior trigger for this function first.
 */
function installDailyMetricsTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'refreshEngagementMetrics') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('refreshEngagementMetrics').timeBased().everyDays(1).atHour(6).create();
  Logger.log('Daily engagement metrics refresh trigger installed (6am).');
}

// ---- One-time setup helper -------------------------------------------------

/**
 * Run this ONCE manually from the Apps Script editor (select it in the
 * function dropdown, click Run) to install an hourly trigger for
 * fetchAndStore. Re-running is safe — it removes any prior trigger for this
 * function first so you don't end up with duplicates.
 */
function installHourlyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'fetchAndStore') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('fetchAndStore').timeBased().everyHours(1).create();
  Logger.log('Hourly trigger installed for fetchAndStore.');
}
