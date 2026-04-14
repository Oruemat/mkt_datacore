import React from "react";
import type { RichTextElement } from "../../types/composition";
import { FONT_FAMILIES } from "../../presets/fonts";
import { TYPE_SCALE } from "../../presets/spacing";
import { DC_BRAND } from "../../presets/brand";
import { useElementAnimation } from "./useElementAnimation";

interface Props {
  element: RichTextElement;
  index: number;
}

export const RichTextRenderer: React.FC<Props> = ({ element, index }) => {
  const anim = useElementAnimation(element.animation, index);
  const fontSize = element.fontSize ?? TYPE_SCALE.title;
  const lineHeight = element.lineHeight ?? 1.25;
  const letterSpacing = element.letterSpacing ?? -0.5;
  const textAlign = element.textAlign ?? "left";

  const fontFamilyMap: Record<string, string> = {
    heading: FONT_FAMILIES.heading,
    body: FONT_FAMILIES.body,
    mono: FONT_FAMILIES.mono,
    display: FONT_FAMILIES.display,
    elegant: FONT_FAMILIES.elegant,
  };

  return (
    <div
      style={{
        opacity: anim.opacity,
        transform: anim.transform,
        filter: anim.filter,
        maxWidth: element.maxWidth,
        textAlign,
      }}
    >
      {renderSegments(element.segments, fontSize, lineHeight, letterSpacing, fontFamilyMap)}
    </div>
  );
};

function renderSegments(
  segments: RichTextElement["segments"],
  baseFontSize: number,
  lineHeight: number,
  letterSpacing: number,
  fontFamilyMap: Record<string, string>,
) {
  // Split segments by \n to handle line breaks
  const lines: Array<typeof segments> = [[]];
  for (const seg of segments) {
    const parts = seg.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) {
        lines[lines.length - 1].push({ ...seg, text: part });
      }
    });
  }

  return (
    <div style={{ fontFamily: FONT_FAMILIES.heading }}>
      {lines.map((lineSegments, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            fontSize: baseFontSize,
            lineHeight,
            letterSpacing,
            minHeight: lineSegments.length === 0 ? baseFontSize * lineHeight * 0.5 : undefined,
          }}
        >
          {lineSegments.map((seg, segIdx) => (
            <span
              key={segIdx}
              style={{
                color: seg.color ?? DC_BRAND.colors.gray900,
                fontWeight: seg.fontWeight ?? 400,
                fontSize: seg.fontSize ?? baseFontSize,
                fontFamily: seg.fontFamily ? fontFamilyMap[seg.fontFamily] : undefined,
                fontStyle: seg.italic ? "italic" : undefined,
                textDecoration: seg.underline ? "underline" : undefined,
              }}
            >
              {seg.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
