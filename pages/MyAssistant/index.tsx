import React, { useState } from 'react';
import { Diary } from './Diary';
import { Notifications } from './Notifications';
import { ContentLibrary } from './ContentLibrary';
import { AssistantChat } from './AssistantChat';
import { useApp } from '../../context/AppContext';
import { Book, Bell, Film, MessageCircle } from 'lucide-react';

export const MyAssistant: React.FC = () => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'diary' | 'notifs' | 'content' | 'chat'>('diary');

  const tabs = [
    { id: 'diary', label: t('diary'), icon: Book, component: Diary },
    { id: 'notifs', label: t('notifications'), icon: Bell, component: Notifications },
    { id: 'content', label: t('content'), icon: Film, component: ContentLibrary },
    { id: 'chat', label: t('chat'), icon: MessageCircle, component: AssistantChat },
  ] as const;

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Diary;

  return (
    <div className="w-full h-full flex flex-col max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-center mb-8">{t('myAssistant')}</h1>
      
      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden justify-between mb-6 border-b border-black/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${
              activeTab === tab.id ? 'text-current border-b-2 border-current' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] uppercase tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-2 gap-8 h-[70vh]">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden flex flex-col">
          <Diary />
        </div>
        <div className="grid grid-rows-2 gap-8">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden relative">
            <Notifications />
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden">
                <ContentLibrary />
             </div>
             <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 overflow-hidden">
                <AssistantChat />
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Single View */}
      <div className="md:hidden flex-grow bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 min-h-[50vh]">
        <ActiveComponent />
      </div>
    </div>
  );
};
