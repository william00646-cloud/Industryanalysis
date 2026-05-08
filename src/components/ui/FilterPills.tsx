interface FilterPillsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, selected, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === opt
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-600/60 border border-slate-600/40'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
