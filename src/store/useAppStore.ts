import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, FlashcardState, QuizAttempt, AppPage, VocabularyItem } from '@/types';
import { vocabularies } from '@/data/germanData';

interface AppState {
  // Navigation
  currentPage: AppPage;
  setPage: (page: AppPage) => void;
  
  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // User Progress
  userProgress: UserProgress;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string) => void;
  learnVocab: (vocabId: string) => void;
  learnGrammar: (grammarId: string) => void;
  updateStudyTime: (minutes: number) => void;
  updateStreak: () => void;
  resetProgress: () => void;
  
  // Vocabulary
  vocabList: VocabularyItem[];
  toggleFavorite: (vocabId: string) => void;
  
  // Flashcards
  flashcardState: FlashcardState;
  setFlashcardIndex: (index: number) => void;
  flipCard: () => void;
  markKnown: () => void;
  markUnknown: () => void;
  resetFlashcards: (unit?: number, category?: string) => void;
  
  // Quiz
  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: QuizAttempt) => void;
  
  // Mock Test
  mockTestInProgress: boolean;
  setMockTestInProgress: (val: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Settings
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
}

const initialUserProgress: UserProgress = {
  currentUnit: 1,
  completedLessons: [],
  completedExercises: [],
  vocabLearned: [],
  grammarLearned: [],
  totalXP: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  studyTime: 0,
  dailyGoal: 30,
};

const initialFlashcardState: FlashcardState = {
  currentIndex: 0,
  isFlipped: false,
  cards: vocabularies.slice(0, 20),
  known: [],
  unknown: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: 'dashboard',
      setPage: (page) => set({ currentPage: page }),
      
      isDarkMode: true,
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      
      userProgress: initialUserProgress,
      addXP: (amount) => set((s) => {
        const newXP = s.userProgress.totalXP + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        return {
          userProgress: {
            ...s.userProgress,
            totalXP: newXP,
            level: newLevel,
          },
        };
      }),
      completeLesson: (lessonId) => set((s) => {
        if (s.userProgress.completedLessons.includes(lessonId)) return s;
        const newCompleted = [...s.userProgress.completedLessons, lessonId];
        const newXP = s.userProgress.totalXP + 50;
        return {
          userProgress: {
            ...s.userProgress,
            completedLessons: newCompleted,
            totalXP: newXP,
            level: Math.floor(newXP / 500) + 1,
            currentUnit: Math.min(Math.floor(newCompleted.length / 2) + 1, 4),
          },
        };
      }),
      completeExercise: (exerciseId) => set((s) => {
        if (s.userProgress.completedExercises.includes(exerciseId)) return s;
        const newCompleted = [...s.userProgress.completedExercises, exerciseId];
        const newXP = s.userProgress.totalXP + 10;
        return {
          userProgress: {
            ...s.userProgress,
            completedExercises: newCompleted,
            totalXP: newXP,
            level: Math.floor(newXP / 500) + 1,
          },
        };
      }),
      learnVocab: (vocabId) => set((s) => {
        if (s.userProgress.vocabLearned.includes(vocabId)) return s;
        return {
          userProgress: {
            ...s.userProgress,
            vocabLearned: [...s.userProgress.vocabLearned, vocabId],
          },
        };
      }),
      learnGrammar: (grammarId) => set((s) => {
        if (s.userProgress.grammarLearned.includes(grammarId)) return s;
        return {
          userProgress: {
            ...s.userProgress,
            grammarLearned: [...s.userProgress.grammarLearned, grammarId],
          },
        };
      }),
      updateStudyTime: (minutes) => set((s) => ({
        userProgress: {
          ...s.userProgress,
          studyTime: s.userProgress.studyTime + minutes,
        },
      })),
      updateStreak: () => set((s) => {
        const today = new Date().toISOString().split('T')[0];
        if (s.userProgress.lastStudyDate === today) return s;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const isConsecutive = s.userProgress.lastStudyDate === yesterdayStr;
        const newStreak = isConsecutive ? s.userProgress.streak + 1 : 1;
        
        return {
          userProgress: {
            ...s.userProgress,
            streak: newStreak,
            longestStreak: Math.max(newStreak, s.userProgress.longestStreak),
            lastStudyDate: today,
          },
        };
      }),
      resetProgress: () => set({
        userProgress: initialUserProgress,
        quizAttempts: [],
      }),
      
      vocabList: vocabularies,
      toggleFavorite: (vocabId) => set((s) => ({
        vocabList: s.vocabList.map((v) =>
          v.id === vocabId ? { ...v, isFavorite: !v.isFavorite } : v
        ),
      })),
      
      flashcardState: initialFlashcardState,
      setFlashcardIndex: (index) => set((s) => ({
        flashcardState: { ...s.flashcardState, currentIndex: index, isFlipped: false },
      })),
      flipCard: () => set((s) => ({
        flashcardState: { ...s.flashcardState, isFlipped: !s.flashcardState.isFlipped },
      })),
      markKnown: () => set((s) => {
        const card = s.flashcardState.cards[s.flashcardState.currentIndex];
        if (!card) return s;
        const newKnown = [...s.flashcardState.known, card.id];
        const newIndex = s.flashcardState.currentIndex + 1;
        return {
          flashcardState: {
            ...s.flashcardState,
            known: newKnown,
            currentIndex: newIndex,
            isFlipped: false,
          },
        };
      }),
      markUnknown: () => set((s) => {
        const card = s.flashcardState.cards[s.flashcardState.currentIndex];
        if (!card) return s;
        const newUnknown = [...s.flashcardState.unknown, card.id];
        const newIndex = s.flashcardState.currentIndex + 1;
        return {
          flashcardState: {
            ...s.flashcardState,
            unknown: newUnknown,
            currentIndex: newIndex,
            isFlipped: false,
          },
        };
      }),
      resetFlashcards: (unit, category) => set(() => {
        let filtered = vocabularies;
        if (unit) filtered = filtered.filter((v) => v.unit === unit);
        if (category) filtered = filtered.filter((v) => v.category === category);
        return {
          flashcardState: {
            ...initialFlashcardState,
            cards: filtered.length > 0 ? filtered : vocabularies,
          },
        };
      }),
      
      quizAttempts: [],
      addQuizAttempt: (attempt) => set((s) => ({
        quizAttempts: [...s.quizAttempts, attempt],
      })),
      
      mockTestInProgress: false,
      setMockTestInProgress: (val) => set({ mockTestInProgress: val }),
      
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
      
      dailyGoal: 30,
      setDailyGoal: (goal) => set((s) => ({
        dailyGoal: goal,
        userProgress: { ...s.userProgress, dailyGoal: goal },
      })),
    }),
    {
      name: 'deutsch-lernen-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        vocabList: state.vocabList,
        quizAttempts: state.quizAttempts,
        isDarkMode: state.isDarkMode,
        dailyGoal: state.dailyGoal,
      }),
    }
  )
);
