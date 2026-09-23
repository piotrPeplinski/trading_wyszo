"use client";

import { Fragment } from "react";

import { OperationCell } from "@/components/journal/trades/OperationCell";
import { ResultBadge } from "@/components/reusable/ResultBadge";
import { TradeDetails } from "@/components/journal/trades/TradeDetails";
import { TradeRowActions } from "@/components/journal/trades/TradeRowActions";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  formatAmount,
  formatPercent,
  formatRr,
  percentTone,
} from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type TradeRowProps = {
  trade: Trade;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const TradeRow = ({
  trade,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: TradeRowProps) => (
  <Fragment>
    <TableRow onClick={onToggle} className="cursor-pointer">
      <TableCell className="whitespace-nowrap">{trade.date}</TableCell>
      <TableCell className="font-medium text-ink">{trade.instrument}</TableCell>
      <TableCell className="text-center text-muted">{trade.interval}</TableCell>
      <TableCell className="text-center">
        <OperationCell operation={trade.operation} />
      </TableCell>
      <TableCell className="text-center">
        <ResultBadge result={trade.result} />
      </TableCell>
      <TableCell
        className={cn(
          "whitespace-nowrap text-center font-medium",
          percentTone(trade.result_percentage)
        )}
      >
        {formatPercent(trade.result_percentage)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center">
        {formatAmount(trade.result_amount)}
      </TableCell>
      <TableCell className="text-center">{formatRr(trade.result_rr)}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <TradeRowActions
          trade={trade}
          expanded={expanded}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>

    {expanded && (
      <TableRow>
        <TableCell colSpan={9} className="bg-surface-2/40">
          <TradeDetails trade={trade} />
        </TableCell>
      </TableRow>
    )}
  </Fragment>
);
