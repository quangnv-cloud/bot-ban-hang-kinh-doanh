---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Danh sách PRIVATE 100 (CafeF, 24/8): 100 doanh nghiệp tư nhân nộp gần 391.000 tỷ đồng vào ngân sách 2025, tăng 60%; Vingroup dẫn đầu với 407 tỷ đồng mỗi ngày"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: 60s
angle: concept
style_preset: broadside
---

## Intent

Video tin tức kinh doanh 60 giây thứ hai cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo cùng
master brand system đã dùng cho video đầu tiên (xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`). Font
chuẩn: **Montserrat** (đã quyết định từ video trước — không dùng Barlow/IBM Plex Mono). Voice:
ElevenLabs, giọng "Khánh Lâm - tin tức, thời sự", **model `eleven_v3`** (multilingual_v2 KHÔNG hỗ
trợ tiếng Việt — bài học từ video trước).

Nguồn chính: https://vnexpress.net/100-doanh-nghiep-tu-nhan-nop-gan-391-000-ty-dong-vao-ngan-sach-5113026.html
Nguồn phụ (cùng sự kiện, bổ sung số liệu Vingroup): https://vnexpress.net/vingroup-tiep-tuc-la-doanh-nghiep-tu-nhan-nop-thue-lon-nhat-viet-nam-5113185.html

Nội dung: CafeF công bố danh sách PRIVATE 100 năm 2026 (24/8/2026) — xếp hạng 100 doanh nghiệp tư
nhân nộp ngân sách nhiều nhất dựa trên số thực nộp năm tài chính 2025. Tổng nộp 390.700 tỷ đồng,
tăng 60% so với 244.400 tỷ năm trước, chiếm 14,7% tổng thu ngân sách cả nước. Vingroup dẫn đầu với
148.773 tỷ đồng (gấp 2,6 lần / +165% so với năm 2024), bình quân 407 tỷ đồng/ngày — lần đầu tiên
một doanh nghiệp tư nhân vượt mốc 100.000 tỷ/năm. Top 10 doanh nghiệp đóng góp ~268.000 tỷ, +80%.
Cơ cấu ngành: bất động sản - xây dựng lớn nhất; ngân hàng (17 DN, >52.000 tỷ); ôtô (~40.000 tỷ).

## Assets

- `public/photo-tien-ngan-sach.jpg` — ảnh báo chí thật (nhân viên ngân hàng xếp tiền mặt VND),
  ảnh đại diện (og:image) của bài báo nguồn chính. Nguồn: VnExpress.
- `public/photo-vinhomes-can-gio.png` — ảnh phối cảnh Vinhomes Green Paradise Cần Giờ, ảnh đại
  diện (og:image) của bài báo nguồn phụ (Vingroup). Nguồn: VnExpress / Vinhomes.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng từ video trước.

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu, typography, cấu trúc 8 act, anchor
logo/nguồn góc trên, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG reveal
phải có state ẩn mặc định, font Montserrat, voice ElevenLabs eleven_v3). Không lặp lại ở đây.

## Notes

- Toàn bộ số liệu truy nguyên được về 2 bài VnExpress nêu trên — không tự bịa số liệu.
- BGM: tạo mới qua Google Lyria, tông nghiêm túc/formal phù hợp tin tức kinh doanh (giống video
  trước, KHÔNG lời, KHÔNG hát).
