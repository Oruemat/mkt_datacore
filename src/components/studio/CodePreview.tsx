"use client";

import { useState } from "react";
import type { DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import type { ContentType } from "./ContentPanel";

interface CodePreviewProps {
  contentType: ContentType;
  postProps?: DCPostVisualProps;
  carouselProps?: DCCarouselProps;
  reelProps?: DCReelProps;
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

export function CodePreview({ contentType, postProps, carouselProps, reelProps }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  let code = "// No hay visual generado";
  let propsJson = "{}";

  if (contentType === "post" && postProps) {
    code = generatePostTsx(postProps);
    propsJson = JSON.stringify(postProps, null, 2);
  } else if (contentType === "carousel" && carouselProps) {
    code = generateCarouselTsx(carouselProps);
    propsJson = JSON.stringify(carouselProps, null, 2);
  } else if (contentType === "reel" && reelProps) {
    code = generateReelTsx(reelProps);
    propsJson = JSON.stringify(reelProps, null, 2);
  }

  const [view, setView] = useState<"tsx" | "json">("tsx");

  function handleCopy() {
    navigator.clipboard.writeText(view === "tsx" ? code : propsJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      {/* View toggle + Copy */}
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

      {/* Code block */}
      <div className="bg-dc-gray-900 rounded-xl overflow-hidden">
        <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-dc-gray-100">
          <code>{view === "tsx" ? code : propsJson}</code>
        </pre>
      </div>

      <p className="text-[10px] text-dc-gray-400">
        {view === "tsx"
          ? "Codigo del componente Remotion con los props actuales (incluye ediciones del editor y chat)."
          : "Props en formato JSON que alimentan el componente. El Design Chat modifica estos valores."}
      </p>
    </div>
  );
}
