export const PLATFORMS = {
  instagram_post: { width: 1080, height: 1080, fps: 30, name: "Instagram Post" },
  instagram_reel: { width: 1080, height: 1920, fps: 30, name: "Instagram Reel" },
  instagram_story: { width: 1080, height: 1920, fps: 30, name: "Instagram Story" },
  linkedin: { width: 1920, height: 1080, fps: 30, name: "LinkedIn" },
  tiktok: { width: 1080, height: 1920, fps: 30, name: "TikTok" },
  youtube: { width: 1920, height: 1080, fps: 30, name: "YouTube" },
  twitter: { width: 1080, height: 1080, fps: 30, name: "Twitter/X" },
  facebook: { width: 1080, height: 1080, fps: 30, name: "Facebook" },
} as const;

export type PlatformKey = keyof typeof PLATFORMS;

export const secondsToFrames = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

export const framesToSeconds = (frames: number, fps: number): number =>
  frames / fps;
