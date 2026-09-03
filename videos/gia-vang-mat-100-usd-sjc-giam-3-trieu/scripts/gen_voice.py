import os
import sys
import json
import urllib.request

API_KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE_ID = "RCmOaM1iiIH5xX3QXjIF"
MODEL_ID = "eleven_v3"

LINES = {
    1: "Sáng 2 tháng 9, giá vàng thế giới lao dốc hơn 109 đô la một ounce, kéo giá vàng miếng SJC trong nước giảm tiếp.",
    2: "Giá vàng giao dịch quanh 4.320 đô la một ounce, giảm khoảng 2,4% so với phiên trước, mức thấp nhất kể từ ngày 19 tháng 8.",
    3: "Tính từ đỉnh gần 4.700 đô la lập ngày 24 tháng 8, giá vàng thế giới đã mất gần 400 đô la một ounce.",
    4: "Tại thị trường trong nước, vàng miếng SJC giảm 3,4 triệu đồng một lượng so với trước kỳ nghỉ lễ, còn 143,8 đến 145,3 triệu đồng.",
    5: "Đà giảm diễn ra khi đồng đô la mạnh lên, chỉ số USD lên 99,7 điểm, còn lợi suất trái phiếu Mỹ kỳ hạn 10 năm tăng lên khoảng 4,79%.",
    6: "Quy đổi theo tỷ giá hiện tại, giá vàng trong nước vẫn cao hơn giá thế giới khoảng 11,7 triệu đồng một lượng.",
}

OUT_DIR = "assets/voice"
os.makedirs(OUT_DIR, exist_ok=True)

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

for idx, text in LINES.items():
    body = json.dumps({
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
        },
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("xi-api-key", API_KEY)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "audio/mpeg")
    out_path = os.path.join(OUT_DIR, f"line{idx}.mp3")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
            with open(out_path, "wb") as f:
                f.write(data)
            print(f"line{idx}.mp3: OK, {len(data)} bytes")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        print(f"line{idx}.mp3: HTTP ERROR {e.code}: {err_body}", file=sys.stderr)
        sys.exit(1)
