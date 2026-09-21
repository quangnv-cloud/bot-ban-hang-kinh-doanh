# CHUẨN SẢN XUẤT VIDEO QUỐC TẾ — HyperFrames Motion-Graphics News

**Dùng chung cho mọi kênh** (BOT BÁN HÀNG · KINH DOANH / Kinh Tế Số, Công Nghệ Số, Tin Tức Số,
Retify khi có repo). Tài liệu này gộp lại toàn bộ thông số kỹ thuật, quy trình, kỹ thuật hình ảnh
và checklist đã được kiểm chứng thực tế trên video mẫu `mau-tin-tuc-so-nang-cap` (dự án
"SCIC đấu giá Seaprodex", phiên 2026-09-15/16) — video đầu tiên được audit đầy đủ theo chuẩn quốc
tế và nâng từ 79/100 lên 90/100 rồi lên kế hoạch chạm 95/100.

**Dùng để làm gì:**
- **Đào tạo nhân sự** — người mới đọc file này là hiểu được toàn bộ chuẩn chất lượng của hệ thống,
  không cần dò từng doc rời rạc.
- **Claude/AI agent khác học theo** — mọi quy tắc đều viết dưới dạng có thể áp dụng trực tiếp (số
  đo cụ thể, code mẫu, lệnh terminal), không phải mô tả cảm tính.
- **Vẫn giữ nguyên** các doc riêng từng kênh: `BRAND-SYSTEM.md` (màu, giọng đọc, cấu trúc act cụ
  thể của từng kênh), `CONSTRUCTION-STYLES.md` (10 bố cục xoay vòng), `automation/policy/
  COMPLIANCE-GATE.md` (chính sách nền tảng chi tiết theo từng kênh). File này KHÔNG thay thế các
  doc đó — nó là lớp chuẩn kỹ thuật + quy trình + QC nằm TRÊN chúng, dùng chung.

**Nguyên tắc cốt lõi** (trích nguyên văn từ chuẩn quốc tế dùng để audit):
> **Edit for attention, not for showing editing skills.** Mọi hiệu ứng phải phục vụ nội dung, nhịp
> điệu và cảm xúc — không dùng hiệu ứng chỉ để video "nhiều đồ". Người xem không nên chú ý đến kỹ
> thuật dựng; họ nên chú ý đến câu chuyện, thông điệp và cảm xúc video tạo ra.

---

## Mục lục

1. [Thông số kỹ thuật xuất bản](#1-thông-số-kỹ-thuật-xuất-bản) — cố định, mọi video mọi kênh
2. [Quy trình sản xuất từng bước](#2-quy-trình-sản-xuất-từng-bước)
3. [Kỹ thuật hình ảnh nâng cao](#3-kỹ-thuật-hình-ảnh-nâng-cao) — kèm code mẫu
4. [Cổng kiểm duyệt chính sách (Compliance Gate)](#4-cổng-kiểm-duyệt-chính-sách-compliance-gate)
5. [Checklist QC cuối cùng](#5-checklist-qc-cuối-cùng) — đo được, không chỉ cảm tính
6. [Rubric chấm điểm 100 điểm quốc tế](#6-rubric-chấm-điểm-100-điểm-quốc-tế)
7. [Lỗi thường gặp & cách khắc phục](#7-lỗi-thường-gặp--cách-khắc-phục)
8. [Case study: hành trình 79 → 90 → 95/100](#8-case-study-hành-trình-79--90--95100)

---

## 1. Thông số kỹ thuật xuất bản

Một tỉ lệ khung hình + một mức chất lượng duy nhất cho toàn hệ thống — không tối ưu riêng theo nền
tảng, vì FB Reels/TikTok/YouTube Shorts đều chuẩn hoá về cùng 9:16.

| Thông số | Giá trị | Vì sao |
|---|---|---|
| Tỉ lệ khung hình | 9:16 dọc | Chuẩn chung mọi nền tảng short-form |
| Độ phân giải | **1080×1920** cố định | `data-width`/`data-height` trên `#root`; không hạ xuống 720×1280 |
| Frame rate | 30fps | |
| Video codec/bitrate | H.264, **10 Mbps** | Xem lệnh render bên dưới — mặc định của hyperframes thấp hơn nhiều, phải truyền flag rõ ràng |
| Audio codec | AAC 192kbps | |
| Loudness | **-14 LUFS integrated**, True Peak ≤ **-1.0 dBTP** | Đúng chuẩn normalize của FB/TikTok/YouTube |
| Safe zone đáy | tránh ~11-17% từ đáy khung | Thanh mô tả + nút tương tác nền tảng đè lên |
| Safe zone phải | tránh ~150-200px cạnh phải | Cột icon like/comment/share/follow |

**Lệnh render bắt buộc** — KHÔNG bao giờ chạy `npm run render` trơn:

```bash
npx hyperframes preview --stop
npx --yes hyperframes@<pinned-version> render --quality high --video-bitrate 10M --browser-timeout 60
```

`--browser-timeout 60` cần thiết khi composition có color-grading/media-treatment — shader compile
cold-start có thể vượt timeout mặc định 10s của lệnh `check` (đây là giới hạn riêng của `check`,
không phải lỗi thật; `render` với timeout cao hơn luôn là bước xác nhận cuối cùng đáng tin).

**Bản phái sinh** (không bắt buộc, chỉ khi cần đăng chéo định dạng ngang/vuông) — tái khung từ
chính bản 1080×1920 gốc bằng kỹ thuật nền blur, KHÔNG dựng composition riêng cho từng tỉ lệ:

```bash
ffmpeg -i <goc.mp4> -filter_complex \
  "[0:v]split=2[bg][fg];[bg]scale=W:H:force_original_aspect_ratio=increase,crop=W:H,gblur=sigma=20[bgb]; \
   [fg]scale=W:H:force_original_aspect_ratio=decrease[fgs];[bgb][fgs]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 192k <ra.mp4>
```
(1:1 → W=H=1080; 16:9 → W=1920, H=1080)

---

## 2. Quy trình sản xuất từng bước

1. **Chọn tin** — qua GATE A (xem mục 4) trước khi tốn công dựng.
2. **Viết `BRIEF.md` + `SCRIPT.md`** — số liệu/mốc thời gian/tên riêng phải truy được về nguồn gốc.
   `SCRIPT.md` viết đúng như đọc thành tiếng (không viết tắt — TTS đọc verbatim, "Tp.HCM" sẽ bị đọc
   sai thành lỗi âm tiết).
3. **Sinh giọng đọc** — ElevenLabs, model `eleven_v3`, mỗi dòng script 1 file mp3 riêng
   (`line1.mp3`, `line2.mp3`...). `data-duration` mỗi frame = độ dài voice thật + đệm ~0.3-0.5s,
   KHÔNG copy khung giờ từ video trước rồi kiểm tra "vừa trong khung" (để lại khoảng lặng chết).
4. **Sinh caption karaoke** — ElevenLabs STT lấy timestamp từng từ, xem mục 3.3.
5. **Dựng composition** — chọn 1 trong các "construction style" xoay vòng (xem
   `CONSTRUCTION-STYLES.md`), áp toàn bộ kỹ thuật ở mục 3, đảm bảo cân bằng dọc (mục 5).
6. **BGM + SFX** — Lyria sinh nhạc nền instrumental (KHÔNG bao giờ có vocal — luôn kèm
   `--negative-prompt` loại vocal khi gọi `lyria-recipe.py`), carve ducking dưới voiceover
   (`carve.mjs`, strength mặc định 0.25-0.3), SFX đồng bộ các nhịp hình ảnh chính (bar chart mọc,
   card reveal, smash-cut).
7. **Lint & QA** — `npx hyperframes check` — fix hết error trước khi render (warning xem theo
   từng trường hợp).
8. **GATE B** — kiểm duyệt nội dung trước render (xem mục 4).
9. **Render** — đúng lệnh ở mục 1, không phải `npm run render` trơn.
10. **Verify file render thật** — xem mục 5, bắt buộc đủ các bước, không chỉ tin thumbnail/lint.
11. **GATE C** — kiểm tra cuối trước khi đăng (xem mục 4), ghi `COMPLIANCE.md`.
12. **Giao/đăng** — kèm `CAPTION.md` (caption đăng mạng xã hội — khác với on-screen caption trên
    hình, xem mục 3.3) cho từng nền tảng.

---

## 3. Kỹ thuật hình ảnh nâng cao

**Bối cảnh**: các kỹ thuật dưới đây được phát triển và kiểm chứng trên video mẫu đạt ~95/100, sau
đó chuẩn hoá thành quy tắc bắt buộc cho mọi video (2026-09-16) vì trước đó video routine hàng ngày
vẫn dựng "phong cách cũ" (nền phẳng, không glow, không caption trên hình, trống đen nửa dưới khung)
— xác nhận bằng cách trích frame thật từ các video mới nhất của 2 kênh và so sánh.

### 3.1. Nền có chiều sâu (depth background)

Mount 1 lần ở root `index.html`, phía sau mọi scene. Không phải "particle explosion" (vẫn cấm) —
là 2-3 blob mờ trôi rất chậm + hạt sao tĩnh nhấp nháy nhẹ, tạo cảm giác không gian thay vì nền
phẳng chết:

```html
<div id="bg-depth" style="position:absolute;inset:0;overflow:hidden;z-index:0;">
  <div class="blob" style="position:absolute;width:640px;height:640px;border-radius:50%;
    background:radial-gradient(circle, rgba(BRAND_R,BRAND_G,BRAND_B,0.20), transparent 70%);
    filter:blur(60px); top:-120px; left:-160px;"></div>
  <div class="blob" style="position:absolute;width:560px;height:560px;border-radius:50%;
    background:radial-gradient(circle, rgba(BRAND_R,BRAND_G,BRAND_B,0.14), transparent 70%);
    filter:blur(60px); top:900px; right:-200px;"></div>
  <div class="blob" style="position:absolute;width:520px;height:520px;border-radius:50%;
    background:radial-gradient(circle, rgba(BRAND_R,BRAND_G,BRAND_B,0.12), transparent 70%);
    filter:blur(60px); bottom:-180px; left:200px;"></div>
  <svg id="bg-stars" viewBox="0 0 1080 1920" style="position:absolute;inset:0;width:100%;height:100%;">
    <!-- 35-45 <circle r="1.5..3" fill="#fff" opacity="0.15..0.4">, toạ độ sinh bằng PRNG seed
         cố định bên dưới — KHÔNG dùng Math.random()/Date.now() (vi phạm deterministic render) -->
  </svg>
</div>
```

```js
function mulberry32(seed) { // đổi seed mỗi video để bố cục hạt khác nhau
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
var rand = mulberry32(20260916); // rand() sinh cx/cy 35-45 particle trong 0..1080 / 0..1920

// repeat:-1 CHỈ an toàn ở index.html gốc (có data-duration riêng), KHÔNG trong sub-composition
// thiếu data-duration (gây lỗi lint gsap_infinite_repeat).
tl.to(".blob", { x: "+=40", y: "-=30", duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 3 }, 0);
tl.to("#bg-stars circle", { opacity: "+=0.25", duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: { each: 0.15, from: "random" } }, 0);
```

### 3.2. Glow accent bằng chính màu brand

Khung ảnh/card chính mỗi act có glow nhẹ bằng màu brand cố định — **không đổi hue theo từng cảnh**:

```css
.evidence-card, .article-image-wrap {
  box-shadow: 0 0 40px rgba(BRAND_R, BRAND_G, BRAND_B, 0.14);
}
```

### 3.3. Caption karaoke đồng bộ giọng đọc

Khác với `CAPTION.md` (caption đăng kèm bài Facebook/YouTube — chỉ là văn bản), đây là **phụ đề
hiện TRÊN HÌNH**, đổi màu theo từng từ đúng lúc giọng đọc phát ra — kỹ thuật này hoàn toàn MỚI, cả
3 kênh chưa từng có trước 2026-09-16:

1. Sau khi có voice từng dòng, gọi ElevenLabs STT lấy timestamp từng TỪ: `POST
   https://api.elevenlabs.io/v1/speech-to-text` với `model_id=scribe_v1`,
   `timestamps_granularity=word`, file = từng `lineN.mp3`.
2. Cộng `data-start` của dòng đó vào timestamp cục bộ → timestamp TUYỆT ĐỐI theo composition.
3. Gom từ thành chunk 3-6 từ (đủ ngắn vừa 1 dòng ở độ rộng safe-zone), mỗi chunk là 1 `.cap-chunk`,
   hiện từ lúc từ đầu chunk bắt đầu tới khi từ cuối kết thúc + ~0.3s đệm.
4. Mỗi từ là 1 `<span class="w">`, mặc định trắng/mờ, tween sang màu brand ĐÚNG lúc từ đó được đọc
   (`duration` ~0.08-0.12s, ease đơn giản — không phức tạp).
5. Vị trí: trong safe-zone (mục 1) — tránh ~11-17% đáy khung.
6. Không giọng đọc ở đoạn nào = không caption đoạn đó, không tự chế phụ đề cho khoảng câm.
7. **Bẫy kỹ thuật đã gặp**: `clip-path: inset(0 X% 0 0)` trên phần tử `display: inline` chỉ hoạt
   động đúng nếu chữ nằm gọn TRÊN MỘT DÒNG — nếu câu dài tự xuống dòng 2, animation "mở khoá" chỉ
   chạy đúng dòng 1 rồi dừng hẳn, dòng 2 không bao giờ hiện. Viết chunk đủ ngắn để chắc chắn 1 dòng.

### 3.4. Smash-cut nội bộ cho act dài (>10s)

Chỉ dùng khi act thật sự có một điểm chuyển nội dung rõ ràng (vd. từ ảnh bằng chứng sang dữ liệu
số) — **không chèn tùy tiện chỉ để tăng nhịp** (đây chính là điều checklist quốc tế cấm ở mục
"không cắt nhanh chỉ để tạo cảm giác năng lượng"):

```css
.cutflash { position: absolute; inset: 0; z-index: 6; pointer-events: none; opacity: 0;
  background: linear-gradient(180deg, rgba(BRAND_R,BRAND_G,BRAND_B,0.4), rgba(BRAND_R,BRAND_G,BRAND_B,0.18)); }
```
```js
tl.fromTo("#cutflash", { opacity: 0 }, { opacity: 0.55, duration: 0.05, ease: "none" }, T);
tl.to("#cutflash", { opacity: 0, duration: 0.16, ease: "power1.in" }, T + 0.05);
tl.fromTo("#content", { scale: 1 }, { scale: 0.986, duration: 0.06, ease: "power1.out" }, T);
tl.to("#content", { scale: 1, duration: 0.14, ease: "power2.out" }, T + 0.061);
```
Kèm 1 SFX click riêng (không lẫn với các tick nhỏ khác) đúng thời điểm `T`. Lưu ý kỹ thuật: 2 tween
scale liền kề chạm đúng 1 mốc thời gian sẽ bị lint cảnh báo `overlapping_gsap_tweens` — lệch nhẹ
~0.001s giữa điểm kết thúc tween 1 và điểm bắt đầu tween 2 để tránh.

### 3.5. Bằng chứng thật đa dạng

Nếu tin có nhiều loại bằng chứng khả dụng (ảnh hiện trường, văn bản/báo cáo tài chính, biểu đồ
giá...), tìm và dùng ĐA DẠNG loại qua các act khác nhau thay vì lặp lại 1 ảnh. Tìm qua nhiều nguồn
tin độc lập nếu 1 nguồn không đủ ảnh. Ảnh lấy từ các nguồn khác nhau cần **color-match** trước khi
dùng cạnh nhau (xem mục 7 — đây từng là điểm trừ lớn nhất ở lần audit đầu: 3 ảnh lệch tông màu).

### 3.6. Biểu đồ tỉ lệ động thay thẻ số tĩnh

Khi có ≥2 số liệu cùng loại cần so sánh (vd. giá đấu giá vs. giá sổ sách), ưu tiên bar chart tỉ lệ
thật thay vì 2 thẻ số đặt cạnh nhau:

```css
.bar-tall { height: 440px; transform-origin: bottom; }
.bar-short { height: 150px; transform-origin: bottom; }
```
```js
tl.fromTo(".bar-tall", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out" }, 0.6);
tl.fromTo(".bar-short", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out" }, 5.1);
```
Chiều cao tỉ lệ ĐÚNG theo số liệu thật (không ước lượng bằng mắt), sequence theo đúng thứ tự giọng
đọc nhắc tới từng số.

### 3.7. Comparison badge cho Hook

Khi có 1 dữ kiện so sánh đã xác minh bổ sung cho con số chính của Hook (vd. "cao hơn 45% so với
thị giá"), thêm 1 badge nhỏ (icon mũi tên + text) pop-in ngay sau con số chính — xếp chồng 2 tín
hiệu "nghịch lý"/"strong statement" trong 3 giây đầu, đúng tinh thần Hook mạnh của chuẩn quốc tế,
miễn là cả 2 đều là dữ kiện thật đã xác minh (không suy đoán, không giật tít):

```js
tl.fromTo("#hk-compare", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, ease: "back.out(1.9)" }, 2.68);
```

---

## 4. Cổng kiểm duyệt chính sách (Compliance Gate)

Chi tiết đầy đủ theo từng kênh ở `automation/policy/COMPLIANCE-GATE.md` (mỗi kênh có ngưỡng riêng
tuỳ nguồn tin — vd. Tin Tức Số bám Google Trends nên GATE A siết chặt hơn để loại drama/tin đồn).
Cấu trúc chung mọi kênh:

- **GATE A** — sàng lọc lúc CHỌN CHỦ ĐỀ, trước khi tốn công dựng. RED/BLACK → không bao giờ dựng.
  ORANGE → bỏ chủ đề, tìm chủ đề khác. Không có chủ đề an toàn → **bỏ suất, không hạ chuẩn để lấp**.
- **GATE B** — kiểm duyệt NỘI DUNG sau khi có SCRIPT/CAPTION/ảnh, trước render. Kiểm: sự thật &
  nguồn (mọi số liệu truy được về bài gốc), an toàn cộng đồng, chính hãng & liêm chính (không giả
  danh, không testimonial giả), quy tắc AI/synthetic media (KHÔNG tái dựng cảnh/người thật như ảnh
  chụp — chỉ dùng ảnh thật có nguồn hoặc minh hoạ ý niệm rõ ràng là đồ hoạ), bản quyền, tiêu đề/
  thumbnail không giật gân quá bằng chứng, và **nguyên bản** (mỗi video phải có góc nhìn/cách trình
  bày riêng, không chỉ đọc lại tiêu đề báo — đây là rủi ro cao nhất với kênh tự động).
- **GATE C** — kiểm tra CUỐI sau render + thumbnail, trước khi đăng. Ghi kết quả vào
  `videos/<slug>/COMPLIANCE.md`. `decision != APPROVE` hoặc `risk_level` ORANGE/RED/BLACK →
  **DỪNG, không đăng**.

---

## 5. Checklist QC cuối cùng

Bắt buộc thực hiện tất cả, không bỏ qua bước nào — thumbnail Studio đáng tin nhưng vẫn là preview,
chỉ file render thật mới là sản phẩm giao cho người dùng.

```bash
# 1) Thời lượng đúng như thiết kế
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 <file.mp4>

# 2) Không có khoảng lặng chết giữa video
ffmpeg -i <file.mp4> -af silencedetect=noise=-40dB:d=0.6 -f null -
# chỉ nên thấy silence_start gần cuối (fade-out BGM), không có ở giữa video

# 3) Loudness đúng chuẩn — target -14 LUFS integrated, True Peak ≤ -1.0 dBTP
ffmpeg -i <file.mp4> -af loudnorm=print_format=summary -f null -
# "Input Integrated" lệch quá ±1 LU so với -14.0 → chạy loudnorm 2-pass trước khi giao file

# 4) Trích frame tại các mốc quan trọng, xem bằng mắt — MỌI hiệu ứng chớp nhanh (<0.2s, vd
#    smash-cut) cần soát bằng chuỗi frame liên tiếp (fps=30 qua vài trăm ms quanh mốc), không
#    chỉ 1 ảnh đơn, và MỌI act giữa cần trích frame ở CUỐI animation-reveal (không chỉ đầu act)
ffmpeg -y -ss <t> -i <file.mp4> -frames:v 1 -q:v 2 out.png

# 5) Transcript bằng Whisper/Gemini trên audio đã mix — so với script gốc
ffmpeg -y -i <file.mp4> -vn -ac 1 -ar 16000 audio.wav
python -m whisper audio.wav --model base --language Vietnamese --output_format txt
```

**Cân bằng dọc — GATE đo được, không chỉ hướng dẫn**: ở bước 4, với MỖI act giữa, xác nhận phần tử
cuối cùng (card/số liệu/badge) kết thúc trong khoảng `top: 1400-1680px` của khung 1920px — nếu dừng
sớm hơn ~1000px, PHẢI thêm phần tử bổ sung (badge, biểu đồ mini, thẻ dẫn chứng thứ 2) trước khi coi
là xong. Quy tắc này đã tồn tại dưới dạng hướng dẫn từ lâu nhưng vẫn tái diễn ở video vì không có
bước verify bắt buộc — từ giờ là 1 bước checklist thật, không phải "tự hỏi mình lúc soát Studio".

**Checklist tổng hợp một dòng** (dùng để soát nhanh trước khi giao):

Brand (đúng màu, logo cố định, không quá lớn) · Cân bằng dọc (đã verify bằng frame thật) · Text
(headline dễ đọc, keyword highlight đúng màu, không nhồi chữ) · Motion (sinh động không lấn text,
không effect thừa) · Image (ảnh thật trong card, đã color-match, không che nội dung) · Caption
karaoke (đồng bộ giọng đọc, trong safe-zone) · Audio (Voice > SFX > Music, không clipping, loudness
đúng chuẩn) · Editorial (không bịa số liệu/nguồn, act cuối là sự thật) · Xuất bản (1080×1920/30fps,
`--quality high --video-bitrate 10M`, safe-zone không bị lấn) · Compliance (GATE A/B/C đã PASS,
`COMPLIANCE.md` đã ghi).

---

## 6. Rubric chấm điểm 100 điểm quốc tế

Dùng khi cần đánh giá khách quan 1 video (không chỉ đạt/không đạt) — vd. trước khi quyết định đầu
tư thêm công sức nâng cấp, hoặc để so sánh giữa các phong cách dựng. Rubric gốc dành cho video quay
dựng thật (talking-head/B-roll) — với video motion-graphics/data-explainer của hệ thống này, đối
chiếu theo tinh thần tương đương (vd. "B-roll" = ảnh/tài liệu/chart bằng chứng, không có "eye-line"
hay "skin tone" theo nghĩa đen).

| Hạng mục | Điểm tối đa | Ý nghĩa khi chấm cho motion-graphics news |
|---|---:|---|
| Story & Hook | 20 | Logic rõ, không đoạn thừa; Hook có ít nhất 1 yếu tố Curiosity/Contradiction/Strong-statement (không phải câu sự kiện trung tính thuần) |
| Editing & Pacing | 15 | Không khoảng chết giữa act; nhịp cắt/chuyển act hợp lý với thời lượng thật |
| Composition | 10 | Mỗi frame 1 focal point, alignment nhất quán, cân bằng dọc lấp đầy khung |
| B-roll / Visual (= bằng chứng thật) | 10 | Ảnh/tài liệu/chart thật ở đa số act, đã color-match, không lặp lại 1 ảnh |
| Motion Graphics | 10 | Easing đa dạng (không chỉ `back.out()` lặp lại mọi nơi — chuẩn quốc tế: "80% motion tinh tế, 20% điểm nhấn mạnh") |
| Subtitle / Typography | 10 | Caption karaoke đồng bộ thật, contrast đạt WCAG AA, không đè safe-zone |
| Sound Design | 10 | Voice rõ không clipping, SFX hỗ trợ đúng lúc không lạm dụng, mix ưu tiên Voice>SFX>Music |
| Music | 5 | Phù hợp mood/brand, có progression theo câu chuyện, không lấn voice |
| Color | 5 | Ảnh thật đã correction/grade đồng bộ, đồ hoạ nhất quán màu brand |
| Branding | 5 | Logo/màu/font/motion/transition nhất quán xuyên suốt |
| **TỔNG** | **100** | |

**Xếp loại**: 90-100 = International/Premium · 80-89 = Professional · 70-79 = Good/Commercial ·
60-69 = Needs Improvement · <60 = Not Ready.

**Cách dùng khi review** (theo đúng cấu trúc đã áp dụng thật, xem mục 8):
A. Tổng quan (mức hiện tại + 3 điểm mạnh + 3 điểm yếu) → B-F. Chấm từng nhóm (Story/Visual/Audio/
Color/Technical) → G. Bảng điểm 100 → H. Action Plan chia **Must Fix / Should Fix / Nice to Have**,
mỗi mục viết rõ `VẤN ĐỀ → NGUYÊN NHÂN → CÁCH SỬA → MỨC ĐỘ ƯU TIÊN`. Không chỉ nói "video chưa
chuyên nghiệp" chung chung.

---

## 7. Lỗi thường gặp & cách khắc phục

Đúc kết từ nhiều lần dựng — tránh tái phát:

- **Trống đen nửa dưới khung** (lỗi tái diễn nhiều lần nhất) — xem mục 5 "Cân bằng dọc".
- **`width` cố định (px) cho container chứa số/chữ auto-fit** — vỡ layout khi nội dung video sau
  dài hơn video trước (vd. counter 2 chữ số "93" → 3 chữ số "100"). Luôn để container auto-width,
  hoặc nếu số + đơn vị cùng dòng, tách thành 2 phần tử riêng thay vì gộp 1 chuỗi auto-fit.
- **`#root[data-composition-id="..."]` cho style gốc** — chỉ dùng `#root` trơn; selector kèm
  attribute không khớp ổn định khi nhiều sub-composition mount lồng nhau, khiến font rơi về mặc
  định trình duyệt (lỗi im lặng, không lên lint, chỉ thấy qua ảnh render thật).
- **`fromTo` với giá trị `from` đã ở trạng thái nhìn thấy được** (vd. `{opacity: 0.9}` thay vì
  `{opacity: 0}`) — phần tử lộ tĩnh suốt từ đầu clip tới lúc animation thật chạy. Luôn tách tween để
  giá trị `from` là trạng thái ẩn thật (opacity 0/scale 0).
- **`repeat: -1` trong sub-composition không có `data-duration` riêng** — lỗi lint
  `gsap_infinite_repeat`. Chỉ dùng `repeat:-1` ở `index.html` gốc (có `data-duration` bao toàn bộ
  video); trong sub-composition dùng `repeat` hữu hạn lớn (vd. `repeat: 3`).
- **Media-treatment "wheels" (color wheel) gây treo render** trong một số môi trường — dùng
  "adjust" (exposure/contrast/whites/blacks/temperature/tint) thay thế, hoạt động ổn định.
- **`check` báo `Navigation timeout of 10000ms exceeded`** trên composition có color-grading nặng —
  đây là giới hạn cứng của lệnh `check` (10s, không cấu hình được), không phải lỗi thật. Xác nhận
  bằng `render --browser-timeout 60` thành công là đủ, không chặn tiến độ vì cảnh báo này.
- **`gsap.timeline` không được gán vào `window.__timelines[id]`** — lỗi `gsap_timeline_not_registered`.
  Luôn kết thúc script bằng dòng gán này.
- **Voice re-record dài hơn ngân sách act** — `voice_settings.speed` của ElevenLabs `eleven_v3`
  KHÔNG đáng tin để rút ngắn thời lượng (đã kiểm chứng: giá trị 1.07 và 1.3 cho kết quả gần như
  giống nhau hoặc dài hơn). Nếu chênh lệch nhỏ (dưới ~0.3s buffer), chấp nhận buffer mỏng hơn thay
  vì retime lại cả chuỗi act phía sau.
- **Không viết tắt trong `SCRIPT.md`** — ElevenLabs đọc verbatim, "Tp.HCM" bị đọc sai. Viết đầy đủ
  ("Thành phố Hồ Chí Minh"); `BRIEF.md` và text hiển thị trên hình vẫn có thể viết tắt.

---

## 8. Case study: hành trình 79 → 90 → 95/100

Video "SCIC đấu giá 63,38% cổ phần Seaprodex" (`mau-tin-tuc-so-nang-cap`) là video đầu tiên được
audit đầy đủ theo chuẩn quốc tế ở mục 6. Lịch sử điểm số thật (không làm tròn/thổi phồng):

### Vòng 1 — audit ban đầu: 79/100 (Good/Commercial, sát ngưỡng Professional)

| Hạng mục | Điểm | Vì sao |
|---|---:|---|
| Story & Hook | 15/20 | Logic tốt, hook chưa sắc (câu sự kiện trung tính, chưa có Contradiction/Strong-statement) |
| Editing & Pacing | 11/15 | Hết khoảng chết nhưng act vẫn dài so với nhịp cắt nhanh chuẩn quốc tế |
| Composition | 8/10 | Ổn định |
| B-roll/Visual | 7/10 | Có evidence thật nhưng style card lặp lại giữa các act |
| Motion Graphics | 7/10 | `back.out()` bounce lặp lại ở hầu hết tile/card — lệch tỉ lệ "80% tinh tế, 20% nhấn mạnh" |
| Subtitle/Typography | 9/10 | Rất tốt |
| Sound Design | 9/10 | Rất tốt |
| Music | 5/5 | Đạt |
| Color | 3/5 | 3 ảnh thật lấy từ 3 nguồn khác nhau, chưa color-match — lệch tông rõ khi xem liên tiếp |
| Branding | 5/5 | Đạt |

**3 điểm yếu lớn nhất phát hiện**: (1) 3 ảnh thật chưa color-match, (2) Hook thiếu yếu tố giữ chân,
(3) 6/7 act dùng chung 1 khung bố cục dù hệ thống có 10 style xoay vòng.

### Vòng 2 — sau khi xử lý Must/Should Fix: 90/100 (International/Premium)

| Hạng mục | Trước | Sau | Đã làm |
|---|---:|---:|---|
| Story & Hook | 15 | **18** | Đảo vai trò: headline dẫn bằng nghịch lý đã xác minh ("Định giá cao gấp 4,6 lần tài sản thật") thay vì câu sự kiện trung tính |
| Editing & Pacing | 11 | **12** | Cải thiện gián tiếp qua thay đổi bố cục/easing |
| Composition | 8 | **9** | Đa dạng bố cục: Key Facts thêm số thứ tự lớn 01/02/03; Impact đổi từ xếp chồng sang side-by-side |
| B-roll/Visual | 7 | **9** | Đa dạng loại bằng chứng qua các act |
| Motion Graphics | 7 | **9** | Giảm bounce lặp (đổi `back.out` → `power3.out` ở 1 số tile), thêm kỹ thuật mới (clip-path wipe cho headline) |
| Subtitle/Typography | 9 | 9 | Giữ nguyên |
| Sound Design | 9 | 9 | Giữ nguyên |
| Music | 5 | 5 | Giữ nguyên |
| Color | 3 | **5** | Dùng `media-treatment --analyze` đo khách quan (Hook: highlight cháy → kéo whites; Context: shadow bí → nâng blacks) + tông ấm chung khớp brand |
| Branding | 5 | 5 | Giữ nguyên |
| **TỔNG** | **79** | **90** | |

**2 điểm cố tình không đụng ở vòng này** (ranh giới biên tập, không phải "quên sửa"): Editing &
Pacing giữ 12/15 vì đổi sang nhịp cắt nhanh kiểu TikTok sẽ phá khung sườn 7-act đã chốt; Story &
Hook giữ 18/20 vì đẩy tối đa sẽ lấn sang giật tít, ngược tinh thần "tin tức nghiêm túc" của kênh.

### Vòng 3 — phương án đánh đổi được duyệt để chạm 95/100

Thay vì tự quyết định đánh đổi, phương án được trình bày rõ trade-off rồi mới thực hiện:

1. **Hook (18→20)**: thêm 1 badge nhỏ "+45% so với thị giá" cạnh số liệu chính — dữ kiện đã xác
   minh, xếp chồng 2 tín hiệu nghịch lý trong 3 giây đầu, không lấn sang clickbait.
2. **Editing & Pacing (12→15)**: chèn 1 "smash-cut" nội bộ ở 2 act dài nhất, đúng lúc nội dung tự
   nhiên chuyển ý (ảnh bằng chứng → dữ liệu số) — không phải cắt để "tạo cảm giác năng lượng".

Kết quả triển khai: cả 2 hạng mục đều lên hình đúng như thiết kế (verify bằng chuỗi frame liên
tiếp, không chỉ 1 ảnh đơn — vì hiệu ứng chớp <0.2s dễ bị bỏ lỡ nếu chụp sai mốc), ước tính đạt
~95-96/100. **Lưu ý trung thực**: đây là ước tính dựa trên 2 thay đổi đã tính điểm trước, chưa chạy
lại audit đầy đủ 10 hạng mục lần nữa để xác nhận số chính xác — khi review video khác theo case
study này, luôn chấm lại đầy đủ thay vì cộng dồn ước tính.

**Bài học lớn nhất từ case study này**: điểm số tăng lên không phải nhờ thêm hiệu ứng mới liên tục,
mà nhờ (1) đo đạc khách quan thay vì cảm tính (loudness thật, contrast thật, vị trí pixel thật),
(2) sửa đúng điểm yếu đã xác định thay vì sửa lan man, và (3) biết dừng ở ranh giới biên tập đã
chốt thay vì đẩy điểm số bằng mọi giá.
