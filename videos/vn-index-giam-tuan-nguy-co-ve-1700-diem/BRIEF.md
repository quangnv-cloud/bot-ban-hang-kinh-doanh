**[WIP — TẠM DỪNG 2026-11-09]** Dự án này mới hoàn tất bước 1-3 (chọn tin, claim style, viết
BRIEF/SCRIPT) rồi DỪNG vì checkpoint đăng bài `vpbank-sacombank-hut-155-nghin-ty-tien-gui` vẫn
đang treo ở bước 13-16 (bị "Claude Code auto mode classifier" chặn — xem
`../PRODUCTION-WORKFLOW-BOT-BAN-HANG.md` mục "BLOCKER" ngày 2026-11-09). KHÔNG tiếp tục bước 4
(sinh voice) cho tới khi checkpoint đó được đăng xong.

# BRIEF — VN-Index đảo chiều giảm cuối tuần, nguy cơ trở lại vùng 1.700 điểm

## Nguồn
- Znews: "VN-Index đối mặt nguy cơ trở lại vùng 1.700 điểm" —
  https://znews.vn/vn-index-doi-mat-nguy-co-tro-lai-vung-1700-diem-post1695005.html
  (9/11/2026, 06:01, tin id `4cbc838ae300`)
- Nguồn hiển thị trên video: "Nguồn: Znews"
- Ảnh Hook/Article Image Card: `assets/images/hook-photo.jpg` (ảnh thị trường chứng khoán, tải qua
  Apps Script proxy, id tin `4cbc838ae300`)

## Nội dung chính (đã xác minh từ bài báo, KHÔNG suy đoán thêm)
- Phiên 6/11 (cuối tuần): VN-Index bất ngờ đảo chiều, giảm 15,37 điểm, đóng cửa tại 1.725,36 điểm.
- Cả tuần 2-6/11: chỉ số giảm 16,26 điểm, tương đương -0,9%.
- Phiên 4/11 chỉ số từng bật tăng hơn 33 điểm từ vùng hỗ trợ 1.700; đầu tuần có lúc đã lùi xuống
  dưới 1.700 điểm.
- Khối ngoại mua ròng hơn 435 tỷ đồng trong phiên 6/11.
- Nhóm gây áp lực phiên 6/11: VIC, VHM (Vingroup, Vinhomes), ngân hàng và công nghệ. Nhóm đỡ giá
  giữa tuần: bất động sản, ngân hàng, chứng khoán.
- Kháng cự: 1.750 điểm (ACBS cho rằng nhịp tăng cần vượt 1.760 điểm để xác nhận).
- Hỗ trợ: VCBS xác định 1.700-1.720 điểm; Vietcap dự báo biên 1.720-1.735 điểm cho phiên 9/11;
  ACBS dự báo biên 1.720-1.780 điểm, không loại trừ khả năng kiểm định lại 1.700-1.720 điểm; Yuanta
  theo dõi vùng 1.690-1.710 điểm — nếu mất 1.690 điểm, rủi ro kiểm định sâu hơn về 1.650-1.670 điểm
  tăng lên.
- Chỉ báo sức khỏe: tỷ lệ cổ phiếu giao dịch trên đường MA20 theo ACBS đạt khoảng 36,7%, nhích nhẹ
  so với 36,2% tuần trước — thanh khoản tăng tập trung vào phiên giảm, độ rộng thị trường nghiêng
  về bên bán.
- Khuyến nghị đã công bố: VCBS khuyến nghị tiếp tục nắm giữ cổ phiếu còn giữ được hỗ trợ, chưa mua
  mới; ACBS cho biết có thể giải ngân thăm dò tại 1.700-1.720 điểm, nhưng nếu đóng cửa dưới 1.700
  điểm sẽ cân nhắc hạ tỷ trọng; Yuanta đề xuất chiến lược ngắn hạn khoảng 40% cổ phiếu/60% tiền mặt.
- Nguyên nhân được các công ty chứng khoán nêu: lực cầu chưa đủ bền vững (Yuanta); thanh khoản tăng
  dồn vào phiên bán, độ rộng nghiêng về bên bán (ACBS).

## Góc độ kinh doanh/kinh tế khai thác cho video
Câu chuyện về một mốc điểm số kỹ thuật (1.700 điểm) đang được nhiều công ty chứng khoán lớn cùng
theo dõi như vùng hỗ trợ sống còn của thị trường, sau một tuần chỉ số đảo chiều giảm ngay sau nhịp
hồi phục. Đóng khung qua: diễn biến phiên cuối tuần → số liệu cả tuần + dòng tiền khối ngoại/nhóm
ngành → con số trọng tâm (vùng 1.700 điểm hỗ trợ) → chỉ báo sức khỏe thị trường lý giải vì sao →
kết thúc bằng các khuyến nghị tỷ trọng cổ phiếu/tiền mặt đã được công bố chính thức — đúng tinh thần
"chỉ đưa tin, không tự suy đoán xu hướng tương lai".

## Cách dựng (construction style)
`claim_style` trả về: **index 0 — "1-card-and-bar"** (đã dùng 1 lần trước: `lan-bien-chuyen-nhuong-
50-dat`, video đầu tiên của kênh). Ẩn dụ "thẻ viền bo góc có số thứ tự + biểu đồ cột dọc" phù hợp để
so sánh các vùng điểm số (hỗ trợ/kháng cự) và tỷ lệ phần trăm (MA20, tỷ trọng cổ phiếu/tiền mặt).
Thiết kế HTML/CSS/GSAP của 5 act (What happened → Impact) dựng mới hoàn toàn cho tin này, không copy
bố cục của video đầu tiên.

## Act cuối (Impact) — sự thật/số liệu, không suy đoán
Line 6 chỉ nêu khuyến nghị tỷ trọng cổ phiếu/tiền mặt đã được Yuanta và ACBS công bố (sự thật đã xảy
ra — khuyến nghị đã phát hành), không có câu nhận định/dự báo điểm số VN-Index sẽ đi về đâu tiếp
theo.
