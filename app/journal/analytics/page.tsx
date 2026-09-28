"use client";

import React, { Suspense } from "react";

import { ResultBreakdown } from "@/components/journal/analytics/ResultBreakdown";
import { StatsOverview } from "@/components/reusable/StatsOverview";

const AnalyticsPageInner = () => (
  <div className="flex flex-col gap-6">
    <h1 className="font-display text-2xl font-bold text-ink">Analityka</h1>

    <StatsOverview
      renderExtra={(stats) => <ResultBreakdown stats={stats} />}
    />
  </div>
);

// useSearchParams needs a Suspense boundary in the App Router.
const AnalyticsPage = () => (
  <Suspense fallback={null}>
    <AnalyticsPageInner />
  </Suspense>
);

export default AnalyticsPage;
