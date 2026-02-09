import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Home } from './pages/Home';
import { MyAssistant } from './pages/MyAssistant';
import { Dashboard } from './pages/Dashboard';
import { DiaryPage } from './pages/DiaryPage';
import QuizModule from './components/QuizModule';
import { Logo } from './components/Logo';
import { OptionsModal } from './components/OptionsModal';
import { Settings, LayoutDashboard, Sparkles, Book, Film } from 'lucide-react';

const Navigation = () => {
  const { t, theme } = useApp();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const [userApiKey, setUserApiKey] = useState('');
  const handleSaveSettings = (key: string) => {
    setUserApiKey(key);
    if (key) {
        localStorage.setItem('user_gemini_api_key', key);
    } else {
        localStorage.removeItem('user_gemini_api_key');
    }
  };
  // API Key
  // Load data on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('user_gemini_api_key');
      if (storedKey) {
        setUserApiKey(storedKey);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, []);
  return (
    <>
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-40 relative">
        <Link to="/" className="flex items-center gap-3 group">
           <Logo className="w-8 h-8 transition-transform group-hover:rotate-12" />
           <span className="font-serif text-xl tracking-wide hidden md:block">{t('title')}</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 mr-4 border-r border-black/10 pr-6">
            <Link to="/assistant" className="hover:opacity-60 transition-opacity" title={t('myAssistant')}>
                <Sparkles size={20} />
            </Link>
            <Link to="/diary" className="hover:opacity-60 transition-opacity" title={t('diary')}>
                <Book size={20} />
            </Link>
            <Link to="/videos" className="hover:opacity-60 transition-opacity" title={t('content')}>
                <Film size={20} />
            </Link>
            <Link to="/dashboard" className="hover:opacity-60 transition-opacity" title={t('dashboard')}>
                <LayoutDashboard size={20} />
            </Link>
          </div>
          
          <button 
            onClick={() => setIsOptionsOpen(true)}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity uppercase text-xs tracking-widest font-bold"
          >
            <span className="hidden md:inline">{t('options')}</span>
            <Settings size={18} />
          </button>
        </div>
      </nav>

      <OptionsModal isOpen={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} currentApiKey={userApiKey}
        onSave={handleSaveSettings}/>
    </>
  );
};

const AppContent = () => {
  const { theme } = useApp();

  return (
    <div 
      className="min-h-screen transition-colors duration-500 ease-in-out flex flex-col"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: theme.textColor,
        // Using a gentle grain texture overlay if desired, but keeping it simple for now
      }}
    >
      <HashRouter>
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<MyAssistant />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/videos" element={<QuizModule />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="py-6 text-center opacity-30 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} lunawell
        </footer>
      </HashRouter>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;