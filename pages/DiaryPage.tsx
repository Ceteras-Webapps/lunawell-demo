import React from 'react';
import { Diary } from './MyAssistant/Diary';
import { useApp } from '../context/AppContext';

export const DiaryPage: React.FC = () => {
  const { t } = useApp();
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-center mb-8">{t('diary')}</h1>
      <div className="flex-grow bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden">
        <Diary />
      </div>
    </div>
  );
};