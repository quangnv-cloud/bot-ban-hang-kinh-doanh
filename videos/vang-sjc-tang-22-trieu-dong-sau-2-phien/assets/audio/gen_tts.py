import json, os, sys

lines = [
    "Giá vàng trong nước bất ngờ quay đầu tăng mạnh. Mỗi lượng vàng miếng Sài Gòn Vàng bạc đá quý tăng thêm hơn 2 triệu đồng chỉ sau 2 phiên giao dịch.",
    "Sáng ngày 3 tháng 11, Công ty Vàng bạc đá quý Sài Gòn niêm yết vàng miếng ở mức 138,2 đến 141,2 triệu đồng một lượng, chênh lệch mua bán khoảng 3 triệu đồng.",
    "Vàng nhẫn trơn cũng tăng 1,2 triệu đồng, lên 134 đến 138 triệu đồng một lượng. Trên thị trường thế giới, mỗi ounce vàng giao ngay tăng 71 đô la Mỹ, lên 3.945 đô la Mỹ.",
    "Tính chung 2 phiên gần nhất, vàng miếng trong nước đã tăng tổng cộng 2,2 triệu đồng mỗi lượng.",
    "Đà tăng này diễn ra ngay sau khi vàng miếng trong nước vừa mất hơn 5 triệu đồng mỗi lượng trong cả tháng 10, mức giảm theo tháng sâu nhất kể từ năm 2008. Giá dầu thô giảm 8% đầu tuần giúp hạ nhiệt lo ngại lạm phát, trong khi nhà đầu tư đang chờ kết quả cuộc bầu cử giữa nhiệm kỳ tại Mỹ.",
    "Chênh lệch giữa giá vàng trong nước và thế giới hiện còn khoảng 15 triệu đồng mỗi lượng, giảm so với mức 16 đến 18 triệu đồng của tuần trước.",
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
