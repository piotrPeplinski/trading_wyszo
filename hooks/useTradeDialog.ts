"use client";

import { useContext } from "react";

import { TradeDialogContext } from "@/components/reusable/TradeDialogContext";

export const useTradeDialog = () => {
  const ctx = useContext(TradeDialogContext);
  if (!ctx)
    throw new Error("useTradeDialog must be used inside <TradeDialogProvider>");
  return ctx;
};
