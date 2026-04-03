"use client";

import type { AgentStep } from "@/lib/agent/types";

interface StepCardProps {
  step: AgentStep;
}

export function StepCard({ step }: StepCardProps) {
  const icons: Record<string, string> = {
    thinking: "🧠",
    tool_call: "🔧",
    tool_result: "📋",
    completed: "✅",
    error: "❌",
    approval_needed: "⏳",
  };

  const bgColors: Record<string, string> = {
    thinking: "border-dc-sky/30 bg-dc-sky/5",
    tool_call: "border-dc-electric/30 bg-dc-electric/5",
    tool_result: "border-dc-muted/30 bg-dc-muted/5",
    completed: "border-green-500/30 bg-green-500/5",
    error: "border-red-500/30 bg-red-500/5",
    approval_needed: "border-dc-orange/30 bg-dc-orange/5",
  };

  const time = new Date(step.timestamp).toLocaleTimeString("es-PY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className={`border rounded-lg p-3 ${bgColors[step.type] || "border-dc-muted/20"}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icons[step.type] || "📌"}</span>
          {step.toolName && (
            <span className="text-xs font-mono bg-dc-navy/80 text-dc-sky px-2 py-0.5 rounded">
              {step.toolName}
            </span>
          )}
        </div>
        <span className="text-xs text-dc-muted">{time}</span>
      </div>
      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
        {step.content.length > 800 ? step.content.slice(0, 800) + "..." : step.content}
      </p>
    </div>
  );
}
