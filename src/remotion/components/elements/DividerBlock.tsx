import React from "react";
import type { DividerElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: DividerElement;
  index: number;
}

export const DividerBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const height = element.height ?? 4;
  const width = element.width ?? "100%";
  const style = element.style ?? "line";

  let background: string;
  if (style === "gradient" && element.colors?.length) {
    background = `linear-gradient(90deg, ${element.colors.join(", ")})`;
  } else if (style === "dots") {
    const dotColor = element.color ?? C.gray300;
    background = `repeating-linear-gradient(90deg, ${dotColor} 0px, ${dotColor} 4px, transparent 4px, transparent 12px)`;
  } else {
    background = element.color ?? C.gray200;
  }

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      <div
        style={{
          width,
          height,
          borderRadius: height / 2,
          background,
        }}
      />
    </div>
  );
};
