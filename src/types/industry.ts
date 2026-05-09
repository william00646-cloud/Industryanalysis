export type PageId =
  | 'overview'
  | 'industry-map'
  | 'market-structure'
  | 'value-chain'
  | 'supply-demand'
  | 'price-monitor'
  | 'company-tracker'
  | 'news-monitor';

export interface Industry {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // emoji
  totalMarketSize: number;
  currency: string;
  keyMetrics: KeyMetric[];
}

export interface KeyMetric {
  label: string;
  value: string;
  unit?: string;
  change?: number;
  description?: string;
}

export interface KeySignal {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'positive';
}

// Category labels are now flexible strings (not oil-specific)
export interface ValueChainSegment {
  id: string;
  name: string;
  nameZh?: string;
  category: 'upstream' | 'midstream' | 'downstream' | 'adjacent';
  categoryLabel?: string; // custom label, e.g. "Design" / "Manufacturing" / "Distribution"
  description: string;
  commercialNature: string;
  revenueSources: string[];
  costDrivers: string[];
  keyCapabilities: string[];
  risks: string[];
  representativeCompanies: string[];
  keyMetrics: string[];
}

export interface MarketStructureSegment {
  segment: string;
  marketSize: string;
  sharePercent: number;
  businessModel: string;
  keyRisk: string;
  color: string;
}

export interface Company {
  id: string;
  name: string;
  ticker: string;
  segment: string;
  segmentCategory: string; // flexible string for multi-industry
  marketCap: string;
  revenue: string;
  fcfStatus: string;
  businessModel: string;
  keyDrivers: string[];
  investmentLens: string;
  relatedBenchmarks: string[];
  riskFactors: string[];
}

export interface SupplyCountry {
  country: string;
  production: string;
  globalShare: string;
  trend: 'up' | 'down' | 'stable';
}

export interface DemandCountry {
  country: string;
  consumption: string;
  globalShare: string;
  trend: 'up' | 'down' | 'stable';
}

export interface SupplyDemandBalance {
  period: string;
  balance: number;
}

// Generic supply/demand tab — can be reused for any industry
export interface SupplyDemandTab {
  id: string;
  label: string;
  labelZh?: string;
  supplyLabel: string;       // e.g. "Top Producing Countries" / "Top Wafer Suppliers"
  supplyLabelZh?: string;
  demandLabel: string;       // e.g. "Top Consuming Countries" / "Top Buying Regions"
  demandLabelZh?: string;
  supplyUnit: string;        // e.g. "mb/d" / "wafer starts/month"
  demandUnit: string;
  balanceUnit: string;
  supplyRows: SupplyCountry[];
  demandRows: DemandCountry[];
  balanceData: SupplyDemandBalance[];
  inventoryNote?: string;
  interpretation: string;
}

export interface PriceBenchmark {
  id: string;
  name: string;
  region: string;
  type: string; // flexible: 'oil' | 'gas' | 'memory' | 'semiconductor' | 'drug' | etc.
  data: PriceDataPoint[];
  currentPrice: number;
  unit: string;
  color: string;
}

export interface PriceDataPoint {
  date: string;
  price: number;
}

// Spread pair for the Spread Monitor
export interface SpreadPair {
  highId: string;
  lowId: string;
  title: string;
  interpretation: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  date: string;
  category: NewsCategory;
  affectedSegments: string[];
  relatedCompanies: string[];
  whyItMatters: string;
  potentialBeneficiaries: string[];
  potentialLosers: string[];
  importance: 'High' | 'Medium' | 'Low';
  summary: string;
}

export type NewsCategory =
  | 'Geopolitics'
  | 'Supply'
  | 'Demand'
  | 'Price'
  | 'Regulation'
  | 'Company'
  | 'Technology'
  | 'Deal / Contract';

export interface ImpactScenario {
  id: string;
  title: string;
  affectedSegments: string[];
  likelyPriceImpact: string;
  beneficiaries: string[];
  losers: string[];
  metricsToMonitor: string[];
}

export interface BeneficiaryMatrix {
  event: string;
  beneficiaries: string[];
  losers: string[];
}

// Market tightness indicator
export interface TightnessIndicator {
  label: string;
  level: 'High' | 'Medium' | 'Low';
  note?: string;
}

// ─── Master bundle — one per industry ───────────────────────────────────────
export interface IndustryData {
  meta: Industry;
  keySignals: KeySignal[];
  marketStructure: MarketStructureSegment[];
  valueChainSegments: ValueChainSegment[];
  companies: Company[];
  supplyDemandTabs: SupplyDemandTab[];
  priceBenchmarks: PriceBenchmark[];
  spreadPairs: SpreadPair[];
  tightnessIndicators: TightnessIndicator[];
  priceInterpretation: string;
  newsEvents: NewsEvent[];
  impactScenarios: ImpactScenario[];
  beneficiaryMatrix: BeneficiaryMatrix[];
  categoryLabels: {
    upstream: string;
    midstream: string;
    downstream: string;
    adjacent: string;
  };
  categoryLabelsZh?: {
    upstream: string;
    midstream: string;
    downstream: string;
    adjacent: string;
  };
}
