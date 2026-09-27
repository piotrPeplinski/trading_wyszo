import React from "react";

import type { SaveState } from "@/hooks/usePlan";

type SaveIndicatorProps = {
  state: SaveState;
};

const LABELS: Record<SaveState, string> = {
  idle: "",
  saving: "Zapisywanie…",
  saved: "Zapisano",
};

/** There is no Save button, so this is the only signal that the work is safe. */
export const SaveIndicator = ({ state }: SaveIndicatorProps) => (
  <span aria-live="polite" className="text-xs text-muted">
    {LABELS[state]}
  </span>
);
