type StatCardProps = {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "neutral" | "positive" | "negative";
};

const toneClasses = {
  neutral: "text-ink",
  positive: "text-green-ink",
  negative: "text-red",
} as const;

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${toneClasses[tone]}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-2">{sub}</p>}
    </div>
  );
}
