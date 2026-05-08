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
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{meta.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-900/40 border border-cyan-700/40 px-2 py-0.5 rounded-full">
                {meta.shortName}
              </span>
              <span className="text-slate-600 text-xs">{tr.page('industryCoverage')}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SectorScope</h1>
            <p className="text-slate-400 text-sm mt-0.5">{meta.description}</p>
          </div>
          <p className="text-slate-500 text-sm max-w-xs text-right hidden sm:block italic">
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
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {analysisPath.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 border border-slate-600/40">
                  <span className="text-slate-500 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-slate-200 text-sm font-medium">{step}</span>
                </div>
                {i < analysisPath.length - 1 && <ChevronRight size={16} className="text-slate-600" />}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4 italic">{tr.page('analysisPathNote')}</p>
        </div>
      </div>

      {/* Recent High-Impact News */}
      <div>
        <SectionHeader title={tr.page('highImpactEvents')} subtitle={tr.page('highImpactEventsSub')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsEvents.filter(n => n.importance === 'High').slice(0, 3).map((n) => (
            <div key={n.id} className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">{tr.page('highImpact')}</span>
                <span className="text-slate-600 text-xs ml-auto">{n.date}</span>
              </div>
              <p className="text-slate-200 text-sm font-medium leading-snug mb-2">{n.title}</p>
              <p className="text-slate-500 text-xs">{n.category}</p>
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
