---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Chính phủ đề xuất giảm 30% thuế cho cá nhân kinh doanh và doanh nghiệp có doanh thu không quá 10 tỷ đồng/năm, áp dụng từ quý III/2026"
destination: tiktok
aspect: 1080x1920
language: vi
audience: "Hộ kinh doanh cá thể, chủ doanh nghiệp nhỏ, người quan tâm chính sách thuế tại Việt Nam"
length: 30s
angle: concept
style_preset: blue-professional
voice: EXAVITQu4vr4xnSDxMaL
---

## Intent

Video tin tức/giải thích chính sách 30 giây, dựng từ bài báo VnExpress về đề xuất
giảm 30% thuế cho cá nhân kinh doanh và doanh nghiệp nhỏ (doanh thu ≤10 tỷ đồng/năm).
Tông giọng: nghiêm túc, đáng tin cậy, đúng chất tin tức tài chính — không giật gân.
Đối tượng: người xem trên TikTok/Reels quan tâm tin kinh doanh, thuế.

Nguồn: https://vnexpress.net/de-xuat-giam-30-thue-cho-ca-nhan-doanh-nghiep-doanh-thu-khong-qua-10-ty-5111385.html

## Assets

- public/logo-bbh.png — logo thương hiệu (từ "Logo BBH - AI Commerce .png" trong thư mục Video AI), đặt góc video làm bug/watermark hoặc sting đóng.
- public/photo-bo-truong-tai-chinh.jpg — ảnh báo chí thật: Bộ trưởng Tài chính Ngô Văn Tuấn tại phiên họp 20/8. Nguồn: Cổng thông tin Điện tử Quốc hội, qua VnExpress.
- public/photo-chu-tich-quoc-hoi.jpg — ảnh báo chí thật: Chủ tịch Quốc hội Trần Thanh Mẫn tại phiên họp 20/8. Nguồn: Cổng thông tin Điện tử Quốc hội, qua VnExpress.

## Customizations

- Ảnh minh họa dùng ảnh báo chí thật lấy từ bài gốc (2 ảnh) làm hình nền/hero cho các frame liên quan, có credit nguồn nhỏ trên hình.
- Text overlay trên khung hình phải chiếm không quá ~20% diện tích khung hình ở mọi thời điểm — ưu tiên số liệu lớn, ít chữ, để ảnh/đồ họa dẫn dắt.
- Giọng đọc (voiceover) tạo bằng ElevenLabs, giọng "Le Binh" (vi, nữ), model eleven_multilingual_v2 — thời lượng audio phải khớp với thời lượng từng frame/video (đồng bộ qua sync-durations).
- Logo công ty (Video AI/Logo BBH - AI Commerce .png) xuất hiện trong video (góc màn hình hoặc closing sting).

## Notes

- Không có nhạc nền (không có kết nối HeyGen/MusicGen khả dụng) — `music: none`, chỉ có voiceover + SFX nhẹ nếu cần.
- Số liệu chính cần truyền tải: giảm 30% thuế phải nộp; áp dụng cho cá nhân kinh doanh doanh thu ≤10 tỷ đồng/năm và doanh nghiệp doanh thu ≤10 tỷ đồng; kỳ tính thuế 2026–2027, hiệu lực từ quý III/2026; ngân sách giảm thu ước 3.191 tỷ đồng (2026) và 3.510 tỷ đồng (2027); đề xuất của Chính phủ qua Bộ trưởng Tài chính Ngô Văn Tuấn.
- Ảnh báo chí có credit nguồn (Cổng thông tin Điện tử Quốc hội / VnExpress) — giữ dòng credit nhỏ khi hiển thị.
- Auto Mode: chạy tự động (automation, storyboard: no), không dừng hỏi từng bước; chỉ dừng ở điểm duyệt cuối (Step 6) trước khi render.
