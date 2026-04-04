"use client";

import { useState, useEffect, useRef } from "react";
import type { AgentStep } from "@/lib/agent/types";
import { StepCard } from "./StepCard";

interface AgentDrawerProps {
  steps: AgentStep[];
  isRunning: boolean;
}

export function AgentDrawer({ steps, isRunning }: AgentDrawerProps) {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps, open]);

  const completedSteps = steps.filter((s) => s.type === "completed" || s.type === "tool_result").length;
  const lastStep = steps[steps.length - 1];

  return (
    <div className="border-t border-dc-gray-200">
      {/* Toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-2.5 text-left hover:bg-dc-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          {isRunning && <div className="w-2 h-2 bg-dc-blue-600 rounded-full animate-pulse" />}
          <span className="text-xs font-medium text-dc-gray-600">
            {isRunning
              ? `Procesando${lastStep?.toolName ? `: ${lastStep.toolName}` : "..."}`
              : steps.length > 0
              ? `Agente: ${completedSteps} pasos completados`
              : "Agente inactivo"}
          </span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-dc-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded feed */}
      {open && (
        <div className="max-h-64 overflow-y-auto p-3 space-y-2 border-t border-dc-gray-100 bg-dc-gray-50">
          {steps.length === 0 && (
            <p className="text-xs text-dc-gray-400 text-center py-4">Sin actividad del agente</p>
          )}
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
