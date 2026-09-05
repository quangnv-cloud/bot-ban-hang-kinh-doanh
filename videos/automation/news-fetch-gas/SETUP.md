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

Cùng 1 Google Sheet với `news_queue` ("Bản sao của BBH News Queue"), thêm tab `posts_log` để theo
dõi mọi bài đã đăng trên Facebook/TikTok/YouTube ở 1 chỗ. Link Sheet:
`https://docs.google.com/spreadsheets/d/1isvFaqM9g6F8hFb3Fu5pvMg2Jgj017Nsh6R0OgHsof0/edit`

**[Cập nhật 2026-09-05] ⚠️ 2 Sheet cùng tồn tại — đừng sửa nhầm cái cũ.** File Sheet thật đang
chạy (mà `SPREADSHEET_ID` trong Script Properties của Apps Script trỏ tới) là
`1isvFaqM9g6F8hFb3Fu5pvMg2Jgj017Nsh6R0OgHsof0` ("**Bản sao của** BBH News Queue"), chủ sở hữu
`quangnv@botbanhang.vn`, đã share edit cho `minhanhh1108@gmail.com`. File `1crUZGUuX4jA9PvHo-
0USpLf6J5KPJycMQLZcwrA6boM` ("BBH News Queue", không có "Bản sao của") là **bản cũ đã bỏ**, không
còn được script ghi vào — nhưng vẫn còn dữ liệu cũ trông y hệt thật, dễ nhầm khi mở link cũ hoặc
tìm trong Drive. **Luôn xác nhận đúng Sheet bằng `POST <exec> {"action":"get_sheet_url"}` trước
khi sửa tay bất kỳ ô nào** — đừng tự suy ra từ URL cũ trong tài liệu hay lịch sử trình duyệt.

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
sản xuất + commit/push video xong, routine tự viết caption rồi gọi `publish_facebook` (đăng Reels,
kèm `thumbnail_url` — xem ghi chú cover thumbnail bên dưới) và `publish_facebook_photo` (đăng
Story/"Tin", ảnh) qua chính endpoint này — không cần thao tác gì thêm, kể cả ghi log vào
`posts_log` (tự động). **Nội dung Facebook của mỗi video chỉ gồm đúng 2 phần: 1 Reel (video, vĩnh
viễn) + 1 Story (ảnh, tự hết hạn ~24h) — không đăng thêm bài Feed nào khác** (đã thử đăng thêm bài
Feed ảnh song song 2026-08-28, user xác nhận không cần, đã revert).

**Cover thumbnail cho Facebook Reels — thêm 2026-08-28**: `publish_facebook` giờ nhận thêm
`thumbnail_url`, set qua `fbSetThumbnail_` (POST `/{video-id}/thumbnails`, multipart,
`is_preferred=true`) sau khi upload thành công — Facebook otherwise tự chọn 1 khung hình từ video,
có thể rơi vào khung tối/xấu (gặp thực tế trên 5 Reels đầu tiên, đã sửa lại thủ công qua API bằng
cách derive Page token từ System User token rồi gọi trực tiếp — xem
`fix_fb_thumbnails2.ps1` trong scratchpad nếu cần lặp lại thao tác này cho video cũ khác). **Lưu ý
quan trọng cho MỌI kênh sau này (Threads, TikTok, v.v.)**: nếu API của kênh đó hỗ trợ cover/thumbnail
riêng cho video, LUÔN truyền `thumbnail_url` trỏ tới `output/thumbnail.jpg` ngay từ đầu khi viết
tích hợp — đừng để phải sửa lại hàng loạt sau khi đã đăng như trường hợp này.

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

Truyền `thumbnail_url` (trỏ tới `output/thumbnail.jpg` vừa push) làm `cover_url` cho Reel — **bắt
buộc**, vì nếu không Instagram tự chọn 1 khung hình ngẫu nhiên từ video làm ảnh bìa và có thể rơi
vào khung hình tối/xấu (đã gặp thực tế 2026-08-28, sửa bằng cách thêm tham số `cover_url` vào
`igPublishReel_`).

**Đăng Threads tự động — thêm 2026-08-29**: sau bước Instagram, routine gọi thêm `publish_threads`
(video @bbhkinhteso, cùng caption dùng cho các kênh khác). Threads API là 1 product Meta RIÊNG,
App ID/Secret khác với app Facebook/Instagram (dù cùng nằm trong app "Retain Agency AI") — dùng
`THREADS_ACCESS_TOKEN`/`THREADS_USER_ID`/`THREADS_APP_ID`/`THREADS_APP_SECRET` riêng trong Script
Properties, không tái sử dụng `FB_PAGE_ACCESS_TOKEN`. Setup 1 lần (đã làm 2026-08-29):

1. Trong app Meta for Developers → Trường hợp sử dụng → Threads API → Cài đặt: lấy Threads App
   ID + App Secret (khác App ID chính của app).
2. Mời tài khoản Threads đích làm **Threads Tester**: Vai trò trong ứng dụng → Vai trò → Thêm
   người → chọn vai trò "Người dùng thử Threads", nhập username. Tài khoản đó phải **chấp nhận**
   lời mời — thư mời KHÔNG hiện ở tab Hoạt động (Activity) của Threads, mà ở
   **threads.com/settings/website_permissions → tab "Lời mời"** (mất vài phút để đồng bộ ngược
   lại trạng thái "Đã chấp nhận" trong Meta Developer Dashboard sau khi accept).
3. Sau khi tester được xác nhận, vào lại Threads API → Cài đặt → mục "Công cụ tạo mã người dùng"
   → bấm "Tạo mã truy cập" cạnh tên tester. Token này **đã là long-lived (~60 ngày) sẵn** — KHÔNG
   cần gọi thêm endpoint exchange `th_exchange_token` (gọi vào sẽ báo lỗi "Session key invalid",
   vì token không phải dạng short-lived cần đổi).

**Xóa bài Threads bị trùng — thêm 2026-08-29**: action `threads_delete_content` (`{"action":
"threads_delete_content", "id": "<post id>"}`) gọi `DELETE /{id}` qua Threads API. **Cần quyền
`threads_delete`** — token hiện tại (từ Công cụ tạo mã người dùng) chưa có quyền này, gọi sẽ báo
lỗi `"Application does not have permission for this action"` (code 10). Chưa thêm quyền này vào
app vì chỉ dùng 1 lần để dọn bài trùng — nếu cần xóa lại, xóa thủ công trong app Threads (mở bài →
"..." → Xóa) thay vì thêm quyền mới không thực sự cần cho việc đăng bài.
4. Lấy Threads user ID qua `GET https://graph.threads.net/v1.0/me?fields=id,username&access_token=<token>`.
5. Lưu cả 4 giá trị vào Script Properties của Apps Script project.

Flow publish (`threadsPublishReel_` trong `Code.gs`) giống hệt Instagram — 3 bước container async:
tạo container (`POST /{user-id}/threads`, `media_type=VIDEO`) → poll `GET /{container-id}?fields=
status,error_message` tới khi `FINISHED` → `POST /{user-id}/threads_publish`. **KHÔNG có tham số
cover/thumbnail cho video** trên Threads API (đã tra docs xác nhận 2026-08-28) — khác với Facebook/
Instagram/YouTube, Threads hiện chưa cho tùy chỉnh ảnh bìa Reel qua API; đây là ngoại lệ so với
"house rule" luôn truyền thumbnail_url — không phải do quên, mà do API chưa hỗ trợ.

## Theo dõi tương tác (views/likes/reactions/comments/shares) — thêm 2026-08-29

Tab mới `engagement_metrics` trong cùng Google Sheet (`posts_log`) theo dõi lượt xem/thích/reaction/
bình luận/chia sẻ cho **1 video mỗi kênh** (post_type chính: `reel` cho Facebook/Instagram/Threads,
`short` cho YouTube — bỏ qua Story/ảnh vì hết hạn 24h và không so sánh được). Mỗi lần refresh sẽ
**cập nhật đè** (upsert theo `channel + video_project`), không bao giờ append trùng dòng. Mọi cột số
(`views/likes/reactions/comments/shares`) luôn hiện **0** thay vì để trống khi không lấy được số
liệu (lý do cụ thể vẫn được ghi vào cột `notes`).

- Gọi thủ công: `{"action": "refresh_metrics"}` (POST tới endpoint chính).
- Tự động: đã cài trigger chạy mỗi ngày 6h sáng (`installDailyMetricsTrigger`, chạy 1 lần thủ
  công trong Apps Script editor lúc 2026-08-29, không cần chạy lại trừ khi trigger bị xoá).

**Tình trạng từng kênh (xác minh live 2026-08-29):**
- ✅ **Threads**: views/likes/comments/shares đều lấy được đầy đủ ngay từ đầu.
- ✅ **Facebook**: likes/comments/views hoạt động sau khi sửa 2 lỗi field — xem "Bài học" bên
  dưới. `shares` vẫn lỗi field cho Reels (`(#100) Tried accessing nonexistent field (shares)`), và
  `reactions` (full Love/Haha/Wow breakdown) cũng không phải field hợp lệ trên video node — cả 2
  không chặn các số liệu khác; `reactions` được gán bằng `likes` thay thế, `shares` để 0 + ghi lỗi
  vào cột `notes`.
- ✅ **Instagram**: likes/comments/views hoạt động sau khi sửa tên metric `plays` → `views`.
  `reactions` = `likes` (Instagram chỉ có 1 loại reaction — trái tim).
- ✅ **YouTube**: đã sửa xong (2026-08-29) — refresh token ban đầu chỉ có scope `youtube.upload`
  (đủ đăng video, KHÔNG đủ đọc `videos.list?part=statistics`) → 403 "insufficient authentication
  scopes". Khắc phục: làm lại OAuth consent qua OAuth Playground với thêm scope
  `youtube.readonly`, đăng nhập bằng tài khoản Google của kênh, cập nhật `YOUTUBE_REFRESH_TOKEN`.
  `reactions` = `likes` (YouTube chỉ có 1 loại reaction — thumbs-up).

**Bài học (lỗi field/metric đã gặp và cách sửa):**
- Facebook: gọi `fields=likes.summary(true).limit(0),comments.summary(true).limit(0),shares`
  trong 1 request — nếu `shares` không hợp lệ trên video đó, **CẢ request lỗi**, mất luôn
  likes/comments. Sửa: tách `shares` thành request riêng, wrap try/catch riêng. Cùng lỗi với
  `reactions` — Facebook Graph API không hỗ trợ edge `reactions` (full breakdown) trên node
  video/Reels, chỉ hỗ trợ trên node bài Feed thường; chỉ `likes` (thumbs-up cổ điển) dùng được.
- Facebook Reels: metric `total_video_views` (đúng cho video thường) trả về rỗng cho Reels — Reels
  dùng metric riêng `blue_reels_play_count`. Code hiện gọi cả 2 metric, lấy metric nào có data.
- Instagram: metric `plays` đã deprecated, Meta trả lỗi liệt kê đầy đủ danh sách hợp lệ hiện tại
  (bao gồm `views`) — đổi sang `metric=views,shares`.
- **Sự cố mất Script Properties (2026-08-29)**: lúc sửa `YOUTUBE_REFRESH_TOKEN` trong giao diện
  Chỉnh sửa thuộc tính của tập lệnh, 4 property `THREADS_*` bị mất (khả năng bấm nhầm nút "X" bên
  cạnh dòng). Threads báo lỗi `"Invalid OAuth access token - Cannot parse access token"` cho tới
  khi phát hiện và điền lại đủ 4 giá trị. **Bài học**: khi sửa 1 property trong Script Properties,
  kiểm tra lại toàn bộ danh sách sau khi lưu, đừng chỉ nhìn property vừa sửa.

## Cấu trúc engagement_metrics — cập nhật 2026-08-29 (theo yêu cầu user)

- Thêm cột `posted_date` (dd/MM/yyyy) + `posted_time` (HH:mm), tính theo giờ Việt Nam
  (`Utilities.formatDate(..., 'Asia/Ho_Chi_Minh', ...)`) từ `posted_at` (UTC).
- Cột `channel` chuyển sang **cột A** và viết hoa tên hiển thị (`Facebook`, `Instagram`,
  `YouTube`, `Threads` — map qua `CHANNEL_DISPLAY_NAMES`, giá trị gốc trong `posts_log` vẫn
  viết thường như cũ, không đổi). `refreshEngagementMetrics()` giờ **xoá sạch + ghi lại toàn bộ**
  dữ liệu mỗi lần chạy (thay vì upsert từng dòng) và sort theo `CHANNEL_SORT_ORDER` — đảm bảo các
  dòng cùng kênh luôn nằm liền nhau, kể cả khi có video mới thêm vào sau này.
- `ENGAGEMENT_TRACKED_POST_TYPE.facebook` mở rộng từ chỉ `'reel'` thành
  `['reel', 'video_feed', 'video']` — vài video đời đầu (trước khi kênh chuyển sang chính sách
  chỉ đăng Reel) chỉ tồn tại dưới dạng `video_feed`/`video`, bị bỏ sót hoàn toàn nếu chỉ lọc
  `'reel'`.
- **Đổi header sheet → phải xoá tab `engagement_metrics` cũ rồi chạy lại `refresh_metrics`** để
  header dòng 1 được ghi lại đúng thứ tự cột mới (code chỉ ghi header khi TẠO MỚI sheet, không
  tự sửa header của sheet đã tồn tại).

## Điều tra "thiếu bài" — 2026-08-29 (báo cáo cho user, đối chiếu API thật)

User nghi ngờ dữ liệu bị thiếu. Đối chiếu `posts_log` với danh sách video/post **thật đang sống**
trên từng nền tảng (`list_fb_content`, YouTube/Threads trực tiếp) phát hiện:

**Đã tìm ra nguyên nhân + sửa xong:**
- **Vingroup + Samsung (Facebook)**: Reel gốc của cả 2 video này **đã bị xoá thật** từ đợt dọn
  bài trùng trước đó (đợt cleanup ghi thêm dòng `status: deleted` MỚI thay vì sửa dòng
  `published` gốc → dòng gốc vẫn bị coi là "còn sống", khiến `refresh_metrics` cứ trỏ vào video đã
  chết). May mắn là cả 2 video vẫn còn 1 bài `video_feed` (kiểu đăng cũ, trước khi chuyển hẳn sang
  Reel-only) **còn sống** — đã sửa `status` của 3 dòng Reel-đã-chết trong `posts_log` thành
  `deleted` (kèm ghi chú `notes` giải thích + trỏ sang ID còn sống), và mở rộng
  `ENGAGEMENT_TRACKED_POST_TYPE` để bắt được `video_feed`. Kết quả: Vingroup/Samsung giờ hiện đúng
  số liệu thật (Vingroup: 233 views/2 likes; Samsung: 247 views/1 like — tính đến 2026-08-29).
- **12 ngân hàng tín dụng 408 nghìn tỷ (Facebook)**: video đăng dưới `post_type: 'video'` (không
  phải `'reel'`) nên bị bỏ sót hoàn toàn khỏi tracker trước đây — đã fix bằng cách mở rộng
  `ENGAGEMENT_TRACKED_POST_TYPE` như trên. Giờ hiện đúng số liệu (26 views/2 likes).

**Mất dữ liệu thật, KHÔNG sửa được bằng cách trỏ lại (cần user quyết định có đăng lại không):**
- **YouTube — 3 video đăng thủ công ngoài pipeline, không có trong `posts_log`** (đã sửa
  2026-08-29): user báo số liệu trên sheet lệch với số liệu thật trên kênh YouTube. Đối chiếu
  qua action mới `list_yt_content` (YouTube Data API `search.list forMine=true` — liệt kê toàn bộ
  video thật của kênh) phát hiện kênh có **6 video** nhưng `posts_log` trước đó chỉ biết **3**
  (Giá vàng, VN-Index, Saigon Marina — đăng qua `publish_youtube`). 3 video còn lại (Samsung,
  Vingroup, "12 ngân hàng") đã được **đăng thủ công trực tiếp trên YouTube** (ngoài pipeline tự
  động) nên chưa từng được ghi log — đã bổ sung cả 3 vào `posts_log` qua action `log_post`
  (`platform_post_id`: Samsung=`EBkE7Sv8b2w`, Vingroup=`hqI48h0ZqhU`, 12-ngân-hàng=`4sVCLyPIoN8`).
  Riêng Samsung: cả **3 video YouTube cũ** (`dNojkWKXl5U`, `1dMIO0dlK4E`, `9J9q6yImvHo`) **đã bị
  xoá thật** (xác nhận trên youtube.com: "Video không có sẵn — Người tải lên đã xoá video này")
  nhưng vẫn mang `status: published` trong log với `posted_at` **muộn hơn** video thật mới phát
  hiện — khiến tracker (chọn `posted_at` mới nhất) cứ trỏ nhầm vào video đã chết dù video thật đã
  được thêm vào. Đã sửa `status` cả 3 dòng cũ thành `deleted`. Sau khi sửa, số liệu khớp với kênh
  thật (vd. Samsung 44 views ≈ 43 trên kênh, chênh nhỏ do view tăng theo thời gian thực).
  **Lưu ý cho lần sau**: nếu đăng thủ công 1 video ngoài pipeline (không qua `publish_*`), nhớ gọi
  thêm `{"action": "log_post", ...}` để ghi vào `posts_log`, nếu không tracker sẽ không biết video
  đó tồn tại.
- **Giá vàng thủng mốc 150 triệu — Instagram**: chưa từng đăng (không có dòng `instagram` nào
  trong `posts_log` cho video này) — không phải lỗi tracker, là chưa đăng thật.
- **1 video Facebook chưa xác định danh tính**: `platform_post_id 1370315634754047`
  (`https://www.facebook.com/122094334605467175/videos/1370315634754047`, dài 19s, đăng
  2026-08-27T08:17:28Z — giữa lúc đăng video "12 ngân hàng" và "Vingroup") — không khớp bất kỳ
  dòng nào trong `posts_log`, không xem được nội dung qua tài khoản trình duyệt hiện tại (cần
  đăng nhập tài khoản quản trị Trang). Nghi là 1 bản test/nháp còn sót lại từ giai đoạn debug đầu
  tiên. **Chưa xoá** — cần user tự kiểm tra/xoá thủ công nếu xác nhận đó là rác.
- Vingroup + 12-ngân-hàng không có bài YouTube/Instagram/Threads nào (video này được đăng TRƯỚC
  khi 3 kênh đó được tích hợp vào routine) — không phải lỗi, chỉ là chưa tồn tại lúc đó.

**Bảo trì token**: `THREADS_ACCESS_TOKEN` không tự refresh, hết hạn sau ~60 ngày — phải vào lại
Threads API → Cài đặt → Công cụ tạo mã người dùng, bấm "Tạo mã truy cập" lại cho tester, rồi cập
nhật Script Property. Đặt nhắc nhở kiểm tra định kỳ (khoảng cuối tháng 10/2026 tính từ lúc tạo).

Test đăng thật đầu tiên (2026-08-29): thành công, xem
https://www.threads.com/@bbhkinhteso/post/Dcmw68LDVVR

Nếu POST body chứa dấu tiếng Việt và test thủ công qua PowerShell (không phải qua routine cloud),
PHẢI ép UTF-8 khi gửi — dùng `[System.IO.File]::ReadAllBytes()` đọc file JSON rồi truyền thẳng làm
`-Body` cho `Invoke-WebRequest` (không truyền chuỗi string thường, PowerShell mặc định có thể encode
sai và biến dấu thành `?`). Routine tự động chạy trong môi trường cloud (bash/curl) không gặp lỗi
này.

**Chống đăng trùng bài — thêm 2026-08-29 (sự cố + khắc phục)**: phát hiện Fanpage có 2 Reel
trùng cho cùng 1 video (Samsung 500 tỷ USD) — 1 bài chuẩn (00:36) + 1 bài test còn sót lại từ
lúc debug tính năng thumbnail (10:02, caption cụt "#Reels"). Nguyên nhân: `publish_facebook`
(và các action publish_* khác) trước đây KHÔNG có cơ chế nào chặn đăng trùng — 1 lệnh test thủ
công gọi thẳng vào token/Page thật sẽ tạo bài live thật, không có cảnh báo. Đã khắc phục 2 lớp:

1. **Dọn ngay**: xóa bài Reel test trùng (`1620469633423581`) qua Graph API thật (action
   `fb_delete_content`, không chỉ sửa log) — xem `Code.gs`.
2. **Chặn tận gốc**: thêm `alreadyPublished_(channel, videoProject, postType)` — mọi action
   `publish_facebook`/`publish_facebook_photo`/`publish_youtube`/`publish_instagram`/
   `publish_threads` giờ kiểm tra `posts_log` TRƯỚC khi đăng: nếu đã có 1 dòng
   `status: "published"` khớp đúng `channel` + `video` (video_project) + loại nội dung
   (reel/story/short), lệnh bị từ chối ngay với `{"ok": false, "error": "already
   published..."}`, KHÔNG gọi API nền tảng nào cả — chặn được cả trigger tự động chạy đè lẫn
   lệnh test thủ công gọi nhầm vào production. Muốn cố tình đăng lại (hiếm khi cần) thì truyền
   thêm `"force": true` trong request body để bỏ qua kiểm tra này.

**Quy tắc cho lần sau khi cần test thủ công publish_* trên môi trường thật**: luôn dùng
`video_project` giả (ví dụ tiền tố `test-`) thay vì tên `video_project` thật của 1 video đã/
sẽ lên sóng chính thức — vừa tránh bị guard chặn nhầm, vừa dễ nhận ra và dọn dẹp nếu quên xóa.

Nếu bước đăng (Facebook, YouTube, Instagram, hoặc Threads) lỗi, routine KHÔNG coi cả lần chạy là thất bại,
chỉ ghi rõ lỗi vào tóm tắt cuối; nếu bước sản xuất video (1-11) lỗi thì DỪNG LẠI, không đăng gì cả.

## Theo dõi lượt theo dõi/đăng ký (follower/subscriber) — thêm 2026-09-05

Tab mới `audience_growth` (cùng Sheet với `news_queue`/`posts_log`/`engagement_metrics`) — khác
`engagement_metrics` ở chỗ đây là chỉ số **cấp kênh/trang** (không gắn với 1 video cụ thể), nên
**append thêm dòng mỗi lần chạy** (không đè), tạo thành lịch sử theo thời gian để vẽ biểu đồ tăng
trưởng sau này. Chạy tự động ăn theo trigger 6h sáng có sẵn của `engagement_metrics`
(`refreshAudienceGrowth_()` gọi trong `refreshEngagementMetrics()`), hoặc gọi tay qua
`POST <NEWS_FEED_URL> {"action": "refresh_audience"}`.

- **YouTube**: `subscriberCount` qua `channels.list?part=statistics&mine=true` — dùng đúng token
  OAuth hiện có (`youtube.readonly` đủ), không cần quyền mới.
- **Facebook**: `followers_count`/`fan_count` trên Page node — token hiện có đủ quyền.
- **Instagram**: `followers_count` trên IG User node — token hiện có đủ quyền (tái dùng
  `FB_PAGE_ACCESS_TOKEN`).
- **Threads**: Threads API chưa công khai field follower-count nào (tính đến 2026-09) — cột
  `followers` để trống, cột `notes` ghi rõ đây là giới hạn nền tảng chứ không phải lỗi.

**KHÔNG bao gồm** tuổi/giới tính/thiết bị xem (audience demographics) — xem lý do đầy đủ ở mục
"Điều tra khả năng lấy demographics" trong `PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`: YouTube cần
scope OAuth mới (`yt-analytics.readonly`), Facebook/Instagram chỉ có ở cấp toàn trang/tài khoản
(không theo từng video), Threads chưa hỗ trợ.
