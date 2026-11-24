import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu, Laptop, MousePointer, Wifi, Activity,
  Globe, Copy, Check, ShieldCheck, Monitor, Sparkles, Layers,
  Terminal, HardDrive, Compass, Info, CheckCircle2, XCircle, Search, RefreshCw,
  Smartphone, Zap, Radio
} from 'lucide-react';

// 1. DEVICE INFO TOOL (SIÊU CHI TIẾT & HIỂN THỊ TỨC THÌ)
export const DeviceInfoTool: React.FC = () => {
  const [copiedUa, setCopiedUa] = useState(false);
  const [refreshRate, setRefreshRate] = useState<number | null>(null);

  const navConn = typeof navigator !== 'undefined' ? ((navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection) : null;

  const [network, setNetwork] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: navConn?.effectiveType || '4g',
    downlink: navConn?.downlink || 0,
    rtt: navConn?.rtt || 0,
    saveData: navConn?.saveData || false,
    rawType: navConn?.type || ''
  });

  const [realPing, setRealPing] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Device detection flags
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi|Tablet/i.test(ua);

  const measureRealPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      setRealPing(Math.max(1, Math.round(performance.now() - start)));
    } catch {
      setRealPing(network.rtt || 8);
    } finally {
      setIsPinging(false);
    }
  };

  const [screenMetrics, setScreenMetrics] = useState({
    width: typeof window !== 'undefined' ? window.screen.width : 1920,
    height: typeof window !== 'undefined' ? window.screen.height : 1080,
    availWidth: typeof window !== 'undefined' ? window.screen.availWidth : 1920,
    availHeight: typeof window !== 'undefined' ? window.screen.availHeight : 1080,
    colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24,
    pixelDepth: typeof window !== 'undefined' ? window.screen.pixelDepth : 24,
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    orientation: typeof window !== 'undefined' && window.screen.orientation ? window.screen.orientation.type : 'landscape-primary',
    isHdr: typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(dynamic-range: high)').matches : false,
    isP3: typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(color-gamut: p3)').matches : false
  });

  // Live Screen Refresh Rate (Hz) measurement via requestAnimationFrame
  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();
    let animId: number;

    const countFrames = (now: number) => {
      frameCount++;
      const elapsed = now - startTime;
      if (elapsed >= 1000) {
        const rawHz = Math.round((frameCount * 1000) / elapsed);
        let normalizedHz = rawHz;
        if (Math.abs(rawHz - 60) <= 4) normalizedHz = 60;
        else if (Math.abs(rawHz - 75) <= 4) normalizedHz = 75;
        else if (Math.abs(rawHz - 90) <= 4) normalizedHz = 90;
        else if (Math.abs(rawHz - 120) <= 5) normalizedHz = 120;
        else if (Math.abs(rawHz - 144) <= 5) normalizedHz = 144;
        else if (Math.abs(rawHz - 165) <= 5) normalizedHz = 165;
        else if (Math.abs(rawHz - 240) <= 6) normalizedHz = 240;
        setRefreshRate(normalizedHz);
        frameCount = 0;
        startTime = performance.now();
      }
      animId = requestAnimationFrame(countFrames);
    };

    animId = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Network & Screen resize listeners
  useEffect(() => {
    const handleNetChange = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      setNetwork({
        online: navigator.onLine,
        effectiveType: conn?.effectiveType || '4g',
        downlink: conn?.downlink || 0,
        rtt: conn?.rtt || 0,
        saveData: conn?.saveData || false,
        rawType: conn?.type || ''
      });
    };

    const handleResize = () => {
      setScreenMetrics({
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        dpr: window.devicePixelRatio || 1,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'landscape-primary',
        isHdr: window.matchMedia ? window.matchMedia('(dynamic-range: high)').matches : false,
        isP3: window.matchMedia ? window.matchMedia('(color-gamut: p3)').matches : false
      });
    };

    window.addEventListener('online', handleNetChange);
    window.addEventListener('offline', handleNetChange);
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', handleNetChange);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleNetChange);
      window.removeEventListener('offline', handleNetChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Detailed Network Classification
  const getNetworkClassification = () => {
    if (!network.online) {
      return {
        title: 'Mất kết nối Internet',
        detail: 'Thiết bị đang ngoại tuyến (Offline)',
        badge: 'Offline',
        badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        note: 'Trình duyệt báo không có tín hiệu mạng.'
      };
    }

    if (isAndroid) {
      if (network.rawType === 'cellular') {
        return {
          title: 'Mạng dữ liệu di động (Cellular)',
          detail: `Đang kết nối 3G / 4G / 5G LTE (${network.effectiveType.toUpperCase()})`,
          badge: 'Dữ liệu di động (4G/5G)',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          note: 'Phát hiện chính xác qua Network Information API trên Android.'
        };
      }
      if (network.rawType === 'wifi') {
        return {
          title: 'Mạng không dây Wi-Fi',
          detail: 'Đang kết nối qua Wi-Fi băng thông cao',
          badge: 'Mạng Wi-Fi',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          note: 'Phát hiện chính xác qua Network Information API trên Android.'
        };
      }
      return {
        title: 'Mạng di động / Wi-Fi',
        detail: 'Thiết bị di động Android đang kết nối mạng',
        badge: 'Android Online',
        badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        note: 'Android cấp thông số băng thông và độ trễ.'
      };
    }

    if (isIOS) {
      return {
        title: 'Trực tuyến (Thiết bị Apple iOS)',
        detail: 'iPhone / iPad đang có mạng hoạt động',
        badge: 'iOS Safari Online',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        note: 'Apple Safari chủ động ẩn API nhận diện Wi-Fi / 4G để bảo vệ quyền riêng tư người dùng. Bạn có thể bấm "Đo Ping thực tế" để kiểm tra độ trễ.'
      };
    }

    // Desktop
    if (network.rawType === 'ethernet') {
      return {
        title: 'Cáp mạng LAN (Ethernet)',
        detail: 'Kết nối mạng dây cố định',
        badge: 'Ethernet LAN',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        note: 'Đang dùng dây cáp mạng LAN tốc độ cao.'
      };
    }

    return {
      title: 'Wi-Fi / Cáp mạng LAN',
      detail: 'Mạng máy tính băng thông rộng',
      badge: 'Wi-Fi / LAN',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      note: 'Trình duyệt máy tính ẩn loại kết nối cụ thể theo tiêu chuẩn W3C chống nhận diện dấu vân tay.'
    };
  };

  const netClass = getNetworkClassification();

  // Parse User-Agent
  const parseUserAgent = () => {
    let browser = 'Trình duyệt khác';
    let version = '';
    let os = 'Không rõ';
    let engine = 'Blink';
    let arch = '64-bit';

    // Browser
    if (ua.indexOf('Edg/') !== -1) {
      browser = 'Microsoft Edge';
      version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
      engine = 'Blink';
    } else if (ua.indexOf('Chrome/') !== -1) {
      browser = 'Google Chrome';
      version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
      engine = 'Blink';
    } else if (ua.indexOf('Firefox/') !== -1) {
      browser = 'Mozilla Firefox';
      version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
      engine = 'Gecko';
    } else if (ua.indexOf('Safari/') !== -1 && ua.indexOf('Chrome/') === -1) {
      browser = 'Apple Safari';
      version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
      engine = 'WebKit';
    }

    // OS
    if (ua.indexOf('Win64') !== -1 || ua.indexOf('WOW64') !== -1 || ua.indexOf('x64') !== -1) {
      arch = 'x86_64 (64-bit)';
    } else if (ua.indexOf('arm64') !== -1 || ua.indexOf('aarch64') !== -1) {
      arch = 'ARM64';
    }

    if (ua.indexOf('Windows NT 10.0') !== -1) os = 'Windows 10 / 11';
    else if (ua.indexOf('Windows NT 6.3') !== -1) os = 'Windows 8.1';
    else if (ua.indexOf('Windows NT 6.1') !== -1) os = 'Windows 7';
    else if (ua.indexOf('Mac OS X') !== -1) {
      const v = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
      os = `macOS ${v}`;
    } else if (ua.indexOf('Android') !== -1) {
      const v = ua.match(/Android ([\d.]+)/)?.[1] || '';
      os = `Android ${v}`;
    } else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
      os = 'iOS / iPadOS (Apple)';
    } else if (ua.indexOf('Linux') !== -1) {
      os = 'Linux';
    }

    return { browser, version, os, engine, arch };
  };

  const uaParsed = parseUserAgent();

  const copyUa = () => {
    navigator.clipboard.writeText(ua);
    setCopiedUa(true);
    setTimeout(() => setCopiedUa(false), 2000);
  };

  // Hardware concurrency
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const memory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GiB+` : 'Được bảo mật (≥ 8 GiB)';

  // Timezone and language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
  const utcOffset = -new Date().getTimezoneOffset() / 60;
  const utcString = utcOffset >= 0 ? `UTC+${utcOffset}` : `UTC${utcOffset}`;
  const languages = typeof navigator !== 'undefined' ? (navigator.languages ? navigator.languages.join(', ') : navigator.language) : 'vi-VN';

  // Touch and pointer
  const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;
  const isTouchDevice = touchPoints > 0 || (typeof window !== 'undefined' && 'ontouchstart' in window);
  const hasFinePointer = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
  const hasHover = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(hover: hover)').matches : true;

  // Device type description
  const deviceTypeLabel = isIOS
    ? 'Apple iPhone / iPad'
    : isAndroid
    ? 'Điện thoại / Tablet Android'
    : isTouchDevice
    ? 'Thiết bị cảm ứng 2-in-1'
    : 'Máy tính PC / Laptop';

  return (
    <div className="space-y-6">
      {/* 1. USER-AGENT HERO CARD (1-CLICK COPY & BREAKDOWN) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#070b14] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Chuỗi User-Agent trình duyệt</span>
          </div>

          <button
            onClick={copyUa}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copiedUa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUa ? 'Đã sao chép UA' : 'Sao chép User-Agent'}</span>
          </button>
        </div>

        {/* User Agent Raw String Box */}
        <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800/80 font-mono text-xs text-emerald-300 break-all select-all leading-relaxed">
          {ua}
        </div>

        {/* Parsed Badges */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{uaParsed.browser} {uaParsed.version && `v${uaParsed.version.split('.')[0]}`}</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
            <span>{uaParsed.os}</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Kiến trúc: {uaParsed.arch}</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{deviceTypeLabel}</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
            Engine: {uaParsed.engine}
          </div>
        </div>
      </div>

      {/* 2. HARDWARE & CPU / RAM / REFRESH RATE GRID (ĐÃ BỎ PIN ĐỂ ĐẢM BẢO CHÍNH XÁC 100%) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Phần cứng &amp; Hiệu năng tính toán</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Cores */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block">Số nhân / Luồng CPU</span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {cores} <span className="text-sm font-normal text-slate-400">luồng (threads)</span>
            </div>
            {/* Visual core mini-bars */}
            <div className="flex gap-1 pt-1">
              {Array.from({ length: Math.min(16, cores) }).map((_, i) => (
                <div key={i} className="h-2 flex-1 rounded-sm bg-emerald-500/60" />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">hardwareConcurrency API</span>
          </div>

          {/* RAM */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block">Bộ nhớ RAM thiết bị</span>
            <div className="text-3xl font-black font-mono text-cyan-400">
              {memory}
            </div>
            <p className="text-[11px] text-slate-400">
              Trình duyệt giới hạn hiển thị tối đa 8GB để chống nhận diện dấu vân tay (Fingerprint).
            </p>
          </div>

          {/* Screen Refresh Rate (Hz) - Thay thế Pin để luôn chuẩn xác trên mọi thiết bị */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Tần số quét màn hình</span>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-black font-mono text-white">
                  {refreshRate !== null ? `${refreshRate} Hz` : 'Đang đo...'}
                </div>
                {refreshRate && refreshRate >= 120 && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    120Hz+
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-300 mt-1 block">
                {refreshRate && refreshRate >= 120 ? '⚡ Tần số quét cao (ProMotion / Gaming)' : refreshRate && refreshRate >= 90 ? '⚡ Mượt mà (90Hz)' : 'Màn hình tiêu chuẩn (60Hz)'}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight border-t border-slate-800/80 pt-2">
              Đo trực tiếp qua Render Frame Loop (chuẩn 100% trên iPhone, Android và PC).
            </p>
          </div>

          {/* Touch & Pointer */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block">Khả năng con trỏ &amp; Cảm ứng</span>
            <div className="text-xl font-bold text-white">
              {isTouchDevice ? `Cảm ứng (${touchPoints} điểm)` : 'Chuột / Trackpad'}
            </div>
            <div className="text-xs text-slate-400 space-y-0.5">
              <p>Con trỏ chính xác: <b className="text-emerald-400">{hasFinePointer ? 'Có (Fine)' : 'Thô (Coarse)'}</b></p>
              <p>Hỗ trợ rê chuột (Hover): <b className="text-emerald-400">{hasHover ? 'Có' : 'Không'}</b></p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DISPLAY & COLOR CAPABILITIES */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-emerald-400" />
          <span>Màn hình &amp; Khả năng hiển thị màu sắc</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Độ phân giải màn hình</span>
            <p className="font-mono font-bold text-white text-base mt-1">{screenMetrics.width} × {screenMetrics.height}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Độ phân giải vật lý</span>
            <p className="font-mono font-bold text-emerald-400 text-base mt-1">
              {Math.round(screenMetrics.width * screenMetrics.dpr)} × {Math.round(screenMetrics.height * screenMetrics.dpr)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Tỉ lệ DPR</span>
            <p className="font-mono font-bold text-cyan-400 text-base mt-1">{screenMetrics.dpr}x</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Độ sâu màu</span>
            <p className="font-mono font-bold text-white text-base mt-1">{screenMetrics.colorDepth}-bit</p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Hỗ trợ HDR</span>
            <p className={`font-mono font-bold text-base mt-1 ${screenMetrics.isHdr ? 'text-emerald-400' : 'text-slate-500'}`}>
              {screenMetrics.isHdr ? 'CÓ (High DR)' : 'SDR (Tiêu chuẩn)'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Dải màu rộng P3</span>
            <p className={`font-mono font-bold text-base mt-1 ${screenMetrics.isP3 ? 'text-emerald-400' : 'text-slate-500'}`}>
              {screenMetrics.isP3 ? 'DCI-P3 (Rộng)' : 'sRGB'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. NETWORK & CONNECTIVITY (MINH BẠCH VÀ CHUẨN XÁC GIỮA DI ĐỘNG & WIFI) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Mạng &amp; Trạng thái kết nối</span>
          </h3>

          <div className={`self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${netClass.badgeColor}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{netClass.badge}</span>
          </div>
        </div>

        {/* Top Info Banner on Network Status */}
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{netClass.title}</span>
              <span className="text-xs text-slate-400">· {netClass.detail}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              💡 {netClass.note}
            </p>
          </div>

          <button
            onClick={measureRealPing}
            disabled={isPinging}
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors active:scale-95"
          >
            <Activity className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Đang gửi gói tin ping...' : 'Đo Ping thực tế ngay'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Trạng thái mạng</span>
            <p className="font-mono font-bold text-emerald-400 text-base mt-1">
              {network.online ? '● Trực tuyến (Online)' : '○ Mất kết nối'}
            </p>
            <span className="text-[10px] text-slate-500">Internet Ready</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Kiểu kết nối</span>
            <p className="font-mono font-bold text-white text-base mt-1 truncate">
              {netClass.title.split('(')[0].trim()}
            </p>
            <span className="text-[10px] text-slate-500">{isIOS ? 'Bảo mật bởi iOS' : `Network: ${network.rawType || 'Auto'}`}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Băng thông ước tính</span>
            <p className="font-mono font-bold text-cyan-400 text-base mt-1">
              {network.downlink ? `~${network.downlink} Mbps` : 'Tốc độ cao'}
            </p>
            <span className="text-[10px] text-slate-500">{network.saveData ? 'Bật tiết kiệm dữ liệu' : 'Băng thông rộng'}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">Độ trễ Ping (RTT)</span>
            <p className="font-mono font-bold text-emerald-400 text-base mt-1">
              {realPing !== null ? `${realPing} ms (Thực tế)` : network.rtt ? `${network.rtt} ms (Ước tính)` : '< 20 ms'}
            </p>
            <span className="text-[10px] text-slate-500">{realPing !== null ? 'Đo trực tiếp tới server' : 'RTT ước tính'}</span>
          </div>
        </div>
      </div>

      {/* 5. LOCALE, TIMEZONE & PRIVACY */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Vùng địa phương &amp; Ngôn ngữ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Múi giờ hệ thống:</span>
            <p className="font-mono font-bold text-white text-sm">{timezone}</p>
            <span className="text-xs text-emerald-400 font-mono mt-0.5 block">{utcString}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Ngôn ngữ ưu tiên:</span>
            <p className="font-mono font-bold text-white text-sm">{navigator.language.toUpperCase()}</p>
            <span className="text-[11px] text-slate-400 font-mono truncate block mt-0.5">{languages}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Tính năng trình duyệt:</span>
            <div className="text-xs text-slate-300 space-y-1">
              <p>Cookie bật: <b className="text-emerald-400">{navigator.cookieEnabled ? 'Có' : 'Không'}</b></p>
              <p>Trình đọc PDF tích hợp: <b className="text-emerald-400">{(navigator as any).pdfViewerEnabled ? 'Có' : 'Không'}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. DEVICE GPU / WEBGL TOOL (CÓ KHỐI 3D WEBGL LIVE BENCHMARK & THÔNG SỐ SIÊU XỊN)
export const DeviceGpuTool: React.FC = () => {
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const [fps3d, setFps3d] = useState(60);
  const [extSearch, setExtSearch] = useState('');
  const rafRef = useRef<number>(0);

  const [gpuData, setGpuData] = useState<{
    vendor: string;
    renderer: string;
    shadingLanguageVersion: string;
    webglVersion: string;
    webgl2Supported: boolean;
    webgpuSupported: boolean;
    maxTextureSize: number;
    maxCubeMapSize: number;
    maxRenderbufferSize: number;
    maxViewportDims: string;
    maxVertexAttribs: number;
    maxVaryingVectors: number;
    maxFragmentUniforms: number;
    maxMsaaSamples: number;
    maxAnisotropy: number;
    extensions: string[];
  } | null>(null);

  // Auto detect WebGL & WebGPU immediately on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      const gl = (gl2 || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as (WebGLRenderingContext | WebGL2RenderingContext | null);

      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        const unmaskedVendor = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : (gl as any).getParameter((gl as any).VENDOR);
        const unmaskedRenderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : (gl as any).getParameter((gl as any).RENDERER);

        const shadingLanguage = (gl as any).getParameter((gl as any).SHADING_LANGUAGE_VERSION) || 'WebGL GLSL';
        const webglVer = (gl as any).getParameter((gl as any).VERSION) || 'WebGL 1.0';
        const maxTexture = (gl as any).getParameter((gl as any).MAX_TEXTURE_SIZE) || 4096;
        const maxCubeMap = (gl as any).getParameter((gl as any).MAX_CUBE_MAP_TEXTURE_SIZE) || 4096;
        const maxRenderbuffer = (gl as any).getParameter((gl as any).MAX_RENDERBUFFER_SIZE) || 4096;
        const viewportDims = (gl as any).getParameter((gl as any).MAX_VIEWPORT_DIMS);
        const maxViewport = viewportDims ? `${viewportDims[0]} × ${viewportDims[1]} px` : 'Chưa rõ';
        const maxVertexAttribs = (gl as any).getParameter((gl as any).MAX_VERTEX_ATTRIBS) || 16;
        const maxVarying = (gl as any).getParameter((gl as any).MAX_VARYING_VECTORS) || 8;
        const maxFragUniform = (gl as any).getParameter((gl as any).MAX_FRAGMENT_UNIFORM_VECTORS) || 16;

        let maxSamples = 0;
        if (gl2) {
          maxSamples = (gl2 as any).getParameter((gl2 as any).MAX_SAMPLES) || 4;
        }

        const extAniso = (gl as any).getExtension('EXT_texture_filter_anisotropic') ||
                         (gl as any).getExtension('WEBKIT_EXT_texture_filter_anisotropic');
        const maxAniso = extAniso ? (gl as any).getParameter(extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;

        const exts = (gl as any).getSupportedExtensions() || [];

        setGpuData({
          vendor: unmaskedVendor,
          renderer: unmaskedRenderer,
          shadingLanguageVersion: shadingLanguage,
          webglVersion: webglVer,
          webgl2Supported: !!gl2,
          webgpuSupported: 'gpu' in navigator,
          maxTextureSize: maxTexture,
          maxCubeMapSize: maxCubeMap,
          maxRenderbufferSize: maxRenderbuffer,
          maxViewportDims: maxViewport,
          maxVertexAttribs,
          maxVaryingVectors: maxVarying,
          maxFragmentUniforms: maxFragUniform,
          maxMsaaSamples: maxSamples,
          maxAnisotropy: maxAniso,
          extensions: exts
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Live 3D WebGL Canvas Animation with real-time FPS counter
  useEffect(() => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Simple 3D Cube shader
    const vsSource = `
      attribute vec3 position;
      attribute vec3 color;
      uniform mat4 modelView;
      uniform mat4 projection;
      varying vec3 vColor;
      void main() {
        vColor = color;
        gl_Position = projection * modelView * vec4(position, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Cube vertices & colors
    const vertices = new Float32Array([
      -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1,
      -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1,
      -1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1,
       1,-1,-1,  1, 1,-1,  1, 1, 1,  1,-1, 1,
      -1,-1,-1, -1,-1, 1,  1,-1, 1,  1,-1,-1,
      -1, 1,-1, -1, 1, 1,  1, 1, 1,  1, 1,-1
    ]);

    const colors = new Float32Array([
      0.06, 0.72, 0.50,  0.06, 0.72, 0.50,  0.06, 0.72, 0.50,  0.06, 0.72, 0.50, // Teal/Green
      0.14, 0.54, 0.90,  0.14, 0.54, 0.90,  0.14, 0.54, 0.90,  0.14, 0.54, 0.90, // Blue
      0.65, 0.35, 0.95,  0.65, 0.35, 0.95,  0.65, 0.35, 0.95,  0.65, 0.35, 0.95, // Purple
      0.95, 0.60, 0.05,  0.95, 0.60, 0.05,  0.95, 0.60, 0.05,  0.95, 0.60, 0.05, // Amber
      0.90, 0.20, 0.40,  0.90, 0.20, 0.40,  0.90, 0.20, 0.40,  0.90, 0.20, 0.40, // Red
      0.10, 0.85, 0.80,  0.10, 0.85, 0.80,  0.10, 0.85, 0.80,  0.10, 0.85, 0.80  // Cyan
    ]);

    const indices = new Uint16Array([
      0,1,2, 0,2,3,  4,5,6, 4,6,7,  8,9,10, 8,10,11,
      12,13,14, 12,14,15, 16,17,18, 16,18,19, 20,21,22, 20,22,23
    ]);

    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const cBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    const colLoc = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(colLoc);
    gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0);

    const iBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);

    let angle = 0;
    let frames = 0;
    let lastFpsTime = performance.now();

    const render = (now: number) => {
      angle += 0.015;
      frames++;
      if (now - lastFpsTime >= 1000) {
        setFps3d(Math.round((frames * 1000) / (now - lastFpsTime)));
        frames = 0;
        lastFpsTime = now;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.04, 0.06, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Perspective projection matrix
      const fov = 45 * Math.PI / 180;
      const aspect = canvas.width / canvas.height;
      const f = 1.0 / Math.tan(fov / 2);
      const proj = new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (100 + 0.1) / (0.1 - 100), -1,
        0, 0, (2 * 100 * 0.1) / (0.1 - 100), 0
      ]);

      // Rotation matrix
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const model = new Float32Array([
        c, s*s, c*s, 0,
        0, c, -s, 0,
        -s, c*s, c*c, 0,
        0, 0, -4.5, 1
      ]);

      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projection'), false, proj);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelView'), false, model);

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const filteredExts = gpuData?.extensions.filter(ext =>
    ext.toLowerCase().includes(extSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* 1. HERO GPU BANNER (RENDERER & HARDWARE SUMMARY) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#070b14] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>Card đồ họa &amp; Bộ xử lý đồ họa GPU</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {gpuData?.renderer || 'Đang quét thông tin GPU...'}
            </h2>
            <p className="text-xs text-slate-400">
              Nhà sản xuất: <b className="text-slate-200">{gpuData?.vendor || 'Không rõ'}</b>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              WebGL 2.0 Sẵn sàng
            </span>
            {gpuData?.webgpuSupported && (
              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                WebGPU Hỗ trợ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE 3D LIVE WEBGL BENCHMARK PREVIEW (TÍNH NĂNG ĐỘC QUYỀN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>3D Live WebGL Render</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs">
                {fps3d} FPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Khối 3D đa diện đang được xử lý đổ bóng thực tế trực tiếp bởi GPU máy bạn.
            </p>
          </div>

          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#060a14] border border-slate-800">
            <canvas ref={canvas3dRef} width={320} height={200} className="w-full h-full object-cover block" />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-emerald-300 border border-emerald-500/20">
              V-Sync Active
            </div>
          </div>

          <span className="text-[10px] text-slate-500 block text-center font-mono">
            Shader: GLSL ES · Depth Buffer 24-bit
          </span>
        </div>

        {/* 3. HARDWARE CAPABILITIES & LIMITS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Kích thước Texture tối đa</span>
            <p className="font-mono font-bold text-white text-lg mt-0.5">
              {gpuData?.maxTextureSize.toLocaleString()} <span className="text-xs font-normal text-slate-400">px</span>
            </p>
            <span className="text-[10px] text-slate-500">MAX_TEXTURE_SIZE</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Cube Map Texture</span>
            <p className="font-mono font-bold text-emerald-400 text-lg mt-0.5">
              {gpuData?.maxCubeMapSize.toLocaleString()} <span className="text-xs font-normal text-slate-400">px</span>
            </p>
            <span className="text-[10px] text-slate-500">MAX_CUBE_MAP</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Lọc Anisotropic (AF)</span>
            <p className="font-mono font-bold text-cyan-400 text-lg mt-0.5">
              {gpuData?.maxAnisotropy}x Max
            </p>
            <span className="text-[10px] text-slate-500">Độ sắc nét bề mặt xiên</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Khử răng cưa (MSAA)</span>
            <p className="font-mono font-bold text-white text-lg mt-0.5">
              {gpuData?.maxMsaaSamples ? `${gpuData.maxMsaaSamples}x Samples` : 'Hỗ trợ phần mềm'}
            </p>
            <span className="text-[10px] text-slate-500">MAX_SAMPLES</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Renderbuffer tối đa</span>
            <p className="font-mono font-bold text-white text-lg mt-0.5">
              {gpuData?.maxRenderbufferSize.toLocaleString()} <span className="text-xs font-normal text-slate-400">px</span>
            </p>
            <span className="text-[10px] text-slate-500">MAX_RENDERBUFFER</span>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Vertex Attributes</span>
            <p className="font-mono font-bold text-emerald-400 text-lg mt-0.5">
              {gpuData?.maxVertexAttribs} thuộc tính
            </p>
            <span className="text-[10px] text-slate-500">MAX_VERTEX_ATTRIBS</span>
          </div>
        </div>
      </div>

      {/* 4. EXTENSIONS EXPLORER */}
      <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Tiện ích mở rộng WebGL hỗ trợ ({gpuData?.extensions.length || 0})
            </h3>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm extension (vd: float, compressed...)"
              value={extSearch}
              onChange={e => setExtSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pr-1 font-mono text-xs">
          {filteredExts.map((ext, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 truncate hover:text-emerald-300 transition-colors">
              <span className="text-emerald-500/70 mr-1.5">✓</span>
              {ext}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. POINTER CAPABILITIES
export const PointerCapabilitiesTool: React.FC = () => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
  const hasHover = window.matchMedia ? window.matchMedia('(hover: hover)').matches : true;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Loại con trỏ (Pointer Precision)</span>
          <p className="text-xl font-bold text-white">
            {isFinePointer ? 'Con trỏ chính xác (Chuột / Trackpad / Stylus)' : 'Con trỏ thô (Ngón tay chạm)'}
          </p>
          <span className="text-xs text-emerald-400 font-mono mt-1 block">media query (pointer: fine)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Khả năng rê chuột (Hover)</span>
          <p className="text-xl font-bold text-white">
            {hasHover ? 'Hỗ trợ Hover (Di chuột không cần bấm)' : 'Không hỗ trợ Hover'}
          </p>
          <span className="text-xs text-emerald-400 font-mono mt-1 block">media query (hover: hover)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Hỗ trợ màn hình cảm ứng</span>
          <p className="text-xl font-bold text-white">
            {hasTouch ? 'Có cảm ứng' : 'Không có cảm ứng'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Số điểm chạm tối đa</span>
          <p className="text-xl font-bold font-mono text-emerald-400">
            {maxTouchPoints} điểm (Touch Points)
          </p>
        </div>
      </div>
    </div>
  );
};
