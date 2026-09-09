import { EXAM_DATE } from "@/config/exam";

export type ExamCountdown = {
  daysUntil: number;
  isExamDay: boolean;
  hasPassed: boolean;
};

function startOfLocalDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getExamCountdown(
  today = new Date(),
  examDateString = EXAM_DATE,
): ExamCountdown {
  const [year, month, day] = examDateString.split("-").map(Number);
  const examDate = new Date(year, month - 1, day);
  const currentDate = startOfLocalDate(today);
  const diff = Date.UTC(examDate.getFullYear(), examDate.getMonth(), examDate.getDate())
    - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const daysUntil = Math.ceil(diff / (24 * 60 * 60 * 1000));

  return {
    daysUntil: Math.max(0, daysUntil),
    isExamDay: daysUntil === 0,
    hasPassed: daysUntil < 0,
  };
}
