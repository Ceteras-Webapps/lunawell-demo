import React, { useState, useEffect }  from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSave: (key: string) => void;
}

export const OptionsModal: React.FC<Props> = ({ isOpen, onClose, currentApiKey, onSave }) => {
  const [key, setKey] = useState(currentApiKey);

  const { language, setLanguage, theme, setTheme, t } = useApp();
  useEffect(() => {
    setKey(currentApiKey);
  }, [currentApiKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-serif mb-6">{t('options')}</h2>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">{t('language')}</label>
            <div className="flex gap-2">
              {(['en', 'de', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    language === lang 
                      ? 'border-current bg-black/10' 
                      : 'border-black/20 hover:border-black/40'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">{t('textColor')}</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0"
              />
              <span className="font-mono text-sm opacity-60">{theme.textColor}</span>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">{t('bgColor')}</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0"
              />
              <span className="font-mono text-sm opacity-60">{theme.backgroundColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Gemini API Key</label>
            <div className="flex items-center gap-4">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="API Key (AI Studio)"
                className="h-10 cursor-pointer border-0 p-0"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This key will be stored locally in your browser. Leave it empty to try using the default demo key (if configured).
            </p>
          </div>
          <div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(key);
              onClose();
            }}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-medium shadow-sm transition-colors"
          >
            Save Settings
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
