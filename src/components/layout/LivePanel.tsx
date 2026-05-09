import { useState } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { liveSignals, priceAlerts, terminalNewsEvents } from '../../data/terminal';
import { ChevronRight, X, PanelRightOpen, Wifi } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const panelI18n = {
  intelligence: { en: 'Intelligence', zh: '情報中心' },
  liveSignals:  { en: 'Live Signals', zh: '即時訊號' },
  alerts:       { en: 'Alerts',       zh: '警示' },
  quickActions: { en: 'Quick Actions', zh: '快速操作' },
  latestNews:   { en: 'Latest News',  zh: '最新消息' },
};

const severityDot: Record<string, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
  positive: 'bg-blue-500',
};

const alertStyles: Record<string, string> = {
  high: 'text-rose-700 border-rose-200 bg-rose-50',
  medium: 'text-amber-700 border-amber-200 bg-amber-50',
  low: 'text-emerald-700 border-emerald-200 bg-emerald-50',
};

interface LivePanelProps {
  onNavigate: (page: TerminalPageId) => void;
}

const quickActionLabels: Record<TerminalPageId, { en: string; zh: string }> = {
  'command-center':    { en: 'Command Center',    zh: '指揮中心' },
  'market-monitor':    { en: 'Market Monitor',    zh: '市場監控' },
  'industry-map':      { en: 'Industry Map',      zh: '產業地圖' },
  'value-chain':       { en: 'Value Chain',       zh: '價值鏈' },
  'supply-demand':     { en: 'Supply / Demand',   zh: '供需分析' },
  'price-spread':      { en: 'Price & Spread',    zh: '價格與價差' },
  'company-screener':  { en: 'Company Screener',  zh: '公司篩選器' },
  'company-workspace': { en: 'Company Workspace', zh: '公司工作台' },
  'news-terminal':     { en: 'News Terminal',     zh: '新聞終端' },
  'event-impact':      { en: 'Event Impact',      zh: '事件衝擊' },
  'watchlist':         { en: 'Watchlist',         zh: '追蹤清單' },
  'research-notes':    { en: 'Research Notes',    zh: '研究筆記' },
};

export function LivePanel({ onNavigate }: LivePanelProps) {
  const [open, setOpen] = useState(true);
  const { lang } = useLanguage();

  if (!open) {
    return (
      <div className="flex-shrink-0 w-8 border-l border-slate-200 bg-white flex flex-col items-center pt-4">
        <button
          onClick={() => setOpen(true)}
          className="text-slate-400 hover:text-blue-500 transition-colors p-1"
          title="Open Live Panel"
        >
          <PanelRightOpen size={14} />
        </button>
      </div>
    );
  }

  const latestNews = terminalNewsEvents.slice(0, 3);

  return (
    <div className="flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden" style={{ width: '268px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-4 h-4">
            <Wifi size={11} className="text-emerald-500" />
            <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
          </div>
          <span className="text-slate-800 text-xs font-bold uppercase tracking-[0.12em]">{panelI18n.intelligence[lang]}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded hover:bg-slate-100"
        >
          <X size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Live Signals */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="section-label">{panelI18n.liveSignals[lang]}</p>
          <div className="space-y-2 mt-2">
            {liveSignals.map(s => (
              <div key={s.id} className="flex items-start gap-2.5 group">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${severityDot[s.severity]}`} />
                <span className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-700 transition-colors">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="section-label">{panelI18n.alerts[lang]}</p>
          <div className="space-y-1.5 mt-2">
            {priceAlerts.map(a => (
              <div key={a.id} className={`px-2.5 py-2 rounded-lg border text-xs font-medium leading-snug ${alertStyles[a.level]}`}>
                {a.label}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="section-label">{panelI18n.quickActions[lang]}</p>
          <div className="space-y-0.5 mt-2">
            {(['company-screener', 'event-impact', 'price-spread', 'watchlist', 'research-notes'] as TerminalPageId[]).map(page => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-all text-xs group"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">{quickActionLabels[page][lang]}</span>
                <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="px-4 py-3">
          <p className="section-label">{panelI18n.latestNews[lang]}</p>
          <div className="space-y-3 mt-2">
            {latestNews.map(n => (
              <div
                key={n.id}
                className="cursor-pointer group"
                onClick={() => onNavigate('news-terminal')}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] font-semibold ${
                    n.importance === 'High' ? 'text-rose-500' :
                    n.importance === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {n.importance}
                  </span>
                  <span className="text-slate-300 text-[10px]">·</span>
                  <span className="text-slate-400 text-[10px]">{n.time}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed group-hover:text-slate-900 transition-colors line-clamp-2">
                  {n.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
