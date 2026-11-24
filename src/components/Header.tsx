import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Search, ChevronDown, Menu, X } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { SearchModal } from './SearchModal';
import { DynamicIcon } from './DynamicIcon';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Omni Tool
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 rounded">
                  48 TOOLS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Hiểu rõ thiết bị · Kiểm tra trực tiếp</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES.map(cat => {
              const catTools = TOOLS.filter(t => t.category === cat.id);
              const isActive = location.pathname.startsWith(`/${cat.id}`);

              return (
                <div 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/${cat.id}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                      isActive 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Dropdown Menu */}
                  {activeDropdown === cat.id && (
                    <div className="absolute top-full left-0 w-72 pt-1.5 z-50">
                      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800/80 mb-1">
                          <span>{cat.name} ({catTools.length} tools)</span>
                          <Link to={`/${cat.id}`} className="text-emerald-400 hover:underline">Xem tất cả</Link>
                        </div>
                        <div className="max-h-80 overflow-y-auto space-y-0.5">
                          {catTools.map(t => (
                            <Link
                              key={t.id}
                              to={`/${t.category}/${t.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors group"
                            >
                              <DynamicIcon name={t.icon} size={15} className="text-slate-400 group-hover:text-emerald-400" />
                              <span className="truncate">{t.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Tìm công cụ...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">Ctrl K</kbd>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0a0f1d] px-4 py-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  to={`/${cat.id}`}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-medium text-slate-200 hover:text-emerald-400 hover:border-emerald-500/30 flex items-center gap-2"
                >
                  <DynamicIcon name={cat.icon} size={16} className="text-emerald-400" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
