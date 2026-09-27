"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import type { PlanRule } from "@/utils/plan/types";

type PlanRuleRowProps = {
  rule: PlanRule;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (content: string) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
};

const ACTION =
  "rounded-md p-1 text-muted transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-muted";

export const PlanRuleRow = ({
  rule,
  index,
  isFirst,
  isLast,
  onEdit,
  onMove,
  onRemove,
}: PlanRuleRowProps) => {
  // Local draft so every keystroke doesn't fire a PATCH; committed on blur/Enter.
  const [draft, setDraft] = useState(rule.content);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(rule.content);
      return;
    }
    if (trimmed !== rule.content) onEdit(trimmed);
  };

  return (
    <li className="group flex items-center gap-2">
      <span className="w-5 shrink-0 text-right text-xs text-muted-2">
        {index + 1}.
      </span>

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(rule.content);
            e.currentTarget.blur();
          }
        }}
        className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition-colors hover:border-border focus:border-green/60"
      />

      <div className="flex shrink-0 items-center">
        {/* Arrows, not drag and drop: they work on touch and cost ten lines. */}
        <button
          type="button"
          aria-label="Przenieś wyżej"
          className={ACTION}
          disabled={isFirst}
          onClick={() => onMove(-1)}
        >
          <ChevronUp size={15} />
        </button>
        <button
          type="button"
          aria-label="Przenieś niżej"
          className={ACTION}
          disabled={isLast}
          onClick={() => onMove(1)}
        >
          <ChevronDown size={15} />
        </button>
        <button
          type="button"
          aria-label="Usuń zasadę"
          className={`${ACTION} hover:text-red`}
          onClick={onRemove}
        >
          <X size={15} />
        </button>
      </div>
    </li>
  );
};
