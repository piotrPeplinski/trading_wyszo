"use client";

import React from "react";

import { PlanForm } from "@/components/journal/plan/PlanForm";
import { SaveIndicator } from "@/components/journal/plan/SaveIndicator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlan } from "@/hooks/usePlan";

const PlanPage = () => {
  const {
    plan,
    loading,
    failed,
    saveState,
    setFields,
    addRule,
    editRule,
    moveRule,
    removeRule,
  } = usePlan();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">
          Plan tradingowy
        </h1>
        <SaveIndicator state={saveState} />
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[172px] rounded-2xl" />
          <Skeleton className="h-[172px] rounded-2xl" />
          <Skeleton className="h-[264px] rounded-2xl" />
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
      )}

      {!loading && failed && (
        <p className="rounded-2xl border border-border bg-surface px-4 py-12 text-center text-sm text-muted">
          Nie udało się wczytać planu.
        </p>
      )}

      {!loading && !failed && plan && (
        <PlanForm
          plan={plan}
          setFields={setFields}
          addRule={addRule}
          editRule={editRule}
          moveRule={moveRule}
          removeRule={removeRule}
        />
      )}
    </div>
  );
};

export default PlanPage;
