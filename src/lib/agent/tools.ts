import Anthropic from "@anthropic-ai/sdk";

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "post_writer_instagram",
    description:
      "Genera un post completo para Instagram con copy, hashtags, sugerencia visual y variante B. Maximo 150 palabras.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: { type: "string", description: "Tema del post" },
        pillar: {
          type: "string",
          enum: ["educativo", "caso_de_uso", "behind_scenes", "tendencias", "comercial"],
          description: "Pilar de contenido",
        },
      },
      required: ["topic", "pillar"],
    },
  },
  {
    name: "post_writer_linkedin",
    description:
      "Genera un post completo para LinkedIn con copy (200-400 palabras), hashtags, sugerencia visual y variante B.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: { type: "string", description: "Tema del post" },
        pillar: {
          type: "string",
          enum: ["educativo", "caso_de_uso", "behind_scenes", "tendencias", "comercial"],
          description: "Pilar de contenido",
        },
      },
      required: ["topic", "pillar"],
    },
  },
  {
    name: "carrusel_writer",
    description:
      "Genera un carrusel de 7 slides para redes sociales con estructura: portada, problema, causa, solucion, resultado, tips, CTA.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: { type: "string", description: "Tema del carrusel" },
        platform: {
          type: "string",
          enum: ["instagram", "linkedin"],
          description: "Plataforma destino",
        },
      },
      required: ["topic", "platform"],
    },
  },
  {
    name: "reels_script",
    description:
      "Genera un guion para reel/video corto de 30-45 segundos con gancho, problema, solucion, resultado y CTA.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: { type: "string", description: "Tema del reel" },
        durationSeconds: {
          type: "number",
          description: "Duracion objetivo en segundos (30-45)",
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "lead_classifier",
    description:
      "Clasifica un lead como CALIENTE, TIBIO o FRIO usando criterios BANT adaptados para Paraguay.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Nombre del contacto" },
        company: { type: "string", description: "Empresa del contacto" },
        message: { type: "string", description: "Mensaje o descripcion del contacto" },
        role: { type: "string", description: "Cargo del contacto" },
      },
      required: ["name", "message"],
    },
  },
  {
    name: "email_sequence_writer",
    description:
      "Genera una secuencia de 5 emails de nurturing a 14 dias para leads frios.",
    input_schema: {
      type: "object" as const,
      properties: {
        leadName: { type: "string", description: "Nombre del lead" },
        industry: { type: "string", description: "Industria del lead" },
        painPoint: { type: "string", description: "Problema principal detectado" },
      },
      required: ["leadName", "industry"],
    },
  },
  {
    name: "brandbook_enforcer",
    description:
      "Audita una pieza de contenido contra el brandbook de DataCore. Retorna APROBADO, AJUSTE_MENOR o RECHAZADO.",
    input_schema: {
      type: "object" as const,
      properties: {
        content: { type: "string", description: "Contenido a auditar" },
        platform: {
          type: "string",
          enum: ["instagram", "linkedin"],
          description: "Plataforma destino",
        },
        contentType: {
          type: "string",
          enum: ["post", "carrusel", "reel", "email"],
          description: "Tipo de contenido",
        },
      },
      required: ["content", "platform"],
    },
  },
  {
    name: "calendar_planner",
    description:
      "Genera un calendario editorial semanal con distribucion de pilares, plataformas y horarios optimos para Paraguay.",
    input_schema: {
      type: "object" as const,
      properties: {
        weekStartDate: { type: "string", description: "Fecha de inicio de la semana (YYYY-MM-DD)" },
        focusTheme: { type: "string", description: "Tema central de la semana (opcional)" },
      },
      required: ["weekStartDate"],
    },
  },
  {
    name: "weekly_performance_reporter",
    description:
      "Genera un reporte semanal ejecutivo con metricas, top posts y recomendaciones.",
    input_schema: {
      type: "object" as const,
      properties: {
        weekEndDate: { type: "string", description: "Fecha fin de la semana (YYYY-MM-DD)" },
        metrics: {
          type: "object",
          description: "Metricas de la semana (seguidores, impresiones, leads, etc.)",
          properties: {
            linkedinFollowers: { type: "number" },
            instagramFollowers: { type: "number" },
            newLeads: { type: "number" },
          },
        },
      },
      required: ["weekEndDate"],
    },
  },
];
