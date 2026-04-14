import React from "react";
import type { CardElement, DCElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { RADIUS, SHADOWS, SPACING } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: CardElement;
  index: number;
  renderElement: (el: DCElement, idx: number) => React.ReactNode;
}

export const CardBlockRenderer: React.FC<Props> = ({ element, index, renderElement }) => {
  const anim = useElementAnimation(element.animation, index);
  const bg = element.bgColor ?? C.white;
  const border = element.borderColor ?? C.gray200;
  const radius = element.borderRadius ?? RADIUS.lg;
  const shadow = SHADOWS[element.shadow ?? "md"];
  const padding = element.padding ?? SPACING["2xl"];

  const accentStyle: React.CSSProperties = {};
  if (element.accentBorder) {
    const { side, color, width = 4 } = element.accentBorder;
    const prop = `border${side.charAt(0).toUpperCase() + side.slice(1)}` as
      "borderLeft" | "borderTop" | "borderBottom" | "borderRight";
    accentStyle[prop] = `${width}px solid ${color}`;
  }

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
      }}
    >
      <div
        style={{
          backgroundColor: bg,
          border: `1px solid ${border}`,
          borderRadius: radius,
          boxShadow: shadow,
          padding,
          display: "flex",
          flexDirection: "column",
          gap: SPACING.base,
          ...accentStyle,
        }}
      >
        {element.children.map((child, i) => renderElement(child, i))}
      </div>
    </div>
  );
};
