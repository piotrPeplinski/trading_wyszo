"use client";

import { useCallback, useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import type { TradeStats } from "@/utils/analytics/types";

/**
 * One GET /trades/stats per range. Every metric on the page reads from this
 * single response — the endpoint already aggregates, so there is nothing to
 * gain from splitting it per card.
 */
export const useStats = (from: string | null, to: string | null) => {
  const api = useApi();
  const { savedAt } = useTradeDialog();
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        // Omit an unbounded side entirely: the backend reads a missing bound as
        // "no filter" (all time), while `date_from=` would fail its date parse
        // with a 422 rather than being treated as None.
        const params = new URLSearchParams();
        if (from) params.set("date_from", from);
        if (to) params.set("date_to", to);
        const query = params.toString();
        const res = await api.get<TradeStats>(
          `/trades/stats${query ? `?${query}` : ""}`
        );
        if (!cancelled) setStats(res.data);
      } catch {
        // A 401 is already handled by useApi's interceptor, which redirects.
        if (!cancelled) {
          setStats(null);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, savedAt, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { stats, loading, failed, retry };
};
