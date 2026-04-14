import React from "react";
import type { DCElement } from "../../types/composition";
import { RichTextRenderer } from "./RichText";
import { BadgeBlockRenderer } from "./BadgeBlock";
import { MetricBlockRenderer } from "./MetricBlock";
import { ChecklistBlockRenderer } from "./ChecklistBlock";
import { CtaBarBlockRenderer } from "./CtaBarBlock";
import { CardBlockRenderer } from "./CardBlock";
import { DividerBlockRenderer } from "./DividerBlock";
import { IconBlockRenderer } from "./IconBlock";
import { SpacerBlockRenderer } from "./SpacerBlock";
import { LogoBlockRenderer } from "./LogoBlock";
import { QuoteBlockRenderer } from "./QuoteBlock";
import { ComparisonBlockRenderer } from "./ComparisonBlock";
import { SparklineBlockRenderer } from "./SparklineBlock";
import { ImageBlockRenderer } from "./ImageBlock";

export interface ElementRendererProps {
  element: DCElement;
  index: number;
  renderElement: (el: DCElement, idx: number) => React.ReactNode;
}

/**
 * Registry mapping element type strings to their React renderers.
 * The CompositionRenderer uses this to look up how to render each element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ELEMENT_REGISTRY: Record<string, React.FC<any>> = {
  richText: RichTextRenderer,
  badge: BadgeBlockRenderer,
  metric: MetricBlockRenderer,
  checklist: ChecklistBlockRenderer,
  ctaBar: CtaBarBlockRenderer,
  card: CardBlockRenderer,
  divider: DividerBlockRenderer,
  icon: IconBlockRenderer,
  spacer: SpacerBlockRenderer,
  logo: LogoBlockRenderer,
  quote: QuoteBlockRenderer,
  comparison: ComparisonBlockRenderer,
  sparkline: SparklineBlockRenderer,
  image: ImageBlockRenderer,
};

export {
  RichTextRenderer,
  BadgeBlockRenderer,
  MetricBlockRenderer,
  ChecklistBlockRenderer,
  CtaBarBlockRenderer,
  CardBlockRenderer,
  DividerBlockRenderer,
  IconBlockRenderer,
  SpacerBlockRenderer,
  LogoBlockRenderer,
  QuoteBlockRenderer,
  ComparisonBlockRenderer,
  SparklineBlockRenderer,
  ImageBlockRenderer,
};
