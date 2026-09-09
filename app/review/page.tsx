"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, ChevronRight, RotateCcw } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { getQuestionById } from "@/lib/questions/repository";
import { getWrongQuestionIds, loadProgress } from "@/lib/progress/localProgressRepository";
import type { Question } from "@/types/question";

export default function ReviewPage() {
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const progress = loadProgress();
    const questions = getWrongQuestionIds(progress)
      .map((id) => getQuestionById(id))
      .filter((question): question is Question => Boolean(question));
    setWrongQuestions(questions);
  }, []);

  const ids = wrongQuestions.map((question) => question.id).join(",");

  return (
    <AppShell>
      <div className="space-y-5">
        <Mascot
          mood={wrongQuestions.length > 0 ? "review" : "celebrate"}
          message={
            wrongQuestions.length > 0
              ? "復習できる問題があるよ。ここを整えるとぐっと強くなる！"
              : "今のところ復習リストは空だよ。いい感じ！"
          }
          compact
        />
        <section className="surface">
          <p className="text-sm font-black text-berry">復習</p>
          <h1 className="mt-2 text-2xl font-black">間違えた問題</h1>
          <p className="mt-2 text-sm font-bold leading-6 text-ink/65">
            正解すると復習リストから外れます。
          </p>
        </section>

        {wrongQuestions.length > 0 ? (
          <>
            <ActionButton href={`/quiz?ids=${ids}`} variant="secondary">
              <span className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                まとめて復習する
              </span>
            </ActionButton>
            <section className="grid gap-3" aria-label="復習問題一覧">
              {wrongQuestions.map((question) => (
                <Link
                  key={question.id}
                  href={`/quiz?ids=${question.id}`}
                  className="flex min-h-20 items-center justify-between gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-soft transition hover:bg-mint focus:outline-none focus:ring-4 focus:ring-peach"
                >
                  <div>
                    <h2 className="text-base font-black leading-6">
                      問{question.questionNumber} {question.category}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-ink/60">
                      {question.questionText}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 shrink-0 text-leaf" aria-hidden="true" />
                </Link>
              ))}
            </section>
          </>
        ) : (
          <div className="rounded-[2rem] bg-white/80 p-6 text-center shadow-soft">
            <BookOpenCheck className="mx-auto h-10 w-10 text-leaf" aria-hidden="true" />
            <p className="mt-3 text-base font-bold leading-7 text-ink/70">
              問題に挑戦すると、間違えた問題がここに集まります。
            </p>
            <div className="mt-5">
              <ActionButton href="/quiz?mode=challenge" variant="primary">
                10問チャレンジへ
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
