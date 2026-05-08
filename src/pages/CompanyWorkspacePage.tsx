import { useEffect, useState } from 'react';
import type { TerminalPageId } from '../types/terminal';
import { screenerCompanies, terminalNewsEvents } from '../data/terminal';
import { useWatchlist } from '../context/WatchlistContext';
import { Star, StarOff, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

const signalStyle: Record<string, string> = {
  Bullish: 'text-emerald-400',
  Neutral: 'text-slate-400',
  Bearish: 'text-rose-400',
};

const riskBg: Record<string, string> = {
  High:   'bg-rose-900/20 border-rose-700/30 text-rose-400',
  Medium: 'bg-amber-900/20 border-amber-700/30 text-amber-400',
  Low:    'bg-emerald-900/20 border-emerald-700/30 text-emerald-400',
};

interface CompanyWorkspacePageProps {
  selectedCompanyId: string;
  onNavigate: (p: TerminalPageId) => void;
}

export function CompanyWorkspacePage({ selectedCompanyId, onNavigate }: CompanyWorkspacePageProps) {
  const { isCompanyWatched, addCompany, removeCompany } = useWatchlist();

  const company = screenerCompanies.find(c => c.id === selectedCompanyId) ?? screenerCompanies[0];
  const peers = screenerCompanies.filter(c => company.peerIds.includes(c.id));
  const relatedNews = terminalNewsEvents.filter(n => company.relatedNews.includes(n.id));
  const watched = isCompanyWatched(company.id);
  const noteKey = `sectorscope_company_note_${company.id}`;
  const [notes, setNotes] = useState(() => localStorage.getItem(noteKey) ?? '');

  useEffect(() => {
    const key = `sectorscope_company_note_${company.id}`;
    setNotes(localStorage.getItem(key) ?? '');
  }, [company.id]);

  useEffect(() => {
    localStorage.setItem(noteKey, notes);
  }, [noteKey, notes]);

  const toggleWatch = () => {
    if (watched) {
      removeCompany(company.id);
    } else {
      addCompany({
        id: company.id, ticker: company.ticker, name: company.name,
        segment: company.segment, priceChange: 0, priceChangePct: 0,
        thesisSignal: company.thesisSignal, riskLevel: company.riskLevel,
        latestEvent: relatedNews[0]?.title ?? 'See news terminal',
      });
    }
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-white font-bold text-xl">{company.name}</h1>
              <span className="text-cyan-400 font-mono font-bold text-base border border-cyan-700/40 bg-cyan-900/20 px-2 py-0.5 rounded">{company.ticker}</span>
              <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${riskBg[company.riskLevel]}`}>{company.riskLevel} Risk</span>
            </div>
            <p className="text-slate-400 text-sm">{company.segment} · {company.region}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-slate-500 text-xs">Market Cap</p>
              <p className="text-white font-bold">{company.marketCap}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-xs">Revenue</p>
              <p className="text-slate-300 font-mono">{company.revenue}</p>
            </div>
            <button
              onClick={toggleWatch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${
                watched
                  ? 'border-amber-700/40 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40'
                  : 'border-slate-700/40 bg-slate-800/40 text-slate-400 hover:border-amber-700/40 hover:text-amber-400'
              }`}
            >
              {watched ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
              {watched ? 'Watching' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Business Model + Thesis (2-col) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Business Model */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4 space-y-3">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Business Model</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{company.businessModel}</p>

          <div>
            <p className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Key Drivers</p>
            <div className="flex flex-wrap gap-1.5">
              {company.keyDrivers.map(d => (
                <span key={d} className="text-xs px-2 py-0.5 rounded bg-blue-900/20 border border-blue-700/30 text-blue-400">{d}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">Benchmark Exposure</p>
            <span className="text-xs px-2 py-1 rounded bg-amber-900/20 border border-amber-700/30 text-amber-400 font-semibold">{company.benchmarkExposure}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/40">
            <div className="bg-slate-800/30 rounded p-2">
              <p className="text-slate-600 text-xs uppercase tracking-wider">Value Chain Position</p>
              <p className="text-slate-300 text-xs mt-1">{company.segment}</p>
            </div>
            <div className="bg-slate-800/30 rounded p-2">
              <p className="text-slate-600 text-xs uppercase tracking-wider">Revenue Driver</p>
              <p className="text-slate-300 text-xs mt-1">{company.revenueDriver}</p>
            </div>
            <div className="bg-slate-800/30 rounded p-2">
              <p className="text-slate-600 text-xs uppercase tracking-wider">Cost Driver</p>
              <p className="text-slate-300 text-xs mt-1">Feedstock, labor, logistics, maintenance capex</p>
            </div>
            <div className="bg-slate-800/30 rounded p-2">
              <p className="text-slate-600 text-xs uppercase tracking-wider">Main Customers</p>
              <p className="text-slate-300 text-xs mt-1">Utilities, industrial buyers, majors, traders</p>
            </div>
          </div>

          <div>
            <p className="text-slate-600 text-xs uppercase tracking-wider mb-1.5">FCF Status</p>
            <span className={`text-sm font-bold ${company.fcfStatus === 'Strong' ? 'text-emerald-400' : company.fcfStatus === 'Positive' ? 'text-cyan-400' : company.fcfStatus === 'Breakeven' ? 'text-amber-400' : 'text-rose-400'}`}>
              {company.fcfStatus}
            </span>
          </div>
        </div>

        {/* Investment Thesis — 3 cases */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Investment Thesis</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${signalStyle[company.thesisSignal]}`}>{company.thesisSignal}</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="p-3 bg-emerald-900/10 border border-emerald-700/20 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={11} className="text-emerald-400" />
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Bull Case</p>
              </div>
              <ul className="space-y-0.5">
                {company.bullCase.map(b => <li key={b} className="text-emerald-300 text-xs">• {b}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded-lg">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Base Case</p>
              <ul className="space-y-0.5">
                {company.baseCase.map(b => <li key={b} className="text-slate-300 text-xs">• {b}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-rose-900/10 border border-rose-700/20 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown size={11} className="text-rose-400" />
                <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Bear Case</p>
              </div>
              <ul className="space-y-0.5">
                {company.bearCase.map(b => <li key={b} className="text-rose-300 text-xs">• {b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors + Peer Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Risk Factors */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Risk Factors</h3>
          <div className="space-y-1.5">
            {company.riskFactors.map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-rose-900/10 border border-rose-800/20 rounded">
                <span className="text-rose-600 text-xs mt-0.5 flex-shrink-0">▸</span>
                <span className="text-rose-300 text-xs leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800/40">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Peer Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800/40 bg-slate-900/40">
                  <th className="text-left text-slate-600 font-medium px-4 py-2">Company</th>
                  <th className="text-right text-slate-600 font-medium px-4 py-2">Mkt Cap</th>
                  <th className="text-center text-slate-600 font-medium px-4 py-2">FCF</th>
                  <th className="text-center text-slate-600 font-medium px-4 py-2">Signal</th>
                  <th className="text-center text-slate-600 font-medium px-4 py-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cyan-500/20 bg-cyan-900/10">
                  <td className="px-4 py-2">
                    <span className="text-cyan-400 font-mono font-bold">{company.ticker}</span>
                    <span className="text-slate-400 ml-2">{company.name}</span>
                  </td>
                  <td className="px-4 py-2 text-right text-white font-mono">{company.marketCap}</td>
                  <td className={`px-4 py-2 text-center font-semibold ${company.fcfStatus === 'Strong' ? 'text-emerald-400' : 'text-amber-400'}`}>{company.fcfStatus}</td>
                  <td className={`px-4 py-2 text-center font-semibold ${signalStyle[company.thesisSignal]}`}>{company.thesisSignal}</td>
                  <td className={`px-4 py-2 text-center font-semibold ${company.riskLevel === 'High' ? 'text-rose-400' : company.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{company.riskLevel}</td>
                </tr>
                {peers.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 cursor-pointer" onClick={() => onNavigate('company-screener')}>
                    <td className="px-4 py-2">
                      <span className="text-slate-300 font-mono">{p.ticker}</span>
                      <span className="text-slate-500 ml-2 truncate">{p.name}</span>
                    </td>
                    <td className="px-4 py-2 text-right text-slate-300 font-mono">{p.marketCap}</td>
                    <td className={`px-4 py-2 text-center ${p.fcfStatus === 'Strong' ? 'text-emerald-400' : 'text-amber-400'}`}>{p.fcfStatus}</td>
                    <td className={`px-4 py-2 text-center ${signalStyle[p.thesisSignal]}`}>{p.thesisSignal}</td>
                    <td className={`px-4 py-2 text-center ${p.riskLevel === 'High' ? 'text-rose-400' : p.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{p.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related News + Research Notes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Related News */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/40">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Related News</h3>
            <button onClick={() => onNavigate('news-terminal')} className="text-cyan-400 text-xs flex items-center gap-1">
              All news <ChevronRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {relatedNews.length === 0 && <p className="px-4 py-3 text-slate-600 text-xs">No related news found.</p>}
            {relatedNews.map(n => (
              <div key={n.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${n.importance === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>{n.importance}</span>
                  <span className="text-slate-600 text-xs">{n.time}</span>
                  <span className="text-slate-600 text-xs ml-auto">{n.category}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{n.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Notes */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Research Notes — {company.ticker}</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={`Write your thesis notes for ${company.name}...\n\nBull case:\n-\n\nBear case:\n-\n\nWhat would change my mind?\n-`}
            className="w-full h-48 bg-slate-800/40 border border-slate-700/40 rounded text-slate-300 text-xs p-3 resize-none focus:outline-none focus:border-cyan-500/50 placeholder-slate-700 font-mono leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-700 text-xs">{notes.length} chars · Saved locally</span>
            <button onClick={() => onNavigate('research-notes')} className="text-cyan-400 text-xs hover:underline">Open Research Workspace →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
