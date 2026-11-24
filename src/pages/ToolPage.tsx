import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Share2 } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { DynamicIcon } from '../components/DynamicIcon';

// Screen tools
import {
  RefreshRateTool, GhostingTool, ResolutionTool, ViewportTool,
  AspectRatioTool, PpiTool, DeadPixelTool, StuckPixelTool,
  BacklightBleedTool, ColorGradientTool, TouchTool
} from '../components/tools/ScreenTools';

// Keyboard tools
import {
  KeyboardTesterTool, ChatterTool, RolloverTool, HoldDurationTool, KeyboardEventsTool
} from '../components/tools/KeyboardTools';

// Mouse tools
import {
  MouseButtonsTool, DoubleClickTool, MouseCpsTool, MouseScrollTool,
  PollingRateTool, MouseMovementTool, MouseAccuracyTool
} from '../components/tools/MouseTools';

// Audio tools
import {
  MicrophoneTool, SpectrumTool, SpeakerTool, StereoTool, FrequencyGeneratorTool
} from '../components/tools/AudioTools';

// Camera tools
import {
  CameraPreviewTool, CameraResolutionTool, CameraFpsTool
} from '../components/tools/CameraTools';

// Device tools
import {
  DeviceInfoTool, DeviceGpuTool, PointerCapabilitiesTool
} from '../components/tools/DeviceTools';

// Browser tools
import {
  BrowserCompatibilityTool, BrowserStorageTool, BrowserFullscreenTool
} from '../components/tools/BrowserTools';

// Utility tools
import {
  NumberToWordsTool, PercentageTool, WordCounterTool, CaseConverterTool,
  SlugGeneratorTool, TextCleanerTool, UnitConverterTool, DateCalculatorTool,
  PasswordGeneratorTool, ColorPickerTool, JsonFormatterTool
} from '../components/tools/UtilityTools';

export const ToolPage: React.FC = () => {
  const { categoryId, slug } = useParams<{ categoryId: string; slug: string }>();

  const tool = TOOLS.find(t => t.category === categoryId && t.slug === slug);
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!tool || !category) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-200">Không tìm thấy công cụ</h1>
        <p className="text-slate-400">Công cụ bạn đang tìm kiếm không tồn tại hoặc đã được chuyển địa chỉ.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (`${categoryId}/${slug}`) {
      // Screen
      case 'screen/refresh-rate': return <RefreshRateTool />;
      case 'screen/ghosting': return <GhostingTool />;
      case 'screen/resolution': return <ResolutionTool />;
      case 'screen/viewport': return <ViewportTool />;
      case 'screen/aspect-ratio': return <AspectRatioTool />;
      case 'screen/ppi': return <PpiTool />;
      case 'screen/dead-pixel': return <DeadPixelTool />;
      case 'screen/stuck-pixel': return <StuckPixelTool />;
      case 'screen/backlight-bleed': return <BacklightBleedTool />;
      case 'screen/color-gradient': return <ColorGradientTool />;
      case 'screen/touch': return <TouchTool />;

      // Keyboard
      case 'keyboard/tester': return <KeyboardTesterTool />;
      case 'keyboard/chatter': return <ChatterTool />;
      case 'keyboard/rollover': return <RolloverTool />;
      case 'keyboard/hold': return <HoldDurationTool />;
      case 'keyboard/events': return <KeyboardEventsTool />;

      // Mouse
      case 'mouse/buttons': return <MouseButtonsTool />;
      case 'mouse/double-click': return <DoubleClickTool />;
      case 'mouse/cps': return <MouseCpsTool />;
      case 'mouse/scroll': return <MouseScrollTool />;
      case 'mouse/polling-rate': return <PollingRateTool />;
      case 'mouse/movement': return <MouseMovementTool />;
      case 'mouse/accuracy': return <MouseAccuracyTool />;

      // Audio
      case 'audio/microphone': return <MicrophoneTool />;
      case 'audio/spectrum': return <SpectrumTool />;
      case 'audio/speaker': return <SpeakerTool />;
      case 'audio/stereo': return <StereoTool />;
      case 'audio/frequency-generator': return <FrequencyGeneratorTool />;

      // Camera
      case 'camera/preview': return <CameraPreviewTool />;
      case 'camera/resolution': return <CameraResolutionTool />;
      case 'camera/fps': return <CameraFpsTool />;

      // Device
      case 'device/information': return <DeviceInfoTool />;
      case 'device/gpu': return <DeviceGpuTool />;
      case 'device/pointer-capabilities': return <PointerCapabilitiesTool />;

      // Browser
      case 'browser/compatibility': return <BrowserCompatibilityTool />;
      case 'browser/storage': return <BrowserStorageTool />;
      case 'browser/fullscreen': return <BrowserFullscreenTool />;

      // Utilities
      case 'utilities/number-to-words': return <NumberToWordsTool />;
      case 'utilities/percentage': return <PercentageTool />;
      case 'utilities/word-counter': return <WordCounterTool />;
      case 'utilities/case-converter': return <CaseConverterTool />;
      case 'utilities/remove-accents-slug': return <SlugGeneratorTool />;
      case 'utilities/text-cleaner': return <TextCleanerTool />;
      case 'utilities/unit-converter': return <UnitConverterTool />;
      case 'utilities/date-calculator': return <DateCalculatorTool />;
      case 'utilities/password-generator': return <PasswordGeneratorTool />;
      case 'utilities/color-picker': return <ColorPickerTool />;
      case 'utilities/json-formatter': return <JsonFormatterTool />;

      default:
        return <div className="p-8 text-center text-slate-400">Công cụ đang được chuẩn bị.</div>;
    }
  };

  const relatedTools = TOOLS.filter(t => t.category === category.id && t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Title */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to={`/${category.id}`} className="hover:text-emerald-400 transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-slate-200">{tool.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <DynamicIcon name={tool.icon} size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{tool.title}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700/60">
                  {tool.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{tool.shortDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: tool.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết công cụ!');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="min-h-[350px]">
        {renderToolComponent()}
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Cam kết bảo mật:</strong> Mọi thử nghiệm và thông tin trên trang này được xử lý hoàn toàn trong trình duyệt cục bộ của bạn, không gửi hay lưu trữ bất kỳ dữ liệu cá nhân nào lên máy chủ.
        </span>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Các công cụ khác trong nhóm {category.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedTools.map(rt => (
              <Link
                key={rt.id}
                to={`/${rt.category}/${rt.slug}`}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <DynamicIcon name={rt.icon} size={16} className="text-slate-400 group-hover:text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate">{rt.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
