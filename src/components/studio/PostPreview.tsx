"use client";

import type { Platform } from "@/lib/agent/types";

interface PostPreviewProps {
  copy: string;
  hashtags?: string[];
  platform: Platform;
  variantB?: string;
  visualSuggestion?: string;
}

export function PostPreview({ copy, hashtags, platform, variantB, visualSuggestion }: PostPreviewProps) {
  return (
    <div className="space-y-3">
      {/* Main copy card */}
      <div className="bg-white border border-dc-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-dc-blue-600 to-dc-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            DC
          </div>
          <div>
            <p className="text-sm font-semibold text-dc-gray-900">DataCorePY</p>
            <p className="text-xs text-dc-gray-400 capitalize">{platform}</p>
          </div>
        </div>

        <div className="text-sm text-dc-gray-700 whitespace-pre-wrap leading-relaxed">
          {copy}
        </div>

        {hashtags && hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hashtags.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-dc-blue-50 text-dc-blue-600 rounded-full font-medium">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visual suggestion */}
      {visualSuggestion && (
        <div className="bg-dc-gray-50 border border-dc-gray-200 rounded-xl p-3">
          <p className="text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1">Sugerencia visual</p>
          <p className="text-xs text-dc-gray-600 leading-relaxed">{visualSuggestion}</p>
        </div>
      )}

      {/* Variant B */}
      {variantB && (
        <details className="bg-dc-gray-50 border border-dc-gray-200 rounded-xl overflow-hidden">
          <summary className="px-3 py-2 text-xs font-medium text-dc-gray-500 cursor-pointer hover:text-dc-gray-900">
            Ver Variante B
          </summary>
          <div className="px-3 pb-3 text-sm text-dc-gray-700 whitespace-pre-wrap border-t border-dc-gray-200 pt-2">
            {variantB}
          </div>
        </details>
      )}
    </div>
  );
}
