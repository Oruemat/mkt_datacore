/**
 * DataCore Composition System — Block-based visual composition types.
 *
 * Instead of rigid templates, the AI agent outputs a DCComposition:
 * background + layout + ordered list of elements.
 * The CompositionRenderer maps each element to a React component.
 */

// Re-export legacy types for backwards compat
export type { DCTemplate, DCStyleOverrides, DCPostVisualProps } from "../compositions/DCPostVisual";

// ── Rich Text ───────────────────────────────────────────

export interface TextSegment {
  text: string;
  color?: string;
  fontWeight?: number;
  fontSize?: number;
  fontFamily?: "heading" | "body" | "mono" | "display" | "elegant";
  italic?: boolean;
  underline?: boolean;
}

// ── Background ──────────────────────────────────────────

export interface ParticleConfig {
  count: number;
  color: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}

export interface GridConfig {
  type: "dots" | "lines" | "crosses";
  spacing?: number;
  size?: number;
  color?: string;
}

export interface AccentDotConfig {
  color: string;
  size?: number;
  x: number;
  y: number;
  blur?: number;
}

export interface BackgroundConfig {
  type: "solid" | "gradient" | "layered";
  color?: string;
  colors?: string[];
  angle?: number;
  particles?: ParticleConfig;
  grid?: GridConfig;
  accentDots?: AccentDotConfig[];
}

// ── Layout ──────────────────────────────────────────────

export type LayoutMode =
  | "vertical-spread"
  | "vertical-center"
  | "vertical-start"
  | "vertical-end"
  | "split-horizontal"
  | "grid-2x2";

// ── Animation ───────────────────────────────────────────

export type EnterAnimation =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "blur";

export interface ElementAnimation {
  enter?: EnterAnimation;
  delay?: number;
  duration?: number;
}

// ── Element Types ───────────────────────────────────────

export interface RichTextElement {
  type: "richText";
  segments: TextSegment[];
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";
  maxWidth?: number;
  animation?: ElementAnimation;
}

export interface BadgeElement {
  type: "badge";
  text: string;
  color?: "blue" | "orange" | "green" | "custom";
  style?: "solid" | "soft";
  bgColor?: string;
  textColor?: string;
  animation?: ElementAnimation;
}

export interface MetricElement {
  type: "metric";
  value: string;
  label?: string;
  showGauge?: boolean;
  gaugeColor?: string;
  valueColor?: string;
  labelColor?: string;
  animation?: ElementAnimation;
}

export interface ChecklistItem {
  text: string;
  icon?: "check" | "cross" | "bullet" | "arrow" | string;
  iconColor?: string;
}

export interface ChecklistElement {
  type: "checklist";
  items: ChecklistItem[];
  textColor?: string;
  fontSize?: number;
  gap?: number;
  animation?: ElementAnimation;
}

export interface CtaBarElement {
  type: "ctaBar";
  text: string;
  subtext?: string;
  bgColor?: string;
  textColor?: string;
  fullWidth?: boolean;
  borderRadius?: number;
  animation?: ElementAnimation;
}

export interface CardElement {
  type: "card";
  children: DCElement[];
  bgColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: "sm" | "md" | "lg" | "none";
  padding?: number;
  accentBorder?: {
    side: "left" | "top" | "bottom" | "right";
    color: string;
    width?: number;
  };
  animation?: ElementAnimation;
}

export interface DividerElement {
  type: "divider";
  style?: "line" | "gradient" | "dots";
  color?: string;
  colors?: string[];
  height?: number;
  width?: string;
  animation?: ElementAnimation;
}

export interface IconElement {
  type: "icon";
  emoji: string;
  size?: number;
  bgColor?: string;
  bgRadius?: number;
  animation?: ElementAnimation;
}

export interface SpacerElement {
  type: "spacer";
  height?: number;
  flexGrow?: number;
}

export interface LogoElement {
  type: "logo";
  variant?: "full" | "mark";
  position?: "inline" | "bottom";
  dark?: boolean;
  animation?: ElementAnimation;
}

export interface QuoteElement {
  type: "quote";
  text: string;
  author?: string;
  fontSize?: number;
  decorativeMarks?: boolean;
  textColor?: string;
  markColor?: string;
  animation?: ElementAnimation;
}

export interface ComparisonElement {
  type: "comparison";
  before: { label: string; items: string[] };
  after: { label: string; items: string[] };
  beforeColor?: string;
  afterColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  itemColor?: string;
  animation?: ElementAnimation;
}

export interface SparklineElement {
  type: "sparkline";
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  animation?: ElementAnimation;
}

export interface ImageElement {
  type: "image";
  src: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  objectFit?: "cover" | "contain";
  animation?: ElementAnimation;
}

// ── Union ───────────────────────────────────────────────

export type DCElement =
  | RichTextElement
  | BadgeElement
  | MetricElement
  | ChecklistElement
  | CtaBarElement
  | CardElement
  | DividerElement
  | IconElement
  | SpacerElement
  | LogoElement
  | QuoteElement
  | ComparisonElement
  | SparklineElement
  | ImageElement;

// ── Top-Level Composition ───────────────────────────────

export interface DCComposition {
  background: BackgroundConfig;
  layout: LayoutMode;
  padding?: { horizontal?: number; vertical?: number };
  gap?: number;
  elements: DCElement[];
  variant?: "light" | "dark";
}
