import { QUESTION_CATEGORIES } from "@/constants/categories";
import { questionDataReport, questions } from "@/data/questions.generated";
import type { Question, QuestionCategory } from "@/types/question";
import type { LearningProgress } from "@/types/progress";
import { shuffle } from "@/lib/utils/random";

export type CategorySummary = {
  category: QuestionCategory;
  questionCount: number;
  answeredQuestionCount: number;
  accuracy: number | null;
};

export type ExamRoundSummary = {
  examRound: string;
  examYear: string;
  questionCount: number;
  answeredQuestionCount: number;
  accuracy: number | null;
};

export type LearningScopeSummary = Pick<
  ExamRoundSummary,
  "questionCount" | "answeredQuestionCount" | "accuracy"
>;

export function getAllQuestions(): Question[] {
  return questions;
}

export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return questions.filter((question) => question.category === category);
}

export function getQuestionsByRound(examRound: string): Question[] {
  return questions
    .filter((question) => question.examRound === examRound)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id);
}

export function isKnownQuestionId(id: string): boolean {
  return questions.some((question) => question.id === id);
}

export function getRandomQuestions(limit = 10, recentlyAnsweredIds: readonly string[] = []): Question[] {
  const recentSet = new Set(recentlyAnsweredIds);
  const notRecent = questions.filter((question) => !recentSet.has(question.id));
  const recent = questions.filter((question) => recentSet.has(question.id));
  return [...shuffle(notRecent), ...shuffle(recent)].slice(0, Math.min(limit, questions.length));
}

export function getLearningScopeSummary(
  scopeQuestions: Question[],
  progress?: LearningProgress,
): LearningScopeSummary {
  if (!progress) {
    return { questionCount: scopeQuestions.length, answeredQuestionCount: 0, accuracy: null };
  }
  const ids = new Set(scopeQuestions.map((question) => question.id));
  const records = progress.records.filter((record) => ids.has(record.questionId));
  const correctCount = records.filter((record) => record.isCorrect).length;
  return {
    questionCount: scopeQuestions.length,
    answeredQuestionCount: new Set(records.map((record) => record.questionId)).size,
    accuracy: records.length ? Math.round((correctCount / records.length) * 100) : null,
  };
}

export function getCategorySummaries(progress?: LearningProgress): CategorySummary[] {
  return QUESTION_CATEGORIES.map((category) => ({
    category,
    ...getLearningScopeSummary(getQuestionsByCategory(category), progress),
  }));
}

export function getExamRoundSummaries(progress?: LearningProgress): ExamRoundSummary[] {
  return [...new Set(questions.map((question) => question.examRound))]
    .sort((a, b) => Number(b) - Number(a))
    .map((examRound) => {
      const roundQuestions = getQuestionsByRound(examRound);
      return {
        examRound,
        examYear: roundQuestions[0]?.examYear ?? "",
        ...getLearningScopeSummary(roundQuestions, progress),
      };
    });
}

export function getQuestionDataSummary() {
  return questionDataReport;
}
