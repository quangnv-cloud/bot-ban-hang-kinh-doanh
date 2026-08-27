---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "12 ngân hàng thương mại đăng ký gói tín dụng ưu đãi tổng quy mô khoảng 408.000 tỷ đồng hỗ trợ doanh nghiệp nhỏ và vừa tiếp cận vốn (Dân Trí, 26/8/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 3-ticker-tape
---

## Intent

Video tin tức kinh doanh thứ ba cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand
system (xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (theo con trỏ xoay
vòng `../style-rotation-state.json`, index 2): **3 — Ticker Tape** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

Nguồn chính: https://dantri.com.vn/kinh-doanh/12-ngan-hang-rot-hon-400000-ty-dong-cho-doanh-nghiep-vua-va-nho-20260826210511954.htm
(Dân Trí, đăng 26/8/2026)

Nội dung: Sau văn bản ngày 7/8/2026 của Ngân hàng Nhà nước yêu cầu các ngân hàng thương mại chủ
động xây dựng gói tín dụng, ưu đãi lãi suất và phí để hỗ trợ doanh nghiệp nhỏ và vừa (SME) tiếp cận
vốn, tính đến ngày 24/8/2026 đã có 12 ngân hàng thương mại đăng ký, thông báo hoặc truyền thông
tham gia chương trình, với tổng quy mô khoảng 408.000 tỷ đồng. Trong đó:

- 4 ngân hàng thương mại Nhà nước đã đăng ký chính thức, tổng quy mô 220.000 tỷ đồng: Agribank
  70.000 tỷ đồng, BIDV 50.000 tỷ đồng, Vietcombank 50.000 tỷ đồng, VietinBank 50.000 tỷ đồng.
- 8 ngân hàng thương mại cổ phần đăng ký/truyền thông tham gia, tổng cộng khoảng 188.000 tỷ đồng:
  SHB, MSB, Sacombank, BVBank, Nam A Bank, NCB, Saigonbank, TPBank.

Mục tiêu chương trình: đưa dòng vốn tín dụng vào đúng các động lực tăng trưởng, ưu tiên doanh
nghiệp nhỏ và vừa, góp phần vào mục tiêu tăng trưởng kinh tế 2 con số. Các ngân hàng đồng thời tiết
giảm chi phí, ổn định mặt bằng lãi suất, giảm lãi suất cho vay.

## Assets

- `public/photo-giao-dich-ngan-hang.jpg` — ảnh báo chí thật (giao dịch tại ngân hàng), ảnh minh hoạ
  chính thức trong bài báo nguồn. Nguồn: Dân Trí (ảnh: Mạnh Quân).
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng từ các video trước (asset
  cố định, không phải "state" composition).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

5 act (What happened → Impact) dựng theo định hướng **Ticker Tape** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md` mục Style 3): dải ticker chạy kiểu bảng điện, reveal
typewriter cho key facts, con số chính giữa 2 vạch kẻ kiểu dòng bảng giá kèm "mã hiệu" ngắn, sparkline
mảnh cho context, các dòng "bảng giá" xếp chồng cho impact — không dùng chip/leaderboard bar như
2 video trước.

## Notes

- Toàn bộ số liệu truy nguyên được về bài Dân Trí nêu trên — không tự bịa số liệu/nguồn.
- BGM: tạo mới qua Google Lyria, tông modern business/news/digital/fast-paced/minimal/professional,
  không lời.
- Act cuối (Impact) kết thúc bằng sự thật/số liệu đã xảy ra (mục tiêu chương trình + tiết giảm lãi
  suất đã thực hiện) — không suy đoán tương lai.
