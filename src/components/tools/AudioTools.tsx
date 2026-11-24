import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Headphones, Play, Pause, Radio, BarChart2 } from 'lucide-react';

// 1. MICROPHONE TEST
export const MicrophoneTool: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const startMic = async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Trình duyệt hoặc môi trường hiện tại không hỗ trợ truy cập microphone.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setVolume(normalized);
        rafRef.current = requestAnimationFrame(checkVolume);
      };

      setIsRecording(true);
      checkVolume();
    } catch (err: any) {
      setError('Không thể truy cập microphone. Vui lòng cấp quyền trong trình duyệt.');
    }
  };

  const stopMic = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsRecording(false);
    setVolume(0);
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1629] border border-slate-800 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <Mic className={`w-8 h-8 ${isRecording ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Kiểm tra tín hiệu Microphone</h3>
          <p className="text-xs text-slate-400 mt-1">Nói vào microphone để kiểm tra mức âm lượng nhận diện.</p>
        </div>

        {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

        {/* Volume Level Bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="h-6 w-full rounded-full bg-slate-800/80 p-1 border border-slate-700/60 overflow-hidden flex items-center">
            <div
              style={{ width: `${volume}%` }}
              className={`h-full rounded-full transition-all duration-75 ${
                volume > 75 ? 'bg-red-500' : volume > 40 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>Yếu (0%)</span>
            <span>Mức âm: {volume}%</span>
            <span>Mạnh (100%)</span>
          </div>
        </div>

        <div>
          <button
            onClick={isRecording ? stopMic : startMic}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              isRecording ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isRecording ? 'Dừng kiểm tra' : 'Bắt đầu kiểm tra Mic'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. AUDIO SPECTRUM ANALYZER
export const SpectrumTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const startSpectrum = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Trình duyệt hoặc môi trường hiện tại không hỗ trợ truy cập microphone.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#090e1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          ctx.fillStyle = `rgb(16, 185, 129)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      };

      setIsActive(true);
      draw();
    } catch (e) {
      alert('Vui lòng cấp quyền Microphone để phân tích phổ âm thanh.');
    }
  };

  const stopSpectrum = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopSpectrum();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-300">Biểu đồ phổ tần số âm thanh thời gian thực (FFT)</span>
        <button
          onClick={isActive ? stopSpectrum : startSpectrum}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${
            isActive ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
          }`}
        >
          {isActive ? 'Dừng phân tích' : 'Bật phân tích FFT'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#090e1a]">
        <canvas ref={canvasRef} width={800} height={260} className="w-full h-64 block" />
      </div>
    </div>
  );
};

// 3. SPEAKER TEST
export const SpeakerTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playTone = (freq: number) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    setIsPlaying(true);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-5">
        <Volume2 className={`w-12 h-12 text-emerald-400 mx-auto ${isPlaying ? 'animate-bounce' : ''}`} />
        <h3 className="text-xl font-bold text-white">Kiểm tra loa & tai nghe</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Nhấn các nút âm thanh mẫu bên dưới để kiểm tra các dải âm trầm (Bass), dải âm trung (Mid) và dải âm cao (Treble).
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => playTone(120)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
          >
            Âm trầm (Bass 120 Hz)
          </button>
          <button
            onClick={() => playTone(1000)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20"
          >
            Âm chuẩn (Chuẩn 1000 Hz)
          </button>
          <button
            onClick={() => playTone(5000)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
          >
            Âm cao (Treble 5000 Hz)
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. STEREO SEPARATION TEST
export const StereoTool: React.FC = () => {
  const [playingChannel, setPlayingChannel] = useState<'left' | 'right' | 'both' | null>(null);

  const playChannel = (panValue: number, channel: 'left' | 'right' | 'both') => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    if (panner) {
      panner.pan.setValueAtTime(panValue, audioCtx.currentTime);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(audioCtx.destination);

    setPlayingChannel(channel);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
    setTimeout(() => setPlayingChannel(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-6">
        <Headphones className="w-12 h-12 text-emerald-400 mx-auto" />
        <div>
          <h3 className="text-xl font-bold text-white">Kiểm tra kênh Stereo (Trái / Phải)</h3>
          <p className="text-xs text-slate-400 mt-1">Đeo tai nghe và nhấn phát riêng từng bên để kiểm tra kênh âm thanh.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => playChannel(-1.0, 'left')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              playingChannel === 'left' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-xl' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            ← Chỉ phát kênh TRÁI (Left)
          </button>
          <button
            onClick={() => playChannel(0.0, 'both')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              playingChannel === 'both' ? 'bg-cyan-500 text-slate-950 scale-105' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Cả 2 bên (Center)
          </button>
          <button
            onClick={() => playChannel(1.0, 'right')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              playingChannel === 'right' ? 'bg-emerald-500 text-slate-950 scale-105 shadow-xl' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Chỉ phát kênh PHẢI (Right) →
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. FREQUENCY GENERATOR
export const FrequencyGeneratorTool: React.FC = () => {
  const [freq, setFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (_) {}
        try { oscRef.current.disconnect(); } catch (_) {}
      }
      setIsPlaying(false);
    } else {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();

      oscRef.current = osc;
      setIsPlaying(true);
    }
  };

  const handleFreqChange = (newFreq: number) => {
    setFreq(newFreq);
    if (isPlaying && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(newFreq, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (_) {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-slate-800 text-center space-y-6">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Bộ tạo tần số âm thanh</span>
        <div className="text-6xl sm:text-7xl font-black font-mono text-white">
          {freq} <span className="text-2xl text-emerald-400 font-normal">Hz</span>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          <input
            type="range"
            min={20}
            max={10000}
            step={5}
            value={freq}
            onChange={e => handleFreqChange(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>20 Hz</span>
            <span>1,000 Hz</span>
            <span>10,000 Hz</span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          {[60, 120, 440, 1000, 2500, 5000].map(f => (
            <button
              key={f}
              onClick={() => handleFreqChange(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                freq === f ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f} Hz
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={toggleSound}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 mx-auto transition-all ${
              isPlaying ? 'bg-red-500 hover:bg-red-400 text-white shadow-xl' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Dừng phát sóng âm' : 'Bắt đầu phát sóng âm'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
