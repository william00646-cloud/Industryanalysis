import { useState, useEffect, useRef } from 'react';
import type { TerminalPageId } from '../../types/terminal';
import { commandPaletteItems } from '../../data/terminal';
import { Search } from 'lucide-react';

interface CommandPaletteProps {
  onNavigate: (page: TerminalPageId) => void;
  onSelectCompany?: (id: string) => void;
}

const typeColor: Record<string, string> = {
  page:      'chip chip-blue',
  company:   'chip chip-green',
  benchmark: 'chip chip-amber',
  event:     'chip chip-rose',
};

export function CommandPalette({ onNavigate, onSelectCompany }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? commandPaletteItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        (i.subtitle ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : commandPaletteItems.slice(0, 10);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const runCommand = (item: (typeof commandPaletteItems)[number]) => {
    if (item.type === 'company' && item.targetId) {
      onSelectCompany?.(item.targetId);
    }
    onNavigate(item.action);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) {
      runCommand(filtered[selected]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Go to page, company, benchmark, or event…"
            className="flex-1 bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none"
          />
          <kbd className="text-slate-400 text-xs border border-slate-200 rounded px-1.5 py-0.5 hidden sm:block">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-slate-400 text-sm">No results found.</div>
          )}
          {filtered.map((item, i) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === selected ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
              onClick={() => runCommand(item)}
              onMouseEnter={() => setSelected(i)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-slate-800 text-sm font-medium">{item.label}</div>
                {item.subtitle && <div className="text-slate-400 text-xs truncate">{item.subtitle}</div>}
              </div>
              <span className={`flex-shrink-0 ${typeColor[item.type]}`}>
                {item.type}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-4 text-slate-400 text-xs">
          <span><kbd className="text-slate-500">↑↓</kbd> navigate</span>
          <span><kbd className="text-slate-500">Enter</kbd> go</span>
          <span><kbd className="text-slate-500">Esc</kbd> close</span>
          <span className="ml-auto">⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
