"use client";

import { useState, useCallback } from "react";
import type { AgentStep, SkillName, Platform, ContentPillar, BrandbookVerdict } from "@/lib/agent/types";
import { TaskPanel } from "@/components/studio/TaskPanel";
import { AgentFeed } from "@/components/studio/AgentFeed";
import { ApprovalPanel } from "@/components/studio/ApprovalPanel";
import { StatusIndicator } from "@/components/studio/StatusIndicator";

type AgentStatus = "idle" | "running" | "completed" | "error";

interface TaskInput {
  type: SkillName;
  topic: string;
  platform?: Platform;
  pillar?: ContentPillar;
  extraContext?: string;
}

export default function StudioPage() {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedVariantB, setGeneratedVariantB] = useState<string | undefined>();
  const [generatedVisualSuggestion, setGeneratedVisualSuggestion] = useState<string | undefined>();
  const [currentPlatform, setCurrentPlatform] = useState<Platform>("instagram");
  const [brandVerdict, setBrandVerdict] = useState<BrandbookVerdict | null>(null);
  const [lastTask, setLastTask] = useState<TaskInput | null>(null);

  const resetOutput = useCallback(() => {
    setGeneratedCopy(null);
    setGeneratedHashtags([]);
    setGeneratedVariantB(undefined);
    setGeneratedVisualSuggestion(undefined);
    setBrandVerdict(null);
  }, []);

  const extractContent = useCallback((step: AgentStep) => {
    if (step.type !== "completed" && step.type !== "thinking") return;
    const content = step.content;
    try {
      const copyRegex = /\{[\s\S]*"copy"[\s\S]*\}/;
      const jsonMatch = content.match(copyRegex);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.copy) setGeneratedCopy(parsed.copy);
        if (parsed.hashtags) setGeneratedHashtags(parsed.hashtags);
        if (parsed.variantB) setGeneratedVariantB(parsed.variantB);
        if (parsed.visualSuggestion) setGeneratedVisualSuggestion(parsed.visualSuggestion);
      }
      const verdictRegex = /\{[\s\S]*"verdict"[\s\S]*\}/;
      const verdictMatch = content.match(verdictRegex);
      if (verdictMatch) {
        const parsed = JSON.parse(verdictMatch[0]);
        if (parsed.verdict) setBrandVerdict(parsed.verdict as BrandbookVerdict);
      }
    } catch {
      if (step.type === "completed") {
        setGeneratedCopy((prev) => prev || content);
      }
    }
  }, []);

  const runAgent = useCallback(async (task: TaskInput) => {
    setSteps([]);
    resetOutput();
    setStatus("running");
    setLastTask(task);
    setCurrentPlatform(task.platform || "instagram");

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (currentEvent === "step") {
                const step = parsed as AgentStep;
                setSteps((prev) => [...prev, step]);
                extractContent(step);
              } else if (currentEvent === "done") {
                setStatus("completed");
              } else if (currentEvent === "error") {
                setStatus("error");
                setSteps((prev) => [...prev, {
                  id: "error-" + Date.now(),
                  type: "error" as const,
                  content: parsed.message,
                  timestamp: new Date().toISOString(),
                }]);
              }
            } catch {
              // skip malformed
            }
          }
        }
      }
      setStatus((prev) => prev === "running" ? "completed" : prev);
    } catch (err) {
      setStatus("error");
      setSteps((prev) => [...prev, {
        id: "error-" + Date.now(),
        type: "error" as const,
        content: err instanceof Error ? err.message : "Error de conexion",
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [resetOutput, extractContent]);

  function handleCopyText() {
    if (!generatedCopy) return;
    const fullText = generatedHashtags.length > 0
      ? generatedCopy + "\n\n" + generatedHashtags.join(" ")
      : generatedCopy;
    navigator.clipboard.writeText(fullText);
  }

  function handleDownloadImage() {
    if (!generatedCopy) return;
    const params = new URLSearchParams({
      copy: generatedCopy,
      hashtags: generatedHashtags.join(","),
      variant: "dark",
    });
    window.open("/api/og?" + params.toString(), "_blank");
  }

  function handleApprove() {
    setBrandVerdict("APROBADO");
  }

  function handleReject() {
    if (lastTask) {
      runAgent({
        ...lastTask,
        extraContext: (lastTask.extraContext || "") + " NOTA: La version anterior fue rechazada. Genera una version diferente con un hook distinto.",
      });
    }
  }

  return (
    <div className="h-screen bg-dc-navy flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-dc-muted/20 bg-dc-navy/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-dc-electric rounded-lg flex items-center justify-center text-white text-xs font-bold">
            DC
          </div>
          <h1 className="text-lg font-display font-bold text-white">DataCore Studio</h1>
        </div>
        <StatusIndicator status={status} />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-dc-muted/20 flex-shrink-0">
          <TaskPanel onSubmit={runAgent} isRunning={status === "running"} />
        </div>
        <div className="flex-1 min-w-0">
          <AgentFeed steps={steps} isRunning={status === "running"} />
        </div>
        <div className="w-96 border-l border-dc-muted/20 flex-shrink-0">
          <ApprovalPanel
            copy={generatedCopy}
            hashtags={generatedHashtags}
            platform={currentPlatform}
            variantB={generatedVariantB}
            visualSuggestion={generatedVisualSuggestion}
            brandVerdict={brandVerdict}
            onApprove={handleApprove}
            onReject={handleReject}
            onDownloadImage={handleDownloadImage}
            onCopyText={handleCopyText}
            isRunning={status === "running"}
          />
        </div>
      </div>
    </div>
  );
}
