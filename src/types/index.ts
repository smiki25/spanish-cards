export interface VocabularyWord {
  id: string;
  spanish: string;
  english: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
}

export interface GameState {
  currentQuestion: QuizQuestion | null;
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  gameStarted: boolean;
  gameCompleted: boolean;
  hardMode: boolean;
}

export interface GameStats {
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
} 