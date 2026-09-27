"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import type { Trade, TradePage } from "@/utils/trades/types";

/** The dashboard's "Ostatnie pozycje" card — newest first, capped server-side. */
export const useRecentTrades = (limit = 5) => {
  const api = useApi();
  const { savedAt } = useTradeDialog();
  const [items, setItems] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get<TradePage>(
          `/trades?sort=date&order=desc&limit=${limit}`
        );
        if (!cancelled) setItems(res.data.items);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, savedAt]);

  return { items, loading };
};
