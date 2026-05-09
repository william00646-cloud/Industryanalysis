import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PriceBenchmark } from '../../types/industry';

interface PriceLineChartProps {
  benchmarks: PriceBenchmark[];
}

// Merge all benchmark data by date
function mergeData(benchmarks: PriceBenchmark[]) {
  const map = new Map<string, Record<string, number>>();
  for (const bm of benchmarks) {
    for (const d of bm.data) {
      if (!map.has(d.date)) map.set(d.date, { date: d.date as unknown as number });
      map.get(d.date)![bm.id] = d.price;
    }
  }
  return Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function PriceLineChart({ benchmarks }: PriceLineChartProps) {
  const data = mergeData(benchmarks);

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
            labelStyle={{ color: '#64748b' }}
            itemStyle={{ color: '#334155' }}
          />
          <Legend formatter={(value) => <span className="text-slate-600 text-xs">{value}</span>} />
          {benchmarks.map((bm) => (
            <Line
              key={bm.id}
              type="monotone"
              dataKey={bm.id}
              name={bm.name}
              stroke={bm.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-slate-600 text-xs mt-2 text-center italic">Demo data for product prototype</p>
    </div>
  );
}
