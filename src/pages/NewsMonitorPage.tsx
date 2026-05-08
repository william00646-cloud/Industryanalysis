import { useState, useMemo } from 'react';
import { useIndustry } from '../context/IndustryContext';
import { useLanguage } from '../context/LanguageContext';
import { useT } from '../i18n/translations';
import { NewsCard } from '../components/cards/NewsCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FilterPills } from '../components/ui/FilterPills';
import { Search } from 'lucide-react';

const importanceOptions = ['All', 'High', 'Medium', 'Low'];

export function NewsMonitorPage() {
  const { industry } = useIndustry();
  const { lang } = useLanguage();
  const tr = useT(lang);
  const { newsEvents } = industry;

  const allCategories = useMemo(() => {
    const cats = [...new Set(newsEvents.map(n => n.category))];
    return ['All', ...cats] as string[];
  }, [newsEvents]);

  const [category, setCategory] = useState<string>('All');
  const [importance, setImportance] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return newsEvents.filter(n => {
      const matchCat = category === 'All' || n.category === category;
      const matchImp = importance === 'All' || n.importance === importance;
      const q = query.toLowerCase();
      const matchQuery = !q ||
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.relatedCompanies.some(c => c.toLowerCase().includes(q)) ||
        n.affectedSegments.some(s => s.toLowerCase().includes(q));
      return matchCat && matchImp && matchQuery;
    });
  }, [newsEvents, category, importance, query]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title={tr.page('newsMonitorTitle')}
        subtitle={tr.page('newsMonitorSub')}
        hint={tr.page('newsMonitorHint')}
      />

      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={tr.page('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600/60 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500/60 placeholder-slate-600"
          />
        </div>

        <div>
          <p className="text-slate-500 text-xs mb-2">{tr.page('category')}</p>
          <FilterPills options={allCategories} selected={category} onChange={setCategory} />
        </div>

        <div>
          <p className="text-slate-500 text-xs mb-2">{tr.page('importance')}</p>
          <FilterPills options={importanceOptions} selected={importance} onChange={setImportance} />
        </div>
      </div>

      <p className="text-slate-500 text-xs">
        {tr.page('showing')} {filtered.length} {tr.page('of')} {newsEvents.length} {tr.page('events')}
      </p>

      <div className="space-y-4">
        {filtered.map(n => (
          <NewsCard key={n.id} news={n} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">{tr.page('noEvents')}</div>
        )}
      </div>

      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 mt-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{tr.page('howToUse')}</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          {lang === 'en' ? (
            <>Each news card includes an analysis of which value chain segments are affected, which companies may benefit or be hurt, and why it matters for the broader industry. Use the analysis path <span className="text-cyan-400">{tr.page('analysisPathLabel')}</span> to systematically convert market events into actionable investment or strategy insights.</>
          ) : (
            <>每張新聞卡片包含對受影響價值鏈環節、潛在受益或受損公司的分析，以及其對整體產業的意義。使用 <span className="text-cyan-400">{tr.page('analysisPathLabel')}</span> 分析路徑，系統性地將市場事件轉化為可操作的投資或策略洞察。</>
          )}
        </p>
      </div>
    </div>
  );
}
