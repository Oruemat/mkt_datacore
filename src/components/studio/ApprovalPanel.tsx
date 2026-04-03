"use client";

import type { BrandbookVerdict, Platform } from "@/lib/agent/types";
import { PostPreview } from "./PostPreview";

interface ApprovalPanelProps {
  copy: string | null;
  hashtags?: string[];
  platform: Platform;
  variantB?: string;
  visualSuggestion?: string;
  brandVerdict: BrandbookVerdict | null;
  onApprove: () => void;
  onReject: () => void;
  onDownloadImage: () => void;
  onCopyText: () => void;
  isRunning: boolean;
}

export function ApprovalPanel({
  copy,
  hashtags,
  platform,
  variantB,
  visualSuggestion,
  brandVerdict,
  onApprove,
  onReject,
  onDownloadImage,
  onCopyText,
  isRunning,
}: ApprovalPanelProps) {
  const canApprove = brandVerdict === "APROBADO" || brandVerdict === "AJUSTE_MENOR";

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
        {!copy ? (
          <div className="text-center text-dc-muted text-sm py-12">
            <p>El contenido generado aparecera aqui</p>
          </div>
        ) : (
          <PostPreview
            copy={copy}
            hashtags={hashtags}
            platform={platform}
            variantB={variantB}
            visualSuggestion={visualSuggestion}
          />
        )}
      </div>

      {/* Action buttons */}
      {copy && (
        <div className="p-4 border-t border-dc-muted/20 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onCopyText}
              className="flex-1 px-3 py-2 text-sm bg-dc-muted/20 text-white rounded-lg hover:bg-dc-muted/30 transition-colors"
            >
              Copiar texto
            </button>
            {platform === "instagram" && (
              <button
                onClick={onDownloadImage}
                className="flex-1 px-3 py-2 text-sm bg-dc-sky/20 text-dc-sky rounded-lg hover:bg-dc-sky/30 transition-colors"
              >
                Descargar PNG
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
