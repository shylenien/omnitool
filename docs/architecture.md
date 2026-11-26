# Kiến Trúc & Hướng Dẫn Phát Triển (Architecture & Contributing)

Tài liệu này giúp lập trình viên hiểu nhanh cấu trúc mã nguồn của **Omni Tool** và quy trình thêm công cụ mới.

---

## 1. Công nghệ sử dụng

- **Core**: React 18 + TypeScript
- **Build tool**: Vite 6 (`base: './'` để tương thích cả root domain và subpath)
- **Routing**: `react-router-dom` v7 (`HashRouter` — định tuyến dạng `/#/:categoryId/:slug`)
- **Styling**: Tailwind CSS 3
- **Icons**: `lucide-react` (hiển thị động qua `DynamicIcon` với fallback an toàn) + `BrandLogo` SVG riêng

---

## 2. Cấu trúc thư mục chính

```text
omnitool/
├── .github/workflows/
│   ├── ci.yml                # Kiểm tra tsc + vite build cho Pull Request
│   └── deploy.yml            # Dual deploy lên GitHub Actions Pages & nhánh gh-pages
├── docs/                     # Tài liệu kỹ thuật (đồng bộ cùng git repo)
├── public/
│   ├── 404.html              # Tự động chuẩn hóa URL trực tiếp về dạng HashRouter (#/)
│   ├── CNAME                 # Tên miền riêng (omni.h.ap.vn), tự copy vào dist/ khi build
│   └── favicon.svg           # Icon tab trình duyệt đồng bộ với BrandLogo
├── src/
│   ├── components/
│   │   ├── tools/            # 8 module chứa toàn bộ 48 công cụ theo danh mục
│   │   ├── BrandLogo.tsx     # Logo SVG thương hiệu Omni Tool
│   │   ├── DynamicIcon.tsx   # Render icon động từ lucide-react kèm fallback chống crash
│   │   ├── Header.tsx / Footer.tsx / Layout.tsx / SearchModal.tsx
│   ├── data/
│   │   └── tools.ts          # Danh mục (CATEGORIES) và metadata của 48 công cụ (TOOLS)
│   └── pages/
│       ├── HomePage.tsx      # Trang chủ lọc công cụ theo danh mục
│       ├── CategoryPage.tsx  # Trang danh sách công cụ theo nhóm
│       └── ToolPage.tsx      # Trang chi tiết render từng công cụ theo :categoryId/:slug
```

---

## 3. Quy trình thêm công cụ mới

1. **Khai báo metadata** trong `src/data/tools.ts`:
   - Thêm object mới vào mảng `TOOLS` với `id`, `category`, `slug`, `title`, `shortDesc`, `icon` (tên icon hợp lệ của `lucide-react`), và `badge`.
2. **Viết UI & logic** trong file nhóm tương ứng tại `src/components/tools/` (ví dụ `ScreenTools.tsx`, `UtilityTools.tsx`...):
   - Lưu ý bọc `try/catch` và kiểm tra khả dụng API trình duyệt (như `navigator.mediaDevices`, `AudioContext`, `navigator.clipboard`) để tránh lỗi runtime trên môi trường không hỗ trợ.
3. **Đăng ký route** trong `src/pages/ToolPage.tsx`:
   - Import component mới và thêm `case '<category>/<slug>':` trong `renderToolComponent()`.
4. **Kiểm tra trước khi commit**:
   ```bash
   npm run build
   ```
   Đảm bảo `tsc && vite build` chạy sạch không lỗi.
