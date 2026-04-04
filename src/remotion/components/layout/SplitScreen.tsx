import React from "react";
import { AbsoluteFill } from "remotion";

export interface SplitScreenProps {
  direction?: "horizontal" | "vertical";
  ratio?: number;
  gap?: number;
  children: React.ReactNode[];
  style?: React.CSSProperties;
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  direction = "horizontal",
  ratio = 0.5,
  gap = 0,
  children,
  style,
}) => {
  const panels = React.Children.toArray(children).slice(0, 4);
  const isHorizontal = direction === "horizontal";

  if (panels.length === 2) {
    const firstSize = `${ratio * 100}%`;
    const secondSize = `${(1 - ratio) * 100}%`;

    return (
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          ...style,
        }}
      >
        <div
          style={{
            width: isHorizontal ? firstSize : "100%",
            height: isHorizontal ? "100%" : firstSize,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {panels[0]}
        </div>
        <div
          style={{
            width: isHorizontal ? secondSize : "100%",
            height: isHorizontal ? "100%" : secondSize,
            position: "relative",
            overflow: "hidden",
            marginLeft: isHorizontal ? gap : 0,
            marginTop: isHorizontal ? 0 : gap,
          }}
        >
          {panels[1]}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={style}>
      {panels.map((panel, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "50%",
            height: "50%",
            left: i % 2 === 0 ? 0 : "50%",
            top: i < 2 ? 0 : "50%",
            overflow: "hidden",
          }}
        >
          {panel}
        </div>
      ))}
    </AbsoluteFill>
  );
};
