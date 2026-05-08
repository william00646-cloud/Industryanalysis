import { useState } from 'react';
import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import type { Company } from '../types/industry';
import { CompanyCard } from '../components/cards/CompanyCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FilterPills } from '../components/ui/FilterPills';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

function CompanyDetailPanel({
  company,
  onClose,
  tr,
}: {
  company: Company;
  onClose: () => void;
  tr: ReturnType<typeof useT>;
}) {
  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-800/60 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-white font-bold text-lg">{company.name}</h3>
            <Badge label={company.ticker} variant="cyan" size="md" />
          </div>
          <p className="text-slate-400 text-sm">{company.segment}</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: tr.page('marketCap'), value: company.marketCap },
          { label: tr.page('revenue'), value: company.revenue },
          { label: tr.page('fcfStatus'), value: company.fcfStatus },
        ].map(m => (
          <div key={m.label} className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-slate-500 text-xs mb-0.5">{m.label}</p>
            <p className="text-slate-200 text-sm font-medium">{m.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{tr.page('businessModel')}</p>
        <p className="text-slate-300 text-sm leading-relaxed">{company.businessModel}</p>
      </div>

      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('keyDrivers')}</p>
        <div className="flex flex-wrap gap-1.5">
          {company.keyDrivers.map(d => <Badge key={d} label={d} variant="blue" />)}
        </div>
      </div>

      <div className="p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={13} className="text-emerald-400" />
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{tr.page('investmentThesis')}</p>
        </div>
        <p className="text-emerald-300 text-sm leading-relaxed">{company.investmentLens}</p>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingDown size={13} className="text-rose-400" />
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">{tr.page('riskFactors')}</p>
        </div>
        <ul className="space-y-1">
          {company.riskFactors.map(r => (
            <li key={r} className="text-rose-300 text-xs">• {r}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('relatedBenchmarks')}</p>
        <div className="flex flex-wrap gap-1.5">
          {company.relatedBenchmarks.map(b => <Badge key={b} label={b} variant="amber" />)}
        </div>
      </div>
    </div>
  );
}

export function CompanyTrackerPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { companies, beneficiaryMatrix } = industry;

  const categories = ['All', ...new Set(companies.map(c => c.segmentCategory))];
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Company | null>(null);

  const filtered = companies.filter(c => {
    if (filter === 'All') return true;
    return c.segmentCategory === filter || c.segment.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionHeader
        title={tr.page('companyTrackerTitle')}
        subtitle={tr.page('companyTrackerSub')}
        hint={tr.page('companyTrackerHint')}
      />

      <FilterPills options={categories} selected={filter} onChange={setFilter} />

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(c => (
              <CompanyCard
                key={c.id}
                company={c}
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                isSelected={selected?.id === c.id}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">{tr.page('noCompanies')}</div>
          )}
        </div>

        {selected && (
          <div className="xl:w-96 flex-shrink-0">
            <CompanyDetailPanel company={selected} onClose={() => setSelected(null)} tr={tr} />
          </div>
        )}
      </div>

      <div>
        <SectionHeader
          title={tr.page('beneficiaryMatrix')}
          subtitle={tr.page('beneficiaryMatrixSub')}
        />
        <div className="space-y-4">
          {beneficiaryMatrix.map(row => (
            <div key={row.event} className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
              <h3 className="text-white font-semibold text-sm mb-4">{tr.page('event')}: {row.event}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp size={13} className="text-emerald-400" />
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{tr.page('beneficiaries')}</p>
                  </div>
                  <ul className="space-y-1">
                    {row.beneficiaries.map(b => (
                      <li key={b} className="text-emerald-300 text-sm">• {b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown size={13} className="text-rose-400" />
                    <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">{tr.page('losers')}</p>
                  </div>
                  <ul className="space-y-1">
                    {row.losers.map(l => (
                      <li key={l} className="text-rose-300 text-sm">• {l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
