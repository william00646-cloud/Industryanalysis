import type { PageId } from '../../types/industry';
import { useLanguage } from '../../context/LanguageContext';
import { useT } from '../../i18n/translations';
import { Info } from 'lucide-react';

interface TopbarProps {
  current: PageId;
}

export function Topbar({ current }: TopbarProps) {
  const { lang, toggleLang } = useLanguage();
  const tr = useT(lang);

  const pageMap: Record<PageId, { title: string; subtitle: string }> = {
    'overview':         { title: tr.topbar('overview'),        subtitle: tr.topbar('overviewSub') },
    'industry-map':     { title: tr.topbar('industryMap'),     subtitle: tr.topbar('industryMapSub') },
    'market-structure': { title: tr.topbar('marketStructure'), subtitle: tr.topbar('marketStructureSub') },
    'value-chain':      { title: tr.topbar('valueChain'),      subtitle: tr.topbar('valueChainSub') },
    'supply-demand':    { title: tr.topbar('supplyDemand'),    subtitle: tr.topbar('supplyDemandSub') },
    'price-monitor':    { title: tr.topbar('priceMonitor'),    subtitle: tr.topbar('priceMonitorSub') },
    'company-tracker':  { title: tr.topbar('companyTracker'),  subtitle: tr.topbar('companyTrackerSub') },
    'news-monitor':     { title: tr.topbar('newsMonitor'),     subtitle: tr.topbar('newsMonitorSub') },
  };

  const { title, subtitle } = pageMap[current];

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-sm">
      <div>
        <h1 className="text-white font-semibold text-base leading-tight">{title}</h1>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-700/60 transition-colors text-xs font-semibold"
          title={lang === 'en' ? 'Switch to Traditional Chinese' : '切換為英文'}
        >
          <span className={lang === 'en' ? 'text-cyan-400' : 'text-slate-500'}>EN</span>
          <span className="text-slate-600">/</span>
          <span className={lang === 'zh' ? 'text-cyan-400' : 'text-slate-500'}>中</span>
        </button>

        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Info size={13} />
          <span className="hidden sm:inline">{tr.topbar('demo')}</span>
        </div>
      </div>
    </header>
  );
}
