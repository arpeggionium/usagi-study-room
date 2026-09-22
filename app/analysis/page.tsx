"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { QUESTION_CATEGORIES } from "@/constants/categories";
import { getCategoryStats, getRecommendedReviewCategory, getWeakCategories, type CategoryLearningStats } from "@/lib/progress/categoryAnalysis";
import { loadProgress } from "@/lib/progress/localProgressRepository";

const statusLabel = { collecting: "データ収集中", strong: "得意", improving: "もう少し", weak: "苦手" } as const;
const statusClass = { collecting: "bg-cream text-ink/65", strong: "bg-mint text-leaf", improving: "bg-peach/60 text-berry", weak: "bg-berry text-white" } as const;
const reviewHref = (category: string) => `/quiz?mode=weaknessReview&category=${encodeURIComponent(category)}`;

export default function AnalysisPage() {
  const [stats, setStats] = useState<CategoryLearningStats[] | null>(null);
  useEffect(() => setStats(getCategoryStats(QUESTION_CATEGORIES, loadProgress())), []);
  if (!stats) return <AppShell><p role="status">学習記録を確認しています...</p></AppShell>;
  const weakCategories = getWeakCategories(stats);
  const recommended = getRecommendedReviewCategory(stats);
  return <AppShell><div className="space-y-5">
    <section className="surface"><p className="text-sm font-black text-berry">学習分析</p><h1 className="mt-2 text-3xl font-black">次に取り組む分野</h1><p className="mt-2 text-sm font-bold leading-6 text-ink/70">これまでの回答から、次の復習を見つけるよ。</p></section>
    <section className="surface border-mint/70 bg-white/90"><p className="text-sm font-black text-berry">もふまるのおすすめ復習</p>{recommended ? <><Mascot mood="cheer" compact message={`今は「${recommended.category}」を復習してみよう！`} /><ActionButton href={reviewHref(recommended.category)} variant="primary"><span className="flex items-center gap-2"><Sparkles className="h-5 w-5" aria-hidden="true" />おすすめ5問に挑戦</span></ActionButton></> : <Mascot mood="normal" compact message="もう少し問題を解くと、もふまるが苦手分野を見つけられるよ。" />}</section>
    <section className="space-y-3"><div><p className="text-sm font-black text-berry">あなたの苦手分野</p><h2 className="text-xl font-black">TOP3</h2></div>{weakCategories.length ? weakCategories.slice(0, 3).map((stat, index) => <article key={stat.category} className="surface"><p className="text-sm font-black text-berry">{index + 1}位</p><h3 className="mt-1 text-xl font-black">{stat.category}</h3><p className="mt-2 text-lg font-black text-ink">正答率 {stat.accuracy}%</p><p className="mt-1 text-sm font-bold text-ink/65">{stat.correctCount} / {stat.answerCount}問 正解</p><ActionButton href={reviewHref(stat.category)} variant="secondary" className="mt-4">この分野を5問復習</ActionButton></article>) : <p className="rounded-3xl bg-mint/80 p-4 text-sm font-bold leading-6 text-ink/75">回答数が5回以上の分野から、苦手分野を見つけるよ。</p>}</section>
    <section className="space-y-3"><div><p className="text-sm font-black text-berry">分野別の学習状況</p><h2 className="text-xl font-black">ひとつずつ積み上げよう</h2></div>{stats.map((stat) => <article key={stat.category} className="surface flex items-center justify-between gap-3"><div><h3 className="font-black">{stat.category}</h3><p className="mt-1 text-sm font-bold text-ink/65">{stat.answerCount ? `${stat.correctCount} / ${stat.answerCount}問 正解・回答数 ${stat.answerCount}回` : "まだ回答がありません"}</p></div><div className="text-right"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass[stat.status]}`}>{statusLabel[stat.status]}</span><p className="mt-2 text-lg font-black text-leaf">{stat.accuracy === null ? "--%" : `${stat.accuracy}%`}</p></div></article>)}</section>
  </div></AppShell>;
}
