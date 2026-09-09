import { mascotImages, type MascotImageKey } from "@/data/mascot-images";
import { pickRandom } from "@/lib/utils/random";

export type MascotReaction = {
  id: string;
  type:
    | "normal"
    | "correct"
    | "streak"
    | "wrong"
    | "cheer"
    | "celebrate"
    | "tired"
    | "study"
    | "review";
  message: string;
  image: string;
  imageKey: MascotImageKey;
  animation?: "bounce" | "wiggle" | "pop" | "celebrate" | "gentle-float";
};

export const mascotReactions: MascotReaction[] = [
  {
    id: "normal-1",
    type: "normal",
    message: "もふまるといっしょに、楽しく合格へ。",
    image: mascotImages.normal,
    imageKey: "normal",
    animation: "gentle-float",
  },
  {
    id: "study-1",
    type: "study",
    message: "よし、1問ずついこう。もふまるも横で見てるよ。",
    image: mascotImages.study,
    imageKey: "study",
    animation: "gentle-float",
  },
  {
    id: "cheer-1",
    type: "cheer",
    message: "今日の少しが、試験の日の安心になるよ。",
    image: mascotImages.cheer,
    imageKey: "cheer",
    animation: "bounce",
  },
  {
    id: "review-1",
    type: "review",
    message: "復習は合格への近道。ここで整えていこう。",
    image: mascotImages.review,
    imageKey: "review",
    animation: "gentle-float",
  },
  {
    id: "tired-1",
    type: "tired",
    message: "ひと休みも作戦のうち。あったかくして進もう。",
    image: mascotImages.tired,
    imageKey: "tired",
    animation: "gentle-float",
  },
  ...[
    "やったー！正解！",
    "すごい！",
    "いい感じ！",
    "その調子！",
    "ばっちり！",
    "ちゃんと覚えてたね！",
    "よっしゃー！",
    "ナイス正解！",
    "今のは完璧！",
    "ひとつ強くなった！",
  ].map((message, index): MascotReaction => ({
    id: `correct-${index + 1}`,
    type: "correct",
    message,
    image: index % 2 === 0 ? mascotImages.correct : mascotImages.correctAlt,
    imageKey: index % 2 === 0 ? "correct" : "correctAlt",
    animation: index % 2 === 0 ? "pop" : "bounce",
  })),
  ...[
    "おしい！",
    "ここは今覚えればOK！",
    "次はいける！",
    "復習したらもっと強くなるよ",
    "この問題、いい復習になるね",
    "大丈夫、ひとつ覚えた！",
    "次に出たら取れる！",
    "ここチェックしとこう！",
    "間違えた問題ほど伸びしろ！",
    "もう一回見たらきっといける！",
  ].map((message, index): MascotReaction => ({
    id: `wrong-${index + 1}`,
    type: "wrong",
    message,
    image: index % 2 === 0 ? mascotImages.wrong : mascotImages.review,
    imageKey: index % 2 === 0 ? "wrong" : "review",
    animation: "wiggle",
  })),
  {
    id: "streak-3",
    type: "streak",
    message: "3問連続！いい調子！",
    image: mascotImages.streak,
    imageKey: "streak",
    animation: "celebrate",
  },
  {
    id: "streak-5",
    type: "streak",
    message: "5問連続！もふまるもびっくり！",
    image: mascotImages.celebrate,
    imageKey: "celebrate",
    animation: "celebrate",
  },
  {
    id: "streak-7",
    type: "streak",
    message: "止まらないね！",
    image: mascotImages.streak,
    imageKey: "streak",
    animation: "bounce",
  },
  {
    id: "streak-10",
    type: "streak",
    message: "10問連続！すごすぎる！",
    image: mascotImages.celebrate,
    imageKey: "celebrate",
    animation: "celebrate",
  },
  {
    id: "celebrate-1",
    type: "celebrate",
    message: "ここまでよくがんばったね。もふまるもうれしい！",
    image: mascotImages.celebrate,
    imageKey: "celebrate",
    animation: "celebrate",
  },
];

const lastReactionIds = new Map<MascotReaction["type"], string>();

export function getMascotReaction(
  type: MascotReaction["type"],
  streakCount?: number,
): MascotReaction {
  if (type === "streak" && streakCount) {
    const milestone =
      streakCount >= 10 ? 10 : streakCount >= 7 ? 7 : streakCount >= 5 ? 5 : 3;
    return mascotReactions.find((reaction) => reaction.id === `streak-${milestone}`)!;
  }

  const reactions = mascotReactions.filter((reaction) => reaction.type === type);
  const alternatives = reactions.filter((reaction) => reaction.id !== lastReactionIds.get(type));
  const reaction = pickRandom(alternatives.length ? alternatives : reactions);
  lastReactionIds.set(type, reaction.id);
  return reaction;
}
