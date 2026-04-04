"use client";

import { useState, useCallback } from "react";

interface CarouselPreviewProps {
  slides: Array<{
    slideNumber: number;
    title: string;
    body: string;
    designNotes: string;
  }>;
}

export function CarouselPreview({ slides }: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = slides.length;
  const slide = slides[currentIndex];

  const goTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < total) setCurrentIndex(idx);
    },
    [total],
  );

  if (!slide) return null;

  return (
    <div className="space-y-3">
      {/* Slide card */}
      <div className="relative bg-white border border-dc-gray-200 rounded-2xl overflow-hidden shadow-card">
        {/* Nav arrows */}
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-sm text-dc-gray-600 flex items-center justify-center hover:bg-white disabled:opacity-30 transition"
          aria-label="Slide anterior"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === total - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-sm text-dc-gray-600 flex items-center justify-center hover:bg-white disabled:opacity-30 transition"
          aria-label="Slide siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        {/* Slide content */}
        <div className="p-6 min-h-[220px] flex flex-col">
          <span className="self-start text-xs font-mono bg-dc-blue-50 text-dc-blue-600 px-2 py-0.5 rounded-full font-medium mb-3">
            {slide.slideNumber}/{total}
          </span>
          <h3 className="text-lg font-display font-bold text-dc-gray-900 mb-2 leading-tight">
            {slide.title}
          </h3>
          <p className="text-sm text-dc-gray-600 leading-relaxed flex-1 whitespace-pre-wrap">
            {slide.body}
          </p>
          {slide.designNotes && (
            <p className="mt-3 text-xs text-dc-gray-400 border-t border-dc-gray-100 pt-3 italic">
              {slide.designNotes}
            </p>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === currentIndex ? "bg-dc-blue-600 w-5" : "bg-dc-gray-300 w-2 hover:bg-dc-gray-400"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
