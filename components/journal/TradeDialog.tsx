"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { TradeForm } from "@/components/journal/TradeForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Trade } from "@/utils/trades";

type Mode = "create" | "edit" | "view";

type DialogState = {
  open: boolean;
  mode: Mode;
  trade?: Trade;
  defaultDate?: string;
};

type TradeDialogApi = {
  openCreate: (date?: string) => void;
  openView: (trade: Trade) => void;
  openEdit: (trade: Trade) => void;
  close: () => void;
  /** Bumps after every successful save or delete — lists watch it to refetch. */
  savedAt: number;
  notifySaved: () => void;
};

const TradeDialogContext = createContext<TradeDialogApi | null>(null);

const TITLES: Record<Mode, string> = {
  create: "Nowa pozycja",
  edit: "Edycja pozycji",
  view: "Pozycja",
};

export function TradeDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<DialogState>({
    open: false,
    mode: "create",
  });
  const [savedAt, setSavedAt] = useState(0);

  const notifySaved = useCallback(() => setSavedAt(Date.now()), []);
  const close = useCallback(
    () => setState((s) => ({ ...s, open: false })),
    []
  );

  const api = useMemo<TradeDialogApi>(
    () => ({
      openCreate: (date) =>
        setState({ open: true, mode: "create", defaultDate: date }),
      openView: (trade) => setState({ open: true, mode: "view", trade }),
      openEdit: (trade) => setState({ open: true, mode: "edit", trade }),
      close,
      savedAt,
      notifySaved,
    }),
    [close, savedAt, notifySaved]
  );

  const readOnly = state.mode === "view";

  return (
    <TradeDialogContext.Provider value={api}>
      {children}

      <Dialog
        open={state.open}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 border-b border-border bg-bg px-6 py-4">
            <div className="flex items-center gap-2">
              <DialogTitle className="font-display text-xl font-bold text-ink">
                {TITLES[state.mode]}
              </DialogTitle>
              {readOnly && state.trade && (
                <button
                  type="button"
                  aria-label="Edytuj pozycję"
                  onClick={() => setState((s) => ({ ...s, mode: "edit" }))}
                  className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
            <DialogDescription className="sr-only">
              Formularz pozycji tradingowej
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5">
            {/* key remounts the form so switching trade/mode resets its state */}
            <TradeForm
              key={`${state.mode}-${state.trade?.id ?? "new"}-${state.defaultDate ?? ""}`}
              trade={state.trade}
              defaultDate={state.defaultDate}
              readOnly={readOnly}
              onSaved={() => {
                notifySaved();
                close();
              }}
              onCancel={close}
            />
          </div>
        </DialogContent>
      </Dialog>
    </TradeDialogContext.Provider>
  );
}

export function useTradeDialog() {
  const ctx = useContext(TradeDialogContext);
  if (!ctx)
    throw new Error("useTradeDialog must be used inside <TradeDialogProvider>");
  return ctx;
}
