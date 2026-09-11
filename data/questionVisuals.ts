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
export const questionVisuals: Record<string, QuestionVisual> = {
  "2022-34-036": {
    hasVisual: true,
    questionImage: "/questions/round34/036.png",
    questionImageAlt: "浴室の配置図",
    questionImageCaption: "第34回 問36の図",
    questionImagePosition: "afterQuestion",
    visualType: "diagram",
    required: true,
    pdfPage: 23,
    cropTarget: "Lさんの自宅の浴室の平面図と、浴槽、車いす、手すりなどを確認できる範囲",
  },
  "2023-35-031": {
    hasVisual: true,
    questionImage: "/questions/round35/031.png",
    questionImageAlt: "格子模様と透明な部分があるテーブルの図",
    questionImageCaption: "第35回 問31の図",
    questionImagePosition: "afterQuestion",
    visualType: "illustration",
    required: true,
    pdfPage: 16,
    cropTarget: "乳児、テーブルの格子柄と透明な部分、母親が確認できる範囲",
  },
  "2023-35-091": {
    hasVisual: true,
    questionImage: "/questions/round35/091.png",
    questionImageAlt: "目の周囲の清拭方向を示す五つの図",
    questionImageCaption: "第35回 問91の図",
    questionImagePosition: "beforeChoices",
    visualType: "illustration",
    required: true,
    pdfPage: 47,
    cropTarget: "清拭方向を矢印で示したAからEまでの五つの顔の図",
  },
  "2023-35-114": {
    hasVisual: true,
    questionImage: "/questions/round35/114.png",
    questionImageAlt: "AからEで部位を示した脳の模式図",
    questionImageCaption: "第35回 問114の図",
    questionImagePosition: "beforeChoices",
    visualType: "diagram",
    required: true,
    pdfPage: 60,
    cropTarget: "AからEのラベルが付いた脳の模式図",
  },
  "2026-38-049": {
    hasVisual: true,
    questionImage: "/questions/round38/049.png",
    questionImageAlt: "腹部の清拭方向を示す選択肢1から5の図",
    questionImageCaption: "第38回 問49の図",
    questionImagePosition: "beforeChoices",
    visualType: "illustration",
    required: true,
    pdfPage: 6,
    cropTarget: "腹部の清拭方向を矢印で示した選択肢1から5の図",
  },
};

export const round34VisualAudit: QuestionVisualAudit[] = [
  {
    questionId: "2022-34-036",
    questionNumber: 36,
    visualType: "diagram",
    required: true,
    pdfPage: 23,
    cropTarget: "Lさんの自宅の浴室の平面図と、浴槽、車いす、手すりなどを確認できる範囲",
    status: "ready",
  },
  { questionId: "2023-35-031", questionNumber: 31, visualType: "illustration", required: true, pdfPage: 16, cropTarget: "格子模様と透明な部分があるテーブル、乳児、母親", status: "ready" },
  { questionId: "2023-35-091", questionNumber: 91, visualType: "illustration", required: true, pdfPage: 47, cropTarget: "目の周囲の清拭方向を示すAからEの図", status: "ready" },
  { questionId: "2023-35-114", questionNumber: 114, visualType: "diagram", required: true, pdfPage: 60, cropTarget: "AからEのラベルが付いた脳の模式図", status: "ready" },
  { questionId: "2026-38-049", questionNumber: 49, visualType: "illustration", required: true, pdfPage: 6, cropTarget: "腹部の清拭方向を示す選択肢1から5の図", status: "ready" },
];

export const questionVisualImageDirectory = "/questions/round34";
