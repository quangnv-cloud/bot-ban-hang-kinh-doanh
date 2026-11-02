#!/usr/bin/env python3
"""Generate compositions/frames/captions.html from ElevenLabs STT word timestamps.
Skips the Hook act. Chunks words into karaoke groups, clamps group.end to the
next group's start - 0.05 to avoid overlapping caption text (brand lesson)."""
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LINES = [
    {"n": 2, "act": "what-happened", "offset": 4.600},
    {"n": 3, "act": "key-facts", "offset": 17.800},
    {"n": 4, "act": "data-moment", "offset": 29.900},
    {"n": 5, "act": "context", "offset": 37.300},
    {"n": 6, "act": "impact", "offset": 46.800},
]

MAX_WORDS = 6
MAX_CHARS = 30

groups = []  # list of dict(act, words=[(text,start_abs,end_abs)])

for line in LINES:
    stt = json.load(open(os.path.join(BASE, "assets", "stt", f"line{line['n']}.json")))
    words = [w for w in stt["words"] if w["type"] == "word"]
    cur = []
    cur_chars = 0
    for w in words:
        text = w["text"]
        start_abs = w["start"] + line["offset"]
        end_abs = w["end"] + line["offset"]
        would_chars = cur_chars + len(text) + (1 if cur else 0)
        if cur and (len(cur) >= MAX_WORDS or would_chars > MAX_CHARS):
            groups.append({"act": line["act"], "words": cur})
            cur = []
            cur_chars = 0
        cur.append((text, start_abs, end_abs))
        cur_chars += len(text) + (1 if cur_chars else 0)
    if cur:
        groups.append({"act": line["act"], "words": cur})

# Clamp each group's effective end against the next group's first word start.
for i, g in enumerate(groups):
    last_end = g["words"][-1][2]
    if i + 1 < len(groups):
        next_start = groups[i + 1]["words"][0][1]
        g["end_clamped"] = min(last_end + 0.3, next_start - 0.05)
    else:
        g["end_clamped"] = last_end + 0.3

html_groups = []
tween_lines = []

for gi, g in enumerate(groups):
    gid = f"cap{gi}"
    spans = []
    for wi, (text, s, e) in enumerate(g["words"]):
        wid = f"{gid}_w{wi}"
        spans.append(f'<span class="w" id="{wid}">{text}</span>')
    html_groups.append(
        f'<div class="cap-group" id="{gid}" data-act="{g["act"]}">' + " ".join(spans) + "</div>"
    )
    first_start = g["words"][0][1]
    fade_in = round(first_start - 0.08, 3)
    tween_lines.append(
        f'  tl.fromTo("#{gid}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.1, ease: "power1.out" }}, {fade_in});'
    )
    for wi, (text, s, e) in enumerate(g["words"]):
        wid = f"{gid}_w{wi}"
        tween_lines.append(
            f'  tl.fromTo("#{wid}", {{ color: "rgba(255,255,255,0.72)" }}, {{ color: "#E8441E", duration: 0.1, ease: "power1.out" }}, {round(s,3)});'
        )
    fade_out = round(g["end_clamped"] - 0.12, 3)
    if fade_out < fade_in + 0.1:
        fade_out = fade_in + 0.1
    tween_lines.append(
        f'  tl.to("#{gid}", {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, {fade_out});'
    )
    tween_lines.append(
        f'  tl.set("#{gid}", {{ opacity: 0, visibility: "hidden" }}, {round(fade_out+0.12,3)});'
    )

html = f"""<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      font-family: "Montserrat", Arial, sans-serif;
    }}
    .cap-layer {{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 650px;
      width: 880px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: visible;
    }}
    .cap-group {{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 880px;
      text-align: center;
      font-weight: 800;
      font-size: 52px;
      line-height: 1.25;
      letter-spacing: -0.01em;
      opacity: 0;
      visibility: visible;
      text-shadow: 0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6);
    }}
    .cap-group .w {{
      color: rgba(255,255,255,0.72);
    }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
    <div class="cap-layer">
    {chr(10).join("    " + g for g in html_groups)}
    </div>
  </div>
  <script>
    window.__timelines = window.__timelines || {{}};
    const tl = gsap.timeline({{ paused: true }});
{chr(10).join(tween_lines)}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""

out_path = os.path.join(BASE, "compositions", "frames", "captions.html")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)
print("groups:", len(groups))
print("wrote", out_path)
