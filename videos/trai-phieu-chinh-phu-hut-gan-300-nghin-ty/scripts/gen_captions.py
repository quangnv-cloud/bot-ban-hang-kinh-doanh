#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (frame 1) intentionally excluded per brand rule.
Usage: python3 scripts/gen_captions.py
"""
import json

TEXTS = [
    "Đầu tháng 10, Kho bạc Nhà nước chào bán 8.000 tỷ đồng trái phiếu, nhận đặt mua tới 17.600 tỷ đồng, huy động thành công 12.000 tỷ đồng.",
    "Nhu cầu tập trung mạnh vào kỳ hạn 10 năm, đây là lần thứ ba trong một tháng kỳ hạn này được đặt mua vượt xa khối lượng gọi thầu, lãi suất trúng thầu 4,43% một năm.",
    "Lũy kế đến hết tháng 9, Kho bạc Nhà nước đã huy động gần 300.000 tỷ đồng trái phiếu Chính phủ, hoàn thành 60% kế hoạch phát hành cả năm.",
    "Trong cơ cấu tháng 9, kỳ hạn 10 năm chiếm 63,3%, kỳ hạn 5 năm chiếm 36,6%; lãi suất cả ba kỳ hạn đều tăng so với cuối tháng 8.",
    "Trên thị trường thứ cấp, giá trị giao dịch bình quân tăng 26,7% so với tháng trước; tuần tới, Kho bạc Nhà nước tiếp tục gọi thầu 17.000 tỷ đồng trái phiếu kỳ hạn 10 năm.",
]

# (frame/voice start, measured voice duration) for frames 2..6 — matches index.html
TIMING = [(6.26, 7.536), (14.20, 8.520), (23.12, 7.296), (30.82, 8.592), (39.81, 9.192)]
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
