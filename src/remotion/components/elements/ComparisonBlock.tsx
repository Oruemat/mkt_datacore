import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ComparisonElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { RADIUS, SHADOWS, SPACING, SPRING_CONFIG, TYPE_SCALE } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: ComparisonElement;
  index: number;
}

export const ComparisonBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseDelay = element.animation?.delay ?? index * 5;

  const beforeColor = element.beforeColor ?? "#EF4444";
  const afterColor = element.afterColor ?? C.green600;
  const cardBg = element.cardBgColor ?? C.navyLight;
  const cardBorder = element.cardBorderColor ?? "rgba(255,255,255,0.1)";
  const itemColor = element.itemColor ?? "#CBD5E1";

  const renderColumn = (
    label: string,
    items: string[],
    accentColor: string,
    icon: string,
    colDelay: number,
  ) => {
    const colFrame = Math.max(frame - colDelay, 0);
    const colProgress = spring({ fps, frame: colFrame, config: SPRING_CONFIG });
    const colOpacity = interpolate(colFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

    return (
      <div
        style={{
          flex: 1,
          backgroundColor: cardBg,
          borderRadius: RADIUS.lg,
          border: `1px solid ${cardBorder}`,
          borderTop: `3px solid ${accentColor}`,
          boxShadow: SHADOWS.sm,
          padding: SPACING.xl,
          opacity: colOpacity,
          transform: `translateY(${interpolate(colProgress, [0, 1], [20, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          gap: SPACING.base,
        }}
      >
        <div
          style={{
            fontSize: TYPE_SCALE.badge,
            fontWeight: 700,
            fontFamily: FONT_FAMILIES.heading,
            color: accentColor,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            marginBottom: SPACING.xs,
          }}
        >
          {label}
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.md,
              fontSize: TYPE_SCALE.body,
              fontFamily: FONT_FAMILIES.body,
              fontWeight: 500,
              color: itemColor,
            }}
          >
            <span
              style={{
                color: accentColor,
                flexShrink: 0,
                fontSize: TYPE_SCALE.bodyLarge,
                fontWeight: 700,
              }}
            >
              {icon}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
        display: "flex",
        gap: SPACING.base,
        width: "100%",
        flex: 1,
        minHeight: 0,
      }}
    >
      {renderColumn(element.before.label, element.before.items, beforeColor, "✗", baseDelay)}
      {renderColumn(element.after.label, element.after.items, afterColor, "✓", baseDelay + 6)}
    </div>
  );
};
