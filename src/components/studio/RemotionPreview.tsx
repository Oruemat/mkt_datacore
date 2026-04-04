"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import { DCPostVisual } from "@/remotion/compositions/DCPostVisual";
import type { DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";
import { DCCarousel, calculateCarouselDuration } from "@/remotion/compositions/DCCarousel";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import { DCReel, calculateReelDuration } from "@/remotion/compositions/DCReel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import type { ContentType } from "./ContentPanel";
import { PreviewHero } from "./PreviewHero";

interface RemotionPreviewProps {
  contentType: ContentType;
  postProps?: DCPostVisualProps;
  carouselProps?: DCCarouselProps;
  reelProps?: DCReelProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

function PostPlayer({ props }: { props: DCPostVisualProps }) {
  return (
    <Player
      component={DCPostVisual as AnyComponent}
      inputProps={props}
      compositionWidth={1080}
      compositionHeight={1080}
      fps={30}
      durationInFrames={90}
      loop
      autoPlay
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function CarouselPlayer({ props }: { props: DCCarouselProps }) {
  return (
    <Player
      component={DCCarousel as AnyComponent}
      inputProps={props}
      compositionWidth={1080}
      compositionHeight={1080}
      fps={30}
      durationInFrames={calculateCarouselDuration(props.slides.length)}
      controls
      autoPlay
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function ReelPlayer({ props }: { props: DCReelProps }) {
  return (
    <Player
      component={DCReel as AnyComponent}
      inputProps={props}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      durationInFrames={calculateReelDuration(props.durationSeconds || 35)}
      controls
      autoPlay
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function RemotionPreview({
  contentType,
  postProps,
  carouselProps,
  reelProps,
}: RemotionPreviewProps) {
  const meta = useMemo(() => {
    switch (contentType) {
      case "post":
        return postProps ? { label: postProps.template || "hero", dims: "1080x1080" } : null;
      case "carousel":
        return carouselProps ? { label: `${carouselProps.slides.length} slides`, dims: "1080x1080" } : null;
      case "reel":
        return reelProps ? { label: `${reelProps.durationSeconds || 35}s`, dims: "1080x1920" } : null;
      default:
        return null;
    }
  }, [contentType, postProps, carouselProps, reelProps]);

  if (!meta) return null;

  return (
    <PreviewHero contentType={contentType} meta={meta}>
      {contentType === "post" && postProps && <PostPlayer props={postProps} />}
      {contentType === "carousel" && carouselProps && <CarouselPlayer props={carouselProps} />}
      {contentType === "reel" && reelProps && <ReelPlayer props={reelProps} />}
    </PreviewHero>
  );
}
