export const mascotImages = {
  normal: "/mascot/mofumaru/normal.png",
  study: "/mascot/mofumaru/study.png",
  correct: "/mascot/mofumaru/correct-1.png",
  correctAlt: "/mascot/mofumaru/correct-2.png",
  cheer: "/mascot/mofumaru/cheer.png",
  streak: "/mascot/mofumaru/streak.png",
  celebrate: "/mascot/mofumaru/celebrate.png",
  wrong: "/mascot/mofumaru/wrong.png",
  review: "/mascot/mofumaru/review.png",
  tired: "/mascot/mofumaru/tired.png",
} as const;

export type MascotImageKey = keyof typeof mascotImages;
