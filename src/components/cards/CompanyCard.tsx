import type { Company } from '../../types/industry';
import { Badge } from '../ui/Badge';

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
  isSelected?: boolean;
}

const categoryColors: Record<string, 'cyan' | 'blue' | 'emerald' | 'amber' | 'violet' | 'gray'> = {
  'upstream': 'cyan',
  'midstream': 'blue',
  'downstream': 'emerald',
  'lng': 'amber',
  'oilfield-services': 'violet',
  'integrated': 'gray',
};

export function CompanyCard({ company, onClick, isSelected }: CompanyCardProps) {
  const color = categoryColors[company.segmentCategory] ?? 'gray';
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-5 transition-all ${
        isSelected
          ? 'border-cyan-500/60 bg-cyan-500/10'
          : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-500/60 hover:bg-slate-700/40'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">{company.name}</h3>
          <span className="text-slate-500 text-xs font-mono">{company.ticker}</span>
        </div>
        <Badge label={company.segmentCategory.replace('-', ' ').toUpperCase()} variant={color} size="sm" />
      </div>
      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{company.segment}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-500">Market Cap</span>
          <p className="text-slate-200 font-medium">{company.marketCap}</p>
        </div>
        <div>
          <span className="text-slate-500">Revenue</span>
          <p className="text-slate-200 font-medium">{company.revenue}</p>
        </div>
      </div>
      <div className="mt-3 text-xs">
        <span className="text-slate-500">FCF: </span>
        <span className="text-slate-300">{company.fcfStatus}</span>
      </div>
    </button>
  );
}
