import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, User, Sparkles } from 'lucide-react';
import { createChatSession, sendMessage } from '../../services/geminiService';
import { Chat } from '@google/genai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export const AssistantChat: React.FC = () => {
  const { contentLibrary, t, language } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hello! How can I help you today with your wellness journey?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userAPIKey, setUserApiKey] = useState('');
  useEffect(() => {
    // API Key
    try {
      const storedKey = localStorage.getItem('user_gemini_api_key');
      if (storedKey) {
        console.log("Loaded API Key from storage");
        setUserApiKey(storedKey);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    // Initialize chat session when component mounts or language/content changes
    console.log("Initialize chat with API Key :", userAPIKey.substring(0,6) + '****');
    chatSessionRef.current = createChatSession(contentLibrary, language, userAPIKey);
  }, [contentLibrary, language, userAPIKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await sendMessage(chatSessionRef.current, userMsg.text);

    const aiMsg: Message = { id: (Date.now() + 1).toString(), text: replyText, sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-hide mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-black/10' : 'bg-primary/20 text-primary'
              }`}
            >
              {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </div>
            <div
              className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-black/5 rounded-tr-none'
                  : 'bg-white/50 border border-black/5 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary">
               <Sparkles size={14} className="animate-pulse" />
            </div>
            <div className="p-4 bg-white/50 border border-black/5 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2 min-w-[180px]">
               <div className="h-2.5 bg-current opacity-10 rounded-full w-3/4 animate-pulse"></div>
               <div className="h-2.5 bg-current opacity-10 rounded-full w-full animate-pulse delay-75"></div>
               <div className="h-2.5 bg-current opacity-10 rounded-full w-5/6 animate-pulse delay-150"></div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatPlaceholder')}
          className="w-full p-4 pr-12 rounded-full border border-black/10 bg-white/40 backdrop-blur-sm focus:border-current focus:bg-white/60 outline-none transition-all shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 disabled:opacity-30 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};