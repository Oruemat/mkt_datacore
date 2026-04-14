/**
 * Design system constants for visual quality.
 * All element components consume these to ensure consistent,
 * professional output across every composition.
 */

// ── Spacing Scale (px) ──────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  "6xl": 80,
} as const;

// ── Shadow Scale ────────────────────────────────────────

export const SHADOWS = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)",
  lg: "0 10px 40px -10px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)",
} as const;

// ── Border Radius Scale ─────────────────────────────────

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  pill: 9999,
} as const;

// ── Typography Scale ────────────────────────────────────

export const TYPE_SCALE = {
  badge: 12,
  caption: 14,
  bodySmall: 16,
  body: 18,
  bodyLarge: 20,
  subtitle: 24,
  subtitleLarge: 28,
  title: 36,
  titleLarge: 42,
  hero: 54,
  display: 64,
} as const;

// ── Animation Constants ─────────────────────────────────

export const SPRING_CONFIG = { damping: 14, stiffness: 120 } as const;
export const DEFAULT_STAGGER = 5; // frames between elements
export const DEFAULT_ENTER_DURATION = 15; // frames for enter animation

// ── Icon Presets ────────────────────────────────────────

export const ICON_MAP: Record<string, string> = {
  check: "✓",
  cross: "✗",
  bullet: "•",
  arrow: "→",
};
