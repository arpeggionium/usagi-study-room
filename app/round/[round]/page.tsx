import { RoundQuestionListClient } from "@/components/RoundQuestionListClient";

type RoundPageProps = {
  params: Promise<{ round: string }>;
};

export default async function RoundPage({ params }: RoundPageProps) {
  const { round } = await params;
  return <RoundQuestionListClient examRound={round} />;
}
