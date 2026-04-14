import React from "react";
import type { BadgeElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { RADIUS, TYPE_SCALE } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

const SOLID_PRESETS: Record<string, { bg: string; text: string }> = {
  blue: { bg: C.blue700, text: C.white },
  orange: { bg: C.orange500, text: C.white },
  green: { bg: C.green600, text: C.white },
};

const SOFT_PRESETS: Record<string, { bg: string; text: string }> = {
  blue: { bg: C.blue100, text: C.blue700 },
  orange: { bg: C.orange100, text: "#C2410C" },
  green: { bg: C.green100, text: C.green700 },
};

interface Props {
  element: BadgeElement;
  index: number;
}

export const BadgeBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const isSoft = element.style === "soft";
  const presets = isSoft ? SOFT_PRESETS : SOLID_PRESETS;
  const preset = presets[element.color ?? "blue"];
  const bg = element.bgColor ?? preset?.bg ?? (isSoft ? C.blue100 : C.blue700);
  const text = element.textColor ?? preset?.text ?? (isSoft ? C.blue700 : C.white);

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      <div
        style={{
          display: "inline-flex",
          padding: "8px 20px",
          borderRadius: RADIUS.pill,
          backgroundColor: bg,
          fontSize: TYPE_SCALE.badge,
          fontWeight: 700,
          color: text,
          letterSpacing: 1.5,
          textTransform: "uppercase" as const,
          fontFamily: FONT_FAMILIES.heading,
        }}
      >
        {element.text}
      </div>
    </div>
  );
};
