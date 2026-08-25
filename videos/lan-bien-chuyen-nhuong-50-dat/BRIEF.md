---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Luật Phát triển đô thị mới: nhà đầu tư chiến lược dự án khu đô thị lấn biển không được bán toàn bộ dự án — chỉ được chuyển nhượng tối đa 50% diện tích đất đã xong hạ tầng kỹ thuật"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư bất động sản, doanh nghiệp phát triển đô thị, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: 60s
angle: concept
style_preset: broadside
---

## Intent

Video tin tức kinh doanh 60 giây cho kênh thương hiệu riêng **BOT BÁN HÀNG · KINH DOANH**,
dựng theo master brand system do người dùng cung cấp (xem `../../BRAND-SYSTEM-BOT-BAN-HANG.md`
— lưu bản sao đầy đủ tại gốc dự án để mọi bước tham chiếu). Định vị: business media hiện đại,
nhanh, sắc, đáng tin — không phải video quảng cáo. Tin tức là nội dung trung tâm; brand tạo
recognition; motion graphic giải thích/nhấn mạnh, không lấn át chữ.

Nguồn: https://vnexpress.net/nha-dau-tu-do-thi-lan-bien-duoc-chuyen-nhuong-toi-da-50-dien-tich-dat-xong-ha-tang-5112687.html

Nội dung: Quốc hội thông qua Luật Phát triển đô thị (66 điều, hiệu lực 1/10). Trọng tâm video:
cơ chế chuyển nhượng dự án khu đô thị lấn biển — nhà đầu tư chiến lược không được bán toàn bộ dự
án, chỉ tối đa 50% diện tích đất đã xong hạ tầng kỹ thuật khung; thời hạn hoạt động tối đa 70 năm;
ưu đãi 70 năm áp dụng dự án ≥30.000 tỷ đồng; tiến độ giải ngân/chuyển nhượng theo quy mô vốn.

## Assets

- public/logo-bbh.png — logo BOT BÁN HÀNG, CỐ ĐỊNH góc dưới-phải xuyên suốt 0–60s, không animation, không đổi vị trí/kích thước.
- public/photo-bo-truong-tu-phap.jpg — ảnh báo chí thật: Bộ trưởng Tư pháp Hoàng Thanh Tùng tại phiên họp Quốc hội sáng 24/8. Nguồn: Cổng thông tin điện tử Quốc hội, qua VnExpress. Dùng trong Article Image Card (KHÔNG full-bleed).
- public/photo-dai-bieu-quoc-hoi.jpg — ảnh báo chí thật: Các đại biểu Quốc hội tại phiên họp sáng 24/8. Nguồn: Cổng thông tin điện tử Quốc hội, qua VnExpress. Dùng trong Article Image Card (KHÔNG full-bleed).

## Customizations

- **Brand màu cố định, không tự thêm màu:** Orange `#E8441E` (primary/accent duy nhất) · White `#FFFFFF` · Dark `#111111`. Không dùng xanh lá/xanh dương/tím/neon/rainbow gradient.
- **Visual hierarchy bắt buộc mọi frame:** TEXT (quan trọng nhất) > MOTION GRAPHIC (giải thích/nhấn mạnh) > NEWS IMAGE (bằng chứng). Ảnh báo chí KHÔNG được là yếu tố lớn nhất trong bất kỳ cảnh nào — luôn đặt trong "Article Image Card" (khung editorial riêng, có border/shadow nhẹ/rounded corner, nhãn nguồn, KHÔNG copy layout website gốc).
- **Hai anchor cố định xuyên suốt toàn video (0→60s), không animation liên tục, không đổi vị trí:**
  - Logo BOT BÁN HÀNG — góc dưới-phải, nhỏ, safe margin cố định.
  - Nguồn "Nguồn: VnExpress" — góc dưới-trái, nhỏ, luôn đọc được, nền translucent nếu ảnh sáng.
  - Hai anchor này dựng ở **tầng root/overlay của index.html**, không phải trong từng frame riêng — đảm bảo nhất quán tuyệt đối qua mọi lần cắt cảnh.
- **Keyword/number highlight:** số liệu, tên luật, mốc thời gian, ngưỡng vốn luôn nổi bật bằng Orange trong headline (vd: "TỐI ĐA **50%**", "**70 NĂM**", "**30.000 TỶ ĐỒNG**").
- **Motion signature vocabulary** (chọn phù hợp từng cảnh, không lạm dụng): Orange highlight sweep qua keyword, orange data line/pulse, market/step graph, percentage & currency count-up, orange frame quanh Article Image Card, kinetic typography reveal theo nhịp câu.
- **Không có giọng đọc AI trong bản giao này** — người dùng tự tạo & lồng voice bên ngoài. Vẫn cần: kịch bản VO tiếng Việt khớp chính xác với 8 act timing (0–5, 5–12, 12–22, 22–32, 32–43, 43–53, 53–58, 58–60s) để dựng thời lượng từng khung hình, và các khung hình phải được thiết kế để "chờ" nhịp đọc đó (không có audio thật để đồng bộ tự động).
- **8 khung hình theo đúng 8 act** của brand system: Hook → What happened → Key facts → Data moment → Context → Impact → Takeaway → Brand ending.

## Notes

- `music: none` trong storyboard này — không có kết nối BGM khả dụng cục bộ (không đăng nhập HeyGen, chưa cài MusicGen). Đây là giới hạn kỹ thuật đã biết, không phải lựa chọn thiết kế — ghi rõ cho người dùng.
- Không dùng captions karaoke tự động (không có whisper-cpp cục bộ) — thông tin truyền tải qua chữ trên khung hình + kịch bản voice người dùng tự lồng.
- Preset nền: `broadside` (dark ink-black + fire-orange, Barlow ExtraBold + IBM Plex Mono chrome) — remix màu chính xác theo brand qua `tokens.json` (không dùng màu gốc của preset).
- Toàn bộ số liệu trong video phải truy nguyên được về bài báo gốc — không tự bịa số liệu, không tự tạo nguồn.
