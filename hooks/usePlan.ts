"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useApi } from "@/hooks/useApi";
import type { PlanFields, PlanRule, TradingPlan } from "@/utils/plan/types";

export type SaveState = "idle" | "saving" | "saved";

const AUTOSAVE_MS = 800;
const SAVED_BADGE_MS = 2000;

/**
 * The trading plan, loaded once and written back on a debounce.
 *
 * Fields autosave 800 ms after the last keystroke; rules save immediately,
 * because adding or reordering one is a deliberate action rather than typing.
 */
export const usePlan = () => {
  const api = useApi();
  const [plan, setPlan] = useState<TradingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        // GET creates the plan on first visit, so this never 404s.
        const res = await api.get<TradingPlan>("/plan");
        if (!cancelled) setPlan(res.data);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear both timers on unmount, or a pending save fires into a dead component.
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (badgeTimer.current) clearTimeout(badgeTimer.current);
    },
    []
  );

  const flagSaved = useCallback(() => {
    setSaveState("saved");
    if (badgeTimer.current) clearTimeout(badgeTimer.current);
    badgeTimer.current = setTimeout(() => setSaveState("idle"), SAVED_BADGE_MS);
  }, []);

  /** Optimistic: the field keeps what the user typed, the PUT follows. */
  const setFields = useCallback(
    (fields: Partial<PlanFields>) => {
      setPlan((current) => {
        if (!current) return current;
        const next = { ...current, ...fields };

        if (saveTimer.current) clearTimeout(saveTimer.current);
        setSaveState("saving");
        saveTimer.current = setTimeout(async () => {
          try {
            await api.put<TradingPlan>("/plan", {
              instruments: next.instruments,
              intervals: next.intervals,
              session: next.session,
              risk_per_trade: next.risk_per_trade,
              notes: next.notes,
            });
            flagSaved();
          } catch {
            setSaveState("idle");
          }
        }, AUTOSAVE_MS);

        return next;
      });
    },
    [api, flagSaved]
  );

  const withRules = (rules: PlanRule[]) =>
    setPlan((current) => (current ? { ...current, rules } : current));

  const addRule = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      setSaveState("saving");
      try {
        const res = await api.post<PlanRule>("/plan/rules", { content: trimmed });
        setPlan((current) =>
          current ? { ...current, rules: [...current.rules, res.data] } : current
        );
        flagSaved();
      } catch {
        setSaveState("idle");
      }
    },
    [api, flagSaved]
  );

  const editRule = useCallback(
    async (id: number, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      setSaveState("saving");
      try {
        await api.patch<PlanRule>(`/plan/rules/${id}`, { content: trimmed });
        setPlan((current) =>
          current
            ? {
                ...current,
                rules: current.rules.map((r) =>
                  r.id === id ? { ...r, content: trimmed } : r
                ),
              }
            : current
        );
        flagSaved();
      } catch {
        setSaveState("idle");
      }
    },
    [api, flagSaved]
  );

  const removeRule = useCallback(
    async (id: number) => {
      setSaveState("saving");
      try {
        await api.delete(`/plan/rules/${id}`);
        setPlan((current) =>
          current
            ? { ...current, rules: current.rules.filter((r) => r.id !== id) }
            : current
        );
        flagSaved();
      } catch {
        setSaveState("idle");
      }
    },
    [api, flagSaved]
  );

  /** Swaps a rule with its neighbour: two PATCHes, one per exchanged position. */
  const moveRule = useCallback(
    async (id: number, direction: -1 | 1) => {
      const rules = plan?.rules;
      if (!rules) return;
      const index = rules.findIndex((r) => r.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= rules.length) return;

      const a = rules[index];
      const b = rules[target];
      const reordered = [...rules];
      reordered[index] = { ...b, position: a.position };
      reordered[target] = { ...a, position: b.position };
      withRules(reordered.sort((x, y) => x.position - y.position));

      setSaveState("saving");
      try {
        await api.patch(`/plan/rules/${a.id}`, { position: b.position });
        await api.patch(`/plan/rules/${b.id}`, { position: a.position });
        flagSaved();
      } catch {
        setSaveState("idle");
      }
    },
    [api, plan, flagSaved]
  );

  return {
    plan,
    loading,
    failed,
    saveState,
    setFields,
    addRule,
    editRule,
    removeRule,
    moveRule,
  };
};
