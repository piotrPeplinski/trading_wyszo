"use client";

import { useState } from "react";
import { ArrowLeft, NotebookPen, Pencil } from "lucide-react";

import { EmptyState } from "@/components/reusable/EmptyState";
import { ResultBadge } from "@/components/reusable/ResultBadge";
import { TradeForm } from "@/components/reusable/TradeForm";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { formatFullDate, fromIso } from "@/utils/calendar";
import { formatPercent, formatRr, percentTone } from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type DayTradesDialogProps = {
  /** ISO date of the open day, or null when the dialog is closed. */
  iso: string | null;
  trades: Trade[];
  onClose: () => void;
};

/**
 * One dialog, two views. Stacking a second modal on top of the day list would trap
 * focus twice and make Escape ambiguous, so the detail swaps in place instead.
 */
export const DayTradesDialog = ({ iso, trades, onClose }: DayTradesDialogProps) => {
  const { openCreate, notifySaved } = useTradeDialog();
  const [selected, setSelected] = useState<Trade | null>(null);
  const [editing, setEditing] = useState(false);

  const close = () => {
    onClose();
    setSelected(null);
    setEditing(false);
  };

  const backToList = () => {
    setSelected(null);
    setEditing(false);
  };

  const sum = trades.reduce((acc, t) => acc + t.result_percentage, 0);
  const date = iso ? fromIso(iso) : null;

  return (
    <Dialog open={iso !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-bg px-6 py-4">
          <div className="flex items-center gap-2">
            {selected && (
              <button
                type="button"
                aria-label="Wróć do listy dnia"
                onClick={backToList}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <ArrowLeft size={16} />
              </button>
            )}

            <DialogTitle className="font-display text-xl font-bold text-ink first-letter:uppercase">
              {date ? formatFullDate(date) : ""}
            </DialogTitle>

            {selected && !editing && (
              <button
                type="button"
                aria-label="Edytuj pozycję"
                onClick={() => setEditing(true)}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>

          <DialogDescription className={selected ? "sr-only" : "text-sm text-muted"}>
            {selected
              ? "Szczegóły pozycji"
              : trades.length === 0
                ? "Brak pozycji tego dnia"
                : `${trades.length === 1 ? "1 pozycja" : `${trades.length} pozycji`} · ${formatPercent(sum)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {selected ? (
            <TradeForm
              key={`${selected.id}-${editing}`}
              trade={selected}
              readOnly={!editing}
              onSaved={() => {
                // Bump the shared counter so the calendar refetches the range.
                notifySaved();
                backToList();
              }}
              onCancel={() => setEditing(false)}
            />
          ) : trades.length === 0 ? (
            <EmptyState
              icon={<NotebookPen size={24} />}
              title="Brak pozycji tego dnia."
              action={
                <Button
                  onClick={() => {
                    close();
                    if (iso) openCreate(iso);
                  }}
                >
                  Dodaj pozycję tego dnia
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {trades.map((trade) => (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => setSelected(trade)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-green/40"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">
                    {trade.instrument}
                  </span>
                  <ResultBadge result={trade.result} />
                  <span
                    className={cn(
                      "w-16 text-right text-sm font-medium",
                      percentTone(trade.result_percentage)
                    )}
                  >
                    {formatPercent(trade.result_percentage)}
                  </span>
                  <span className="w-12 text-right text-sm text-muted">
                    RR {formatRr(trade.result_rr)}
                  </span>
                </button>
              ))}

              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  close();
                  if (iso) openCreate(iso);
                }}
              >
                Dodaj pozycję tego dnia
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
