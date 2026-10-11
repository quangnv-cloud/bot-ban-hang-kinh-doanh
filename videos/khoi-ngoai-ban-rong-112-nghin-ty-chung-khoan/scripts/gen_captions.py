#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (frame 1) intentionally excluded per brand rule.
Usage: python3 scripts/gen_captions.py
"""
import json

TEXTS = [
    "Lũy kế từ đầu năm đến phiên 9 tháng 10, khối ngoại mua 554.545 tỷ đồng, bán 666.842 tỷ đồng, bán ròng 112.297 tỷ đồng.",
    "Riêng tuần 5 đến 9 tháng 10, khối ngoại bán ròng khoảng 13.917 tỷ đồng, trong đó phiên 9 tháng 10 chiếm gần 70 phần trăm, tương đương 9.732 tỷ đồng.",
    "Nguyên nhân chính là giao dịch thỏa thuận hơn 64,2 triệu cổ phiếu Masan Consumer, giá 150.000 đồng một cổ phiếu, tổng giá trị 9.641 tỷ đồng, khiến bán ròng khớp lệnh thực chỉ còn khoảng 188 tỷ đồng.",
    "Tính từ đầu năm, các mã bán ròng mạnh nhất gồm VHM 22.720 tỷ đồng, FPT 14.990 tỷ đồng, và VIC 10.580 tỷ đồng.",
    "Cổ phiếu Masan Consumer giảm 0,4 phần trăm, đóng cửa tuần ở 143.000 đồng, sau 5 phiên tăng liên tiếp; VN-Index vẫn giằng co quanh vùng hỗ trợ 1.730 điểm.",
]

# (frame/voice start, measured voice duration) for frames 2..6 — matches index.html
TIMING = [(6.4, 10.632), (17.432, 9.000), (26.832, 11.904), (39.136, 8.904), (48.440, 9.816)]
LEAD_IN = 0.08
TAIL = 0.15

PAUSES = {",": 0.16, ";": 0.18, ":": 0.18, ".": 0.0}


def tokenize(text):
    tokens = []
    for tok in text.split():
        core, pause = tok, 0.0
        while core and core[-1] in PAUSES:
            pause += PAUSES[core[-1]]
            core = core[:-1]
        tokens.append({"display": tok, "weight": max(1, len(core)), "pause": pause})
    return tokens


def layout_line(start, duration, text):
    tokens = tokenize(text)
    budget = max(0.1, duration - LEAD_IN - TAIL - sum(t["pause"] for t in tokens))
    scale = budget / sum(t["weight"] for t in tokens)
    words, t = [], start + LEAD_IN
    for tok in tokens:
        end = t + tok["weight"] * scale
        words.append({"text": tok["display"], "start": round(t, 3), "end": round(end, 3)})
        t = end + tok["pause"]
    return words


def chunk_words(words, size_min=3, size_max=6):
    groups, cur = [], []
    for idx, w in enumerate(words):
        cur.append(w)
        remaining = len(words) - idx - 1
        at_punct = w["text"][-1] in ",;:."
        if (at_punct and len(cur) >= size_min) or len(cur) == size_max:
            if 0 < remaining < size_min and len(cur) + remaining <= size_max + 1:
                continue
            groups.append(cur)
            cur = []
    if cur:
        if groups and len(cur) < size_min:
            groups[-1].extend(cur)
        else:
            groups.append(cur)
    return [{"start": c[0]["start"], "end": c[-1]["end"], "words": c} for c in groups]


groups = []
for (start, dur), text in zip(TIMING, TEXTS):
    groups.extend(chunk_words(layout_line(start, dur, text)))
print(json.dumps(groups, ensure_ascii=False))
