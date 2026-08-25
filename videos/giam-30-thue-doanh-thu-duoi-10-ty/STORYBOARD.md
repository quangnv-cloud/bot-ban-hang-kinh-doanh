---
format: 1080x1920
duration: 30s
message: "Chính phủ đề xuất giảm 30% thuế cho cá nhân kinh doanh và doanh nghiệp doanh thu không quá 10 tỷ đồng/năm, áp dụng từ quý III/2026"
arc: concept-explainer
audience: "Hộ kinh doanh cá thể, chủ doanh nghiệp nhỏ, người quan tâm chính sách thuế tại Việt Nam"
mode: autonomous
music: none
---

## Video direction

- **Palette** — from `frame.md` (Blue Professional): warm cream `{colors.bg}` ground on the typographic/data frames (1, 3, 5, 6); the two real-photo frames (2, 4) use the photo itself as the full-bleed ground with a bottom-anchored dark gradient scrim for text legibility. Cobalt `{colors.primary}` is the ONLY accent everywhere — eyebrows, numerals, pill badges, progress bar, credit-line chip. Headlines near-black `{colors.text}` on cream frames; near-white on the two photo frames (contrast flips on photo grounds only, never on cream). No second accent color, no invented colors.
- **Motion grammar + reveal model** — long-tail `power3` settles everywhere (no bounce/overshoot). Every frame reveals paced to its spoken line: at t=0 only what the VO says then is on screen; each further piece (a card, a stat, a line, a badge) lands on its own spoken cue, weighted into the back ~50% of the frame's duration. During any hold, at most subtle jitter (`sine-wave-loop`, low amplitude) — no breathing, no back-half pan/push.
- **Rhythm / held-frame allocation** — Frames 2 and 4 (the real-photo frames) are the video's deliberate breather beats: one photo settle, one text reveal, a held read — calmer than the typographic frames around them. Frames 1, 3, 5 build cumulatively to a landed stat/comparison and hold. Frame 6 is the held closing beat — the only frame with a true exit (logo sting).
- **Text budget (hard constraint)** — total on-screen text ink (headlines + labels + credit lines + numerals) stays under ~20% of the 1080×1920 frame area at every instant. Achieve this with generous negative space, ONE short dominant line or numeral per beat, and colophon-scale (≤13px-equivalent) credit/eyebrow text — never a paragraph, never more than 2 short lines stacked at once. The hero numeral in Frame 1/5 counts as the frame's designed visual subject (like a diagram), not decorative caption text, but still stays visually light — thin negative space around it, not edge-to-edge.
- **Captions** — none. `music: none` and no local word-timing engine available this run (whisper-cpp not installed) — captions are explicitly skipped per the audio-doctrine's legal skip path. Every frame must therefore carry its full meaning through its own on-screen numeral/headline + the voiceover, since there is no caption safety net.
- **Negative list** — no bouncy easing (`back.out`/`bounce.out`/`elastic.out`); no lazy breathing loops; no slow pan/push in a frame's back half; no floating bokeh / purple-blue "AI" gradient cliché; no fake UI chrome or invented interface; no invented figures — every numeral traces to the script (`3.191 tỷ`, `3.510 tỷ`, `30%`, `10 tỷ`, `2026`, `2027`); real photos (Frames 2, 4) and the real logo (Frame 6) are the only non-invented visuals and must render unaltered (color grade only — no cropping out the credited subject).
- **Logo** — appears once, Frame 6 only, as a small closing sting mark. Not repeated in other frames.
- **Framing variety** — Frame 1 centered hero-numeral · Frame 2 layered-depth full-bleed photo, lower-third text · Frame 3 full-width vertical stack (comparison-split, portrait) · Frame 4 layered-depth full-bleed photo, lower-third graphic · Frame 5 centered stacked stats · Frame 6 centered closer. At least 3 distinct framings used, never the same framing twice in a row.

## Frame 1 — 30%?

- scene: Nền cobalt tối giản, số "30%" khổng lồ đập vào khung hình rồi giữ lại làm neo thị giác; chữ chiếm dưới 20% khung hình.
- voiceover: "30% thuế sắp được cắt giảm. Nhưng là cho ai?"
- duration: 3.669s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Shocking statistic + rhetorical question
- beat: curiosity + intrigue
- blueprint: dataviz-countup (Adapt)
- focal: số "30%" (numeral khổng lồ, vai trò như một đồ họa dữ liệu, không phải caption)
- roles: numeral "30%" = foreground subject (hero) · nền cream + dot-grid cobalt mờ ~15% = background (atmosphere) · dòng "thuế sắp được cắt giảm" + "Nhưng là cho ai?" = supporting (nhỏ, xuất hiện sau)
- sfx: whoosh-short, impact-bass-1

Adapt: giữ signature move "đếm lên rồi bùng nổ kích thước" của dataviz-countup, nhưng bỏ vòng icon (không có bộ dữ liệu) — số "30%" tự nó là numeral trung tâm đếm lên rồi khóa ở kích thước hero.

Scene 1 (0.0–0.7s): nền cream + dot-grid cobalt mờ đã ổn định; numeral "30%" bùng vào giữa khung qua **value-scaled counter** (đếm 0→30, cỡ chữ lớn dần theo giá trị) → `counting-dynamic-scale`, khóa ở ~55% khung hình, cobalt, Centered — khớp đúng lúc VO nói "30%".
Scene 2 (0.7–2.4s): numeral giữ nguyên (subtle jitter nhẹ); bên dưới, dòng "thuế sắp được cắt giảm" hiện qua **per-word staggered reveal** → `dynamic-content-sequencing`, chữ near-black nhỏ, Centered dưới numeral, ~15% khung hình.
Scene 3 (2.4–3.669s): khi VO hỏi "Nhưng là cho ai?", dòng thứ hai bật lên dưới cùng qua **hard-cut word-swap** → `discrete-text-sequence`, cobalt eyebrow-style, rất nhỏ, Centered. Numeral giữ nguyên vị trí trên, subtle jitter duy nhất, giữ tới hết frame.

narrativeRole: Mở bằng con số gây chú ý (30%) và mở khoảng trống nhận thức "cho ai" — kéo người xem vào để tìm câu trả lời.
keyMessage: Có một đề xuất giảm 30% thuế sắp diễn ra.

## Frame 2 — Chính phủ đề xuất

- scene: Ảnh báo chí thật full-bleed (Bộ trưởng Tài chính Ngô Văn Tuấn tại phiên họp Quốc hội 20/8) làm nền; dòng tiêu đề ngắn đè lên phần tối của ảnh, credit nguồn nhỏ ở góc dưới.
- voiceover: "Chính phủ vừa đề xuất giảm 30% số thuế phải nộp."
- duration: 3.39s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-proposal.html
- type: product_intro
- persuasion: Concept announcement
- beat: clarity + orientation
- asset_candidates: public/photo-bo-truong-tai-chinh.jpg — Ảnh báo chí thật, Bộ trưởng Tài chính Ngô Văn Tuấn trình đề xuất tại phiên họp Quốc hội chiều 20/8 (nguồn: Cổng TTĐT Quốc hội qua VnExpress)
- blueprint: compose
- focal: ảnh báo chí thật (public/photo-bo-truong-tai-chinh.jpg)
- roles: ảnh = background (full-bleed, dim qua gradient scrim tối ở đáy để chữ đọc được) · tiêu đề "Chính phủ đề xuất giảm 30% thuế" = foreground subject (lower-third) · dòng credit nguồn = supporting (rất nhỏ, góc dưới)
- sfx: none

Compose: không blueprint nào trong menu Product_Intro dùng ảnh thật full-bleed (chúng đều dựng UI/logo) — dựng tự do từ motion vocabulary, giữ nhịp VO-paced.

Scene 1 (0.0–1.0s): ảnh vào full-bleed qua một cú push-in nhẹ, giảm tốc, kết thúc ngay rồi giữ đứng yên (không tiếp tục đẩy) — Layered-depth; gradient scrim tối phủ 45% đáy ảnh để chuẩn bị chỗ cho chữ. VO vừa bắt đầu "Chính phủ vừa đề xuất..." — chưa có chữ nào xuất hiện.
Scene 2 (1.0–2.7s): khi VO nói "giảm 30% số thuế phải nộp", tiêu đề hiện qua **per-word staggered reveal** → `dynamic-content-sequencing`, near-white Space Grotesk h2, tối đa 3 từ/dòng, neo lower-third, Asymmetric.
Scene 3 (2.7–3.39s): dòng credit nhỏ "Ảnh: Cổng TTĐT Quốc hội" mờ dần vào góc dưới-phải (colophon scale); giữ khung, subtle jitter duy nhất trên gạch chân cobalt của tiêu đề.

narrativeRole: Đặt tên cho đề xuất chính sách và neo nó vào nguồn thật (ảnh phiên họp Quốc hội) để tạo độ tin cậy.
keyMessage: Đây là một đề xuất chính thức của Chính phủ, không phải tin đồn.

## Frame 3 — Áp dụng cho ai

- scene: Thẻ so sánh hai cột "Cá nhân kinh doanh" / "Doanh nghiệp", cả hai cùng chung ngưỡng "≤ 10 tỷ đồng/năm" làm điểm neo trung tâm; nền giữ palette preset, chữ tối giản dưới 20% khung hình.
- voiceover: "Áp dụng cho cá nhân kinh doanh, và doanh nghiệp, có doanh thu không quá 10 tỷ đồng một năm."
- duration: 6.316s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/03-eligibility.html
- type: feature_showcase
- persuasion: Numbered enumeration + Frame-then-fill
- beat: comprehension
- blueprint: comparison-split (Reproduce)
- focal: hai thẻ "Cá nhân kinh doanh" / "Doanh nghiệp"
- roles: hai thẻ = foreground subject (đồng trọng số) · badge chung "≤ 10 tỷ đồng/năm" = supporting (spring-pop trên từng thẻ) · nền cream + dot-grid mờ = background
- sfx: impact-bass-1, pop

Reproduce: comparison-split đúng khoen cho hai hạng mục song song cùng một ngưỡng — dựng dọc (portrait) thay vì cạnh nhau.

Scene 1 (0.0–1.9s): nền cream; thẻ "Cá nhân kinh doanh" vào từ cánh trái với nghiêng 3D "book-open" → `split-tilt-cards`, khóa ở nửa trên khung — khớp lúc VO nói "cá nhân kinh doanh".
Scene 2 (1.9–3.8s): thẻ "Doanh nghiệp" vào từ cánh phải với nghiêng đối xứng, khóa ở nửa dưới (stack dọc) — khớp lúc VO nói "và doanh nghiệp".
Scene 3 (3.8–5.7s): khi VO nói "doanh thu không quá 10 tỷ đồng một năm", badge cobalt "≤ 10 tỷ đồng/năm" spring-pop lần lượt lên mép trong của từng thẻ (`spring-pop-entrance`), thẻ 1 trước, thẻ 2 ngay sau.
Scene 4 (5.7–6.316s): giữ cả hai thẻ + badge, subtle jitter duy nhất, không thêm chuyển động.

narrativeRole: Trả lời rõ "cho ai" — điều kiện áp dụng cụ thể bằng một mốc doanh thu duy nhất, dễ nhớ.
keyMessage: Ngưỡng doanh thu 10 tỷ đồng/năm là điều kiện áp dụng, cho cả cá nhân lẫn doanh nghiệp.

## Frame 4 — Khi nào

- scene: Ảnh báo chí thật full-bleed (Chủ tịch Quốc hội Trần Thanh Mẫn tại phiên họp) làm nền; đồ họa mốc thời gian "2026 → 2027" và nhãn "Hiệu lực quý III/2026" đè lên phần tối, credit nguồn nhỏ.
- voiceover: "Áp dụng cho kỳ tính thuế 2026, 2027 — hiệu lực từ quý III/2026."
- duration: 7.802s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-timeline.html
- type: feature_showcase
- persuasion: Signposting
- beat: focus + anticipation
- asset_candidates: public/photo-chu-tich-quoc-hoi.jpg — Ảnh báo chí thật, Chủ tịch Quốc hội Trần Thanh Mẫn cho ý kiến tại phiên họp chiều 20/8 (nguồn: Cổng TTĐT Quốc hội qua VnExpress)
- blueprint: compose
- focal: ảnh báo chí thật (public/photo-chu-tich-quoc-hoi.jpg) + đồ họa mốc thời gian
- roles: ảnh = background (full-bleed, cùng cách dựng như Frame 2 để giữ nhất quán) · thanh mốc thời gian "2026 → 2027" + badge "Hiệu lực quý III/2026" = foreground subject · credit nguồn = supporting
- sfx: none

Compose: lặp lại đúng ngữ pháp dựng ảnh của Frame 2 (cùng stage/transition) để hai frame ảnh thật đọc như một nhịp nhất quán.

Scene 1 (0.0–2.3s): ảnh vào full-bleed qua cùng cú push-in nhẹ giảm tốc rồi giữ đứng yên như Frame 2, gradient scrim tối ở đáy. VO: "Áp dụng cho kỳ tính thuế..." — chưa có đồ họa nào.
Scene 2 (2.3–5.5s): khi VO nói "2026, 2027", một thanh timeline cobalt mảnh tự vẽ từ trái sang phải qua **SVG self-draw** → `svg-path-draw` ở lower-third, hai mốc năm hiện lần lượt theo **per-word staggered reveal** đúng lúc VO nói từng năm.
Scene 3 (5.5–7.802s): khi VO nói "hiệu lực từ quý III/2026", badge cobalt nhỏ "Hiệu lực quý III/2026" spring-pop cạnh mốc 2026 (`spring-pop-entrance`); credit nguồn mờ dần vào góc dưới-phải, rất nhỏ; giữ khung (đọc dài hơn dự kiến vì câu VO dài), subtle jitter duy nhất.

narrativeRole: Gắn mốc thời gian áp dụng cụ thể vào bối cảnh thật (phiên họp Quốc hội thảo luận đề xuất).
keyMessage: Chính sách áp dụng trong 2 kỳ tính thuế, bắt đầu từ quý III/2026.

## Frame 5 — Ngân sách đánh đổi

- scene: Data-viz hai cột số liệu lớn "3.191 tỷ đồng" (2026) và "3.510 tỷ đồng" (2027) — số liệu là hình ảnh chính, chữ chú thích tối thiểu.
- voiceover: "Ngân sách dự kiến giảm thu hơn 3.000 tỷ đồng mỗi năm — đổi lại nguồn lực để tái đầu tư."
- duration: 5.248s
- transition_in: push-slide LEFT
- status: outline
- src: compositions/frames/05-budget-impact.html
- type: social_proof
- persuasion: Statistical proof + causal chain
- beat: momentum + conviction
- blueprint: dataviz-countup (Reproduce)
- focal: hai numeral hero "3.191 tỷ đồng" (2026) và "3.510 tỷ đồng" (2027)
- roles: hai numeral count-up = foreground subject · eyebrow "NGÂN SÁCH GIẢM THU" + tag năm = supporting · nền cream = background
- sfx: click-soft, impact-bass-1

Reproduce: dataviz-countup đúng vai — số liệu là ngôi sao, camera nối hai stat bằng một cú push-through duy nhất.

Scene 1 (0.0–2.3s): nền cream; eyebrow cobalt "NGÂN SÁCH GIẢM THU" (h4-eyebrow, uppercase) mờ dần vào phía trên, rồi stat đầu "3.191 tỷ đồng" đếm lên qua **value-scaled counter** → `counting-dynamic-scale`, cobalt stat-num, khóa nửa trên, kèm tag nhỏ "2026" — khớp lúc VO nói "hơn 3.000 tỷ đồng mỗi năm".
Scene 2 (2.3–4.2s): khi VO nói "đổi lại nguồn lực để tái đầu tư", stat thứ hai "3.510 tỷ đồng" đếm lên và khóa nửa dưới kèm tag "2027"; một cú **push** máy quay duy nhất → `multi-phase-camera` nối hai stat, không đẩy tiếp sau đó.
Scene 3 (4.2–5.248s): giữ cả hai stat xếp chồng, subtle jitter duy nhất — không thêm chuyển động.

narrativeRole: Cho thấy cái giá ngân sách phải trả, đóng vai trò bằng chứng cụ thể cho quy mô của đề xuất.
keyMessage: Đề xuất này có chi phí ngân sách thật, đổi lại là nguồn lực tái đầu tư cho khu vực kinh doanh nhỏ.

## Frame 6 — Vì sao

- scene: Dòng chữ đúc kết lớn "Thêm dư địa tái đầu tư, mở rộng sản xuất" trên nền preset; logo thương hiệu xuất hiện làm sting đóng ở góc/cuối khung hình.
- voiceover: "Thêm dư địa để tái đầu tư, mở rộng sản xuất — và lớn nhanh hơn."
- duration: 4.272s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-takeaway.html
- type: branding
- persuasion: Distillation
- beat: satisfaction + resolve
- asset_candidates: public/logo-bbh.png — Logo thương hiệu, đóng video làm sting cuối
- blueprint: titlecard-reveal (Adapt)
- focal: dòng đúc kết "Thêm dư địa tái đầu tư, mở rộng sản xuất"; logo = closing mark
- roles: dòng đúc kết = foreground subject (centered) · logo thật = supporting (nhỏ, xuất hiện cuối cùng làm sting) · nền cream + concentric rings mờ = background (atmosphere đóng)
- sfx: chime

Adapt: giữ đúng ONE-restrained-move của titlecard-reveal (slide-up crossfade → giữ đứng yên), thay finisher generic bằng logo thương hiệu thật.

Scene 1 (0.0–1.7s): nền cream + concentric rings cobalt mờ (atmosphere đóng); khi VO nói "Thêm dư địa để tái đầu tư", nửa đầu câu trượt lên + crossfade vào, centered, near-black h2 → `dynamic-content-sequencing`.
Scene 2 (1.7–3.2s): khi VO tiếp "mở rộng sản xuất — và lớn nhanh hơn", nửa sau câu hoàn tất qua **per-word staggered reveal**, vẫn centered, tối đa 2 dòng ngắn.
Scene 3 (3.2–4.272s): logo thật (public/logo-bbh.png) spring-pop nhỏ bên dưới dòng chữ làm sting đóng (`spring-pop-entrance`) — giữ khung cuối, subtle jitter chỉ trên logo; đây là frame cuối nên đây là exit thật của video (không có harness transition theo sau).

narrativeRole: Đúc kết lý do chính sách tồn tại (tái đầu tư, mở rộng sản xuất) thành một câu duy nhất, đóng video bằng thương hiệu.
keyMessage: Mục tiêu cuối cùng của đề xuất là giúp hộ kinh doanh và doanh nghiệp nhỏ lớn nhanh hơn.
