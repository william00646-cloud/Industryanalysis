import { useState } from 'react';
import type { ValueChainSegment } from '../../types/industry';
import { SegmentDetailPanel } from './SegmentDetailPanel';
import { ChevronRight } from 'lucide-react';

interface ValueChainFlowProps {
  segments: ValueChainSegment[];
  defaultSelectedId?: string;
}

const nodeStyle: Record<string, string> = {
  upstream: 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300',
  midstream: 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
  downstream: 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300',
  adjacent: 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300',
};
const activeNodeStyle: Record<string, string> = {
  upstream: 'border-cyan-400 bg-cyan-500/25 text-white',
  midstream: 'border-blue-400 bg-blue-500/25 text-white',
  downstream: 'border-emerald-400 bg-emerald-500/25 text-white',
  adjacent: 'border-amber-400 bg-amber-500/25 text-white',
};

// Ordered for the flow display (exclude adjacent from main flow)
const mainFlowIds = ['exploration', 'drilling', 'production', 'pipeline', 'lng', 'refining'];

export function ValueChainFlow({ segments, defaultSelectedId = 'exploration' }: ValueChainFlowProps) {
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
        {seg.name}
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
          <span className="text-slate-600 text-xs uppercase tracking-wider mr-1">Adjacent:</span>
          {adjacent.map(seg => renderNode(seg))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 overflow-y-auto max-h-[500px]">
          <SegmentDetailPanel segment={selected} />
        </div>
      )}
    </div>
  );
}
