interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  hint?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, hint, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        {hint && (
          <p className="text-slate-500 text-xs mt-1.5 italic">{hint}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
