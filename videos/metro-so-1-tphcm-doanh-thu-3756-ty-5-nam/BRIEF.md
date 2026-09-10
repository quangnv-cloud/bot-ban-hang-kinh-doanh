---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "UBND TP.HCM giao chỉ tiêu 2026-2030 cho HURC: metro số 1 phải đạt tổng doanh thu gần 3.756 tỷ đồng, sau khi 2025 đã tăng doanh thu gấp gần 50 lần và lần đầu có lãi (Znews, 10/9/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 5-map-and-geo
---

## Intent

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand system
(xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (cấp qua `claim_style`,
index 4): **5 — Map & Geo** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

Nguồn chính: https://znews.vn/tuyen-metro-so-1-tphcm-phai-thu-hon-3700-ty-trong-5-nam-toi-post1682284.html
(Znews, đăng 10/9/2026).

Nội dung: UBND TP.HCM vừa ban hành Quyết định số 5818/QĐ-UBND giao nhiệm vụ và chỉ tiêu chiến lược
phát triển 5 năm (2026-2030) cho **Công ty TNHH MTV Đường sắt đô thị số 1 TP.HCM (HURC)** — đơn vị
vận hành tuyến **metro số 1 Bến Thành - Suối Tiên** (dài gần 20 ki-lô-mét, 14 ga, khai thác thương
mại từ cuối năm 2024). Chỉ tiêu: tổng doanh thu cả giai đoạn 2026-2030 phải đạt **gần 3.756 tỷ
đồng**, riêng năm 2030 phải đạt **gần 901 tỷ đồng**; lợi nhuận trước thuế tăng từ **gần 22 tỷ đồng**
(năm nay) lên **gần 32 tỷ đồng** (2030), lũy kế cả giai đoạn khoảng **133,3 tỷ đồng**.

Bối cảnh cho thấy chỉ tiêu này có cơ sở: báo cáo tài chính năm 2025 của HURC ghi nhận doanh thu
**547 tỷ đồng, gấp gần 50 lần năm liền trước** (năm đầu tiên vận hành thương mại đủ 12 tháng) — hơn
một nửa đến từ tiền trợ giá, doanh thu bán vé đạt **214 tỷ đồng**. Lợi nhuận gộp hơn **57 tỷ đồng**
(biên lãi gộp trên 10%). Dù chi phí quản lý tăng khoảng 40% do mở rộng nhân sự, công ty vẫn lãi sau
thuế **gần 39 tỷ đồng** — trong khi năm trước đó **lỗ hơn 10 tỷ đồng** — qua đó xóa sạch khoản lỗ
lũy kế hơn 35 tỷ đồng từ giai đoạn chuẩn bị dự án. Cho năm 2026, UBND TP.HCM tiếp tục giao chỉ tiêu
doanh thu **615,3 tỷ đồng**.

Không dùng trong video: thông tin Sun Group ký hợp đồng tư vấn vận hành LRT Phú Quốc và đề xuất kéo
dài tuyến đến Đồng Nai/sân bay Long Thành (44,5km) — đây là các dự án/kế hoạch khác, không thuộc
phạm vi chỉ tiêu doanh thu của quyết định 5818/QĐ-UBND, tránh làm loãng câu chuyện chính.

## Assets

- `assets/images/hook-photo.jpg` — ảnh minh hoạ bài báo (ga metro số 1 đông khách), tải qua Apps
  Script proxy (`?image=0080ba6bbad7`, gốc `photo.znews.vn`, đã cache phía Google) — không curl
  thẳng CDN.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các
  video trước.
- `assets/fonts/Montserrat-*.woff2`, `assets/vendor/gsap.min.js` — tài nguyên brand chuẩn, copy từ
  project trước (không phải state riêng của video này).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

**Điều chỉnh ẩn dụ Map & Geo cho phù hợp câu chuyện (quyết định thiết kế tự đưa ra, ghi rõ để người
dùng phản hồi nếu muốn)**: tin này chỉ xoay quanh MỘT tuyến/MỘT thành phố (không phải so sánh nhiều
vùng miền như mô tả gốc của style 5), nên "bản đồ" được thu hẹp thành **sơ đồ tuyến Bến Thành - Suối
Tiên** (đường thẳng cách điệu + node ga, thay vì bản đồ Việt Nam toàn quốc) — vẫn giữ đúng ngôn ngữ
hình ảnh cốt lõi của style (ghim địa danh/pin, node, connection line, highlight tuần tự) nhưng scope
đúng theo dữ liệu thật của bài báo (tuyến dài gần 20km, 14 ga).

5 act (What happened → Impact) dựng theo định hướng **Map & Geo** (đã điều chỉnh scope ở trên):
- **What happened**: ảnh + panel chuẩn, thêm ghim địa danh nhỏ góc dưới ảnh — label "Bến Thành —
  Suối Tiên, TP.HCM".
- **Key facts**: sơ đồ tuyến (đường kẻ ngang cách điệu, 2 node đầu-cuối Bến Thành/Suối Tiên) làm nền
  mờ phía sau 3 fact chỉ tiêu tài chính 2026-2030, mỗi fact có icon ghim nhỏ cạnh số thứ tự.
- **Data moment**: con số hero — doanh thu 2025 (547 tỷ đồng, gấp gần 50 lần năm trước) — đặt trong
  1 vòng tròn ghim (map pin) phóng to, pin rơi xuống trước khi số count-up.
- **Context**: diễn biến lợi nhuận 2024→2025 (lỗ hơn 10 tỷ đồng → lãi gần 39 tỷ đồng, xóa lỗ lũy kế
  hơn 35 tỷ đồng) trình bày qua 2 node trên sơ đồ tuyến (mỗi node = 1 năm), connection line nối 2
  node kèm nhãn số liệu.
- **Impact** (act cuối, sự thật đã xảy ra — không suy đoán): UBND TP.HCM đã giao chỉ tiêu doanh thu
  615,3 tỷ đồng cho HURC trong năm 2026 — 2 "thẻ địa danh" (2025 thực tế / 2026 chỉ tiêu) trượt vào
  từ 2 hướng, nền sơ đồ tuyến mờ phía sau.

Phân bổ nội dung theo act (không lặp số liệu giữa các act, trừ Impact cố ý nhắc lại 547 tỷ đồng của
Data moment để làm mốc so sánh với chỉ tiêu 2026):
- Hook: chỉ tiêu tổng doanh thu 5 năm — gần 3.756 tỷ đồng cho metro số 1 TP.HCM.
- What happened: UBND TP.HCM ban hành quyết định giao chỉ tiêu 5 năm 2026-2030 cho HURC.
- Key facts: tổng doanh thu 5 năm gần 3.756 tỷ đồng; riêng 2030 gần 901 tỷ đồng; lợi nhuận trước
  thuế lũy kế 5 năm khoảng 133,3 tỷ đồng.
- Data moment: doanh thu 2025 đạt 547 tỷ đồng, gấp gần 50 lần năm trước.
- Context: lợi nhuận sau thuế 2025 gần 39 tỷ đồng (năm trước lỗ hơn 10 tỷ đồng), xóa sạch lỗ lũy kế
  hơn 35 tỷ đồng.
- Impact (act cuối, sự thật đã xảy ra): UBND TP.HCM đã giao chỉ tiêu doanh thu 615,3 tỷ đồng cho
  HURC trong năm 2026.

## Notes

- Toàn bộ số liệu truy nguyên được về bài Znews nêu trên (trích Quyết định 5818/QĐ-UBND và báo cáo
  tài chính 2025 của HURC) — không tự bịa số liệu/nguồn.
- BGM: tạo mới qua Google Lyria, tông modern business/news/digital/fast-paced/minimal/professional,
  100% không lời (instrumental only, theo quy tắc brand 2026-08-27).
- Act cuối (Impact) kết thúc bằng sự thật/số liệu đã xảy ra (chỉ tiêu 2026 đã được giao chính thức)
  — không suy đoán tương lai (không dùng thông tin kéo dài tuyến/LRT Phú Quốc, xem mục Intent).
