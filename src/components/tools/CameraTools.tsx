import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Download, Video, CheckCircle } from 'lucide-react';

// 1. CAMERA PREVIEW
export const CameraPreviewTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (deviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);

      const allDevs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = allDevs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
    } catch (e) {
      alert('Không thể mở camera. Vui lòng cấp quyền truy cập trong trình duyệt.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0);
    const link = document.createElement('a');
    link.download = `webcam-snapshot-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          {devices.length > 0 && (
            <select
              value={selectedDeviceId}
              onChange={e => {
                setSelectedDeviceId(e.target.value);
                startCamera(e.target.value);
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
            onClick={isActive ? stopCamera : () => startCamera(selectedDeviceId)}
            className={`px-4 py-2 rounded-xl font-bold text-xs ${
              isActive ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {isActive ? 'Tắt camera' : 'Mở webcam'}
          </button>
        </div>
      </div>

      <div className="relative h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
        {!isActive ? (
          <div className="text-center text-slate-500 space-y-2">
            <Camera className="w-12 h-12 mx-auto" />
            <p className="text-xs">Bấm &quot;Mở webcam&quot; để xem trước luồng camera.</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

// 2. CAMERA RESOLUTION
export const CameraResolutionTool: React.FC = () => {
  const [resolution, setResolution] = useState<{ w: number; h: number; ratio: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkResolution = async () => {
    setIsChecking(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 4096 }, height: { ideal: 2160 } } });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      const w = settings.width || 0;
      const h = settings.height || 0;

      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const div = gcd(w, h);
      const ratio = `${w / div}:${h / div}`;

      setResolution({ w, h, ratio });
      track.stop();
    } catch (e) {
      alert('Không thể đọc độ phân giải camera.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-5">
        <Video className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Kiểm tra độ phân giải Camera tối đa</h3>

        {resolution ? (
          <div className="space-y-2">
            <div className="text-5xl font-black font-mono text-white">
              {resolution.w} × {resolution.h}
            </div>
            <p className="text-sm font-mono text-emerald-400 font-semibold">
              Tỷ lệ khung hình: {resolution.ratio}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hệ thống sẽ yêu cầu luồng video chất lượng cao nhất mà cảm biến camera máy bạn có thể cung cấp.
          </p>
        )}

        <div>
          <button
            onClick={checkResolution}
            disabled={isChecking}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            {isChecking ? 'Đang phân tích...' : 'Quét độ phân giải camera'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. CAMERA FPS TEST
export const CameraFpsTool: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafRef = useRef<number>(0);

  const startFpsTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);

      const countLoop = (now: number) => {
        frameCount.current++;
        const delta = now - lastTime.current;
        if (delta >= 1000) {
          setFps(Math.round((frameCount.current * 1000) / delta));
          frameCount.current = 0;
          lastTime.current = now;
        }
        rafRef.current = requestAnimationFrame(countLoop);
      };

      rafRef.current = requestAnimationFrame(countLoop);
    } catch (e) {
      alert('Không thể kết nối camera để đo FPS.');
    }
  };

  const stopFpsTest = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setFps(0);
  };

  useEffect(() => {
    return () => stopFpsTest();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-5">
        <span className="text-xs font-semibold text-emerald-400 uppercase">Tốc độ khung hình thực tế</span>
        <div className="text-7xl font-black font-mono text-white">
          {fps > 0 ? fps : '--'} <span className="text-2xl text-emerald-400 font-normal">FPS</span>
        </div>
        <p className="text-xs text-slate-400">
          Camera thông thường đạt khoảng 30 FPS hoặc 60 FPS trong điều kiện đủ ánh sáng.
        </p>

        <video ref={videoRef} autoPlay playsInline muted className="hidden" />

        <div>
          <button
            onClick={isActive ? stopFpsTest : startFpsTest}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs ${
              isActive ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {isActive ? 'Dừng đo FPS' : 'Bắt đầu đo FPS Camera'}
          </button>
        </div>
      </div>
    </div>
  );
};
