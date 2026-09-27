"use client";

import React, { Suspense } from "react";

import { AnalyticsError } from "@/components/journal/analytics/AnalyticsError";
import { AnalyticsSkeleton } from "@/components/journal/analytics/AnalyticsSkeleton";
import { EquityCurve } from "@/components/journal/analytics/EquityCurve";
import { RangePicker } from "@/components/journal/analytics/RangePicker";
import { ResultBreakdown } from "@/components/journal/analytics/ResultBreakdown";
import { StatsGrid } from "@/components/journal/analytics/StatsGrid";
import { useAnalyticsRange } from "@/hooks/useAnalyticsRange";
import { useStats } from "@/hooks/useStats";

const AnalyticsPageInner = () => {
  const { range, setKey, setBound } = useAnalyticsRange();
  // One request feeds the cards, the breakdown and the curve alike.
  const { stats, loading, failed, retry } = useStats(range.from, range.to);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Analityka</h1>

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
          <ResultBreakdown stats={stats} />
        </>
      )}
    </div>
  );
};

// useSearchParams needs a Suspense boundary in the App Router.
const AnalyticsPage = () => (
  <Suspense fallback={null}>
    <AnalyticsPageInner />
  </Suspense>
);

export default AnalyticsPage;
