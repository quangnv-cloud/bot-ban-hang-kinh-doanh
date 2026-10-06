# BRIEF — Nhà đầu tư ngoại rút hơn 400 triệu USD sau nửa tháng nâng hạng

## Nguồn
- VnExpress: "Nhà đầu tư ngoại rút hơn 400 triệu USD sau nửa tháng nâng hạng" —
  https://vnexpress.net/nha-dau-tu-ngoai-rut-hon-400-trieu-usd-sau-nua-thang-nang-hang-5129108.html
  (đăng 16:01, 6/10/2026 giờ Việt Nam)
- Nguồn hiển thị trên video: "Nguồn: VnExpress"
- Ảnh Hook/Article Image Card: `assets/images/hook-photo.jpg` (tải qua Apps Script, id tin
  `fb314402cc51`, ảnh gốc VnExpress)

## Nội dung chính (đã xác minh từ bài báo, KHÔNG suy đoán thêm)
- **Tổng rút vốn**: hơn 400 triệu USD (khoảng 10.800 tỷ đồng) trong 10 phiên giao dịch liên tiếp,
  tính từ ngày thị trường chứng khoán Việt Nam chính thức được nâng hạng (21/9/2026).
- **Phiên gần nhất**: khối ngoại chỉ giải ngân 2.100 tỷ đồng nhưng bán ròng tới 4.900 tỷ đồng.
- **Từ đầu năm 2026**: nhà đầu tư nước ngoài đã rút khoảng 3,7 tỷ USD.
- **Tỷ lệ sở hữu nước ngoài**: chỉ còn 13,2% vào cuối tháng 9/2026 — mức thấp nhất trong lịch sử
  thị trường.
- **2 cổ phiếu bị rút vốn nhiều nhất**: HDBank (hơn 73 triệu cổ phiếu); PNJ (gần 5 triệu cổ phiếu,
  khiến cổ phiếu này giảm sàn).
- **Nguyên nhân (2 yếu tố, theo giới phân tích)**:
  1. Lệch pha giao dịch — các quỹ chủ động chốt lời để tái cơ cấu danh mục, trong khi quỹ thụ động
     đã hoàn tất giải ngân trước ngày nâng hạng.
  2. Dịch chuyển dòng vốn toàn cầu — tiền quốc tế chảy về cổ phiếu công nghệ Mỹ, Nhật Bản, Trung
     Quốc thay vì các thị trường mới nổi.
- **Tình trạng thị trường hiện tại**: VN-Index mất khoảng 3% so với trước ngày nâng hạng, đang
  quanh 1.760 điểm. Thanh khoản thấp liên tục, chưa phiên nào vượt 20.000 tỷ đồng kể từ ngày
  nâng hạng.

## Góc độ kinh doanh/kinh tế khai thác cho video
Nghịch lý đáng chú ý: ngay sau khi thị trường chứng khoán Việt Nam được nâng hạng lên mới nổi thứ
cấp (một cột mốc được kỳ vọng hút vốn ngoại), khối ngoại lại bán ròng liên tục và rút hơn 400 triệu
USD chỉ trong nửa tháng — đẩy tỷ lệ sở hữu nước ngoài xuống mức thấp nhất lịch sử. Video khai thác
đúng số liệu dòng vốn/thanh khoản, không suy đoán xu hướng sắp tới.

## Cách dựng (construction style)
`claim_style` trả về: **index 9 — "10-stock-terminal"** (Stock Terminal). Ẩn dụ bảng giá/biểu đồ
tài chính chuyên sâu — rất khớp với tin thuần số liệu thị trường chứng khoán này:
- What happened: ảnh bài báo + panel chuẩn, thêm 1 dải mã màu cam/trắng nhỏ dưới badge nguồn mô
  phỏng chỉ số thị trường đang chạy (texture trang trí, không phải số liệu thật).
- Key facts: 3 fact, mỗi fact có icon mũi tên nến (candlestick mini, hướng xuống vì đều là dòng
  vốn rút ra) cạnh số liệu — (1) từ đầu năm rút 3,7 tỷ USD (2) HDBank bị rút hơn 73 triệu cổ phiếu
  (3) PNJ bị rút gần 5 triệu cổ phiếu, giảm sàn.
- Data moment: con số chính **13,2%** (tỷ lệ sở hữu nước ngoài, thấp nhất lịch sử) với 1 đường
  line chart nhỏ chạy ngang phía sau, đi xuống rồi count-up chốt giá trị cuối.
- Context: 2 "thẻ nguyên nhân" dạng candlestick-card (icon nến giảm nhỏ cạnh mỗi thẻ, không phải
  dữ liệu thật — chỉ là ẩn dụ hình ảnh của style) — lệch pha giao dịch quỹ chủ động/thụ động; dòng
  vốn toàn cầu dịch chuyển về Mỹ/Nhật/Trung Quốc.
- Impact: 2 sparkline nằm ngang xếp chồng — VN-Index quanh 1.760 điểm (giảm ~3%); thanh khoản chưa
  vượt 20.000 tỷ đồng kể từ nâng hạng.

## Act cuối (Impact) — sự thật/số liệu, không suy đoán
Kết thúc bằng tình trạng thị trường TẠI THỜI ĐIỂM BÀI BÁO (VN-Index quanh 1.760 điểm, giảm ~3%;
thanh khoản chưa vượt 20.000 tỷ đồng kể từ nâng hạng) — đây là số liệu/thực trạng đã xảy ra, KHÔNG
phải dự đoán của video về diễn biến thị trường sắp tới.
