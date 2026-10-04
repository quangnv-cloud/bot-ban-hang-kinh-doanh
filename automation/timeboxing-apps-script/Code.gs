/**
 * Tự động tạo task TimeBoxing (merchant.vn) cho tuần sau: Thứ 2 → Thứ 7.
 * Chạy bằng time-driven trigger của Google Apps Script (không cần mở máy).
 *
 * Apps Script KHÔNG bấm được giao diện web — nó gọi thẳng API mà app TimeBoxing dùng:
 *   POST https://api-timeboxing.merchant.vn/task/template  {action:'READ'}  → danh sách template
 *   POST https://api-timeboxing.merchant.vn/task/get_tasks                  → kiểm tra trùng
 *   POST https://api-timeboxing.merchant.vn/task/create_task                → tạo task (kèm start_time)
 * Header xác thực: "Token-Business: <token_business>".
 *
 * Token KHÔNG để trong code: lưu ở Project Settings → Script Properties → AUTH_TOKEN.
 * Token có hạn 30 ngày — script tự gửi email nhắc khi còn < 7 ngày (xem README.md cách lấy token mới).
 */

const CONFIG = {
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  START_TIME: '23:45',          // giờ bắt đầu mặc định
  WEEKDAYS: [1, 2, 3, 4, 5, 6], // 1 = Thứ 2 ... 6 = Thứ 7
  DRY_RUN: true,                // true = chỉ log, không tạo task. Đổi thành false khi đã test xong.
  NOTIFY_EMAIL: '',             // để trống = gửi về email chủ script
  TOKEN_WARN_DAYS: 7,           // nhắc cập nhật token khi còn ít hơn số ngày này

  // Mỗi phần tử = 1 task/ngày. {dd}, {MM}, {yyyy} được thay theo ngày tương ứng.
  // templateId lấy từ danh sách template (chạy listTemplates để xem).
  TASKS: [
    { title: '[Nhân sự] Hậu kiểm nhân sự ngày {dd}.{MM}', templateId: 234778 },
    { title: '[Chatbox AI] Hậu kiểm data trên Chatbox + Danh bạ ngày {dd}.{MM}', templateId: 282241 },
    { title: '[Tài chính] Xác nhận các khoản tiền chuyển Bu Ads ngày {dd}.{MM}', templateId: 59146 },
    { title: '[Chatbox AI] Triển khai chatbox AI ngày {dd}.{MM}', templateId: 59262 },
    { title: '[Mastercy] - Kiểm tra chất lượng & tài nguyên QC ngày {dd}.{MM}', templateId: 59137 },
    { title: '[Plan] Kế hoạch công việc hàng ngày {dd}.{MM}', templateId: 59139 },
  ],

  API_HOST: 'https://api-timeboxing.merchant.vn',
};

/* ====================== Entry points ====================== */

/** Hàm trigger gọi mỗi Thứ 7 ~16:00. */
function createNextWeekTasks() {
  const results = [];
  const warn = checkTokenExpiry_();
  if (warn) results.push('CẢNH BÁO: ' + warn);

  const days = nextWeekDays_(new Date());
  const done = loadDone_();
  let templates = null;
  let existing = null;

  days.forEach(function (day) {
    CONFIG.TASKS.forEach(function (task) {
      const v = vars_(task, day);
      const key = v.DATE + '|' + task.title;
      if (done[key]) {
        results.push('BỎ QUA (đã tạo): ' + v.TITLE);
        return;
      }
      try {
        templates = templates || loadTemplates_();
        existing = existing || existingTitles_();
        if (existing[v.TITLE]) {
          results.push('BỎ QUA (đã có trên merchant): ' + v.TITLE);
          done[key] = existing[v.TITLE];
          if (!CONFIG.DRY_RUN) saveDone_(done);
          return;
        }
        const id = createOne_(task, v, templates);
        if (!CONFIG.DRY_RUN) {
          done[key] = id;
          saveDone_(done);
        }
        results.push('OK: ' + v.TITLE + ' → ' + id);
      } catch (e) {
        results.push('LỖI: ' + v.TITLE + ' → ' + e.message);
      }
    });
  });

  const report = results.join('\n');
  Logger.log(report);
  const hasError = results.some(function (r) { return r.indexOf('LỖI') === 0; });
  if (hasError || warn) {
    notify_('[TimeBoxing] ' + (hasError ? 'Tạo task tuần sau có LỖI' : 'Token sắp hết hạn'), report);
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

/**
 * Test thật: tạo đúng 1 task cho ngày TEST_DATE (yyyy-MM-dd), bỏ qua DRY_RUN.
 * Không tạo nếu trên merchant đã có task cùng tiêu đề.
 */
function testOne() {
  const TEST_DATE = '2026-10-06';
  const day = new Date(TEST_DATE + 'T12:00:00+07:00');
  const task = CONFIG.TASKS[0];
  const v = vars_(task, day);
  if (existingTitles_()[v.TITLE]) {
    Logger.log('Đã có trên merchant, không tạo: ' + v.TITLE);
    return;
  }
  const id = createOne_(task, v, loadTemplates_(), true);
  Logger.log('Đã tạo: ' + v.TITLE + ' → id ' + id);
}

/** Xem trước danh sách sẽ tạo (không gọi API). */
function preview() {
  nextWeekDays_(new Date()).forEach(function (day) {
    CONFIG.TASKS.forEach(function (task) {
      const v = vars_(task, day);
      Logger.log(v.TITLE + '  |  bắt đầu ' + Utilities.formatDate(new Date(v.START_MS), CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm'));
    });
  });
}

/** Liệt kê template (id + tiêu đề) để điền vào CONFIG.TASKS. Đồng thời kiểm tra token còn dùng được. */
function listTemplates() {
  const list = loadTemplates_();
  Object.keys(list).forEach(function (id) {
    Logger.log(id + '  |  ' + list[id].type + '  |  ' + list[id].title);
  });
  Logger.log(checkTokenExpiry_() || 'Token còn hạn: ' + tokenExpiry_());
}

/** Xoá bộ nhớ chống tạo trùng (khi cần tạo lại). */
function resetDone() {
  PropertiesService.getScriptProperties().deleteProperty('DONE');
}

/* ====================== Core ====================== */

function createOne_(task, v, templates, force) {
  const tpl = templates[String(task.templateId)];
  if (!tpl) throw new Error('Không tìm thấy template id ' + task.templateId + ' (chạy listTemplates để xem id đúng)');

  // Giống thao tác "Chọn Template" trên web: copy các trường này từ template.
  const body = {
    type: tpl.type || 'day',
    kind_process: tpl.kind_process || 'proactive',
    assignment_task: tpl.assignment_task || tpl.template_creator,
    title: v.TITLE,
    pre_title: tpl.pre_title,
    result_content: tpl.result_content,
    using_ai: tpl.using_ai,
    prompt_ai: tpl.prompt_ai,
    template_id: tpl.id,
    template_creator: tpl.employee_id || tpl.template_creator,
    start_time: v.START_MS,
  };
  if (tpl.project_id) body.project_id = tpl.project_id;
  if (tpl.versioning_id) body.versioning_id = tpl.versioning_id;

  if (CONFIG.DRY_RUN && !force) {
    Logger.log('[DRY_RUN] create_task ' + JSON.stringify(Object.assign({}, body, { result_content: '(' + String(body.result_content || '').length + ' ký tự)' })));
    return 'DRY_RUN';
  }
  const res = api_('/task/create_task', body);
  const created = res && res.data ? res.data : res;
  if (!created || !created.id) throw new Error('Không nhận được id task: ' + JSON.stringify(res).slice(0, 300));
  return created.id;
}

/** { "<id>": template } */
function loadTemplates_() {
  const res = api_('/task/template', { action: 'READ' });
  const arr = Array.isArray(res) ? res : (res && res.data) || [];
  const map = {};
  arr.forEach(function (t) { map[String(t.id)] = t; });
  return map;
}

/** { "<tiêu đề>": id } của các task gần đây — để không tạo trùng task đã tạo tay. */
function existingTitles_() {
  const assignee = assignee_();
  const body = { skip: 0, limit: 200 };
  if (assignee) body.assignment_task = assignee;
  const res = api_('/task/get_tasks', body);
  const d = res && res.data ? res.data : res;
  const tasks = (d && d.tasks) || (Array.isArray(d) ? d : []);
  const map = {};
  tasks.forEach(function (t) { if (t.title) map[String(t.title).trim()] = t.id; });
  return map;
}

function assignee_() {
  const firstId = String(CONFIG.TASKS[0].templateId);
  const cache = CacheService.getScriptCache();
  let a = cache.get('ASSIGNEE');
  if (!a) {
    const t = loadTemplates_()[firstId];
    a = t ? (t.assignment_task || t.template_creator || '') : '';
    if (a) cache.put('ASSIGNEE', a, 3600);
  }
  return a;
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
    DATE: date,
    START_MS: start.getTime(), // merchant lưu start_time dạng mili-giây
  };
}

function api_(path, body) {
  const token = token_();
  const res = UrlFetchApp.fetch(CONFIG.API_HOST + path, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Token-Business': token },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  const text = res.getContentText();
  if (code === 401 || code === 403) throw new Error('Token hết hạn/không hợp lệ (HTTP ' + code + '). Cập nhật AUTH_TOKEN.');
  if (code >= 300) throw new Error('HTTP ' + code + ': ' + text.slice(0, 300));
  let json;
  try { json = JSON.parse(text); } catch (e) { throw new Error('Response không phải JSON: ' + text.slice(0, 200)); }
  if (json && json.data === undefined && json.message && !json.id) throw new Error('API báo lỗi: ' + json.message);
  return json;
}

/* ====================== Token ====================== */

function token_() {
  const token = PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN');
  if (!token) throw new Error('Chưa có Script Property AUTH_TOKEN');
  return token.trim();
}

/** Ngày hết hạn token (đọc từ JWT), hoặc null nếu không đọc được. */
function tokenExpiry_() {
  try {
    const part = token_().split('.')[1];
    const json = Utilities.newBlob(Utilities.base64DecodeWebSafe(part + '==='.slice((part.length + 3) % 4))).getDataAsString();
    const exp = JSON.parse(json).exp;
    return exp ? new Date(exp * 1000) : null;
  } catch (e) {
    return null;
  }
}

/** Trả về chuỗi cảnh báo nếu token sắp/đã hết hạn, ngược lại ''. */
function checkTokenExpiry_() {
  const exp = tokenExpiry_();
  if (!exp) return '';
  const daysLeft = (exp.getTime() - Date.now()) / 86400000;
  const when = Utilities.formatDate(exp, CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm');
  if (daysLeft <= 0) return 'Token đã hết hạn lúc ' + when + '. Lấy token mới (README.md) và cập nhật AUTH_TOKEN.';
  if (daysLeft < CONFIG.TOKEN_WARN_DAYS) return 'Token hết hạn lúc ' + when + ' (còn ' + daysLeft.toFixed(1) + ' ngày). Lấy token mới (README.md) và cập nhật AUTH_TOKEN.';
  return '';
}

/* ====================== Helpers ====================== */

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
