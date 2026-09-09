"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MASCOT_ALT, MASCOT_IMAGE_PATHS, type MascotMood } from "@/constants/mascot";
import type { MascotReaction } from "@/data/mascot-reactions";

type MascotProps = {
  mood?: MascotMood;
  message?: string;
  compact?: boolean;
  reaction?: MascotReaction;
  animation?: MascotReaction["animation"];
};

export function Mascot({
  mood = "normal",
  message,
  compact = false,
  reaction,
  animation,
}: MascotProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageKey = reaction?.imageKey ?? mood;
  const image = reaction?.image ?? MASCOT_IMAGE_PATHS[imageKey];
  const alt = MASCOT_ALT[imageKey];
  const animationClass = animation ?? reaction?.animation ?? "gentle-float";

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <section
      className={`flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-soft ${
        compact ? "py-3" : ""
      }`}
      aria-label="マスコットからのメッセージ"
    >
      <div
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-mint ${
          compact ? "h-20 w-20" : "h-28 w-28"
        }`}
      >
        {!imageFailed ? (
          <Image
            key={reaction?.id ?? imageKey}
            src={image}
            alt={alt}
            width={compact ? 96 : 144}
            height={compact ? 96 : 144}
            className={`h-full w-full object-contain p-1 mascot-${animationClass}`}
            onError={() => setImageFailed(true)}
            priority={!compact}
          />
        ) : (
          <div className="text-center text-sm font-black leading-5 text-leaf" aria-hidden="true">
            Mofu
            <br />
            Maru
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-berry">もふまる</p>
        <p className="mt-1 text-base font-bold leading-relaxed sm:text-lg">
          {message ?? reaction?.message ?? "もふまるといっしょに、楽しく合格へ。"}
        </p>
      </div>
    </section>
  );
}
