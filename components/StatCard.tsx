type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/80 bg-white/75 p-3 shadow-soft sm:p-4">
      <p className="text-sm font-bold text-ink/60">{label}</p>
      <p className="mt-2 break-words text-xl font-black text-ink sm:text-2xl">{value}</p>
    </div>
  );
}
