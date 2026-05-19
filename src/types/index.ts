// German Learning App Types

export interface VocabularyItem {
  id: string;
  german: string;
  article: 'der' | 'die' | 'das' | '';
  plural: string;
  vietnamese: string;
  ipa: string;
  example: string;
  exampleVn: string;
  category: string;
  unit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isFavorite: boolean;
}

export interface GrammarPoint {
  id: string;
  title: string;
  titleVn: string;
  unit: number;
  explanation: string;
  explanationVn: string;
  examples: { german: string; vietnamese: string }[];
  tips: string[];
  tables?: { headers: string[]; rows: string[][] }[];
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'rearrange' | 'listening' | 'grammar-correction';
  question: string;
  questionVn: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  unit: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Lesson {
  id: string;
  title: string;
  titleVn: string;
  unit: number;
  description: string;
  descriptionVn: string;
  sections: LessonSection[];
  vocabulary: string[]; // vocab ids
  grammar: string[]; // grammar ids
  exercises: string[]; // exercise ids
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
}

export interface LessonSection {
  id: string;
  title: string;
  titleVn: string;
  type: 'intro' | 'vocabulary' | 'grammar' | 'dialogue' | 'exercise' | 'listening' | 'summary';
  content: string;
  contentVn: string;
  examples?: { german: string; vietnamese: string }[];
}

export interface UserProgress {
  currentUnit: number;
  completedLessons: string[];
  completedExercises: string[];
  vocabLearned: string[];
  grammarLearned: string[];
  totalXP: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyTime: number; // minutes
  dailyGoal: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  total: number;
  answers: { questionId: string; userAnswer: string; correct: boolean }[];
  date: string;
  timeSpent: number;
}

export interface FlashcardState {
  currentIndex: number;
  isFlipped: boolean;
  cards: VocabularyItem[];
  known: string[];
  unknown: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MockTest {
  id: string;
  title: string;
  sections: MockTestSection[];
  timeLimit: number;
  isCompleted: boolean;
}

export interface MockTestSection {
  id: string;
  title: string;
  type: 'hoeren' | 'lesen' | 'schreiben' | 'grammatik' | 'wortschatz';
  questions: Exercise[];
}

export type AppPage = 'dashboard' | 'learn' | 'vocabulary' | 'grammar' | 'quiz' | 'mock-test' | 'progress' | 'settings';
