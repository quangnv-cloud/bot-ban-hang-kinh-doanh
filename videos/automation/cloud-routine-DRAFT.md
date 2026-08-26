# Cấu hình routine tự động 3 lần/ngày — DRAFT (chưa tạo thật)

Soạn sẵn theo yêu cầu, **CHƯA gọi `RemoteTrigger create`** — còn chờ kết quả probe môi trường
(§10.6 trong `PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`) + 3 việc người dùng cần tự làm trước (xem cuối
file). Khi đủ điều kiện, chỉ cần copy 3 khối JSON bên dưới vào `RemoteTrigger create`.

## Lịch (3 routine riêng — 1 cron expression không biểu diễn được 3 cặp giờ:phút khác nhau)

| Routine | Giờ VN | Cron (UTC) |
| --- | --- | --- |
| BBH auto-video — sáng | 07:00 | `0 0 * * *` |
| BBH auto-video — trưa | 12:30 | `30 5 * * *` |
| BBH auto-video — tối | 19:30 | `30 12 * * *` |

## job_config chung cho cả 3 (chỉ khác `name` + `cron_expression`)

```json
{
  "name": "BBH auto-video — sáng (7h VN)",
  "cron_expression": "0 0 * * *",
  "enabled": false,
  "job_config": {
    "ccr": {
      "environment_id": "env_01Prtq2F5hNPLxk3EW2maFA8",
      "session_context": {
        "model": "claude-sonnet-5",
        "sources": [{"git_repository": {"url": "https://github.com/quangnv-cloud/bot-ban-hang-kinh-doanh"}}],
        "allowed_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebFetch"]
      },
      "events": [{"data": {
        "uuid": "<tạo UUID v4 mới lúc create>",
        "session_id": "",
        "type": "user",
        "parent_tool_use_id": null,
        "message": {"role": "user", "content": "<PROMPT — xem bên dưới>"}
      }}]
    }
  }
}
```

**Cố tình để `enabled: false` trong bản nháp** — chỉ bật `true` sau khi đã chạy `run_once_at` thử
có giám sát ít nhất 1 lần thành công trọn vẹn (mục 6 trong checklist §10 của
PRODUCTION-WORKFLOW), đúng nguyên tắc không giao lịch chạy vô thời hạn cho một chuỗi chưa verify
đầu-cuối trong môi trường cloud thật.

## Nội dung prompt (dùng chung cho cả 3 routine)

```
Bạn đang tự động sản xuất 1 video tin tức kinh doanh cho kênh "BOT BÁN HÀNG · KINH DOANH", chạy
không giám sát theo lịch. Đọc kỹ 3 file sau TRƯỚC KHI làm bất cứ điều gì — đây là toàn bộ quy tắc
bắt buộc, không được bỏ qua hay tự suy đoán thay thế:
  - videos/BRAND-SYSTEM-BOT-BAN-HANG.md
  - videos/PRODUCTION-WORKFLOW-BOT-BAN-HANG.md
  - videos/CONSTRUCTION-STYLES-BOT-BAN-HANG.md

Thực hiện đúng trình tự trong PRODUCTION-WORKFLOW-BOT-BAN-HANG.md, cụ thể:

1. Lấy danh sách tin ứng viên: GET <NEWS_FEED_URL>?category=business và
   GET <NEWS_FEED_URL> (không filter, để có cả thời sự tổng hợp). Chọn 1 tin đang nóng nhất, ưu
   tiên góc độ số liệu/tác động kinh tế-kinh doanh (xem mục 1 của PRODUCTION-WORKFLOW). Sau khi
   chọn, POST <NEWS_FEED_URL> với {"id": "<id đã chọn>", "video": "<tên thư mục project sẽ tạo>"}
   để đánh dấu đã dùng.

2. Đọc videos/style-rotation-state.json, dùng style tại vị trí (last_used_index + 1) % 10 cho
   video này (chi tiết từng style ở CONSTRUCTION-STYLES-BOT-BAN-HANG.md).

3. Viết BRIEF.md + SCRIPT.md trong thư mục project mới (videos/<slug-tin>/), khởi tạo qua
   hyperframes CLI (KHÔNG copy state file từ project cũ).

4. Sinh voice ElevenLabs (model eleven_v3, voice_id RCmOaM1iiIH5xX3QXjIF — key đọc từ biến môi
   trường ELEVENLABS_API_KEY).

5. Dựng composition 7-act theo đúng định hướng của style đã chọn ở bước 2, Hook + Brand Anchor giữ
   cố định theo brand system, act cuối là sự thật/số liệu (không suy đoán tương lai).

6. BGM (Google Lyria, key GEMINI_API_KEY) + SFX + carve.mjs.

7. npm run check — fix hết error trước khi render.

8. Render + verify đầy đủ theo mục 7 của PRODUCTION-WORKFLOW (ffprobe duration, silencedetect,
   frame extraction xem bằng mắt qua Read, Whisper transcript spot-check).
   [GHI CHÚ: nếu môi trường sandbox này thiếu ffmpeg/trình duyệt headless để render local, thử
   `npx hyperframes cloudrun` hoặc `npx hyperframes lambda` (render qua hạ tầng HeyGen-hosted) thay
   vì `npm run render` cục bộ — kiểm tra `npx hyperframes docs rendering` nếu cần chi tiết cách
   dùng. Nếu cả hai đều không khả thi trong lần chạy này, DỪNG LẠI, không cố render bằng cách chắp
   vá, ghi rõ lý do thất bại vào phần tóm tắt cuối cùng.]

9. Cập nhật last_used_index + log trong videos/style-rotation-state.json.

10. Commit + push toàn bộ project mới (trừ node_modules/) lên repo, kèm cả file video đã render
    vào videos/<slug-tin>/output/ (thư mục này KHÔNG bị .gitignore — khác với renders/ vốn bị
    loại trừ — để đảm bảo có nơi lưu/giao file ổn định dù chưa xác nhận được cơ chế giao file trực
    tiếp nào khác của phiên cloud này).

11. Kết thúc bằng 1 bản tóm tắt ngắn: tin đã chọn + nguồn, style đã dùng, thời lượng video, kết
    quả verify, đường dẫn file trong repo. Nếu BẤT KỲ bước nào thất bại, DỪNG LẠI ở đó, không cố
    "chữa cháy" bằng cách bỏ qua bước verify hay hạ thấp tiêu chuẩn brand — báo lỗi rõ ràng trong
    tóm tắt thay vì giao 1 video lỗi.
```

`<NEWS_FEED_URL>` = **đã có, thay trực tiếp vào prompt trên**:
`https://script.google.com/macros/s/AKfycbxIQa9BsNnTAsIs2MWBNCsT8zh7_lT9OIKn8srfQ5D3wks0AM88VrjHNvCpYTAEaA7n/exec`
(đã verify từ cloud sandbox: 74 tin kinh doanh, 285 tin tổng — xem SETUP.md).

## Còn thiếu trước khi tạo 3 routine thật (không thể làm thay qua tool hiện có)

1. **Kết nối GitHub cho routine** — thử tạo routine dùng repo vừa push
   (`quangnv-cloud/bot-ban-hang-kinh-doanh`) bị chặn: *"Connect your GitHub account before saving
   a routine that uses a GitHub repository."* Cần vào https://claude.ai/code (mục Routines/
   Settings) kết nối GitHub — đây là kết nối ở cấp claude.ai, khác với `gh auth` trên máy (máy đã
   đăng nhập sẵn, không liên quan).
2. **API key làm secret trên cloud environment** `env_01Prtq2F5hNPLxk3EW2maFA8` — `ELEVENLABS_API_KEY`
   và `GEMINI_API_KEY` cần được thêm vào đó để prompt ở bước 4/6 chạy được. Cách làm cụ thể chưa
   xác nhận qua tool hiện có — nhiều khả năng qua giao diện quản lý environment tại claude.ai/code.
3. **Deploy Google Apps Script** (`automation/news-fetch-gas/SETUP.md`) để có `<NEWS_FEED_URL>`
   thật thay placeholder trong prompt trên.
4. **Kết quả probe môi trường** đang chờ (routine chẩn đoán `trig_01NkU9uCDBiSPNwgdzkc1D3v`) — sẽ
   quyết định bước 8 ở trên dùng render local hay `cloudrun`/`lambda`, và có cần điều chỉnh gì
   khác trong prompt hay không.
