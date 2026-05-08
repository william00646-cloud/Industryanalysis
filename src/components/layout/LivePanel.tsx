import { useState } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { liveSignals, priceAlerts, terminalNewsEvents } from '../../data/terminal';
import { ChevronRight, X, PanelRightOpen } from 'lucide-react';

const severityDot: Record<string, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
  positive: 'bg-cyan-500',
};

const alertColor: Record<string, string> = {
  high: 'text-rose-400 border-rose-700/40 bg-rose-900/20',
  medium: 'text-amber-400 border-amber-700/40 bg-amber-900/20',
  low: 'text-emerald-400 border-emerald-700/40 bg-emerald-900/20',
};

interface LivePanelProps {
  onNavigate: (page: TerminalPageId) => void;
}

export function LivePanel({ onNavigate }: LivePanelProps) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="flex-shrink-0 w-8 border-l border-slate-800/80 bg-slate-900/60 flex flex-col items-center pt-4">
        <button
          onClick={() => setOpen(true)}
          className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
          title="Open Live Panel"
        >
          <PanelRightOpen size={15} />
        </button>
      </div>
    );
  }

  const latestNews = terminalNewsEvents.slice(0, 3);

  return (
    <div className="flex-shrink-0 w-72 border-l border-slate-800/80 bg-slate-900/60 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Intelligence</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-400 p-0.5">
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0">
        {/* Live Signals */}
        <div className="px-4 py-3 border-b border-slate-800/40">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Live Signals</p>
          <div className="space-y-2">
            {liveSignals.map(s => (
              <div key={s.id} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${severityDot[s.severity]}`} />
                <span className="text-slate-300 text-xs leading-relaxed">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 py-3 border-b border-slate-800/40">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Alerts</p>
          <div className="space-y-1.5">
            {priceAlerts.map(a => (
              <div key={a.id} className={`px-2.5 py-1.5 rounded border text-xs ${alertColor[a.level]}`}>
                {a.label}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-b border-slate-800/40">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Quick Actions</p>
          <div className="space-y-1">
            {[
              { label: 'Company Screener', page: 'company-screener' as TerminalPageId },
              { label: 'Event Impact', page: 'event-impact' as TerminalPageId },
              { label: 'Price & Spread', page: 'price-spread' as TerminalPageId },
              { label: 'Watchlist', page: 'watchlist' as TerminalPageId },
              { label: 'Research Notes', page: 'research-notes' as TerminalPageId },
            ].map(a => (
              <button
                key={a.page}
                onClick={() => onNavigate(a.page)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-800/60 text-slate-400 hover:text-cyan-400 transition-colors text-xs"
              >
                <span>{a.label}</span>
                <ChevronRight size={11} />
              </button>
            ))}
          </div>
        </div>

        {/* Mini News Feed */}
        <div className="px-4 py-3">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Latest News</p>
          <div className="space-y-3">
            {latestNews.map(n => (
              <div key={n.id} className="cursor-pointer group" onClick={() => onNavigate('news-terminal')}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-xs font-semibold ${n.importance === 'High' ? 'text-rose-400' : n.importance === 'Medium' ? 'text-amber-400' : 'text-slate-500'}`}>
                    {n.importance}
                  </span>
                  <span className="text-slate-700 text-xs">·</span>
                  <span className="text-slate-600 text-xs">{n.time}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed group-hover:text-white transition-colors line-clamp-2">
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
