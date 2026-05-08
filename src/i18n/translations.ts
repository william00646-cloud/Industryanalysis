import type { Lang } from '../context/LanguageContext';

// ─── Translation table ────────────────────────────────────────────────────────
const translations = {
  // Topbar page titles & subtitles
  topbar: {
    overview:        { en: 'Executive Overview',       zh: '執行摘要' },
    overviewSub:     { en: 'Top signals and industry snapshot', zh: '關鍵訊號與產業快照' },
    industryMap:     { en: 'Industry Map',             zh: '產業地圖' },
    industryMapSub:  { en: 'Segment structure and value chain navigation', zh: '產業分段結構與價值鏈導覽' },
    marketStructure: { en: 'Market Structure',         zh: '市場結構' },
    marketStructureSub: { en: 'Where is the money in this industry?', zh: '這個產業的錢在哪裡？' },
    valueChain:      { en: 'Value Chain Analysis',     zh: '價值鏈分析' },
    valueChainSub:   { en: 'How is value created across each segment?', zh: '每個環節如何創造價值？' },
    supplyDemand:    { en: 'Supply & Demand',          zh: '供需分析' },
    supplyDemandSub: { en: 'Who supplies? Who demands? Where is the gap?', zh: '誰供給？誰需求？缺口在哪裡？' },
    priceMonitor:    { en: 'Price Monitor',            zh: '價格監控' },
    priceMonitorSub: { en: 'Benchmarks, spreads, and regional tightness', zh: '基準價、價差與區域緊俏程度' },
    companyTracker:  { en: 'Company Tracker',          zh: '公司追蹤' },
    companyTrackerSub: { en: 'Company positioning, drivers, and investment lens', zh: '公司定位、驅動因素與投資觀點' },
    newsMonitor:     { en: 'News Monitor',             zh: '新聞監控' },
    newsMonitorSub:  { en: 'Events → industry impact → company signals', zh: '事件 → 產業影響 → 公司訊號' },
    demo:            { en: 'Demo data for product prototype', zh: '示範資料 — 產品原型' },
  },

  // Sidebar
  sidebar: {
    currentIndustry: { en: 'Current Industry', zh: '目前產業' },
    intelligence:    { en: 'Industry Intelligence', zh: '產業分析平台' },
    demoNote:        { en: 'Demo data — prototype v0.2', zh: '示範資料 — 原型 v0.2' },
    nav: {
      overview:       { label: { en: 'Overview',         zh: '總覽' },        hint: { en: 'Executive summary',     zh: '執行摘要' } },
      industryMap:    { label: { en: 'Industry Map',     zh: '產業地圖' },    hint: { en: 'Structure & segments',  zh: '結構與分段' } },
      marketStructure:{ label: { en: 'Market Structure', zh: '市場結構' },    hint: { en: 'Value pools',           zh: '價值池' } },
      valueChain:     { label: { en: 'Value Chain',      zh: '價值鏈' },      hint: { en: 'How value is created',  zh: '價值如何創造' } },
      supplyDemand:   { label: { en: 'Supply & Demand',  zh: '供需分析' },    hint: { en: 'Who buys & sells',      zh: '誰買誰賣' } },
      priceMonitor:   { label: { en: 'Price Monitor',    zh: '價格監控' },    hint: { en: 'Benchmarks & spreads',  zh: '基準價與價差' } },
      companyTracker: { label: { en: 'Company Tracker',  zh: '公司追蹤' },    hint: { en: 'Investment lens',       zh: '投資視角' } },
      newsMonitor:    { label: { en: 'News Monitor',     zh: '新聞監控' },    hint: { en: 'Events → signals',      zh: '事件 → 訊號' } },
    },
  },

  // Pages — shared section labels
  page: {
    // Overview
    keyMetrics:          { en: 'Key Metrics',           zh: '關鍵指標' },
    keyMetricsSub:       { en: 'Industry snapshot',     zh: '產業快照' },
    threeSignals:        { en: 'Three Key Signals',     zh: '三大關鍵訊號' },
    threeSignalsSub:     { en: 'What to focus on right now', zh: '現在最重要的三件事' },
    threeSignalsHint:    { en: 'What are the three most important things in this industry right now?', zh: '這個頁面回答：這個產業現在最重要的三件事是什麼？' },
    analysisPath:        { en: 'Analysis Path',         zh: '分析路徑' },
    analysisPathSub:     { en: 'The structured journey from market event to investment thesis', zh: '從市場事件到投資論點的結構化流程' },
    analysisPathNote:    { en: 'This is the core analytical workflow. Each section of SectorScope corresponds to one step in this path.', zh: '這是核心分析流程。SectorScope 的每個分頁對應其中一個步驟。' },
    highImpactEvents:    { en: 'High-Impact Events',    zh: '高衝擊事件' },
    highImpactEventsSub: { en: 'Latest news affecting this industry', zh: '近期影響此產業的重要新聞' },
    highImpact:          { en: 'High Impact',           zh: '高衝擊' },
    companiesToWatch:    { en: 'Companies to Watch',    zh: '重點公司' },
    companiesToWatchSub: { en: 'Key players across the value chain', zh: '橫跨價值鏈的關鍵企業' },
    industryCoverage:    { en: 'Industry Coverage',     zh: '產業覆蓋' },

    // Industry Map
    industryMapTitle:    { en: 'Industry Map',          zh: '產業地圖' },
    industryMapSub:      { en: 'Interactive segment explorer — click any node to view details', zh: '互動式分段瀏覽器 — 點擊任意節點查看詳情' },
    industryMapHint:     { en: 'How do upstream, midstream, and downstream divide the work? How does each segment earn?', zh: '這個頁面回答：這個產業的上中下游如何分工？每個環節靠什麼賺錢？' },
    eventImpactExample:  { en: 'Event Impact Example',  zh: '事件衝擊示例' },
    eventImpactSub:      { en: 'How a shock propagates through the value chain', zh: '衝擊如何沿價值鏈傳播' },

    // Market Structure
    marketStructureTitle:    { en: 'Market Structure',  zh: '市場結構' },
    marketStructureSub:      { en: 'Where is the money in',  zh: '這個產業的錢在哪裡：' },
    marketStructureHint:     { en: 'Where is the money? How large is each segment\'s value pool?', zh: '這個頁面回答：這個產業的錢在哪裡？各環節價值池有多大？' },
    totalMarket:             { en: 'Total Market',      zh: '市場總規模' },
    marketNote:              { en: 'Global market estimate, 2024–2025. Demo data for product prototype.', zh: '全球市場估計，2024–2025 年。產品原型示範資料。' },
    valuePools:              { en: 'Value Pool Breakdown', zh: '價值池分布' },
    marketSizeBySegment:     { en: 'Market Size by Segment', zh: '各分段市場規模' },
    segmentRanking:          { en: 'Segment Ranking',   zh: '分段排名' },
    segment:                 { en: 'Segment',           zh: '分段' },
    marketSize:              { en: 'Market Size',       zh: '市場規模' },
    share:                   { en: 'Share',             zh: '佔比' },
    businessModel:           { en: 'Business Model',   zh: '商業模式' },
    keyRisk:                 { en: 'Key Risk',          zh: '主要風險' },

    // Value Chain
    valueChainTitle:     { en: 'Value Chain Analysis',  zh: '價值鏈分析' },
    valueChainSub:       { en: 'Click any segment to explore its commercial model and risks', zh: '點擊任意分段，探索其商業模式與風險' },
    valueChainHint:      { en: 'How does the industry create value? How does each segment charge and bear risk?', zh: '這個頁面回答：產業如何創造價值？每個環節靠什麼收費、承擔什麼風險？' },
    shockAnalysis:       { en: 'Value Chain Shock Analysis', zh: '價值鏈衝擊分析' },
    shockAnalysisSub:    { en: 'Select an event to see which segments are affected and who wins / loses', zh: '選擇情境，查看哪些環節受影響及誰獲益誰受損' },
    selectScenario:      { en: 'Select Shock Scenario', zh: '選擇衝擊情境' },

    // Supply & Demand
    supplyDemandTitle:   { en: 'Supply & Demand',       zh: '供需分析' },
    supplyDemandSub:     { en: 'Who supplies, who demands, and where is the gap?', zh: '誰供給、誰需求、缺口在哪裡？' },
    supplyDemandHint:    { en: 'Who supplies? Who demands? Is there a gap? How severe?', zh: '這個頁面回答：誰供給？誰需求？市場有沒有缺口？缺口有多嚴重？' },
    supplyBalance:       { en: 'Supply-Demand Balance',  zh: '供需平衡' },
    balanceNote:         { en: 'Positive = surplus; Negative = deficit', zh: '正值 = 供過於求；負值 = 供不應求' },
    inventoryNote:       { en: 'Inventory Note',        zh: '庫存備注' },
    interpretation:      { en: 'Interpretation',        zh: '解讀' },
    name:                { en: 'Name',                  zh: '名稱' },
    production:          { en: 'Production',            zh: '產量' },
    consumption:         { en: 'Consumption',           zh: '消費量' },
    globalShare:         { en: 'Global Share',          zh: '全球佔比' },
    trend:               { en: 'Trend',                 zh: '趨勢' },

    // Price Monitor
    priceMonitorTitle:   { en: 'Price Monitor',         zh: '價格監控' },
    priceMonitorSub:     { en: 'How do prices and spreads reveal where the market is tightest?', zh: '價格與價差如何揭示市場最緊俏的地方？' },
    priceMonitorHint:    { en: 'Prices are not just up or down — spreads are the more valuable signal.', zh: '價格不是只有漲跌，價差才是更有價值的訊號。' },
    tightnessMonitor:    { en: 'Market Tightness Monitor', zh: '市場緊俏監控' },
    currentPrices:       { en: 'Current Benchmark Prices', zh: '當前基準價格' },
    benchmarks:          { en: 'Benchmarks',            zh: '基準' },
    spreadMonitor:       { en: 'Spread Monitor',        zh: '價差監控' },

    // Company Tracker
    companyTrackerTitle: { en: 'Company Tracker',       zh: '公司追蹤' },
    companyTrackerSub:   { en: 'Who is positioned where in the value chain — and what does it mean for investors?', zh: '哪些公司在價值鏈的哪個位置，對投資人意味著什麼？' },
    companyTrackerHint:  { en: 'Which companies benefit or suffer from which events?', zh: '這個頁面回答：哪些公司因為哪個事件而受益或受害？' },
    beneficiaryMatrix:   { en: 'Beneficiary / Loser Matrix', zh: '受益者 / 受損者矩陣' },
    beneficiaryMatrixSub:{ en: 'How events map to company winners and losers', zh: '事件如何對應到公司的受益者與受損者' },
    event:               { en: 'Event',                 zh: '事件' },
    beneficiaries:       { en: 'Beneficiaries',         zh: '受益者' },
    losers:              { en: 'Losers',                zh: '受損者' },
    marketCap:           { en: 'Market Cap',            zh: '市值' },
    revenue:             { en: 'Revenue',               zh: '營收' },
    fcfStatus:           { en: 'FCF Status',            zh: '自由現金流狀態' },
    investmentThesis:    { en: 'Investment Thesis',     zh: '投資論點' },
    riskFactors:         { en: 'Risk Factors',          zh: '風險因素' },
    keyDrivers:          { en: 'Key Drivers',           zh: '關鍵驅動因素' },
    relatedBenchmarks:   { en: 'Related Benchmarks',   zh: '相關基準' },
    noCompanies:         { en: 'No companies match this filter.', zh: '沒有符合篩選條件的公司。' },

    // News Monitor
    newsMonitorTitle:    { en: 'News Monitor',          zh: '新聞監控' },
    newsMonitorSub:      { en: 'Events → value chain impact → company winners and losers', zh: '事件 → 價值鏈衝擊 → 公司受益者與受損者' },
    newsMonitorHint:     { en: 'What do the latest industry news mean? Which segment and company are affected?', zh: '這個頁面回答：最新的產業新聞代表什麼？對哪個環節、哪家公司有影響？' },
    searchPlaceholder:   { en: 'Search news, companies, segments…', zh: '搜尋新聞、公司、分段…' },
    category:            { en: 'Category',              zh: '類別' },
    importance:          { en: 'Importance',            zh: '重要性' },
    showing:             { en: 'Showing',               zh: '顯示' },
    of:                  { en: 'of',                    zh: '共' },
    events:              { en: 'events',                zh: '筆事件' },
    noEvents:            { en: 'No events match your filters.', zh: '沒有符合篩選條件的事件。' },
    howToUse:            { en: 'How to Use This Page',  zh: '如何使用此頁面' },
    howToUseText:        { en: 'Each news card includes an analysis of which value chain segments are affected, which companies may benefit or be hurt, and why it matters for the broader industry. Use the analysis path News Event → Value Chain → Supply/Demand → Price → Company Thesis to systematically convert market events into actionable investment or strategy insights.', zh: '每張新聞卡片包含對受影響價值鏈環節、潛在受益或受損公司的分析，以及其對整體產業的意義。使用「新聞事件 → 價值鏈 → 供需 → 價格 → 公司論點」分析路徑，系統性地將市場事件轉化為可操作的投資或策略洞察。' },
    analysisPathLabel:   { en: 'News Event → Value Chain → Supply/Demand → Price → Company Thesis', zh: '新聞事件 → 價值鏈 → 供需 → 價格 → 公司論點' },
  },
} as const;

// Helper: pick text by current language
export function t(
  key: keyof typeof translations['page'] | keyof typeof translations['topbar'] | keyof typeof translations['sidebar'],
  section: 'page' | 'topbar' | 'sidebar',
  lang: Lang
): string {
  const block = translations[section] as Record<string, { en: string; zh: string }>;
  return block[key]?.[lang] ?? key;
}

// Simpler per-section helpers
export function useT(lang: Lang) {
  return {
    page: (key: keyof typeof translations['page']) =>
      (translations.page[key] as { en: string; zh: string })[lang],
    topbar: (key: keyof typeof translations['topbar']) =>
      (translations.topbar[key] as { en: string; zh: string })[lang],
    sidebar: (key: keyof typeof translations['sidebar']) =>
      (translations.sidebar[key] as { en: string; zh: string })[lang],
    nav: (pageId: keyof typeof translations['sidebar']['nav'], field: 'label' | 'hint') =>
      translations.sidebar.nav[pageId][field][lang],
  };
}
