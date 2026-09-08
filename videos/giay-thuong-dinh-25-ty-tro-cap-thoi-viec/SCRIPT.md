# SCRIPT — Giầy Thượng Đình chi 25 tỷ đồng trợ cấp thôi việc khi di dời nhà máy

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio: `assets/voice/line1.mp3`
... `line6.mp3`.

**Không viết tắt** — mọi từ viết đầy đủ đúng cách đọc thành tiếng (quy tắc bắt buộc 2026-09-07,
xem `../BRAND-SYSTEM-BOT-BAN-HANG.md` mục Voiceover). Không đọc mã chứng khoán "GTD" trong voice
(chỉ hiển thị trên màn hình) để tránh đọc đánh vần từng chữ cái.

1. **Hook** — `line1.mp3`
   > Công ty Cổ phần Giầy Thượng Đình chi 25 tỷ đồng trợ cấp thôi việc khi di dời nhà máy khỏi đường Nguyễn Trãi.

2. **What happened** — `line2.mp3`
   > Hội đồng quản trị công ty phê duyệt tổng kinh phí di dời nhà máy lên tới 165 tỷ đồng.

3. **Key facts** — `line3.mp3`
   > Bốn trăm bốn mươi ba lao động thuộc diện sắp xếp lại nhận trợ cấp từ quý ba năm 2026; ngoài ra, công ty chi gần 9,9 tỷ đồng để phá dỡ mặt bằng cũ.

4. **Data moment** — `line4.mp3`
   > Trong 165 tỷ đồng đó, 25 tỷ đồng là trợ cấp lao động, còn hơn 128 tỷ đồng dùng mua sắm máy móc và xây dựng nhà xưởng mới.

5. **Context** — `line5.mp3`
   > Nhà máy cũ ở đường Nguyễn Trãi, Hà Nội, rộng hơn 36.100 mét vuông, sẽ chuyển về Khu công nghiệp Đồng Văn, tỉnh Ninh Bình.

6. **Impact** — `line6.mp3`
   > Trên khu đất cũ, doanh nghiệp đã đề xuất dự án nhà ở thương mại kết hợp văn phòng và trường học, với vốn đầu tư dự kiến khoảng 9.907 tỷ đồng.

Thời lượng từng dòng đo bằng `ffprobe` sau khi sinh voice thật (bước 2 của quy trình), điền lại vào
đây sau khi có file mp3. Các số liệu đầy đủ hơn (2,1 tỷ đồng vận chuyển máy móc, diện tích 36.100
m², lịch sử 1957, tổ hợp 40 tầng, mã chứng khoán GTD...) vẫn giữ trong `BRIEF.md` và hiển thị trên
màn hình (on-screen text bên dưới) dù không đọc hết trong voice — để giữ tổng thời lượng video dưới
1 phút.

## On-screen text (khác voice, cô đọng hơn cho từng frame)

- Hook: kicker "Bot Bán Hàng" · badge "Nguồn: Dân Trí · 7/9/2026" · headline "GIẦY THƯỢNG ĐÌNH CHI
  25 TỶ ĐỒNG TRỢ CẤP THÔI VIỆC" · số hero "25 tỷ đồng" · dòng phụ "Khi di dời nhà máy khỏi Nguyễn Trãi"
- What happened: kicker "QUYẾT ĐỊNH HĐQT" + mã "GTD" · headline "Phê duyệt chi phí di dời nhà máy:
  165 tỷ đồng"
- Key facts (lưới 3 ô icon): (1) "443 lao động — trợ cấp từ quý III/2026" (2) "Gần 9,9 tỷ đồng —
  phá dỡ mặt bằng cũ" (3) "Hơn 2,1 tỷ đồng — di chuyển máy móc"
- Data moment: số hero "165 TỶ" đơn vị "đồng" nhãn nhỏ "TỔNG KINH PHÍ DI DỜI" · 2 ô phụ "25 tỷ —
  trợ cấp lao động" / "128 tỷ — máy móc & xây dựng"
- Context (lưới 2x2): "CƠ SỞ CŨ — 277 Nguyễn Trãi, Hà Nội (36.100 m²)" · "CƠ SỞ MỚI — KCN Đồng Văn,
  Ninh Bình" · "LỊCH SỬ — Từ năm 1957" · "TÁI CƠ CẤU — Thoát kinh doanh bết bát, âm vốn kéo dài"
- Impact (lưới 2 ô lớn): (1) "Đất cũ Nguyễn Trãi: dự án nhà ở thương mại + văn phòng + trường học
  liên cấp" (2) "Vốn đầu tư dự kiến ~9.907 tỷ đồng · tổ hợp văn phòng + chung cư 40 tầng"
