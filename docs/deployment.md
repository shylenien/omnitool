# Hướng Dẫn Triển Khai & Tên Miền Riêng (Deployment)

Tài liệu mô tả cách dự án build và deploy tự động lên GitHub Pages cùng tên miền riêng.

---

## 1. Quy trình Deploy tự động (`.github/workflows/deploy.yml`)

Mỗi khi push lên nhánh `main`, GitHub Actions tự động:
1. Cài đặt dependencies (`npm ci`) và build bản production (`npm run build` → xuất ra `dist/`).
2. Đẩy toàn bộ nội dung `dist/` sang nhánh `gh-pages` bằng `peaceiris/actions-gh-pages@v4`.
3. GitHub Pages tự động phát hành nhánh `gh-pages` ra web chính thức (thời gian chạy chỉ ~25–30 giây, không bị treo ở bước `purging_cdn`).

> Trong **Settings → Pages → Build and deployment** của repository trên GitHub, chọn **Source: Deploy from a branch** → nhánh **`gh-pages`** / **`/ (root)`**.

---

## 2. Giữ tên miền riêng (`omni.h.ap.vn`) vĩnh viễn

- Do `peaceiris/actions-gh-pages@v4` bật `keep_files: false` và `force_orphan: true`, nhánh `gh-pages` sẽ được làm mới hoàn toàn sau mỗi lần deploy.
- File [`public/CNAME`](../public/CNAME) chứa tên miền `omni.h.ap.vn`. Khi chạy `npm run build`, Vite tự động copy file này sang `dist/CNAME`, đảm bảo mọi bản deploy đều giữ nguyên cấu hình tên miền riêng mà không cần thêm thủ công lại.

---

## 3. SPA Routing & Đường dẫn sạch (BrowserRouter)

- `vite.config.ts` sử dụng `base: '/'` kết hợp `BrowserRouter` trong `src/App.tsx` để URL sạch đẹp không có `/#/` (ví dụ `https://omni.h.ap.vn/screen/stuck-pixel`).
- [`public/404.html`](../public/404.html) (`pathSegmentsToKeep = 0` cho tên miền riêng) kết hợp script giải mã trong `index.html` đảm bảo khi F5 hoặc mở link trực tiếp trên GitHub Pages không bị lỗi 404. Các link cũ có `#/` cũng được tự động chuyển về URL sạch.
