import json

groups = json.load(open('assets/captions.json', encoding='utf-8'))

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

html_groups = []
js_lines = []

for gi, g in enumerate(groups):
    gid = f"cap{gi}"
    word_spans = []
    for wi, w in enumerate(g['words']):
        wid = f"{gid}_w{wi}"
        word_spans.append(f'<span class="w" id="{wid}">{esc(w["text"])}</span>')
    html_groups.append(
        f'<div class="cap-group" id="{gid}" data-act="{g["act"]}">'
        + ' '.join(word_spans)
        + '</div>'
    )
    group_start = g['start']
    group_end = g['end']
    fade_in_start = max(0, round(group_start - 0.08, 3))
    js_lines.append(f'  tl.fromTo("#{gid}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.1, ease: "power1.out" }}, {fade_in_start});')
    for wi, w in enumerate(g['words']):
        wid = f"{gid}_w{wi}"
        js_lines.append(f'  tl.fromTo("#{wid}", {{ color: "rgba(255,255,255,0.72)" }}, {{ color: "#E8441E", duration: 0.1, ease: "power1.out" }}, {w["start"]});')
    kill_fade_start = round(group_end - 0.12, 3)
    js_lines.append(f'  tl.to("#{gid}", {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, {kill_fade_start});')
    js_lines.append(f'  tl.set("#{gid}", {{ opacity: 0, visibility: "hidden" }}, {group_end});')

html_body = '\n    '.join(html_groups)
js_body = '\n'.join(js_lines)

template = f"""<template>
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
      {html_body}
    </div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js_body}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""

with open('compositions/frames/captions.html', 'w', encoding='utf-8') as f:
    f.write(template)

print('wrote compositions/frames/captions.html, groups:', len(groups))
