import { useState } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { Sidebar } from './Sidebar';
import { TickerBar } from './TickerBar';
import { LivePanel } from './LivePanel';
import { CommandPalette } from './CommandPalette';
import { useLanguage } from '../../context/LanguageContext';
import { useIndustry } from '../../context/IndustryContext';
import { Search, Bell, Calendar, Download, User } from 'lucide-react';

const pageTitles: Record<TerminalPageId, { en: string; zh: string }> = {
  'command-center':    { en: 'Dashboard',         zh: '儀表板' },
  'market-monitor':   { en: 'Market Monitor',    zh: '市場監控' },
  'industry-map':     { en: 'Industry Map',      zh: '產業地圖' },
  'value-chain':      { en: 'Value Chain',       zh: '價值鏈' },
  'supply-demand':    { en: 'Supply / Demand',   zh: '供需分析' },
  'price-spread':     { en: 'Price & Spread',    zh: '價格與價差' },
  'company-screener': { en: 'Company Screener',  zh: '公司篩選器' },
  'company-workspace':{ en: 'Company Workspace', zh: '公司工作台' },
  'news-terminal':    { en: 'News Terminal',     zh: '新聞終端' },
  'event-impact':     { en: 'Event Impact',      zh: '事件衝擊' },
  'watchlist':        { en: 'Watchlist',         zh: '追蹤清單' },
  'research-notes':   { en: 'Research Notes',    zh: '研究筆記' },
};

interface AppShellProps {
  current: TerminalPageId;
  onNavigate: (page: TerminalPageId) => void;
  children: React.ReactNode;
}

export function AppShell({ current, onNavigate, children }: AppShellProps) {
  const { lang } = useLanguage();
  const { industry } = useIndustry();
  const title = pageTitles[current]?.[lang] ?? current;
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar current={current} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Ticker Bar */}
        <TickerBar />

        {/* Top Header — Nexus style */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 gap-4">
          {/* Page title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <h1 className="text-slate-900 font-bold text-base">{title}</h1>
            <span className="chip chip-slate hidden sm:inline">{industry.meta.icon} {industry.meta.shortName}</span>
          </div>

          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            searchFocused ? 'border-blue-400 bg-white shadow-sm' : 'border-slate-200 bg-slate-50'
          } flex-1 max-w-xs`}>
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={lang === 'zh' ? '搜尋… (⌘K)' : 'Search… (⌘K)'}
              className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none flex-1 min-w-0"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 font-mono">⌘F</kbd>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Date range pill */}
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs text-slate-600 font-medium">
              <Calendar size={12} className="text-slate-400" />
              <span>{lang === 'zh' ? '即時資料' : 'Live Data'}</span>
            </button>

            {/* Notification bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <Bell size={15} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {/* Export */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-xs text-white font-semibold">
              <Download size={12} />
              <span>{lang === 'zh' ? '匯出' : 'Export'}</span>
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">Analyst</p>
                <p className="text-[10px] text-slate-400">Demo</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content + Right Panel */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          <LivePanel onNavigate={onNavigate} />
        </div>
      </div>

      <CommandPalette onNavigate={onNavigate} />
    </div>
  );
}
