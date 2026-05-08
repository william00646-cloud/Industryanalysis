import { useState, useMemo } from 'react';
import type { TerminalPageId } from '../types/terminal';
import { screenerCompanies } from '../data/terminal';
import { buildLiveTerminalData } from '../data/liveData';
import { benchmarkRows, tickerItems } from '../data/terminal';
import { useWatchlist } from '../context/WatchlistContext';
import { Search, Star, StarOff, ChevronUp, ChevronDown } from 'lucide-react';

const signalStyle: Record<string, string> = {
  Bullish: 'text-emerald-400 bg-emerald-900/20 border-emerald-700/30',
  Neutral: 'text-slate-400 bg-slate-800/40 border-slate-700/30',
  Bearish: 'text-rose-400 bg-rose-900/20 border-rose-700/30',
};

const fcfStyle: Record<string, string> = {
  Strong:    'text-emerald-400',
  Positive:  'text-cyan-400',
  Breakeven: 'text-amber-400',
  Negative:  'text-rose-400',
};

const riskStyle: Record<string, string> = {
  High:   'text-rose-400',
  Medium: 'text-amber-400',
  Low:    'text-emerald-400',
};

type SortKey = 'marketCapM' | 'revenueM' | 'riskLevel' | 'thesisSignal' | 'name';

interface CompanyScreenerPageProps {
  onNavigate: (p: TerminalPageId) => void;
  onSelectCompany: (id: string) => void;
}

export function CompanyScreenerPage({ onNavigate, onSelectCompany }: CompanyScreenerPageProps) {
  const { isCompanyWatched, addCompany, removeCompany } = useWatchlist();
  const [query, setQuery] = useState('');
  const [segFilter, setSegFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [fcfFilter, setFcfFilter] = useState('All');
  const [exposureFilter, setExposureFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('marketCapM');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const live = buildLiveTerminalData(tickerItems, benchmarkRows);
  const companyRows = screenerCompanies.map(c => ({ ...c, ...(live.companyOverrides[c.id] ?? {}) }));

  const segments = ['All', ...new Set(companyRows.map(c => c.segment))];
  const regions = ['All', ...new Set(companyRows.map(c => c.region))];
  const exposures = ['All', ...new Set(companyRows.flatMap(c => c.benchmarkExposure.split(',').map(x => x.trim())))];

  const filtered = useMemo(() => {
    let list = companyRows.filter(c => {
      const q = query.toLowerCase();
      const matchQ = !q || c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q);
      const matchSeg = segFilter === 'All' || c.segment === segFilter;
      const matchReg = regionFilter === 'All' || c.region === regionFilter;
      const matchRisk = riskFilter === 'All' || c.riskLevel === riskFilter;
      const matchFcf = fcfFilter === 'All' || c.fcfStatus === fcfFilter;
      const matchExposure = exposureFilter === 'All' || c.benchmarkExposure.includes(exposureFilter);
      return matchQ && matchSeg && matchReg && matchRisk && matchFcf && matchExposure;
    });

    list = [...list].sort((a, b) => {
      let av: number | string = sortKey === 'name' ? a.name : sortKey === 'riskLevel' ? ['High', 'Medium', 'Low'].indexOf(a.riskLevel) : sortKey === 'thesisSignal' ? ['Bullish', 'Neutral', 'Bearish'].indexOf(a.thesisSignal) : a[sortKey as 'marketCapM' | 'revenueM'];
      let bv: number | string = sortKey === 'name' ? b.name : sortKey === 'riskLevel' ? ['High', 'Medium', 'Low'].indexOf(b.riskLevel) : sortKey === 'thesisSignal' ? ['Bullish', 'Neutral', 'Bearish'].indexOf(b.thesisSignal) : b[sortKey as 'marketCapM' | 'revenueM'];
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [companyRows, query, segFilter, regionFilter, riskFilter, fcfFilter, exposureFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronDown size={11} className="text-slate-700" />;
    return sortDir === 'desc' ? <ChevronDown size={11} className="text-cyan-400" /> : <ChevronUp size={11} className="text-cyan-400" />;
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Filters */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Ticker, company, segment…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
            />
          </div>

          {/* Segment */}
          <select value={segFilter} onChange={e => setSegFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500/50">
            {segments.map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Region */}
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500/50">
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>

          {/* Risk */}
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500/50">
            {['All', 'High', 'Medium', 'Low'].map(r => <option key={r}>{r}</option>)}
          </select>

          {/* FCF */}
          <select value={fcfFilter} onChange={e => setFcfFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500/50">
            {['All', 'Strong', 'Positive', 'Breakeven', 'Negative'].map(r => <option key={r}>{r}</option>)}
          </select>

          {/* Benchmark Exposure */}
          <select value={exposureFilter} onChange={e => setExposureFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500/50">
            {exposures.map(r => <option key={r}>{r}</option>)}
          </select>

          <span className="text-slate-600 text-xs self-center">{filtered.length} companies</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/80">
                <th className="text-left text-slate-600 font-medium px-4 py-2.5 w-8" />
                <th className="text-left text-slate-600 font-medium px-4 py-2.5">
                  <button className="flex items-center gap-1" onClick={() => toggleSort('name')}>Ticker / Company <SortIcon k="name" /></button>
                </th>
                <th className="text-left text-slate-600 font-medium px-4 py-2.5 hidden md:table-cell">Segment</th>
                <th className="text-left text-slate-600 font-medium px-4 py-2.5 hidden lg:table-cell">Region</th>
                <th className="text-right text-slate-600 font-medium px-4 py-2.5">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('marketCapM')}>Mkt Cap <SortIcon k="marketCapM" /></button>
                </th>
                <th className="text-right text-slate-600 font-medium px-4 py-2.5 hidden sm:table-cell">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => toggleSort('revenueM')}>Revenue <SortIcon k="revenueM" /></button>
                </th>
                <th className="text-center text-slate-600 font-medium px-4 py-2.5 hidden lg:table-cell">FCF</th>
                <th className="text-left text-slate-600 font-medium px-4 py-2.5 hidden 2xl:table-cell">Revenue Driver</th>
                <th className="text-left text-slate-600 font-medium px-4 py-2.5 hidden xl:table-cell">Exposure</th>
                <th className="text-center text-slate-600 font-medium px-4 py-2.5">
                  <button className="flex items-center gap-1 mx-auto" onClick={() => toggleSort('thesisSignal')}>Signal <SortIcon k="thesisSignal" /></button>
                </th>
                <th className="text-center text-slate-600 font-medium px-4 py-2.5">
                  <button className="flex items-center gap-1 mx-auto" onClick={() => toggleSort('riskLevel')}>Risk <SortIcon k="riskLevel" /></button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const watched = isCompanyWatched(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-slate-800/30 hover:bg-slate-800/30 cursor-pointer transition-colors ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}
                    onClick={() => { onSelectCompany(c.id); onNavigate('company-workspace'); }}
                  >
                    <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => watched
                          ? removeCompany(c.id)
                          : addCompany({ id: c.id, ticker: c.ticker, name: c.name, segment: c.segment, priceChange: 0, priceChangePct: 0, thesisSignal: c.thesisSignal, riskLevel: c.riskLevel, latestEvent: 'See news terminal' })
                        }
                        className={`transition-colors ${watched ? 'text-amber-400' : 'text-slate-700 hover:text-amber-400'}`}
                      >
                        {watched ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-cyan-400 font-mono font-bold">{c.ticker}</div>
                      <div className="text-slate-400 truncate max-w-[140px]">{c.name}</div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 hidden md:table-cell truncate max-w-[140px]">{c.segment}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden lg:table-cell">{c.region}</td>
                    <td className="px-4 py-2.5 text-right text-white font-mono">{c.marketCap}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400 font-mono hidden sm:table-cell">{c.revenue}</td>
                    <td className={`px-4 py-2.5 text-center font-semibold hidden lg:table-cell ${fcfStyle[c.fcfStatus]}`}>{c.fcfStatus}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden 2xl:table-cell truncate max-w-[190px]">{c.revenueDriver}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden xl:table-cell truncate max-w-[140px]">{c.benchmarkExposure}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${signalStyle[c.thesisSignal]}`}>{c.thesisSignal}</span>
                    </td>
                    <td className={`px-4 py-2.5 text-center font-semibold ${riskStyle[c.riskLevel]}`}>{c.riskLevel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-slate-700 text-xs text-center">Demo data · Not real financial data · Click any row to open Company Workspace</p>
    </div>
  );
}
