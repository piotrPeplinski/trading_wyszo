import React from "react";

import { formatShare } from "@/utils/analytics/format";
import type { TradeStats } from "@/utils/analytics/types";

type ResultBreakdownProps = {
  stats: TradeStats;
};

const ROWS = [
  { key: "wins", label: "Take profit", bar: "bg-green" },
  { key: "losses", label: "Stop loss", bar: "bg-red" },
  { key: "breakeven", label: "Breakeven", bar: "bg-muted-2" },
] as const;

export const ResultBreakdown = ({ stats }: ResultBreakdownProps) => (
  <section className="rounded-2xl border border-border bg-surface p-5">
    <h2 className="font-display text-lg font-semibold text-ink">
      Rozbicie wyników
    </h2>

    {stats.count === 0 ? (
      // Three bars of zero length read as a rendering bug, not as "no data".
      <p className="mt-4 text-sm text-muted">
        Brak pozycji w wybranym zakresie.
      </p>
    ) : (
      <div className="mt-4 flex flex-col gap-4">
        {ROWS.map((row) => {
          const value = stats[row.key];
          return (
            <div key={row.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted">{row.label}</span>
                <span className="text-ink">
                  {value}{" "}
                  <span className="text-muted-2">
                    ({formatShare(value, stats.count)})
                  </span>
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${row.bar}`}
                  style={{ width: `${(value / stats.count) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
);
