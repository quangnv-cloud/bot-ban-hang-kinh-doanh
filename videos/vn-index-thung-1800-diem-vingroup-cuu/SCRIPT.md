# SCRIPT — Chứng khoán thủng mốc 1.800 điểm, Vingroup và dầu khí "gánh" chỉ số

Một dòng = một act (6 act, khớp `BRIEF.md`). Giọng ElevenLabs `eleven_v3`,
`voice_id: RCmOaM1iiIH5xX3QXjIF` ("Khánh Lâm - tin tức, thời sự"). File audio:
`assets/voice/line1.mp3` ... `line6.mp3`.

1. **Hook** — `line1.mp3`
   > Chứng khoán thủng mốc 1.800 điểm trong phiên sáng, nhưng cổ phiếu Vingroup và dầu khí đã kéo chỉ số hồi phục.

2. **What happened** — `line2.mp3`
   > Phiên giao dịch đầu tiên sau kỳ nghỉ Lễ 2 tháng 9 giằng co mạnh. Chốt phiên, VN-Index chỉ còn giảm 4,4 điểm, dừng ở 1.827,72 điểm.

3. **Key facts** — `line3.mp3`
   > Chỉ số HNX dừng tại 282,24 điểm, UPCoM dừng tại 127,84 điểm. Thanh khoản ba sàn xấp xỉ 18.000 tỷ đồng.

4. **Data moment** — `line4.mp3`
   > Nhóm cổ phiếu Vingroup là động lực chính giữ điểm, đóng góp gần 15 điểm cho VN-Index, với mã VIC tăng 3,6%.

5. **Context** — `line5.mp3`
   > Sau khi Mỹ và Iran tấn công quân sự lẫn nhau tại Trung Đông, giá dầu Brent tăng khoảng 1%, lên trên 95 đô la một thùng, kéo cổ phiếu dầu khí tăng theo.

6. **Impact** — `line6.mp3`
   > Khối ngoại quay lại bán ròng gần 696 tỷ đồng, tập trung nhóm ngân hàng, trong đó mã VCB bị bán ròng nhiều nhất với 215 tỷ đồng.

## On-screen text (khác voice, cô đọng hơn cho từng frame — style 7 Timeline Chronology)

- Hook: masthead "Bot Bán Hàng" · badge "Nguồn: Dân Trí · 3/9/2026" · kicker "CHỨNG KHOÁN" ·
  headline "Chứng khoán thủng mốc 1.800 điểm, Vingroup và dầu khí 'gánh' chỉ số" · số hero "1.800"
  đơn vị/label "ĐIỂM VN-INDEX THỦNG MỐC"
- What happened (thêm badge mốc thời gian nhỏ "3/9" cạnh kicker): headline "VN-Index hồi phục sau
  cú thủng mốc 1.800 điểm" · kicker "PHIÊN ĐẦU TIÊN SAU NGHỈ LỄ" · dòng phụ "Chốt phiên VN-Index
  giảm 4,4 điểm, dừng ở 1.827,72 điểm" · Article Image Card (ảnh nhà đầu tư theo dõi bảng điện) +
  caption "Nguồn: Dân Trí"
- Key facts (3 fact xếp dọc theo trục đứng bên trái, đường kẻ dọc + node tròn "nở" khi fact xuất
  hiện):
  Node 1 — label "HNX" giá trị "282,24 điểm"
  Node 2 — label "UPCOM" giá trị "127,84 điểm"
  Node 3 — label "THANH KHOẢN 3 SÀN" giá trị "~18.000 tỷ đồng"
- Data moment (trục ngang vẽ dần trái→phải, dừng tại 1 node lớn giữa khung hình khi số chốt, mã
  "VIC" chạy trước như mã cổ phiếu): số hero giữa node "~15" đơn vị "ĐIỂM VN-INDEX TỪ NHÓM
  VINGROUP" · mã hiệu nhỏ phía trên "VIC ▲ +3,6%" · nhãn phụ "VHM (Vinhomes) ▲ +0,55%"
- Context (trục thời gian ngang đầy đủ 3 mốc nhân-quả, node sau đậm/to hơn node trước, nhãn dưới
  mỗi node):
  Node 1 — nhãn "TRUNG ĐÔNG" giá trị "Mỹ - Iran tấn công quân sự lẫn nhau"
  Node 2 — nhãn "GIÁ DẦU BRENT" giá trị "▲ +1%, trên 95 USD/thùng"
  Node 3 — nhãn "CỔ PHIẾU DẦU KHÍ" giá trị "BSR · PVD · GAS · PLX · PVT · PVC ▲ +1-2%, có lúc +3%"
- Impact (2 node cuối trục phóng to thành 2 khối nội dung, vẫn giữ đường trục nối phía sau, giữ
  hình + brand anchor tới hết video):
  Khối trái — hero "696 tỷ đồng" · nhãn "KHỐI NGOẠI BÁN RÒNG, TẬP TRUNG NHÓM NGÂN HÀNG"
  Khối phải — 3 dòng mã bị bán ròng nhiều nhất: "VCB -215 tỷ" / "VPB -173 tỷ" / "TCB -155 tỷ"

## Lưu ý thiết kế trục thời gian (Style 7, lần dựng thứ 2 — không copy bố cục lần đầu)

- Lần dựng Timeline Chronology đầu tiên (`vn-index-chuoi-tang-7-phien-dai-nhat-nam`) dùng trục dựa
  theo chuỗi phiên tăng liên tiếp (mốc = ngày). Lần này trục ở act Context là chuỗi NHÂN-QUẢ (sự
  kiện địa chính trị → giá dầu → giá cổ phiếu), không phải chuỗi ngày — cách trình bày node/nhãn
  phải phản ánh đúng quan hệ nhân-quả (mũi tên hoặc connector rõ hướng), không tái dùng cùng
  layout/CSS/timing cũ.
- Act Data moment lần này đặt số liệu tại 1 node DUY NHẤT (không phải chuỗi nhiều mốc), khác hẳn
  bố cục "nhiều mốc nhỏ" — tự thiết kế trục ngắn/rút gọn cho phù hợp 1 con số trung tâm.
