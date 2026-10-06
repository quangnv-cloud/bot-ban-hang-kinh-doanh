# TikTok Analytics — Setup

Kéo số liệu organic của 2 kênh TikTok (tài khoản Personal) **Tiền Nó Bạc** và **Chồi Non AI** vào
Sheet tổng hợp `Bản sao của BBH News Queue` (`1isvFaqM9g6F8hFb3Fu5pvMg2Jgj017Nsh6R0OgHsof0`),
`platform = TikTok`, cùng schema các tuyến khác (`post_metrics`, `traffic_daily`, `brands`).

Kiến trúc: 1 Apps Script riêng (Gmail `minhanhh1108@gmail.com`) + 1 app TikTok dùng chung cho
cả 2 tài khoản. Không đụng Code.gs của 3 tuyến cũ.

## Lấy được / không lấy được

| Có (Display API) | Không có |
|---|---|
| Mỗi video: views, likes, comments, shares, link, ngày đăng | Nhân khẩu học, nguồn traffic, thời gian xem |
| Tài khoản: follower, tổng likes, số video | Chuỗi số liệu theo ngày trong quá khứ (chỉ có số hiện tại) |

→ Lịch sử theo ngày trước ngày bật trigger: xuất CSV từ TikTok Studio (bước E).

## Cấu hình thật (dựng 06/10/2026)

| Mục | Giá trị |
|---|---|
| App TikTok | "Bot Bán Hàng" (app id `7693332386037123124`), dùng bản **Sandbox** `7693259535134607368` |
| Target users | `tiennobac26`, `choinonai26` |
| URL đã xác minh | prefix `https://quangnv-cloud.github.io/cong-nghe-so/` (file `tiktokD8f…E7.txt` trong repo `cong-nghe-so/docs`) |
| Terms / Privacy | `…/cong-nghe-so/tiktok-terms.html`, `…/tiktok-privacy.html` |
| Redirect URI | `https://quangnv-cloud.github.io/cong-nghe-so/tiktok-callback.html` — trang tĩnh chuyển `?code&state` sang exec URL (TikTok bắt redirect nằm trong URL đã xác minh, không xác minh được script.google.com) |
| Apps Script | "TikTok Analytics", project `1Uf2uvjrC5Zi8gmemeM6vLMw4nsXuevUo4WmbWoIMeukIiXnmNRMywbq1`, tài khoản `minhanhh1108` |
| Exec URL | `https://script.google.com/macros/s/AKfycbx43p0tWN_yFT9oz3jcvhJO1Bj1X0xWoZSIPOii8ZrFg_g1J6XQ4pzkxh4cu9yKd8Jyhw/exec` |
| Trigger | `refreshTikTokMetrics` 6h sáng Asia/Ho_Chi_Minh |

Nếu đổi exec URL (deploy mới thay vì "Phiên bản mới") → sửa `EXEC` trong `docs/tiktok-callback.html` repo `cong-nghe-so`.

## Facebook + YouTube (thêm 06/10/2026, Phiên bản 2)

Cùng script, cùng trigger 6h sáng; nền tảng nào thiếu property thì bỏ qua (`"chưa cấu hình"`).

| Property | Giá trị |
|---|---|
| `FB_PAGE_ID_<slug>` (tuỳ chọn) | Page ID Graph API. Không bắt buộc: script tự tìm Page theo tên brand trong `/me/accounts`. **ID trong link `profile.php?id=` KHÔNG phải Page ID** (Tiền Nó Bạc = `1352471764613466`, Chồi Non AI = `1332263766644125`). |
| `FB_SYSTEM_TOKEN` (hoặc `FB_TOKEN_<slug>` riêng) | System User token (app "Retain Agency AI"), quyền `pages_show_list, pages_read_engagement, read_insights`; System User phải được gán 2 Page trong Business Manager. Script tự đổi ra Page token. **Người vận hành nhập.** |
| `YT_CHANNEL_tien_no_bac`, `YT_CHANNEL_choi_non_ai` | Channel ID `UC…` |
| `YOUTUBE_API_KEY` | API key YouTube Data API v3 (Google Cloud → Credentials → API key). Số liệu YT công khai nên không cần OAuth. **Người vận hành nhập.** |

Facebook lấy video + Reels của Page (views/likes/comments/shares), follower của Page. YouTube lấy toàn bộ video
đã tải lên (views/likes/comments; YouTube không công khai shares → 0) + subscriber.

## A. Tạo app TikTok (người vận hành)

1. developers.tiktok.com → đăng nhập → **Manage apps → Connect an app**.
2. Điền app info: icon, mô tả, category; **Terms of Service URL** + **Privacy Policy URL** (dùng
   trang GitHub Pages giống `quangnv-cloud.github.io/cong-nghe-so/privacy.html`).
3. **Add products**: **Login Kit** + **Display API**.
4. **Scopes**: `user.info.basic`, `user.info.stats`, `video.list`.
5. Login Kit → **Redirect URI (Web)**: dán đúng exec URL của Web App ở bước B (không thêm `?...`).
6. Chuyển sang tab **Sandbox** → tạo sandbox → **Target users**: thêm cả 2 tài khoản TikTok
   (Tiền Nó Bạc, Chồi Non AI). Sandbox đủ dùng cho tài khoản của chính mình, không cần chờ duyệt.
7. Ghi lại **Client key** + **Client secret** (của sandbox).

## B. Tạo Apps Script

1. script.google.com (tài khoản `minhanhh1108@gmail.com`) → New project → tên `TikTok Analytics`.
2. Dán `Code.gs` → lưu.
3. Triển khai → Tùy chọn triển khai mới → **Ứng dụng web** · Execute as **Me** · Access **Bất kỳ ai**
   → copy **exec URL** (dùng cho bước A.5).
4. Cài đặt dự án → Thuộc tính tập lệnh:
   - `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` — **người vận hành tự nhập**
   - `TIKTOK_REDIRECT_URI` = exec URL (trùng y A.5)
   - `SETUP_KEY` = chuỗi bí mật tự đặt
5. Chạy `installDailyTrigger` 1 lần (cấp quyền) → kiểm tra trang **Kích hoạt** có
   `refreshTikTokMetrics`.

## C. Kết nối từng tài khoản (người vận hành, 1 lần/tài khoản/năm)

Mở trong trình duyệt đang đăng nhập đúng tài khoản TikTok:

```
<exec URL>?tiktok_auth=tien_no_bac&key=<SETUP_KEY>
<exec URL>?tiktok_auth=choi_non_ai&key=<SETUP_KEY>
```

Bấm link → đồng ý trên TikTok → trang báo "Đã kết nối … (N follower)". Đăng xuất TikTok giữa 2 lần
để không cấp nhầm tài khoản. Kiểm tra: `GET <exec URL>` → `connected: true` cho cả 2.

Refresh token sống ~365 ngày → trước `refresh_expires` (hiện trong `GET <exec URL>`) phải làm lại bước C.

## D. Chạy + verify

```
POST <exec URL>  {"action":"refresh_metrics"}
```

→ `{"ok":true,"accounts":{"tien_no_bac":{"ok":true,"videos":N,"followers":M},...}}`. Mở Sheet:
`brands` có 2 dòng mới, `post_metrics`/`traffic_daily` có dòng `TikTok`. Sau đó trigger tự chạy 6h sáng.

## E. Backfill lịch sử (tuỳ chọn)

TikTok Studio → Analytics → **Download data** (Overview + Followers, khoảng ngày dài nhất) → gửi
file CSV → viết hàm nhập 1 lần vào `traffic_daily` theo đúng định dạng file thực tế.

## Ghi chú

- Id video TikTok dài 19 chữ số → ghi dạng text (`'`) để khoá upsert không bị Sheets làm tròn.
- `reactions = likes` (giữ cùng quy ước FB/IG các tuyến khác) → `engagement_total` tính likes 2 lần.
- Thêm kênh TikTok khác: thêm 1 dòng vào `ACCOUNTS` trong Code.gs + thêm target user ở sandbox +
  làm bước C.
