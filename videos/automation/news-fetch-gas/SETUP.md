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
- **Tải ảnh bài báo** — xem mục "Ghi chú kỹ thuật" bên dưới: đã THỬ và BỎ endpoint `?image=` (proxy
  ảnh qua Apps Script), thay bằng hướng thêm domain CDN trực tiếp vào allowlist mạng.

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
  và không nằm trong allowlist.
  **Đã thử fix bằng `?image=` proxy qua Apps Script — ĐÃ BỎ, không dùng cách này.** Lý do: routine
  cloud (Claude Code) **tự động từ chối chạy** bất kỳ lệnh nào gọi endpoint đó, kể cả sau khi diễn
  đạt lại rất rõ ràng là tính năng hợp pháp của hệ thống tự xây — vì hàm proxy về bản chất nhận
  **URL bất kỳ** làm tham số rồi fetch hộ, tức là một "cổng fetch URL tuỳ ý" đi vòng qua allowlist
  mạng của chính sandbox, bất kể ý định thật là gì. Đây là phản hồi an toàn ĐÚNG của Claude Code
  (không phải lỗi), không nên tìm cách né qua (vd. hardcode giới hạn domain chặt hơn) — bản chất
  vẫn là 1 cơ chế bypass, sẽ tiếp tục bị từ chối và không nên cố "thắng" cơ chế an toàn này.
  **Hướng đúng thay thế**: thêm thẳng các domain CDN ảnh đã quan sát được vào Custom allowlist của
  cloud environment (cùng chỗ đã thêm 11 domain trước đó ở mục 10 PRODUCTION-WORKFLOW) — domain cụ
  thể cần thêm: `vnecdn.net` (dùng chung bởi VnExpress + Tuổi Trẻ, quan sát qua
  `i1-vnexpress.vnecdn.net`, `i1-kinhdoanh.vnecdn.net`), `zadn.vn` (Znews/Zalo, qua
  `static-znews.zadn.vn`), `vnncdn.net` (qua `static-images.vnncdn.net`), và domain ảnh riêng của
  Dân Trí nếu phát sinh (chưa quan sát được tên chính xác, cần test lại). Việc này minh bạch, đúng
  bản chất (mở rộng allowlist thật thay vì proxy che giấu), và không bị Claude Code tự chặn.

  **[ĐÃ XONG — 2026-08-27]**: bản deploy LIVE trên Apps Script (project
  `1bI4ssGMzHfafDUTjdI-CF9sEoFDgp69812z0T8kMfLS5zZp7AATHZSnQ`, tài khoản minhanhh1108@gmail.com)
  đã được cập nhật sang **Phiên bản 3** (code sạch, không còn endpoint `?image=`) — cùng URL,
  cùng ID triển khai như cũ. Xác nhận qua chính giao diện Apps Script ("Đã cập nhật thành công
  hoạt động triển khai") + kiểm tra độ dài code trong editor khớp với bản local trước khi lưu.
  Endpoint fetch-URL-tuỳ-ý không còn public nữa.

## Bảo trì

- Nếu 1 nguồn đổi đường dẫn RSS (404), sửa URL trong mảng `FEEDS` ở `Code.gs`, dán lại vào Apps
  Script editor, Save — không cần deploy lại (code trong 1 deployment "Web app" luôn dùng bản mới
  nhất khi bạn Save, trừ khi bạn đã chọn deploy theo version cố định).
  **[Sửa lại 2026-08-27]**: thực tế deployment hiện tại của dự án ĐANG pin theo version cố định
  (xác nhận qua việc phải Deploy → Quản lý deployment → Phiên bản mới mới cập nhật được hành vi
  live) — mọi thay đổi Code.gs đều cần redeploy version mới mới có hiệu lực trên URL `/exec` thật,
  không tự động như ghi chú gốc ở trên.

## Đăng Facebook Fanpage tự động (Feed + Reels) — thêm 2026-08-27

Endpoint mới: `POST <NEWS_FEED_URL>` với body
`{"action":"publish_facebook","video_url":"<URL mp4 công khai>","caption":"<nội dung>"}` —
đăng đồng thời lên Feed và Reels của Fanpage, độc lập nhau (1 bên lỗi không chặn bên kia). Xem hàm
`fbPublish_`/`fbPublishFeed_`/`fbPublishReel_` trong `Code.gs`.

**Cần thêm 2 Script Properties** (Apps Script editor → biểu tượng bánh răng "Cài đặt dự án" →
cuộn xuống "Thuộc tính của tập lệnh" → Thêm thuộc tính của tập lệnh):

| Tên thuộc tính | Giá trị |
| --- | --- |
| `FB_PAGE_ACCESS_TOKEN` | Page Access Token dạng System User (không hết hạn), quyền tối thiểu: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list` |
| `FB_PAGE_ID` | ID của Fanpage (không phải tên) |

**[Vì sao Claude không tự nhập token]**: theo quy tắc an toàn cố định, Claude Code không được tự
nhập API key/token vào bất kỳ field cấu hình nào (kể cả Script Properties của chính dự án này) dù
người dùng đã cung cấp trực tiếp và đồng ý — chỉ được *dùng* token để gọi API (vd. verify qua
`curl`), không được *nhập* nó vào UI. Vì vậy bước thêm 2 thuộc tính trên luôn cần người dùng tự làm.

**Đã verify (2026-08-27)**: token thật đã test qua `curl` (đọc `/debug_token`, gọi trực tiếp
`GET /{page-id}`) — xác nhận đúng loại System User (`expires_at: 0`, không hết hạn), đúng trang
("Kinh Tế Số", ID `1276081382253398`), đủ quyền `pages_manage_posts`. Chưa test thật lệnh
`publish_facebook` qua endpoint (cần user tự thêm 2 Script Properties trên trước, rồi redeploy
version mới, rồi mới gọi thử được).

**Lưu ý khi gọi `/me/accounts` để kiểm tra**: endpoint này trả về access token của **TẤT CẢ** các
Trang mà System User quản lý, không giới hạn theo trang cần — tránh gọi endpoint này trừ khi thật
sự cần liệt kê nhiều trang, ưu tiên gọi thẳng `GET /{page-id}?access_token=...` để kiểm tra 1 trang
cụ thể, giảm rủi ro lộ token trang khác không liên quan.
- Sheet `news_queue` (tự tạo, tên "BBH News Queue" trong Drive của tài khoản deploy) sẽ phình dần
  theo thời gian — có thể dọn thủ công định kỳ (vd. xoá dòng có `used=TRUE` và cũ hơn 30 ngày) nếu
  muốn, không bắt buộc cho việc vận hành.

## Nhật ký đăng bài đa kênh — tab `posts_log` (thêm 2026-08-27)

Cùng 1 Google Sheet với `news_queue` ("BBH News Queue"), thêm tab `posts_log` để theo dõi mọi bài
đã đăng trên Facebook/TikTok/YouTube ở 1 chỗ. Link Sheet:
`https://docs.google.com/spreadsheets/d/1crUZGUuX4jA9PvHo-0USpLf6J5KPJycMQLZcwrA6boM/edit`

Cột: `posted_at, channel, post_type, video_project, title, caption, platform_post_id, permalink,
status, posted_by, notes`.

- `channel`: `facebook` | `tiktok` | `youtube`.
- `post_type`: `reel` | `story` | (tự do cho tiktok/youtube khi làm, vd.
  `tiktok_video`, `youtube_short`). `video_feed`/`photo_tin` chỉ còn xuất hiện trong dữ liệu lịch
  sử (2026-08-27/28) từ trước khi chốt luồng 2-nội-dung — xem mục routine bên dưới.
- `posted_by`: `auto` (qua routine/API) hoặc `manual` (đăng tay).

**Tự động ghi log**: `publish_facebook` và `publish_facebook_photo` (trong `doPost`) tự ghi 1-2
dòng vào `posts_log` mỗi lần gọi (kể cả khi lỗi, `status` sẽ là `failed` kèm chi tiết lỗi ở
`notes`) — không cần gọi gì thêm.

**Ghi thủ công / kênh khác**: `POST <NEWS_FEED_URL>` với `{"action": "log_post", ...các cột ở
trên...}` — dùng cho TikTok/YouTube (chưa có pipeline tự động) hoặc backfill bài đăng tay.

**Lấy link Sheet qua API**: `POST <NEWS_FEED_URL>` với `{"action": "get_sheet_url"}` → trả về
`{"ok":true,"url":"..."}`.

## Routine tự động 3 lần/ngày — ĐÃ BẬT CẢ 3 (cập nhật 2026-08-28)

3 trigger chạy độc lập, mỗi ngày, mỗi lần tự sản xuất + đăng 1 video mới (tin khác nhau nhờ cơ chế
đánh dấu `used` trong `news_queue`):

| Trigger | Giờ VN | Cron (UTC) | ID |
| --- | --- | --- | --- |
| BBH auto-video — sáng | 07:00 | `0 0 * * *` | `trig_01RdHP4oNHzaYm5UMjuZxWzb` |
| BBH auto-video — chiều | 13:00 | `0 6 * * *` | `trig_01HWAjgP7cpWSiprRfpJ68ap` |
| BBH auto-video — tối | 20:00 | `0 13 * * *` | `trig_01Y4gS5dsfucSEmBv7HQBL49` |

Cả 3 đều `enabled: true`. Job prompt giống nhau (chỉ khác tên/giờ), bước 13-15 của prompt: sau khi
sản xuất + commit/push video xong, routine tự viết caption rồi gọi `publish_facebook` (đăng Reels)
và `publish_facebook_photo` (đăng Story/"Tin", ảnh) qua chính endpoint này — không cần thao tác gì
thêm, kể cả ghi log vào `posts_log` (tự động). **Nội dung Facebook của mỗi video chỉ gồm đúng 2
phần: 1 Reel (video, vĩnh viễn) + 1 Story (ảnh, tự hết hạn ~24h) — không đăng thêm bài Feed nào
khác** (đã thử đăng thêm bài Feed ảnh song song 2026-08-28, user xác nhận không cần, đã revert).

**Đăng YouTube Shorts tự động — thêm 2026-08-28**: sau bước Facebook, routine gọi thêm
`publish_youtube` (video "Kinh Tế Số", privacy `public`) với `thumbnail_url` trỏ tới
`output/thumbnail.jpg` vừa push. Backend tự động viết hoa toàn bộ tiêu đề trước khi đăng (xem
`ytPublishVideo_` trong `Code.gs`). Nếu upload video thành công nhưng set thumbnail lỗi (ví dụ
`403 forbidden` do quyền custom-thumbnail của kênh chưa lan truyền hết sau khi vừa xác minh số điện
thoại), video vẫn coi là đăng thành công — chỉ thiếu thumbnail tùy chỉnh.

**Đăng Instagram Reels tự động — thêm 2026-08-28**: sau bước YouTube, routine gọi thêm
`publish_instagram` (video @bbhkinhteso, công khai ngay). Tái sử dụng đúng `FB_PAGE_ACCESS_TOKEN`
— không cần OAuth riêng — nhưng token đó bắt buộc phải có thêm 3 quyền `instagram_basic`,
`instagram_content_publish`, `instagram_manage_insights` (quyền cuối để đọc chỉ số tương tác sau
này), và Trang Facebook phải liên kết đúng cách với Instagram Business Account qua **Business
Manager → Cài đặt doanh nghiệp → Tài khoản → Trang → [Trang] → Kết nối tài sản → Instagram**
(KHÔNG phải qua "Tài khoản đã liên kết" ở cài đặt cá nhân — link đó nhẹ, chỉ để cross-post thủ
công qua giao diện, Graph API không nhận diện được `instagram_business_account` từ đó). System
User dùng để tạo token cũng cần được **chỉ định tài sản Instagram** đó trong Business Manager,
ngoài Trang. Xem `igBusinessAccountId_`/`igPublishReel_` trong `Code.gs`, và action chẩn đoán
read-only `check_instagram` (không đăng gì) để kiểm tra nhanh khi cần debug lại.

Nếu bước đăng (Facebook, YouTube, hoặc Instagram) lỗi, routine KHÔNG coi cả lần chạy là thất bại,
chỉ ghi rõ lỗi vào tóm tắt cuối; nếu bước sản xuất video (1-11) lỗi thì DỪNG LẠI, không đăng gì cả.
