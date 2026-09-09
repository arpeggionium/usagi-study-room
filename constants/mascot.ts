import { mascotImages, type MascotImageKey } from "@/data/mascot-images";

export type MascotMood = MascotImageKey;

export const MASCOT_IMAGE_PATHS: Record<MascotMood, string> = {
  normal: mascotImages.normal,
  study: mascotImages.study,
  correct: mascotImages.correct,
  correctAlt: mascotImages.correctAlt,
  streak: mascotImages.streak,
  wrong: mascotImages.wrong,
  cheer: mascotImages.cheer,
  review: mascotImages.review,
  tired: mascotImages.tired,
  celebrate: mascotImages.celebrate,
};

export const MASCOT_ALT: Record<MascotMood, string> = {
  normal: "学習を見守るもふまる",
  study: "本を開いて学習するもふまる",
  correct: "正解を喜ぶもふまる",
  correctAlt: "拍手して正解を喜ぶもふまる",
  streak: "連続正解を応援するもふまる",
  wrong: "やさしく考えるもふまる",
  cheer: "元気に応援するもふまる",
  review: "復習を見守るもふまる",
  tired: "ひと休みするもふまる",
  celebrate: "結果をお祝いするもふまる",
};
