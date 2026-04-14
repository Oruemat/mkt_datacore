import React from "react";
import type { SpacerElement } from "../../types/composition";

interface Props {
  element: SpacerElement;
  index: number;
}

export const SpacerBlockRenderer: React.FC<Props> = ({ element }) => (
  <div style={{ height: element.height, flexShrink: 0, flexGrow: element.flexGrow ?? 0 }} />
);
