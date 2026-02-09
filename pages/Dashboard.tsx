import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContentItem } from '../types';

export const Dashboard: React.FC = () => {
  const { addContent, t } = useApp();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'video' | 'class' | 'document'>('video');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title,
      description: desc,
      type,
      url,
    };
    addContent(newItem);
    setMessage(t('saved'));
    setTitle('');
    setDesc('');
    setUrl('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif mb-8 text-center">{t('dashboard')}</h1>
      {t('infoDashboard') && (
        <p className="mb-6 text-center text-gray-700 italic">{t('infoDashboard')}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/50 space-y-6">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Title</label>
          <input
            required
            className="w-full p-3 rounded-lg border border-black/10 bg-white/50 focus:border-current outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Description</label>
          <textarea
            required
            className="w-full p-3 rounded-lg border border-black/10 bg-white/50 focus:border-current outline-none h-24 resize-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Type</label>
            <select
              className="w-full p-3 rounded-lg border border-black/10 bg-white/50 focus:border-current outline-none"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="video">Video</option>
              <option value="class">Class</option>
              <option value="document">Document</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-70">URL</label>
            <input
              required
              type="url"
              className="w-full p-3 rounded-lg border border-black/10 bg-white/50 focus:border-current outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <span className="text-green-600 font-medium">{message}</span>
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/80 transition-transform active:scale-95 shadow-md"
          >
            {t('addContent')}
          </button>
        </div>
      </form>
    </div>
  );
};
