# SCRIPT — Việt Nam lần đầu vượt 14,1 triệu tài khoản chứng khoán, 99,6% là cá nhân

**Voice:** Vbee TTS, giọng "Ngọc Huyền nâng cao (Beta)" (`voice_code:
hn_female_ngochuyen_full_24k-stl`), `speed_rate: 1.09`.
**Voice direction:** Digital Business News — tự nhiên, rõ, nhanh vừa phải, có năng lượng, đáng tin.
**Ngôn ngữ:** Tiếng Việt. Không viết tắt — mọi dòng dưới đây viết đầy đủ đúng cách đọc thành tiếng,
số liệu viết bằng chữ theo cách người Việt đọc. USD → "đô la Mỹ". GDP → "tổng sản phẩm quốc nội".
VSD → không đọc nguyên tên viết tắt, dùng "cơ quan lưu ký chứng khoán Việt Nam". Tên riêng (FTSE
Russell, Việt Nam) đọc nguyên.

Mỗi dòng khớp với `data-duration` thật của frame tương ứng trong `index.html` (đo lại sau khi có
file voice thật).

---

## Line 1 — Hook (Frame 1)

**Delivery:** Dứt khoát, nhấn số liệu.

    Việt Nam lần đầu tiên vượt mốc mười bốn triệu một trăm nghìn tài khoản chứng khoán, trong đó chín mươi chín phẩy sáu phần trăm là nhà đầu tư cá nhân.

## Line 2 — What happened (Frame 2)

**Delivery:** Nhanh, có năng lượng, như đang dẫn tin.

    Theo thống kê của cơ quan lưu ký chứng khoán Việt Nam, riêng tháng chín thị trường ghi nhận thêm hai trăm bốn mươi bốn nghìn chín trăm bốn mươi chín tài khoản mở mới, mức cao nhất trong ba tháng qua.

## Line 3 — Key facts (Frame 3)

**Delivery:** Rõ ràng, nhấn số liệu khi từng mẩu giấy xuất hiện.

    Cá nhân trong nước mở mới hơn hai trăm bốn mươi bốn nghìn tài khoản trong tháng, nâng tổng số cá nhân lên hơn mười bốn triệu; tổ chức trong nước có hơn hai mươi nghìn tài khoản, nhà đầu tư nước ngoài có hơn năm mươi hai nghìn tài khoản.

## Line 4 — Data moment (Frame 4)

**Delivery:** Nhấn mạnh con số chính giữa khung hình.

    Chín mươi chín phẩy sáu phần trăm trong tổng số tài khoản chứng khoán Việt Nam hiện thuộc về nhà đầu tư cá nhân, tỷ lệ cao chưa từng có, cho thấy dòng tiền cá nhân đang gần như áp đảo hoàn toàn thị trường.

## Line 5 — Context (Frame 5)

**Delivery:** Điềm tĩnh, nhấn nhẹ khi từng dòng trích dẫn xuất hiện.

    Đà tăng trùng lúc FTSE Russell nâng hạng thị trường chứng khoán Việt Nam lên mới nổi thứ cấp trong tháng chín; mục tiêu chín triệu tài khoản năm hai nghìn không trăm hai mươi lăm và mười một triệu năm hai nghìn không trăm ba mươi đều đã về đích sớm.

## Line 6 — Impact (Frame 6, act cuối — giữ hình + brand anchor tới hết video)

**Delivery:** Chắc chắn, hạ giọng nhẹ ở cuối câu.

    Giới chức đặt mục tiêu kênh chứng khoán đóng góp khoảng tám mươi tỷ đô la Mỹ vốn mỗi năm cho nền kinh tế, giữa lúc Việt Nam hướng tới tăng trưởng tổng sản phẩm quốc nội trên mười phần trăm mỗi năm.

**[QC 2026-10-06] Đã sửa Line 6**: bản gốc có cụm "trong năm năm tới" (5 năm tới) — TTS Vbee nuốt mất 1 chữ "năm" do trùng âm với "năm" (year) liền kề, 3 lượt ASR độc lập (Gemini `flash-latest`/`flash-lite-latest`/`3.1-flash-lite`) đều nghe ra "trong năm tới" (next year, sai nghĩa so với kịch bản "5 năm tới"). Đã bỏ hẳn cụm thời gian gây trùng âm thay vì cố viết lại bằng chữ số, sinh lại `line6.mp3` và xác nhận lại bằng ASR.

**Lưu ý:** Không có act "Takeaway" — video kết thúc ngay sau Impact, giữ nguyên hình + brand anchor
tới hết. Logo + "Nguồn: Znews" hiển thị cố định góc trên suốt video (trừ Hook, tự mang nguồn/logo
riêng trong panel của nó). Toàn bộ số liệu lấy từ bài Znews (theo VSD) đăng 6/10/2026, không phải
suy đoán của video. Act cuối dùng 1 sự thật/mục tiêu đã công bố chính thức (Phó chủ tịch Ủy ban
Chứng khoán Nhà nước) — KHÔNG suy đoán mục tiêu có đạt được hay không.

## On-screen text (khác voice, cô đọng hơn cho từng frame — Style 9, Editorial Clipping)

- Hook: masthead "Bot Bán Hàng" · badge "Nguồn: Znews · 6/10/2026" · headline "VIỆT NAM VƯỢT MỐC
  14,1 TRIỆU TÀI KHOẢN CHỨNG KHOÁN" · dòng phụ "99,6% LÀ NHÀ ĐẦU TƯ CÁ NHÂN"
- What happened: kicker "DIỄN BIẾN" · headline "Tháng 9: thêm 244.949 tài khoản mới — cao nhất 3
  tháng"
- Key facts (3 mẩu giấy xếp chồng lệch, không số thứ tự thẳng hàng): (1) "CÁ NHÂN TRONG NƯỚC:
  +244.505 TÀI KHOẢN/THÁNG" (2) "TỔ CHỨC TRONG NƯỚC: 20.457 TÀI KHOẢN" (3) "NHÀ ĐẦU TƯ NƯỚC NGOÀI:
  HƠN 52.800 TÀI KHOẢN"
- Data moment: con số lớn "99,6%" (dấu ngoặc kép khổng lồ mờ phía sau, gạch chân tay-vẽ) + dòng phụ
  "TÀI KHOẢN CHỨNG KHOÁN VIỆT NAM LÀ CỦA CÁ NHÂN"
- Context (pull-quote, dấu gạch đầu dòng kiểu clipping): "— FTSE RUSSELL NÂNG HẠNG THỊ TRƯỜNG VIỆT
  NAM LÊN MỚI NỔI THỨ CẤP, THÁNG 9/2026" / "— MỤC TIÊU 9 TRIỆU TÀI KHOẢN (2025) & 11 TRIỆU (2030)
  ĐÃ VỀ ĐÍCH SỚM"
- Impact (2 mẩu báo cắt dán chồng lớp): (1) "MỤC TIÊU: ~80 TỶ USD VỐN/NĂM TỪ CHỨNG KHOÁN CHO NỀN
  KINH TẾ" (2) "VIỆT NAM HƯỚNG TỚI TĂNG TRƯỞNG GDP TRÊN 10%/NĂM"
