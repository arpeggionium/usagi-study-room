export type QuestionCategory =
  | "人間の尊厳と自立"
  | "人間関係とコミュニケーション"
  | "社会の理解"
  | "介護の基本"
  | "コミュニケーション技術"
  | "生活支援技術"
  | "介護過程"
  | "発達と老化の理解"
  | "認知症の理解"
  | "障害の理解"
  | "こころとからだのしくみ"
  | "医療的ケア"
  | "総合問題";

export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  examYear: string;
  examRound: string;
  category: QuestionCategory;
  questionNumber: number;
  questionText: string;
  choices: Choice[];
  correctChoice: string;
  correctChoices: string[];
  explanation: string;
  source: string;
  keywords: string[];
  needsLegalReview: boolean;
};
