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
  "2017-29-038": {
    hasVisual: true, questionImage: "/questions/round29/038.jpg", questionImageAlt: "扉を閉めた部屋を囲む窓AからEの位置を示す平面図", questionImageCaption: "第29回 問38の図", questionImagePosition: "afterQuestion", visualType: "diagram", required: true, pdfPage: null, cropTarget: "窓AからEを示す部屋の平面図全体",
  },
  "2017-29-057": {
    hasVisual: true, questionImage: "/questions/round29/057.jpg", questionImageAlt: "右利きの場合の和食の配膳位置をAからDで示す図", questionImageCaption: "第29回 問57の図", questionImagePosition: "afterQuestion", visualType: "diagram", required: true, pdfPage: null, cropTarget: "米飯とAからDの器、箸を示す配膳図全体",
  },
  "2017-29-093": {
    hasVisual: true, questionImage: "/questions/round29/093.jpg", questionImageAlt: "長さ約55cmの柄付きのくし型自助具", questionImageCaption: "第29回 問93の図", questionImagePosition: "afterQuestion", visualType: "illustration", required: true, pdfPage: null, cropTarget: "柄付きのくし型自助具全体",
  },
  "2018-30-043": {
    hasVisual: true, questionImage: "/questions/round30/043.jpg", questionImageAlt: "U駅ホームの線路側、点状ブロック、AからEの位置を示す見取図", questionImageCaption: "第30回 問43の図", questionImagePosition: "afterQuestion", visualType: "diagram", required: true, pdfPage: null, cropTarget: "AからEと点状ブロックを示す駅ホームの見取図全体",
  },
  "2018-30-047": {
    hasVisual: true, questionImage: "/questions/round30/047.jpg", questionImageAlt: "座位の人物の皮膚観察部位をAからEで示す前面と背面の図", questionImageCaption: "第30回 問47の図", questionImagePosition: "afterQuestion", visualType: "illustration", required: true, pdfPage: null, cropTarget: "AからEで皮膚観察部位を示す人物の前面と背面の図",
  },
  "2018-30-121": {
    hasVisual: true, questionImage: "/questions/round30/121.jpg", questionImageAlt: "人物前面の温度を感じられる部位をAからEで示す図", questionImageCaption: "第30回 問121の図", questionImagePosition: "afterQuestion", visualType: "illustration", required: true, pdfPage: null, cropTarget: "AからEで温度を感じられる部位を示す人物の前面図",
  },
  "2019-31-022": {
    hasVisual: true, questionImage: "/questions/round31/022.png", questionImageAlt: "土砂災害警戒区域を示す防災図記号", questionImageCaption: "第31回 問22の図記号", questionImagePosition: "afterQuestion", visualType: "symbol", required: true, pdfPage: null, cropTarget: "人物と黒い楕円で構成される防災図記号",
  },
  "2019-31-035": {
    hasVisual: true, questionImage: "/questions/round31/035.png", questionImageAlt: "ヘルプマークを示す図記号", questionImageCaption: "第31回 問35のマーク", questionImagePosition: "afterQuestion", visualType: "symbol", required: true, pdfPage: null, cropTarget: "白い十字を付けた黒い人物の図記号",
  },
  "2019-31-055": {
    hasVisual: true, questionImage: "/questions/round31/055.png", questionImageAlt: "自然乾燥を示す洗濯取扱い表示", questionImageCaption: "第31回 問55の取扱い表示", questionImagePosition: "afterQuestion", visualType: "symbol", required: true, pdfPage: null, cropTarget: "四角形と左上から右下への斜線、中央の横線で構成される取扱い表示",
  },
  "2019-31-078": {
    hasVisual: true, questionImage: "/questions/round31/078.png", questionImageAlt: "要介護者と要支援者の介護が必要となった主な原因の構成割合を示す積み上げ棒グラフ", questionImageCaption: "第31回 問78の図", questionImagePosition: "afterQuestion", visualType: "chart", required: true, pdfPage: null, cropTarget: "要介護者・要支援者・総数の構成割合を示す積み上げ棒グラフ全体",
  },
  "2019-31-115": {
    hasVisual: true, questionImage: "/questions/round31/115.png", questionImageAlt: "便器と手すりAからEの設置位置を示すトイレの平面図", questionImageCaption: "第31回 問115の図", questionImagePosition: "afterQuestion", visualType: "diagram", required: true, pdfPage: null, cropTarget: "便器と手すりAからEを示すトイレの平面図全体",
  },
  "2020-32-042": {
    hasVisual: true,
    questionImage: "/questions/round32/042.webp",
    questionImageAlt: "左右の足と、X・Yで足浴の位置を示す図",
    questionImageCaption: "第32回 問42の図",
    questionImagePosition: "afterQuestion",
    visualType: "illustration",
    required: true,
    pdfPage: null,
    cropTarget: "左右の足と、X・Yで足浴の位置を示す図全体",
  },
  "2020-32-050": {
    hasVisual: true,
    questionImage: "/questions/round32/050.webp",
    questionImageAlt: "ベッド柵（サイドレール）の位置をAからEで示す図",
    questionImageCaption: "第32回 問50の図",
    questionImagePosition: "afterQuestion",
    visualType: "diagram",
    required: true,
    pdfPage: null,
    cropTarget: "枕とベッド柵（サイドレール）、AからEの位置を示すベッドの図全体",
  },
  "2021-33-040": {
    hasVisual: true,
    questionImage: "/questions/round33/040.png",
    questionImageAlt: "仰臥位から側臥位へ体位変換する利用者の図。力点の候補としてAからEが示されている。",
    questionImageCaption: "第33回 問40の図",
    questionImagePosition: "afterQuestion",
    visualType: "illustration",
    required: true,
    pdfPage: null,
    cropTarget: "仰臥位から側臥位へ体位変換する利用者と、AからEの力点の候補",
  },
  "2021-33-051": {
    hasVisual: true,
    questionImage: "/questions/round33/051.png",
    questionImageAlt: "洗濯表示の記号。洗濯桶の中に30と表示され、下に一本の線がある。",
    questionImageCaption: "第33回 問51の洗濯表示",
    questionImagePosition: "afterQuestion",
    visualType: "symbol",
    required: true,
    pdfPage: null,
    cropTarget: "30と下線が示された洗濯表示の記号",
  },
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
  "2023-35-070": {
    hasVisual: true,
    questionImage: "/questions/round35/070.png",
    questionImageAlt: "障害者に関する標識",
    questionImageCaption: "第35回 問70の標識",
    questionImagePosition: "afterQuestion",
    visualType: "symbol",
    required: true,
    pdfPage: 37,
    cropTarget: "駐車場の利用者が示した標識",
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
  "2024-36-071": {
    hasVisual: true,
    questionImage: "/questions/round36/071.png",
    questionImageAlt: "警戒レベルに関連する図記号",
    questionImageCaption: "第36回 問71の図記号",
    questionImagePosition: "afterQuestion",
    visualType: "symbol",
    required: true,
    pdfPage: 4,
    cropTarget: "洪水・内水氾濫を示す図記号",
  },
  "2024-36-105": {
    hasVisual: true,
    questionImage: "/questions/round36/105.png",
    questionImageAlt: "五種類の杖の図",
    questionImageCaption: "第36回 問105の図",
    questionImagePosition: "beforeChoices",
    visualType: "illustration",
    required: true,
    pdfPage: 11,
    cropTarget: "番号1から5の杖の図",
  },
  "2025-37-121": {
    hasVisual: true,
    questionImage: "/questions/round37/121.png",
    questionImageAlt: "家族関係を示すジェノグラム",
    questionImageCaption: "第37回 問121の図",
    questionImagePosition: "beforeChoices",
    visualType: "diagram",
    required: true,
    pdfPage: 7,
    cropTarget: "家族関係を示すジェノグラム全体",
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
  { questionId: "2017-29-038", questionNumber: 38, visualType: "diagram", required: true, pdfPage: null, cropTarget: "窓AからEを示す部屋の平面図全体", status: "ready" },
  { questionId: "2017-29-057", questionNumber: 57, visualType: "diagram", required: true, pdfPage: null, cropTarget: "米飯とAからDの器、箸を示す配膳図全体", status: "ready" },
  { questionId: "2017-29-093", questionNumber: 93, visualType: "illustration", required: true, pdfPage: null, cropTarget: "柄付きのくし型自助具全体", status: "ready" },
  { questionId: "2017-29-102", questionNumber: 102, visualType: "table", required: true, pdfPage: null, cropTarget: "1日の必要エネルギー量の算出に必要な活動係数とストレス係数を示す図表", status: "source-needed" },
  { questionId: "2017-29-111", questionNumber: 111, visualType: "illustration", required: true, pdfPage: null, cropTarget: "鼻腔内吸引時の吸引チューブの挿入範囲を示す図", status: "source-needed" },
  { questionId: "2018-30-043", questionNumber: 43, visualType: "diagram", required: true, pdfPage: null, cropTarget: "AからEと点状ブロックを示す駅ホームの見取図全体", status: "ready" },
  { questionId: "2018-30-047", questionNumber: 47, visualType: "illustration", required: true, pdfPage: null, cropTarget: "AからEで皮膚観察部位を示す人物の前面と背面の図", status: "ready" },
  { questionId: "2018-30-121", questionNumber: 121, visualType: "illustration", required: true, pdfPage: null, cropTarget: "AからEで温度を感じられる部位を示す人物の前面図", status: "ready" },
  { questionId: "2019-31-022", questionNumber: 22, visualType: "symbol", required: true, pdfPage: null, cropTarget: "人物と黒い楕円で構成される防災図記号", status: "ready" },
  { questionId: "2019-31-035", questionNumber: 35, visualType: "symbol", required: true, pdfPage: null, cropTarget: "白い十字を付けた黒い人物の図記号", status: "ready" },
  { questionId: "2019-31-055", questionNumber: 55, visualType: "symbol", required: true, pdfPage: null, cropTarget: "四角形と左上から右下への斜線、中央の横線で構成される取扱い表示", status: "ready" },
  { questionId: "2019-31-078", questionNumber: 78, visualType: "chart", required: true, pdfPage: null, cropTarget: "要介護者・要支援者・総数の構成割合を示す積み上げ棒グラフ全体", status: "ready" },
  { questionId: "2019-31-115", questionNumber: 115, visualType: "diagram", required: true, pdfPage: null, cropTarget: "便器と手すりAからEを示すトイレの平面図全体", status: "ready" },
  { questionId: "2020-32-042", questionNumber: 42, visualType: "illustration", required: true, pdfPage: null, cropTarget: "左右の足と、X・Yで足浴の位置を示す図全体", status: "ready" },
  { questionId: "2020-32-050", questionNumber: 50, visualType: "diagram", required: true, pdfPage: null, cropTarget: "枕とベッド柵（サイドレール）、AからEの位置を示すベッドの図全体", status: "ready" },
  { questionId: "2021-33-040", questionNumber: 40, visualType: "illustration", required: true, pdfPage: null, cropTarget: "仰臥位から側臥位へ体位変換する利用者と、AからEの力点の候補", status: "ready" },
  { questionId: "2021-33-051", questionNumber: 51, visualType: "symbol", required: true, pdfPage: null, cropTarget: "30と下線が示された洗濯表示の記号", status: "ready" },
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
  { questionId: "2023-35-070", questionNumber: 70, visualType: "symbol", required: true, pdfPage: 37, cropTarget: "駐車場の利用者が示した標識", status: "ready" },
  { questionId: "2023-35-091", questionNumber: 91, visualType: "illustration", required: true, pdfPage: 47, cropTarget: "目の周囲の清拭方向を示すAからEの図", status: "ready" },
  { questionId: "2023-35-114", questionNumber: 114, visualType: "diagram", required: true, pdfPage: 60, cropTarget: "AからEのラベルが付いた脳の模式図", status: "ready" },
  { questionId: "2024-36-071", questionNumber: 71, visualType: "symbol", required: true, pdfPage: 4, cropTarget: "洪水・内水氾濫を示す図記号", status: "ready" },
  { questionId: "2024-36-105", questionNumber: 105, visualType: "illustration", required: true, pdfPage: 11, cropTarget: "番号1から5の杖の図", status: "ready" },
  { questionId: "2025-37-121", questionNumber: 121, visualType: "diagram", required: true, pdfPage: 7, cropTarget: "家族関係を示すジェノグラム全体", status: "ready" },
  { questionId: "2026-38-049", questionNumber: 49, visualType: "illustration", required: true, pdfPage: 6, cropTarget: "腹部の清拭方向を示す選択肢1から5の図", status: "ready" },
];

export const questionVisualImageDirectory = "/questions/round34";
