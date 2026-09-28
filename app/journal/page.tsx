"use client";

import React, { Suspense } from "react";

import { RecentTrades } from "@/components/journal/dashboard/RecentTrades";
import { StatsOverview } from "@/components/reusable/StatsOverview";
import { useAuth } from "@/hooks/useAuth";
import { useRecentTrades } from "@/hooks/useRecentTrades";

const JournalDashboardInner = () => {
  const { user } = useAuth();
  const { items, loading } = useRecentTrades();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">
        Cześć, {user?.username}
      </h1>

      {/* Same body as analytics minus the breakdown; recent trades sit under it.
          RecentTrades loads on its own, so it stays outside renderExtra. */}
      <StatsOverview />

      <RecentTrades items={items} loading={loading} />
    </div>
  );
};

// useSearchParams (inside StatsOverview) needs a Suspense boundary here.
const JournalDashboard = () => (
  <Suspense fallback={null}>
    <JournalDashboardInner />
  </Suspense>
);

export default JournalDashboard;
