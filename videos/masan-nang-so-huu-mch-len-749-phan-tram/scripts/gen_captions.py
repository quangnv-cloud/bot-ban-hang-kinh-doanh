#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (frame 1) intentionally excluded per brand rule.
Fallback used because ElevenLabs STT quota is exhausted (character_count 121029/121029).
Usage: python3 scripts/gen_captions.py
"""
import json

TEXTS = [
    "Masan Group vừa đăng ký mua thêm cổ phần tại Masan Consumer, mở đầu lộ trình gia tăng ảnh hưởng ở các mảng kinh doanh cốt lõi.",
    "Masan Group đăng ký mua tối đa 73 triệu cổ phiếu Masan Consumer, tương đương 5,6 phần trăm cổ phiếu lưu hành, thực hiện trong 15 ngày, bắt đầu từ ngày 9 tháng 10.",
    "Nếu hoàn tất, tỷ lệ sở hữu của Masan Group tại Masan Consumer sẽ tăng từ 69,4 phần trăm lên 74,9 phần trăm.",
    "Masan Group cho biết không vay nợ mới, mà dùng cổ tức từ các công ty thành viên và tiền sẵn có; tỷ lệ nợ vay ròng trên lợi nhuận trước thuế, lãi vay và khấu hao vẫn giảm, từ 2,4 lần xuống khoảng 2,3 lần vào cuối năm 2026.",
    "Quý 3 năm 2026, Masan Consumer ghi nhận doanh thu tăng khoảng 16 phần trăm so với cùng kỳ. Từ năm 2017 đến giữa năm 2026, công ty đã chi trả cho cổ đông tổng cộng khoảng 1,8 tỷ đô la Mỹ.",
]

# (frame/voice start, measured voice duration) for frames 2..6 — matches index.html
TIMING = [(5.392, 6.144), (11.936, 8.472), (20.808, 6.720), (27.928, 12.456), (40.784, 12.432)]
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
