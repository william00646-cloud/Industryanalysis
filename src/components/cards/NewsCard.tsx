import type { NewsEvent } from '../../types/industry';
import { Badge } from '../ui/Badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface NewsCardProps {
  news: NewsEvent;
  compact?: boolean;
}

const importanceConfig = {
  High: { variant: 'rose' as const, dot: 'bg-rose-400' },
  Medium: { variant: 'amber' as const, dot: 'bg-amber-400' },
  Low: { variant: 'gray' as const, dot: 'bg-slate-500' },
};

const categoryVariant: Record<string, 'cyan' | 'blue' | 'emerald' | 'amber' | 'violet' | 'gray' | 'rose'> = {
  'Geopolitics': 'rose',
  'Supply': 'cyan',
  'Demand': 'emerald',
  'Price': 'amber',
  'Regulation': 'violet',
  'Company': 'blue',
  'Technology': 'blue',
  'Deal / Contract': 'emerald',
};

export function NewsCard({ news, compact }: NewsCardProps) {
  const imp = importanceConfig[news.importance];

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${imp.dot}`} />
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-1.5">{news.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Calendar size={11} />
              <span>{news.date}</span>
            </div>
            <Badge label={news.category} variant={categoryVariant[news.category] ?? 'gray'} />
            <Badge label={news.importance} variant={imp.variant} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{news.summary}</p>

      {!compact && (
        <>
          {/* Why it matters */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Why It Matters</p>
            <p className="text-slate-700 text-sm leading-relaxed">{news.whyItMatters}</p>
          </div>

          {/* Beneficiaries & Losers */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={12} className="text-emerald-600" />
                <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Beneficiaries</p>
              </div>
              <ul className="space-y-0.5">
                {news.potentialBeneficiaries.map((b) => (
                  <li key={b} className="text-emerald-700 text-xs">• {b}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown size={12} className="text-rose-500" />
                <p className="text-rose-700 text-xs font-semibold uppercase tracking-wider">Potential Losers</p>
              </div>
              <ul className="space-y-0.5">
                {news.potentialLosers.map((l) => (
                  <li key={l} className="text-rose-700 text-xs">• {l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Segments & Companies */}
          <div className="flex flex-wrap gap-1.5">
            {news.affectedSegments.map((s) => (
              <Badge key={s} label={s} variant="blue" />
            ))}
            {news.relatedCompanies.slice(0, 3).map((c) => (
              <Badge key={c} label={c} variant="gray" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
