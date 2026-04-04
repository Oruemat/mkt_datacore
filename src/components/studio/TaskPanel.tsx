"use client";

import { useState } from "react";
import type { SkillName, Platform, ContentPillar } from "@/lib/agent/types";

type ContentFormat = "post" | "carousel" | "reel" | "calendar" | "email" | "lead" | "report";

interface TaskPanelProps {
  onSubmit: (task: {
    type: SkillName;
    topic: string;
    platform?: Platform;
    pillar?: ContentPillar;
    extraContext?: string;
  }) => void;
  isRunning: boolean;
}

const FORMATS: { value: ContentFormat; label: string; icon: string }[] = [
  { value: "post", label: "Post", icon: "img" },
  { value: "carousel", label: "Carrusel", icon: "slides" },
  { value: "reel", label: "Reel", icon: "video" },
  { value: "calendar", label: "Calendario", icon: "cal" },
  { value: "email", label: "Emails", icon: "mail" },
  { value: "lead", label: "Lead", icon: "user" },
  { value: "report", label: "Reporte", icon: "chart" },
];

function resolveSkill(format: ContentFormat, platform: Platform): SkillName {
  switch (format) {
    case "post":
      return platform === "linkedin" ? "post_writer_linkedin" : "post_writer_instagram";
    case "carousel":
      return "carrusel_writer";
    case "reel":
      return "reels_script";
    case "calendar":
      return "calendar_planner";
    case "email":
      return "email_sequence_writer";
    case "lead":
      return "lead_classifier";
    case "report":
      return "weekly_performance_reporter";
  }
}

const FORMAT_PLACEHOLDER: Record<ContentFormat, string> = {
  post: "Ej: Como los dashboards reducen tiempo de decision en retail",
  carousel: "Ej: 5 errores comunes al implementar un CRM",
  reel: "Ej: Antes vs despues de automatizar reportes",
  calendar: "Ej: Semana de lanzamiento del servicio POS",
  email: "Ej: Secuencia para leads que pidieron demo",
  lead: "Nombre: Juan, Empresa: Retail SA, Mensaje: Quiero automatizar reportes...",
  report: "Ej: Resumen de la semana del 1 al 7 de abril",
};

export function TaskPanel({ onSubmit, isRunning }: TaskPanelProps) {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<ContentFormat>("post");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pillar, setPillar] = useState<ContentPillar>("educativo");
  const [extraContext, setExtraContext] = useState("");

  const needsPlatform = format === "post" || format === "carousel";
  const needsPillar = format === "post";

  function handleSubmit() {
    if (!topic.trim()) return;
    onSubmit({
      type: resolveSkill(format, platform),
      topic: topic.trim(),
      platform: needsPlatform ? platform : undefined,
      pillar: needsPillar ? pillar : undefined,
      extraContext: extraContext.trim() || undefined,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey && topic.trim() && !isRunning) {
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-dc-gray-200">
        <h2 className="text-sm font-display font-semibold text-dc-gray-900">Generar Contenido</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Format — compact pills */}
        <div>
          <label className="block text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-2">Formato</label>
          <div className="flex flex-wrap gap-1.5">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  format === f.value
                    ? "bg-dc-blue-600 text-white shadow-sm"
                    : "bg-dc-gray-100 text-dc-gray-600 hover:bg-dc-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform — only when needed */}
        {needsPlatform && (
          <div className="flex gap-2">
            {(["instagram", "linkedin"] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex-1 text-xs py-2 rounded-xl border transition-all capitalize font-medium ${
                  platform === p
                    ? "border-dc-blue-600 bg-dc-blue-50 text-dc-blue-600"
                    : "border-dc-gray-200 text-dc-gray-500 hover:border-dc-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Topic — the main input */}
        <div>
          <label className="block text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1.5">
            {format === "lead" ? "Datos del lead" : "Sobre que?"}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder={FORMAT_PLACEHOLDER[format]}
            className="w-full bg-white border border-dc-gray-200 rounded-xl px-3 py-2.5 text-sm text-dc-gray-900 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none resize-none"
            autoFocus
          />
          <p className="text-[10px] text-dc-gray-400 mt-1">Ctrl+Enter para generar</p>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[11px] text-dc-gray-400 hover:text-dc-gray-600 transition flex items-center gap-1"
        >
          <svg className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Opciones avanzadas
        </button>

        {showAdvanced && (
          <div className="space-y-3 pl-2 border-l-2 border-dc-gray-100">
            {needsPillar && (
              <div>
                <label className="block text-[11px] font-medium text-dc-gray-500 mb-1">Pilar</label>
                <select
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value as ContentPillar)}
                  className="w-full bg-white border border-dc-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-dc-gray-700 focus:border-dc-blue-600 focus:outline-none"
                >
                  <option value="educativo">Educativo</option>
                  <option value="caso_de_uso">Caso de uso</option>
                  <option value="behind_scenes">Behind scenes</option>
                  <option value="tendencias">Tendencias</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-medium text-dc-gray-500 mb-1">Contexto extra</label>
              <input
                type="text"
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                placeholder="Ej: sector salud, semana de lanzamiento..."
                className="w-full bg-white border border-dc-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-dc-gray-700 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="p-5 border-t border-dc-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!topic.trim() || isRunning}
          className="w-full py-3 bg-gradient-to-r from-dc-blue-600 to-dc-blue-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-dc-blue-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Generando...
            </span>
          ) : "Generar"}
        </button>
      </div>
    </div>
  );
}
