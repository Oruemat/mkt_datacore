import React from "react";
import type { CtaBarElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { RADIUS, SPACING, SHADOWS, TYPE_SCALE } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: CtaBarElement;
  index: number;
}

export const CtaBarBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const bg = element.bgColor ?? C.blue700;
  const text = element.textColor ?? C.white;
  const radius = element.borderRadius ?? RADIUS.lg;

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
        width: element.fullWidth ? "100%" : undefined,
      }}
    >
      <div
        style={{
          backgroundColor: bg,
          borderRadius: radius,
          padding: `${SPACING.base}px ${SPACING.xl}px`,
          textAlign: "center" as const,
          boxShadow: SHADOWS.sm,
        }}
      >
        <span
          style={{
            fontSize: TYPE_SCALE.bodySmall,
            fontWeight: 700,
            color: text,
            fontFamily: FONT_FAMILIES.heading,
          }}
        >
          {element.text}
        </span>
        {element.subtext && (
          <div
            style={{
              fontSize: TYPE_SCALE.caption,
              fontWeight: 400,
              color: text,
              opacity: 0.8,
              marginTop: SPACING.xs,
              fontFamily: FONT_FAMILIES.body,
            }}
          >
            {element.subtext}
          </div>
        )}
      </div>
    </div>
  );
};
