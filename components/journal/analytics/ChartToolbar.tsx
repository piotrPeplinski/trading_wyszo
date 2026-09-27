"use client";

import React from "react";
import { Hand, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";

type ChartToolbarProps = {
  panning: boolean;
  zoomed: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTogglePanning: () => void;
  onReset: () => void;
};

const BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-ink disabled:opacity-40 disabled:hover:text-muted";

export const ChartToolbar = ({
  panning,
  zoomed,
  onZoomIn,
  onZoomOut,
  onTogglePanning,
  onReset,
}: ChartToolbarProps) => (
  <div className="flex items-center gap-1">
    <button type="button" aria-label="Przybliż"
      title="Przybliż" className={BUTTON} onClick={onZoomIn}>
      <ZoomIn size={15} />
    </button>

    <button
      type="button"
      aria-label="Oddal"
      title="Oddal"
      className={BUTTON}
      disabled={!zoomed}
      onClick={onZoomOut}
    >
      <ZoomOut size={15} />
    </button>

    {/* A mode, not a gesture: the chart's own mouse handlers drive the tooltip,
        so dragging to pan and hovering to inspect cannot both be on at once. */}
    {/* Panning a window that already spans everything moves nothing, so the
        button stays off until there is something to pan within. */}
    <button
      type="button"
      aria-label="Tryb przesuwania"
      title={
        zoomed
          ? "Tryb przesuwania — przeciągnij wykres"
          : "Najpierw przybliż, żeby móc przesuwać"
      }
      aria-pressed={panning}
      className={cn(BUTTON, panning && "border-green bg-green-soft text-green-ink")}
      disabled={!zoomed}
      onClick={onTogglePanning}
    >
      <Hand size={15} />
    </button>

    <button
      type="button"
      aria-label="Pełny zakres"
      title="Pełny zakres"
      className={BUTTON}
      disabled={!zoomed && !panning}
      onClick={onReset}
    >
      <RotateCcw size={15} />
    </button>
  </div>
);
