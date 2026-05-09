import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { SupplyDemandChart } from '../components/charts/SupplyDemandChart';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Tabs } from '../components/ui/Tabs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SupplyDemandTab } from '../types/industry';

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp size={13} className="text-emerald-600" />;
  if (trend === 'down') return <TrendingDown size={13} className="text-rose-500" />;
  return <Minus size={13} className="text-slate-400" />;
};

function TabContent({ tab, tr, lang }: { tab: SupplyDemandTab; tr: ReturnType<typeof useT>; lang: 'en' | 'zh' }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="text-slate-900 font-semibold text-sm">{lang === 'zh' && tab.supplyLabelZh ? tab.supplyLabelZh : tab.supplyLabel}</h3>
            <p className="text-slate-500 text-xs">{tab.supplyUnit}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('name')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('production')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('globalShare')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {tab.supplyRows.map((row, i) => (
                <tr key={row.country} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
                  <td className="px-4 py-2.5 text-slate-700">{row.country}</td>
                  <td className="px-4 py-2.5 text-blue-600 font-semibold font-mono">{row.production}</td>
                  <td className="px-4 py-2.5 text-slate-500">{row.globalShare}</td>
                  <td className="px-4 py-2.5"><TrendIcon trend={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="text-slate-900 font-semibold text-sm">{lang === 'zh' && tab.demandLabelZh ? tab.demandLabelZh : tab.demandLabel}</h3>
            <p className="text-slate-500 text-xs">{tab.demandUnit}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('name')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('consumption')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('globalShare')}</th>
                <th className="text-left text-slate-500 font-medium px-4 py-2 text-xs">{tr.page('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {tab.demandRows.map((row, i) => (
                <tr key={row.country} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
                  <td className="px-4 py-2.5 text-slate-700">{row.country}</td>
                  <td className="px-4 py-2.5 text-emerald-600 font-semibold font-mono">{row.consumption}</td>
                  <td className="px-4 py-2.5 text-slate-500">{row.globalShare}</td>
                  <td className="px-4 py-2.5"><TrendIcon trend={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-slate-900 font-semibold text-sm mb-1">{tr.page('supplyBalance')}</h3>
        <p className="text-slate-500 text-xs mb-4">{tr.page('balanceNote')} ({tab.balanceUnit})</p>
        <SupplyDemandChart data={tab.balanceData} unit={tab.balanceUnit} />
      </div>

      {tab.inventoryNote && (
        <div className="card stat-accent-amber p-5">
          <h3 className="text-amber-700 font-semibold text-sm mb-2 uppercase tracking-wider">{tr.page('inventoryNote')}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{tab.inventoryNote}</p>
        </div>
      )}

      <div className="card stat-accent-blue p-5">
        <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('interpretation')}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{tab.interpretation}</p>
      </div>
    </div>
  );
}

export function SupplyDemandPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { supplyDemandTabs } = industry;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title={tr.page('supplyDemandTitle')}
        subtitle={tr.page('supplyDemandSub')}
        hint={tr.page('supplyDemandHint')}
      />
      <Tabs tabs={supplyDemandTabs.map(t => ({ id: t.id, label: lang === 'zh' && t.labelZh ? t.labelZh : t.label }))}>
        {(active) => {
          const tab = supplyDemandTabs.find(t => t.id === active) ?? supplyDemandTabs[0];
          return <TabContent tab={tab} tr={tr} lang={lang} />;
        }}
      </Tabs>
    </div>
  );
}
