"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { useApi } from "@/hooks/useApi";
import type { TradingPlan } from "@/utils/plan/types";

const STORAGE_KEY = "plan-bar-open";

/**
 * The user's own rules, folded above the trade form.
 *
 * This is the point of the whole plan tab: the rules have to be in front of you
 * while you log the position, not in a page nobody reopens. Collapsed by
 * default so it never gets in the way of fast entry.
 */
export const PlanRulesBar = () => {
  const api = useApi();
  const [plan, setPlan] = useState<TradingPlan | null>(null);
  // Read once at mount, not in an effect: the bar only ever mounts inside an
  // already-open dialog, so there is no server render to disagree with.
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private mode or blocked storage: collapsed is a fine default.
      return false;
    }
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await api.get<TradingPlan>("/plan");
        if (!cancelled) setPlan(res.data);
      } catch {
        // A plan that won't load must never block logging a trade.
        if (!cancelled) setPlan(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Not worth failing the interaction over.
    }
  };

  const rules = plan?.rules ?? [];
  // No rules means nothing to remind anyone of — render nothing at all.
  if (rules.length === 0) return null;

  return (
    <details
      open={open}
      onToggle={(e) => toggle(e.currentTarget.open)}
      className="mb-5 rounded-xl border border-border bg-surface-2"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
        <ChevronRight
          size={14}
          className="shrink-0 transition-transform group-open:rotate-90 [details[open]_&]:rotate-90"
        />
        Twój plan ({rules.length}{" "}
        {rules.length === 1 ? "zasada" : rules.length < 5 ? "zasady" : "zasad"})
      </summary>

      <ul className="flex list-disc flex-col gap-1.5 px-4 pb-4 pl-9 text-sm text-muted">
        {rules.map((rule) => (
          <li key={rule.id}>{rule.content}</li>
        ))}
      </ul>
    </details>
  );
};
