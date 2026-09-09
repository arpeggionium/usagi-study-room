"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Mascot } from "@/components/Mascot";
import { getCategorySummaries, type CategorySummary } from "@/lib/questions/repository";
import { loadProgress } from "@/lib/progress/localProgressRepository";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    setCategories(getCategorySummaries(loadProgress()));
  }, []);

  return (
    <AppShell>
      <div className="space-y-5">
        <Mascot mood="normal" message="気になる分野から少しずつ整えていこう。" compact />
        <section className="surface">
          <p className="text-sm font-black text-berry">分野別に学ぶ</p>
          <h1 className="mt-2 text-2xl font-black">主要分野</h1>
          <p className="mt-2 text-sm font-bold leading-6 text-ink/65">
            分野ごとの問題数、学習済み数、正答率を確認できます。
          </p>
        </section>
        <section className="grid gap-3" aria-label="分野一覧">
          {categories.map((item) => (
            <Link
              key={item.category}
              href={`/quiz?category=${encodeURIComponent(item.category)}`}
              className="flex min-h-20 items-center justify-between gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-soft transition hover:bg-mint focus:outline-none focus:ring-4 focus:ring-peach"
            >
              <div>
                <h2 className="text-base font-black leading-6">{item.category}</h2>
                <p className="mt-1 text-sm font-bold text-ink/60">
                  {item.questionCount}問・学習済み {item.answeredQuestionCount}問・正答率{" "}
                  {item.accuracy === null ? "--%" : `${item.accuracy}%`}
                </p>
              </div>
              <ChevronRight className="h-6 w-6 shrink-0 text-leaf" aria-hidden="true" />
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
