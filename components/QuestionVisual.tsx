"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import type { Question, QuestionImagePosition } from "@/types/question";

type QuestionVisualProps = {
  question: Question;
  position: QuestionImagePosition;
};

function showsExpandButton(question: Question): boolean {
  return ["diagram", "chart", "table", "symbol"].includes(question.visualType ?? "");
}

export function QuestionVisual({ question, position }: QuestionVisualProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!question.hasVisual || !question.questionImage || question.questionImagePosition !== position) {
    return null;
  }

  const alt = question.questionImageAlt ?? "問題に必要な図";

  return (
    <>
      <figure className="mt-5 rounded-2xl border border-mint/70 bg-cream/55 p-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block w-full rounded-xl focus:outline-none focus:ring-4 focus:ring-peach"
          aria-label={`図を大きく見る: ${alt}`}
        >
          <Image
            src={question.questionImage}
            alt={alt}
            width={1600}
            height={1200}
            sizes="(max-width: 640px) 100vw, 640px"
            className="h-auto max-h-96 w-full object-contain"
          />
        </button>
        {question.questionImageCaption ? (
          <figcaption className="mt-2 text-sm font-bold text-ink/65">{question.questionImageCaption}</figcaption>
        ) : null}
        {showsExpandButton(question) ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-black text-leaf shadow-sm focus:outline-none focus:ring-4 focus:ring-peach"
          >
            <Expand className="h-4 w-4" aria-hidden="true" />図を大きく見る
          </button>
        ) : null}
      </figure>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="図の拡大表示"
          onMouseDown={() => setIsOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-3 sm:p-8"
        >
          <div
            onMouseDown={(event) => event.stopPropagation()}
            className="relative flex max-h-full w-full max-w-4xl items-center justify-center rounded-2xl bg-white p-3 shadow-2xl sm:p-5"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-white focus:outline-none focus:ring-4 focus:ring-peach"
              aria-label="図の拡大表示を閉じる"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Image
              src={question.questionImage}
              alt={alt}
              width={2000}
              height={1600}
              sizes="100vw"
              className="h-auto max-h-[85dvh] w-auto max-w-full touch-pan-x touch-pan-y object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
