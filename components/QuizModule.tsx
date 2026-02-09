import React, { useState, useEffect } from 'react';
import { VideoUpload } from './quiz/VideoUpload';
import { DocumentUpload } from './quiz/DocumentUpload';
import { QuizPlayer } from './quiz/QuizPlayer';
import { Results } from './quiz/Results';
import { QuizHistoryList } from './quiz/QuizHistoryList';
import { QuizEditor } from './quiz/QuizEditor';
import { TokenStatusBar } from './quiz/TokenStatusBar';
import { generateQuizFromContent } from '../services/geminiService';
import { Quiz, QuizState, HistoryItem } from '../types';
import { useApp } from '@/context/AppContext';

type View = 'COURSES' | 'MY_QUIZZES';

const QuizModule: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('COURSES');

  // Courses Flow State
  const [appState, setAppState] = useState<QuizState>(QuizState.UPLOAD);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Token Usage State
  const [tokenUsage, setTokenUsage] = useState<any>(null);
  
  // History Data
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Translations
  const { t } = useApp();
  // Edit State (Courses)
  const [editingParams, setEditingParams] = useState<{ historyId: string; quizIndex: number } | null>(null);

  // My Quizzes State
  const [activeQuizParams, setActiveQuizParams] = useState<{ 
    quiz: Quiz; 
    historyId: string;
    quizIndex: number;
    complete: boolean;
    score: number;
    total: number;
  } | null>(null);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');

  // Load data on mount
  useEffect(() => {
    // History
    try {
      const storedHistory = localStorage.getItem('quiz_history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        const migrated = parsed.map((item: any) => ({
            ...item,
            sourceName: item.sourceName || item.videoName || 'Unknown File'
        }));
        setHistory(migrated);
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }

    // API Key
    try {
      const storedKey = localStorage.getItem('user_gemini_api_key');
      if (storedKey) {
        setUserApiKey(storedKey);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('quiz_history', JSON.stringify(newHistory));
  };



  // --- Courses Actions ---

  const handleContentUpload = async (base64: string, mimeType: string, fileName: string) => {
    setAppState(QuizState.PROCESSING);
    setErrorMsg(null);
    setTokenUsage(null);

    try {
      // Pass the userApiKey to the service
      const result = await generateQuizFromContent(base64, mimeType, userApiKey);
      const generatedQuizzes = result.quizzes;
      
      if (result.usageMetadata) {
        setTokenUsage(result.usageMetadata);
      }
      
      if (!generatedQuizzes || generatedQuizzes.length === 0) {
         throw new Error("No quizzes were generated. Please try a different file.");
      }

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        sourceName: fileName,
        quizzes: generatedQuizzes,
        timestamp: new Date().toISOString()
      };
      
      const newHistory = [newItem, ...history];
      saveHistory(newHistory);

      setQuizzes(generatedQuizzes);
      setAppState(QuizState.QUIZ);
    } catch (error: any) {
      console.error(error);
      let message = "Failed to generate quiz. Please ensure the content is clear.";
      if (error.message && error.message.includes("API Key")) {
        message = "Invalid or missing API Key. Please check your settings.";
      }
      setErrorMsg(message);
      setAppState(QuizState.ERROR);
    }
  };

  const handleDashboardQuizComplete = (score: number, total: number) => {
    setFinalScore(score);
    setTotalQuestions(total);
    setAppState(QuizState.RESULTS);
  };

  const handleDashboardRetake = () => {
    setFinalScore(0);
    setAppState(QuizState.QUIZ);
  };

  const handleDashboardReset = () => {
    setAppState(QuizState.UPLOAD);
    setQuizzes([]);
    setFinalScore(0);
    setTotalQuestions(0);
    setErrorMsg(null);
  };

  const handleEditQuiz = (historyId: string, quizIndex: number) => {
    setEditingParams({ historyId, quizIndex });
    setAppState(QuizState.EDIT);
  };

  const handleSaveEditedQuiz = (updatedQuiz: Quiz) => {
    if (!editingParams) return;

    const updatedHistory = history.map(item => {
      if (item.id === editingParams.historyId) {
        const updatedQuizzes = [...item.quizzes];
        updatedQuizzes[editingParams.quizIndex] = updatedQuiz;
        return { ...item, quizzes: updatedQuizzes };
      }
      return item;
    });

    saveHistory(updatedHistory);
    setEditingParams(null);
    setAppState(QuizState.UPLOAD);
  };

  const handleCancelEdit = () => {
    setEditingParams(null);
    setAppState(QuizState.UPLOAD);
  };

  const handleDeleteQuiz = (historyId: string, quizIndex: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    const updatedHistory = history.map(item => {
      if (item.id === historyId) {
        // Filter out the quiz at the specific index
        const updatedQuizzes = item.quizzes.filter((_, idx) => idx !== quizIndex);
        return { ...item, quizzes: updatedQuizzes };
      }
      return item;
    }).filter(item => item.quizzes.length > 0); // Remove items that have no quizzes left

    saveHistory(updatedHistory);
    
    // If the user deletes the active quiz while in "My Quizzes", close the player
    if (activeQuizParams && activeQuizParams.historyId === historyId) {
        setActiveQuizParams(null);
    }
  };

  // --- My Quizzes Actions ---

  const handleTakeQuiz = (historyId: string, quizIndex: number) => {
    const item = history.find(h => h.id === historyId);
    if (item && item.quizzes[quizIndex]) {
      setActiveQuizParams({
        quiz: item.quizzes[quizIndex],
        historyId,
        quizIndex,
        complete: false,
        score: 0,
        total: 0
      });
      // Scroll to player
      setTimeout(() => {
        document.getElementById('my-quiz-player')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleMyQuizComplete = (score: number, total: number) => {
    if (activeQuizParams) {
      // 1. Update UI state for the player
      setActiveQuizParams({
        ...activeQuizParams,
        complete: true,
        score,
        total
      });

      // 2. Update Statistics in History
      const updatedHistory = history.map(item => {
        if (item.id === activeQuizParams.historyId) {
          const updatedQuizzes = [...item.quizzes];
          const targetQuiz = updatedQuizzes[activeQuizParams.quizIndex];
          
          const currentStats = targetQuiz.stats || { timesTaken: 0, totalScore: 0 };
          
          updatedQuizzes[activeQuizParams.quizIndex] = {
            ...targetQuiz,
            stats: {
              timesTaken: currentStats.timesTaken + 1,
              totalScore: currentStats.totalScore + score
            }
          };
          
          return { ...item, quizzes: updatedQuizzes };
        }
        return item;
      });

      saveHistory(updatedHistory);
    }
  };

  const handleMyQuizRetake = () => {
    if (activeQuizParams) {
       setActiveQuizParams({
        ...activeQuizParams,
        complete: false,
        score: 0
      });
    }
  };

  const handleMyQuizClose = () => {
    setActiveQuizParams(null);
  };

  // --- Helpers ---
  const getEditingQuiz = (): Quiz | null => {
    if (!editingParams) return null;
    const item = history.find(h => h.id === editingParams.historyId);
    if (!item) return null;
    return item.quizzes[editingParams.quizIndex];
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <nav className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                  onClick={() => setCurrentView('COURSES')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${currentView === 'COURSES' ? 'bg-white text-primary shadow-sm' : 'text-base hover:text-gray-700'}`}
              >
                  Courses
              </button>
              <button 
                  onClick={() => setCurrentView('MY_QUIZZES')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${currentView === 'MY_QUIZZES' ? 'bg-white text-primary shadow-sm' : 'text-base hover:text-gray-700'}`}
              >
                  My Quizzes
              </button>
            </nav>

          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* === COURSES VIEW === */}
        {currentView === 'COURSES' && (
          <>
            {appState === QuizState.UPLOAD && (
              <>
                <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
                  <div className="h-full">
                    <VideoUpload onUpload={handleContentUpload} isLoading={false} />
                  </div>
                  <div className="h-full">
                    <DocumentUpload onUpload={handleContentUpload} isLoading={false} />
                  </div>
                </div>
                
                <QuizHistoryList 
                  history={history} 
                  onAction={handleEditQuiz} 
                  onDelete={handleDeleteQuiz}
                  actionLabel="Edit"
                  title="Generated Quizzes Library"
                />
              </>
            )}

            {appState === QuizState.PROCESSING && (
               <div className="max-w-lg mx-auto mt-20">
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                     <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-base">Analyzing Content...</h3>
                    <p className="text-base mt-2">This may take a minute depending on the file size.</p>
                  </div>
               </div>
            )}

            {appState === QuizState.ERROR && (
              <div className="max-w-lg mx-auto mt-10 text-center">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-lg font-bold text-red-700 mb-2">Error</h3>
                    <p className="text-red-600 mb-6">{errorMsg || "Something went wrong."}</p>
                    <button 
                      onClick={handleDashboardReset}
                      className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-full"
                    >
                      Try Again
                    </button>
                </div>
              </div>
            )}

            {appState === QuizState.QUIZ && quizzes.length > 0 && (
              <QuizPlayer quizzes={quizzes} onComplete={handleDashboardQuizComplete} />
            )}

            {appState === QuizState.RESULTS && (
              <Results 
                score={finalScore} 
                totalQuestions={totalQuestions} 
                onReset={handleDashboardReset} 
                onRetake={handleDashboardRetake}
              />
            )}

            {appState === QuizState.EDIT && (
              (() => {
                const quizToEdit = getEditingQuiz();
                return quizToEdit ? (
                  <QuizEditor 
                    quiz={quizToEdit} 
                    onSave={handleSaveEditedQuiz} 
                    onCancel={handleCancelEdit} 
                  />
                ) : (
                  <div className="text-center text-red-500">Error loading quiz for editing.</div>
                );
              })()
            )}
          </>
        )}

        {/* === MY QUIZZES VIEW === */}
        {currentView === 'MY_QUIZZES' && (
         <>
            {history.length === 0 && (
              <div className="max-w-lg mx-auto mt-20 text-center">
                <p className="text-gray-500">{t('infoQuizzes')}</p>
              </div>  
            )}          
            <QuizHistoryList 
              history={history} 
              onAction={handleTakeQuiz} 
              onDelete={handleDeleteQuiz}
              actionLabel="Take Quiz"
              title="My Quizzes"
            />
             <div className="flex flex-col gap-10">
            <div id="my-quiz-player">
              {activeQuizParams && !activeQuizParams.complete && (
                <div className="border-t-2 border-dashed border-gray-200 pt-10">
                  <h2 className="text-center text-2xl font-bold text-base mb-4">Taking Quiz</h2>
                  <QuizPlayer 
                    // Pass a single quiz as an array to reuse the component
                    quizzes={[activeQuizParams.quiz]} 
                    onComplete={handleMyQuizComplete} 
                  />
                </div>
              )}

              {activeQuizParams && activeQuizParams.complete && (
                <div className="border-t-2 border-dashed border-gray-200 pt-10">
                  <Results 
                    score={activeQuizParams.score}
                    totalQuestions={activeQuizParams.total}
                    onReset={handleMyQuizClose}
                    onRetake={handleMyQuizRetake}
                    resetLabel="Close Quiz"
                  />
                </div>
              )}
            </div>
          </div>
          </>
        )}

      </main>

      <TokenStatusBar usage={tokenUsage} />

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
         <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            Powered by Gemini 2.0 Flash &bull; React &bull; Tailwind CSS
         </div>
      </footer>
    </div>
  );
};

export default QuizModule;