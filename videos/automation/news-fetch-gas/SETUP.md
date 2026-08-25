# Setup — News Fetch Proxy (Google Apps Script)

Lớp lấy tin cho cloud routine của kênh BOT BÁN HÀNG · KINH DOANH. Xem kiến trúc tổng thể ở mục 10
của `../../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`.

## Các bước (làm 1 lần)

1. Tạo 1 Google Sheet mới (Google Drive → New → Google Sheets), đặt tên tuỳ ý (vd. "BBH News
   Queue").
2. Trong Sheet: **Extensions → Apps Script**. Xoá code mẫu, dán toàn bộ nội dung `Code.gs` (file
   cùng thư mục này) vào.
3. Chạy thử: chọn hàm `fetchAndStore` ở dropdown trên thanh công cụ → **Run**. Lần đầu Google sẽ
   yêu cầu cấp quyền (Authorize) — chấp nhận (script chỉ đọc RSS công khai + ghi vào chính Sheet
   này, không đụng dữ liệu Drive/Gmail khác). Sau khi chạy xong, quay lại Sheet kiểm tra đã có
   sheet con `news_queue` với dữ liệu tin mới chưa.
4. Chọn hàm `installHourlyTrigger` ở dropdown → **Run** một lần — việc này tự tạo lịch chạy
   `fetchAndStore` mỗi giờ (không cần vào tay mục Triggers). Có thể chạy lại hàm này bất cứ lúc
   nào để "reset" trigger nếu cần đổi, không tạo trùng.
5. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (bắt buộc — cloud routine gọi không có OAuth; URL không public
     hiển thị ở đâu ngoài file này nên rủi ro thấp, nhưng vẫn lưu ý: bất kỳ ai có URL đều gọi được
     `doGet`/`doPost`, chỉ trả tin công khai + đánh dấu used, không có gì nhạy cảm)
   - Bấm Deploy, copy **Web app URL** (dạng `https://script.google.com/macros/s/XXXX/exec`).
6. Đưa URL đó cho routine cloud (biến `NEWS_FEED_URL` trong prompt khi tạo routine).

## Cách cloud routine dùng

- Lấy danh sách ứng viên: `GET <URL>?category=business` (hoặc bỏ `category` để lấy cả tin thời sự
  tổng hợp lẫn kinh doanh — routine tự cân nhắc theo mục 1 trong PRODUCTION-WORKFLOW, ưu tiên góc
  độ kinh doanh/tác động kinh tế).
- Sau khi chọn 1 tin để dựng video: `POST <URL>` với body
  `{"id": "<id của item đã chọn>", "video": "<tên thư mục project video>"}` để đánh dấu đã dùng,
  tránh 7h/12h30/19h30 cùng ngày trùng tin.

## Bảo trì

- Nếu 1 nguồn đổi đường dẫn RSS (404), sửa URL trong mảng `FEEDS` ở `Code.gs`, dán lại vào Apps
  Script editor, Save — không cần deploy lại (code trong 1 deployment "Web app" luôn dùng bản mới
  nhất khi bạn Save, trừ khi bạn đã chọn deploy theo version cố định).
- Sheet `news_queue` sẽ phình dần theo thời gian (không tự xoá dòng cũ) — có thể dọn thủ công định
  kỳ (vd. xoá dòng có `used=TRUE` và cũ hơn 30 ngày) nếu muốn, không bắt buộc cho việc vận hành.
