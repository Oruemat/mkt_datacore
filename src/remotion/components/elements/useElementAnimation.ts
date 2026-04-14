import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ElementAnimation } from "../../types/composition";
import { SPRING_CONFIG, DEFAULT_STAGGER, DEFAULT_ENTER_DURATION } from "../../presets/spacing";

interface AnimationResult {
  opacity: number;
  transform: string;
  filter: string;
}

const DONE: AnimationResult = { opacity: 1, transform: "none", filter: "none" };

/**
 * Shared animation hook for composition elements.
 * Each element gets its own enter animation with configurable delay.
 * If no explicit delay, auto-staggers based on element index.
 */
export function useElementAnimation(
  animation: ElementAnimation | undefined,
  index: number,
): AnimationResult {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!animation?.enter) return DONE;

  const delay = animation.delay ?? index * DEFAULT_STAGGER;
  const duration = animation.duration ?? DEFAULT_ENTER_DURATION;
  const f = Math.max(frame - delay, 0);

  if (f >= duration) return DONE;

  const progress = spring({ fps, frame: f, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, duration * 0.6], [0, 1], { extrapolateRight: "clamp" });

  switch (animation.enter) {
    case "slideUp":
      return { opacity, transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`, filter: "none" };
    case "slideDown":
      return { opacity, transform: `translateY(${interpolate(progress, [0, 1], [-40, 0])}px)`, filter: "none" };
    case "slideLeft":
      return { opacity, transform: `translateX(${interpolate(progress, [0, 1], [60, 0])}px)`, filter: "none" };
    case "slideRight":
      return { opacity, transform: `translateX(${interpolate(progress, [0, 1], [-60, 0])}px)`, filter: "none" };
    case "scale":
      return { opacity, transform: `scale(${interpolate(progress, [0, 1], [0.7, 1])})`, filter: "none" };
    case "blur": {
      const blur = interpolate(f, [0, duration], [16, 0], { extrapolateRight: "clamp" });
      return { opacity, transform: "none", filter: `blur(${blur}px)` };
    }
    case "fade":
    default:
      return { opacity, transform: "none", filter: "none" };
  }
}
