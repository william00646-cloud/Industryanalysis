import { benchmarkRows, marketTightnessMap } from '../data/terminal';
import { buildLiveTerminalData, getDataFreshnessLabel } from '../data/liveData';
import { tickerItems } from '../data/terminal';

const signalStyle: Record<string, string> = {
  Bullish:  'text-emerald-400 bg-emerald-900/20 border-emerald-700/30',
  Bearish:  'text-rose-400 bg-rose-900/20 border-rose-700/30',
  Neutral:  'text-slate-400 bg-slate-800/40 border-slate-700/30',
  Elevated: 'text-amber-400 bg-amber-900/20 border-amber-700/30',
};

const volatilityStyle: Record<string, string> = {
  High:   'text-rose-400',
  Medium: 'text-amber-400',
  Low:    'text-emerald-400',
};

const tightnessStyle: Record<string, { text: string; bg: string; bar: string }> = {
  High:   { text: 'text-rose-400',    bg: 'bg-rose-900/20 border-rose-700/30',    bar: 'bg-rose-500' },
  Medium: { text: 'text-amber-400',   bg: 'bg-amber-900/20 border-amber-700/30',  bar: 'bg-amber-500' },
  Low:    { text: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700/30', bar: 'bg-emerald-500' },
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
    <div className="rounded-lg border border-slate-800/60 overflow-hidden mb-4">
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/40">
        <h3 className="text-white font-semibold text-xs uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800/40 bg-slate-900/40">
              <th className="text-left text-slate-600 font-medium px-4 py-2">Benchmark</th>
              <th className="text-left text-slate-600 font-medium px-4 py-2 hidden md:table-cell">Region</th>
              <th className="text-right text-slate-600 font-medium px-4 py-2">Price</th>
              <th className="text-right text-slate-600 font-medium px-4 py-2">Day Chg</th>
              <th className="text-right text-slate-600 font-medium px-4 py-2 hidden sm:table-cell">1W</th>
              <th className="text-right text-slate-600 font-medium px-4 py-2 hidden lg:table-cell">1M</th>
              <th className="text-center text-slate-600 font-medium px-4 py-2 hidden lg:table-cell">Vol</th>
              <th className="text-left text-slate-600 font-medium px-4 py-2 hidden xl:table-cell">Trend</th>
              <th className="text-center text-slate-600 font-medium px-4 py-2">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => {
              const dayUp = b.dailyChangePct > 0;
              const dayDown = b.dailyChangePct < 0;
              return (
                <tr key={b.id} className={`border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="text-slate-200 font-semibold">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 hidden md:table-cell">{b.region}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-white font-mono font-bold">{b.price.toFixed(2)}</span>
                    <span className="text-slate-600 ml-1">{b.unit}</span>
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono font-semibold ${dayUp ? 'text-emerald-400' : dayDown ? 'text-rose-400' : 'text-slate-500'}`}>
                    {dayUp ? '+' : ''}{b.dailyChangePct.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono hidden sm:table-cell ${b.weekChange > 0 ? 'text-emerald-400' : b.weekChange < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {b.weekChange > 0 ? '+' : ''}{b.weekChange.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono hidden lg:table-cell ${b.monthChange > 0 ? 'text-emerald-400' : b.monthChange < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {b.monthChange > 0 ? '+' : ''}{b.monthChange.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2.5 text-center hidden lg:table-cell ${volatilityStyle[b.volatility]}`}>{b.volatility}</td>
                  <td className="px-4 py-2.5 hidden xl:table-cell">
                    <Sparkline values={b.sparkline} color={b.color} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${signalStyle[b.signal]}`}>{b.signal}</span>
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
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Regional Market Tightness</h3>
          <span className="text-slate-700 text-xs">{getDataFreshnessLabel()}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {marketTightnessMap.map(m => {
            const s = tightnessStyle[m.level];
            return (
              <div key={m.label} className={`rounded border p-3 ${s.bg}`}>
                <p className="text-slate-500 text-xs mb-1">{m.label}</p>
                <p className={`font-bold text-sm mb-2 ${s.text}`}>{m.level}</p>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.bar} ${tightnessWidth[m.level]}`} />
                </div>
                <p className="text-slate-600 text-xs mt-1.5">{m.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benchmark Tables */}
      {renderTable(oil, 'Crude Oil Benchmarks')}
      {renderTable(gas, 'Natural Gas / LNG Benchmarks')}

      {/* Interpretation */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-4">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Interpretation</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Market Monitor is designed to identify where stress is emerging. Absolute price levels matter, but regional spreads and relative moves often provide better signals for supply-demand imbalance. The current configuration shows <span className="text-white font-semibold">Asia LNG (JKM) as the most stressed market</span>, with the highest volatility and an Elevated signal. US gas (Henry Hub) is showing Bearish momentum on surplus conditions — this combination creates the widest JKM-Henry Hub spread since 2022.
        </p>
      </div>
    </div>
  );
}
