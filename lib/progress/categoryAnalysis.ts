import {
  IMPROVING_CATEGORY_ACCURACY,
  MINIMUM_ANSWERS_FOR_CATEGORY_ANALYSIS,
  STRONG_CATEGORY_ACCURACY,
  WEAKNESS_REVIEW_QUESTION_LIMIT,
} from "@/constants/learningAnalysis";
import type { LearningProgress } from "@/types/progress";
import type { Question, QuestionCategory } from "@/types/question";

export type CategoryLearningStatus = "collecting" | "strong" | "improving" | "weak";
export type CategoryLearningStats = {
  category: QuestionCategory;
  answerCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number | null;
  status: CategoryLearningStatus;
};

export function getCategoryLearningStatus(answerCount: number, accuracy: number | null): CategoryLearningStatus {
  if (answerCount < MINIMUM_ANSWERS_FOR_CATEGORY_ANALYSIS || accuracy === null) return "collecting";
  if (accuracy >= STRONG_CATEGORY_ACCURACY) return "strong";
  if (accuracy >= IMPROVING_CATEGORY_ACCURACY) return "improving";
  return "weak";
}

export function getCategoryStats(categories: readonly QuestionCategory[], progress: LearningProgress): CategoryLearningStats[] {
  return categories.map((category) => {
    const records = progress.records.filter((record) => record.category === category);
    const correctCount = records.filter((record) => record.isCorrect).length;
    const answerCount = records.length;
    const accuracy = answerCount ? Math.round((correctCount / answerCount) * 100) : null;
    return { category, answerCount, correctCount, incorrectCount: answerCount - correctCount, accuracy, status: getCategoryLearningStatus(answerCount, accuracy) };
  });
}

export function getWeakCategories(stats: readonly CategoryLearningStats[]): CategoryLearningStats[] {
  return stats
    .filter((stat) => stat.status === "weak")
    .sort((a, b) => (a.accuracy ?? 101) - (b.accuracy ?? 101) || b.answerCount - a.answerCount || a.category.localeCompare(b.category, "ja"));
}

export function getRecommendedReviewCategory(stats: readonly CategoryLearningStats[]): CategoryLearningStats | null {
  return getWeakCategories(stats)[0] ?? null;
}

export function selectWeaknessReviewQuestions(
  category: QuestionCategory,
  questions: readonly Question[],
  progress: LearningProgress,
  limit = WEAKNESS_REVIEW_QUESTION_LIMIT,
  random: () => number = Math.random,
): Question[] {
  const lastWrongAt = new Map<string, string>();
  for (const record of progress.records) {
    if (!record.isCorrect) lastWrongAt.set(record.questionId, record.answeredAt);
  }
  return questions
    .filter((question) => question.category === category)
    .map((question) => {
      const stat = progress.questionStats[question.id];
      const correctCount = stat?.correctCount ?? 0;
      const incorrectCount = stat?.incorrectCount ?? 0;
      return { question, neverCorrect: correctCount === 0, incorrectCount, lastWrongAt: lastWrongAt.get(question.id) ?? "", tie: random() };
    })
    .sort((a, b) => Number(b.neverCorrect) - Number(a.neverCorrect) || b.incorrectCount - a.incorrectCount || b.lastWrongAt.localeCompare(a.lastWrongAt) || a.tie - b.tie)
    .slice(0, Math.min(limit, questions.filter((question) => question.category === category).length))
    .map(({ question }) => question);
}
