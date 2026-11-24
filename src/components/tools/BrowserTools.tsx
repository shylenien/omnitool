import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, XCircle, Database, Maximize2 } from 'lucide-react';

// 1. BROWSER COMPATIBILITY
export const BrowserCompatibilityTool: React.FC = () => {
  const apis = [
    { name: 'WebAssembly (WASM)', supported: typeof WebAssembly === 'object' },
    { name: 'Web Audio API', supported: !!(window.AudioContext || (window as any).webkitAudioContext) },
    { name: 'WebRTC (MediaStream / PeerConnection)', supported: !!(navigator.mediaDevices && window.RTCPeerConnection) },
    { name: 'Service Worker', supported: 'serviceWorker' in navigator },
    { name: 'Web Workers', supported: typeof Worker !== 'undefined' },
    { name: 'WebGPU API', supported: 'gpu' in navigator },
    { name: 'Web Locks API', supported: 'locks' in navigator },
    { name: 'Notifications API', supported: 'Notification' in window },
    { name: 'Geolocation API', supported: 'geolocation' in navigator },
    { name: 'Async Clipboard API', supported: !!navigator.clipboard },
    { name: 'Web Bluetooth API', supported: 'bluetooth' in navigator },
    { name: 'Web USB API', supported: 'usb' in navigator },
    { name: 'Web Share API', supported: 'share' in navigator },
    { name: 'Fullscreen API', supported: !!document.fullscreenEnabled },
  ];

  const supportedCount = apis.filter(a => a.supported).length;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Khả năng tương thích Web APIs</h3>
          <p className="text-xs text-slate-400 mt-1">Trình duyệt của bạn hỗ trợ các công nghệ web hiện đại sau:</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
          {supportedCount} / {apis.length} API
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {apis.map(api => (
          <div
            key={api.name}
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              api.supported ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-red-500/5 border-red-500/20 text-slate-400'
            }`}
          >
            <span className="text-xs font-medium">{api.name}</span>
            {api.supported ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Có hỗ trợ
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <XCircle className="w-4 h-4" /> Không hỗ trợ
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. BROWSER STORAGE
export const BrowserStorageTool: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{ quota: string; usage: string; percent: number } | null>(null);

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        const quotaMB = estimate.quota ? (estimate.quota / (1024 * 1024 * 1024)).toFixed(2) : '0';
        const usageMB = estimate.usage ? (estimate.usage / (1024 * 1024)).toFixed(2) : '0';
        const percent = estimate.quota && estimate.usage ? Math.round((estimate.usage / estimate.quota) * 100) : 0;
        setStorageInfo({ quota: `${quotaMB} GB`, usage: `${usageMB} MB`, percent });
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-4">
        <Database className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Dung lượng bộ nhớ lưu trữ trình duyệt</h3>

        {storageInfo ? (
          <div className="space-y-3 max-w-md mx-auto">
            <div className="text-4xl font-bold font-mono text-white">
              {storageInfo.usage} <span className="text-sm font-normal text-slate-400">đã dùng trên</span> {storageInfo.quota}
            </div>

            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                style={{ width: `${Math.max(2, storageInfo.percent)}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Không thể đọc thông số Storage Quota API.</p>
        )}
      </div>
    </div>
  );
};

// 3. FULLSCREEN TEST
export const BrowserFullscreenTool: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFs = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFs = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-5">
        <Maximize2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Kiểm tra chế độ toàn màn hình (Fullscreen API)</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Trạng thái hiện tại: <b className="text-emerald-400">{isFullscreen ? 'ĐANG TOÀN MÀN HÌNH' : 'CỬA SỔ THƯỜNG'}</b>
        </p>

        <div>
          <button
            onClick={toggleFs}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            {isFullscreen ? 'Thoát toàn màn hình' : 'Vào chế độ toàn màn hình'}
          </button>
        </div>
      </div>
    </div>
  );
};
