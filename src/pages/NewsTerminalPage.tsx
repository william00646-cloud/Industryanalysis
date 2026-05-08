import { useState, useMemo } from 'react';
import { terminalNewsEvents } from '../data/terminal';
import { Search } from 'lucide-react';

const importanceDot: Record<string, string> = {
  High:   'bg-rose-500',
  Medium: 'bg-amber-500',
  Low:    'bg-slate-500',
};

const importanceText: Record<string, string> = {
  High:   'text-rose-400',
  Medium: 'text-amber-400',
  Low:    'text-slate-500',
};

const categories = ['All', 'Geopolitics', 'Supply', 'Demand', 'Price', 'Regulation', 'Company', 'Technology', 'Deal / Contract'];
const importanceOpts = ['All', 'High', 'Medium', 'Low'];

export function NewsTerminalPage() {
  const [category, setCategory] = useState('All');
  const [importance, setImportance] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(terminalNewsEvents[0]);

  const filtered = useMemo(() => {
    return terminalNewsEvents.filter(n => {
      const matchCat = category === 'All' || n.category === category;
      const matchImp = importance === 'All' || n.importance === importance;
      const q = query.toLowerCase();
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q) || n.relatedCompanies.some(c => c.toLowerCase().includes(q));
      return matchCat && matchImp && matchQ;
    });
  }, [category, importance, query]);

  return (
    <div className="h-full flex flex-col gap-3 max-w-[1400px] mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              category === c ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search news, companies…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800/60 text-slate-200 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500/50 placeholder-slate-700"
          />
        </div>
        {importanceOpts.map(imp => (
          <button
            key={imp}
            onClick={() => setImportance(imp)}
            className={`px-2.5 py-1 rounded text-xs border transition-colors ${
              importance === imp ? 'border-slate-600 text-slate-200 bg-slate-800/60' : 'border-transparent text-slate-600 hover:text-slate-400'
            }`}
          >
            {imp}
          </button>
        ))}
        <span className="text-slate-700 text-xs ml-auto">{filtered.length} events</span>
      </div>

      {/* 3-panel layout */}
      <div className="flex gap-3 flex-1 min-h-0 overflow-hidden">
        {/* News List */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border border-slate-800/60 rounded-lg bg-slate-900/60 divide-y divide-slate-800/40">
          {filtered.length === 0 && <p className="p-4 text-slate-600 text-xs">No events match.</p>}
          {filtered.map(n => (
            <div
              key={n.id}
              className={`px-3 py-3 cursor-pointer hover:bg-slate-800/40 transition-colors ${selected.id === n.id ? 'bg-slate-800/60 border-l-2 border-cyan-500' : ''}`}
              onClick={() => setSelected(n)}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${importanceDot[n.importance]}`} />
                <span className={`text-xs font-semibold ${importanceText[n.importance]}`}>{n.importance}</span>
                <span className="text-slate-700 text-xs ml-auto">{n.time}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">{n.title}</p>
              <span className="text-slate-600 text-xs mt-1 block">{n.category}</span>
            </div>
          ))}
        </div>

        {/* News Detail */}
        <div className="flex-1 overflow-y-auto border border-slate-800/60 rounded-lg bg-slate-900/60 p-4 space-y-4 min-w-0">
          {selected && (
            <>
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${selected.importance === 'High' ? 'text-rose-400 border-rose-700/40 bg-rose-900/20' : selected.importance === 'Medium' ? 'text-amber-400 border-amber-700/40 bg-amber-900/20' : 'text-slate-500 border-slate-700/40 bg-slate-800/40'}`}>
                    {selected.importance}
                  </span>
                  <span className="text-slate-600 text-xs">{selected.category}</span>
                  <span className="text-slate-600 text-xs">{selected.time}</span>
                  <span className="text-slate-600 text-xs ml-auto">{selected.source}</span>
                </div>
                <h2 className="text-white font-bold text-base leading-snug">{selected.title}</h2>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded-lg">
                <p className="text-slate-300 text-sm leading-relaxed">{selected.summary}</p>
              </div>

              {/* Why It Matters */}
              <div>
                <h4 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">Why It Matters</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selected.whyItMatters}</p>
              </div>

              {/* Related */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Benchmarks</h4>
                  <div className="flex flex-wrap gap-1">
                    {selected.relatedBenchmarks.map(b => <span key={b} className="text-xs px-2 py-0.5 rounded bg-amber-900/20 border border-amber-700/30 text-amber-400">{b}</span>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Companies</h4>
                  <div className="flex flex-wrap gap-1">
                    {selected.relatedCompanies.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded bg-cyan-900/20 border border-cyan-700/30 text-cyan-400">{c}</span>)}
                  </div>
                </div>
              </div>

              {/* Segments */}
              <div>
                <h4 className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Affected Value Chain Segments</h4>
                <div className="flex flex-wrap gap-1">
                  {selected.affectedSegments.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded bg-blue-900/20 border border-blue-700/30 text-blue-400">{s}</span>)}
                </div>
              </div>

              {/* AI-style Event Summary */}
              <div className="p-3 bg-violet-950/20 border border-violet-700/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500/60 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-300" />
                  </div>
                  <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">AI Event Summary</span>
                  <span className="text-violet-700 text-xs">(Simulated · Demo)</span>
                </div>
                <p className="text-violet-200 text-sm leading-relaxed">
                  This event is classified as a <strong>{selected.importance}</strong> impact signal in the <strong>{selected.category}</strong> category.
                  It directly affects <strong>{selected.affectedSegments.slice(0, 2).join(' and ')}</strong> and has implications
                  for {selected.relatedCompanies.slice(0, 3).join(', ')}. Monitor {selected.metricsToMonitor.slice(0, 2).join(' and ')} for confirmation.
                </p>
              </div>

              {/* Metrics to Monitor */}
              <div>
                <h4 className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Metrics to Monitor</h4>
                <ul className="space-y-1">
                  {selected.metricsToMonitor.map(m => <li key={m} className="text-slate-400 text-xs">· {m}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Impact Analysis Panel */}
        <div className="w-56 flex-shrink-0 overflow-y-auto border border-slate-800/60 rounded-lg bg-slate-900/60 p-3 space-y-3">
          {selected && (
            <>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Impact Analysis</h4>

              <div>
                <p className="text-emerald-400 text-xs font-semibold mb-1.5">Beneficiaries</p>
                <ul className="space-y-1">
                  {selected.beneficiaries.map(b => <li key={b} className="text-emerald-300 text-xs">• {b}</li>)}
                </ul>
              </div>

              <div>
                <p className="text-rose-400 text-xs font-semibold mb-1.5">Losers</p>
                <ul className="space-y-1">
                  {selected.losers.map(l => <li key={l} className="text-rose-300 text-xs">• {l}</li>)}
                </ul>
              </div>

              <div>
                <p className="text-slate-600 text-xs font-semibold mb-1.5 uppercase tracking-wider">Monitor</p>
                <ul className="space-y-1">
                  {selected.metricsToMonitor.slice(0, 4).map(m => <li key={m} className="text-slate-400 text-xs">→ {m}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
