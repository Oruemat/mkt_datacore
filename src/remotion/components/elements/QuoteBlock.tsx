import React from "react";
import type { QuoteElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { TYPE_SCALE, SPACING } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: QuoteElement;
  index: number;
}

export const QuoteBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const fontSize = element.fontSize ?? TYPE_SCALE.titleLarge;
  const textColor = element.textColor ?? C.gray900;
  const markColor = element.markColor ?? C.blue100;
  const showMarks = element.decorativeMarks !== false;

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
        position: "relative",
        textAlign: "center",
        padding: `${SPACING["3xl"]}px 0`,
      }}
    >
      {showMarks && (
        <span
          style={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 200,
            fontWeight: 900,
            color: markColor,
            fontFamily: FONT_FAMILIES.elegant,
            lineHeight: 1,
            userSelect: "none" as const,
            opacity: 0.5,
          }}
        >
          &ldquo;
        </span>
      )}
      <div
        style={{
          position: "relative",
          fontSize,
          fontWeight: 700,
          fontFamily: FONT_FAMILIES.heading,
          color: textColor,
          lineHeight: 1.3,
          letterSpacing: -0.5,
        }}
      >
        {element.text}
      </div>
      {element.author && (
        <div
          style={{
            marginTop: SPACING.xl,
            fontSize: TYPE_SCALE.body,
            fontWeight: 500,
            fontFamily: FONT_FAMILIES.body,
            color: C.gray600,
          }}
        >
          — {element.author}
        </div>
      )}
    </div>
  );
};
