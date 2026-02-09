import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Language, ThemeSettings, Note, Notification, ContentItem } from '../types';
import { DEFAULT_THEME, INITIAL_NOTIFICATIONS, INITIAL_CONTENT, TRANSLATIONS } from '../constants';

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeSettings) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addNotification: (notification: Notification) => void;
  addContent: (content: ContentItem) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage or defaults
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>(INITIAL_CONTENT);

  // Load from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('ls_notes');
    const savedTheme = localStorage.getItem('ls_theme');
    const savedLang = localStorage.getItem('ls_lang');
    const savedContent = localStorage.getItem('ls_content');

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedTheme) setTheme(JSON.parse(savedTheme));
    if (savedLang) setLanguage(savedLang as Language);
    if (savedContent) setContentLibrary(JSON.parse(savedContent));
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('ls_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ls_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ls_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ls_content', JSON.stringify(contentLibrary));
  }, [contentLibrary]);


  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const addContent = (item: ContentItem) => {
    setContentLibrary((prev) => [item, ...prev]);
  };

  const t = (key: keyof typeof TRANSLATIONS['en']) => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        notes,
        notifications,
        contentLibrary,
        setLanguage,
        setTheme,
        addNote,
        updateNote,
        deleteNote,
        addNotification,
        addContent,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
