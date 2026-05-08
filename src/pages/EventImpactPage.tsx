import { useState } from 'react';
import { impactEvents } from '../data/terminal';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

const levelStyle: Record<string, { dot: string; badge: string }> = {
  Direct:   { dot: 'bg-rose-500', badge: 'text-rose-400 bg-rose-900/20 border-rose-700/30' },
  Indirect: { dot: 'bg-amber-500', badge: 'text-amber-400 bg-amber-900/20 border-amber-700/30' },
  Low:      { dot: 'bg-slate-500', badge: 'text-slate-400 bg-slate-800/40 border-slate-700/30' },
};

export function EventImpactPage() {
  const [selectedId, setSelectedId] = useState(impactEvents[0].id);
  const event = impactEvents.find(e => e.id === selectedId) ?? impactEvents[0];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Event Selector */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <p className="text-slate-600 text-xs uppercase tracking-wider mb-2">Select Event Scenario</p>
        <div className="flex flex-wrap gap-2">
          {impactEvents.map(e => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
                selectedId === e.id
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  : 'text-slate-500 border-slate-700/50 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
      </div>

      {/* Event Summary */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-4">
        <h2 className="text-white font-bold text-base mb-2">{event.title}</h2>
        <p className="text-slate-300 text-sm leading-relaxed">{event.summary}</p>
      </div>

      {/* Impact Transmission */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Impact Transmission Chain</h3>
        <div className="flex flex-col gap-1.5">
          {event.transmissionSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500 text-black' : i === event.transmissionSteps.length - 1 ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
                  {i + 1}
                </div>
                {i < event.transmissionSteps.length - 1 && <div className="w-0.5 h-4 bg-slate-700/60 mt-0.5" />}
              </div>
              <div className={`flex-1 py-1 pb-2 ${i < event.transmissionSteps.length - 1 ? 'border-b border-slate-800/40' : ''}`}>
                <p className="text-slate-300 text-xs leading-relaxed">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affected Value Chain + Impact Details (2-col) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Value Chain Map */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Value Chain Impact Map</h3>
          <div className="space-y-2">
            {event.affectedSegments.map(seg => {
              const s = levelStyle[seg.level];
              return (
                <div key={seg.name} className="flex items-center gap-3 py-1.5 border-b border-slate-800/30 last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  <span className="text-slate-300 text-xs flex-1">{seg.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${s.badge}`}>{seg.level}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/40">
            {['Direct', 'Indirect', 'Low'].map(l => (
              <div key={l} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${levelStyle[l].dot}`} />
                <span className="text-slate-600 text-xs">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Details */}
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4 space-y-3">
          <div>
            <h4 className="text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Direct Impact</h4>
            <p className="text-slate-300 text-sm">{event.directImpact}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/40">
            <h4 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Indirect Impact</h4>
            <p className="text-slate-300 text-sm">{event.indirectImpact}</p>
          </div>
        </div>
      </div>

      {/* Beneficiary / Loser Table */}
      <div className="rounded-lg border border-slate-800/60 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/40">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Beneficiary / Loser Analysis</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-800/40">
          {/* Beneficiaries */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-emerald-400" />
              <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Beneficiaries</h4>
            </div>
            <div className="space-y-3">
              {event.beneficiaries.map(b => (
                <div key={b.name} className="p-2.5 bg-emerald-900/10 border border-emerald-800/20 rounded-lg">
                  <p className="text-emerald-300 text-xs font-semibold mb-0.5">{b.name}</p>
                  <p className="text-slate-400 text-xs mb-1">{b.reason}</p>
                  <div className="flex items-center gap-1 text-slate-600 text-xs">
                    <ChevronRight size={10} />
                    <span>Monitor: {b.metrics}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={13} className="text-rose-400" />
              <h4 className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Losers</h4>
            </div>
            <div className="space-y-3">
              {event.losers.map(l => (
                <div key={l.name} className="p-2.5 bg-rose-900/10 border border-rose-800/20 rounded-lg">
                  <p className="text-rose-300 text-xs font-semibold mb-0.5">{l.name}</p>
                  <p className="text-slate-400 text-xs mb-1">{l.reason}</p>
                  <div className="flex items-center gap-1 text-slate-600 text-xs">
                    <ChevronRight size={10} />
                    <span>Monitor: {l.metrics}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Checklist */}
      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-4">
        <h3 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">Monitoring Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {event.monitoringChecklist.map((item, i) => (
            <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30" />
              <span className="text-slate-300 text-xs group-hover:text-white transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
