"use client";

import { useState } from "react";
import type { SkillName, Platform, ContentPillar } from "@/lib/agent/types";

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

const SKILLS: { value: SkillName; label: string; needsPlatform: boolean; needsPillar: boolean }[] = [
  { value: "post_writer_instagram", label: "Post Instagram", needsPlatform: false, needsPillar: true },
  { value: "post_writer_linkedin", label: "Post LinkedIn", needsPlatform: false, needsPillar: true },
  { value: "carrusel_writer", label: "Carrusel", needsPlatform: true, needsPillar: false },
  { value: "reels_script", label: "Guion de Reel", needsPlatform: false, needsPillar: false },
  { value: "lead_classifier", label: "Clasificar Lead", needsPlatform: false, needsPillar: false },
  { value: "email_sequence_writer", label: "Secuencia Emails", needsPlatform: false, needsPillar: false },
  { value: "calendar_planner", label: "Calendario Semanal", needsPlatform: false, needsPillar: false },
  { value: "weekly_performance_reporter", label: "Reporte Semanal", needsPlatform: false, needsPillar: false },
];

const PILLARS: { value: ContentPillar; label: string }[] = [
  { value: "educativo", label: "Educativo" },
  { value: "caso_de_uso", label: "Caso de uso" },
  { value: "behind_scenes", label: "Behind scenes" },
  { value: "tendencias", label: "Tendencias" },
  { value: "comercial", label: "Comercial" },
];

export function TaskPanel({ onSubmit, isRunning }: TaskPanelProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillName>("post_writer_instagram");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [pillar, setPillar] = useState<ContentPillar>("educativo");
  const [extraContext, setExtraContext] = useState("");

  const skillConfig = SKILLS.find((s) => s.value === selectedSkill);

  function handleSubmit() {
    if (!topic.trim()) return;
    onSubmit({
      type: selectedSkill,
      topic: topic.trim(),
      platform: skillConfig?.needsPlatform ? platform : getPlatformFromSkill(selectedSkill),
      pillar: skillConfig?.needsPillar ? pillar : undefined,
      extraContext: extraContext.trim() || undefined,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-dc-muted/20">
        <h2 className="text-sm font-semibold text-white">Nueva Tarea</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Skill selector */}
        <div>
          <label className="block text-xs text-dc-muted mb-1.5">Tipo de contenido</label>
          <div className="grid grid-cols-2 gap-1.5">
            {SKILLS.map((skill) => (
              <button
                key={skill.value}
                onClick={() => setSelectedSkill(skill.value)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors text-left ${
                  selectedSkill === skill.value
                    ? "border-dc-electric bg-dc-electric/10 text-white"
                    : "border-dc-muted/20 text-dc-muted hover:border-dc-muted/40"
                }`}
              >
                {skill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-xs text-dc-muted mb-1.5">
            {selectedSkill === "lead_classifier" ? "Datos del lead" : "Tema / Descripcion"}
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder={
              selectedSkill === "lead_classifier"
                ? "Nombre: Juan, Empresa: Retail SA, Mensaje: Quiero automatizar reportes..."
                : selectedSkill === "calendar_planner"
                ? "Fecha inicio: 2026-04-06, Tema: lanzamiento de servicio POS"
                : "Ej: Como los dashboards reducen tiempo de decision en retail"
            }
            className="w-full bg-dc-navy/50 border border-dc-muted/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dc-muted/50 focus:border-dc-electric focus:outline-none resize-none"
          />
        </div>

        {/* Platform selector */}
        {skillConfig?.needsPlatform && (
          <div>
            <label className="block text-xs text-dc-muted mb-1.5">Plataforma</label>
            <div className="flex gap-2">
              {(["instagram", "linkedin"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors capitalize ${
                    platform === p
                      ? "border-dc-electric bg-dc-electric/10 text-white"
                      : "border-dc-muted/20 text-dc-muted hover:border-dc-muted/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pillar selector */}
        {skillConfig?.needsPillar && (
          <div>
            <label className="block text-xs text-dc-muted mb-1.5">Pilar de contenido</label>
            <div className="flex flex-wrap gap-1.5">
              {PILLARS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPillar(p.value)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                    pillar === p.value
                      ? "border-dc-electric bg-dc-electric/10 text-white"
                      : "border-dc-muted/20 text-dc-muted hover:border-dc-muted/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Extra context */}
        <div>
          <label className="block text-xs text-dc-muted mb-1.5">Contexto adicional (opcional)</label>
          <input
            type="text"
            value={extraContext}
            onChange={(e) => setExtraContext(e.target.value)}
            placeholder="Ej: enfocado en sector salud, para la semana del lanzamiento..."
            className="w-full bg-dc-navy/50 border border-dc-muted/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dc-muted/50 focus:border-dc-electric focus:outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="p-4 border-t border-dc-muted/20">
        <button
          onClick={handleSubmit}
          disabled={!topic.trim() || isRunning}
          className="w-full py-2.5 bg-dc-electric text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRunning ? "Procesando..." : "Ejecutar Agente"}
        </button>
      </div>
    </div>
  );
}

function getPlatformFromSkill(skill: SkillName): Platform | undefined {
  if (skill === "post_writer_instagram") return "instagram";
  if (skill === "post_writer_linkedin") return "linkedin";
  return undefined;
}
