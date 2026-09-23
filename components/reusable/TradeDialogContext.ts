"use client";

import { createContext } from "react";

import type { Trade } from "@/utils/trades/types";

export type TradeDialogMode = "create" | "edit" | "view";

export type TradeDialogApi = {
  openCreate: (date?: string) => void;
  openView: (trade: Trade) => void;
  openEdit: (trade: Trade) => void;
  close: () => void;
  /** Bumps after every successful save or delete — lists watch it to refetch. */
  savedAt: number;
  notifySaved: () => void;
};

export const TradeDialogContext = createContext<TradeDialogApi | null>(null);
