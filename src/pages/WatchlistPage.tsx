import { useMemo, useState } from 'react';
import type { TerminalPageId } from '../types/terminal';
import { benchmarkRows, screenerCompanies, terminalNewsEvents } from '../data/terminal';
import { useWatchlist } from '../context/WatchlistContext';
import { Search, Star, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

const tabClass = (active: boolean) =>
  `px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
    active
      ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
      : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
  }`;

const signalClass: Record<string, string> = {
  Bullish: 'text-emerald-400',
  Neutral: 'text-slate-400',
  Bearish: 'text-rose-400',
  Normal: 'text-emerald-400',
  Elevated: 'text-amber-400',
  Extreme: 'text-rose-400',
};

interface WatchlistPageProps {
  onNavigate: (page: TerminalPageId) => void;
  onSelectCompany: (id: string) => void;
}

export function WatchlistPage({ onNavigate, onSelectCompany }: WatchlistPageProps) {
  const { companies, benchmarks, addCompany, removeCompany, addBenchmark, removeBenchmark, isCompanyWatched } = useWatchlist();
  const [tab, setTab] = useState<'companies' | 'benchmarks'>('companies');
  const [query, setQuery] = useState('');

  const availableCompanies = useMemo(() => {
    const q = query.toLowerCase();
    return screenerCompanies.filter(c =>
      !isCompanyWatched(c.id) &&
      (!q || c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query, isCompanyWatched]);

  const availableBenchmarks = benchmarkRows.filter(b => !benchmarks.some(x => x.id === b.id)).slice(0, 6);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <h2 className="text-white font-bold text-base">Watchlist</h2>
            <p className="text-slate-500 text-xs mt-0.5">LocalStorage-backed company and benchmark monitoring workspace.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('companies')} className={tabClass(tab === 'companies')}>Companies ({companies.length})</button>
            <button onClick={() => setTab('benchmarks')} className={tabClass(tab === 'benchmarks')}>Benchmarks ({benchmarks.length})</button>
          </div>
        </div>
      </div>

      {tab === 'companies' ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-800/40 flex items-center justify-between">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tracked Companies</p>
              <span className="text-slate-700 text-xs">Demo data · not real-time</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800/40 bg-slate-900/40">
                    <th className="text-left text-slate-600 font-medium px-4 py-2">Ticker</th>
                    <th className="text-left text-slate-600 font-medium px-4 py-2">Company</th>
                    <th className="text-left text-slate-600 font-medium px-4 py-2 hidden md:table-cell">Segment</th>
                    <th className="text-right text-slate-600 font-medium px-4 py-2">Today</th>
                    <th className="text-center text-slate-600 font-medium px-4 py-2">Signal</th>
                    <th className="text-center text-slate-600 font-medium px-4 py-2 hidden lg:table-cell">Risk</th>
                    <th className="text-left text-slate-600 font-medium px-4 py-2 hidden xl:table-cell">Latest Related Event</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => { onSelectCompany(c.id); onNavigate('company-workspace'); }}
                    >
                      <td className="px-4 py-2.5 text-cyan-400 font-mono font-bold">{c.ticker}</td>
                      <td className="px-4 py-2.5 text-slate-300">{c.name}</td>
                      <td className="px-4 py-2.5 text-slate-500 hidden md:table-cell">{c.segment}</td>
                      <td className={`px-4 py-2.5 text-right font-mono font-semibold ${c.priceChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className="inline-flex items-center gap-1 justify-end">
                          {c.priceChangePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {c.priceChangePct >= 0 ? '+' : ''}{c.priceChangePct.toFixed(1)}%
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 text-center font-semibold ${signalClass[c.thesisSignal]}`}>{c.thesisSignal}</td>
                      <td className={`px-4 py-2.5 text-center hidden lg:table-cell ${c.riskLevel === 'High' ? 'text-rose-400' : c.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{c.riskLevel}</td>
                      <td className="px-4 py-2.5 text-slate-500 hidden xl:table-cell max-w-[260px] truncate">{c.latestEvent}</td>
                      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => removeCompany(c.id)} className="text-slate-700 hover:text-rose-400">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Add Company</p>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search ticker/company..."
                className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 text-xs rounded pl-8 pr-3 py-1.5 outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-1.5">
              {availableCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => addCompany({
                    id: c.id,
                    ticker: c.ticker,
                    name: c.name,
                    segment: c.segment,
                    priceChange: 0,
                    priceChangePct: 0,
                    thesisSignal: c.thesisSignal,
                    riskLevel: c.riskLevel,
                    latestEvent: terminalNewsEvents.find(n => c.relatedNews.includes(n.id))?.title ?? 'No linked event',
                  })}
                  className="w-full flex items-center gap-2 p-2 rounded border border-slate-800 hover:border-cyan-700/40 hover:bg-slate-800/40 text-left"
                >
                  <Star size={12} className="text-slate-600" />
                  <span className="text-cyan-400 font-mono text-xs font-bold">{c.ticker}</span>
                  <span className="text-slate-400 text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-800/40">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tracked Benchmarks</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 bg-slate-900/40">
                  <th className="text-left text-slate-600 font-medium px-4 py-2">Benchmark</th>
                  <th className="text-right text-slate-600 font-medium px-4 py-2">Price</th>
                  <th className="text-right text-slate-600 font-medium px-4 py-2 hidden md:table-cell">Spread</th>
                  <th className="text-center text-slate-600 font-medium px-4 py-2">Signal</th>
                  <th className="text-center text-slate-600 font-medium px-4 py-2">Alert</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {benchmarks.map(b => (
                  <tr key={b.id} className="border-b border-slate-800/30 hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 text-slate-300 font-semibold">{b.name}</td>
                    <td className="px-4 py-2.5 text-right text-white font-mono">{b.price.toFixed(2)} <span className="text-slate-600">{b.unit}</span></td>
                    <td className="px-4 py-2.5 text-right text-slate-400 font-mono hidden md:table-cell">{b.spreadLabel ? `${b.spreadLabel}: ${b.spread?.toFixed(2)}` : '-'}</td>
                    <td className={`px-4 py-2.5 text-center font-semibold ${signalClass[b.signal]}`}>{b.signal}</td>
                    <td className={`px-4 py-2.5 text-center font-semibold ${b.alertStatus === 'Active' ? 'text-rose-400' : 'text-slate-600'}`}>{b.alertStatus}</td>
                    <td className="px-3 py-2.5">
                      <button onClick={() => removeBenchmark(b.id)} className="text-slate-700 hover:text-rose-400">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Add Benchmark</p>
            <div className="space-y-1.5">
              {availableBenchmarks.map(b => (
                <button
                  key={b.id}
                  onClick={() => addBenchmark({
                    id: b.id,
                    name: b.name,
                    price: b.price,
                    unit: b.unit,
                    signal: b.signal === 'Elevated' ? 'Elevated' : 'Neutral',
                    alertStatus: b.signal === 'Elevated' ? 'Active' : 'None',
                  })}
                  className="w-full flex items-center justify-between p-2 rounded border border-slate-800 hover:border-cyan-700/40 hover:bg-slate-800/40"
                >
                  <span className="text-slate-300 text-xs">{b.name}</span>
                  <span className="text-cyan-400 text-xs font-mono">{b.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-4">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Interpretation</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Watchlist turns the terminal from a passive dashboard into a daily analyst cockpit. Companies and benchmarks are stored locally in the browser, so a user can keep the specific exposures, alerts, and thesis signals they care about front and center.
        </p>
      </div>
    </div>
  );
}
