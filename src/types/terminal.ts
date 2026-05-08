// ─── Terminal-specific types ──────────────────────────────────────────────────

export type TerminalPageId =
  | 'command-center'
  | 'market-monitor'
  | 'industry-map'
  | 'value-chain'
  | 'supply-demand'
  | 'price-spread'
  | 'company-screener'
  | 'company-workspace'
  | 'news-terminal'
  | 'event-impact'
  | 'watchlist'
  | 'research-notes';

export interface TickerItem {
  id: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  unit: string;
  color: string;
}

export interface BenchmarkRow {
  id: string;
  name: string;
  assetClass: 'oil' | 'gas' | 'spread';
  region: string;
  price: number;
  unit: string;
  dailyChange: number;
  dailyChangePct: number;
  weekChange: number;
  monthChange: number;
  volatility: 'Low' | 'Medium' | 'High';
  signal: 'Bullish' | 'Bearish' | 'Neutral' | 'Elevated';
  color: string;
  sparkline: number[];
}

export interface SpreadCard {
  id: string;
  title: string;
  highId: string;
  lowId: string;
  currentSpread: number;
  avg30d: number;
  avg1y: number;
  zScore: number;
  signal: 'Normal' | 'Elevated' | 'Extreme';
  interpretation: string;
  unit: string;
}

export interface MarketSignal {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low' | 'positive';
}

export interface PriceAlert {
  id: string;
  label: string;
  level: 'high' | 'medium' | 'low';
}

export interface ScreenerCompany {
  id: string;
  ticker: string;
  name: string;
  segment: string;
  region: string;
  marketCap: string;
  marketCapM: number; // for sorting
  revenue: string;
  revenueM: number;
  fcfStatus: 'Strong' | 'Positive' | 'Breakeven' | 'Negative';
  revenueDriver: string;
  benchmarkExposure: string;
  thesisSignal: 'Bullish' | 'Neutral' | 'Bearish';
  riskLevel: 'High' | 'Medium' | 'Low';
  businessModel: string;
  keyDrivers: string[];
  investmentLens: string;
  riskFactors: string[];
  bullCase: string[];
  baseCase: string[];
  bearCase: string[];
  peerIds: string[];
  relatedNews: string[]; // news event ids
}

export interface WatchlistCompany {
  id: string;
  ticker: string;
  name: string;
  segment: string;
  priceChange: number;
  priceChangePct: number;
  thesisSignal: 'Bullish' | 'Neutral' | 'Bearish';
  riskLevel: 'High' | 'Medium' | 'Low';
  latestEvent: string;
}

export interface WatchlistBenchmark {
  id: string;
  name: string;
  price: number;
  unit: string;
  spread?: number;
  spreadLabel?: string;
  signal: 'Normal' | 'Elevated' | 'Extreme' | 'Neutral';
  alertStatus: 'Active' | 'None';
}

export interface ResearchNote {
  id: string;
  title: string;
  type: 'Industry Thesis' | 'Company Thesis' | 'Event Note' | 'Price Signal';
  content: string;
  linkedCompany?: string;
  linkedBenchmark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactEvent {
  id: string;
  title: string;
  summary: string;
  directImpact: string;
  indirectImpact: string;
  transmissionSteps: string[];
  affectedSegments: { name: string; level: 'Direct' | 'Indirect' | 'Low' }[];
  beneficiaries: { name: string; reason: string; metrics: string }[];
  losers: { name: string; reason: string; metrics: string }[];
  monitoringChecklist: string[];
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  type: 'page' | 'company' | 'benchmark' | 'event';
  action: TerminalPageId;
  subtitle?: string;
}

export interface LiveSignal {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low' | 'positive';
}

export interface QuickAction {
  id: string;
  label: string;
  page: TerminalPageId;
  icon: string;
}
