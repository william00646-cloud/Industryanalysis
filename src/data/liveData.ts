import generated from './generated/liveData.json';
import type { BenchmarkRow, ScreenerCompany, TickerItem } from '../types/terminal';
import type { LiveBenchmark, LiveDataBundle, LiveTerminalData } from '../types/liveData';

export const liveData = generated as LiveDataBundle;

const benchmarkMeta: Record<string, Pick<BenchmarkRow, 'name' | 'assetClass' | 'region' | 'unit' | 'color'>> = {
  brent: { name: 'Brent Crude', assetClass: 'oil', region: 'Global', unit: '$/bbl', color: '#22d3ee' },
  wti: { name: 'WTI Crude', assetClass: 'oil', region: 'US', unit: '$/bbl', color: '#60a5fa' },
  'henry-hub': { name: 'Henry Hub', assetClass: 'gas', region: 'US', unit: '$/MMBtu', color: '#34d399' },
};

function pctChange(current?: number, previous?: number) {
  if (current == null || previous == null || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function valueAtOffset(values: number[], offset: number) {
  if (values.length === 0) return undefined;
  return values[Math.max(0, values.length - 1 - offset)];
}

function volatility(values: number[]): BenchmarkRow['volatility'] {
  if (values.length < 6) return 'Low';
  const changes = values.slice(1).map((v, i) => pctChange(v, values[i]));
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const variance = changes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changes.length;
  const stdev = Math.sqrt(variance);
  if (stdev > 2.2) return 'High';
  if (stdev > 1.1) return 'Medium';
  return 'Low';
}

function signal(changePct: number, vol: BenchmarkRow['volatility']): BenchmarkRow['signal'] {
  if (vol === 'High' && Math.abs(changePct) > 1.5) return 'Elevated';
  if (changePct > 0.75) return 'Bullish';
  if (changePct < -0.75) return 'Bearish';
  return 'Neutral';
}

function benchmarkToRow(benchmark: LiveBenchmark): BenchmarkRow | null {
  const meta = benchmarkMeta[benchmark.id];
  if (!meta || benchmark.points.length === 0) return null;
  const values = benchmark.points.map(p => p.value).filter(v => Number.isFinite(v));
  if (values.length === 0) return null;
  const price = values[values.length - 1];
  const previous = valueAtOffset(values, 1) ?? price;
  const week = valueAtOffset(values, 5) ?? previous;
  const month = valueAtOffset(values, 21) ?? week;
  const vol = volatility(values.slice(-30));
  const dailyChange = price - previous;
  const dailyChangePct = pctChange(price, previous);

  return {
    id: benchmark.id,
    ...meta,
    price,
    dailyChange,
    dailyChangePct,
    weekChange: pctChange(price, week),
    monthChange: pctChange(price, month),
    volatility: vol,
    signal: signal(dailyChangePct, vol),
    sparkline: values.slice(-12),
  };
}

function mergeBenchmarkRows(fallback: BenchmarkRow[]) {
  const liveRows = liveData.benchmarks.map(benchmarkToRow).filter(Boolean) as BenchmarkRow[];
  if (liveRows.length === 0) return fallback;
  return fallback.map(row => liveRows.find(live => live.id === row.id) ?? row);
}

function rowsToTickers(rows: BenchmarkRow[], fallback: TickerItem[]) {
  const base = fallback.map(item => {
    const row = rows.find(r => r.id === item.id);
    if (!row) return item;
    return {
      ...item,
      price: row.price,
      change: row.dailyChange,
      changePct: row.dailyChangePct,
      unit: row.unit,
      color: row.color,
    };
  });

  const brent = rows.find(r => r.id === 'brent');
  const wti = rows.find(r => r.id === 'wti');
  const hh = rows.find(r => r.id === 'henry-hub');
  const jkm = base.find(t => t.id === 'jkm');

  return base.map(item => {
    if (item.id === 'brent-wti' && brent && wti) {
      const spread = brent.price - wti.price;
      return { ...item, price: spread, change: brent.dailyChange - wti.dailyChange, changePct: pctChange(spread, item.price) };
    }
    if (item.id === 'jkm-hh' && jkm && hh) {
      const spread = jkm.price - hh.price;
      return { ...item, price: spread, change: jkm.change - hh.dailyChange, changePct: pctChange(spread, item.price) };
    }
    return item;
  });
}

function companyOverrides(): Record<string, Partial<ScreenerCompany>> {
  return liveData.companyFinancials.reduce<Record<string, Partial<ScreenerCompany>>>((acc, item) => {
    const asOfYear = Number(String(item.asOf).slice(0, 4));
    if (!Number.isFinite(asOfYear) || asOfYear < new Date().getFullYear() - 3) {
      return acc;
    }
    const updates: Partial<ScreenerCompany> = {};
    if (item.revenue) {
      const revenueM = Math.round(item.revenue / 1_000_000);
      updates.revenueM = revenueM;
      updates.revenue = revenueM >= 1000 ? `$${(revenueM / 1000).toFixed(0)}B` : `$${revenueM}M`;
    }
    if (item.operatingCashFlow) {
      updates.fcfStatus = item.operatingCashFlow > 5_000_000_000 ? 'Strong' : item.operatingCashFlow > 0 ? 'Positive' : 'Negative';
    }
    acc[item.id] = updates;
    return acc;
  }, {});
}

export function buildLiveTerminalData(fallbackTickers: TickerItem[], fallbackRows: BenchmarkRow[]): LiveTerminalData {
  const benchmarkRows = mergeBenchmarkRows(fallbackRows);
  return {
    benchmarkRows,
    tickerItems: rowsToTickers(benchmarkRows, fallbackTickers),
    companyOverrides: companyOverrides(),
  };
}

export function getDataFreshnessLabel() {
  const generated = new Date(liveData.meta.generatedAt);
  if (Number.isNaN(generated.getTime())) return 'Demo data';
  const sourceCount = liveData.sources.filter(s => s.status === 'ok').length;
  return `${liveData.meta.mode.toUpperCase()} · ${sourceCount} live source${sourceCount === 1 ? '' : 's'} · updated ${generated.toLocaleString()}`;
}
