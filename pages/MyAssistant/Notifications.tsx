import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Plus, X } from 'lucide-react';
import { Notification } from '../../types';

export const Notifications: React.FC = () => {
  const { notifications, addNotification, t } = useApp();
  const [newReminder, setNewReminder] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;

    const notif: Notification = {
      id: Date.now().toString(),
      message: newReminder,
      isSystem: false,
      date: new Date().toISOString(),
    };

    addNotification(notif);
    setNewReminder('');
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">{t('notifications')}</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-sm uppercase tracking-wider hover:opacity-70 transition-opacity"
        >
          <Plus size={16} /> {t('addNotification')}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            className="flex-grow p-2 rounded border border-black/20 bg-transparent outline-none focus:border-current"
            placeholder="Drink herbal tea at 5 PM..."
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded transition-colors"
          >
            {t('save')}
          </button>
        </form>
      )}

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg flex gap-4 items-start ${
              notif.isSystem ? 'bg-blue-50/50' : 'bg-orange-50/50'
            }`}
             style={{ 
              // Gentle override for better visibility against custom backgrounds if needed
              backgroundColor: notif.isSystem ? 'rgba(239, 246, 255, 0.5)' : 'rgba(255, 247, 237, 0.5)',
              border: '1px solid rgba(0,0,0,0.05)'
             }}
          >
            <div className={`mt-1 p-1.5 rounded-full ${notif.isSystem ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              <Bell size={14} />
            </div>
            <div>
              <p className="text-base leading-relaxed">{notif.message}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {new Date(notif.date).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
