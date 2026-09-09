# BRIEF — Giá dầu Brent áp sát mốc 100 USD sau đòn tấn công của Houthi

Video tin tức kinh doanh cho kênh **BOT BÁN HÀNG · KINH DOANH** (xem quy tắc brand đầy đủ ở
`../BRAND-SYSTEM-BOT-BAN-HANG.md`, quy trình ở `../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md`).
Construction style vòng xoay này: **1 — Card & Bar** (claim_style index 0, xem
`../CONSTRUCTION-STYLES-BOT-BAN-HANG.md`).

## Mục tiêu

Đưa tin giá dầu thế giới leo thang mạnh sau vụ tấn công cơ sở năng lượng Ả Rập Xê Út — góc nhìn
số liệu/tác động kinh tế toàn cầu (chi phí năng lượng, lạm phát, chuỗi cung ứng) rõ ràng, đúng
định vị kênh.

## Nguồn

- Dân Trí — "Giá dầu áp sát mốc 100 USD khi cơ sở năng lượng của Ả Rập Xê Út bị tấn công" (8/9/2026)
  https://dantri.com.vn/kinh-doanh/gia-dau-ap-sat-moc-100-usd-khi-co-so-nang-luong-cua-a-rap-xe-ut-bi-tan-cong-20260908170217066.htm

Nguồn hiển thị trên video: "Nguồn: Dân Trí"
Ảnh Hook/Article Image Card: tải qua Apps Script proxy (`?image=f32a133eb0f7`), ảnh gốc từ
`icdn.dantri.com.vn` (ảnh cơ sở lọc dầu, theo hãng Reuters).

## Số liệu xác nhận (KHÔNG bịa thêm số ngoài danh sách này)

- Giá dầu Brent hiện **áp sát mốc 100 USD/thùng** — "chỉ còn cách mốc ba chữ số chưa đầy 1 USD"
  (nguyên văn Dân Trí)
- Từ đầu năm 2026 đến nay: **Brent đã tăng hơn 60%**
- Giá diesel chuẩn tại châu Âu: **tiến gần mốc 200 USD/thùng**
- Nguyên nhân trực tiếp: lực lượng **Houthi** tấn công **nhà máy lọc dầu Jazan** (công suất
  **400.000 thùng/ngày**) cùng các cơ sở phục vụ thị trường nội địa của Ả Rập Xê Út, **ngày
  8/9/2026**, tại **miền nam Ả Rập Xê Út** — theo Saudi Press Agency, một số người bị thương
- Bối cảnh: giá đã tăng mạnh **tuần trước** do căng thẳng Trung Đông leo thang + lực mua gia tăng
  từ **Trung Quốc** (nước nhập khẩu dầu lớn nhất thế giới)
- Houthi đang phong tỏa dòng chảy dầu của Ả Rập Xê Út (nhà sản xuất lớn nhất OPEC), đáp trả việc
  Riyadh bao vây thủ đô Yemen
- Tác động thị trường: **tồn kho dầu toàn cầu sụt giảm nhanh chóng**; **giá các sản phẩm tinh chế
  (diesel) tăng vọt trên khắp thế giới**; lo ngại nguồn cung tiếp tục gián đoạn
- Chuyên gia/tổ chức được trích dẫn: **Goldman Sachs** (nhà phân tích Daan Struyven), **Russell
  Hardy** — lãnh đạo tập đoàn **Vitol Group**

## Cấu trúc 6 act

1. **Hook** (cố định, không thuộc style) — headline bao quát: Brent áp sát mốc 100 USD/thùng sau
   vụ Houthi tấn công cơ sở năng lượng Ả Rập Xê Út. Ảnh Hook: ảnh cơ sở lọc dầu đã tải.
2. **What happened** — Card & Bar: card số "01" mô tả sự kiện — Houthi tấn công nhà máy lọc dầu
   Jazan (400.000 thùng/ngày) + các cơ sở nội địa, miền nam Ả Rập Xê Út, ngày 8/9.
3. **Key facts** — 3 card đánh số dọc: (1) Jazan — 400.000 thùng/ngày bị tấn công; (2) Trung Quốc
   tăng mạnh lực mua dầu; (3) Tồn kho dầu toàn cầu sụt giảm nhanh chóng.
4. **Data moment** — con số hero: **100** (đơn vị USD/thùng) — Brent áp sát mốc này, nhãn phụ
   "tăng hơn 60% từ đầu năm". Count-up tới 100 kèm bar climbing lên mốc.
5. **Context** — biểu đồ cột dọc (signature Card & Bar) so sánh 2 mốc giá: Brent +60% từ đầu năm
   vs. Diesel châu Âu ~200 USD/thùng; kèm trích dẫn ngắn Goldman Sachs / Vitol Group cảnh báo
   nguồn cung gián đoạn.
6. **Impact** — act cuối, sự thật/số liệu đã xảy ra (KHÔNG suy đoán tương lai): tồn kho dầu toàn
   cầu đang sụt giảm nhanh chóng; giá diesel đã tăng vọt trên khắp thế giới. Giữ hình + brand
   anchor tới hết video.

## Ghi chú thiết kế

- Style 1 — Card & Bar: thẻ viền bo góc có số thứ tự (What happened, Key facts) + biểu đồ cột dọc
  (Context) — tự thiết kế HTML/CSS/GSAP mới, không copy layout từ 2 video Card & Bar trước đó
  (`lan-bien-chuyen-nhuong-50-dat` là lần đầu dùng style này, giờ style xoay lại lần 2/3 sau nhiều
  vòng — vẫn phải thiết kế bố cục chi tiết khác, không paste lại).
- Đúng quy tắc màu (#E8441E/#FFFFFF/#111111), Montserrat mọi vai trò chữ, sentence case cho câu
  văn (trừ nhãn/chrome viết hoa tracked).
- Act 6 (Impact) chỉ nêu sự thật đã xảy ra (tồn kho giảm, diesel tăng) — không suy đoán giá dầu
  sẽ tăng tiếp hay có chạm mốc 100 USD hay không.
