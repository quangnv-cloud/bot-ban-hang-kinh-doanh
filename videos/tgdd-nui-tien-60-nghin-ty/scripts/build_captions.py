#!/usr/bin/env python3
"""Build compositions/frames/captions.html from per-line ElevenLabs STT word timestamps.

Skips the Hook act (scene 1) per brand rule. Groups words into 4-6 word chunks,
clamps each group's end against the next group's start, and emits GSAP tweens
for per-word karaoke color + group fade in/out with a hard kill at group.end.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "assets", "audio")
OUT_PATH = os.path.join(ROOT, "compositions", "frames", "captions.html")

# (line_number, scene_start_time) for acts 2..6 (Hook/act1 excluded from captions)
LINES = [
    (2, 6.328),
    (3, 16.712),
    (4, 27.552),
    (5, 35.344),
    (6, 44.456),
]
TOTAL_DURATION = 54.360
GROUP_PAD_END = 0.30
MIN_GROUP_GAP = 0.05
WORDS_PER_GROUP = 5


def load_words(line_no, scene_start):
    path = os.path.join(AUDIO_DIR, "line{}_stt.json".format(line_no))
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    words = []
    for w in data["words"]:
        if w.get("type") != "word":
            continue
        text = w["text"].strip()
        if not text:
            continue
        words.append({
            "text": text,
            "start": w["start"] + scene_start,
            "end": w["end"] + scene_start,
        })
    return words


def chunk_words(words):
    groups = []
    cur = []
    for w in words:
        cur.append(w)
        ends_sentence = w["text"].endswith((".", "!", "?"))
        if len(cur) >= WORDS_PER_GROUP or ends_sentence:
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return groups


def main():
    all_groups = []
    for line_no, scene_start in LINES:
        words = load_words(line_no, scene_start)
        groups = chunk_words(words)
        all_groups.extend(groups)

    # Compute group start/end + clamp end against next group's start.
    group_meta = []
    for gi, g in enumerate(all_groups):
        start = g[0]["start"]
        raw_end = g[-1]["end"] + GROUP_PAD_END
        if gi + 1 < len(all_groups):
            next_start = all_groups[gi + 1][0]["start"]
            end = min(raw_end, next_start - MIN_GROUP_GAP)
        else:
            end = min(raw_end, TOTAL_DURATION - 0.1)
        if end <= start + 0.1:
            end = start + 0.1
        group_meta.append({"words": g, "start": start, "end": end})

    html_lines = []
    for gi, meta in enumerate(group_meta):
        spans = []
        for wi, w in enumerate(meta["words"]):
            text = (
                w["text"]
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
            )
            spans.append(
                '<span class="w" id="cap{}_w{}">{}</span>'.format(gi, wi, text)
            )
        html_lines.append(
            '    <div class="cap-group" id="cap{}">{}</div>'.format(
                gi, " ".join(spans)
            )
        )

    tween_lines = []
    for gi, meta in enumerate(group_meta):
        start = meta["start"]
        end = meta["end"]
        tween_lines.append(
            '  tl.fromTo("#cap{0}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.1, ease: "power1.out" }}, {1:.3f});'.format(
                gi, start
            )
        )
        for wi, w in enumerate(meta["words"]):
            tween_lines.append(
                '  tl.fromTo("#cap{0}_w{1}", {{ color: "rgba(255,255,255,0.72)" }}, {{ color: "#E8441E", duration: 0.1, ease: "power1.out" }}, {2:.3f});'.format(
                    gi, wi, w["start"]
                )
            )
        fade_start = max(start, end - 0.12)
        tween_lines.append(
            '  tl.to("#cap{0}", {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, {1:.3f});'.format(
                gi, fade_start
            )
        )
        tween_lines.append(
            '  tl.set("#cap{0}", {{ opacity: 0, visibility: "hidden" }}, {1:.3f});'.format(
                gi, end
            )
        )

    template = """<template>
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
      font-size: 50px;
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
{html_body}
    </div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{tween_body}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""

    out = template.format(
        html_body="\n".join(html_lines),
        tween_body="\n".join(tween_lines),
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(out)
    print("Wrote", OUT_PATH, "with", len(group_meta), "caption groups")


if __name__ == "__main__":
    main()
