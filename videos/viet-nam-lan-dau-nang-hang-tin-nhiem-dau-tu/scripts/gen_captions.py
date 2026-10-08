#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for karaoke captions (no network, no STT):
character-length weighting per word + fixed punctuation pauses, scaled to each line's
measured voice duration. Hook (frame 1) intentionally excluded per brand rule.
Usage: python3 scripts/gen_captions.py > work/caption-groups.json
"""
import json

TEXTS = [
    "Tổ chức xếp hạng tín nhiệm Nhật Bản, R và I, vừa nâng hạng tín nhiệm nhà phát hành ngoại tệ của Việt Nam, theo công bố của Bộ Tài chính.",
    "Đây là lần đầu tiên Việt Nam được đưa vào nhóm đầu tư, thay vì nhóm đầu cơ như trước đây.",
    "Mức xếp hạng được nâng từ bê bê cộng, triển vọng tích cực, lên bê bê bê trừ, triển vọng ổn định.",
    "Lý do được nêu ra là nền tảng tăng trưởng kinh tế vững chắc, dư địa tài khóa còn lớn, nợ công ở mức tương đối thấp, và cán cân vãng lai tiếp tục thặng dư.",
    "Bộ Tài chính khẳng định kết quả này củng cố niềm tin của nhà đầu tư quốc tế, và tạo điều kiện thuận lợi hơn để huy động nguồn vốn dài hạn.",
]

# (frame/voice start, measured voice duration) for frames 2..6 — matches index.html
TIMING = [(5.46, 6.888), (12.75, 4.464), (17.61, 5.208), (23.22, 7.512), (31.13, 6.648)]
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
