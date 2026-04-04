import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { DESIGN_SYSTEM_PROMPT, buildDesignContext } from "@/lib/agent/design-prompt";
import { loadDesignFeedback, saveDesignFeedback, formatFeedbackForPrompt } from "@/lib/agent/design-context";
import { analyzeDesignPatterns } from "@/lib/agent/design-changes";

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface DesignChatRequest {
  messages: ChatMessage[];
  visualState: {
    contentType: string;
    template?: string;
    title?: string;
    subtitle?: string;
    metricValue?: string;
    metricLabel?: string;
    comparisonBefore?: string[];
    comparisonAfter?: string[];
    tips?: string[];
    dashboardMetrics?: Array<{ label: string; value: string }>;
    variant?: string;
    copy?: string;
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as DesignChatRequest;
  const { messages, visualState } = body;

  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Load accumulated design feedback + patterns
  const feedback = await loadDesignFeedback();
  const feedbackContext = formatFeedbackForPrompt(feedback);

  let patternsContext = "";
  try {
    const patterns = await analyzeDesignPatterns();
    if (patterns.totalChanges > 5) {
      const parts: string[] = [`\n\n## PATRONES DE DISEÑO (${patterns.totalChanges} cambios registrados)`];
      if (patterns.topStyleChanges.length > 0) {
        parts.push(`Estilos mas cambiados: ${patterns.topStyleChanges.slice(0, 5).map((s) => `${s.property} (${s.count}x${s.avgValue ? `, avg=${s.avgValue}` : ""})`).join(", ")}`);
      }
      if (patterns.topPropChanges.length > 0) {
        parts.push(`Props mas cambiados: ${patterns.topPropChanges.slice(0, 5).map((p) => `${p.property} (${p.count}x)`).join(", ")}`);
      }
      patternsContext = parts.join("\n");
    }
  } catch { /* non-blocking */ }

  // Build full system prompt with current state + feedback + patterns
  const stateContext = buildDesignContext(visualState);
  const systemPrompt = `${DESIGN_SYSTEM_PROMPT}${feedbackContext}${patternsContext}\n\n## ESTADO ACTUAL\n${stateContext}`;

  // Convert messages to Anthropic format
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true,
        });

        let fullText = "";

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = event.delta.text;
            fullText += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text })}\n\n`));
          }
        }

        // Parse feedback commands from response and save them
        const feedbackCommands = extractFeedbackCommands(fullText);
        for (const fb of feedbackCommands) {
          await saveDesignFeedback({
            note: fb.note,
            category: fb.category || "general",
          });
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", fullText })}\n\n`));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`));
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

type FeedbackCategory = "preference" | "rule" | "improvement" | "general";

function extractFeedbackCommands(text: string): Array<{ note: string; category: FeedbackCategory }> {
  const results: Array<{ note: string; category: FeedbackCategory }> = [];
  const match = text.match(/```json:commands\s*\n([\s\S]*?)```/);
  if (!match) return results;

  try {
    const commands = JSON.parse(match[1]) as Array<Record<string, unknown>>;
    for (const cmd of commands) {
      if (cmd.action === "feedback" && typeof cmd.note === "string") {
        const validCategories = ["preference", "rule", "improvement", "general"] as const;
        const cat = validCategories.includes(cmd.category as FeedbackCategory)
          ? (cmd.category as FeedbackCategory)
          : "general";
        results.push({ note: cmd.note, category: cat });
      }
    }
  } catch {
    // ignore parse errors
  }

  return results;
}
