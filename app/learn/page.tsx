"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, ClipboardCheck, ListChecks, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { getExamRoundSummaries, type ExamRoundSummary } from "@/lib/questions/repository";
import { loadProgress } from "@/lib/progress/localProgressRepository";
import { getMockExamSession } from "@/lib/progress/localMockExamRepository";

export default function LearnPage() {
  const [rounds, setRounds] = useState<ExamRoundSummary[]>([]);
  const [hasMockExamToResume, setHasMockExamToResume] = useState(false);

  useEffect(() => {
    setRounds(getExamRoundSummaries(loadProgress()));
    const mockExam = getMockExamSession();
    setHasMockExamToResume(Boolean(mockExam && !mockExam.finishedAt));
  }, []);

  return (
    <AppShell>
      <div className="space-y-5">
        <Mascot mood="study" message="今日はどこから進めようか。もふまると選ぼう。" compact />
        <section className="surface">
          <p className="text-sm font-black text-berry">学ぶ</p>
          <h1 className="mt-2 text-2xl font-black">学び方を選ぶ</h1>
        </section>
        <section className="grid gap-3" aria-label="学び方">
          <ActionButton href="/quiz?mode=challenge" variant="primary">
            <span className="flex items-center gap-2"><Sparkles className="h-5 w-5" aria-hidden="true" />10問チャレンジ</span>
          </ActionButton>
          <ActionButton href="/mock-exam" variant="soft">
            <span className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" aria-hidden="true" />{hasMockExamToResume ? "模擬試験を再開" : "模擬試験 125問"}</span>
          </ActionButton>
          <ActionButton href="/categories" variant="soft">
            <span className="flex items-center gap-2"><ListChecks className="h-5 w-5" aria-hidden="true" />分野から選ぶ</span>
          </ActionButton>
        </section>
        <section className="space-y-3" aria-label="試験回から選ぶ">
          <div className="px-1">
            <p className="text-sm font-black text-berry">試験回から選ぶ</p>
            <p className="mt-1 text-sm font-bold text-ink/65">途中で閉じても、次の問題から再開できます。</p>
          </div>
          {rounds.map((round) => (
            <article key={round.examRound} className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">第{round.examRound}回</h2>
                  <p className="mt-1 text-sm font-bold text-ink/60">{round.examYear}年・{round.questionCount}問</p>
                </div>
                <BookOpen className="h-6 w-6 shrink-0 text-leaf" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-bold text-ink/70">
                学習済み {round.answeredQuestionCount} / {round.questionCount}・正答率 {round.accuracy === null ? "--%" : `${round.accuracy}%`}
              </p>
              <Link
                href={`/quiz?mode=round&round=${round.examRound}`}
                className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-black text-leaf focus:outline-none focus:ring-4 focus:ring-peach"
              >
                この回を解く <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
