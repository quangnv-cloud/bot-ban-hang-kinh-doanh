/**
 * Tự động tạo task TimeBoxing (merchant.vn) cho tuần sau: Thứ 2 → Thứ 7.
 * Chạy bằng time-driven trigger của Google Apps Script (không cần mở máy).
 *
 * Apps Script KHÔNG bấm được giao diện web — nó gọi thẳng API mà trang web dùng.
 * Vì vậy cần bắt 2 request thật bằng Chrome DevTools rồi điền vào CONFIG.API (xem README.md).
 *
 * Token đăng nhập KHÔNG để trong code: lưu ở Project Settings → Script Properties → AUTH_TOKEN.
 */

const CONFIG = {
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  START_TIME: '23:45',        // giờ bắt đầu mặc định
  WEEKDAYS: [1, 2, 3, 4, 5, 6], // 1 = Thứ 2 ... 6 = Thứ 7
  DRY_RUN: true,              // true = chỉ log, không gọi API. Đổi thành false khi đã test xong.
  NOTIFY_EMAIL: '',           // để trống = gửi về email chủ script khi lỗi

  // Mỗi phần tử = 1 task/ngày. {dd}, {MM}, {yyyy} được thay theo ngày tương ứng.
  TASKS: [
    {
      title: '[Nhân sự] Hậu kiểm nhân sự ngày {dd}.{MM}',
      templateId: 'DIEN_TEMPLATE_ID',
    },
  ],

  // Điền từ request thật (DevTools → Network → Copy as cURL). Placeholder dùng được trong url/body:
  // {{TITLE}} {{TEMPLATE_ID}} {{TASK_ID}} {{START_ISO}} {{START_MS}} {{START_SEC}} {{DATE}}
  API: {
    AUTH_HEADER: 'Authorization',   // tên header chứa token (có thể là 'token', 'x-access-token'...)
    AUTH_PREFIX: 'Bearer ',          // để '' nếu token không có tiền tố
    EXTRA_HEADERS: {},               // header bắt buộc khác nếu có (vd: {'x-merchant-id': '...'})

    // Bước "Tạo và xem chi tiết"
    CREATE: {
      method: 'post',
      url: 'https://DIEN_API_HOST/DIEN_DUONG_DAN_TAO_TASK',
      body: {
        title: '{{TITLE}}',
        template_id: '{{TEMPLATE_ID}}',
      },
      idPath: 'data._id', // đường dẫn tới id task trong JSON response
    },

    // Bước "Chọn thời gian bắt đầu" → "Chọn". Đặt null nếu CREATE đã nhận luôn giờ bắt đầu.
    SET_START: {
      method: 'put',
      url: 'https://DIEN_API_HOST/DIEN_DUONG_DAN/{{TASK_ID}}',
      body: {
        start_time: '{{START_ISO}}',
      },
    },
  },
};

/* ====================== Entry points ====================== */

/** Hàm trigger gọi mỗi Thứ 7 ~16:00. */
function createNextWeekTasks() {
  const days = nextWeekDays_(new Date());
  const done = loadDone_();
  const results = [];

  days.forEach(function (day) {
    CONFIG.TASKS.forEach(function (task) {
      const key = Utilities.formatDate(day, CONFIG.TIMEZONE, 'yyyy-MM-dd') + '|' + task.title;
      if (done[key]) {
        results.push('BỎ QUA (đã tạo): ' + key);
        return;
      }
      try {
        const id = createOne_(task, day);
        if (!CONFIG.DRY_RUN) {
          done[key] = id || true;
          saveDone_(done);
        }
        results.push('OK: ' + key + (id ? ' → ' + id : ''));
      } catch (e) {
        results.push('LỖI: ' + key + ' → ' + e.message);
      }
    });
  });

  const report = results.join('\n');
  Logger.log(report);
  if (results.some(function (r) { return r.indexOf('LỖI') === 0; })) {
    notify_('[TimeBoxing] Tạo task tuần sau có LỖI', report);
  }
  return report;
}

/** Cài trigger: Thứ 7, khung 16:00–17:00 (Apps Script không cho chọn đúng phút). Chạy 1 lần. */
function installTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'createNextWeekTasks'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('createNextWeekTasks')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SATURDAY)
    .atHour(16)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  Logger.log('Đã cài trigger Thứ 7, 16:00–17:00 (' + CONFIG.TIMEZONE + ')');
}

/** Test nhanh: tạo đúng 1 task cho ngày mai (vẫn tôn trọng DRY_RUN). */
function testOne() {
  const d = new Date(Date.now() + 24 * 3600 * 1000);
  Logger.log(createOne_(CONFIG.TASKS[0], d));
}

/** Xem trước danh sách sẽ tạo, không gọi API. */
function preview() {
  nextWeekDays_(new Date()).forEach(function (day) {
    CONFIG.TASKS.forEach(function (task) {
      const v = vars_(task, day);
      Logger.log(v.TITLE + '  |  bắt đầu ' + v.START_ISO);
    });
  });
}

/** Xoá bộ nhớ chống tạo trùng (khi cần tạo lại). */
function resetDone() {
  PropertiesService.getScriptProperties().deleteProperty('DONE');
}

/* ====================== Core ====================== */

function createOne_(task, day) {
  const v = vars_(task, day);
  const created = call_(CONFIG.API.CREATE, v);
  if (CONFIG.DRY_RUN) return 'DRY_RUN';

  const id = getPath_(created, CONFIG.API.CREATE.idPath);
  if (CONFIG.API.SET_START) {
    if (!id) throw new Error('Không lấy được task id tại "' + CONFIG.API.CREATE.idPath + '": ' + JSON.stringify(created).slice(0, 300));
    v.TASK_ID = String(id);
    call_(CONFIG.API.SET_START, v);
  }
  return id;
}

/** Thứ 2 → Thứ 7 của tuần kế tiếp, tính theo giờ Việt Nam. */
function nextWeekDays_(now) {
  // Lấy ngày hiện tại theo VN, dựng lại ở 12:00 để tránh lệch ngày do múi giờ.
  const ymd = Utilities.formatDate(now, CONFIG.TIMEZONE, 'yyyy-MM-dd').split('-').map(Number);
  const today = new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2], 12));
  const dow = today.getUTCDay(); // 0 = CN
  const toNextMonday = ((8 - dow) % 7) || 7;
  return CONFIG.WEEKDAYS.map(function (wd) {
    return new Date(today.getTime() + (toNextMonday + wd - 1) * 86400000);
  });
}

function vars_(task, day) {
  const tz = CONFIG.TIMEZONE;
  const date = Utilities.formatDate(day, tz, 'yyyy-MM-dd');
  const start = new Date(date + 'T' + CONFIG.START_TIME + ':00+07:00');
  const title = task.title
    .replace('{dd}', Utilities.formatDate(day, tz, 'dd'))
    .replace('{MM}', Utilities.formatDate(day, tz, 'MM'))
    .replace('{yyyy}', Utilities.formatDate(day, tz, 'yyyy'));
  return {
    TITLE: title,
    TEMPLATE_ID: task.templateId,
    DATE: date,
    START_ISO: start.toISOString(),
    START_MS: String(start.getTime()),
    START_SEC: String(Math.floor(start.getTime() / 1000)),
    TASK_ID: '',
  };
}

function call_(req, v) {
  const url = fill_(req.url, v);
  const body = fillDeep_(req.body, v);
  if (CONFIG.DRY_RUN) {
    Logger.log('[DRY_RUN] ' + req.method.toUpperCase() + ' ' + url + '\n' + JSON.stringify(body));
    return {};
  }
  const token = PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN');
  if (!token) throw new Error('Chưa có Script Property AUTH_TOKEN');

  const headers = Object.assign({}, CONFIG.API.EXTRA_HEADERS);
  headers[CONFIG.API.AUTH_HEADER] = CONFIG.API.AUTH_PREFIX + token;

  const res = UrlFetchApp.fetch(url, {
    method: req.method,
    contentType: 'application/json',
    headers: headers,
    payload: body ? JSON.stringify(body) : undefined,
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  const text = res.getContentText();
  if (code === 401 || code === 403) throw new Error('Token hết hạn/không hợp lệ (HTTP ' + code + '). Cập nhật AUTH_TOKEN.');
  if (code >= 300) throw new Error('HTTP ' + code + ': ' + text.slice(0, 300));
  try { return JSON.parse(text); } catch (e) { return {}; }
}

/* ====================== Helpers ====================== */

function fill_(s, v) {
  return String(s).replace(/\{\{(\w+)\}\}/g, function (_, k) { return k in v ? v[k] : _; });
}

function fillDeep_(x, v) {
  if (x === null || x === undefined) return x;
  if (typeof x === 'string') return fill_(x, v);
  if (Array.isArray(x)) return x.map(function (i) { return fillDeep_(i, v); });
  if (typeof x === 'object') {
    const o = {};
    Object.keys(x).forEach(function (k) { o[k] = fillDeep_(x[k], v); });
    return o;
  }
  return x;
}

function getPath_(obj, path) {
  return String(path).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
}

function loadDone_() {
  const raw = PropertiesService.getScriptProperties().getProperty('DONE');
  const done = raw ? JSON.parse(raw) : {};
  // Giữ 60 ngày gần nhất cho gọn
  const cutoff = Utilities.formatDate(new Date(Date.now() - 60 * 86400000), CONFIG.TIMEZONE, 'yyyy-MM-dd');
  Object.keys(done).forEach(function (k) { if (k.slice(0, 10) < cutoff) delete done[k]; });
  return done;
}

function saveDone_(done) {
  PropertiesService.getScriptProperties().setProperty('DONE', JSON.stringify(done));
}

function notify_(subject, body) {
  const to = CONFIG.NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (to) MailApp.sendEmail(to, subject, body);
}
