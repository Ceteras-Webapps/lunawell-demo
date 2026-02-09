import React, { useState } from 'react';
import { Quiz, Question } from '../types';

interface QuizPlayerProps {
  quizzes: Quiz[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizzes, onComplete }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Flatten all questions for easier progress tracking, or keep nested structure.
  // Keeping nested structure to show "Quiz 1 Title", etc.
  
  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuestion: Question = currentQuiz.questions[currentQuestionIndex];
  
  const handleOptionSelect = (index: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    let newScore = score;
    
    if (!showFeedback) {
      // First click validates
      setShowFeedback(true);
      if (isCorrect) {
        newScore = score + 1;
        setScore(newScore);
      }
      return; 
    }

    // Second click moves to next question
    setShowFeedback(false);
    setSelectedOption(null);

    // Logic to move to next question or quiz
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All done
      // Calculate total questions
      const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);
      onComplete(newScore, totalQuestions);
    }
  };

  const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-primary px-6 py-4">
          <h2 className="text-white text-xl font-bold">
            {currentQuiz.title} 
            <span className="text-sm font-normal text-white/80 ml-2">
              (Question {currentQuestionIndex + 1}/{currentQuiz.questions.length})
            </span>
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-lg text-gray-800 mb-6 font-medium">
            {currentQuestion.questionText}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border transition-colors duration-200 flex items-center justify-between group ";
              
              if (showFeedback) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnClass += "bg-green-50 border-green-500 text-green-700 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-700";
                } else {
                  btnClass += "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                }
              } else {
                if (selectedOption === idx) {
                  btnClass += "bg-orange-50 border-primary text-primary font-medium ring-1 ring-primary";
                } else {
                  btnClass += "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={btnClass}
                  disabled={showFeedback}
                >
                  <span>{option}</span>
                  {showFeedback && idx === currentQuestion.correctAnswerIndex && (
                    <span className="text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  {showFeedback && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                    <span className="text-red-600">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`
                px-6 py-2 rounded-md font-bold text-white transition-colors
                ${selectedOption === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-md'}
              `}
            >
              {showFeedback ? (
                (currentQuestionIndex === currentQuiz.questions.length - 1 && currentQuizIndex === quizzes.length - 1) 
                  ? "Finish Quiz" 
                  : "Next Question"
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        Total Score: {score}
      </div>
    </div>
  );
};
