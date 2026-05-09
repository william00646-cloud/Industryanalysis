import { tickerItems } from '../../data/terminal';
import { buildLiveTerminalData, getDataFreshnessLabel } from '../../data/liveData';
import { benchmarkRows } from '../../data/terminal';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function TickerBar() {
  const live = buildLiveTerminalData(tickerItems, benchmarkRows);

  // Duplicate items for seamless loop
  const items = [...live.tickerItems, ...live.tickerItems];

  return (
    <div className="h-8 flex-shrink-0 bg-white border-b border-slate-200 flex items-center overflow-hidden relative">
      {/* Left badge */}
      <div className="flex-shrink-0 px-3 border-r border-slate-200 h-full flex items-center gap-1.5 bg-blue-50 z-10">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
        </span>
        <span className="text-[10px] font-bold text-blue-600 tracking-[0.15em] uppercase">LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track">
          {items.map((item, i) => {
            const isUp = item.change > 0;
            const isDown = item.change < 0;
            const changeColor = isUp ? 'text-emerald-600' : isDown ? 'text-rose-500' : 'text-slate-400';
            const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

            return (
              <div
                key={`${item.id}-${i}`}
                className="flex items-center gap-2 px-4 h-8 border-r border-slate-100 flex-shrink-0 hover:bg-slate-50 cursor-default transition-colors group"
              >
                <span className="text-slate-500 text-[11px] font-semibold tracking-wide group-hover:text-slate-700 transition-colors">
                  {item.name}
                </span>
                <span className="text-slate-800 text-[11px] font-mono font-bold">
                  {item.price.toFixed(2)}
                </span>
                <div className={`flex items-center gap-1 ${changeColor}`}>
                  <Icon size={9} />
                  <span className="text-[10px] font-mono font-semibold">
                    {isUp ? '+' : ''}{item.change.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono opacity-75">
                    ({isUp ? '+' : ''}{item.changePct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}
