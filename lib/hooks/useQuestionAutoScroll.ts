"use client";

import { useEffect, useRef } from "react";

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function useQuestionAutoScroll(questionId: string | undefined) {
  const questionTopRef = useRef<HTMLElement | null>(null);
  const shouldScrollRef = useRef(false);

  function scheduleQuestionScroll(): void {
    shouldScrollRef.current = true;
  }

  useEffect(() => {
    if (!questionId || !shouldScrollRef.current || !questionTopRef.current) return;

    shouldScrollRef.current = false;
    window.requestAnimationFrame(() => {
      questionTopRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [questionId]);

  return { questionTopRef, scheduleQuestionScroll };
}
