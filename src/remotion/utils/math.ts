import { interpolate, spring } from "remotion";

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const fadeIn = (frame: number, startFrame: number, duration: number): number =>
  interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const fadeOut = (frame: number, startFrame: number, duration: number): number =>
  interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const slideIn = (
  frame: number,
  startFrame: number,
  duration: number,
  distance: number,
  fps: number,
): number => {
  const progress = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 12, stiffness: 100 },
  });
  return interpolate(progress, [0, 1], [distance, 0]);
};

export const enterHoldExit = (
  frame: number,
  enterDuration: number,
  holdDuration: number,
  exitDuration: number,
): number => {
  const exitStart = enterDuration + holdDuration;
  if (frame < enterDuration) {
    return interpolate(frame, [0, enterDuration], [0, 1], { extrapolateRight: "clamp" });
  }
  if (frame < exitStart) {
    return 1;
  }
  return interpolate(frame, [exitStart, exitStart + exitDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
