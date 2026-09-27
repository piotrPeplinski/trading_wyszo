"use client";

import React from "react";

import { StatsGrid } from "@/components/journal/analytics/StatsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/useStats";
import { presetRange } from "@/utils/analytics/range";
import { formatMonthLabel } from "@/utils/calendar";

/** Same four cards as the analytics page, pinned to the current calendar month. */
export const MonthStats = () => {
  const month = presetRange("month");
  const { stats, loading } = useStats(month.from, month.to);

  return (
    <section className="flex flex-col gap-3">
      {/* Without the period spelled out, the numbers read as all-time. */}
      <p className="text-xs uppercase tracking-wide text-muted-2">
        {formatMonthLabel(new Date())}
      </p>

      {loading || !stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[108px] rounded-2xl" />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}
    </section>
  );
};
