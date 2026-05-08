import type { ValueChainSegment } from '../../types/industry';
import { Badge } from '../ui/Badge';
import { DollarSign, AlertTriangle, Zap, Building2, BarChart2 } from 'lucide-react';

interface SegmentDetailPanelProps {
  segment: ValueChainSegment;
}

const categoryColor: Record<string, 'cyan' | 'blue' | 'emerald' | 'amber'> = {
  upstream: 'cyan',
  midstream: 'blue',
  downstream: 'emerald',
  adjacent: 'amber',
};

export function SegmentDetailPanel({ segment }: SegmentDetailPanelProps) {
  const color = categoryColor[segment.category] ?? 'cyan';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Badge label={segment.category.toUpperCase()} variant={color} size="md" />
        <h3 className="text-white font-semibold text-lg">{segment.name}</h3>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{segment.description}</p>

      {/* Commercial Nature */}
      <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-700/40">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Commercial Nature</p>
        <p className="text-slate-300 text-sm">{segment.commercialNature}</p>
      </div>

      {/* Revenue Sources */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={14} className="text-emerald-400" />
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Revenue Sources</p>
        </div>
        <ul className="space-y-1">
          {segment.revenueSources.map((r) => (
            <li key={r} className="text-slate-300 text-sm flex items-start gap-2">
              <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cost Drivers */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 size={14} className="text-blue-400" />
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Key Cost Drivers</p>
        </div>
        <ul className="space-y-1">
          {segment.costDrivers.map((c) => (
            <li key={c} className="text-slate-300 text-sm flex items-start gap-2">
              <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Capabilities */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-amber-400" />
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Key Capabilities</p>
        </div>
        <ul className="space-y-1">
          {segment.keyCapabilities.map((k) => (
            <li key={k} className="text-slate-300 text-sm flex items-start gap-2">
              <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={14} className="text-rose-400" />
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Main Risks</p>
        </div>
        <ul className="space-y-1">
          {segment.risks.map((r) => (
            <li key={r} className="text-slate-300 text-sm flex items-start gap-2">
              <span className="text-rose-500 mt-1 flex-shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Companies */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={14} className="text-slate-400" />
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Representative Companies</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {segment.representativeCompanies.map((c) => (
            <Badge key={c} label={c} variant="gray" />
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Key Metrics to Watch</p>
        <div className="flex flex-wrap gap-1.5">
          {segment.keyMetrics.map((m) => (
            <Badge key={m} label={m} variant="cyan" />
          ))}
        </div>
      </div>
    </div>
  );
}
