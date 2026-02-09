import React, { useEffect } from 'react';
import { PointsData } from '../types';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
  onRetake: () => void;
  resetLabel?: string;
}

export const Results: React.FC<ResultsProps> = ({ score, totalQuestions, onReset, onRetake, resetLabel }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    // Save to local storage
    const pointsData: PointsData = {
      totalPoints: score,
      lastUpdated: new Date().toISOString()
    };
    
    // We get existing points to accumulate
    try {
      const existing = localStorage.getItem('points_earned');
      let currentTotal = 0;
      if (existing) {
        const parsed = JSON.parse(existing);
        if (typeof parsed.totalPoints === 'number') {
            currentTotal = parsed.totalPoints;
        }
      }
      
      const newTotal = currentTotal + score;
      
      const newData: PointsData = {
          totalPoints: newTotal,
          lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('points_earned', JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [score]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
      
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-orange-100">
              Score
            </span>
            <span className="text-xs font-semibold inline-block text-primary">
              {percentage}%
            </span>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-orange-100">
            <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"></div>
          </div>
        </div>
        <p className="text-5xl font-extrabold text-primary mb-2">{score} / {totalQuestions}</p>
        <p className="text-gray-500">Points earned this round</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-8 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Points Stored</h3>
        <p className="text-2xl font-bold text-gray-700">
            {(() => {
                try {
                    const saved = localStorage.getItem('points_earned');
                    return saved ? JSON.parse(saved).totalPoints : score;
                } catch {
                    return score;
                }
            })()}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetake}
          className="bg-white hover:bg-orange-50 text-primary border-2 border-primary font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform active:scale-95"
        >
          Retake Quiz
        </button>
        <button
          onClick={onReset}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform active:scale-95"
        >
          {resetLabel || "Upload Another Video"}
        </button>
      </div>
    </div>
  );
};