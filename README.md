# Học Lịch sử cùng AI bằng sa bàn số

Ứng dụng web học Lịch sử 1945 – 1975 (kháng chiến chống Pháp và chống Mỹ, cứu nước) bằng **sa bàn 3D**: em chọn quyết định ở từng trận đánh, nghe giọng kể, nhận gợi ý và phân tích từ cố vấn AI.

Chạy hoàn toàn trên trình duyệt, **không cần mạng, không cần cài đặt, không cần máy chủ**.

## Cách mở

- Windows: bấm đúp `MO_APP.bat` (ưu tiên Microsoft Edge), hoặc mở thẳng `index.html`.
- Nên dùng Edge / Chrome bản mới; máy cần hỗ trợ WebGL.
- Dùng được trên điện thoại (màn dọc): sa bàn ở trên, nội dung cuộn ở dưới.
- Muốn đưa lên web: đây là trang tĩnh, chép nguyên thư mục lên bất kỳ nơi nào phục vụ file tĩnh (ví dụ GitHub Pages).

## Nội dung

- 6 trận trên sa bàn 3D: Việt Bắc 1947, Biên giới 1950, Điện Biên Phủ 1954, Ấp Bắc 1963, "Điện Biên Phủ trên không" 12/1972, Tây Nguyên – Hồ Chí Minh 1975.
- Mỗi trận có 3 quyết định (phương án A, B, C hiện ngay trên sa bàn), cố vấn AI gợi ý 3 bậc (địa hình, lực lượng, thời cơ), phân tích lỗi tư duy, điểm và sao.
- Giọng kể nam thu sẵn, nhạc trống trận, tiếng binh khí khớp với lời kể.
- Học cùng AI qua 41 mốc sự kiện; luyện 20 đề tốt nghiệp (28 câu / 50 phút); hồ sơ học sinh; bảng thống kê cho giáo viên.

Xem chi tiết cách dùng trong [`HUONG_DAN.txt`](HUONG_DAN.txt).

## Cấu trúc thư mục

| Thư mục / file | Vai trò |
| --- | --- |
| `index.html` | Trang vào của ứng dụng |
| `css/style.css` | Toàn bộ giao diện (có phần riêng cho điện thoại ở cuối file) |
| `js/core/` | Lõi: sa bàn 3D, mô hình, âm thanh, AI, lưu trữ |
| `js/data/` | Dữ liệu: 6 trận, mốc sự kiện, câu hỏi, lời kể |
| `js/ui/` | Các màn hình: trang chủ, trận đánh, học cùng AI, luyện đề, hồ sơ, giáo viên |
| `js/vendor/three.min.js` | Three.js r149 |
| `audio/nam/` | Giọng kể nam thu sẵn (mp3) |
| `tools/` | Công cụ thu giọng đọc |

## Thu lại giọng đọc sau khi sửa lời kể

Cần mạng, Node và Python (`pip install edge-tts`):

```bash
node tools/build_vo.mjs
python -X utf8 tools/make_vo.py
```

Đoạn nào chưa có file thu sẵn thì ứng dụng dùng giọng tiếng Việt của trình duyệt (nên mở bằng Edge).

## Lưu ý

- Mã PIN giáo viên mặc định ghi trong `HUONG_DAN.txt`; nên đổi ở thẻ **Giáo viên → Dữ liệu** trước khi dùng cho lớp.
- Một số chi tiết trên sa bàn (vị trí cứ điểm, tên các cánh quân…) mang tính minh họa.
- Chưa chọn giấy phép sử dụng cho mã nguồn.
