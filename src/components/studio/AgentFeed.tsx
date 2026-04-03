"use client";

import { useEffect, useRef } from "react";
import type { AgentStep } from "@/lib/agent/types";
import { StepCard } from "./StepCard";

interface AgentFeedProps {
  steps: AgentStep[];
  isRunning: boolean;
}

export function AgentFeed({ steps, isRunning }: AgentFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dc-muted/20">
        <h2 className="text-sm font-semibold text-white">Agent Feed</h2>
        {isRunning && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dc-electric rounded-full animate-pulse" />
            <span className="text-xs text-dc-muted">Procesando...</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {steps.length === 0 && (
          <div className="text-center text-dc-muted text-sm py-12">
            <p>Selecciona una tarea para ver los pasos del agente</p>
          </div>
        )}
        {steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
