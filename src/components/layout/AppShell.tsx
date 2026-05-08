import type { TerminalPageId } from '../../types/terminal';
import { Sidebar } from './Sidebar';
import { TickerBar } from './TickerBar';
import { LivePanel } from './LivePanel';
import { CommandPalette } from './CommandPalette';
import { useLanguage } from '../../context/LanguageContext';
import { Info } from 'lucide-react';

const pageTitles: Record<TerminalPageId, { en: string; zh: string }> = {
  'command-center':    { en: 'Command Center',    zh: '指揮中心' },
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
  const title = pageTitles[current]?.[lang] ?? current;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar current={current} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Ticker Bar */}
        <TickerBar />

        {/* Topbar */}
        <header className="h-10 flex-shrink-0 flex items-center justify-between px-5 border-b border-slate-800/80 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <h1 className="text-white font-bold text-sm tracking-tight">{title}</h1>
            <span className="text-slate-700 text-xs hidden sm:inline">|</span>
            <span className="text-slate-600 text-xs hidden sm:inline">Oil & Gas · SectorScope Terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-700 text-xs hidden md:inline">⌘K to search</span>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs">
              <Info size={11} />
              <span className="hidden sm:inline">Demo data — not real-time</span>
            </div>
          </div>
        </header>

        {/* Main Content + Right Panel */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-5">
            {children}
          </main>
          <LivePanel onNavigate={onNavigate} />
        </div>
      </div>

      {/* Command Palette (global overlay) */}
      <CommandPalette onNavigate={onNavigate} />
    </div>
  );
}
