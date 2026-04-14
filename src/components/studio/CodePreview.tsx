"use client";

import { useState, useCallback, useEffect } from "react";
import type { DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import type { ContentType } from "./ContentPanel";

interface CodePreviewProps {
  contentType: ContentType;
  postProps?: DCPostVisualProps;
  carouselProps?: DCCarouselProps;
  reelProps?: DCReelProps;
  onUpdatePostProps?: (updates: Partial<DCPostVisualProps>) => void;
  onUpdateCarouselProps?: (updates: Partial<DCCarouselProps>) => void;
  onUpdateReelProps?: (updates: Partial<DCReelProps>) => void;
}

function formatValue(value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === undefined || value === null) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (typeof value[0] === "string") {
      return `[\n${value.map((v) => `${pad}  "${v}"`).join(",\n")}\n${pad}]`;
    }
    return `[\n${value.map((v) => `${pad}  ${formatValue(v, indent + 1)}`).join(",\n")}\n${pad}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return "{}";
    return `{\n${entries.map(([k, v]) => `${pad}  ${k}: ${formatValue(v, indent + 1)}`).join(",\n")}\n${pad}}`;
  }
  return String(value);
}

function generatePostTsx(props: DCPostVisualProps): string {
  const lines = [`<DCPostVisual`];
  const entries = Object.entries(props).filter(([, v]) => v !== undefined);
  for (const [key, value] of entries) {
    if (typeof value === "string") {
      lines.push(`  ${key}="${value}"`);
    } else {
      lines.push(`  ${key}={${formatValue(value, 1)}}`);
    }
  }
  lines.push(`/>`);
  return lines.join("\n");
}

function generateCarouselTsx(props: DCCarouselProps): string {
  const lines = [`<DCCarousel`];
  lines.push(`  slides={${formatValue(props.slides, 1)}}`);
  lines.push(`/>`);
  return lines.join("\n");
}

function generateReelTsx(props: DCReelProps): string {
  const lines = [`<DCReel`];
  const simpleKeys: (keyof DCReelProps)[] = ["hook", "problem", "solution", "result", "cta"];
  for (const key of simpleKeys) {
    if (props[key] !== undefined) {
      lines.push(`  ${key}="${props[key]}"`);
    }
  }
  if (props.durationSeconds) lines.push(`  durationSeconds={${props.durationSeconds}}`);
  if (props.scenes) {
    lines.push(`  scenes={${formatValue(props.scenes, 1)}}`);
  }
  lines.push(`/>`);
  return lines.join("\n");
}

export function CodePreview({
  contentType,
  postProps,
  carouselProps,
  reelProps,
  onUpdatePostProps,
  onUpdateCarouselProps,
  onUpdateReelProps,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"tsx" | "json">("json");
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  // Current props as JSON
  const currentJson = useCallback(() => {
    if (contentType === "post" && postProps) return JSON.stringify(postProps, null, 2);
    if (contentType === "carousel" && carouselProps) return JSON.stringify(carouselProps, null, 2);
    if (contentType === "reel" && reelProps) return JSON.stringify(reelProps, null, 2);
    return "{}";
  }, [contentType, postProps, carouselProps, reelProps]);

  // Sync jsonText when props change externally (not while user is editing)
  useEffect(() => {
    setJsonText(currentJson());
    setParseError(null);
  }, [currentJson]);

  let code = "// No hay visual generado";
  if (contentType === "post" && postProps) {
    code = generatePostTsx(postProps);
  } else if (contentType === "carousel" && carouselProps) {
    code = generateCarouselTsx(carouselProps);
  } else if (contentType === "reel" && reelProps) {
    code = generateReelTsx(reelProps);
  }

  function handleCopy() {
    navigator.clipboard.writeText(view === "tsx" ? code : jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleJsonChange(newText: string) {
    setJsonText(newText);
    setParseError(null);
  }

  function applyJsonChanges() {
    try {
      const parsed = JSON.parse(jsonText);
      setParseError(null);

      if (contentType === "post" && onUpdatePostProps) {
        onUpdatePostProps(parsed as Partial<DCPostVisualProps>);
      } else if (contentType === "carousel" && onUpdateCarouselProps) {
        onUpdateCarouselProps(parsed as Partial<DCCarouselProps>);
      } else if (contentType === "reel" && onUpdateReelProps) {
        onUpdateReelProps(parsed as Partial<DCReelProps>);
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "JSON invalido");
    }
  }

  // Check if user has made edits to JSON
  const hasJsonEdits = jsonText !== currentJson();

  return (
    <div className="space-y-3">
      {/* View toggle + Copy + Apply */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-dc-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("tsx")}
            className={`text-[11px] px-2.5 py-1 rounded-md transition ${
              view === "tsx" ? "bg-white text-dc-gray-900 shadow-sm" : "text-dc-gray-500"
            }`}
          >
            TSX
          </button>
          <button
            onClick={() => setView("json")}
            className={`text-[11px] px-2.5 py-1 rounded-md transition ${
              view === "json" ? "bg-white text-dc-gray-900 shadow-sm" : "text-dc-gray-500"
            }`}
          >
            JSON Props
          </button>
        </div>
        <div className="flex gap-1.5">
          {view === "json" && hasJsonEdits && (
            <button
              onClick={applyJsonChanges}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-dc-green-50 text-dc-green-600 hover:bg-dc-green-100 transition flex items-center gap-1 font-medium border border-dc-green-200"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Aplicar
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-dc-blue-50 text-dc-blue-600 hover:bg-dc-blue-100 transition flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code block */}
      <div className="bg-dc-gray-900 rounded-xl overflow-hidden">
        {view === "tsx" ? (
          <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-dc-gray-100">
            <code>{code}</code>
          </pre>
        ) : (
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl/Cmd+Enter to apply
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && hasJsonEdits) {
                e.preventDefault();
                applyJsonChanges();
              }
              // Tab inserts 2 spaces
              if (e.key === "Tab") {
                e.preventDefault();
                const target = e.target as HTMLTextAreaElement;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const newText = jsonText.substring(0, start) + "  " + jsonText.substring(end);
                setJsonText(newText);
                requestAnimationFrame(() => {
                  target.selectionStart = target.selectionEnd = start + 2;
                });
              }
            }}
            spellCheck={false}
            className="w-full p-4 bg-transparent text-[12px] leading-relaxed font-mono text-dc-gray-100 resize-none focus:outline-none min-h-[300px]"
            style={{ minHeight: Math.max(300, jsonText.split("\n").length * 18 + 32) }}
          />
        )}
      </div>

      {/* Error / hint */}
      {parseError && (
        <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-1.5 border border-red-200">
          Error: {parseError}
        </p>
      )}

      <p className="text-[10px] text-dc-gray-400">
        {view === "tsx"
          ? "Codigo del componente Remotion (solo lectura). Cambia a JSON Props para editar."
          : hasJsonEdits
            ? "Editaste el JSON. Presiona Aplicar o Ctrl+Enter para aplicar cambios al preview."
            : "Edita directamente el JSON para modificar el visual. Los cambios se aplican con el boton Aplicar."}
      </p>
    </div>
  );
}
