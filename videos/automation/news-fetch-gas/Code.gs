/**
 * BOT BÁN HÀNG · KINH DOANH — News Fetch Proxy (Google Apps Script)
 *
 * Fetches RSS feeds from the channel's approved sources on a schedule, dedupes
 * against a Sheet, and exposes a small HTTP API so the Claude cloud routine
 * (running 7h/12h30/19h30) can pull unused candidate headlines and mark the
 * one it picks as used — without needing an MCP connector or local access.
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
var HEADERS = ['id', 'title', 'link', 'source', 'category', 'pubDate', 'fetchedAt', 'used', 'usedAt', 'usedByVideo'];

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
}

// ---- HTTP API -------------------------------------------------------------

/**
 * GET ?category=business|general (omit for both)
 * Returns unused items published within MAX_AGE_HOURS_FOR_API, newest first.
 */
function doGet(e) {
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
 *   {"action": "publish_facebook", "video_url": "<public mp4 URL>", "caption": "<text>"}
 *     — publishes to Reels only (see fbPublish_ below — was Feed+Reels until
 *       2026-08-28, changed after Feed posts turned out to duplicate Reels).
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
 *   {"action": "log_post", ...POSTS_HEADERS fields...}
 *     — appends one row directly to posts_log (for channels/backfill not
 *       covered by the actions above, e.g. TikTok, or a post made manually
 *       outside this script). See POSTS_HEADERS for fields.
 *
 * publish_facebook, publish_facebook_photo, and publish_youtube log to
 * posts_log automatically on every attempt (success or failure) — no
 * separate log_post call needed for those.
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
    var publishResult = fbPublish_(body.video_url, body.caption || '');
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
 */
function fbPublishReel_(videoUrl, caption) {
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
  return {
    phase: 'finish',
    code: finishResp.getResponseCode(),
    body: safeJsonParse_(finishResp.getContentText()),
    video_id: startData.video_id
  };
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
function fbPublish_(videoUrl, caption) {
  var reel;
  try { reel = fbPublishReel_(videoUrl, caption); } catch (e) { reel = { error: String(e) }; }
  return { reel: reel };
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
 * overall success of the video upload itself.
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
    try { result.thumbnail = ytSetThumbnail_(result.body.id, thumbnailUrl, token); }
    catch (e) { result.thumbnail = { error: String(e) }; }
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
