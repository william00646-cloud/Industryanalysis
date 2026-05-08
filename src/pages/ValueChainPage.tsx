import { useState } from 'react';
import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { ValueChainFlow } from '../components/industry/ValueChainFlow';
import { EventImpactPanel } from '../components/industry/EventImpactPanel';
import { SectionHeader } from '../components/ui/SectionHeader';

export function ValueChainPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { valueChainSegments, impactScenarios } = industry;

  const [scenarioId, setScenarioId] = useState(impactScenarios[0]?.id ?? '');
  const scenario = impactScenarios.find(s => s.id === scenarioId) ?? impactScenarios[0];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div>
        <SectionHeader
          title={tr.page('valueChainTitle')}
          subtitle={tr.page('valueChainSub')}
          hint={tr.page('valueChainHint')}
        />
        <ValueChainFlow segments={valueChainSegments} defaultSelectedId={valueChainSegments[0]?.id} />
      </div>

      {impactScenarios.length > 0 && (
        <div>
          <SectionHeader
            title={tr.page('shockAnalysis')}
            subtitle={tr.page('shockAnalysisSub')}
          />
          <div className="mb-4">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
              {tr.page('selectScenario')}
            </label>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              className="bg-slate-800 border border-slate-600/60 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/60 w-full max-w-md"
            >
              {impactScenarios.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          {scenario && <EventImpactPanel scenario={scenario} />}
        </div>
      )}
    </div>
  );
}
