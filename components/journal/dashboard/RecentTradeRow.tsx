"use client";

import React from "react";

import { ResultBadge } from "@/components/reusable/ResultBadge";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { fromIso, formatDayMonth } from "@/utils/calendar";
import { formatPercent, percentTone } from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";

type RecentTradeRowProps = {
  trade: Trade;
};

export const RecentTradeRow = ({ trade }: RecentTradeRowProps) => {
  const { openView } = useTradeDialog();

  return (
    <button
      type="button"
      onClick={() => openView(trade)}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surface-2"
    >
      <ResultBadge result={trade.result} />

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
        {trade.instrument}
      </span>

      <span className="hidden shrink-0 text-xs text-muted-2 sm:inline">
        {formatDayMonth(fromIso(trade.date))}
      </span>

      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${percentTone(
          trade.result_percentage
        )}`}
      >
        {formatPercent(trade.result_percentage)}
      </span>
    </button>
  );
};
