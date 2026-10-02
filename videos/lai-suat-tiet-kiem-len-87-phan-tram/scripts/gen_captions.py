#!/usr/bin/env python3
"""Deterministic word-timestamp estimation for caption karaoke (no network, no
STT) — ElevenLabs STT quota still exhausted (shared with TTS char pool, see
PRODUCTION-WORKFLOW-BOT-BAN-HANG.md section 2, 2026-09-30 note). Follows the
same algorithm family used for prior videos while quota is unavailable:
character-length-ratio weighting per word + fixed punctuation pause budget,
word durations scaled to the real measured voice-file duration for each line.
"""
import json

LINES = [
    {
        "start": 6.400,
        "duration": 9.408,
        "text": "VPBank cộng thêm lãi suất tối đa một phẩy sáu điểm phần trăm cho hội viên ưu tiên, đưa lãi suất kỳ hạn mười hai đến mười ba tháng lên tám phẩy bảy phần trăm một năm, mức cao nhất đang được chào trên thị trường.",
    },
    {
        "start": 16.208,
        "duration": 8.304,
        "text": "Techcombank cộng thêm tối đa một phẩy tám điểm phần trăm, đưa lãi suất cao nhất lên tám phẩy bốn phần trăm một năm; Ngân hàng Quân Đội cũng đưa kỳ hạn sáu tháng lên tám phần trăm một năm.",
    },
    {
        "start": 24.912,
        "duration": 7.896,
        "text": "Tám phẩy bảy phần trăm một năm là mức lãi suất tiết kiệm cao nhất hiện nay, VPBank áp dụng cho khách hàng gửi từ năm mươi triệu đồng ở kỳ hạn mười hai đến mười ba tháng.",
    },
    {
        "start": 33.208,
        "duration": 9.720,
        "text": "Theo biểu lãi suất niêm yết, mức cao nhất tăng dần theo kỳ hạn: ba tháng bốn phẩy bảy lăm phần trăm, sáu tháng bảy phẩy sáu phần trăm, chín tháng bảy phẩy bảy phần trăm, mười hai tháng bảy phẩy tám phần trăm một năm.",
    },
    {
        "start": 43.328,
        "duration": 11.976,
        "text": "Lãi suất trái phiếu ngân hàng cũng leo thang, PVcomBank phát hành trái phiếu kỳ hạn mười năm, lãi suất năm đầu mười phẩy năm phần trăm; lãi suất liên ngân hàng qua đêm giảm xuống không phẩy năm phần trăm, thấp nhất từ tháng sáu năm hai nghìn không trăm hai mươi hai.",
    },
]

PAUSE_COMMA = 0.15
PAUSE_SEMI = 0.18
PAUSE_COLON = 0.18


def tokenize(text):
    raw = text.split(" ")
    tokens = []
    for tok in raw:
        tok = tok.strip()
        if not tok:
            continue
        pause = 0.0
        core = tok
        while core and core[-1] in ",;:.":
            if core[-1] == ",":
                pause += PAUSE_COMMA
            elif core[-1] == ";":
                pause += PAUSE_SEMI
            elif core[-1] == ":":
                pause += PAUSE_COLON
            core = core[:-1]
        tokens.append({"display": tok, "weight": max(1, len(core)), "pause": pause})
    return tokens


def layout_line(start, duration, text):
    tokens = tokenize(text)
    total_pause = sum(t["pause"] for t in tokens)
    total_weight = sum(t["weight"] for t in tokens)
    speak_budget = max(0.1, duration - total_pause)
    scale = speak_budget / total_weight
    words = []
    t = start
    for tok in tokens:
        w_start = t
        w_dur = tok["weight"] * scale
        w_end = w_start + w_dur
        words.append({"text": tok["display"], "start": round(w_start, 3), "end": round(w_end, 3)})
        t = w_end + tok["pause"]
    return words


def chunk_words(words, size_min=3, size_max=6):
    groups = []
    i = 0
    n = len(words)
    while i < n:
        remaining = n - i
        size = size_max if remaining > size_max else remaining
        if remaining - size_max == 1 or remaining - size_max == 2:
            size = size_max - 1
        if size < size_min and groups:
            size = remaining
        chunk = words[i:i + size]
        groups.append({
            "start": chunk[0]["start"],
            "end": chunk[-1]["end"],
            "words": chunk,
        })
        i += size
    return groups


all_groups = []
for line in LINES:
    words = layout_line(line["start"], line["duration"], line["text"])
    groups = chunk_words(words)
    all_groups.extend(groups)

print(json.dumps(all_groups, ensure_ascii=False))
