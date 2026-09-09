# SCRIPT — Việt Nam sắp có công ty chứng khoán đầu tiên vốn 33.000 tỷ đồng

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio:
`assets/voice/line1.mp3` ... `line6.mp3`.

**Không viết tắt** — mọi từ viết đầy đủ đúng cách đọc thành tiếng (quy tắc bắt buộc 2026-09-07,
xem `../BRAND-SYSTEM-BOT-BAN-HANG.md` mục Voiceover). "TCBS" giữ nguyên vì là tên thương hiệu/mã
đọc được — ĐÃ VERIFY bằng transcript ngược (Gemini) trên bản voice gốc `line1.mp3`: transcript
khớp 100% văn bản gốc, "TCBS"/"SSI" được đọc liền mạch như một từ, không đánh vần rời rạc từng chữ
cái. "tỷ đồng" giữ nguyên (đọc đúng).

**Tăng tốc 10% bằng `ffmpeg atempo=1.10`** (pitch-preserving, xử lý xác định) cho cả 6 dòng sau
khi sinh bản gốc — tổng thời lượng voice gốc (~62.6s) vượt sát ngưỡng "dưới 1 phút TOÀN VIDEO", nên
áp dụng cùng kỹ thuật đã dùng ở video trước (`dai-gia-bds-kin-tieng-lai-11254-ty`, atempo=1.07) để
đưa về ~57s, vẫn giữ giọng tự nhiên. Bản gốc lưu tại `assets/voice/lineN-raw.mp3` (không dùng để
dựng), bản đã tăng tốc `assets/voice/lineN.mp3` là bản dùng trong composition.

1. **Hook** — `line1.mp3`
   > TCBS công bố kế hoạch nâng vốn điều lệ lên 33.293 tỷ đồng, vượt SSI, trở thành công ty chứng khoán có vốn điều lệ lớn nhất thị trường Việt Nam.

2. **What happened** — `line2.mp3`
   > Công ty Cổ phần Chứng khoán Kỹ Thương, thương hiệu TCBS, thông báo phát hành cổ phiếu trả cổ tức năm 2025, ngày giao dịch không hưởng quyền 17 tháng 9 năm 2026.

3. **Key facts** — `line3.mp3`
   > Công ty phát hành gần 555 triệu cổ phiếu, tỷ lệ 5 trên 1. Techcombank nhận khoảng 443 triệu cổ phiếu mới, thực hiện trong quý 3 và quý 4 năm 2026.

4. **Data moment** — `line4.mp3`
   > Vốn điều lệ của TCBS sẽ tăng từ 27.744 tỷ đồng lên 33.293 tỷ đồng.

5. **Context** — `line5.mp3`
   > Với mức vốn điều lệ mới, TCBS vượt qua SSI, tức Chứng khoán Sài Gòn, hiện hơn 30.000 tỷ đồng, để dẫn đầu thị trường chứng khoán Việt Nam. Đây là lần tăng vốn thứ ba trong năm 2026.

6. **Impact** — `line6.mp3`
   > Trong 6 tháng đầu năm 2026, TCBS đạt lợi nhuận sau thuế 2.840 tỷ đồng, tăng 17% so với cùng kỳ, chủ yếu nhờ doanh thu hoạt động tài chính tăng 39%.

## Thời lượng thật (đo bằng `ffprobe` sau khi sinh voice + atempo 1.10)

| Dòng | File | Thời lượng (giây) | `data-duration` frame (+0.3s đệm) |
| --- | --- | --- | --- |
| 1. Hook | `line1.mp3` | 8.986 | 9.3 |
| 2. What happened | `line2.mp3` | 9.587 | 9.9 |
| 3. Key facts | `line3.mp3` | 9.796 | 10.1 |
| 4. Data moment | `line4.mp3` | 6.452 | 6.8 |
| 5. Context | `line5.mp3` | 11.024 | 11.3 |
| 6. Impact | `line6.mp3` | 11.102 | 11.4 |

Tổng thời lượng voice: 56.947s. Tổng thời lượng video thiết kế (6 frame nối tiếp): **58.8s** — dưới
1 phút.

## On-screen text (khác voice, cô đọng hơn cho từng frame)

- Hook: kicker "Bot Bán Hàng" · badge "Nguồn: Znews · 9/9/2026" · headline "VIỆT NAM SẮP CÓ CÔNG TY
  CHỨNG KHOÁN ĐẦU TIÊN VỐN 33.000 TỶ ĐỒNG" · số hero "33.293 tỷ đồng" · dòng phụ "Vượt SSI, dẫn đầu
  thị trường"
- What happened: kicker "TCBS · Techcombank Securities" · headline "TCBS phát hành cổ phiếu trả cổ
  tức, ngày giao dịch không hưởng quyền 17/9/2026"
- Key facts (chip viền cam): (1) "555 triệu cổ phiếu" / "Tỷ lệ phát hành 5:1" (2) "443 triệu cổ
  phiếu" / "Techcombank nhận mới" (3) "Quý 3 – Quý 4/2026" / "Thời gian thực hiện"
- Data moment: watermark số nền "33.293" · số hero "27.744 → 33.293" nhãn nhỏ "VỐN ĐIỀU LỆ (TỶ
  ĐỒNG)"
- Context (leaderboard): "#1 TCBS — 33.293 tỷ đồng" (nhấn cam) · "#2 SSI — hơn 30.000 tỷ đồng" —
  nhãn phụ "Lần tăng vốn thứ 3 trong năm 2026 · Dẫn đầu thị trường chứng khoán Việt Nam"
- Impact (chip + dòng chữ): "LỢI NHUẬN SAU THUẾ 6T/2026 — 2.840 tỷ đồng ▲ 17%" · "Doanh thu hoạt
  động tài chính +39%"
