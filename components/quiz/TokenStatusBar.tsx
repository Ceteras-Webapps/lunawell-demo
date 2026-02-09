import React from 'react';

interface TokenStatusBarProps {
  usage: {
    totalTokenCount?: number;
  } | null;
}

export const TokenStatusBar: React.FC<TokenStatusBarProps> = ({ usage }) => {
  if (!usage || typeof usage.totalTokenCount !== 'number') return null;

  const used = usage.totalTokenCount;
  // Assuming a standard context window of 1 million tokens for calculation
  const limit = 1000000; 
  const percent = ((used / limit) * 100).toFixed(2);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-gray-700 animate-fade-in transition-all">
      <div className="flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-100"></span>
         <span className="font-semibold text-gray-600">Token Usage</span>
      </div>
      <div className="h-4 w-px bg-gray-200"></div>
      <div className="font-mono font-medium text-gray-800">
        {used.toLocaleString()} 
        <span className="text-gray-500 ml-1.5 text-xs">({percent}%)</span>
      </div>
    </div>
  );
};