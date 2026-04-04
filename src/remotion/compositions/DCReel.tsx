import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AnimatedTitle } from "../components/text/AnimatedTitle";
import { GradientBackground } from "../components/backgrounds/GradientBackground";
import { GridPattern } from "../components/backgrounds/GridPattern";
import { ProgressBar } from "../components/overlays/ProgressBar";
import { Watermark } from "../components/overlays/Watermark";
import { SafeArea } from "../components/layout/SafeArea";
import { DC_BRAND } from "../presets/brand";
import { FONT_FAMILIES, loadDefaultFonts, loadGoogleFont } from "../presets/fonts";
import { secondsToFrames } from "../presets/dimensions";

const C = DC_BRAND.colors;

export interface DCReelScene {
  timeRange: string;
  label: string;
  visual: string;
  audio: string;
  text_overlay: string;
}

export interface DCReelProps {
  hook: string;
  problem: string;
  solution: string;
  result: string;
  cta: string;
  durationSeconds?: number;
  scenes?: DCReelScene[];
}

// Scene durations as percentage of total
const SCENE_WEIGHTS = [0.10, 0.25, 0.30, 0.20, 0.15];

// ── Shared UI Elements ─────────

const SceneLabel: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div style={{
    position: "absolute", top: 100, left: 60,
    display: "inline-flex", padding: "4px 14px", borderRadius: 9999,
    backgroundColor: `${color}15`, fontSize: 12, fontFamily: FONT_FAMILIES.mono,
    fontWeight: 700, color, letterSpacing: 3, textTransform: "uppercase" as const,
  }}>
    {label}
  </div>
);

const LogoMark: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 80, left: 0, right: 0,
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

// ── Hook Scene (hero gradient, big bold text) ─────────

const HookScene: React.FC<{ text: string; overlay?: string }> = ({ text, overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 10, stiffness: 150 } });

  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.hero} angle={180} />
      <GridPattern type="dots" spacing={50} size={1.5} color={`${C.blue600}08`} />
      {/* Decorative blurred circles */}
      <div style={{
        position: "absolute", top: 200, right: 60, width: 200, height: 200,
        borderRadius: "50%", background: `${C.blue600}15`, filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: 400, left: 40, width: 160, height: 160,
        borderRadius: "50%", background: `${C.orange500}12`, filter: "blur(50px)",
      }} />
      <SceneLabel label="GANCHO" color={C.orange500} />
      <SafeArea paddingHorizontal={60} paddingVertical={200}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            textAlign: "center",
            transform: `scale(${interpolate(scale, [0, 1], [0.7, 1])})`,
          }}>
            <div style={{
              fontSize: 56, fontFamily: FONT_FAMILIES.heading, fontWeight: 900,
              color: C.gray900, lineHeight: 1.15, maxWidth: 900,
            }}>
              {text}
            </div>
            {overlay && (
              <div style={{
                fontSize: 24, fontFamily: FONT_FAMILIES.body, color: C.gray600,
                marginTop: 20, opacity: 0.8,
              }}>
                {overlay}
              </div>
            )}
          </div>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── Problem Scene (white card with red accent) ─────────

const ProblemScene: React.FC<{ text: string; overlay?: string }> = ({ text, overlay }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={[C.gray50, C.white]} angle={160} />
      <GridPattern type="crosses" spacing={60} size={2} color="rgba(239, 68, 68, 0.04)" />
      <SceneLabel label="PROBLEMA" color="#DC2626" />
      <SafeArea paddingHorizontal={60} paddingVertical={200}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {/* White card */}
          <div style={{
            backgroundColor: C.white,
            borderRadius: DC_BRAND.cards.borderRadius,
            border: `1px solid ${C.gray200}`,
            borderLeft: "4px solid #DC2626",
            boxShadow: DC_BRAND.cards.shadow,
            padding: 40,
            maxWidth: 900,
            width: "90%",
          }}>
            <div style={{
              fontSize: 42, fontFamily: FONT_FAMILIES.heading, fontWeight: 600,
              color: C.gray900, lineHeight: 1.4, marginBottom: overlay ? 20 : 0,
            }}>
              {text}
            </div>
            {overlay && (
              <div style={{
                opacity: interpolate(frame, [15, 30], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <div style={{
                  fontSize: 20, color: C.gray600, fontFamily: FONT_FAMILIES.body,
                  maxWidth: 800,
                }}>
                  {overlay}
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── Solution Scene (blue accent, clean card) ─────────

const SolutionScene: React.FC<{ text: string; overlay?: string }> = ({ text, overlay }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.lightSection} angle={145} />
      <GridPattern type="dots" spacing={50} size={1.5} color={`${C.blue600}06`} />
      {/* Decorative blue glow */}
      <div style={{
        position: "absolute", top: 300, right: 40, width: 250, height: 250,
        borderRadius: "50%", background: `${C.blue600}10`, filter: "blur(80px)",
      }} />
      <SceneLabel label="SOLUCION" color={C.blue600} />
      <SafeArea paddingHorizontal={60} paddingVertical={200}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            backgroundColor: C.white,
            borderRadius: DC_BRAND.cards.borderRadius,
            border: `1px solid ${C.gray200}`,
            borderLeft: `4px solid ${C.blue600}`,
            boxShadow: DC_BRAND.cards.shadow,
            padding: 40,
            maxWidth: 900,
            width: "90%",
          }}>
            <AnimatedTitle
              text={text}
              fontSize={40}
              fontWeight={700}
              color={C.gray900}
              enterAnimation="scale"
              enterDuration={18}
              holdDuration={200}
              exitDuration={0}
              lineHeight={1.35}
            />
            {overlay && (
              <Sequence from={20}>
                <div style={{
                  marginTop: 20,
                  opacity: interpolate(frame - 20, [0, 15], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}>
                  <div style={{
                    fontSize: 18, color: C.blue600, fontFamily: FONT_FAMILIES.body,
                    maxWidth: 800,
                  }}>
                    {overlay}
                  </div>
                </div>
              </Sequence>
            )}
          </div>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── Result Scene (green accent, big number) ─────────

const ResultScene: React.FC<{ text: string; overlay?: string }> = ({ text, overlay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  loadGoogleFont("JetBrains Mono");
  const scale = spring({ fps, frame, config: { damping: 15, stiffness: 80 } });

  return (
    <AbsoluteFill>
      <GradientBackground colors={[C.white, C.green50]} angle={180} />
      <GridPattern type="lines" spacing={80} size={1} color={`${C.green600}06`} />
      <SceneLabel label="RESULTADO" color={C.green600} />
      <SafeArea paddingHorizontal={60} paddingVertical={200}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            textAlign: "center",
            transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
          }}>
            {/* Result card */}
            <div style={{
              backgroundColor: C.white,
              borderRadius: DC_BRAND.cards.borderRadius,
              border: `1px solid ${C.gray200}`,
              boxShadow: DC_BRAND.cards.shadow,
              padding: 50,
              maxWidth: 900,
            }}>
              <div style={{
                fontSize: 52, fontFamily: FONT_FAMILIES.heading, fontWeight: 800,
                color: C.gray900, lineHeight: 1.2, marginBottom: overlay ? 20 : 0,
              }}>
                {text}
              </div>
              {overlay && (
                <div style={{
                  fontSize: 22, color: C.green600, fontFamily: FONT_FAMILIES.body,
                  marginTop: 10,
                }}>
                  {overlay}
                </div>
              )}
            </div>
          </div>
        </AbsoluteFill>
      </SafeArea>
      <LogoMark />
    </AbsoluteFill>
  );
};

// ── CTA Scene (hero gradient, action button) ─────────

const CTAScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleProgress = spring({ fps, frame, config: { damping: 12, stiffness: 80 } });

  return (
    <AbsoluteFill>
      <GradientBackground colors={DC_BRAND.gradients.hero} angle={135} />
      <GridPattern type="dots" spacing={40} size={1.5} color={`${C.blue600}06`} />
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: 300, right: 60, width: 200, height: 200,
        borderRadius: "50%", background: `${C.blue600}12`, filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: 500, left: 60, width: 180, height: 180,
        borderRadius: "50%", background: `${C.orange500}10`, filter: "blur(50px)",
      }} />
      <SceneLabel label="CTA" color={C.orange500} />
      <SafeArea paddingHorizontal={60} paddingVertical={200}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            textAlign: "center",
            transform: `scale(${interpolate(scaleProgress, [0, 1], [0.9, 1])})`,
          }}>
            {/* DC Logo */}
            <div style={{
              width: 70, height: 70, borderRadius: 16,
              background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 30px",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
            }}>
              <span style={{ color: C.white, fontSize: 28, fontWeight: 800, fontFamily: FONT_FAMILIES.heading }}>DC</span>
            </div>
            <AnimatedTitle
              text={text}
              fontSize={38}
              fontWeight={700}
              color={C.gray900}
              enterAnimation="slideUp"
              enterDuration={15}
              holdDuration={200}
              exitDuration={0}
            />
            <Sequence from={20}>
              <div style={{
                position: "absolute", bottom: 350, left: 0, right: 0,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                opacity: interpolate(frame - 20, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <div style={{
                  fontSize: 18, fontFamily: FONT_FAMILIES.body, color: C.gray600,
                }}>
                  {DC_BRAND.cta.phone}
                </div>
                <div style={{
                  padding: "18px 50px", borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.blue600}, ${C.blue700})`,
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                }}>
                  <span style={{
                    fontSize: 20, fontFamily: FONT_FAMILIES.heading, fontWeight: 700, color: C.white,
                  }}>
                    Link en bio
                  </span>
                </div>
              </div>
            </Sequence>
          </div>
        </AbsoluteFill>
      </SafeArea>
    </AbsoluteFill>
  );
};

// ── Main Reel Composition ─────────

export const DCReel: React.FC<DCReelProps> = ({
  hook, problem, solution, result, cta,
  durationSeconds = 35,
  scenes,
}) => {
  loadDefaultFonts();

  const fps = 30;
  const totalFrames = secondsToFrames(durationSeconds, fps);
  const sceneDurations = SCENE_WEIGHTS.map((w) => Math.round(w * totalFrames));

  // Adjust last scene to match total
  const sum = sceneDurations.reduce((a, b) => a + b, 0);
  sceneDurations[sceneDurations.length - 1] += totalFrames - sum;

  const overlays = scenes?.map((s) => s.text_overlay) || [];

  let frameOffset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      {/* Hook */}
      <Sequence from={frameOffset} durationInFrames={sceneDurations[0]}>
        <HookScene text={hook} overlay={overlays[0]} />
      </Sequence>

      {/* Problem */}
      {(() => { frameOffset += sceneDurations[0]; return null; })()}
      <Sequence from={frameOffset} durationInFrames={sceneDurations[1]}>
        <ProblemScene text={problem} overlay={overlays[1]} />
      </Sequence>

      {/* Solution */}
      {(() => { frameOffset += sceneDurations[1]; return null; })()}
      <Sequence from={frameOffset} durationInFrames={sceneDurations[2]}>
        <SolutionScene text={solution} overlay={overlays[2]} />
      </Sequence>

      {/* Result */}
      {(() => { frameOffset += sceneDurations[2]; return null; })()}
      <Sequence from={frameOffset} durationInFrames={sceneDurations[3]}>
        <ResultScene text={result} overlay={overlays[3]} />
      </Sequence>

      {/* CTA */}
      {(() => { frameOffset += sceneDurations[3]; return null; })()}
      <Sequence from={frameOffset} durationInFrames={sceneDurations[4]}>
        <CTAScene text={cta} />
      </Sequence>

      {/* Progress bar & watermark */}
      <ProgressBar color={C.blue600} height={3} />
      <Watermark corner="topRight" opacity={0.3} margin={50} fontSize={13} />
    </AbsoluteFill>
  );
};

export const calculateReelDuration = (durationSeconds: number, fps = 30): number =>
  secondsToFrames(durationSeconds, fps);
