import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AnimatedTitle } from "../components/text/AnimatedTitle";
import type { AnimationStyle } from "../components/text/AnimatedTitle";
import { GradientBackground } from "../components/backgrounds/GradientBackground";
import { GridPattern } from "../components/backgrounds/GridPattern";
import { ParticleField } from "../components/backgrounds/ParticleField";
import { SafeArea } from "../components/layout/SafeArea";
import { DC_BRAND } from "../presets/brand";
import { loadDefaultFonts, FONT_FAMILIES, loadGoogleFont } from "../presets/fonts";
import { DCCompositionRenderer } from "./DCCompositionRenderer";

const C = DC_BRAND.colors;

export type DCTemplate = "hero" | "metric" | "comparison" | "tips" | "dashboard" | "statement";

/**
 * Style overrides — every visual property the design agent can tweak.
 * Templates use these with sensible defaults so nothing breaks if omitted.
 */
export interface DCStyleOverrides {
  // Typography
  titleFontSize?: number;
  subtitleFontSize?: number;
  itemFontSize?: number;
  valueFontSize?: number;     // metric/dashboard big numbers
  labelFontSize?: number;     // metric/dashboard labels
  badgeFontSize?: number;

  // Spacing
  contentPadding?: number;    // overall content inset
  cardPadding?: number;
  cardGap?: number;
  itemGap?: number;
  headerMarginBottom?: number;

  // Shape
  cardBorderRadius?: number;

  // Colors
  accentColor?: string;       // override primary accent
  titleColor?: string;
  itemColor?: string;
  backgroundColor?: string;

  // Background
  showParticles?: boolean;
  showGrid?: boolean;
  particleCount?: number;
  particleColor?: string;

  // Card header (comparison "ANTES"/"AHORA", tips numbers, etc.)
  cardHeaderFontSize?: number;
  cardHeaderAlign?: "left" | "center" | "right";

  // Item distribution inside cards
  itemsDistribution?: "start" | "center" | "space-between" | "space-around" | "space-evenly";
}

export interface DCPostVisualProps {
  template: DCTemplate;
  title: string;
  subtitle?: string;
  copy?: string;
  hashtags?: string[];
  variant?: "dark" | "light";
  enterAnimation?: AnimationStyle;
  metricValue?: string;
  metricLabel?: string;
  comparisonBefore?: string[];
  comparisonAfter?: string[];
  tips?: string[];
  dashboardMetrics?: Array<{ label: string; value: string }>;
  styles?: DCStyleOverrides;
  /** New composition mode — when present, ignores template and renders via CompositionRenderer */
  composition?: import("../types/composition").DCComposition;
}

// ── Shared UI Elements ───────────────────────────────

const LogoMark: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{
    position: "absolute", bottom: 32, left: 0, right: 0,
    display: "flex", justifyContent: "center", alignItems: "center",
  }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginRight: 8,
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
      }}>
        <span style={{ color: C.white, fontSize: 12, fontWeight: 800, fontFamily: FONT_FAMILIES.heading }}>DC</span>
      </div>
      <span style={{
        color: dark ? C.gray400 : C.gray600, fontSize: 13, fontWeight: 600, letterSpacing: 2,
        fontFamily: FONT_FAMILIES.heading,
      }}>
        DataCorePY
      </span>
    </div>
  </div>
);

const Badge: React.FC<{ text: string; color?: "blue" | "orange" | "green" }> = ({ text, color = "blue" }) => {
  const styles = {
    blue: { bg: C.blue100, text: C.blue700 },
    orange: { bg: C.orange100, text: "#C2410C" },
    green: { bg: C.green100, text: C.green700 },
  };
  const s = styles[color];
  return (
    <div style={{
      display: "inline-flex", padding: "6px 16px", borderRadius: 9999,
      backgroundColor: s.bg, fontSize: 12, fontWeight: 700,
      color: s.text, letterSpacing: 1.5, textTransform: "uppercase" as const,
      fontFamily: FONT_FAMILIES.heading,
    }}>
      {text}
    </div>
  );
};

const AccentDot: React.FC<{ color: string; size?: number; x: number; y: number; blur?: number }> = ({
  color, size = 200, x, y, blur = 64,
}) => (
  <div style={{
    position: "absolute", left: x, top: y, width: size, height: size,
    borderRadius: "50%", backgroundColor: color, opacity: 0.15,
    filter: `blur(${blur}px)`,
  }} />
);

// ── SparklineSVG ─────────────────────────────────────

const SparklineSVG: React.FC<{ data: number[]; color: string; width: number; height: number }> = ({
  data, color, width, height,
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height * 0.8) - height * 0.1}`)
    .join(" ");

  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Dark mode color resolver ─────────────────────────
// Returns colors based on variant. Dark = navy bg, light text.
function resolveColors(variant: "dark" | "light" | undefined, s: DCStyleOverrides) {
  const isDark = variant === "dark";
  return {
    isDark,
    bg: s.backgroundColor ?? (isDark ? C.navy : C.gray50),
    bgAlt: isDark ? C.navyLight : C.white,
    title: s.titleColor ?? (isDark ? C.white : C.gray900),
    subtitle: isDark ? C.gray300 : C.gray600,
    item: s.itemColor ?? (isDark ? C.gray300 : C.gray700),
    itemStrong: s.itemColor ?? (isDark ? C.white : C.gray900),
    cardBg: isDark ? C.navyLight : C.white,
    cardBorder: isDark ? "rgba(255,255,255,0.1)" : C.gray200,
    badge: isDark ? "rgba(255,255,255,0.1)" : undefined, // undefined = use default per badge
    logoTextColor: isDark ? C.gray400 : C.gray600,
    particleAlpha: isDark ? "20" : "10",
  };
}

// ── Enter animation helper for non-AnimatedTitle elements ──
function useEnterAnim(
  anim: AnimationStyle | undefined,
  frame: number,
  fps: number,
  delay: number = 0,
  duration: number = 15,
): { opacity: number; transform: string; filter: string } {
  const f = Math.max(frame - delay, 0);
  if (f >= duration) return { opacity: 1, transform: "none", filter: "none" };

  const progress = spring({ fps, frame: f, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(f, [0, duration * 0.6], [0, 1], { extrapolateRight: "clamp" });

  switch (anim) {
    case "slideUp":
      return { opacity, transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`, filter: "none" };
    case "slideDown":
      return { opacity, transform: `translateY(${interpolate(progress, [0, 1], [-40, 0])}px)`, filter: "none" };
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

// ── HERO Template ────────────────────────────────────

const HeroTemplate: React.FC<{ title: string; subtitle?: string; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ title, subtitle, s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const col = resolveColors(variant, s);
  const pad = s.contentPadding ?? 80;
  const gradColors = col.isDark ? DC_BRAND.gradients.dark : DC_BRAND.gradients.hero;
  return (
    <AbsoluteFill>
      <GradientBackground colors={gradColors} angle={135} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 20} color={s.particleColor ?? `${C.blue600}18`} speed={0.3} direction="up" />}
      <AccentDot color={s.accentColor ?? C.blue600} size={350} x={-120} y={-120} blur={100} />
      <AccentDot color={C.orange500} size={300} x={780} y={700} blur={100} />
      {(s.showGrid !== false) && <GridPattern type="dots" spacing={60} size={1.5} color={`${C.blue600}08`} />}
      <SafeArea paddingHorizontal={pad} paddingVertical={pad}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Sequence from={0} durationInFrames={90}>
            <div style={{ textAlign: "center", maxWidth: 900, padding: "0 20px" }}>
              <div style={{ marginBottom: 24, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
                <Badge text="DataCorePY" color="blue" />
              </div>
              <AnimatedTitle
                text={title}
                fontSize={s.titleFontSize ?? 54}
                fontWeight={800}
                color={col.title}
                enterAnimation={anim ?? "slideUp"}
                enterDuration={18}
                holdDuration={72}
                exitDuration={0}
                letterSpacing={-1}
                lineHeight={1.2}
              />
              {subtitle && (
                <div style={{
                  marginTop: 24,
                  opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateY(${interpolate(frame, [8, 20], [10, 0], { extrapolateRight: "clamp" })}px)`,
                }}>
                  <span style={{
                    fontSize: s.subtitleFontSize ?? 22, fontFamily: FONT_FAMILIES.body, fontWeight: 400,
                    color: col.subtitle, lineHeight: 1.6,
                  }}>
                    {subtitle}
                  </span>
                </div>
              )}
              <div style={{
                width: 60, height: 4, borderRadius: 2, margin: "32px auto 0",
                background: `linear-gradient(90deg, ${s.accentColor ?? C.blue600}, ${C.orange500})`,
                opacity: interpolate(frame, [12, 22], [0, 1], { extrapolateRight: "clamp" }),
              }} />
            </div>
          </Sequence>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── METRIC Template ──────────────────────────────────

const MetricTemplate: React.FC<{ value: string; label?: string; subtitle?: string; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ value, label, subtitle, s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = resolveColors(variant, s);

  loadGoogleFont("JetBrains Mono");

  const scaleProgress = spring({ fps, frame, config: { damping: 15, stiffness: 80 } });
  const scale = interpolate(scaleProgress, [0, 1], [0.85, 1]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 75;
  const circumference = 2 * Math.PI * 150;
  const strokeDash = (numericValue / 100) * circumference * scaleProgress;
  const valSize = s.valueFontSize ?? 96;
  const lblSize = s.labelFontSize ?? 18;

  return (
    <AbsoluteFill>
      <GradientBackground colors={col.isDark ? [col.bg, C.navyLight, C.navy] : [s.backgroundColor ?? C.gray50, C.white, C.blue50]} angle={180} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 15} color={s.particleColor ?? `${C.blue600}12`} speed={0.2} direction="up" />}
      <AccentDot color={s.accentColor ?? C.blue600} size={250} x={50} y={50} blur={80} />
      <AccentDot color={C.green600} size={200} x={800} y={700} blur={80} />
      <SafeArea paddingHorizontal={s.contentPadding ?? 60} paddingVertical={s.contentPadding ?? 60}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            background: col.cardBg, borderRadius: s.cardBorderRadius ?? 28,
            padding: `${s.cardPadding ?? 70}px ${(s.cardPadding ?? 70) + 20}px`,
            boxShadow: col.isDark ? "0 25px 50px -12px rgba(0,0,0,0.4)" : "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
            border: `1px solid ${col.cardBorder}`,
            textAlign: "center", opacity, transform: `scale(${scale})`,
            position: "relative", minWidth: 400,
          }}>
            <svg width={340} height={340} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}>
              <circle cx={170} cy={170} r={150} fill="none" stroke={col.isDark ? "rgba(255,255,255,0.08)" : C.gray100} strokeWidth={8} />
              <circle
                cx={170} cy={170} r={150}
                fill="none" stroke="url(#metric-grad)" strokeWidth={8}
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round" transform="rotate(-90 170 170)"
              />
              <defs>
                <linearGradient id="metric-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={s.accentColor ?? C.blue600} />
                  <stop offset="100%" stopColor={C.green600} />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                fontSize: valSize, fontFamily: FONT_FAMILIES.mono, fontWeight: 700,
                color: col.title, letterSpacing: -3, lineHeight: 1,
              }}>
                {value}
              </div>
              {label && (
                <div style={{
                  fontSize: lblSize, fontFamily: FONT_FAMILIES.heading, fontWeight: 600,
                  color: s.accentColor ?? C.blue600, marginTop: 12, letterSpacing: 2,
                  textTransform: "uppercase" as const,
                }}>
                  {label}
                </div>
              )}
            </div>
          </div>
          {subtitle && (
            <Sequence from={15}>
              <div style={{
                position: "absolute", bottom: 120, left: 0, right: 0,
                display: "flex", justifyContent: "center",
              }}>
                <AnimatedTitle text={subtitle} fontSize={s.subtitleFontSize ?? 20} fontWeight={400} color={col.subtitle} enterAnimation={anim ?? "fade"} enterDuration={15} holdDuration={60} exitDuration={0} />
              </div>
            </Sequence>
          )}
        </AbsoluteFill>
      </SafeArea>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── COMPARISON Template ──────────────────────────────

const ComparisonTemplate: React.FC<{ before?: string[]; after?: string[]; title: string; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ before = [], after = [], title, s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = resolveColors(variant, s);
  const slideProgress = spring({ fps, frame, config: { damping: 14, stiffness: 100 } });
  const pad = s.contentPadding ?? 50;
  const itemSize = s.itemFontSize ?? 18;
  const titleSize = s.titleFontSize ?? 36;
  const cRadius = s.cardBorderRadius ?? 24;
  const cPad = s.cardPadding ?? 32;
  const iGap = s.itemGap ?? 20;
  const headerSize = s.cardHeaderFontSize ?? (s.badgeFontSize ?? 12);
  const headerAlign = s.cardHeaderAlign ?? "flex-start";
  const itemsDist = s.itemsDistribution ?? "center";
  const titleAnim = useEnterAnim(anim, frame, fps, 3, 14);

  const beforeBorderColor = col.isDark ? "rgba(239, 68, 68, 0.3)" : "#FEE2E2";
  const afterBorderColor = col.isDark ? "rgba(22, 163, 74, 0.3)" : C.green100;
  const beforeBadgeBg = col.isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2";
  const afterBadgeBg = col.isDark ? "rgba(22, 163, 74, 0.2)" : C.green100;
  const iconBgBefore = col.isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2";
  const iconBgAfter = col.isDark ? "rgba(22, 163, 74, 0.15)" : C.green100;

  return (
    <AbsoluteFill>
      <GradientBackground colors={col.isDark ? DC_BRAND.gradients.dark : [s.backgroundColor ?? C.gray50, C.white]} angle={180} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 12} color={s.particleColor ?? `${C.blue600}${col.particleAlpha}`} speed={0.2} direction="up" />}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        padding: `${pad}px ${pad + 5}px ${pad + 30}px`,
      }}>
        <div style={{ textAlign: "center", marginBottom: s.headerMarginBottom ?? 32, flexShrink: 0 }}>
          <div style={{
            marginBottom: 14,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            <Badge text="Transformacion" color="blue" />
          </div>
          <div style={{
            fontSize: titleSize, fontFamily: FONT_FAMILIES.heading, fontWeight: 800,
            color: col.title, lineHeight: 1.2, letterSpacing: -0.5,
            opacity: titleAnim.opacity, transform: titleAnim.transform, filter: titleAnim.filter,
          }}>
            {title}
          </div>
        </div>

        <div style={{
          flex: 1, display: "flex", gap: s.cardGap ?? 20,
          alignItems: "stretch",
        }}>
          {/* Before card */}
          <div style={{
            flex: 1, background: col.cardBg, borderRadius: cRadius,
            padding: `${cPad}px ${cPad - 2}px`,
            border: `2px solid ${beforeBorderColor}`,
            boxShadow: col.isDark ? "0 10px 40px -10px rgba(0,0,0,0.3)" : "0 10px 40px -10px rgba(239, 68, 68, 0.08), 0 4px 12px -4px rgba(0,0,0,0.04)",
            transform: `translateX(${interpolate(slideProgress, [0, 1], [-30, 0])}px)`,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" }),
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              display: "inline-flex", padding: `${Math.max(headerSize - 7, 5)}px 14px`, borderRadius: 9999,
              backgroundColor: beforeBadgeBg, fontSize: headerSize, fontWeight: 700,
              color: col.isDark ? "#FCA5A5" : "#991B1B", letterSpacing: 1.5, marginBottom: cPad - 8,
              fontFamily: FONT_FAMILIES.heading,
              alignSelf: headerAlign === "center" ? "center" : headerAlign === "right" ? "flex-end" : "flex-start",
            }}>
              ANTES
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: itemsDist, gap: iGap }}>
              {before.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center",
                  opacity: interpolate(frame, [10 + i * 5, 20 + i * 5], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(frame, [10 + i * 5, 20 + i * 5], [-10, 0], { extrapolateRight: "clamp" })}px)`,
                }}>
                  <div style={{
                    width: itemSize + 10, height: itemSize + 10, borderRadius: 8,
                    backgroundColor: iconBgBefore,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: 14, flexShrink: 0,
                  }}>
                    <span style={{ color: "#DC2626", fontSize: itemSize - 4, fontWeight: 700 }}>&#10005;</span>
                  </div>
                  <span style={{
                    fontSize: itemSize, color: col.item, fontFamily: FONT_FAMILIES.body,
                    lineHeight: 1.4, fontWeight: 500,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* After card */}
          <div style={{
            flex: 1, background: col.cardBg, borderRadius: cRadius,
            padding: `${cPad}px ${cPad - 2}px`,
            border: `2px solid ${afterBorderColor}`,
            boxShadow: col.isDark ? "0 10px 40px -10px rgba(0,0,0,0.3)" : `0 10px 40px -10px rgba(22, 163, 74, 0.08), 0 4px 12px -4px rgba(0,0,0,0.04)`,
            transform: `translateX(${interpolate(slideProgress, [0, 1], [30, 0])}px)`,
            opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }),
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              display: "inline-flex", padding: `${Math.max(headerSize - 7, 5)}px 14px`, borderRadius: 9999,
              backgroundColor: afterBadgeBg, fontSize: headerSize, fontWeight: 700,
              color: col.isDark ? "#86EFAC" : "#166534", letterSpacing: 1.5, marginBottom: cPad - 8,
              fontFamily: FONT_FAMILIES.heading,
              alignSelf: headerAlign === "center" ? "center" : headerAlign === "right" ? "flex-end" : "flex-start",
            }}>
              AHORA
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: itemsDist, gap: iGap }}>
              {after.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center",
                  opacity: interpolate(frame, [15 + i * 5, 25 + i * 5], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(frame, [15 + i * 5, 25 + i * 5], [10, 0], { extrapolateRight: "clamp" })}px)`,
                }}>
                  <div style={{
                    width: itemSize + 10, height: itemSize + 10, borderRadius: 8,
                    backgroundColor: iconBgAfter,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: 14, flexShrink: 0,
                  }}>
                    <span style={{ color: C.green600, fontSize: itemSize - 4, fontWeight: 700 }}>&#10003;</span>
                  </div>
                  <span style={{
                    fontSize: itemSize, color: col.itemStrong, fontFamily: FONT_FAMILIES.body,
                    lineHeight: 1.4, fontWeight: 500,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── TIPS Template ────────────────────────────────────

const TipsTemplate: React.FC<{ title: string; tips: string[]; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ title, tips = [], s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = resolveColors(variant, s);
  const baseAccent = s.accentColor ?? C.blue600;
  const accentColors = [baseAccent, C.orange500, C.green600, C.blue700, "#9333EA"];
  const pad = s.contentPadding ?? 50;
  const itemSize = s.itemFontSize ?? 18;
  const titleSize = s.titleFontSize ?? 34;
  const titleAnim = useEnterAnim(anim, frame, fps, 3, 14);

  return (
    <AbsoluteFill>
      <GradientBackground colors={col.isDark ? DC_BRAND.gradients.dark : DC_BRAND.gradients.hero} angle={160} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 15} color={s.particleColor ?? `${C.orange500}${col.particleAlpha}`} speed={0.25} direction="up" />}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        padding: `${pad}px ${pad + 5}px ${pad + 30}px`,
      }}>
        <div style={{ marginBottom: s.headerMarginBottom ?? 28, flexShrink: 0 }}>
          <div style={{
            marginBottom: 14,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            <Badge text="Consejos" color="orange" />
          </div>
          <div style={{
            fontSize: titleSize, fontFamily: FONT_FAMILIES.heading, fontWeight: 800,
            color: col.title, lineHeight: 1.2, letterSpacing: -0.5,
            opacity: titleAnim.opacity, transform: titleAnim.transform, filter: titleAnim.filter,
          }}>
            {title}
          </div>
        </div>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", gap: s.itemGap ?? 14,
        }}>
          {tips.slice(0, 5).map((tip, i) => {
            const accent = accentColors[i % accentColors.length];
            const tipOpacity = interpolate(frame, [10 + i * 5, 20 + i * 5], [0, 1], { extrapolateRight: "clamp" });
            const tipY = interpolate(frame, [10 + i * 5, 20 + i * 5], [15, 0], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                opacity: tipOpacity, transform: `translateY(${tipY}px)`,
                background: col.cardBg, borderRadius: s.cardBorderRadius ?? 18,
                padding: `${s.cardPadding ?? 20}px ${(s.cardPadding ?? 20) + 4}px`,
                border: `1px solid ${col.cardBorder}`,
                borderLeft: `4px solid ${accent}`,
                boxShadow: col.isDark ? "0 4px 12px -2px rgba(0,0,0,0.2)" : "0 4px 12px -2px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: itemSize + 20, height: itemSize + 20, borderRadius: 12,
                  backgroundColor: `${accent}${col.isDark ? "25" : "12"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginRight: 16, flexShrink: 0,
                  fontSize: itemSize - 1, fontFamily: FONT_FAMILIES.mono, fontWeight: 700, color: accent,
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: itemSize, color: col.item, fontFamily: FONT_FAMILIES.body,
                  lineHeight: 1.45, fontWeight: 500,
                }}>
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── DASHBOARD Template ───────────────────────────────

const DashboardTemplate: React.FC<{ metrics: Array<{ label: string; value: string }>; title: string; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ metrics = [], title, s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = resolveColors(variant, s);
  const sparkData = [
    [30, 45, 35, 60, 55, 70, 65, 80, 75, 90],
    [50, 40, 55, 45, 65, 60, 70, 75, 85, 80],
    [20, 35, 30, 50, 45, 55, 65, 60, 75, 85],
    [40, 50, 45, 60, 55, 75, 70, 85, 80, 95],
  ];
  const cardColors = [s.accentColor ?? C.blue600, C.green600, C.orange500, C.blue700, "#9333EA", C.green700];
  const pad = s.contentPadding ?? 50;
  const valSize = s.valueFontSize ?? 36;
  const lblSize = s.labelFontSize ?? 12;
  const titleSize = s.titleFontSize ?? 32;
  const titleAnim = useEnterAnim(anim, frame, fps, 3, 14);

  const count = Math.min(metrics.length, 6);
  const cols = count <= 2 ? 2 : count <= 4 ? 2 : 3;

  return (
    <AbsoluteFill>
      <GradientBackground colors={col.isDark ? DC_BRAND.gradients.dark : [s.backgroundColor ?? C.gray50, C.white]} angle={180} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 10} color={s.particleColor ?? `${C.blue600}0A`} speed={0.15} direction="up" />}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        padding: `${pad}px ${pad}px ${pad + 30}px`,
      }}>
        <div style={{ marginBottom: s.headerMarginBottom ?? 28, flexShrink: 0 }}>
          <div style={{
            marginBottom: 12,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            <Badge text="Dashboard" color="blue" />
          </div>
          <div style={{
            fontSize: titleSize, fontFamily: FONT_FAMILIES.heading, fontWeight: 700,
            color: col.title, lineHeight: 1.2,
            opacity: titleAnim.opacity, transform: titleAnim.transform, filter: titleAnim.filter,
          }}>
            {title}
          </div>
        </div>

        <div style={{
          flex: 1, display: "flex", flexWrap: "wrap",
          gap: s.cardGap ?? 16, alignContent: "center",
        }}>
          {metrics.slice(0, 6).map((m, i) => {
            const accent = cardColors[i % cardColors.length];
            const cardOpacity = interpolate(frame, [6 + i * 3, 16 + i * 3], [0, 1], { extrapolateRight: "clamp" });
            const cardScale = interpolate(frame, [6 + i * 3, 16 + i * 3], [0.95, 1], { extrapolateRight: "clamp" });
            const cardWidth = cols === 3 ? "calc(33.33% - 11px)" : "calc(50% - 8px)";
            return (
              <div key={i} style={{
                width: cardWidth,
                background: col.cardBg, borderRadius: s.cardBorderRadius ?? 20,
                padding: `${s.cardPadding ?? 24}px ${(s.cardPadding ?? 24) + 2}px`,
                border: `1px solid ${col.cardBorder}`,
                boxShadow: col.isDark ? "0 4px 12px -2px rgba(0,0,0,0.2)" : "0 4px 12px -2px rgba(0,0,0,0.04)",
                opacity: cardOpacity, transform: `scale(${cardScale})`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: accent, borderRadius: `${s.cardBorderRadius ?? 20}px ${s.cardBorderRadius ?? 20}px 0 0`,
                }} />
                <div style={{
                  fontSize: lblSize, fontFamily: FONT_FAMILIES.heading, color: col.subtitle,
                  textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 8,
                  fontWeight: 600,
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: valSize, fontFamily: FONT_FAMILIES.mono, fontWeight: 700,
                  color: col.title, marginBottom: 12, lineHeight: 1,
                }}>
                  {m.value}
                </div>
                <SparklineSVG data={sparkData[i % sparkData.length]} color={accent} width={180} height={32} />
              </div>
            );
          })}
        </div>
      </div>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── STATEMENT Template ───────────────────────────────

const StatementTemplate: React.FC<{ title: string; subtitle?: string; s?: DCStyleOverrides; anim?: AnimationStyle; variant?: "dark" | "light" }> = ({ title, subtitle, s = {}, anim, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = resolveColors(variant, s);
  const enterVals = useEnterAnim(anim ?? "scale", frame, fps, 0, 20);
  const titleSize = s.titleFontSize ?? 42;
  const pad = s.contentPadding ?? 90;

  return (
    <AbsoluteFill>
      <GradientBackground colors={col.isDark ? DC_BRAND.gradients.dark : DC_BRAND.gradients.hero} angle={135} />
      {(s.showParticles !== false) && <ParticleField count={s.particleCount ?? 18} color={s.particleColor ?? `${C.blue600}${col.particleAlpha}`} speed={0.2} direction="up" />}
      <AccentDot color={s.accentColor ?? C.blue600} size={400} x={-150} y={250} blur={100} />
      <AccentDot color={C.orange500} size={320} x={800} y={550} blur={100} />
      <div style={{
        position: "absolute", top: 80, left: 50, fontSize: 320, fontFamily: FONT_FAMILIES.heading,
        color: `${s.accentColor ?? C.blue600}08`, lineHeight: 1, fontWeight: 900,
      }}>
        &ldquo;
      </div>
      <SafeArea paddingHorizontal={pad} paddingVertical={pad}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            textAlign: "center",
            opacity: enterVals.opacity, transform: enterVals.transform, filter: enterVals.filter,
            maxWidth: 850, padding: "0 20px",
          }}>
            <div style={{
              width: 50, height: 4, borderRadius: 2, margin: "0 auto 36px",
              background: `linear-gradient(90deg, ${s.accentColor ?? C.blue600}, ${C.orange500})`,
            }} />
            <div style={{
              fontSize: titleSize, fontFamily: FONT_FAMILIES.heading, fontWeight: 700,
              color: col.title, lineHeight: 1.35,
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                fontSize: s.subtitleFontSize ?? 20, fontFamily: FONT_FAMILIES.body, fontWeight: 400,
                color: col.subtitle, marginTop: 24, lineHeight: 1.6,
              }}>
                {subtitle}
              </div>
            )}
            <div style={{
              width: 50, height: 4, borderRadius: 2, margin: "36px auto 0",
              background: `linear-gradient(90deg, ${C.orange500}, ${C.green600})`,
            }} />
          </div>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark dark={col.isDark} />
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────────

export const DCPostVisual: React.FC<DCPostVisualProps> = (props) => {
  loadDefaultFonts();

  // ── New composition mode ──
  if (props.composition) {
    return <DCCompositionRenderer composition={props.composition} />;
  }

  // ── Legacy template mode ──
  const { template = "hero", title, subtitle, tips, dashboardMetrics, metricValue, metricLabel, comparisonBefore, comparisonAfter, styles: s, enterAnimation: anim, variant } = props;

  switch (template) {
    case "hero":
      return <HeroTemplate title={title} subtitle={subtitle} s={s} anim={anim} variant={variant} />;
    case "metric":
      return <MetricTemplate value={metricValue || title} label={metricLabel || subtitle} subtitle={subtitle} s={s} anim={anim} variant={variant} />;
    case "comparison":
      return <ComparisonTemplate before={comparisonBefore} after={comparisonAfter} title={title} s={s} anim={anim} variant={variant} />;
    case "tips":
      return <TipsTemplate title={title} tips={tips || []} s={s} anim={anim} variant={variant} />;
    case "dashboard":
      return <DashboardTemplate metrics={dashboardMetrics || [{ label: "KPI", value: title }]} title={title} s={s} anim={anim} variant={variant} />;
    case "statement":
      return <StatementTemplate title={title} subtitle={subtitle} s={s} anim={anim} variant={variant} />;
    default:
      return <HeroTemplate title={title} subtitle={subtitle} s={s} anim={anim} variant={variant} />;
  }
};
