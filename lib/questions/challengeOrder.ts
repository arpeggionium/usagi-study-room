import { getDifficultyLevel } from "@/data/questionDifficulty";
import type { Question, QuestionDifficultyLevel } from "@/types/question";

const CHALLENGE_DIFFICULTY_ORDER: Record<QuestionDifficultyLevel, number> = {
  normal: 0,
  hard: 1,
  "very-hard": 2,
};

/**
 * Groups an already-randomized challenge selection by difficulty.
 * The incoming order is preserved within each difficulty group, so this only
 * changes placement and never changes which questions were selected.
 */
export function orderChallengeQuestionsByDifficulty(
  selectedQuestions: readonly Question[],
): Question[] {
  return selectedQuestions
    .map((question, selectedIndex) => ({
      question,
      selectedIndex,
      difficultyOrder: CHALLENGE_DIFFICULTY_ORDER[
        getDifficultyLevel(question.historicalAccuracy, question.difficultyLevel)
      ],
    }))
    .sort((a, b) => a.difficultyOrder - b.difficultyOrder || a.selectedIndex - b.selectedIndex)
    .map(({ question }) => question);
}
