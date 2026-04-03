import { runAgentLoop } from "@/lib/agent/loop";
import type { AgentStep, AgentTask, SkillName } from "@/lib/agent/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const body = await request.json();

  const task: AgentTask = {
    id: body.id || `task-${Date.now()}`,
    type: body.type as SkillName,
    platform: body.platform,
    format: body.format,
    pillar: body.pillar,
    topic: body.topic,
    extraContext: body.extraContext,
    createdAt: new Date().toISOString(),
  };

  if (!task.topic || !task.type) {
    return new Response(
      JSON.stringify({ error: "Faltan campos: topic y type son obligatorios" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(event: string, data: unknown) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        await runAgentLoop(task, (step: AgentStep) => {
          sendEvent("step", step);
        });
        sendEvent("done", { message: "Tarea completada" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
