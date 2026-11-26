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

## 3. SPA Routing & Đường dẫn tương đối

- `vite.config.ts` sử dụng `base: './'` kết hợp `HashRouter` trong `src/App.tsx`, giúp web chạy ổn định trên cả tên miền riêng (`https://omni.h.ap.vn/`) lẫn đường dẫn phụ GitHub (`https://shylenien.github.io/omnitool/`).
- [`public/404.html`](../public/404.html) tự động chuyển hướng mọi đường dẫn trực tiếp (nếu người dùng không gõ `#`) về định dạng `/#/<route>` để tránh lỗi 404.
