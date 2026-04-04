"use client";

import dynamic from "next/dynamic";
import type { BrandbookVerdict, Platform } from "@/lib/agent/types";
import type { DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import { PostPreview } from "./PostPreview";
import { CarouselPreview } from "./CarouselPreview";
import { ReelPreview } from "./ReelPreview";
import { CalendarPreview } from "./CalendarPreview";
import { VisualEditor } from "./VisualEditor";

// Lazy-load Remotion Player to avoid SSR issues and reduce initial bundle
const RemotionPreview = dynamic(() => import("./RemotionPreview").then((m) => ({ default: m.RemotionPreview })), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-dc-muted/20 bg-dc-navy p-8 text-center">
      <div className="animate-pulse text-dc-muted text-sm">Cargando preview visual...</div>
    </div>
  ),
});

interface CarouselSlideData {
  slideNumber: number;
  title: string;
  body: string;
  designNotes: string;
}

interface ReelScriptData {
  hook: string;
  problem: string;
  solution: string;
  result: string;
  cta: string;
  durationSeconds: number;
  scenes?: Array<{
    timeRange: string;
    label: string;
    visual: string;
    audio: string;
    text_overlay: string;
  }>;
}

interface CalendarEntryData {
  date: string;
  platform: string;
  format: string;
  pillar: string;
  topic: string;
  time: string;
}

export type ContentType = "post" | "carousel" | "reel" | "calendar" | "email" | "lead" | "report" | "brandbook";

interface ApprovalPanelProps {
  contentType: ContentType;
  copy: string | null;
  hashtags?: string[];
  platform: Platform;
  variantB?: string;
  visualSuggestion?: string;
  imagePrompt?: string;
  imageTemplate?: string;
  imageTitle?: string;
  subtitle?: string;
  brandVerdict: BrandbookVerdict | null;
  carouselSlides?: CarouselSlideData[];
  reelScript?: ReelScriptData;
  calendarEntries?: CalendarEntryData[];
  // Remotion props
  remotionPostProps?: DCPostVisualProps;
  remotionCarouselProps?: DCCarouselProps;
  remotionReelProps?: DCReelProps;
  // Callbacks
  onApprove: () => void;
  onReject: () => void;
  onDownloadImage: () => void;
  onDownloadVideo?: () => void;
  onCopyText: () => void;
  onUpdatePostProps?: (updates: Partial<DCPostVisualProps>) => void;
  isRunning: boolean;
  isRendering?: boolean;
}

export function ApprovalPanel({
  contentType,
  copy,
  hashtags,
  platform,
  variantB,
  visualSuggestion,
  imagePrompt,
  brandVerdict,
  carouselSlides,
  reelScript,
  calendarEntries,
  remotionPostProps,
  remotionCarouselProps,
  remotionReelProps,
  onApprove,
  onReject,
  onDownloadImage,
  onDownloadVideo,
  onUpdatePostProps,
  onCopyText,
  isRunning,
  isRendering,
}: ApprovalPanelProps) {
  const canApprove = brandVerdict === "APROBADO" || brandVerdict === "AJUSTE_MENOR";
  const hasContent = copy || (carouselSlides && carouselSlides.length > 0) || reelScript || (calendarEntries && calendarEntries.length > 0);

  const hasRemotionPreview =
    (contentType === "post" && remotionPostProps) ||
    (contentType === "carousel" && remotionCarouselProps) ||
    (contentType === "reel" && remotionReelProps);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dc-muted/20">
        <h2 className="text-sm font-semibold text-white">Preview & Aprobacion</h2>
        {brandVerdict && (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              brandVerdict === "APROBADO"
                ? "bg-green-500/20 text-green-400"
                : brandVerdict === "AJUSTE_MENOR"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {brandVerdict}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!hasContent ? (
          <div className="text-center text-dc-muted text-sm py-12">
            <p>El contenido generado aparecera aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Remotion Visual Preview ────────────── */}
            {hasRemotionPreview && (
              <RemotionPreview
                contentType={contentType}
                postProps={remotionPostProps}
                carouselProps={remotionCarouselProps}
                reelProps={remotionReelProps}
              />
            )}

            {/* ── Visual Editor Controls ─────────────── */}
            {hasRemotionPreview && (
              <VisualEditor
                contentType={contentType}
                postProps={remotionPostProps}
                onUpdatePostProps={onUpdatePostProps}
              />
            )}

            {/* ── Text-based Previews ───────────────── */}
            {contentType === "post" && copy && (
              <PostPreview
                copy={copy}
                hashtags={hashtags}
                platform={platform}
                variantB={variantB}
                visualSuggestion={visualSuggestion}
              />
            )}

            {contentType === "carousel" && carouselSlides && carouselSlides.length > 0 && (
              <CarouselPreview slides={carouselSlides} />
            )}

            {contentType === "reel" && reelScript && (
              <ReelPreview script={reelScript} />
            )}

            {contentType === "calendar" && calendarEntries && calendarEntries.length > 0 && (
              <CalendarPreview entries={calendarEntries} />
            )}

            {/* Raw content fallback */}
            {(contentType === "email" || contentType === "lead" || contentType === "report" || contentType === "brandbook") && copy && (
              <div className="bg-dc-navy/50 border border-dc-muted/20 rounded-lg p-4">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {copy}
                </pre>
              </div>
            )}

            {/* Image Prompt for external AI tools */}
            {imagePrompt && (
              <div className="bg-dc-navy/50 border border-dc-orange/30 rounded-lg">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs font-semibold text-dc-orange uppercase tracking-wider">
                    Prompt para IA externa
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(imagePrompt)}
                    className="text-xs px-2.5 py-1 bg-dc-orange/20 text-dc-orange rounded-md hover:bg-dc-orange/30 transition-colors font-medium"
                  >
                    Copiar prompt
                  </button>
                </div>
                <div className="px-3 pb-3">
                  <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{imagePrompt}</p>
                  <p className="text-[10px] text-dc-muted mt-2">
                    Pega este prompt en Perplexity, DALL-E, o Midjourney para generar una imagen profesional.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Action Buttons ──────────────────────── */}
      {hasContent && (
        <div className="p-4 border-t border-dc-muted/20 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onCopyText}
              className="flex-1 px-3 py-2 text-sm bg-dc-muted/20 text-white rounded-lg hover:bg-dc-muted/30 transition-colors"
            >
              Copiar texto
            </button>
            {(contentType === "post" || contentType === "carousel") && (
              <button
                onClick={onDownloadImage}
                disabled={isRendering}
                className="flex-1 px-3 py-2 text-sm bg-dc-sky/20 text-dc-sky rounded-lg hover:bg-dc-sky/30 transition-colors disabled:opacity-40"
              >
                {isRendering ? "Renderizando..." : "Descargar PNG"}
              </button>
            )}
            {contentType === "reel" && onDownloadVideo && (
              <button
                onClick={onDownloadVideo}
                disabled={isRendering}
                className="flex-1 px-3 py-2 text-sm bg-dc-orange/20 text-dc-orange rounded-lg hover:bg-dc-orange/30 transition-colors disabled:opacity-40"
              >
                {isRendering ? "Renderizando..." : "Descargar MP4"}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReject}
              disabled={isRunning}
              className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-40"
            >
              Rechazar y regenerar
            </button>
            <button
              onClick={onApprove}
              disabled={!canApprove || isRunning}
              className="flex-1 px-3 py-2 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                !canApprove
                  ? "El brandbook enforcer debe aprobar antes de continuar"
                  : ""
              }
            >
              Aprobar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
