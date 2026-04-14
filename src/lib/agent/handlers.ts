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
- Color primario: Blue-600 #2563EB / Blue-700 #1D4ED8 (CTAs, botones, acentos)
- Acento calido: Orange-500 #F97316 (highlights, max 20% — un solo detalle por pieza)
- Exito/Resultados: Green-600 #16A34A (datos positivos, crecimiento)
- Texto titulos: Gray-900 #111827 (oscuro sobre fondo claro)
- Texto cuerpo: Gray-600 #4B5563
- Tipografia: Inter para heading/body, JetBrains Mono para numeros/datos, Poppins para display
- Cards: fondo blanco, border #E5E7EB, rounded 16px, shadow suave
- Badges: rounded-full, estilo "soft" (fondo claro, texto oscuro) para fondos claros
- Botones CTA: Blue-700 #1D4ED8, rounded-xl
- Estilo: profesional, limpio, moderno, mucho espacio en blanco, sombras suaves
- NO usar fondos oscuros/navy, NO saturacion excesiva, NO estilos caricaturescos

TONO DE COMUNICACION:
- Español paraguayo directo, forma "vos"
- Pain points de negocio reales y relatable
- Slogan: "Deja de decidir por intuicion"
- Mision: "Transformamos datos en decisiones inteligentes"
- CTA principal: "Evalua tu situacion gratis"
`;

// ── Tool Handlers ───────────────────────────────────────────

function handlePostWriterInstagram(input: Record<string, unknown>): unknown {
  return {
    instruction: `Genera un post de Instagram sobre "${input.topic}" con pilar "${input.pillar}".

${DESIGN_CONTEXT}

## SISTEMA DE COMPOSICION VISUAL

En vez de elegir un template rigido, compone la imagen del post usando BLOQUES VISUALES. Genera un JSON "composition" que describe exactamente que elementos mostrar.

### Estructura de composicion:
{
  "background": { "type": "solid"|"gradient", "color": "#EFF6FF", "colors": [...], "angle": 135 },
  "layout": "vertical-start"|"vertical-center"|"vertical-spread",
  "padding": { "horizontal": 60, "vertical": 60 },
  "gap": 20,
  "elements": [ ... bloques visuales ordenados ... ]
}

### Bloques disponibles:

- **badge**: Pill/etiqueta. { "type": "badge", "text": "TEXTO", "color": "blue"|"orange"|"green", "style": "soft", "animation": { "enter": "fade" } }
- **richText**: Texto con colores inline. { "type": "richText", "segments": [{ "text": "normal ", "fontWeight": 900 }, { "text": "resaltado", "color": "#1D4ED8", "fontWeight": 900 }], "fontSize": 42, "lineHeight": 1.2, "textAlign": "left", "animation": { "enter": "slideUp", "delay": 5 } }
- **checklist**: Lista con iconos. { "type": "checklist", "items": [{ "text": "Item", "icon": "cross"|"check"|"bullet", "iconColor": "#9CA3AF" }], "gap": 14, "animation": { "enter": "slideUp", "delay": 12 } }
- **metric**: Numero grande. { "type": "metric", "value": "85%", "label": "Mejora promedio", "showGauge": true, "animation": { "enter": "scale" } }
- **ctaBar**: Barra CTA. { "type": "ctaBar", "text": "Te ayudamos · datacore.com.py", "bgColor": "#1D4ED8", "textColor": "#FFFFFF", "fullWidth": true }
- **card**: Contenedor con hijos. { "type": "card", "shadow": "sm", "padding": 20, "accentBorder": { "side": "left", "color": "#2563EB", "width": 4 }, "children": [ ...elementos... ] }
- **spacer**: Espacio. { "type": "spacer", "height": 24 } o { "type": "spacer", "flexGrow": 1 } (para empujar CTA al fondo)
- **logo**: Logo DataCore. { "type": "logo", "variant": "full", "position": "bottom" }
- **quote**: Cita decorativa. { "type": "quote", "text": "...", "fontSize": 38, "decorativeMarks": true }
- **comparison**: Antes/Despues. { "type": "comparison", "before": { "label": "ANTES", "items": ["..."] }, "after": { "label": "AHORA", "items": ["..."] } }
- **divider**: Linea. { "type": "divider", "style": "gradient", "colors": ["#2563EB", "#F97316"], "height": 4 }
- **sparkline**: Mini grafico. { "type": "sparkline", "data": [20, 35, 45, 70], "color": "#2563EB" }
- **icon**: Emoji decorativo con fondo. { "type": "icon", "emoji": "📊", "size": 48, "bgColor": "rgba(37,99,235,0.12)", "bgRadius": 12 }
- **image**: Imagen externa. { "type": "image", "src": "/brand/logo.png", "width": 200, "borderRadius": 12 }

### Reglas de composicion:
1. SIEMPRE incluir logo con position "bottom"
2. Para posts con CTA abajo: usar layout "vertical-start" + spacer flexGrow:1 antes del CTA
3. Badge style "soft" para fondos claros
4. Iconos de dolor en checklist: gris sutil #9CA3AF, no rojo
5. Maximo 3 colores de acento
6. richText SIEMPRE con multiples segmentos de color — NUNCA todo en un color
7. Animacion: badge primero (delay 0), titulo (delay 5), contenido (delay 10-15), CTA (delay 20)

### Ejemplo — Pain Point:
{
  "composition": {
    "background": { "type": "solid", "color": "#EFF6FF" },
    "layout": "vertical-start",
    "padding": { "horizontal": 60, "vertical": 60 },
    "gap": 20,
    "elements": [
      { "type": "badge", "text": "¿TE PASA ESTO?", "color": "blue", "style": "soft", "animation": { "enter": "fade", "delay": 0 } },
      { "type": "richText", "segments": [
        { "text": "Tu empresa crece\\npero tus ", "fontWeight": 900 },
        { "text": "reportes", "color": "#1D4ED8", "fontWeight": 900 },
        { "text": " siguen siendo\\n", "fontWeight": 900 },
        { "text": "manuales", "color": "#F97316", "fontWeight": 900 }
      ], "fontSize": 42, "lineHeight": 1.2, "textAlign": "left", "animation": { "enter": "slideUp", "delay": 5 } },
      { "type": "checklist", "items": [
        { "text": "Reportes en Excel al final del mes", "icon": "cross", "iconColor": "#9CA3AF" },
        { "text": "Datos que no coinciden entre sucursales", "icon": "cross", "iconColor": "#9CA3AF" }
      ], "gap": 14, "animation": { "enter": "slideUp", "delay": 12 } },
      { "type": "spacer", "flexGrow": 1 },
      { "type": "ctaBar", "text": "👋 Te ayudamos a resolverlo · datacore.com.py", "bgColor": "#1D4ED8", "textColor": "#FFFFFF", "fullWidth": true, "animation": { "enter": "fade", "delay": 20 } },
      { "type": "logo", "variant": "full", "position": "bottom" }
    ]
  }
}

Responde con JSON:
{
  "copy": "texto del post listo para publicar",
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "variantB": "version alternativa del copy con hook diferente",
  "composition": {
    "background": { ... },
    "layout": "...",
    "padding": { ... },
    "gap": 20,
    "elements": [ ... ]
  }
}

IMPORTANTE: El campo "composition" es OBLIGATORIO. NO uses imageTemplate. Compone visualmente con bloques.

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

## SISTEMA DE COMPOSICION VISUAL

Compone la imagen del post usando BLOQUES VISUALES (NO uses imageTemplate).

### Estructura de composicion:
{
  "background": { "type": "solid"|"gradient", "color": "#EFF6FF", "colors": [...], "angle": 135 },
  "layout": "vertical-start"|"vertical-center",
  "padding": { "horizontal": 60, "vertical": 60 },
  "gap": 20,
  "elements": [ ... bloques visuales ... ]
}

### Bloques disponibles:
- **badge**: { "type": "badge", "text": "TEXTO", "color": "blue"|"orange"|"green", "style": "soft" }
- **richText**: { "type": "richText", "segments": [{ "text": "...", "fontWeight": 900 }, { "text": "resaltado", "color": "#1D4ED8", "fontWeight": 900 }], "fontSize": 42, "lineHeight": 1.2 }
- **checklist**: { "type": "checklist", "items": [{ "text": "...", "icon": "cross"|"check", "iconColor": "#9CA3AF" }], "gap": 14 }
- **metric**: { "type": "metric", "value": "85%", "label": "...", "showGauge": true }
- **ctaBar**: { "type": "ctaBar", "text": "...", "bgColor": "#1D4ED8", "textColor": "#FFFFFF", "fullWidth": true }
- **card**: { "type": "card", "shadow": "sm", "padding": 20, "accentBorder": { "side": "left", "color": "#2563EB", "width": 4 }, "children": [...] }
- **spacer**: { "type": "spacer", "flexGrow": 1 } (empuja CTA al fondo)
- **logo**: { "type": "logo", "variant": "full", "position": "bottom" }
- **quote**: { "type": "quote", "text": "...", "fontSize": 38, "decorativeMarks": true }
- **comparison**: { "type": "comparison", "before": { "label": "ANTES", "items": [...] }, "after": { "label": "AHORA", "items": [...] } }
- **sparkline**: { "type": "sparkline", "data": [20,35,70], "color": "#2563EB" }
- **divider**: { "type": "divider", "style": "gradient", "colors": ["#2563EB", "#F97316"] }
- **icon**: { "type": "icon", "emoji": "📊", "size": 48, "bgColor": "rgba(37,99,235,0.12)", "bgRadius": 12 }
- **image**: { "type": "image", "src": "/brand/logo.png", "width": 200, "borderRadius": 12 }

### Reglas de composicion:
1. SIEMPRE incluir logo con position "bottom"
2. Layout "vertical-start" + spacer flexGrow:1 para empujar CTA al fondo
3. Badge style "soft" para fondos claros
4. richText SIEMPRE con segmentos multicolor
5. Maximo 3 colores de acento
6. Animacion staggered: badge→titulo→contenido→CTA

Responde con JSON:
{
  "copy": "texto del post listo para publicar",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "variantB": "version alternativa del copy con hook diferente",
  "composition": {
    "background": { ... },
    "layout": "...",
    "padding": { ... },
    "gap": 20,
    "elements": [ ... ]
  }
}

IMPORTANTE: El campo "composition" es OBLIGATORIO. NO uses imageTemplate.

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
