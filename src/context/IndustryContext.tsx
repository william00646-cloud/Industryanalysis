import { createContext, useContext, useState } from 'react';
import type { IndustryData } from '../types/industry';
import { allIndustries, defaultIndustryId } from '../data/industries/index';

interface IndustryContextValue {
  industry: IndustryData;
  setIndustryId: (id: string) => void;
  industryId: string;
  allIndustries: { id: string; name: string; shortName: string; icon: string }[];
}

const IndustryContext = createContext<IndustryContextValue | null>(null);

export function IndustryProvider({ children }: { children: React.ReactNode }) {
  const [industryId, setIndustryId] = useState(defaultIndustryId);

  const industry = allIndustries.find(i => i.meta.id === industryId)!;

  const list = allIndustries.map(i => ({
    id: i.meta.id,
    name: i.meta.name,
    shortName: i.meta.shortName,
    icon: i.meta.icon,
  }));

  return (
    <IndustryContext.Provider value={{ industry, setIndustryId, industryId, allIndustries: list }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry(): IndustryContextValue {
  const ctx = useContext(IndustryContext);
  if (!ctx) throw new Error('useIndustry must be used inside IndustryProvider');
  return ctx;
}
