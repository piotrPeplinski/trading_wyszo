"use client";

import { toast } from "react-toastify";

import { useApi } from "@/hooks/useApi";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import type { Trade } from "@/utils/trades/types";

/** Native confirm on purpose — a second dialog for one yes/no is not worth it. */
export const useDeleteTrade = () => {
  const api = useApi();
  const { notifySaved } = useTradeDialog();

  return async (trade: Trade) => {
    if (!confirm(`Usunąć pozycję ${trade.instrument} z ${trade.date}?`)) return;
    try {
      await api.delete(`/trades/${trade.id}`);
      notifySaved();
      toast.success(`Usunięto pozycję ${trade.instrument}.`);
    } catch {
      toast.error("Nie udało się usunąć pozycji.");
    }
  };
};
