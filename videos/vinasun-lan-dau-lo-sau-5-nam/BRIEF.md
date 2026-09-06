# BRIEF — Vinasun lần đầu lỗ sau 5 năm

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH** (xem quy tắc brand đầy đủ ở
`../BRAND-SYSTEM-BOT-BAN-HANG.md`, quy trình ở `../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`).
Construction style vòng xoay: **3 — Ticker Tape** (claim_style index 2, 2026-09-06) — dải tin chạy
kiểu bảng điện sàn chứng khoán, reveal typewriter cho key facts, con số chính giữa 2 vạch kẻ kiểu
dòng bảng giá (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`, mục "Style 3 — Ticker Tape").

## Mục tiêu

Đưa tin hãng taxi Vinasun (Vinasun Corp, mã cổ phiếu VNS) công bố lỗ sau thuế trong nửa đầu năm
2026 — lần đầu lỗ nửa năm sau 5 năm liên tiếp có lãi. Góc nhìn đúng định vị kênh: một doanh nghiệp
niêm yết cụ thể, số liệu tài chính công bố chính thức (báo cáo tài chính), có thể trực quan hoá rõ
(doanh thu, lỗ, giá cổ phiếu, vốn hoá) — đúng ẩn dụ "bảng điện sàn chứng khoán" của style Ticker
Tape.

## Nguồn

- VnExpress — "Hãng taxi Vinasun lần đầu lỗ sau 5 năm", đăng 06/09/2026.
  https://vnexpress.net/hang-taxi-vinasun-lan-dau-lo-sau-5-nam-5117053.html
- Ảnh: tải qua Apps Script image endpoint (`?image=37f6cbdc5f50`), lưu
  `assets/img/article-hero.jpg` — ảnh báo chí thật minh hoạ bài viết (xe taxi Vinasun).

## Số liệu xác nhận (KHÔNG bịa thêm số ngoài danh sách này)

**Kết quả kinh doanh nửa đầu năm 2026:**
- Doanh thu: khoảng **420 tỷ đồng**, giảm **7%** so với cùng kỳ năm trước.
- Lợi nhuận gộp: **72 tỷ đồng**, giảm mạnh so với cùng kỳ.
- Lỗ sau thuế nửa năm: khoảng **14 tỷ đồng** — đây là lần đầu Vinasun lỗ nửa năm sau **5 năm liên
  tiếp có lãi**.
- Riêng quý II/2026: lỗ hơn **20 tỷ đồng**.

**So với kế hoạch năm 2026:**
- Kế hoạch doanh thu cả năm: **903 tỷ đồng**.
- Kế hoạch lãi sau thuế cả năm: **32 tỷ đồng**.

**Dữ liệu lịch sử/so sánh:**
- Lần lỗ gần nhất trước đó của Vinasun: quý IV/2021, lỗ **8 tỷ đồng**.
- Giai đoạn đỉnh cao (2016): hơn **17.000 nhân sự**, doanh thu hơn **4.500 tỷ đồng**.
- Doanh thu năm 2025: **882 tỷ đồng** — mức thấp nhất trong 17 năm (trước cú lỗ nửa năm 2026 này).

**Kế hoạch đầu tư 2026:**
- Đầu tư khoảng **300 xe hybrid** mới.
- Mục tiêu quy mô đội xe: khoảng **2.350 chiếc**.

**Thị trường chứng khoán (mã VNS):**
- Giá cổ phiếu: khoảng **6.600 đồng/cổ phiếu** — thấp nhất trong **4 năm**.
- Vốn hoá thị trường: dưới **500 tỷ đồng**.

## Cấu trúc 6 act (Hook cố định + 5 act theo style Ticker Tape)

1. **Hook** — hero number **"LỖ 14 TỶ"** đơn vị "NỬA ĐẦU NĂM 2026", headline bao quát: "Vinasun lần
   đầu lỗ sau 5 năm". Badge nguồn "Nguồn: VnExpress · 06/09/2026".
2. **What happened** — ảnh nền mờ (xe taxi Vinasun) + ticker bar chạy full-width viền cam trên/dưới,
   pulse dot "LIVE" đầu dải, chứa nguồn + tiêu đề rút gọn. Headline chính phía trên: "Vinasun báo lỗ
   sau thuế 14 tỷ đồng nửa đầu năm 2026".
3. **Key facts** — 3 dòng kiểu terminal, ký hiệu ▼ (giảm/lỗ) hoặc ▲ trước số liệu, reveal typewriter:
   (1) Doanh thu 420 tỷ đồng ▼7% so với cùng kỳ (2) Lợi nhuận gộp 72 tỷ đồng, giảm mạnh (3) Riêng
   quý II lỗ hơn 20 tỷ đồng.
4. **Data moment** — mã hiệu "VNS" nhỏ phía trên chạy trước, con số chính "-14 TỶ ĐỒNG" đặt giữa 2
   vạch kẻ ngang kiểu dòng bảng giá, count-up (từ 0 xuống -14, hoặc đếm tăng độ lớn số âm).
5. **Context** — sparkline mảnh vẽ dần phía sau các dòng so sánh: giá cổ phiếu VNS ~6.600 đồng
   (thấp nhất 4 năm) · vốn hoá dưới 500 tỷ đồng · doanh thu 2025 chỉ 882 tỷ (thấp nhất 17 năm, so
   với hơn 4.500 tỷ đồng thời đỉnh cao 2016).
6. **Impact** (act cuối, sự thật/số liệu, không suy đoán) — 2-3 dòng "bảng giá" xếp chồng, mỗi dòng
   tên chỉ tiêu bên trái + số liệu bên phải: (1) Kế hoạch cả năm 2026: doanh thu 903 tỷ đồng, lãi
   sau thuế 32 tỷ đồng (2) Doanh nghiệp vẫn đầu tư ~300 xe hybrid mới, mục tiêu đội xe ~2.350 chiếc.
   Giữ hình + brand anchor tới hết video.

## Ghi chú thiết kế

- Style 3 — Ticker Tape: mọi act dùng ẩn dụ "bảng điện sàn chứng khoán" — ticker bar chạy ngang,
  terminal-style typewriter reveal, dòng bảng giá cho số liệu chính, sparkline mảnh cho so sánh,
  xếp chồng dòng bảng giá cho Impact — tự thiết kế HTML/CSS/GSAP hoàn toàn mới, không copy khung
  `12-ngan-hang-tin-dung-408-nghin-ty` (video đầu tiên dùng style này).
- Trục truyện: mở bằng con số lỗ giật gân "-14 tỷ" nhưng đặt đúng trong bối cảnh — công ty vẫn duy
  trì kế hoạch đầu tư xe mới (300 xe hybrid) cho năm 2026, không suy đoán tương lai/khả năng phục
  hồi, chỉ nêu đúng số liệu/kế hoạch đã công bố.
- KHÔNG suy đoán/dự báo (vd. "liệu Vinasun có phục hồi") — act cuối chỉ là số liệu kế hoạch đã công
  bố, không phải nhận định.
- Ảnh Hook/Article Image Card là ảnh báo chí thật của VnExpress minh hoạ bài viết, nguồn: VnExpress.
