"use client";

import React from "react";
import type { ContentType } from "./ContentPanel";

interface PreviewHeroProps {
  contentType: ContentType;
  children: React.ReactNode;
  meta?: { label: string; dims: string };
}

export function PreviewHero({ contentType, children, meta }: PreviewHeroProps) {
  const isVertical = contentType === "reel";
  const isVisual = contentType === "post" || contentType === "carousel" || contentType === "reel";

  if (!isVisual) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-6 px-4">
      <div
        className={`rounded-2xl overflow-hidden border border-dc-gray-200 shadow-card bg-white ${
          isVertical ? "w-full max-w-[360px]" : "w-full max-w-[540px]"
        }`}
        style={{ aspectRatio: isVertical ? "9/16" : "1/1" }}
      >
        {children}
      </div>

      {meta && (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 bg-dc-blue-50 text-dc-blue-600 rounded-full font-medium">
            {meta.label}
          </span>
          <span className="text-dc-gray-400">
            {meta.dims} · 30fps
          </span>
        </div>
      )}
    </div>
  );
}
