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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
 * POST body: {"id": "<id from doGet>", "video": "<optional project folder name>"}
 * Marks that item used so later runs (same day) don't pick it again.
 */
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'bad json' }))
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
