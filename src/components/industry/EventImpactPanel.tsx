import type { ImpactScenario } from '../../types/industry';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';

interface EventImpactPanelProps {
  scenario: ImpactScenario;
}

export function EventImpactPanel({ scenario }: EventImpactPanelProps) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
      <div>
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Shock Analysis</p>
        <h3 className="text-white font-semibold text-base">{scenario.title}</h3>
      </div>

      {/* Affected Segments */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={13} className="text-amber-400" />
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Affected Segments</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {scenario.affectedSegments.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 bg-amber-900/40 text-amber-300 border border-amber-700/40 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Price Impact */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 size={13} className="text-cyan-400" />
          <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Likely Price Impact</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{scenario.likelyPriceImpact}</p>
      </div>

      {/* Beneficiaries & Losers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={13} className="text-emerald-400" />
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Beneficiaries</p>
          </div>
          <ul className="space-y-1">
            {scenario.beneficiaries.map((b) => (
              <li key={b} className="text-emerald-300 text-xs">• {b}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={13} className="text-rose-400" />
            <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Losers</p>
          </div>
          <ul className="space-y-1">
            {scenario.losers.map((l) => (
              <li key={l} className="text-rose-300 text-xs">• {l}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Metrics to Monitor */}
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Metrics to Monitor</p>
        <ul className="space-y-1">
          {scenario.metricsToMonitor.map((m) => (
            <li key={m} className="text-slate-400 text-xs">→ {m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
