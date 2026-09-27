"use client";

import React from "react";

import { MonthStats } from "@/components/journal/dashboard/MonthStats";
import { RecentTrades } from "@/components/journal/dashboard/RecentTrades";
import { useAuth } from "@/hooks/useAuth";
import { useRecentTrades } from "@/hooks/useRecentTrades";

const JournalDashboard = () => {
  const { user } = useAuth();
  const { items, loading } = useRecentTrades();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-bold text-ink">
        Cześć, {user?.username}
      </h1>

      <MonthStats />

      <RecentTrades items={items} loading={loading} />
    </div>
  );
};

export default JournalDashboard;
