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

// Existing IDs in the curated lists above intentionally remain untouched.
const learnerMistakeVeryHardQuestionIds32To38 = [
  "2020-32-084", "2021-33-041", "2021-33-055", "2022-34-087", "2022-34-116", "2022-34-119", "2023-35-083", "2023-35-086", "2023-35-093", "2024-36-098", "2025-37-036", "2025-37-061", "2025-37-099", "2025-37-100", "2026-38-057", "2026-38-123",
] as const;

const learnerMarkedHardQuestionIds32To38 = [
  "2020-32-007", "2020-32-017", "2020-32-021", "2020-32-042", "2020-32-047", "2020-32-050", "2020-32-052", "2020-32-105", "2020-32-115",
  "2021-33-014", "2021-33-017", "2021-33-035", "2021-33-038", "2021-33-040", "2021-33-045", "2021-33-067", "2021-33-078", "2021-33-099",
  "2022-34-008", "2022-34-031", "2022-34-041", "2022-34-056", "2022-34-089", "2022-34-106", "2022-34-115",
  "2023-35-005", "2023-35-070", "2023-35-073", "2023-35-078", "2023-35-091", "2023-35-092", "2023-35-117", "2023-35-122",
  "2024-36-012", "2024-36-046", "2024-36-071", "2024-36-082", "2024-36-083", "2024-36-087", "2024-36-105", "2024-36-116",
  "2025-37-014", "2025-37-028", "2025-37-032", "2025-37-059", "2025-37-086", "2025-37-091", "2025-37-098", "2025-37-119",
  "2026-38-006", "2026-38-033", "2026-38-049", "2026-38-054", "2026-38-096", "2026-38-117", "2026-38-124",
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
  ...learnerMistakeVeryHardQuestionIds32To38.map((questionId) => [
    questionId,
    { difficultyLevel: "very-hard", difficultySource: "ユーザーの学習記録（第32〜38回・誤答）" },
  ]),
  ...learnerMarkedHardQuestionIds32To38.map((questionId) => [
    questionId,
    { difficultyLevel: "hard", difficultySource: "ユーザーの学習記録（第32〜38回・迷った問題）" },
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
