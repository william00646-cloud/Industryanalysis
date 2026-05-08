import { tickerItems } from '../../data/terminal';
import { buildLiveTerminalData, getDataFreshnessLabel } from '../../data/liveData';
import { benchmarkRows } from '../../data/terminal';

export function TickerBar() {
  const live = buildLiveTerminalData(tickerItems, benchmarkRows);

  return (
    <div className="h-8 flex-shrink-0 bg-zinc-950 border-b border-slate-800/80 flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-3 border-r border-slate-700/60 h-full flex items-center">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">LIVE</span>
      </div>
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-none flex-1">
        {live.tickerItems.map((item, i) => {
          const isUp = item.change > 0;
          const isDown = item.change < 0;
          const changeColor = isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-slate-400';
          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 px-4 h-8 border-r border-slate-800/60 flex-shrink-0 hover:bg-slate-800/40 cursor-default transition-colors ${i === 0 ? '' : ''}`}
            >
              <span className="text-slate-300 text-xs font-semibold tracking-wide">{item.name}</span>
              <span className="text-white text-xs font-mono font-bold">{item.price.toFixed(2)}</span>
              <span className={`text-xs font-mono font-semibold ${changeColor}`}>
                {isUp ? '+' : ''}{item.change.toFixed(2)}
              </span>
              <span className={`text-xs font-mono ${changeColor}`}>
                ({isUp ? '+' : ''}{item.changePct.toFixed(2)}%)
              </span>
            </div>
          );
        })}
        <div className="px-4 text-slate-700 text-xs flex-shrink-0 italic">
          {getDataFreshnessLabel()}
        </div>
      </div>
    </div>
  );
}
