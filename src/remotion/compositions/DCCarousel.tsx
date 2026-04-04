import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/backgrounds/GradientBackground";
import { GridPattern } from "../components/backgrounds/GridPattern";
import { AnimatedTitle } from "../components/text/AnimatedTitle";
import { SafeArea } from "../components/layout/SafeArea";
import { DC_BRAND } from "../presets/brand";
import { FONT_FAMILIES, loadDefaultFonts, loadGoogleFont } from "../presets/fonts";

const C = DC_BRAND.colors;
const FRAMES_PER_SLIDE = 90; // 3 seconds per slide at 30fps

export interface DCCarouselSlide {
  title: string;
  body: string;
  slideNumber: number;
  designNotes?: string;
}

export interface DCCarouselProps {
  slides: DCCarouselSlide[];
}

// ── Shared UI Elements (matching landing page) ─────────

const SlideNumberBadge: React.FC<{ number: number; total: number }> = ({ number, total }) => (
  <div style={{
    position: "absolute", top: 50, right: 60,
    display: "flex", alignItems: "center",
  }}>
    <span style={{
      fontSize: 16, fontFamily: FONT_FAMILIES.mono, fontWeight: 700,
      color: C.blue600, letterSpacing: 1,
    }}>
      {String(number).padStart(2, "0")}
    </span>
    <span style={{ fontSize: 14, color: C.gray400, margin: "0 6px", fontFamily: FONT_FAMILIES.mono }}>/</span>
    <span style={{ fontSize: 14, fontFamily: FONT_FAMILIES.mono, color: C.gray400 }}>
      {String(total).padStart(2, "0")}
    </span>
  </div>
);

const LogoMark: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 40, left: 0, right: 0,
    display: "flex", justifyContent: "center", alignItems: "center",
  }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginRight: 8,
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
      }}>
        <span style={{ color: C.white, fontSize: 11, fontWeight: 800, fontFamily: FONT_FAMILIES.heading }}>DC</span>
      </div>
      <span style={{
        color: C.gray600, fontSize: 12, fontWeight: 600, letterSpacing: 2,
        fontFamily: FONT_FAMILIES.heading,
      }}>
        DataCorePY
      </span>
    </div>
  </div>
);

const Badge: React.FC<{ text: string; color?: "blue" | "orange" | "green" }> = ({ text, color = "blue" }) => {
  const styles = {
    blue: { bg: C.blue100, text: C.blue700 },
    orange: { bg: C.orange100, text: "#C2410C" },
    green: { bg: C.green100, text: C.green700 },
  };
  const s = styles[color];
  return (
    <div style={{
      display: "inline-flex", padding: "6px 16px", borderRadius: 9999,
      backgroundColor: s.bg, fontSize: 13, fontWeight: 600,
      color: s.text, letterSpacing: 1, textTransform: "uppercase" as const,
      fontFamily: FONT_FAMILIES.heading,
    }}>
      {text}
    </div>
  );
};

// ── Cover Slide (light, hero gradient) ─────────

const CoverSlide: React.FC<{ title: string; body: string; total: number }> = ({ title, body, total }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.hero} angle={135} />
      <GridPattern type="dots" spacing={60} size={1.5} color={`${C.blue600}08`} />
      {/* Decorative accent dots */}
      <div style={{
        position: "absolute", top: 80, right: 100, width: 120, height: 120,
        borderRadius: "50%", background: `${C.blue600}10`, filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: 200, left: 80, width: 100, height: 100,
        borderRadius: "50%", background: `${C.orange500}10`, filter: "blur(40px)",
      }} />
      <SafeArea paddingHorizontal={80} paddingVertical={100}>
        {/* Accent line */}
        <div style={{
          position: "absolute", top: 120, left: 80, width: 50, height: 4,
          background: `linear-gradient(90deg, ${C.blue600}, ${C.orange500})`, borderRadius: 2,
        }} />
        <SlideNumberBadge number={1} total={total} />
        <AbsoluteFill style={{ justifyContent: "center" }}>
          <Badge text="DataCorePY" color="blue" />
          <div style={{ height: 20 }} />
          <AnimatedTitle
            text={title}
            fontSize={52}
            fontWeight={800}
            color={C.gray900}
            enterAnimation="slideUp"
            enterDuration={18}
            holdDuration={72}
            exitDuration={0}
            textAlign="left"
            maxWidth="90%"
            letterSpacing={-1}
            lineHeight={1.15}
          />
        </AbsoluteFill>
        {body && (
          <Sequence from={12}>
            <div style={{
              position: "absolute", bottom: 140, left: 0, right: 0,
              opacity: interpolate(frame - 12, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <p style={{
                fontSize: 22, color: C.gray600, fontFamily: FONT_FAMILIES.body, lineHeight: 1.5,
                margin: 0,
              }}>
                {body}
              </p>
            </div>
          </Sequence>
        )}
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── Content Slide (white card on light bg) ─────────

const ContentSlide: React.FC<{
  title: string; body: string; slideNumber: number; total: number;
}> = ({ title, body, slideNumber, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentColors = [C.blue600, C.orange500, C.green600, C.blue600, C.orange500, C.green600];
  const accent = accentColors[(slideNumber - 1) % accentColors.length];

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const bodyOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const slideX = spring({ fps, frame, config: { damping: 14, stiffness: 100 } });
  const translateX = interpolate(slideX, [0, 1], [40, 0]);

  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.lightSection} angle={160 + slideNumber * 10} />
      <GridPattern type="dots" spacing={50} size={1.5} color={`${accent}08`} />
      <SafeArea paddingHorizontal={80} paddingVertical={100}>
        <SlideNumberBadge number={slideNumber} total={total} />
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          height: "100%", transform: `translateX(${translateX}px)`,
        }}>
          {/* White card */}
          <div style={{
            backgroundColor: C.white,
            borderRadius: DC_BRAND.cards.borderRadius,
            border: `1px solid ${C.gray200}`,
            boxShadow: DC_BRAND.cards.shadow,
            padding: DC_BRAND.cards.padding + 8,
            borderLeft: `4px solid ${accent}`,
          }}>
            <div style={{
              fontSize: 14, fontFamily: FONT_FAMILIES.mono, fontWeight: 600,
              color: accent, letterSpacing: 3, marginBottom: 16,
              textTransform: "uppercase" as const, opacity: titleOpacity,
            }}>
              {`PASO ${slideNumber}`}
            </div>
            <h2 style={{
              fontSize: 38, fontFamily: FONT_FAMILIES.heading, fontWeight: 700,
              color: C.gray900, lineHeight: 1.2, margin: "0 0 20px 0",
              opacity: titleOpacity,
            }}>
              {title}
            </h2>
            <p style={{
              fontSize: 22, fontFamily: FONT_FAMILIES.body, fontWeight: 400,
              color: C.gray600, lineHeight: 1.6, margin: 0, maxWidth: "95%",
              opacity: bodyOpacity,
            }}>
              {body}
            </p>
          </div>
        </div>
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── CTA Slide (blue gradient, white text) ─────────

const CTASlide: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleProgress = spring({ fps, frame, config: { damping: 12, stiffness: 80 } });

  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.hero} angle={135} />
      <GridPattern type="dots" spacing={40} size={1.5} color={`${C.blue600}06`} />
      {/* Decorative blurred circles */}
      <div style={{
        position: "absolute", top: 150, right: 100, width: 200, height: 200,
        borderRadius: "50%", background: `${C.blue600}12`, filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: 200, left: 100, width: 180, height: 180,
        borderRadius: "50%", background: `${C.orange500}10`, filter: "blur(50px)",
      }} />
      <SafeArea paddingHorizontal={100} paddingVertical={100}>
        <SlideNumberBadge number={total} total={total} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            textAlign: "center",
            transform: `scale(${interpolate(scaleProgress, [0, 1], [0.9, 1])})`,
          }}>
            {/* DC Logo */}
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 30px",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
            }}>
              <span style={{ color: C.white, fontSize: 24, fontWeight: 800, fontFamily: FONT_FAMILIES.heading }}>DC</span>
            </div>
            <div style={{
              fontSize: 36, fontFamily: FONT_FAMILIES.heading, fontWeight: 700,
              color: C.gray900, marginBottom: 12,
            }}>
              {DC_BRAND.cta.primary}
            </div>
            <div style={{
              fontSize: 20, fontFamily: FONT_FAMILIES.body, color: C.gray600,
              marginBottom: 40,
            }}>
              {DC_BRAND.cta.phone}
            </div>
            {/* CTA button */}
            <div style={{
              display: "inline-flex", padding: "16px 40px", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
            }}>
              <span style={{ fontSize: 18, fontFamily: FONT_FAMILIES.heading, fontWeight: 700, color: C.white }}>
                Agenda tu diagnostico
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </SafeArea>
    </AbsoluteFill>
  );
};

// ── Main Carousel Composition ─────────

export const DCCarousel: React.FC<DCCarouselProps> = ({ slides }) => {
  loadDefaultFonts();
  loadGoogleFont("JetBrains Mono");

  const total = slides.length;

  return (
    <AbsoluteFill>
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * FRAMES_PER_SLIDE} durationInFrames={FRAMES_PER_SLIDE}>
          {i === 0 ? (
            <CoverSlide title={slide.title} body={slide.body} total={total} />
          ) : i === total - 1 ? (
            <CTASlide total={total} />
          ) : (
            <ContentSlide
              title={slide.title}
              body={slide.body}
              slideNumber={slide.slideNumber || i + 1}
              total={total}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const calculateCarouselDuration = (slideCount: number): number =>
  slideCount * FRAMES_PER_SLIDE;
