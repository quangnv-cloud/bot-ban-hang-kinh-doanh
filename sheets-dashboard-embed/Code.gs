/**
 * Sheets → iframe embed proxy (Google Apps Script)
 *
 * Renders a range from a Google Sheet as a standalone HTML page, cloning the
 * sheet's own cell formatting (background, font color/weight/style, align,
 * merges) 1:1 — so the output looks exactly like the source range, not a
 * generic re-styled table. Deploy as a Web App and point an <iframe> at the
 * /exec URL from merchant.vn/a/contact instead of pasting a static image.
 *
 * Why this shape: the two source spreadsheets can stay private. The web app
 * runs "Execute as: Me", so it reads them with the deploying account's
 * access and republishes only the rendered HTML — viewers of the iframe
 * never need Google access to the underlying sheet.
 *
 * Setup: see SETUP.md in this same folder.
 */

// ---- Config -------------------------------------------------------------

// Named shortcuts for the two report ranges given by the user, so the iframe
// src can be a short "?report=sale" instead of a raw id/gid. Add more entries
// here as new report tabs are created.
var REPORTS = {
  'sale': {
    spreadsheetId: '1Sd97mPpr_k1ca8QdKOpMNHrMsDZHiFTYDI6fF2REB1Y',
    gid: '462434893',
    title: 'Doanh thu / Chi phí Ads theo Sale'
  },
  'compare': {
    spreadsheetId: '1Zxjj231qAO79hlnbDdiH5GG0cgP3a2masS55leLcsJI',
    gid: '1616235685',
    title: 'So sánh chi tiết theo tuần'
  }
};

var CACHE_SECONDS = 300; // 5 phút — khớp với nhịp "5 phút" tự refresh thấy trên merchant.vn/a/contact

// ---- Entry point ----------------------------------------------------------

function doGet(e) {
  var params = (e && e.parameter) || {};
  try {
    var target = resolveTarget(params);
    var cacheKey = ['v1', target.spreadsheetId, target.gid, target.range || '', params.filterValue || ''].join('|');
    var cache = CacheService.getScriptCache();
    var html = params.nocache ? null : cache.get(cacheKey);

    if (!html) {
      html = renderSheetRangeAsHtml(target.spreadsheetId, target.gid, params);
      try { cache.put(cacheKey, html, CACHE_SECONDS); } catch (cacheErr) { /* payload too large for cache, ignore */ }
    }

    return HtmlService.createHtmlOutput(html)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    var msg = params.debug ? String(err && err.stack || err) : 'Không tải được báo cáo. Kiểm tra lại report/id/gid.';
    return HtmlService.createHtmlOutput('<p style="font-family:Arial;color:#900">' + escapeHtml(msg) + '</p>')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function resolveTarget(params) {
  var cfg = params.report && REPORTS[params.report];
  if (cfg) {
    return { spreadsheetId: cfg.spreadsheetId, gid: cfg.gid, range: params.range };
  }
  if (params.id && params.gid) {
    return { spreadsheetId: params.id, gid: params.gid, range: params.range };
  }
  throw new Error('Thiếu tham số: truyền ?report=sale|compare hoặc ?id=<spreadsheetId>&gid=<gid>');
}

// ---- Rendering --------------------------------------------------------

function renderSheetRangeAsHtml(spreadsheetId, gid, params) {
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = getSheetByGid(ss, gid);
  var range = params.range ? sheet.getRange(params.range) : sheet.getDataRange();

  var values = range.getDisplayValues();
  var backgrounds = range.getBackgrounds();
  var fontColors = range.getFontColors();
  var fontWeights = range.getFontWeights();
  var fontStyles = range.getFontStyles();
  var haligns = range.getHorizontalAlignments();
  var fontSizes = range.getFontSizes();
  var mergeMap = computeMergeMap(range);

  var filterValue = params.filterValue ? String(params.filterValue).trim().toLowerCase() : '';

  var rowsHtml = [];
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();

  for (var r = 0; r < numRows; r++) {
    if (filterValue) {
      var rowText = values[r].join(' ').toLowerCase();
      // luôn giữ lại hàng có "tổng" (tổng cộng/total) dù không khớp filter
      if (rowText.indexOf(filterValue) === -1 && rowText.indexOf('tổng') === -1) continue;
    }

    var cellsHtml = [];
    for (var c = 0; c < numCols; c++) {
      var key = r + '_' + c;
      var mergeInfo = mergeMap[key];
      if (mergeInfo && mergeInfo.skip) continue;

      var val = values[r][c];
      var align = haligns[r][c] || inferAlign(val);
      var style = 'background:' + (backgrounds[r][c] || '#ffffff') + ';' +
        'color:' + (fontColors[r][c] || '#000000') + ';' +
        'font-weight:' + (fontWeights[r][c] === 'bold' ? '700' : '400') + ';' +
        'font-style:' + (fontStyles[r][c] === 'italic' ? 'italic' : 'normal') + ';' +
        'text-align:' + align + ';' +
        'font-size:' + (fontSizes[r][c] || 10) + 'pt;';

      var spanAttrs = '';
      if (mergeInfo) {
        if (mergeInfo.rowSpan > 1) spanAttrs += ' rowspan="' + mergeInfo.rowSpan + '"';
        if (mergeInfo.colSpan > 1) spanAttrs += ' colspan="' + mergeInfo.colSpan + '"';
      }

      cellsHtml.push('<td' + spanAttrs + ' style="' + style + '">' + escapeHtml(val).replace(/\n/g, '<br>') + '</td>');
    }
    rowsHtml.push('<tr>' + cellsHtml.join('') + '</tr>');
  }

  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8">',
    '<style>',
    'html,body{margin:0;padding:0;background:#ffffff;}',
    'table{border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;width:100%;}',
    'td{border:1px solid #e0e0e0;padding:4px 8px;white-space:nowrap;}',
    '</style></head><body>',
    '<table>', rowsHtml.join(''), '</table>',
    '</body></html>'
  ].join('');
}

function getSheetByGid(spreadsheet, gid) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getSheetId()) === String(gid)) return sheets[i];
  }
  throw new Error('Không tìm thấy sheet với gid=' + gid);
}

// Trả về map "row_col" (toạ độ tương đối trong range) -> {rowSpan,colSpan} cho ô
// góc trên-trái của mỗi vùng merge, hoặc {skip:true} cho các ô còn lại bị merge che.
function computeMergeMap(range) {
  var startRow = range.getRow();
  var startCol = range.getColumn();
  var numRows = range.getNumRows();
  var numCols = range.getNumColumns();
  var map = {};

  range.getMergedRanges().forEach(function (m) {
    var mr = m.getRow() - startRow;
    var mc = m.getColumn() - startCol;
    var mrEnd = mr + m.getNumRows() - 1;
    var mcEnd = mc + m.getNumColumns() - 1;
    if (mr < 0 || mc < 0 || mr >= numRows || mc >= numCols) return; // merge vượt ngoài range, bỏ qua

    for (var r = mr; r <= mrEnd; r++) {
      for (var c = mc; c <= mcEnd; c++) {
        map[r + '_' + c] = (r === mr && c === mc)
          ? { rowSpan: m.getNumRows(), colSpan: m.getNumColumns() }
          : { skip: true };
      }
    }
  });

  return map;
}

function inferAlign(displayValue) {
  var v = (displayValue || '').trim();
  if (v === '') return 'left';
  return /^-?[\d.,%đ\s]+$/.test(v) ? 'right' : 'left';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
