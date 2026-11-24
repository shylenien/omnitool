# Omni Tool - 48 Công Cụ Kiểm Tra Thiết Bị & Tiện Ích Trực Tuyến by Hung Pham

Website kiểm tra thiết bị, màn hình, bàn phím (có Numpad), chuột, âm thanh, camera, hệ thống và bộ tiện ích trực tuyến với đầy đủ **48 công cụ**, xây dựng trên nền tảng **React 18 + Vite + Tailwind CSS + Lucide Icons**. Hoàn toàn không cần thiết bị tay cầm ngoại vi.

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Khởi chạy môi trường phát triển (Development):
```bash
npm run dev
```
Sau đó truy cập: `http://localhost:3000` trên trình duyệt.

### 2. Đóng gói cho Production (Build):
```bash
npm run build
```
Thư mục sản phẩm xuất ra tại `dist/`.

---

## 🛠️ Trọn Bộ 48 Công Cụ Đã Hoàn Thiện

### 1. Màn hình (Screen - 11 tools)
* `refresh-rate`: Đo tần số quét (Hz) màn hình thực tế bằng `requestAnimationFrame`.
* `ghosting`: Kiểm tra bóng mờ chuyển động (Motion Blur / Ghosting UFO test).
* `resolution`: Độ phân giải hiển thị thực tế (Logical vs Physical resolution).
* `viewport`: Đo kích thước khung nhìn trình duyệt (CSS px) và tỉ lệ DPR.
* `aspect-ratio`: Tính tỷ lệ khung hình (16:9, 16:10, 21:9...) và hệ số thập phân.
* `ppi`: Tính mật độ điểm ảnh PPI và khoảng cách dot pitch.
* `dead-pixel`: Kiểm tra điểm ảnh chết toàn màn hình qua 8 màu đơn sắc.
* `stuck-pixel`: Kích thích điểm ảnh kẹt bằng cơ chế nhấp nháy tần số cao RGB.
* `backlight-bleed`: Kiểm tra hiện tượng hở sáng IPS/LCD trong phòng tối.
* `color-gradient`: Kiểm tra dải chuyển màu và độ sâu màu (Color Banding).
* `touch`: Kiểm tra cảm ứng đa điểm (Multi-touch) trên màn hình chạm.

### 2. Bàn phím (Keyboard - 5 tools)
* `tester`: Giao diện bàn phím trực quan đầy đủ cụm phím số **Numpad**, phím điều hướng và phím chữ.
* `chatter`: Phát hiện switch cơ bị lỗi lặp phím/double click với ngưỡng mili-giây.
* `rollover`: Đo số lượng phím bấm đồng thời tối đa (NKRO test).
* `hold`: Đo chính xác thời gian nhấn giữ từng phím (ms).
* `events`: Bảng theo dõi chuyên sâu sự kiện keydown / keyup (`code`, `key`, `keyCode`, `location`).

### 3. Chuột (Mouse - 7 tools)
* `buttons`: Kiểm tra chuột trái, phải, con lăn giữa và 2 nút hông (Back/Forward).
* `double-click`: Đo thời gian phản hồi giữa các lần click, cảnh báo lỗi switch click đúp ngoài ý muốn.
* `cps`: Đo tốc độ click chuột mỗi giây (Clicks Per Second: 1s, 5s, 10s).
* `scroll`: Kiểm tra con lăn chuột lên/xuống và bước cuộn deltaY.
* `polling-rate`: Đo tần số gửi tín hiệu chuột (Hz: 125Hz, 500Hz, 1000Hz+).
* `movement`: Vẽ và phân tích độ mượt đường đi của mắt đọc chuột quang.
* `accuracy`: Trò chơi luyện phản xạ và đo độ chuẩn xác chuột (Aim Trainer).

### 4. Âm thanh (Audio - 5 tools)
* `microphone`: Kiểm tra mức âm lượng nhận diện thực tế của Microphone (dB).
* `spectrum`: Phân tích phổ tần số âm thanh thời gian thực (FFT Analyzer).
* `speaker`: Phát âm thanh mẫu kiểm tra loa và dải Bass, Mid, Treble.
* `stereo`: Kiểm tra tách kênh tai nghe độc lập Trái (Left) và Phải (Right).
* `frequency-generator`: Máy phát sóng âm chuẩn từ 20 Hz đến 10,000 Hz.

### 5. Camera (3 tools)
* `preview`: Xem trước webcam trực tiếp, hỗ trợ lật gương và chụp ảnh tải về.
* `resolution`: Quét độ phân giải video tối đa camera có thể xuất ra.
* `fps`: Đo tốc độ khung hình (FPS) camera thực tế.

### 6. Thiết bị & Phần cứng (Device - 3 tools)
* `information`: Hệ điều hành, số nhân CPU, ước lượng RAM, pin và kết nối mạng.
* `gpu`: Trích xuất tên card đồ họa (NVIDIA, AMD, Intel, Apple) qua WebGL.
* `pointer-capabilities`: Kiểm tra khả năng nhận diện con trỏ chính xác (mouse) hay thô (touch).

### 7. Trình duyệt (Browser - 3 tools)
* `compatibility`: Kiểm tra khả năng hỗ trợ các Web API hiện đại (WebAssembly, WebGPU, WebRTC...).
* `storage`: Kiểm tra dung lượng bộ nhớ khả dụng của trình duyệt (Storage Quota).
* `fullscreen`: Thử nghiệm vào và thoát chế độ toàn màn hình không viền.

### 8. Tiện ích thường ngày (Utilities - 11 tools)
* `number-to-words`: Chuyển đổi số nguyên và số tiền VNĐ thành chữ tiếng Việt chuẩn.
* `percentage`: Máy tính phần trăm đa năng (A% của B, tỷ lệ tăng giảm...).
* `word-counter`: Đếm từ, ký tự (có/không khoảng trắng), số dòng và thời gian đọc.
* `case-converter`: Đổi kiểu chữ (HOA, thường, Title Case, kebab-case, snake_case).
* `remove-accents-slug`: Xóa dấu tiếng Việt và tạo URL Slug chuẩn SEO.
* `text-cleaner`: Xóa khoảng trắng thừa, lọc bỏ thẻ HTML, dọn dòng trống.
* `unit-converter`: Quy đổi dung lượng số (MB, GB, TB) và chiều dài (cm, m, inch).
* `date-calculator`: Tính khoảng cách số ngày và tuần giữa 2 mốc ngày tháng.
* `password-generator`: Tạo ngẫu nhiên mật khẩu mạnh theo độ dài, ký tự đặc biệt và đo độ an toàn.
* `color-picker`: Bảng chọn màu trực quan, trích xuất và chuyển đổi tức thì giữa HEX, RGB, HSL.
* `json-formatter`: Kiểm tra lỗi cú pháp, làm đẹp (Format indent) hoặc nén (Minify) chuỗi dữ liệu JSON.
