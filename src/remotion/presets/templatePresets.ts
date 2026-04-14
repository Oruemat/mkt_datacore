/**
 * Legacy template → DCComposition mappers.
 * Each function converts old template props into a composition
 * so the new DCCompositionRenderer can render them identically.
 */
import type { DCComposition, DCElement } from "../types/composition";
import type { DCPostVisualProps } from "../compositions/DCPostVisual";
import { DC_BRAND } from "./brand";

const C = DC_BRAND.colors;

function resolveVariantColors(variant?: "dark" | "light") {
  const isDark = variant === "dark";
  return {
    isDark,
    title: isDark ? C.white : C.gray900,
    subtitle: isDark ? "#CBD5E1" : C.gray600,
    item: isDark ? "#CBD5E1" : C.gray700,
    cardBg: isDark ? C.navyLight : C.white,
    cardBorder: isDark ? "rgba(255,255,255,0.1)" : C.gray200,
    logoTextColor: isDark ? C.gray400 : C.gray600,
  };
}

function makeBg(variant?: "dark" | "light", accentColor?: string): DCComposition["background"] {
  const isDark = variant === "dark";
  return {
    type: "layered",
    colors: [...(isDark ? DC_BRAND.gradients.dark : DC_BRAND.gradients.hero)],
    angle: 135,
    particles: { count: 20, color: `${accentColor ?? C.blue600}18`, speed: 0.3, direction: "up" as const },
    grid: { type: "dots" as const, spacing: 60, size: 1.5, color: `${C.blue600}08` },
    accentDots: [
      { color: accentColor ?? C.blue600, size: 350, x: -120, y: -120, blur: 100 },
      { color: C.orange500, size: 300, x: 780, y: 700, blur: 100 },
    ],
  };
}

export function heroToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const elements: DCElement[] = [
    { type: "badge", text: "DataCorePY", color: "blue", animation: { enter: "fade", delay: 0 } },
    {
      type: "richText",
      segments: [{ text: props.title, fontWeight: 800, color: col.title }],
      fontSize: s.titleFontSize ?? 54,
      textAlign: "center",
      lineHeight: 1.2,
      letterSpacing: -1,
      animation: { enter: (props.enterAnimation as "fade" | "slideUp" | "slideDown" | "scale" | "blur" | undefined) ?? "slideUp", delay: 3 },
    },
  ];
  if (props.subtitle) {
    elements.push({
      type: "richText",
      segments: [{ text: props.subtitle, color: col.subtitle }],
      fontSize: s.subtitleFontSize ?? 22,
      textAlign: "center",
      lineHeight: 1.6,
      animation: { enter: "fade", delay: 8 },
    });
  }
  elements.push({
    type: "divider",
    style: "gradient",
    colors: [s.accentColor ?? C.blue600, C.orange500],
    height: 4,
    width: "60px",
    animation: { enter: "fade", delay: 12 },
  });
  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-center",
    padding: { horizontal: s.contentPadding ?? 80, vertical: s.contentPadding ?? 80 },
    gap: 24,
    elements,
    variant: props.variant,
  };
}

export function metricToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const elements: DCElement[] = [
    {
      type: "metric",
      value: props.metricValue || props.title,
      label: props.metricLabel || props.subtitle,
      showGauge: true,
      gaugeColor: s.accentColor ?? C.blue600,
      valueColor: col.title,
      labelColor: col.subtitle,
      animation: { enter: "scale", delay: 0 },
    },
  ];
  if (props.subtitle) {
    elements.push({
      type: "richText",
      segments: [{ text: props.subtitle, color: col.subtitle }],
      fontSize: s.subtitleFontSize ?? 18,
      textAlign: "center",
      animation: { enter: "fade", delay: 10 },
    });
  }
  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-center",
    padding: { horizontal: s.contentPadding ?? 60, vertical: s.contentPadding ?? 60 },
    gap: 16,
    elements,
    variant: props.variant,
  };
}

export function comparisonToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const elements: DCElement[] = [
    {
      type: "richText",
      segments: [{ text: props.title, fontWeight: 800, color: col.title }],
      fontSize: s.titleFontSize ?? 36,
      textAlign: "center",
      animation: { enter: "slideUp", delay: 0 },
    },
    {
      type: "comparison",
      before: { label: "ANTES", items: props.comparisonBefore ?? [] },
      after: { label: "AHORA", items: props.comparisonAfter ?? [] },
      cardBgColor: col.cardBg,
      cardBorderColor: col.cardBorder,
      itemColor: col.item,
      animation: { enter: "slideUp", delay: 6 },
    },
  ];
  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-start",
    padding: { horizontal: s.contentPadding ?? 60, vertical: s.contentPadding ?? 50 },
    gap: 20,
    elements,
    variant: props.variant,
  };
}

export function tipsToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const accentColors = [C.blue600, C.orange500, C.green600, C.blue700, "#9333EA"];
  const elements: DCElement[] = [
    {
      type: "richText",
      segments: [{ text: props.title, fontWeight: 800, color: col.title }],
      fontSize: s.titleFontSize ?? 34,
      textAlign: "center",
      animation: { enter: "slideUp", delay: 0 },
    },
  ];

  (props.tips ?? []).forEach((tip, i) => {
    elements.push({
      type: "card",
      bgColor: col.cardBg,
      borderColor: col.cardBorder,
      shadow: "sm",
      padding: 20,
      accentBorder: { side: "left", color: accentColors[i % accentColors.length], width: 4 },
      children: [
        {
          type: "richText",
          segments: [
            { text: `${i + 1}. `, fontWeight: 800, color: accentColors[i % accentColors.length] },
            { text: tip, fontWeight: 500, color: col.item },
          ],
          fontSize: s.itemFontSize ?? 18,
        },
      ],
      animation: { enter: "slideUp", delay: 5 + i * 4 },
    });
  });

  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-start",
    padding: { horizontal: s.contentPadding ?? 60, vertical: s.contentPadding ?? 50 },
    gap: 16,
    elements,
    variant: props.variant,
  };
}

export function dashboardToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const metrics = props.dashboardMetrics ?? [{ label: "KPI", value: props.title }];

  const elements: DCElement[] = [
    {
      type: "richText",
      segments: [{ text: props.title, fontWeight: 800, color: col.title }],
      fontSize: s.titleFontSize ?? 32,
      textAlign: "center",
      animation: { enter: "slideUp", delay: 0 },
    },
  ];

  metrics.forEach((m, i) => {
    elements.push({
      type: "card",
      bgColor: col.cardBg,
      borderColor: col.cardBorder,
      shadow: "sm",
      padding: 24,
      children: [
        {
          type: "metric",
          value: m.value,
          label: m.label,
          showGauge: false,
          valueColor: col.title,
          labelColor: col.subtitle,
        },
        {
          type: "sparkline",
          color: [C.blue600, C.orange500, C.green600][i % 3],
          width: 160,
          height: 40,
        },
      ],
      animation: { enter: "scale", delay: 5 + i * 4 },
    });
  });

  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-start",
    padding: { horizontal: s.contentPadding ?? 60, vertical: s.contentPadding ?? 50 },
    gap: 16,
    elements,
    variant: props.variant,
  };
}

export function statementToComposition(props: DCPostVisualProps): DCComposition {
  const col = resolveVariantColors(props.variant);
  const s = props.styles ?? {};
  const elements: DCElement[] = [
    {
      type: "divider",
      style: "gradient",
      colors: [s.accentColor ?? C.blue600, C.orange500],
      height: 4,
      width: "80px",
      animation: { enter: "fade", delay: 0 },
    },
    {
      type: "quote",
      text: props.title,
      author: props.subtitle,
      fontSize: s.titleFontSize ?? 42,
      textColor: col.title,
      markColor: col.isDark ? "rgba(255,255,255,0.08)" : C.blue100,
      decorativeMarks: true,
      animation: { enter: "scale", delay: 3 },
    },
    {
      type: "divider",
      style: "gradient",
      colors: [C.orange500, C.green600],
      height: 4,
      width: "80px",
      animation: { enter: "fade", delay: 10 },
    },
  ];
  elements.push({ type: "logo", variant: "full", position: "bottom", dark: col.isDark });

  return {
    background: makeBg(props.variant, s.accentColor),
    layout: "vertical-center",
    padding: { horizontal: s.contentPadding ?? 90, vertical: s.contentPadding ?? 90 },
    gap: 24,
    elements,
    variant: props.variant,
  };
}

/**
 * Convert legacy template props to a DCComposition.
 */
export function templateToComposition(props: DCPostVisualProps): DCComposition {
  switch (props.template) {
    case "hero":
      return heroToComposition(props);
    case "metric":
      return metricToComposition(props);
    case "comparison":
      return comparisonToComposition(props);
    case "tips":
      return tipsToComposition(props);
    case "dashboard":
      return dashboardToComposition(props);
    case "statement":
      return statementToComposition(props);
    default:
      return heroToComposition(props);
  }
}
