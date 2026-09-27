"use client";

import React, { useState } from "react";

import { PlanRuleRow } from "@/components/journal/plan/PlanRuleRow";
import { Input } from "@/components/ui/input";
import type { PlanRule } from "@/utils/plan/types";

type RulesListProps = {
  rules: PlanRule[];
  onAdd: (content: string) => void;
  onEdit: (id: number, content: string) => void;
  onMove: (id: number, direction: -1 | 1) => void;
  onRemove: (id: number) => void;
};

/**
 * A numbered list, deliberately not a checklist: no checkboxes, no strikethrough,
 * no completion state. These are standing rules, not today's tasks.
 */
export const RulesList = ({
  rules,
  onAdd,
  onEdit,
  onMove,
  onRemove,
}: RulesListProps) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      {rules.length === 0 ? (
        <p className="text-sm text-muted">
          Nie masz jeszcze żadnych zasad. Pierwsza pojawi się poniżej.
        </p>
      ) : (
        <ol className="flex flex-col gap-1">
          {rules.map((rule, index) => (
            <PlanRuleRow
              key={rule.id}
              rule={rule}
              index={index}
              isFirst={index === 0}
              isLast={index === rules.length - 1}
              onEdit={(content) => onEdit(rule.id, content)}
              onMove={(direction) => onMove(rule.id, direction)}
              onRemove={() => onRemove(rule.id)}
            />
          ))}
        </ol>
      )}

      <Input
        value={draft}
        placeholder="Dodaj zasadę…"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
    </div>
  );
};
