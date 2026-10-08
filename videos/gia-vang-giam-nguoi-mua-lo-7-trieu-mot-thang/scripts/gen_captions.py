#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (line 1) intentionally excluded per brand rule.
Usage: python3 scripts/gen_captions.py > work/caption-groups.json
"""
import json

TEXTS = [
    "Sáng ngày 8 tháng 10, giá vàng thế giới và trong nước đồng loạt giảm, nối dài chuỗi điều chỉnh của thị trường kim loại quý.",
    "Giá vàng thế giới hiện khoảng 4.111 đô la Mỹ mỗi ounce, giảm khoảng 49 đô la Mỹ, tương đương 1,2%, trong 24 giờ. Giá vàng miếng SJC giao dịch quanh 140 đến 143 triệu đồng mỗi lượng. Giá vàng vòng khoảng 139,5 đến 142,5 triệu đồng mỗi lượng.",
    "So với mức đỉnh 1 tháng là 147,1 triệu đồng mỗi lượng, người mua vàng miếng SJC hiện lỗ hơn 7 triệu đồng mỗi lượng, tương đương gần 4,8%.",
    "Nếu so với mức đỉnh của tháng 1 năm 2026, người mua vàng hiện lỗ tới 51 triệu đồng mỗi lượng.",
    "Giá vàng trong nước hiện vẫn cao hơn giá thế giới quy đổi khoảng 12,5 triệu đồng mỗi lượng.",
]

# (frame/voice start, measured voice duration) for lines 2..6 — matches index.html
TIMING = [(4.25, 6.048), (10.70, 17.568), (28.70, 8.352), (37.45, 5.904), (43.75, 4.704)]
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
