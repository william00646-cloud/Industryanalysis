# SectorScope

**Bloomberg-like Industry Intelligence Terminal prototype**

SectorScope is a high-density industry intelligence terminal for institutional investors, industry analysts, and strategy teams. It uses the functional spirit of a professional market terminal: market monitoring, industry news, company screening, event impact analysis, watchlists, and analyst research notes. It does not copy any third-party brand, proprietary interface, logo, font, or data.

First industry demo: **Oil & Gas**. The architecture also supports additional industries through the existing multi-industry data bundle.

> Demo data for product prototype. Not real-time financial data.

## Quick Start

```bash
npm install
npm run dev
npm run build
npm run data:update
```

The Vite dev server usually opens at `http://localhost:5173`.

## Deploy to Zeabur

SectorScope can be deployed to Zeabur as a static Vite site.

Recommended setup:

1. Push this project to GitHub.
2. In Zeabur, create a new project and import the GitHub repository.
3. Zeabur will install dependencies and run the build script.
4. The build output is `dist`, configured in `zbpack.json`:

```json
{
  "output_dir": "dist"
}
```

Environment variables to add in Zeabur:

```bash
EIA_API_KEY=your_eia_key
SEC_USER_AGENT=SectorScope your-email@example.com
```

For daily data updates, keep the GitHub Actions workflow enabled. It runs `npm run data:update`, commits `src/data/generated/liveData.json`, and Zeabur redeploys when the linked GitHub branch receives the daily commit.

Alternative: set Zeabur's build command to `npm run data:update && npm run build` if you want data refreshed on every Zeabur deployment. This does not create a daily refresh by itself unless a scheduled redeploy or GitHub Actions commit triggers it.

## Terminal Features

| Feature | Description |
|---|---|
| Fixed Market Ticker Bar | Brent, WTI, Dubai, JKM, TTF, Henry Hub, JKM-HH spread, Brent-WTI spread |
| Terminal Sidebar | 12-page financial-terminal style navigation |
| Live Intelligence Panel | Right-side live signals, alerts, quick actions, and mini news feed |
| Command Palette | `Cmd+K` / `Ctrl+K` search for pages, companies, benchmarks, and events |
| Watchlist | LocalStorage-backed company and benchmark tracking |
| Research Notes | LocalStorage-backed analyst notes with templates |

## Pages

| Page | Purpose |
|---|---|
| Command Center | Executive brief, market pulse, movers, signals, watchlist snapshot, event feed |
| Market Monitor | Oil and gas benchmark table, sparklines, volatility, regional stress heatmap |
| Industry Map | Interactive value chain / segment map |
| Value Chain | Segment commercial model and shock analysis |
| Supply / Demand | Supply-demand tabs and balance charts |
| Price & Spread | Benchmark charts, spread cards, z-scores, alerts, scenario markers |
| Company Screener | Search, filter, sort, and open company research workspaces |
| Company Workspace | Company header, business model, thesis cases, peer table, related news, notes |
| News Terminal | Three-panel news terminal with impact analysis and simulated AI-style summary |
| Event Impact | Event-to-value-chain-to-company transmission analysis |
| Watchlist | Tracked companies and benchmarks with add/remove actions |
| Research Notes | Analyst note workspace with templates and local persistence |

## Data Model

Data is centralized under `src/data/`:

| File | Contents |
|---|---|
| `src/data/terminal.ts` | Terminal ticker, benchmark, spread, company universe, watchlist defaults, news events, impact scenarios, note templates, command palette items |
| `src/data/liveData.ts` | Maps refreshed public-source data into the terminal UI |
| `src/data/generated/liveData.json` | Daily refresh output written by `npm run data:update` |
| `src/data/mockIndustry.ts` | Original industry mock data and terminal re-exports for backwards compatibility |
| `src/data/industries/` | Multi-industry bundles for Oil & Gas, Semiconductor, Healthcare, FMCG, Automotive, PC, and Mobile |

## Public Data Sources

The terminal now has a daily public-data pipeline. It uses official/public sources where available and falls back clearly to demo estimates where public daily data is unavailable.

| Source | Use | Key Required | Notes |
|---|---|---:|---|
| U.S. Energy Information Administration API v2 | Brent, WTI, Henry Hub daily price history | Yes | Set `EIA_API_KEY`; free registration through EIA Open Data |
| SEC EDGAR companyfacts API | Public company revenue, operating cash flow, assets | No | Set `SEC_USER_AGENT`; SEC requires declared User-Agent |
| GDELT 2.1 Document API | Public industry news/event discovery | No | Used for daily event feed candidates |
| World Bank Pink Sheet | Monthly commodity reference data | No | Recommended for monthly macro/commodity validation; not used in the no-dependency daily script yet |

Create local environment variables from `.env.example`:

```bash
export EIA_API_KEY="your_free_eia_key"
export SEC_USER_AGENT="SectorScope Prototype your-email@example.com"
npm run data:update
```

For GitHub daily refresh, add repository secrets:

- `EIA_API_KEY`
- `SEC_USER_AGENT`

The workflow `.github/workflows/update-data.yml` runs daily and commits updates to `src/data/generated/liveData.json`.

## Persistence

The first version uses browser `localStorage`:

- `sectorscope_watchlist_companies`
- `sectorscope_watchlist_benchmarks`
- `sectorscope_research_notes`
- `sectorscope_company_note_<companyId>`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | lucide-react |
| Routing | React state-based page switching |
| Storage | localStorage |

## Future Roadmap

1. Real-time commodity price API integration
2. SEC / company financial data integration
3. AI-generated executive summary
4. AI event impact analysis
5. Multi-industry terminal templates
6. User watchlist and saved thesis sync
7. News RSS ingestion and auto-tagging
8. Scenario modeling for supply-demand shocks
9. Export to PDF / PowerPoint
10. Team collaboration and annotation
