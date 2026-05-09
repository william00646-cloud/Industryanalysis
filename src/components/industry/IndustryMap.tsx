import { useState } from 'react';
import type { ValueChainSegment } from '../../types/industry';
import { SegmentDetailPanel } from './SegmentDetailPanel';
import { ChevronRight } from 'lucide-react';

interface IndustryMapProps {
  segments: ValueChainSegment[];
}

const categoryConfig = {
  upstream: { label: 'Upstream', color: 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100', active: 'border-cyan-500 bg-cyan-100 shadow-sm', dot: 'bg-cyan-500', header: 'text-cyan-700' },
  midstream: { label: 'Midstream', color: 'border-blue-200 bg-blue-50 hover:bg-blue-100', active: 'border-blue-500 bg-blue-100 shadow-sm', dot: 'bg-blue-500', header: 'text-blue-700' },
  downstream: { label: 'Downstream', color: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100', active: 'border-emerald-500 bg-emerald-100 shadow-sm', dot: 'bg-emerald-500', header: 'text-emerald-700' },
  adjacent: { label: 'Adjacent Markets', color: 'border-amber-200 bg-amber-50 hover:bg-amber-100', active: 'border-amber-500 bg-amber-100 shadow-sm', dot: 'bg-amber-500', header: 'text-amber-700' },
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
                            <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                              {seg.name}
                            </span>
                          </div>
                          <ChevronRight size={14} className={`flex-shrink-0 ${isActive ? 'text-slate-700' : 'text-slate-400'}`} />
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
        <div className="xl:w-96 flex-shrink-0 card p-5 overflow-y-auto max-h-[600px]">
          <SegmentDetailPanel segment={selected} />
        </div>
      )}
    </div>
  );
}
