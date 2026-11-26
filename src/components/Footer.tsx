import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const copyrightYear = currentYear > 2026 ? `2026 - ${currentYear}` : '2026';

  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BrandLogo className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">Omni Tool</span>
            <span className="text-[10px] text-slate-500 font-medium">by Hung Pham</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nền tảng kiểm tra phần cứng thiết bị và bộ tiện ích trực tuyến 48 công cụ mạnh mẽ, nhanh chóng, bảo mật tuyệt đối 100% tại trình duyệt.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Không lưu dữ liệu · Xử lý cục bộ</span>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Kiểm tra thiết bị</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/screen" className="hover:text-emerald-400 transition-colors">Màn hình (11 tools)</Link></li>
              <li><Link to="/keyboard" className="hover:text-emerald-400 transition-colors">Bàn phím (5 tools)</Link></li>
              <li><Link to="/mouse" className="hover:text-emerald-400 transition-colors">Chuột (7 tools)</Link></li>
              <li><Link to="/audio" className="hover:text-emerald-400 transition-colors">Âm thanh & Mic (5 tools)</Link></li>
              <li><Link to="/camera" className="hover:text-emerald-400 transition-colors">Webcam (3 tools)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Hệ thống</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/device" className="hover:text-emerald-400 transition-colors">Thông tin phần cứng (3)</Link></li>
              <li><Link to="/browser" className="hover:text-emerald-400 transition-colors">Trình duyệt & API (3)</Link></li>
              <li><Link to="/screen/refresh-rate" className="hover:text-emerald-400 transition-colors">Test Hz màn hình</Link></li>
              <li><Link to="/keyboard/tester" className="hover:text-emerald-400 transition-colors">Test phím (Full Numpad)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Tiện ích hằng ngày</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/utilities/password-generator" className="hover:text-emerald-400 transition-colors">Tạo mật khẩu an toàn</Link></li>
              <li><Link to="/utilities/color-picker" className="hover:text-emerald-400 transition-colors">Bảng chọn mã màu HEX/RGB</Link></li>
              <li><Link to="/utilities/json-formatter" className="hover:text-emerald-400 transition-colors">Định dạng & Test JSON</Link></li>
              <li><Link to="/utilities/number-to-words" className="hover:text-emerald-400 transition-colors">Số thành chữ tiếng Việt</Link></li>
              <li><Link to="/utilities" className="hover:text-emerald-400 transition-colors">Tất cả tiện ích (11)</Link></li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Đặc điểm kỹ thuật</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Xây dựng với chuẩn Web APIs hiện đại: Web Audio API, Canvas 2D, WebGL. Hoạt động trên mọi thiết bị: PC, Laptop, Máy tính bảng, Điện thoại.
          </p>
          <div className="pt-2 text-xs text-slate-400">
            © {copyrightYear} <strong className="text-slate-200">Omni Tool</strong> by <span className="text-emerald-400 font-semibold">Hung Pham</span> · Mã nguồn mở &amp; Miễn phí
          </div>
        </div>
      </div>
    </footer>
  );
};
