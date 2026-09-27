"use client";

import React from "react";

import { ChipsInput } from "@/components/journal/plan/ChipsInput";
import { PlanCard } from "@/components/journal/plan/PlanCard";
import { RulesList } from "@/components/journal/plan/RulesList";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { usePlan } from "@/hooks/usePlan";
import type { TradingPlan } from "@/utils/plan/types";

type PlanFormProps = {
  plan: TradingPlan;
} & Pick<
  ReturnType<typeof usePlan>,
  "setFields" | "addRule" | "editRule" | "moveRule" | "removeRule"
>;

const LABEL = "text-xs text-muted";

export const PlanForm = ({
  plan,
  setFields,
  addRule,
  editRule,
  moveRule,
  removeRule,
}: PlanFormProps) => (
  <div className="flex flex-col gap-4">
    <PlanCard title="Instrumenty i interwały">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="plan-instruments">
            Instrumenty
          </label>
          <ChipsInput
            id="plan-instruments"
            placeholder="EURUSD, wciśnij Enter…"
            value={plan.instruments}
            onChange={(instruments) => setFields({ instruments })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="plan-intervals">
            Interwały
          </label>
          <ChipsInput
            id="plan-intervals"
            placeholder="M15, wciśnij Enter…"
            value={plan.intervals}
            onChange={(intervals) => setFields({ intervals })}
          />
        </div>
      </div>
    </PlanCard>

    <PlanCard title="Sesja i ryzyko">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="plan-session">
            Sesja
          </label>
          <Input
            id="plan-session"
            placeholder="Londyn, Nowy Jork…"
            value={plan.session ?? ""}
            onChange={(e) => setFields({ session: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="plan-risk">
            Ryzyko na pozycję
          </label>
          {/* Free text on purpose: "1%", "50$" and "1R" are all real answers. */}
          <Input
            id="plan-risk"
            placeholder="1%, 50$, 1R…"
            value={plan.risk_per_trade ?? ""}
            onChange={(e) => setFields({ risk_per_trade: e.target.value })}
          />
        </div>
      </div>
    </PlanCard>

    <PlanCard title="Notatki">
      <Textarea
        className="min-h-[160px]"
        placeholder="Założenia, setupy, czego unikasz…"
        value={plan.notes ?? ""}
        onChange={(e) => setFields({ notes: e.target.value })}
      />
    </PlanCard>

    <PlanCard title="Zasady">
      <RulesList
        rules={plan.rules}
        onAdd={addRule}
        onEdit={editRule}
        onMove={moveRule}
        onRemove={removeRule}
      />
    </PlanCard>
  </div>
);
