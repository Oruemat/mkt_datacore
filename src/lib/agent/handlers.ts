import Anthropic from "@anthropic-ai/sdk";
import type { AgentStep } from "./types";

type ContentBlock = Anthropic.ContentBlock;

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

function isToolUse(block: ContentBlock): block is ToolUseBlock {
  return block.type === "tool_use";
}

export async function executeTools(
  content: ContentBlock[],
  onStep: (step: AgentStep) => void
): Promise<Anthropic.MessageParam["content"]> {
  const toolBlocks = content.filter(isToolUse);
  const results: Anthropic.ToolResultBlockParam[] = [];

  for (const tool of toolBlocks) {
    onStep({
      id: `step-${Date.now()}-${tool.id}`,
      type: "tool_call",
      content: `Ejecutando: ${tool.name}`,
      toolName: tool.name,
      timestamp: new Date().toISOString(),
    });

    const result = await handleTool(tool.name, tool.input);

    onStep({
      id: `step-${Date.now()}-${tool.id}-result`,
      type: "tool_result",
      content: typeof result === "string" ? result : JSON.stringify(result).slice(0, 500),
      toolName: tool.name,
      timestamp: new Date().toISOString(),
    });

    results.push({
      type: "tool_result",
      tool_use_id: tool.id,
      content: typeof result === "string" ? result : JSON.stringify(result),
    });
  }

  return results;
}

async function handleTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "post_writer_instagram":
      return handlePostWriterInstagram(input);
    case "post_writer_linkedin":
      return handlePostWriterLinkedin(input);
    case "carrusel_writer":
      return handleCarruselWriter(input);
    case "reels_script":
      return handleReelsScript(input);
    case "lead_classifier":
      return handleLeadClassifier(input);
    case "email_sequence_writer":
      return handleEmailSequenceWriter(input);
    case "brandbook_enforcer":
      return handleBrandbookEnforcer(input);
    case "calendar_planner":
      return handleCalendarPlanner(input);
    case "weekly_performance_reporter":
      return handleWeeklyReporter(input);
    default:
      return { error: `Tool desconocido: ${name}` };
  }
}

// ── Tool Handlers ───────────────────────────────────────────
// These handlers return the input back to the model, instructing it to generate
// the actual content. The model acts as both orchestrator AND content generator.
// The tools serve as structured "skill activators" — Claude sees the tool call,
// generates the content in the tool result, and continues the loop.

function handlePostWriterInstagram(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un post de Instagram sobre "${input.topic}" con pilar "${input.pillar}".
Responde con JSON: { "copy": "...", "hashtags": ["..."], "visualSuggestion": "...", "variantB": "...", "brandNote": "..." }
Reglas: max 150 palabras, hook en primera linea, 3-5 hashtags, CTA al final.`,
    context: input,
  };
}

function handlePostWriterLinkedin(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un post de LinkedIn sobre "${input.topic}" con pilar "${input.pillar}".
Responde con JSON: { "copy": "...", "hashtags": ["..."], "visualSuggestion": "...", "variantB": "...", "brandNote": "..." }
Reglas: 200-400 palabras, estructura hook->problema->insight->CTA, max 3 hashtags.`,
    context: input,
  };
}

function handleCarruselWriter(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un carrusel de 7 slides sobre "${input.topic}" para ${input.platform}.
Responde con JSON: { "slides": [{ "slideNumber": 1, "title": "...", "body": "...", "designNotes": "..." }, ...] }
Estructura: portada, problema, causa raiz, solucion DataCore, resultado, tips, CTA.`,
    context: input,
  };
}

function handleReelsScript(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un guion de reel de ${input.durationSeconds || 30}-${input.durationSeconds || 45}s sobre "${input.topic}".
Responde con JSON: { "hook": "...", "problem": "...", "solution": "...", "result": "...", "cta": "...", "durationSeconds": N }
Estructura: [0-3s] gancho, [4-13s] problema, [14-28s] solucion, [29-35s] resultado, [36-45s] CTA.`,
    context: input,
  };
}

function handleLeadClassifier(input: Record<string, unknown>): unknown {
  return {
    instruction: `Clasifica este lead:
Nombre: ${input.name}
Empresa: ${input.company || "No especificada"}
Cargo: ${input.role || "No especificado"}
Mensaje: ${input.message}

Responde con JSON: { "temperature": "CALIENTE|TIBIO|FRIO", "reasoning": "...", "nextStep": "...", "suggestedMessage": "..." }
Criterios BANT Paraguay: CALIENTE=dueno/gerente+problema urgente+empresa mediana, TIBIO=profesional sin decision, FRIO=sin problema claro.`,
    context: input,
  };
}

function handleEmailSequenceWriter(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera secuencia de 5 emails de nurturing a 14 dias para:
Lead: ${input.leadName}, Industria: ${input.industry}, Pain: ${input.painPoint || "general"}

Responde con JSON: { "emails": [{ "day": 1, "subject": "...", "body": "...", "objective": "..." }, ...] }
Dias: 1, 3, 7, 10, 14. Tono personal (de Mathias o Luis), no corporativo.`,
    context: input,
  };
}

function handleBrandbookEnforcer(input: Record<string, unknown>): unknown {
  return {
    instruction: `Audita este contenido contra el brandbook de DataCore:
---
${input.content}
---
Plataforma: ${input.platform}, Tipo: ${input.contentType || "post"}

Checklist:
1. Tono: sin tecnicismos, sin frases prohibidas
2. CTA presente con canal de contacto
3. Hashtags con al menos 2 nivel "Nicho PY" (si aplica)
4. Longitud apropiada para la plataforma
5. Sin metricas inventadas

Responde con JSON: { "verdict": "APROBADO|AJUSTE_MENOR|RECHAZADO", "checks": [{ "rule": "...", "passed": true/false, "note": "..." }], "suggestion": "..." }
Si falla 2+ checks: RECHAZADO. Si falla 1: AJUSTE_MENOR.`,
    context: input,
  };
}

function handleCalendarPlanner(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera calendario editorial para la semana del ${input.weekStartDate}${input.focusTheme ? `, tema central: "${input.focusTheme}"` : ""}.

Responde con JSON: { "entries": [{ "date": "YYYY-MM-DD", "platform": "instagram|linkedin", "format": "post|carrusel|reel", "pillar": "...", "topic": "...", "time": "HH:MM" }, ...] }

Reglas:
- LinkedIn: Mar+Mie+Jue (8am o 12pm PY)
- Instagram: Lun+Mie+Vie+Dom (7pm o 9pm PY)
- No repetir pilar en dias consecutivos
- Alternar formatos
- Distribucion de pilares: educativo 35%, caso_de_uso 25%, behind_scenes 20%, tendencias 10%, comercial 10%`,
    context: input,
  };
}

function handleWeeklyReporter(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera reporte semanal ejecutivo para la semana que termina el ${input.weekEndDate}.
${input.metrics ? `Metricas disponibles: ${JSON.stringify(input.metrics)}` : "Sin metricas reales — genera plantilla con campos a completar."}

Responde con JSON: { "highlights": ["..."], "metrics": { "linkedin": {...}, "instagram": {...}, "leads": {...} }, "topPosts": [...], "recommendations": ["..."] }`,
    context: input,
  };
}
