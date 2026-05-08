import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { PriceLineChart } from '../components/charts/PriceLineChart';
import { SpreadChart } from '../components/charts/SpreadChart';
import { SectionHeader } from '../components/ui/SectionHeader';

const tightnessColor: Record<string, { color: string; bg: string }> = {
  High:   { color: 'text-rose-400',    bg: 'bg-rose-900/30 border-rose-700/40' },
  Medium: { color: 'text-amber-400',   bg: 'bg-amber-900/30 border-amber-700/40' },
  Low:    { color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-700/40' },
};

export function PriceMonitorPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { priceBenchmarks, spreadPairs, tightnessIndicators, priceInterpretation } = industry;

  const types = [...new Set(priceBenchmarks.map(b => b.type))];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionHeader
        title={tr.page('priceMonitorTitle')}
        subtitle={tr.page('priceMonitorSub')}
        hint={tr.page('priceMonitorHint')}
      />

      {tightnessIndicators.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">{tr.page('tightnessMonitor')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tightnessIndicators.map(m => {
              const style = tightnessColor[m.level] ?? tightnessColor['Medium'];
              return (
                <div key={m.label} className={`rounded-xl border p-4 ${style.bg}`}>
                  <p className="text-slate-400 text-xs mb-1">{m.label}</p>
                  <p className={`text-lg font-bold ${style.color}`}>{m.level}</p>
                  {m.note && <p className="text-slate-500 text-xs mt-1">{m.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-white font-semibold text-sm mb-3">{tr.page('currentPrices')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {priceBenchmarks.map(b => (
            <div key={b.id} className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-3 text-center">
              <p className="text-slate-500 text-xs mb-1 truncate">{b.name}</p>
              <p className="font-bold text-base" style={{ color: b.color }}>{b.currentPrice}</p>
              <p className="text-slate-600 text-xs">{b.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {types.map(type => {
        const group = priceBenchmarks.filter(b => b.type === type);
        return (
          <div key={type} className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
            <h3 className="text-white font-semibold text-sm mb-1 capitalize">{type} {tr.page('benchmarks')}</h3>
            <p className="text-slate-500 text-xs mb-4">{group.map(b => b.name).join(' · ')}</p>
            <PriceLineChart benchmarks={group} />
          </div>
        );
      })}

      {spreadPairs.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">{tr.page('spreadMonitor')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spreadPairs.map(sp => {
              const hi = priceBenchmarks.find(b => b.id === sp.highId);
              const lo = priceBenchmarks.find(b => b.id === sp.lowId);
              if (!hi || !lo) return null;
              return (
                <SpreadChart
                  key={sp.title}
                  highBenchmark={hi}
                  lowBenchmark={lo}
                  title={sp.title}
                  interpretation={sp.interpretation}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('interpretation')}</p>
        <p className="text-slate-300 text-sm leading-relaxed">{priceInterpretation}</p>
      </div>
    </div>
  );
}
