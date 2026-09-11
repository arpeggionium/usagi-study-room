import { getDifficultyLevel } from "@/data/questionDifficulty";
import type { Question } from "@/types/question";

type QuestionDifficultyBadgeProps = {
  question: Pick<Question, "historicalAccuracy" | "difficultyLevel">;
  showDifficultyBadge?: boolean;
  compact?: boolean;
  animate?: boolean;
  className?: string;
};

export function QuestionDifficultyBadge({
  question,
  showDifficultyBadge = true,
  compact = false,
  animate = false,
  className = "",
}: QuestionDifficultyBadgeProps) {
  if (!showDifficultyBadge) return null;

  const level = getDifficultyLevel(question.historicalAccuracy, question.difficultyLevel);
  if (level === "normal") return null;

  const label = level === "very-hard" ? "かなりの難問！" : "難問！";
  const badgeClassName = level === "very-hard"
    ? "bg-berry text-white"
    : "bg-peach text-berry";
  const sizeClassName = compact
    ? "px-2.5 py-1 text-xs"
    : level === "very-hard"
      ? "px-4 py-2 text-xl leading-tight shadow-[0_7px_18px_rgba(183,92,112,0.25)]"
      : "px-4 py-2 text-lg leading-tight shadow-[0_6px_16px_rgba(233,165,64,0.24)]";
  const animationClassName = animate && !compact
    ? level === "very-hard"
      ? "difficulty-badge-animate difficulty-badge-very-hard"
      : "difficulty-badge-animate difficulty-badge-hard"
    : "";

  return (
    <span
      className={`difficulty-badge inline-flex items-center rounded-full font-black ${sizeClassName} ${badgeClassName} ${animationClassName} ${className}`}
      aria-label={question.historicalAccuracy === undefined ? label : `${label}。参考正答率 ${question.historicalAccuracy}%`}
    >
      {compact && level === "hard" ? "難問" : label}
    </span>
  );
}
