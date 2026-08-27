---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Vốn hóa Vingroup lần đầu vượt 1,8 triệu tỷ đồng, cổ phiếu VIC lập đỉnh lịch sử; vợ chồng ông Phạm Nhật Vượng trở thành cặp đôi giàu nhất Việt Nam (Znews, 27/8/2026)"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Nhà đầu tư, chủ doanh nghiệp, người theo dõi tin kinh doanh trên kênh BOT BÁN HÀNG · KINH DOANH"
length: under-60s
angle: concept
style_preset: 4-split-comparison
---

## Intent

Video tin tức kinh doanh thứ tư cho kênh **BOT BÁN HÀNG · KINH DOANH**, dựng theo master brand
system (xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`) và quy trình sản xuất
(`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`). Construction style của video này (theo con trỏ xoay
vòng `../style-rotation-state.json`, index 3): **4 — Split Comparison** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

Nguồn chính: https://znews.vn/co-phieu-vingroup-vuot-dinh-vo-chong-ong-pham-nhat-vuong-giau-nhat-viet-nam-post1679691.html
(Znews, đăng 27/8/2026, 08:55).

Nội dung: Phiên giao dịch 27/8/2026, cổ phiếu VIC (Vingroup) tăng 2,6% lên 236.000 đồng/cổ phiếu —
đỉnh lịch sử mới, phiên tăng thứ 6 liên tiếp. Vốn hóa Vingroup lần đầu tiên vượt mốc 1,8 triệu tỷ
đồng — mức vốn hóa lớn nhất mà một doanh nghiệp niêm yết Việt Nam từng đạt được. VN-Index tăng
10,24 điểm (+0,6%) lên 1.831,56 điểm, trong khi thanh khoản toàn thị trường (3 sàn) chỉ khoảng
16.600 tỷ đồng, giảm gần 20% so với phiên trước — VIC tăng ngược dòng thanh khoản thấp. Đà tăng
được củng cố bởi kết quả kinh doanh: nửa đầu 2026, Vingroup ghi nhận doanh thu thuần hợp nhất
222.300 tỷ đồng (+73% so với cùng kỳ), lợi nhuận sau thuế 20.375 tỷ đồng (gấp 4,5 lần cùng kỳ).
Chất xúc tác trực tiếp: FTSE Russell đưa cổ phiếu VIC vào rổ vốn hóa lớn (Large Cap) của bộ chỉ số
toàn cầu Global Equity Index Series. Đà tăng giá cổ phiếu kéo tài sản gia đình sáng lập tăng mạnh:
tài sản ròng ông Phạm Nhật Vượng tăng khoảng 2,1 tỷ USD chỉ trong 24 giờ, lên 36,5 tỷ USD (hạng 60
thế giới); bà Phạm Thu Hương (Phó Chủ tịch Vingroup) tăng 265 triệu USD, lên khoảng 4 tỷ USD —
trở thành nữ doanh nhân giàu nhất Việt Nam.

## Assets

- `public/photo-vic-vuong-va-vo.jpg` — ảnh báo chí thật (ông Phạm Nhật Vượng và bà Phạm Thu Hương),
  og:image của bài Dân Trí cùng chủ đề Vingroup/tỷ phú Phạm Nhật Vượng
  (`cdnphoto.dantri.com.vn`, domain đã có trong Custom network allowlist — domain ảnh của Znews
  `photo.znews.vn` KHÔNG nằm trong allowlist, 403 ở tầng CONNECT khi thử tải). Vì ảnh lấy từ nguồn
  khác nội dung chính (Znews) nên Source credit ghi 2 nguồn: "Nguồn: Znews / Dân Trí".
- `public/logo-bbh-mark.png`, `public/logo-bbh.png` — logo kênh, tái dùng asset cố định từ các
  video trước (không phải "state" composition).

## Customizations

Kế thừa toàn bộ từ `../BRAND-SYSTEM-BOT-BAN-HANG.md` (màu #E8441E/#FFFFFF/#111111, Montserrat mọi
vai trò chữ, cấu trúc 6 act — Hook/What happened/Key facts/Data moment/Context/Impact, anchor
logo/nguồn góc trên cố định, Hook title-card, sentence case, không dấu gạch ngang trang trí, SVG
reveal phải có state ẩn mặc định, voice ElevenLabs eleven_v3). Không lặp lại chi tiết ở đây.

5 act (What happened → Impact) dựng theo định hướng **Split Comparison** (xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md` mục Style 4): chia đôi khung hình ảnh/panel với vạch cam
mảnh dọc, hàng fact chia trái (nhãn)/phải (giá trị), "VS" so sánh cùng-kỳ/hiện-tại cho data moment,
bảng 2 cột trước/sau cho context, chia đôi ngang (trên/dưới) cho impact — không dùng ticker/chip
như 2 video trước.

Phân bổ nội dung theo act (không lặp số liệu giữa các act):
- Hook: vốn hóa 1,8 triệu tỷ đồng — kỷ lục mới.
- What happened: giá cổ phiếu 236.000đ (+2,6%), phiên tăng thứ 6 liên tiếp.
- Key facts: VN-Index 1.831,56 điểm (+10,24đ), thanh khoản toàn thị trường ~16.600 tỷ đồng (giảm
  gần 20%) — VIC tăng ngược dòng thanh khoản thấp.
- Data moment (VS: cùng kỳ 2025 / H1 2026): lợi nhuận sau thuế 20.375 tỷ đồng, gấp 4,5 lần cùng kỳ.
- Context (tại sao): FTSE Russell đưa VIC vào rổ Large Cap của Global Equity Index Series.
- Impact (act cuối, sự thật đã xảy ra): tài sản ông Phạm Nhật Vượng +2,1 tỷ USD/24h → 36,5 tỷ USD
  (hạng 60 thế giới); bà Phạm Thu Hương +265 triệu USD → ~4 tỷ USD, nữ doanh nhân giàu nhất Việt Nam.

## Notes

- Toàn bộ số liệu truy nguyên được về bài Znews nêu trên — không tự bịa số liệu/nguồn. Bài nguồn
  không nêu số tuyệt đối doanh thu/lợi nhuận cùng kỳ 2025 (chỉ nêu %/lần tăng) — Data moment vì vậy
  dùng đúng cách diễn đạt "gấp 4,5 lần"/"+73%" thay vì tự suy ra số tuyệt đối cùng kỳ.
- BGM: tạo mới qua Google Lyria, tông modern business/news/digital/fast-paced/minimal/professional,
  100% không lời (instrumental only, theo quy tắc brand 2026-08-27).
- Act cuối (Impact) kết thúc bằng sự thật/số liệu đã xảy ra (tài sản đã tăng, đã đạt) — không suy
  đoán tương lai.
