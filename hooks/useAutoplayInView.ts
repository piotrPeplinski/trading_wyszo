"use client";

import { useEffect, useState, type RefObject } from "react";

import { AUTOPLAY_THRESHOLD, PRELOAD_MARGIN } from "@/utils/video/constants";

type Options = {
  autoplay: () => void;
};

/**
 * `near` flips once the player is about to scroll in, so the file isn't fetched
 * on page load. Past the threshold it plays; scrolled away it pauses.
 * Reduced-motion users get the poster and a play button instead.
 */
export const useAutoplayInView = (
  videoRef: RefObject<HTMLVideoElement | null>,
  { autoplay }: Options
) => {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        nearObserver.disconnect();
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    nearObserver.observe(v);
    return () => nearObserver.disconnect();
  }, [videoRef]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !near) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduceMotion) autoplay();
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: AUTOPLAY_THRESHOLD }
    );
    viewObserver.observe(v);
    return () => viewObserver.disconnect();
  }, [videoRef, near, autoplay]);

  return near;
};
