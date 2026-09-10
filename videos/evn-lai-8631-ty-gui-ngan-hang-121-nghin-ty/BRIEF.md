---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "EVN báo lãi sau thuế 8.631 tỷ đồng trong 6 tháng đầu năm 2026 (tăng 26% so với cùng kỳ), đồng thời đang gửi ngân hàng tới 121.835 tỷ đồng — chiếm hơn 42% tổng danh mục đầu tư tài chính (Tuổi Trẻ, 10/9/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 6-ring-progress
---

## Intent

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand system
(xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (cấp qua `claim_style`,
index 5): **6 — Ring Progress** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`). Style này đã dùng 1
lần trước đó (`hyosung-hoa-chat-han-quoc-lo-21000-ty`) — video này phải tự thiết kế bố cục/HTML/CSS/
GSAP mới hoàn toàn, chỉ giữ chung ẩn dụ "vòng tròn tiến trình", không copy-paste khung cũ.

Nguồn chính: https://tuoitre.vn/6-thang-dau-nam-evn-lai-sau-thue-8631-ti-gui-ngan-hang-121835-ti-dong-100260910155851742.htm
(Tuổi Trẻ, đăng 10/9/2026).

Nội dung: Tập đoàn Điện lực Việt Nam (EVN) công bố báo cáo tài chính hợp nhất 6 tháng đầu năm 2026:
- **Lợi nhuận sau thuế: 8.631 tỷ đồng**, tăng 26% so với cùng kỳ năm trước (6.840 tỷ đồng).
- **Doanh thu bán điện: 294.993 tỷ đồng**, tăng 14,3% so với cùng kỳ 2025.
- **Tổng tài sản: 542.269 tỷ đồng**, tăng từ 503.893 tỷ đồng đầu năm (tương đương +7,6%).
- Đã **xóa sạch khoản lỗ lũy kế** tồn đọng nhiều năm — dù cả năm 2025 lãi 39.762 tỷ đồng vẫn chưa
  đủ bù hết khoản lỗ lũy kế 45.374 tỷ đồng từ các năm trước đó.
- **Tiền gửi có kỳ hạn tại ngân hàng: 121.835 tỷ đồng** — nằm trong tổng danh mục đầu tư tài chính
  288.830 tỷ đồng (chiếm hơn 42%).
- **Nợ vay: 124.376 tỷ đồng** (toàn bộ là vay dài hạn); **tổng nợ phải trả: 304.851 tỷ đồng**, tăng
  10% so với cùng kỳ 2025.
- **Doanh thu hoạt động tài chính** vượt 3.000 tỷ đồng, trong đó riêng lãi tiền gửi và cho vay mang
  về 2.854 tỷ đồng.

Góc kinh doanh: một tập đoàn nhà nước quy mô rất lớn (tổng tài sản hơn nửa triệu tỷ đồng) vừa lãi
đậm vừa nắm khối tiền gửi ngân hàng khổng lồ, đồng thời vẫn gánh khoản nợ vay dài hạn hơn trăm nghìn
tỷ đồng — bức tranh tài chính hai mặt (lãi lớn + tiền gửi lớn + nợ lớn) rất phù hợp với ẩn dụ "vòng
tròn tỷ lệ/tiến trình" của style 6.

Không dùng trong video: các chi tiết kỹ thuật kế toán sâu hơn (cơ cấu từng khoản mục chi phí, giá
bán điện bình quân, sản lượng điện thương phẩm...) không xuất hiện trong bài nguồn nên không đưa
vào để tránh suy diễn ngoài số liệu đã có.

## Assets

- `public/hook-photo.jpg` — ảnh minh hoạ bài báo, tải qua Apps Script proxy
  (`?image=f1e1fe7eaf53`, gốc `cdn2.tuoitre.vn`, đã cache phía Google) — không curl thẳng CDN.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các
  video trước.
- `assets/fonts/Montserrat-*.woff2`, `assets/vendor/gsap.min.js`, `assets/sfx/*.mp3` — tài nguyên
  brand chuẩn, copy từ project trước (không phải state riêng của video này).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

### Vận dụng style 6 — Ring Progress cho video này

- **Hook**: chuẩn title-card cố định (không thuộc style).
- **What happened**: badge nguồn đổi thành vòng tròn nhỏ viền cam quanh icon nguồn (mở đầu ngôn
  ngữ hình tròn).
- **Key facts**: 3 fact, mỗi fact có mini radial ring (~80px) bên trái — ring 1 vẽ đầy tới 14,3%
  (doanh thu bán điện), ring 2 vẽ đầy tới 7,6% (tăng trưởng tổng tài sản), ring 3 vẽ đầy 100% (xóa
  sạch lỗ lũy kế — không phải %, dùng ring đầy làm dấu "hoàn tất").
- **Data moment**: ring khổng lồ ở tâm khung hình vẽ đầy tới ~42% (tỷ trọng tiền gửi ngân hàng
  trong tổng đầu tư tài chính), con số "121.835 tỷ đồng" count-up đồng bộ ở tâm ring.
- **Context**: 3 ring cỡ vừa xếp hàng ngang, mỗi ring 1 chỉ số tăng trưởng để so sánh trực quan:
  doanh thu bán điện (+14,3%), lợi nhuận (+26%), tổng nợ phải trả (+10%) — vẽ đầy tuần tự trái→phải.
  (100% ring = quy ước bar chiều dài thị giác riêng cho mỗi %, không phải cùng thang).
- **Impact**: 2 ring lớn cạnh nhau — ring trái: doanh thu hoạt động tài chính (hơn 3.000 tỷ đồng,
  trong đó 2.854 tỷ từ lãi tiền gửi/cho vay); ring phải: nợ vay dài hạn 124.376 tỷ đồng trên tổng
  nợ phải trả 304.851 tỷ đồng — act cuối, giữ hình + brand anchor tới hết video, không suy đoán.
