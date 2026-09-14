---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Chứng khoán Việt Nam chính thức nâng hạng FTSE ngày 21/9/2026 — hơn 240 triệu USD vốn ngoại đổ vào 27 cổ phiếu lớn ngay tuần đầu, dẫn đầu là VPB, VHM, MCH, FPT, MSN, HPG (VnExpress/Znews, 14/9/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 9-editorial-clipping
---

## Intent

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand system
(xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (cấp qua `claim_style`,
index 8): **9 — Editorial Clipping** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`). Style này chưa
từng dùng trước đó — tự thiết kế bố cục/HTML/CSS/GSAP mới hoàn toàn theo đúng ẩn dụ "cắt dán báo
giấy, chồng lớp, dấu ngoặc kép báo chí lớn".

Nguồn chính: https://vnexpress.net/hon-240-trieu-usd-du-kien-duoc-giai-ngan-trong-tuan-dau-chung-khoan-nang-hang-5119902.html
(VnExpress, đăng 14/9/2026). Nguồn bổ sung (cùng sự kiện, xác nhận chéo số liệu):
https://znews.vn/vhm-fpt-hpg-cung-loat-co-phieu-lon-sap-nhan-240-trieu-usd-von-ngoai-post1682966.html
(Znews, đăng 14/9/2026).

Nội dung:
- Thị trường chứng khoán Việt Nam chính thức được **FTSE Russell** nâng hạng lên nhóm **thị trường
  mới nổi (Emerging Markets)** vào ngày **21/9/2026** — sau khi nâng hạng, tỷ trọng Việt Nam trong
  chỉ số **FTSE Emerging All Cap Index** đạt **0,488%**.
- Theo ước tính của **SSI Research**, khoảng **240,5 triệu USD** sẽ được các quỹ (dẫn đầu là
  Vanguard) giải ngân ròng vào **27 cổ phiếu** Việt Nam ngay trong ngày **18/9/2026** — trước thời
  điểm nâng hạng chính thức 3 ngày.
- Tổng dòng vốn ETF ngoại dự kiến cả tuần: **449,85 triệu USD** đổ vào, **203,93 triệu USD** rút ra
  → dòng vốn ròng toàn thị trường ước khoảng **245,92 triệu USD**.
- 5 cổ phiếu nhận dòng vốn lớn nhất: **VPBank (VPB) 32,82 triệu USD**, **Vinhomes (VHM) 30,85 triệu
  USD**, **Masan Consumer (MCH) 22,1 triệu USD**, **FPT 21,48 triệu USD**, **Masan Group (MSN) 20,92
  triệu USD**; **Hòa Phát (HPG) 18,85 triệu USD**.
- Chiều ngược lại, **Vingroup (VIC)** chịu áp lực bán ròng mạnh nhất, khoảng **28,06 triệu USD**, do
  quỹ **Xtrackers** giảm tỷ trọng VIC từ **31,6% xuống 15%** trong đợt cơ cấu lại danh mục.
- Toàn bộ tiến trình nâng hạng (4 giai đoạn, từ tháng 9/2026 đến tháng 9/2027): SSI dự báo tổng dòng
  vốn thụ động có thể đạt **2,4 tỷ USD** ở kịch bản cơ sở, tối đa **4,45 tỷ USD** ở kịch bản lạc
  quan; nếu tính cả dòng vốn chủ động, tổng quy mô có thể lên tới **6 tỷ USD**.
- Giới phân tích khuyến nghị nhà đầu tư không mua đuổi theo đà tăng, chỉ nên giải ngân khi thị
  trường điều chỉnh kỹ thuật mạnh trong tuần cơ cấu danh mục.

Góc kinh doanh: đây là sự kiện mang tính bước ngoặt cho thị trường vốn Việt Nam — lần đầu tiên được
xếp vào nhóm thị trường mới nổi của FTSE, kéo theo dòng vốn ngoại hàng trăm triệu USD đổ vào ngay
tuần đầu và hàng tỷ USD trong trung hạn, tác động trực tiếp tới định giá của các cổ phiếu vốn hóa
lớn. Toàn bộ số liệu là ước tính/dự báo đã công bố công khai từ SSI Research và các báo, không tự
suy đoán thêm kết quả thực tế sau ngày nâng hạng (21/9/2026, chưa diễn ra tại thời điểm dựng video
này, 14/9/2026) — video chỉ đưa các con số/sự kiện đã được công bố, không dự báo diễn biến giá cổ
phiếu tương lai.

Không dùng trong video: chi tiết kỹ thuật 4 giai đoạn nâng hạng (quá phức tạp cho video ngắn), cảnh
báo cụ thể của từng chuyên gia (không phải số liệu cứng), số liệu outflow riêng lẻ của từng quỹ khác
ngoài Xtrackers/VIC (phụ, không phải trọng tâm).

## Assets

- `public/hook-photo.jpg` — ảnh nhà đầu tư trước bảng điện chứng khoán, tải qua Apps Script proxy
  (`?image=acbb0938bdac`, gốc `vcdn1-kinhdoanh.vnecdn.net`, đã cache phía Google) — không curl thẳng
  CDN.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các video
  trước.
- `assets/fonts/Montserrat-*.woff2`, `assets/vendor/gsap.min.js` — tài nguyên brand chuẩn, copy từ
  project trước (không phải state riêng của video này).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

### Vận dụng style 9 — Editorial Clipping cho video này

- **Hook**: chuẩn title-card cố định (không thuộc style) — ảnh nhà đầu tư trước bảng điện + số
  "240 TRIỆU USD" (vốn ngoại tuần đầu) làm số liệu lớn nhất.
- **What happened**: ảnh bài báo đặt lệch (xoay nhẹ 1-2°) như 1 mẩu báo cắt dán, viền trắng mỏng
  quanh ảnh (mô phỏng giấy), panel tối bên dưới có dấu ngoặc kép lớn mờ phía sau tiêu đề "Chứng
  khoán Việt Nam chính thức nâng hạng FTSE ngày 21/9".
- **Key facts**: 3 fact trình bày như 3 "mẩu giấy" xếp chồng lệch nhau (mỗi mẩu xoay nhẹ góc khác
  nhau, đổ bóng nhẹ) — mẩu 1: "FTSE Russell nâng hạng, tỷ trọng 0,488%"; mẩu 2: "27 cổ phiếu nhận
  vốn ngay 18/9"; mẩu 3: "SSI Research ước tính, dẫn đầu quỹ Vanguard".
- **Data moment**: con số chính "240,5 TRIỆU USD" có dấu ngoặc kép khổng lồ mờ phía sau (như đang
  trích dẫn số liệu "nổi bật" từ bài báo), viền dưới con số là 1 nét gạch chân tay-vẽ (hand-drawn
  underline, path không đều).
- **Context**: các dòng so sánh trình bày như 1 đoạn trích báo (pull-quote block) — top 5 cổ phiếu
  nhận vốn (VPB 32,82tr, VHM 30,85tr, MCH 22,1tr, FPT 21,48tr, MSN 20,92tr USD), mỗi dòng có dấu
  gạch đầu dòng kiểu "clipping".
- **Impact**: 2 "mẩu báo" cắt dán chồng lên nhau một phần (lớp trước che góc lớp sau) — mẩu 1: "VIC
  bị bán ròng 28 triệu USD, Xtrackers giảm tỷ trọng từ 31,6% xuống 15%"; mẩu 2: "Tổng dòng vốn cả
  giai đoạn có thể đạt 2,4-4,45 tỷ USD" — act cuối, giữ hình + brand anchor tới hết video, không suy
  đoán diễn biến giá tương lai.
