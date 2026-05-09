/**
 * Demo data for product prototype.
 * Not real-time financial data. All values are illustrative.
 */

import type {
  TickerItem,
  BenchmarkRow,
  SpreadCard,
  MarketSignal,
  PriceAlert,
  ScreenerCompany,
  WatchlistCompany,
  WatchlistBenchmark,
  ResearchNote,
  ImpactEvent,
  CommandPaletteItem,
  LiveSignal,
} from '../types/terminal';

// ─── Ticker Bar ───────────────────────────────────────────────────────────────

export const tickerItems: TickerItem[] = [
  { id: 'brent',       name: 'Brent',        price: 84.20,  change: +1.35, changePct: +1.63, unit: '$/bbl',   color: '#22d3ee' },
  { id: 'wti',         name: 'WTI',          price: 79.80,  change: +1.10, changePct: +1.40, unit: '$/bbl',   color: '#60a5fa' },
  { id: 'dubai',       name: 'Dubai',        price: 83.10,  change: +0.90, changePct: +1.09, unit: '$/bbl',   color: '#a78bfa' },
  { id: 'jkm',         name: 'JKM',          price: 14.20,  change: +0.45, changePct: +3.27, unit: '$/MMBtu', color: '#f59e0b' },
  { id: 'ttf',         name: 'TTF',          price: 10.85,  change: +0.20, changePct: +1.88, unit: '$/MMBtu', color: '#fb923c' },
  { id: 'henry-hub',   name: 'Henry Hub',    price: 2.85,   change: -0.05, changePct: -1.72, unit: '$/MMBtu', color: '#34d399' },
  { id: 'jkm-hh',      name: 'JKM−HH',       price: 11.35,  change: +0.50, changePct: +4.61, unit: '$/MMBtu', color: '#f43f5e' },
  { id: 'brent-wti',   name: 'Brent−WTI',    price: 4.40,   change: +0.25, changePct: +6.02, unit: '$/bbl',  color: '#e879f9' },
];

// ─── Market Monitor Benchmark Table ──────────────────────────────────────────

function spark(base: number, len = 12): number[] {
  const s: number[] = [base];
  for (let i = 1; i < len; i++) {
    s.push(+(s[i - 1] + (Math.random() - 0.48) * base * 0.03).toFixed(2));
  }
  return s;
}

export const benchmarkRows: BenchmarkRow[] = [
  {
    id: 'brent', name: 'Brent Crude', assetClass: 'oil', region: 'Global',
    price: 84.20, unit: '$/bbl', dailyChange: 1.35, dailyChangePct: 1.63,
    weekChange: 2.8, monthChange: -1.2, volatility: 'Medium', signal: 'Bullish',
    color: '#22d3ee', sparkline: spark(84),
  },
  {
    id: 'wti', name: 'WTI Crude', assetClass: 'oil', region: 'US',
    price: 79.80, unit: '$/bbl', dailyChange: 1.10, dailyChangePct: 1.40,
    weekChange: 2.4, monthChange: -1.8, volatility: 'Medium', signal: 'Bullish',
    color: '#60a5fa', sparkline: spark(80),
  },
  {
    id: 'dubai', name: 'Dubai Crude', assetClass: 'oil', region: 'Middle East',
    price: 83.10, unit: '$/bbl', dailyChange: 0.90, dailyChangePct: 1.09,
    weekChange: 1.9, monthChange: -0.8, volatility: 'Low', signal: 'Neutral',
    color: '#a78bfa', sparkline: spark(83),
  },
  {
    id: 'wcs', name: 'WCS (Canadian)', assetClass: 'oil', region: 'Canada',
    price: 63.50, unit: '$/bbl', dailyChange: 0.60, dailyChangePct: 0.95,
    weekChange: 1.2, monthChange: -3.1, volatility: 'Medium', signal: 'Neutral',
    color: '#94a3b8', sparkline: spark(63),
  },
  {
    id: 'urals', name: 'Urals', assetClass: 'oil', region: 'Russia',
    price: 67.40, unit: '$/bbl', dailyChange: 0.30, dailyChangePct: 0.45,
    weekChange: 0.8, monthChange: -2.4, volatility: 'High', signal: 'Bearish',
    color: '#f87171', sparkline: spark(67),
  },
  {
    id: 'jkm', name: 'JKM (Asian LNG)', assetClass: 'gas', region: 'Asia Pacific',
    price: 14.20, unit: '$/MMBtu', dailyChange: 0.45, dailyChangePct: 3.27,
    weekChange: 6.2, monthChange: 12.4, volatility: 'High', signal: 'Elevated',
    color: '#f59e0b', sparkline: spark(14),
  },
  {
    id: 'ttf', name: 'TTF (European Gas)', assetClass: 'gas', region: 'Europe',
    price: 10.85, unit: '$/MMBtu', dailyChange: 0.20, dailyChangePct: 1.88,
    weekChange: 3.1, monthChange: 5.2, volatility: 'High', signal: 'Elevated',
    color: '#fb923c', sparkline: spark(10.85),
  },
  {
    id: 'henry-hub', name: 'Henry Hub', assetClass: 'gas', region: 'US',
    price: 2.85, unit: '$/MMBtu', dailyChange: -0.05, dailyChangePct: -1.72,
    weekChange: -2.1, monthChange: -8.3, volatility: 'Medium', signal: 'Bearish',
    color: '#34d399', sparkline: spark(2.85),
  },
];

// ─── Spread Cards ─────────────────────────────────────────────────────────────

export const spreadCards: SpreadCard[] = [
  {
    id: 'jkm-hh',
    title: 'JKM − Henry Hub',
    highId: 'jkm', lowId: 'henry-hub',
    currentSpread: 11.35, avg30d: 10.20, avg1y: 8.60,
    zScore: 1.82, signal: 'Elevated', unit: '$/MMBtu',
    interpretation: 'Asian buyers are paying a significant premium vs US gas. Wide spread signals tight LNG supply in Asia and strong economics for US LNG exporters. Key to monitor for Cheniere and LNG shipping.',
  },
  {
    id: 'ttf-hh',
    title: 'TTF − Henry Hub',
    highId: 'ttf', lowId: 'henry-hub',
    currentSpread: 8.00, avg30d: 7.10, avg1y: 6.20,
    zScore: 1.21, signal: 'Elevated', unit: '$/MMBtu',
    interpretation: 'European gas markets remain stressed vs US. Reflects ongoing infrastructure gaps and geopolitical supply uncertainty. Monitor for European energy security trends.',
  },
  {
    id: 'brent-wti',
    title: 'Brent − WTI',
    highId: 'brent', lowId: 'wti',
    currentSpread: 4.40, avg30d: 3.80, avg1y: 3.20,
    zScore: 0.95, signal: 'Normal', unit: '$/bbl',
    interpretation: 'Slightly above average. Wider spread favors US crude exports. Narrow spread historically reduces export incentives. Linked to Cushing inventory and Gulf Coast logistics.',
  },
  {
    id: 'dubai-brent',
    title: 'Dubai − Brent',
    highId: 'dubai', lowId: 'brent',
    currentSpread: -1.10, avg30d: -1.40, avg1y: -1.80,
    zScore: 0.52, signal: 'Normal', unit: '$/bbl',
    interpretation: 'Dubai discount to Brent narrowing. Signals stronger Middle Eastern demand or tighter sour crude supply. Relevant for Asian refinery margins.',
  },
];

// ─── Market Tightness ─────────────────────────────────────────────────────────

export const marketTightnessMap = [
  { label: 'Asia LNG', level: 'High' as const,   note: 'JKM at multi-month high' },
  { label: 'Europe Gas', level: 'Medium' as const, note: 'Storage adequate but tight' },
  { label: 'US Gas', level: 'Low' as const,      note: 'Surplus persists' },
  { label: 'Global Oil', level: 'Medium' as const, note: 'OPEC+ cut still in effect' },
  { label: 'Refining', level: 'Medium' as const,  note: 'Crack spreads normalizing' },
];

// ─── Market Signals ───────────────────────────────────────────────────────────

export const marketSignals: MarketSignal[] = [
  { id: 's1', label: 'JKM-Henry Hub spread elevated above 1Y average', severity: 'high' },
  { id: 's2', label: 'LNG long-term contract activity increasing', severity: 'medium' },
  { id: 's3', label: 'Midstream chokepoint risk remains elevated', severity: 'high' },
  { id: 's4', label: 'Asian buyers securing multi-year supply contracts', severity: 'medium' },
  { id: 's5', label: 'Refining margins sensitive to outage events', severity: 'medium' },
  { id: 's6', label: 'Henry Hub under pressure from US supply surplus', severity: 'low' },
];

export const priceAlerts: PriceAlert[] = [
  { id: 'a1', label: 'JKM-HH spread above 1Y average (+32%)', level: 'high' },
  { id: 'a2', label: 'Asia LNG market stress level elevated', level: 'high' },
  { id: 'a3', label: 'Brent-WTI spread widening toward 1Y high', level: 'medium' },
  { id: 'a4', label: 'Henry Hub 1M change: −8.3% — bearish signal', level: 'medium' },
];

export const liveSignals: LiveSignal[] = [
  { id: 'ls1', label: 'JKM−HH spread: Elevated (+32% vs 1Y avg)', severity: 'high' },
  { id: 'ls2', label: 'Asia LNG: Market stress HIGH', severity: 'high' },
  { id: 'ls3', label: 'Midstream chokepoint risk: Rising', severity: 'high' },
  { id: 'ls4', label: 'LNG long-term contracts: Active', severity: 'medium' },
  { id: 'ls5', label: 'Henry Hub: Bearish — surplus persists', severity: 'low' },
];

// ─── Company Screener Universe ────────────────────────────────────────────────

export const screenerCompanies: ScreenerCompany[] = [
  {
    id: 'lng', ticker: 'LNG', name: 'Cheniere Energy',
    segment: 'Midstream / LNG', region: 'US',
    marketCap: '$44B', marketCapM: 44000,
    revenue: '$20B', revenueM: 20000,
    fcfStatus: 'Strong', revenueDriver: 'LNG export tolling fees + commodity sales',
    benchmarkExposure: 'JKM-Henry Hub spread', thesisSignal: 'Bullish', riskLevel: 'Medium',
    businessModel: 'Cheniere operates the Sabine Pass and Corpus Christi LNG export terminals in the US. Revenue comes from long-term tolling contracts (fixed fee per MMBtu) and commodity marketing. The company benefits when JKM-Henry Hub spreads are wide, as it makes US LNG exports highly competitive.',
    keyDrivers: ['JKM-Henry Hub spread', 'LNG export capacity utilization', 'Long-term contract coverage', 'Henry Hub feedgas cost'],
    investmentLens: 'Primary beneficiary of structural LNG export demand growth. Strong free cash flow from contracted volumes provides stability even in volatile markets.',
    riskFactors: ['New LNG capacity additions could compress spreads', 'Regulatory risk on export approvals', 'Feedgas supply disruptions', 'Global LNG demand slowdown'],
    bullCase: ['Global LNG shortage persists through 2026', 'JKM-HH spread remains elevated', 'Long-term contracts improve revenue visibility', 'US gas cost advantage supports export economics'],
    baseCase: ['LNG demand remains structurally supported by Asia + Europe transition', 'Contracted volumes provide stable cash flow', 'Price volatility affects sentiment but not all revenue'],
    bearCase: ['Global LNG capacity expands faster than demand', 'Spreads normalize to historical range', 'Regulatory or project execution risks increase'],
    peerIds: ['shel', 'xom', 'cvx', 'kmi'],
    relatedNews: ['n1', 'n2', 'n4'],
  },
  {
    id: 'xom', ticker: 'XOM', name: 'ExxonMobil',
    segment: 'Integrated Oil & Gas', region: 'US',
    marketCap: '$430B', marketCapM: 430000,
    revenue: '$398B', revenueM: 398000,
    fcfStatus: 'Strong', revenueDriver: 'Upstream production + integrated margins',
    benchmarkExposure: 'Brent, WTI', thesisSignal: 'Neutral', riskLevel: 'Low',
    businessModel: 'ExxonMobil is the largest US integrated oil company with operations across upstream, downstream, chemicals, and specialty products. Revenue is driven by oil and gas production and refining margins.',
    keyDrivers: ['Brent price', 'Upstream production volume', 'Refining crack spreads', 'Chemical margins'],
    investmentLens: 'Defensive integrated major with strong dividend coverage. Low-cost production base and diversified business model provides resilience across commodity cycles.',
    riskFactors: ['Commodity price exposure', 'Energy transition risk', 'Capital intensity of new projects', 'Geopolitical risk in key operating regions'],
    bullCase: ['Brent remains above $80', 'Pioneer acquisition synergies materialize', 'Chemicals cycle recovery', 'Guyana production ramp-up'],
    baseCase: ['Steady upstream production growth', 'Moderate oil prices support returns', 'Dividend growth continues'],
    bearCase: ['Energy transition accelerates demand destruction', 'Brent falls below $70', 'Stranded asset risk grows'],
    peerIds: ['cvx', 'shel', 'bp', 'tte'],
    relatedNews: ['n3'],
  },
  {
    id: 'cvx', ticker: 'CVX', name: 'Chevron',
    segment: 'Integrated Oil & Gas', region: 'US',
    marketCap: '$295B', marketCapM: 295000,
    revenue: '$200B', revenueM: 200000,
    fcfStatus: 'Strong', revenueDriver: 'Upstream production + LNG exposure (Australia)',
    benchmarkExposure: 'Brent, WTI, JKM', thesisSignal: 'Neutral', riskLevel: 'Low',
    businessModel: 'Chevron is a major integrated oil company with significant upstream exposure in the Permian Basin, Gulf of Mexico, and Australia LNG (Gorgon, Wheatstone). Revenue is heavily linked to oil and gas production volumes and commodity prices.',
    keyDrivers: ['Brent/WTI price', 'Permian production growth', 'Australia LNG production', 'Refining margins'],
    investmentLens: 'Permian + Australia LNG combination makes Chevron uniquely exposed to both oil and global gas markets. Strong balance sheet and shareholder return program.',
    riskFactors: ['Commodity price cycle', 'Permian cost inflation', 'Australia LNG production reliability', 'Hess acquisition integration'],
    bullCase: ['Permian ramp-up ahead of schedule', 'Australia LNG benefits from Asian demand', 'Strong capital return program'],
    baseCase: ['Steady production growth with disciplined capital allocation', 'Moderate commodity prices support returns'],
    bearCase: ['Cost overruns in major projects', 'Oil demand peak earlier than expected'],
    peerIds: ['xom', 'shel', 'bp', 'tte'],
    relatedNews: ['n3'],
  },
  {
    id: 'shel', ticker: 'SHEL', name: 'Shell',
    segment: 'Integrated Oil & Gas', region: 'Europe',
    marketCap: '$220B', marketCapM: 220000,
    revenue: '$317B', revenueM: 317000,
    fcfStatus: 'Strong', revenueDriver: 'Integrated gas + upstream + trading',
    benchmarkExposure: 'Brent, JKM, TTF', thesisSignal: 'Bullish', riskLevel: 'Low',
    businessModel: 'Shell has the largest global LNG portfolio of any major, combined with upstream oil production and a world-class commodity trading operation. The integrated gas segment benefits from wide regional gas spreads.',
    keyDrivers: ['Global LNG spreads', 'Brent price', 'Trading performance', 'LNG contract pricing'],
    investmentLens: 'Best-in-class LNG exposure among the majors. Trading capability allows Shell to capture spread opportunities that pure-play upstream producers cannot.',
    riskFactors: ['LNG market oversupply risk', 'Project execution risk', 'ESG regulatory pressure', 'Trading volatility'],
    bullCase: ['LNG spreads remain wide', 'Trading captures regional arbitrage', 'Transition fuel demand growth'],
    baseCase: ['Stable LNG portfolio generates strong cash flow', 'Disciplined capital allocation'],
    bearCase: ['LNG market oversupply compresses margins', 'Stranded asset risk in long-dated LNG contracts'],
    peerIds: ['xom', 'cvx', 'bp', 'tte'],
    relatedNews: ['n1', 'n2'],
  },
  {
    id: 'bp', ticker: 'BP', name: 'BP',
    segment: 'Integrated Oil & Gas', region: 'Europe',
    marketCap: '$100B', marketCapM: 100000,
    revenue: '$214B', revenueM: 214000,
    fcfStatus: 'Positive', revenueDriver: 'Upstream production + transition investments',
    benchmarkExposure: 'Brent, TTF', thesisSignal: 'Neutral', riskLevel: 'Medium',
    businessModel: 'BP is restructuring toward lower-carbon energy while maintaining upstream oil and gas operations. The company has been reducing oil production targets and investing in renewables, creating execution uncertainty.',
    keyDrivers: ['Brent price', 'Upstream production volume', 'Renewables execution', 'Debt reduction progress'],
    investmentLens: 'Turnaround story with significant execution risk. Strategy pivot toward transition creates uncertainty but potential upside if energy transition accelerates.',
    riskFactors: ['Strategy uncertainty', 'Higher leverage vs peers', 'Renewables execution risk', 'Oil exposure reduction reducing upside'],
    bullCase: ['Strategy clarification restores investor confidence', 'High oil prices boost cash flow for debt reduction'],
    baseCase: ['Gradual debt reduction with maintained dividend'],
    bearCase: ['Transition strategy requires more capital than expected', 'Oil prices fall, limiting cash generation'],
    peerIds: ['xom', 'cvx', 'shel', 'tte'],
    relatedNews: ['n3'],
  },
  {
    id: 'tte', ticker: 'TTE', name: 'TotalEnergies',
    segment: 'Integrated Oil & Gas', region: 'Europe',
    marketCap: '$160B', marketCapM: 160000,
    revenue: '$218B', revenueM: 218000,
    fcfStatus: 'Strong', revenueDriver: 'Integrated oil & gas + growing LNG + renewables',
    benchmarkExposure: 'Brent, JKM, TTF', thesisSignal: 'Neutral', riskLevel: 'Low',
    businessModel: 'TotalEnergies pursues a multi-energy strategy with investments in LNG (Qatar, Mozambique, US), upstream oil, and renewables. The company balances transition risk while maintaining strong hydrocarbon cash flows.',
    keyDrivers: ['Brent/gas price', 'LNG portfolio growth', 'Renewables expansion', 'Dividend sustainability'],
    investmentLens: 'Best-positioned major for the energy transition with strong LNG growth pipeline. Qatar LNG expansion is a key long-term growth driver.',
    riskFactors: ['Mozambique LNG project delays', 'Renewables return uncertainty', 'Geopolitical risk in key regions'],
    bullCase: ['Qatar LNG expansion accelerates revenue growth', 'LNG spreads remain wide', 'Renewables generate higher returns than expected'],
    baseCase: ['Steady growth across integrated business', 'Strong dividend maintained'],
    bearCase: ['LNG project delays reduce growth potential'],
    peerIds: ['xom', 'cvx', 'shel', 'bp'],
    relatedNews: ['n2'],
  },
  {
    id: 'vlo', ticker: 'VLO', name: 'Valero Energy',
    segment: 'Refining', region: 'US',
    marketCap: '$50B', marketCapM: 50000,
    revenue: '$140B', revenueM: 140000,
    fcfStatus: 'Strong', revenueDriver: 'Refining crack spreads + feedstock optimization',
    benchmarkExposure: 'Brent-WTI spread, crack spreads', thesisSignal: 'Neutral', riskLevel: 'Medium',
    businessModel: 'Valero is the largest independent refiner in the US. Revenue is driven by refining margins (crack spreads) and the difference between crude input costs and refined product prices.',
    keyDrivers: ['Crack spreads', 'Brent-WTI differential', 'Refined product demand', 'Feedstock optimization'],
    investmentLens: 'Pure-play refining exposure with world-class cost positioning. Benefits from wide WTI-Brent discount and strong domestic refined product demand.',
    riskFactors: ['Crack spread compression', 'EV adoption reducing gasoline demand long-term', 'Refinery downtime', 'Environmental regulation'],
    bullCase: ['Crack spreads remain elevated', 'Low crude input cost advantage', 'Strong shareholder returns'],
    baseCase: ['Normalized crack spreads with steady throughput'],
    bearCase: ['Demand destruction from EVs accelerates', 'Crack spreads compress to 5Y lows'],
    peerIds: ['mpc', 'xom', 'cvx'],
    relatedNews: ['n5'],
  },
  {
    id: 'mpc', ticker: 'MPC', name: 'Marathon Petroleum',
    segment: 'Refining', region: 'US',
    marketCap: '$65B', marketCapM: 65000,
    revenue: '$156B', revenueM: 156000,
    fcfStatus: 'Strong', revenueDriver: 'Refining margins + MPLX MLP distributions',
    benchmarkExposure: 'Crack spreads, Brent-WTI', thesisSignal: 'Neutral', riskLevel: 'Medium',
    businessModel: 'Marathon Petroleum is one of the largest US refiners with significant midstream assets through its MPLX partnership. The combination provides both refining margin exposure and fee-based pipeline income.',
    keyDrivers: ['Crack spreads', 'MPLX distribution growth', 'Refinery utilization rates', 'Crude oil cost optimization'],
    investmentLens: 'Refiner + MLP combination provides a mix of commodity and fee-based income. MPLX provides earnings stability that pure refiners lack.',
    riskFactors: ['Crack spread volatility', 'Refinery outage risk', 'Midstream regulatory risk', 'Long-term demand headwinds'],
    bullCase: ['Strong crack spreads + MPLX growth', 'Capital return program accelerated'],
    baseCase: ['Steady throughput with normalized margins'],
    bearCase: ['Crack spread compression + MLP regulatory risk'],
    peerIds: ['vlo', 'xom'],
    relatedNews: ['n5'],
  },
  {
    id: 'slb', ticker: 'SLB', name: 'SLB (Schlumberger)',
    segment: 'Oilfield Services', region: 'Global',
    marketCap: '$68B', marketCapM: 68000,
    revenue: '$34B', revenueM: 34000,
    fcfStatus: 'Strong', revenueDriver: 'Drilling services + completion + digital',
    benchmarkExposure: 'Brent (capex cycle indicator)', thesisSignal: 'Bullish', riskLevel: 'Medium',
    businessModel: 'SLB is the world\'s largest oilfield services company providing technology, information solutions, and integrated project management. Revenue is driven by exploration and production capex cycles.',
    keyDrivers: ['E&P capex spending', 'International rig activity', 'Digital / AI services adoption', 'Brent price support for upstream investment'],
    investmentLens: 'Leveraged to a multi-year international upstream capex cycle. Digital and AI services add a higher-margin recurring revenue stream that reduces commodity cyclicality.',
    riskFactors: ['E&P capex cuts if oil prices fall', 'Geopolitical exposure in key markets', 'Competition from Halliburton and Baker Hughes'],
    bullCase: ['International upstream capex supercycle continues', 'Digital services accelerate margin expansion'],
    baseCase: ['Steady international activity with gradual margin improvement'],
    bearCase: ['Oil price fall triggers capex cuts across customer base'],
    peerIds: ['hal', 'xom', 'cvx'],
    relatedNews: ['n6'],
  },
  {
    id: 'hal', ticker: 'HAL', name: 'Halliburton',
    segment: 'Oilfield Services', region: 'US / Global',
    marketCap: '$32B', marketCapM: 32000,
    revenue: '$23B', revenueM: 23000,
    fcfStatus: 'Positive', revenueDriver: 'Completion services + North America drilling',
    benchmarkExposure: 'WTI (NA capex indicator)', thesisSignal: 'Neutral', riskLevel: 'Medium',
    businessModel: 'Halliburton is the second-largest oilfield services company with particular strength in North America completion services (fracking). More exposed to US shale market than SLB.',
    keyDrivers: ['North America rig count', 'WTI price', 'US shale producer capex', 'International expansion'],
    investmentLens: 'North America-focused with higher beta to US shale cycle. Margin improvement potential if international expansion continues.',
    riskFactors: ['US shale capex volatility', 'North America pricing pressure', 'Technology competition'],
    bullCase: ['US activity re-accelerates', 'International growth outperforms expectations'],
    baseCase: ['Steady North America with gradual international growth'],
    bearCase: ['US shale capex cuts on WTI weakness'],
    peerIds: ['slb'],
    relatedNews: ['n6'],
  },
  {
    id: 'rig', ticker: 'RIG', name: 'Transocean',
    segment: 'Offshore Drilling', region: 'Global',
    marketCap: '$4B', marketCapM: 4000,
    revenue: '$3.5B', revenueM: 3500,
    fcfStatus: 'Breakeven', revenueDriver: 'Deepwater drilling day rates',
    benchmarkExposure: 'Brent (deepwater investment threshold)', thesisSignal: 'Neutral', riskLevel: 'High',
    businessModel: 'Transocean operates ultra-deepwater and harsh-environment drilling rigs for major oil companies. Revenue is driven by day rates on long-term contracts with oil companies investing in deepwater exploration and production.',
    keyDrivers: ['Deepwater drilling day rates', 'Brent price (deepwater breakeven ~$50-60)', 'Fleet utilization', 'Contract backlog'],
    investmentLens: 'High-risk, high-reward deepwater cyclical play. Leveraged balance sheet amplifies upside and downside. Benefits from offshore supercycle thesis.',
    riskFactors: ['High leverage', 'Day rate volatility', 'Brent price fall reducing offshore investment', 'Fleet age and maintenance costs'],
    bullCase: ['Deepwater day rates continue rising', 'Leverage amplifies equity upside significantly'],
    baseCase: ['Steady utilization with gradual day rate improvement'],
    bearCase: ['Oil price fall delays offshore investment; high leverage becomes critical'],
    peerIds: ['slb', 'hal'],
    relatedNews: ['n6'],
  },
  {
    id: 'kmi', ticker: 'KMI', name: 'Kinder Morgan',
    segment: 'Pipeline / Midstream', region: 'US',
    marketCap: '$23B', marketCapM: 23000,
    revenue: '$15B', revenueM: 15000,
    fcfStatus: 'Positive', revenueDriver: 'Fee-based pipeline transportation + storage',
    benchmarkExposure: 'Henry Hub (gas volume indicator)', thesisSignal: 'Neutral', riskLevel: 'Low',
    businessModel: 'Kinder Morgan is one of the largest US energy infrastructure companies, operating natural gas pipelines and terminals across North America. Revenue is predominantly fee-based, providing relatively stable cash flows.',
    keyDrivers: ['Natural gas throughput volumes', 'Long-term customer contracts', 'Dividend sustainability', 'Capital project backlog'],
    investmentLens: 'Defensive yield play with infrastructure-like cash flow stability. Limited commodity price exposure — revenue tied to volumes, not prices. LNG export boom is driving new pipeline demand.',
    riskFactors: ['Volume risk if gas demand shifts', 'Regulatory risk on new pipeline approvals', 'Interest rate sensitivity (yield compression)'],
    bullCase: ['LNG export boom drives new pipeline demand', 'Rate cases provide organic growth'],
    baseCase: ['Steady fee income with modest dividend growth'],
    bearCase: ['New pipeline approvals blocked', 'Gas demand shifts faster than expected'],
    peerIds: ['lng', 'xom'],
    relatedNews: ['n4'],
  },
];

// ─── Watchlist Defaults ───────────────────────────────────────────────────────

export const defaultWatchlistCompanies: WatchlistCompany[] = [
  { id: 'lng', ticker: 'LNG', name: 'Cheniere Energy', segment: 'LNG / Midstream', priceChange: +2.3, priceChangePct: +2.1, thesisSignal: 'Bullish', riskLevel: 'Medium', latestEvent: 'JKM-HH spread widening — favorable for LNG exporters' },
  { id: 'xom', ticker: 'XOM', name: 'ExxonMobil', segment: 'Integrated', priceChange: +1.1, priceChangePct: +0.9, thesisSignal: 'Neutral', riskLevel: 'Low', latestEvent: 'Brent price rising on supply concerns' },
  { id: 'cvx', ticker: 'CVX', name: 'Chevron', segment: 'Integrated', priceChange: +0.8, priceChangePct: +0.6, thesisSignal: 'Neutral', riskLevel: 'Low', latestEvent: 'Australia LNG production steady' },
  { id: 'vlo', ticker: 'VLO', name: 'Valero Energy', segment: 'Refining', priceChange: -0.5, priceChangePct: -0.4, thesisSignal: 'Neutral', riskLevel: 'Medium', latestEvent: 'Crack spreads normalizing after refinery restart' },
  { id: 'slb', ticker: 'SLB', name: 'SLB', segment: 'Oilfield Services', priceChange: +1.8, priceChangePct: +1.5, thesisSignal: 'Bullish', riskLevel: 'Medium', latestEvent: 'International capex cycle remains strong' },
];

export const defaultWatchlistBenchmarks: WatchlistBenchmark[] = [
  { id: 'jkm', name: 'JKM', price: 14.20, unit: '$/MMBtu', spread: 11.35, spreadLabel: 'JKM−HH', signal: 'Extreme', alertStatus: 'Active' },
  { id: 'ttf', name: 'TTF', price: 10.85, unit: '$/MMBtu', spread: 8.00, spreadLabel: 'TTF−HH', signal: 'Elevated', alertStatus: 'Active' },
  { id: 'brent', name: 'Brent', price: 84.20, unit: '$/bbl', signal: 'Normal', alertStatus: 'None' },
  { id: 'jkm-hh', name: 'JKM−HH Spread', price: 11.35, unit: '$/MMBtu', signal: 'Elevated', alertStatus: 'Active' },
];

// ─── News Events ──────────────────────────────────────────────────────────────

export const terminalNewsEvents = [
  {
    id: 'n1',
    title: 'JKM-Henry Hub spread widens as Asian buyers secure LNG cargoes',
    time: '2 hours ago', source: 'Energy Intelligence',
    category: 'Price', importance: 'High' as const,
    summary: 'Asian LNG buyers are paying a higher premium relative to US gas markets, reflecting tighter regional supply conditions and stronger urgency to secure cargoes ahead of winter.',
    whyItMatters: 'The JKM-Henry Hub spread is the primary indicator of LNG export economics. When the spread widens, US LNG exporters benefit because the margin on each cargo increases significantly.',
    affectedSegments: ['Midstream / LNG', 'Gas Upstream', 'LNG Shipping'],
    relatedBenchmarks: ['JKM', 'Henry Hub', 'JKM-HH Spread'],
    relatedCompanies: ['Cheniere Energy', 'Shell', 'TotalEnergies'],
    beneficiaries: ['Cheniere Energy', 'Shell LNG', 'US LNG exporters', 'LNG shipping companies'],
    losers: ['Asian power utilities', 'Industrial gas users in Japan/Korea/Taiwan', 'European gas buyers'],
    metricsToMonitor: ['JKM daily price', 'Henry Hub daily price', 'JKM-HH spread', 'LNG shipping rates', 'LNG export capacity utilization'],
  },
  {
    id: 'n2',
    title: 'Qatar confirms major long-term LNG supply contract with European buyers',
    time: '4 hours ago', source: 'Reuters Energy',
    category: 'Deal / Contract', importance: 'High' as const,
    summary: 'Qatar has confirmed a new 20-year LNG supply agreement with a consortium of European buyers, signaling continued confidence in long-term natural gas demand despite renewable energy expansion.',
    whyItMatters: 'Long-term contracts lock in supply and reduce spot market availability, supporting elevated spot prices. It also validates the structural role of LNG in energy security.',
    affectedSegments: ['Upstream Gas', 'LNG Midstream', 'Power Generation'],
    relatedBenchmarks: ['JKM', 'TTF', 'LNG shipping rates'],
    relatedCompanies: ['TotalEnergies', 'Shell', 'ExxonMobil'],
    beneficiaries: ['LNG producers', 'LNG infrastructure investors', 'Natural gas shipping companies'],
    losers: ['Spot LNG buyers who now face tighter spot supply', 'Renewable energy competitors'],
    metricsToMonitor: ['Spot LNG availability', 'TTF forward curve', 'JKM spot premium', 'LNG fleet utilization'],
  },
  {
    id: 'n3',
    title: 'Oil prices rise on OPEC+ signals of extended production cuts',
    time: '6 hours ago', source: 'Market Energy Wire',
    category: 'Supply', importance: 'High' as const,
    summary: 'OPEC+ signals indicate production cuts may be extended beyond Q1, supporting Brent prices above $80 and narrowing the supply surplus that had been building through H2.',
    whyItMatters: 'OPEC+ production discipline is the most direct lever on global oil supply. An extension reduces available barrels and provides price support for oil-leveraged producers.',
    affectedSegments: ['Upstream Oil', 'Refining', 'Midstream Oil'],
    relatedBenchmarks: ['Brent', 'WTI', 'Dubai', 'Brent-WTI spread'],
    relatedCompanies: ['ExxonMobil', 'Chevron', 'Shell', 'BP'],
    beneficiaries: ['All upstream oil producers', 'OPEC+ member countries', 'Integrated majors'],
    losers: ['Refiners facing higher crude input costs', 'Airlines', 'Petrochemical producers'],
    metricsToMonitor: ['OPEC+ compliance rate', 'Brent futures curve', 'Global oil inventory levels', 'Refining crack spreads'],
  },
  {
    id: 'n4',
    title: 'New US LNG export terminal receives FERC approval',
    time: '1 day ago', source: 'Natural Gas Intelligence',
    category: 'Regulation', importance: 'Medium' as const,
    summary: 'Federal regulators approved a new LNG export terminal on the Gulf Coast, adding 15 mtpa of future export capacity. The terminal is expected to come online in 2027.',
    whyItMatters: 'Additional US LNG export capacity increases long-term supply, which could compress spreads over time. However, 2027 start-up means near-term market is unaffected. Positive for midstream infrastructure.',
    affectedSegments: ['Midstream / LNG', 'Pipeline Infrastructure', 'Gas Upstream'],
    relatedBenchmarks: ['Henry Hub', 'JKM-HH spread (long term)'],
    relatedCompanies: ['Kinder Morgan', 'Cheniere Energy', 'ExxonMobil'],
    beneficiaries: ['Infrastructure builders', 'Pipeline companies', 'US gas producers'],
    losers: ['Incumbent LNG exporters competing for long-term contracts', 'Spot market sellers if supply grows'],
    metricsToMonitor: ['Construction progress', 'Long-term contract pricing', 'Henry Hub forward curve', 'LNG capacity utilization (post 2027)'],
  },
  {
    id: 'n5',
    title: 'US refinery outage tightens gasoline supply on the East Coast',
    time: '1 day ago', source: 'Platts Energy',
    category: 'Supply', importance: 'Medium' as const,
    summary: 'An unexpected outage at a major East Coast refinery has reduced regional gasoline supply. RBOB futures rose on the news as buyers sought alternative supply.',
    whyItMatters: 'Refinery outages can rapidly tighten regional product markets and widen crack spreads. Competing refiners benefit from higher margins while airlines and transport companies face higher fuel costs.',
    affectedSegments: ['Refining', 'Downstream Products', 'Transport / Airlines'],
    relatedBenchmarks: ['Brent', 'WTI', 'Crack spreads'],
    relatedCompanies: ['Valero Energy', 'Marathon Petroleum', 'ExxonMobil'],
    beneficiaries: ['Other US refiners (margin uplift)', 'Petroleum product traders'],
    losers: ['Airlines', 'Trucking companies', 'Retail gasoline consumers'],
    metricsToMonitor: ['East Coast crack spreads', 'RBOB gasoline futures', 'Refinery utilization rates', 'EIA gasoline inventory data'],
  },
  {
    id: 'n6',
    title: 'International upstream capex spending expected to grow 8% in 2025',
    time: '2 days ago', source: 'Wood Mackenzie',
    category: 'Demand', importance: 'Medium' as const,
    summary: 'A new industry survey projects international upstream capital spending to grow approximately 8% in 2025, driven by deepwater development and LNG investment cycles.',
    whyItMatters: 'Higher upstream capex directly benefits oilfield services companies. SLB, Halliburton, and Transocean are the primary beneficiaries of an international capex supercycle.',
    affectedSegments: ['Oilfield Services', 'Offshore Drilling', 'Engineering & Construction'],
    relatedBenchmarks: ['Brent (capex threshold indicator)'],
    relatedCompanies: ['SLB', 'Halliburton', 'Transocean'],
    beneficiaries: ['SLB', 'Halliburton', 'Transocean', 'Subsea equipment suppliers'],
    losers: ['Companies that delayed service contracts may face capacity constraints'],
    metricsToMonitor: ['International rig count', 'Day rate trends', 'Order backlog at major OFS companies', 'E&P capex guidance updates'],
  },
];

// ─── Event Impact Scenarios ───────────────────────────────────────────────────

export const impactEvents: ImpactEvent[] = [
  {
    id: 'hormuz',
    title: 'Hormuz Strait Disruption',
    summary: 'The Strait of Hormuz is a critical chokepoint through which approximately 20% of global oil supply passes. A disruption would reduce delivered supply to Asia and Europe, creating acute market stress.',
    directImpact: 'Immediate reduction in Middle Eastern oil and LNG exports passing through the Strait. Tanker re-routing or suspension.',
    indirectImpact: 'Rising war-risk insurance premiums, shipping rate spikes, LNG spot price surge in Asia, Brent price spike driven by risk premium.',
    transmissionSteps: [
      'Hormuz Strait access disrupted by military/political event',
      'Tanker insurance premiums spike 30–50% immediately',
      'Middle Eastern crude and LNG deliveries delayed or diverted',
      'Asian LNG spot prices (JKM) spike $5–8/MMBtu on supply uncertainty',
      'Brent gains $15–25/bbl risk premium',
      'Alternative suppliers (West Africa, US) gain spot market share',
    ],
    affectedSegments: [
      { name: 'Midstream Shipping', level: 'Direct' },
      { name: 'LNG Terminal / Export', level: 'Direct' },
      { name: 'Middle East Upstream', level: 'Direct' },
      { name: 'Asia Power Generation', level: 'Indirect' },
      { name: 'Refining', level: 'Indirect' },
      { name: 'US Upstream (alternative)', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'US LNG exporters (Cheniere)', reason: 'Atlantic route becomes preferred; demand surges', metrics: 'LNG export volume, JKM-HH spread' },
      { name: 'West African oil producers', reason: 'Non-Hormuz supply commands premium', metrics: 'Brent-Dubai differential, WAF crude premium' },
      { name: 'LNG shipping companies', reason: 'Higher freight rates on longer routes', metrics: 'LNG shipping day rates, BLNG index' },
    ],
    losers: [
      { name: 'Asian LNG buyers', reason: 'Supply path disrupted; spot costs spike', metrics: 'JKM spot, power tariffs' },
      { name: 'Middle East-dependent refiners', reason: 'Crude input cost surges or supply unavailable', metrics: 'Refinery throughput, product margins' },
      { name: 'Airlines', reason: 'Jet fuel cost spike across Asia-Pacific', metrics: 'Jet fuel crack spreads, airline fuel surcharges' },
    ],
    monitoringChecklist: [
      'JKM spot price (daily)',
      'Brent-Dubai spread',
      'LNG shipping rates (BLNG index)',
      'War-risk insurance premiums',
      'Asian refinery crack spreads',
      'Alternative supply routes utilization',
    ],
  },
  {
    id: 'qatar-disruption',
    title: 'Qatar LNG Facility Disruption',
    summary: 'Qatar is the world\'s largest LNG exporter. Any disruption to Ras Laffan LNG facilities would remove 77 mtpa of supply from global markets, creating immediate spot market shortages.',
    directImpact: 'Immediate removal of up to 20% of global LNG supply from markets. Long-term contract holders face force majeure; spot buyers face acute shortages.',
    indirectImpact: 'JKM prices spike sharply. European TTF rises as buyers compete for remaining spot cargoes. Asian buyers try to secure alternative supply from US, Australia, and Africa.',
    transmissionSteps: [
      'Qatar Ras Laffan facility disrupted (technical/political)',
      'Up to 20% of global LNG supply removed immediately',
      'JKM spikes $8–15/MMBtu as Asian buyers compete for cargoes',
      'TTF rises as Europe competes with Asia for non-Qatar LNG',
      'US LNG export utilization maximized; Cheniere benefits',
      'Long-term importers face force majeure declarations',
    ],
    affectedSegments: [
      { name: 'Qatar LNG Export (Ras Laffan)', level: 'Direct' },
      { name: 'LNG Shipping (rerouting)', level: 'Direct' },
      { name: 'Asia LNG Import Terminals', level: 'Direct' },
      { name: 'Europe Gas Supply', level: 'Indirect' },
      { name: 'US LNG Export (fills gap)', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'Cheniere Energy', reason: 'Demand for US LNG surges as Qatar gap emerges', metrics: 'LNG export utilization, JKM-HH spread' },
      { name: 'Australian LNG producers', reason: 'Non-Qatar supply commands premium', metrics: 'Australian LNG spot prices, contract premiums' },
      { name: 'LNG shipping companies', reason: 'Higher utilization + potentially higher rates', metrics: 'Shipping day rates, utilization' },
    ],
    losers: [
      { name: 'Asian power utilities', reason: 'LNG cost spikes directly increase fuel costs', metrics: 'JKM, power tariff increases' },
      { name: 'European gas buyers', reason: 'Competition from Asia raises TTF', metrics: 'TTF, storage levels, German industrial production' },
      { name: 'Shell, TotalEnergies (Qatar offtakers)', reason: 'Long-term contract supply at risk', metrics: 'Force majeure status, alternative procurement costs' },
    ],
    monitoringChecklist: [
      'Qatar LNG production status (daily)',
      'JKM spot price',
      'TTF spot and forward curve',
      'US LNG export utilization rate',
      'Australian LNG spot availability',
      'Global LNG shipping availability',
    ],
  },
  {
    id: 'opec-cut',
    title: 'OPEC+ Surprise Production Cut',
    summary: 'OPEC+ announces a surprise additional production cut of 1 million barrels per day, reducing global oil supply more aggressively than markets anticipated.',
    directImpact: 'Immediate tightening of global oil supply. Brent price rises sharply on the news. Supply deficit widens.',
    indirectImpact: 'Refining margins may be pressured as crude costs rise. Non-OPEC+ producers (US shale, Brazil) benefit from higher prices but face volume limits.',
    transmissionSteps: [
      'OPEC+ announces surprise cut of 1mb/d above prior guidance',
      'Brent immediately gains $5–10/bbl on supply concern',
      'Oil inventory drawdown accelerates in H2',
      'Non-OPEC+ producers (US shale) incentivized to ramp up',
      'Refiners face higher crude input costs; crack spreads compress initially',
      'Oil-leveraged upstream producers see major equity re-rating',
    ],
    affectedSegments: [
      { name: 'Upstream Oil (OPEC+)', level: 'Direct' },
      { name: 'Refining', level: 'Indirect' },
      { name: 'US Upstream (beneficiary)', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'ExxonMobil, Chevron, Shell', reason: 'Higher oil price on all production volumes', metrics: 'Brent price, production volumes' },
      { name: 'US shale producers', reason: 'Higher price incentivizes volume increase', metrics: 'WTI price, US rig count' },
    ],
    losers: [
      { name: 'Airlines', reason: 'Jet fuel cost increases directly from oil price rise', metrics: 'Jet fuel crack spreads, airline fuel surcharges' },
      { name: 'Refiners (near-term)', reason: 'Crude input costs rise faster than product prices initially', metrics: 'Crack spreads, refinery margins' },
    ],
    monitoringChecklist: [
      'Brent price daily',
      'OPEC+ compliance rate',
      'Global oil inventory levels (IEA/EIA data)',
      'US rig count (Baker Hughes)',
      'Crack spreads (refining margin indicator)',
    ],
  },
  {
    id: 'henry-hub-collapse',
    title: 'Henry Hub Price Collapse',
    summary: 'US natural gas prices at Henry Hub collapse to below $2/MMBtu due to a combination of mild weather, high production, and weak export demand, dramatically widening the JKM-Henry Hub spread.',
    directImpact: 'JKM-Henry Hub spread widens dramatically, improving US LNG export economics significantly.',
    indirectImpact: 'US gas producers face margin compression. LNG exporters benefit. Power generators switch to gas, increasing gas demand and partially offsetting the price decline.',
    transmissionSteps: [
      'Henry Hub falls below $2/MMBtu on warm weather + high production',
      'JKM-Henry Hub spread widens to potentially $12-15/MMBtu',
      'US LNG exporters (Cheniere) see maximum export economics',
      'US gas producers face revenue compression',
      'Power generators increase gas consumption, supporting some demand',
      'Long-term, low prices may reduce drilling activity and stabilize supply',
    ],
    affectedSegments: [
      { name: 'US Gas Upstream', level: 'Direct' },
      { name: 'LNG Export (beneficiary)', level: 'Direct' },
      { name: 'US Power Generation', level: 'Indirect' },
    ],
    beneficiaries: [
      { name: 'Cheniere Energy', reason: 'Feedgas input cost falls, improving export margins', metrics: 'JKM-HH spread, export margin per cargo' },
      { name: 'US power utilities', reason: 'Lower gas-fired power generation costs', metrics: 'Henry Hub, power purchase prices' },
    ],
    losers: [
      { name: 'US gas producers (EQT, Range, Coterra)', reason: 'Revenue falls with price', metrics: 'Henry Hub, production breakeven costs' },
      { name: 'Gas pipeline companies (partially)', reason: 'Some revenue tied to commodity prices', metrics: 'Henry Hub, gas throughput volumes' },
    ],
    monitoringChecklist: [
      'Henry Hub daily spot price',
      'JKM-Henry Hub spread',
      'US natural gas production (weekly EIA)',
      'US gas inventory vs seasonal norm',
      'LNG export utilization rate',
      'US rig count (gas-directed)',
    ],
  },
  {
    id: 'asian-demand-spike',
    title: 'Asian LNG Demand Spike',
    summary: 'A combination of colder-than-expected winter weather and economic acceleration in China and India drives a sharp increase in Asian LNG demand, straining already-tight spot markets.',
    directImpact: 'JKM prices spike sharply. Asian buyers compete aggressively for spot cargoes. Diversion of cargoes from Europe tightens TTF.',
    indirectImpact: 'US LNG exports maximized. JKM-Henry Hub spread widens further. European buyers face competition from Asia for the same cargoes.',
    transmissionSteps: [
      'Cold weather + economic activity drives Asian gas demand above forecast',
      'Asian buyers aggressively bid for spot LNG cargoes',
      'JKM prices spike as available spot cargoes are quickly claimed',
      'Cargoes diverted from Europe, tightening TTF',
      'US LNG exports maximized; Cheniere and Shell LNG benefit',
      'JKM-HH spread widens, improving US export economics further',
    ],
    affectedSegments: [
      { name: 'Asian LNG Import Terminals', level: 'Direct' },
      { name: 'LNG Shipping', level: 'Direct' },
      { name: 'US LNG Export (beneficiary)', level: 'Indirect' },
      { name: 'European Gas (secondary tightening)', level: 'Indirect' },
    ],
    beneficiaries: [
      { name: 'Cheniere Energy', reason: 'Export demand maximized; JKM-HH spread at peak', metrics: 'JKM-HH spread, export utilization' },
      { name: 'LNG shipping companies', reason: 'Demand for transport surges; rates spike', metrics: 'LNG shipping day rates, utilization' },
      { name: 'Shell, TotalEnergies', reason: 'LNG portfolios capture higher spot prices', metrics: 'JKM, LNG spot premium to contract' },
    ],
    losers: [
      { name: 'Asian power utilities', reason: 'Fuel procurement costs surge', metrics: 'JKM, power tariffs, utility margins' },
      { name: 'European industrial gas users', reason: 'TTF rises as cargoes diverted', metrics: 'TTF, European gas storage utilization' },
    ],
    monitoringChecklist: [
      'JKM spot price (daily)',
      'JKM-Henry Hub spread',
      'LNG shipping availability and day rates',
      'Asian storage injection rates',
      'TTF spot price',
      'Chinese and Indian LNG import data',
    ],
  },
  {
    id: 'us-lng-outage',
    title: 'US LNG Export Terminal Outage',
    summary: 'A Gulf Coast LNG export terminal unexpectedly shuts down for maintenance, temporarily reducing available Atlantic Basin LNG supply.',
    directImpact: 'US LNG export capacity falls immediately, reducing cargo availability for Europe and Asia.',
    indirectImpact: 'JKM-Henry Hub spread may remain wide, but Cheniere-style export utilization becomes more important than headline spread economics.',
    transmissionSteps: [
      'US LNG terminal outage removes export capacity',
      'Atlantic Basin spot cargo availability tightens',
      'JKM and TTF rise as buyers bid for replacement cargoes',
      'Henry Hub weakens if feedgas demand falls',
      'Exporters with unaffected capacity benefit from higher utilization',
      'Affected terminal operators face revenue and reliability concerns',
    ],
    affectedSegments: [
      { name: 'US LNG Export Terminal', level: 'Direct' },
      { name: 'Pipeline Feedgas', level: 'Direct' },
      { name: 'LNG Shipping', level: 'Indirect' },
      { name: 'Europe / Asia Importers', level: 'Indirect' },
      { name: 'US Gas Upstream', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'Unaffected US LNG exporters', reason: 'Remaining export capacity becomes more valuable', metrics: 'Utilization rate, JKM-HH spread' },
      { name: 'Non-US LNG suppliers', reason: 'Can capture replacement cargo demand', metrics: 'Spot cargo premiums, tender awards' },
    ],
    losers: [
      { name: 'Affected LNG terminal operator', reason: 'Lost throughput and potential reliability discount', metrics: 'Outage duration, force majeure status' },
      { name: 'European and Asian importers', reason: 'Must replace cargoes in tighter spot market', metrics: 'JKM, TTF, tender prices' },
    ],
    monitoringChecklist: [
      'Terminal outage duration and restart guidance',
      'US LNG feedgas nominations',
      'JKM-Henry Hub spread',
      'TTF spot and forward curve',
      'Available LNG shipping capacity',
    ],
  },
  {
    id: 'refinery-outage',
    title: 'Major Refinery Outage',
    summary: 'An unplanned refinery outage reduces regional product supply, tightening gasoline and diesel markets even if crude supply is adequate.',
    directImpact: 'Refined product supply drops in the affected region; product cracks widen.',
    indirectImpact: 'Unaffected refiners benefit from higher margins, while airlines, truckers, and consumers face higher fuel costs.',
    transmissionSteps: [
      'Refinery outage removes product supply',
      'Regional gasoline and diesel inventories draw down',
      'Crack spreads widen as product prices rise faster than crude',
      'Unaffected refiners run harder and capture margin uplift',
      'Fuel-intensive sectors face cost pressure',
    ],
    affectedSegments: [
      { name: 'Refining', level: 'Direct' },
      { name: 'Downstream Distribution', level: 'Direct' },
      { name: 'Retail Fuel', level: 'Indirect' },
      { name: 'Upstream Oil', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'Valero Energy / Marathon Petroleum', reason: 'Unaffected refineries capture wider cracks', metrics: 'Crack spreads, utilization rates' },
      { name: 'Product traders', reason: 'Regional arbitrage opportunities expand', metrics: 'Product spreads, freight rates' },
    ],
    losers: [
      { name: 'Local fuel distributors', reason: 'Supply shortage increases procurement costs', metrics: 'Wholesale rack prices, inventories' },
      { name: 'Airlines and trucking firms', reason: 'Fuel costs rise quickly', metrics: 'Jet and diesel cracks' },
    ],
    monitoringChecklist: [
      'Refinery restart schedule',
      'Regional gasoline inventories',
      'Crack spreads',
      'RBOB and diesel futures',
      'Refinery utilization rates',
    ],
  },
  {
    id: 'lng-contract-signed',
    title: 'New Long-Term LNG Contract Signed',
    summary: 'A major Asian buyer signs a multi-year LNG offtake contract with a US exporter, improving supply security for the buyer and revenue visibility for the exporter.',
    directImpact: 'Contracted volumes reduce merchant exposure and support financing for additional LNG capacity.',
    indirectImpact: 'Spot market availability can tighten if more volumes move into long-term contracts, supporting regional premiums.',
    transmissionSteps: [
      'Importer signs long-term LNG supply contract',
      'Exporter gains revenue visibility and project financing support',
      'Spot cargo availability may decline over time',
      'JKM-Henry Hub spread remains important for contract economics',
      'Pipeline and shipping demand rises alongside export commitments',
    ],
    affectedSegments: [
      { name: 'LNG Export', level: 'Direct' },
      { name: 'LNG Import / Utilities', level: 'Direct' },
      { name: 'Pipeline Feedgas', level: 'Indirect' },
      { name: 'LNG Shipping', level: 'Indirect' },
      { name: 'Spot LNG Market', level: 'Low' },
    ],
    beneficiaries: [
      { name: 'Cheniere Energy', reason: 'Long-term contract improves revenue visibility', metrics: 'Contract backlog, liquefaction utilization' },
      { name: 'Pipeline companies', reason: 'Export-linked feedgas demand supports volumes', metrics: 'Gas throughput, project backlog' },
    ],
    losers: [
      { name: 'Uncontracted spot buyers', reason: 'Less flexible supply remains available', metrics: 'JKM spot premium, tender competition' },
      { name: 'Competing exporters', reason: 'May lose strategic buyers to contracted rivals', metrics: 'New offtake awards, contract pricing' },
    ],
    monitoringChecklist: [
      'Contract duration and pricing formula',
      'Export terminal capacity allocation',
      'JKM-Henry Hub spread',
      'Shipping availability',
      'Follow-on contracts by other Asian buyers',
    ],
  },
];

// ─── Research Note Templates ──────────────────────────────────────────────────

export const researchNoteTemplates: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Industry Thesis Template',
    type: 'Industry Thesis',
    content: `## Industry Thesis

**What changed?**
[Describe the market event or data point that triggered this analysis]

**Which value chain segment is affected?**
[Upstream / Midstream / Downstream / Adjacent]

**What is the supply-demand impact?**
[How does this event affect supply-demand balance? Surplus or deficit?]

**What price signal confirms this?**
[Which benchmark or spread is the best indicator to monitor?]

**Which companies benefit or suffer?**
Beneficiaries:
-

Losers:
-

**Conviction level:** [High / Medium / Low]
**Time horizon:** [Short-term / Medium-term / Long-term]`,
  },
  {
    title: 'Company Thesis Template',
    type: 'Company Thesis',
    content: `## Company Thesis

**Company:**
**Ticker:**
**Value chain position:** [Upstream / Midstream / Downstream]
**Revenue driver:**

**Key benchmark exposure:**
-

**Bull case:**
-
-
-

**Bear case:**
-
-
-

**What would change my mind?**
[Describe the conditions or data points that would cause you to change this thesis]

**Key metrics to monitor:**
-
-
-

**Conviction level:** [High / Medium / Low]`,
  },
  {
    title: 'Event Note Template',
    type: 'Event Note',
    content: `## Event Note

**Event:**
**Date:**
**Source:**

**Direct impact:**
[Immediate, first-order effects on specific segments or companies]

**Indirect impact:**
[Second-order effects that may emerge over days or weeks]

**Beneficiaries:**
| Company / Entity | Reason | Metric to Watch |
|---|---|---|
|  |  |  |

**Losers:**
| Company / Entity | Reason | Metric to Watch |
|---|---|---|
|  |  |  |

**Metrics to monitor:**
-
-
-

**Follow-up actions:**
- [ ]
- [ ] `,
  },
];

// ─── Command Palette Items ────────────────────────────────────────────────────

export const commandPaletteItems: CommandPaletteItem[] = [
  // Pages
  { id: 'p1', label: 'Command Center', type: 'page', action: 'command-center', subtitle: 'Executive overview and market pulse' },
  { id: 'p2', label: 'Market Monitor', type: 'page', action: 'market-monitor', subtitle: 'Benchmark table and heatmap' },
  { id: 'p3', label: 'Price & Spread', type: 'page', action: 'price-spread', subtitle: 'Price charts and spread monitor' },
  { id: 'p4', label: 'Industry Map', type: 'page', action: 'industry-map', subtitle: 'Value chain segment explorer' },
  { id: 'p5', label: 'Value Chain', type: 'page', action: 'value-chain', subtitle: 'Value creation analysis' },
  { id: 'p6', label: 'Supply / Demand', type: 'page', action: 'supply-demand', subtitle: 'Supply-demand balance analysis' },
  { id: 'p7', label: 'Company Screener', type: 'page', action: 'company-screener', subtitle: 'Screen and filter companies' },
  { id: 'p8', label: 'Company Workspace', type: 'page', action: 'company-workspace', subtitle: 'Single company research workspace' },
  { id: 'p9', label: 'News Terminal', type: 'page', action: 'news-terminal', subtitle: 'News feed and event analysis' },
  { id: 'p10', label: 'Event Impact', type: 'page', action: 'event-impact', subtitle: 'Event impact analysis tool' },
  { id: 'p11', label: 'Watchlist', type: 'page', action: 'watchlist', subtitle: 'Companies and benchmarks watchlist' },
  { id: 'p12', label: 'Research Notes', type: 'page', action: 'research-notes', subtitle: 'Analyst research workspace' },
  // Companies
  { id: 'c1', label: 'Cheniere Energy (LNG)', type: 'company', action: 'company-workspace', targetId: 'lng', subtitle: 'Midstream / LNG — Bullish' },
  { id: 'c2', label: 'ExxonMobil (XOM)', type: 'company', action: 'company-workspace', targetId: 'xom', subtitle: 'Integrated Oil & Gas — Neutral' },
  { id: 'c3', label: 'Shell (SHEL)', type: 'company', action: 'company-workspace', targetId: 'shel', subtitle: 'Integrated Oil & Gas — Bullish' },
  { id: 'c4', label: 'Valero Energy (VLO)', type: 'company', action: 'company-workspace', targetId: 'vlo', subtitle: 'Refining — Neutral' },
  { id: 'c5', label: 'SLB', type: 'company', action: 'company-workspace', targetId: 'slb', subtitle: 'Oilfield Services — Bullish' },
  // Benchmarks
  { id: 'b1', label: 'JKM Asian LNG Price', type: 'benchmark', action: 'price-spread', subtitle: '$14.20/MMBtu — Elevated' },
  { id: 'b2', label: 'Henry Hub Natural Gas', type: 'benchmark', action: 'price-spread', subtitle: '$2.85/MMBtu — Bearish' },
  { id: 'b3', label: 'Brent Crude Oil', type: 'benchmark', action: 'price-spread', subtitle: '$84.20/bbl — Bullish' },
  { id: 'b4', label: 'JKM-Henry Hub Spread', type: 'benchmark', action: 'price-spread', subtitle: '$11.35/MMBtu — Extreme' },
  // Events
  { id: 'e1', label: 'Hormuz Strait Disruption', type: 'event', action: 'event-impact', subtitle: 'High impact scenario' },
  { id: 'e2', label: 'Qatar LNG Disruption', type: 'event', action: 'event-impact', subtitle: 'High impact scenario' },
  { id: 'e3', label: 'OPEC+ Production Cut', type: 'event', action: 'event-impact', subtitle: 'Medium impact scenario' },
];

// ─── Executive Brief ──────────────────────────────────────────────────────────

export const executiveBrief = `The Oil & Gas market is currently driven by midstream transportation risk, LNG supply tightness, and widening regional gas spreads. Upstream remains the largest value pool, but near-term stress is concentrated in shipping chokepoints and LNG contract markets. The JKM-Henry Hub spread is elevated at $11.35/MMBtu — above both the 30-day and 1-year averages — signalling that Asian LNG buyers face meaningfully tighter supply conditions than US domestic buyers. OPEC+ production discipline continues to support Brent above $80/bbl. Investors should focus on: (1) Hormuz Strait risk evolution, (2) LNG new-build capacity delivery delays, and (3) JKM-Henry Hub spread trajectory.`;
