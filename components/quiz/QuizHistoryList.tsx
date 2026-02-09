import React from 'react';
import { HistoryItem } from '../../types';

interface QuizHistoryListProps {
  history: HistoryItem[];
  onAction: (historyId: string, quizIndex: number) => void;
  onDelete: (historyId: string, quizIndex: number) => void;
  actionLabel?: string;
  title?: string;
}

export const QuizHistoryList: React.FC<QuizHistoryListProps> = ({ 
  history, 
  onAction, 
  onDelete,
  actionLabel = "Edit",
  title = "Generated Quizzes Library"
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mx-auto mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-base">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {history.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700 truncate max-w-lg" title={item.sourceName}>
                {/* Fallback to 'Unknown Source' if sourceName is missing */}
                {item.sourceName || "Unknown Source"}
              </h4>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="space-y-2">
              {item.quizzes.map((quiz, qIndex) => (
                <div key={qIndex} className="flex items-center justify-between bg-offwhite p-3 rounded-md border border-gray-100 hover:border-orange-200 transition-colors group">
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors block">{quiz.title}</span>
                    <div className="flex gap-4 mt-2 text-xs text-base">
                      <span className="flex items-center bg-gray-200/50 px-2 py-0.5 rounded text-base" title="Number of times you completed this quiz">
                        Answered: <span className="font-bold ml-1 text-gray-600">{quiz.stats?.timesTaken || 0}</span>
                      </span>
                      <span className="flex items-center bg-gray-200/50 px-2 py-0.5 rounded text-base" title="Cumulative points earned from this quiz">
                        Total Score: <span className="font-bold ml-1 text-gray-600">{quiz.stats?.totalScore || 0}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAction(item.id, qIndex)}
                      className="text-xs font-bold text-primary hover:text-white px-4 py-1.5 border border-primary rounded-full hover:bg-primary transition-colors"
                    >
                      {actionLabel}
                    </button>
                    <button
                      onClick={() => onDelete(item.id, qIndex)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Quiz"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};