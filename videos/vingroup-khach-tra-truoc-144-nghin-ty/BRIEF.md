# BRIEF — Khách mua nhà trả trước cho Vingroup gần 144.000 tỷ đồng

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH** (xem quy tắc brand đầy đủ ở
`../BRAND-SYSTEM-BOT-BAN-HANG.md`, quy trình ở `../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`).
Construction style vòng xoay này: **10 — Stock Terminal** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

## Mục tiêu

Đưa tin báo cáo tài chính bán niên 2026 (đã soát xét) của Tập đoàn Vingroup (mã chứng khoán VIC):
khoản khách mua nhà trả tiền trước cho hoạt động chuyển nhượng bất động sản đạt gần 144.000 tỷ
đồng tại cuối tháng 6, tăng mạnh so với đầu năm — đi kèm hàng loạt chỉ số tài chính khác đều tăng
vọt (doanh thu, lợi nhuận, tổng tài sản). Góc nhìn số liệu tài chính doanh nghiệp rõ ràng, đúng
định vị kênh, phù hợp ẩn dụ "bảng giá chứng khoán" của style Stock Terminal (VIC là mã cổ phiếu
niêm yết thật).

## Nguồn

- Dân Trí — "Khách mua nhà trả trước cho Vingroup gần 144.000 tỷ đồng" (30/8/2026)
  https://dantri.com.vn/kinh-doanh/khach-mua-nha-tra-truoc-cho-vingroup-gan-144000-ty-dong-20260830155840993.htm

Nguồn hiển thị trên video: "Nguồn: Dân Trí"

Ảnh bài báo: tải trực tiếp từ `cdnphoto.dantri.com.vn` (domain đã nằm trong Custom network
allowlist của môi trường) — chính là ảnh og:image của bài báo gốc, thực tế là chân dung ông Phạm
Nhật Vượng (Chủ tịch Tập đoàn Vingroup) tại một sự kiện (không phải ảnh dự án như tên file gợi ý —
đã xem lại bằng mắt qua Studio thumbnail và sửa caption trong composition cho khớp nội dung ảnh
thật), lưu tại `assets/img/article-hero.jpg` (1200×630).

**Lưu ý nguồn tin**: mục "Chọn tin ứng viên" ban đầu chọn bài Znews về VietinBank đóng cửa phòng
giao dịch (`id: 8674459ca5bb`, đã POST đánh dấu `used` với `video: vietinbank-dong-cua-130-phong-giao-dich`
trước khi phát hiện lỗ hổng hạ tầng bên dưới) — nhưng ảnh bài báo nằm ở domain `photo.znews.vn`,
CHƯA nằm trong Custom network allowlist của môi trường (khác `zadn.vn`/`static.znews.vn` — cả 2 đều
KHÔNG áp dụng cho subdomain ảnh này), bị chặn 403 ở tầng CONNECT. Theo đúng bài học đã ghi trong
`PRODUCTION-WORKFLOW-BOT-BAN-HANG.md` mục 10.13 ("ưu tiên phương án tự host/dùng domain đã
allowlist sẵn thay vì xin thêm domain mới khi có thể", và không được tự ý gọi proxy/endpoint vòng
qua allowlist mạng) — đã đổi sang tin Dân Trí này (`id: 71908bd99fc3`, cùng đã POST đánh dấu `used`
với `video: vingroup-khach-tra-truoc-144-nghin-ty`), ảnh dùng domain `cdnphoto.dantri.com.vn` đã
verify hoạt động nhiều lần trước đó. **Việc nên làm sau (không bắt buộc)**: thêm `photo.znews.vn`
vào Custom allowlist nếu muốn dùng được ảnh trực tiếp từ Znews trong các lần chạy sau.

## Số liệu xác nhận (KHÔNG bịa thêm số ngoài danh sách này)

- Doanh nghiệp: **Tập đoàn Vingroup** (mã chứng khoán: **VIC**)
- Khoản người mua trả tiền trước cho **chuyển nhượng bất động sản**: **143.654 tỷ đồng** (30/6/2026),
  tăng từ **113.102 tỷ đồng** (đầu năm) — tăng hơn **30.500 tỷ đồng**, tương đương khoảng **27%**
  trong 6 tháng
- Ngoài bất động sản, khách trả trước thêm: xây dựng + dịch vụ hơn **31.900 tỷ đồng**; mua xe hơn
  **1.300 tỷ đồng**; khoản khác hơn **2.000 tỷ đồng**
- **Tổng người mua trả tiền trước ngắn hạn**: hơn **179.000 tỷ đồng**, tăng gần **40.000 tỷ đồng**
  so với đầu năm
- **Doanh thu thuần 6 tháng đầu năm**: gần **222.000 tỷ đồng**, tăng khoảng **72%** so với cùng kỳ
  (hơn **69.000 tỷ đồng**)
- **Lợi nhuận sau thuế**: gần **21.000 tỷ đồng**, so với hơn **4.600 tỷ đồng** cùng kỳ năm trước
  (gấp hơn 4 lần)
- **Hàng tồn kho** (bất động sản để bán...) cuối tháng 6: hơn **289.277 tỷ đồng**, so với khoảng
  **213.466 tỷ đồng** đầu năm
- **Tổng tài sản**: từ gần **1,12 triệu tỷ đồng** đầu năm lên khoảng **1,31 triệu tỷ đồng** cuối
  tháng 6

## Cấu trúc 6 act

1. **Hook** (cố định, không thuộc style) — headline bao quát: khách mua nhà trả trước cho Vingroup
   gần 144.000 tỷ đồng, hero number **144.000** đơn vị "tỷ đồng".
2. **What happened** — theo báo cáo tài chính bán niên 2026 đã soát xét, khoản người mua trả tiền
   trước cho hoạt động chuyển nhượng bất động sản của Vingroup đạt 143.654 tỷ đồng tại 30/6. Article
   Image Card dùng ảnh Vinhomes từ Dân Trí; thêm 1 dải mã màu cam/trắng nhỏ dưới badge nguồn mô
   phỏng chỉ số thị trường đang chạy (texture trang trí, xác lập tông "bảng giá" của style).
3. **Key facts** (mỗi fact có icon mũi tên nến cạnh số thứ tự): (1) tăng từ 113.102 tỷ đồng đầu năm
   lên 143.654 tỷ đồng — tăng khoảng 27%; (2) tổng người mua trả tiền trước ngắn hạn đạt hơn 179.000
   tỷ đồng; (3) doanh thu thuần 6 tháng đạt gần 222.000 tỷ đồng, tăng khoảng 72% so với cùng kỳ.
4. **Data moment** — hero number **21.000** tỷ đồng (lợi nhuận sau thuế 6 tháng), mã "VIC" phía
   trên, đường line chart nhỏ chạy ngang phía sau số (vẽ dần trái→phải, chạm đỉnh lúc số chốt); phụ
   đề "So với 4.600 tỷ đồng cùng kỳ năm trước — gấp hơn 4 lần".
5. **Context** — biểu đồ nến 4 cột (đầu năm → cuối tháng 6, màu cam cho tăng): doanh thu thuần
   (69.000 → 222.000 tỷ), lợi nhuận sau thuế (4.600 → 21.000 tỷ), hàng tồn kho (213.466 → 289.277
   tỷ), tổng tài sản (1,12 triệu → 1,31 triệu tỷ đồng).
6. **Impact** — act cuối, sự thật/số liệu (không suy đoán): 2 sparkline nằm ngang xếp chồng — (1)
   "Tổng tài sản Vingroup: 1,12 triệu tỷ → 1,31 triệu tỷ đồng (đầu năm → cuối tháng 6)"; (2)
   "Doanh thu thuần 6 tháng: gần 222.000 tỷ đồng, tăng khoảng 72% so với cùng kỳ 2025". Giữ hình +
   brand anchor tới hết video.

## Ghi chú thiết kế

- Stock Terminal là ẩn dụ mới (chưa dùng lần nào) — ngôn ngữ "bảng giá/biểu đồ tài chính chuyên
  sâu" xuyên suốt act 2-6: mã cổ phiếu "VIC" xuất hiện như một chi tiết chrome (không phải nội dung
  chính, chỉ xác lập tông), candlestick mini cạnh mỗi fact, line chart phía sau số hero, biểu đồ nến
  4 cột ở Context, sparkline đôi ở Impact.
- KHÔNG dùng xanh lá cho biến động tăng (đúng nguyên tắc màu brand) — mọi "nến"/sparkline tăng dùng
  màu cam #E8441E, phần trung tính/nền dùng trắng/xám, không thêm màu ngoài palette đã duyệt.
- Ảnh bài báo thật (chân dung ông Phạm Nhật Vượng, Dân Trí) dùng trong Article Image Card ở act 2 —
  không tràn full-bleed, có badge "BOT BÁN HÀNG" góc ảnh theo đúng Article Image System.
- Không suy đoán/dự báo diễn biến tương lai của Vingroup hay thị trường bất động sản — mọi câu đều
  là số liệu/sự kiện đã công bố trong báo cáo tài chính bán niên đã soát xét, không có act
  "Takeaway"/nhận định.
