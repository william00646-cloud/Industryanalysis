import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { MarketSizeChart } from '../components/charts/MarketSizeChart';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function MarketStructurePage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { marketStructure, meta } = industry;

  const barData = marketStructure.map(s => ({
    name: s.segment,
    value: parseFloat(s.marketSize.replace(/[^0-9.]/g, '')),
    color: s.color,
  }));

  const totalLabel = `${meta.currency}${meta.totalMarketSize >= 1000
    ? (meta.totalMarketSize / 1000).toFixed(1) + 'T'
    : meta.totalMarketSize + 'B'}`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionHeader
        title={tr.page('marketStructureTitle')}
        subtitle={`${tr.page('marketStructureSub')} ${meta.shortName}`}
        hint={tr.page('marketStructureHint')}
      />

      {/* Total */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-slate-400 text-sm mb-1">{tr.page('totalMarket')} — {meta.shortName}</p>
        <p className="text-4xl font-bold text-cyan-400">{totalLabel}</p>
        <p className="text-slate-500 text-xs mt-1">{tr.page('marketNote')}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
          <h3 className="text-white font-semibold text-sm mb-4">{tr.page('valuePools')}</h3>
          <MarketSizeChart data={marketStructure} />
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
          <h3 className="text-white font-semibold text-sm mb-4">{tr.page('marketSizeBySegment')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value: number) => [value, tr.page('marketSize')]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Table */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-4">{tr.page('segmentRanking')}</h3>
        <div className="rounded-xl border border-slate-700/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/60">
                <th className="text-left text-slate-400 font-medium px-4 py-3">{tr.page('segment')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">{tr.page('marketSize')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">{tr.page('share')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3 hidden md:table-cell">{tr.page('businessModel')}</th>
                <th className="text-left text-slate-400 font-medium px-4 py-3 hidden lg:table-cell">{tr.page('keyRisk')}</th>
              </tr>
            </thead>
            <tbody>
              {marketStructure.map((row, i) => (
                <tr key={row.segment} className={`border-b border-slate-700/40 ${i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: row.color }} />
                      <span className="text-slate-200 font-medium">{row.segment}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cyan-400 font-semibold">{row.marketSize}</td>
                  <td className="px-4 py-3 text-slate-300">{row.sharePercent}%</td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell text-xs max-w-xs">{row.businessModel.slice(0, 80)}…</td>
                  <td className="px-4 py-3 text-rose-400 hidden lg:table-cell text-xs max-w-xs">{row.keyRisk.slice(0, 60)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
