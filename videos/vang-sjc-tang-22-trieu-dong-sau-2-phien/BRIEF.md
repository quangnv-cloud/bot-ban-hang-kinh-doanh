# BRIEF — Giá vàng trong nước tăng trở lại, mỗi lượng thêm 2,2 triệu đồng sau 2 phiên

## Mục tiêu
Video tin tức kinh doanh dưới 60 giây cho kênh "BOT BÁN HÀNG · KINH DOANH" (Kinh Tế Số), đưa tin
sáng 3/11/2026: giá vàng miếng trong nước bật tăng mạnh phiên thứ hai liên tiếp, ngay sau khi vừa
trải qua tháng 10 giảm sâu nhất kể từ 2008 — góc nhìn số liệu/tác động tới người giữ vàng.

## Nguồn
- VnExpress: https://vnexpress.net/gia-vang-moi-nhat-hom-nay-ngay-3-11-5140057.html (bài chính,
  cập nhật sáng 3/11/2026 — id Apps Script `44912d677252`, đã đánh dấu `used`)
- Dân Trí: https://dantri.com.vn/kinh-doanh/gia-vang-sjc-boc-hoi-hon-5-trieu-dong-trong-thang-10-20261103070657492.htm
  (bài phụ, bổ sung số liệu tháng 10 giảm sâu nhất từ 2008 + mức chênh trong nước/thế giới)

## Số liệu chính (đối chiếu 2 nguồn, không bịa thêm)
- Sáng 3/11, Công ty Vàng bạc đá quý Sài Gòn (SJC) niêm yết vàng miếng 138,2 - 141,2 triệu đồng
  một lượng — sau 2 ngày đã tăng 2,2 triệu đồng/lượng. Chênh lệch mua-bán ~3 triệu đồng.
- Vàng nhẫn trơn SJC tăng 1,2 triệu đồng, lên 134 - 138 triệu đồng/lượng.
- Thế giới: chốt phiên 2/11, mỗi ounce vàng giao ngay tăng 71 USD lên 3.945 USD (~126,5 triệu
  đồng/lượng quy đổi). Nguyên nhân tăng: giá dầu thô giảm 8% đầu tuần hạ nhiệt lo lạm phát; nhà đầu
  tư chờ kết quả bầu cử giữa nhiệm kỳ Mỹ.
- Chênh giá vàng trong nước - thế giới hiện ~15 triệu đồng/lượng, giảm so với mức 16-18 triệu của
  tuần trước (VnExpress).
- Theo Dân Trí: riêng tháng 10, vàng miếng trong nước đã mất hơn 5 triệu đồng/lượng (vàng nhẫn mất
  6 triệu đồng/lượng) — tháng giảm sâu nhất kể từ 2008, vàng thế giới có phiên giảm 3,7% khép tháng
  10 thấp nhất kể từ 2008.

**Không dùng** đoạn nhận định/dự báo của chuyên gia (FxPro, Saxo Bank) về khả năng vàng về lại mốc
3.300 USD hay tiếp tục giảm tuần tới trong bài gốc — video kết thúc bằng sự thật đã xảy ra (đúng
quy tắc act cuối "Impact": chênh lệch trong nước/thế giới đã giảm, không suy đoán xu hướng tới).

## Cách dựng
- Style: **5 — Map & Geo** (claim_style index 4, claimed_at 2026-11-03T06:14:10.398Z) — tin không
  có yếu tố địa danh mạnh, nên vận dụng ẩn dụ "map/node" cho cặp đối chiếu Việt Nam ↔ Thế giới (giá
  vàng trong nước vs. giá vàng thế giới) thay cho vùng miền trong nước.
- Ảnh Hook: ảnh vàng miếng/nhẫn từ bài VnExpress, tải qua Apps Script `?image=44912d677252`, lưu
  `assets/images/hook-photo.jpg` (1200×720).

## Cấu trúc 6 act
1. **Hook** — "Vàng quay đầu tăng mạnh" + số liệu +2,2 triệu đồng/2 phiên, ảnh vàng miếng.
2. **What happened** — SJC niêm yết 138,2 - 141,2 triệu đồng/lượng sáng 3/11.
3. **Key facts** — vàng nhẫn +1,2 triệu; thế giới +71 USD lên 3.945 USD/ounce (ẩn dụ map: 1 node
   "Việt Nam" + 1 node "Thế giới" nối bằng connection line, đúng ngôn ngữ style 5).
4. **Data moment** — con số focal: +2,2 triệu đồng/lượng sau 2 phiên (count-up).
5. **Context** — đối chiếu: tháng 10 vừa mất hơn 5 triệu đồng/lượng (giảm sâu nhất từ 2008) → nay
   bật tăng trở lại; nguyên nhân giá dầu giảm 8%, chờ bầu cử giữa kỳ Mỹ.
6. **Impact** — sự thật khép video: chênh giá trong nước/thế giới co lại còn ~15 triệu đồng/lượng
   (từ 16-18 triệu tuần trước) — không suy đoán xu hướng tới.
