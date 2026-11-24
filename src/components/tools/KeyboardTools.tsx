import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, Clock, Terminal, Shield, Volume2, VolumeX, LayoutGrid, Laptop, Sparkles, HelpCircle } from 'lucide-react';

// FULL KEYBOARD LAYOUT DEFINITIONS
interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  width?: string;
  height?: string;
  spanRow?: boolean;
}

const MAIN_ROWS: KeyDef[][] = [
  // Row 0: F-keys
  [
    { code: 'Escape', label: 'Esc', width: 'w-10' },
    { code: 'F1', label: 'F1', subLabel: '💤', width: 'w-10' },
    { code: 'F2', label: 'F2', subLabel: '📡', width: 'w-10' },
    { code: 'F3', label: 'F3', subLabel: '🔋', width: 'w-10' },
    { code: 'F4', label: 'F4', width: 'w-10' },
    { code: 'F5', label: 'F5', width: 'w-10' },
    { code: 'F6', label: 'F6', width: 'w-10' },
    { code: 'F7', label: 'F7', width: 'w-10' },
    { code: 'F8', label: 'F8', subLabel: '🖥️', width: 'w-10' },
    { code: 'F9', label: 'F9', subLabel: '🖱️', width: 'w-10' },
    { code: 'F10', label: 'F10', subLabel: '💡', width: 'w-10' },
    { code: 'F11', label: 'F11', subLabel: '🔆-', width: 'w-10' },
    { code: 'F12', label: 'F12', subLabel: '🔆+', width: 'w-10' },
  ],
  // Row 1: Numbers
  [
    { code: 'Backquote', label: '` ~' },
    { code: 'Digit1', label: '1 !' },
    { code: 'Digit2', label: '2 @' },
    { code: 'Digit3', label: '3 #' },
    { code: 'Digit4', label: '4 $' },
    { code: 'Digit5', label: '5 %' },
    { code: 'Digit6', label: '6 ^' },
    { code: 'Digit7', label: '7 &' },
    { code: 'Digit8', label: '8 *' },
    { code: 'Digit9', label: '9 (' },
    { code: 'Digit0', label: '0 )' },
    { code: 'Minus', label: '- _' },
    { code: 'Equal', label: '= +' },
    { code: 'Backspace', label: '⌫ Backspace', width: 'w-20' },
  ],
  // Row 2: QWERTY
  [
    { code: 'Tab', label: 'Tab ⇥', width: 'w-16' },
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' },
    { code: 'BracketLeft', label: '[ {' },
    { code: 'BracketRight', label: '] }' },
    { code: 'Backslash', label: '\\ |', width: 'w-14' },
  ],
  // Row 3: ASDF
  [
    { code: 'CapsLock', label: 'Caps Lock', width: 'w-18' },
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: '; :' },
    { code: 'Quote', label: "' \"" },
    { code: 'Enter', label: 'Enter ⏎', width: 'w-22' },
  ],
  // Row 4: ZXCV
  [
    { code: 'ShiftLeft', label: '⇧ Shift', width: 'w-22' },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: ', <' },
    { code: 'Period', label: '. >' },
    { code: 'Slash', label: '/ ?' },
    { code: 'ShiftRight', label: '⇧ Shift', width: 'w-24' },
  ],
  // Row 5: Bottom (Có phím Fn chuẩn cho các dòng Laptop Dell Precision, ThinkPad, Asus, HP)
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 'w-12' },
    { code: 'Fn', label: 'Fn', subLabel: 'Laptop', width: 'w-11' },
    { code: 'MetaLeft', label: 'Win', width: 'w-11' },
    { code: 'AltLeft', label: 'Alt', width: 'w-11' },
    { code: 'Space', label: 'Space Bar', width: 'w-56' },
    { code: 'AltRight', label: 'Alt', width: 'w-11' },
    { code: 'FnRight', label: 'Fn', width: 'w-11' },
    { code: 'ContextMenu', label: 'Menu', width: 'w-11' },
    { code: 'ControlRight', label: 'Ctrl', width: 'w-12' },
  ]
];

// NAVIGATION CLUSTER
const NAV_ROWS: KeyDef[][] = [
  [
    { code: 'PrintScreen', label: 'PrtSc', subLabel: 'SysRq' },
    { code: 'ScrollLock', label: 'ScrLk', subLabel: 'Fn+F12' },
    { code: 'Pause', label: 'Pause', subLabel: 'Fn+Ins' },
  ],
  [
    { code: 'Insert', label: 'Ins', subLabel: 'Pause' },
    { code: 'Home', label: 'Home', subLabel: 'SysRq' },
    { code: 'PageUp', label: 'PgUp' },
  ],
  [
    { code: 'Delete', label: 'Del' },
    { code: 'End', label: 'End', subLabel: 'PrtSc' },
    { code: 'PageDown', label: 'PgDn' },
  ],
  [], // spacing
  [
    { code: '', label: '', width: 'w-10 opacity-0 pointer-events-none' },
    { code: 'ArrowUp', label: '↑' },
    { code: '', label: '', width: 'w-10 opacity-0 pointer-events-none' },
  ],
  [
    { code: 'ArrowLeft', label: '←' },
    { code: 'ArrowDown', label: '↓' },
    { code: 'ArrowRight', label: '→' },
  ]
];

// NUMPAD CLUSTER (HỖ TRỢ ĐẦY ĐỦ CỤM NÚT BACK / PLAY-PAUSE / NEXT TRÊN DELL PRECISION M4800)
const NUMPAD_ROWS: KeyDef[][] = [
  // Row 0: Hàng nút điều khiển đa phương tiện trên Dell Precision M4800 (Back, Pause/Play ở giữa, Next, Stop)
  [
    { code: 'MediaTrackPrevious', label: '⏮ Back', width: 'w-11' },
    { code: 'MediaPlayPause', label: '⏯ Play', width: 'w-11' },
    { code: 'MediaTrackNext', label: '⏭ Next', width: 'w-11' },
    { code: 'MediaStop', label: '⏹ Stop', width: 'w-11' },
  ],
  // Row 1: NumLock, /, *, -
  [
    { code: 'NumLock', label: 'Num 🔒' },
    { code: 'NumpadDivide', label: '/' },
    { code: 'NumpadMultiply', label: '*' },
    { code: 'NumpadSubtract', label: '-' },
  ],
  // Row 2: 7, 8, 9, +
  [
    { code: 'Numpad7', label: '7' },
    { code: 'Numpad8', label: '8' },
    { code: 'Numpad9', label: '9' },
    { code: 'NumpadAdd', label: '+' },
  ],
  // Row 3: 4, 5, 6, =
  [
    { code: 'Numpad4', label: '4' },
    { code: 'Numpad5', label: '5' },
    { code: 'Numpad6', label: '6' },
    { code: 'NumpadEqual', label: '=' },
  ],
  // Row 4: 1, 2, 3, Enter
  [
    { code: 'Numpad1', label: '1' },
    { code: 'Numpad2', label: '2' },
    { code: 'Numpad3', label: '3' },
    { code: 'NumpadEnter', label: 'Enter ⏎' },
  ],
  // Row 5: 0, ., ,
  [
    { code: 'Numpad0', label: '0', width: 'w-22' },
    { code: 'NumpadDecimal', label: '.' },
    { code: 'NumpadComma', label: ',' },
  ]
];

// EXTRA MULTIMEDIA & LAPTOP QUICK-BAR (ÂM LƯỢNG & TIỆN ÍCH LAPTOP)
const EXTRA_MEDIA_KEYS: KeyDef[] = [
  { code: 'AudioVolumeMute', label: 'Mute 🔇' },
  { code: 'AudioVolumeDown', label: 'Vol- 🔉' },
  { code: 'AudioVolumeUp', label: 'Vol+ 🔊' },
  { code: 'LaunchApp2', label: 'Calc 🧮' },
  { code: 'LaunchMail', label: 'Mail ✉️' },
  { code: 'BrowserHome', label: 'Home 🏠' },
  { code: 'Sleep', label: 'Sleep 💤' }
];

// Helper: Normalize key codes across OS & Browsers (Windows Snip, Dell Fn combos, PrintScreen)
const normalizeKeyCode = (e: KeyboardEvent): string => {
  let code = e.code;
  const key = e.key;

  // PrintScreen aliases & Windows Snip
  if (
    code === 'PrintScreen' ||
    code === 'Snapshot' ||
    key === 'PrintScreen' ||
    key === 'Snapshot' ||
    key === 'Print'
  ) {
    return 'PrintScreen';
  }

  // ScrollLock / Pause
  if (code === 'ScrollLock' || key === 'ScrollLock') return 'ScrollLock';
  if (code === 'Pause' || key === 'Pause' || key === 'Break') return 'Pause';

  // Dell M4800 & Laptop Media keys
  if (
    code === 'MediaTrackPrevious' ||
    key === 'MediaTrackPrevious' ||
    key === 'AudioPrev' ||
    key === 'MediaPreviousTrack'
  ) {
    return 'MediaTrackPrevious';
  }
  if (
    code === 'MediaPlayPause' ||
    key === 'MediaPlayPause' ||
    key === 'AudioPlay' ||
    key === 'AudioPause'
  ) {
    return 'MediaPlayPause';
  }
  if (
    code === 'MediaTrackNext' ||
    key === 'MediaTrackNext' ||
    key === 'AudioNext' ||
    key === 'MediaNextTrack'
  ) {
    return 'MediaTrackNext';
  }
  if (code === 'MediaStop' || key === 'MediaStop' || key === 'AudioStop') {
    return 'MediaStop';
  }

  // Volume & Apps
  if (code === 'AudioVolumeMute' || key === 'AudioVolumeMute' || key === 'VolumeMute') return 'AudioVolumeMute';
  if (code === 'AudioVolumeDown' || key === 'AudioVolumeDown' || key === 'VolumeDown') return 'AudioVolumeDown';
  if (code === 'AudioVolumeUp' || key === 'AudioVolumeUp' || key === 'VolumeUp') return 'AudioVolumeUp';
  if (
    code === 'LaunchApp2' ||
    code === 'LaunchApplication2' ||
    key === 'LaunchApplication2' ||
    key === 'LaunchApp2' ||
    key === 'Calculator'
  ) {
    return 'LaunchApp2';
  }
  if (code === 'LaunchMail' || key === 'LaunchMail' || key === 'Mail') return 'LaunchMail';
  if (code === 'BrowserHome' || key === 'BrowserHome') return 'BrowserHome';

  // Fn key (if emitted by hardware EC / modern OS)
  if (code === 'Fn' || code === 'FnLock' || key === 'Fn' || key === 'FnLock') return 'Fn';

  // Numpad fallback via DOM location === 3
  if (e.location === 3) {
    if (code && code.startsWith('Numpad')) return code;
    if (key >= '0' && key <= '9') return `Numpad${key}`;
    if (key === '+') return 'NumpadAdd';
    if (key === '-') return 'NumpadSubtract';
    if (key === '*') return 'NumpadMultiply';
    if (key === '/') return 'NumpadDivide';
    if (key === '.') return 'NumpadDecimal';
    if (key === 'Enter') return 'NumpadEnter';
  }

  return code || key;
};

// Friendly user display string
const getDisplayKeyLabel = (e: KeyboardEvent, code: string): string => {
  if (code === 'PrintScreen') {
    if (e.altKey) {
      return 'SysRq / Active Window Snapshot [PrintScreen] (Chụp cửa sổ hiện tại: Fn+Home trên Dell hoặc Alt+PrtSc)';
    }
    return 'Print Screen / SysRq [PrintScreen] (Chụp màn hình: Fn+End [PrtSc] hoặc Fn+Home [SysRq] trên Dell)';
  }
  if (code === 'Pause') {
    return 'Pause / Break [Pause] (Fn+Insert trên Dell)';
  }
  if (code === 'ScrollLock') {
    return 'Scroll Lock [ScrollLock] (Fn+F12)';
  }
  if (code === 'MediaTrackPrevious') {
    return '⏮ Back / Previous Track [MediaTrackPrevious] (Nút cạnh Pause/Play Dell M4800)';
  }
  if (code === 'MediaPlayPause') {
    return '⏯ Play / Pause [MediaPlayPause] (Nút ở giữa trên Dell M4800)';
  }
  if (code === 'MediaTrackNext') {
    return '⏭ Next Track [MediaTrackNext] (Nút cạnh Pause/Play Dell M4800)';
  }
  if (code === 'MediaStop') {
    return '⏹ Stop [MediaStop]';
  }
  if (code === 'AudioVolumeMute') {
    return '🔇 Mute [AudioVolumeMute] (Tắt/bật âm thanh)';
  }
  if (code === 'AudioVolumeDown') {
    return '🔉 Volume Down [AudioVolumeDown] (Giảm âm lượng)';
  }
  if (code === 'AudioVolumeUp') {
    return '🔊 Volume Up [AudioVolumeUp] (Tăng âm lượng)';
  }
  if (code === 'LaunchApp2') {
    return '🧮 Calculator [LaunchApp2] (Mở máy tính)';
  }
  if (code === 'Fn') {
    return 'Fn [Function] (Phím chức năng Laptop)';
  }
  const k = e.key === ' ' ? 'Space' : e.key;
  return `${k} [${code}]`;
};

// 1. KEYBOARD TESTER
export const KeyboardTesterTool: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [pressedHistory, setPressedHistory] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>('Chưa nhấn');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'full' | 'tkl' | 'numpad'>('full');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // AudioContext policy
    }
  };

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      // Prevent browser default actions (except Ctrl+R or F12)
      if (!e.ctrlKey || (e.key !== 'r' && e.key !== 'R')) {
        e.preventDefault();
      }

      const code = normalizeKeyCode(e);
      const display = getDisplayKeyLabel(e, code);
      setLastKey(display);

      setActiveKeys(prev => {
        const next = new Set(prev);
        next.add(code);
        // On Dell laptops, PrintScreen / SysRq is triggered via Fn+End or Fn+Home
        if (code === 'PrintScreen') {
          next.add('End');
          next.add('Home');
        }
        return next;
      });

      setPressedHistory(prev => {
        const next = new Set(prev);
        next.add(code);
        if (code === 'PrintScreen') {
          next.add('End');
          next.add('Home');
        }
        return next;
      });

      playClickSound();
    };

    const handleUp = (e: KeyboardEvent) => {
      const code = normalizeKeyCode(e);

      // CRITICAL FOR WINDOWS & PRINTSCREEN / DELL FN+END & FN+HOME (SysRq):
      // Windows intercepts PrintScreen at OS level and often ONLY sends `keyup`!
      // Therefore we must ensure `pressedHistory` is updated on keyup as well.
      setPressedHistory(prev => {
        const next = new Set(prev);
        next.add(code);
        if (code === 'PrintScreen') {
          next.add('End');
          next.add('Home');
        }
        return next;
      });

      const display = getDisplayKeyLabel(e, code);
      setLastKey(display);

      // If keydown was eaten by OS (e.g. PrintScreen Snipping Tool), flash activeKeys for 150ms
      if (!activeKeys.has(code) || code === 'PrintScreen') {
        playClickSound();
        setActiveKeys(prev => {
          const next = new Set(prev);
          next.add(code);
          if (code === 'PrintScreen') {
            next.add('End');
            next.add('Home');
          }
          return next;
        });

        setTimeout(() => {
          setActiveKeys(prev => {
            const next = new Set(prev);
            next.delete(code);
            if (code === 'PrintScreen') {
              next.delete('End');
              next.delete('Home');
            }
            return next;
          });
        }, 150);
      } else {
        setActiveKeys(prev => {
          const next = new Set(prev);
          next.delete(code);
          if (code === 'PrintScreen') {
            next.delete('End');
            next.delete('Home');
          }
          return next;
        });
      }
    };

    const handleBlur = () => {
      setActiveKeys(new Set());
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('blur', handleBlur);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [soundEnabled, activeKeys]);

  const reset = () => {
    setActiveKeys(new Set());
    setPressedHistory(new Set());
    setLastKey('Chưa nhấn');
  };

  // Support clicking on visual keys
  const handleVirtualKeyClick = (key: KeyDef) => {
    if (!key.code) return;
    setLastKey(`${key.label} [${key.code}] (Click test)`);
    setActiveKeys(prev => new Set(prev).add(key.code));
    setPressedHistory(prev => new Set(prev).add(key.code));
    playClickSound();
    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(key.code);
        return next;
      });
    }, 180);
  };

  const renderKey = (key: KeyDef) => {
    if (!key.code) {
      return <div key={Math.random()} className={key.width || 'w-10'} />;
    }

    const isActive = activeKeys.has(key.code);
    const isTested = pressedHistory.has(key.code);
    const widthClass = key.width || 'w-10 sm:w-11';
    const heightClass = key.height || 'h-10 sm:h-11';

    return (
      <button
        key={key.code}
        onClick={() => handleVirtualKeyClick(key)}
        className={`${heightClass} ${widthClass} rounded-lg text-[11px] font-mono font-semibold flex flex-col items-center justify-center transition-all duration-75 select-none text-center px-0.5 shrink-0 cursor-pointer ${
          isActive
            ? 'bg-emerald-500 text-slate-950 font-black scale-95 shadow-lg shadow-emerald-500/50'
            : isTested
            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-inner'
            : 'bg-slate-800/90 text-slate-300 border border-slate-700/60 hover:border-slate-500 active:scale-95'
        }`}
        title={`${key.label} (${key.code})${key.subLabel ? ` - ${key.subLabel}` : ''}`}
      >
        <span className="truncate leading-tight">{key.label}</span>
        {key.subLabel && (
          <span className={`text-[8px] leading-none ${isActive ? 'text-slate-900 font-bold' : isTested ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}`}>
            {key.subLabel}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs text-slate-400">Phím vừa nhận diện:</span>
          <p className="text-base font-mono font-bold text-emerald-400">{lastKey}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Layout switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setLayoutMode('full')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                layoutMode === 'full' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Full 100% (Dell / Desktop)
            </button>
            <button
              onClick={() => setLayoutMode('tkl')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                layoutMode === 'tkl' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Laptop TKL
            </button>
            <button
              onClick={() => setLayoutMode('numpad')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                layoutMode === 'numpad' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Chỉ Bàn phím số (Numpad)
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Âm thanh gõ phím"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="text-xs text-slate-400">
            Đã test: <b className="text-white font-mono">{pressedHistory.size}</b> phím
          </span>

          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* Extra Multimedia & Laptop Quick Controls Bar */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
          <Laptop className="w-4 h-4 text-emerald-400" />
          <span>Hàng phím Âm lượng &amp; Tiện ích Laptop:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {EXTRA_MEDIA_KEYS.map(k => renderKey(k))}
        </div>
      </div>

      {/* Visual Keyboard with Numpad & Navigation Cluster */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#080d19] border border-slate-800 shadow-2xl overflow-x-auto">
        <div className="flex gap-4 justify-center min-w-max mx-auto">
          {/* Main Cluster */}
          {layoutMode !== 'numpad' && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Khu vực gõ chính (Alphanumeric)
              </span>
              {MAIN_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1.5">
                  {row.map(k => renderKey(k))}
                </div>
              ))}
            </div>
          )}

          {/* Navigation & Arrow Cluster */}
          {layoutMode === 'full' && (
            <div className="space-y-1.5 border-l border-slate-800/80 pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Điều hướng &amp; PrtSc
              </span>
              {NAV_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1.5 min-h-[40px] sm:min-h-[44px]">
                  {row.map(k => renderKey(k))}
                </div>
              ))}
            </div>
          )}

          {/* Numpad Cluster (HỖ TRỢ NÚT MEDIA TRÊN DELL PRECISION M4800) */}
          {(layoutMode === 'full' || layoutMode === 'numpad') && (
            <div className="space-y-1.5 border-l border-slate-800/80 pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Numpad &amp; Nút Media Dell
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                  DELL M4800
                </span>
              </div>
              {NUMPAD_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1.5">
                  {row.map(k => renderKey(k))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guide Note for Laptop users */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Hỗ trợ toàn diện phím Laptop (Dell Precision M4800, ThinkPad, Asus, HP):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed text-[11px] sm:text-xs">
          <li>
            <strong className="text-white">Cụm nút đa phương tiện trên Dell Precision M4800:</strong> Đã cập nhật đầy đủ hàng 4 nút trên đầu Numpad: <code>⏮ Back</code>, <code>⏯ Play/Pause</code> (ở giữa), <code>⏭ Next</code>, và <code>⏹ Stop</code>.
          </li>
          <li>
            <strong className="text-white">Tại sao Fn + Home (SysRq) và Fn + End (PrtSc) đều ra chụp màn hình?</strong> Trong kiến trúc PC/IBM và hệ điều hành Windows, <code>Print Screen</code> và <code>SysRq (System Request)</code> dùng chung một mã phím ảo là <code>VK_SNAPSHOT (0x2C)</code>. Trên máy Dell Precision M4800, <code>Fn + End</code> là PrtSc (chụp toàn màn hình), còn <code>Fn + Home</code> là SysRq (chụp cửa sổ hiện tại). Do đó Windows đều hiểu cả hai tổ hợp này là lệnh Snapshot (Chụp màn hình).
          </li>
          <li>
            <strong className="text-white">Các phím tổ hợp Fn khác trên Dell:</strong> <code>Fn + Insert</code> (Pause/Break), <code>Fn + F12</code> (Scroll Lock), <code>Fn + F1..F12</code> (Ngủ, Wifi, Độ sáng, Âm lượng) đều được nhận diện trực tiếp.
          </li>
          <li>
            <strong className="text-white">Click chuột để test:</strong> Bạn cũng có thể click trực tiếp bằng chuột vào bất kỳ phím nào trên màn hình để kiểm tra âm thanh phản hồi và trạng thái hoạt động.
          </li>
        </ul>
      </div>
    </div>
  );
};

// 2. CHATTER TOOL
export const ChatterTool: React.FC = () => {
  const [thresholdMs, setThresholdMs] = useState(50);
  const [chatterLogs, setChatterLogs] = useState<{ key: string; code: string; delta: number; isChatter: boolean; time: string }[]>([]);
  const lastPressTime = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      const last = lastPressTime.current[e.code];
      lastPressTime.current[e.code] = now;

      if (last !== undefined) {
        const delta = Math.round(now - last);
        if (delta < 300) {
          const isChatter = delta <= thresholdMs;
          const timeStr = new Date().toLocaleTimeString();
          setChatterLogs(prev => [
            { key: e.key, code: e.code, delta, isChatter, time: timeStr },
            ...prev.slice(0, 40)
          ]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [thresholdMs]);

  const chatterCount = chatterLogs.filter(l => l.isChatter).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Ngưỡng Chatter:</span>
          <div className="flex items-center gap-1.5">
            {[30, 50, 75, 100].map(ms => (
              <button
                key={ms}
                onClick={() => setThresholdMs(ms)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                  thresholdMs === ms ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {ms} ms
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chatterCount > 0 ? (
            <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Phát hiện {chatterCount} lần Chatter!
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Chưa phát hiện lỗi lặp phím
            </span>
          )}
          <button
            onClick={() => setChatterLogs([])}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            Xóa nhật ký
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 min-h-[240px] max-h-[350px] overflow-y-auto font-mono text-xs">
        {chatterLogs.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-500">
            Nhấn nhanh nhiều lần cùng một phím để kiểm tra xem switch cơ có bị bounce/lặp phím không...
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {chatterLogs.map((log, idx) => (
              <div
                key={idx}
                className={`py-2 px-3 flex items-center justify-between rounded ${
                  log.isChatter ? 'bg-red-500/15 text-red-300 font-bold' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">
                    {log.key}
                  </span>
                  <span className="text-slate-400">{log.code}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Khoảng cách: <b className={log.isChatter ? 'text-red-400 text-sm' : 'text-emerald-400'}>{log.delta} ms</b></span>
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. KEY ROLLOVER (NKRO)
export const RolloverTool: React.FC = () => {
  const [currentHeld, setCurrentHeld] = useState<Set<string>>(new Set());
  const [maxHeld, setMaxHeld] = useState(0);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setCurrentHeld(prev => {
        const next = new Set(prev).add(e.code);
        if (next.size > maxHeld) setMaxHeld(next.size);
        return next;
      });
    };

    const handleUp = (e: KeyboardEvent) => {
      e.preventDefault();
      setCurrentHeld(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [maxHeld]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Số phím đang giữ đồng thời</span>
          <div className="text-6xl font-black font-mono text-emerald-400 my-2">
            {currentHeld.size}
          </div>
          <span className="text-xs text-slate-400">Giữ nhiều phím cùng lúc bằng cả 2 bàn tay</span>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Kỷ lục nhận diện tối đa (NKRO)</span>
          <div className="text-6xl font-black font-mono text-white my-2">
            {maxHeld}
          </div>
          <span className="text-xs text-slate-400">
            {maxHeld >= 10 ? 'Tuyệt vời! Bàn phím hỗ trợ NKRO đầy đủ.' : 'Bàn phím văn phòng thường giới hạn 3-6 phím (6KRO).'}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-400 block mb-2 font-semibold">Các phím đang được giữ:</span>
        <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
          {Array.from(currentHeld).length === 0 ? (
            <span className="text-xs text-slate-500 italic">Chưa giữ phím nào...</span>
          ) : (
            Array.from(currentHeld).map(code => (
              <span key={code} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-mono font-bold text-xs shadow-md">
                {code}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 4. HOLD DURATION TOOL
export const HoldDurationTool: React.FC = () => {
  const [history, setHistory] = useState<{ key: string; code: string; duration: number }[]>([]);
  const pressStarts = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (pressStarts.current[e.code] === undefined) {
        pressStarts.current[e.code] = performance.now();
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      const start = pressStarts.current[e.code];
      if (start !== undefined) {
        const duration = Math.round(performance.now() - start);
        delete pressStarts.current[e.code];
        setHistory(prev => [{ key: e.key, code: e.code, duration }, ...prev.slice(0, 20)]);
      }
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-white">Đo thời gian nhấn giữ phím</h3>
        <p className="text-xs text-slate-400 mt-1">
          Nhấn và thả bất kỳ phím nào để xem chính xác bạn đã giữ phím đó trong bao nhiêu mili-giây.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {history.map((h, i) => (
          <div key={i} className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 flex items-center justify-between">
            <span className="font-mono font-bold text-white">{h.key}</span>
            <span className="font-mono text-xs font-semibold text-emerald-400">{h.duration} ms</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. KEYBOARD EVENTS INSPECTOR
export const KeyboardEventsTool: React.FC = () => {
  const [events, setEvents] = useState<{ type: string; key: string; code: string; keyCode: number; location: number; repeat: boolean }[]>([]);

  useEffect(() => {
    const logEvent = (e: KeyboardEvent) => {
      e.preventDefault();
      setEvents(prev => [
        {
          type: e.type,
          key: e.key,
          code: e.code,
          keyCode: e.keyCode,
          location: e.location,
          repeat: e.repeat
        },
        ...prev.slice(0, 30)
      ]);
    };

    window.addEventListener('keydown', logEvent);
    window.addEventListener('keyup', logEvent);
    return () => {
      window.removeEventListener('keydown', logEvent);
      window.removeEventListener('keyup', logEvent);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-400">Nhật ký sự kiện bàn phím thời gian thực (keydown / keyup)</span>
        <button onClick={() => setEvents([])} className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300">
          Xóa bảng
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#090e1a]">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Sự kiện</th>
              <th className="p-3">e.key</th>
              <th className="p-3">e.code</th>
              <th className="p-3">e.keyCode</th>
              <th className="p-3">Location</th>
              <th className="p-3">Repeat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Hãy nhấn phím bất kỳ để ghi nhận sự kiện...
                </td>
              </tr>
            ) : (
              events.map((ev, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.type === 'keydown' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="p-3 text-white font-bold">{ev.key}</td>
                  <td className="p-3 text-emerald-400">{ev.code}</td>
                  <td className="p-3 text-slate-300">{ev.keyCode}</td>
                  <td className="p-3 text-slate-400">{ev.location}</td>
                  <td className="p-3 text-slate-400">{ev.repeat ? 'true' : 'false'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
