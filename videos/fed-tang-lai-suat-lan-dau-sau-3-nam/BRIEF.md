# BRIEF — Fed tăng lãi suất lần đầu tiên sau 3 năm

## Nguồn
- Chính: VnExpress, đăng 16/09/2026 20:38 (giờ Việt Nam):
  https://vnexpress.net/fed-tang-lai-suat-lan-dau-tien-sau-3-nam-5121142.html
- Phụ (bối cảnh vàng trong nước): Dân Trí, đăng 17/09/2026 02:40:
  https://dantri.com.vn/kinh-doanh/gia-vang-dao-chieu-giam-manh-sau-quyet-dinh-tang-lai-suat-cua-fed-20260916195340768.htm
- News ID (Apps Script queue): `6c893ad94b29`, đã POST đánh dấu `used` với
  `video: fed-tang-lai-suat-lan-dau-sau-3-nam`.
- Ảnh: tải qua `?image=6c893ad94b29` (Apps Script cache, AFP qua VnExpress), lưu
  `assets/images/hook-photo.jpg` (chuyển từ webp gốc 1200×801 bằng ffmpeg).

## Vì sao chọn tin này
Tin nóng nhất trong cửa sổ 24h gần nhất, được CẢ 3 nguồn (VnExpress, Dân Trí, Tuổi Trẻ) đưa tin
đồng thời — sự kiện kinh tế vĩ mô có tác động trực tiếp, tức thời tới thị trường tài chính/kinh
doanh toàn cầu và Việt Nam (chứng khoán Mỹ, giá vàng thế giới, giá vàng trong nước). Có số liệu cụ
thể, dễ trực quan hoá (biên độ lãi suất, lịch sử tăng/giảm lãi từ 2023, dự báo chính thức của Fed,
phản ứng thị trường). Có ảnh thật (`hasImage: true`).

## Style dựng
`claim_style` trả về **index 6 — "7-timeline-chronology"**. Câu chuyện có chuỗi mốc thời gian rõ
ràng (7/2023 tăng lãi lần cuối → 6 lần giảm lãi → 16/9/2026 đảo chiều tăng lãi → dự báo cuối 2026)
— khớp tự nhiên với ẩn dụ trục thời gian của style này.

## Số liệu chính (đối chiếu để không bịa)
- Quyết định: Fed (qua cuộc họp FOMC 2 ngày) nâng lãi suất tham chiếu thêm **25 điểm cơ bản
  (0,25 điểm phần trăm)**, lên biên độ **3,75–4%**. Công bố rạng sáng **17/9/2026 giờ Việt Nam**
  (16/9 giờ Mỹ). Tỷ lệ đồng thuận: **12/12 phiếu** (Dân Trí).
- Đây là lần đầu tiên Fed tăng lãi suất kể từ **tháng 7/2023**. Từ đó đến nay, Fed đã **giảm lãi
  6 lần, tổng cộng 175 điểm cơ bản (1,75 điểm phần trăm)**, riêng năm ngoái giảm 3 lần (VnExpress).
- Dự báo chính thức của Fed (công bố cùng quyết định, không phải suy đoán của kênh):
  - GDP Mỹ năm nay: **2,3%** (tăng nhẹ so với dự báo tháng 6).
  - Tỷ lệ thất nghiệp cuối năm: khoảng **4,1%**.
  - 12/18 quan chức Fed dự báo sẽ có **thêm 1 đợt tăng 0,25 điểm phần trăm nữa trong năm nay**;
    dự báo trung vị lãi suất cuối 2026 được nâng lên **4,1%** (từ 3,8% hồi tháng 6) — theo Dân Trí.
  - Lạm phát Mỹ (PCE) dự báo quay về mục tiêu 2% vào **năm 2029** — muộn 1 năm so với ước tính
    trước (VnExpress) — không đưa số liệu PCE cụ thể vào video vì 2 nguồn cho 2 con số khác nhau
    (VnExpress: PCE ~3,7%; Dân Trí: lạm phát lõi ~3,4%) — tránh dùng số gây nhầm lẫn.
- Bối cảnh: giá dầu thô thế giới đã vượt **100 đô la Mỹ một thùng** do xung đột Trung Đông leo
  thang — một phần lý do lạm phát chưa hạ nhiệt.
- Phản ứng thị trường (đã xảy ra, không suy đoán):
  - Chứng khoán Mỹ: **S&P 500 tăng 0,3%**, **Nasdaq tăng 0,7%** ngay sau thông báo (VnExpress).
  - Vàng thế giới: giảm hơn **40 đô la Mỹ**, còn khoảng **4.314 đô la Mỹ** (VnExpress; Dân Trí ghi
    nhận giá tiếp tục rơi về ~4.244 đô la Mỹ tại thời điểm viết bài — dùng số VnExpress cho nhất
    quán vì đây là nguồn chính đã chọn).
  - Vàng trong nước: NGƯỢC CHIỀU — giá vàng miếng cuối phiên 16/9 lại **tăng 1,2 triệu đồng**, lên
    **143,5–146,5 triệu đồng một lượng** (Dân Trí) — điểm phân kỳ đáng chú ý cho góc nhìn kinh
    doanh Việt Nam, dùng làm 1 trong 2 khối của act Impact.

## Cấu trúc 6 act (style Timeline Chronology)
1. **Hook** (cố định toàn kênh): ảnh nửa trên (`hook-photo.jpg`, ảnh Chủ tịch Fed Kevin Warsh họp
   báo AFP) + panel tối — masthead, badge "Nguồn: VnExpress · 17/9/2026", tiêu đề "FED TĂNG LÃI
   SUẤT LẦN ĐẦU SAU 3 NĂM" + dòng phụ "+0,25 điểm phần trăm".
2. **What happened**: ảnh bài báo + panel chuẩn, thêm badge mốc thời gian nhỏ "2026" cạnh kicker
   (mở đầu ngôn ngữ "thời gian" của style) — nội dung: Fed nâng lãi lên 3,75–4%, đồng thuận 12/12.
3. **Key facts** (trục dọc bên trái, 3 node): (1) Tháng 7/2023 — lần tăng lãi gần nhất trước đó.
   (2) Từ đó đến nay — giảm lãi 6 lần, tổng 1,75 điểm phần trăm. (3) 16/9/2026 — đảo chiều, tăng
   lãi trở lại.
4. **Data moment**: con số hero **"3,75–4%"** (biên độ lãi suất mới) xuất hiện tại 1 node lớn trên
   trục ngang, nhãn phụ "+0,25 điểm phần trăm".
5. **Context** (trục thời gian ngang đầy đủ, 4 mốc): 7/2023 (tăng lãi cuối) → 2024–2025 (giảm 6
   lần, −1,75đpt) → 16/9/2026 (tăng trở lại, +0,25đpt) → cuối 2026 (dự báo chính thức của Fed:
   thêm 1 đợt tăng, ~4,1%). Kèm bối cảnh GDP 2,3%, dầu vượt 100 đô la Mỹ/thùng.
6. **Impact** (act cuối — sự thật thị trường đã phản ứng ngay trong ngày, không suy đoán): 2 khối
   nối tiếp trục — (a) Vàng thế giới: giảm hơn 40 đô la Mỹ, còn ~4.314 đô la Mỹ. (b) Vàng trong
   nước: ngược chiều, tăng 1,2 triệu đồng, lên 143,5–146,5 triệu đồng/lượng.

## Quyết định thiết kế cần nêu với người vận hành khi giao việc
- Không dùng số liệu PCE/lạm phát lõi cụ thể trong video vì 2 nguồn (VnExpress 3,7% vs Dân Trí
  3,4%) cho 2 con số khác nhau (có thể là 2 chỉ số khác nhau — PCE tổng vs lõi — nhưng không đủ rõ
  ràng để tránh gây hiểu nhầm trong 1 câu ngắn) — chỉ nêu chung "lạm phát vẫn chưa hạ nhiệt".
- Dùng số liệu vàng thế giới theo VnExpress (nguồn chính đã chọn: giảm hơn 40 đô la Mỹ, còn 4.314
  đô la Mỹ) thay vì con số cập nhật hơn của Dân Trí (~4.244 đô la Mỹ) để nhất quán 1 nguồn cho số
  liệu cùng chủ đề trong cùng video — tránh gây ấn tượng "hai giá vàng khác nhau" khó hiểu.
- Đưa dự báo chính thức của Fed (thêm 1 đợt tăng lãi, lên ~4,1% cuối năm) vào act Context (không
  phải act Impact cuối) vì đây là tin tức về nội dung Fed đã công bố (fact về phát biểu chính thức),
  không phải suy đoán riêng của kênh — nhưng để an toàn tuyệt đối với quy tắc "act cuối không suy
  đoán", đặt hẳn ở act 5, giữ act 6 (Impact) chỉ gồm phản ứng thị trường đã xảy ra trong ngày.
