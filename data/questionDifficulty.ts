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

// Keep curated difficulty markers separate from the question CSV. Historical accuracy
// can be added later when a sourced figure becomes available.
export const questionDifficulty: Record<string, QuestionDifficultyMetadata> = Object.fromEntries(
  userSelectedVeryHardQuestionIds.map((questionId) => [
    questionId,
    {
      difficultyLevel: "very-hard",
      difficultySource: "ユーザー指定の難問リスト（2026-09-11）",
    },
  ]),
);

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
