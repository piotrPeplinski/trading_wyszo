"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollableMarqueeProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableMarquee({ children, className }: ScrollableMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let paused = false;
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let resumeTimeout: ReturnType<typeof setTimeout>;

    const pause = () => {
      paused = true;
      clearTimeout(resumeTimeout);
    };
    const scheduleResume = () => {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => (paused = false), 2000);
    };

    const onPointerDown = (e: PointerEvent) => {
      pause();
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startScrollLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      track.scrollLeft = startScrollLeft - (e.clientX - startX);
    };
    const onPointerUp = () => {
      dragging = false;
      scheduleResume();
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("touchend", scheduleResume);
    track.addEventListener("wheel", pause, { passive: true });
    track.addEventListener("wheel", scheduleResume, { passive: true });

    let raf: number;
    const step = () => {
      if (!paused) {
        const half = track.scrollWidth / 2;
        track.scrollLeft += 0.5;
        if (track.scrollLeft >= half) track.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimeout);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("touchend", scheduleResume);
      track.removeEventListener("wheel", pause);
      track.removeEventListener("wheel", scheduleResume);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className={cn(
        "flex w-full cursor-grab gap-6 overflow-x-auto active:cursor-grabbing",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="flex shrink-0 gap-6">{children}</div>
      <div aria-hidden className="flex shrink-0 gap-6">
        {children}
      </div>
    </div>
  );
}
