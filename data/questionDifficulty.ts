import {
  HARD_ACCURACY_THRESHOLD,
  VERY_HARD_ACCURACY_THRESHOLD,
} from "@/constants/questionDifficulty";
import type { QuestionDifficultyLevel } from "@/types/question";

export type QuestionDifficultyMetadata = {
  historicalAccuracy?: number;
  difficultyLevel?: QuestionDifficultyLevel;
  difficultySource: string;
};

const userSelectedVeryHardQuestionIds = [
  "2021-33-069",
  "2022-34-001",
  "2022-34-006",
  "2022-34-011",
  "2022-34-025",
  "2022-34-078",
  "2023-35-084",
  "2023-35-111",
  "2024-36-010",
  "2024-36-014",
  "2024-36-049",
  "2024-36-057",
  "2025-37-015",
  "2025-37-016",
  "2025-37-037",
  "2025-37-039",
  "2025-37-070",
  "2025-37-071",
  "2025-37-072",
  "2025-37-101",
  "2026-38-114",
  "2026-38-115",
  "2026-38-116",
] as const;

const learnerMistakeVeryHardQuestionIds = [
  "2017-29-045", "2017-29-046", "2017-29-119", "2017-29-124",
  "2018-30-041", "2018-30-125",
  "2019-31-042", "2019-31-115",
] as const;

const learnerMarkedHardQuestionIds = [
  "2017-29-008", "2017-29-015", "2017-29-025", "2017-29-037", "2017-29-040", "2017-29-064", "2017-29-067", "2017-29-111",
  "2018-30-002", "2018-30-014", "2018-30-015", "2018-30-043", "2018-30-055", "2018-30-057", "2018-30-062", "2018-30-098", "2018-30-115", "2018-30-119",
  "2019-31-013", "2019-31-019", "2019-31-022", "2019-31-031", "2019-31-035", "2019-31-039", "2019-31-050", "2019-31-065", "2019-31-067", "2019-31-088", "2019-31-096", "2019-31-106", "2019-31-110", "2019-31-112", "2019-31-116", "2019-31-120", "2019-31-125",
] as const;

// Keep curated difficulty markers separate from the question CSV. Historical accuracy
// can be added later when a sourced figure becomes available.
export const questionDifficulty: Record<string, QuestionDifficultyMetadata> = Object.fromEntries([
  ...userSelectedVeryHardQuestionIds.map((questionId) => [
    questionId,
    { difficultyLevel: "very-hard", difficultySource: "ユーザー指定の難問リスト（2026-09-11）" },
  ]),
  ...learnerMistakeVeryHardQuestionIds.map((questionId) => [
    questionId,
    { difficultyLevel: "very-hard", difficultySource: "ユーザーの学習記録（誤答）" },
  ]),
  ...learnerMarkedHardQuestionIds.map((questionId) => [
    questionId,
    { difficultyLevel: "hard", difficultySource: "ユーザーの学習記録（迷った問題）" },
  ]),
]);

export function getDifficultyLevel(
  historicalAccuracy: number | undefined,
  difficultyLevel?: QuestionDifficultyLevel,
): QuestionDifficultyLevel {
  if (difficultyLevel) return difficultyLevel;
  if (historicalAccuracy === undefined) return "normal";
  if (historicalAccuracy < VERY_HARD_ACCURACY_THRESHOLD) return "very-hard";
  if (historicalAccuracy < HARD_ACCURACY_THRESHOLD) return "hard";
  return "normal";
}
