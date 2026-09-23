"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TRADE_COLUMNS } from "@/utils/trades/constants";
import type { SortKey, SortOrder } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type TradesTableHeadProps = {
  sort: SortKey;
  order: SortOrder;
  onSortChange: (sort: SortKey, order: SortOrder) => void;
};

export const TradesTableHead = ({
  sort,
  order,
  onSortChange,
}: TradesTableHeadProps) => {
  // Sorting is a server round-trip (sort/order query params), never a JS sort —
  // the list is paginated, so reordering locally would only reorder page one.
  const handleSort = (key: SortKey) =>
    onSortChange(key, sort === key && order === "desc" ? "asc" : "desc");

  return (
    <TableHeader
      // Two layers per cell: a square ::before in the page colour, then the
      // rounded surface on top. Without the backdrop the corner notches show
      // the row scrolling underneath and the radius reads as a sharp corner.
      // It has to sit on the cells — browsers skip backgrounds on a sticky
      // <thead>/<tr>.
      className="sticky top-[88px] z-20 [&_th:first-child]:rounded-tl-2xl [&_th:last-child]:rounded-tr-2xl [&_th]:relative [&_th]:border-b [&_th]:bg-surface-2 [&_th]:before:absolute [&_th]:before:inset-0 [&_th]:before:-z-10 [&_th]:before:bg-bg [&_th]:before:content-['']"
    >
      <TableRow className="hover:bg-transparent">
        {TRADE_COLUMNS.map((col) => {
          const inner = col.key ? (
            <button
              type="button"
              onClick={() => handleSort(col.key!)}
              className="inline-flex items-center gap-1 transition-colors hover:text-ink"
            >
              {col.label}
              {sort === col.key &&
                (order === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          ) : (
            <span>{col.label}</span>
          );

          return (
            <TableHead key={col.label} className={cn(col.center && "text-center")}>
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
  );
};
