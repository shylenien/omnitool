# Hướng Dẫn Triển Khai & Tên Miền Riêng (Deployment)

Tài liệu mô tả cách dự án build và deploy tự động lên GitHub Pages cùng tên miền riêng.

---

## 1. Cơ chế Dual Deployment (`.github/workflows/deploy.yml`)

Mỗi khi push lên nhánh `main`, workflow thực hiện song song 2 phương thức triển khai từ thư mục `dist/`:

1. **GitHub Actions Pages (Chính thức)**: Dùng `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` và `actions/deploy-pages@v4`.
2. **Branch `gh-pages` (Dự phòng)**: Dùng `peaceiris/actions-gh-pages@v4` với quyền `contents: write` đẩy toàn bộ `dist/` lên nhánh `gh-pages`.

> Lưu ý: Trong phần **Settings → Pages** của repository trên GitHub, nguồn triển khai phải đặt là **GitHub Actions** hoặc nhánh **`gh-pages`** (không dùng nhánh `main` vì `main` chứa source `.tsx` chưa biên dịch).

---

## 2. Giữ tên miền riêng (`omni.h.ap.vn`) vĩnh viễn

- Do `peaceiris/actions-gh-pages@v4` bật `keep_files: false` và `force_orphan: true`, nhánh `gh-pages` sẽ bị ghi đè hoàn toàn sau mỗi lần deploy.
- File [`public/CNAME`](../public/CNAME) chứa tên miền `omni.h.ap.vn`. Khi chạy `npm run build`, Vite tự động copy file này sang `dist/CNAME`, đảm bảo mọi bản deploy đều giữ nguyên cấu hình tên miền riêng mà không cần thêm thủ công lại.

---

## 3. SPA Routing & Đường dẫn sạch (BrowserRouter)

- `vite.config.ts` sử dụng `base: '/'` kết hợp `BrowserRouter` trong `src/App.tsx` để URL sạch đẹp không có `/#/` (ví dụ `https://omni.h.ap.vn/screen/stuck-pixel`).
- [`public/404.html`](../public/404.html) (`pathSegmentsToKeep = 0` cho tên miền riêng) kết hợp script giải mã trong `index.html` đảm bảo khi F5 hoặc mở link trực tiếp trên GitHub Pages không bị lỗi 404. Các link cũ có `#/` cũng được tự động chuyển về URL sạch.
