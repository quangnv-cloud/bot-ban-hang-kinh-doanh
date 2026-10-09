#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (frame 1) intentionally excluded per brand rule.
Fallback used because ElevenLabs STT quota is exhausted (character_count 121029/121029).
Usage: python3 scripts/gen_captions.py
"""
import json

TEXTS = [
    "Theo Dân Trí, chỉ số đô la Mỹ tăng lên mức cao nhất trong 18 tháng, trong khi tỷ giá trung tâm do Ngân hàng Nhà nước công bố lại giảm nhẹ.",
    "Chỉ số đô la Mỹ tăng từ 98,8 điểm lên 102,3 điểm kể từ đầu tháng 9, còn tỷ giá trung tâm giảm 4 đồng, xuống 25.634 đồng cho một đô la Mỹ.",
    "102,3 điểm là mức cao nhất của chỉ số đô la Mỹ trong 18 tháng qua.",
    "Đồng đô la Mỹ tăng nhờ giá dầu leo thang, căng thẳng Trung Đông, và kỳ vọng Cục Dự trữ Liên bang Mỹ tăng lãi suất, trong khi tỷ giá Việt Nam được giữ ổn định nhờ lãi suất tiền đồng vẫn cao, cán cân thương mại thặng dư, và dòng vốn đầu tư nước ngoài tích cực.",
    "Theo đó, Vietcombank và BIDV cùng giảm giá bán ra 30 đồng, xuống 26.140 đồng, còn ACB, Eximbank và Sacombank giảm 40 đồng, xuống khoảng 26.120 đồng cho một đô la Mỹ.",
]

# (frame/voice start, measured voice duration) for frames 2..6 — matches index.html
TIMING = [(5.46, 6.456), (12.32, 9.192), (21.91, 4.368), (26.73, 11.952), (39.08, 11.856)]
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
