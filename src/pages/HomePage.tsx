import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS, ToolCategory } from '../data/tools';
import { DynamicIcon } from '../components/DynamicIcon';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0d1322] to-[#090d16] border border-slate-800/80 p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>48 CÔNG CỤ HOÀN TOÀN MIỄN PHÍ · CHẠY TRỰC TIẾP TRÊN TRÌNH DUYỆT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hiểu rõ thiết bị của bạn.<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Kiểm tra thật. Kết quả minh bạch.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Bộ công cụ trực tuyến toàn diện giúp bạn chẩn đoán màn hình, bàn phím, chuột, microphone, loa, webcam, phần cứng thiết bị và các tiện ích số thường ngày.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Không cần cài đặt</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Riêng tư & Bảo mật 100%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Độ trễ bằng 0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Khám phá công cụ ({TOOLS.length})</h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Tất cả (48)
            </button>
            {CATEGORIES.map(cat => {
              const count = TOOLS.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <DynamicIcon name={cat.icon} size={14} />
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              to={`/${tool.category}/${tool.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0f172a]/60 hover:bg-[#131d35] border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 text-slate-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 flex items-center justify-center transition-all">
                    <DynamicIcon name={tool.icon} size={20} />
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-emerald-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span>Mở công cụ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>9 Nhóm kiểm tra chuyên biệt</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map(cat => {
            const count = TOOLS.filter(t => t.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/${cat.id}`}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <DynamicIcon name={cat.icon} size={22} />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {count} công cụ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-emerald-400">
                  <span>Xem chi tiết danh mục</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
