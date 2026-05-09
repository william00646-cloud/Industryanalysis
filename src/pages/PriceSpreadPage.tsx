import { benchmarkRows, spreadCards, priceAlerts } from '../data/terminal';
import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { PriceLineChart } from '../components/charts/PriceLineChart';

const typeLabels: Record<string, { en: string; zh: string }> = {
  oil:  { en: 'Oil Benchmarks',       zh: '原油基準價格' },
  gas:  { en: 'Gas Benchmarks',       zh: '天然氣基準價格' },
  lng:  { en: 'LNG Benchmarks',       zh: 'LNG 基準價格' },
  coal: { en: 'Coal Benchmarks',      zh: '煤炭基準價格' },
};

const i18n = {
  spreadMonitor:  { en: 'Spread Monitor',         zh: '價差監控' },
  scenarios:      { en: 'Scenario Annotations',   zh: '情境模擬' },
  spread:         { en: 'Spread',                 zh: '價差' },
  avg30d:         { en: '30D Avg',                zh: '30日均' },
  avg1y:          { en: '1Y Avg',                 zh: '1年均' },
  vs1y:           { en: 'vs 1Y Avg',              zh: '比較1年均' },
  zScore:         { en: 'Z-Score (deviation from 1Y mean)', zh: 'Z分數（偏離1年均值）' },
};

const signalStyle: Record<string, { text: string; bg: string; border: string }> = {
  Normal:   { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Elevated: { text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  Extreme:  { text: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200' },
};

const alertStyle: Record<string, string> = {
  high:   'text-rose-700 bg-rose-50 border-rose-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low:    'text-emerald-700 bg-emerald-50 border-emerald-200',
};

function ZScoreBar({ z }: { z: number }) {
  const width = Math.min(Math.abs(z) / 3, 1) * 100;
  const color = Math.abs(z) > 2 ? 'bg-rose-500' : Math.abs(z) > 1 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className={`text-xs font-mono font-bold ${Math.abs(z) > 2 ? 'text-rose-600' : Math.abs(z) > 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
        {z > 0 ? '+' : ''}{z.toFixed(2)}σ
      </span>
    </div>
  );
}

export function PriceSpreadPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
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
          <div key={type} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-900 font-semibold text-sm capitalize">{(typeLabels[type] ?? { en: `${type} Benchmarks`, zh: `${type} 基準價格` })[lang]}</h3>
            </div>
            <p className="text-slate-500 text-xs mb-4">{group.map(b => b.name).join(' · ')}</p>
            <PriceLineChart benchmarks={group} />
          </div>
        );
      })}

      {/* Spread Cards */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{i18n.spreadMonitor[lang]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spreadCards.map(sp => {
            const s = signalStyle[sp.signal];
            const hi = benchmarkRows.find(b => b.id === sp.highId);
            const lo = benchmarkRows.find(b => b.id === sp.lowId);
            return (
              <div key={sp.id} className={`card p-4 border ${s.border} ${s.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-slate-900 font-bold text-sm">{sp.title}</h4>
                  <span className={`chip border ${s.text} ${s.border}`}>{sp.signal}</span>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  {hi && (
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                      <p className="text-slate-500 text-xs">{hi.name}</p>
                      <p className="text-slate-900 font-mono font-bold text-sm">{hi.price.toFixed(2)}</p>
                    </div>
                  )}
                  <div className={`rounded-lg p-2 border ${s.border} ${s.bg}`}>
                    <p className="text-slate-500 text-xs">{i18n.spread[lang]}</p>
                    <p className={`font-mono font-bold text-base ${s.text}`}>
                      {sp.currentSpread > 0 ? '+' : ''}{sp.currentSpread.toFixed(2)}
                    </p>
                    <p className="text-slate-500 text-xs">{sp.unit}</p>
                  </div>
                  {lo && (
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                      <p className="text-slate-500 text-xs">{lo.name}</p>
                      <p className="text-slate-900 font-mono font-bold text-sm">{lo.price.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {/* Averages */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                  <div>
                    <p className="text-slate-500">{i18n.avg30d[lang]}</p>
                    <p className="text-slate-700 font-mono">{sp.avg30d.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{i18n.avg1y[lang]}</p>
                    <p className="text-slate-700 font-mono">{sp.avg1y.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{i18n.vs1y[lang]}</p>
                    <p className={`font-mono font-semibold ${sp.currentSpread > sp.avg1y ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {sp.currentSpread > sp.avg1y ? '+' : ''}{((sp.currentSpread - sp.avg1y) / sp.avg1y * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Z-Score */}
                <div className="mb-3">
                  <p className="text-slate-500 text-xs mb-1">{i18n.zScore[lang]}</p>
                  <ZScoreBar z={sp.zScore} />
                </div>

                {/* Interpretation */}
                <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-200 pt-2">{sp.interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Markers */}
      <div className="card p-4">
        <h3 className="section-label mb-3">{i18n.scenarios[lang]}</h3>
        <div className="divide-y divide-slate-100">
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
                <span className="text-slate-600 text-xs">{e.event}</span>
              </div>
              <span className={`text-xs font-medium flex-shrink-0 ml-4 ${e.level === 'high' ? 'text-rose-600' : 'text-amber-600'}`}>{e.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
