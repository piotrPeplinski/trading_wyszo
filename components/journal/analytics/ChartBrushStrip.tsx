"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import type { CurvePoint } from "@/utils/analytics/curve";

type Drag = { mode: "from" | "to" | "move"; originX: number; win: [Date, Date] };

type ChartBrushStripProps = {
  points: CurvePoint[];
  /** The whole range — the strip always draws this, never the zoomed window. */
  full: [Date, Date];
  /** The visible window, drawn as the selection. */
  window: [Date, Date];
  onChange: (next: [Date, Date]) => void;
};

const HEIGHT = 56;
const MIN_FRACTION = 0.02;

/**
 * Bklit documents ChartBrush but does not ship it — @bklit/brush is a 404 and
 * the registry only carries the host-side xDomain plumbing. So the strip is
 * ours: an SVG sparkline of the full range with a draggable selection that
 * reports back an xDomain.
 */
export const ChartBrushStrip = ({
  points,
  full,
  window: win,
  onChange,
}: ChartBrushStripProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

  const fromMs = full[0].getTime();
  const toMs = full[1].getTime();
  const spanMs = Math.max(1, toMs - fromMs);

  const ratio = (d: Date) => (d.getTime() - fromMs) / spanMs;
  const left = ratio(win[0]);
  const right = ratio(win[1]);

  // The sparkline, in a 0..100 x 0..100 viewBox so it stretches with the card.
  const values = points.map((p) => p.cumulative);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const height = Math.max(1, max - min);
  const path = points
    .map((p, i) => {
      const x = ratio(p.date) * 100;
      const y = 100 - ((p.cumulative - min) / height) * 100;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const apply = useCallback(
    (mode: Drag["mode"], deltaFraction: number, base: [Date, Date]) => {
      const baseFrom = (base[0].getTime() - fromMs) / spanMs;
      const baseTo = (base[1].getTime() - fromMs) / spanMs;
      let a = baseFrom;
      let b = baseTo;

      if (mode === "move") {
        const width = baseTo - baseFrom;
        a = Math.min(Math.max(baseFrom + deltaFraction, 0), 1 - width);
        b = a + width;
      } else if (mode === "from") {
        a = Math.min(Math.max(baseFrom + deltaFraction, 0), baseTo - MIN_FRACTION);
      } else {
        b = Math.max(Math.min(baseTo + deltaFraction, 1), baseFrom + MIN_FRACTION);
      }

      onChange([new Date(fromMs + a * spanMs), new Date(fromMs + b * spanMs)]);
    },
    [fromMs, spanMs, onChange]
  );

  useEffect(() => {
    if (!drag) return;

    const move = (e: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      apply(drag.mode, (e.clientX - drag.originX) / box.width, drag.win);
    };
    const up = () => setDrag(null);

    // On window, not the element: the pointer routinely leaves the 56px strip
    // mid-drag and the gesture has to keep tracking.
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, apply]);

  const start = (mode: Drag["mode"]) => (e: React.PointerEvent) => {
    e.preventDefault();
    setDrag({ mode, originX: e.clientX, win: win });
  };

  const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

  return (
    <div
      ref={ref}
      className="relative mt-3 select-none overflow-hidden rounded-xl border border-border bg-surface-2"
      style={{ height: HEIGHT }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--color-muted-2)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Everything outside the selection is dimmed, so the window reads as a
          cut-out rather than as another box drawn on top. */}
      <div
        className="absolute inset-y-0 left-0 bg-bg/60"
        style={{ width: pct(left) }}
      />
      <div
        className="absolute inset-y-0 right-0 bg-bg/60"
        style={{ width: pct(1 - right) }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 cursor-grab border-x-2 border-green active:cursor-grabbing"
        onPointerDown={start("move")}
        style={{ left: pct(left), width: pct(right - left) }}
      />

      {(["from", "to"] as const).map((side) => (
        // aria-hidden on purpose: these are drag affordances with no keyboard
        // behaviour, and a role="slider" without arrow-key support would lie.
        // The same zooming is reachable from ChartToolbar's buttons.
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-4 cursor-ew-resize touch-none"
          key={side}
          onPointerDown={start(side)}
          style={{
            left: `calc(${pct(side === "from" ? left : right)} - 8px)`,
          }}
        >
          <span className="absolute inset-y-2 left-1/2 w-1 -translate-x-1/2 rounded-full bg-green" />
        </div>
      ))}
    </div>
  );
};
