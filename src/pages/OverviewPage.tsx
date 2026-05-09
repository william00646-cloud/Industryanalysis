import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { MetricCard } from '../components/cards/MetricCard';
import { InsightCard } from '../components/cards/InsightCard';
import { CompanyCard } from '../components/cards/CompanyCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ChevronRight } from 'lucide-react';
import type { PageId } from '../types/industry';

const accents = ['cyan', 'emerald', 'blue', 'amber', 'rose', 'cyan'] as const;

const analysisPathEn = ['News Event', 'Market Structure', 'Value Chain', 'Supply & Demand', 'Price Signal', 'Company Thesis'];
const analysisPathZh = ['新聞事件', '市場結構', '價值鏈', '供需分析', '價格訊號', '公司論點'];

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
}

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { meta, keySignals, companies, newsEvents } = industry;

  const analysisPath = lang === 'en' ? analysisPathEn : analysisPathZh;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-xl border border-slate-700/40 bg-slate-900/50 p-6 overflow-hidden card-accent-cyan">
        {/* Background grid accent */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{meta.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-1 rounded-full font-mono shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                {meta.shortName}
              </span>
              <span className="text-slate-600 text-[10px] font-mono">{tr.page('industryCoverage')}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SectorScope</h1>
            <p className="text-slate-400 text-sm mt-1">{meta.description}</p>
          </div>
          <p className="text-slate-600 text-xs max-w-xs text-right hidden sm:block font-mono leading-relaxed">
            {lang === 'en'
              ? 'From market structure to company-level investment signals.'
              : '從市場結構到公司層級的投資訊號。'}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <SectionHeader
          title={tr.page('keyMetrics')}
          subtitle={`${tr.page('keyMetricsSub')} — ${meta.shortName}`}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {meta.keyMetrics.map((m, i) => (
            <MetricCard
              key={m.label}
              title={m.label}
              value={m.value}
              description={m.description}
              accent={accents[i % accents.length]}
            />
          ))}
        </div>
      </div>

      {/* Three Key Signals */}
      <div>
        <SectionHeader
          title={tr.page('threeSignals')}
          subtitle={tr.page('threeSignalsSub')}
          hint={tr.page('threeSignalsHint')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keySignals.slice(0, 3).map((s, i) => (
            <InsightCard key={i} title={s.title} description={s.description} severity={s.severity} index={i} />
          ))}
        </div>
      </div>

      {/* Analysis Path */}
      <div>
        <SectionHeader
          title={tr.page('analysisPath')}
          subtitle={tr.page('analysisPathSub')}
        />
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 overflow-hidden relative card-accent-cyan">
          <div className="flex flex-wrap items-center gap-2">
            {analysisPath.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 hover:border-slate-600/60 transition-colors cursor-default group">
                  <span className="text-cyan-600 text-[10px] font-mono font-bold group-hover:text-cyan-400 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-300 text-xs font-medium">{step}</span>
                </div>
                {i < analysisPath.length - 1 && (
                  <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-[10px] mt-4 font-mono italic">{tr.page('analysisPathNote')}</p>
        </div>
      </div>

      {/* Recent High-Impact News */}
      <div>
        <SectionHeader title={tr.page('highImpactEvents')} subtitle={tr.page('highImpactEventsSub')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsEvents.filter(n => n.importance === 'High').slice(0, 3).map((n) => (
            <div key={n.id} className="relative rounded-xl border border-rose-800/30 bg-rose-950/15 p-4 overflow-hidden card-hover card-accent-rose">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.15em] font-mono">{tr.page('highImpact')}</span>
                <span className="text-slate-600 text-[10px] font-mono ml-auto">{n.date}</span>
              </div>
              <p className="text-slate-200 text-sm font-medium leading-snug mb-2">{n.title}</p>
              <span className="text-slate-600 text-[10px] font-mono uppercase tracking-wider">{n.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Companies to Watch */}
      <div>
        <SectionHeader title={tr.page('companiesToWatch')} subtitle={tr.page('companiesToWatchSub')} />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {companies.map((c) => (
            <CompanyCard
              key={c.id}
              company={c}
              onClick={() => onNavigate('company-tracker')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
