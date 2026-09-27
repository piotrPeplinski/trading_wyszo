"use client";

import React from "react";
import Link from "next/link";
import { NotebookPen } from "lucide-react";

import { EmptyState } from "@/components/reusable/EmptyState";
import { RecentTradeRow } from "@/components/journal/dashboard/RecentTradeRow";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import type { Trade } from "@/utils/trades/types";

type RecentTradesProps = {
  items: Trade[];
  loading: boolean;
};

export const RecentTrades = ({ items, loading }: RecentTradesProps) => {
  const { openCreate } = useTradeDialog();

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">
          Ostatnie pozycje
        </h2>
        {items.length > 0 && (
          <Link
            href="/journal/trades"
            className="text-sm text-green-ink underline-offset-4 hover:underline"
          >
            Zobacz wszystkie
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-4 flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-11" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<NotebookPen size={24} />}
          title="Nie masz jeszcze żadnych pozycji."
          description="Zapisz pierwszy trade, a pojawią się tu statystyki, kalendarz i equity curve."
          action={<Button onClick={() => openCreate()}>Dodaj pierwszą pozycję</Button>}
        />
      ) : (
        <div className="mt-2 flex flex-col">
          {items.map((trade) => (
            <RecentTradeRow key={trade.id} trade={trade} />
          ))}
        </div>
      )}
    </section>
  );
};
