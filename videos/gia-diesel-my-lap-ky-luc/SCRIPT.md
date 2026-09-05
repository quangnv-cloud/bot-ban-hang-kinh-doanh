# SCRIPT — Giá dầu diesel lập kỷ lục mọi thời đại tại Mỹ

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio:
`assets/voice/line1.mp3` ... `line6.mp3`.

1. **Hook** — `line1.mp3`
   > Giá dầu diesel tại Mỹ vừa lập kỷ lục mọi thời đại, 5,85 đô la một gallon.

2. **What happened** — `line2.mp3`
   > Mức giá bán lẻ này đã vượt kỷ lục cũ 5,816 đô la một gallon, thiết lập hồi tháng 6 năm 2022.

3. **Key facts** — `line3.mp3`
   > Diesel tăng tới 40% chỉ trong chưa đầy 2 tháng, trong khi giá dầu Brent lại giảm hơn 42 đô la một thùng so với đỉnh hồi tháng 4.

4. **Data moment** — `line4.mp3`
   > 5,85 đô la một gallon — mức giá diesel cao nhất từng được ghi nhận tại Mỹ.

5. **Context** — `line5.mp3`
   > Nguyên nhân đến từ rủi ro địa chính trị ở Trung Đông và Nga, cộng với việc các nhà máy lọc dầu toàn cầu đã chạy gần hết công suất, khiến tồn kho tại Mỹ rơi xuống mức thấp kỷ lục.

6. **Impact** — `line6.mp3`
   > Diesel vận hành xe tải và máy nông nghiệp, nên chi phí vận chuyển tăng đã được cộng thẳng vào giá bán lẻ sữa, bánh mì và ngũ cốc.

## On-screen text (khác voice, cô đọng hơn cho từng frame — style 10 Stock Terminal)

- Hook: masthead "Bot Bán Hàng" · badge "Nguồn: Dân Trí · 5/9/2026" · kicker "NĂNG LƯỢNG" ·
  headline "Giá dầu diesel tại Mỹ lập kỷ lục mọi thời đại" · số hero "5,85 USD" đơn vị/label
  "MỖI GALLON — KỶ LỤC MỌI THỜI ĐẠI"
- What happened: dải mã màu mini mô phỏng chỉ số thị trường (texture trang trí) ngay dưới badge
  nguồn · headline "Diesel Mỹ vượt kỷ lục cũ lập năm 2022" · kicker "05/09/2026" · Article Image
  Card (ảnh vòi bơm diesel thật) + caption "Nguồn: Dân Trí"
- Key facts (3 dòng, mỗi dòng có icon mũi tên nến — candlestick mini — cạnh số thứ tự, nến
  "nở" cao/thấp theo tăng/giảm):
  01 — "5,816 → 5,85 USD" · "Kỷ lục cũ (6/2022) bị phá"  [nến tăng, màu cam]
  02 — "+40%" · "Mức tăng của diesel trong chưa đầy 2 tháng"  [nến tăng, màu cam]
  03 — "Brent -42 USD/thùng" · "Dầu thô giảm nhưng diesel vẫn tăng"  [nến giảm, màu trắng/xám]
- Data moment: số chính "5,85 USD" với đường line chart nhỏ chạy ngang phía sau, vẽ dần từ trái
  sang phải, chạm đỉnh đúng lúc số count-up chốt giá trị · mã hiệu nhỏ phía trên "DIESEL · USA" ·
  nhãn dưới "GALLON — KỶ LỤC MỌI THỜI ĐẠI"
- Context: biểu đồ nến đầy đủ (4-6 cột đơn giản, cam/trắng) minh hoạ Brent giảm dần (đỉnh
  138,21 USD/thùng đầu tháng 4 → ~96 USD/thùng đầu tháng 9) đối lập cột diesel tăng ngược chiều,
  mỗi cột có nhãn số liệu phía trên · kicker "NGUYÊN NHÂN: LỌC DẦU CHẠM TRẦN CÔNG SUẤT · TỒN KHO
  THẤP KỶ LỤC · RỦI RO TRUNG ĐÔNG & NGA"
- Impact (2 sparkline nằm ngang xếp chồng, đường vẽ xong thì số liệu cuối dòng mới xuất hiện,
  giữ hình + brand anchor tới hết video):
  Dòng 1 — sparkline tăng · "CHI PHÍ VẬN TẢI" · "Xe tải & máy nông nghiệp chạy diesel"
  Dòng 2 — sparkline tăng · "GIÁ BÁN LẺ THỰC PHẨM" · "Sữa, bánh mì, ngũ cốc đội chi phí vận chuyển"

## Lưu ý thiết kế Stock Terminal (Style 10, lần đầu dùng — không copy bố cục style khác)

- Ngôn ngữ hình ảnh xuyên suốt: bảng giá/biểu đồ tài chính chuyên sâu — candlestick mini, line
  chart chạy ngang, sparkline — khác hẳn mẩu giấy cắt dán (style 9), lưới ô vuông (style 8), trục
  thời gian có node (style 7) đã dùng gần đây.
  - Màu nến: CAM cho điểm nhấn tích cực/quan trọng (kể cả khi số liệu là diesel TĂNG — vốn là tin
    xấu về giá, nhưng đúng quy tắc màu brand không dùng xanh lá cho "tăng"), trắng/xám cho phần
    trung tính/giảm — không tự thêm xanh lá/đỏ ngoài palette đã duyệt.
  - Line chart ở Data moment và sparkline ở Impact vẽ bằng `<path>`/`<line>` với `stroke-dasharray`
    + `getTotalLength()` (đáng tin cậy trên các phần tử này, khác `<circle>`/`<rect>`) — có
    `opacity: 0` mặc định trong CSS trước khi tween chạy, tránh lộ tĩnh trước thời điểm reveal.
  - Key facts dùng đúng bố cục "icon nến mini cạnh số thứ tự" mô tả trong catalog style — không
    phải mẩu giấy xoay lệch (style 9) hay ô vuông icon (style 8).
  - Context dùng đúng bố cục "biểu đồ nến 4-6 cột" — không phải trục thời gian ngang có node
    (style 7) hay pull-quote block (style 9).
