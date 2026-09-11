import {
  HARD_ACCURACY_THRESHOLD,
  VERY_HARD_ACCURACY_THRESHOLD,
} from "@/constants/questionDifficulty";
import type { QuestionDifficultyLevel } from "@/types/question";

export type QuestionDifficultyMetadata = {
  historicalAccuracy: number;
  difficultyLevel?: QuestionDifficultyLevel;
  difficultySource: string;
};

// Add only sourced historical accuracy figures here. The question CSV stays unchanged.
export const questionDifficulty: Record<string, QuestionDifficultyMetadata> = {};

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
