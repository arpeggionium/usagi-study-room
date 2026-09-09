"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  Flame,
  ListChecks,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { CountdownCard } from "@/components/CountdownCard";
import { Mascot } from "@/components/Mascot";
import { StatCard } from "@/components/StatCard";
import { DAILY_MESSAGES } from "@/constants/reactions";
import { getProgressSummary, loadProgress } from "@/lib/progress/localProgressRepository";
import { getMockExamSession } from "@/lib/progress/localMockExamRepository";
import { pickRandom } from "@/lib/utils/random";
import type { ProgressSummary } from "@/types/progress";

export default function HomePage() {
  const [summary, setSummary] = useState<ProgressSummary>({
    todaySolvedCount: 0,
    continuousStudyDays: 0,
    recentAccuracy: null,
    totalAnswered: 0,
    wrongQuestionCount: 0,
  });
  const [dailyMessage, setDailyMessage] = useState(DAILY_MESSAGES[0]);
  const [hasMockExamToResume, setHasMockExamToResume] = useState(false);

  useEffect(() => {
    setDailyMessage(pickRandom(DAILY_MESSAGES));
    setSummary(getProgressSummary(loadProgress()));
    const mockExam = getMockExamSession();
    setHasMockExamToResume(Boolean(mockExam && !mockExam.finishedAt));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="space-y-4">
          <div className="rounded-[2rem] bg-white/65 p-5 shadow-soft">
            <p className="text-sm font-black text-berry">介護福祉士国家試験</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">うさぎの学習室</h1>
            <p className="mt-3 text-base font-medium leading-7 text-ink/75">
              もふまるといっしょに、楽しく合格へ。
            </p>
          </div>
          <CountdownCard />
          <Mascot mood="normal" message={dailyMessage} />
        </section>

        <section aria-label="学習メニュー" className="grid gap-3">
          <ActionButton href="/quiz?mode=challenge" variant="primary">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              10問チャレンジ
            </span>
          </ActionButton>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ActionButton href="/mock-exam" variant="soft">
              <span className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                {hasMockExamToResume ? "模擬試験を再開" : "模擬試験"}
              </span>
            </ActionButton>
            <ActionButton href="/categories" variant="soft">
              <span className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" aria-hidden="true" />
                分野別に学ぶ
              </span>
            </ActionButton>
          </div>
          <ActionButton href="/review" variant="secondary">
            <span className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              間違えた問題を復習
            </span>
          </ActionButton>
        </section>

        <section aria-label="今日の学習記録" className="grid grid-cols-2 gap-3">
          <StatCard label="今日" value={`${summary.todaySolvedCount}問`} />
          <StatCard
            label="最近の正答率"
            value={summary.recentAccuracy === null ? "--%" : `${summary.recentAccuracy}%`}
          />
        </section>

        <ActionButton href="/calendar" variant="soft">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            学習カレンダーを見る
          </span>
        </ActionButton>

        <section className="surface flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-berry">連続学習日数</p>
            <p className="mt-1 text-3xl font-black">{summary.continuousStudyDays}日</p>
          </div>
          <Flame className="h-10 w-10 text-sun" aria-hidden="true" />
        </section>

        {summary.totalAnswered === 0 ? (
          <p className="rounded-3xl bg-mint/80 p-4 text-sm font-bold leading-6 text-ink/75">
            まだ履歴はありません。まずは1問解くと、今日の学習数や正答率がここに出ます。
          </p>
        ) : null}

      </div>
    </AppShell>
  );
}
