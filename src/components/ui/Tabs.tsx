import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (activeTab: string) => React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              active === tab.id
                ? 'text-blue-600 border-b-2 border-blue-500 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
