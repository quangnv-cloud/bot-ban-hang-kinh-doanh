# BOT BÁN HÀNG · KINH DOANH — 60-Second Business News Motion Video System

Master brand & production system, cung cấp bởi người dùng ngày 2026-08-24. Dùng làm nguồn tham
chiếu chung cho MỌI video tin tức kinh doanh dựng cho kênh này — không lặp lại toàn văn trong từng
`BRIEF.md`, chỉ trích dẫn các phần liên quan.

## Định vị & Brand Personality

Business media hiện đại, nhanh, sắc, thông minh, đáng tin, thực tế, digital-native. Tin tức là
trung tâm — đây KHÔNG phải video quảng cáo sản phẩm. Không corporate/truyền thống/cứng nhắc/sci-fi/
sales-heavy.

## Brand Color System (cố định — không tự thêm màu)

| Vai trò | Hex |
| --- | --- |
| Primary Orange | `#E8441E` |
| White | `#FFFFFF` |
| Functional Dark | `#111111` |

Không dùng: xanh lá, xanh dương, tím, neon, rainbow gradient. Orange là màu nhận diện xuyên suốt.

## Visual Hierarchy (bắt buộc mọi frame)

```
TEXT (quan trọng nhất)
  ↓
MOTION GRAPHIC (giải thích/nhấn mạnh, phục vụ text)
  ↓
NEWS IMAGE / ARTICLE IMAGE (bằng chứng/context, không được là yếu tố lớn nhất)
```

## Text Hierarchy

- **Primary text** — số liệu/tiêu đề/từ khóa/tên doanh nghiệp/kết luận. Font lớn, Bold/ExtraBold, contrast cao.
- **Secondary text** — giải thích, nhỏ hơn.
- **Supporting text** — nguồn/ngày/chú thích, nhỏ nhất, không cạnh tranh với nội dung chính.
- **Keyword highlight** — trong một câu, số liệu/tên riêng nổi bật bằng Orange, không để cả câu cùng visual weight.
- Text color: White trên nền orange/dark/ảnh tối; Orange để highlight keyword/số liệu; Dark trên nền trắng/card sáng.

## Motion System

Sinh động, hiện đại, có nhịp, có chiều sâu — nhưng KHÔNG lấn át text. Signature vocabulary: Orange
Data Lines, Orange Pulse, Data Nodes, Market Graph, Percentage/Currency Animation, News Ticker,
Orange Frame, Highlight Sweep, Data Card, Connection Lines. Ưu tiên slide/mask reveal/scale/
count-up/tracking/line-draw/graph animation/highlight sweep/wipe/parallax nhẹ/kinetic typography.
Tránh: particle explosion, 3D robot, sci-fi HUD, glitch mạnh, neon, lens flare, camera movement quá nhiều.

## Article Image System

Ảnh trích từ bài báo KHÔNG tràn full-bleed toàn màn hình. Đặt trong **Article Image Card** — khung
editorial riêng của kênh (border/shadow nhẹ/rounded corner vừa phải, có label), kèm badge nhỏ
"BOT BÁN HÀNG" ở góc (không che nội dung ảnh, không biến ảnh thành quảng cáo). Không copy layout
website nguồn, không tái tạo giao diện web, không đổi nội dung/số liệu/headline gốc.

**Lấy ảnh ở đâu** (routine tự động): `GET <exec>?image=<id tin>` — KHÔNG tải thẳng từ CDN báo.
Xem `PRODUCTION-WORKFLOW-BOT-BAN-HANG.md` §1 bước 5.

## Fixed Elements (toàn bộ video, 0 → hết video)

- **Logo BOT BÁN HÀNG** — góc dưới-phải. Fixed position/size/margin. Không animation liên tục, không đổi vị trí giữa scene, không che nội dung.
- **Source credit** ("Nguồn: <tên nguồn>") — góc dưới-trái. Fixed typography/margin. Trắng hoặc Dark tùy nền (backing translucent nếu ảnh sáng). Không tự tạo/đổi tên nguồn. Nếu nhiều nguồn: "Nguồn: A / B" — chỉ liệt kê nguồn thực dùng.

Hai anchor này tạo thành **Brand Anchor** — nên dựng ở tầng root/overlay của composition, không lặp
lại độc lập trong từng frame, để đảm bảo nhất quán tuyệt đối qua mọi lần cắt cảnh.

## Cấu trúc 7 act (thời lượng linh hoạt theo nội dung)

**[Cập nhật 2026-08-26 — bỏ ràng buộc cứng "60 giây"]**: KHÔNG còn ép video phải đúng 60s. Giới
hạn duy nhất là **dưới 1 phút**; độ dài thật của từng video (và từng act bên dưới) phải khớp với
nội dung/kịch bản thực tế — video ngắn/dài hơn tuỳ tin, không kéo dài khung hình chỉ để lấp đủ giờ.
Mốc thời gian trong bảng dưới là ví dụ tỷ lệ tương đối giữa các act (video mẫu ~46s), không phải
mốc cố định phải theo đúng từng giây.

**[Cập nhật 2026-08-25 — bỏ hẳn act "Takeaway" đóng bằng nhận định/dự đoán]**: video KHÔNG còn
act đóng kiểu "điểm cần theo dõi" / dự đoán xu hướng tương lai ("liệu đà tăng có tiếp tục năm
sau không") — người dùng nhận xét đây là suy đoán/bình luận, không phải tin tức, đi ngược tinh
thần "chỉ tập trung đưa tin". Video giờ kết thúc ngay sau act 6 (Impact) — act cuối cùng phải là
một sự thật/số liệu cứng, không phải câu hỏi mở hay nhận định hướng tới tương lai. Nếu cần một
câu chốt, chỉ dùng câu tóm tắt sự kiện đã xảy ra (thì quá khứ/hiện tại), không suy đoán điều
"có thể" hoặc "sẽ" xảy ra tiếp theo.

| Act | Ví dụ thời gian (video ~46s) | Nội dung |
| --- | --- | --- |
| 1. Hook | 0–5s | Visual + headline + motion + brand — dừng scroll trong 1s đầu |
| 2. What happened | 5–12s | Chuyển từ hook sang real news content (footage/article image) |
| 3. Key facts | 12–20s | Ai / điều gì / khi nào / ở đâu — kinetic typography, lower third, data card |
| 4. Data moment | 20–28s | Con số quan trọng nhất thành focal point — NUMBER > GRAPHIC |
| 5. Context | 28–39s | Tại sao xảy ra — timeline/comparison/chart/quote |
| 6. Impact | 39–46s | Ý nghĩa với doanh nghiệp/thị trường/người tiêu dùng — act cuối, giữ hình + brand anchor tới hết video |

**[QUAN TRỌNG — khớp khung hình với giọng đọc thật, không copy nguyên khung giờ video trước]**:
mỗi video có kịch bản khác nhau nên độ dài giọng đọc từng dòng cũng khác nhau. `data-duration` của
mỗi frame phải được tính lại = độ dài file voice thật của dòng đó + đệm ngắn ~0.3–0.5s (không phải
copy y nguyên khung giờ từ video trước rồi kiểm tra "vừa trong khung" — cách đó để lại khoảng lặng
chết 2s+ giữa các act, nhịp phim bị chậm). Khi rút ngắn khung, phải rà lại và co giãn tương ứng
TOÀN BỘ mốc thời gian animation nội bộ của frame đó (từng `tl.fromTo(..., t)`) để nhịp cuối cùng
(stat/card cuối) vẫn kịp hạ cánh trước khi khung kết thúc — không chỉ đổi `data-duration` rồi để
animation bị cắt cụt.

**[QUAN TRỌNG — mỗi video phải có cách dựng khác nhau, không lặp lại y nguyên bố cục video trước]**:
giữ nguyên brand (màu, font, 7 act, image-first, sentence case, anchor cố định...) nhưng BỐ CỤC/
motion cụ thể của từng khung hình (cách sắp chữ, loại biểu đồ, kiểu card...) nên thay đổi giữa các
video để kênh không bị nhàm/rập khuôn — không copy-paste HTML/CSS của một frame từ video trước rồi
chỉ đổi nội dung chữ.

**[Cập nhật 2026-08-25 — bộ 10 cách dựng chính thức + cơ chế xoay vòng]**: thay vì tự nghĩ bố cục
mới mỗi lần (dễ trôi dạt khỏi brand), dùng danh mục cố định 10 "cách dựng" tại
`CONSTRUCTION-STYLES-BOT-BAN-HANG.md`. Trước khi dựng video mới, đọc `style-rotation-state.json`
để biết style tiếp theo trong vòng xoay, dựng theo đúng định hướng của style đó (Hook + Brand
Anchor luôn cố định, không nằm trong style), rồi cập nhật lại `last_used_index` + `log` trong file
đó sau khi hoàn tất. Không tự chọn style ngoài danh mục, không bỏ qua bước cập nhật con trỏ.

## Audio (khi có điều kiện sản xuất)

Nhạc nền: modern business/news/digital/fast-paced/minimal/professional, không lớn hơn voiceover.
**[Quy tắc bắt buộc, áp dụng cho TOÀN BỘ tuyến video kinh doanh/đời sống của kênh — 2026-08-27]
Nhạc nền LUÔN 100% không lời (instrumental)** — thể hiện đúng tinh thần tin tức/đưa tin, chuyên
nghiệp, nghiêm túc; không dùng bất kỳ track nào có giọng hát/vocal/lyrics/choir dù chỉ thoáng qua
hay ở nền xa. Đây là quy tắc thương hiệu cố định, không phải lựa chọn theo từng video — xem cách
áp dụng cụ thể (Lyria `--negative-prompt`) ở mục "Nhạc nền & SFX" trong
`PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`.
Sound design: news hit khi headline xuất hiện, data pop khi số liệu xuất hiện, whoosh khi chuyển
cảnh, brand sting ở end card. Voiceover: tiếng Việt, tự nhiên, rõ, nhanh vừa, có năng lượng, không
quá MC truyền hình/quảng cáo.

**Voiceover — giọng chuẩn kênh (từ 2026-08-25):** ElevenLabs, giọng **"Khánh Lâm - tin tức, thời
sự"** (`voice_id: RCmOaM1iiIH5xX3QXjIF`) — người dùng đã nâng cấp gói ElevenLabs trả phí để dùng
giọng này.

**[QUAN TRỌNG — BẮT BUỘC dùng `model_id: eleven_v3`, KHÔNG dùng `eleven_multilingual_v2`]**:
lần dựng đầu tiên dùng `eleven_multilingual_v2` cho ra giọng đọc sai hẳn — nghe như tiếng nước
khác (không phải tiếng Việt), dù văn bản đầu vào và `voice_id` đều đúng. Nguyên nhân xác nhận qua
API `GET /v1/models`: `eleven_multilingual_v2` KHÔNG có tiếng Việt (`vi`) trong danh sách ngôn ngữ
hỗ trợ (dù tên gọi là "Multilingual"), chỉ hỗ trợ 29 ngôn ngữ không gồm tiếng Việt. `eleven_v3` hỗ
trợ 74 ngôn ngữ và CÓ tiếng Việt. Luôn kiểm tra `GET /v1/models` trước khi chọn `model_id` cho một
ngôn ngữ mới, đừng suy đoán từ tên model. Trước khi giao video có giọng đọc mới/ngôn ngữ mới, luôn
verify bằng cách phiên âm ngược (`whisper`/Parakeet, `language` ép đúng ngôn ngữ) rồi so với văn
bản gốc — sai lệch kiểu nhầm âm gần giống (vd. "lấn"→"lớn") là bình thường (do model ASR yếu với
tiếng Việt), nhưng câu hoàn toàn không khớp cấu trúc/nghĩa là dấu hiệu giọng đọc sai ngôn ngữ.

Tạo TỪNG DÒNG script riêng (một file mp3/dòng, khớp `data-start` của frame tương ứng), KHÔNG gộp
cả kịch bản thành một lần gọi API — dễ chỉnh sửa/thay riêng từng dòng và dễ so khớp thời lượng với
từng khung hình. `eleven_v3` đọc nhịp độ tự nhiên vừa đủ nên thường không cần chỉnh `speed`; nếu
một dòng vẫn dài hơn khung hình quá ±0.5–1s, thử tăng `voice_settings.speed` (khoảng 1.05–1.15,
giữ tự nhiên) trước khi cân nhắc đổi thời lượng khung hình — ưu tiên giữ đúng cấu trúc 8-act đã
dựng. Sau khi có đủ các dòng, gắn từng `<audio>` với `data-audio-group="voiceover"`, rồi chạy
`node <hyperframes-audio skill dir>/scripts/carve.mjs --comp index.html` để tự động duck nhạc nền
dưới giọng đọc (ghi `data-fx-carve` lên track BGM, `sources` tự động trỏ về group "voiceover").

## Typography

**Font chuẩn cho toàn bộ hệ thống: Montserrat** (thay cho cặp Barlow + IBM Plex Mono trước đó — người dùng nhận xét cặp cũ "quá AI", đổi hẳn sang Montserrat cho MỌI vai trò chữ: headline/display, body, VÀ nhãn/chrome viết hoa tracked (kicker, badge, index số) — không còn dùng font monospace riêng cho nhãn nữa, tất cả cùng một họ chữ Montserrat, chỉ khác weight). Weight cần tải: 400/500/600/700/800/900, self-host 2 subset latin+vietnamese mỗi weight (theo đúng kỹ thuật `@font-face` + `unicode-range` đã dùng cho Barlow trước đây). Khi tải file qua Google Fonts `css2` API bằng `curl`, PHẢI dùng User-Agent của một trình duyệt CŨ (vd. Chrome ~55) — User-Agent hiện đại khiến Google trả về MỘT file woff2 biến thể (variable font) dùng chung cho tất cả các weight (không tách riêng từng weight), không khớp với cấu trúc self-host nhiều file hiện tại của dự án.

## Bài học kỹ thuật từ các lần dựng trước (áp dụng cho MỌI video sau)

- **Logo/Nguồn cố định ở GÓC TRÊN** (logo trên-phải, "Nguồn: …" trên-trái), dựng ở tầng root/index.html, hiện từ sau đoạn Hook (không lặp lại độc lập trong từng frame). Riêng frame Hook (0–~5s) tự mang logo + nguồn + ngày trong panel riêng của nó (xem mục cấu trúc Hook bên dưới) — root anchor chỉ bắt đầu hiện ngay khi Hook kết thúc.
- **Hook (0–~3–5s) dùng cấu trúc title-card**: ảnh thật sắc nét (nửa trên) → panel tối (nửa dưới) chứa, theo đúng thứ tự: (1) masthead nhỏ — icon logo + "Bot Bán Hàng" (sentence case, không phải toàn hoa) → (2) badge viền cam bo góc nhẹ (không phải pill tròn 100%) chứa "Nguồn: … · [ngày]" → (3) tiêu đề lớn bao quát toàn bộ thông tin, số liệu là yếu tố to nhất. Toàn bộ phải hiểu được ngay cả khi tắt tiếng, đọng lại trong vài giây đầu.
- **Chữ hoa/thường**: viết hoa chữ cái đầu mỗi dòng/câu hiển thị + danh từ riêng (Quốc Hội, Chính Phủ, Luật Phát Triển Đô Thị…) viết hoa từng chữ — theo đúng chính tả tiếng Việt thông thường. KHÔNG dùng toàn chữ thường (lowercase) cho câu/cụm từ, KHÔNG dùng toàn chữ hoa cho câu/cụm từ dài. Ngoại lệ: nhãn nhỏ kiểu chrome (IBM Plex Mono, uppercase, tracked — ví dụ "LUẬT QUY ĐỊNH", "Ý NGHĨA VỚI THỊ TRƯỜNG") vẫn giữ toàn hoa vì đó là phong cách nhãn/badge, không phải câu văn. **Bẫy kỹ thuật**: nếu style cha có `text-transform: lowercase/uppercase`, nó ĐÈ LÊN chữ hoa/thường đã gõ trong HTML — phải kiểm tra và gỡ bỏ transform đó, không chỉ sửa nội dung chữ.
- **Không thêm dấu gạch ngang "—" trang trí** giữa các dòng/cụm từ nếu không phục vụ mục đích cụ thể (không phải liệt kê, không phải nối 2 mệnh đề rõ ràng). Ưu tiên xuống dòng đơn giản.
- **Reveal của SVG (đường nối, vòng tròn, node) phải có state ẩn mặc định đáng tin cậy** (`opacity: 0` trong CSS, hoặc `scale: 0` trong tween khởi tạo) — KHÔNG được chỉ dựa vào kỹ thuật vẽ bằng `stroke-dasharray`/`getTotalLength()`, vì `getTotalLength()` không phải lúc nào cũng hoạt động ổn định trên `<circle>`/`<rect>`/`<ellipse>` (khác với `<path>`/`<line>` vốn đáng tin cậy hơn) tùy engine render. Nếu kỹ thuật vẽ đó thất bại âm thầm, phần tử sẽ hiện ra tĩnh, đầy đủ ngay từ đầu.
- **[QUAN TRỌNG — nguyên nhân gốc thật sự của lỗi "vòng tròn cam không rõ mục đích"]**: một `gsap.fromTo(el, {from...}, {to...}, START)` — nếu giá trị `from` TỰ NÓ đã ở trạng thái NHÌN THẤY ĐƯỢC (vd. `{opacity: 0.9, scale: 0.4}`), thì GSAP sẽ hiển thị đúng cặp giá trị `from` đó cho TOÀN BỘ thời gian TRƯỚC `START`, không chỉ đúng một khoảnh khắc — nghĩa là phần tử "hiệu ứng chớp/bùng nổ" (shockwave/burst) sẽ bị lộ tĩnh từ đầu clip cho tới lúc animation thật sự chạy, y hệt như không có animation nào cả. Đây chính xác là nguyên nhân của vòng tròn cam ở Frame 6 (Impact) xuất hiện suốt từ đầu cảnh — thủ phạm là `impact06-impact-ring` (hiệu ứng shockwave), KHÔNG PHẢI `impact06-barrier-ring` (lần sửa trước đã nhắm nhầm phần tử, dù cách phòng ngừa đó — CSS `opacity:0` mặc định — vẫn nên giữ). **Quy tắc bắt buộc**: mọi `fromTo` có giá trị `from` khác trạng thái ẩn (opacity 0 / scale 0) đều phải được coi là NGUY HIỂM — kiểm tra kỹ, hoặc tách thành nhiều tween nhỏ để giá trị `from` luôn là trạng thái ẩn thật sự. Không dùng tween thời lượng gần-0 (`duration: 0.001`) để "chốt tức thời" trước một tween khác — cách này render sai khi engine seek trực tiếp tới một thời điểm (không phát tuần tự); thay vào đó dùng MỘT tween duy nhất với `keyframes: [...]` cho chuyển động nhiều giai đoạn (rise rồi fall) — vừa an toàn với `fromTo`'s from-state, vừa không bị vấn đề "gọi `fromTo` nhiều lần trên cùng target/property chồng nhau".
- **Công cụ debug nhanh, đáng tin hơn `hyperframes snapshot`**: khi `hyperframes preview --background` đang chạy, endpoint `http://localhost:<port>/api/projects/<project>/thumbnail/index.html?t=<giây>&format=png&output=source&v=<cache-bust>` trả PNG render thật (khớp với video render cuối, đã xác minh) — nhanh hơn render toàn bộ video rất nhiều lần khi cần dò một lỗi hiển thị theo mốc thời gian cụ thể. Luôn thêm tham số `v=` ngẫu nhiên/duy nhất mỗi lần gọi vì endpoint có cache phía server.
- **Nền ảnh mờ (blur backdrop) cho các khung dữ liệu**: nếu dùng ảnh thật làm nền mờ phía sau text (thay cho nền đen phẳng), phải để mắt kiểm tra rằng ảnh đủ sáng để nhận ra có ảnh (không bị scrim che gần như 100%), nhưng vẫn đảm bảo contrast chữ đạt WCAG AA.
- **[QUAN TRỌNG — không dùng selector `#root[data-composition-id="..."]` cho style gốc của một frame, chỉ dùng `#root` trơn]**: phát hiện khi dựng video thứ 2 — frame `03-key-facts.html` dùng `#root[data-composition-id="03-key-facts"] { ... font-family: 'Montserrat'... }` (copy nguyên từ file mẫu) khiến MỌI chữ dựa vào kế thừa font từ `#root` (không tự khai `font-family` riêng) bị rơi về font mặc định của trình duyệt (Times New Roman) — lỗi im lặng, không có trong lint, chỉ thấy được khi xem ảnh render thật. Nguyên nhân: trong DOM cuối cùng (nhiều sub-composition được mount lồng nhau, mỗi cái đều tự có `id="root"` riêng), selector có thêm điều kiện thuộc tính `[data-composition-id="..."]` không khớp ổn định — có thể do thuộc tính này bị xử lý khác đi ở tầng mount/dựng. Dùng `#root { ... }` (không kèm attribute selector) thì hoạt động đúng — đây cũng là cách MỌI frame khác trong dự án đã dùng thành công. **Quy tắc**: luôn dùng `#root { ... }` trơn cho style gốc; nếu một class con không tự khai `font-family` mà trông cậy vào kế thừa, phải kiểm tra bằng ảnh chụp thật (không chỉ đọc code) — không có cách nào lint tự phát hiện lỗi này.
- **[QUAN TRỌNG — không bao giờ dùng `width` cố định (px) cho container chứa số/chữ auto-fit]**: đã tái diễn 2 lần trên 2 video khác nhau (Hook "391.000 TỶ" và Frame 2 counter "100") — một `width: NNNpx` được đặt cho nội dung của video TRƯỚC (vd. counter 2 chữ số "93") sẽ tràn/vỡ layout khi video SAU có nội dung dài hơn (vd. 3 chữ số "100"), vì kích thước chữ thật ở font-size lớn (150-500px) không tự động co theo. Luôn: (1) để container auto-width (không set `width`), hoặc (2) nếu dùng `fitTextFontSize`, đừng tin tưởng mù quáng — hàm này đã đo sai kích thước ít nhất 2 lần (dường như không tính `letter-spacing` khi đo), luôn verify bằng ảnh chụp thật qua Studio thumbnail trước khi coi là xong, sẵn sàng hardcode font-size nếu hàm fit vẫn cho kết quả tràn/đè chữ. (3) Nếu số + đơn vị (vd. "391.000" + "tỷ đồng") nằm cùng dòng, tách thành 2 phần tử riêng (số auto-fit/hardcode + nhãn đơn vị cỡ chữ cố định nhỏ) thay vì gộp chung một chuỗi có dấu cách vào một khối auto-fit — dấu cách có thể khiến trình duyệt tự xuống dòng dù hàm fit tính là "vừa".

## Final QC Checklist

Brand (đúng #E8441E, logo cố định góc dưới-phải, không quá lớn) · Text (headline dễ đọc, số liệu
nổi bật, keyword highlight, đúng màu, không nhồi chữ) · Motion (sinh động nhưng không lấn át text,
animation đồng bộ, không effect thừa) · Image (ảnh thật, nằm trong Article Image Card, không che
nội dung, có tag khi cần) · Source (xuất hiện xuyên suốt, góc dưới-trái, đúng nguồn, không bị che) ·
Editorial (tin tức là trung tâm, không clickbait sai sự thật, không tự bịa số liệu/nguồn, người xem
hiểu được câu chuyện sau khi xem hết).

## Nguyên tắc sáng tạo cốt lõi

**TEXT kể chuyện. MOTION giải thích. IMAGE chứng minh. BRAND tạo nhận diện.** Không đảo ngược thứ
tự. Cảm giác cần đạt: "một bản tin kinh doanh hiện đại được thiết kế bằng ngôn ngữ motion graphics"
— không phải "một poster quảng cáo được làm thành video."

---

*Bản đầy đủ do người dùng cung cấp (45 mục, tiếng Việt) được lưu trong lịch sử hội thoại; file này
là bản rút gọn dùng để tham chiếu nhanh khi dựng từng video. Khi cần chi tiết đầy đủ hơn (vd. toàn
bộ danh sách signature motion, ví dụ keyword highlight), hỏi lại người dùng hoặc tra lại yêu cầu gốc.*
