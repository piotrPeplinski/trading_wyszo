"use client";

import React, { useEffect, useRef } from "react";

import { Area } from "@/components/charts/area";
import { ChartTooltip } from "@/components/charts/tooltip";
import { Grid } from "@/components/charts/grid";
import { LineChart } from "@/components/charts/line-chart";
import { ProfitLossLine } from "@/components/charts/profit-loss-line";
import { XAxis } from "@/components/charts/x-axis";
import { YAxis } from "@/components/charts/y-axis";
import { ChartBrushStrip } from "@/components/journal/analytics/ChartBrushStrip";
import { ChartToolbar } from "@/components/journal/analytics/ChartToolbar";
import { ExtremeMarkers } from "@/components/journal/analytics/ExtremeMarkers";
import { YDomainAnchor } from "@/components/journal/analytics/YDomainAnchor";
import { Button } from "@/components/ui/Button";
import { useChartZoom } from "@/hooks/useChartZoom";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { axisTicksFor } from "@/utils/analytics/axis";
import { buildCurve } from "@/utils/analytics/curve";
import type { EquityPoint } from "@/utils/analytics/types";
import { formatFullDate } from "@/utils/calendar";
import { formatPercent } from "@/utils/trades/format";

type EquityCurveProps = {
  curve: EquityPoint[];
  from: string | null;
  to: string | null;
  /**
   * Zooming only earns its keep over a multi-year span. On a week or a month
   * the controls would promise a range that is not there, so they are hidden
   * outright rather than shown disabled.
   */
  zoomable: boolean;
};

const POSITIVE = "var(--color-green-ink)";
const NEGATIVE = "var(--color-red)";

export const EquityCurve = ({ curve, from, to, zoomable }: EquityCurveProps) => {
  const { openCreate } = useTradeDialog();
  const plotRef = useRef<HTMLDivElement>(null);

  const { points, domain } = buildCurve(curve, from, to);
  const zoom = useChartZoom(domain);

  // Ticks follow the *visible* span, so zooming a year down to a fortnight
  // switches the labels from months to days on its own.
  const visible = zoom.current ?? domain;
  const ticks = visible
    ? axisTicksFor(visible[0], visible[1])
    : axisTicksFor(new Date(), new Date());

  const { zoomByWheel } = zoom;
  useEffect(() => {
    const node = plotRef.current;
    if (!(node && domain && zoomable)) return;

    // Bound by hand rather than through onWheel: React registers wheel
    // listeners as passive, so preventDefault() there is ignored and the page
    // scrolls away underneath while the chart zooms.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomByWheel(e.deltaY);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [domain, zoomable, zoomByWheel]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!(zoomable && zoom.panning && zoom.current)) return;
    const box = plotRef.current?.getBoundingClientRect();
    if (!box) return;
    const span = zoom.current[1].getTime() - zoom.current[0].getTime();
    const originX = e.clientX;
    const origin = zoom.current;

    const move = (ev: PointerEvent) => {
      // Drag right => look further back in time.
      const shift = ((originX - ev.clientX) / box.width) * span;
      zoom.setWindow([
        new Date(origin[0].getTime() + shift),
        new Date(origin[1].getTime() + shift),
      ]);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">
          Krzywa kapitału
        </h2>
        {points.length >= 2 && zoomable && (
          <ChartToolbar
            onReset={zoom.reset}
            onTogglePanning={zoom.togglePanning}
            onZoomIn={zoom.zoomIn}
            onZoomOut={zoom.zoomOut}
            panning={zoom.panning}
            zoomed={zoom.zoomed}
          />
        )}
      </div>

      {points.length < 2 ? (
        <div className="flex h-80 flex-col items-center justify-center gap-4 text-center">
          <p className="max-w-sm text-sm text-muted">
            Dodaj co najmniej dwie pozycje, żeby zobaczyć krzywą kapitału.
          </p>
          <Button onClick={() => openCreate()}>Dodaj pozycję</Button>
        </div>
      ) : (
        <>
          <div
            className={
              zoomable && zoom.panning
                ? "cursor-grab active:cursor-grabbing"
                : undefined
            }
            onPointerDown={onPointerDown}
            ref={plotRef}
          >
            {/* Empty aspectRatio drops the 2:1 lock (far too short on a phone);
                the root then has no height of its own, so h-80 supplies it. */}
            <LineChart
              aspectRatio=""
              className="mt-4 h-80"
              data={points}
              tweenYDomainOnXDomainChange
              xDomain={zoom.window}
              xDomainSlotCount={points.length}
            >
              <Grid
                highlightRowStroke="var(--color-muted-2)"
                highlightRowStrokeDasharray="4,4"
                highlightRowValues={[0]}
                horizontal
              />
              <YDomainAnchor dataKey="cumulative" />
              {/* Fill only — the sign-coloured stroke goes on top. No permanent
                  markers: on a dense range they collapse into a ring of blobs.
                  The tooltip's own dot marks the point under the cursor. */}
              <Area
                dataKey="cumulative"
                fill={POSITIVE}
                fillOpacity={0.22}
                showLine={false}
              />
              <ProfitLossLine
                dataKey="cumulative"
                negativeColor={NEGATIVE}
                positiveColor={POSITIVE}
                strokeWidth={2.5}
              />
              <ExtremeMarkers points={points} />
              <YAxis formatValue={(v) => formatPercent(v)} />
              <XAxis
                numTicks={ticks.numTicks}
                tickFormat={ticks.format}
                tickMode="domain"
              />
              <ChartTooltip
                rows={(point) => [
                  {
                    color: POSITIVE,
                    label: "Skumulowany wynik",
                    value: formatPercent(point.cumulative as number),
                  },
                ]}
              />
            </LineChart>
          </div>

          {zoomable && domain && zoom.current && (
            <ChartBrushStrip
              full={domain}
              onChange={zoom.setWindow}
              points={points}
              window={zoom.current}
            />
          )}

          <p className="mt-2 text-center text-xs text-muted-2">
            {formatFullDate(zoom.current?.[0] ?? points[0].date)} —{" "}
            {formatFullDate(zoom.current?.[1] ?? points[points.length - 1].date)}
          </p>
        </>
      )}
    </section>
  );
};
