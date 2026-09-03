# SCRIPT — Giá xăng tăng mạnh đẩy CPI tháng 8 tăng 0,47%

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio:
`assets/voice/line1.mp3` ... `line6.mp3`.

1. **Hook** — `line1.mp3`
   > Giá xăng tăng mạnh trong tháng 8 khiến chỉ số giá tiêu dùng cả nước tăng 0,47% so với tháng trước.

2. **What happened** — `line2.mp3`
   > Theo báo cáo của Cục Thống kê, trong 11 nhóm hàng hóa và dịch vụ tiêu dùng chính, có tới 10 nhóm tăng giá trong tháng 8.

3. **Key facts** — `line3.mp3`
   > So với tháng 12 năm ngoái, CPI tăng 3,57%, còn so với cùng kỳ năm trước, mức tăng lên tới 4,89%, trong đó nhóm giao thông tăng mạnh nhất với 4,09%.

4. **Data moment** — `line4.mp3`
   > Nguyên nhân chính đến từ nhiên liệu: giá xăng tăng 9,53%, còn dầu diesel tăng tới 22,15% trong tháng 8.

5. **Context** — `line5.mp3`
   > Bên cạnh đó, giá gas tăng 4,19%, dầu hỏa tăng 4,63%, trong khi ô tô đã qua sử dụng giảm 0,63% và vé tàu hỏa giảm 9,86%.

6. **Impact** — `line6.mp3`
   > Tính chung 8 tháng đầu năm, CPI bình quân tăng 4,45% so với cùng kỳ, cao hơn hẳn mức tăng 3,25% của cùng kỳ năm ngoái.

## On-screen text (khác voice, cô đọng hơn cho từng frame — style 6 Ring Progress)

- Hook: masthead "Bot Bán Hàng" · badge "Nguồn: Dân Trí · 3/9/2026" · kicker "GIÁ CẢ · LẠM PHÁT" ·
  headline "Giá xăng tăng mạnh đẩy CPI tháng 8 tăng 0,47%" · số hero "0,47%" đơn vị/label "CPI
  THÁNG 8 SO VỚI THÁNG TRƯỚC"
- What happened (badge nguồn đổi thành vòng tròn viền cam bao icon nguồn): headline "10/11 nhóm
  hàng tăng giá trong tháng 8" · kicker "BÁO CÁO CỤC THỐNG KÊ" · dòng phụ "CPI tháng 8/2026 tăng
  0,47% so với tháng trước · riêng nhóm ăn uống giảm 0,03%" · Article Image Card (ảnh nhân viên đổ
  xăng) + caption "Nguồn: Dân Trí"
- Key facts (3 mini ring ~80px bên trái, text bên phải, vòng vẽ đầy theo đúng tỉ lệ % + count-up):
  Ring 1 — label "SO VỚI THÁNG 12/2025" giá trị "+3,57%"
  Ring 2 — label "SO VỚI CÙNG KỲ NĂM TRƯỚC" giá trị "+4,89%"
  Ring 3 — label "NHÓM GIAO THÔNG — TĂNG MẠNH NHẤT" giá trị "+4,09%"
- Data moment (1 ring khổng lồ chiếm phần lớn khung hình, vẽ đầy đồng bộ count-up): số hero giữa
  ring "22,15%" label "DẦU DIESEL TĂNG TRONG THÁNG 8" · nhãn phụ nhỏ hơn cạnh ring "GIÁ XĂNG +9,53%"
  · dòng phụ dưới cùng "Nhiên liệu là nguyên nhân chính đẩy CPI đi lên"
- Context (3-4 ring cỡ vừa xếp hàng ngang, % hiện dưới mỗi ring, vẽ đầy tuần tự trái→phải — cam cho
  tăng, trắng/xám cho giảm, kèm dấu ▲/▼ trong nhãn):
  Ring "GAS" ▲ +4,19% (cam)
  Ring "DẦU HỎA" ▲ +4,63% (cam)
  Ring "Ô TÔ CŨ" ▼ -0,63% (trắng/xám)
  Ring "ĐƯỜNG SẮT" ▼ -9,86% (trắng/xám)
- Impact (2 ring lớn cạnh nhau nửa trái/nửa phải khung hình, nhãn + số ở tâm mỗi ring, giữ hình +
  brand anchor tới hết video):
  Ring trái — tâm "4,45%" · nhãn "CPI BÌNH QUÂN 8 THÁNG 2026 (SO CÙNG KỲ)"
  Ring phải — tâm "3,25%" · nhãn "MỨC TĂNG CÙNG KỲ 8 THÁNG 2025"

## Lưu ý thiết kế ring (áp dụng khi dựng, style 6 lần đầu build thật)

- Các % trong Key facts đều nhỏ (dưới 5%) — nếu vẽ đúng tỉ lệ tuyệt đối (fill = % / 100), vòng sẽ
  gần như rỗng, khó đọc bằng mắt trong ~1-2s trên màn hình nhỏ. Ưu tiên PHƯƠNG ÁN AN TOÀN: scale
  hiển thị theo một mốc trần hợp lý cho nhóm số liệu CPI (vd. coi 5% là "gần đầy vòng", không phải
  100%) — miễn nhất quán giữa các ring trong CÙNG một act để vẫn đọc được tương quan lớn/nhỏ đúng
  thực tế, KHÔNG bắt buộc vòng phải vẽ đúng % tuyệt đối theo thang 0-100 (sẽ làm mọi ring trông như
  nhau, mất hết ý nghĩa "ring = tiến trình"). Ghi rõ cách scale đã chọn trong code (comment ngắn)
  để lần dựng Ring Progress sau (nếu style quay lại) tham khảo.
- Act cuối (Impact) dùng đúng % tuyệt đối 4,45% và 3,25% — không cần scale vì đây là 2 số cùng đơn
  vị/thang so sánh trực tiếp với nhau, để đúng tỷ lệ tương đối tự nhiên.
