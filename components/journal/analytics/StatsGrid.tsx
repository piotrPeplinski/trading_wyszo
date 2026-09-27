import React from "react";

import { StatCard } from "@/components/reusable/StatCard";
import { DASH, formatWinRate, plural } from "@/utils/analytics/format";
import type { TradeStats } from "@/utils/analytics/types";
import { formatAmount, formatPercent, formatRr } from "@/utils/trades/format";

type StatsGridProps = {
  stats: TradeStats;
};

const tone = (n: number) =>
  n > 0 ? ("positive" as const) : n < 0 ? ("negative" as const) : ("neutral" as const);

export const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <StatCard
      label="Win rate"
      value={formatWinRate(stats.win_rate)}
      sub={`${stats.wins} ${plural(stats.wins, {
        one: "wygrana",
        few: "wygrane",
        many: "wygranych",
      })} / ${stats.losses} ${plural(stats.losses, {
        one: "przegrana",
        few: "przegrane",
        many: "przegranych",
      })}`}
    />

    <StatCard
      label="Pozycje"
      value={stats.count}
      sub={`${stats.wins} TP · ${stats.losses} SL · ${stats.breakeven} BE`}
    />

    <StatCard
      label="Średnie RR"
      value={stats.avg_rr === null ? DASH : formatRr(stats.avg_rr)}
    />

    <StatCard
      label="Total PnL"
      value={formatPercent(stats.total_pnl_percentage)}
      tone={tone(stats.total_pnl_percentage)}
      sub={formatAmount(stats.total_pnl_amount)}
    />
  </div>
);
