# BRIEF — Ngân hàng Nhà nước nâng tỷ giá trung tâm lên kỷ lục

## Nguồn

- VnExpress, 15/9/2026: "Ngân hàng Nhà nước nâng tỷ giá trung tâm lên kỷ lục" —
  https://vnexpress.net/ngan-hang-nha-nuoc-nang-ty-gia-trung-tam-len-ky-luc-5120424.html
- ID Apps Script: `0a78d18f9b84` — đã đánh dấu `used`.
- Ảnh: `assets/img/hook-photo.jpg` (VPBank, ảnh giao dịch tại quầy, nguồn Znews/Thanh Tùng qua
  Apps Script proxy).
- Style claim: `claim_style` → `index: 1`, `style: "2-chip-and-leaderboard"` (Chip & Leaderboard).

## Câu chuyện (chỉ dùng số liệu có trong bài, không suy đoán)

Ngày 15/9/2026, Ngân hàng Nhà nước công bố tỷ giá trung tâm USD/VND ở mức 25.617 đồng, tăng 10 đồng
so với hôm trước — vượt đỉnh cũ từng lập hồi 25/8 và 3/9 (25.615 đồng), xác lập kỷ lục mới. Với biên
độ giao dịch ±5% các ngân hàng thương mại được phép áp dụng, tỷ giá sàn — trần dao động quanh
24.336 — 26.898 đồng.

Tại nhóm ngân hàng thương mại lớn, Vietcombank, VietinBank, Eximbank đồng loạt nâng giá mua bán
20–40 đồng, đưa tỷ giá giao dịch lên vùng 25.810 — 26.220 đồng. Trên thị trường tự do, một số điểm
thu đổi tại Thành phố Hồ Chí Minh giao dịch quanh 25.700 — 26.000 đồng, tăng 30 đồng so với đầu tuần.

Nguyên nhân chính: Cục Dự trữ Liên bang Mỹ (Fed) họp chính sách tiền tệ trong hai ngày 15–16/9/2026,
nhiều tổ chức tài chính dự báo Fed tăng lãi suất thêm 25 điểm cơ bản — lần tăng đầu tiên kể từ năm
2023. Áp lực từ chính sách tiền tệ toàn cầu được đánh giá kém thuận lợi hơn cho các đồng tiền thị
trường mới nổi, trong đó có VND.

## Góc độ kinh doanh/tác động (định vị kênh)

Tỷ giá trung tâm lập kỷ lục mới ngay trước thềm quyết định lãi suất của Fed — biến động tỷ giá ảnh
hưởng trực tiếp tới chi phí nhập khẩu nguyên liệu, nghĩa vụ trả nợ vay ngoại tệ của doanh nghiệp, và
là chỉ báo sớm cho định hướng điều hành tiền tệ trong nước những tuần tới.

## Style dựng: 2 — Chip & Leaderboard

Ẩn dụ: Chip số liệu viền cam bo góc (không phải pill tròn) + bảng xếp hạng ngang (leaderboard) +
watermark số khổng lồ mờ phía sau làm lớp nền chiều sâu. Dùng cho: Key facts dạng chip số liệu xếp
dọc, Data moment với watermark số khổng lồ phía sau con số chính, Context bằng bảng xếp hạng ngang
so sánh nhiều mốc/nhóm, Impact 2 chip lớn cạnh nhau.

## Cấu trúc 6 act

1. **Hook** (0–~5s): ảnh giao dịch ngân hàng (đã tải) + panel tối, masthead "Bot Bán Hàng", badge
   "Nguồn: VnExpress · 15/9/2026", tiêu đề lớn "Tỷ giá trung tâm lập kỷ lục 25.617 đồng".
2. **What happened**: Ngân hàng Nhà nước công bố tỷ giá trung tâm 25.617 đồng/USD, tăng 10 đồng,
   vượt đỉnh cũ 25.615 đồng (25/8 và 3/9/2026).
3. **Key facts** (chip số liệu xếp dọc): (1) biên độ ±5% → tỷ giá sàn – trần 24.336 – 26.898 đồng;
   (2) Vietcombank/VietinBank/Eximbank tăng 20–40 đồng, giao dịch 25.810 – 26.220 đồng; (3) chợ tự
   do Thành phố Hồ Chí Minh 25.700 – 26.000 đồng, tăng 30 đồng so với đầu tuần.
4. **Data moment** (watermark số khổng lồ phía sau): con số chính "25.617" đồng/USD — mức tỷ giá
   trung tâm kỷ lục mới, count-up nổi bật.
5. **Context** (bảng xếp hạng ngang so sánh mốc thời gian): 3/9/2026 → 25.615 đồng (đỉnh cũ);
   15/9/2026 → 25.617 đồng (đỉnh mới); nguyên nhân — Fed họp chính sách tiền tệ 15–16/9/2026, dự báo
   tăng lãi suất thêm 25 điểm cơ bản, lần đầu tiên kể từ năm 2023.
6. **Impact** (2 chip lớn cạnh nhau): (a) tỷ giá kỷ lục ngay trước thềm quyết định lãi suất Fed;
   (b) áp lực chính sách tiền tệ toàn cầu tác động trực tiếp chi phí nhập khẩu và nợ vay ngoại tệ
   của doanh nghiệp trong nước.

Act cuối là sự thật/số liệu đã công bố (tỷ giá, lịch họp Fed đã ấn định), không suy đoán diễn biến
tỷ giá hay quyết định của Fed sắp tới.

## Ràng buộc brand

Màu #E8441E/#FFFFFF/#111111, Montserrat mọi vai trò chữ, sentence case cho câu/cụm từ hiển thị,
brand anchor (logo + nguồn) cố định góc trên sau Hook, act cuối không suy đoán tương lai, BGM 100%
không lời.
