import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { ChecklistElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { ICON_MAP, SPRING_CONFIG, TYPE_SCALE, SPACING } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: ChecklistElement;
  index: number;
}

export const ChecklistBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fontSize = element.fontSize ?? TYPE_SCALE.body;
  const baseDelay = element.animation?.delay ?? index * 5;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: element.gap ?? SPACING.md,
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
      }}
    >
      {element.items.map((item, i) => {
        const itemDelay = baseDelay + i * 3;
        const itemFrame = Math.max(frame - itemDelay, 0);
        const itemProgress = spring({ fps, frame: itemFrame, config: SPRING_CONFIG });
        const itemOpacity = interpolate(itemFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
        const itemY = interpolate(itemProgress, [0, 1], [12, 0]);

        const iconChar = ICON_MAP[item.icon ?? "bullet"] ?? item.icon ?? "•";
        const iconColor = item.iconColor ?? C.gray400;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              fontSize,
              fontFamily: FONT_FAMILIES.body,
              fontWeight: 500,
              color: element.textColor ?? C.gray900,
              opacity: itemOpacity,
              transform: `translateY(${itemY}px)`,
            }}
          >
            <span
              style={{
                color: iconColor,
                fontSize: fontSize * 1.2,
                flexShrink: 0,
                width: fontSize * 1.4,
                textAlign: "center" as const,
              }}
            >
              {iconChar}
            </span>
            <span>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};
