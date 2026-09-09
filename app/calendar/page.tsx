"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { StatCard } from "@/components/StatCard";
import { loadProgress, getMonthlyStudySummary } from "@/lib/progress/localProgressRepository";
import { toDateKey } from "@/lib/utils/date";
import type { MonthlyStudySummary } from "@/types/progress";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getDayMark(count: number): { mark: string; label: string; className: string } {
  if (count >= 20) {
    return {
      mark: "★",
      label: "20問以上",
      className: "bg-berry text-white ring-4 ring-peach",
    };
  }

  if (count >= 10) {
    return {
      mark: "✓",
      label: "10問以上",
      className: "bg-sun text-ink ring-4 ring-white",
    };
  }

  if (count >= 1) {
    return {
      mark: "●",
      label: "1問以上",
      className: "bg-mint text-leaf",
    };
  }

  return {
    mark: "",
    label: "未学習",
    className: "bg-white text-ink/50",
  };
}

function buildCalendarDays(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDate = new Date(year, monthIndex + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay.getDay() }, (_, index) => ({
    key: `blank-${index}`,
    date: null,
  }));
  const days = Array.from({ length: lastDate }, (_, index) => {
    const date = new Date(year, monthIndex, index + 1);
    return {
      key: toDateKey(date),
      date,
    };
  });

  return [...blanks, ...days];
}

export default function CalendarPage() {
  const [initialDate, setInitialDate] = useState(new Date(2027, 0, 1));
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [summary, setSummary] = useState<MonthlyStudySummary>({
    studyDays: 0,
    solvedCount: 0,
    accuracy: null,
    days: {},
  });
  const todayKey = toDateKey(initialDate);
  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const calendarDays = buildCalendarDays(year, monthIndex);

  useEffect(() => {
    const now = new Date();
    setInitialDate(now);
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    const timer = window.setInterval(() => setInitialDate(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSummary(getMonthlyStudySummary(year, monthIndex, loadProgress()));
  }, [year, monthIndex, todayKey]);

  function moveMonth(diff: number) {
    setVisibleMonth((date) => new Date(date.getFullYear(), date.getMonth() + diff, 1));
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <Mascot mood="study" message="学習した日が見えると、続ける力になるよ。" compact />
        <section className="surface">
          <p className="text-sm font-black text-berry">学習カレンダー</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full bg-white text-leaf shadow-sm focus:outline-none focus:ring-4 focus:ring-peach"
              onClick={() => moveMonth(-1)}
              aria-label="前月へ"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-black">
              {year}年 {monthIndex + 1}月
            </h1>
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full bg-white text-leaf shadow-sm focus:outline-none focus:ring-4 focus:ring-peach"
              onClick={() => moveMonth(1)}
              aria-label="次月へ"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/75 p-4 shadow-soft" aria-label="月間カレンダー">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-ink/55">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="py-2">
                {weekday}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item) => {
              if (!item.date) {
                return <div key={item.key} className="aspect-square" />;
              }

              const dateKey = toDateKey(item.date);
              const isFuture = dateKey > todayKey;
              const solvedCount = isFuture ? 0 : summary.days[dateKey]?.solvedCount ?? 0;
              const mark = getDayMark(solvedCount);

              return (
                <div
                  key={dateKey}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl border border-cream text-sm font-black ${mark.className}`}
                  aria-label={`${dateKey}: ${mark.label}`}
                >
                  <span>{item.date.getDate()}</span>
                  <span className="mt-0.5 h-5 text-xs">{mark.mark}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-ink/65">
            <span>● 1問以上</span>
            <span>✓ 10問以上</span>
            <span>★ 20問以上</span>
          </div>
        </section>

        <section aria-label="今月の記録" className="grid grid-cols-3 gap-3">
          <StatCard label="学習日" value={`${summary.studyDays}日`} />
          <StatCard label="問題数" value={`${summary.solvedCount}問`} />
          <StatCard label="正答率" value={summary.accuracy === null ? "--%" : `${summary.accuracy}%`} />
        </section>
      </div>
    </AppShell>
  );
}
