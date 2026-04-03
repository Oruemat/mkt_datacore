"use client";

import type { Platform } from "@/lib/agent/types";

interface PostPreviewProps {
  copy: string;
  hashtags?: string[];
  platform: Platform;
  variantB?: string;
  visualSuggestion?: string;
}

export function PostPreview({
  copy,
  hashtags,
  platform,
  variantB,
  visualSuggestion,
}: PostPreviewProps) {
  const isInstagram = platform === "instagram";

  return (
    <div className="space-y-4">
      {/* Main preview */}
      <div
        className={`rounded-lg p-5 ${
          isInstagram ? "bg-dc-navy border border-dc-muted/20" : "bg-white border border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-dc-electric rounded-full flex items-center justify-center text-white text-xs font-bold">
            DC
          </div>
          <div>
            <p className={`text-sm font-semibold ${isInstagram ? "text-white" : "text-slate-900"}`}>
              DataCore
            </p>
            <p className="text-xs text-dc-muted">
              {isInstagram ? "Instagram" : "LinkedIn"}
            </p>
          </div>
        </div>

        <div
          className={`text-sm whitespace-pre-wrap leading-relaxed ${
            isInstagram ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {copy}
        </div>

        {hashtags && hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs ${isInstagram ? "text-dc-sky" : "text-dc-electric"}`}
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visual suggestion */}
      {visualSuggestion && (
        <div className="bg-dc-navy/50 border border-dc-muted/20 rounded-lg p-3">
          <p className="text-xs text-dc-muted mb-1">Sugerencia visual:</p>
          <p className="text-sm text-slate-300">{visualSuggestion}</p>
        </div>
      )}

      {/* Variant B */}
      {variantB && (
        <details className="bg-dc-navy/50 border border-dc-muted/20 rounded-lg">
          <summary className="px-3 py-2 text-xs text-dc-muted cursor-pointer hover:text-white">
            Ver Variante B
          </summary>
          <div className="px-3 pb-3 text-sm text-slate-300 whitespace-pre-wrap">
            {variantB}
          </div>
        </details>
      )}
    </div>
  );
}
