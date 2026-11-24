import React, { useState, useEffect, useRef } from 'react';
import { Mouse, RotateCcw, AlertTriangle, CheckCircle, Zap, Target, Gauge } from 'lucide-react';

// 1. MOUSE BUTTONS TEST
export const MouseButtonsTool: React.FC = () => {
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [testedButtons, setTestedButtons] = useState<Set<number>>(new Set());

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveButtons(prev => new Set(prev).add(e.button));
    setTestedButtons(prev => new Set(prev).add(e.button));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveButtons(prev => {
      const next = new Set(prev);
      next.delete(e.button);
      return next;
    });
  };

  const buttonNames: Record<number, string> = {
    0: 'Chuột trái (Left Click)',
    1: 'Con lăn giữa (Middle Click)',
    2: 'Chuột phải (Right Click)',
    3: 'Nút hông sau (Back)',
    4: 'Nút hông trước (Forward)',
  };

  return (
    <div className="space-y-6">
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={e => e.preventDefault()}
        className="h-80 rounded-2xl bg-[#090e1a] border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-colors"
      >
        {/* Visual Mouse Outline */}
        <div className="relative w-36 h-56 rounded-full border-4 border-slate-600 bg-slate-900/80 p-2 shadow-2xl flex flex-col items-center">
          {/* Top Buttons */}
          <div className="w-full flex h-24 gap-1 border-b-2 border-slate-700 pb-1">
            {/* Left Button */}
            <div
              className={`flex-1 rounded-tl-full flex items-center justify-center text-xs font-bold transition-all ${
                activeButtons.has(0)
                  ? 'bg-emerald-500 text-slate-950 scale-95'
                  : testedButtons.has(0)
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              L
            </div>

            {/* Scroll Wheel / Middle */}
            <div
              className={`w-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                activeButtons.has(1)
                  ? 'bg-emerald-500 text-slate-950 scale-95'
                  : testedButtons.has(1)
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              M
            </div>

            {/* Right Button */}
            <div
              className={`flex-1 rounded-tr-full flex items-center justify-center text-xs font-bold transition-all ${
                activeButtons.has(2)
                  ? 'bg-emerald-500 text-slate-950 scale-95'
                  : testedButtons.has(2)
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              R
            </div>
          </div>

          {/* Mouse Body */}
          <div className="flex-1 flex flex-col items-center justify-center text-[11px] text-slate-500 font-medium">
            <span>Bấm vào đây để test</span>
          </div>

          {/* Side Buttons Indicator */}
          <div className="absolute -left-3 top-24 flex flex-col gap-1.5">
            <div className={`w-2.5 h-6 rounded-l ${activeButtons.has(4) ? 'bg-emerald-500' : testedButtons.has(4) ? 'bg-emerald-800' : 'bg-slate-700'}`} title="Forward" />
            <div className={`w-2.5 h-6 rounded-l ${activeButtons.has(3) ? 'bg-emerald-500' : testedButtons.has(3) ? 'bg-emerald-800' : 'bg-slate-700'}`} title="Back" />
          </div>
        </div>

        <span className="text-xs text-slate-400 mt-4">
          Click chuột trái, phải, giữa hoặc nút cạnh hông trong khu vực này. Menu chuột phải đã được khóa.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map(b => (
          <div
            key={b}
            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
              activeButtons.has(b)
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                : testedButtons.has(b)
                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {buttonNames[b]}
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. DOUBLE CLICK TEST
export const DoubleClickTool: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [thresholdMs, setThresholdMs] = useState(80);
  const [logs, setLogs] = useState<{ delta: number; isBug: boolean }[]>([]);
  const lastClickTime = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = performance.now();
    setClickCount(prev => prev + 1);

    if (lastClickTime.current > 0) {
      const delta = Math.round(now - lastClickTime.current);
      if (delta < 400) {
        const isBug = delta <= thresholdMs;
        if (isBug) setDoubleClickCount(prev => prev + 1);
        setLogs(prev => [{ delta, isBug }, ...prev.slice(0, 20)]);
      }
    }
    lastClickTime.current = now;
  };

  const reset = () => {
    setClickCount(0);
    setDoubleClickCount(0);
    setLogs([]);
    lastClickTime.current = 0;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Tổng số lần click</span>
          <p className="text-4xl font-black font-mono text-white mt-1">{clickCount}</p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Số lần nghi vấn lỗi Double Click</span>
          <p className={`text-4xl font-black font-mono mt-1 ${doubleClickCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {doubleClickCount}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col justify-between">
          <span className="text-xs text-slate-400">Ngưỡng nhấp bất thường</span>
          <div className="flex justify-center gap-1.5 mt-1">
            {[60, 80, 100].map(ms => (
              <button
                key={ms}
                onClick={() => setThresholdMs(ms)}
                className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                  thresholdMs === ms ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {ms} ms
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        onClick={handleClick}
        onContextMenu={e => e.preventDefault()}
        className="h-64 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1527] border-2 border-dashed border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer select-none transition-all active:scale-[0.99]"
      >
        <span className="text-lg font-bold text-slate-200">Bấm liên tục tại đây để kiểm tra</span>
        <span className="text-xs text-slate-400 mt-1">
          Nếu switch chuột bị hỏng cơ hoặc chập mạch, bạn chỉ ấn 1 lần nhưng hệ thống sẽ bắt được 2 lần click cực nhanh (&lt;{thresholdMs}ms).
        </span>
      </div>

      {logs.length > 0 && (
        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 font-mono text-xs max-h-48 overflow-y-auto">
          <div className="space-y-1.5">
            {logs.map((l, i) => (
              <div key={i} className={`flex items-center justify-between p-1.5 rounded ${l.isBug ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400'}`}>
                <span>{l.isBug ? '⚠️ CẢNH BÁO: Double Click lỗi' : 'Click bình thường'}</span>
                <span>{l.delta} ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. MOUSE CPS TEST
export const MouseCpsTool: React.FC = () => {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const [clicks, setClicks] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<any>(null);

  const startTest = () => {
    setIsActive(true);
    setIsFinished(false);
    setClicks(1);
    setTimeLeft(duration);

    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(Number(remaining.toFixed(1)));

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setIsActive(false);
        setIsFinished(true);
      }
    }, 50);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isActive && !isFinished) {
      startTest();
    } else if (isActive) {
      setClicks(prev => prev + 1);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(false);
    setClicks(0);
    setTimeLeft(duration);
  };

  const cps = duration > 0 && isFinished ? (clicks / duration).toFixed(2) : ((clicks / Math.max(0.1, duration - timeLeft))).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Thời gian test:</span>
          {[1, 5, 10].map(sec => (
            <button
              key={sec}
              onClick={() => { setDuration(sec); setTimeLeft(sec); reset(); }}
              disabled={isActive}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                duration === sec ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {sec} giây
            </button>
          ))}
        </div>

        <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300">
          Làm lại
        </button>
      </div>

      <div
        onClick={handleClick}
        onContextMenu={e => e.preventDefault()}
        className="h-72 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1629] to-[#090e1c] border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none active:scale-[0.99] transition-all"
      >
        {!isActive && !isFinished && (
          <div className="space-y-2">
            <Zap className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Bấm vào đây để bắt đầu tính CPS!</h3>
            <p className="text-xs text-slate-400">Bấm liên tục càng nhanh càng tốt cho đến khi hết thời gian.</p>
          </div>
        )}

        {isActive && (
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-400">Thời gian còn lại: <b className="text-emerald-400 font-mono text-xl">{timeLeft}s</b></span>
            <div className="text-6xl font-black font-mono text-white">{clicks} clicks</div>
            <span className="text-xs text-slate-400">CPS hiện tại: ~{cps}</span>
          </div>
        )}

        {isFinished && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Hoàn thành thử thách!</span>
            <div className="text-6xl font-black font-mono text-white">{cps} <span className="text-xl text-emerald-400 font-normal">CPS</span></div>
            <p className="text-sm text-slate-300">Tổng cộng {clicks} clicks trong {duration} giây</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. MOUSE SCROLL TEST
export const MouseScrollTool: React.FC = () => {
  const [scrollEvents, setScrollEvents] = useState<{ direction: string; deltaY: number; timestamp: number }[]>([]);
  const [totalUp, setTotalUp] = useState(0);
  const [totalDown, setTotalDown] = useState(0);

  const handleWheel = (e: React.WheelEvent) => {
    const dir = e.deltaY < 0 ? 'Lên (Up)' : 'Xuống (Down)';
    if (e.deltaY < 0) setTotalUp(prev => prev + 1);
    else setTotalDown(prev => prev + 1);

    setScrollEvents(prev => [
      { direction: dir, deltaY: Math.round(e.deltaY), timestamp: Date.now() },
      ...prev.slice(0, 25)
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Cuộn lên</span>
          <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">{totalUp}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-xs text-slate-400">Cuộn xuống</span>
          <p className="text-3xl font-bold font-mono text-cyan-400 mt-1">{totalDown}</p>
        </div>
      </div>

      <div
        onWheel={handleWheel}
        className="h-64 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <span className="text-lg font-bold text-slate-200">Đặt con trỏ vào đây và lăn con lăn chuột</span>
        <span className="text-xs text-slate-400 mt-1">Kiểm tra con lăn có bị nhảy ngược hướng khi lăn nhanh không.</span>
      </div>

      {scrollEvents.length > 0 && (
        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 font-mono text-xs max-h-48 overflow-y-auto">
          {scrollEvents.map((ev, i) => (
            <div key={i} className="py-1 flex justify-between border-b border-slate-800/40 text-slate-300">
              <span className={ev.deltaY < 0 ? 'text-emerald-400' : 'text-cyan-400'}>{ev.direction}</span>
              <span>deltaY: {ev.deltaY}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 5. POLLING RATE ESTIMATOR
export const PollingRateTool: React.FC = () => {
  const [hz, setHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [avgHz, setAvgHz] = useState(0);
  const eventTimestamps = useRef<number[]>([]);

  const handleMouseMove = () => {
    const now = performance.now();
    eventTimestamps.current.push(now);

    // Keep events from the last 200ms
    eventTimestamps.current = eventTimestamps.current.filter(t => now - t <= 200);

    if (eventTimestamps.current.length > 5) {
      const count = eventTimestamps.current.length;
      const duration = (now - eventTimestamps.current[0]) / 1000;
      if (duration > 0.05) {
        const currentHz = Math.round(count / duration);
        setHz(currentHz);
        if (currentHz > maxHz) setMaxHz(currentHz);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
        <span className="text-xs font-semibold text-emerald-400 uppercase">Ước tính tần suất gửi tín hiệu chuột</span>
        <div className="text-6xl sm:text-8xl font-black font-mono text-white my-3">
          {hz > 0 ? hz : '--'} <span className="text-2xl font-bold text-emerald-400">Hz</span>
        </div>
        <p className="text-sm text-slate-400">
          Cao nhất đạt được: <span className="font-mono font-bold text-slate-200">{maxHz} Hz</span>
        </p>
      </div>

      <div
        onMouseMove={handleMouseMove}
        className="h-64 rounded-2xl bg-[#090e1a] border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center p-6 text-center select-none cursor-crosshair"
      >
        <Gauge className="w-10 h-10 text-emerald-400 mb-2 animate-spin [animation-duration:8s]" />
        <span className="text-base font-bold text-white">Lắc chuột liên tục thật nhanh trong khung này</span>
        <span className="text-xs text-slate-400 mt-1">Các mức polling rate gaming phổ biến: 125Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz.</span>
      </div>
    </div>
  );
};

// 6. MOUSE MOVEMENT TRACKER
export const MouseMovementTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-300">Di chuột để vẽ quỹ đạo và quan sát độ mượt mắt đọc</span>
        <button onClick={clearCanvas} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200">
          Xóa nét vẽ
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#090d16]">
        <canvas
          ref={canvasRef}
          width={900}
          height={380}
          onMouseMove={handleMouseMove}
          className="w-full h-80 block cursor-crosshair"
        />
      </div>
    </div>
  );
};

// 7. MOUSE ACCURACY (AIM TRAINER)
export const MouseAccuracyTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTotalClicks(0);
    setTimeLeft(20);
    setIsPlaying(true);
    spawnTarget();
  };

  const spawnTarget = () => {
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 80) + 10;
    setTargetPos({ x, y });
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying) return;
    setScore(prev => prev + 1);
    setTotalClicks(prev => prev + 1);
    spawnTarget();
  };

  const handleMiss = () => {
    if (!isPlaying) return;
    setTotalClicks(prev => prev + 1);
  };

  const accuracy = totalClicks > 0 ? Math.round((score / totalClicks) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400">Điểm số</span>
            <p className="text-2xl font-bold font-mono text-emerald-400">{score}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Độ chính xác</span>
            <p className="text-2xl font-bold font-mono text-cyan-400">{accuracy}%</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Thời gian</span>
            <p className="text-2xl font-bold font-mono text-white">{timeLeft}s</p>
          </div>
        </div>

        <button
          onClick={startGame}
          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
        >
          {isPlaying ? 'Chơi lại' : 'Bắt đầu Aim Test'}
        </button>
      </div>

      <div
        onClick={handleMiss}
        className="relative h-96 rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden cursor-crosshair select-none"
      >
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Target className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white">Luyện tập độ chuẩn xác chuột (Aim Trainer)</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Bấm mục tiêu xuất hiện ngẫu nhiên trên màn hình nhanh và chuẩn xác nhất có thể trong 20 giây.
            </p>
          </div>
        ) : (
          <div
            onClick={handleTargetClick}
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/50 cursor-pointer animate-ping [animation-duration:1.5s]"
          >
            <div className="w-3 h-3 rounded-full bg-slate-950" />
          </div>
        )}
      </div>
    </div>
  );
};
