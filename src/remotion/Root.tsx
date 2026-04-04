import React from "react";
import { Composition } from "remotion";
import { DCPostVisual } from "./compositions/DCPostVisual";
import type { DCPostVisualProps } from "./compositions/DCPostVisual";
import { DCCarousel, calculateCarouselDuration } from "./compositions/DCCarousel";
import type { DCCarouselProps } from "./compositions/DCCarousel";
import { DCReel, calculateReelDuration } from "./compositions/DCReel";
import type { DCReelProps } from "./compositions/DCReel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

const defaultPostProps: DCPostVisualProps = {
  template: "hero",
  title: "DataCore",
  subtitle: "Decisiones basadas en datos",
};

const defaultCarouselProps: DCCarouselProps = {
  slides: [
    { slideNumber: 1, title: "Portada", body: "Subtitulo" },
    { slideNumber: 2, title: "Problema", body: "Descripcion" },
    { slideNumber: 3, title: "Solucion", body: "Descripcion" },
    { slideNumber: 4, title: "CTA", body: "Contactanos" },
  ],
};

const defaultReelProps: DCReelProps = {
  hook: "Sabias que...",
  problem: "El problema principal",
  solution: "La solucion DataCore",
  result: "El resultado",
  cta: "Evalua tu situacion gratis",
  durationSeconds: 35,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DCPostVisual"
        component={DCPostVisual as AnyComponent}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultPostProps}
      />
      <Composition
        id="DCCarousel"
        component={DCCarousel as AnyComponent}
        durationInFrames={calculateCarouselDuration(defaultCarouselProps.slides.length)}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultCarouselProps}
      />
      <Composition
        id="DCReel"
        component={DCReel as AnyComponent}
        durationInFrames={calculateReelDuration(35)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultReelProps}
      />
    </>
  );
};
