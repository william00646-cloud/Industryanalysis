import { useMemo, useState } from 'react';
import type { ResearchNote } from '../types/terminal';
import { benchmarkRows, researchNoteTemplates, screenerCompanies } from '../data/terminal';
import { useResearchNotes } from '../context/ResearchNotesContext';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';

const noteTypes: ResearchNote['type'][] = ['Industry Thesis', 'Company Thesis', 'Event Note', 'Price Signal'];

const typeColor: Record<ResearchNote['type'], string> = {
  'Industry Thesis': 'text-cyan-400 bg-cyan-900/20 border-cyan-700/30',
  'Company Thesis': 'text-emerald-400 bg-emerald-900/20 border-emerald-700/30',
  'Event Note': 'text-amber-400 bg-amber-900/20 border-amber-700/30',
  'Price Signal': 'text-violet-400 bg-violet-900/20 border-violet-700/30',
};

export function ResearchNotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useResearchNotes();
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? '');
  const selected = notes.find(n => n.id === selectedId) ?? notes[0];
  const [draftTitle, setDraftTitle] = useState(selected?.title ?? '');
  const [draftContent, setDraftContent] = useState(selected?.content ?? '');
  const [draftType, setDraftType] = useState<ResearchNote['type']>(selected?.type ?? 'Industry Thesis');
  const [linkedCompany, setLinkedCompany] = useState(selected?.linkedCompany ?? '');
  const [linkedBenchmark, setLinkedBenchmark] = useState(selected?.linkedBenchmark ?? '');

  const isDirty = selected && (draftTitle !== selected.title || draftContent !== selected.content);

  const noteCountByType = useMemo(() => {
    return noteTypes.reduce<Record<string, number>>((acc, t) => {
      acc[t] = notes.filter(n => n.type === t).length;
      return acc;
    }, {});
  }, [notes]);

  const selectNote = (note: ResearchNote) => {
    setSelectedId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setDraftType(note.type);
    setLinkedCompany(note.linkedCompany ?? '');
    setLinkedBenchmark(note.linkedBenchmark ?? '');
  };

  const createFromTemplate = (templateIndex: number) => {
    const t = researchNoteTemplates[templateIndex];
    const note = addNote({
      title: t.title,
      type: t.type,
      content: t.content,
      linkedCompany: '',
      linkedBenchmark: '',
    });
    selectNote(note);
  };

  const createBlank = () => {
    const note = addNote({
      title: 'Untitled Research Note',
      type: draftType,
      content: '## New Note\n\n**Observation:**\n\n**Implication:**\n\n**Metrics to monitor:**\n-\n',
      linkedCompany,
      linkedBenchmark,
    });
    selectNote(note);
  };

  const save = () => {
    if (!selected) return;
    updateNote(selected.id, {
      title: draftTitle || 'Untitled Research Note',
      content: draftContent,
      type: draftType,
      linkedCompany,
      linkedBenchmark,
    });
  };

  return (
    <div className="h-full min-h-[760px] grid grid-cols-1 xl:grid-cols-[300px_1fr_280px] gap-4 max-w-[1400px] mx-auto">
      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Research Notes</p>
            <button onClick={createBlank} className="text-cyan-400 hover:text-cyan-300">
              <Plus size={15} />
            </button>
          </div>
          <p className="text-slate-700 text-xs">Saved in localStorage · {notes.length} notes</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {notes.map(n => (
            <button
              key={n.id}
              onClick={() => selectNote(n)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-800/40 ${selected?.id === n.id ? 'bg-slate-800/60 border-l-2 border-cyan-500' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText size={12} className="text-slate-600" />
                <span className={`text-xs px-1.5 py-0.5 rounded border ${typeColor[n.type]}`}>{n.type}</span>
              </div>
              <p className="text-slate-200 text-xs font-semibold line-clamp-2">{n.title}</p>
              <p className="text-slate-700 text-xs mt-1">{new Date(n.updatedAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-slate-800/40 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={draftTitle}
              onChange={e => setDraftTitle(e.target.value)}
              placeholder="Note title"
              className="flex-1 bg-slate-800/60 border border-slate-700/50 text-white text-sm rounded px-3 py-2 outline-none focus:border-cyan-500/50"
            />
            <select
              value={draftType}
              onChange={e => setDraftType(e.target.value as ResearchNote['type'])}
              className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-3 py-2 outline-none focus:border-cyan-500/50"
            >
              {noteTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={linkedCompany}
              onChange={e => setLinkedCompany(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-3 py-1.5 outline-none focus:border-cyan-500/50"
            >
              <option value="">Link company...</option>
              {screenerCompanies.map(c => <option key={c.id} value={c.ticker}>{c.ticker} · {c.name}</option>)}
            </select>
            <select
              value={linkedBenchmark}
              onChange={e => setLinkedBenchmark(e.target.value)}
              className="bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs rounded px-3 py-1.5 outline-none focus:border-cyan-500/50"
            >
              <option value="">Link benchmark...</option>
              {benchmarkRows.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <textarea
          value={draftContent}
          onChange={e => setDraftContent(e.target.value)}
          className="flex-1 min-h-[540px] bg-zinc-950/60 text-slate-200 text-sm font-mono leading-relaxed p-4 outline-none resize-none border-0"
          placeholder="Write the thesis, event note, or price signal here..."
        />

        <div className="px-4 py-3 border-t border-slate-800/40 flex items-center justify-between">
          <span className={`text-xs ${isDirty ? 'text-amber-400' : 'text-slate-700'}`}>{isDirty ? 'Unsaved changes' : 'Saved locally'}</span>
          <div className="flex items-center gap-2">
            {selected && (
              <button
                onClick={() => deleteNote(selected.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-rose-800/30 text-rose-400 text-xs hover:bg-rose-900/20"
              >
                <Trash2 size={12} /> Delete
              </button>
            )}
            <button
              onClick={save}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/25"
            >
              <Save size={12} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-4 space-y-4">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Templates</p>
          <div className="space-y-2">
            {researchNoteTemplates.map((t, i) => (
              <button
                key={t.title}
                onClick={() => createFromTemplate(i)}
                className="w-full text-left p-2.5 rounded border border-slate-800 hover:border-cyan-700/40 hover:bg-slate-800/40"
              >
                <p className="text-slate-200 text-xs font-semibold">{t.title}</p>
                <p className="text-slate-600 text-xs mt-0.5">{t.type}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/40">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Note Mix</p>
          <div className="space-y-1.5">
            {noteTypes.map(t => (
              <div key={t} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{t}</span>
                <span className="text-white font-mono">{noteCountByType[t] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-blue-500/20 bg-blue-950/20 p-3">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Interpretation</p>
          <p className="text-slate-300 text-xs leading-relaxed">
            Research Notes connect event monitoring to investment judgement. The template structure forces a clean chain: event, value chain impact, supply-demand effect, price signal, and company thesis.
          </p>
        </div>
      </div>
    </div>
  );
}
