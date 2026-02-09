export type Language = 'en' | 'de' | 'fr';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  lastModified: number;
}

export interface Notification {
  id: string;
  message: string;
  isSystem: boolean;
  date: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'class' | 'document';
  url: string;
}

export interface ThemeSettings {
  textColor: string;
  backgroundColor: string;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
  stats?: {
    timesTaken: number;
    totalScore: number;
  };
}

export interface PointsData {
  totalPoints: number;
  lastUpdated: string;
}

export interface HistoryItem {
  id: string;
  sourceName: string;
  quizzes: Quiz[];
  timestamp: string;
}

export enum QuizState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  EDIT = 'EDIT'
}

export interface AppState {
  language: Language;
  theme: ThemeSettings;
  notes: Note[];
  notifications: Notification[];
  contentLibrary: ContentItem[];
  quizState: QuizState;
}