"use client";

import { useCallback, useState } from "react";

const DAY_MS = 86_400_000;
const MIN_SPAN_MS = DAY_MS; // a single day is as far in as zooming goes
const STEP = 0.6; // one ⊕ press keeps 60% of the visible span
// A wheel notch is ~100 deltaY, a trackpad nudge far less. Scaling the factor
// by the delta keeps a light flick light; a fixed STEP made the tiniest swipe
// jump several zoom levels.
const WHEEL_SENSITIVITY = 0.0008;
const WHEEL_MIN = 0.8;
const WHEEL_MAX = 1.25;

type Window = [Date, Date];

const signature = (domain: Window | null) =>
  domain ? `${domain[0].getTime()}-${domain[1].getTime()}` : "";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const clampWindow = (win: Window, full: Window): Window => {
  const fullFrom = full[0].getTime();
  const fullTo = full[1].getTime();
  const span = Math.min(
    Math.max(win[1].getTime() - win[0].getTime(), MIN_SPAN_MS),
    fullTo - fullFrom
  );
  // Slide back inside the full extent instead of shrinking: panning past the
  // edge should stop, not squeeze the window.
  const from = Math.min(Math.max(win[0].getTime(), fullFrom), fullTo - span);
  return [new Date(from), new Date(from + span)];
};

/**
 * One visible window shared by the toolbar, the brush strip and the wheel.
 * `null` means "the whole range" — the chart then gets no xDomain at all.
 *
 * The window resets when the selected range changes. That is derived during
 * render from a signature rather than an effect, so switching range never
 * paints one frame of the old window against the new data.
 */
export const useChartZoom = (full: Window | null) => {
  const sig = signature(full);
  const [state, setState] = useState<{ sig: string; win: Window | null }>({
    sig,
    win: null,
  });
  const [panning, setPanning] = useState(false);

  const win = state.sig === sig ? state.win : null;

  const set = useCallback(
    (next: Window | null) => setState({ sig, win: next }),
    [sig]
  );

  const current: Window | null = win ?? full;

  const scale = useCallback(
    (factor: number) => {
      if (!(current && full)) return;
      const span = current[1].getTime() - current[0].getTime();
      const centre = current[0].getTime() + span / 2;
      const next = span * factor;
      set(
        clampWindow(
          [new Date(centre - next / 2), new Date(centre + next / 2)],
          full
        )
      );
    },
    [current, full, set]
  );

  const zoomIn = useCallback(() => scale(STEP), [scale]);
  const zoomOut = useCallback(() => scale(1 / STEP), [scale]);

  const zoomByWheel = useCallback(
    (deltaY: number) =>
      scale(
        clamp(Math.exp(deltaY * WHEEL_SENSITIVITY), WHEEL_MIN, WHEEL_MAX)
      ),
    [scale]
  );
  const reset = useCallback(() => {
    set(null);
    setPanning(false);
  }, [set]);

  const panBy = useCallback(
    (deltaMs: number) => {
      if (!(current && full)) return;
      set(
        clampWindow(
          [
            new Date(current[0].getTime() + deltaMs),
            new Date(current[1].getTime() + deltaMs),
          ],
          full
        )
      );
    },
    [current, full, set]
  );

  const setWindow = useCallback(
    (next: Window) => full && set(clampWindow(next, full)),
    [full, set]
  );

  const zoomed =
    win !== null &&
    full !== null &&
    win[1].getTime() - win[0].getTime() < full[1].getTime() - full[0].getTime();

  return {
    /** What to hand LineChart as xDomain — undefined while unzoomed. */
    window: win ?? undefined,
    /** Always resolved; the brush strip needs it to draw the selection. */
    current,
    zoomed,
    panning,
    togglePanning: () => setPanning((p) => !p),
    zoomIn,
    zoomOut,
    zoomByWheel,
    reset,
    panBy,
    setWindow,
  };
};
