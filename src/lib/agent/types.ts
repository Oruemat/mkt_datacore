// ── Agent Task ──────────────────────────────────────────────
export type Platform = "instagram" | "linkedin";
export type ContentFormat = "post" | "carrusel" | "reel" | "email_sequence";
export type ContentPillar = "educativo" | "caso_de_uso" | "behind_scenes" | "tendencias" | "comercial";
export type LeadTemperature = "CALIENTE" | "TIBIO" | "FRIO";
export type BrandbookVerdict = "APROBADO" | "AJUSTE_MENOR" | "RECHAZADO";

export interface AgentTask {
  id: string;
  type: SkillName;
  platform?: Platform;
  format?: ContentFormat;
  pillar?: ContentPillar;
  topic: string;
  extraContext?: string;
  createdAt: string;
}

// ── Agent Steps (streamed to UI) ────────────────────────────
export type StepType = "thinking" | "tool_call" | "tool_result" | "completed" | "error" | "approval_needed";

export interface AgentStep {
  id: string;
  type: StepType;
  content: string;
  toolName?: string;
  timestamp: string;
}

// ── Skills ──────────────────────────────────────────────────
export type SkillName =
  | "post_writer_instagram"
  | "post_writer_linkedin"
  | "carrusel_writer"
  | "reels_script"
  | "lead_classifier"
  | "email_sequence_writer"
  | "brandbook_enforcer"
  | "calendar_planner"
  | "weekly_performance_reporter";

// ── Generated Content ───────────────────────────────────────
export interface GeneratedPost {
  copy: string;
  hashtags: string[];
  visualSuggestion: string;
  variantB: string;
  brandNote?: string;
  platform: Platform;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
  designNotes: string;
}

export interface ReelScript {
  hook: string;
  problem: string;
  solution: string;
  result: string;
  cta: string;
  durationSeconds: number;
}

export interface EmailEntry {
  day: number;
  subject: string;
  body: string;
  objective: string;
}

export interface CalendarEntry {
  date: string;
  platform: Platform;
  format: ContentFormat;
  pillar: ContentPillar;
  topic: string;
  time: string;
}

export interface LeadClassification {
  temperature: LeadTemperature;
  reasoning: string;
  nextStep: string;
  suggestedMessage: string;
}

export interface BrandbookResult {
  verdict: BrandbookVerdict;
  checks: { rule: string; passed: boolean; note?: string }[];
  suggestion?: string;
}

// ── Tool Definitions (Anthropic SDK shape) ──────────────────
export interface ToolInput {
  [key: string]: unknown;
}

// ── SSE Event ───────────────────────────────────────────────
export interface SSEEvent {
  event: "step" | "done" | "error";
  data: AgentStep | { message: string };
}
