import { formatPercent, formatRr, percentTone } from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type CalendarSummaryProps = {
  trades: Trade[];
};

/** Derived from the trades already on screen — no extra request. */
export const CalendarSummary = ({ trades }: CalendarSummaryProps) => {
  const sum = trades.reduce((acc, t) => acc + t.result_percentage, 0);
  const decided = trades.filter((t) => t.result !== "be").length;
  const wins = trades.filter((t) => t.result === "tp").length;
  // Same rule as the backend stats: only TP trades with positive RR.
  const rrTrades = trades.filter((t) => t.result === "tp" && t.result_rr > 0);
  const avgRr = rrTrades.length
    ? rrTrades.reduce((acc, t) => acc + t.result_rr, 0) / rrTrades.length
    : null;

  const stats = [
    { label: "Pozycje", value: String(trades.length), tone: "text-ink" },
    {
      label: "Suma %",
      value: trades.length ? formatPercent(sum) : "—",
      tone: trades.length ? percentTone(sum) : "text-ink",
    },
    {
      label: "Win rate",
      value: decided ? `${Math.round((wins / decided) * 100)}%` : "—",
      tone: "text-ink",
    },
    {
      label: "Średnie RR",
      value: avgRr === null ? "—" : formatRr(avgRr),
      tone: "text-ink",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5">
          <span className="text-xs uppercase tracking-wide text-muted">
            {stat.label}
          </span>
          <span className={cn("font-display text-xl font-bold", stat.tone)}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};
