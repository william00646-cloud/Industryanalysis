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
      className={`relative w-full text-left rounded-xl border p-4 overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : 'card'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm leading-tight">{company.name}</h3>
          <span className="text-blue-600 text-[10px] font-mono font-bold tracking-wider">{company.ticker}</span>
        </div>
        <Badge label={company.segmentCategory.replace('-', ' ').toUpperCase()} variant={color} size="sm" />
      </div>

      <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">{company.segment}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase tracking-wide">Mkt Cap</span>
          <p className="text-slate-800 font-semibold font-mono mt-0.5">{company.marketCap}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase tracking-wide">Revenue</span>
          <p className="text-slate-800 font-semibold font-mono mt-0.5">{company.revenue}</p>
        </div>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-slate-400 text-[10px] uppercase tracking-wide">FCF</span>
        <span className="text-slate-600 text-xs">{company.fcfStatus}</span>
      </div>
    </button>
  );
}
