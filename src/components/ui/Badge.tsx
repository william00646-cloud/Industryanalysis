interface BadgeProps {
  label: string;
  variant?: 'default' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'blue' | 'violet' | 'gray' | string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  default: 'bg-slate-700 text-slate-300',
  cyan: 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/40',
  emerald: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40',
  rose: 'bg-rose-900/60 text-rose-300 border border-rose-700/40',
  amber: 'bg-amber-900/60 text-amber-300 border border-amber-700/40',
  blue: 'bg-blue-900/60 text-blue-300 border border-blue-700/40',
  violet: 'bg-violet-900/60 text-violet-300 border border-violet-700/40',
  gray: 'bg-slate-700/60 text-slate-400 border border-slate-600/40',
};

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
