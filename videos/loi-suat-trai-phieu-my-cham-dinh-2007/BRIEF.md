# BRIEF — Lợi suất trái phiếu kho bạc Mỹ kỳ hạn 10 năm chạm đỉnh từ 2007

## Nguồn
- Dân Trí, đăng 15/09/2026: https://dantri.com.vn/kinh-doanh/loi-suat-trai-phieu-kho-bac-my-ky-han-10-nam-cham-dinh-ke-tu-2007-20260915211445167.htm
- News ID (Apps Script queue): `67ba4fdf521d`, đã POST đánh dấu `used` với `video: loi-suat-trai-phieu-my-cham-dinh-2007`.
- Ảnh: tải qua `?image=67ba4fdf521d` (Apps Script cache), lưu tại `assets/images/hook-photo.jpg` (JPEG 1221×814).

## Vì sao chọn tin này
Trong danh sách ứng viên (55 tin business + tổng hợp), đây là tin có góc độ số liệu/tác động
kinh tế rõ nhất, thời sự (đăng cùng ngày trong bối cảnh Fed sắp họp), có thể trực quan hoá tốt
(so sánh lịch sử 2007, so sánh nhiều quốc gia). Có ảnh thật (`hasImage: true`).

## Style dựng
`claim_style` trả về **index 4 — "5-map-and-geo"**. Tin này KHÔNG có yếu tố địa danh Việt Nam (nó
là câu chuyện thị trường trái phiếu Mỹ + so sánh toàn cầu: Mỹ/Đức/Úc/Nhật), nên áp dụng ẩn dụ
"Map & Geo" bằng **bản đồ thế giới** (world map outline, không phải bản đồ Việt Nam) — vẫn đúng
tinh thần ẩn dụ hình ảnh của style (ghim địa danh, vùng highlight, connection line), chỉ đổi phạm
vi địa lý cho khớp nội dung thật của tin, đúng như "CONSTRUCTION-STYLES-BOT-BAN-HANG.md" ghi rõ mô
tả style chỉ là định hướng, không phải đặc tả cứng.

## Số liệu chính (đối chiếu để không bịa)
- Lợi suất trái phiếu kho bạc Mỹ kỳ hạn 10 năm: **5,04%** (tăng 5 điểm cơ bản trong phiên 15/9).
- Mốc so sánh: **cao nhất kể từ năm 2007** (tức ~19 năm).
- Lần gần nhất chạm mốc 5%: 23/10/2023, và đầu tuần này (chưa từng đóng cửa ở mức đó cho tới phiên
  này).
- Giá trái phiếu kho bạc Mỹ: giảm khoảng 1% từ đầu tháng 9, giảm khoảng 1,5% từ đầu năm 2026.
- Nguyên nhân (theo bài báo): xung đột Trung Đông gây gián đoạn cung dầu khí; doanh nghiệp vay vốn
  ồ ạt để tài trợ chi tiêu AI; chính phủ Mỹ phát hành nhiều nợ để đảo nợ + bù thâm hụt ngân sách;
  ngân hàng trung ương không còn mua vào qua các chương trình nới lỏng định lượng (QE).
- Tác động: lợi suất 10 năm là thước đo cho lãi vay thế chấp bất động sản Mỹ; lợi suất neo ở vùng
  cao có thể hút dòng tiền khỏi thị trường chứng khoán; khảo sát ngành cho thấy 1/3 quản lý quỹ
  toàn cầu coi lợi suất tăng mất kiểm soát là rủi ro lớn nhất.
- Toàn cầu: lợi suất trái phiếu 10 năm của Đức cao nhất kể từ 2009; lợi suất Úc cao nhất 15 năm;
  trái phiếu Nhật Bản bị bán tháo do lo ngại tăng chi tiêu quốc phòng.
- Trích dẫn chuyên gia trong bài (không dùng nguyên văn trong voice, chỉ tham khảo để không bịa số
  liệu): Vail Hartman (BMO Capital Markets), Phoebe White (UBS), Padhraic Garvey (ING — có đoạn
  suy đoán "nếu phá 5% có thể tới 6%", **KHÔNG dùng phần suy đoán này cho act cuối** vì vi phạm quy
  tắc "act cuối là sự thật, không suy đoán tương lai").

## Cấu trúc 6 act
1. **Hook** (cố định toàn kênh): ảnh nửa trên (`hook-photo.jpg`) + panel tối — masthead, badge
   "Nguồn: Dân Trí · 15/9/2026", tiêu đề "Lợi suất trái phiếu Mỹ kỳ hạn 10 năm chạm 5,04% — cao
   nhất từ 2007".
2. **What happened**: ảnh bài báo + badge nguồn chuẩn, ghim địa danh nhỏ "Thị trường Mỹ" mở đầu
   ngôn ngữ Map & Geo.
3. **Key facts**: bản đồ thế giới outline mờ nền, 3 fact (mốc 2007, giá trái phiếu giảm ~1,5% từ
   đầu năm, ngân hàng trung ương ngừng mua QE).
4. **Data moment**: con số 5,04% trong 1 map-pin phóng to, mã hiệu nhỏ "US10Y" phía trên.
5. **Context**: bản đồ thế giới highlight tuần tự Mỹ/Đức/Úc/Nhật, connection line ra số liệu từng
   nước.
6. **Impact** (act cuối — sự thật, không suy đoán): 2 thẻ địa danh — (a) cơ chế lãi vay thế chấp Mỹ
   gắn với lợi suất 10 năm, (b) kết quả khảo sát 1/3 quản lý quỹ coi đây là rủi ro lớn nhất.

## Quyết định thiết kế cần nêu với người vận hành khi giao việc
- Đổi "bản đồ Việt Nam" (mặc định trong mô tả style 5) thành **bản đồ thế giới** vì tin không có
  góc Việt Nam — nêu rõ trong tóm tắt cuối để người dùng có cơ hội phản hồi/chỉnh hướng.
