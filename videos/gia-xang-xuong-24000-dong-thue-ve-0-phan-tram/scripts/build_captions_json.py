import json

LINES = [
    {"file": "assets/audio/stt2.json", "offset": 6.64, "act": "what-happened"},
    {"file": "assets/audio/stt3.json", "offset": 15.56, "act": "key-facts"},
    {"file": "assets/audio/stt4.json", "offset": 26.42, "act": "data-moment"},
    {"file": "assets/audio/stt5.json", "offset": 35.03, "act": "context"},
    {"file": "assets/audio/stt6.json", "offset": 47.55, "act": "impact"},
]

CHUNK_SIZE = 6
groups = []

for line in LINES:
    data = json.load(open(line["file"], encoding="utf-8"))
    words = [w for w in data["words"] if w["type"] == "word"]
    offset = line["offset"]
    for i in range(0, len(words), CHUNK_SIZE):
        chunk = words[i:i + CHUNK_SIZE]
        group_words = []
        for w in chunk:
            group_words.append({
                "text": w["text"],
                "start": round(w["start"] + offset, 3),
                "end": round(w["end"] + offset, 3),
            })
        group = {
            "act": line["act"],
            "start": group_words[0]["start"],
            "end": group_words[-1]["end"] + 0.3,
            "words": group_words,
        }
        groups.append(group)

# Clamp end of each group so it never overlaps the next group's start.
for i in range(len(groups) - 1):
    next_start = groups[i + 1]["start"]
    if groups[i]["end"] > next_start - 0.05:
        groups[i]["end"] = round(next_start - 0.05, 3)

with open("assets/captions.json", "w", encoding="utf-8") as f:
    json.dump(groups, f, ensure_ascii=False, indent=2)

print("wrote assets/captions.json, groups:", len(groups))
for g in groups:
    txt = " ".join(w["text"] for w in g["words"])
    print(f"  [{g['start']:.2f}-{g['end']:.2f}] ({g['act']}) {txt}")
