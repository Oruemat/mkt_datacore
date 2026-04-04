// Compositions
export { DCPostVisual } from "./compositions/DCPostVisual";
export type { DCPostVisualProps, DCTemplate } from "./compositions/DCPostVisual";

export { DCCarousel, calculateCarouselDuration } from "./compositions/DCCarousel";
export type { DCCarouselProps, DCCarouselSlide } from "./compositions/DCCarousel";

export { DCReel, calculateReelDuration } from "./compositions/DCReel";
export type { DCReelProps, DCReelScene } from "./compositions/DCReel";

// Components
export { AnimatedTitle } from "./components/text/AnimatedTitle";
export { GradientBackground } from "./components/backgrounds/GradientBackground";
export { ParticleField } from "./components/backgrounds/ParticleField";
export { GridPattern } from "./components/backgrounds/GridPattern";
export { CallToAction } from "./components/overlays/CallToAction";
export { Watermark } from "./components/overlays/Watermark";
export { ProgressBar } from "./components/overlays/ProgressBar";
export { SafeArea } from "./components/layout/SafeArea";
export { SplitScreen } from "./components/layout/SplitScreen";
export { TRANSITION_PRESETS } from "./components/transitions/TransitionPresets";

// Presets
export { DC_BRAND } from "./presets/brand";
export { PALETTES, GRADIENTS } from "./presets/colors";
export { PLATFORMS, secondsToFrames, framesToSeconds } from "./presets/dimensions";
export { EASINGS } from "./presets/easings";
export { FONT_FAMILIES, loadGoogleFont, loadDefaultFonts } from "./presets/fonts";

// Hooks
export { useAnimation } from "./hooks/useAnimation";

// Utils
export { clamp, lerp, fadeIn, fadeOut, slideIn, enterHoldExit } from "./utils/math";
