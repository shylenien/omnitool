# Ghi Chú Kỹ Thuật: Bộ Kiểm Tra Bàn Phím (Keyboard Tools)

Tài liệu giải thích các hành vi phần cứng / hệ điều hành đặc thù trong [src/components/tools/KeyboardTools.tsx](../src/components/tools/KeyboardTools.tsx).

---

## 1. Tại sao bấm phím `Fn` một mình không sáng xanh?

- Trong `normalizeKeyCode()`, mã nguồn có hỗ trợ bắt `code === 'Fn'` / `'FnLock'` nếu trình duyệt nhận được sự kiện.
- Tuy nhiên, trên hầu hết laptop Windows (Dell, ThinkPad, HP, Asus, Acer...), phím **`Fn` được xử lý trực tiếp ở tầng phần cứng (Embedded Controller / BIOS)** bên trong bàn phím.
- Khi bấm **mỗi phím `Fn` đơn lẻ**, bàn phím không gửi mã quét (`keydown` / `keyup`) lên Windows hay trình duyệt, mà chỉ giữ trạng thái nội bộ để đổi mã phím khác khi bấm tổ hợp.
- **Cách kiểm tra phím `Fn` hoạt động**: Giữ `Fn` + phím chức năng (ví dụ `Fn + F12` → Scroll Lock, `Fn + Insert` → Pause, `Fn + End` / `Fn + Home` → PrintScreen/SysRq, hoặc phím tăng/giảm âm lượng). Nếu phím đích sáng xanh hoặc chức năng kích hoạt thì phím `Fn` hoạt động bình thường.

---

## 2. Xử lý `PrintScreen` / `SysRq` trên Windows & Dell Laptop

- Trên Windows, `PrintScreen` và `SysRq` dùng chung mã phím ảo `VK_SNAPSHOT (0x2C)`.
- Khi bật công cụ chụp màn hình (Snipping Tool) trên Windows, hệ điều hành thường chặn sự kiện `keydown` và **chỉ gửi `keyup`** về trình duyệt.
- Vì vậy `KeyboardTesterTool` cập nhật `pressedHistory` ở cả `handleUp` (nháy sáng `activeKeys` 150ms) và đồng thời đánh dấu cụm `End` / `Home` (tương ứng `Fn + End` và `Fn + Home` trên Dell Precision M4800).

---

## 3. Ba chế độ bố cục (`layoutMode`)

- **`Full 100% (Dell / Desktop)`** (`'full'`): Hiển thị đầy đủ 3 khu vực gồm Khu vực gõ chính (`MAIN_ROWS`), Cụm điều hướng (`NAV_ROWS`) và Cụm Numpad + hàng nút Media Dell (`NUMPAD_ROWS`).
- **`Laptop TKL`** (`'tkl'`): *Tenkeyless* — chỉ hiển thị Khu vực gõ chính (`MAIN_ROWS`), ẩn 2 cụm bên phải để gọn màn hình trên laptop nhỏ.
- **`Chỉ Bàn phím số (Numpad)`** (`'numpad'`): Chỉ hiển thị cụm `NUMPAD_ROWS`.
