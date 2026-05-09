import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { SupplyDemandBalance } from '../../types/industry';

interface SupplyDemandChartProps {
  data: SupplyDemandBalance[];
  unit?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="text-slate-500 mb-1">{label}</p>
        <p className={`font-semibold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {val >= 0 ? '+' : ''}{val} mb/d
        </p>
        <p className="text-slate-400 text-xs">{val >= 0 ? 'Surplus' : 'Deficit'}</p>
      </div>
    );
  }
  return null;
};

export function SupplyDemandChart({ data, unit = 'mb/d' }: SupplyDemandChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit={` ${unit}`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
          <Bar dataKey="balance" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#34d399' : '#f87171'} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-slate-600 text-xs mt-2 text-center italic">Demo data for product prototype</p>
    </div>
  );
}
