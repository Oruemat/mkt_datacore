import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { MetricElement } from "../../types/composition";
import { DC_BRAND } from "../../presets/brand";
import { FONT_FAMILIES, loadGoogleFont } from "../../presets/fonts";
import { TYPE_SCALE, SPACING } from "../../presets/spacing";
import { useElementAnimation } from "./useElementAnimation";

const C = DC_BRAND.colors;

interface Props {
  element: MetricElement;
  index: number;
}

export const MetricBlockRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  loadGoogleFont("JetBrains Mono");

  const scaleProgress = spring({ fps, frame, config: { damping: 15, stiffness: 80 } });
  const scale = interpolate(scaleProgress, [0, 1], [0.85, 1]);
  const gaugeColor = element.gaugeColor ?? C.blue600;
  const valueColor = element.valueColor ?? C.gray900;
  const labelColor = element.labelColor ?? C.gray600;

  const showGauge = element.showGauge ?? false;
  const numericValue = parseInt(element.value.replace(/[^0-9]/g, ""), 10) || 75;
  const circumference = 2 * Math.PI * 80;
  const strokeDash = (numericValue / 100) * circumference * scaleProgress;

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: SPACING.sm,
      }}
    >
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {showGauge && (
          <svg
            width={180}
            height={180}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <circle cx={90} cy={90} r={80} fill="none" stroke={C.gray100} strokeWidth={6} />
            <circle
              cx={90}
              cy={90}
              r={80}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              transform="rotate(-90 90 90)"
            />
          </svg>
        )}
        <span
          style={{
            fontSize: TYPE_SCALE.display,
            fontWeight: 800,
            fontFamily: FONT_FAMILIES.mono,
            color: valueColor,
            transform: `scale(${scale})`,
            display: "inline-block",
            padding: showGauge ? SPACING["3xl"] : 0,
          }}
        >
          {element.value}
        </span>
      </div>
      {element.label && (
        <span
          style={{
            fontSize: TYPE_SCALE.body,
            fontWeight: 600,
            fontFamily: FONT_FAMILIES.heading,
            color: labelColor,
            letterSpacing: 0.5,
            textTransform: "uppercase" as const,
          }}
        >
          {element.label}
        </span>
      )}
    </div>
  );
};
