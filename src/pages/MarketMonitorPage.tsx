import { benchmarkRows, marketTightnessMap } from '../data/terminal';
import { buildLiveTerminalData, getDataFreshnessLabel } from '../data/liveData';
import { tickerItems } from '../data/terminal';

const signalStyle: Record<string, string> = {
  Bullish:  'chip chip-green',
  Bearish:  'chip chip-rose',
  Neutral:  'chip chip-slate',
  Elevated: 'chip chip-amber',
};

const volatilityStyle: Record<string, string> = {
  High:   'text-rose-600',
  Medium: 'text-amber-600',
  Low:    'text-emerald-600',
};

const tightnessStyle: Record<string, { text: string; bg: string; bar: string }> = {
  High:   { text: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200',    bar: 'bg-rose-500' },
  Medium: { text: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  bar: 'bg-amber-500' },
  Low:    { text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500' },
};

const tightnessWidth: Record<string, string> = { High: 'w-full', Medium: 'w-2/3', Low: 'w-1/3' };

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 60, h = 20;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MarketMonitorPage() {
  const live = buildLiveTerminalData(tickerItems, benchmarkRows);
  const oil = live.benchmarkRows.filter(b => b.assetClass === 'oil');
  const gas = live.benchmarkRows.filter(b => b.assetClass === 'gas');

  const renderTable = (rows: typeof benchmarkRows, title: string) => (
    <div className="card overflow-hidden mb-4">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <h3 className="text-slate-800 font-semibold text-xs uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-slate-500 font-medium px-4 py-2">Benchmark</th>
              <th className="text-left text-slate-500 font-medium px-4 py-2 hidden md:table-cell">Region</th>
              <th className="text-right text-slate-500 font-medium px-4 py-2">Price</th>
              <th className="text-right text-slate-500 font-medium px-4 py-2">Day Chg</th>
              <th className="text-right text-slate-500 font-medium px-4 py-2 hidden sm:table-cell">1W</th>
              <th className="text-right text-slate-500 font-medium px-4 py-2 hidden lg:table-cell">1M</th>
              <th className="text-center text-slate-500 font-medium px-4 py-2 hidden lg:table-cell">Vol</th>
              <th className="text-left text-slate-500 font-medium px-4 py-2 hidden xl:table-cell">Trend</th>
              <th className="text-center text-slate-500 font-medium px-4 py-2">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => {
              const dayUp = b.dailyChangePct > 0;
              const dayDown = b.dailyChangePct < 0;
              return (
                <tr key={b.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="text-slate-800 font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 hidden md:table-cell">{b.region}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-slate-900 font-mono font-bold">{b.price.toFixed(2)}</span>
                    <span className="text-slate-400 ml-1">{b.unit}</span>
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono font-semibold ${dayUp ? 'text-emerald-600' : dayDown ? 'text-rose-500' : 'text-slate-400'}`}>
                    {dayUp ? '+' : ''}{b.dailyChangePct.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono hidden sm:table-cell ${b.weekChange > 0 ? 'text-emerald-600' : b.weekChange < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {b.weekChange > 0 ? '+' : ''}{b.weekChange.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono hidden lg:table-cell ${b.monthChange > 0 ? 'text-emerald-600' : b.monthChange < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {b.monthChange > 0 ? '+' : ''}{b.monthChange.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2.5 text-center hidden lg:table-cell ${volatilityStyle[b.volatility]}`}>{b.volatility}</td>
                  <td className="px-4 py-2.5 hidden xl:table-cell">
                    <Sparkline values={b.sparkline} color={b.color} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={signalStyle[b.signal]}>{b.signal}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Heatmap */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-label">Regional Market Tightness</h3>
          <span className="text-slate-400 text-xs">{getDataFreshnessLabel()}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {marketTightnessMap.map(m => {
            const s = tightnessStyle[m.level];
            return (
              <div key={m.label} className={`rounded-lg border p-3 ${s.bg}`}>
                <p className="text-slate-500 text-xs mb-1">{m.label}</p>
                <p className={`font-bold text-sm mb-2 ${s.text}`}>{m.level}</p>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.bar} ${tightnessWidth[m.level]}`} />
                </div>
                <p className="text-slate-500 text-xs mt-1.5">{m.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmark Tables */}
      {renderTable(oil, 'Crude Oil Benchmarks')}
      {renderTable(gas, 'Natural Gas / LNG Benchmarks')}

      {/* Interpretation */}
      <div className="card stat-accent-blue p-4">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">Interpretation</p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Market Monitor is designed to identify where stress is emerging. Absolute price levels matter, but regional spreads and relative moves often provide better signals for supply-demand imbalance. The current configuration shows <span className="text-slate-900 font-semibold">Asia LNG (JKM) as the most stressed market</span>, with the highest volatility and an Elevated signal. US gas (Henry Hub) is showing Bearish momentum on surplus conditions — this combination creates the widest JKM-Henry Hub spread since 2022.
        </p>
      </div>
    </div>
  );
}
