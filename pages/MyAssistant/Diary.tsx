import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Save } from 'lucide-react';
import { Note } from '../../types';

export const Diary: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, t, theme } = useApp();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Temporary state for the editor
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [status, setStatus] = useState<string>('');

  const activeNote = notes.find(n => n.id === activeNoteId);

  // Load active note into editor
  useEffect(() => {
    if (activeNote) {
      setCurrentTitle(activeNote.title);
      setCurrentContent(activeNote.content);
    } else {
      setCurrentTitle('');
      setCurrentContent('');
    }
  }, [activeNoteId, notes]);

  // Auto-save effect
  useEffect(() => {
    if (!activeNoteId) return;

    const timer = setTimeout(() => {
      if (activeNote && (activeNote.title !== currentTitle || activeNote.content !== currentContent)) {
        updateNote({
          ...activeNote,
          title: currentTitle,
          content: currentContent,
          lastModified: Date.now(),
        });
        setStatus(t('saved'));
        setTimeout(() => setStatus(''), 2000);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [currentTitle, currentContent, activeNoteId]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: t('newNote'),
      content: '',
      date: new Date().toISOString(),
      lastModified: Date.now(),
    };
    addNote(newNote);
    setActiveNoteId(newNote.id);
  };

  return (
    <div className="flex flex-col h-full gap-6 md:flex-row">
      {/* Note List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 border-r border-black/10 pr-0 md:pr-4">
        <button
          onClick={handleNewNote}
          className="flex items-center justify-center gap-2 p-3 rounded-lg border border-current hover:bg-black/5 transition-colors"
        >
          <Plus size={18} />
          <span>{t('newNote')}</span>
        </button>
        
        <div className="overflow-y-auto space-y-2 max-h-[60vh] md:max-h-full scrollbar-hide">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                activeNoteId === note.id ? 'bg-black/10 shadow-sm' : 'hover:bg-black/5'
              }`}
            >
              <h3 className="font-bold truncate">{note.title}</h3>
              <p className="text-xs opacity-60 mt-1">
                {new Date(note.date).toLocaleDateString()}
              </p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-center opacity-40 mt-10 italic">No notes yet.</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="w-full md:w-2/3 flex flex-col h-full relative">
        {activeNoteId ? (
          <>
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs opacity-50 uppercase tracking-widest transition-opacity duration-300">
                  {status}
               </span>
               <button 
                 onClick={() => {
                   deleteNote(activeNoteId);
                   setActiveNoteId(null);
                 }}
                 className="p-2 text-red-400 hover:text-red-600 transition-colors"
                 title={t('delete')}
               >
                 <Trash2 size={18} />
               </button>
            </div>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full text-2xl font-serif bg-transparent border-b border-black/10 focus:border-current outline-none pb-2 mb-4 placeholder-current/30"
              placeholder="Title"
            />
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              className="w-full flex-grow bg-transparent outline-none resize-none leading-relaxed placeholder-current/30"
              placeholder={t('diaryPlaceholder')}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <Save size={48} className="mb-4" />
            <p>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};
