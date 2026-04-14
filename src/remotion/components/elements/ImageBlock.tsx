import React from "react";
import type { ImageElement } from "../../types/composition";
import { RADIUS } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

interface Props {
  element: ImageElement;
  index: number;
}

export const ImageBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const borderRadius = element.borderRadius ?? RADIUS.md;
  const objectFit = element.objectFit ?? "cover";

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={element.src}
        alt=""
        style={{
          width: element.width ?? "100%",
          height: element.height ?? "auto",
          borderRadius,
          objectFit,
          display: "block",
        }}
      />
    </div>
  );
};
