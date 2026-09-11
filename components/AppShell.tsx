"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, CalendarDays, ChartNoAxesColumn, Home } from "lucide-react";
import { usePathname } from "next/navigation";

function navClass(active: boolean): string {
  return `nav-item ${active ? "bg-mint text-leaf" : ""}`;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLearn = pathname.startsWith("/quiz") || pathname.startsWith("/categories") || pathname.startsWith("/learn") || pathname.startsWith("/round");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffe9df_0,#fffaf4_34%,#eef8f1_100%)] text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-24 pt-5 sm:px-6">
        <header className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-2 py-2 text-base font-bold tracking-wide text-ink focus:outline-none focus:ring-4 focus:ring-peach"
            aria-label="ホームへ戻る"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-soft">
              <Home className="h-5 w-5 text-berry" aria-hidden="true" />
            </span>
            うさぎの学習室
          </Link>
          <Link
            href="/categories"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-leaf shadow-soft focus:outline-none focus:ring-4 focus:ring-mint"
          >
            分野
          </Link>
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <nav
        aria-label="主要ナビゲーション"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-white/70 bg-white/90 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(80,70,55,0.08)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2">
          <Link aria-current={pathname === "/" ? "page" : undefined} className={navClass(pathname === "/")} href="/">
            <Home className="h-5 w-5" aria-hidden="true" />
            ホーム
          </Link>
          <Link aria-current={isLearn ? "page" : undefined} className={navClass(isLearn)} href="/learn">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            学ぶ
          </Link>
          <Link aria-current={pathname.startsWith("/calendar") ? "page" : undefined} className={navClass(pathname.startsWith("/calendar"))} href="/calendar">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            カレンダー
          </Link>
          <Link aria-current={pathname.startsWith("/review") ? "page" : undefined} className={navClass(pathname.startsWith("/review"))} href="/review">
            <ChartNoAxesColumn className="h-5 w-5" aria-hidden="true" />
            記録
          </Link>
        </div>
      </nav>
    </div>
  );
}
