import { benchmarkRows, spreadCards, priceAlerts } from '../data/terminal';
import { useIndustry } from '../context/IndustryContext';
import { PriceLineChart } from '../components/charts/PriceLineChart';

const signalStyle: Record<string, { text: string; bg: string; border: string }> = {
  Normal:   { text: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
  Elevated: { text: 'text-amber-400',   bg: 'bg-amber-900/20',   border: 'border-amber-700/30' },
  Extreme:  { text: 'text-rose-400',    bg: 'bg-rose-900/20',    border: 'border-rose-700/30' },
};

const alertStyle: Record<string, string> = {
  high:   'text-rose-400 bg-rose-900/20 border-rose-700/30',
  medium: 'text-amber-400 bg-amber-900/20 border-amber-700/30',
  low:    'text-emerald-400 bg-emerald-900/20 border-emerald-700/30',
};

function ZScoreBar({ z }: { z: number }) {
  const width = Math.min(Math.abs(z) / 3, 1) * 100;
  const color = Math.abs(z) > 2 ? 'bg-rose-500' : Math.abs(z) > 1 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className={`text-xs font-mono font-bold ${Math.abs(z) > 2 ? 'text-rose-400' : Math.abs(z) > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
        {z > 0 ? '+' : ''}{z.toFixed(2)}σ
      </span>
    </div>
  );
}

export function PriceSpreadPage() {
  const { industry } = useIndustry();
  const { priceBenchmarks } = industry;

  // Use industry benchmarks for the line chart, fallback to terminal benchmarks
  const chartBenchmarks = priceBenchmarks.length > 0 ? priceBenchmarks : [];
  const types = [...new Set(chartBenchmarks.map(b => b.type))];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Alerts */}
      <div className="flex flex-wrap gap-2">
        {priceAlerts.map(a => (
          <div key={a.id} className={`px-3 py-1.5 rounded border text-xs font-medium ${alertStyle[a.level]}`}>
            ⚠ {a.label}
          </div>
        ))}
      </div>

      {/* Price Charts */}
      {types.map(type => {
        const group = chartBenchmarks.filter(b => b.type === type);
        return (
          <div key={type} className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-sm capitalize">{type} Benchmarks</h3>
            </div>
            <p className="text-slate-500 text-xs mb-4">{group.map(b => b.name).join(' · ')}</p>
            <PriceLineChart benchmarks={group} />
          </div>
        );
      })}

      {/* Spread Cards */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Spread Monitor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spreadCards.map(sp => {
            const s = signalStyle[sp.signal];
            const hi = benchmarkRows.find(b => b.id === sp.highId);
            const lo = benchmarkRows.find(b => b.id === sp.lowId);
            return (
              <div key={sp.id} className={`rounded-lg border p-4 ${s.border} ${s.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-bold text-sm">{sp.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${s.text} ${s.border}`}>{sp.signal}</span>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  {hi && (
                    <div className="bg-slate-800/40 rounded p-2">
                      <p className="text-slate-600 text-xs">{hi.name}</p>
                      <p className="text-white font-mono font-bold text-sm">{hi.price.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="bg-slate-800/60 rounded p-2 border border-slate-600/40">
                    <p className="text-slate-500 text-xs">Spread</p>
                    <p className={`font-mono font-bold text-base ${s.text}`}>
                      {sp.currentSpread > 0 ? '+' : ''}{sp.currentSpread.toFixed(2)}
                    </p>
                    <p className="text-slate-600 text-xs">{sp.unit}</p>
                  </div>
                  {lo && (
                    <div className="bg-slate-800/40 rounded p-2">
                      <p className="text-slate-600 text-xs">{lo.name}</p>
                      <p className="text-white font-mono font-bold text-sm">{lo.price.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {/* Averages */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                  <div>
                    <p className="text-slate-600">30D Avg</p>
                    <p className="text-slate-300 font-mono">{sp.avg30d.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">1Y Avg</p>
                    <p className="text-slate-300 font-mono">{sp.avg1y.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">vs 1Y Avg</p>
                    <p className={`font-mono font-semibold ${sp.currentSpread > sp.avg1y ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {sp.currentSpread > sp.avg1y ? '+' : ''}{((sp.currentSpread - sp.avg1y) / sp.avg1y * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Z-Score */}
                <div className="mb-3">
                  <p className="text-slate-600 text-xs mb-1">Z-Score (deviation from 1Y mean)</p>
                  <ZScoreBar z={sp.zScore} />
                </div>

                {/* Interpretation */}
                <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-700/30 pt-2">{sp.interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Markers */}
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Scenario Annotations</h3>
        <div className="divide-y divide-slate-800/40">
          {[
            { event: 'Hormuz Strait risk escalation', impact: 'Brent +$15–25; JKM +$5–8/MMBtu', level: 'high' },
            { event: 'Qatar LNG facility disruption', impact: 'JKM spike +$8–15/MMBtu', level: 'high' },
            { event: 'Asian LNG demand spike (cold winter)', impact: 'JKM +$3–6; TTF secondary uplift', level: 'medium' },
            { event: 'Henry Hub price collapse (<$2)', impact: 'JKM-HH spread widens to potential record', level: 'medium' },
            { event: 'OPEC+ extends production cuts', impact: 'Brent +$5–10; WTI follows', level: 'medium' },
          ].map(e => (
            <div key={e.event} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.level === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className="text-slate-300 text-xs">{e.event}</span>
              </div>
              <span className={`text-xs font-medium flex-shrink-0 ml-4 ${e.level === 'high' ? 'text-rose-400' : 'text-amber-400'}`}>{e.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
