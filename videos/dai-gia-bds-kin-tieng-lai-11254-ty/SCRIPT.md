# SCRIPT — Đại gia bất động sản kín tiếng lãi hơn 11.254 tỷ đồng, chỉ xếp sau Vinhomes

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio: `assets/voice/line1.mp3`
... `line6.mp3`.

**Không viết tắt** — mọi từ viết đầy đủ đúng cách đọc thành tiếng (quy tắc bắt buộc 2026-09-07,
xem `../BRAND-SYSTEM-BOT-BAN-HANG.md` mục Voiceover). Không đọc ký hiệu minh hoạ "TDM" trong voice
(chỉ hiển thị trên màn hình ở act Data moment) để tránh đọc đánh vần từng chữ cái.

1. **Hook** — `line1.mp3`
   > Công ty Cổ phần Thời Đại Mới T&T, chủ đầu tư dự án The Grand Hanoi tại Hàng Bài, Hà Nội, báo lãi hơn 11.254 tỷ đồng, chỉ xếp sau Vinhomes.

2. **What happened** — `line2.mp3`
   > Công ty công bố báo cáo tài chính 6 tháng đầu năm 2026: lợi nhuận trước thuế 14.159 tỷ đồng, lợi nhuận sau thuế hơn 11.254 tỷ đồng.

3. **Key facts** — `line3.mp3`
   > Hệ số lợi nhuận trên tổng tài sản tăng từ 0,27% lên 8,19%; hệ số lợi nhuận trên vốn chủ sở hữu tăng từ 5,58% lên 30,11%.

4. **Data moment** — `line4.mp3`
   > So với cùng kỳ năm ngoái, lợi nhuận trước thuế của công ty tăng khoảng 31 lần, từ hơn 456 tỷ đồng lên 14.159 tỷ đồng.

5. **Context** — `line5.mp3`
   > Mức lợi nhuận này vượt qua hàng loạt doanh nghiệp bất động sản niêm yết như Sunshine Group, Novaland, Nam Long, và chỉ thấp hơn Vinhomes.

6. **Impact** — `line6.mp3`
   > Công ty giảm mạnh nợ phải trả, từ 163.639 tỷ đồng xuống còn 100.038 tỷ đồng, đồng thời tiếp tục phát triển dự án The Grand Hanoi tại Hàng Bài, Hà Nội.

## Thời lượng thật (đo bằng `ffprobe` sau khi sinh voice)

ElevenLabs `eleven_v3` (không truyền `speed` — tham số này không phản hồi ổn định/nhất quán ở
model v3, thử nghiệm cho kết quả không đơn điệu theo giá trị speed). Bản voice tự nhiên (raw) có
tổng thời lượng ~59.8s — sát ngưỡng dưới 1 phút của TOÀN VIDEO (chưa tính đệm animation), nên đã
tăng tốc đều 7% bằng `ffmpeg -af atempo=1.07` (pitch-preserving, xử lý xác định/deterministic,
đáng tin hơn tham số `speed` của API) cho cả 6 file, vẫn giữ giọng tự nhiên. Thời lượng cuối:

| Dòng | File | Thời lượng (giây) | `data-duration` frame (+ đệm) |
| --- | --- | --- | --- |
| 1. Hook | `line1.mp3` | 9.404 | 9.8 |
| 2. What happened | `line2.mp3` | 9.456 | 9.9 |
| 3. Key facts | `line3.mp3` | 10.815 | 11.2 |
| 4. Data moment | `line4.mp3` | 8.333 | 8.7 |
| 5. Context | `line5.mp3` | 7.079 | 7.5 |
| 6. Impact | `line6.mp3` | 10.893 | 11.4 |

Tổng thời lượng voice: 55.98s. Tổng thời lượng video thiết kế (6 frame nối tiếp): **58.5s** — dưới
1 phút. Các số liệu đầy đủ hơn (ROA/ROE cụ thể, lợi nhuận chưa phân phối 26.344 tỷ, hệ số nợ/vốn
chủ sở hữu 20,02→2,68 lần, 3 lô trái phiếu...) vẫn giữ trong `BRIEF.md` và hiển thị trên màn hình
(on-screen text bên dưới) dù không đọc hết trong voice.

## On-screen text (khác voice, cô đọng hơn cho từng frame)

- Hook: kicker "Bot Bán Hàng" · badge "Nguồn: Znews · 8/9/2026" · headline "ĐẠI GIA BẤT ĐỘNG SẢN
  KÍN TIẾNG LÃI HƠN 11.254 TỶ ĐỒNG" · số hero "11.254 tỷ đồng" · dòng phụ "Chỉ xếp sau Vinhomes"
- What happened: kicker "BÁO CÁO TÀI CHÍNH 6 THÁNG 2026" · headline "Thời Đại Mới T&T: lãi trước
  thuế 14.159 tỷ đồng, lãi sau thuế hơn 11.254 tỷ đồng"
- Key facts (3 dòng terminal, ký hiệu ▲): (1) "ROA: 0,27% ▲ 8,19%" (2) "ROE: 5,58% ▲ 30,11%" (3)
  "Lợi nhuận chưa phân phối: 176 tỷ ▲ 26.344 tỷ đồng"
- Data moment: mã hiệu nhỏ "TDM" · số hero "×31" nhãn nhỏ "LỢI NHUẬN TRƯỚC THUẾ TĂNG SO VỚI CÙNG KỲ"
  · dòng phụ "456 tỷ đồng (6T/2025) → 14.159 tỷ đồng (6T/2026)"
- Context (biểu đồ nến xếp hạng, không gắn số liệu bịa cho DN khác): "1. Vinhomes" · "2. Thời Đại
  Mới T&T — 11.254 tỷ đồng" (nhấn cam) · "Sunshine Group" · "Novaland" · "Nam Long" — nhãn phụ
  "Lợi nhuận 6 tháng vượt Sunshine, Novaland, Nam Long — chỉ thấp hơn Vinhomes"
- Impact (2 dòng): (1) "NỢ PHẢI TRẢ — 163.639 tỷ đồng → 100.038 tỷ đồng" (2) "DỰ ÁN THE GRAND HANOI
  — 22-24 Hàng Bài, Hà Nội"
