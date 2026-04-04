import { DC_BRAND } from "./brand";

const C = DC_BRAND.colors;

export const PALETTES = {
  light: {
    bg: C.white,
    surface: C.gray50,
    text: C.gray900,
    textMuted: C.gray600,
    accent: C.blue600,
    accentAlt: C.orange500,
  },
  dark: {
    bg: C.navy,
    surface: C.navyLight,
    text: C.white,
    textMuted: C.gray400,
    accent: C.blue600,
    accentAlt: C.orange500,
  },
} as const;

export type PaletteKey = keyof typeof PALETTES;
export type Palette = (typeof PALETTES)[PaletteKey];

export const GRADIENTS = {
  hero: DC_BRAND.gradients.hero,
  primaryBtn: DC_BRAND.gradients.primaryBtn,
  successBtn: DC_BRAND.gradients.successBtn,
  warmBtn: DC_BRAND.gradients.warmBtn,
  lightSection: DC_BRAND.gradients.lightSection,
  dark: DC_BRAND.gradients.dark,
} as const;

export type GradientKey = keyof typeof GRADIENTS;
