import { useState } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { useIndustry } from '../../context/IndustryContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  BarChart3,
  Map,
  GitBranch,
  TrendingUp,
  Building2,
  Newspaper,
  Zap,
  ChevronDown,
  Briefcase,
  Radio,
  Star,
  FileText,
  Activity,
  Search,
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: { id: TerminalPageId; label: string; icon: React.ReactNode; badge?: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'command-center', label: 'Command Center', icon: <LayoutDashboard size={15} /> },
      { id: 'market-monitor', label: 'Market Monitor', icon: <Activity size={15} /> },
    ],
  },
  {
    label: 'Industry',
    items: [
      { id: 'industry-map', label: 'Industry Map', icon: <Map size={15} /> },
      { id: 'value-chain', label: 'Value Chain', icon: <GitBranch size={15} /> },
      { id: 'supply-demand', label: 'Supply / Demand', icon: <BarChart3 size={15} /> },
      { id: 'price-spread', label: 'Price & Spread', icon: <TrendingUp size={15} /> },
    ],
  },
  {
    label: 'Companies',
    items: [
      { id: 'company-screener', label: 'Company Screener', icon: <Search size={15} /> },
      { id: 'company-workspace', label: 'Company Workspace', icon: <Briefcase size={15} /> },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'news-terminal', label: 'News Terminal', icon: <Newspaper size={15} /> },
      { id: 'event-impact', label: 'Event Impact', icon: <Radio size={15} /> },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'watchlist', label: 'Watchlist', icon: <Star size={15} /> },
      { id: 'research-notes', label: 'Research Notes', icon: <FileText size={15} /> },
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
    <aside className="w-52 flex-shrink-0 flex flex-col bg-zinc-950 border-r border-slate-800/60 min-h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">SectorScope</span>
        </div>
        <p className="text-slate-600 text-xs ml-8">Industry Terminal</p>
      </div>

      {/* Industry Selector */}
      <div className="px-3 py-2.5 border-b border-slate-800/60">
        <p className="text-slate-700 text-xs uppercase tracking-wider mb-1.5">Industry</p>
        <div className="relative">
          <button
            onClick={() => setPickerOpen(o => !o)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/80 rounded border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
          >
            <span className="text-sm leading-none">{industry.meta.icon}</span>
            <span className="text-slate-200 text-xs font-semibold flex-1 text-left truncate">{industry.meta.shortName}</span>
            <ChevronDown size={11} className={`text-slate-600 flex-shrink-0 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {pickerOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700/60 rounded-lg shadow-xl z-50 overflow-hidden">
              {allIndustries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => { setIndustryId(ind.id); setPickerOpen(false); onNavigate('command-center'); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-800/60 transition-colors ${
                    ind.id === industryId ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300'
                  }`}
                >
                  <span>{ind.icon}</span>
                  <span className="font-medium truncate">{ind.shortName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-slate-700 text-xs uppercase tracking-wider px-2 mb-1">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = current === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="font-medium leading-tight truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full leading-none">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800/60 space-y-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="w-full flex items-center justify-center gap-1.5 py-1 rounded border border-slate-800 text-xs hover:border-slate-600 transition-colors"
        >
          <span className={lang === 'en' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>EN</span>
          <span className="text-slate-700">/</span>
          <span className={lang === 'zh' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>中</span>
        </button>
        <p className="text-slate-700 text-xs text-center">⌘K Command Palette</p>
        <p className="text-slate-800 text-xs text-center">Demo · v0.3</p>
      </div>
    </aside>
  );
}
