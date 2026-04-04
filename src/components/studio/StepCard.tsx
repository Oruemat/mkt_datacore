"use client";

import type { AgentStep } from "@/lib/agent/types";

const STEP_STYLES: Record<string, { bg: string; label: string }> = {
  thinking: { bg: "bg-dc-blue-50 border-dc-blue-100", label: "Pensando" },
  tool_call: { bg: "bg-dc-orange-50 border-dc-orange-100", label: "Herramienta" },
  tool_result: { bg: "bg-dc-gray-50 border-dc-gray-200", label: "Resultado" },
  completed: { bg: "bg-dc-green-50 border-dc-green-100", label: "Completado" },
  error: { bg: "bg-red-50 border-red-100", label: "Error" },
  approval_needed: { bg: "bg-yellow-50 border-yellow-100", label: "Aprobacion" },
};

export function StepCard({ step }: { step: AgentStep }) {
  const style = STEP_STYLES[step.type] ?? STEP_STYLES.thinking;

  const time = new Date(step.timestamp).toLocaleTimeString("es-PY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className={`border rounded-xl p-3 ${style.bg}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-dc-gray-500 uppercase tracking-wider">{style.label}</span>
          {step.toolName && (
            <span className="text-[10px] font-mono bg-dc-gray-200 text-dc-gray-600 px-1.5 py-0.5 rounded">
              {step.toolName}
            </span>
          )}
        </div>
        <span className="text-[10px] text-dc-gray-400">{time}</span>
      </div>
      <p className="text-xs text-dc-gray-700 whitespace-pre-wrap leading-relaxed">
        {step.content.length > 500 ? step.content.slice(0, 500) + "..." : step.content}
      </p>
    </div>
  );
}
