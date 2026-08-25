# SCRIPT — lan-bien-chuyen-nhuong-50-dat

**Voice:** Tạo bằng ElevenLabs, giọng "Khánh Lâm - tin tức, thời sự" (`voice_id: RCmOaM1iiIH5xX3QXjIF`, model `eleven_v3` — **không dùng `eleven_multilingual_v2`, model đó không hỗ trợ tiếng Việt dù tên gọi "Multilingual"**, xem BRAND-SYSTEM-BOT-BAN-HANG.md). Đã verify bằng phiên âm ngược khớp văn bản gốc (xem `assets/voice/`).
**Voice direction:** Digital Business News — tự nhiên, rõ, nhanh vừa phải, có năng lượng, đáng tin. Không quá MC truyền hình, không quá quảng cáo.
**Ngôn ngữ:** Tiếng Việt.

Mỗi dòng dưới đây được thiết kế khớp với `duration` thật của khung hình tương ứng trong
`STORYBOARD.md` (không phải ước lượng để tạo TTS — khung hình đã dựng cố định theo các mốc
giây này). Khi thu âm, cố gắng giữ mỗi dòng nằm trong cửa sổ thời gian ghi ở `**Time:**` — sai
lệch nhỏ (±0.5–1s) không sao vì mỗi khung có khoảng đệm; sai lệch lớn thì nên báo lại để chỉnh
thời lượng khung hình cho khớp.

---

## Line 1 — Hook (Frame 1)

**Time:** 0.0 – 5.0s
**Delivery:** Dứt khoát, nhấn rõ "một nửa" / "50%", thả lửng câu hỏi.

    Nhà đầu tư dự án lấn biển: giờ chỉ được bán một nửa.

## Line 2 — What happened (Frame 2)

**Time:** 5.0 – 12.0s
**Delivery:** Điềm tĩnh, như đọc tin chính thức, nhấn "93%" và "tháng Mười".

    Quốc hội vừa thông qua Luật Phát triển đô thị, với 93% đại biểu tán thành, hiệu lực từ tháng Mười.

## Line 3 — Key facts (Frame 3)

**Time:** 12.0 – 22.0s
**Delivery:** Rõ ràng, tách nhịp ở gạch ngang để mỗi cụm được nhấn khi chữ xuất hiện.

    Luật quy định — nhà đầu tư chiến lược dự án lấn biển không được bán toàn bộ dự án — chỉ tối đa 50% diện tích đất đã xong hạ tầng kỹ thuật.

## Line 4 — Data moment (Frame 4)

**Time:** 22.0 – 32.0s
**Delivery:** Nhấn mạnh từng con số, để khoảng lặng ngắn sau mỗi số.

    Dự án lấn biển được hoạt động tối đa bảy mươi năm — áp dụng cho dự án từ ba mươi nghìn tỷ đồng trở lên.

## Line 5 — Context (Frame 5)

**Time:** 32.0 – 43.0s
**Delivery:** Nhịp đều, như liệt kê mốc thời gian tăng dần.

    Tiến độ giải ngân chia theo quy mô vốn — từ năm năm với dự án nhỏ, đến hai mươi năm với dự án trên một trăm nghìn tỷ. Trong thời hạn đó, nhà đầu tư không được chuyển nhượng dự án.

## Line 6 — Impact (Frame 6)

**Time:** 43.0 – 53.0s
**Delivery:** Chắc chắn, nhấn "buộc" và "thực sự triển khai".

    Quy định này siết chặt tình trạng bán dự án khi chưa xong hạ tầng — buộc nhà đầu tư phải thực sự triển khai, thay vì sang tay để hưởng chênh lệch.

## Line 7 — Takeaway (Frame 7) — nay là frame cuối, giữ tới hết video

**Time:** 53.0 – 58.0s (lời đọc); hình giữ tĩnh thêm tới 60.0s (im lặng, có chime nhẹ + nhạc nền)
**Delivery:** Chốt gọn, hạ giọng nhẹ ở cuối câu, để khoảng lặng tự nhiên sau khi dứt câu.

    Điểm cần theo dõi tiếp theo: tiêu chí xác định nhà đầu tư chiến lược, do Chính Phủ quy định.

**Lưu ý:** Frame "Brand ending" (BOT BÁN HÀNG · KINH DOANH...) đã được bỏ theo yêu cầu — video
giờ kết thúc bằng cách giữ nguyên Frame 7 tới hết 60s. Logo + "Nguồn: VnExpress" vẫn hiển thị cố
định trên góc màn hình suốt video (kể cả 2 giây cuối), nên vẫn có nhận diện thương hiệu mà không
cần thêm card riêng.
