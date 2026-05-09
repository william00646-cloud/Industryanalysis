import { useState } from 'react';
import type { ValueChainSegment } from '../../types/industry';
import { SegmentDetailPanel } from './SegmentDetailPanel';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ValueChainFlowProps {
  segments: ValueChainSegment[];
  defaultSelectedId?: string;
}

const nodeStyle: Record<string, string> = {
  upstream: 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-700',
  midstream: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700',
  downstream: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
  adjacent: 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700',
};
const activeNodeStyle: Record<string, string> = {
  upstream: 'border-cyan-500 bg-cyan-100 text-cyan-800 shadow-sm font-semibold',
  midstream: 'border-blue-500 bg-blue-100 text-blue-800 shadow-sm font-semibold',
  downstream: 'border-emerald-500 bg-emerald-100 text-emerald-800 shadow-sm font-semibold',
  adjacent: 'border-amber-500 bg-amber-100 text-amber-800 shadow-sm font-semibold',
};

// Ordered for the flow display (exclude adjacent from main flow)
const mainFlowIds = ['exploration', 'drilling', 'production', 'pipeline', 'lng', 'refining'];

export function ValueChainFlow({ segments, defaultSelectedId = 'exploration' }: ValueChainFlowProps) {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState<ValueChainSegment | null>(
    segments.find(s => s.id === defaultSelectedId) ?? segments[0] ?? null
  );

  const mainFlow = mainFlowIds.map(id => segments.find(s => s.id === id)).filter(Boolean) as ValueChainSegment[];
  const adjacent = segments.filter(s => s.category === 'adjacent');

  const renderNode = (seg: ValueChainSegment) => {
    const isActive = selected?.id === seg.id;
    return (
      <button
        key={seg.id}
        onClick={() => setSelected(seg)}
        className={`rounded-lg border px-3 py-2 transition-all text-sm font-medium ${
          isActive ? activeNodeStyle[seg.category] : nodeStyle[seg.category]
        }`}
      >
        {lang === 'zh' && seg.nameZh ? seg.nameZh : seg.name}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Main flow */}
      <div className="flex flex-wrap items-center gap-2">
        {mainFlow.map((seg, i) => (
          <div key={seg.id} className="flex items-center gap-2">
            {renderNode(seg)}
            {i < mainFlow.length - 1 && <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Adjacent */}
      {adjacent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-600 text-xs uppercase tracking-wider mr-1">{lang === 'zh' ? '周邊：' : 'Adjacent:'}</span>
          {adjacent.map(seg => renderNode(seg))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="mt-4 card p-5 overflow-y-auto max-h-[500px]">
          <SegmentDetailPanel segment={selected} />
        </div>
      )}
    </div>
  );
}
