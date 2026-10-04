# Tự động tạo task TimeBoxing tuần sau (Google Apps Script)

Mỗi **Thứ 7, khoảng 16:00–17:00** (giờ VN), script tạo task cho **Thứ 2 → Thứ 7 tuần sau**:
- Mỗi ngày **6 task** từ 6 template "Ngày – Chủ động" (Nhân sự, Hậu kiểm data Chatbox + Danh bạ, Tài chính Bu Ads,
  Triển khai chatbox AI, Mastercy QC, Plan). Tiêu đề có ngày tương ứng, ví dụ `[Nhân sự] Hậu kiểm nhân sự ngày 05.10`
- Dùng template đã chọn (copy icon, nội dung kết quả… y như bấm "Chọn Template")
- Thời gian bắt đầu = ngày đó, **23:45**

Chạy trên server của Google → **không cần mở máy**.

## Nguyên lý
Apps Script không bấm được giao diện, nên nó gọi thẳng API mà app TimeBoxing dùng
(đã xác định từ mã nguồn app, không cần bắt request bằng DevTools nữa):

| Việc | Request |
|---|---|
| Đọc template | `POST https://api-timeboxing.merchant.vn/task/template` `{"action":"READ"}` |
| Kiểm tra trùng | `POST https://api-timeboxing.merchant.vn/task/get_tasks` `{"assignment_task":…, "limit":200}` |
| Tạo task | `POST https://api-timeboxing.merchant.vn/task/create_task` — gửi luôn `start_time` (mili-giây), không cần bước "Chọn" giờ riêng |

Xác thực: header `Token-Business: <token>`. Token có **hạn 30 ngày**.

## Lấy token (`token_business`)
1. Mở https://merchant.vn/a/timeboxing trên Chrome (đã đăng nhập) → `F12` → tab **Console**.
2. Dán lệnh sau rồi Enter. Token được copy vào clipboard (không hiện ra màn hình):
   ```js
   copy(new URL(document.querySelector('iframe[src*="timeboxing"]').src).searchParams.get('token_business'))
   ```
3. Dán vào Script Property `AUTH_TOKEN` (bước dưới). **Không gửi token cho ai.**

## Cài script (1 lần)
1. Vào https://script.google.com → **New project** → dán nội dung `Code.gs`.
2. **Project Settings → Script Properties** → thêm `AUTH_TOKEN` = token vừa copy.
3. Chạy `listTemplates` → Log hiện danh sách template + hạn token (kiểm tra token dùng được).
4. Giữ `DRY_RUN: true`, chạy `createNextWeekTasks` → Log hiện các task *sẽ* tạo.
5. (Tuỳ chọn) Chạy `testOne` — tạo thật task đầu tiên cho ngày `TEST_DATE`; bỏ qua nếu đã có.
6. Đổi `DRY_RUN: false`, chạy `installTrigger` **1 lần** (cấp quyền khi được hỏi). Xong.

## Vận hành
| Tình huống | Xử lý |
|---|---|
| Lỗi bất kỳ | Script gửi email báo lỗi về Gmail chủ script |
| Token còn < 7 ngày | Script gửi email nhắc → lấy token mới (mục trên) → cập nhật `AUTH_TOKEN` |
| Token hết hạn (HTTP 401/403) | Như trên |
| Đã tạo tay task cùng tiêu đề | Script thấy trên merchant và bỏ qua, không tạo trùng |
| Chạy lại 2 lần | Không tạo trùng (lưu danh sách đã tạo trong Script Properties) |
| Muốn tạo lại | Chạy `resetDone` |
| Thêm loại task khác mỗi ngày | Thêm `{title, templateId}` vào `CONFIG.TASKS` (id lấy từ `listTemplates`) |

Template hiện có (04/10/2026): `234778` Hậu kiểm nhân sự · `282241` Hậu kiểm data Chatbox + Danh bạ ·
`59262` Triển khai chatbox AI · `59146` Xác nhận tiền chuyển Bu Ads · `59137` Kiểm tra QC Mastercy ·
`59139` Kế hoạch công việc hàng ngày · `59140` Xử lý việc không tên (bị động).

## Ảnh "Kế hoạch công việc" trong task [Plan]
Apps Script không chụp được màn hình, nên phần này chạy bằng **Scheduled task trên app Claude desktop**
(`timeboxing-plan-screenshots`, Thứ 7 ~17:00, sau khi script đã tạo task lúc 16h):
- Kiểm tra đủ 6 task/ngày cho tuần sau (tạo bù nếu script lỗi).
- Chụp nhóm task từng ngày ở cột "Sắp diễn ra" → upload lên merchant (`api.merchant.vn/v1/internals/attachment/upload`)
  → chèn ảnh dưới mục "1. Các công việc trong ngày" của task `[Plan] Kế hoạch công việc hàng ngày dd.MM`.
- Cần: Mac bật, app Claude mở, Chrome mở và đã đăng nhập merchant.vn. Nếu lúc đó máy tắt, task chạy khi mở app lại
  (hoặc bấm **Run now** trong mục Scheduled).
