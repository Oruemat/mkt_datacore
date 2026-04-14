import React from "react";
import type { LogoElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES } from "../../presets/fonts";
import { RADIUS, SPACING } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: LogoElement;
  index: number;
}

export const LogoBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const dark = element.dark ?? false;
  const isBottom = element.position === "bottom";

  const content = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: RADIUS.sm,
          background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: SPACING.sm,
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
        }}
      >
        <span style={{ color: C.white, fontSize: 12, fontWeight: 800, fontFamily: FONT_FAMILIES.heading }}>DC</span>
      </div>
      {element.variant !== "mark" && (
        <span
          style={{
            color: dark ? C.gray400 : C.gray600,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: FONT_FAMILIES.heading,
          }}
        >
          DataCorePY
        </span>
      )}
    </div>
  );

  if (isBottom) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: SPACING["2xl"],
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: anim.opacity,
          transform: anim.transform,
          filter: anim.filter,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      {content}
    </div>
  );
};
