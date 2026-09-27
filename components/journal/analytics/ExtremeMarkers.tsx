"use client";

import React from "react";

import { useChart } from "@/components/charts/context/chart-context";
import type { CurvePoint } from "@/utils/analytics/curve";
import { curveExtremes } from "@/utils/analytics/curve";
import { formatPercent } from "@/utils/trades/format";

type ExtremeMarkersProps = {
  points: CurvePoint[];
};

type LabelProps = {
  point: CurvePoint;
  x: number;
  y: number;
  preferAbove: boolean;
  innerWidth: number;
  innerHeight: number;
};

/**
 * Sign, not rank. The trough of an all-winning range is the 0% starting anchor,
 * and painting that red reads as a loss that never happened.
 */
const toneOf = (value: number) =>
  value > 0
    ? "var(--color-green-ink)"
    : value < 0
      ? "var(--color-red)"
      : "var(--color-ink)";

const GAP = 10;

const Label = ({
  point,
  x,
  y,
  preferAbove,
  innerWidth,
  innerHeight,
}: LabelProps) => {
  const color = toneOf(point.cumulative);
  // Flip the side whenever the preferred one would push the text out of the
  // plot — the trough of a losing range sits right on the bottom edge.
  const above = preferAbove ? y > 16 : y > innerHeight - 22;
  // Same for the horizontal ends, where a centred label overhangs the frame.
  const anchor = x < 28 ? "start" : x > innerWidth - 28 ? "end" : "middle";

  const text = formatPercent(point.cumulative);
  const dx = anchor === "start" ? -4 : anchor === "end" ? 4 : 0;
  const dy = above ? -GAP : GAP + 8;
  // Rough advance width for 11px tabular digits — good enough for a backing
  // chip, and cheaper than measuring text in the DOM on every hover frame.
  const w = text.length * 6.4 + 10;
  const chipX = anchor === "start" ? dx - 5 : anchor === "end" ? dx + 5 - w : dx - w / 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* The trough of a losing range lands next to the x-axis labels, so the
          value gets its own chip rather than merging into them. */}
      <rect
        fill="var(--chart-background)"
        height={15}
        opacity={0.9}
        rx={4}
        width={w}
        x={chipX}
        y={dy - 11}
      />
      <circle fill={color} r={3.5} stroke="var(--chart-background)" strokeWidth={2} />
      <text
        dy={dy}
        fill={color}
        fontSize={11}
        fontWeight={600}
        textAnchor={anchor}
        x={dx}
      >
        {text}
      </text>
    </g>
  );
};

/**
 * Peak and trough of the visible curve. Rendered after the interaction overlay
 * (see the `__isPostOverlay` flag below) so the tooltip's crosshair does not
 * paint over them.
 */
export const ExtremeMarkers = ({ points }: ExtremeMarkersProps) => {
  const { xScale, yScale, xDomain, innerWidth, innerHeight } = useChart();
  // Follow the zoom: the peak of the whole range is meaningless once the user
  // has zoomed into a corner of it.
  const visible = xDomain
    ? points.filter((p) => p.date >= xDomain[0] && p.date <= xDomain[1])
    : points;
  const extremes = curveExtremes(visible);
  if (!extremes) return null;

  const { peak, trough } = extremes;

  return (
    <g pointerEvents="none">
      <Label
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        point={peak}
        preferAbove
        x={xScale(peak.date)}
        y={yScale(peak.cumulative)}
      />
      <Label
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        point={trough}
        preferAbove={false}
        x={xScale(trough.date)}
        y={yScale(trough.cumulative)}
      />
    </g>
  );
};

ExtremeMarkers.__isPostOverlay = true;
