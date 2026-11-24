import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES, TOOLS, ToolCategory } from '../data/tools';
import { DynamicIcon } from '../components/DynamicIcon';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-200">Không tìm thấy danh mục</h1>
        <p className="text-slate-400">Danh mục bạn yêu cầu không tồn tại.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const categoryTools = TOOLS.filter(t => t.category === category.id);

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-[#0c1424] border border-slate-800 relative overflow-hidden">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tất cả danh mục</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <DynamicIcon name={category.icon} size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{category.name}</h1>
              <p className="text-sm text-slate-300 mt-1">{category.description}</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-emerald-400">
            {categoryTools.length} công cụ
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTools.map(tool => (
          <Link
            key={tool.id}
            to={`/${tool.category}/${tool.slug}`}
            className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0f172a]/60 hover:bg-[#131d35] border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
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
              <span>Bắt đầu kiểm tra</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
