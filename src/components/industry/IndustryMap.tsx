import { useState } from 'react';
import type { ValueChainSegment } from '../../types/industry';
import { SegmentDetailPanel } from './SegmentDetailPanel';
import { ChevronRight } from 'lucide-react';

interface IndustryMapProps {
  segments: ValueChainSegment[];
}

const categoryConfig = {
  upstream: { label: 'Upstream', color: 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20', active: 'border-cyan-400 bg-cyan-500/25', dot: 'bg-cyan-400', header: 'text-cyan-400' },
  midstream: { label: 'Midstream', color: 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20', active: 'border-blue-400 bg-blue-500/25', dot: 'bg-blue-400', header: 'text-blue-400' },
  downstream: { label: 'Downstream', color: 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20', active: 'border-emerald-400 bg-emerald-500/25', dot: 'bg-emerald-400', header: 'text-emerald-400' },
  adjacent: { label: 'Adjacent Markets', color: 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20', active: 'border-amber-400 bg-amber-500/25', dot: 'bg-amber-400', header: 'text-amber-400' },
};

const categories = ['upstream', 'midstream', 'downstream', 'adjacent'] as const;

export function IndustryMap({ segments }: IndustryMapProps) {
  const [selected, setSelected] = useState<ValueChainSegment | null>(segments.find(s => s.id === 'exploration') ?? null);

  const byCategory = (cat: typeof categories[number]) => segments.filter(s => s.category === cat);

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Map */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const items = byCategory(cat);
            if (!items.length) return null;
            return (
              <div key={cat} className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${config.header}`}>
                  {config.label}
                </p>
                <div className="space-y-2">
                  {items.map((seg) => {
                    const isActive = selected?.id === seg.id;
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setSelected(seg)}
                        className={`w-full text-left rounded-lg border p-3 transition-all ${
                          isActive ? config.active : config.color
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                              {seg.name}
                            </span>
                          </div>
                          <ChevronRight size={14} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <p className="text-slate-500 text-xs mt-1 ml-4 line-clamp-1">{seg.description.slice(0, 60)}…</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow arrows */}
        <div className="mt-6 flex items-center gap-2 text-slate-600 text-xs overflow-x-auto pb-1">
          {['Exploration', 'Drilling', 'Production', 'Pipeline / LNG', 'Refining', 'Distribution', 'End Users'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-slate-500">{step}</span>
              {i < arr.length - 1 && <span className="text-slate-700">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="xl:w-96 flex-shrink-0 rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 overflow-y-auto max-h-[600px]">
          <SegmentDetailPanel segment={selected} />
        </div>
      )}
    </div>
  );
}
