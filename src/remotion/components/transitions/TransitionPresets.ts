import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { none } from "@remotion/transitions/none";
import { springTiming, linearTiming } from "@remotion/transitions";

export const TRANSITION_PRESETS = {
  crossfade: {
    presentation: fade(),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: 30 }),
  },
  fadeQuick: {
    presentation: fade(),
    timing: linearTiming({ durationInFrames: 15 }),
  },
  fadeSlow: {
    presentation: fade(),
    timing: linearTiming({ durationInFrames: 45 }),
  },
  slideLeft: {
    presentation: slide({ direction: "from-left" }),
    timing: springTiming({ config: { damping: 14, stiffness: 100 }, durationInFrames: 30 }),
  },
  slideRight: {
    presentation: slide({ direction: "from-right" }),
    timing: springTiming({ config: { damping: 14, stiffness: 100 }, durationInFrames: 30 }),
  },
  slideUp: {
    presentation: slide({ direction: "from-top" }),
    timing: springTiming({ config: { damping: 14, stiffness: 100 }, durationInFrames: 30 }),
  },
  wipeLeft: {
    presentation: wipe({ direction: "from-left" }),
    timing: linearTiming({ durationInFrames: 30 }),
  },
  cut: {
    presentation: none(),
    timing: linearTiming({ durationInFrames: 0 }),
  },
} as const;

export type TransitionPresetKey = keyof typeof TRANSITION_PRESETS;
