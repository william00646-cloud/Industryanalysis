import { AlertTriangle, Info, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low' | 'positive';
  index?: number;
}

const severityConfig = {
  high: {
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/5',
    icon: <AlertTriangle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />,
    label: 'High Alert',
    labelColor: 'text-rose-400',
  },
  medium: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    icon: <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />,
    label: 'Watch',
    labelColor: 'text-amber-400',
  },
  low: {
    border: 'border-slate-600/40',
    bg: 'bg-slate-700/20',
    icon: <Info size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />,
    label: 'Note',
    labelColor: 'text-slate-400',
  },
  positive: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/5',
    icon: <TrendingUp size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />,
    label: 'Opportunity',
    labelColor: 'text-emerald-400',
  },
};

export function InsightCard({ title, description, severity = 'medium', index }: InsightCardProps) {
  const config = severityConfig[severity];
  return (
    <div className={`rounded-xl border p-5 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {index !== undefined && (
              <span className="text-slate-600 text-xs font-mono">#{index + 1}</span>
            )}
            <span className={`text-xs font-semibold uppercase tracking-wider ${config.labelColor}`}>
              {config.label}
            </span>
          </div>
          <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
