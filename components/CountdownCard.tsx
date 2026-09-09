"use client";

import { CalendarHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { EXAM_NAME } from "@/config/exam";
import { getExamCountdown } from "@/lib/utils/examCountdown";

export function CountdownCard() {
  const [countdown, setCountdown] = useState<ReturnType<typeof getExamCountdown> | null>(null);
  useEffect(() => {
    const refresh = () => setCountdown(getExamCountdown());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <section className="surface" aria-label="試験日カウントダウン">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-peach text-berry">
          <CalendarHeart className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-black text-berry">{EXAM_NAME}まで</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">
            {!countdown ? "あと -- 日" : countdown.isExamDay
              ? "今日は試験日！"
              : countdown.hasPassed
                ? "試験日を迎えました"
                : `あと ${countdown.daysUntil} 日`}
          </p>
        </div>
      </div>
    </section>
  );
}
