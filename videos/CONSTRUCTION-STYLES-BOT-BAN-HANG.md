# 10 Cách dựng (Construction Styles) — BOT BÁN HÀNG · KINH DOANH

Danh mục các "hệ ngôn ngữ hình ảnh" (construction style) để xoay vòng giữa các video, tránh lặp bố
cục. Đọc song song với `BRAND-SYSTEM-BOT-BAN-HANG.md` (quy tắc màu/font/act cố định) và
`PRODUCTION-WORKFLOW-BOT-BAN-HANG.md` (quy trình dựng).

## Phạm vi áp dụng của "cách dựng"

Mỗi video có **6 act**: Hook · What happened · Key facts · Data moment · Context · Impact (act
"Takeaway" đã bị bỏ hẳn — xem `BRAND-SYSTEM-BOT-BAN-HANG.md`).

- **Hook (act 1) và Brand Anchor (logo/nguồn góc trên) LUÔN CỐ ĐỊNH** ở mọi style — cấu trúc
  title-card (ảnh nửa trên → panel tối nửa dưới → masthead → badge nguồn → tiêu đề lớn). Đây là
  "đầu chương trình" nhận diện kênh, không đổi theo style, giống cách một bản tin truyền hình luôn
  mở đầu giống nhau dù nội dung mỗi ngày khác nhau.
- **5 act còn lại (What happened / Key facts / Data moment / Context / Impact) đổi thiết bị hình
  ảnh theo từng style** — đây là phần tạo cảm giác "mỗi video một kiểu".

## Cơ chế xoay vòng

File trạng thái `videos/style-rotation-state.json` lưu danh sách 10 style + con trỏ style dùng gần
nhất. Trước khi dựng video mới (thủ công hoặc tự động), đọc file này, dùng
`(last_used_index + 1) % 10` làm style cho video mới, rồi cập nhật lại con trỏ + ghi log ngày giờ/
tên video vào cùng file. Không bỏ qua bước cập nhật này — nếu quên, style sẽ không xoay đúng vòng.

## Bảng tổng hợp 10 style

| # | Tên style | Ẩn dụ hình ảnh | Video đã dùng |
| - | --- | --- | --- |
| 1 | Card & Bar | Thẻ viền bo góc có số thứ tự, biểu đồ cột dọc | `lan-bien-chuyen-nhuong-50-dat` |
| 2 | Chip & Leaderboard | Chip số liệu viền cam, bảng xếp hạng ngang, watermark số khổng lồ | `100-doanh-nghiep-tu-nhan-nop-thue` |
| 3 | Ticker Tape | Dải tin chạy kiểu bảng điện sàn chứng khoán | *(chưa dùng)* |
| 4 | Split Comparison | Chia đôi màn hình, đường phân cách dọc, đối chiếu 2 vế | `vingroup-von-hoa-ky-luc-1-8-trieu-ty` |
| 5 | Map & Geo | Bản đồ Việt Nam vector, ghim địa danh | *(chưa dùng)* |
| 6 | Ring Progress | Vòng tròn tiến trình (radial), số liệu ở tâm | *(chưa dùng)* |
| 7 | Timeline Chronology | Trục thời gian ngang có mốc/node nối nhau | `vn-index-chuoi-tang-7-phien-dai-nhat-nam` |
| 8 | Icon Grid | Lưới ô icon ngành/nhóm kèm số liệu | *(chưa dùng)* |
| 9 | Editorial Clipping | Mảnh báo cắt dán chồng lớp, dấu ngoặc kép lớn | *(chưa dùng)* |
| 10 | Stock Terminal | Biểu đồ nến/đường kiểu bảng giá chứng khoán, sparkline | *(chưa dùng)* |

---

## Style 3 — Ticker Tape

**Ẩn dụ**: bảng điện sàn giao dịch chứng khoán / news ticker truyền hình tài chính. Nhịp nhanh,
chữ số chạy ngang, cảm giác "thị trường đang chuyển động liên tục".

- **What happened**: ảnh nền mờ + một dải ngang (ticker bar) viền trên/dưới màu cam chạy full-width
  chứa nguồn + tiêu đề rút gọn, chữ trắng trên nền tối, có 1 dấu chấm nhấp nháy (pulse dot) đầu dải
  kiểu "LIVE". Headline chính nằm phía trên dải ticker, dải ticker đóng vai trò dòng phụ đang "chạy".
- **Key facts**: từng fact xuất hiện dạng dòng lệnh terminal — mỗi dòng có ký hiệu `▲`/`▼` (tăng/
  giảm, màu cam/trắng tùy dấu) đứng trước số liệu, reveal bằng gõ chữ (typewriter) từng ký tự thay
  vì slide/fade cả khối.
- **Data moment**: con số chính đặt giữa 2 vạch kẻ ngang mảnh (như một dòng bảng giá), có mã hiệu
  nhỏ phía trên kiểu "mã cổ phiếu" (2-4 ký tự viết hoa liên quan tên doanh nghiệp/ngành) chạy trước
  khi số chính count-up.
- **Context**: dải sparkline mảnh (đường zig-zag đơn giản, không trục, không nhãn) chạy phía sau
  each dòng so sánh, vẽ bằng `stroke-dasharray` draw-in đồng bộ với số liệu xuất hiện.
- **Impact**: 2-3 "dòng bảng giá" xếp chồng, mỗi dòng có tên nhóm ngành bên trái + số liệu bên phải
  + mũi tên tăng/giảm, cách nhau bằng đường kẻ mảnh ngang (không dùng card viền).

## Style 4 — Split Comparison

**Ẩn dụ**: đối chiếu trực diện 2 vế (năm nay/năm trước, trước/sau, A/B) bằng chia đôi khung hình.

- **What happened**: màn hình chia dọc 2 nửa — nửa trái ảnh bài báo, nửa phải panel tối chứa
  kicker + tiêu đề, đường phân cách là 1 vạch cam mảnh dọc chính giữa (khác hẳn kiểu ảnh-trên/
  panel-dưới đã dùng ở style 1 & 2).
- **Key facts**: mỗi fact là 1 hàng chia đôi trái/phải — nhãn ở trái (nhỏ, xám), giá trị ở phải
  (lớn, trắng/cam) căn phải, có vạch dọc mảnh ở giữa hàng làm điểm neo thị giác.
- **Data moment**: 2 con số đặt cạnh nhau qua 1 vạch "VS" ở giữa (kiểu tỷ số) — số bên trái mờ/nhỏ
  hơn (giá trị cũ/nền), số bên phải lớn/nổi bật (giá trị mới/chính), vạch VS có động tác "đẩy"
  (scale pulse) khi 2 số xuất hiện.
- **Context**: bảng so sánh 2 cột đối xứng (không phải danh sách dọc) — cột trái nhãn "trước", cột
  phải nhãn "sau/nay", mỗi hàng 2 cột reveal đồng thời từ 2 phía vào giữa.
- **Impact**: chia đôi màn hình ngang (trên/dưới thay vì trái/phải để đổi nhịp so với act 2), mỗi
  nửa 1 ý nghĩa tác động, đường phân cách ngang.

## Style 5 — Map & Geo

**Ẩn dụ**: câu chuyện có yếu tố địa lý — vùng miền, thành phố, khu vực kinh tế. Dùng khi tin có
nhân tố địa danh rõ (vd. "TP.HCM dẫn đầu", "miền Bắc tăng trưởng...").

- **What happened**: ảnh bài báo + badge nguồn như chuẩn, nhưng thêm 1 ghim địa danh nhỏ (dot +
  label) góc dưới ảnh chỉ đúng vị trí liên quan tin, không cần bản đồ đầy đủ ở act này.
- **Key facts**: bản đồ Việt Nam vector đơn giản (outline trắng/xám trên nền tối) làm nền mờ phía
  sau danh sách fact, các fact liên quan vùng miền có icon ghim nhỏ cạnh số thứ tự.
- **Data moment**: con số chính đặt trong 1 vòng tròn ghim (map pin) phóng to làm hình chủ đạo,
  pin "rơi xuống" (drop-in, bounce nhẹ) trước khi số count-up bên trong/cạnh pin.
- **Context**: bản đồ Việt Nam với 3-5 vùng/tỉnh được highlight tuần tự (tô màu cam tăng dần độ
  đậm theo thứ hạng số liệu), có đường nối (connection line) từ vùng ra nhãn số liệu bên cạnh.
- **Impact**: 2 tấm "thẻ địa danh" trượt vào từ 2 hướng khác nhau, mỗi thẻ có icon ghim + tên vùng
  + số liệu tác động, nền là bản đồ mờ full-frame phía sau cả 2 thẻ.

## Style 6 — Ring Progress

**Ẩn dụ**: đồng hồ đo/vòng tiến trình — nhấn mạnh tỷ lệ phần trăm, mức độ hoàn thành/đóng góp.

- **What happened**: chuẩn ảnh + panel, nhưng badge nguồn đổi thành 1 vòng tròn nhỏ viền cam bao
  quanh icon nguồn (thay vì pill bo góc) để giới thiệu ngôn ngữ hình tròn xuyên suốt style này.
- **Key facts**: mỗi fact có 1 vòng tròn tiến trình nhỏ (mini radial, ~80px) bên trái thay cho
  vạch/số thứ tự — vòng tự vẽ đầy theo % liên quan (hoặc vẽ đầy 100% nếu fact không phải %).
  Text fact nằm bên phải vòng.
- **Data moment**: con số chính nằm giữa 1 vòng tiến trình khổng lồ (radial chiếm phần lớn khung
  hình), vòng vẽ đầy đồng bộ với count-up của số — đây là ẩn dụ trung tâm của cả style.
- **Context**: 3-4 vòng tiến trình cỡ vừa xếp hàng ngang (thay bảng xếp hạng dạng thanh), % hiện
  dưới mỗi vòng, vòng vẽ đầy tuần tự trái→phải.
- **Impact**: 2 vòng tiến trình lớn đặt cạnh nhau (nửa trái/nửa phải khung hình), mỗi vòng đại
  diện 1 nhóm tác động, có nhãn + số liệu ở tâm mỗi vòng.

## Style 7 — Timeline Chronology

**Ẩn dụ**: trục thời gian — dùng tốt cho tin có diễn biến qua nhiều mốc (quý/năm/giai đoạn).

- **What happened**: chuẩn ảnh + panel, thêm 1 nhãn mốc thời gian nhỏ (vd. "2025") dạng badge
  cạnh kicker để mở đầu ngôn ngữ "thời gian" của style.
- **Key facts**: 3 fact xếp dọc theo 1 trục đứng bên trái (đường kẻ dọc + node tròn tại mỗi fact,
  node "nở" ra khi fact xuất hiện), khác hẳn vạch ngang đơn của style 1/2.
- **Data moment**: con số chính xuất hiện tại 1 node lớn trên trục ngang ở giữa khung hình, trục
  vẽ dần từ trái sang phải rồi dừng tại node khi số chốt.
- **Context**: trục thời gian NGANG đầy đủ với 4-5 mốc (node + nhãn năm/quý dưới mỗi node + giá
  trị trên mỗi node), trục vẽ liên tục qua các mốc, node sau đậm/to hơn node trước nếu số liệu
  tăng dần.
- **Impact**: 2 node cuối trục (tiếp nối từ act Context) phóng to thành 2 khối nội dung tác động,
  vẫn giữ đường trục nối phía sau làm chỉ dấu liền mạch với act trước.

## Style 8 — Icon Grid

**Ẩn dụ**: lưới phân loại — mạnh khi tin có nhiều nhóm/ngành/hạng mục cần liệt kê song song.

- **What happened**: chuẩn ảnh + panel, 2 chip số liệu (như style 2) đổi thành 2 ô vuông nhỏ có
  icon phía trên số liệu (thay vì chip pill viền), báo hiệu ngôn ngữ "ô lưới" của style.
- **Key facts**: 3 fact trình bày thành 3 ô vuông/chữ nhật trong lưới 1x3 hoặc 3x1, mỗi ô có icon
  đại diện (không dùng số thứ tự 01/02/03), border mảnh phân ô.
- **Data moment**: con số chính nằm trong 1 ô lớn ở giữa lưới 3 ô (2 ô phụ 2 bên mờ/nhỏ chứa số
  liệu bổ trợ) — bố cục "1 ô chính + 2 ô phụ" thay vì số đơn độc giữa khung.
- **Context**: lưới 2x2 hoặc 2x3 các ô icon+số liệu xuất hiện tuần tự theo hàng (không phải danh
  sách dọc hay thanh ngang) — mô phỏng dashboard nhiều chỉ số cùng lúc.
- **Impact**: lưới 2 ô lớn cạnh nhau (mỗi ô = 1 tác động), border mảnh, icon lớn phía trên tiêu đề
  mỗi ô.

## Style 9 — Editorial Clipping

**Ẩn dụ**: cắt dán báo giấy — cảm giác "biên tập", chồng lớp, dấu ngoặc kép báo chí lớn.

- **What happened**: ảnh bài báo đặt lệch (xoay nhẹ 1-2°) như 1 mẩu báo cắt dán, có viền trắng
  mỏng quanh ảnh (mô phỏng giấy), panel tối bên dưới có dấu ngoặc kép lớn mờ phía sau tiêu đề.
- **Key facts**: 3 fact trình bày như 3 "mẩu giấy" xếp chồng lệch nhau (mỗi mẩu xoay nhẹ góc khác
  nhau, đổ bóng nhẹ), không dùng vạch/số thứ tự thẳng hàng.
- **Data moment**: con số chính có dấu ngoặc kép khổng lồ mờ phía sau (như đang trích dẫn số liệu
  "nổi bật" từ bài báo), viền dưới con số là 1 nét gạch chân tay-vẽ (hand-drawn underline, vẽ bằng
  path không đều thay vì đường thẳng).
- **Context**: các dòng so sánh trình bày như 1 đoạn trích báo (pull-quote block), mỗi dòng có dấu
  gạch đầu dòng kiểu "clipping" (không phải bar chart hay leaderboard).
- **Impact**: 2 "mẩu báo" cắt dán chồng lên nhau một phần (lớp trước che góc lớp sau), mỗi mẩu là
  1 tác động, tạo cảm giác chiều sâu vật lý.

## Style 10 — Stock Terminal

**Ẩn dụ**: bảng giá/biểu đồ tài chính chuyên sâu — dùng tốt cho tin thuần số liệu thị trường.

- **What happened**: chuẩn ảnh + panel, thêm 1 dải mã màu xanh/cam nhỏ dưới badge nguồn mô phỏng
  chỉ số thị trường đang chạy (không phải nội dung thật, chỉ là texture trang trí xác lập tông).
- **Key facts**: mỗi fact có 1 icon mũi tên nến (candlestick mini) cạnh số thứ tự thay cho vạch
  cam đơn thuần — vạch nến "nở" cao/thấp theo tính tăng/giảm của fact đó.
- **Data moment**: con số chính có 1 đường biểu đồ (line chart) nhỏ chạy NGANG phía sau con số,
  đường vẽ dần từ trái sang phải, chạm đỉnh đúng lúc số count-up chốt giá trị cuối.
- **Context**: biểu đồ nến đầy đủ (4-6 cột nến đơn giản, xanh/cam) thay cho bar chart hay
  leaderboard, mỗi cột có nhãn số liệu phía trên.
- **Impact**: 2 sparkline nằm ngang xếp chồng (mỗi dòng 1 tác động), đường sparkline vẽ xong thì
  số liệu cuối dòng mới xuất hiện, mô phỏng "chart đang cập nhật realtime".

---

## Nguyên tắc dùng chung cho mọi style mới (bắt buộc)

- Vẫn tuân thủ TOÀN BỘ brand system: màu #E8441E/#FFFFFF/#111111, Montserrat mọi vai trò chữ,
  sentence case, WCAG AA contrast, brand anchor cố định góc trên, act cuối là sự thật/số liệu
  (không suy đoán).
- Mỗi style là **ẩn dụ hình ảnh**, không phải màu sắc mới — không tự thêm màu ngoài palette đã
  duyệt dù ẩn dụ có gợi ý màu khác (vd. Stock Terminal KHÔNG dùng xanh lá cho nến tăng — vẫn dùng
  cam cho điểm nhấn tích cực/quan trọng, trắng/xám cho phần trung tính, đúng quy tắc màu đã chốt).
- Khi build 1 style lần đầu (video thật), tài liệu ở đây chỉ là **định hướng** — vẫn phải tự dựng
  HTML/CSS/GSAP mới hoàn toàn cho từng act, verify bằng Studio thumbnail + render thật như quy
  trình chuẩn, không được coi mô tả text này là đặc tả đủ chi tiết để bỏ qua bước thiết kế thật.
