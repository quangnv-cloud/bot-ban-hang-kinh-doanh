# Quy trình sản xuất video — BOT BÁN HÀNG · KINH DOANH

Runbook thao tác, dùng chung cho MỌI video tin tức kinh doanh dựng cho kênh này. File này mô tả
**quy trình** (làm gì, theo thứ tự nào, lệnh gì, verify thế nào). Toàn bộ quy tắc **brand/style**
(màu, font, cấu trúc act, quy định chữ, bài học kỹ thuật GSAP/CSS...) nằm ở
`BRAND-SYSTEM-BOT-BAN-HANG.md` — đọc file đó song song, không lặp lại nội dung ở đây.

Đúc kết từ 2 video đầu tiên của kênh (lần lượt tại `lan-bien-chuyen-nhuong-50-dat/` và
`100-doanh-nghiep-tu-nhan-nop-thue/`).

## 0. Trước khi bắt đầu

- Đọc `BRAND-SYSTEM-BOT-BAN-HANG.md` toàn bộ — đặc biệt mục "Bài học kỹ thuật từ các lần dựng
  trước", vì đó là danh sách lỗi đã tái diễn nhiều lần, không nhắc lại ở đây.
- **Nếu người dùng có yêu cầu rõ ràng "trao đổi kỹ trước khi chỉnh sửa"** (đã từng nói ở video
  2) — coi đây là quy tắc thường trực: sau khi review video, LUÔN trình bày các vấn đề/đề xuất
  sửa và chờ người dùng xác nhận bằng danh sách quyết định rõ ràng trước khi đụng vào code. Chỉ
  bỏ qua bước này khi người dùng tự đưa ra chỉ thị sửa trực tiếp, dứt khoát (không phải câu hỏi
  mở) — khi đó thực hiện luôn, không hỏi lại thêm.
- KHÔNG copy trực tiếp state file (`index.html`, `meta.json`, thư mục `compositions/`) từ project
  cũ sang project mới — luôn khởi tạo project mới đúng chuẩn CLI (`hyperframes init` qua workflow
  `/hyperframes`), rồi build lại nội dung/layout riêng cho tin mới.

## 1. Chọn tin & lên kịch bản

**[Cập nhật 2026-08-25 — mở rộng nguồn tin]**: không còn giới hạn ở mục "Kinh doanh" của từng báo.
Nguồn dùng cho việc tìm tin (đủ cả thời sự tổng hợp lẫn kinh doanh/tài chính):

- Thời sự tổng hợp: VnExpress trang chủ (`vnexpress.net`) / Tin tức 24h
  (`vnexpress.net/tin-tuc-24h`), Dân Trí trang chủ (`dantri.com.vn`), Báo Mới
  (`baomoi.com`), Tuổi Trẻ (`tuoitre.vn`).
- Kinh doanh & tài chính: VnExpress Kinh doanh (`vnexpress.net/kinh-doanh`), Dân Trí Kinh doanh
  (`dantri.com.vn/kinh-doanh.htm`), Znews Kinh doanh Tài chính
  (`znews.vn/kinh-doanh-tai-chinh.html`).

Chọn tin **đang nóng nhất** trong cửa sổ thời gian gần nhất tính tới giờ chạy (7h/12h30/19h30),
không giới hạn phải gắn nhãn "kinh doanh" của báo gốc — nhưng khi dựng kịch bản, LUÔN đóng khung
câu chuyện qua góc nhìn số liệu/tác động kinh tế-kinh doanh nếu có thể (đúng định vị kênh
"BOT BÁN HÀNG · KINH DOANH"), tránh làm kênh trôi thành trang thời sự chung chung không có bản sắc.
Nếu 1 tin thời sự tổng hợp không có góc độ kinh doanh nào để khai thác, ưu tiên tin khác có số
liệu/tác động kinh tế rõ hơn.

1. Duyệt các nguồn trên, tìm 1 bài phù hợp — ưu tiên có số liệu cụ thể, có thể trực quan hoá (bảng
   xếp hạng, tăng/giảm %, so sánh theo thời gian...). Có thể kết hợp 1 bài chính + 1 bài liên quan
   để bổ sung ngữ cảnh/nhân vật.
2. Tạo `BRIEF.md` (mục tiêu, nguồn, nội dung chính) và `SCRIPT.md` (kịch bản voice theo từng dòng,
   MỘT dòng = MỘT act) trong thư mục project.
3. Kịch bản viết theo văn phong tin tức — không suy đoán/dự báo tương lai (xem mục "Cấu trúc act"
   trong `BRAND-SYSTEM-BOT-BAN-HANG.md`: act cuối cùng phải là sự thật/số liệu đã xảy ra, KHÔNG
   dùng câu kiểu "liệu xu hướng này có tiếp tục..." — bài học rút ra sau khi video 2 phải cắt bỏ
   act "Takeaway" mang tính nhận định).
4. Đọc `style-rotation-state.json` để biết "cách dựng" (construction style) cần dùng cho video
   này, theo đúng con trỏ xoay vòng — xem chi tiết mục 3 bên dưới.

## 2. Sinh giọng đọc (ElevenLabs)

Xem chi tiết đầy đủ (voice_id, lý do bắt buộc `eleven_v3`, cách verify bằng Whisper) tại mục
"Audio" trong `BRAND-SYSTEM-BOT-BAN-HANG.md`. Tóm tắt thao tác:

1. Tạo TỪNG file mp3 riêng cho từng dòng script (`line1.mp3`, `line2.mp3`...) — không gộp cả kịch
   bản vào một lần gọi API.
2. `model_id: eleven_v3` (KHÔNG `eleven_multilingual_v2` — model đó không hỗ trợ tiếng Việt dù
   tên gọi "Multilingual"), `voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự").
3. Đo thời lượng thật từng file (`ffprobe`), đây là input bắt buộc cho bước 4 (timing).
4. Verify nhanh bằng Whisper (`base` model, ép `language=Vietnamese`) — so với script gốc, chấp
   nhận lỗi ASR kiểu nhầm âm gần giống, không chấp nhận câu sai cấu trúc/nghĩa hoàn toàn.

## 3. Dựng composition

1. Khởi tạo project qua `/hyperframes` (không copy state cũ — xem mục 0).
2. Dựng từng frame theo cấu trúc **7 act** (xem bảng trong `BRAND-SYSTEM-BOT-BAN-HANG.md`) —
   act cuối cùng (Impact) là điểm kết video, giữ hình + brand anchor tới hết, KHÔNG thêm act
   đóng bằng nhận định/dự báo.
3. **Mỗi video dùng đúng 1 "cách dựng" theo con trỏ xoay vòng** (`style-rotation-state.json` +
   `CONSTRUCTION-STYLES-BOT-BAN-HANG.md`, 10 style tổng cộng) — không tự chọn style khác, không
   copy-paste HTML/CSS của một frame cũ rồi chỉ đổi chữ. Hook + Brand Anchor luôn cố định (không
   thuộc style nào), 5 act còn lại (What happened/Key facts/Data moment/Context/Impact) dựng theo
   đúng định hướng ẩn dụ hình ảnh của style đang xoay tới, nhưng vẫn phải tự thiết kế HTML/CSS/
   GSAP thật — mô tả trong file style chỉ là định hướng, không phải đặc tả đủ để bỏ qua thiết kế.
   **Sau khi dựng xong, cập nhật `last_used_index` + thêm 1 dòng vào `log` trong
   `style-rotation-state.json`** — bước này bắt buộc, quên sẽ làm vòng xoay bị lệch/lặp style.
4. **`data-duration` của mỗi frame = độ dài file voice thật (đo ở bước 2) + đệm ~0.3–0.5s** —
   không dùng khung giờ cố định copy từ video trước. Sau khi rút ngắn khung, rà lại TOÀN BỘ mốc
   animation nội bộ (`tl.fromTo(..., t)`) để nhịp cuối vẫn kịp hạ cánh trước khi khung kết thúc.
5. Giới hạn tổng thời lượng: **dưới 1 phút**, không có mốc cố định khác — độ dài thật khớp với
   nội dung, không kéo dài chỉ để lấp giờ.

## 4. Nhạc nền & SFX

1. BGM: sinh qua Google Lyria RealTime (`lyria-recipe.py`) theo mood "modern business/news/
   digital/fast-paced/minimal/professional", retrim bằng ffmpeg cho khớp tổng thời lượng video
   thật, có fade-out ~2–3s ở cuối:
   ```bash
   ffmpeg -y -i track-raw.mp3 -t <TOTAL_DUR> -af "afade=t=out:st=<TOTAL_DUR-3>:d=3.0" -c:a libmp3lame -q:a 2 assets/bgm/track.mp3
   ```
2. SFX: đặt cue tại các điểm pop-in text/card quan trọng và điểm chuyển cảnh chính (không phải
   MỌI lần chuyển cảnh) — xem palette SFX (click/pop/impact-bass/whoosh/chime) trong dự án hiện
   có làm tham chiếu tỉ lệ mật độ.
3. Gắn `data-audio-group="voiceover"` cho mọi `<audio>` giọng đọc, rồi chạy carve để BGM tự động
   duck dưới giọng:
   ```bash
   node <hyperframes-audio skill dir>/scripts/carve.mjs --comp index.html
   ```
4. **Luôn chạy lại `carve.mjs` sau bất kỳ thay đổi nào về timing/nội dung audio** (thêm/bớt dòng
   voice, đổi độ dài BGM, đổi `data-start`) — carve ghi `data-fx-carve`/`data-fx-chain`/
   `data-automation` cố định vào file, không tự cập nhật nếu file nguồn đổi sau đó. Nếu sửa timing
   mà không chạy lại carve, ducking sẽ lệch khỏi giọng đọc thật.

## 5. Lint & QA trước khi render

```bash
npm run check
```

- Fix hết **error** trước khi render. Warning/info xem xét theo từng trường hợp (vd. overflow
  30px của ảnh nền mờ là pattern cố ý — bleed cho hiệu ứng blur — không phải lỗi).
- Contrast: mục tiêu WCAG AA cho MỌI text mang thông tin thật. Số watermark trang trí (opacity
  thấp, chỉ để tạo chiều sâu thị giác, không phải nội dung cần đọc) có thể fail contrast — chấp
  nhận được nếu đó là lựa chọn thiết kế có chủ đích, không phải lỗi.
- Dùng Studio thumbnail để soát nhanh nhiều mốc thời gian mà không cần render toàn bộ:
  ```
  http://localhost:<port>/api/projects/<id>/thumbnail/index.html?t=<giây>&format=png&output=source&v=<cachebust>
  ```
  (cần `npx hyperframes preview --background` đang chạy; luôn đổi `v=` mỗi lần gọi vì có cache
  server-side). Đã verify khớp với output render thật, đáng tin hơn `hyperframes snapshot`.
- Soát TỪNG frame ít nhất 1 mốc thời gian đại diện, đặc biệt: frame vừa sửa/dựng mới, frame có
  số liệu dài (2 vs 3 chữ số...), frame có nền ảnh + text (kiểm tra contrast bằng mắt).

## 6. Render

```bash
npx hyperframes preview --stop   # dừng preview trước khi render
npm run render
```

## 7. Verify file render THẬT (không chỉ tin vào thumbnail/lint)

Bắt buộc thực hiện tất cả, không bỏ qua bước nào — thumbnail Studio đáng tin nhưng vẫn là preview,
chỉ file render mới là sản phẩm giao cho người dùng:

```bash
# 1) Thời lượng đúng như thiết kế
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 <file.mp4>

# 2) Không có khoảng lặng chết giữa video (dấu hiệu nhịp phim chậm)
ffmpeg -i <file.mp4> -af silencedetect=noise=-35dB:d=0.6 -f null -
# chỉ nên thấy silence_start gần cuối (fade-out tail của BGM), không có ở giữa video

# 3) Trích frame tại các mốc quan trọng, xem bằng mắt (Read tool trên ảnh PNG)
ffmpeg -y -ss <t> -i <file.mp4> -frames:v 1 -q:v 2 out.png

# 4) Transcript bằng Whisper trên audio đã mix — so với script gốc
ffmpeg -y -i <file.mp4> -vn -ac 1 -ar 16000 audio.wav
python -m whisper audio.wav --model base --language Vietnamese --output_format txt
```

Chỉ coi là "xong" khi cả 4 bước trên đều sạch. Không báo cáo hoàn thành chỉ dựa trên `npm run
check` hay thumbnail preview.

## 8. Giao video

- `SendUserFile` file mp4 kèm caption ngắn.
- Tóm tắt cho người dùng: thời lượng thật, các thay đổi so với yêu cầu (đối chiếu từng điểm nếu
  người dùng gửi danh sách đánh số), lỗi phát hiện + đã sửa (nếu có), và **chủ động nêu rõ mọi
  quyết định thiết kế mà bạn tự đưa ra** (vd. giữ nguyên cấu trúc 1 frame nào đó vì coi là quy
  ước brand) để người dùng có cơ hội phản hồi/chỉnh hướng.

## 9. Khi có phản hồi sửa

- Nếu phản hồi là **chỉ thị rõ ràng, dứt khoát** ("bỏ đi", "sửa lại thành X", "áp dụng cho các
  video sau") → thực hiện luôn, không hỏi lại.
- Nếu phản hồi là **ý kiến chung chung/câu hỏi mở** ("nhịp có chậm không?", "có phải lỗi font
  không?") → PHẢI trình bày phân tích + đề xuất, chờ người dùng xác nhận bằng quyết định cụ thể
  trước khi sửa (đây là instruction đứng của người dùng cho kênh này).
- Nếu phản hồi có tính **thường trực cho các video sau** ("từ giờ không làm X nữa") → ghi ngay
  vào `BRAND-SYSTEM-BOT-BAN-HANG.md` (quy tắc brand/nội dung) hoặc file này (quy tắc quy trình),
  không chỉ sửa video hiện tại rồi quên.

## 10. Tự động hoá 3 lần/ngày (cloud routine) — [Đang thiết lập, 2026-08-25]

Mục tiêu: chạy tự động lúc **7h00 / 12h30 / 19h30 (giờ VN)** mỗi ngày, tự tìm tin (mục 1, phạm vi
đã mở rộng), tự dựng video theo style xoay vòng (mục 3), tự render + verify (mục 5-7), rồi **tự
gửi video ngay** cho người dùng (không chờ duyệt) — quyết định đã chốt với người dùng ngày
2026-08-25.

**Hạ tầng đã chốt: chạy trên Cloud routine (Anthropic cloud, qua `/schedule`)**, KHÔNG dùng lịch
local (Windows Task Scheduler) — người dùng chọn cloud để không phụ thuộc máy phải bật đúng giờ.
Đánh đổi: phải chuyển toàn bộ pipeline hiện đang chạy local (ffmpeg, hyperframes CLI, Whisper,
ElevenLabs, Google Lyria) sang môi trường cloud, vốn KHÔNG có quyền truy cập file/máy local.

### Kiến trúc lấy tin — [ĐÃ SOẠN CODE, chưa deploy]

Google Apps Script làm lớp lấy tin, tách khỏi cloud routine — code đầy đủ + hướng dẫn cài đặt tại
`automation/news-fetch-gas/` (`Code.gs` + `SETUP.md`):

- Apps Script có trigger giờ riêng (`installHourlyTrigger`, tạo 1 lần), fetch RSS 6 nguồn đã xác
  minh hoạt động (VnExpress tin mới nhất + kinh doanh, Dân Trí home + kinh doanh, Tuổi Trẻ tin mới
  nhất, Znews kinh doanh-tài chính — Báo Mới KHÔNG có RSS công khai tìm được, tạm bỏ), ghi vào
  Google Sheet kèm cờ `used=false` (chống trùng tin giữa 3 lần chạy/ngày).
- Web App (`doGet?category=business|general`) trả JSON các tin chưa dùng trong 30h gần nhất; cloud
  routine gọi URL này qua `WebFetch`, tự chọn 1 tin bằng nhận định, rồi `POST` với `{id, video}` để
  đánh dấu `used=true`.
- Ưu điểm: không cần MCP connector, không phụ thuộc cloud routine tự scrape HTML thô của từng báo.
- **Việc người dùng cần tự làm** (không thể làm thay qua tool hiện có): tạo Google Sheet, dán
  `Code.gs` vào Apps Script editor, chạy `fetchAndStore` + `installHourlyTrigger` 1 lần, Deploy Web
  app, lấy URL — theo đúng 6 bước trong `SETUP.md`. Sau khi có URL, đưa lại để gắn vào prompt của
  cloud routine.

### Việc còn thiếu trước khi tạo routine thật (chưa làm ở phiên 2026-08-25)

1. ~~Git repo cho project~~ — **đã tạo**: repo private
   [`quangnv-cloud/bot-ban-hang-kinh-doanh`](https://github.com/quangnv-cloud/bot-ban-hang-kinh-doanh)
   (2026-08-25), toàn bộ `C:\Users\Admin\Desktop\Claude`. `.gitignore` chặn `.env`/`node_modules/`/
   `renders/`/`.claude/`/`.agents/` — đã verify không có secret nào lọt vào commit đầu tiên trước
   khi push.
2. ~~Cài môi trường cloud~~ — **đã probe thật** (routine `trig_01NkU9uCDBiSPNwgdzkc1D3v`,
   2026-08-25, 170s, xem log đầy đủ tại https://claude.ai/code/session_01WXXKeLEf8XM25emhQj1F2m):
   Node v22.22.2/npm 10.9.7 sẵn có; `ffmpeg` không có trên PATH nhưng root + `sudo -n true` OK nên
   `apt-get install -y ffmpeg` cài được ngay (đã dry-run xác nhận resolve sạch); Python 3.11.15 +
   `pip install openai-whisper` cài được (nặng ~1GB+ do kéo theo torch, chấp nhận được); **Chromium
   headless ĐÃ CÓ SẴN** tại `/opt/pw-browsers` (`chromium-1194`, `chromium_headless_shell-1194`) —
   khớp `PLAYWRIGHT_BROWSERS_PATH` của môi trường, hyperframes không cần tự tải trình duyệt;
   `npx hyperframes@latest --version` chạy thật, trả về `0.8.14` — xác nhận npm registry + Node
   tooling hoạt động đầy đủ; 27G đĩa trống / 15Gi RAM — dư sức cho pipeline render.
   **Kết luận**: hạ tầng kỹ thuật (Node/ffmpeg/Chromium/Python) trong sandbox HOÀN TOÀN đủ điều
   kiện chạy pipeline render local, không cần phụ thuộc `cloudrun`/`lambda` của hyperframes.
3. ~~Egress proxy chặn theo allowlist~~ — **ĐÃ XỬ LÝ XONG (2026-08-26)**: chuyển "Network access"
   của environment "Default" từ "Trusted" sang **"Custom"**, thêm domain gốc (giữ npm/pip/git hoạt
   động: `api.anthropic.com` + biến thể, `registry.npmjs.org`, `jsr.io`, `npm.jsr.io`, `pypi.org`,
   `files.pythonhosted.org`, `index.crates.io`, `proxy.golang.org`) + domain mới cho dự án
   (`api.elevenlabs.io`, `generativelanguage.googleapis.com`, `script.google.com`,
   `script.googleusercontent.com`, `vnexpress.net`, `dantri.com.vn`, `tuoitre.vn`, `znews.vn`,
   `github.com`, `raw.githubusercontent.com`, `objects.githubusercontent.com`). Verify lại bằng
   routine chẩn đoán (`trig_01EX9WCyTJNyNvCjn8aKoGZ2`): **12/12 domain reachable**, `npx
   hyperframes@latest --version` chạy trọn vẹn (v0.8.15) — không có gì bị hỏng khi chuyển từ
   Trusted sang Custom.
   <details còn giữ lại bên dưới để tham khảo bối cảnh phát hiện ban đầu>
   Egress proxy chặn theo allowlist (đã fix — bối cảnh gốc):
   sandbox đi qua 1 proxy chỉ cho phép domain nằm trong danh sách trắng (npm registry, PyPI,
   crates.io, Go proxy, jsr.io, api.anthropic.com...). `api.elevenlabs.io` VÀ `vnexpress.net` đều
   bị **403 ngay ở tầng CONNECT** (từ chối theo policy, không phải site sập). Nếu domain lấy tin
   (`script.google.com` cho Apps Script Web App) và domain ElevenLabs/Gemini cũng bị chặn tương tự
   (chưa test riêng từng cái), **TOÀN BỘ pipeline không gọi được ra ngoài dù code đúng 100%**.
   Cần người dùng vào cấu hình network/egress của cloud environment `Default` tại claude.ai/code
   (chưa rõ tool nào cho phép làm thay) để thêm vào allowlist: `api.elevenlabs.io`,
   `generativelanguage.googleapis.com` (Gemini/Lyria), `script.google.com` +
   `script.googleusercontent.com` (Apps Script Web App), và domain các nguồn tin nếu routine tự
   fetch trực tiếp thay vì qua Apps Script proxy (`vnexpress.net`, `dantri.com.vn`, `tuoitre.vn`,
   `znews.vn`). **Đây là việc cần làm TRƯỚC, quan trọng hơn cả việc cấu hình API key secret** —
   API key đúng cũng vô ích nếu domain bị chặn ở tầng mạng.
4. ~~API key làm secret trên cloud~~ — **ĐÃ XONG (2026-08-26)**: điền `ELEVENLABS_API_KEY` +
   `GEMINI_API_KEY` vào ô "Environment variables" của environment "Default" (environment riêng tư,
   chỉ người dùng này truy cập — chấp nhận được vì ô đó không mã hoá, hiện dạng plain text cho
   bất kỳ ai dùng chung environment). Verify qua routine chẩn đoán
   (`trig_01CyA8FdCZc7rkf2LM5pQZSn`): cả 2 key đọc được từ sandbox, xác thực thành công với
   ElevenLabs (`/v1/user` → 200) và Gemini (`/v1beta/models` → 200), giọng "Khánh Lâm"
   (`RCmOaM1iiIH5xX3QXjIF`) gọi được. Không key nào bị in ra log trong quá trình kiểm tra.
5. ~~Google Apps Script~~ — **ĐÃ DEPLOY + VERIFY THÀNH CÔNG (2026-08-26)**. Bài học quan trọng:
   deploy trên tài khoản Workspace (`@botbanhang.vn`) bị 403 dù chọn "Anyone" (chính sách admin
   domain chặn chia sẻ ra ngoài tổ chức, đè lên cài đặt riêng của script) — phải chuyển sang deploy
   bằng Gmail cá nhân (`minhanhh1108@gmail.com`). Cũng đổi `getSheet_()` sang tự tạo Sheet riêng
   qua `PropertiesService` (project Apps Script standalone, không cần bind vào Sheet có sẵn nữa —
   đơn giản hoá setup). Verify từ đúng cloud sandbox (KHÔNG phải máy local — test `curl` từ máy cá
   nhân từng cho 403 sai lệch, không phản ánh đúng deployment) — kết quả: HTTP 200, JSON hợp lệ,
   `?category=business` → 74 tin, không filter → 285 tin.
   **URL chính thức**:
   `https://script.google.com/macros/s/AKfycbxIQa9BsNnTAsIs2MWBNCsT8zh7_lT9OIKn8srfQ5D3wks0AM88VrjHNvCpYTAEaA7n/exec`
   — đây là `<NEWS_FEED_URL>` dùng trong prompt routine ở mục "Nội dung prompt" phía trên.
6. ~~Kết nối GitHub cho routine~~ — **ĐÃ XONG (2026-08-26)**. Diễn biến đầy đủ (đáng nhớ, tránh
   mất thời gian lặp lại nếu gặp lại): (1) kết nối GitHub Integration trong claude.ai/Connectors
   → hết lỗi "Connect your GitHub account..." nhưng gặp lỗi mới `"You don't have access to a
   repository this routine uses."`; (2) kiểm tra `github.com/settings/installations` → "No
   installed GitHub Apps"; (3) tab "Authorized GitHub Apps" có "Claude" (owned by anthropics) ghi
   rõ *"Claude has not been installed on any accounts you have access to"* và quyền chỉ gồm "Verify
   identity / Know what resources you can access / Act on your behalf" — **không có bước chọn repo
   nào cả, kể cả disconnect+reconnect lại cũng không hiện màn hình chọn repo**; (4) **nguyên nhân
   thật**: kiểu kết nối OAuth này chỉ đọc được repo **public**, không đọc được private dù đã
   "connected" ở claude.ai. **Fix**: chuyển repo `bot-ban-hang-kinh-doanh` từ Private → Public
   (GitHub repo Settings → Danger Zone → Change visibility — thao tác này bị chặn nếu làm qua `gh`
   CLI của Claude Code do auto-mode classifier, phải tự làm trên web GitHub). Verify: routine clone
   + đọc file thành công ngay sau khi đổi visibility.
   **Lưu ý cho tương lai**: nếu tạo repo mới cho việc tương tự, làm public NGAY TỪ ĐẦU để khỏi lặp
   lại toàn bộ quá trình dò lỗi này. Repo hiện tại không chứa `.env`/secret nào (đã verify trước
   khi push), chỉ có code + tài liệu + kịch bản — chấp nhận được khi public.
7. **Cơ chế giao video từ cloud routine**: routine cloud không dùng chung `SendUserFile` như phiên
   tương tác này — cần xác nhận cách 1 cloud routine gửi file/kết quả về cho người dùng (có thể
   qua commit vào repo + thông báo, hoặc cơ chế khác) trước khi tin tưởng chạy 3 lần/ngày không
   giám sát. Routine chẩn đoán đã cho thấy `PushNotification` hoạt động được (gửi push báo "xong
   việc" khi routine hoàn tất) — có thể dùng làm tín hiệu báo hoàn tất tối thiểu, dù không thay
   thế được việc giao file thật.
7.5. ~~Tạo 3 routine thật~~ — **ĐÃ TẠO (2026-08-26)**, đều `enabled: false`:
   - Sáng 7h VN: `trig_01RdHP4oNHzaYm5UMjuZxWzb` (`0 0 * * *` UTC)
   - Trưa 12h30 VN: `trig_01HWAjgP7cpWSiprRfpJ68ap` (`30 5 * * *` UTC)
   - Tối 19h30 VN: `trig_01Y4gS5dsfucSEmBv7HQBL49` (`30 12 * * *` UTC)
   Prompt đầy đủ giống bản trong `automation/cloud-routine-DRAFT.md`, đã thay `<NEWS_FEED_URL>`
   bằng URL thật, thêm bước tự cài `ffmpeg`/`openai-whisper` nếu sandbox chưa có.
8. **Chạy thử có giám sát trước khi bật lịch thật** — không bật `enabled: true` chạy 3 lần/ngày
   ngay từ đầu; nên `run_once_at` 1 lần để kiểm tra toàn bộ chuỗi (lấy tin → dựng → render →
   verify → giao video) hoạt động đúng trong môi trường cloud trước khi tin tưởng giao cho lịch
   tự động vô thời hạn.

---

*File này + `BRAND-SYSTEM-BOT-BAN-HANG.md` + `CONSTRUCTION-STYLES-BOT-BAN-HANG.md` là ba tài liệu
tham chiếu bắt buộc đọc trước khi dựng bất kỳ video nào cho kênh BOT BÁN HÀNG · KINH DOANH. Cập
nhật cả ba file này mỗi khi phát sinh bài học/quy tắc mới — không để kiến thức chỉ tồn tại trong
lịch sử hội thoại.*
