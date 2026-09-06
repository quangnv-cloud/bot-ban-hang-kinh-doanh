# BRIEF — Vì sao số doanh nghiệp rời thị trường tăng tới 125%?

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH** (xem quy tắc brand đầy đủ ở
`../BRAND-SYSTEM-BOT-BAN-HANG.md`, quy trình ở `../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`).
Construction style vòng xoay: **2 — Chip & Leaderboard** (claim_style index 1, 2026-09-06) — chip
số liệu viền cam, bảng xếp hạng ngang, watermark số khổng lồ (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`, bảng tổng hợp — style này chưa có mục chi tiết riêng, là
1 trong 2 style gốc dùng trước khi có catalog 10 style, tự thiết kế theo mô tả tóm tắt).

## Mục tiêu

Đưa tin số liệu doanh nghiệp giải thể 8 tháng đầu năm 2026 tăng vọt 125% so với cùng kỳ — con số
gây chú ý nhưng có bối cảnh quan trọng: số doanh nghiệp thành lập mới vẫn cao gấp 6,8 lần số giải
thể, và nguyên nhân chính của cú tăng đột biến là chiến dịch làm sạch dữ liệu của ngành thuế (xử lý
hồ sơ tồn đọng nhiều năm), không phải làn sóng phá sản kinh tế. Góc nhìn đúng định vị kênh: số liệu
kinh doanh trong nước, có tương phản đáng chú ý (con số giật gân vs. bức tranh tổng thể vẫn tích
cực).

## Nguồn

- Znews — "Vì sao số doanh nghiệp rời thị trường tăng tới 125%?", đăng 05/09/2026 (~18:05 giờ VN).
  https://znews.vn/vi-sao-so-doanh-nghiep-roi-thi-truong-tang-toi-125-post1681317.html
- Ảnh: tải qua Apps Script image endpoint (`?image=4e258639d333`), lưu `assets/img/hook-photo.jpg`
  — ảnh thật một mặt bằng kinh doanh đóng cửa, treo nhiều biển "cho thuê nhà" tại TP.HCM (khớp chủ
  đề doanh nghiệp/mặt bằng rời thị trường).

## Số liệu xác nhận (KHÔNG bịa thêm số ngoài danh sách này)

**Số liệu giải thể (Cục Thống kê — Bộ Tài chính):**
- 8 tháng đầu năm 2026: khoảng **40.800 doanh nghiệp** hoàn tất thủ tục giải thể, tăng **125%** so
  với cùng kỳ năm trước.
- Riêng tháng 8/2026: hơn **9.600 doanh nghiệp** giải thể, tăng **151%** so với các tháng trước.

**Số liệu ngành thuế (Cục Thuế, phạm vi rộng hơn — gồm cả cơ quan hành chính, đơn vị sự nghiệp, văn
phòng đại diện, hợp tác xã):**
- Gần **95.000 mã số thuế** của doanh nghiệp/tổ chức bị chấm dứt hiệu lực trong 8 tháng đầu năm.
- Hơn **167.600 mã số thuế** được cấp mới; riêng doanh nghiệp cấp mới mã số thuế là hơn **156.400**,
  bằng **108%** cùng kỳ năm trước.

**Tỷ lệ doanh nghiệp thành lập mới / hoàn tất chấm dứt hiệu lực mã số thuế (theo ông Mai Sơn, Phó
cục trưởng Cục Thuế):**
- Năm 2024: gấp **6 lần**.
- Năm 2025: gấp **4,5 lần**.
- 8 tháng đầu năm 2026: gấp **6,8 lần**.

**Nguyên nhân giải thích cú tăng đột biến (ông Nguyễn Đức Huy, Phó Trưởng ban Nghiệp vụ, Cục Thuế):**
- Trong gần 95.000 mã số thuế chấm dứt hiệu lực: khoảng **23.000 trường hợp** phát sinh hồ sơ từ
  ngày 1/1/2026; hơn **72.000 trường hợp** còn lại là hồ sơ nộp từ năm 2025 trở về trước nhưng đến
  nay mới hoàn tất xử lý.
- Cục Thuế triển khai chiến dịch làm sạch dữ liệu doanh nghiệp và mã số thuế từ **giữa tháng
  5/2026**, xử lý hồ sơ tồn đọng và các doanh nghiệp bỏ địa chỉ kinh doanh không khai báo.
- Số giải thể tăng mạnh không đồng nghĩa toàn bộ doanh nghiệp đó mới rời thị trường cùng lúc — đây
  là kết quả xử lý dồn của cả quá trình làm sạch dữ liệu.

## Cấu trúc 6 act (Hook cố định + 5 act theo style Chip & Leaderboard)

1. **Hook** — hero number **"125%"** đơn vị **"TĂNG SO VỚI CÙNG KỲ"**, headline bao quát: "40.800
   doanh nghiệp giải thể trong 8 tháng đầu năm". Badge nguồn "Nguồn: Znews · 05/09/2026".
2. **What happened** — Article Image Card (ảnh mặt bằng đóng cửa, treo biển cho thuê) + kicker
   "DOANH NGHIỆP RỜI THỊ TRƯỜNG" + headline rút gọn + 1 chip cam nổi bật số "40.800".
3. **Key facts** — 3 chip viền cam xếp dọc: (1) 40.800 DN giải thể 8 tháng, +125% (2) 9.600 DN
   giải thể riêng tháng 8, +151% (3) gần 95.000 mã số thuế chấm dứt hiệu lực (phạm vi rộng hơn).
4. **Data moment** — watermark số khổng lồ mờ phía sau + bảng xếp hạng ngang 2 thanh: "DN thành lập
   mới" (thanh dài) vs "DN hoàn tất giải thể" (thanh ngắn hơn), hero number "6,8 LẦN" chốt tỷ lệ.
5. **Context** — bảng xếp hạng ngang 3 dòng theo năm (2024: gấp 6 lần · 2025: gấp 4,5 lần · 2026 (8
   tháng): gấp 6,8 lần) + giải thích nguyên nhân tăng đột biến: chiến dịch làm sạch dữ liệu từ
   tháng 5/2026, xử lý 72.000 hồ sơ tồn đọng + 23.000 hồ sơ mới.
6. **Impact** (act cuối, sự thật/số liệu, không suy đoán) — 2 chip lớn cạnh nhau: (1) quy mô nền
   kinh tế và số thu ngân sách 8 tháng vẫn tăng khá (2) số doanh nghiệp mới gia nhập thị trường tiếp
   tục vượt trội so với số rời đi (gấp 6,8 lần). Giữ hình + brand anchor tới hết video.

## Ghi chú thiết kế

- Style 2 — Chip & Leaderboard: mọi số liệu trình bày trong "chip" viền cam bo góc (không phải
  card lớn kiểu style 1), act Data moment/Context dùng bảng xếp hạng ngang (leaderboard bars) thay
  vì cột dọc — đúng ẩn dụ "chip + leaderboard + watermark số khổng lồ" của style này, tự thiết kế
  HTML/CSS/GSAP hoàn toàn mới (không copy khung `100-doanh-nghiep-tu-nhan-nop-thue`, dự án đầu tiên
  dùng style này với font/hệ thống chữ cũ trước khi đổi sang Montserrat).
- Trục truyện: đặt con số giật gân "125%" ở Hook để thu hút, nhưng ngay từ Data moment (act 4) đã
  đưa ra bối cảnh cân bằng (6,8 lần DN mới so với DN giải thể) — tránh gây hiểu lầm kênh đưa tin
  "làn sóng phá sản", đúng tinh thần editorial không giật gân sai sự thật của brand.
- KHÔNG suy đoán/dự báo xu hướng tương lai — mọi câu đều là số liệu/phát biểu đã công bố của Cục
  Thống kê và Cục Thuế trong 8 tháng đầu năm 2026, không có act "Takeaway"/nhận định.
- Ảnh Hook/Article Image Card là ảnh thật một mặt bằng kinh doanh đóng cửa treo biển cho thuê tại
  TP.HCM — minh họa đúng chủ đề "doanh nghiệp rời thị trường", không phải ảnh riêng của bài báo gốc
  nhưng phù hợp ngữ cảnh, dùng nhãn nguồn ảnh trung tính trong Article Image Card.
