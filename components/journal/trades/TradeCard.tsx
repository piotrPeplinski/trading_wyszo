"use client";

import { Pencil, Trash2 } from "lucide-react";

import { ResultBadge } from "@/components/reusable/ResultBadge";
import { TradeDetails } from "@/components/journal/trades/TradeDetails";
import { OPERATION_LABELS } from "@/utils/trades/constants";
import {
  formatAmount,
  formatPercent,
  formatRr,
  percentTone,
} from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

const CARD_ACTION =
  "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors";

type TradeCardProps = {
  trade: Trade;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
};

export const TradeCard = ({
  trade,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onView,
}: TradeCardProps) => (
  <div
    onClick={onToggle}
    className="rounded-2xl border border-border bg-surface p-4"
  >
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium text-ink">{trade.instrument}</span>
      <ResultBadge result={trade.result} />
    </div>

    <p className="mt-1 text-xs text-muted">
      {trade.date} · {trade.interval} · {OPERATION_LABELS[trade.operation]}
    </p>

    <div className="mt-3 flex items-center justify-between gap-2 text-sm">
      <span className={cn("font-medium", percentTone(trade.result_percentage))}>
        {formatPercent(trade.result_percentage)}
      </span>
      <span>{formatAmount(trade.result_amount)}</span>
      <span className="text-muted">RR {formatRr(trade.result_rr)}</span>
    </div>

    {expanded && (
      <div
        className="mt-4 border-t border-border pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <TradeDetails trade={trade} />

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onEdit} className={cn(CARD_ACTION, "hover:text-ink")}>
            <Pencil size={13} /> Edytuj
          </button>
          <button type="button" onClick={onDelete} className={cn(CARD_ACTION, "hover:text-red")}>
            <Trash2 size={13} /> Usuń
          </button>
          <button
            type="button"
            onClick={onView}
            className="ml-auto text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Podgląd
          </button>
        </div>
      </div>
    )}
  </div>
);
