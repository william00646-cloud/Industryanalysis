import { useState } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { useIndustry } from '../../context/IndustryContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard, BarChart3, Map, GitBranch, TrendingUp,
  Zap, ChevronDown, Briefcase, Radio, Star, FileText,
  Activity, Search, Newspaper, Settings, HelpCircle, Shield,
} from 'lucide-react';

interface NavItem {
  id: TerminalPageId;
  label: { en: string; zh: string };
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  label: { en: string; zh: string };
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: { en: 'General', zh: '總覽' },
    items: [
      { id: 'command-center', label: { en: 'Dashboard', zh: '儀表板' }, icon: <LayoutDashboard size={15} /> },
      { id: 'market-monitor', label: { en: 'Market Monitor', zh: '市場監控' }, icon: <Activity size={15} /> },
    ],
  },
  {
    label: { en: 'Analysis', zh: '分析' },
    items: [
      { id: 'industry-map',   label: { en: 'Industry Map',    zh: '產業地圖' }, icon: <Map size={15} /> },
      { id: 'value-chain',    label: { en: 'Value Chain',     zh: '價值鏈' },   icon: <GitBranch size={15} /> },
      { id: 'supply-demand',  label: { en: 'Supply / Demand', zh: '供需分析' }, icon: <BarChart3 size={15} /> },
      { id: 'price-spread',   label: { en: 'Price & Spread',  zh: '價格與價差' }, icon: <TrendingUp size={15} /> },
    ],
  },
  {
    label: { en: 'Companies', zh: '公司' },
    items: [
      { id: 'company-screener',  label: { en: 'Screener',   zh: '公司篩選器' }, icon: <Search size={15} /> },
      { id: 'company-workspace', label: { en: 'Workspace',  zh: '公司工作台' }, icon: <Briefcase size={15} /> },
    ],
  },
  {
    label: { en: 'Intelligence', zh: '情報' },
    items: [
      { id: 'news-terminal', label: { en: 'News Terminal', zh: '新聞終端' }, icon: <Newspaper size={15} /> },
      { id: 'event-impact',  label: { en: 'Event Impact',  zh: '事件衝擊' }, icon: <Radio size={15} /> },
    ],
  },
  {
    label: { en: 'Workspace', zh: '工作台' },
    items: [
      { id: 'watchlist',      label: { en: 'Watchlist',       zh: '追蹤清單' }, icon: <Star size={15} /> },
      { id: 'research-notes', label: { en: 'Research Notes',  zh: '研究筆記' }, icon: <FileText size={15} /> },
    ],
  },
];

interface SidebarProps {
  current: TerminalPageId;
  onNavigate: (page: TerminalPageId) => void;
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  const { industry, industryId, setIndustryId, allIndustries } = useIndustry();
  const { lang, toggleLang } = useLanguage();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm tracking-tight leading-none">SectorScope</p>
            <p className="text-slate-400 text-[10px] font-medium mt-0.5">{lang === 'zh' ? '產業情報平台' : 'Industry Intelligence'}</p>
          </div>
        </div>
      </div>

      {/* Industry Selector */}
      <div className="px-3 py-3 border-b border-slate-100">
        <div className="relative">
          <button
            onClick={() => setPickerOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
          >
            <span className="text-base">{industry.meta.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-xs font-semibold truncate">{industry.meta.shortName}</p>
              <p className="text-slate-400 text-[10px]">{lang === 'zh' ? '目前產業' : 'Current sector'}</p>
            </div>
            <ChevronDown size={12} className={`text-slate-400 flex-shrink-0 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {pickerOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-card-lg z-50 overflow-hidden animate-fade-in">
              <div className="py-1">
                {allIndustries.map(ind => (
                  <button
                    key={ind.id}
                    onClick={() => { setIndustryId(ind.id); setPickerOpen(false); onNavigate('command-center'); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${
                      ind.id === industryId ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-600'
                    }`}
                  >
                    <span className="text-sm">{ind.icon}</span>
                    <span className="truncate">{ind.shortName}</span>
                    {ind.id === industryId && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
        {navGroups.map(group => (
          <div key={group.label.en} className="mb-2">
            <p className="section-label">{group.label[lang]}</p>
            {group.items.map(item => {
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label[lang]}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-1">
        <button
          onClick={toggleLang}
          className="nav-item"
        >
          <Settings size={15} />
          <span className="flex-1">{lang === 'zh' ? '語言' : 'Language'}</span>
          <span className="chip chip-blue text-[10px] px-1.5 py-0.5">{lang === 'en' ? 'EN' : '中'}</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="dot-online flex-shrink-0" />
          <span className="text-slate-400 text-[10px]">Demo · v0.3</span>
          <span className="ml-auto text-slate-300 text-[10px]">⌘K</span>
        </div>
      </div>
    </aside>
  );
}
