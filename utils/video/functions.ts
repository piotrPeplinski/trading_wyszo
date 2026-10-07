export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** 47.5 → "0:47" */
export const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** End of the buffered range that contains `time` — what the scrubber shows as loaded. */
export const bufferedEnd = (video: HTMLVideoElement) => {
  const { buffered, currentTime } = video;
  for (let i = 0; i < buffered.length; i++) {
    if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) return buffered.end(i);
  }
  return buffered.length ? buffered.end(buffered.length - 1) : 0;
};
