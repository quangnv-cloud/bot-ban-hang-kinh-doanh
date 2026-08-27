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
 *     — publishes to the Page's Feed AND Reels (see fbPublish_ below).
 * OR:
 *   {"action": "publish_facebook_photo", "image_url": "<public jpg/png URL>", "caption": "<text>"}
 *     — publishes a regular photo+caption post ("tin") to the Page's Feed —
 *       a normal status-style post, not a video/Reel (see fbPublishPhoto_ below).
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
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: publishResult }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (body.action === 'publish_facebook_photo') {
    if (!body.image_url) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'image_url required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var photoResult;
    try { photoResult = fbPublishPhoto_(body.image_url, body.caption || ''); }
    catch (e2) { photoResult = { error: String(e2) }; }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: photoResult }))
      .setMimeType(ContentService.MimeType.JSON);
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
 * Publishes a regular photo+caption post ("tin") to the Page's Feed — the
 * standard status-style post with an image (e.g. the video's thumbnail) and
 * the full caption text underneath, distinct from fbPublishFeed_/fbPublishReel_
 * which upload video content. Uses POST /{page-id}/photos with a public
 * image `url` — Facebook fetches the image server-side, same file_url pattern
 * as fbPublishFeed_.
 */
function fbPublishPhoto_(imageUrl, caption) {
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

function safeJsonParse_(text) {
  try { return JSON.parse(text); } catch (e) { return { parseError: String(e), raw: text }; }
}

/**
 * Publishes to Feed and Reels independently — one failing does not block or
 * roll back the other. Caller (doPost) returns both results so the routine
 * can report per-target success/failure rather than a single pass/fail.
 */
function fbPublish_(videoUrl, caption) {
  var feed, reel;
  try { feed = fbPublishFeed_(videoUrl, caption); } catch (e) { feed = { error: String(e) }; }
  try { reel = fbPublishReel_(videoUrl, caption); } catch (e) { reel = { error: String(e) }; }
  return { feed: feed, reel: reel };
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
