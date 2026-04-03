import Anthropic from "@anthropic-ai/sdk";
import { TOOLS } from "./tools";
import { executeTools } from "./handlers";
import { SYSTEM_PROMPT_MAESTRO, buildTaskPrompt } from "./prompts";
import type { AgentStep, AgentTask } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runAgentLoop(
  task: AgentTask,
  onStep: (step: AgentStep) => void
): Promise<void> {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: buildTaskPrompt(task.topic, task.type, task.platform, task.extraContext),
    },
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8096,
      system: SYSTEM_PROMPT_MAESTRO,
      tools: TOOLS,
      messages,
    });

    // Emit thinking steps from text content
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    for (const block of textBlocks) {
      onStep({
        id: `step-${Date.now()}-text`,
        type: "thinking",
        content: block.text,
        timestamp: new Date().toISOString(),
      });
    }

    // If model finished (no more tool calls)
    if (response.stop_reason === "end_turn") {
      const finalText = textBlocks.map((b) => b.text).join("\n") || "Tarea completada.";
      onStep({
        id: `step-${Date.now()}-done`,
        type: "completed",
        content: finalText,
        timestamp: new Date().toISOString(),
      });
      break;
    }

    // If model wants to call tools
    if (response.stop_reason === "tool_use") {
      const toolResults = await executeTools(response.content, onStep);
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: toolResults as Anthropic.ToolResultBlockParam[],
      });
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    onStep({
      id: `step-${Date.now()}-maxiter`,
      type: "error",
      content: "Se alcanzo el limite de iteraciones (10). La tarea puede estar incompleta.",
      timestamp: new Date().toISOString(),
    });
  }
}
