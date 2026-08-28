# SCRIPT — gia-vang-thung-moc-150-trieu-dong

**Voice:** ElevenLabs, giọng "Khánh Lâm - tin tức, thời sự" (`voice_id: RCmOaM1iiIH5xX3QXjIF`, model
`eleven_v3` — **không dùng `eleven_multilingual_v2`**, model đó không hỗ trợ tiếng Việt).
**Voice direction:** Bản tin kinh doanh, tự nhiên, rõ, nhanh vừa phải, có năng lượng, đáng tin.
**Ngôn ngữ:** Tiếng Việt.

Mỗi dòng khớp với `data-duration` thật của frame tương ứng trong `index.html` (đo lại sau khi có
file voice thật, xem `../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md` mục 3.4).

---

## Line 1 — Hook (Frame 1)

**Delivery:** Dứt khoát, nhấn "150 triệu đồng".

    Giá vàng miếng SJC lần đầu tiên giảm thủng mốc 150 triệu đồng một lượng.

## Line 2 — What happened (Frame 2)

**Delivery:** Điềm tĩnh, như đọc tin chính thức.

    Sáng 28 tháng 8, vàng miếng SJC giảm 300 nghìn đồng mỗi lượng, còn 146,7 triệu đồng mua vào,
    149,7 triệu đồng bán ra.

## Line 3 — Key facts (Frame 3)

**Delivery:** Rõ ràng, tách bạch từng thương hiệu.

    Giá vàng nhẫn cũng xuống dưới 150 triệu: SJC 146,2 đến 149,2 triệu, Phú Quý 146,7 đến 149,7
    triệu.

## Line 4 — Data moment (Frame 4)

**Delivery:** Nhấn mạnh "149,7 triệu" và "tụt khỏi mốc 150 triệu".

    149,7 triệu đồng một lượng là giá bán vàng miếng SJC hiện tại, tụt khỏi mốc 150 triệu.

## Line 5 — Context (Frame 5)

**Delivery:** Nhịp đều, dẫn dắt qua từng mốc trong tuần rồi sang bối cảnh thế giới.

    Đầu tuần, giá từng đạt đỉnh 150,6 triệu đồng sau khi tăng 3 triệu, nhưng không giữ đà. Thế
    giới, vàng xuyên thủng mốc 4.600 đô la, giữa lúc thị trường dõi phát biểu Chủ tịch Fed tại
    Jackson Hole.

## Line 6 — Impact (Frame 6, act cuối — giữ hình + brand anchor tới hết video)

**Delivery:** Chắc chắn, hạ giọng nhẹ ở cuối câu.

    Giá vàng trong nước vẫn cao hơn thế giới 5 đến 6 triệu đồng mỗi lượng, vàng nhẫn nhiều
    thương hiệu cũng rơi xuống dưới mốc 150 triệu.

**Thời lượng thật (ffprobe, sau khi trim để vừa khung <1 phút):** L1 4.44s · L2 8.67s · L3
11.15s · L4 6.61s · L5 12.28s · L6 7.63s — tổng voice 50.78s.

**Lưu ý:** Không có act "Takeaway" — video kết thúc ngay sau Impact (sự thật đã xảy ra, không suy
đoán xu hướng tương lai), giữ nguyên hình + brand anchor tới hết. Logo + "Nguồn: Znews" hiển thị
cố định góc trên suốt video (trừ Hook, tự mang nguồn/logo riêng trong panel của nó).
