export type SkipSide = "back" | "forward";

export type SkipFeedback = {
  side: SkipSide;
  seconds: number;
  /** Bumped on every skip so a repeated tap replays the animation. */
  key: number;
};

export type VideoSources = {
  desktop: string;
  mobile: string;
};
