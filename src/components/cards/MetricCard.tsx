import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  description?: string;
  accent?: 'cyan' | 'emerald' | 'blue' | 'amber' | 'rose';
}

const accentStyles = {
  cyan:    { bar: 'stat-accent-cyan',    value: 'text-cyan-600' },
  emerald: { bar: 'stat-accent-green',   value: 'text-emerald-600' },
  blue:    { bar: 'stat-accent-blue',    value: 'text-blue-600' },
  amber:   { bar: 'stat-accent-amber',   value: 'text-amber-600' },
  rose:    { bar: 'stat-accent-rose',    value: 'text-rose-600' },
};

export function MetricCard({ title, value, unit, change, description, accent = 'blue' }: MetricCardProps) {
  const s = accentStyles[accent];
  return (
    <div className={`card p-4 ${s.bar}`}>
      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.12em] mb-2">{title}</p>

      <div className="flex items-end gap-1.5 mb-1.5">
        <span className={`text-2xl font-bold font-mono leading-none ${s.value}`}>{value}</span>
        {unit && <span className="text-slate-400 text-xs mb-0.5">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${
          change > 0 ? 'text-emerald-600' : change < 0 ? 'text-rose-500' : 'text-slate-400'
        }`}>
          {change > 0 ? <TrendingUp size={11} /> : change < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
          <span className="font-semibold font-mono">{change > 0 ? '+' : ''}{change}%</span>
        </div>
      )}
      {description && (
        <p className="text-slate-400 text-[10px] mt-2 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
