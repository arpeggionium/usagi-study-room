"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CircleHelp, Flag, Grid2X2, Play, RotateCcw } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import {
  clearMockExamSession,
  createMockExamSession,
  getMockExamSession,
  type MockExamSession,
  updateMockExamSession,
} from "@/lib/progress/localMockExamRepository";
import { loadProgress, recordAnswers } from "@/lib/progress/localProgressRepository";
import { getQuestionById, getRandomQuestions } from "@/lib/questions/repository";
import { useQuestionAutoScroll } from "@/lib/hooks/useQuestionAutoScroll";
import type { Question } from "@/types/question";

type QuestionResult = {
  question: Question;
  selectedChoice: string | undefined;
  isCorrect: boolean;
};

function getQuestions(session: MockExamSession): Question[] {
  return session.questionIds
    .map((id) => getQuestionById(id))
    .filter((question): question is Question => Boolean(question));
}

function answerText(question: Question, choiceId: string | undefined): string {
  const choice = question.choices.find((item) => item.id === choiceId);
  return choice ? `${choice.id}. ${choice.text}` : "未回答";
}

export function MockExamClient() {
  const [session, setSession] = useState<MockExamSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  useEffect(() => {
    setSession(getMockExamSession());
    setLoaded(true);
  }, []);

  const questions = useMemo(() => (session ? getQuestions(session) : []), [session]);
  const answeredCount = session ? Object.keys(session.answers).length : 0;
  const currentQuestion = session && questions[session.currentIndex];
  const { questionTopRef, scheduleQuestionScroll } = useQuestionAutoScroll(currentQuestion?.id);

  function startNewExam() {
    const questionIds = getRandomQuestions(125).map((question) => question.id);
    setSession(createMockExamSession(questionIds));
    setShowGrid(false);
  }

  function save(updates: Parameters<typeof updateMockExamSession>[1]) {
    if (!session) return;
    setSession(updateMockExamSession(session, updates));
  }

  function answerQuestion(choiceId: string) {
    if (!session || !currentQuestion) return;
    const nextIndex = Math.min(session.currentIndex + 1, questions.length - 1);
    if (nextIndex !== session.currentIndex) scheduleQuestionScroll();
    save({ answers: { ...session.answers, [currentQuestion.id]: choiceId }, currentIndex: nextIndex });
  }

  function goToQuestion(index: number) {
    if (!session || index === session.currentIndex) return;
    scheduleQuestionScroll();
    save({ currentIndex: index });
  }

  function toggleReview() {
    if (!session || !currentQuestion) return;
    const reviewSet = new Set(session.reviewQuestionIds);
    if (reviewSet.has(currentQuestion.id)) reviewSet.delete(currentQuestion.id);
    else reviewSet.add(currentQuestion.id);
    save({ reviewQuestionIds: [...reviewSet] });
  }

  function finishExam() {
    if (!session) return;
    if (!session.historyCommitted) {
      const answered = questions.flatMap((question) => {
        const selectedChoice = session.answers[question.id];
        return selectedChoice ? [{ question, selectedChoice }] : [];
      });
      recordAnswers(answered, loadProgress());
    }
    setSession(
      updateMockExamSession(session, {
        finishedAt: new Date().toISOString(),
        historyCommitted: true,
      }),
    );
    setShowFinishConfirm(false);
  }

  if (!loaded) {
    return <AppShell><p role="status">模擬試験を準備しています...</p></AppShell>;
  }

  if (!session) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Mascot mood="study" message="本番みたいに、125問を通して挑戦してみよう。" />
          <section className="surface">
            <p className="text-sm font-black text-berry">介護福祉士 模擬試験</p>
            <h1 className="mt-2 text-3xl font-black">125問に挑戦</h1>
            <ul className="mt-5 space-y-2 text-sm font-bold leading-6 text-ink/75">
              <li>途中保存できます</li>
              <li>あとから再開できます</li>
              <li>最後に結果と解説をまとめて確認できます</li>
            </ul>
          </section>
          <ActionButton onClick={startNewExam} variant="primary">
            <span className="flex items-center gap-2"><Play className="h-5 w-5" aria-hidden="true" />開始する</span>
          </ActionButton>
        </div>
      </AppShell>
    );
  }

  if (session.finishedAt) {
    return <MockExamResult session={session} questions={questions} onStartNew={() => { clearMockExamSession(); setSession(null); }} />;
  }

  if (!currentQuestion) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Mascot mood="tired" message="問題を準備できなかったみたい。新しい模擬試験を作ろう。" />
          <ActionButton onClick={startNewExam}>新しい模擬試験を始める</ActionButton>
        </div>
      </AppShell>
    );
  }

  const isReview = session.reviewQuestionIds.includes(currentQuestion.id);
  const unansweredCount = questions.length - answeredCount;

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="surface border-mint/70 bg-white/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-berry">模擬試験</p>
              <h1 className="mt-1 text-2xl font-black">{session.currentIndex + 1} / 125</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowGrid((visible) => !visible)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-mint px-4 text-sm font-black text-leaf focus:outline-none focus:ring-4 focus:ring-peach"
              aria-expanded={showGrid}
            >
              <Grid2X2 className="h-5 w-5" aria-hidden="true" />問題一覧
            </button>
          </div>
          <p className="mt-3 text-sm font-bold text-ink/65">回答済み {answeredCount}問・見直し {session.reviewQuestionIds.length}問</p>
        </section>

        {showGrid ? (
          <section className="surface" aria-label="模擬試験の問題一覧">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
              {questions.map((question, index) => {
                const answered = Boolean(session.answers[question.id]);
                const review = session.reviewQuestionIds.includes(question.id);
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    aria-label={`問題 ${index + 1}: ${review ? "見直し" : answered ? "回答済み" : "未回答"}`}
                    className={`grid aspect-square place-items-center rounded-xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-peach ${
                      review ? "bg-berry text-white" : answered ? "bg-mint text-leaf" : "bg-cream text-ink/65"
                    } ${index === session.currentIndex ? "ring-2 ring-leaf" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs font-bold text-ink/65">未回答: クリーム / 回答済み: 緑 / 見直し: 赤</p>
          </section>
        ) : null}

        <section ref={questionTopRef} className="surface scroll-mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-black text-ink/65">第{currentQuestion.examRound}回・問題 {currentQuestion.questionNumber}</p>
            <button
              type="button"
              onClick={toggleReview}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-peach ${
                isReview ? "bg-berry text-white" : "bg-cream text-ink/70"
              }`}
              aria-pressed={isReview}
            >
              <Flag className="h-5 w-5" aria-hidden="true" />見直す
            </button>
          </div>
          <p className="mt-4 text-sm font-black text-berry">{currentQuestion.category}</p>
          <h2 className="mt-2 whitespace-pre-line text-xl font-black leading-8 text-ink">{currentQuestion.questionText}</h2>
        </section>

        <section className="space-y-3" aria-label="選択肢">
          {currentQuestion.choices.map((choice) => {
            const selected = session.answers[currentQuestion.id] === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => answerQuestion(choice.id)}
                className={`choice-button ${selected ? "border-leaf bg-mint" : "hover:border-mint"}`}
                aria-pressed={selected}
              >
                <span className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-sm font-black text-ink">{choice.id}</span>
                  <span>{choice.text}</span>
                </span>
              </button>
            );
          })}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <ActionButton onClick={() => goToQuestion(Math.max(0, session.currentIndex - 1))} variant="soft" disabled={session.currentIndex === 0}>
            前の問題
          </ActionButton>
          <ActionButton onClick={() => goToQuestion(Math.min(questions.length - 1, session.currentIndex + 1))} variant="soft" disabled={session.currentIndex === questions.length - 1}>
            次の問題
          </ActionButton>
        </section>

        <ActionButton onClick={() => unansweredCount ? setShowFinishConfirm(true) : finishExam()} variant="secondary">
          模擬試験を終了する
        </ActionButton>

        {showFinishConfirm ? (
          <section role="dialog" aria-modal="true" aria-label="模擬試験終了の確認" className="surface border-berry bg-white">
            <CircleHelp className="h-8 w-8 text-berry" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-black">未回答が{unansweredCount}問あります</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-ink/70">未回答のまま終了して、結果を確認しますか？</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ActionButton onClick={() => setShowFinishConfirm(false)} variant="soft">問題に戻る</ActionButton>
              <ActionButton onClick={finishExam} variant="secondary">終了して結果を見る</ActionButton>
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}

function MockExamResult({ session, questions, onStartNew }: { session: MockExamSession; questions: Question[]; onStartNew: () => void }) {
  const results = useMemo<QuestionResult[]>(
    () => questions.map((question) => {
      const selectedChoice = session.answers[question.id];
      return { question, selectedChoice, isCorrect: Boolean(selectedChoice && question.correctChoices.includes(selectedChoice)) };
    }),
    [questions, session.answers],
  );
  const correctCount = results.filter((result) => result.isCorrect).length;
  const incorrectIds = results.filter((result) => result.selectedChoice && !result.isCorrect).map((result) => result.question.id);
  const reviewIds = session.reviewQuestionIds.filter((id) => questions.some((question) => question.id === id));
  const categories = [...new Set(questions.map((question) => question.category))];

  return (
    <AppShell>
      <div className="space-y-5">
        <Mascot mood="celebrate" message="125問、おつかれさま！ここまで進めた力はちゃんと残ってるよ。" />
        <section className="surface text-center">
          <p className="text-sm font-black text-berry">模擬試験結果</p>
          <p className="mt-3 text-5xl font-black text-ink">{correctCount} / 125</p>
          <p className="mt-2 text-xl font-black text-leaf">正答率 {Math.round((correctCount / 125) * 100)}%</p>
        </section>
        <section className="surface">
          <h1 className="text-xl font-black">分野別正答率</h1>
          <div className="mt-4 space-y-3">
            {categories.map((category) => {
              const categoryResults = results.filter((result) => result.question.category === category);
              const categoryCorrect = categoryResults.filter((result) => result.isCorrect).length;
              return <div key={category} className="flex items-center justify-between gap-3 text-sm font-bold"><span>{category}</span><span>{categoryCorrect} / {categoryResults.length}</span></div>;
            })}
          </div>
        </section>
        <div className="grid gap-3">
          <ActionButton href={incorrectIds.length ? `/quiz?ids=${incorrectIds.join(",")}` : "/review"} variant="secondary" disabled={!incorrectIds.length}>
            間違えた問題だけ復習
          </ActionButton>
          <ActionButton href={reviewIds.length ? `/quiz?ids=${reviewIds.join(",")}` : "/review"} variant="soft" disabled={!reviewIds.length}>
            見直しにした問題を復習
          </ActionButton>
          <ActionButton onClick={onStartNew} variant="primary"><span className="flex items-center gap-2"><RotateCcw className="h-5 w-5" aria-hidden="true" />新しい模擬試験を始める</span></ActionButton>
        </div>
        <section className="space-y-3" aria-label="模擬試験の解説一覧">
          <h2 className="px-1 text-xl font-black">問題ごとの確認</h2>
          {results.map((result, index) => (
            <details key={result.question.id} className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-soft">
              <summary className="cursor-pointer text-base font-black focus:outline-none focus:ring-4 focus:ring-peach">
                問題 {index + 1} {result.selectedChoice ? result.isCorrect ? "正解" : "不正解" : "未回答"}
              </summary>
              <div className="mt-4 space-y-3 text-sm leading-6">
                <p className="font-bold text-ink/70">自分の回答: {answerText(result.question, result.selectedChoice)}</p>
                <p className="font-bold text-leaf">正答: {result.question.choices.filter((choice) => result.question.correctChoices.includes(choice.id)).map((choice) => `${choice.id}. ${choice.text}`).join(" / ")}</p>
                <p className="whitespace-pre-line text-ink/80">{result.question.explanation}</p>
                {result.question.needsLegalReview ? <p className="rounded-2xl bg-peach/60 p-3 font-bold text-ink/75">この問題は法制度・統計等の変更により、現在の内容と異なる可能性があります。</p> : null}
                <p className="break-words text-xs text-ink/60">出典: {result.question.source}</p>
              </div>
            </details>
          ))}
        </section>
        <Link href="/" className="block text-center text-sm font-bold text-ink/60">ホームへ戻る</Link>
      </div>
    </AppShell>
  );
}
