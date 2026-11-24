import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { TOOLS, Tool } from '../data/tools';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = query.trim() === ''
    ? TOOLS.slice(0, 8)
    : TOOLS.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.badge.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (tool: Tool) => {
    onClose();
    navigate(`/${tool.category}/${tool.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm công cụ (vd: bàn phím, Hz, âm thanh, tính ngày, FPS...)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded">ESC</kbd>
        </div>

        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              Không tìm thấy công cụ phù hợp với từ khóa &quot;{query}&quot;.
            </div>
          ) : (
            filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <DynamicIcon name={tool.icon} size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{tool.shortDesc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
