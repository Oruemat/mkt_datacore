import React from "react";
import { AbsoluteFill } from "remotion";
import type { DCComposition, DCElement, LayoutMode } from "../types/composition";
import { GradientBackground } from "../components/backgrounds/GradientBackground";
import { GridPattern } from "../components/backgrounds/GridPattern";
import { ParticleField } from "../components/backgrounds/ParticleField";
import { ELEMENT_REGISTRY } from "../components/elements";
import { SPACING } from "../presets/spacing";
import { DC_BRAND } from "../presets/brand";

const C = DC_BRAND.colors;

// ── Background Layer ────────────────────────────────────

const BackgroundLayer: React.FC<{ config: DCComposition["background"] }> = ({ config }) => {
  switch (config.type) {
    case "solid":
      return (
        <AbsoluteFill style={{ backgroundColor: config.color ?? C.gray50 }} />
      );
    case "gradient":
      return (
        <GradientBackground
          colors={config.colors ?? [C.gray50, C.white]}
          angle={config.angle ?? 135}
        />
      );
    case "layered":
      return (
        <>
          {config.colors?.length ? (
            <GradientBackground colors={config.colors} angle={config.angle ?? 135} />
          ) : (
            <AbsoluteFill style={{ backgroundColor: config.color ?? C.gray50 }} />
          )}
          {config.particles && (
            <ParticleField
              count={config.particles.count}
              color={config.particles.color}
              speed={config.particles.speed ?? 0.3}
              direction={config.particles.direction ?? "up"}
            />
          )}
          {config.grid && (
            <GridPattern
              type={config.grid.type}
              spacing={config.grid.spacing}
              size={config.grid.size}
              color={config.grid.color}
            />
          )}
          {config.accentDots?.map((dot, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.x,
                top: dot.y,
                width: dot.size ?? 200,
                height: dot.size ?? 200,
                borderRadius: "50%",
                backgroundColor: dot.color,
                opacity: 0.15,
                filter: `blur(${dot.blur ?? 64}px)`,
              }}
            />
          ))}
        </>
      );
    default:
      return <AbsoluteFill style={{ backgroundColor: C.gray50 }} />;
  }
};

// ── Layout Container ────────────────────────────────────

function getLayoutStyle(layout: LayoutMode, gap: number): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    gap,
  };

  switch (layout) {
    case "vertical-spread":
      return { ...base, flexDirection: "column", justifyContent: "space-between" };
    case "vertical-center":
      return { ...base, flexDirection: "column", justifyContent: "center", alignItems: "center" };
    case "vertical-start":
      return { ...base, flexDirection: "column", justifyContent: "flex-start" };
    case "vertical-end":
      return { ...base, flexDirection: "column", justifyContent: "flex-end" };
    case "split-horizontal":
      return { ...base, flexDirection: "row", alignItems: "stretch" };
    case "grid-2x2":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap,
        width: "100%",
        height: "100%",
      };
    default:
      return { ...base, flexDirection: "column", justifyContent: "space-between" };
  }
}

// ── Element Renderer ────────────────────────────────────

function renderElement(el: DCElement, idx: number): React.ReactNode {
  const Renderer = ELEMENT_REGISTRY[el.type];
  if (!Renderer) {
    console.warn(`[DCCompositionRenderer] Unknown element type: "${el.type}"`);
    return null;
  }
  return <Renderer key={idx} element={el} index={idx} renderElement={renderElement} />;
}

// ── Main Renderer ───────────────────────────────────────

export const DCCompositionRenderer: React.FC<{ composition: DCComposition }> = ({ composition }) => {
  const { background, layout, padding, gap = SPACING.xl, elements } = composition;
  const padH = padding?.horizontal ?? SPACING["4xl"];
  const padV = padding?.vertical ?? SPACING["4xl"];

  // Separate bottom-positioned elements (e.g., logo with position="bottom")
  const inlineElements: DCElement[] = [];
  const bottomElements: DCElement[] = [];

  for (const el of elements) {
    if (el.type === "logo" && el.position === "bottom") {
      bottomElements.push(el);
    } else {
      inlineElements.push(el);
    }
  }

  return (
    <AbsoluteFill>
      <BackgroundLayer config={background} />
      <AbsoluteFill
        style={{
          padding: `${padV}px ${padH}px`,
        }}
      >
        <div style={getLayoutStyle(layout, gap)}>
          {inlineElements.map((el, idx) => renderElement(el, idx))}
        </div>
      </AbsoluteFill>
      {bottomElements.map((el, idx) => renderElement(el, inlineElements.length + idx))}
    </AbsoluteFill>
  );
};
