"use client";

import type { ContentType } from "./ContentPanel";

export function SkeletonPreview({ contentType }: { contentType: ContentType }) {
  const isVertical = contentType === "reel";
  const isVisual = contentType === "post" || contentType === "carousel" || contentType === "reel";

  if (!isVisual) {
    return (
      <div className="px-4 py-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-dc-gray-100 rounded-xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 px-4">
      <div
        className={`rounded-2xl bg-dc-gray-100 animate-pulse ${
          isVertical ? "w-full max-w-[360px]" : "w-full max-w-[540px]"
        }`}
        style={{ aspectRatio: isVertical ? "9/16" : "1/1" }}
      />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-dc-gray-100 rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-dc-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function IdlePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-16 h-16 rounded-2xl bg-dc-blue-50 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <h3 className="text-base font-display font-semibold text-dc-gray-900 mb-1">
        Crea contenido para DataCore
      </h3>
      <p className="text-sm text-dc-gray-500 max-w-xs">
        Selecciona un tipo de contenido en el panel izquierdo e ingresa un tema para empezar.
      </p>
    </div>
  );
}

export function StepCounter({ current, total, label }: { current: number; total: number; label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <div className="flex gap-1">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i < current ? "bg-dc-blue-600" : i === current ? "bg-dc-blue-600 animate-pulse w-3" : "bg-dc-gray-300"
            }`}
          />
        ))}
      </div>
      {label && <span className="text-xs text-dc-gray-500">{label}</span>}
    </div>
  );
}
