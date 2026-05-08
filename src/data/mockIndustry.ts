import type {
  Industry,
  ValueChainSegment,
  MarketStructureSegment,
  Company,
  SupplyCountry,
  DemandCountry,
  SupplyDemandBalance,
  PriceBenchmark,
  NewsEvent,
  ImpactScenario,
  BeneficiaryMatrix,
} from '../types/industry';

export * from './terminal';

// ─────────────────────────────────────────────
// Industry
// ─────────────────────────────────────────────
export const oilGasIndustry: Industry = {
  id: 'oil-gas',
  name: 'Oil & Gas',
  shortName: 'Oil & Gas',
  icon: '🛢️',
  description:
    'Global hydrocarbons industry spanning exploration, production, transportation, refining, and distribution of crude oil and natural gas.',
  totalMarketSize: 6.25,
  currency: 'USD Trillion',
  keyMetrics: [
    { label: 'Total Market Size', value: 'US$6.25T', description: 'Global oil & gas market (2024 est.)' },
    { label: 'Upstream Value Pool', value: 'US$3.0T', description: '48% of total — largest segment' },
    { label: 'Midstream Value Pool', value: 'US$1.0T', description: '16% of total — critical chokepoint' },
    { label: 'Petrochemical Market', value: 'US$685B', description: 'Adjacent high-growth segment' },
    { label: 'Global Oil Demand', value: '100M bbl/day', description: 'Post-pandemic recovery plateau' },
    { label: 'Global LNG Demand', value: '460M tons/yr', description: 'Structural growth driven by Asia & Europe' },
  ],
};

// ─────────────────────────────────────────────
// Market Structure
// ─────────────────────────────────────────────
export const marketStructure: MarketStructureSegment[] = [
  {
    segment: 'Upstream',
    marketSize: 'US$3.0T',
    sharePercent: 48,
    businessModel: 'Exploration, drilling & production; revenue tied to commodity price × volume',
    keyRisk: 'Oil price volatility, exploration failure, geopolitical risk',
    color: '#22d3ee',
  },
  {
    segment: 'Downstream',
    marketSize: 'US$1.125T',
    sharePercent: 18,
    businessModel: 'Refining crude into products; margin = crack spread between input and output',
    keyRisk: 'Crack spread compression, demand slowdown, fuel transition',
    color: '#34d399',
  },
  {
    segment: 'Midstream',
    marketSize: 'US$1.0T',
    sharePercent: 16,
    businessModel: 'Fee-based pipeline & storage; revenue tied to throughput volume',
    keyRisk: 'Regulatory risk, volume decline, infrastructure disruption',
    color: '#60a5fa',
  },
  {
    segment: 'Petrochemical',
    marketSize: 'US$685B',
    sharePercent: 11,
    businessModel: 'Transform naphtha/gas into plastics & chemicals; margin = spread over feedstock',
    keyRisk: 'Oversupply from China, feedstock cost, demand cyclicality',
    color: '#a78bfa',
  },
  {
    segment: 'LNG',
    marketSize: 'US$440B',
    sharePercent: 7,
    businessModel: 'Liquefaction, shipping & regasification; long-term offtake + spot premium',
    keyRisk: 'Liquefaction outage, shipping bottleneck, spot price collapse',
    color: '#f59e0b',
  },
];

// ─────────────────────────────────────────────
// Value Chain Segments
// ─────────────────────────────────────────────
export const valueChainSegments: ValueChainSegment[] = [
  {
    id: 'exploration',
    name: 'Exploration',
    category: 'upstream',
    description: 'Identifying and delineating subsurface oil and gas accumulations through geological and geophysical surveys.',
    commercialNature: 'Discovering potential oil and gas reserves to be monetised via development or asset sales.',
    revenueSources: [
      'Exploration rights resale',
      'Joint venture carry arrangements',
      'Licensing of seismic data',
      'Project carried interest',
    ],
    costDrivers: [
      'Geological and geophysical surveys',
      'Exploration well drilling',
      'Seismic data acquisition and processing',
      'Concession / licence fees',
    ],
    keyCapabilities: [
      'Geological interpretation and basin analysis',
      'Risk-weighted resource estimation',
      'Regulatory navigation and government relations',
    ],
    risks: [
      'Exploration failure (dry hole risk)',
      'Sunk capital loss on unsuccessful wells',
      'Regulatory and licensing uncertainty',
      'Long payback period before monetisation',
    ],
    representativeCompanies: ['ExxonMobil', 'Chevron', 'TotalEnergies', 'BP', 'Shell'],
    keyMetrics: ['Discovery rate', 'Finding cost ($/boe)', 'Reserve replacement ratio', '2P resource base'],
  },
  {
    id: 'drilling',
    name: 'Drilling',
    category: 'upstream',
    description: 'Constructing wellbores to access oil and gas reservoirs, including both exploration and development drilling.',
    commercialNature: 'Service-based revenue model: day rates × utilisation for rigs and services.',
    revenueSources: [
      'Drilling rig day rates',
      'Directional drilling services',
      'Well completion services',
      'Cementing and casing services',
    ],
    costDrivers: [
      'Rig rental and mobilisation',
      'Drill bits and downhole tools',
      'Mud and chemicals',
      'Crew and labour costs',
    ],
    keyCapabilities: [
      'Horizontal and directional drilling technology',
      'Well control and safety management',
      'Real-time downhole data acquisition',
    ],
    risks: [
      'Well control incidents (blowouts)',
      'Day rate deflation during downturns',
      'Rig oversupply leading to utilisation decline',
      'Operational delays and cost overruns',
    ],
    representativeCompanies: ['SLB', 'Halliburton', 'Baker Hughes', 'Transocean', 'Valaris'],
    keyMetrics: ['Rig utilisation rate', 'Average day rate', 'Upstream capex cycle', 'Active rig count'],
  },
  {
    id: 'production',
    name: 'Production',
    category: 'upstream',
    description: 'Extracting oil and gas from proven reservoirs at commercial rates over the field life.',
    commercialNature: 'Revenue = production volume × realised commodity price minus lifting costs.',
    revenueSources: [
      'Crude oil sales',
      'Natural gas and NGL sales',
      'Production-sharing agreement entitlements',
    ],
    costDrivers: [
      'Lifting cost (opex per barrel)',
      'Field maintenance and workovers',
      'Royalties and production taxes',
      'Facility integrity and HSE',
    ],
    keyCapabilities: [
      'Reservoir management and EOR techniques',
      'Production optimisation',
      'Asset integrity management',
    ],
    risks: [
      'Natural field decline rates',
      'Commodity price risk',
      'Reservoir underperformance',
      'Geopolitical production disruptions',
    ],
    representativeCompanies: ['Saudi Aramco', 'ExxonMobil', 'Chevron', 'ConocoPhillips', 'Pioneer Natural Resources'],
    keyMetrics: ['Production volume (boe/d)', 'Lifting cost ($/boe)', 'Decline rate', 'Break-even price'],
  },
  {
    id: 'pipeline',
    name: 'Pipeline & Storage',
    category: 'midstream',
    description: 'Transporting crude oil, refined products, and natural gas via pipeline networks and storing in tank farms / caverns.',
    commercialNature: 'Fee-based throughput model: tariff × volumes, largely insulated from commodity price.',
    revenueSources: [
      'Pipeline throughput tariffs',
      'Storage capacity fees',
      'Interruptible transportation charges',
      'Terminalling services',
    ],
    costDrivers: [
      'Pipeline maintenance and integrity',
      'Compression and pump station opex',
      'Regulatory compliance',
      'Capital depreciation on infrastructure',
    ],
    keyCapabilities: [
      'Network optimisation and dispatch',
      'Integrity management and leak detection',
      'Regulatory and tariff management',
    ],
    risks: [
      'Volume shortfalls from upstream decline',
      'Regulatory rate resets',
      'Infrastructure damage and pipeline leaks',
      'Stranded asset risk from energy transition',
    ],
    representativeCompanies: ['Kinder Morgan', 'Enterprise Products Partners', 'TC Energy', 'Enbridge'],
    keyMetrics: ['Pipeline utilisation', 'Throughput volumes', 'EBITDA per mile', 'Contract tenor'],
  },
  {
    id: 'lng',
    name: 'LNG Terminal',
    category: 'midstream',
    description: 'Liquefying natural gas for ocean shipping and regasifying at destination terminals.',
    commercialNature: 'Liquefaction capacity fees plus spot LNG trading; revenues anchored by long-term offtake contracts.',
    revenueSources: [
      'Liquefaction tolling fees (fixed capacity)',
      'Long-term LNG offtake contracts',
      'Spot cargo sales at JKM/TTF prices',
      'Shipping freight premiums',
    ],
    costDrivers: [
      'Liquefaction plant opex',
      'Feed gas procurement (Henry Hub linked)',
      'LNG shipping charter costs',
      'Regasification terminal access fees',
    ],
    keyCapabilities: [
      'Liquefaction train reliability management',
      'LNG cargo scheduling and optimisation',
      'Long-term contract structuring',
    ],
    risks: [
      'Liquefaction outage (force majeure)',
      'Shipping bottlenecks and fleet shortage',
      'Spot price collapse vs. fixed cost base',
      'Geopolitical disruptions to trade routes',
    ],
    representativeCompanies: ['Cheniere Energy', 'QatarEnergy', 'Shell', 'TotalEnergies', 'Venture Global LNG'],
    keyMetrics: ['Liquefaction utilisation', 'JKM-Henry Hub spread', 'Contract coverage ratio', 'LNG shipping rates'],
  },
  {
    id: 'refining',
    name: 'Refining',
    category: 'downstream',
    description: 'Converting crude oil into marketable petroleum products including gasoline, diesel, jet fuel, and fuel oil.',
    commercialNature: 'Margin business: crack spread = product basket price minus crude input cost.',
    revenueSources: [
      'Gasoline and diesel sales',
      'Jet fuel and aviation products',
      'Fuel oil and residual products',
      'Petrochemical feedstock (naphtha)',
    ],
    costDrivers: [
      'Crude oil input cost',
      'Energy (natural gas, hydrogen)',
      'Catalyst and chemical costs',
      'Maintenance turnarounds',
    ],
    keyCapabilities: [
      'Complex refinery configuration (coking, FCC)',
      'Crude slate flexibility',
      'Energy efficiency management',
    ],
    risks: [
      'Crack spread compression',
      'Crude quality mismatch',
      'Unplanned refinery outages',
      'Long-term demand destruction from EVs',
    ],
    representativeCompanies: ['Valero Energy', 'Marathon Petroleum', 'Phillips 66', 'PBF Energy', 'HollyFrontier'],
    keyMetrics: ['Crack spread ($/bbl)', 'Refinery utilisation', 'Nelson complexity index', 'Refining EBITDA/bbl'],
  },
  {
    id: 'petrochemical',
    name: 'Petrochemical',
    category: 'adjacent',
    description: 'Converting oil and gas derivatives (naphtha, ethane) into base chemicals, polymers, and specialty materials.',
    commercialNature: 'Spread business: product price minus feedstock cost; cyclical margins driven by capacity additions.',
    revenueSources: [
      'Ethylene and propylene sales',
      'Polyethylene and polypropylene',
      'Aromatics (BTX)',
      'Specialty chemicals',
    ],
    costDrivers: [
      'Naphtha or ethane feedstock cost',
      'Energy intensity of cracking',
      'Catalyst replacement',
      'Logistics and distribution',
    ],
    keyCapabilities: [
      'Steam cracker efficiency',
      'Product portfolio breadth',
      'Feedstock optionality (naphtha vs. gas)',
    ],
    risks: [
      'Massive Chinese capacity additions driving oversupply',
      'Feedstock cost spikes',
      'Demand cyclicality with manufacturing cycle',
      'Long-term plastics demand scrutiny',
    ],
    representativeCompanies: ['LyondellBasell', 'BASF', 'SABIC', 'Dow', 'ExxonMobil Chemical'],
    keyMetrics: ['Ethylene spread', 'Cracker utilisation', 'Integrated margin', 'Global capacity additions'],
  },
  {
    id: 'power-gen',
    name: 'Power Generation',
    category: 'adjacent',
    description: 'Using natural gas as fuel for electricity generation, a key demand anchor for gas markets.',
    commercialNature: 'Gas-fired power plants compete on spark spread; demand driven by electricity prices vs. gas costs.',
    revenueSources: ['Power sales under PPA or merchant basis', 'Capacity payments', 'Ancillary services'],
    costDrivers: ['Gas fuel cost', 'O&M for turbines', 'Carbon allowances in capped markets', 'Grid interconnect fees'],
    keyCapabilities: ['Dispatch optimisation', 'Fuel procurement hedging', 'Grid reliability management'],
    risks: [
      'Renewable energy displacement',
      'Gas price spikes compressing spark spread',
      'Carbon policy tightening',
      'Stranded asset risk from energy transition',
    ],
    representativeCompanies: ['NextEra Energy', 'Vistra Energy', 'NRG Energy', 'Calpine'],
    keyMetrics: ['Spark spread', 'Gas-to-power demand', 'Renewable penetration rate', 'Carbon price'],
  },
];

// ─────────────────────────────────────────────
// Companies
// ─────────────────────────────────────────────
export const companies: Company[] = [
  {
    id: 'cheniere',
    name: 'Cheniere Energy',
    ticker: 'LNG',
    segment: 'Midstream / LNG Export',
    segmentCategory: 'lng',
    marketCap: 'US$46B',
    revenue: 'US$22B',
    fcfStatus: 'Healthy — long-term contract backed',
    businessModel: 'Liquefaction tolling + long-term LNG offtake; feed gas purchased at Henry Hub, sold at JKM/TTF-linked prices.',
    keyDrivers: [
      'JKM-Henry Hub spread',
      'Export facility utilisation',
      'Long-term contract re-contracting cycle',
      'US gas supply cost',
    ],
    investmentLens:
      'Primary beneficiary of global LNG tightness and structural US gas cost advantage. Long-term contracts provide cash flow visibility; spot exposure amplifies upside in tight markets.',
    relatedBenchmarks: ['JKM', 'Henry Hub', 'TTF'],
    riskFactors: [
      'Feed gas supply disruption',
      'JKM-Henry Hub spread compression',
      'Liquefaction facility outage',
      'New supply from Qatar and Australia diluting spreads',
    ],
  },
  {
    id: 'exxon',
    name: 'ExxonMobil',
    ticker: 'XOM',
    segment: 'Integrated Oil & Gas',
    segmentCategory: 'integrated',
    marketCap: 'US$450B',
    revenue: 'US$340B',
    fcfStatus: 'Strong — diversified cash flow',
    businessModel: 'Integrated value chain from upstream production to refining and chemicals; natural hedge across segments.',
    keyDrivers: [
      'Brent crude price',
      'Refining crack spread',
      'Guyana and Permian production growth',
      'Chemical margin cycle',
    ],
    investmentLens:
      'Diversified exposure across oil and gas value chain provides resilience. Guyana deepwater and Permian tight oil are key growth engines. Pioneer acquisition adds significant Permian scale.',
    relatedBenchmarks: ['Brent', 'WTI', 'Henry Hub'],
    riskFactors: [
      'Oil price downturn compressing all segments simultaneously',
      'Refining margin collapse',
      'Energy transition capex reallocation pressure',
      'Geopolitical risk in operating regions',
    ],
  },
  {
    id: 'chevron',
    name: 'Chevron',
    ticker: 'CVX',
    segment: 'Integrated Oil & Gas',
    segmentCategory: 'integrated',
    marketCap: 'US$300B',
    revenue: 'US$200B',
    fcfStatus: 'Strong — capital disciplined',
    businessModel: 'Upstream-weighted integrated with Permian, Kazakhstan (TCO), and Australia LNG exposure.',
    keyDrivers: [
      'Oil price',
      'Permian Basin production growth',
      'TCO (Tengizchevroil) expansion',
      'Australia LNG volumes',
    ],
    investmentLens:
      'Capital discipline and shareholder returns focus. Permian growth + LNG exposure provide dual commodity upside. Hess acquisition adds Guyana optionality.',
    relatedBenchmarks: ['Brent', 'WTI'],
    riskFactors: [
      'Permian cost inflation',
      'Kazakhstan project execution risk',
      'Oil price volatility',
      'Hess acquisition integration',
    ],
  },
  {
    id: 'valero',
    name: 'Valero Energy',
    ticker: 'VLO',
    segment: 'Refining',
    segmentCategory: 'downstream',
    marketCap: 'US$45B',
    revenue: 'US$140B',
    fcfStatus: 'Cyclical — crack spread driven',
    businessModel: 'Pure-play refiner; buys crude, sells refined products; margin = crack spread; also growing renewable diesel.',
    keyDrivers: [
      '321 crack spread',
      'Refinery utilisation rate',
      'Crude differential (heavy vs. light)',
      'Renewable diesel margin',
    ],
    investmentLens:
      'Leverage point to refining margin cycle. Complex refinery configuration allows processing heavy, discounted crudes. Renewable diesel provides transition optionality but near-term margin headwinds.',
    relatedBenchmarks: ['Brent', 'WTI', 'WCS'],
    riskFactors: [
      'Crack spread compression from demand slowdown',
      'Crude cost spike reducing margin',
      'Unplanned refinery outage',
      'Long-term EV penetration reducing fuel demand',
    ],
  },
  {
    id: 'slb',
    name: 'SLB',
    ticker: 'SLB',
    segment: 'Oilfield Services',
    segmentCategory: 'oilfield-services',
    marketCap: 'US$60B',
    revenue: 'US$35B',
    fcfStatus: 'Improving — capex cycle tailwind',
    businessModel: 'Technology-intensive oilfield services (drilling, completions, production, digital); leveraged to upstream capex.',
    keyDrivers: [
      'Global upstream capex spending',
      'Offshore and international activity',
      'Digital/AI services penetration',
      'Pricing power in tight services market',
    ],
    investmentLens:
      'Leveraged to ongoing international upstream investment cycle. Offshore deepwater activity recovery is a key catalyst. Digital services margin expansion reduces dependency on cyclical hardware.',
    relatedBenchmarks: ['Brent', 'WTI'],
    riskFactors: [
      'Upstream capex cuts if oil price falls',
      'North America activity slowdown',
      'Pricing pressure from customer cost discipline',
      'Competition from Baker Hughes and Halliburton',
    ],
  },
];

// ─────────────────────────────────────────────
// Supply & Demand — Oil
// ─────────────────────────────────────────────
export const oilSupplyCountries: SupplyCountry[] = [
  { country: 'United States', production: '13.2 mb/d', globalShare: '13.2%', trend: 'up' },
  { country: 'Saudi Arabia', production: '10.5 mb/d', globalShare: '10.5%', trend: 'stable' },
  { country: 'Russia', production: '10.1 mb/d', globalShare: '10.1%', trend: 'down' },
  { country: 'Canada', production: '5.8 mb/d', globalShare: '5.8%', trend: 'up' },
  { country: 'Iraq', production: '4.5 mb/d', globalShare: '4.5%', trend: 'stable' },
  { country: 'Brazil', production: '3.6 mb/d', globalShare: '3.6%', trend: 'up' },
];

export const oilDemandCountries: DemandCountry[] = [
  { country: 'United States', consumption: '20.0 mb/d', globalShare: '20.0%', trend: 'stable' },
  { country: 'China', consumption: '16.5 mb/d', globalShare: '16.5%', trend: 'up' },
  { country: 'India', consumption: '5.5 mb/d', globalShare: '5.5%', trend: 'up' },
  { country: 'Japan', consumption: '3.3 mb/d', globalShare: '3.3%', trend: 'down' },
  { country: 'Saudi Arabia', consumption: '3.2 mb/d', globalShare: '3.2%', trend: 'stable' },
];

export const oilSupplyDemandBalance: SupplyDemandBalance[] = [
  { period: '2023 Q1', balance: 1.2 },
  { period: '2023 Q2', balance: 0.8 },
  { period: '2023 Q3', balance: -0.4 },
  { period: '2023 Q4', balance: 0.5 },
  { period: '2024 Q1', balance: 1.0 },
  { period: '2024 Q2', balance: 0.3 },
  { period: '2024 Q3', balance: -0.8 },
  { period: '2024 Q4', balance: -0.5 },
  { period: '2025 Q1', balance: 0.6 },
  { period: '2025 Q2', balance: -1.2 },
  { period: '2025 Q3', balance: -1.5 },
  { period: '2025 Q4', balance: -2.0 },
  { period: '2026 Q1', balance: -8.0 },
];

export const lngSupplyDemandBalance: SupplyDemandBalance[] = [
  { period: '2023', balance: 5 },
  { period: '2024', balance: 2 },
  { period: '2025', balance: -15 },
  { period: '2026', balance: -40 },
];

// ─────────────────────────────────────────────
// Price Benchmarks
// ─────────────────────────────────────────────
const generatePriceData = (base: number, volatility: number, months: number) => {
  const data = [];
  let price = base;
  const start = new Date('2024-01-01');
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    price = Math.max(base * 0.6, price + (Math.random() - 0.5) * volatility);
    data.push({ date: d.toISOString().slice(0, 7), price: parseFloat(price.toFixed(2)) });
  }
  return data;
};

export const priceBenchmarks: PriceBenchmark[] = [
  {
    id: 'brent',
    name: 'Brent Crude',
    region: 'Global',
    type: 'oil',
    currentPrice: 82.5,
    unit: '$/bbl',
    color: '#22d3ee',
    data: generatePriceData(82, 8, 16),
  },
  {
    id: 'wti',
    name: 'WTI Crude',
    region: 'US',
    type: 'oil',
    currentPrice: 78.2,
    unit: '$/bbl',
    color: '#60a5fa',
    data: generatePriceData(78, 8, 16),
  },
  {
    id: 'dubai',
    name: 'Dubai Crude',
    region: 'Middle East',
    type: 'oil',
    currentPrice: 80.1,
    unit: '$/bbl',
    color: '#34d399',
    data: generatePriceData(80, 7, 16),
  },
  {
    id: 'wcs',
    name: 'WCS',
    region: 'Canada',
    type: 'oil',
    currentPrice: 62.3,
    unit: '$/bbl',
    color: '#f59e0b',
    data: generatePriceData(62, 9, 16),
  },
  {
    id: 'urals',
    name: 'Urals',
    region: 'Russia',
    type: 'oil',
    currentPrice: 65.0,
    unit: '$/bbl',
    color: '#f87171',
    data: generatePriceData(65, 10, 16),
  },
  {
    id: 'jkm',
    name: 'JKM',
    region: 'Asia-Pacific',
    type: 'gas',
    currentPrice: 14.2,
    unit: '$/MMBtu',
    color: '#22d3ee',
    data: generatePriceData(14, 3, 16),
  },
  {
    id: 'ttf',
    name: 'TTF',
    region: 'Europe',
    type: 'gas',
    currentPrice: 11.5,
    unit: '$/MMBtu',
    color: '#60a5fa',
    data: generatePriceData(11, 3, 16),
  },
  {
    id: 'henry-hub',
    name: 'Henry Hub',
    region: 'US',
    type: 'gas',
    currentPrice: 2.8,
    unit: '$/MMBtu',
    color: '#34d399',
    data: generatePriceData(2.8, 0.8, 16),
  },
];

// ─────────────────────────────────────────────
// News Events
// ─────────────────────────────────────────────
export const newsEvents: NewsEvent[] = [
  {
    id: 'n1',
    title: 'Taiwan CPC Signs Long-Term LNG Supply Agreement with Cheniere Energy',
    date: '2025-04-15',
    category: 'Deal / Contract',
    affectedSegments: ['LNG Terminal', 'Midstream'],
    relatedCompanies: ['Cheniere Energy', 'CPC Taiwan'],
    summary:
      'Taiwan\'s state oil company CPC Corporation has signed a 20-year LNG supply agreement with Cheniere Energy, securing approximately 2 mtpa of US LNG production.',
    whyItMatters:
      'Long-term contracts improve revenue visibility and FCF predictability for Cheniere while locking in supply security for Taiwan, reducing spot market dependency.',
    potentialBeneficiaries: ['Cheniere Energy', 'US LNG exporters', 'LNG shipping companies'],
    potentialLosers: ['Spot LNG traders', 'Qatar-linked LNG suppliers competing for Asian market share'],
    importance: 'High',
  },
  {
    id: 'n2',
    title: 'Hormuz Strait Disruption Risk Escalates — Naval Incident Raises Shipping Insurance Costs',
    date: '2025-04-20',
    category: 'Geopolitics',
    affectedSegments: ['Midstream Shipping', 'LNG Terminal', 'Refining'],
    relatedCompanies: ['Saudi Aramco', 'ExxonMobil', 'Shell', 'BP', 'Cheniere Energy'],
    summary:
      'Heightened naval tensions in the Strait of Hormuz have triggered a 35% spike in war-risk shipping insurance premiums. Approximately 20% of global seaborne oil and LNG transits through the strait.',
    whyItMatters:
      'The Hormuz Strait is the single most critical chokepoint in global oil and gas trade. Disruption would simultaneously tighten supply to Asia, Europe, and refining hubs worldwide.',
    potentialBeneficiaries: ['US LNG exporters (alternative route)', 'West African oil producers', 'LNG shipping companies (higher rates)'],
    potentialLosers: ['Asian LNG buyers', 'Oil importers', 'Airlines', 'Power utilities in LNG-dependent markets'],
    importance: 'High',
  },
  {
    id: 'n3',
    title: 'JKM-Henry Hub Spread Widens to Multi-Year High Amid Asian Demand Recovery',
    date: '2025-04-18',
    category: 'Price',
    affectedSegments: ['LNG Terminal', 'Midstream'],
    relatedCompanies: ['Cheniere Energy', 'QatarEnergy', 'Shell LNG', 'Tokyo Gas', 'Kogas'],
    summary:
      'The JKM-Henry Hub spread has widened to over $11/MMBtu, reflecting accelerating LNG demand from Japan, South Korea, and Taiwan during a prolonged cold snap.',
    whyItMatters:
      'A wide JKM-Henry Hub spread directly improves US LNG export economics and incentivises additional spot cargo diversions to Asia, further tightening Atlantic Basin supply.',
    potentialBeneficiaries: ['Cheniere Energy', 'US LNG exporters', 'LNG spot traders'],
    potentialLosers: ['Asian LNG buyers without long-term contracts', 'Gas-fired power utilities in Japan and Korea'],
    importance: 'High',
  },
  {
    id: 'n4',
    title: 'Unplanned Refinery Outage Tightens US Gulf Coast Product Supply',
    date: '2025-04-10',
    category: 'Supply',
    affectedSegments: ['Refining', 'Downstream'],
    relatedCompanies: ['Valero Energy', 'Marathon Petroleum', 'Phillips 66'],
    summary:
      'A major refinery on the US Gulf Coast has declared force majeure following an unexpected unit failure, taking approximately 300,000 bpd of refining capacity offline for an estimated 6-8 weeks.',
    whyItMatters:
      'Product shortages in the US Gulf Coast typically lift crack spreads regionally and can tighten global jet fuel and diesel markets if the outage coincides with high demand periods.',
    potentialBeneficiaries: ['Refiners in unaffected regions (higher crack spreads)', 'Petroleum product importers with existing inventory'],
    potentialLosers: ['Local fuel distributors', 'Airlines dependent on USGC jet supply', 'Industrial consumers'],
    importance: 'Medium',
  },
  {
    id: 'n5',
    title: 'OPEC+ Agrees to Extend Production Cuts Through End of 2025',
    date: '2025-04-05',
    category: 'Supply',
    affectedSegments: ['Upstream', 'Production'],
    relatedCompanies: ['Saudi Aramco', 'National Iranian Oil Company', 'Abu Dhabi National Oil Company'],
    summary:
      'OPEC+ members have reached agreement to maintain existing production cut commitments through Q4 2025, citing concerns about demand uncertainty and rising non-OPEC supply.',
    whyItMatters:
      'Production cuts provide a price floor for crude but also create incentive for non-OPEC producers (US, Brazil, Canada) to capture market share at elevated prices.',
    potentialBeneficiaries: ['US shale producers', 'Brazilian deepwater (Petrobras)', 'Integrated majors with upstream leverage'],
    potentialLosers: ['OPEC+ members sacrificing volume for price (opportunity cost)', 'Asian refiners paying higher crude feedstock costs'],
    importance: 'High',
  },
  {
    id: 'n6',
    title: 'IEA Warns of Structural LNG Supply Deficit Through 2027',
    date: '2025-03-28',
    category: 'Demand',
    affectedSegments: ['LNG Terminal', 'Midstream'],
    relatedCompanies: ['Cheniere Energy', 'QatarEnergy', 'Venture Global', 'TotalEnergies'],
    summary:
      'The International Energy Agency has published a report forecasting a structural LNG supply deficit of 25-40 mtpa through 2026-2027 as new capacity additions face construction delays.',
    whyItMatters:
      'Structural deficits force buyers to pay spot premiums and accelerate long-term contract signings at elevated prices, compressing margins for end-users while benefiting exporters.',
    potentialBeneficiaries: ['All LNG exporters with available capacity', 'LNG shipping companies', 'LNG trading desks'],
    potentialLosers: ['Countries with high LNG dependency and limited contract coverage', 'Industrial gas users in Europe and Asia'],
    importance: 'High',
  },
];

// ─────────────────────────────────────────────
// Impact Scenarios (Value Chain Shock Analysis)
// ─────────────────────────────────────────────
export const impactScenarios: ImpactScenario[] = [
  {
    id: 'hormuz',
    title: 'Hormuz Strait Disruption',
    affectedSegments: ['Midstream Shipping', 'LNG Terminal', 'Refining', 'Power Generation'],
    likelyPriceImpact:
      'Brent +$15–25/bbl within 48 hours; JKM +$5–8/MMBtu; shipping insurance rates spike 30–50%; jet fuel and diesel premiums widen sharply.',
    beneficiaries: [
      'US LNG exporters (Cheniere — alternative Atlantic route)',
      'West African oil producers',
      'LNG shipping companies (rate spike)',
      'US refiners (domestic crude advantage)',
    ],
    losers: [
      'Asian LNG buyers (supply disruption)',
      'Middle East oil-dependent refiners',
      'Airlines (jet fuel cost spike)',
      'Gas-fired power utilities in Japan, Korea, Taiwan',
    ],
    metricsToMonitor: [
      'JKM spot price',
      'Brent-Dubai spread',
      'LNG shipping rates (BLNG index)',
      'War-risk insurance premiums',
      'Asian refinery crack spreads',
    ],
  },
  {
    id: 'qatar-attack',
    title: 'Qatar LNG Facility Attack',
    affectedSegments: ['LNG Terminal', 'Midstream', 'Power Generation'],
    likelyPriceImpact:
      'JKM +$8–15/MMBtu immediately; TTF sympathy move +$4–6/MMBtu; Qatar accounts for ~20% of global LNG supply.',
    beneficiaries: [
      'Cheniere Energy (alternative US supply)',
      'Australian LNG exporters',
      'LNG shipping companies (re-routing premium)',
      'US gas producers (Henry Hub lift)',
    ],
    losers: [
      'Japanese, Korean, Taiwanese LNG buyers (major Qatar contract holders)',
      'European gas utilities',
      'Gas-fired power plants in LNG-dependent markets',
    ],
    metricsToMonitor: [
      'JKM-Henry Hub spread',
      'Global LNG spot availability',
      'Qatar production restoration timeline',
      'Asian utility fuel switching economics',
    ],
  },
  {
    id: 'asia-demand',
    title: 'Sudden Demand Recovery in Asia',
    affectedSegments: ['Upstream', 'LNG Terminal', 'Midstream', 'Refining'],
    likelyPriceImpact:
      'Brent +$8–12/bbl; JKM +$3–5/MMBtu; refining margins widen on product demand pull; upstream producers see volume and price upside.',
    beneficiaries: [
      'Upstream producers (volume + price)',
      'Integrated oil majors',
      'LNG exporters (JKM uplift)',
      'Refiners serving Asian markets',
    ],
    losers: [
      'Energy-intensive industries facing higher feedstock costs',
      'Airlines (jet fuel spike)',
      'Chemical producers (naphtha cost pressure)',
    ],
    metricsToMonitor: [
      'China oil import data',
      'Asian LNG spot tender volume',
      'Brent price',
      'JKM spot',
      'Chinese refinery utilisation',
    ],
  },
  {
    id: 'refinery-outage',
    title: 'Major Refinery Outage',
    affectedSegments: ['Refining', 'Downstream', 'Power Generation'],
    likelyPriceImpact:
      'Regional crack spreads +$8–15/bbl; product premiums (jet, diesel) spike; crude oil demand softens temporarily (less crude to process).',
    beneficiaries: [
      'Refiners in unaffected regions (higher crack spreads)',
      'Product importers with existing inventory',
      'Petroleum product traders with length',
    ],
    losers: [
      'Local fuel consumers and distributors',
      'Airlines dependent on affected supply hub',
      'Industrial users reliant on regional product supply',
    ],
    metricsToMonitor: [
      '321 crack spread',
      'Regional product premiums (diesel, jet)',
      'Refinery utilisation rate',
      'Outage duration and restart schedule',
    ],
  },
];

// ─────────────────────────────────────────────
// Beneficiary / Loser Matrix
// ─────────────────────────────────────────────
export const beneficiaryMatrix: BeneficiaryMatrix[] = [
  {
    event: 'LNG Shortage',
    beneficiaries: ['Cheniere Energy', 'LNG shipping companies', 'Alternative gas suppliers', 'US gas producers'],
    losers: ['Asian power utilities', 'LNG importers without contract coverage', 'Gas-intensive industries'],
  },
  {
    event: 'Oil Price Spike',
    beneficiaries: ['Upstream producers', 'Integrated oil majors', 'US shale operators', 'National oil companies'],
    losers: ['Airlines', 'Fuel-intensive industries', 'Petrochemical producers (naphtha feedstock)', 'Consumers'],
  },
  {
    event: 'Refinery Outage',
    beneficiaries: ['Refiners in unaffected regions', 'Product traders', 'Import terminal operators'],
    losers: ['Local fuel distributors', 'Airlines', 'Industrial consumers in affected region'],
  },
];
