---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Hai pháp nhân sản xuất điện thoại của Samsung tại Bắc Ninh và Thái Nguyên đạt mốc xuất khẩu lũy kế 500 tỷ USD sau 17 năm hoạt động tại Việt Nam (VnExpress, 27/8/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 5-map-and-geo
---

## Intent

Video tin tức kinh doanh thứ năm cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand
system (xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (theo con trỏ xoay
vòng `../style-rotation-state.json`, index 4): **5 — Map & Geo** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`) — phù hợp tự nhiên vì tin có yếu tố địa lý rõ (2 nhà máy
tại Bắc Ninh, Thái Nguyên + trung tâm R&D tại Hà Nội).

Nguồn chính: https://vnexpress.net/samsung-xuat-khau-500-ty-usd-dien-thoai-tu-viet-nam-sau-17-nam-5114286.html
(VnExpress, đăng 27/8/2026)

Nội dung: Ngày 27/8/2026, Tổng giám đốc điều hành Samsung Electronics Roh Tae Moon gặp Thủ tướng
Lê Minh Hưng, thông báo hai pháp nhân sản xuất điện thoại di động của Samsung tại Bắc Ninh và Thái
Nguyên đã đạt mốc xuất khẩu lũy kế 500 tỷ USD kể từ khi khởi động sản xuất tại Việt Nam vào tháng
4/2009 — tức sau 17 năm hoạt động. Samsung cũng vận hành trung tâm R&D tại Hà Nội. Tính đến cuối
năm ngoái, tổng vốn đầu tư tích lũy của Samsung tại Việt Nam đạt 24 tỷ USD. Samsung khẳng định
không coi Việt Nam đơn thuần là cứ điểm sản xuất mà là đối tác chiến lược trong nghiên cứu công
nghệ cao, đặt mục tiêu tăng trưởng hai con số đến cuối năm nay. Trong tháng 8/2026, Samsung cũng
ra mắt Galaxy Fold 8.

## Assets

- `public/photo-samsung-nha-may-sevt.jpg` — ảnh báo chí thật (công nhân tại dây chuyền sản xuất
  SEVT — nhà máy Samsung Thái Nguyên), lấy từ bài Dân Trí "Dấu ấn 17 năm 'đồng thịnh vượng' của
  Samsung tại Việt Nam" (`cdnphoto.dantri.com.vn`, domain đã có trong Custom network allowlist —
  domain ảnh của VnExpress `vnecdn.net` và Tuổi Trẻ `cdn2.tuoitre.vn` bị chặn ở tầng CONNECT khi
  thử tải, dù bài viết chính vẫn đọc được qua `vnexpress.net`). Vì ảnh lấy từ nguồn khác nội dung
  chính (VnExpress) nên Source credit ghi 2 nguồn: "Nguồn: VnExpress / Dân Trí".
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng từ các video trước (asset
  cố định, không phải "state" composition).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

5 act (What happened → Impact) dựng theo định hướng **Map & Geo** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md` mục Style 5): ghim địa danh nhỏ ở What happened, bản đồ
Việt Nam vector mờ làm nền cho Key facts, con số chính đặt trong vòng tròn ghim (map pin) phóng to
ở Data moment, bản đồ với các tỉnh liên quan (Bắc Ninh, Thái Nguyên, Hà Nội) highlight tuần tự +
connection line ở Context, 2 thẻ địa danh trượt vào từ 2 hướng trên nền bản đồ mờ full-frame ở
Impact — không dùng ticker bar hay split-screen như 2 video trước.

## Notes

- Toàn bộ số liệu truy nguyên được về bài VnExpress nêu trên — không tự bịa số liệu/nguồn.
- BGM: tạo mới qua Google Lyria, tông modern business/news/digital/fast-paced/minimal/professional,
  100% không lời (instrumental).
- Act cuối (Impact) kết thúc bằng sự thật/số liệu đã xảy ra (tổng vốn đầu tư 24 tỷ USD, định vị đối
  tác chiến lược R&D) — không suy đoán tương lai.
