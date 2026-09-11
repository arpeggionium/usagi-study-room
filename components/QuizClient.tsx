"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, XCircle } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { QuestionVisual } from "@/components/QuestionVisual";
import { getMascotReaction, type MascotReaction } from "@/data/mascot-reactions";
import { getAllQuestions, getChallengeQuestions, getQuestionsByCategory, getQuestionsByRound } from "@/lib/questions/repository";
import { getExamRoundSession, recordExamRoundAnswer, resetExamRoundSession } from "@/lib/progress/localExamSessionRepository";
import { getEverCorrectQuestionIds, loadProgress, recordAnswer } from "@/lib/progress/localProgressRepository";
import { useQuestionAutoScroll } from "@/lib/hooks/useQuestionAutoScroll";
import type { Question } from "@/types/question";

type AnswerState = {
  selectedChoice: string;
  isCorrect: boolean;
  reaction: MascotReaction;
};

function buildQuestions(
  mode: string | null,
  category: string | null,
  ids: string | null,
  round: string | null,
  everCorrectQuestionIds: string[],
): Question[] {
  if (ids) {
    const idSet = ids.split(",").filter(Boolean);
    const questions = getAllQuestions();
    return idSet
      .map((id) => questions.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question));
  }

  if (category) {
    return getQuestionsByCategory(category as Question["category"]);
  }

  if (mode === "round" && round) {
    return getQuestionsByRound(round);
  }

  return getChallengeQuestions({ everCorrectQuestionIds });
}

export function QuizClient() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <AppShell><p role="status">問題を準備しています...</p></AppShell>;
  return <QuizSession key={searchParams.toString()} query={searchParams.toString()} />;
}

function QuizSession({ query }: { query: string }) {
  const searchParams = useMemo(() => new URLSearchParams(query), [query]);
  const mode = searchParams.get("mode");
  const examRound = mode === "round" ? searchParams.get("round") : null;
  const savedProgress = useMemo(() => loadProgress(), []);
  const roundSession = useMemo(
    () => (examRound ? getExamRoundSession(examRound) : null),
    [examRound],
  );
  const [needsBreak, setNeedsBreak] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setNeedsBreak(true), 30 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, []);
  const [currentIndex, setCurrentIndex] = useState(
    roundSession?.completed ? 0 : roundSession?.currentQuestionIndex ?? 0,
  );
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [correctCount, setCorrectCount] = useState(roundSession?.correctQuestionIds.length ?? 0);
  const [wrongIds, setWrongIds] = useState(roundSession?.wrongQuestionIds ?? []);
  const [finished, setFinished] = useState(false);
  const questions = useMemo(
    () =>
      buildQuestions(
        searchParams.get("mode"),
        searchParams.get("category"),
        searchParams.get("ids"),
        searchParams.get("round"),
        getEverCorrectQuestionIds(savedProgress),
      ),
    [savedProgress, searchParams],
  );
  const question = questions[currentIndex];
  const { questionTopRef, scheduleQuestionScroll } = useQuestionAutoScroll(question?.id);

  function handleAnswer(choiceId: string) {
    if (!question || answer) {
      return;
    }

    const nextProgress = recordAnswer(question, choiceId, loadProgress());
    const isCorrect = question.correctChoices.includes(choiceId);
    const isStreak = isCorrect && [3, 5, 7, 10].includes(nextProgress.currentCorrectStreak);
    const reaction = isStreak
      ? getMascotReaction("streak", nextProgress.currentCorrectStreak)
      : getMascotReaction(isCorrect ? "correct" : "wrong");

    setAnswer({
      selectedChoice: choiceId,
      isCorrect,
      reaction,
    });
    setCorrectCount((count) => count + (isCorrect ? 1 : 0));
    if (!isCorrect) {
      setWrongIds((ids) => [...ids, question.id]);
    }
    if (examRound) {
      recordExamRoundAnswer(examRound, question.id, currentIndex, questions.length, isCorrect);
    }
  }

  function goNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    scheduleQuestionScroll();
    setCurrentIndex((index) => index + 1);
    setAnswer(null);
  }

  function restart() {
    if (examRound) {
      resetExamRoundSession(examRound);
    }
    setCurrentIndex(0);
    setAnswer(null);
    setCorrectCount(0);
    setWrongIds([]);
    setFinished(false);
  }

  if (questions.length === 0 || !question) {
    return (
      <AppShell>
        <div className="space-y-5">
          <Mascot mood="tired" message="今は出題できる問題が見つからないみたい。別の分野を選んでみよう。" />
          <ActionButton href="/categories" variant="soft">
            分野選択へ
          </ActionButton>
        </div>
      </AppShell>
    );
  }

  if (finished) {
    const rate = Math.round((correctCount / questions.length) * 100);
    const resultMessage =
      rate >= 80
        ? "かなり仕上がってきたね。自信にしていこう！"
        : rate >= 50
          ? "いい積み重ね。間違えたところを見直せばもっと強くなるよ。"
          : "今日ここまで進めたのが大事。復習でゆっくり整えよう。";

    return (
      <AppShell>
        <div className="space-y-5">
          <Mascot mood={rate >= 80 ? "celebrate" : "cheer"} message={resultMessage} />
          <section className="surface text-center">
            <p className="text-sm font-black text-berry">結果</p>
            <p className="mt-3 text-5xl font-black text-ink">
              {correctCount}/{questions.length}
            </p>
            <p className="mt-2 text-xl font-black text-leaf">正答率 {rate}%</p>
            <p className="mt-3 text-base font-bold text-ink/70">
              間違えた問題: {wrongIds.length}問
            </p>
          </section>
          <div className="grid gap-3">
            <ActionButton onClick={restart} variant="primary">
              もう一度
            </ActionButton>
            <ActionButton
              href={wrongIds.length > 0 ? `/quiz?ids=${wrongIds.join(",")}` : "/review"}
              variant="secondary"
            >
              間違えた問題を復習
            </ActionButton>
            <ActionButton href="/" variant="soft">
              <span className="flex items-center gap-2">
                <Home className="h-5 w-5" aria-hidden="true" />
                ホームへ戻る
              </span>
            </ActionButton>
          </div>
        </div>
      </AppShell>
    );
  }

  const correctChoices = question.choices.filter((choice) => question.correctChoices.includes(choice.id));

  return (
    <AppShell>
      <div className="space-y-5">
        {!answer ? (
          <Mascot
            mood={needsBreak ? "tired" : searchParams.has("ids") ? "review" : "study"}
            message={needsBreak ? "30分がんばったね。ひと息ついて、また自分のペースで進もう。" : "問題を読んで、いちばん近い答えを選んでみよう。"}
            compact
          />
        ) : null}
        <section ref={questionTopRef} className="surface scroll-mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="rounded-full bg-mint px-3 py-1 text-sm font-black text-leaf">
              {currentIndex + 1}/{questions.length}問目
            </p>
            <p className="text-sm font-bold text-ink/65">
              第{question.examRound}回・問題 {question.questionNumber}
            </p>
          </div>
          <p className="mt-4 text-sm font-black text-berry">{question.category}</p>
          {mode === "challenge" ? (
            <p className="mt-2 text-sm font-bold text-ink/60">まだ正解していない問題を優先して出題しています。</p>
          ) : null}
          <QuestionVisual question={question} position="beforeQuestion" />
          <h1 className="mt-2 text-xl font-black leading-8 text-ink">
            {question.questionText}
          </h1>
          <QuestionVisual question={question} position="afterQuestion" />
        </section>

        <QuestionVisual question={question} position="beforeChoices" />
        <section className="space-y-3" aria-label="選択肢">
          {question.choices.map((choice) => {
            const isSelected = answer?.selectedChoice === choice.id;
            const isCorrectChoice = answer && question.correctChoices.includes(choice.id);
            const isWrongSelected = answer && isSelected && !answer.isCorrect;
            const stateClass = isCorrectChoice
              ? "border-leaf bg-mint"
              : isWrongSelected
                ? "border-berry bg-peach/70"
                : isSelected
                  ? "border-sun bg-white"
                  : "hover:border-mint";

            return (
              <button
                key={choice.id}
                className={`choice-button ${stateClass}`}
                onClick={() => handleAnswer(choice.id)}
                disabled={Boolean(answer)}
                aria-pressed={isSelected}
              >
                <span className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-sm font-black uppercase text-ink">
                    {choice.id}
                  </span>
                  <span>{choice.text}</span>
                  {isCorrectChoice ? (
                    <CheckCircle2 className="ml-auto h-6 w-6 shrink-0 text-leaf" aria-label="正解" />
                  ) : null}
                  {isWrongSelected ? (
                    <XCircle className="ml-auto h-6 w-6 shrink-0 text-berry" aria-label="選択した不正解" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </section>

        {answer ? (
          <section className={`answer-feedback space-y-4 ${answer.isCorrect ? "answer-feedback-correct" : "answer-feedback-wrong"} ${answer.reaction.type === "streak" ? "answer-feedback-streak" : ""}`} aria-live="polite">
            <div className="feedback-particles" aria-hidden="true">
              {answer.isCorrect ? ["*", "+", "*", "+", "*", "+", "*"].map((mark, index) => <span key={index}>{mark}</span>) : <span className="feedback-cross">x</span>}
            </div>
          <Mascot reaction={answer.reaction} compact />
            <div className="surface answer-feedback-card">
              <p className={`font-black ${answer.isCorrect ? "text-3xl text-leaf" : "text-2xl text-berry"}`}>
                {answer.isCorrect ? "正解！" : "おしい！"}
              </p>
              <p className="mt-2 text-base font-bold text-ink/70">{answer.reaction.message}</p>
              <p className="mt-2 text-base font-bold text-leaf">
                正答: {correctChoices.map((choice) => `${choice.id}. ${choice.text}`).join(" / ")}
              </p>
              <p className="mt-4 whitespace-pre-line text-base font-medium leading-7 text-ink/80">
                {question.explanation}
              </p>
              {question.needsLegalReview ? (
                <p className="mt-4 rounded-2xl bg-peach/60 p-3 text-sm font-bold leading-6 text-ink/75">
                  この問題は法制度・統計等の変更により、現在の内容と異なる可能性があります。
                </p>
              ) : null}
              <details className="mt-4 text-sm font-bold text-ink/65">
                <summary className="cursor-pointer rounded-lg px-1 py-2 text-leaf focus:outline-none focus:ring-4 focus:ring-peach">
                  出典を見る
                </summary>
                <p className="mt-2 whitespace-pre-line break-words rounded-2xl bg-cream/70 p-3 text-xs font-medium leading-6 text-ink/70">
                  {question.source}
                </p>
              </details>
            </div>
            <ActionButton onClick={goNext} variant="primary">
              {currentIndex + 1 >= questions.length ? "結果を見る" : "次の問題へ"}
            </ActionButton>
          </section>
        ) : (
          <p className="rounded-3xl bg-white/70 p-4 text-sm font-bold leading-6 text-ink/65">
            選択肢をタップすると回答できます。回答後に解説が出ます。
          </p>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold text-ink/60 focus:outline-none focus:ring-4 focus:ring-mint"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
