import React, { useState, useEffect, useRef } from 'react';
import { Camera, Download, Video, Loader2, AlertCircle } from 'lucide-react';

// 1. CAMERA PREVIEW
export const CameraPreviewTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [streamInfo, setStreamInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const refreshDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return [];
      const allDevs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = allDevs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
      return videoDevs;
    } catch {
      return [];
    }
  };

  const resetVideoElement = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.srcObject = null;
    videoRef.current.removeAttribute('src');
    videoRef.current.load();
  };

  const stopCamera = () => {
    resetVideoElement();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setStreamInfo('');
  };

  const startCamera = async (deviceId?: string, exactMatch = false) => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Trình duyệt hoặc môi trường hiện tại không hỗ trợ truy cập Camera/Webcam.');
      return;
    }

    setIsLoading(true);
    try {
      resetVideoElement();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      // If no explicit deviceId, prefer a physical/USB cam over virtual cams (OBS, etc.) when labels are available
      let targetId = deviceId;
      if (!targetId) {
        const knownDevs = devices.length > 0 ? devices : await refreshDevices();
        const physicalCam = knownDevs.find(
          d => d.deviceId && d.label && !/obs|virtual|snap|manycam|droidcam|iriun/i.test(d.label)
        );
        if (physicalCam) {
          targetId = physicalCam.deviceId;
        }
      }

      // Let camera open at its native default resolution (avoids UVC mode-switch bugs on 058f:3841 / Brave)
      let stream: MediaStream;
      try {
        const videoConstraint: boolean | MediaTrackConstraints = targetId
          ? { deviceId: exactMatch ? { exact: targetId } : { ideal: targetId } }
          : true;
        stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraint });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      const settings = track?.getSettings();
      if (settings?.width && settings?.height) {
        setStreamInfo(`${settings.width}×${settings.height}${settings.frameRate ? ` · ${Math.round(settings.frameRate)} FPS` : ''}`);
      }
      if (settings?.deviceId) {
        setSelectedDeviceId(settings.deviceId);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsActive(true);

      refreshDevices();
    } catch {
      setErrorMsg('Không thể mở camera. Vui lòng cấp quyền truy cập hoặc kiểm tra xem thiết bị có đang bị ứng dụng khác chiếm dụng không.');
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDevices();
    const handleDeviceChange = () => {
      refreshDevices();
    };
    navigator.mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      stopCamera();
    };
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current || !isActive) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0);
    const link = document.createElement('a');
    link.download = `webcam-snapshot-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          {devices.length > 0 && (
            <select
              value={selectedDeviceId}
              onChange={e => {
                setSelectedDeviceId(e.target.value);
                startCamera(e.target.value, true);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
            >
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            Lật gương: {isMirrored ? 'Bật' : 'Tắt'}
          </button>
          {streamInfo && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              {streamInfo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={takeSnapshot}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Chụp ảnh</span>
            </button>
          )}
          <button
            disabled={isLoading}
            onClick={isActive ? stopCamera : () => startCamera(selectedDeviceId || undefined)}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-60 ${
              isActive ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLoading ? 'Đang mở...' : isActive ? 'Tắt camera' : 'Mở webcam'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="relative h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Keep video permanently in normal flow; overlay placeholder when inactive */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={e => e.currentTarget.play().catch(() => {})}
          style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
          className="w-full h-full object-contain"
        />

        {!isActive && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center text-slate-500 space-y-2 px-4">
            {isLoading ? (
              <>
                <Loader2 className="w-10 h-10 mx-auto animate-spin text-emerald-400" />
                <p className="text-xs text-slate-300">Đang kết nối cảm biến camera...</p>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 mx-auto" />
                <p className="text-xs">Bấm &quot;Mở webcam&quot; để xem trước luồng camera.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 2. CAMERA RESOLUTION
export const CameraResolutionTool: React.FC = () => {
  const [resolution, setResolution] = useState<{ w: number; h: number; ratio: string; maxW?: number; maxH?: number } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkResolution = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Trình duyệt hoặc môi trường hiện tại không hỗ trợ truy cập Camera/Webcam.');
      return;
    }

    setIsChecking(true);
    try {
      // Open default stream first (much faster than forcing 4K probe on 720p/1080p webcams),
      // then read hardware capabilities directly or upgrade via applyConstraints if supported.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      let settings = track.getSettings();
      let maxW: number | undefined;
      let maxH: number | undefined;

      if (typeof track.getCapabilities === 'function') {
        const caps = track.getCapabilities();
        maxW = caps.width?.max;
        maxH = caps.height?.max;
        if (maxW && maxH && (maxW !== settings.width || maxH !== settings.height)) {
          try {
            await track.applyConstraints({ width: { ideal: maxW }, height: { ideal: maxH } });
            settings = track.getSettings();
          } catch {
            // Keep initial settings if driver rejects constraint upgrade
          }
        }
      }

      const w = maxW && maxW > (settings.width || 0) ? maxW : settings.width || 0;
      const h = maxH && maxH > (settings.height || 0) ? maxH : settings.height || 0;

      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const div = w > 0 && h > 0 ? gcd(w, h) : 1;
      const ratio = w > 0 && h > 0 ? `${w / div}:${h / div}` : '--';

      setResolution({ w, h, ratio, maxW: settings.width, maxH: settings.height });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setErrorMsg('Không thể đọc độ phân giải camera. Vui lòng cấp quyền camera.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-5">
        <Video className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Kiểm tra độ phân giải Camera tối đa</h3>

        {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

        {resolution ? (
          <div className="space-y-2">
            <div className="text-5xl font-black font-mono text-white">
              {resolution.w} × {resolution.h}
            </div>
            <p className="text-sm font-mono text-emerald-400 font-semibold">
              Tỷ lệ khung hình: {resolution.ratio}
            </p>
            {resolution.maxW && resolution.maxH && (resolution.maxW !== resolution.w || resolution.maxH !== resolution.h) && (
              <p className="text-xs text-slate-400">
                Luồng thực tế đang cấp: {resolution.maxW} × {resolution.maxH}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hệ thống đọc trực tiếp khả năng phần cứng (Capabilities) và luồng video chất lượng cao nhất của cảm biến camera.
          </p>
        )}

        <div>
          <button
            onClick={checkResolution}
            disabled={isChecking}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 disabled:opacity-60"
          >
            {isChecking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isChecking ? 'Đang quét...' : 'Quét độ phân giải camera'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. CAMERA FPS TEST
export const CameraFpsTool: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [nominalFps, setNominalFps] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callbackIdRef = useRef<number>(0);
  const usingVideoCallbackRef = useRef(false);

  const stopFpsTest = () => {
    const video = videoRef.current as any;
    if (callbackIdRef.current) {
      if (usingVideoCallbackRef.current && video?.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(callbackIdRef.current);
      } else {
        cancelAnimationFrame(callbackIdRef.current);
      }
      callbackIdRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setFps(0);
    setNominalFps(null);
  };

  const startFpsTest = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Trình duyệt hoặc môi trường hiện tại không hỗ trợ truy cập Camera/Webcam.');
      return;
    }

    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { frameRate: { ideal: 60 } } });
      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      const reportedFps = track?.getSettings()?.frameRate;
      if (reportedFps) {
        setNominalFps(Math.round(reportedFps));
        setFps(Math.round(reportedFps));
      }

      const video = videoRef.current as any;
      if (!video) return;
      video.srcObject = stream;
      await video.play().catch(() => {});
      setIsActive(true);

      let frames = 0;
      let windowStart = performance.now();

      if (typeof video.requestVideoFrameCallback === 'function') {
        usingVideoCallbackRef.current = true;
        const onFrame = (now: number) => {
          frames++;
          const delta = now - windowStart;
          if (delta >= 500) {
            setFps(Math.round((frames * 1000) / delta));
            frames = 0;
            windowStart = now;
          }
          callbackIdRef.current = video.requestVideoFrameCallback(onFrame);
        };
        callbackIdRef.current = video.requestVideoFrameCallback(onFrame);
      } else {
        usingVideoCallbackRef.current = false;
        let lastVideoTime = -1;
        const onRaf = (now: number) => {
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            frames++;
          }
          const delta = now - windowStart;
          if (delta >= 500) {
            setFps(Math.round((frames * 1000) / delta));
            frames = 0;
            windowStart = now;
          }
          callbackIdRef.current = requestAnimationFrame(onRaf);
        };
        callbackIdRef.current = requestAnimationFrame(onRaf);
      }
    } catch {
      setErrorMsg('Không thể kết nối camera để đo FPS.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => stopFpsTest();
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-5 overflow-hidden">
        <span className="text-xs font-semibold text-emerald-400 uppercase">Tốc độ khung hình camera thực tế</span>
        <div className="text-7xl font-black font-mono text-white">
          {fps > 0 ? fps : '--'} <span className="text-2xl text-emerald-400 font-normal">FPS</span>
        </div>
        {nominalFps !== null && (
          <p className="text-xs font-mono text-slate-300">
            Driver khai báo: <span className="text-emerald-400 font-bold">{nominalFps} FPS</span>
          </p>
        )}
        {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}
        <p className="text-xs text-slate-400">
          Đo trực tiếp số khung hình thật từ cảm biến camera qua <code className="text-emerald-400">requestVideoFrameCallback</code>.
        </p>

        {/* Keep video rendered offscreen (not display:none) so browser decodes every camera frame */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="opacity-0 pointer-events-none absolute w-px h-px"
        />

        <div>
          <button
            disabled={isLoading}
            onClick={isActive ? stopFpsTest : startFpsTest}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 disabled:opacity-60 ${
              isActive ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLoading ? 'Đang kết nối...' : isActive ? 'Dừng đo FPS' : 'Bắt đầu đo FPS Camera'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
