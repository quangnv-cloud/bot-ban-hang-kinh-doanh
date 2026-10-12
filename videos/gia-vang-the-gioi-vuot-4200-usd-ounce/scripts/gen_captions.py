#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for caption karaoke (no STT quota available).
Per-word duration proportional to character length, with a pause weight after
commas/periods/semicolons. Groups words into 3-6 word chunks for on-screen captions.
Skips line 1 (Hook) per brand rule -- caption karaoke never overlays the Hook.
"""
import json, re, sys

# (line_index, data_start, voice_duration) for lines 2..6 (absolute composition seconds)
LINES = [
    (2, 6.184, 7.248),
    (3, 13.832, 11.712),
    (4, 25.944, 4.896),
    (5, 31.240, 10.632),
    (6, 42.272, 8.856),
]

SCRIPT_TEXT = {
    2: "Giá vàng đã neo trên bốn nghìn hai trăm đô la Mỹ một ounce trong hai phiên liên tiếp, đảo chiều sau một tuần giảm sâu vì lợi suất trái phiếu và đô la Mỹ tăng.",
    3: "Giá vàng giao ngay tăng mười lăm phẩy tám đô la Mỹ, lên bốn nghìn hai trăm mười phẩy chín đô la Mỹ; vàng tương lai tháng mười hai trên Comex lên khoảng bốn nghìn hai trăm hai mươi sáu đô la Mỹ; bạc giao ngay tăng không phẩy sáu phần trăm, lên sáu mươi mốt đô la Mỹ.",
    4: "Bốn nghìn hai trăm mười phẩy chín đô la Mỹ một ounce — mức giá vàng giao ngay cao nhất trong vùng giá kỷ lục.",
    5: "Lực mua bắt đáy và giá dầu hạ nhiệt đã giúp vàng đảo chiều; dầu Brent giảm một phẩy ba phần trăm, xuống quanh một trăm lẻ ba đô la Mỹ một thùng, sau khi Nga và Ukraine đồng ý ngừng tấn công các cơ sở năng lượng của nhau.",
    6: "Các kim loại quý khác cũng đồng loạt tăng, bạch kim lên một nghìn sáu trăm chín mươi bảy đô la Mỹ, palladium lên một nghìn một trăm bốn mươi hai đô la Mỹ; chứng khoán Mỹ cũng tiếp tục xu hướng tăng.",
}

def words_with_weights(text):
    tokens = text.split(" ")
    out = []
    for tok in tokens:
        bare = tok.strip()
        if not bare:
            continue
        w = len(re.sub(r"[^\wÀ-ỹ]", "", bare, flags=re.UNICODE))
        w = max(w, 1)
        pause = 0.0
        if re.search(r"[,;]\s*$", bare):
            pause = 0.9
        elif re.search(r"[.!?—]\s*$", bare):
            pause = 1.4
        out.append((bare, w, pause))
    return out

all_chunks = []
for idx, start, dur in LINES:
    text = SCRIPT_TEXT[idx]
    wws = words_with_weights(text)
    total_weight = sum(w + p for _, w, p in wws)
    t = start
    word_abs = []
    for word, w, p in wws:
        d = (w / total_weight) * dur
        word_abs.append((word, round(t, 3)))
        t += d
        t += (p / total_weight) * dur * 0  # pause already baked into weight denom
    # group into chunks of 3-5 words
    chunk = []
    for i, (word, ts) in enumerate(word_abs):
        chunk.append((word, ts))
        is_last = i == len(word_abs) - 1
        if len(chunk) >= 5 or is_last or (len(chunk) >= 3 and word.endswith((",", ";"))):
            chunk_start = chunk[0][1]
            # end = start of next word after chunk, or line end
            if i + 1 < len(word_abs):
                chunk_end = word_abs[i + 1][1]
            else:
                chunk_end = start + dur
            all_chunks.append([round(chunk_start, 3), round(chunk_end, 3), [[w_, t_] for w_, t_ in chunk]])
            chunk = []

print(json.dumps(all_chunks, ensure_ascii=False))
