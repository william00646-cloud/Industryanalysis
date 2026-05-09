interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  hint?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, hint, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-0.5 h-4 bg-blue-500 rounded-full" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5 ml-3">{subtitle}</p>}
        {hint && (
          <p className="text-slate-400 text-[10px] mt-1 ml-3 italic">{hint}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
