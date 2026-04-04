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

// ── Design context shared across visual tools ──────────────

const DESIGN_CONTEXT = `
IDENTIDAD VISUAL DATACORE (alineada con landing-datacore.vercel.app):
- TEMA: CLARO — fondos blancos y claros, NO oscuros
- Fondo principal: blanco #FFFFFF o gris-50 #F9FAFB
- Gradiente hero: from-blue-50 (#EFF6FF) via-white (#FFFFFF) to-orange-50 (#FFF7ED)
- Color primario: Blue-600 #2563EB (CTAs, botones, links, acentos)
- Acento calido: Orange-500 #F97316 (highlights, max 20% — un solo detalle por pieza)
- Exito/Resultados: Green-600 #16A34A (datos positivos, crecimiento)
- Texto titulos: Gray-900 #111827 (oscuro sobre fondo claro)
- Texto cuerpo: Gray-600 #4B5563
- Tipografia: Inter para cuerpo, Poppins para titulos, JetBrains Mono para datos/metricas
- Cards: fondo blanco, border gray-200 (#E5E7EB), rounded-2xl (16px), shadow-lg
- Badges: rounded-full con fondo de color suave (blue-100, orange-100, green-100)
- Botones CTA: gradiente blue-600 a blue-700, rounded-xl, sombra azul suave
- Estilo: profesional, limpio, moderno, mucho espacio en blanco, sombras suaves
- NO usar fondos oscuros/navy, NO saturacion excesiva, NO estilos caricaturescos

TONO DE COMUNICACION:
- Español paraguayo directo, forma "vos"
- Pain points de negocio reales y relatable
- Slogan: "Deja de decidir por intuicion"
- Mision: "Transformamos datos en decisiones inteligentes"
- CTA principal: "Evalua tu situacion gratis"

TEMPLATES DISPONIBLES PARA IMAGENES:
- "hero": gradiente hero claro (blue-50→white→orange-50), texto grande bold gray-900, badge DataCorePY, circulos decorativos difuminados. MEJOR PARA: hooks, afirmaciones, preguntas provocativas.
- "metric": card blanca con gauge ring SVG, numero grande JetBrains Mono, fondo gris-50. MEJOR PARA: estadisticas, porcentajes, numeros impactantes.
- "comparison": cards lado a lado — ANTES con borde rojo y ❌, AHORA con borde verde y ✅, fondo hero gradient. MEJOR PARA: transformaciones, antes/despues.
- "tips": cards blancas numeradas con borde lateral de color, sobre gradiente hero. MEJOR PARA: listas, consejos, pasos, checklist.
- "dashboard": grid de cards KPI blancas con sparklines, fondo gris-50. MEJOR PARA: reportes, resultados, metricas multiples.
- "statement": texto centrado grande sobre gradiente hero, comilla decorativa gigante. MEJOR PARA: frases poderosas, reflexiones, citas.
`;

// ── Tool Handlers ───────────────────────────────────────────

function handlePostWriterInstagram(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un post de Instagram sobre "${input.topic}" con pilar "${input.pillar}".

${DESIGN_CONTEXT}

IMPORTANTE — SELECCION DE TEMPLATE:
NO uses "hero" a menos que sea un hook o pregunta provocativa SIN datos.
Analiza el contenido y selecciona el template que MEJOR lo represente visualmente:
- Si el copy tiene datos numericos, estadisticas o un KPI central → usa "metric"
- Si el copy compara un antes y despues, o muestra un problema vs solucion → usa "comparison"
- Si el copy tiene una lista de pasos, consejos o beneficios → usa "tips"
- Si el copy menciona multiples metricas, KPIs o resultados → usa "dashboard"
- Si el copy es una frase reflexiva o cita poderosa → usa "statement"
- SOLO si ninguno de los anteriores aplica → usa "hero"

Responde con JSON:
{
  "copy": "texto del post listo para publicar",
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "variantB": "version alternativa del copy con hook diferente",
  "brandNote": "nota si algo se aleja del tono",

  "imageTemplate": "metric|comparison|tips|dashboard|statement|hero",
  "imageTitle": "titulo corto para la imagen (max 8 palabras, impactante)",
  "subtitle": "subtitulo complementario (max 15 palabras)",

  "visualData": {
    "NOTA": "Incluir los campos segun el template seleccionado:",

    "SI imageTemplate=metric": {
      "metricValue": "el numero/KPI central con formato (ej: '85%', '3.2x', '40hrs')",
      "metricLabel": "que mide este numero (ej: 'Reduccion de tiempo', 'ROI promedio')"
    },

    "SI imageTemplate=comparison": {
      "comparisonBefore": ["item negativo 1 (max 8 palabras)", "item negativo 2", "item negativo 3"],
      "comparisonAfter": ["item positivo 1 (max 8 palabras)", "item positivo 2", "item positivo 3"]
    },

    "SI imageTemplate=tips": {
      "tips": ["consejo 1 claro y accionable (max 12 palabras)", "consejo 2", "consejo 3", "consejo 4"]
    },

    "SI imageTemplate=dashboard": {
      "dashboardMetrics": [
        {"label": "nombre KPI", "value": "valor con formato"},
        {"label": "nombre KPI 2", "value": "valor"},
        {"label": "nombre KPI 3", "value": "valor"},
        {"label": "nombre KPI 4", "value": "valor"}
      ]
    }
  },

  "imagePrompt": "prompt para generar imagen con IA externa"
}

REGLAS CRITICAS de visualData:
- Los campos de visualData DEBEN estar en la raiz del JSON, NO anidados dentro de visualData
- Ejemplo CORRECTO para tips: { "imageTemplate": "tips", "imageTitle": "...", "tips": ["tip1", "tip2", "tip3"] }
- Ejemplo CORRECTO para metric: { "imageTemplate": "metric", "imageTitle": "...", "metricValue": "85%", "metricLabel": "Reduccion de tiempo" }
- Ejemplo CORRECTO para comparison: { "imageTemplate": "comparison", "imageTitle": "...", "comparisonBefore": ["..."], "comparisonAfter": ["..."] }
- Ejemplo CORRECTO para dashboard: { "imageTemplate": "dashboard", "imageTitle": "...", "dashboardMetrics": [{"label":"...","value":"..."}] }

Reglas del copy:
- Max 150 palabras
- Primera linea = hook que detiene el scroll
- 3-5 hashtags: 1 Tier1 (>500K) + 2 Tier2 (50-500K) + 1-2 Tier3 DataCore
- CTA al final: pregunta abierta o "Link en bio"`,
    context: input,
  };
}

function handlePostWriterLinkedin(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un post de LinkedIn sobre "${input.topic}" con pilar "${input.pillar}".

${DESIGN_CONTEXT}

IMPORTANTE — SELECCION DE TEMPLATE:
Analiza el contenido y selecciona el template visual que MEJOR represente el mensaje:
- Datos numericos o KPI → "metric"
- Antes/despues o problema/solucion → "comparison"
- Lista de pasos o consejos → "tips"
- Multiples metricas o resultados → "dashboard"
- Frase reflexiva o insight poderoso → "statement"
- Solo si ninguno aplica → "hero"

Responde con JSON:
{
  "copy": "texto del post listo para publicar",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "variantB": "version alternativa del copy con hook diferente",
  "brandNote": "nota si algo se aleja del tono",
  "imageTemplate": "metric|comparison|tips|dashboard|statement|hero",
  "imageTitle": "titulo corto para la imagen (max 8 palabras)",
  "subtitle": "subtitulo complementario (max 15 palabras)",
  "metricValue": "solo si imageTemplate=metric, el KPI central (ej: '85%')",
  "metricLabel": "solo si imageTemplate=metric, que mide (ej: 'Reduccion de tiempo')",
  "comparisonBefore": ["solo si imageTemplate=comparison, 3 items negativos cortos"],
  "comparisonAfter": ["solo si imageTemplate=comparison, 3 items positivos cortos"],
  "tips": ["solo si imageTemplate=tips, 3-5 consejos accionables cortos"],
  "dashboardMetrics": [{"label":"nombre","value":"valor"}, "solo si imageTemplate=dashboard, 4 KPIs"],
  "imagePrompt": "prompt para generar imagen con IA externa, formato 16:9"
}

NOTA: Solo incluye los campos de datos visuales que corresponden al template seleccionado. No incluyas campos vacios.

Reglas:
- 200-400 palabras
- Estructura: hook -> problema -> insight -> CTA suave
- Max 3 hashtags relevantes
- Tono reflexivo, profesional pero humano`,
    context: input,
  };
}

function handleCarruselWriter(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un carrusel de 7 slides sobre "${input.topic}" para ${input.platform}.

${DESIGN_CONTEXT}

Responde con JSON:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "titulo impactante de portada (hook que detiene el scroll)",
      "body": "subtitulo o contexto breve",
      "designNotes": "notas de diseño para esta slide"
    },
    {
      "slideNumber": 2,
      "title": "titulo del problema",
      "body": "descripcion del problema en 2-3 oraciones",
      "designNotes": "icono o visual sugerido"
    },
    ... (7 slides total)
  ],
  "imagePrompt": "prompt para generar el estilo visual base del carrusel con IA"
}

Estructura obligatoria:
- Slide 1: PORTADA — hook poderoso, titulo grande
- Slide 2: PROBLEMA — describe el dolor del cliente
- Slide 3: CAUSA RAIZ — por que sucede esto
- Slide 4: SOLUCION DATACORE — como DataCore resuelve esto
- Slide 5: RESULTADO — que pasa despues de implementar
- Slide 6: TIPS/RESUMEN — 3 consejos accionables
- Slide 7: CTA — "Evalua tu situacion gratis" + contacto

Cada slide debe contar UNA idea clara. El body no debe superar 40 palabras por slide.
Los titulos deben funcionar como mini-hooks independientes.`,
    context: input,
  };
}

function handleReelsScript(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un guion de reel de ${input.durationSeconds || 30}-${input.durationSeconds || 45}s sobre "${input.topic}".

Responde con JSON:
{
  "hook": "texto del gancho (0-3 segundos). Debe ser la frase que detiene el scroll. Corta, directa, provocativa.",
  "problem": "desarrollo del problema (4-13 segundos). Describir el dolor que el espectador reconoce.",
  "solution": "la solucion DataCore (14-28 segundos). Como se resuelve con datos/dashboards/automatizacion.",
  "result": "el resultado concreto (29-35 segundos). Numero o transformacion tangible.",
  "cta": "llamado a accion (36-45 segundos). Evalua tu situacion gratis / Link en bio.",
  "durationSeconds": ${input.durationSeconds || 35},
  "scenes": [
    {
      "timeRange": "0-3s",
      "label": "GANCHO",
      "visual": "descripcion de lo que se ve en pantalla (toma, encuadre, texto overlay)",
      "audio": "lo que se dice o musica/efecto de sonido",
      "text_overlay": "texto que aparece sobreimpreso"
    },
    {
      "timeRange": "4-13s",
      "label": "PROBLEMA",
      "visual": "...",
      "audio": "...",
      "text_overlay": "..."
    },
    {
      "timeRange": "14-28s",
      "label": "SOLUCION",
      "visual": "...",
      "audio": "...",
      "text_overlay": "..."
    },
    {
      "timeRange": "29-35s",
      "label": "RESULTADO",
      "visual": "...",
      "audio": "...",
      "text_overlay": "..."
    },
    {
      "timeRange": "36-45s",
      "label": "CTA",
      "visual": "...",
      "audio": "...",
      "text_overlay": "..."
    }
  ]
}

El gancho DEBE ser algo que genere curiosidad inmediata o una afirmacion fuerte.
La solucion siempre conecta con servicios DataCore (dashboards, reportes automaticos, integracion de datos).
El resultado incluye numeros o transformaciones concretas (aunque sean escenarios compuestos).`,
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

Responde con JSON:
{
  "entries": [
    {
      "date": "YYYY-MM-DD",
      "platform": "instagram|linkedin",
      "format": "post|carrusel|reel",
      "pillar": "educativo|caso_de_uso|behind_scenes|tendencias|comercial",
      "topic": "descripcion concreta del tema del post (no generica)",
      "time": "HH:MM"
    },
    ...
  ]
}

Reglas:
- LinkedIn: Mar+Mie+Jue (8am o 12pm PY)
- Instagram: Lun+Mie+Vie+Dom (7pm o 9pm PY)
- No repetir pilar en dias consecutivos
- Alternar formatos (post, carrusel, reel)
- Distribucion de pilares: educativo 35%, caso_de_uso 25%, behind_scenes 20%, tendencias 10%, comercial 10%
- Cada topic debe ser ESPECIFICO y accionable, no generico (ej: "3 KPIs que todo gerente de retail debe ver cada lunes" en vez de "post educativo sobre KPIs")`,
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
