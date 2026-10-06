# SCRIPT — Nhà đầu tư ngoại rút hơn 400 triệu USD sau nửa tháng nâng hạng

**Voice:** Vbee TTS, giọng "Ngọc Huyền nâng cao (Beta)" (`voice_code:
hn_female_ngochuyen_full_24k-stl`), `speed_rate: 1.09`.
**Voice direction:** Digital Business News — tự nhiên, rõ, nhanh vừa phải, có năng lượng, đáng tin.
**Ngôn ngữ:** Tiếng Việt. Không viết tắt — mọi dòng dưới đây viết đầy đủ đúng cách đọc thành tiếng,
số liệu viết bằng chữ theo cách người Việt đọc. USD → "đô la Mỹ". VN-Index giữ nguyên (tên riêng
đọc được). HDBank, PNJ giữ nguyên (tên/mã thương hiệu quen thuộc, đọc nguyên — sẽ verify bằng ASR,
sửa nếu đọc sai).

Mỗi dòng khớp với `data-duration` thật của frame tương ứng trong `index.html` (đo lại sau khi có
file voice thật).

---

## Line 1 — Hook (Frame 1)

**Delivery:** Dứt khoát, nhấn số liệu.

    Nhà đầu tư nước ngoài đã rút hơn bốn trăm triệu đô la Mỹ khỏi thị trường chứng khoán Việt Nam, chỉ trong mười phiên giao dịch liên tiếp kể từ ngày thị trường được nâng hạng.

## Line 2 — What happened (Frame 2)

**Delivery:** Nhanh, có năng lượng, như đang dẫn tin.

    Kể từ ngày hai mươi mốt tháng chín, khi thị trường chứng khoán Việt Nam được nâng hạng, khối ngoại đã bán ròng liên tục mười phiên, rút ra hơn bốn trăm triệu đô la Mỹ.

## Line 3 — Key facts (Frame 3)

**Delivery:** Rõ ràng, nhấn số liệu khi từng icon nến xuất hiện.

    Từ đầu năm hai nghìn không trăm hai mươi sáu, khối ngoại đã rút khoảng ba phẩy bảy tỷ đô la Mỹ, tập trung mạnh nhất ở hai mã ngân hàng HD Bank và PNJ.

**[QC 2026-10-06] Đã sửa Line 3**: bản gốc viết thẳng "HDBank" — Vbee đọc thành âm vô nghĩa (ASR
nghe ra "ITBK"/"STBK" ở 2 lượt test độc lập, không phải lỗi gần-âm bình thường mà là đọc sai hẳn).
Thêm tiền tố "ngân hàng" trước "HD Bank" (viết tách rời) giúp Vbee đọc đúng — verify lại bằng ASR
(Gemini `flash-lite-latest`) ra đúng "ngân hàng HDBank". Bài học cho các video sau: mã ngân hàng
dạng chữ cái ghép (HDBank, MBBank, SHB...) nên thêm tiền tố "ngân hàng" + tách "HD Bank" thành 2
từ trong `SCRIPT.md` nếu nghe thử thấy đọc sai, không chỉ viết nguyên tên viết liền.

## Line 4 — Data moment (Frame 4)

**Delivery:** Nhấn mạnh con số chính giữa khung hình.

    Tỷ lệ sở hữu của nhà đầu tư nước ngoài trên thị trường chứng khoán Việt Nam hiện chỉ còn mười ba phẩy hai phần trăm, mức thấp nhất trong lịch sử thị trường.

## Line 5 — Context (Frame 5)

**Delivery:** Điềm tĩnh, nhấn nhẹ khi từng thẻ nguyên nhân xuất hiện.

    Giới phân tích chỉ ra hai nguyên nhân: các quỹ chủ động chốt lời để tái cơ cấu danh mục, còn dòng vốn toàn cầu đang dịch chuyển về cổ phiếu công nghệ tại Mỹ, Nhật Bản và Trung Quốc.

## Line 6 — Impact (Frame 6, act cuối — giữ hình + brand anchor tới hết video)

**Delivery:** Chắc chắn, hạ giọng nhẹ ở cuối câu.

    Chỉ số VN-Index hiện quanh một nghìn bảy trăm sáu mươi điểm, giảm khoảng ba phần trăm so với trước nâng hạng; thanh khoản vẫn thấp, chưa phiên nào vượt hai mươi nghìn tỷ đồng.

**Lưu ý:** Không có act "Takeaway" — video kết thúc ngay sau Impact, giữ nguyên hình + brand anchor
tới hết. Logo + "Nguồn: VnExpress" hiển thị cố định góc trên suốt video (trừ Hook, tự mang
nguồn/logo riêng trong panel của nó). Toàn bộ số liệu lấy từ bài VnExpress đăng 6/10/2026, không
phải suy đoán của video. Act cuối dùng tình trạng thị trường TẠI THỜI ĐIỂM bài báo (VN-Index,
thanh khoản) — KHÔNG suy đoán diễn biến thị trường sắp tới.

## On-screen text (khác voice, cô đọng hơn cho từng frame — Style 10, Stock Terminal)

- Hook: masthead "Bot Bán Hàng" · badge "Nguồn: VnExpress · 6/10/2026" · headline "NHÀ ĐẦU TƯ
  NGOẠI RÚT HƠN 400 TRIỆU USD SAU NỬA THÁNG NÂNG HẠNG" · dòng phụ "10 PHIÊN BÁN RÒNG LIÊN TIẾP"
- What happened: kicker "DIỄN BIẾN" · headline "10 phiên bán ròng liên tiếp — rút ròng ~10.800 tỷ
  đồng" · dòng phụ "Phiên gần nhất: giải ngân 2.100 tỷ, bán ròng 4.900 tỷ"
- Key facts (3 fact, icon nến giảm cạnh mỗi số): (1) "TỪ ĐẦU NĂM 2026: RÚT ~3,7 TỶ USD" (2)
  "HDBANK: BỊ RÚT HƠN 73 TRIỆU CỔ PHIẾU" (3) "PNJ: BỊ RÚT GẦN 5 TRIỆU CỔ PHIẾU — GIẢM SÀN"
- Data moment: con số lớn "13,2%" + dòng phụ "TỶ LỆ SỞ HỮU NƯỚC NGOÀI — THẤP NHẤT LỊCH SỬ"
- Context (2 thẻ nguyên nhân): (1) "QUỸ CHỦ ĐỘNG CHỐT LỜI, QUỸ THỤ ĐỘNG ĐÃ GIẢI NGÂN XONG TRƯỚC
  NÂNG HẠNG" (2) "DÒNG VỐN TOÀN CẦU DỊCH CHUYỂN VỀ CỔ PHIẾU CÔNG NGHỆ MỸ, NHẬT, TRUNG QUỐC"
- Impact (2 sparkline xếp chồng): (1) "VN-INDEX: ~1.760 ĐIỂM (-3% SO VỚI TRƯỚC NÂNG HẠNG)" (2)
  "THANH KHOẢN: CHƯA PHIÊN NÀO VƯỢT 20.000 TỶ ĐỒNG KỂ TỪ NÂNG HẠNG"
