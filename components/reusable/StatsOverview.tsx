"use client";

import React from "react";

import { AnalyticsError } from "@/components/journal/analytics/AnalyticsError";
import { AnalyticsSkeleton } from "@/components/journal/analytics/AnalyticsSkeleton";
import { EquityCurve } from "@/components/journal/analytics/EquityCurve";
import { RangePicker } from "@/components/journal/analytics/RangePicker";
import { StatsGrid } from "@/components/journal/analytics/StatsGrid";
import { useAnalyticsRange } from "@/hooks/useAnalyticsRange";
import { useStats } from "@/hooks/useStats";
import type { TradeStats } from "@/utils/analytics/types";

type StatsOverviewProps = {
  /** Card rendered under the curve. Analytics puts the breakdown here. */
  renderExtra?: (stats: TradeStats) => React.ReactNode;
};

/**
 * Range picker, the four metrics and the equity curve — the body shared by the
 * dashboard and the analytics page. One GET /trades/stats feeds all of it.
 */
export const StatsOverview = ({ renderExtra }: StatsOverviewProps) => {
  const { range, setKey, setBound } = useAnalyticsRange();
  const { stats, loading, failed, retry } = useStats(range.from, range.to);

  return (
    <>
      <RangePicker range={range} onKeyChange={setKey} onBoundChange={setBound} />

      {loading && <AnalyticsSkeleton />}
      {!loading && failed && <AnalyticsError onRetry={retry} />}
      {!loading && !failed && stats && (
        <>
          <StatsGrid stats={stats} />
          <EquityCurve
            curve={stats.equity_curve}
            from={range.from}
            to={range.to}
            zoomable={range.key === "all"}
          />
          {renderExtra?.(stats)}
        </>
      )}
    </>
  );
};
