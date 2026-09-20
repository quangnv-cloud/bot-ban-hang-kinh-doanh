# Sheets → iframe embed proxy — Hướng dẫn triển khai

## 1. Việc đã kiểm tra trong repo này

`bot-ban-hang-kinh-doanh` là repo pipeline tạo video tin tức, không liên quan
đến báo cáo CRM/sale. File `.gs` duy nhất trong repo là
`videos/automation/news-fetch-gas/Code.gs` (proxy lấy RSS + phục vụ ảnh cho
video), không đọc/render Google Sheet nào cả.

→ Không tìm thấy Apps Script nào trong repo từng làm việc lấy iframe từ 2
Google Sheet của bạn. Nếu bạn nhớ đã viết script này, nó nằm ở một dự án
Apps Script khác trong tài khoản Google của bạn (script.google.com) — tôi
không có quyền truy cập tài khoản Google để tự kiểm tra danh sách đó, bạn
cần tự mở https://script.google.com/home/all để đối chiếu. Còn không thì
dùng project mới ở đây.

## 2. Project mới: `Code.gs` + `appsscript.json`

Cách hoạt động: script đọc đúng vùng dữ liệu bạn chỉ định trong 1 trong 2
Google Sheet, rồi render lại thành HTML **giữ nguyên định dạng gốc của
ô tính** (màu nền, màu chữ, in đậm, canh lề, merge cell) — nên output giống
hệt ảnh chụp trong Sheet, không phải một bảng tự vẽ theo màu đoán mò.
Web app chạy "Execute as: Me" nên 2 Sheet có thể để private — người xem
iframe trên merchant.vn không cần quyền Google vào Sheet gốc.

### Bước 1 — Tạo project

1. Vào https://script.google.com/home → **New project**.
2. Đổi tên project, ví dụ `Sheets Dashboard Embed`.
3. Xoá nội dung mặc định trong `Code.gs`, dán toàn bộ nội dung file
   `Code.gs` trong thư mục này vào.
4. Vào **Project Settings** (biểu tượng bánh răng) → tick **"Show
   'appsscript.json' manifest file in editor"**.
5. Mở file `appsscript.json` vừa hiện ra, thay nội dung bằng file
   `appsscript.json` trong thư mục này.

### Bước 2 — Deploy làm Web App

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me** (tài khoản Google đang có quyền mở 2 Sheet nguồn).
4. Who has access: **Anyone**.
5. **Deploy** → lần đầu Google sẽ yêu cầu cấp quyền đọc Google Sheets, bấm
   **Authorize access** → chọn tài khoản → **Advanced → Go to (unsafe)**
   nếu Google cảnh báo app chưa verify (bình thường với script tự viết).
6. Copy URL dạng `https://script.google.com/macros/s/AKfycb.../exec`.

### Bước 3 — Lấy URL cho từng báo cáo

Hai report đã được cấu hình sẵn theo đúng 2 link bạn gửi:

| report        | Nguồn                                                                                   |
|---------------|------------------------------------------------------------------------------------------|
| `sale`        | Sheet 1 (`1Sd97m...`, gid `462434893`) — bảng Lịch meet/Chi phí Ads theo Sale             |
| `compare`     | Sheet 2 (`1Zxjj2...`, gid `1616235685`) — bảng So sánh chi tiết tuần 34 vs 35             |

Dán trên trình duyệt để test trước khi nhúng:

```
https://script.google.com/macros/s/AKfycb.../exec?report=sale
https://script.google.com/macros/s/AKfycb.../exec?report=compare
```

Nếu ổn, mở lại và bảng phải hiện đúng như trong Sheet (màu nền xanh của
hàng tiêu đề, dòng "Tổng cộng" in đậm...).

### Bước 4 — Nhúng vào merchant.vn/a/contact

Trong tab báo cáo trên merchant.vn, đặt `src` của khối iframe/embed thành
URL ở Bước 3, ví dụ:

```html
<iframe src="https://script.google.com/macros/s/AKfycb.../exec?report=sale"
        style="width:100%;border:0;height:600px"></iframe>
```

Vì merchant.vn là app nội bộ riêng của bạn (không có trong repo này), tôi
không chỉnh sửa được phần "Loc theo BU" hay khối tiêu đề xanh đậm
"DOANH THU / CHI PHÍ ADS THEO BU" thấy trong ảnh chụp — đó là giao diện do
merchant.vn tự vẽ quanh iframe. Script này chỉ đảm nhiệm phần bảng dữ liệu
bên trong.

## 3. Tham số hỗ trợ thêm

- `?id=<spreadsheetId>&gid=<gid>` — dùng Sheet/tab bất kỳ khác, không cần
  khai báo trước trong `REPORTS`.
- `&range=A1:G14` — chỉ lấy đúng 1 vùng thay vì toàn bộ vùng có dữ liệu của
  tab (hữu ích nếu tab có nhiều bảng).
- `&filterValue=HCM` — chỉ giữ lại các hàng chứa chuỗi này (không phân biệt
  hoa/thường), luôn giữ hàng "Tổng cộng". Dùng để mô phỏng bộ lọc theo BU/
  Sale nếu muốn nhúng nhiều iframe đã lọc sẵn theo từng khu vực.
- `&nocache=1` — bỏ qua cache 5 phút, đọc trực tiếp từ Sheet (dùng khi cần
  thấy thay đổi ngay lập tức).
- `&debug=1` — hiện thông báo lỗi chi tiết thay vì thông báo chung chung,
  dùng khi troubleshoot.

## 4. Giới hạn cần biết

- Cache mặc định 5 phút/mỗi tổ hợp tham số — khớp nhịp "5 phút" tự refresh
  đang thấy trên merchant.vn. Sửa `CACHE_SECONDS` trong `Code.gs` nếu muốn
  nhanh/chậm hơn.
- Nếu đổi cấu trúc cột trong Sheet (thêm/xoá cột, đổi merge), output tự
  động đổi theo vì script đọc trực tiếp từ Sheet — không cần sửa code, trừ
  khi bạn đổi tên tab/gid.
- Muốn thêm report khác: thêm 1 entry vào object `REPORTS` ở đầu
  `Code.gs` với `spreadsheetId`, `gid`, `title`.
