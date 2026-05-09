import { AlertTriangle, Info, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low' | 'positive';
  index?: number;
}

const severityConfig = {
  high: {
    bar: 'stat-accent-rose',
    chipClass: 'chip chip-rose',
    icon: <AlertTriangle size={14} className="text-rose-500 flex-shrink-0" />,
    label: 'High Alert',
    dotColor: 'bg-rose-500',
  },
  medium: {
    bar: 'stat-accent-amber',
    chipClass: 'chip chip-amber',
    icon: <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />,
    label: 'Watch',
    dotColor: 'bg-amber-500',
  },
  low: {
    bar: '',
    chipClass: 'chip chip-slate',
    icon: <Info size={14} className="text-slate-400 flex-shrink-0" />,
    label: 'Note',
    dotColor: 'bg-slate-400',
  },
  positive: {
    bar: 'stat-accent-green',
    chipClass: 'chip chip-green',
    icon: <TrendingUp size={14} className="text-emerald-600 flex-shrink-0" />,
    label: 'Opportunity',
    dotColor: 'bg-emerald-500',
  },
};

export function InsightCard({ title, description, severity = 'medium', index }: InsightCardProps) {
  const config = severityConfig[severity];
  return (
    <div className={`card p-4 ${config.bar}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {index !== undefined && (
              <span className="text-slate-400 text-[10px] font-mono">#{String(index + 1).padStart(2, '0')}</span>
            )}
            <span className={config.chipClass}>{config.label}</span>
            <span className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor}`} />
          </div>
          <h3 className="text-slate-900 font-semibold text-sm mb-1.5 leading-snug">{title}</h3>
          <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
