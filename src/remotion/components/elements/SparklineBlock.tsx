import React from "react";
import type { SparklineElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: SparklineElement;
  index: number;
}

const DEFAULT_DATA = [20, 35, 25, 45, 30, 55, 40, 65, 50, 70];

export const SparklineBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const data = element.data?.length ? element.data : DEFAULT_DATA;
  const color = element.color ?? C.blue600;
  const width = element.width ?? 200;
  const height = element.height ?? 60;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height * 0.8) - height * 0.1}`)
    .join(" ");

  return (
    <div style={{ opacity: anim.opacity, transform: anim.transform, filter: anim.filter }}>
      <svg width={width} height={height}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
