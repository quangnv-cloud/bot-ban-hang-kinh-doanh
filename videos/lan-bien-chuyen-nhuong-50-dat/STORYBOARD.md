---
format: 1080x1920
duration: 60s
message: "Luật Phát triển đô thị mới: nhà đầu tư chiến lược dự án khu đô thị lấn biển không được bán toàn bộ dự án — chỉ tối đa 50% diện tích đất đã xong hạ tầng kỹ thuật"
arc: concept-explainer
audience: "Nhà đầu tư bất động sản, doanh nghiệp phát triển đô thị theo dõi kênh BOT BÁN HÀNG · KINH DOANH"
mode: autonomous
music: none
---

## Video direction (REVISED — visual hierarchy + image treatment overhaul; brand system, 8-act structure, per-frame timing and VO all UNCHANGED)

- **Brand system unchanged** — kênh **BOT BÁN HÀNG · KINH DOANH** (xem `../BRAND-SYSTEM-BOT-BAN-HANG.md`). `{colors.ink-black}` #111111, `{colors.cream}` #FFFFFF, `{colors.fire-orange}` #E8441E. Barlow (lowercase editorial copy; UPPERCASE only for the literal brand wordmark) + IBM Plex Mono chrome. No 4th hue, ever.
- **Visual hierarchy FLIPPED from text-first to image-first**: `REAL IMAGE/VIDEO → KEY INFORMATION → NUMBER/KEYWORD → MOTION GRAPHIC → DECORATIVE → BACKGROUND`. Where a real photo genuinely informs the beat, it goes **full-bleed 9:16**, not a small bordered "Article Image Card" — that card treatment is retired. Text/number still carries the message, but it now sits ON TOP of or ALONGSIDE full-bleed reality, not on an empty dark field.
- **Honest-image rule (do not fabricate or pad with irrelevant photos)** — only 2 real photos exist for this story (both credited, both from this article): `public/photo-bo-truong-tu-phap.jpg` and `public/photo-dai-bieu-quoc-hoi.jpg`. Frames whose beat is DIRECTLY about the law being presented/passed (Frame 1 Hook, Frame 2 What-happened, Frame 5 Context) use one of these two full-bleed — never force a real photo into a frame about an abstract number it has no honest connection to (Frame 3 "50%", Frame 4 "70 năm", Frame 6 impact) — those stay motion/typography-led, per the brand system's own explicit allowance (`{colors.ink-black}` is fine for "data visualization, number hero, key statement, brand ending"), but must gain real depth (layered gradients, faint grid/atmosphere, orange glow, never flat dead-black) and much richer motion so they don't read as bare black-and-type slides.
- **Keyword/number highlight unchanged** — `{colors.fire-orange}` on the number/keyword only, rest stays `{colors.cream}`/white-on-photo.
- **Motion grammar unchanged** — long-tail `power3`, VO-paced reveal (nothing before its cue, weighted into the back ~50%), subtle jitter only on holds, no breathing/pan-push.
- **Motion must now EXPLAIN relationships, not just decorate** — every data beat gets a purpose-built animation: 93% → counter/reveal ticking up; 50% → a 100%→50% split/reduction animation (not a static number); 70 năm → a build/reveal (number assembling, not appearing whole); 5→7→10→20 → sequential step/timeline animation landing on each spoken mark; "không được chuyển nhượng" → a visual restriction/blocking motif (e.g. a barrier/lock/crossed-path), not plain text.
- **Fixed Brand Anchor moved to the TOP corners** (root/index.html level, unchanged mechanism — not rebuilt per-frame): logo BOT BÁN HÀNG **top-right**, "Nguồn: VnExpress" **top-left**, persistent 0→60s, static, no animation. Every frame's keep-out is now the TOP: top-right ~180×140px and top-left ~360×110px (on 1080×1920) must stay free of load-bearing content — this REPLACES the old bottom keep-out (bottom corners are now free to use).
- **Rhythm** — 3 image-led frames (1, 2, 5 — full-bleed real photography, brighter, deeper) interleaved with 4 motion/data-led frames (3, 4, 6, plus the calm breather 7) and the brand close (8). The image-led frames are now where the video "breathes brightness"; the data frames carry depth via graphic atmosphere, not via photos they have no honest claim to.
- **Audio layer (current)**: background music generated via Google Lyria (Digital Business News / modern editorial mood), trimmed to 60s with fade in/out. SFX as fetched (impact-bass-1, click-soft, pop, whoosh-short, chime) at number-reveal/counter/restriction beats. Voiceover generated via ElevenLabs (voice "Khánh Lâm - tin tức, thời sự"), one file per script line, matched to each frame's `data-start`. Audio hierarchy: **voice-over → SFX → BGM** — BGM carved/ducked under the voiceover group via `hyperframes-audio`'s `carve.mjs`.
- **Negative list unchanged** — không bịa số liệu/nguồn; không copy layout website VnExpress; không CTA bán hàng ở frame cuối; không dùng màu ngoài 3 màu brand; không giải quyết yêu cầu này chỉ bằng cách phóng to typography — hình ảnh và thông tin thật phải thật sự dẫn dắt.

## Frame 1 — Hook

- scene: Kinetic typography trên nền tối, headline "CHỈ ĐƯỢC BÁN MỘT NỬA" đập vào khung hình theo từng cụm, "MỘT NỬA" tô cam; dòng phụ "Dự án đô thị lấn biển" nhỏ hơn phía trên.
- voiceover: "Nhà đầu tư dự án lấn biển: giờ chỉ được bán một nửa."
- duration: 5s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Stakes / consequence + counterintuitive claim
- beat: curiosity + tension
- blueprint: kinetic-type-beats (Adapt)
- focal: dòng chữ "CHỈ ĐƯỢC BÁN MỘT NỬA" (đặc biệt từ "MỘT NỬA" tô cam)
- roles: headline = foreground subject (hero) · nền ink-black + hairline grid mờ = background (atmosphere) · dòng phụ "Dự án đô thị lấn biển" = supporting
- sfx: impact-bass-1

Adapt: giữ signature "escalating multi-beat statement" của kinetic-type-beats — 2 cụm chữ lần lượt đập vào khung, cụm sau đè cụm trước, cụm cuối giữ lại làm neo.

Scene 1 (0.0–1.6s): nền ink-black; dòng phụ nhỏ "DỰ ÁN ĐÔ THỊ LẤN BIỂN" (label kiểu IBM Plex Mono, uppercase, tracking rộng, cream) fade+slide-up vào giữa khung, phía trên — khớp lúc VO bắt đầu "Nhà đầu tư dự án lấn biển".
Scene 2 (1.6–3.4s): headline chính "CHỈ ĐƯỢC BÁN" đập vào bằng hard-cut kinetic slam, cream, chiếm phần lớn khung, Centered — khớp lúc VO nói "giờ chỉ được bán".
Scene 3 (3.4–5.0s): từ "MỘT NỬA" đập tiếp ngay dưới/đè lên, tô cam `{colors.fire-orange}`, kèm một highlight sweep cam quét ngang qua từ này rồi tắt; giữ khung, subtle jitter duy nhất tới hết frame — khớp lúc VO nói "một nửa".

narrativeRole: Mở bằng tuyên bố ngược trực giác (siết quyền bán) để tạo khoảng trống nhận thức, kéo người xem ở lại tìm hiểu vì sao.
keyMessage: Có một quy định mới siết việc bán dự án lấn biển.

## Frame 2 — What happened

- scene: Article Image Card chứa ảnh thật Bộ trưởng Tư pháp Hoàng Thanh Tùng, đặt trong khung viền cam/bo góc của kênh (không full-bleed), tiêu đề "QUỐC HỘI THÔNG QUA LUẬT PHÁT TRIỂN ĐÔ THỊ" phía trên card, badge BOT BÁN HÀNG góc card.
- voiceover: "Quốc hội vừa thông qua Luật Phát triển đô thị, với 93% đại biểu tán thành, hiệu lực từ tháng Mười."
- duration: 7s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-what-happened.html
- type: product_intro
- persuasion: Concept announcement + citation
- beat: clarity + orientation
- asset_candidates: public/photo-bo-truong-tu-phap.jpg — Ảnh báo chí thật, Bộ trưởng Tư pháp Hoàng Thanh Tùng trình báo cáo tại phiên họp Quốc hội (nguồn: Cổng TTĐT Quốc hội qua VnExpress)
- blueprint: compose
- focal: Article Image Card (ảnh thật trong khung editorial của kênh)
- roles: Article Image Card = foreground subject NHƯNG không full-bleed, chiếm ~55% khung, đặt lệch trên — background = ink-black phẳng · headline phía trên card = đồng vai trò dẫn dắt cùng card · "93% đại biểu tán thành" + "Hiệu lực 1/10" = supporting labels dưới card
- sfx: click-soft

Compose: dựng Article Image Card đúng đặc tả section 14/15/33 brand system — card có border cam mảnh 2px, bo góc vừa phải, shadow nhẹ, badge "BOT BÁN HÀNG" góc trên-phải của card (nhỏ, không che ảnh), dải caption "SOURCE / ARTICLE CONTEXT" dưới đáy card ghi tên nhân vật trong ảnh.

Scene 1 (0.0–2.0s): headline "QUỐC HỘI THÔNG QUA LUẬT PHÁT TRIỂN ĐÔ THỊ" kinetic-slide vào từ trên, cream, chữ vừa (không chiếm quá 20% khung) — khớp lúc VO nói "Quốc hội vừa thông qua...".
Scene 2 (2.0–4.5s): Article Image Card scale-in từ 0.92→1.0 (power3, không bounce) vào giữa-dưới headline, ảnh Bộ trưởng Tư pháp hiện rõ trong khung viền cam; badge BOT BÁN HÀNG fade vào góc card ngay sau — khớp lúc VO nói "Luật Phát triển đô thị".
Scene 3 (4.5–7.0s): dưới card, hai data-chip nhỏ lần lượt pop: "93% TÁN THÀNH" (số tô cam) rồi "HIỆU LỰC 1/10" — khớp lúc VO nói "93% đại biểu tán thành, hiệu lực từ tháng Mười"; giữ khung, subtle jitter tới hết frame.

narrativeRole: Neo đề xuất vào một sự kiện thật (phiên họp Quốc hội) để tạo độ tin cậy, đồng thời xác nhận đây là luật đã CHÍNH THỨC thông qua.
keyMessage: Đây là luật đã được Quốc hội thông qua chính thức, không phải dự thảo.

## Frame 3 — Key facts

- scene: Ba cụm fact ngắn đập vào khung lần lượt theo kiểu kinetic typography/lower-third, mỗi cụm một dòng, "50%" tô cam ở cụm cuối.
- voiceover: "Luật quy định — nhà đầu tư chiến lược dự án lấn biển không được bán toàn bộ dự án — chỉ tối đa 50% diện tích đất đã xong hạ tầng kỹ thuật."
- duration: 10s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-key-facts.html
- type: feature_showcase
- persuasion: Numbered enumeration + progressive disclosure
- beat: comprehension
- blueprint: kinetic-type-beats (Adapt)
- focal: cụm fact 3 "TỐI ĐA 50% DIỆN TÍCH ĐẤT"
- roles: 3 dòng fact (lower-third card) = foreground subject, xuất hiện tuần tự · nền ink-black + hairline dividers mảnh = background · nhãn "LUẬT QUY ĐỊNH" = supporting (mở đầu)
- sfx: pop

Adapt: giữ nhịp "3 câu ngắn lần lượt landing alone" của kinetic-type-beats nhưng dựng dạng lower-third card xếp chồng dần thay vì full-frame mỗi câu, để 3 fact cùng đọc được khi câu 3 xuất hiện.

Scene 1 (0.0–1.8s): nhãn nhỏ "LUẬT QUY ĐỊNH" (IBM Plex Mono, uppercase, cam) fade vào trên cùng — khớp lúc VO nói "Luật quy định".
Scene 2 (1.8–5.2s): fact 1 "NHÀ ĐẦU TƯ CHIẾN LƯỢC KHÔNG ĐƯỢC BÁN TOÀN BỘ DỰ ÁN" trượt vào từ trái, cream, dạng lower-third card nền ink-black-alt viền mảnh — khớp lúc VO nói cụm tương ứng.
Scene 3 (5.2–8.6s): fact 2 xếp ngay dưới fact 1, cùng kiểu card, dòng "CHỈ TỐI ĐA" cream — khớp lúc VO nói "chỉ tối đa".
Scene 4 (8.6–10.0s): số "50%" bật lớn tô cam ngay sau fact 2, kèm highlight sweep cam quét qua, cùng dòng nhỏ "diện tích đất đã xong hạ tầng kỹ thuật" — khớp lúc VO nói "50% diện tích đất đã xong hạ tầng kỹ thuật"; giữ khung tới hết frame.

narrativeRole: Trả lời rõ "quy định cụ thể là gì" bằng 3 fact xây dựng dần, chốt ở con số trung tâm 50%.
keyMessage: Ngưỡng 50% diện tích đất đã xong hạ tầng là giới hạn chuyển nhượng duy nhất được phép.

## Frame 4 — Data moment

- scene: Con số hero "70 NĂM" đếm lên chiếm phần lớn khung, tô cam, kèm số phụ "≥ 30.000 TỶ ĐỒNG" bên dưới.
- voiceover: "Dự án lấn biển được hoạt động tối đa bảy mươi năm — áp dụng cho dự án từ ba mươi nghìn tỷ đồng trở lên."
- duration: 10s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-data-moment.html
- type: social_proof
- persuasion: Statistical proof
- beat: momentum + conviction
- blueprint: dataviz-countup (Reproduce)
- focal: numeral "70 NĂM"
- roles: numeral "70 NĂM" = foreground subject (hero, count-up) · nhãn "THỜI HẠN HOẠT ĐỘNG TỐI ĐA" phía trên = supporting · số phụ "≥ 30.000 TỶ ĐỒNG" + nhãn "ĐIỀU KIỆN ƯU ĐÃI" phía dưới = supporting (xuất hiện sau)
- sfx: pop, impact-bass-1

Reproduce: dataviz-countup đúng vai — số liệu là ngôi sao duy nhất của frame này, NUMBER > GRAPHIC.

Scene 1 (0.0–1.5s): nhãn nhỏ "THỜI HẠN HOẠT ĐỘNG TỐI ĐA" (cam, uppercase, mono) fade vào trên cùng.
Scene 2 (1.5–4.5s): numeral "70" đếm nhanh 0→70 kèm "NĂM" bật theo, tô cam, cỡ chữ lớn dần theo giá trị (value-scaled counter), khóa ở ~55% khung, Centered — khớp lúc VO nói "bảy mươi năm".
Scene 3 (4.5–7.5s): highlight sweep cam quét qua "70 NĂM" một lần rồi tắt; ngay sau đó nhãn "ĐIỀU KIỆN ƯU ĐÃI" fade vào phía dưới — khớp khoảng lặng VO trước cụm sau.
Scene 4 (7.5–10.0s): số phụ "≥ 30.000 TỶ ĐỒNG" bật vào dưới cùng, cream với "30.000 TỶ ĐỒNG" tô cam, cỡ nhỏ hơn "70 NĂM" — khớp lúc VO nói "ba mươi nghìn tỷ đồng trở lên"; giữ khung, subtle jitter tới hết frame.

narrativeRole: Biến con số lớn nhất của luật (70 năm thời hạn hoạt động) thành focal point trực quan, gắn với điều kiện vốn tối thiểu để hưởng ưu đãi.
keyMessage: Dự án lấn biển được hoạt động tối đa 70 năm nếu vốn từ 30.000 tỷ đồng trở lên.

## Frame 5 — Context

- scene: Step-chart cam thể hiện tiến độ giải ngân tăng dần theo quy mô vốn (5→7→10→20 năm), kèm Article Image Card thứ hai (ảnh đại biểu Quốc hội) làm inset nhỏ góc dưới.
- voiceover: "Tiến độ giải ngân chia theo quy mô vốn — từ năm năm với dự án nhỏ, đến hai mươi năm với dự án trên một trăm nghìn tỷ. Trong thời hạn đó, nhà đầu tư không được chuyển nhượng dự án."
- duration: 11s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-context.html
- type: feature_showcase
- persuasion: Signposting + build-up (simple → general case)
- beat: focus + comprehension
- asset_candidates: public/photo-dai-bieu-quoc-hoi.jpg — Ảnh báo chí thật, các đại biểu Quốc hội tại phiên họp (nguồn: Cổng TTĐT Quốc hội qua VnExpress)
- blueprint: compose
- focal: step-chart 4 bậc "5 → 7 → 10 → 20 NĂM"
- roles: step-chart = foreground subject (xây dần từng bậc) · nhãn quy mô vốn dưới mỗi bậc = supporting · Article Image Card (ảnh đại biểu) = supporting, nhỏ, góc dưới — KHÔNG được lớn hơn step-chart · dòng chốt "Không được chuyển nhượng trong thời hạn này" = supporting cuối
- sfx: click-soft

Compose: không blueprint nào trong menu Key_Feature khớp đúng "step-chart tăng dần + ảnh minh họa phụ" — dựng tự do, giữ nhịp VO-paced, đảm bảo card ảnh luôn nhỏ hơn biểu đồ số liệu (đúng visual hierarchy TEXT/DATA > IMAGE).

Scene 1 (0.0–1.8s): nhãn "TIẾN ĐỘ GIẢI NGÂN THEO QUY MÔ VỐN" fade vào trên cùng, cam, uppercase mono.
Scene 2 (1.8–7.5s): 4 bậc step-chart dựng lần lượt từ trái sang phải, mỗi bậc là một cột cam tăng dần chiều cao kèm nhãn năm ("5 NĂM", "7 NĂM", "10 NĂM", "20 NĂM") và nhãn quy mô vốn nhỏ bên dưới mỗi cột (dưới 30k tỷ / 30–50k / 50–100k / trên 100k tỷ) — mỗi bậc landing đúng lúc VO nhắc mốc năm tương ứng (per-word/per-clause staggered reveal).
Scene 3 (7.5–9.3s): Article Image Card thứ hai (ảnh đại biểu Quốc hội) scale-in nhỏ vào góc dưới-trái của vùng nội dung (không đè step-chart, không đè brand anchor), viền cam mảnh, badge BOT BÁN HÀNG góc card.
Scene 4 (9.3–11.0s): dòng chốt nhỏ "Không được chuyển nhượng trong thời hạn này" fade vào dưới cùng — khớp lúc VO nói "nhà đầu tư không được chuyển nhượng dự án"; giữ khung, subtle jitter tới hết frame.

narrativeRole: Giải thích CƠ CHẾ đứng sau con số 70 năm — vì sao thời hạn dài đi kèm ràng buộc giải ngân/không chuyển nhượng tăng dần theo quy mô vốn.
keyMessage: Vốn càng lớn, thời hạn giải ngân bắt buộc càng dài — và không được bán trong suốt thời hạn đó.

## Frame 6 — Impact

- scene: Hai impact-card xuất hiện tuần tự "NHÀ ĐẦU TƯ" và "THỊ TRƯỜNG BẤT ĐỘNG SẢN VEN BIỂN", mỗi card kèm một dòng hệ quả ngắn, nối bằng connection line cam.
- voiceover: "Quy định này siết chặt tình trạng bán dự án khi chưa xong hạ tầng — buộc nhà đầu tư phải thực sự triển khai, thay vì sang tay để hưởng chênh lệch."
- duration: 10s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-impact.html
- type: benefit_highlight
- persuasion: Causal chain (A → B)
- beat: conviction
- blueprint: grid-card-assemble (Adapt)
- focal: 2 impact-card "NHÀ ĐẦU TƯ" / "THỊ TRƯỜNG BĐS VEN BIỂN"
- roles: 2 impact-card = foreground subject (tuần tự) · connection line cam nối 2 card = supporting · nhãn "Ý NGHĨA VỚI THỊ TRƯỜNG" = supporting (mở đầu)
- sfx: click-soft, whoosh-short

Adapt: grid-card-assemble vốn cho N item cùng lúc — ở đây chỉ 2 card, giữ signature "self-assemble tuần tự" nhưng thêm connection line nối card 1 → card 2 để thể hiện quan hệ nhân-quả (siết bán → buộc triển khai thật).

Scene 1 (0.0–1.7s): nhãn "Ý NGHĨA VỚI THỊ TRƯỜNG" fade vào trên cùng, cam, uppercase mono.
Scene 2 (1.7–5.0s): card 1 "NHÀ ĐẦU TƯ" scale-in bên trái-trên, kèm dòng phụ "Buộc triển khai thật, không sang tay hưởng chênh lệch" — khớp lúc VO nói "buộc nhà đầu tư phải thực sự triển khai".
Scene 3 (5.0–7.5s): một connection line cam vẽ (SVG self-draw) từ card 1 chéo xuống, card 2 "THỊ TRƯỜNG BĐS VEN BIỂN" scale-in ở cuối line, dòng phụ "Giảm tình trạng dự án bỏ hoang, bán lúa non" — khớp lúc VO nói "siết chặt tình trạng bán dự án khi chưa xong hạ tầng".
Scene 4 (7.5–10.0s): giữ cả hai card + line, subtle jitter duy nhất tới hết frame.

narrativeRole: Trả lời "vậy thì sao" — quy định này thay đổi hành vi nhà đầu tư và cấu trúc thị trường ven biển như thế nào.
keyMessage: Quy định buộc nhà đầu tư triển khai thật thay vì đầu cơ chuyển nhượng dự án dở dang.

## Frame 7 — Takeaway (nay là frame cuối — Frame 8/Brand ending đã bị xóa theo yêu cầu người dùng)

- scene: Một dòng chốt duy nhất giữa khung, tối giản, không motion phụ. Không còn brand card riêng ở cuối — video kết thúc ngay trên frame này; logo + nguồn (root anchor) vẫn hiển thị góc trên tới hết video, đó là toàn bộ "outro" còn lại.
- voiceover: "Điểm cần theo dõi tiếp theo: tiêu chí xác định nhà đầu tư chiến lược, do Chính Phủ quy định."
- duration: 7s (giãn thêm 2s so với bản trước để lấp khoảng trống sau khi bỏ Frame 8, giữ tổng 60s)
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-takeaway.html
- type: branding
- persuasion: Distillation
- beat: resolve
- blueprint: titlecard-reveal (Reproduce)
- focal: dòng chốt "CHỜ CHÍNH PHỦ QUY ĐỊNH TIÊU CHÍ NHÀ ĐẦU TƯ CHIẾN LƯỢC"
- roles: dòng chốt = foreground subject (centered) · nhãn nhỏ "ĐIỂM CẦN THEO DÕI" phía trên = supporting · nền ink-black phẳng = background
- sfx: chime (dời từ Frame 8 cũ — vẫn đóng vai trò outro sting dù không còn wordmark card)

Reproduce: đúng breather/landing beat của titlecard-reveal — MỘT move duy nhất (slide-up crossfade) rồi giữ tĩnh, không thêm chuyển động — hold kéo dài hơn (tới 7.0s) vì đây giờ là frame cuối cùng của video, cần đọng lại lâu hơn thay vì cắt sang brand card.

Scene 1 (0.0–1.2s): nhãn nhỏ "ĐIỂM CẦN THEO DÕI" (cam, uppercase mono) fade vào trên cùng.
Scene 2 (1.2–3.5s): dòng chốt "TIÊU CHÍ NHÀ ĐẦU TƯ CHIẾN LƯỢC — CHỜ CHÍNH PHỦ QUY ĐỊNH" trượt lên + crossfade vào giữa khung, cream, "Chính Phủ" viết hoa đúng danh từ riêng + tô cam — khớp lúc VO nói dòng tương ứng.
Scene 3 (3.5–7.0s): giữ nguyên, subtle jitter (2 nhịp, tại ~3.6-4.75s và ~6.0-6.8s) — không thêm move nào khác; đây là exit thật của toàn video (không tween thoát ở cuối).

narrativeRole: Chốt câu chuyện bằng một điều còn bỏ ngỏ — cho người xem lý do để tiếp tục theo dõi kênh. Đồng thời là frame đóng video (không còn brand card riêng).
keyMessage: Chi tiết quan trọng còn lại (tiêu chí nhà đầu tư chiến lược) sẽ do Chính Phủ hướng dẫn tiếp.
