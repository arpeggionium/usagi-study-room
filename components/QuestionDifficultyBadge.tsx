import { getDifficultyLevel } from "@/data/questionDifficulty";
import type { Question } from "@/types/question";

type QuestionDifficultyBadgeProps = {
  question: Pick<Question, "historicalAccuracy" | "difficultyLevel">;
  showDifficultyBadge?: boolean;
  compact?: boolean;
  className?: string;
};

export function QuestionDifficultyBadge({
  question,
  showDifficultyBadge = true,
  compact = false,
  className = "",
}: QuestionDifficultyBadgeProps) {
  if (!showDifficultyBadge || question.historicalAccuracy === undefined) return null;

  const level = getDifficultyLevel(question.historicalAccuracy, question.difficultyLevel);
  if (level === "normal") return null;

  const label = level === "very-hard" ? "かなりの難問！" : "難問！";
  const badgeClassName = level === "very-hard"
    ? "bg-berry text-white"
    : "bg-peach text-berry";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ${badgeClassName} ${className}`}
      aria-label={`${label}。参考正答率 ${question.historicalAccuracy}%`}
    >
      {compact && level === "hard" ? "難問" : label}
    </span>
  );
}
