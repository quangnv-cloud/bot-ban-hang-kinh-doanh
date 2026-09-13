---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Uber cắt giảm 3.300 nhân sự (10% lực lượng lao động) — đợt tái cấu trúc lớn nhất kể từ đại dịch; khoản tiết kiệm được dùng để giảm giá cước, công ty cũng đầu tư 10 tỷ USD vào xe tự lái (Znews, 13/9/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 7-timeline-chronology
---

## Intent

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand system
(xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (cấp qua `claim_style`,
index 6): **7 — Timeline Chronology** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`). Style này đã
dùng 1 lần trước đó (`vn-index-chuoi-tang-7-phien-dai-nhat-nam`) — video này tự thiết kế bố cục/
HTML/CSS/GSAP mới hoàn toàn, chỉ giữ chung ẩn dụ "trục thời gian/node", không copy-paste khung cũ.

Nguồn chính: https://znews.vn/uber-cat-3300-nhan-su-khach-co-the-duoc-di-xe-re-hon-post1682936.html
(Znews, đăng 13/9/2026, dẫn lại phát biểu của CEO Uber tại hội nghị Goldman Sachs 10/9/2026).

Nội dung:
- Uber thông báo cắt khoảng **3.300 vị trí** (ngày 2/9/2026), tương đương **10% lực lượng lao
  động** — đợt tái cấu trúc lớn nhất của công ty kể từ đại dịch Covid-19.
- CEO **Dara Khosrowshahi** khẳng định đây là quyết định "trong vị thế mạnh", không phải vì khó
  khăn tài chính; công ty **không viện dẫn AI** cho đợt cắt giảm này (khác với nhiều hãng công nghệ
  khác), mà do tổ chức bộ máy quá cồng kềnh sau 5 năm tăng trưởng nhanh.
- Uber giảm khoảng **20% nhân sự** ở các cấp quản lý từ 7 tầng trở lên tính từ CEO, và cắt gần
  **một nửa số "nhóm siêu nhỏ"** (chỉ 1-2 người báo cáo cho 1 quản lý).
- Chính sách làm việc: nhân viên trở lại văn phòng **3 ngày/tuần**, chưa tới **1%** được làm việc
  hoàn toàn từ xa.
- Khoản tiết kiệm từ quỹ lương **và** từ giảm chi phí bảo hiểm sẽ được tái đầu tư: **giảm giá cước**
  chuyến đi, cải thiện lựa chọn cho khách hàng, tiếp tục đầu tư tăng trưởng (theo lời CEO tại hội
  nghị Communacopia + Technology do Goldman Sachs tổ chức, 10/9/2026).
- Doanh thu **2025** tăng **18%**, đạt khoảng **52 tỷ USD**; **quý II/2026** tăng **12%**, đạt
  khoảng **14,2 tỷ USD**.
- Công ty dự kiến đầu tư **10 tỷ USD** vào phát triển xe tự hành (robotaxi); đã hợp tác với **Wayve**
  và được **Transport for London (TfL)** cấp phép triển khai taxi tự lái tại London.
- Cổ phiếu Uber tăng khoảng **2%** trong phiên 10/9/2026 (ngày CEO phát biểu); trước đó cổ phiếu
  từng giảm khoảng 12% từ đầu năm.

Góc kinh doanh: một công ty toàn cầu tăng trưởng doanh thu hai chữ số vẫn thực hiện đợt cắt giảm
nhân sự lớn nhất kể từ đại dịch — đối lập "tăng trưởng mạnh nhưng vẫn tinh gọn bộ máy", đồng thời hé
lộ chiến lược dùng tiền tiết kiệm để cạnh tranh giá với Lyft/đối thủ địa phương và đặt cược dài hạn
vào xe tự lái. Chuỗi mốc thời gian (2/9 công bố → 10/9 hội nghị & phản ứng cổ phiếu → kế hoạch đầu
tư xe tự lái) phù hợp tự nhiên với ẩn dụ "trục thời gian" của style 7.

Không dùng trong video: giá trị thương vụ mua lại Delivery Hero (không có số cụ thể trong bài gốc),
khoản CEO mua thêm cổ phiếu Uber (chi tiết phụ, không phải trọng tâm kinh doanh chính), suy đoán về
mức giảm giá cước cụ thể (bài gốc nói rõ Uber CHƯA công bố con số/thời điểm).

## Assets

- `public/hook-photo.jpg` — ảnh biển hiệu Uber tại khu vực đón xe sân bay, tải qua Apps Script proxy
  (`?image=06617804cf55`, gốc `photo.znews.vn`, đã cache phía Google) — không curl thẳng CDN.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các
  video trước.
- `assets/fonts/Montserrat-*.woff2`, `assets/vendor/gsap.min.js` — tài nguyên brand chuẩn, copy từ
  project trước (không phải state riêng của video này).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

### Vận dụng style 7 — Timeline Chronology cho video này

- **Hook**: chuẩn title-card cố định (không thuộc style) — ảnh biển hiệu Uber + số "3.300" làm số
  liệu lớn nhất.
- **What happened**: Article Image Card chứa ảnh Uber, kèm badge mốc thời gian nhỏ "2/9/2026" cạnh
  kicker — mở đầu ngôn ngữ "thời gian" của style.
- **Key facts**: 3 fact xếp dọc theo 1 trục đứng bên trái, mỗi node là vòng tròn có số thứ tự
  (01/02/03) thay vì chấm trơn — node "nở" ra khi fact xuất hiện.
- **Data moment**: số liệu chính "20%" (tỷ lệ nhân sự quản lý cấp cao bị cắt) xuất hiện tại 1 node
  lớn trên trục ngang giữa khung hình, trục vẽ dần trái→phải rồi dừng tại node khi số chốt.
- **Context**: trục thời gian ngang đầy đủ với 4 mốc (2025 → Quý II/2026 → 10/9/2026 → kế hoạch xe
  tự lái), node sau to hơn node trước, trục vẽ liên tục qua các mốc.
- **Impact**: 2 node cuối trục phóng to thành 2 khối nội dung tác động (khách hàng / cạnh tranh thị
  trường), vẫn giữ đường trục nối phía sau — act cuối, giữ hình + brand anchor tới hết video, không
  suy đoán tương lai.
