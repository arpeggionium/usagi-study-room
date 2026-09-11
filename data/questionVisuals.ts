import type { Question, QuestionVisualType } from "@/types/question";

export type QuestionVisual = Pick<
  Question,
  | "hasVisual"
  | "questionImage"
  | "questionImageAlt"
  | "questionImageCaption"
  | "questionImagePosition"
  | "visualType"
> & {
  required: boolean;
  pdfPage: number | null;
  cropTarget: string;
};

export type QuestionVisualAudit = {
  questionId: string;
  questionNumber: number;
  visualType: QuestionVisualType;
  required: boolean;
  pdfPage: number | null;
  cropTarget: string;
  status: "ready" | "source-needed";
};

// Keep visual metadata separate from the source CSV so future rounds can add images independently.
// questionImage is intentionally omitted until the original Round 34 PDF is available for cropping.
export const questionVisuals: Record<string, QuestionVisual> = {
  "2022-34-036": {
    hasVisual: true,
    questionImageAlt: "浴室の配置図",
    questionImageCaption: "第34回 問36の図",
    questionImagePosition: "afterQuestion",
    visualType: "diagram",
    required: true,
    pdfPage: null,
    cropTarget: "Lさんの自宅の浴室の平面図と、浴槽、車いす、手すりなどを確認できる範囲",
  },
};

export const round34VisualAudit: QuestionVisualAudit[] = [
  {
    questionId: "2022-34-036",
    questionNumber: 36,
    visualType: "diagram",
    required: true,
    pdfPage: null,
    cropTarget: "Lさんの自宅の浴室の平面図と、浴槽、車いす、手すりなどを確認できる範囲",
    status: "source-needed",
  },
];

export const questionVisualImageDirectory = "/questions/round34";
