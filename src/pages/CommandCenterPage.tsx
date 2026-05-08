import type { TerminalPageId } from '../types/terminal';
import { useIndustry } from '../context/IndustryContext';
import { useWatchlist } from '../context/WatchlistContext';
import { tickerItems, marketSignals, executiveBrief, terminalNewsEvents, benchmarkRows } from '../data/terminal';
import { buildLiveTerminalData, getDataFreshnessLabel } from '../data/liveData';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

const severityStyle: Record<string, string> = {
  high:     'text-rose-400 bg-rose-900/20 border-rose-700/30',
  medium:   'text-amber-400 bg-amber-900/20 border-amber-700/30',
  low:      'text-slate-400 bg-slate-800/40 border-slate-700/30',
  positive: 'text-emerald-400 bg-emerald-900/20 border-emerald-700/30',
};

const signalStyle: Record<string, string> = {
  Bullish: 'text-emerald-400',
  Neutral: 'text-slate-400',
  Bearish: 'text-rose-400',
};

interface CommandCenterPageProps {
  onNavigate: (p: TerminalPageId) => void;
}

export function CommandCenterPage({ onNavigate }: CommandCenterPageProps) {
  const { industry } = useIndustry();
  const { companies: watchCompanies } = useWatchlist();
  const live = buildLiveTerminalData(tickerItems, benchmarkRows);
  const topMovers = [...live.benchmarkRows].sort((a, b) => Math.abs(b.dailyChangePct) - Math.abs(a.dailyChangePct)).slice(0, 5);
  const highNews = terminalNewsEvents.filter(n => n.importance === 'High').slice(0, 4);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Executive Brief */}
      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Executive Brief</span>
          <span className="ml-auto text-slate-700 text-xs">{getDataFreshnessLabel()}</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{executiveBrief}</p>
      </div>

      {/* Market Pulse + Top Movers + Signals (3-col) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Market Pulse */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Market Pulse</h3>
          <div className="space-y-2">
            {[
              { label: 'Global Market Size', value: 'US$6.25T', color: 'text-cyan-400' },
              { label: 'Oil Demand', value: '100M bbl/day', color: 'text-white' },
              { label: 'LNG Demand', value: '460M tons/yr', color: 'text-white' },
              { label: 'Oil Balance', value: 'Deficit', color: 'text-rose-400' },
              { label: 'LNG Balance', value: 'Tight', color: 'text-amber-400' },
              { label: 'Risk Level', value: 'High', color: 'text-rose-400' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                <span className="text-slate-500 text-xs">{m.label}</span>
                <span className={`text-xs font-bold ${m.color}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Moving Benchmarks */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Top Movers Today</h3>
          <div className="space-y-2">
            {topMovers.map(b => {
              const up = b.dailyChangePct > 0;
              const down = b.dailyChangePct < 0;
              return (
                <div key={b.id} className="flex items-center gap-2 py-1 border-b border-slate-800/40 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="text-slate-300 text-xs flex-1 truncate">{b.name}</span>
                  <span className="text-white text-xs font-mono">{b.price.toFixed(2)}</span>
                  <span className={`text-xs font-mono font-semibold w-16 text-right ${up ? 'text-emerald-400' : down ? 'text-rose-400' : 'text-slate-500'}`}>
                    {up ? '+' : ''}{b.dailyChangePct.toFixed(2)}%
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    b.signal === 'Bullish' ? 'text-emerald-400 bg-emerald-900/30' :
                    b.signal === 'Bearish' ? 'text-rose-400 bg-rose-900/30' :
                    b.signal === 'Elevated' ? 'text-amber-400 bg-amber-900/30' :
                    'text-slate-400 bg-slate-800/40'
                  }`}>{b.signal}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Industry Signals */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Top Industry Signals</h3>
          <div className="space-y-2">
            {marketSignals.map((s, i) => (
              <div key={s.id} className={`flex items-start gap-2 p-2 rounded border ${severityStyle[s.severity]}`}>
                <span className="text-slate-600 text-xs font-mono flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs leading-relaxed">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist + News (2-col) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Watchlist Snapshot */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/40">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Watchlist</h3>
            <button onClick={() => onNavigate('watchlist')} className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
              View all <ChevronRight size={11} />
            </button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/40">
                <th className="text-left text-slate-600 font-medium px-4 py-2">Ticker</th>
                <th className="text-left text-slate-600 font-medium px-4 py-2 hidden sm:table-cell">Company</th>
                <th className="text-left text-slate-600 font-medium px-4 py-2 hidden md:table-cell">Segment</th>
                <th className="text-right text-slate-600 font-medium px-4 py-2">Change</th>
                <th className="text-right text-slate-600 font-medium px-4 py-2">Signal</th>
              </tr>
            </thead>
            <tbody>
              {watchCompanies.map(c => (
                <tr key={c.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 cursor-pointer" onClick={() => onNavigate('company-workspace')}>
                  <td className="px-4 py-2 text-cyan-400 font-mono font-bold">{c.ticker}</td>
                  <td className="px-4 py-2 text-slate-300 hidden sm:table-cell truncate max-w-[120px]">{c.name}</td>
                  <td className="px-4 py-2 text-slate-500 hidden md:table-cell truncate">{c.segment}</td>
                  <td className={`px-4 py-2 font-mono text-right ${c.priceChangePct > 0 ? 'text-emerald-400' : c.priceChangePct < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {c.priceChangePct > 0 ? <TrendingUp size={10} /> : c.priceChangePct < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                      {c.priceChangePct > 0 ? '+' : ''}{c.priceChangePct.toFixed(1)}%
                    </div>
                  </td>
                  <td className={`px-4 py-2 text-right font-semibold ${signalStyle[c.thesisSignal]}`}>{c.thesisSignal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breaking News */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/40">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Breaking Events</h3>
            <button onClick={() => onNavigate('news-terminal')} className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
              News Terminal <ChevronRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {highNews.map(n => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-800/30 cursor-pointer" onClick={() => onNavigate('news-terminal')}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-rose-400 text-xs font-semibold">HIGH</span>
                  <span className="text-slate-700 text-xs">·</span>
                  <span className="text-slate-600 text-xs">{n.time}</span>
                  <span className="ml-auto text-slate-600 text-xs">{n.category}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{n.title}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {n.relatedCompanies.slice(0, 2).map(c => (
                    <span key={c} className="text-xs text-cyan-500/70 bg-cyan-900/20 border border-cyan-800/30 px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics from current industry */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          {industry.meta.shortName} — Key Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {industry.meta.keyMetrics.map(m => (
            <div key={m.label} className="bg-slate-800/40 rounded p-2.5 border border-slate-700/30">
              <p className="text-slate-600 text-xs leading-tight mb-1">{m.label}</p>
              <p className="text-white font-bold text-sm">{m.value}</p>
              {m.description && <p className="text-slate-700 text-xs mt-0.5 leading-tight">{m.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
