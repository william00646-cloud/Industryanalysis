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
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  emerald: 'border-emerald-500/30 bg-emerald-500/5',
  blue: 'border-blue-500/30 bg-blue-500/5',
  amber: 'border-amber-500/30 bg-amber-500/5',
  rose: 'border-rose-500/30 bg-rose-500/5',
};

const valueAccent = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
};

export function MetricCard({ title, value, unit, change, description, accent = 'cyan' }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${accentStyles[accent]}`}>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end gap-2 mb-1">
        <span className={`text-2xl font-bold ${valueAccent[accent]}`}>{value}</span>
        {unit && <span className="text-slate-500 text-sm mb-0.5">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{change > 0 ? '+' : ''}{change}%</span>
        </div>
      )}
      {description && <p className="text-slate-500 text-xs mt-2 leading-relaxed">{description}</p>}
    </div>
  );
}
