import { useState } from 'react';
import type { TerminalPageId } from './types/terminal';
import { IndustryProvider } from './context/IndustryContext';
import { LanguageProvider } from './context/LanguageContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ResearchNotesProvider } from './context/ResearchNotesContext';
import { AppShell } from './components/layout/AppShell';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { MarketMonitorPage } from './pages/MarketMonitorPage';
import { IndustryMapPage } from './pages/IndustryMapPage';
import { ValueChainPage } from './pages/ValueChainPage';
import { SupplyDemandPage } from './pages/SupplyDemandPage';
import { PriceSpreadPage } from './pages/PriceSpreadPage';
import { CompanyScreenerPage } from './pages/CompanyScreenerPage';
import { CompanyWorkspacePage } from './pages/CompanyWorkspacePage';
import { NewsTerminalPage } from './pages/NewsTerminalPage';
import { EventImpactPage } from './pages/EventImpactPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ResearchNotesPage } from './pages/ResearchNotesPage';

function PageRouter({
  current,
  onNavigate,
  selectedCompanyId,
  onSelectCompany,
}: {
  current: TerminalPageId;
  onNavigate: (p: TerminalPageId) => void;
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
}) {
  switch (current) {
    case 'command-center':
      return <CommandCenterPage onNavigate={onNavigate} />;
    case 'market-monitor':
      return <MarketMonitorPage />;
    case 'industry-map':
      return <IndustryMapPage />;
    case 'value-chain':
      return <ValueChainPage />;
    case 'supply-demand':
      return <SupplyDemandPage />;
    case 'price-spread':
      return <PriceSpreadPage />;
    case 'company-screener':
      return <CompanyScreenerPage onNavigate={onNavigate} onSelectCompany={onSelectCompany} />;
    case 'company-workspace':
      return <CompanyWorkspacePage selectedCompanyId={selectedCompanyId} onNavigate={onNavigate} />;
    case 'news-terminal':
      return <NewsTerminalPage />;
    case 'event-impact':
      return <EventImpactPage />;
    case 'watchlist':
      return <WatchlistPage onNavigate={onNavigate} onSelectCompany={onSelectCompany} />;
    case 'research-notes':
      return <ResearchNotesPage />;
    default:
      return <CommandCenterPage onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [current, setCurrent] = useState<TerminalPageId>('command-center');
  const [selectedCompanyId, setSelectedCompanyId] = useState('lng');

  return (
    <LanguageProvider>
      <IndustryProvider>
        <WatchlistProvider>
          <ResearchNotesProvider>
            <AppShell current={current} onNavigate={setCurrent}>
              <PageRouter
                current={current}
                onNavigate={setCurrent}
                selectedCompanyId={selectedCompanyId}
                onSelectCompany={setSelectedCompanyId}
              />
            </AppShell>
          </ResearchNotesProvider>
        </WatchlistProvider>
      </IndustryProvider>
    </LanguageProvider>
  );
}
