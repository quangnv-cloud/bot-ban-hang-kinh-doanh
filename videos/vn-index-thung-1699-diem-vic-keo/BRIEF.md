# BRIEF — VN-Index thủng mốc 1.700 điểm, Vingroup kéo chỉ số giảm mạnh nhất

## Mục tiêu
Video tin tức kinh doanh dưới 60 giây cho kênh "BOT BÁN HÀNG · KINH DOANH" (Kinh Tế Số), đưa tin
phiên giao dịch chứng khoán ngày 3/11/2026: VN-Index giảm phiên thứ 4 liên tiếp, chính thức mất
mốc 1.700 điểm — góc nhìn số liệu/tác động thị trường, đúng định vị kênh.

## Nguồn
- VnExpress: https://vnexpress.net/vn-index-thung-moc-1-700-diem-5140312.html (bài chính, 16:10
  ngày 3/11/2026 — id Apps Script `f0f652ebb6c2`, đã đánh dấu `used`, video=`vn-index-thung-1699-diem-vic-keo`)
- Znews: https://znews.vn/vn-index-lai-thung-moc-1700-diem-post1693927.html (bài phụ, bổ sung số
  liệu chi tiết: điểm số chính xác, mã tăng/giảm, khối ngoại mua/bán theo mã, thanh khoản)

## Số liệu chính (đối chiếu 2 nguồn, không bịa thêm)
- VN-Index giảm 11,1 điểm (-0,7%), đóng cửa ở 1.699,62 điểm — không giữ được mốc 1.700, phiên giảm
  thứ 4 liên tiếp, tổng mức giảm 4 phiên là 67 điểm (VnExpress), mức thấp nhất trong 2 tuần.
- Nguyên nhân chính: cổ phiếu VIC (Vingroup) giảm 3,3% xuống 234.000 đồng, kéo VN-Index mất khoảng
  12,59-13 điểm — mức ảnh hưởng tiêu cực lớn nhất trong phiên (trước đó VIC từng là trụ đỡ chính).
  Các mã lớn khác gây áp lực: GAS (-2,1%), VPB (-1,6%), BSR (-3%), BID (-0,9%), VCB (-0,2%).
- Độ rộng thị trường lại tích cực: 349 mã tăng (20 mã tăng trần) so với 302 mã giảm (17 mã giảm
  sàn), 891 mã đứng giá — cho thấy sự "lệch pha" giữa chỉ số và cổ phiếu riêng lẻ. HPG tăng 4,2%,
  là mã đóng góp tích cực nhất cho VN-Index; các mã đáng chú ý khác tăng: STB (+2,3%), VIB (+2,2%),
  VCI (+2,7%), MSB (+2,9%), SSI (+1,6%).
- Thanh khoản giảm mạnh: tổng giá trị giao dịch 3 sàn ~13.463 tỷ đồng, riêng HoSE ~12.596 tỷ đồng,
  giảm gần 32% so với phiên trước — thấp nhất trong khoảng 2 tuần (cả 2 nguồn).
- Khối ngoại bán ròng 497 tỷ đồng trên 3 sàn — phiên bán ròng thứ 8 liên tiếp (VnExpress: "phiên
  thứ 8 liên tiếp", tập trung ở MBBank; Znews: chi tiết MBB ~255 tỷ, VCB 219 tỷ, VIC 114 tỷ, GMD 74
  tỷ bán ròng; mua ròng mạnh nhất HPG hơn 227 tỷ, SHB 125 tỷ, VHM 119 tỷ, TCB 104 tỷ).
- Nhận định: Công ty Chứng khoán MB cho rằng thị trường "lệch pha sâu sắc giữa chỉ số và cổ phiếu"
  (trích dẫn trực tiếp từ bài, không tự diễn giải thêm). Yuanta khuyên nhà đầu tư hạn chế bắt đáy
  dàn trải, cân nhắc chốt lời/bán bớt mã kém khả quan.

**Không dùng** đoạn khuyến nghị đầu tư cụ thể của Yuanta (tư vấn hành động, không phải sự thật/số
liệu) cho act cuối — act Impact chỉ dùng sự thật đã xảy ra (phiên giảm thứ 4 liên tiếp, tổng mức
giảm 67 điểm, khối ngoại bán ròng 8 phiên liên tiếp), không suy đoán diễn biến tiếp theo.

## Cách dựng
- Style: **6 — Ring Progress** (claim_style index 5, claimed_at 2026-11-03T13:22:25.773Z) — tin có
  nhiều số liệu % (VIC -3,3%, HPG +4,2%, thanh khoản -32%, chỉ số -0,7%) rất hợp ẩn dụ vòng tròn
  tiến trình; Data moment dùng ring sáng tạo biểu diễn tỷ lệ 1.699,62/1.700 ≈ 99,98% — "chỉ còn
  cách mốc 1.700 chưa đầy nửa điểm nhưng vẫn không giữ được" (tính từ đúng 2 số liệu thật, không
  bịa).
- Ảnh Hook: ảnh sàn giao dịch/bảng điện từ bài VnExpress, tải qua Apps Script `?image=f0f652ebb6c2`,
  lưu `assets/images/hook-photo.jpg`.

## Cấu trúc 6 act
1. **Hook** — "VN-Index thủng mốc 1.700 điểm" + số liệu -11,1 điểm, đóng cửa 1.699,62 điểm, phiên
   giảm thứ 4 liên tiếp. Ảnh sàn giao dịch.
2. **What happened** — nguyên nhân chính: VIC giảm 3,3%, kéo chỉ số mất gần 13 điểm — ảnh hưởng
   tiêu cực lớn nhất phiên; badge nguồn kiểu vòng tròn viền cam (ngôn ngữ Ring Progress).
3. **Key facts** — 3 fact dạng mini ring: (1) giảm thứ 4 liên tiếp đóng cửa 1.699,62 điểm (ring
   100%); (2) độ rộng thị trường 349 mã tăng/302 mã giảm, HPG +4,2% đóng góp tích cực nhất (ring
   theo % 4,2 scale 0-10%); (3) thanh khoản 3 sàn ~13.463 tỷ đồng, HoSE giảm gần 32% (ring theo %
   32 scale 0-100%).
4. **Data moment** — ring khổng lồ ở tâm: tỷ lệ 1.699,62/1.700 ≈ 99,98% (ring gần đầy nhưng có 1
   khe hở rõ), số chính "1.699,62" count-up ở tâm, nhãn phụ "-11,1 điểm (-0,7%) · thấp nhất 2 tuần".
5. **Context** — 4 ring vừa xếp hàng ngang, fill tuần tự theo % thật: VIC -3,3%, GAS -2,1%, HPG
   +4,2%, thanh khoản HoSE -32% (fill theo giá trị tuyệt đối, không phân biệt màu theo dấu — chỉ
   dùng mũi tên ▲/▼ để chỉ dấu, đúng quy tắc màu brand không dùng xanh lá/đỏ). Kèm trích dẫn ngắn
   MB Securities: "lệch pha sâu sắc giữa chỉ số và cổ phiếu".
6. **Impact** — 2 ring lớn cạnh nhau, sự thật khép video: ring 1 "4 phiên giảm liên tiếp, tổng giảm
   67 điểm"; ring 2 "bán ròng 497 tỷ đồng, phiên thứ 8 liên tiếp khối ngoại bán ròng". Không suy
   đoán diễn biến phiên tới.
