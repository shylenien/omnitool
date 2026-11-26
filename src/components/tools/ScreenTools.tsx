import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles, Check, Info, Move, Clock, AlertTriangle, Crosshair } from 'lucide-react';

// 1. REFRESH RATE
export const RefreshRateTool: React.FC = () => {
  const [fps, setFps] = useState<number>(0);
  const [avgFps, setAvgFps] = useState<number>(0);
  const [samples, setSamples] = useState<number[]>([]);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>(0);

  useEffect(() => {
    let history: number[] = [];
    const countFrames = (now: number) => {
      frameCount.current++;
      const delta = now - lastTime.current;
      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        setFps(currentFps);
        history.push(currentFps);
        if (history.length > 20) history.shift();
        const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
        setAvgFps(avg);
        setSamples([...history]);
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId.current = requestAnimationFrame(countFrames);
    };

    rafId.current = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e1628] border border-slate-800 text-center">
        <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">Tần số quét ước tính</span>
        <div className="my-4 flex items-baseline justify-center gap-2">
          <span className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-white">
            {fps > 0 ? fps : '--'}
          </span>
          <span className="text-2xl font-bold text-emerald-400">Hz</span>
        </div>
        <p className="text-sm text-slate-400">
          Trung bình ổn định: <span className="font-mono font-semibold text-slate-200">{avgFps} Hz</span>
        </p>

        {/* Visual Pulse Bars */}
        <div className="mt-8 flex items-end justify-center gap-1.5 h-16 max-w-md mx-auto">
          {samples.map((val, idx) => {
            const heightPct = Math.min(100, Math.max(15, (val / 240) * 100));
            return (
              <div
                key={idx}
                style={{ height: `${heightPct}%` }}
                className="w-3 rounded-t bg-emerald-500/80 transition-all duration-300"
              />
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Lưu ý về tần số quét trình duyệt:</span>
        </div>
        <p>
          Hàm <code className="text-emerald-400">requestAnimationFrame</code> đồng bộ với tốc độ làm mới thực tế của màn hình (V-Sync). Các mức tiêu chuẩn phổ biến bao gồm: 60Hz, 75Hz, 120Hz, 144Hz, 165Hz, 240Hz, 360Hz.
        </p>
      </div>
    </div>
  );
};

// 2. GHOSTING & MOTION BLUR (UFO STYLE)
export const GhostingTool: React.FC = () => {
  const [speed, setSpeed] = useState<number>(960);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      posRef.current += speed * dt;
      if (posRef.current > canvas.width + 60) posRef.current = -60;

      // Draw background lanes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lane 1: Dark
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 20, canvas.width, 70);

      // Lane 2: Medium Cyan
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(0, 110, canvas.width, 70);

      // Lane 3: High Contrast White
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 200, canvas.width, 70);

      // Draw UFO on all 3 lanes
      const drawUfo = (y: number, lightBg: boolean) => {
        const x = posRef.current;
        // UFO Dome
        ctx.fillStyle = lightBg ? '#0284c7' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, y - 5, 14, Math.PI, 0);
        ctx.fill();

        // UFO Saucer
        ctx.fillStyle = lightBg ? '#0f172a' : '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(x, y + 2, 28, 8, 0, 0, 2 * Math.PI);
        ctx.fill();

        // UFO Windows
        ctx.fillStyle = '#fbbf24';
        [-14, 0, 14].forEach(offset => {
          ctx.beginPath();
          ctx.arc(x + offset, y + 2, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        });
      };

      drawUfo(55, false);
      drawUfo(145, false);
      drawUfo(235, true);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-sm font-semibold text-slate-200">Tốc độ di chuyển:</span>
        <div className="flex items-center gap-2">
          {[480, 960, 1440, 1920].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                speed === s ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s} px/s
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#090d16]">
        <canvas ref={canvasRef} width={900} height={290} className="w-full h-auto block" />
      </div>

      <p className="text-xs text-slate-400">
        Hãy theo dõi vật thể UFO bằng mắt khi di chuyển. Nếu bạn thấy vệt bóng mờ kéo dài phía sau (Ghosting) hoặc vệt trắng sáng (Overshoot do Overdrive quá mức), màn hình có thời gian phản hồi (pixel response time) chưa tối ưu.
      </p>
    </div>
  );
};

// 3. RESOLUTION TOOL
export const ResolutionTool: React.FC = () => {
  const [info, setInfo] = useState({
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
  });

  useEffect(() => {
    const update = () => {
      setInfo({
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1,
      });
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const physicalWidth = Math.round(info.width * info.pixelRatio);
  const physicalHeight = Math.round(info.height * info.pixelRatio);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Độ phân giải hiển thị (Logical)</span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-white my-3">
            {info.width} × {info.height}
          </div>
          <span className="text-xs text-slate-400">Kích thước CSS pixel thực tế mà trình duyệt nhận</span>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Độ phân giải vật lý (Physical)</span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-white my-3">
            {physicalWidth} × {physicalHeight}
          </div>
          <span className="text-xs text-slate-400">Tính theo tỷ lệ Device Pixel Ratio ({info.pixelRatio}x)</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-400">Vùng khả dụng</span>
          <p className="text-lg font-bold font-mono text-slate-200 mt-1">{info.availWidth} × {info.availHeight}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Độ sâu màu</span>
          <p className="text-lg font-bold font-mono text-slate-200 mt-1">{info.colorDepth} bit</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Tỉ lệ DPR</span>
          <p className="text-lg font-bold font-mono text-emerald-400 mt-1">{info.pixelRatio}x</p>
        </div>
        <div>
          <span className="text-xs text-slate-400">Hướng màn hình</span>
          <p className="text-lg font-bold font-mono text-slate-200 mt-1">
            {info.width > info.height ? 'Ngang (Landscape)' : 'Dọc (Portrait)'}
          </p>
        </div>
      </div>
    </div>
  );
};

// 4. VIEWPORT & DPR
export const ViewportTool: React.FC = () => {
  const [viewport, setViewport] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
    outerW: window.outerWidth,
    outerH: window.outerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        outerW: window.outerWidth,
        outerH: window.outerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Kích thước Viewport Hiện Tại</span>
        <div className="text-5xl sm:text-7xl font-bold font-mono text-white my-4">
          {viewport.w} × {viewport.h} <span className="text-xl text-slate-400 font-normal">px</span>
        </div>
        <p className="text-xs text-slate-400">
          Hãy thử kéo đổi kích thước cửa sổ trình duyệt để thấy số liệu cập nhật trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Kích thước cửa sổ ngoài</span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">{viewport.outerW} × {viewport.outerH} px</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Device Pixel Ratio</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{viewport.dpr}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Điểm ảnh vật lý khung nhìn</span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">
            {Math.round(viewport.w * viewport.dpr)} × {Math.round(viewport.h * viewport.dpr)} px
          </p>
        </div>
      </div>
    </div>
  );
};

// 5. ASPECT RATIO CALCULATOR
export const AspectRatioTool: React.FC = () => {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width || 1, height || 1);
  const ratioW = (width || 0) / divisor;
  const ratioH = (height || 0) / divisor;
  const decimal = height > 0 ? (width / height).toFixed(2) : '0';

  const presets = [
    { name: '16:9 Full HD', w: 1920, h: 1080 },
    { name: '16:10 Laptop', w: 1920, h: 1200 },
    { name: '21:9 Ultrawide', w: 3440, h: 1440 },
    { name: '4:3 Vuông cũ', w: 1024, h: 768 },
    { name: '3:2 Surface/Mac', w: 3000, h: 2000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-sm font-semibold text-slate-200">Nhập kích thước</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Chiều rộng (Width)</label>
              <input
                type="number"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Chiều cao (Height)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-white"
              />
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 mb-2 block">Mẫu phổ biến:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-emerald-400 uppercase">Tỷ lệ rút gọn</span>
          <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white my-3">
            {ratioW} : {ratioH}
          </div>
          <span className="text-sm font-mono text-slate-400">Hệ số thập phân: {decimal} : 1</span>
        </div>
      </div>
    </div>
  );
};

// 6. PPI CALCULATOR
export const PpiTool: React.FC = () => {
  const [w, setW] = useState<number>(1920);
  const [h, setH] = useState<number>(1080);
  const [inches, setInches] = useState<number>(24);

  const diagonalPixels = Math.sqrt(w * w + h * h);
  const ppi = inches > 0 ? Math.round(diagonalPixels / inches) : 0;
  const dotPitch = ppi > 0 ? (25.4 / ppi).toFixed(4) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Chiều ngang (px)</label>
          <input
            type="number"
            value={w}
            onChange={e => setW(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Chiều dọc (px)</label>
          <input
            type="number"
            value={h}
            onChange={e => setH(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="text-xs text-slate-400 block mb-1">Kích thước đường chéo (Inch)</label>
          <input
            type="number"
            step="0.1"
            value={inches}
            onChange={e => setInches(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-white"
          />
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Mật độ điểm ảnh</span>
        <div className="text-6xl sm:text-7xl font-black font-mono text-white my-3">
          {ppi} <span className="text-2xl font-bold text-emerald-400">PPI</span>
        </div>
        <p className="text-sm text-slate-400">
          Khoảng cách giữa các điểm ảnh (Dot Pitch): <span className="font-mono text-slate-200">{dotPitch} mm</span>
        </p>
      </div>
    </div>
  );
};

// 7. DEAD PIXEL TEST
export const DeadPixelTool: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const colors = [
    { name: 'Đen (Black)', hex: '#000000' },
    { name: 'Trắng (White)', hex: '#ffffff' },
    { name: 'Đỏ (Red)', hex: '#ff0000' },
    { name: 'Xanh lá (Green)', hex: '#00ff00' },
    { name: 'Xanh dương (Blue)', hex: '#0000ff' },
    { name: 'Vàng (Yellow)', hex: '#ffff00' },
    { name: 'Xanh lục (Cyan)', hex: '#00ffff' },
    { name: 'Hồng cánh sen (Magenta)', hex: '#ff00ff' },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  const startFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setColorIndex(prev => (prev + 1) % colors.length);
      } else if (e.key === 'ArrowLeft') {
        setColorIndex(prev => (prev - 1 + colors.length) % colors.length);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    const handleFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, [isFullscreen, colors.length]);

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        onClick={() => isFullscreen && setColorIndex(prev => (prev + 1) % colors.length)}
        style={{ backgroundColor: colors[colorIndex].hex }}
        className={`rounded-2xl border border-slate-800 transition-all flex flex-col items-center justify-center cursor-pointer ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'h-80'
        }`}
      >
        {!isFullscreen && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-6 rounded-2xl text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Kiểm tra điểm ảnh chết (Dead Pixel)</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Bấm toàn màn hình. Dùng chuột click hoặc phím mũi tên để đổi màu. Quan sát kỹ xem có chấm đen li ti (chết điểm ảnh) hay chấm sáng bất thường nào không.
            </p>
            <button
              onClick={e => { e.stopPropagation(); startFullscreen(); }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-2 mx-auto"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Bật toàn màn hình</span>
            </button>
          </div>
        )}

        {isFullscreen && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur text-white text-xs font-mono select-none opacity-40 hover:opacity-100 transition-opacity">
            Màu: {colors[colorIndex].name} · Bấm chuột / Mũi tên để đổi màu · ESC để thoát
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-2">Chọn màu trực tiếp:</span>
        {colors.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setColorIndex(i)}
            style={{ backgroundColor: c.hex }}
            className={`w-8 h-8 rounded-lg border transition-all ${
              colorIndex === i ? 'border-white scale-110 shadow-lg' : 'border-slate-700'
            }`}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
};

// 8. STUCK PIXEL DETECTOR & FIXER
const STUCK_BG_COLORS = [
  { name: 'Đen tuyệt đối (Khuyên dùng)', hex: '#000000', textLight: true },
  { name: 'Xám tối (10%)', hex: '#18181b', textLight: true },
  { name: 'Đỏ thuần', hex: '#ff0000', textLight: true },
  { name: 'Xanh lá thuần', hex: '#00ff00', textLight: false },
  { name: 'Xanh lam thuần', hex: '#0000ff', textLight: true },
  { name: 'Trắng', hex: '#ffffff', textLight: false },
];

const FIXER_MODES = [
  { id: 'noise' as const, label: 'Nhiễu hạt RGB (JScreenFix)' },
  { id: 'strobe' as const, label: 'Chớp RGB/CMYK tốc độ cao' },
  { id: 'sweep' as const, label: 'Quét dải Subpixel' },
];

const FIXER_SIZES = [
  { id: 'sm' as const, label: 'Nhỏ (120px)', px: 120 },
  { id: 'md' as const, label: 'Vừa (220px)', px: 220 },
  { id: 'lg' as const, label: 'Lớn (340px)', px: 340 },
  { id: 'full' as const, label: 'Toàn vùng', px: 0 },
];

export const StuckPixelTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detect' | 'fix'>('detect');

  // Detect tab state
  const [bgIndex, setBgIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pinnedPoint, setPinnedPoint] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Fixer tab state
  const [isRunning, setIsRunning] = useState(false);
  const [fixerMode, setFixerMode] = useState<'noise' | 'strobe' | 'sweep'>('noise');
  const [boxSizeId, setBoxSizeId] = useState<'sm' | 'md' | 'lg' | 'full'>('md');
  const [speedMs, setSpeedMs] = useState(16);
  const [timerMinutes, setTimerMinutes] = useState<number>(10); // 0 = unlimited
  const [remainingSec, setRemainingSec] = useState<number>(10 * 60);
  const [boxPos, setBoxPos] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeLockRef = useRef<any>(null);

  // Fullscreen listener & keyboard shortcuts
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!document.fullscreenElement) return;
      if (activeTab === 'detect') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          setBgIndex(prev => (prev + 1) % STUCK_BG_COLORS.length);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setBgIndex(prev => (prev - 1 + STUCK_BG_COLORS.length) % STUCK_BG_COLORS.length);
        }
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeTab]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && stageRef.current?.requestFullscreen) {
        await stageRef.current.requestFullscreen();
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen policy error
    }
  };

  // Wake Lock while running fixer
  useEffect(() => {
    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch {
          // ignore
        }
        wakeLockRef.current = null;
      }
    };

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock?.request) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch {
        // ignore if unsupported or denied
      }
    };

    if (isRunning && activeTab === 'fix') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isRunning, activeTab]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || timerMinutes === 0) return;
    const id = window.setInterval(() => {
      setRemainingSec(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return timerMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, timerMinutes]);

  const handleSelectTimer = (mins: number) => {
    setTimerMinutes(mins);
    setRemainingSec(mins * 60);
  };

  // High-speed Canvas Fixer Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== 'fix') return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const palette = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'];

    if (!isRunning) {
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let rafId = 0;
    let lastTick = 0;
    let frameIdx = 0;

    const renderFrame = (now: number) => {
      rafId = requestAnimationFrame(renderFrame);
      if (now - lastTick < speedMs) return;
      lastTick = now;
      frameIdx++;

      const w = canvas.width;
      const h = canvas.height;

      if (fixerMode === 'noise') {
        // Draw crisp 4x4 RGB subpixel noise blocks for fast rendering
        const block = 4;
        for (let y = 0; y < h; y += block) {
          for (let x = 0; x < w; x += block) {
            ctx.fillStyle = palette[(Math.random() * 7) | 0];
            ctx.fillRect(x, y, block, block);
          }
        }
      } else if (fixerMode === 'strobe') {
        ctx.fillStyle = palette[frameIdx % palette.length];
        ctx.fillRect(0, 0, w, h);
      } else {
        // Subpixel vertical RGB sweep
        const stripe = 6;
        const offset = (frameIdx * 3) % (stripe * 3);
        const rgb = ['#ff0000', '#00ff00', '#0000ff'];
        for (let x = -stripe * 3; x < w + stripe * 3; x += stripe) {
          const idx = Math.abs(Math.floor((x + offset) / stripe)) % 3;
          ctx.fillStyle = rgb[idx];
          ctx.fillRect(x + (offset % stripe), 0, stripe, h);
        }
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning, fixerMode, speedMs, activeTab, boxSizeId]);

  // Dragging handlers for the Fixer Box
  const handleBoxPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (boxSizeId === 'full') return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - boxPos.x,
      y: e.clientY - boxPos.y,
    };
  };

  const handleBoxPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !stageRef.current || boxSizeId === 'full') return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const sizePx = FIXER_SIZES.find(s => s.id === boxSizeId)?.px || 220;
    const maxX = Math.max(0, stageRect.width - sizePx);
    const maxY = Math.max(0, stageRect.height - sizePx);
    const nextX = Math.min(maxX, Math.max(0, e.clientX - dragOffsetRef.current.x));
    const nextY = Math.min(maxY, Math.max(0, e.clientY - dragOffsetRef.current.y));
    setBoxPos({ x: nextX, y: nextY });
  };

  const handleBoxPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
    }
  };

  const handleStageClickToPin = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTab !== 'detect' || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setPinnedPoint({ x, y });
  };

  const jumpToFixAtPinned = () => {
    if (pinnedPoint && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const sizePx = FIXER_SIZES.find(s => s.id === boxSizeId)?.px || 220;
      const x = Math.min(Math.max(0, rect.width - sizePx), Math.max(0, pinnedPoint.x - sizePx / 2));
      const y = Math.min(Math.max(0, rect.height - sizePx), Math.max(0, pinnedPoint.y - sizePx / 2));
      setBoxPos({ x, y });
    }
    setActiveTab('fix');
    setIsRunning(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentBg = STUCK_BG_COLORS[bgIndex];
  const currentBoxSize = FIXER_SIZES.find(s => s.id === boxSizeId)?.px || 220;

  return (
    <div className="space-y-5">
      {/* Top Mode Switcher & Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setIsRunning(false);
              setActiveTab('detect');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'detect' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            1. Soi tìm điểm kẹt
          </button>
          <button
            onClick={() => setActiveTab('fix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'fix' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            2. Kích thích sửa Pixel
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'fix' && timerMinutes > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(remainingSec)}</span>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* Mode Specific Sub-Controls */}
      {activeTab === 'detect' ? (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Nền tương phản:</span>
            {STUCK_BG_COLORS.map((c, idx) => (
              <button
                key={c.hex}
                onClick={() => setBgIndex(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  bgIndex === idx
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="w-3 h-3 rounded-sm border border-white/20" style={{ backgroundColor: c.hex }} />
                <span>{c.name.split(' (')[0]}</span>
              </button>
            ))}
          </div>

          {pinnedPoint && (
            <button
              onClick={jumpToFixAtPinned}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Đặt hộp sửa tại ({pinnedPoint.x}, {pinnedPoint.y})</span>
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Algorithm */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Chế độ phát</label>
            <select
              value={fixerMode}
              onChange={e => setFixerMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {FIXER_MODES.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Box Size */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Kích thước hộp</label>
            <select
              value={boxSizeId}
              onChange={e => setBoxSizeId(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {FIXER_SIZES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Flash Interval */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Chu kỳ: {speedMs} ms (~{Math.round(1000 / speedMs)} Hz)
            </label>
            <input
              type="range"
              min={16}
              max={150}
              step={2}
              value={speedMs}
              onChange={e => setSpeedMs(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer mt-2"
            />
          </div>

          {/* Timer */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Hẹn giờ tự dừng</label>
            <div className="flex items-center gap-1.5">
              <select
                value={timerMinutes}
                onChange={e => handleSelectTimer(Number(e.target.value))}
                className="flex-1 px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>5 phút</option>
                <option value={10}>10 phút</option>
                <option value={20}>20 phút</option>
                <option value={30}>30 phút</option>
                <option value={0}>Liên tục</option>
              </select>
              <button
                onClick={() => setIsRunning(r => !r)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 ${
                  isRunning ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Dừng' : 'Chạy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Stage (Supports Fullscreen) */}
      <div
        ref={stageRef}
        onClick={handleStageClickToPin}
        style={{ backgroundColor: activeTab === 'detect' ? currentBg.hex : '#050811' }}
        className={`relative overflow-hidden select-none border border-slate-800 transition-colors ${
          isFullscreen ? 'w-screen h-screen rounded-none border-0' : 'h-[400px] sm:h-[460px] rounded-2xl'
        } ${activeTab === 'detect' ? 'cursor-crosshair' : ''}`}
      >
        {activeTab === 'detect' ? (
          <>
            {/* Pinned crosshair marker */}
            {pinnedPoint && (
              <div
                style={{ left: pinnedPoint.x, top: pinnedPoint.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="w-8 h-8 rounded-full border-2 border-emerald-400 animate-ping opacity-50 absolute inset-0" />
                <div className="w-8 h-8 rounded-full border border-emerald-400/90 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                </div>
              </div>
            )}

            {/* Minimal floating HUD */}
            <div
              onClick={e => e.stopPropagation()}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-[11px] font-mono flex items-center gap-3 backdrop-blur-md border ${
                currentBg.textLight
                  ? 'bg-black/60 text-slate-200 border-white/15'
                  : 'bg-white/75 text-slate-900 border-black/15'
              }`}
            >
              <span>Nền: <strong>{currentBg.name.split(' (')[0]}</strong></span>
              <span className="opacity-50">|</span>
              <span>Click vùng tối để ghim điểm kẹt</span>
              {isFullscreen && (
                <>
                  <span className="opacity-50">|</span>
                  <button
                    onClick={() => setBgIndex(prev => (prev + 1) % STUCK_BG_COLORS.length)}
                    className="underline font-bold"
                  >
                    Đổi màu (→)
                  </button>
                  <button onClick={toggleFullscreen} className="underline font-bold">
                    Thoát (ESC)
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Draggable / Fullscreen Canvas Fixer */}
            <div
              onPointerDown={handleBoxPointerDown}
              onPointerMove={handleBoxPointerMove}
              onPointerUp={handleBoxPointerUp}
              style={
                boxSizeId === 'full'
                  ? { inset: 0 }
                  : {
                      left: boxPos.x,
                      top: boxPos.y,
                      width: currentBoxSize,
                      height: currentBoxSize,
                    }
              }
              className={`absolute overflow-hidden ${
                boxSizeId === 'full'
                  ? 'w-full h-full'
                  : 'rounded-xl border-2 border-emerald-400/70 shadow-2xl shadow-emerald-500/20 cursor-grab active:cursor-grabbing touch-none'
              }`}
            >
              <canvas
                ref={canvasRef}
                width={boxSizeId === 'full' ? 640 : currentBoxSize}
                height={boxSizeId === 'full' ? 360 : currentBoxSize}
                className="w-full h-full block"
              />

              {boxSizeId !== 'full' && (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-emerald-300 flex items-center gap-1 pointer-events-none">
                  <Move className="w-3 h-3" />
                  <span>Kéo tới điểm kẹt</span>
                </div>
              )}

              {!isRunning && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center gap-3 pointer-events-none">
                  <Sparkles className="w-7 h-7 text-emerald-400" />
                  <p className="text-xs font-semibold text-slate-200 max-w-[200px]">
                    {boxSizeId === 'full'
                      ? 'Nhấn "Chạy" ở trên để kích thích toàn vùng'
                      : 'Kéo ô này đè lên đúng vị trí điểm ảnh kẹt rồi nhấn "Chạy"'}
                  </p>
                </div>
              )}
            </div>

            {isFullscreen && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(r => !r)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg"
                >
                  {isRunning ? 'Tạm dừng' : 'Chạy kích thích'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-2 rounded-xl bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-semibold"
                >
                  Thoát (ESC)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Safety & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Info className="w-4 h-4" />
            <span>Cách sử dụng hiệu quả</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Dùng tab <strong>Soi tìm điểm kẹt</strong> ở chế độ toàn màn hình nền đen để tìm điểm ảnh luôn sáng (đỏ/xanh/trắng). Sau đó click ghim vị trí và chuyển sang tab <strong>Kích thích sửa Pixel</strong> (khuyên dùng chế độ <em>Nhiễu hạt RGB</em> trong 10–30 phút).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200/90 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Lưu ý an toàn thị giác</span>
          </div>
          <p className="text-amber-200/75 leading-relaxed">
            Chế độ nhấp nháy tần số cao có thể gây khó chịu cho mắt hoặc người nhạy cảm với ánh sáng nhấp nháy. Hãy thu nhỏ kích thước hộp đúng vị trí điểm kẹt và không nhìn trực tiếp quá lâu.
          </p>
        </div>
      </div>
    </div>
  );
};

// 9. BACKLIGHT BLEED TEST
export const BacklightBleedTool: React.FC = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const start = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFs = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className={`bg-black rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-8 ${
          fullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'h-80'
        }`}
      >
        {!fullscreen ? (
          <div className="text-center space-y-4 max-w-md">
            <h3 className="text-lg font-bold text-white">Kiểm tra hở sáng (Backlight Bleed)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hãy tắt hết đèn trong phòng để không gian tối hoàn toàn. Bấm toàn màn hình nền đen tuyệt đối và quan sát các góc hoặc cạnh màn hình có bị vệt sáng hắt vào không.
            </p>
            <button
              onClick={start}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Toàn màn hình nền đen</span>
            </button>
          </div>
        ) : (
          <div className="text-neutral-700 text-xs font-mono select-none">
            ESC để thoát toàn màn hình
          </div>
        )}
      </div>
    </div>
  );
};

// 10. COLOR GRADIENT TEST (CHUẨN THEO A.AP.VN)
const PATTERNS = [
  { id: 0, name: 'Gradient RGB' },
  { id: 1, name: 'Thang xám' },
  { id: 2, name: 'Dải xám 16 mức' },
  { id: 3, name: 'Thanh màu' },
  { id: 4, name: 'Đen' },
  { id: 5, name: 'Trắng' },
  { id: 6, name: 'Đỏ' },
  { id: 7, name: 'Xanh lá' },
  { id: 8, name: 'Xanh lam' },
  { id: 9, name: 'Lục lam' },
  { id: 10, name: 'Đỏ tím' },
  { id: 11, name: 'Vàng' },
];

export const ColorGradientTool: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, patternId: number) => {
    ctx.clearRect(0, 0, width, height);

    switch (patternId) {
      case 0: { // Gradient RGB
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0.00, '#ff0000');
        grad.addColorStop(0.17, '#ffff00');
        grad.addColorStop(0.33, '#00ff00');
        grad.addColorStop(0.50, '#00ffff');
        grad.addColorStop(0.67, '#0000ff');
        grad.addColorStop(0.83, '#ff00ff');
        grad.addColorStop(1.00, '#ff0000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        break;
      }
      case 1: { // Thang xám
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(1, '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        break;
      }
      case 2: { // Dải xám 16 mức
        const stepWidth = width / 16;
        for (let i = 0; i < 16; i++) {
          const val = Math.round((i / 15) * 255);
          ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
          ctx.fillRect(Math.floor(i * stepWidth), 0, Math.ceil(stepWidth), height);
        }
        break;
      }
      case 3: { // Thanh màu (Color bars)
        const colors = ['#ffffff', '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#0000ff', '#000000'];
        const barWidth = width / colors.length;
        colors.forEach((c, idx) => {
          ctx.fillStyle = c;
          ctx.fillRect(Math.floor(idx * barWidth), 0, Math.ceil(barWidth), height);
        });
        break;
      }
      case 4: ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, width, height); break;
      case 5: ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height); break;
      case 6: ctx.fillStyle = '#ff0000'; ctx.fillRect(0, 0, width, height); break;
      case 7: ctx.fillStyle = '#00ff00'; ctx.fillRect(0, 0, width, height); break;
      case 8: ctx.fillStyle = '#0000ff'; ctx.fillRect(0, 0, width, height); break;
      case 9: ctx.fillStyle = '#00ffff'; ctx.fillRect(0, 0, width, height); break;
      case 10: ctx.fillStyle = '#ff00ff'; ctx.fillRect(0, 0, width, height); break;
      case 11: ctx.fillStyle = '#ffff00'; ctx.fillRect(0, 0, width, height); break;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isFullscreen) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = 1200;
      canvas.height = 420;
    }

    drawPattern(ctx, canvas.width, canvas.height, selectedPattern);
  }, [selectedPattern, isFullscreen]);

  const nextPattern = () => setSelectedPattern(prev => (prev + 1) % PATTERNS.length);
  const prevPattern = () => setSelectedPattern(prev => (prev - 1 + PATTERNS.length) % PATTERNS.length);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPattern();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPattern();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const currentPatternName = PATTERNS[selectedPattern].name;

  return (
    <div className="space-y-6">
      {/* Top Controls Box (theo style trang a.ap.vn) */}
      <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3">
          {/* Select field with label */}
          <div className="flex-1 max-w-xl">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Mẫu hiển thị
            </label>
            <div className="relative">
              <select
                value={selectedPattern}
                onChange={e => setSelectedPattern(Number(e.target.value))}
                className="w-full bg-[#0b101e] border-2 border-blue-500/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-all"
              >
                {PATTERNS.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevPattern}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-200 transition-colors"
            >
              Mẫu trước
            </button>
            <button
              onClick={nextPattern}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-200 transition-colors"
            >
              Mẫu tiếp theo
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Toàn màn hình</span>
            </button>
          </div>
        </div>

        {/* Warning / Alert Notice */}
        <div className="p-3 rounded-lg bg-[#0c1220] border-l-2 border-amber-400 text-xs text-slate-300 flex items-center gap-2">
          <span>Mẫu màu có thể rất sáng. Điều chỉnh độ sáng màn hình trước khi xem.</span>
        </div>

        {/* Pattern Stage */}
        <div
          ref={containerRef}
          onClick={nextPattern}
          className={`relative rounded-xl overflow-hidden cursor-pointer select-none transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black flex items-center justify-center' : 'w-full h-80 sm:h-96 border border-slate-800'
          }`}
          title="Bấm chuột hoặc mũi tên để đổi mẫu màu"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover block"
          />

          {isFullscreen && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/70 backdrop-blur border border-white/10 text-white text-xs font-mono select-none opacity-40 hover:opacity-100 transition-opacity pointer-events-none">
              Chạm để đổi màu · ← → để chuyển mẫu · Esc để thoát · {currentPatternName}
            </div>
          )}
        </div>

        {/* Caption */}
        {!isFullscreen && (
          <p className="text-xs text-slate-400 text-center font-mono pt-1">
            Chạm để đổi màu · ← → để chuyển mẫu · Esc để thoát · <span className="text-white font-semibold">{currentPatternName}</span>
          </p>
        )}

        <p className="text-[11px] text-slate-500 text-center">
          Bạn tự quan sát màn hình; không có phát hiện điểm ảnh tự động.
        </p>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-slate-200">Cách sử dụng &amp; Phương pháp</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chuyển giữa RGB gradient, thang xám và các dải màu; xem ở chế độ toàn màn hình để quan sát chuyển màu liên tục, thang xám 16 mức và phát hiện các dải sọc phân cách (Color Banding).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-slate-200">Giới hạn &amp; độ chính xác</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Không thay thế thiết bị cân màu chuyên dụng. Trình duyệt, profile quản lý màu hệ thống và độ sâu bit của card màn hình có thể ảnh hưởng trực tiếp đến kết quả hiển thị.
          </p>
        </div>
      </div>
    </div>
  );
};

// 11. TOUCH SCREEN TEST
export const TouchTool: React.FC = () => {
  const [touchPoints, setTouchPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const [maxTouches, setMaxTouches] = useState(0);

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const current: { id: number; x: number; y: number }[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      current.push({
        id: t.identifier,
        x: Math.round(t.clientX - rect.left),
        y: Math.round(t.clientY - rect.top),
      });
    }
    setTouchPoints(current);
    if (e.touches.length > maxTouches) {
      setMaxTouches(e.touches.length);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-sm font-semibold text-slate-200">
          Điểm chạm đang nhận: <span className="text-emerald-400 font-mono font-bold text-base">{touchPoints.length}</span>
        </span>
        <span className="text-xs text-slate-400">
          Số điểm chạm tối đa đã nhận: <span className="text-cyan-400 font-mono font-bold">{maxTouches}</span>
        </span>
      </div>

      <div
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouch}
        className="relative h-96 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 flex items-center justify-center select-none overflow-hidden touch-none"
      >
        {touchPoints.length === 0 ? (
          <div className="text-center text-slate-500 pointer-events-none">
            <span className="text-sm">Chạm hoặc vuốt ngón tay vào đây để kiểm tra cảm ứng đa điểm</span>
          </div>
        ) : (
          touchPoints.map(p => (
            <div
              key={p.id}
              style={{ left: p.x, top: p.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold pointer-events-none animate-pulse"
            >
              #{p.id + 1}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
