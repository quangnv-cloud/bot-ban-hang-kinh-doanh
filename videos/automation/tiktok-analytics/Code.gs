/**
 * Social Analytics (project "TikTok Analytics") — kéo số liệu organic TikTok + Facebook + YouTube
 * của các kênh không có pipeline đăng bài riêng (Tiền Nó Bạc, Chồi Non AI) và ghi vào Sheet tổng hợp
 * đa kênh (post_metrics / traffic_daily / brands), cùng schema với mirrorAnalyticsToMaster_ của các tuyến khác.
 *
 * Script Properties:
 *   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET  – app Sandbox trên developers.tiktok.com (người vận hành nhập)
 *   TIKTOK_REDIRECT_URI                      – trang callback GitHub Pages (chuyển tiếp về exec URL)
 *   SETUP_KEY                                – chuỗi bí mật, chặn người lạ kết nối tài khoản của họ vào
 *   TT_TOKEN_<slug>                          – script tự ghi sau khi cấp quyền TikTok (không sửa tay)
 *   FB_PAGE_ID_<slug>                        – ID Fanpage của brand
 *   FB_TOKEN_<slug> hoặc FB_SYSTEM_TOKEN     – System User token (người vận hành nhập); script tự đổi ra Page token
 *   YT_CHANNEL_<slug>                        – Channel ID (UC…) của brand
 *   YOUTUBE_API_KEY                          – API key YouTube Data API v3 (người vận hành nhập); số liệu YT công khai nên không cần OAuth
 * Nền tảng nào thiếu property thì bỏ qua, không lỗi. Setup: xem SETUP.md cùng thư mục.
 */

var MASTER_SHEET_ID = '1isvFaqM9g6F8hFb3Fu5pvMg2Jgj017Nsh6R0OgHsof0';
var TZ = 'Asia/Ho_Chi_Minh';
var FB_GRAPH = 'https://graph.facebook.com/v20.0';
var YT_API = 'https://www.googleapis.com/youtube/v3';
var ACCOUNTS = {
  tien_no_bac: 'Tiền Nó Bạc',
  choi_non_ai: 'Chồi Non AI'
};
var TT_API = 'https://open.tiktokapis.com/v2';
var TT_SCOPES = 'user.info.basic,user.info.stats,video.list';
var TT_VIDEO_FIELDS = 'id,title,video_description,create_time,share_url,view_count,like_count,comment_count,share_count';

var MASTER_POST_METRICS_HEADERS = [
  'brand', 'platform', 'video_project', 'post_type', 'post_id', 'permalink', 'title',
  'posted_at', 'posted_date', 'views', 'likes', 'reactions', 'comments', 'shares', 'last_checked'
];
var MASTER_TRAFFIC_DAILY_HEADERS = [
  'brand', 'platform', 'date', 'posts_published',
  'views_total', 'views_delta', 'engagement_total', 'engagement_delta',
  'followers', 'followers_delta'
];

// ---- HTTP entry points --------------------------------------------------------

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.code && p.state) return html_(handleCallback_(p.code, p.state));
    if (p.error) return html_('TikTok từ chối cấp quyền: ' + escape_(p.error + ' ' + (p.error_description || '')));
    if (p.tiktok_auth) return html_(startAuth_(p.tiktok_auth, p.key));
    return json_({ ok: true, accounts: accountStatus_() });
  } catch (err) {
    return html_('Lỗi: ' + escape_(String(err && err.message || err)));
  }
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) {}
  if (body.action === 'refresh_metrics') return json_(refreshTikTokMetrics());
  if (body.action === 'status') return json_({ ok: true, accounts: accountStatus_() });
  return json_({ ok: false, error: 'unknown action' });
}

// ---- OAuth (Login Kit) --------------------------------------------------------

function startAuth_(slug, key) {
  if (!ACCOUNTS[slug]) throw new Error('slug không hợp lệ: ' + slug);
  var setupKey = prop_('SETUP_KEY');
  if (!setupKey || key !== setupKey) throw new Error('sai hoặc thiếu key');
  var state = Utilities.getUuid();
  CacheService.getScriptCache().put('tt_state_' + state, slug, 600);
  var url = 'https://www.tiktok.com/v2/auth/authorize/' +
    '?client_key=' + encodeURIComponent(requiredProp_('TIKTOK_CLIENT_KEY')) +
    '&scope=' + encodeURIComponent(TT_SCOPES) +
    '&response_type=code' +
    '&redirect_uri=' + encodeURIComponent(requiredProp_('TIKTOK_REDIRECT_URI')) +
    '&state=' + encodeURIComponent(state);
  return 'Đăng nhập đúng tài khoản TikTok của kênh <b>' + escape_(ACCOUNTS[slug]) + '</b> rồi bấm đồng ý:<br><br>' +
    '<a href="' + escape_(url) + '" target="_top">→ Mở TikTok để cấp quyền</a>';
}

function handleCallback_(code, state) {
  var cache = CacheService.getScriptCache();
  var slug = cache.get('tt_state_' + state);
  if (!slug) throw new Error('phiên cấp quyền đã hết hạn (10 phút) — mở lại link ?tiktok_auth');
  cache.remove('tt_state_' + state);
  var data = tokenRequest_({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: requiredProp_('TIKTOK_REDIRECT_URI')
  });
  saveTokens_(slug, data);
  var user = userStats_(data.access_token);
  return 'Đã kết nối kênh <b>' + escape_(ACCOUNTS[slug]) + '</b> với tài khoản TikTok "' +
    escape_(user.display_name || '') + '" (' + (user.follower_count || 0) + ' follower). Có thể đóng trang này.';
}

function tokenRequest_(params) {
  params.client_key = requiredProp_('TIKTOK_CLIENT_KEY');
  params.client_secret = requiredProp_('TIKTOK_CLIENT_SECRET');
  var resp = UrlFetchApp.fetch(TT_API + '/oauth/token/', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: params,
    muteHttpExceptions: true
  });
  var data = JSON.parse(resp.getContentText());
  if (!data.access_token) {
    throw new Error('TikTok token: ' + (data.error || resp.getResponseCode()) + ' ' + (data.error_description || ''));
  }
  return data;
}

function saveTokens_(slug, data) {
  var now = Date.now();
  PropertiesService.getScriptProperties().setProperty('TT_TOKEN_' + slug, JSON.stringify({
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
    refresh_token: data.refresh_token,
    refresh_expires_at: now + data.refresh_expires_in * 1000,
    open_id: data.open_id
  }));
}

function loadTokens_(slug) {
  var raw = prop_('TT_TOKEN_' + slug);
  return raw ? JSON.parse(raw) : null;
}

// Access token sống 24h, refresh token ~365 ngày; mỗi lần refresh TikTok có thể trả refresh token mới → luôn lưu lại.
function accessToken_(slug) {
  var t = loadTokens_(slug);
  if (!t) return null;
  if (Date.now() < t.expires_at - 5 * 60 * 1000) return t.access_token;
  if (Date.now() >= t.refresh_expires_at) throw new Error('refresh token hết hạn — cần cấp quyền lại (?tiktok_auth=' + slug + ')');
  var data = tokenRequest_({ grant_type: 'refresh_token', refresh_token: t.refresh_token });
  saveTokens_(slug, data);
  return data.access_token;
}

function accountStatus_() {
  var out = {};
  Object.keys(ACCOUNTS).forEach(function (slug) {
    var t = loadTokens_(slug);
    out[slug] = {
      brand: ACCOUNTS[slug],
      connected: !!t,
      refresh_expires: t ? Utilities.formatDate(new Date(t.refresh_expires_at), TZ, 'yyyy-MM-dd') : null
    };
  });
  return out;
}

// ---- Display API --------------------------------------------------------------

function ttCall_(token, method, path, body) {
  var opts = { method: method, headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true };
  if (body) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(body); }
  var resp = UrlFetchApp.fetch(TT_API + path, opts);
  var data = JSON.parse(resp.getContentText());
  if (!data.error || data.error.code !== 'ok') {
    throw new Error(path.split('?')[0] + ': ' + JSON.stringify(data.error || resp.getResponseCode()).slice(0, 300));
  }
  return data.data;
}

function userStats_(token) {
  return ttCall_(token, 'get',
    '/user/info/?fields=open_id,display_name,follower_count,following_count,likes_count,video_count').user;
}

function listVideos_(token) {
  var out = [], cursor = null, pages = 0, d;
  do {
    var body = { max_count: 20 };
    if (cursor) body.cursor = cursor;
    d = ttCall_(token, 'post', '/video/list/?fields=' + TT_VIDEO_FIELDS, body);
    out = out.concat(d.videos || []);
    cursor = d.cursor;
  } while (d.has_more && ++pages < 50);
  return out;
}

// ---- Facebook (Graph API, System User token → Page token) ----------------------

function fbGet_(path, token) {
  var url = FB_GRAPH + path + (path.indexOf('?') === -1 ? '?' : '&') + 'access_token=' + encodeURIComponent(token);
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = JSON.parse(resp.getContentText());
  if (data.error) throw new Error('Facebook ' + path.split('?')[0] + ': ' + (data.error.message || JSON.stringify(data.error)));
  return data;
}

// paging.next là URL đầy đủ kèm access_token → bỏ host + token để fbGet_ tự gắn lại.
function fbNextPath_(next) {
  var p = next.replace(/^https:\/\/graph\.facebook\.com\/v[\d.]+/, '').replace(/([?&])access_token=[^&]*&?/, '$1').replace(/[?&]$/, '');
  if (p.indexOf('?') === -1 && p.indexOf('&') !== -1) p = p.replace('&', '?');
  return p;
}

// Không throw: 1 chỉ số bị Facebook từ chối (vd. shares trên node video) không được làm mất cả video.
function fbTry_(path, token) {
  try { return fbGet_(path, token); } catch (err) { return null; }
}

// Tìm Page trong danh sách Page mà System User quản lý: khớp FB_PAGE_ID_<slug> trước, không có thì khớp theo tên brand.
// Lý do: ID trong link facebook.com/profile.php?id=… là ID hồ sơ, KHÁC Page ID của Graph API.
function fbFindPage_(slug, sysToken) {
  var want = prop_('FB_PAGE_ID_' + slug);
  var name = ACCOUNTS[slug].normalize('NFC');
  var list = fbGet_('/me/accounts?fields=id,name,access_token,followers_count,fan_count&limit=100', sysToken).data || [];
  return list.filter(function (p) { return p.id === want; })[0] ||
    list.filter(function (p) { return String(p.name || '').normalize('NFC') === name; })[0] || null;
}

function fetchFacebook_(slug) {
  var sysToken = prop_('FB_TOKEN_' + slug) || prop_('FB_SYSTEM_TOKEN');
  if (!sysToken) return null;
  var page = fbFindPage_(slug, sysToken);
  if (!page) throw new Error('token không quản lý Page "' + ACCOUNTS[slug] + '" — gán Page cho System User trong Business Manager');
  var pageId = page.id;
  var token = page.access_token || sysToken;

  var byId = {};
  ['/videos', '/video_reels'].forEach(function (edge) {
    var path = '/' + pageId + edge + '?fields=id,title,description,created_time,permalink_url&limit=50';
    for (var pages = 0; path && pages < 20; pages++) {
      var d = edge === '/videos' ? fbGet_(path, token) : fbTry_(path, token);
      if (!d) break;
      (d.data || []).forEach(function (v) { byId[v.id] = v; });
      path = d.paging && d.paging.next ? fbNextPath_(d.paging.next) : null;
    }
  });

  var items = Object.keys(byId).map(function (id) {
    var v = byId[id];
    var eng = fbTry_('/' + id + '?fields=likes.summary(true).limit(0),comments.summary(true).limit(0)', token) || {};
    var sh = fbTry_('/' + id + '?fields=shares', token) || {};
    var ins = fbTry_('/' + id + '/video_insights?metric=blue_reels_play_count,total_video_views', token) || {};
    var views = 0;
    (ins.data || []).forEach(function (m) {
      var val = m.values && m.values[0] && m.values[0].value;
      if (val) views = Math.max(views, Number(val) || 0);
    });
    var permalink = v.permalink_url || '';
    if (permalink && permalink.indexOf('http') !== 0) permalink = 'https://www.facebook.com' + permalink;
    return {
      id: id,
      postType: permalink.indexOf('/reel/') !== -1 ? 'reel' : 'video',
      url: permalink,
      title: v.title || v.description || '',
      postedAt: new Date(v.created_time),
      views: views,
      likes: num_(eng.likes && eng.likes.summary && eng.likes.summary.total_count),
      comments: num_(eng.comments && eng.comments.summary && eng.comments.summary.total_count),
      shares: num_(sh.shares && sh.shares.count)
    };
  });
  return { items: items, followers: num_(page.followers_count || page.fan_count) };
}

// ---- YouTube (Data API v3 + API key — số liệu công khai, không cần OAuth) --------

function ytGet_(path) {
  var url = YT_API + path + '&key=' + encodeURIComponent(requiredProp_('YOUTUBE_API_KEY'));
  var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = JSON.parse(resp.getContentText());
  if (data.error) throw new Error('YouTube ' + path.split('?')[0] + ': ' + (data.error.message || JSON.stringify(data.error)));
  return data;
}

function fetchYouTube_(slug) {
  var channelId = prop_('YT_CHANNEL_' + slug);
  if (!channelId || !prop_('YOUTUBE_API_KEY')) return null;
  var ch = (ytGet_('/channels?part=statistics,contentDetails&id=' + encodeURIComponent(channelId)).items || [])[0];
  if (!ch) throw new Error('YouTube: không tìm thấy kênh ' + channelId);
  var uploads = ch.contentDetails.relatedPlaylists.uploads;

  var ids = [], token = '';
  for (var pages = 0; pages < 20; pages++) {
    var pl = ytGet_('/playlistItems?part=contentDetails&maxResults=50&playlistId=' + uploads + (token ? '&pageToken=' + token : ''));
    (pl.items || []).forEach(function (it) { ids.push(it.contentDetails.videoId); });
    token = pl.nextPageToken;
    if (!token) break;
  }

  var items = [];
  for (var i = 0; i < ids.length; i += 50) {
    var vs = ytGet_('/videos?part=snippet,statistics&id=' + ids.slice(i, i + 50).join(','));
    (vs.items || []).forEach(function (v) {
      var s = v.statistics || {};
      items.push({
        id: v.id,
        postType: 'video',
        url: 'https://www.youtube.com/watch?v=' + v.id,
        title: v.snippet.title,
        postedAt: new Date(v.snippet.publishedAt),
        views: num_(s.viewCount),
        likes: num_(s.likeCount),
        comments: num_(s.commentCount),
        shares: 0
      });
    });
  }
  var st = ch.statistics || {};
  return { items: items, followers: st.hiddenSubscriberCount ? '' : num_(st.subscriberCount) };
}

// ---- TikTok → định dạng chung ----------------------------------------------------

function fetchTikTok_(slug) {
  var token = accessToken_(slug);
  if (!token) return null;
  var user = userStats_(token);
  var items = listVideos_(token).map(function (v) {
    return {
      id: String(v.id),
      postType: 'video',
      url: v.share_url || '',
      title: v.title || v.video_description || '',
      postedAt: new Date(v.create_time * 1000),
      views: num_(v.view_count),
      likes: num_(v.like_count),
      comments: num_(v.comment_count),
      shares: num_(v.share_count)
    };
  });
  return { items: items, followers: num_(user.follower_count) };
}

// ---- Refresh + ghi Sheet tổng hợp ----------------------------------------------

var PLATFORM_FETCHERS = { TikTok: fetchTikTok_, Facebook: fetchFacebook_, YouTube: fetchYouTube_ };

// Tên giữ nguyên vì trigger 6h sáng đang trỏ vào hàm này; giờ làm mới cả 3 nền tảng.
function refreshTikTokMetrics() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var master = SpreadsheetApp.openById(MASTER_SHEET_ID);
    var now = new Date();
    var today = Utilities.formatDate(now, TZ, 'yyyy-MM-dd');
    var results = {};
    Object.keys(ACCOUNTS).forEach(function (slug) {
      var brand = ACCOUNTS[slug];
      results[slug] = {};
      Object.keys(PLATFORM_FETCHERS).forEach(function (platform) {
        try {
          var data = PLATFORM_FETCHERS[platform](slug);
          if (!data) { results[slug][platform] = { ok: false, error: 'chưa cấu hình' }; return; }
          ensureBrand_(master, brand);
          upsertPostMetrics_(master, brand, platform, data.items, now.toISOString());
          upsertTrafficDaily_(master, brand, platform, data.items, data.followers, today);
          results[slug][platform] = { ok: true, videos: data.items.length, followers: data.followers };
        } catch (err) {
          results[slug][platform] = { ok: false, error: String(err && err.message || err) };
          Logger.log('%s/%s failed: %s', slug, platform, results[slug][platform].error);
        }
      });
    });
    return { ok: true, accounts: results };
  } finally {
    lock.releaseLock();
  }
}

function ensureBrand_(master, brand) {
  var sh = master.getSheetByName('brands');
  if (!sh) return;
  var vals = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues() : [];
  var maxOrder = 0, found = false;
  vals.forEach(function (r) {
    if (String(r[0]) === brand) found = true;
    maxOrder = Math.max(maxOrder, Number(r[3]) || 0);
  });
  if (!found) sh.appendRow([brand, brand, '', maxOrder + 1, true]);
}

function upsertPostMetrics_(master, brand, platform, items, nowIso) {
  var pm = master.getSheetByName('post_metrics');
  if (!pm) throw new Error('thiếu tab post_metrics');
  var n = MASTER_POST_METRICS_HEADERS.length;
  var vals = pm.getLastRow() > 1 ? pm.getRange(2, 1, pm.getLastRow() - 1, n).getValues() : [];
  var rowByKey = {};
  vals.forEach(function (r, i) { rowByKey[r[0] + '|' + r[1] + '|' + r[4]] = i + 2; });
  var appends = [];
  items.forEach(function (it) {
    // Id TikTok/FB dài 15–19 chữ số — dấu ' giữ dạng text, nếu để Sheets đổi sang số sẽ làm tròn và khoá upsert không khớp.
    var row = [
      brand, platform, '', it.postType, "'" + it.id, it.url,
      String(it.title).slice(0, 200),
      it.postedAt.toISOString(), it.postedAt,
      it.views, it.likes, it.likes, it.comments, it.shares, nowIso
    ];
    var at = rowByKey[brand + '|' + platform + '|' + it.id];
    if (at) pm.getRange(at, 1, 1, n).setValues([row]);
    else appends.push(row);
  });
  if (appends.length) pm.getRange(pm.getLastRow() + 1, 1, appends.length, n).setValues(appends);
}

function upsertTrafficDaily_(master, brand, platform, items, followers, today) {
  var td = master.getSheetByName('traffic_daily');
  if (!td) throw new Error('thiếu tab traffic_daily');
  var n = MASTER_TRAFFIC_DAILY_HEADERS.length;
  var vals = td.getLastRow() > 1 ? td.getRange(2, 1, td.getLastRow() - 1, n).getValues() : [];

  var views = 0, eng = 0, postsToday = 0;
  items.forEach(function (it) {
    views += it.views;
    // reactions = likes (cùng quy ước FB/IG ở các tuyến khác) nên likes tính 2 lần, giữ nhất quán để so sánh giữa kênh.
    eng += it.likes + it.likes + it.comments + it.shares;
    if (Utilities.formatDate(it.postedAt, TZ, 'yyyy-MM-dd') === today) postsToday++;
  });

  var prev = null, todayRow = null;
  vals.forEach(function (r, i) {
    if (String(r[0]) !== brand || String(r[1]) !== platform) return;
    var d = asDate_(r[2]);
    if (d === today) todayRow = i + 2;
    else if (d < today && (!prev || d > prev.d)) {
      prev = { d: d, views: num_(r[4]), eng: num_(r[6]), followers: r[8] };
    }
  });
  var row = [
    brand, platform, today, postsToday,
    views, prev ? views - prev.views : '',
    eng, prev ? eng - prev.eng : '',
    followers,
    (prev && followers !== '' && prev.followers !== '' && !isNaN(prev.followers)) ? followers - Number(prev.followers) : ''
  ];
  if (todayRow) td.getRange(todayRow, 1, 1, n).setValues([row]);
  else td.appendRow(row);
}

// ---- Trigger ------------------------------------------------------------------

function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'refreshTikTokMetrics') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('refreshTikTokMetrics').timeBased().atHour(6).everyDays(1).inTimezone(TZ).create();
  Logger.log('Daily TikTok refresh trigger installed (6am ' + TZ + ').');
}

// ---- Helpers ------------------------------------------------------------------

function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function requiredProp_(k) {
  var v = prop_(k);
  if (!v) throw new Error('thiếu Script Property ' + k);
  return v;
}
function num_(v) { return (v === '' || v === undefined || v === null || isNaN(v)) ? 0 : Number(v); }
function asDate_(v) {
  return v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : String(v || '').slice(0, 10);
}
function escape_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function html_(msg) {
  return HtmlService.createHtmlOutput('<div style="font:16px sans-serif;padding:24px;line-height:1.5">' + msg + '</div>')
    .setTitle('TikTok Analytics');
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
