"use client";

import { useState, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

type VideoSliderProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  valueText: string;
  /** Loaded part of the track, same unit as `value`. */
  buffered?: number;
  /** Shows a tooltip over the hovered position (timeline only). */
  formatHover?: (value: number) => string;
  className?: string;
};

/**
 * A native range input stretched invisibly over a drawn track: keyboard,
 * screen readers and dragging come from the browser, the look from us.
 */
export const VideoSlider = ({
  value,
  max,
  onChange,
  label,
  valueText,
  buffered,
  formatHover,
  className,
}: VideoSliderProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const pct = (n: number) => `${max > 0 ? Math.min(100, (n / max) * 100) : 0}%`;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!formatHover || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHover(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * max);
  };

  return (
    <div
      className={cn(
        "group/slider relative flex h-5 cursor-pointer items-center rounded-full has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-green/70",
        className
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
    >
      <div className="relative h-[3px] w-full rounded-full bg-white/20 transition-[height] duration-200 group-hover/slider:h-[5px] group-has-[input:focus-visible]/slider:h-[5px]">
        {buffered !== undefined && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
            style={{ width: pct(buffered) }}
          />
        )}
        {hover !== null && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/25"
            style={{ width: pct(hover) }}
          />
        )}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-green"
          style={{ width: pct(value) }}
        />
        <div
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-green shadow-[0_1px_4px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover/slider:scale-100 group-has-[input:focus-visible]/slider:scale-100"
          style={{ left: pct(value) }}
        />
      </div>

      {hover !== null && formatHover && (
        <span
          className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 rounded-md bg-black/85 px-2 py-1 text-xs font-medium tabular-nums text-white"
          style={{ left: pct(hover) }}
        >
          {formatHover(hover)}
        </span>
      )}

      <input
        type="range"
        min={0}
        max={max || 0}
        step="any"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={valueText}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
};
