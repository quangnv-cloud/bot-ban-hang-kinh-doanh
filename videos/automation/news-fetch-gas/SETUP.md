# Setup — News Fetch Proxy (Google Apps Script)

Lớp lấy tin cho cloud routine của kênh BOT BÁN HÀNG · KINH DOANH. Xem kiến trúc tổng thể ở mục 10
của `../../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`.

**[Cập nhật 2026-08-26 — ĐÃ DEPLOY THÀNH CÔNG, xem URL thật + bài học ở cuối file]**

## ⚠️ Bắt buộc dùng Gmail cá nhân, KHÔNG dùng Google Workspace

Đã thử deploy trên tài khoản Workspace (`@botbanhang.vn`) trước — chọn "Bất kỳ ai" (Anyone) trong
lúc deploy nhưng request ẩn danh (không đăng nhập) vẫn bị **403 Forbidden** ngay lập tức. Nguyên
nhân: chính sách quản trị Workspace chặn chia sẻ Apps Script ra ngoài tổ chức, **đè lên** cài đặt
"Bất kỳ ai" của riêng script — không có cách nào sửa từ phía người dùng thường, phải nhờ admin
domain mở chính sách đó (phức tạp, không khuyến nghị).

**→ Luôn deploy bằng 1 tài khoản Gmail cá nhân (không phải Workspace).** Nếu Chrome bạn đang dùng
chưa có Gmail cá nhân nào đăng nhập: bấm avatar tài khoản Google (góc trên phải bất kỳ trang
Google nào) → "Thêm tài khoản khác" → đăng nhập Gmail cá nhân → chuyển sang tài khoản đó.

## Các bước (làm 1 lần)

1. Đảm bảo đang ở đúng tài khoản Gmail cá nhân (không phải Workspace) — kiểm tra avatar góc trên
   phải tại `script.google.com`.
2. Vào **script.google.com** → **"Dự án mới"** (New project) — tạo project **standalone**, KHÔNG
   cần tạo Google Sheet trước (script tự tạo Sheet riêng ở lần chạy đầu tiên, xem giải thích ở mục
   "Ghi chú kỹ thuật" bên dưới).
3. Xoá code mẫu, dán toàn bộ nội dung `Code.gs` (file cùng thư mục này) vào.
4. Lưu project (`Ctrl+S`), đặt tên tuỳ ý (vd. "BBH News Fetch").
5. Chạy thử: chọn hàm `fetchAndStore` ở dropdown trên thanh công cụ → **Run**. Lần đầu Google sẽ
   yêu cầu cấp quyền (Authorize) — chấp nhận (script chỉ đọc RSS công khai + tạo/ghi 1 Google
   Sheet riêng của chính script, không đụng dữ liệu khác). Kiểm tra "Nhật ký thực thi" thấy dòng
   `fetchAndStore: added N new item(s)` là thành công.
6. Chọn hàm `installHourlyTrigger` ở dropdown → **Run** một lần — tự tạo lịch chạy `fetchAndStore`
   mỗi giờ. Có thể chạy lại hàm này bất cứ lúc nào để "reset" trigger nếu cần đổi, không tạo trùng.
7. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (Bất kỳ ai) — với Gmail cá nhân, đây là lựa chọn thật sự công khai
     (không giống Workspace)
   - Bấm Deploy → có thể cần bấm "Ủy quyền truy cập" (Authorize access) một lần nữa, cho quyền
     thực thi web app → copy **Web app URL** (dạng `https://script.google.com/macros/s/XXXX/exec`).
8. **Verify ngay**: mở URL đó trên trình duyệt KHÔNG đăng nhập (hoặc dùng `curl` — lưu ý mục "Ghi
   chú kỹ thuật" bên dưới về việc test từ máy cá nhân có thể cho kết quả sai) — phải thấy JSON
   dạng `{"items":[...]}`.

## Cách cloud routine dùng

- Lấy danh sách ứng viên: `GET <URL>?category=business` (hoặc bỏ `category` để lấy cả tin thời sự
  tổng hợp lẫn kinh doanh — routine tự cân nhắc theo mục 1 trong PRODUCTION-WORKFLOW, ưu tiên góc
  độ kinh doanh/tác động kinh tế).
- Sau khi chọn 1 tin để dựng video: `POST <URL>` với body
  `{"id": "<id của item đã chọn>", "video": "<tên thư mục project video>"}` để đánh dấu đã dùng,
  tránh 7h/12h30/19h30 cùng ngày trùng tin.
- **Tải ảnh bài báo** (bắt buộc cho Hook/Article Image Card, xem "Ghi chú kỹ thuật" bên dưới về lý
  do cần bước này): `GET <URL>?image=<url ảnh gốc đã url-encode>` → trả JSON
  `{"ok": true, "contentType": "...", "base64": "..."}`. Giải mã base64 để lấy file ảnh thật, vd.
  ```bash
  curl -sSL "<URL>?image=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "https://cdn2.tuoitre.vn/...jpg")" \
    | python3 -c "import json,base64,sys; d=json.load(sys.stdin); open('photo.jpg','wb').write(base64.b64decode(d['base64']))"
  ```

## Ghi chú kỹ thuật (bài học từ lần deploy 2026-08-26)

- **`getSheet_()` trong `Code.gs` tự tạo Google Sheet riêng** (dùng `PropertiesService` lưu lại ID
  Sheet đã tạo, lần sau mở lại đúng Sheet đó) thay vì cần một Sheet có sẵn để "bind" script vào —
  đơn giản hoá bước setup, không cần thao tác Google Sheets thủ công nào cả, chỉ cần Apps Script.
- **Test bằng `curl` từ máy cá nhân có thể cho kết quả SAI (403) dù deployment đúng** — đã xác
  minh: cùng 1 URL, `curl` từ máy Windows cục bộ trả về 403 Forbidden ngay lập tức, nhưng gọi từ
  môi trường cloud sandbox (nơi routine thật sẽ chạy) trả về đúng `302` → theo redirect ra JSON
  thật (285 tin, đã verify). Nguyên nhân nghi là mạng/ISP/proxy phía máy cá nhân chặn domain
  `script.google.com`, không liên quan gì đến cấu hình deploy. **Bài học: luôn verify endpoint từ
  đúng môi trường sẽ gọi nó (cloud sandbox), đừng kết luận "lỗi" chỉ dựa trên test từ máy cá
  nhân.**
- URL đã deploy + verify thành công (2026-08-26, tài khoản Gmail cá nhân minhanhh1108@gmail.com):
  `https://script.google.com/macros/s/AKfycbxIQa9BsNnTAsIs2MWBNCsT8zh7_lT9OIKn8srfQ5D3wks0AM88VrjHNvCpYTAEaA7n/exec`
  — `?category=business` trả 74 tin, không filter trả 285 tin, cả hai đều JSON hợp lệ.
- **[Phát hiện từ bài test pipeline đầy đủ đầu tiên, 2026-08-26]** Routine cloud đọc được tin/text
  bài báo bình thường (domain gốc `vnexpress.net`/`dantri.com.vn`/`tuoitre.vn`/`znews.vn` đã nằm
  trong allowlist egress), nhưng **KHÔNG tải được ảnh bài báo** — ảnh luôn nằm ở domain CDN RIÊNG
  (vd. `cdn2.tuoitre.vn`, `i1-vnexpress.vnecdn.net`, `static-znews.zadn.vn`), khác hẳn domain gốc
  và không nằm trong allowlist. Thêm từng domain CDN vào allowlist không bền vững (mỗi báo có
  nhiều CDN, có thể đổi). **Fix**: thêm endpoint `?image=` ở trên — Apps Script chạy trên server
  Google, KHÔNG bị egress policy phía client chi phối, nên proxy ảnh qua đây luôn hoạt động bất kể
  ảnh nằm ở CDN nào, miễn routine chỉ cần gọi domain `script.google.com` đã được allowlist sẵn.

## Bảo trì

- Nếu 1 nguồn đổi đường dẫn RSS (404), sửa URL trong mảng `FEEDS` ở `Code.gs`, dán lại vào Apps
  Script editor, Save — không cần deploy lại (code trong 1 deployment "Web app" luôn dùng bản mới
  nhất khi bạn Save, trừ khi bạn đã chọn deploy theo version cố định).
- Sheet `news_queue` (tự tạo, tên "BBH News Queue" trong Drive của tài khoản deploy) sẽ phình dần
  theo thời gian — có thể dọn thủ công định kỳ (vd. xoá dòng có `used=TRUE` và cũ hơn 30 ngày) nếu
  muốn, không bắt buộc cho việc vận hành.
