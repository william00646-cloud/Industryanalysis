#!/usr/bin/env node

/**
 * SectorScope public data refresh pipeline.
 *
 * Sources:
 * - EIA API v2 (official energy data; requires free EIA_API_KEY)
 * - SEC EDGAR companyfacts API (official filings data; requires declared User-Agent)
 * - GDELT 2.1 Document API (public news/event discovery)
 *
 * This writes src/data/generated/liveData.json.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'src/data/generated/liveData.json');

async function loadDotEnv() {
  const envFile = path.join(root, '.env');
  try {
    const text = await readFile(envFile, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const index = line.indexOf('=');
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
      if (key && process.env[key] == null) process.env[key] = value;
    }
  } catch {
    // .env is optional; CI usually passes env vars directly.
  }
}

await loadDotEnv();

const EIA_API_KEY = process.env.EIA_API_KEY ?? '';
const SEC_USER_AGENT = process.env.SEC_USER_AGENT ?? 'SectorScope Prototype contact@example.com';

const now = new Date().toISOString();

const sources = [];
const benchmarks = [];
const companyFinancials = [];
const news = [];

function status(id, name, url, status, message, updatedAt) {
  sources.push({ id, name, url, status, message, updatedAt });
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SectorScope Prototype',
        ...(options.headers ?? {}),
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeEiaRows(raw) {
  const rows = raw?.response?.data ?? raw?.series?.[0]?.data ?? [];
  return rows
    .map(row => {
      if (Array.isArray(row)) return { date: String(row[0]), value: Number(row[1]) };
      return {
        date: String(row.period ?? row.date ?? row[0] ?? ''),
        value: Number(row.value ?? row.price ?? row[1]),
      };
    })
    .filter(row => row.date && Number.isFinite(row.value))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function updateEia() {
  const url = 'https://www.eia.gov/opendata/';
  if (!EIA_API_KEY) {
    status('eia', 'U.S. Energy Information Administration API v2', url, 'skipped', 'Set EIA_API_KEY to fetch official daily energy price series.');
    return;
  }

  const series = [
    { id: 'brent', sourceSeries: 'PET.RBRTE.D' },
    { id: 'wti', sourceSeries: 'PET.RWTC.D' },
    { id: 'henry-hub', sourceSeries: 'NG.RNGWHHD.D' },
  ];

  try {
    for (const item of series) {
      const endpoint = `https://api.eia.gov/v2/seriesid/${item.sourceSeries}?api_key=${encodeURIComponent(EIA_API_KEY)}`;
      const raw = await fetchJson(endpoint);
      const points = normalizeEiaRows(raw).slice(-90);
      if (points.length > 0) {
        benchmarks.push({
          id: item.id,
          source: 'EIA API v2',
          sourceSeries: item.sourceSeries,
          asOf: points[points.length - 1].date,
          points,
        });
      }
    }
    status('eia', 'U.S. Energy Information Administration API v2', url, 'ok', `Fetched ${benchmarks.length} benchmark series.`, now);
  } catch (error) {
    status('eia', 'U.S. Energy Information Administration API v2', url, 'error', error instanceof Error ? error.message : String(error));
  }
}

const cikMap = [
  { id: 'lng', ticker: 'LNG', cik: '0000003570' },
  { id: 'xom', ticker: 'XOM', cik: '0000034088' },
  { id: 'cvx', ticker: 'CVX', cik: '0000093410' },
  { id: 'vlo', ticker: 'VLO', cik: '0001035002' },
  { id: 'mpc', ticker: 'MPC', cik: '0001510295' },
  { id: 'slb', ticker: 'SLB', cik: '0000087347' },
  { id: 'hal', ticker: 'HAL', cik: '0000045012' },
  { id: 'rig', ticker: 'RIG', cik: '0001451505' },
  { id: 'kmi', ticker: 'KMI', cik: '0001506307' },
];

function latestFact(facts, tags, units = ['USD']) {
  for (const tag of tags) {
    const concept = facts?.facts?.['us-gaap']?.[tag];
    if (!concept?.units) continue;
    for (const unit of units) {
      const values = concept.units[unit];
      if (!Array.isArray(values)) continue;
      const annual = values
        .filter(v => Number.isFinite(Number(v.val)) && (v.form === '10-K' || v.fp === 'FY'))
        .sort((a, b) => String(a.end).localeCompare(String(b.end)));
      const picked = annual[annual.length - 1] ?? values[values.length - 1];
      if (picked) return picked;
    }
  }
  return undefined;
}

async function updateSec() {
  const url = 'https://data.sec.gov/api/xbrl/companyfacts/';
  try {
    for (const c of cikMap) {
      const facts = await fetchJson(`${url}CIK${c.cik}.json`, {
        headers: {
          'User-Agent': SEC_USER_AGENT,
          'Accept-Encoding': 'gzip, deflate',
        },
      });
      const revenue = latestFact(facts, ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'SalesRevenueNet']);
      const operatingCashFlow = latestFact(facts, ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations']);
      const assets = latestFact(facts, ['Assets']);
      companyFinancials.push({
        id: c.id,
        ticker: c.ticker,
        cik: c.cik,
        source: 'SEC EDGAR companyfacts',
        asOf: revenue?.end ?? operatingCashFlow?.end ?? assets?.end ?? now,
        fiscalPeriod: revenue?.fy ? `${revenue.fy}${revenue.fp ? ` ${revenue.fp}` : ''}` : undefined,
        revenue: revenue ? Number(revenue.val) : undefined,
        operatingCashFlow: operatingCashFlow ? Number(operatingCashFlow.val) : undefined,
        assets: assets ? Number(assets.val) : undefined,
      });
    }
    status('sec', 'SEC EDGAR companyfacts API', url, 'ok', `Fetched ${companyFinancials.length} company financial profiles.`, now);
  } catch (error) {
    status('sec', 'SEC EDGAR companyfacts API', url, 'error', error instanceof Error ? error.message : String(error));
  }
}

async function updateGdelt() {
  const url = 'https://api.gdeltproject.org/api/v2/doc/doc';
  const query = 'LNG OR crude oil OR natural gas OR OPEC OR refinery sourcelang:english';
  const endpoint = `${url}?query=${encodeURIComponent(query)}&mode=ArtList&format=json&maxrecords=20&sort=DateDesc`;
  try {
    const raw = await fetchJson(endpoint);
    const articles = Array.isArray(raw?.articles) ? raw.articles : [];
    for (const [index, article] of articles.entries()) {
      news.push({
        id: `gdelt-${index + 1}`,
        title: article.title ?? 'Untitled article',
        url: article.url ?? '',
        source: 'GDELT 2.1 Document API',
        publishedAt: article.seendate ?? article.socialimage ?? now,
        domain: article.domain,
        category: inferNewsCategory(article.title ?? ''),
      });
    }
    status('gdelt', 'GDELT 2.1 Document API', url, 'ok', `Fetched ${news.length} public news articles.`, now);
  } catch (error) {
    status('gdelt', 'GDELT 2.1 Document API', url, 'error', error instanceof Error ? error.message : String(error));
  }
}

function inferNewsCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('opec') || t.includes('cut') || t.includes('production')) return 'Supply';
  if (t.includes('price') || t.includes('spread') || t.includes('futures')) return 'Price';
  if (t.includes('contract') || t.includes('deal')) return 'Deal / Contract';
  if (t.includes('lng') || t.includes('gas')) return 'Supply';
  return 'Company';
}

await updateEia();
await updateSec();
await updateGdelt();

const okCount = sources.filter(s => s.status === 'ok').length;
const bundle = {
  meta: {
    generatedAt: now,
    mode: okCount === 0 ? 'demo' : okCount === sources.length ? 'live' : 'partial',
    disclaimer: 'Public-source refresh output. Some terminal views may still use demo estimates where public data is unavailable. Not real-time financial data.',
  },
  sources,
  benchmarks,
  companyFinancials,
  news,
};

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(bundle, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, outFile)} (${bundle.meta.mode}, ${okCount}/${sources.length} sources ok)`);
