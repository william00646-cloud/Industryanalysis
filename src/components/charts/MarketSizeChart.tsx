import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MarketStructureSegment } from '../../types/industry';

interface MarketSizeChartProps {
  data: MarketStructureSegment[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: MarketStructureSegment }> }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="text-slate-900 font-semibold mb-1">{d.segment}</p>
        <p className="text-slate-700">{d.marketSize}</p>
        <p className="text-slate-500">{d.sharePercent}% of total</p>
      </div>
    );
  }
  return null;
};

export function MarketSizeChart({ data }: MarketSizeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="sharePercent"
          nameKey="segment"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-slate-600 text-xs">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
