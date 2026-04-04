import React from "react";
import { DC_BRAND } from "../../presets/brand";

export type WatermarkCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface WatermarkProps {
  text?: string;
  corner?: WatermarkCorner;
  opacity?: number;
  margin?: number;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}

export const Watermark: React.FC<WatermarkProps> = ({
  text = DC_BRAND.watermark.text,
  corner = "bottomRight",
  opacity = DC_BRAND.watermark.opacity,
  margin = 30,
  color = "#ffffff",
  fontSize = DC_BRAND.watermark.fontSize,
  style,
}) => {
  const positionStyles: React.CSSProperties = {
    topLeft: { top: margin, left: margin },
    topRight: { top: margin, right: margin },
    bottomLeft: { bottom: margin, left: margin },
    bottomRight: { bottom: margin, right: margin },
  }[corner];

  return (
    <div
      style={{
        position: "absolute",
        opacity,
        ...positionStyles,
        ...style,
      }}
    >
      <span style={{ color, fontSize, fontWeight: 600, letterSpacing: 2 }}>
        {text}
      </span>
    </div>
  );
};
