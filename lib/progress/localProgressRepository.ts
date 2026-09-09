import type {
  AnswerRecord,
  DailyStudySummary,
  LearningProgress,
  MonthlyStudySummary,
  ProgressSummary,
} from "@/types/progress";
import type { Question, QuestionCategory } from "@/types/question";
import { questionIds } from "@/data/questionIds.generated";
import { differenceInCalendarDays, toDateKey } from "@/lib/utils/date";

const STORAGE_KEY = "care-rabbit-study-progress-v1";
const knownQuestionIds = new Set<string>(questionIds);

export const emptyProgress: LearningProgress = {
  records: [],
  questionStats: {},
  wrongQuestionIds: [],
  currentCorrectStreak: 0,
  todaySolvedCount: 0,
  continuousStudyDays: 0,
  lastStudiedDate: null,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeProgress(progress: LearningProgress): LearningProgress {
  const records = progress.records.filter((record) => knownQuestionIds.has(record.questionId));
  const questionStats = Object.fromEntries(
    Object.entries(progress.questionStats).filter(([questionId]) => knownQuestionIds.has(questionId)),
  );
  const wrongQuestionIds = progress.wrongQuestionIds.filter((questionId) => knownQuestionIds.has(questionId));
  const knownProgress = { ...progress, records, questionStats, wrongQuestionIds };
  const today = toDateKey();
  const days = getDailyStudySummaries(knownProgress);
  const dates = Object.keys(days).filter((date) => date <= today).sort();
  const lastStudiedDate = dates.at(-1) ?? null;
  let continuousStudyDays = 0;
  if (lastStudiedDate && differenceInCalendarDays(lastStudiedDate, today) <= 1) {
    continuousStudyDays = 1;
    for (let index = dates.length - 1; index > 0; index--) {
      if (differenceInCalendarDays(dates[index - 1], dates[index]) !== 1) break;
      continuousStudyDays++;
    }
  }
  return { ...knownProgress, lastStudiedDate, continuousStudyDays, todaySolvedCount: days[today]?.solvedCount ?? 0 };
}

export function loadProgress(): LearningProgress {
  if (!isBrowser()) {
    return emptyProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyProgress;
  }

  try {
    return normalizeProgress({
      ...emptyProgress,
      ...JSON.parse(raw),
    });
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: LearningProgress): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function applyAnswer(
  question: Question,
  selectedChoice: string,
  currentProgress: LearningProgress,
): LearningProgress {
  const today = toDateKey();
  const lastDate = currentProgress.lastStudiedDate;
  const gap = lastDate ? differenceInCalendarDays(lastDate, today) : null;
  const continuousStudyDays =
    lastDate === today
      ? currentProgress.continuousStudyDays || 1
      : gap === 1
        ? Math.max(1, currentProgress.continuousStudyDays) + 1
        : 1;

  const isCorrect = question.correctChoices.includes(selectedChoice);
  const record: AnswerRecord = {
    questionId: question.id,
    examRound: question.examRound,
    category: question.category,
    selectedChoice,
    correctChoice: question.correctChoice,
    isCorrect,
    answeredAt: new Date().toISOString(),
    attemptCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
  const previousStats = currentProgress.questionStats[question.id];
  const stats = {
    questionId: question.id,
    answerCount: (previousStats?.answerCount ?? 0) + 1,
    correctCount: (previousStats?.correctCount ?? 0) + (isCorrect ? 1 : 0),
    incorrectCount: (previousStats?.incorrectCount ?? 0) + (isCorrect ? 0 : 1),
    lastAnsweredAt: record.answeredAt,
  };
  record.attemptCount = stats.answerCount;
  record.correctCount = stats.correctCount;
  record.incorrectCount = stats.incorrectCount;
  const wrongSet = new Set(currentProgress.wrongQuestionIds);

  if (isCorrect) {
    wrongSet.delete(question.id);
  } else {
    wrongSet.add(question.id);
  }

  const nextProgress: LearningProgress = {
    records: [...currentProgress.records, record],
    questionStats: {
      ...currentProgress.questionStats,
      [question.id]: stats,
    },
    wrongQuestionIds: [...wrongSet],
    currentCorrectStreak: isCorrect
      ? currentProgress.currentCorrectStreak + 1
      : 0,
    todaySolvedCount:
      lastDate === today ? currentProgress.todaySolvedCount + 1 : 1,
    continuousStudyDays,
    lastStudiedDate: today,
  };

  return nextProgress;
}

export function recordAnswer(
  question: Question,
  selectedChoice: string,
  currentProgress = loadProgress(),
): LearningProgress {
  const nextProgress = applyAnswer(question, selectedChoice, currentProgress);
  saveProgress(nextProgress);
  return nextProgress;
}

export function recordAnswers(
  answers: Array<{ question: Question; selectedChoice: string }>,
  currentProgress = loadProgress(),
): LearningProgress {
  const nextProgress = answers.reduce(
    (progress, answer) => applyAnswer(answer.question, answer.selectedChoice, progress),
    currentProgress,
  );
  saveProgress(nextProgress);
  return nextProgress;
}

export function getProgressSummary(progress = loadProgress()): ProgressSummary {
  const recent = progress.records.slice(-30);
  const correct = recent.filter((record) => record.isCorrect).length;

  return {
    todaySolvedCount: progress.todaySolvedCount,
    continuousStudyDays: progress.continuousStudyDays,
    recentAccuracy: recent.length > 0 ? Math.round((correct / recent.length) * 100) : null,
    totalAnswered: progress.records.length,
    wrongQuestionCount: progress.wrongQuestionIds.length,
  };
}

export function getCategoryAccuracy(
  category: QuestionCategory,
  questions: Question[],
  progress = loadProgress(),
): number | null {
  const ids = new Set(
    questions
      .filter((question) => question.category === category)
      .map((question) => question.id),
  );
  const records = progress.records.filter((record) => ids.has(record.questionId));

  if (records.length === 0) {
    return null;
  }

  const correct = records.filter((record) => record.isCorrect).length;
  return Math.round((correct / records.length) * 100);
}

export function getWrongQuestionIds(progress = loadProgress()): string[] {
  return progress.wrongQuestionIds;
}

export function getRecentlyAnsweredQuestionIds(progress = loadProgress(), limit = 100): string[] {
  return [...new Set(progress.records.slice(-limit).reverse().map((record) => record.questionId))];
}

export function getDailyStudySummaries(
  progress = loadProgress(),
): Record<string, DailyStudySummary> {
  return progress.records.reduce<Record<string, DailyStudySummary>>((days, record) => {
    const date = toDateKey(new Date(record.answeredAt));
    const current = days[date] ?? {
      date,
      solvedCount: 0,
      correctCount: 0,
    };

    days[date] = {
      ...current,
      solvedCount: current.solvedCount + 1,
      correctCount: current.correctCount + (record.isCorrect ? 1 : 0),
    };

    return days;
  }, {});
}

export function getMonthlyStudySummary(
  year: number,
  monthIndex: number,
  progress = loadProgress(),
): MonthlyStudySummary {
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const today = toDateKey();
  const allDays = getDailyStudySummaries(progress);
  const days = Object.fromEntries(
    Object.entries(allDays).filter(
      ([date]) => date.startsWith(monthPrefix) && date <= today,
    ),
  );
  const summaries = Object.values(days);
  const solvedCount = summaries.reduce((sum, day) => sum + day.solvedCount, 0);
  const correctCount = summaries.reduce((sum, day) => sum + day.correctCount, 0);

  return {
    studyDays: summaries.length,
    solvedCount,
    accuracy: solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : null,
    days,
  };
}

export function clearProgress(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
