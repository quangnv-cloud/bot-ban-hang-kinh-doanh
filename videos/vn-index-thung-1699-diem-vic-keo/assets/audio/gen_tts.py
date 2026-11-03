import json, os, sys

lines = [
    "VN-Index vừa mất mốc 1.700 điểm, giảm 11,1 điểm, đóng cửa ở 1.699,62 điểm — phiên giảm thứ 4 liên tiếp.",
    "Phiên ngày 3 tháng 11, cổ phiếu Vingroup giảm 3,3 phần trăm, kéo chỉ số mất gần 13 điểm — mức ảnh hưởng tiêu cực lớn nhất phiên này.",
    "Dù chỉ số giảm, thị trường vẫn có 349 mã tăng so với 302 mã giảm. Cổ phiếu Hòa Phát tăng 4,2 phần trăm, đóng góp tích cực nhất.",
    "Chỉ số chỉ còn cách mốc 1.700 điểm chưa đầy nửa điểm — đạt 99,98 phần trăm — nhưng vẫn không giữ được, rơi xuống mức thấp nhất trong 2 tuần.",
    "Công ty Chứng khoán MB nhận định thị trường đang lệch pha sâu sắc giữa chỉ số và cổ phiếu. Thanh khoản cũng giảm mạnh, tổng giá trị giao dịch 3 sàn còn khoảng 13 nghìn 463 tỷ đồng.",
    "Tính chung 4 phiên liên tiếp, VN-Index đã giảm tổng cộng 67 điểm. Khối ngoại cũng bán ròng 497 tỷ đồng, đánh dấu phiên bán ròng thứ 8 liên tiếp.",
]

app_id = os.environ["VBEE_APP_ID"]

out_dir = os.path.dirname(os.path.abspath(__file__))
for i, text in enumerate(lines, start=1):
    payload = {
        "app_id": app_id,
        "input_text": text,
        "voice_code": "hn_female_ngochuyen_full_24k-stl",
        "audio_type": "mp3",
        "bitrate": 128,
        "speed_rate": 1.09,
        "response_type": "direct",
    }
    fn = os.path.join(out_dir, f"line{i}.json")
    with open(fn, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    print(fn)
