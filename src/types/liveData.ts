import type { BenchmarkRow, ScreenerCompany, TickerItem } from './terminal';

export type LiveDataSourceStatus = 'ok' | 'skipped' | 'error';

export interface LiveDataSourceRun {
  id: string;
  name: string;
  url: string;
  status: LiveDataSourceStatus;
  updatedAt?: string;
  message?: string;
}

export interface LiveBenchmarkPoint {
  date: string;
  value: number;
}

export interface LiveBenchmark {
  id: string;
  source: string;
  sourceSeries?: string;
  asOf: string;
  points: LiveBenchmarkPoint[];
}

export interface LiveCompanyFinancial {
  id: string;
  ticker: string;
  cik: string;
  source: string;
  asOf: string;
  revenue?: number;
  operatingCashFlow?: number;
  assets?: number;
  fiscalPeriod?: string;
}

export interface LiveNewsEvent {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  domain?: string;
  category: string;
}

export interface LiveDataBundle {
  meta: {
    generatedAt: string;
    mode: 'live' | 'partial' | 'demo';
    disclaimer: string;
  };
  sources: LiveDataSourceRun[];
  benchmarks: LiveBenchmark[];
  companyFinancials: LiveCompanyFinancial[];
  news: LiveNewsEvent[];
}

export interface LiveTerminalData {
  tickerItems: TickerItem[];
  benchmarkRows: BenchmarkRow[];
  companyOverrides: Record<string, Partial<ScreenerCompany>>;
}
