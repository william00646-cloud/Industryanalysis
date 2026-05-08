import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceBenchmark } from '../../types/industry';

interface SpreadChartProps {
  highBenchmark: PriceBenchmark;
  lowBenchmark: PriceBenchmark;
  title: string;
  interpretation: string;
}

export function SpreadChart({ highBenchmark, lowBenchmark, title, interpretation }: SpreadChartProps) {
  // Compute spread data
  const lowMap = new Map(lowBenchmark.data.map((d) => [d.date, d.price]));
  const spreadData = highBenchmark.data
    .filter((d) => lowMap.has(d.date))
    .map((d) => ({
      date: d.date,
      spread: parseFloat((d.price - (lowMap.get(d.date) ?? 0)).toFixed(2)),
    }));

  const current = spreadData[spreadData.length - 1]?.spread ?? 0;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <span className={`text-lg font-bold ${current > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
          {current > 0 ? '+' : ''}{current} {highBenchmark.unit}
        </span>
      </div>
      <p className="text-slate-500 text-xs mb-4">
        {highBenchmark.name} minus {lowBenchmark.name}
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={spreadData} margin={{ top: 2, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="spread"
            stroke="#22d3ee"
            strokeWidth={2}
            fill={`url(#grad-${title})`}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-slate-500 text-xs mt-3 leading-relaxed italic">{interpretation}</p>
    </div>
  );
}
