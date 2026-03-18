import { useState, useEffect, useCallback } from 'react';

export type QuizTypeId = 'identify' | 'match' | 'spot-wrong' | 'meaning' | 'single-double' | 'confidence' | 'timed';

export interface ActivityItem {
  id: string;
  type: 'quiz' | 'classify';
  quizType?: QuizTypeId;
  mudraName: string;
  correct: boolean;
  timestamp: number;
}

export interface QuizResult {
  id: string;
  quizType: QuizTypeId;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeTaken?: number;
  timestamp: number;
}

export interface QuizTypeStats {
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface UserProgress {
  totalAttempts: number;
  correctPredictions: number;
  incorrectPredictions: number;
  accuracy: number;
  quizzesCompleted: number;
  streak: number;
  lastActivityDate: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  activities: ActivityItem[];
  quizResults: QuizResult[];
  quizTypeStats: Record<QuizTypeId, QuizTypeStats>;
}

const STORAGE_KEY = 'mudra_user_progress';

const defaultQuizTypeStats: Record<QuizTypeId, QuizTypeStats> = {
  'identify': { attempts: 0, correct: 0, accuracy: 0 },
  'match': { attempts: 0, correct: 0, accuracy: 0 },
  'spot-wrong': { attempts: 0, correct: 0, accuracy: 0 },
  'meaning': { attempts: 0, correct: 0, accuracy: 0 },
  'single-double': { attempts: 0, correct: 0, accuracy: 0 },
  'confidence': { attempts: 0, correct: 0, accuracy: 0 },
  'timed': { attempts: 0, correct: 0, accuracy: 0 },
};

const defaultProgress: UserProgress = {
  totalAttempts: 0,
  correctPredictions: 0,
  incorrectPredictions: 0,
  accuracy: 0,
  quizzesCompleted: 0,
  streak: 0,
  lastActivityDate: null,
  level: 'Beginner',
  activities: [],
  quizResults: [],
  quizTypeStats: { ...defaultQuizTypeStats },
};

const calculateLevel = (correctPredictions: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (correctPredictions >= 100) return 'Advanced';
  if (correctPredictions >= 30) return 'Intermediate';
  return 'Beginner';
};

const calculateStreak = (lastActivityDate: string | null): { streak: number; isNewDay: boolean } => {
  if (!lastActivityDate) return { streak: 1, isNewDay: true };
  
  const today = new Date().toDateString();
  const lastDate = new Date(lastActivityDate).toDateString();
  
  if (today === lastDate) {
    return { streak: 0, isNewDay: false }; // Same day, no streak change
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (yesterday.toDateString() === lastDate) {
    return { streak: 1, isNewDay: true }; // Consecutive day
  }
  
  return { streak: 1, isNewDay: true }; // Streak reset
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, []);

  // Save to localStorage whenever progress changes
  const saveProgress = useCallback((newProgress: UserProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, []);

  // Record a single activity (quiz answer or classification)
  const recordActivity = useCallback((
    type: 'quiz' | 'classify',
    mudraName: string,
    correct: boolean,
    quizType?: QuizTypeId
  ) => {
    setProgress(prev => {
      const { streak: streakChange, isNewDay } = calculateStreak(prev.lastActivityDate);
      
      const newCorrect = prev.correctPredictions + (correct ? 1 : 0);
      const newIncorrect = prev.incorrectPredictions + (correct ? 0 : 1);
      const newTotal = prev.totalAttempts + 1;

      // Update quiz type stats if applicable
      let newQuizTypeStats = prev.quizTypeStats || { ...defaultQuizTypeStats };
      if (quizType && type === 'quiz') {
        const currentStats = newQuizTypeStats[quizType] || { attempts: 0, correct: 0, accuracy: 0 };
        const newAttempts = currentStats.attempts + 1;
        const newTypeCorrect = currentStats.correct + (correct ? 1 : 0);
        newQuizTypeStats = {
          ...newQuizTypeStats,
          [quizType]: {
            attempts: newAttempts,
            correct: newTypeCorrect,
            accuracy: newAttempts > 0 ? Math.round((newTypeCorrect / newAttempts) * 100) : 0,
          },
        };
      }
      
      const newProgress: UserProgress = {
        ...prev,
        totalAttempts: newTotal,
        correctPredictions: newCorrect,
        incorrectPredictions: newIncorrect,
        accuracy: newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0,
        streak: isNewDay ? prev.streak + streakChange : prev.streak,
        lastActivityDate: new Date().toISOString(),
        level: calculateLevel(newCorrect),
        quizTypeStats: newQuizTypeStats,
        activities: [
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            quizType,
            mudraName,
            correct,
            timestamp: Date.now(),
          },
          ...prev.activities.slice(0, 49), // Keep last 50 activities
        ],
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  // Record a completed quiz
  const recordQuizComplete = useCallback((
    quizType: QuizTypeId,
    totalQuestions: number,
    correctAnswers: number,
    timeTaken?: number
  ) => {
    setProgress(prev => {
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      const newProgress: UserProgress = {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        quizResults: [
          {
            id: `quiz-${Date.now()}`,
            quizType,
            totalQuestions,
            correctAnswers,
            accuracy,
            timeTaken,
            timestamp: Date.now(),
          },
          ...prev.quizResults.slice(0, 19), // Keep last 20 quiz results
        ],
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    saveProgress(defaultProgress);
  }, [saveProgress]);

  return {
    progress,
    recordActivity,
    recordQuizComplete,
    resetProgress,
  };
}
