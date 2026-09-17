# BRIEF — DNSE vào top công ty chứng khoán nộp ngân sách lớn nhất Việt Nam

## Mục tiêu
Video tin tức kinh doanh 9:16, <60s, kênh "BOT BÁN HÀNG · KINH DOANH" (YouTube: "Kinh Tế Số").
Đưa tin về việc Chứng khoán DNSE lọt top các công ty chứng khoán nộp ngân sách lớn nhất Việt Nam
năm 2025, kèm bối cảnh quy mô hoạt động (tài khoản khách hàng, thị phần môi giới/phái sinh, dư nợ
margin).

## Nguồn
- VnExpress, tác giả Minh Ngọc, đăng 17/9/2026.
- Link: https://vnexpress.net/dnse-vao-top-cong-ty-chung-khoan-nop-ngan-sach-lon-nhat-viet-nam-5121244.html
- News id nội bộ: `780f6f32cdd0` (đã đánh dấu `used`, video slug `dnse-nop-ngan-sach-332-ty`).

## Style dựng (đã claim)
`claim_style` → `{"index":7,"style":"8-icon-grid"}` — **Style 8, Icon Grid**. Không claim lại.

## Số liệu xác nhận (KHÔNG bịa thêm ngoài danh sách này)
- Nộp ngân sách năm 2025: **332 tỷ đồng**, tăng **38%** so với kỳ trước.
- Thuế thu nhập cá nhân chiếm gần **80%** tổng số thuế nộp.
- Xếp hạng: **Top 10** công ty chứng khoán tư nhân nộp ngân sách nhiều nhất; **Top 15** công ty
  chứng khoán nộp ngân sách nhiều nhất Việt Nam.
- Khoảng **2 triệu** tài khoản khách hàng.
- Thị phần môi giới cổ phiếu quý II/2026: đứng thứ **8** trên HNX.
- Thị phần phái sinh: đứng thứ **2**, trên **25%**.
- Dư nợ cho vay margin cuối tháng 8/2026: **6.700 tỷ đồng**, tăng **28%** so với cùng kỳ năm trước.
- Nguồn ghi trên video/caption: "Nguồn: VnExpress, 17/9/2026".

## Ảnh dùng
`assets/images/hook-photo.jpg` (1200×720, JPEG) — ảnh lễ trao giải DNSE, có chữ trên ảnh "332 TỶ
ĐỒNG nộp ngân sách năm 2025", "#15 CHỨNG KHOÁN", "#10 CHỨNG KHOÁN TƯ NHÂN". Dùng cho Hook + Article
Image Card (act What happened) + thumbnail. Chỉ có 1 ảnh khả dụng cho tin này (không có ảnh khác
để đa dạng hoá theo mục "Bằng chứng thật đa dạng" — chấp nhận vì nguồn chỉ cung cấp 1 ảnh sự kiện).

## Cấu trúc 7 act (Hook cố định + 6 act nội dung theo Style 8 — Icon Grid)
1. **Hook** — cố định theo brand (title-card): ảnh + masthead + badge nguồn/ngày + tiêu đề số liệu lớn.
2. **What happened** — ảnh + panel chuẩn; 2 ô vuông icon+số liệu nhỏ (332 tỷ đồng / tăng 38%).
3. **Key facts** — lưới 1×3 ô icon: Top 15 chứng khoán / Top 10 tư nhân / ~80% thuế TNCN.
4. **Data moment** — 1 ô lớn giữa (332 tỷ đồng) + 2 ô phụ nhỏ mờ 2 bên (tăng 38% / gần 80% thuế TNCN).
5. **Context** — lưới 2×2 dashboard: 2 triệu tài khoản / hạng 8 HNX môi giới / hạng 2 phái sinh
   (>25%) / dư nợ margin 6.700 tỷ đồng (+28%).
6. **Impact** — lưới 2 ô lớn: quy mô khách hàng lớn (2 triệu tài khoản, thị phần phái sinh top 2) +
   đóng góp ngân sách tăng trưởng (332 tỷ đồng, +38%, top 15 toàn ngành).

Act cuối (Impact) là sự thật/số liệu đã xảy ra, không suy đoán tương lai.

## Ghi chú kỹ thuật bắt buộc
- Depth background (blob + seeded PRNG stars), seed riêng cho video này: `20260917`.
- Glow brand-color (#E8441E) trên card/ảnh chính mỗi act.
- Caption karaoke đồng bộ giọng đọc bằng ElevenLabs STT `scribe_v1` (timestamp từ).
- Smash-cut ở act có pivot nội dung rõ (dự kiến: What happened, chuyển từ ảnh bằng chứng sang số liệu).
- Cân bằng dọc: phần tử cuối mỗi act giữa kết thúc trong `top: 1400-1680px`.
