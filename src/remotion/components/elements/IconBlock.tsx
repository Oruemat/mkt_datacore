import React from "react";
import type { IconElement } from "../../types/composition";
import { RADIUS } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

interface Props {
  element: IconElement;
  index: number;
}

export const IconBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const size = element.size ?? 48;
  const hasBg = !!element.bgColor;

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      <div
        style={{
          width: hasBg ? size * 1.6 : undefined,
          height: hasBg ? size * 1.6 : undefined,
          borderRadius: element.bgRadius ?? RADIUS.md,
          backgroundColor: element.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size,
          lineHeight: 1,
        }}
      >
        {element.emoji}
      </div>
    </div>
  );
};
