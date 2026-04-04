"use client";

import type { ContentType } from "./ContentPanel";
import type { BrandbookVerdict } from "@/lib/agent/types";

interface ActionBarProps {
  contentType: ContentType;
  brandVerdict: BrandbookVerdict | null;
  hasContent: boolean;
  isRunning: boolean;
  isRendering: boolean;
  renderStatus: "idle" | "rendering_png" | "rendering_mp4" | "done";
  readyPngUrl: string | null;
  readyMp4Url: string | null;
  hasUnappliedEdits: boolean;
  onCopyText: () => void;
  onDownloadImage: () => void;
  onDownloadVideo?: () => void;
  onApplyEdits: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function DownloadButton({
  label,
  readyUrl,
  isRendering,
  renderingLabel,
  fileName,
  onFallback,
  accent = "blue",
}: {
  label: string;
  readyUrl: string | null;
  isRendering: boolean;
  renderingLabel: string;
  fileName: string;
  onFallback: () => void;
  accent?: "blue" | "orange";
}) {
  const colors = accent === "blue"
    ? "bg-dc-blue-50 text-dc-blue-600 hover:bg-dc-blue-100"
    : "bg-dc-orange-50 text-dc-orange-500 hover:bg-dc-orange-100";

  if (readyUrl) {
    return (
      <a
        href={readyUrl}
        download={fileName}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl transition text-center flex items-center justify-center gap-1.5 ${colors}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {label}
      </a>
    );
  }

  if (isRendering) {
    return (
      <button disabled className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl opacity-60 flex items-center justify-center gap-1.5 ${colors}`}>
        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {renderingLabel}
      </button>
    );
  }

  return (
    <button
      onClick={onFallback}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl transition ${colors}`}
    >
      {label}
    </button>
  );
}

export function ActionBar({
  contentType,
  brandVerdict,
  hasContent,
  isRunning,
  renderStatus,
  readyPngUrl,
  readyMp4Url,
  hasUnappliedEdits,
  onCopyText,
  onDownloadImage,
  onDownloadVideo,
  onApplyEdits,
  onApprove,
  onReject,
}: ActionBarProps) {
  if (!hasContent) return null;

  const isVisual = contentType === "post" || contentType === "carousel" || contentType === "reel";
  const canApprove = brandVerdict === "APROBADO" || brandVerdict === "AJUSTE_MENOR";

  return (
    <div className="border-t border-dc-gray-200 bg-white px-4 py-3 flex-shrink-0">
      {/* Render progress */}
      {renderStatus !== "idle" && renderStatus !== "done" && (
        <div className="flex items-center justify-center gap-2 mb-2 text-[11px] text-dc-blue-600">
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {renderStatus === "rendering_png" ? "Renderizando PNG..." : "Renderizando MP4..."}
        </div>
      )}

      {/* Brand verdict */}
      {brandVerdict && (
        <div className="flex items-center justify-center mb-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            brandVerdict === "APROBADO" ? "bg-dc-green-50 text-dc-green-600" :
            brandVerdict === "AJUSTE_MENOR" ? "bg-yellow-50 text-yellow-600" :
            "bg-red-50 text-red-600"
          }`}>
            Brand: {brandVerdict}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {/* Copy text */}
        <button
          onClick={onCopyText}
          className="flex-1 px-3 py-2 text-sm font-medium bg-dc-gray-100 text-dc-gray-700 rounded-xl hover:bg-dc-gray-200 transition"
        >
          Copiar texto
        </button>

        {/* Download PNG (post/carousel) */}
        {(contentType === "post" || contentType === "carousel") && (
          <DownloadButton
            label="PNG"
            readyUrl={readyPngUrl}
            isRendering={renderStatus === "rendering_png"}
            renderingLabel="PNG..."
            fileName={`datacore-${contentType}-${Date.now()}.png`}
            onFallback={onDownloadImage}
            accent="blue"
          />
        )}

        {/* Download MP4 (all visual) */}
        {isVisual && onDownloadVideo && (
          <DownloadButton
            label="MP4"
            readyUrl={readyMp4Url}
            isRendering={renderStatus === "rendering_mp4"}
            renderingLabel="MP4..."
            fileName={`datacore-${contentType}-${Date.now()}.mp4`}
            onFallback={onDownloadVideo}
            accent="orange"
          />
        )}
      </div>

      {/* Apply edits — only when editor has pending changes */}
      {hasUnappliedEdits && (
        <div className="mt-2">
          <button
            onClick={onApplyEdits}
            disabled={isRunning || renderStatus === "rendering_png" || renderStatus === "rendering_mp4"}
            className="w-full px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-dc-blue-600 to-dc-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-dc-blue-600/25 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Aplicar cambios y re-renderizar
          </button>
        </div>
      )}

      {/* Approve/Reject */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onReject}
          disabled={isRunning}
          className="flex-1 px-3 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition disabled:opacity-40"
          title="Genera contenido nuevo desde cero"
        >
          Regenerar
        </button>
        <button
          onClick={onApprove}
          disabled={!canApprove || isRunning}
          className="flex-1 px-3 py-2 text-sm font-medium bg-gradient-to-r from-dc-green-600 to-dc-green-700 text-white rounded-xl hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          title={!canApprove ? "El brandbook enforcer debe aprobar antes" : ""}
        >
          Aprobar
        </button>
      </div>
    </div>
  );
}
