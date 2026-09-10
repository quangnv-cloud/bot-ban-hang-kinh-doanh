---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Chưa đến 4.000 tỷ phú toàn cầu đang nắm giữ 15.100 tỷ USD; 29 siêu tỷ phú chiếm 27% số đó nhờ làn sóng tài sản AI (Dân Trí, 10/9/2026, theo báo cáo Billionaire Census 2026 của Altrata)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 4-split-comparison
---

## Intent

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand system
(xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (cấp qua `claim_style`,
index 3): **4 — Split Comparison** (xem `../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

Nguồn chính: https://dantri.com.vn/kinh-doanh/chua-den-4000-nguoi-so-huu-15100-ty-usd-ai-dang-tao-sieu-ty-phu-20260909162645974.htm
(Dân Trí, tác giả Niên Vũ, đăng 10/9/2026, 06:00).

Nội dung: Theo báo cáo **Billionaire Census 2026** của hãng dữ liệu **Altrata** (trích dẫn từ
Fortune, CNBC), thế giới hiện có **3.795 tỷ phú** (tương đương 1 người/2 triệu dân), nắm giữ tổng
cộng **15.100 tỷ USD**. Trong năm 2025, tài sản giới tỷ phú tăng **12,8%**, số lượng tỷ phú tăng
**8,2%**. Đáng chú ý, chỉ riêng **29 siêu tỷ phú** (tài sản mỗi người vượt 50 tỷ USD) đã nắm giữ
**4.100 tỷ USD**, tương đương **27%** tổng tài sản tỷ phú toàn cầu — mức độ tập trung này tăng rất
nhanh so với năm **2017**, khi đó chỉ có **10 siêu tỷ phú** nắm giữ **7,2%**. Về địa lý, **Bắc Mỹ**
dẫn đầu với **1.337 tỷ phú**, tăng **11,6%** trong năm 2025. Báo cáo nêu tên các gương mặt tiêu biểu
hưởng lợi từ làn sóng tài sản AI: **Elon Musk, Jeff Bezos, Mark Zuckerberg, Larry Ellison, Jensen
Huang**.

Không dùng trong video: dự báo "6.600 tỷ USD sẽ chuyển giao trong 10 năm tới" (mang tính suy đoán
tương lai, không phù hợp act cuối) và số liệu "vốn hóa công ty đầu tư AI tăng 23%" (bài gốc không
nêu rõ mốc so sánh, tránh diễn giải mơ hồ).

## Assets

- `public/hook-photo.jpg` — ảnh minh hoạ bài báo, tải qua Apps Script proxy
  (`?image=16001d77e2e1`, gốc `icdn.dantri.com.vn`, đã cache phía Google) — không curl thẳng CDN.
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các
  video trước (không phải "state" composition).
- `assets/fonts/Montserrat-*.woff2`, `assets/vendor/gsap.min.js` — tài nguyên brand chuẩn, copy từ
  project trước (không phải state riêng của video này).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

5 act (What happened → Impact) dựng theo định hướng **Split Comparison** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md` mục Style 4): chia đôi khung hình ảnh/panel với vạch cam
mảnh dọc cho What happened, hàng fact chia trái (nhãn)/phải (giá trị) cho Key facts, "VS" so sánh
27%/73% cho Data moment, bảng 2 cột trước (2017)/nay (2026) cho Context, chia đôi ngang (trên/dưới)
cho Impact.

Phân bổ nội dung theo act (không lặp số liệu giữa các act, trừ Context cố ý nhắc lại số của Data
moment để tạo mốc so sánh trước/nay):
- Hook: tổng tài sản tỷ phú toàn cầu — 15.100 tỷ USD, làn sóng siêu tỷ phú AI.
- What happened: nguồn Billionaire Census 2026 (Altrata) + chưa đến 4.000 tỷ phú (3.795 người).
- Key facts: tăng trưởng 2025 — tài sản +12,8%, số lượng tỷ phú +8,2%.
- Data moment (VS 27% / 73%): 29 siêu tỷ phú nắm 4.100 tỷ USD, tương đương 27% tổng tài sản tỷ phú.
- Context (2017 → 2026): 10 siêu tỷ phú/7,2% (2017) → 29 siêu tỷ phú/27% (2026).
- Impact (act cuối, sự thật đã xảy ra): Bắc Mỹ dẫn đầu với 1.337 tỷ phú (+11,6% năm 2025) — quê
  hương các gương mặt giàu nhất nhờ AI: Elon Musk, Jeff Bezos, Mark Zuckerberg, Larry Ellison,
  Jensen Huang.

## Notes

- Toàn bộ số liệu truy nguyên được về bài Dân Trí nêu trên (báo cáo gốc Billionaire Census 2026,
  Altrata) — không tự bịa số liệu/nguồn. Không dùng số liệu dự báo tương lai (chuyển giao tài sản
  10 năm tới) hoặc số liệu mơ hồ về mốc so sánh (vốn hóa cổ phiếu AI +23%).
- BGM: tạo mới qua Google Lyria, tông modern business/news/digital/fast-paced/minimal/professional,
  100% không lời (instrumental only, theo quy tắc brand 2026-08-27).
- Act cuối (Impact) kết thúc bằng sự thật/số liệu đã xảy ra (Bắc Mỹ đã dẫn đầu, các tỷ phú đã được
  nêu tên) — không suy đoán tương lai.
