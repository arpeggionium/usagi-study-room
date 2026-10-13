import { getDifficultyLevel } from "@/data/questionDifficulty";
import { shuffle } from "@/lib/utils/random";
import type { Question } from "@/types/question";

export const HARD_CHALLENGE_QUESTION_COUNT = 3;

/**
 * Selects difficult questions for the three-question hard challenge.
 * The final question is always very hard when one is available.
 */
export function selectHardChallengeQuestions(
  sourceQuestions: readonly Question[],
  randomize: <T>(items: readonly T[]) => T[] = shuffle,
): Question[] {
  const hardQuestions = sourceQuestions.filter(
    (question) => getDifficultyLevel(question.historicalAccuracy, question.difficultyLevel) === "hard",
  );
  const veryHardQuestions = randomize(sourceQuestions.filter(
    (question) => getDifficultyLevel(question.historicalAccuracy, question.difficultyLevel) === "very-hard",
  ));

  if (veryHardQuestions.length === 0) {
    return randomize(hardQuestions).slice(0, HARD_CHALLENGE_QUESTION_COUNT);
  }

  const finalQuestion = veryHardQuestions[0];
  const openingQuestions = randomize([
    ...hardQuestions,
    ...veryHardQuestions.slice(1),
  ]).slice(0, HARD_CHALLENGE_QUESTION_COUNT - 1);

  return [...openingQuestions, finalQuestion];
}
