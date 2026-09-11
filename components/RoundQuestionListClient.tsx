"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Circle, ImageIcon, Play, XCircle } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { getQuestionsByRound } from "@/lib/questions/repository";
import { loadProgress } from "@/lib/progress/localProgressRepository";
import type { LearningProgress } from "@/types/progress";

type RoundQuestionListClientProps = {
  examRound: string;
};

export function RoundQuestionListClient({ examRound }: RoundQuestionListClientProps) {
  const questions = getQuestionsByRound(examRound);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (questions.length === 0) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Mascot mood="tired" message="この試験回の問題が見つからなかったよ。別の回を選んでみよう。" />
          <ActionButton href="/learn" variant="soft">
            学ぶ画面へ戻る
          </ActionButton>
        </div>
      </AppShell>
    );
  }

  const examYear = questions[0].examYear;
  const answeredCount = questions.filter((question) => progress?.questionStats[question.id]?.answerCount).length;

  return (
    <AppShell>
      <div className="space-y-5">
        <Link
          href="/learn"
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-black text-leaf focus:outline-none focus:ring-4 focus:ring-peach"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          試験回を選ぶ
        </Link>

        <Mascot mood="study" message={`第${examRound}回、どの問題から始める？もふまると進めよう。`} compact />

        <section className="surface">
          <p className="text-sm font-black text-berry">試験回から学ぶ</p>
          <h1 className="mt-2 text-2xl font-black">第{examRound}回</h1>
          <p className="mt-1 text-sm font-bold text-ink/65">{examYear}年・全{questions.length}問</p>
          <p className="mt-4 text-sm font-bold text-ink/70">学習済み {answeredCount} / {questions.length}問</p>
          <div className="mt-4">
            <ActionButton href={`/quiz?mode=round&round=${examRound}`} variant="primary">
              <span className="flex items-center gap-2"><Play className="h-5 w-5" aria-hidden="true" />この回を続きから解く</span>
            </ActionButton>
          </div>
        </section>

        <section aria-labelledby="round-question-list-heading">
          <div className="px-1">
            <h2 id="round-question-list-heading" className="text-lg font-black">問題を選ぶ</h2>
            <p className="mt-1 text-sm font-bold text-ink/65">問題番号を押すと、その問題から連続して解けます。</p>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {questions.map((question) => {
              const stats = progress?.questionStats[question.id];
              const hasAnswered = Boolean(stats?.answerCount);
              const hasEverCorrect = (stats?.correctCount ?? 0) > 0;
              const hasRecentWrong = hasAnswered && !hasEverCorrect;
              const statusLabel = hasEverCorrect ? "正解済み" : hasRecentWrong ? "復習したい" : "未回答";

              return (
                <li key={question.id}>
                  <Link
                    href={`/quiz?mode=round&round=${examRound}&start=${question.questionNumber}`}
                    className="flex min-h-28 flex-col justify-between rounded-2xl border border-white/80 bg-white/80 p-3 shadow-soft transition hover:bg-mint focus:outline-none focus:ring-4 focus:ring-peach"
                    aria-label={`問題 ${question.questionNumber}、${question.category}、${statusLabel}`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-lg font-black text-ink">問{question.questionNumber}</span>
                      <span className="flex items-center gap-1 text-leaf">
                        {question.hasVisual ? <ImageIcon className="h-4 w-4" aria-label="図あり" /> : null}
                        {hasEverCorrect ? <CheckCircle2 className="h-5 w-5" aria-label="正解済み" /> : null}
                        {hasRecentWrong ? <XCircle className="h-5 w-5 text-berry" aria-label="復習したい問題" /> : null}
                        {!hasAnswered ? <Circle className="h-5 w-5 text-ink/35" aria-label="未回答" /> : null}
                      </span>
                    </span>
                    <span className="line-clamp-2 text-xs font-bold leading-5 text-ink/65">{question.category}</span>
                    <span className="flex items-center justify-between text-xs font-black text-leaf">
                      {statusLabel}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
