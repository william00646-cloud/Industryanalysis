import { createContext, useContext, useState, useEffect } from 'react';
import type { ResearchNote } from '../types/terminal';
import { researchNoteTemplates } from '../data/terminal';

interface ResearchNotesContextValue {
  notes: ResearchNote[];
  addNote: (n: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
}

const ResearchNotesContext = createContext<ResearchNotesContextValue | null>(null);
const LS_KEY = 'sectorscope_research_notes';

function makeId() { return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function defaultNotes(): ResearchNote[] {
  const now = new Date().toISOString();
  return researchNoteTemplates.map(t => ({
    ...t,
    id: makeId(),
    createdAt: now,
    updatedAt: now,
  }));
}

export function ResearchNotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<ResearchNote[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : defaultNotes();
    } catch { return defaultNotes(); }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (n: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setNotes(prev => [{ ...n, id: makeId(), createdAt: now, updatedAt: now }, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <ResearchNotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </ResearchNotesContext.Provider>
  );
}

export function useResearchNotes(): ResearchNotesContextValue {
  const ctx = useContext(ResearchNotesContext);
  if (!ctx) throw new Error('useResearchNotes must be inside ResearchNotesProvider');
  return ctx;
}
