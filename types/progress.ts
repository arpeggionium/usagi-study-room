export type AnswerRecord = {
  questionId: string;
  examRound?: string;
  category?: string;
  selectedChoice: string;
  correctChoice?: string;
  isCorrect: boolean;
  answeredAt: string;
  attemptCount?: number;
  correctCount?: number;
  incorrectCount?: number;
};

export type QuestionStats = {
  questionId: string;
  answerCount: number;
  correctCount: number;
  incorrectCount: number;
  lastAnsweredAt: string;
};

export type LearningProgress = {
  records: AnswerRecord[];
  questionStats: Record<string, QuestionStats>;
  wrongQuestionIds: string[];
  currentCorrectStreak: number;
  todaySolvedCount: number;
  continuousStudyDays: number;
  lastStudiedDate: string | null;
};

export type ProgressSummary = {
  todaySolvedCount: number;
  continuousStudyDays: number;
  recentAccuracy: number | null;
  totalAnswered: number;
  wrongQuestionCount: number;
};

export type DailyStudySummary = {
  date: string;
  solvedCount: number;
  correctCount: number;
};

export type MonthlyStudySummary = {
  studyDays: number;
  solvedCount: number;
  accuracy: number | null;
  days: Record<string, DailyStudySummary>;
};
