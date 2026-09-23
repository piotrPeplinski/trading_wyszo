"use client";

import { ChevronDown, ChevronUp, ExternalLink, Pencil, Trash2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ACTION_BUTTON } from "@/utils/trades/constants";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type TradeRowActionsProps = {
  trade: Trade;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const TradeRowActions = ({
  trade,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: TradeRowActionsProps) => (
  <div className="flex items-center justify-end gap-1">
    {trade.link && (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={trade.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Otwórz link"
            className={ACTION_BUTTON}
          >
            <ExternalLink size={15} />
          </a>
        </TooltipTrigger>
        <TooltipContent>Otwórz link w nowej karcie</TooltipContent>
      </Tooltip>
    )}

    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label="Edytuj" onClick={onEdit} className={ACTION_BUTTON}>
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
          onClick={onDelete}
          className={cn(ACTION_BUTTON, "hover:text-red")}
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
          aria-label={expanded ? "Zwiń" : "Rozwiń"}
          aria-expanded={expanded}
          onClick={onToggle}
          className={ACTION_BUTTON}
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </TooltipTrigger>
      <TooltipContent>{expanded ? "Zwiń szczegóły" : "Rozwiń szczegóły"}</TooltipContent>
    </Tooltip>
  </div>
);
