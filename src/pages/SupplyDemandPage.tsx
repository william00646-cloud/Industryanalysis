import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { SupplyDemandChart } from '../components/charts/SupplyDemandChart';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Tabs } from '../components/ui/Tabs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SupplyDemandTab } from '../types/industry';

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp size={13} className="text-emerald-400" />;
  if (trend === 'down') return <TrendingDown size={13} className="text-rose-400" />;
  return <Minus size={13} className="text-slate-500" />;
};

function TabContent({ tab, tr }: { tab: SupplyDemandTab; tr: ReturnType<typeof useT> }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60">
            <h3 className="text-white font-semibold text-sm">{tab.supplyLabel}</h3>
            <p className="text-slate-500 text-xs">{tab.supplyUnit}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('name')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('production')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('globalShare')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {tab.supplyRows.map((row, i) => (
                <tr key={row.country} className={`border-b border-slate-700/40 ${i % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                  <td className="px-4 py-2.5 text-slate-200">{row.country}</td>
                  <td className="px-4 py-2.5 text-cyan-400 font-semibold">{row.production}</td>
                  <td className="px-4 py-2.5 text-slate-400">{row.globalShare}</td>
                  <td className="px-4 py-2.5"><TrendIcon trend={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60">
            <h3 className="text-white font-semibold text-sm">{tab.demandLabel}</h3>
            <p className="text-slate-500 text-xs">{tab.demandUnit}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('name')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('consumption')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('globalShare')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-2 text-xs">{tr.page('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {tab.demandRows.map((row, i) => (
                <tr key={row.country} className={`border-b border-slate-700/40 ${i % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                  <td className="px-4 py-2.5 text-slate-200">{row.country}</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-semibold">{row.consumption}</td>
                  <td className="px-4 py-2.5 text-slate-400">{row.globalShare}</td>
                  <td className="px-4 py-2.5"><TrendIcon trend={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
        <h3 className="text-white font-semibold text-sm mb-1">{tr.page('supplyBalance')}</h3>
        <p className="text-slate-500 text-xs mb-4">{tr.page('balanceNote')} ({tab.balanceUnit})</p>
        <SupplyDemandChart data={tab.balanceData} unit={tab.balanceUnit} />
      </div>

      {tab.inventoryNote && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h3 className="text-amber-400 font-semibold text-sm mb-2 uppercase tracking-wider">{tr.page('inventoryNote')}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{tab.inventoryNote}</p>
        </div>
      )}

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('interpretation')}</p>
        <p className="text-slate-300 text-sm leading-relaxed">{tab.interpretation}</p>
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
      <Tabs tabs={supplyDemandTabs.map(t => ({ id: t.id, label: t.label }))}>
        {(active) => {
          const tab = supplyDemandTabs.find(t => t.id === active) ?? supplyDemandTabs[0];
          return <TabContent tab={tab} tr={tr} />;
        }}
      </Tabs>
    </div>
  );
}
