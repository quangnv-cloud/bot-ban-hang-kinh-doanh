# Tự động tạo task TimeBoxing tuần sau (Google Apps Script)

Mỗi **Thứ 7, khoảng 16:00–17:00** (giờ VN), script tạo task cho **Thứ 2 → Thứ 7 tuần sau**:
- Tiêu đề có ngày tương ứng, ví dụ `[Nhân sự] Hậu kiểm nhân sự ngày 05.10`
- Dùng template đã chọn
- Thời gian bắt đầu = ngày đó, **23:45**

Chạy trên server của Google → **không cần mở máy**.

## Nguyên lý (đọc trước)
Apps Script **không bấm được giao diện** merchant.vn. Nó gửi thẳng các request API mà trang web
gửi khi bạn bấm "Tạo và xem chi tiết" và "Chọn". Vì vậy cần bắt 2 request đó **1 lần duy nhất**.

## Bước 1 — Bắt request API (10 phút)
1. Mở `merchant.vn/a/timeboxing` trên Chrome → `F12` → tab **Network** → bật lọc **Fetch/XHR**.
2. Làm tay 1 task như bình thường: `+` → Tạo công việc → Chọn template → **Tạo và xem chi tiết**.
3. Trong Network, tìm request vừa xuất hiện (thường là POST, tên kiểu `task`, `create`...).
   Chuột phải → **Copy → Copy as cURL (bash)**.
4. Đặt **Thời gian bắt đầu** = 23:45 → **Chọn**. Copy cURL của request mới xuất hiện (thường PUT/PATCH).
5. Gửi 2 cURL đó cho Claude (**nhớ xoá giá trị token trước khi gửi**) hoặc tự điền vào `CONFIG.API`:
   - `url`, `method`, `body` → thay giá trị cụ thể bằng placeholder `{{TITLE}}`, `{{TEMPLATE_ID}}`,
     `{{TASK_ID}}`, `{{START_ISO}}` / `{{START_MS}}` / `{{START_SEC}}` (tuỳ định dạng thời gian API dùng).
   - `idPath`: đường dẫn tới id task trong response của request tạo (xem tab **Response**).
   - `AUTH_HEADER` / `AUTH_PREFIX`: tên header chứa token (xem **Request Headers**).

## Bước 2 — Cài script
1. Vào https://script.google.com → **New project** → dán nội dung `Code.gs`.
2. **Project Settings → Script Properties** → thêm `AUTH_TOKEN` = token lấy từ request header.
3. Giữ `DRY_RUN: true`, chạy `preview` rồi `createNextWeekTasks` → xem Log, kiểm tra đúng.
4. Đổi `DRY_RUN: false`, chạy `testOne` → kiểm tra trên merchant.vn đã có task đúng template và giờ bắt đầu.
5. Chạy `installTrigger` **1 lần** (cấp quyền khi được hỏi). Xong.

## Vận hành
| Tình huống | Xử lý |
|---|---|
| Lỗi bất kỳ | Script gửi email báo lỗi về Gmail chủ script |
| Token hết hạn (HTTP 401/403) | Lấy token mới từ DevTools → cập nhật `AUTH_TOKEN` |
| Chạy lại 2 lần | Không tạo trùng (lưu danh sách đã tạo trong Script Properties) |
| Muốn tạo lại | Chạy `resetDone` |
| Thêm loại task khác mỗi ngày | Thêm phần tử vào `CONFIG.TASKS` |
