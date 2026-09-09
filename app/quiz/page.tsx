import { Suspense } from "react";
import { QuizClient } from "@/components/QuizClient";

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center font-bold">問題を準備しています...</div>}>
      <QuizClient />
    </Suspense>
  );
}
