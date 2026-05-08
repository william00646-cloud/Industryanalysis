import { createContext, useContext, useState, useEffect } from 'react';
import type { WatchlistCompany, WatchlistBenchmark } from '../types/terminal';
import { defaultWatchlistCompanies, defaultWatchlistBenchmarks } from '../data/terminal';

interface WatchlistContextValue {
  companies: WatchlistCompany[];
  benchmarks: WatchlistBenchmark[];
  addCompany: (c: WatchlistCompany) => void;
  removeCompany: (id: string) => void;
  isCompanyWatched: (id: string) => boolean;
  addBenchmark: (b: WatchlistBenchmark) => void;
  removeBenchmark: (id: string) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);
const LS_KEY_C = 'sectorscope_watchlist_companies';
const LS_KEY_B = 'sectorscope_watchlist_benchmarks';

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<WatchlistCompany[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY_C);
      return stored ? JSON.parse(stored) : defaultWatchlistCompanies;
    } catch { return defaultWatchlistCompanies; }
  });

  const [benchmarks, setBenchmarks] = useState<WatchlistBenchmark[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY_B);
      return stored ? JSON.parse(stored) : defaultWatchlistBenchmarks;
    } catch { return defaultWatchlistBenchmarks; }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY_C, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_B, JSON.stringify(benchmarks));
  }, [benchmarks]);

  const addCompany = (c: WatchlistCompany) => {
    setCompanies(prev => prev.find(x => x.id === c.id) ? prev : [...prev, c]);
  };
  const removeCompany = (id: string) => setCompanies(prev => prev.filter(x => x.id !== id));
  const isCompanyWatched = (id: string) => companies.some(x => x.id === id);
  const addBenchmark = (b: WatchlistBenchmark) => {
    setBenchmarks(prev => prev.find(x => x.id === b.id) ? prev : [...prev, b]);
  };
  const removeBenchmark = (id: string) => setBenchmarks(prev => prev.filter(x => x.id !== id));

  return (
    <WatchlistContext.Provider value={{ companies, benchmarks, addCompany, removeCompany, isCompanyWatched, addBenchmark, removeBenchmark }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider');
  return ctx;
}
