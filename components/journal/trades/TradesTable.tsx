"use client";

import { useState } from "react";

import { TradeCard } from "@/components/journal/trades/TradeCard";
import { TradeRow } from "@/components/journal/trades/TradeRow";
import { TradesTableHead } from "@/components/journal/trades/TradesTableHead";
import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDeleteTrade } from "@/hooks/useDeleteTrade";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import type { SortKey, SortOrder, Trade } from "@/utils/trades/types";

type TradesTableProps = {
  items: Trade[];
  sort: SortKey;
  order: SortOrder;
  onSortChange: (sort: SortKey, order: SortOrder) => void;
};

export const TradesTable = ({
  items,
  sort,
  order,
  onSortChange,
}: TradesTableProps) => {
  const { openEdit, openView } = useTradeDialog();
  const deleteTrade = useDeleteTrade();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => setExpanded((e) => (e === id ? null : id));

  return (
    <>
      <TooltipProvider>
        <div className="hidden overflow-clip rounded-2xl border border-border bg-surface md:block">
          <Table>
            <TradesTableHead sort={sort} order={order} onSortChange={onSortChange} />
            <TableBody>
              {items.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  expanded={expanded === trade.id}
                  onToggle={() => toggle(trade.id)}
                  onEdit={() => openEdit(trade)}
                  onDelete={() => deleteTrade(trade)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      <div className="flex flex-col gap-3 md:hidden">
        {items.map((trade) => (
          <TradeCard
            key={trade.id}
            trade={trade}
            expanded={expanded === trade.id}
            onToggle={() => toggle(trade.id)}
            onEdit={() => openEdit(trade)}
            onDelete={() => deleteTrade(trade)}
            onView={() => openView(trade)}
          />
        ))}
      </div>
    </>
  );
};
