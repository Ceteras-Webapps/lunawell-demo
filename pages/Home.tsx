import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

export const Home: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="animate-fade-in-up">
        <Logo className="w-32 h-32 mx-auto mb-8 text-current opacity-90" />
        <h1 className="text-5xl md:text-7xl font-serif mb-6">{t('title')}</h1>
        <p className="text-xl md:text-2xl font-light opacity-80 max-w-lg mx-auto mb-12 leading-relaxed">
          {t('welcome')}
        </p>
      </div>
    </div>
  );
};