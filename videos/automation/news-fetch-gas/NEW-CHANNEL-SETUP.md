# Checklist — Dựng luồng mới trên máy mới / tài khoản mới

Dùng khi: nhân bản hệ thống này cho **1 tuyến nội dung khác** (kênh xã hội khác, chủ đề khác),
trên **1 máy khác** và/hoặc **1 bộ tài khoản khác**. Không phải bước "chuyển" luồng hiện tại
(BOT BÁN HÀNG · KINH DOANH) sang máy khác — nếu chỉ đổi máy nhưng giữ nguyên kênh/tài khoản, chỉ
cần bước 1-2 rồi đăng nhập lại đúng tài khoản Google/mạng xã hội cũ, không cần làm lại từ B.

Đọc trước khi bắt đầu: [../../BOT-BAN-HANG-Quy-trinh-San-xuat-Video.pptx](../../BOT-BAN-HANG-Quy-trinh-San-xuat-Video.pptx)
(tổng quan) + `SETUP.md` (chi tiết kỹ thuật từng bước, cùng thư mục này).

**Không copy cả repo `bot-ban-hang-kinh-doanh`** — chỉ cần đúng 2 file trong thư mục này
(`Code.gs` + `SETUP.md`). Các folder video project khác trong repo (vd. `100-doanh-nghiep-...`)
là dữ liệu render của tuyến cũ, không liên quan tuyến mới, rất nặng (hàng nghìn file cache).

Link lấy 2 file (repo public, không cần đăng nhập):
- `Code.gs`: `https://raw.githubusercontent.com/quangnv-cloud/bot-ban-hang-kinh-doanh/master/videos/automation/news-fetch-gas/Code.gs`
- `SETUP.md`: `https://raw.githubusercontent.com/quangnv-cloud/bot-ban-hang-kinh-doanh/master/videos/automation/news-fetch-gas/SETUP.md`

**[Cập nhật 2026-09-04 — Code.gs đã đơn giản hơn cho tuyến mới]**:
- Ảnh bài báo giờ TỰ ĐỘNG: `Code.gs` parse URL ảnh từ RSS, và route `GET <exec>?image=<news_id>`
  tải + cache ảnh phía Google. **Tuyến mới KHÔNG cần đụng gì tới egress allowlist ảnh** — bỏ qua
  toàn bộ phần "domain CDN ảnh" trong `SETUP.md` (đó là cách cũ, đã bỏ).
- Trước khi dán `Code.gs`: sửa `var STYLE_CURSOR_SEED = 6;` → `= 9` (để video đầu tiên của tuyến
  mới dùng style index 0). Có thể đổi `NEWS_IMAGE_FOLDER_NAME` sang tên riêng của tuyến nếu muốn.
- Khi chạy `fetchAndStore` lần đầu, Google sẽ xin thêm quyền Google Drive (để cache ảnh) — cứ cấp.

---

## A. Máy mới — cài phần mềm (1 lần/máy)

- [ ] Cài **Claude Code**.
- [ ] Cài **Node.js** (LTS) + npm.
- [ ] Cài **HyperFrames CLI**: `npx hyperframes --version` để xác nhận chạy được (npx tự tải khi
      cần, không cần cài global).
- [ ] Copy/clone 2 file `Code.gs` + `SETUP.md` (từ thư mục này) vào máy mới, giữ nguyên tên
      thư mục `automation/news-fetch-gas/` nếu muốn giữ đường dẫn tham chiếu nhất quán.

## B. Tài khoản Google riêng cho tuyến mới (1 lần/tuyến)

- [ ] Tạo **1 Gmail cá nhân mới** (KHÔNG dùng Google Workspace — xem lý do ở đầu `SETUP.md`,
      Workspace chặn Apps Script chia sẻ "Anyone" bởi chính sách quản trị).
- [ ] Đăng nhập Gmail đó trên trình duyệt máy mới.

## C. Apps Script project mới (1 lần/tuyến) — làm theo `SETUP.md` mục "Các bước (làm 1 lần)"

- [ ] `script.google.com` → **Dự án mới** (standalone, không cần tạo Sheet trước).
- [ ] Dán `Code.gs` vào. **Sửa 2 chỗ nội dung** (phần còn lại là logic dùng chung, KHÔNG đụng):
      (1) mảng `FEEDS` — đổi sang RSS phù hợp chủ đề/thị trường của tuyến mới;
      (2) `var STYLE_CURSOR_SEED = 6;` → `= 9` (video đầu tuyến mới bắt đầu từ style index 0).
- [ ] Chạy `fetchAndStore` 1 lần → cấp quyền (lần này có cả quyền Google Drive để cache ảnh, cứ
      cấp) → xác nhận log "added N new item(s)".
- [ ] Chạy `installHourlyTrigger` 1 lần.
- [ ] **Deploy → New deployment** → Web app, Execute as: Me, Who has access: Anyone → copy
      **exec URL mới** (khác hẳn URL của tuyến BOT BÁN HÀNG · KINH DOANH — 2 tuyến 2 URL riêng).
- [ ] Verify URL trả JSON `{"items":[...]}` — nhớ test **từ đúng môi trường routine sẽ chạy**
      (cloud sandbox), test từ máy cá nhân có thể báo lỗi sai (xem "Ghi chú kỹ thuật" trong
      `SETUP.md`).
- [ ] Verify thêm: mỗi item có `hasImage`/`imageUrl`; `GET <exec>?image=<id 1 tin có hasImage:true>`
      trả `{"ok":true,...,"data":"<base64>"}`. `POST <exec> {"action":"style_state"}` trả
      `last_used_index: 9, next_index: 0`.

## D. Đăng ký app cho từng nền tảng đăng bài (1 lần/tuyến, chỉ làm cho kênh nào tuyến mới thật sự dùng)

Mỗi nền tảng cần **app/token riêng cho kênh mới**, không dùng lại token của kênh cũ.

- [ ] **Facebook**: tạo/dùng 1 app Meta for Developers → lấy Page Access Token dạng System User
      (không hết hạn), quyền `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`.
- [ ] **Instagram**: chuyển tài khoản IG sang Business/Creator, liên kết đúng Trang Fac mới qua
      **Business Manager → Cài đặt doanh nghiệp → Tài khoản → Trang → Kết nối tài sản → Instagram**
      (không phải link cá nhân) + thêm 3 quyền `instagram_basic`, `instagram_content_publish`,
      `instagram_manage_insights` vào token ở bước Facebook.
- [ ] **YouTube**: tạo OAuth Client (Google Cloud Console) cho kênh mới, lấy refresh token qua
      OAuth Playground với đủ scope `youtube.upload` + `youtube.readonly` (thiếu
      `youtube.readonly` sẽ đăng được nhưng đọc số liệu bị 403).
- [ ] **Threads**: thêm sản phẩm Threads API vào app Meta, mời tài khoản Threads đích làm
      **Threads Tester** (chấp nhận lời mời tại `threads.com/settings/website_permissions` →
      tab "Lời mời"), tạo token qua "Công cụ tạo mã người dùng" (đã long-lived sẵn, không cần
      exchange).
- [ ] Điền toàn bộ token/ID vào **Script Properties** của Apps Script project MỚI (không phải
      project cũ) — Cài đặt dự án → Thuộc tính của tập lệnh.

## E. Giọng đọc + brand riêng cho tuyến mới

- [ ] Tài khoản ElevenLabs (dùng chung tài khoản cũ được nếu vẫn muốn cùng giọng đọc; tạo giọng
      mới nếu muốn nhận diện âm thanh khác).
- [ ] Viết 1 file brand system mới (logo, màu, font, style HyperFrames) cho tuyến mới — copy
      cấu trúc từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` làm mẫu, đổi nội dung.

## F. Đưa Claude vào việc

- [ ] Đưa Claude (máy mới) đọc: `Code.gs` đã sửa `FEEDS`, exec URL mới, brand system mới của
      tuyến mới, và mô tả ngắn gọn tiêu chí chọn bài + khung giờ đăng mong muốn.
- [ ] Nhờ Claude tạo project HyperFrames mẫu đầu tiên để chốt style trước khi bật lịch tự động.
- [ ] Sau khi ưng 1-2 video mẫu, nhờ Claude tạo lịch cloud routine (giống 3 khung giờ
      7h/13h/20h của tuyến cũ, hoặc khung giờ khác tuỳ tuyến mới) — tham khảo mục "Routine tự
      động 3 lần/ngày" trong `SETUP.md` làm mẫu prompt.

---

**Việc KHÔNG cần làm lại**: kiến trúc Sheet (`news_queue`/`posts_log`/`engagement_metrics`), cơ
chế chống đăng trùng (`alreadyPublished_`), logic dedupe tin, engagement tracker — toàn bộ nằm
sẵn trong `Code.gs`, chỉ cần deploy là có, không phải viết lại dòng code nào cho các phần này.
