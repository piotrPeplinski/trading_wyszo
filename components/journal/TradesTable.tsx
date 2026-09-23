"use client";

import { Fragment, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";

import { toast } from "react-toastify";

import { useApi } from "@/hooks/useApi";
import { ResultBadge } from "@/components/journal/ResultBadge";
import { TradingViewEmbed } from "@/components/journal/TradingViewEmbed";
import { useTradeDialog } from "@/components/journal/TradeDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  OPERATION_LABELS,
  formatAmount,
  formatPercent,
  formatRr,
  type Trade,
} from "@/utils/trades";
import { cn } from "@/lib/utils";

export type SortKey = "date" | "result_percentage" | "result_rr" | "id";
export type SortOrder = "asc" | "desc";

type Column = {
  key: SortKey | null;
  label: string;
  hint?: string;
  center?: boolean;
};

const COLUMNS: Column[] = [
  { key: "date", label: "Data" },
  { key: null, label: "Instrument" },
  { key: null, label: "Interwał", center: true },
  { key: null, label: "Operacja", center: true },
  { key: null, label: "Rezultat", center: true },
  {
    key: "result_percentage",
    label: "%",
    hint: "Wynik procentowy pozycji",
    center: true,
  },
  { key: null, label: "$", hint: "Wynik kwotowy w dolarach", center: true },
  {
    key: "result_rr",
    label: "RR",
    hint: "Stosunek zysku do ryzyka (risk–reward)",
    center: true,
  },
];

const ACTION_BTN =
  "rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink";

const pctTone = (n: number) =>
  n > 0 ? "text-green-ink" : n < 0 ? "text-red" : "text-muted";

function OperationCell({ trade }: { trade: Trade }) {
  const long = trade.operation === "long";
  const Icon = long ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Icon size={15} className={long ? "text-green-ink" : "text-red"} />
      {OPERATION_LABELS[trade.operation]}
    </span>
  );
}

function Details({ trade }: { trade: Trade }) {
  const hasAny = trade.description || trade.error_desc || trade.link;
  if (!hasAny)
    return <p className="text-sm text-muted-2">Brak dodatkowych szczegółów.</p>;

  return (
    <div className="flex flex-col gap-4">
      {trade.description && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Opis</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
            {trade.description}
          </p>
        </div>
      )}
      {trade.error_desc && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Popełniony błąd
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
            {trade.error_desc}
          </p>
        </div>
      )}
      {trade.link && <TradingViewEmbed link={trade.link} />}
    </div>
  );
}

type TradesTableProps = {
  items: Trade[];
  sort: SortKey;
  order: SortOrder;
  onSortChange: (sort: SortKey, order: SortOrder) => void;
};

export function TradesTable({
  items,
  sort,
  order,
  onSortChange,
}: TradesTableProps) {
  const api = useApi();
  const { openEdit, openView, notifySaved } = useTradeDialog();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => setExpanded((e) => (e === id ? null : id));

  // Sorting is a server round-trip (sort/order query params), never a JS sort —
  // the list is paginated, so reordering locally would only reorder page one.
  const handleSort = (key: SortKey) =>
    onSortChange(key, sort === key && order === "desc" ? "asc" : "desc");

  async function handleDelete(trade: Trade) {
    if (!confirm(`Usunąć pozycję ${trade.instrument} z ${trade.date}?`)) return;
    try {
      await api.delete(`/trades/${trade.id}`);
      notifySaved();
      toast.success(`Usunięto pozycję ${trade.instrument}.`);
    } catch {
      toast.error("Nie udało się usunąć pozycji.");
    }
  }

  return (
    <>
      {/* Desktop */}
      <TooltipProvider>
      <div className="hidden rounded-2xl border border-border bg-surface md:block">
        <Table>
          <TableHeader className="sticky top-[88px] z-20 bg-surface-2 [&_tr]:border-b">
            <TableRow className="hover:bg-transparent">
              {COLUMNS.map((col) => {
                const inner = col.key ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key!)}
                    className="inline-flex items-center gap-1 transition-colors hover:text-ink"
                  >
                    {col.label}
                    {sort === col.key &&
                      (order === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </button>
                ) : (
                  <span>{col.label}</span>
                );

                return (
                  <TableHead
                    key={col.label}
                    className={cn(col.center && "text-center")}
                  >
                    {col.hint ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{inner}</TooltipTrigger>
                        <TooltipContent>{col.hint}</TooltipContent>
                      </Tooltip>
                    ) : (
                      inner
                    )}
                  </TableHead>
                );
              })}
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((trade) => (
              <Fragment key={trade.id}>
                <TableRow
                  onClick={() => toggle(trade.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="whitespace-nowrap">
                    {trade.date}
                  </TableCell>
                  <TableCell className="font-medium text-ink">
                    {trade.instrument}
                  </TableCell>
                  <TableCell className="text-center text-muted">{trade.interval}</TableCell>
                  <TableCell className="text-center">
                    <OperationCell trade={trade} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ResultBadge result={trade.result} />
                  </TableCell>
                  <TableCell
                    className={cn(
                      "whitespace-nowrap text-center font-medium",
                      pctTone(trade.result_percentage)
                    )}
                  >
                    {formatPercent(trade.result_percentage)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-center">
                    {formatAmount(trade.result_amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatRr(trade.result_rr)}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {trade.link && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={trade.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Otwórz link"
                              className={ACTION_BTN}
                            >
                              <ExternalLink size={15} />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>Otwórz link w nowej karcie</TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label="Edytuj"
                            onClick={() => openEdit(trade)}
                            className={ACTION_BTN}
                          >
                            <Pencil size={15} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Edytuj pozycję</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label="Usuń"
                            onClick={() => handleDelete(trade)}
                            className={cn(ACTION_BTN, "hover:text-red")}
                          >
                            <Trash2 size={15} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Usuń pozycję</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={expanded === trade.id ? "Zwiń" : "Rozwiń"}
                            aria-expanded={expanded === trade.id}
                            onClick={() => toggle(trade.id)}
                            className={ACTION_BTN}
                          >
                            {expanded === trade.id ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {expanded === trade.id
                            ? "Zwiń szczegóły"
                            : "Rozwiń szczegóły"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>

                {expanded === trade.id && (
                  <TableRow>
                    <TableCell colSpan={9} className="bg-surface-2/40">
                      <Details trade={trade} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      </TooltipProvider>

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((trade) => (
          <div
            key={trade.id}
            onClick={() => toggle(trade.id)}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-ink">{trade.instrument}</span>
              <ResultBadge result={trade.result} />
            </div>

            <p className="mt-1 text-xs text-muted">
              {trade.date} · {trade.interval} ·{" "}
              {OPERATION_LABELS[trade.operation]}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 text-sm">
              <span className={cn("font-medium", pctTone(trade.result_percentage))}>
                {formatPercent(trade.result_percentage)}
              </span>
              <span>{formatAmount(trade.result_amount)}</span>
              <span className="text-muted">RR {formatRr(trade.result_rr)}</span>
            </div>

            {expanded === trade.id && (
              <div
                className="mt-4 border-t border-border pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Details trade={trade} />
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(trade)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink"
                  >
                    <Pencil size={13} /> Edytuj
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(trade)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-red"
                  >
                    <Trash2 size={13} /> Usuń
                  </button>
                  <button
                    type="button"
                    onClick={() => openView(trade)}
                    className="ml-auto text-xs text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Podgląd
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
