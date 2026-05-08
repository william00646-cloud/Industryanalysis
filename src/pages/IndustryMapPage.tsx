import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { IndustryMap } from '../components/industry/IndustryMap';
import { EventImpactPanel } from '../components/industry/EventImpactPanel';
import { SectionHeader } from '../components/ui/SectionHeader';

export function IndustryMapPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { valueChainSegments, impactScenarios, categoryLabels } = industry;
  const exampleScenario = impactScenarios[0];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div>
        <SectionHeader
          title={tr.page('industryMapTitle')}
          subtitle={tr.page('industryMapSub')}
          hint={tr.page('industryMapHint')}
        />
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['upstream', 'midstream', 'downstream', 'adjacent'] as const).map(cat => (
            <span key={cat} className="text-xs px-2 py-0.5 bg-slate-800/60 border border-slate-700/50 rounded-full text-slate-400">
              {categoryLabels[cat]}
            </span>
          ))}
        </div>
        <IndustryMap segments={valueChainSegments} />
      </div>

      {exampleScenario && (
        <div>
          <SectionHeader
            title={tr.page('eventImpactExample')}
            subtitle={tr.page('eventImpactSub')}
          />
          <EventImpactPanel scenario={exampleScenario} />
        </div>
      )}
    </div>
  );
}
