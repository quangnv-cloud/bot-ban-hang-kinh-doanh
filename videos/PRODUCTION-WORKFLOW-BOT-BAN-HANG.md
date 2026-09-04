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
4. **Nhận "cách dựng" (construction style) cho video này** bằng cách gọi
   `POST <exec> {"action":"claim_style","video":"<slug-tin>"}` → trả về `{"ok":true,"index":N,
   "style":"N-tên"}`. Endpoint này cấp chỉ số style kế tiếp trong vòng xoay dưới 1 khoá
   (LockService), nên 2 routine chạy gần nhau không bao giờ nhận trùng slot (sự cố 2026-08-30 +
   2026-09-03). **KHÔNG đọc `style-rotation-state.json` để lấy chỉ số nữa** — file đó giờ chỉ là
   bản sao cho người đọc. Xem chi tiết từng style ở `CONSTRUCTION-STYLES-BOT-BAN-HANG.md`, mục 3
   bên dưới. Gọi `claim_style` NGAY SAU khi đã chốt tin (bước 1) và đánh dấu `used`, trước khi
   dựng — nếu run hỏng sau đó, slot bị "cháy" (vòng xoay nhảy thêm 1) là chấp nhận được.
5. **Ảnh minh hoạ bài báo** (bắt buộc theo brand — Hook + Article Image Card + thumbnail): mỗi
   item trong danh sách trả về từ bước 1 có `hasImage: true/false` và `imageUrl`. Với tin đã
   chọn, tải ảnh bằng `GET <exec>?image=<id tin>` → trả JSON
   `{"ok":true,"mime":"image/jpeg","filename":"...","data":"<base64>"}`. Giải mã base64 ra file
   (`... | jq -r .data | base64 -d > hook-photo.jpg`). **KHÔNG curl thẳng CDN báo**
   (`icdn.dantri.com.vn`, `i1-*.vnecdn.net`, `cdn*.tuoitre.vn`, `photo.znews.vn`...) — các domain
   này chập chờn/không nằm trong egress allowlist của sandbox, đó là nguyên nhân hàng loạt lần
   routine chết ở bước 1 (2026-09-01→09-04). Apps Script tải ảnh hộ từ IP Google (không bị chặn)
   và cache lại. Nếu `?image=` trả `ok:false` (ảnh gốc 404/lỗi), chọn tin khác có `hasImage:true`.

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
3. **Mỗi video dùng đúng 1 "cách dựng" — là style đã nhận từ `claim_style` ở §1 bước 4**
   (`CONSTRUCTION-STYLES-BOT-BAN-HANG.md`, 10 style tổng cộng) — không tự chọn style khác, không
   copy-paste HTML/CSS của một frame cũ rồi chỉ đổi chữ. Hook + Brand Anchor luôn cố định (không
   thuộc style nào), 5 act còn lại (What happened/Key facts/Data moment/Context/Impact) dựng theo
   đúng định hướng ẩn dụ hình ảnh của style đang xoay tới, nhưng vẫn phải tự thiết kế HTML/CSS/
   GSAP thật — mô tả trong file style chỉ là định hướng, không phải đặc tả đủ để bỏ qua thiết kế.
   **Nguồn sự thật của con trỏ xoay vòng giờ nằm trong Apps Script** (Script Property
   `STYLE_CURSOR`, cấp qua `claim_style` — xem `automation/news-fetch-gas/Code.gs`). Vẫn nên cập
   nhật `last_used_index` + thêm 1 dòng `log` vào `style-rotation-state.json` cho commit để người
   đọc theo dõi được, nhưng file đó KHÔNG còn là nơi routine đọc/ghi chỉ số — không lo 2 routine
   ghi đè nhau, không lo quên cập nhật làm lệch vòng xoay.
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
   **[Bắt buộc — 2026-08-27, áp dụng cho TOÀN BỘ tuyến video kinh doanh/đời sống, xem
   `BRAND-SYSTEM-BOT-BAN-HANG.md` mục Audio]**: nhạc nền LUÔN 100% không lời (instrumental), thể
   hiện đúng tinh thần tin tức nghiêm túc/chuyên nghiệp. Luôn truyền `--negative-prompt` khi gọi
   `lyria-recipe.py`, không chỉ dựa vào `--prompt` mô tả mood:
   ```bash
   python3 lyria-recipe.py \
     --output assets/bgm/track-raw.wav \
     --duration <TOTAL_DUR + đệm> \
     --prompt "modern business news underscore, digital, fast-paced, minimal, professional, instrumental only" \
     --negative-prompt "vocals, lyrics, singing, choir, rap, spoken word, humming"
   ```
   Sau khi sinh xong, nghe thử/kiểm tra bằng mắt nhanh (waveform hoặc chính bản audio) để chắc
   chắn không có giọng hát lọt vào — nếu track vẫn dính vocal dù đã có negative-prompt, sinh lại
   với `--prompt`/`--negative-prompt` mạnh tay hơn, không chấp nhận và không tự ý cắt/che đoạn có
   giọng hát.
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

## 7.5. Xuất ảnh thumbnail (bìa video)

**[Bắt buộc — 2026-08-27, áp dụng cho MỌI video]**: ngoài file mp4, luôn xuất kèm 1 ảnh thumbnail
tĩnh dùng làm bìa/ảnh đại diện video (đăng TikTok/YouTube Shorts...). Yêu cầu:

- Lấy khung hình trong cửa sổ **giây thứ 3–5** (đúng phần Hook — xem cấu trúc Hook trong
  `BRAND-SYSTEM-BOT-BAN-HANG.md`), tại thời điểm TOÀN BỘ animation vào đã hoàn tất: ảnh nền thật
  hiện rõ, logo hiện đủ, badge "Nguồn: … · [ngày]" hiện đủ, tiêu đề/số liệu lớn hiện đủ — không
  được chụp giữa lúc chữ/badge đang bay vào hoặc mờ/opacity chưa đạt 100%.
- Cách xác định mốc chính xác: đọc timeline GSAP trong `compositions/frames/01-hook.html`, tìm
  `tl.fromTo(...)` có mốc thời gian bắt đầu (tham số cuối) lớn nhất cộng với `duration` của chính
  tween đó — đó là thời điểm phần tử vào TRỄ NHẤT ổn định xong. Chọn `t` = mốc đó + ~0.3s đệm,
  nhưng KHÔNG vượt quá (thời lượng Hook − 0.3s) để tránh dính vào hiệu ứng chuyển cảnh ra khỏi
  Hook. Nếu không muốn tính tay, `t=3.5` là mặc định an toàn cho Hook dài ~5s (đã verify khớp thực
  tế ở video thứ 3 của kênh) — nhưng vẫn PHẢI xem lại bằng mắt (bước dưới), không dùng mù.
  ```bash
  ffmpeg -y -ss <t> -i output/<ten-project>.mp4 -frames:v 1 -q:v 2 output/thumbnail.jpg
  ```
- **Xem lại bằng mắt bắt buộc** (Read tool trên file ảnh) — xác nhận cả 4 thành phần (ảnh nền,
  logo, nguồn, tiêu đề/số) đều hiển thị đầy đủ, rõ nét, không bị cắt/mờ/tràn. Nếu còn thiếu, thử
  `t` khác trong cửa sổ 3–5s rồi chụp lại — không giao ảnh thumbnail chưa đạt.

**[2026-09-04 — ảnh bìa YouTube không dính, đã fix ở Apps Script bản 34]**: 2 video gần nhất
(`Pi1GXOCdUxw`, `SuSmwab4JTc`) hiển thị khung giữa video YouTube tự chọn thay vì ảnh bìa thương
hiệu, dù routine báo "thumbnail thành công". Nguyên nhân: `ytPublishVideo_` set thumbnail đúng 1
lần ngay sau `videos.insert` — lúc video còn đang xử lý nên YouTube từ chối/bỏ qua. Bản 34 thử
lại tới 5 lần (chờ 0/25/45/60/60s, dừng khi `code:200`); phản hồi có `result.thumbnail_attempts`.
**Nếu vẫn sai**, set lại thủ công (video đã xử lý xong nên chắc chắn dính):
```
POST <exec> {"action":"yt_set_thumbnail","video_id":"<id YouTube>",
  "thumbnail_url":"https://raw.githubusercontent.com/quangnv-cloud/bot-ban-hang-kinh-doanh/master/videos/<slug-tin>/output/thumbnail.jpg"}
```
trả `code:200` + `youtube#thumbnailSetResponse` là xong.

## 8. Giao video

- `SendUserFile` file mp4 VÀ file thumbnail (`output/thumbnail.jpg`) kèm caption ngắn.
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
   tự động vô thời hạn. **Đã chạy thử 2 lần (2026-08-26 và 2026-08-27)**, cả hai lần đều
   **dừng đúng lúc, không giao video lỗi** — xem mục 9 và 10 bên dưới.
9. **[2026-08-26] Lần chạy thử đầy đủ đầu tiên** — routine chọn đúng tin thật, đọc 3 file bắt
   buộc, tạo project `giam-30-thue-doanh-thu-duoi-10-ty`, nhưng dừng lại trước khi hoàn tất vì 2
   lỗ hổng hạ tầng: (a) ảnh bài báo nằm ở domain CDN riêng (`vnecdn.net`, `zadn.vn`, `vnncdn.net`)
   chưa nằm trong Custom egress allowlist của cloud environment; (b) git push lên GitHub bị 403.
   Đã thử vá lỗ hổng (a) bằng 1 Apps Script image-proxy (`?image=<url>`) — **routine cloud (chính
   Claude Code) tự chối chạy lệnh gọi endpoint đó 2 lần**, kể cả sau khi diễn đạt lại rõ ràng mục
   đích hợp pháp, vì bản chất đó là 1 cổng fetch-URL-tuỳ-ý đi vòng qua allowlist mạng — **đây là
   phản hồi an toàn ĐÚNG, đã revert hoàn toàn, không tìm cách né**. Hướng đúng: thêm thẳng domain
   CDN ảnh vào Custom allowlist (chưa làm — vẫn còn mở, xem mục 11).
10. **[2026-08-27] Sự cố ngoài ý muốn + lần chạy thử thứ 2**: gọi `RemoteTrigger run` với ý định
    override bằng 1 message xác minh nhỏ (test redeploy Apps Script) — **override bị bỏ qua**,
    API chạy luôn prompt sản xuất video thật của routine (`trig_01RdHP4oNHzaYm5UMjuZxWzb`). Không
    có cách nào huỷ 1 run cloud đang chạy (`TaskStop` chỉ áp dụng task local; `RemoteTrigger` không
    có action cancel). Kết quả: routine tự dừng đúng như thiết kế, **không chạm tới bước tốn kém
    nào** (chưa gọi ElevenLabs/Gemini, chưa render) — dừng ngay ở bước 10 (git push) vì cùng lỗi
    403 đã biết, gửi `PushNotification` báo cáo, rồi kết thúc sạch. Bài học 2 việc mới phát hiện:
    - **Nguyên nhân chính xác của lỗi push 403** (rõ hơn hẳn ghi chú cũ "cần GitHub App scope
      ghi"): thông báo lỗi của GitHub nêu đích danh *"Claude doesn't have GitHub access to
      quangnv-cloud/bot-ban-hang-kinh-doanh for your organization. An org admin can install the
      Claude GitHub App at **https://github.com/apps/claude/installations/select_target**"* — dù
      `quangnv-cloud` thực chất là tài khoản cá nhân (xác nhận qua `mcp__github__get_me`: 0
      followers/following, không phải org thật), GitHub coi việc cài app này là hành động cấp
      "organization installation". **Việc cần làm**: người dùng tự vào URL trên để cài Claude
      GitHub App với quyền ghi cho repo này — vẫn đang mở, xem mục 11.
    - Routine tự phát hiện 3 commit "detached HEAD" còn sót từ phiên trước (chưa từng lên
      `master`), tự gộp vào `master` cục bộ trong sandbox của nó — nhưng KHÔNG liên quan gì đến
      repo local trên máy Windows của người dùng (đã kiểm tra: local vẫn sạch, `master` khớp
      `origin/master`). Không cần hành động gì thêm cho việc này.
    - Trong lúc dừng, 1 stop-hook trong sandbox cloud tự sửa author của 3 commit đó sang
      `Claude <noreply@anthropic.com>` — vô hại, các commit này vẫn chưa push được nên không ảnh
      hưởng lịch sử `origin/master` thật.
11. ~~Cài Claude GitHub App với quyền ghi~~ — **ĐÃ XONG (2026-08-27)**. Người dùng cài tại
    https://github.com/apps/claude/installations/select_target, reconnect GitHub Integration ở
    claude.ai Settings → Connectors. **Verify bằng cách an toàn**: tạo 1 trigger routine TẠM RIÊNG
    (`trig_019HZ4pktTjB9y1rHt4nooWH`, prompt chỉ tạo branch `test/github-app-write-check` + push
    1 file test, KHÔNG đụng `master`/code thật) thay vì chạy lại 1 trong 3 trigger sản xuất thật —
    tránh lặp lại sự cố kích hoạt nhầm pipeline đầy đủ (mục 10). Kết quả: push thành công, không
    lỗi. Đã xoá branch test trên GitHub ngay sau đó. Trigger test vẫn còn tồn tại (`enabled: false`,
    cron đặt xa tới 2027 để không tự chạy) vì `RemoteTrigger` không có action xoá trigger — có thể
    tự xoá thủ công qua claude.ai/code nếu muốn dọn, không bắt buộc.
12. ~~Thêm domain CDN ảnh vào Custom network allowlist~~ — **ĐÃ XONG (2026-08-27)**. Domain ảnh
    Dân Trí xác định được qua kiểm tra trang thật: `cdnphoto.dantri.com.vn` (chính, ảnh bài viết),
    `cdnweb.dantri.com.vn` (phụ, logo/tài nguyên tĩnh). Đã thêm cùng `vnecdn.net`, `zadn.vn`,
    `vnncdn.net` vào allowlist của environment `env_01Prtq2F5hNPLxk3EW2maFA8`.
    **Lưu ý chung còn áp dụng**: gọi `RemoteTrigger run` trên 1 trong 3 trigger ID sản xuất luôn
    kích hoạt nguyên prompt sản xuất video thật đã lưu trong trigger — không có cách override bằng
    message khác qua tham số `body`. Muốn test nhỏ không tốn kém, tạo 1 trigger tạm riêng như cách
    đã làm ở mục 11.
13. ~~Chạy thử end-to-end lần đầu~~ — **THÀNH CÔNG (2026-08-27)**. Toàn bộ chuỗi (lấy tin → chọn tin
    → viết BRIEF/SCRIPT → voice ElevenLabs → composition 6-act style Ticker Tape → BGM Lyria + SFX
    + carve → `npm run check` → render → verify đủ 4 bước (ffprobe/silencedetect/frame/transcript)
    → commit + push) chạy trọn từ cloud sandbox, không cần thao tác thủ công. Video:
    `12-ngan-hang-tin-dung-408-nghin-ty` (12 ngân hàng tung gói tín dụng 408.000 tỷ đồng, Dân Trí
    26/08/2026), 46.4s. Ba lỗ hổng hạ tầng MỚI phát hiện + đã xử lý ngay trong lần chạy này:
    - **Apps Script POST bị 405/"Page Not Found" nếu dùng `curl -L`**: `curl -L` (mặc định, kể cả
      `--post301/--post302/--post303`) đổi POST→GET khi theo redirect hoặc theo sai cách sang
      `script.googleusercontent.com`, hỏng cả 2 chiều. Cách đúng: gọi POST KHÔNG kèm `-L`, tự đọc
      header `Location` (302, trỏ tới `script.googleusercontent.com/macros/echo?user_content_key=...`
      — Apps Script đã CHẠY XONG doPost và cache sẵn kết quả tại URL đó), rồi GET riêng URL đó để
      lấy response thật.
    - **`cdn.jsdelivr.net` (dùng để tải GSAP qua `<script src>`) KHÔNG nằm trong Custom network
      allowlist** — `npm run check`/render báo lỗi runtime `net::ERR_TUNNEL_CONNECTION_FAILED`.
      Domain này KHÁC hẳn với `registry.npmjs.org` (đã allowlist) — không tự suy luận là cùng loại
      "npm" nên chắc chắn được phép. Fix: vendor GSAP local — `npm install gsap@<version>` (đã có
      sẵn qua `registry.npmjs.org`), copy `node_modules/gsap/dist/gsap.min.js` vào
      `assets/vendor/gsap.min.js`, đổi `<script src="assets/vendor/gsap.min.js">` trong `index.html`
      thay vì fetch CDN. Áp dụng cho MỌI video sau — không dùng `<script src="https://cdn.jsdelivr.net/...">`
      nữa trong môi trường cloud.
    - **`openaipublic.azureedge.net` (host tải model weight của `openai-whisper`) cũng KHÔNG nằm
      trong allowlist** — `pip install openai-whisper` cài package thành công nhưng lần chạy đầu
      tiên (tự tải file `.pt` model) bị 403 ở tầng CONNECT. Domain host của whisper models chưa
      được thêm và KHÔNG có trong danh sách domain dự tính ở mục 3 (egress) — đây là lỗ hổng mới,
      chưa từng phát hiện trước đây vì các lần chạy thử trước đó (mục 9, 10) đều dừng sớm hơn bước
      này. Fix tạm thời đã dùng: verify transcript bằng Gemini multimodal (`generateContent` với
      `inline_data` audio/wav, model `gemini-flash-latest` — LƯU Ý tên model timestamp-cụ-thể như
      `gemini-2.5-flash` có thể bị "no longer available to new users" theo thời gian, luôn gọi
      `GET /v1beta/models` trước để lấy tên model còn dùng được) thay vì Whisper — cùng mục đích
      (so khớp lời đọc với script gốc), dùng domain đã sẵn allowlist
      (`generativelanguage.googleapis.com`). Việc cần làm sau (chưa làm, không bắt buộc vì đã có
      lối thay thế hoạt động): thêm `openaipublic.azureedge.net` vào Custom allowlist nếu muốn
      quay lại dùng đúng Whisper như mô tả gốc trong file này.
    - Bài học chung: mọi domain bên thứ ba không nằm trong danh sách đã duyệt ở mục 3 đều có khả
      năng bị chặn ở cloud sandbox dù hoạt động bình thường ở máy local trước đây — luôn test
      reachability sớm (`curl -sD -` hoặc thử chạy thật) thay vì giả định, và ưu tiên phương án tự
      host/dùng domain đã allowlist sẵn thay vì xin thêm domain mới khi có thể.

## 11. Tự động đăng mạng xã hội sau khi có video — [Đang thiết lập, 2026-08-27]

Bắt đầu với Facebook Fanpage (Feed + Reels), sẽ mở rộng sang TikTok/YouTube Shorts sau. Kiến trúc:
routine cloud (sau bước 7 verify) gọi `POST <NEWS_FEED_URL>` với body
`{"action":"publish_facebook","video_url":"<URL raw.githubusercontent.com của mp4>","caption":"<nội
dung>"}` → Apps Script (cùng project `news-fetch-gas`) tự đăng lên Feed (qua `file_url`, Facebook
tự fetch server-side) và Reels (qua flow start/upload/finish của Meta) — độc lập nhau, 1 bên lỗi
không chặn bên kia. Xem `automation/news-fetch-gas/Code.gs` (hàm `fbPublish_`) và
`automation/news-fetch-gas/SETUP.md` mục "Đăng Facebook Fanpage tự động".

**Lý do chọn kiến trúc này**: token các kênh mạng xã hội tách biệt khỏi môi trường cloud dựng video
(nơi có `ELEVENLABS_API_KEY`/`GEMINI_API_KEY`) — nếu môi trường dựng video có sự cố, token đăng bài
vẫn an toàn. Token lưu ở Script Properties của Apps Script, không hard-code trong `Code.gs`.

**[2026-08-27] Đã code + deploy live (Phiên bản 4)** — chưa test thật vì còn thiếu 2 Script
Properties (`FB_PAGE_ACCESS_TOKEN`, `FB_PAGE_ID`, xem SETUP.md), **người dùng phải tự thêm** — quy
tắc an toàn cố định của Claude Code cấm tự nhập API key/token vào bất kỳ field cấu hình nào (kể cả
khi người dùng đã cung cấp trực tiếp và đồng ý), chỉ được *dùng* token để gọi API (vd. verify qua
`curl`) chứ không được *nhập* vào UI.

Token thật đã được verify qua `curl` (không lưu vào đâu, không nhập vào field nào):
- Loại **System User** của Business Manager, `expires_at: 0` (không bao giờ hết hạn) — đúng chuẩn
  khuyến nghị cho tự động hoá.
- Đúng trang: "Kinh Tế Số" (Page ID `1276081382253398`).
- Đủ quyền `pages_manage_posts` (lần token đầu tiên người dùng gửi thiếu quyền này, đã yêu cầu tạo
  lại — lần 2 đủ quyền).

**Bài học phụ**: gọi `GET /me/accounts` để kiểm tra trả về access token của **TẤT CẢ** các trang mà
System User quản lý, không giới hạn theo 1 trang — tránh gọi endpoint này trừ khi thật sự cần liệt
kê nhiều trang; ưu tiên `GET /{page-id}?access_token=...` để kiểm tra đúng 1 trang, giảm rủi ro lộ
token trang không liên quan.

**Việc cần làm tiếp** (chờ người dùng):
1. Thêm 2 Script Properties trên Apps Script (`FB_PAGE_ACCESS_TOKEN`, `FB_PAGE_ID`).
2. Test thật `publish_facebook` với 1 video đã có (vd. video #3) — xem kết quả JSON trả về từ cả
   Feed lẫn Reels trước khi đưa bước này vào prompt của 3 routine thật.
3. Sau Facebook: bàn tiếp TikTok (lưu ý: Content Posting API mặc định chỉ đăng chế độ riêng
   tư/nháp SELF_ONLY trừ khi app đã qua audit của TikTok — cần hỏi người dùng trạng thái audit
   trước khi code) và YouTube Shorts (cần OAuth Client ID/Secret + refresh_token, "Testing mode" là
   đủ, không cần Google duyệt app).

**[2026-08-29 — bài học `publish_threads`] Giới hạn 500 ký tự cho caption Threads**: gọi
`publish_threads` với `caption` = nguyên văn `CAPTION.md` (thường 900-1200 ký tự, gồm cả hashtag)
bị Threads API từ chối ngay ở bước tạo container: `"Param text must be at most 500 characters
long."` (HTTP 500 từ Graph API, `phase: "create"`). Facebook/Instagram/YouTube không có giới hạn
này nên `CAPTION.md` đầy đủ vẫn dùng được cho 4/5 kênh — chỉ riêng Threads cần bản rút gọn. Cách xử
lý đã áp dụng: soạn thêm 1 bản caption ngắn (giữ đúng số liệu/nguồn, cắt bớt đoạn giải thích chi
tiết + bớt hashtag) dưới 500 ký tự (kể cả emoji/khoảng trắng), chỉ dùng riêng cho lệnh
`publish_threads`, rồi gọi lại — thành công ngay lần thử thứ 2. **Việc nên làm cho các video sau**:
khi soạn `CAPTION.md` ở bước 12, luôn kèm theo 1 bản "Threads-safe" (≤500 ký tự) ngay từ đầu thay vì
đợi lỗi rồi mới rút gọn, để tránh gọi API 2 lần.

**[2026-08-30 — sự cố 2 routine chạy song song chọn trùng tin + trùng style]**: hai phiên chạy
routine gần như đồng thời (cách nhau ~30 phút, cùng trong khung 13h-14h UTC 30/8/2026) đều tự chọn
tin từ cùng 1 báo cáo tài chính bán niên 2026 của Vingroup (1 chọn góc "lãi từ VinFast", 1 chọn góc
"khách trả trước 144.000 tỷ") — cả hai đều đọc `style-rotation-state.json` lúc `last_used_index: 8`
gần như cùng lúc (trước khi bên nào commit), nên cả hai đều tính ra cùng style tiếp theo (index 9,
**10-stock-terminal**) và dựng xong toàn bộ video trước khi phát hiện xung đột. Phiên chạy xong
trước (`vingroup-lai-12500-ty-tu-vinfast`, commit `e33fa85`, 13:49 UTC) push thành công; phiên chạy
sau bị `git push` từ chối (remote đã có commit mới) — đúng lúc phát hiện thì mới thấy cả 2 video
trùng công ty (Vingroup) VÀ trùng style (Stock Terminal), phát trong cùng 1 buổi. Quyết định: phiên
chạy sau (`vingroup-khach-tra-truoc-144-nghin-ty`) **không merge vào `master`, không đăng mạng xã
hội** — giữ lại trên nhánh `wip/vingroup-khach-tra-truoc-144-nghin-ty` (đã push lên GitHub) để tái
sử dụng sau nếu cần, tránh kênh phát 2 video na ná nhau (cùng công ty, cùng report, cùng ẩn dụ hình
ảnh) chỉ cách nhau nửa tiếng. Coi bước 11 (commit+push) là "thất bại" theo đúng tinh thần mục 17 —
dừng lại, không tiếp tục bước 12-16, báo cáo rõ trong tóm tắt thay vì force-push đè hoặc merge liều.
**Việc cần làm để tránh lặp lại** (chưa làm, đề xuất cho người vận hành): (1) không chạy 2 lần cho
cùng 1 khung giờ theo lịch (kiểm tra lại cấu hình cron/trigger, đặc biệt tránh gọi tay `fire_trigger`
hoặc override đúng lúc lịch tự động cũng sắp chạy); (2) cân nhắc thêm bước "kiểm tra commit mới nhất
trên `origin/master` có timestamp trong X phút gần đây không" ngay sau bước 1 (chọn tin) — nếu có,
dừng sớm thay vì tốn toàn bộ chi phí ElevenLabs/Lyria/render trước khi mới phát hiện xung đột ở cuối;
(3) `style-rotation-state.json` hiện không có cơ chế khoá (lock) chống đọc-ghi đồng thời — 2 routine
đọc cùng giá trị `last_used_index` trước khi bên nào ghi lại là nguyên nhân gốc.

**[2026-09-01 — mọi domain CDN ảnh bài báo lại bị chặn ở tầng egress proxy, dù mục 3/12 ghi đã fix]**:
lần chạy này (chọn tin giá dầu tăng vọt sau vụ Mỹ tập kích Iran, VnExpress) dừng lại ngay ở bước 1
(chọn tin/viết BRIEF) vì KHÔNG tải được ảnh minh họa thật của bài báo — test trực tiếp bằng `curl`
VÀ bằng `WebFetch` (báo lỗi `EGRESS_BLOCKED`) đều bị chặn ở tầng CONNECT của proxy (403 "policy
denial", không phải lỗi từ origin server) cho TẤT CẢ domain CDN ảnh đã test: `vcdn1-kinhdoanh.vnecdn.net`
(và biến thể `vnecdn.net`, `i1-kinhdoanh.vnecdn.net`), `cdnphoto.dantri.com.vn`,
`cdnweb.dantri.com.vn`, `zadn.vn`, `vnncdn.net`, `photo.znews.vn` (domain ảnh Znews mới phát hiện,
chưa từng thêm) — trong khi domain HTML gốc (`vnexpress.net`, `dantri.com.vn`, `znews.vn`) và toàn
bộ domain API (`api.elevenlabs.io`, `generativelanguage.googleapis.com`, `script.google.com`,
`registry.npmjs.org`, `github.com`, `raw.githubusercontent.com`) đều hoạt động bình thường. Nghĩa
là allowlist domain ảnh đã cấu hình ở mục 3/12 (2026-08-27, `env_01Prtq2F5hNPLxk3EW2maFA8`) KHÔNG
còn hiệu lực ở môi trường chạy routine lần này — có thể do allowlist bị reset, hoặc routine đang
chạy trên một environment khác với environment đã cấu hình trước đó. **Quyết định**: coi đây là
thất bại hạ tầng ở bước 1 (không có ảnh thật = không thể tuân thủ brand system "Article Image
Card"), dừng lại ngay, KHÔNG dùng ảnh stock/giả thay ảnh bài báo thật, KHÔNG dựng lại 1 endpoint
proxy-fetch-ảnh để né allowlist (đã từng bị từ chối đúng ở mục 9, giữ nguyên lập trường đó) — chỉ
ghi lại đây rồi báo người vận hành. **Việc cần làm** (chờ người dùng): (1) xác nhận routine 3
lịch (`trig_01RdHP4oNHzaYm5UMjuZxWzb`/`trig_01HWAjgP7cpWSiprRfpJ68ap`/`trig_01Y4gS5dsfucSEmBv7HQBL49`)
đang chạy trên đúng environment `env_01Prtq2F5hNPLxk3EW2maFA8` hay đã đổi sang environment khác;
(2) vào Custom network allowlist của environment đang dùng thật, thêm lại đầy đủ: `vnecdn.net`,
`cdnphoto.dantri.com.vn`, `cdnweb.dantri.com.vn`, `zadn.vn`, `vnncdn.net`, và domain mới
`photo.znews.vn` (ảnh Znews — trước đây chưa từng cần vì các video Znews trước dùng ảnh nguồn
khác); (3) sau khi xác nhận allowlist đúng, `fire_trigger` thử lại 1 trigger để verify tải ảnh
thành công trước khi tin tưởng lịch tự động tiếp theo.

**[2026-09-01 06:14 UTC — lần chạy kế tiếp trong cùng ngày, VẪN bị chặn y hệt, chưa được khắc phục]**:
routine tự động lần tiếp theo (phiên khác, cùng ngày) test lại TRƯỚC KHI chọn tin/viết BRIEF (đúng
đề xuất "test reachability sớm" ở mục việc-cần-làm bên trên) bằng `curl` trực tiếp tới 7 domain CDN
ảnh đã liệt kê — kết quả **cả 7/7 vẫn bị chặn**, y hệt lần trước (`vnecdn.net`/timeout,
`cdnphoto.dantri.com.vn`/reset, `cdnweb.dantri.com.vn`/403, `zadn.vn`/timeout, `vnncdn.net`/502,
`photo.znews.vn`/403, `i1-kinhdoanh.vnecdn.net`/403) — trong khi domain API/HTML gốc (Apps Script,
GitHub) vẫn hoạt động bình thường (test qua chính lần lấy tin ở bước 1). Xác nhận đây KHÔNG phải sự
cố thoáng qua của 1 lần chạy — việc-cần-làm (1)-(3) ở mục ngay trên vẫn CHƯA được thực hiện. Routine
lần này dừng lại ngay ở bước 1 (trước cả khi chọn tin/gọi POST đánh dấu `used`, để tin vẫn còn nguyên
cho lần chạy sau khi allowlist được sửa), không thử thêm domain mới, không dựng project mới, không
lặp lại toàn bộ nội dung chẩn đoán đã ghi ở mục trên — chỉ xác nhận lại bằng dữ liệu mới nhất.

**[2026-09-01 — lần chạy thứ 3 trong ngày, VẪN bị chặn y hệt, việc-cần-làm (1)-(3) vẫn chưa làm]**:
re-test nhanh 7 domain CDN ảnh đã biết trước khi chọn tin (đúng quy trình đã thiết lập) — kết quả
**vẫn 7/7 bị chặn**, cùng kiểu lỗi (timeout/reset/403/502) như 2 lần trước trong ngày, trong khi
`script.google.com`/`api.elevenlabs.io`/`vnexpress.net`/`github.com` vẫn hoạt động bình thường. Đây
là lần thứ 3 liên tiếp trong cùng ngày 2026-09-01 routine dừng ở đúng bước 1 vì cùng 1 nguyên nhân hạ
tầng chưa được người vận hành xử lý. Dừng lại ngay, không chọn/đánh dấu tin, không dựng project,
không lặp lại chẩn đoán chi tiết (đã đủ ở 2 mục ngay trên). **Việc-cần-làm (1)-(3) ở mục
"2026-09-01" phía trên vẫn là hành động cần người vận hành thực hiện trước khi routine tiếp theo có
thể sản xuất được video** — không có gì mới để bổ sung ngoài việc xác nhận lần 3.

**[2026-09-02 — lần chạy tiếp theo (ngày mới), VẪN bị chặn y hệt, việc-cần-làm (1)-(3) VẪN chưa làm,
4 lần liên tiếp]**: re-test nhanh 7 domain CDN ảnh đã biết trước khi chọn tin — kết quả **vẫn 7/7 bị
chặn** (`vnecdn.net`/timeout, `cdnphoto.dantri.com.vn`/403, `cdnweb.dantri.com.vn`/403 CONNECT,
`zadn.vn`/timeout, `vnncdn.net`/502 CONNECT, `photo.znews.vn`/403 CONNECT, `i1-kinhdoanh.vnecdn.net`/
403 CONNECT), trong khi `script.google.com` (302), `api.elevenlabs.io` (401 — nghĩa là reachable,
chỉ thiếu auth header của lệnh test), `github.com` (400 — reachable) đều hoạt động bình thường. Đây
là lần thứ 4 liên tiếp (3 lần ngày 2026-09-01 + lần này ngày 2026-09-02) routine dừng ở đúng bước 1
vì cùng 1 nguyên nhân hạ tầng chưa được người vận hành xử lý — đã kéo dài hơn 24 giờ không có tiến
triển. Dừng lại ngay, không chọn/đánh dấu tin, không dựng project, không lặp lại chẩn đoán chi tiết
(đã đủ ở các mục ngay trên). Đã gửi push notification cho người vận hành ở lần chạy này (chưa từng
làm ở 3 lần trước, có thể là lý do chưa được xử lý) để nêu rõ việc-cần-làm (1)-(3) ở mục "2026-09-01"
phía trên cần người vận hành trực tiếp vào Custom network allowlist của environment
`env_01Prtq2F5hNPLxk3EW2maFA8` (claude.ai/code → environment settings) thêm lại các domain đã liệt kê.

**[2026-09-02 — lần chạy kế tiếp trong cùng ngày, VẪN bị chặn y hệt, lần thứ 5 liên tiếp]**: re-test
nhanh 7 domain CDN ảnh trước khi chọn tin — kết quả **vẫn 7/7 bị chặn** (`vnecdn.net`/timeout,
`cdnphoto.dantri.com.vn`/403, `cdnweb.dantri.com.vn`/403 CONNECT, `zadn.vn`/timeout,
`vnncdn.net`/502 CONNECT, `photo.znews.vn`/403 CONNECT, `i1-kinhdoanh.vnecdn.net`/403 CONNECT),
trong khi `script.google.com` (302) và `github.com` (400) vẫn reachable bình thường — cùng kiểu lỗi,
không phải sự cố thoáng qua. Dừng lại ngay ở bước 1 như quy trình, không chọn/đánh dấu tin, không
dựng project, không lặp lại chẩn đoán chi tiết. **KHÔNG gửi thêm push notification lần này** — một
notification đã gửi rất gần đây (lần chạy ngay trước, cùng ngày) cho đúng vấn đề chưa thay đổi; gửi
lại ngay lập tức là dư thừa. Việc-cần-làm (1)-(3) ở mục "2026-09-01" phía trên vẫn nguyên giá trị,
chưa có gì mới để bổ sung ngoài xác nhận lần thứ 5.

**[2026-09-03 — CDN ảnh Dân Trí (`cdnphoto.dantri.com.vn`) hoạt động trở lại, chuỗi 5 lần chặn liên
tiếp kết thúc]**: re-test 7 domain CDN ảnh trước khi chọn tin, theo đúng quy trình đã thiết lập —
`cdnphoto.dantri.com.vn` (và `vnecdn.net`, `zadn.vn` — dù 2 domain này vẫn treo/reset ở tầng TLS
handshake khi test path gốc "/", KHÔNG coi là "hoạt động" như `cdnphoto.dantri.com.vn`) đã qua được
tầng CONNECT; xác nhận `cdnphoto.dantri.com.vn` tải được ảnh bài báo thật đầy đủ (HTTP 200, JPEG
1200×630, ~150KB). `cdnweb.dantri.com.vn`, `vnncdn.net`, `photo.znews.vn`, `i1-kinhdoanh.vnecdn.net`
vẫn bị chặn (403/502) — KHÔNG phải toàn bộ allowlist đã được khôi phục, chỉ riêng domain ảnh chính
của Dân Trí. Không rõ nguyên nhân chuyển biến (operator có thể đã sửa allowlist của đúng environment
đang chạy — xem việc-cần-làm (1)-(3) ở mục "2026-09-01" — hoặc allowlist tự đồng bộ lại), routine
không có cách xác minh phía ngoài. Đã chọn tin Dân Trí (đúng domain ảnh đang hoạt động), dựng xong
video `tphcm-4900-ty-du-lich-quoc-khanh` (style 4 — Split Comparison), render + verify đầy đủ 4
bước, đăng thành công cả 5 kênh (Facebook Reel + Story, YouTube, Instagram, Threads) — lần đầu tiên
routine tự động chạy trọn vẹn từ đầu đến cuối kể từ khi phát hiện lỗ hổng CDN ảnh ngày 2026-09-01.
**Việc nên làm cho lần chạy sau**: vẫn re-test nhanh domain ảnh trước khi chọn tin (đừng giả định
allowlist ổn định lâu dài dựa trên 1 lần thành công) — nếu vẫn chỉ `cdnphoto.dantri.com.vn` hoạt
động, ưu tiên chọn tin nguồn Dân Trí; nếu domain khác cũng phục hồi, điều đó xác nhận allowlist đã
được khôi phục đầy đủ.

**[2026-09-03 — sự cố 2 routine chạy song song lần thứ hai, trùng style slot]**: y hệt cơ chế đã
ghi ở mục "2026-08-30" phía trên — hai phiên chạy gần như đồng thời (trong khung giờ 06h-08h UTC
3/9/2026) đều đọc `style-rotation-state.json` lúc `last_used_index: 3` trước khi bên nào commit,
nên cả hai đều tính ra cùng style tiếp theo (index 4, **5-map-and-geo**). Lần này 2 tin được CHỌN
KHÁC NHAU (không trùng công ty như lần trước): phiên chạy xong trước dựng
`xuat-nhap-khau-ky-luc-770-ty-usd` (xuất nhập khẩu Việt Nam lập kỷ lục 770 tỷ USD), commit
`2b25233` (06:38 UTC) rồi `ccc0d58` (06:39 UTC, thêm caption), push thành công lên `master`, đăng
đủ cả 5 kênh. Phiên chạy sau dựng `gia-vang-mat-100-usd-sjc-giam-3-trieu` (giá vàng thế giới mất
hơn 100 USD, vàng miếng SJC giảm tiếp), hoàn tất render + verify đầy đủ 4 bước, nhưng khi `git push`
lên `master` thì bị từ chối (remote đã có `ccc0d58`) — đúng lúc đó mới phát hiện xung đột style
(cả hai đều Map & Geo, dù nội dung tin không trùng). Quyết định (đúng tiền lệ mục "2026-08-30"):
KHÔNG force-push/merge vào `master`, tạo nhánh `wip/gia-vang-mat-100-usd-sjc-giam-3-trieu` từ commit
đã có sẵn (đã push lên GitHub), reset `master` cục bộ về khớp `origin/master`, coi bước 11
(commit+push) là "thất bại" theo đúng tinh thần mục 17 của quy trình sản xuất — KHÔNG thực hiện
bước 12-16 (không viết caption chính thức dùng để đăng, không đăng mạng xã hội) dù đã có
`CAPTION.md` soạn sẵn trong nhánh wip, để tránh kênh phát 2 video cùng "cách dựng" Map & Geo trong
cùng buổi (dù khác chủ đề, trùng ẩn dụ hình ảnh liên tiếp vẫn làm giảm cảm giác "mỗi video một
kiểu" mà cơ chế xoay vòng hướng tới). **Việc-cần-làm (1)-(3) ở mục "2026-08-30" phía trên (không
chạy 2 lần cùng khung giờ, kiểm tra commit mới trên `origin/master` trước khi tốn chi phí sản xuất,
thêm cơ chế khoá cho `style-rotation-state.json`) VẪN CHƯA được triển khai — đây là lần thứ hai sự
cố cùng nguyên nhân gốc tái diễn, mức độ ưu tiên xử lý nên tăng lên.** Nhánh wip có thể tái sử dụng
cho lần chạy kế tiếp (dựng lại từ index đúng của vòng xoay, ví dụ index 5 — Ring Progress) nếu người
vận hành muốn giữ lại tin giá vàng này, hoặc bỏ qua vì tin đã hơi cũ theo giờ chạy tiếp theo.

**[2026-09-04 — CDN ảnh lại bị chặn ở tầng egress proxy, TÁI PHÁT sau khi đã hoạt động ở
2026-09-03]**: re-test 7 domain CDN ảnh trước khi chọn tin, theo đúng quy trình — kết quả **7/7 bị
chặn ở tầng CONNECT/TLS** (`vnecdn.net`/timeout, `cdnphoto.dantri.com.vn`/403 origin hoặc "Recv
failure: Connection reset by peer" xen kẽ giữa các lần thử — kể cả domain vừa xác nhận hoạt động
hôm 2026-09-03, `cdnweb.dantri.com.vn`/403 CONNECT, `zadn.vn`/timeout, `vnncdn.net`/502 CONNECT,
`photo.znews.vn`/403 CONNECT, `i1-kinhdoanh.vnecdn.net`/403 CONNECT — xác nhận qua log proxy nội bộ
(`recentRelayFailures`, toàn bộ ghi "policy denial or upstream failure" hoặc tunnel bị đóng giữa
chừng), trong khi `script.google.com`/`api.elevenlabs.io`/`github.com` vẫn reachable bình thường.
Xác nhận `git log` không có commit nào mới trong ~9 giờ gần nhất trước khi test (loại trừ khả năng
xung đột 2 routine chạy song song). Dừng lại ngay ở bước 1 như quy trình — không chọn/đánh dấu tin,
không dựng project. Đây là lần tái phát MỚI sau khi vấn đề đã tự hết ở 2026-09-03 (không phải tiếp
diễn chuỗi 5 lần cũ), nên đã gửi push notification cho người vận hành ở lần chạy này (khác quy tắc
"không gửi lặp lại" áp dụng cho cùng 1 chuỗi chưa đổi trạng thái). Việc-cần-làm (1)-(3) ở mục
"2026-09-01" phía trên (xác nhận đúng environment, khôi phục allowlist domain ảnh, verify lại bằng
`fire_trigger`) vẫn là hướng xử lý đúng — allowlist tiếp tục cho thấy dấu hiệu KHÔNG bền vững qua các
lần chạy (khi thì hoạt động, khi thì chặn lại hoàn toàn), gợi ý nguyên nhân gốc chưa được khắc phục
dứt điểm ở tầng cấu hình.

**[2026-09-04 — XỬ LÝ DỨT ĐIỂM: chuyển việc lấy ảnh sang Apps Script, bỏ hẳn phụ thuộc CDN]**:
điều tra kỹ (kiểm tra RSS thật của 4 báo) cho thấy 2 nguyên nhân chồng nhau: (a) host ảnh THẬT
trong RSS là subdomain khác hẳn cái đã thêm vào allowlist — Dân Trí dùng `icdn.dantri.com.vn`
(không phải `cdnphoto`/`cdnweb`), VnExpress dùng `i1-kinhdoanh.vnecdn.net` (không phải apex
`vnecdn.net`), Tuổi Trẻ `cdn2.tuoitre.vn`, Znews `photo.znews.vn` → allowlist "khớp" hay "trượt"
tuỳ bài báo, tạo ra vẻ chập chờn; (b) một số CDN báo VN tự chặn IP datacenter nước ngoài. Thay vì
đuổi theo allowlist mãi, **routine không còn tự tải ảnh CDN nữa** — `Code.gs` giờ: (1) parse
`imageUrl` từ RSS ngay lúc `fetchAndStore`, lưu vào cột `imageUrl` của `news_queue`; (2) route mới
`GET <exec>?image=<news_id>` tải ảnh đó từ phía Google (IP không bị chặn), cache vào Drive, trả về
base64 JSON; (3) `?image=` KHÔNG phải proxy fetch URL tuỳ ý — tham số là id nội bộ 12 ký tự phải
có sẵn trong `news_queue`, URL fetch là cái script tự parse từ RSS cứng của nó, không phải cái
caller đưa vào. Routine chỉ còn cần với tới `script.google.com` (như đăng bài đã làm từ lâu). Cùng
đợt: sự cố "2 routine trùng style slot" (2026-08-30 + 2026-09-03) cũng đã xử lý — chỉ số style giờ
cấp qua `POST {"action":"claim_style"}` dưới LockService, `style-rotation-state.json` chỉ còn là
bản sao. Deploy: Apps Script bản 33, cùng exec URL. **Allowlist domain ảnh CDN giờ không còn ý
nghĩa — có thể xoá.**

---

*File này + `BRAND-SYSTEM-BOT-BAN-HANG.md` + `CONSTRUCTION-STYLES-BOT-BAN-HANG.md` là ba tài liệu
tham chiếu bắt buộc đọc trước khi dựng bất kỳ video nào cho kênh BOT BÁN HÀNG · KINH DOANH. Cập
nhật cả ba file này mỗi khi phát sinh bài học/quy tắc mới — không để kiến thức chỉ tồn tại trong
lịch sử hội thoại.*
