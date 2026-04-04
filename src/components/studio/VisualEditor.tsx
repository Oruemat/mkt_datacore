"use client";

import type { DCTemplate, DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import type { ContentType } from "./ContentPanel";

interface VisualEditorProps {
  contentType: ContentType;
  postProps?: DCPostVisualProps;
  carouselProps?: DCCarouselProps;
  reelProps?: DCReelProps;
  onUpdatePostProps?: (updates: Partial<DCPostVisualProps>) => void;
  onUpdateCarouselProps?: (updates: Partial<DCCarouselProps>) => void;
  onUpdateReelProps?: (updates: Partial<DCReelProps>) => void;
}

const TEMPLATES: Array<{ value: DCTemplate; label: string; desc: string }> = [
  { value: "hero", label: "Hero", desc: "Hook con gradiente" },
  { value: "metric", label: "Metrica", desc: "KPI central con gauge" },
  { value: "comparison", label: "Comparacion", desc: "Antes vs Ahora" },
  { value: "tips", label: "Tips", desc: "Lista numerada" },
  { value: "dashboard", label: "Dashboard", desc: "Cards de metricas" },
  { value: "statement", label: "Statement", desc: "Frase poderosa" },
];

const ANIMATIONS = [
  { value: "fade", label: "Fade" },
  { value: "slideUp", label: "Slide Up" },
  { value: "slideDown", label: "Slide Down" },
  { value: "scale", label: "Scale" },
  { value: "typewriter", label: "Typewriter" },
  { value: "blur", label: "Blur" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1.5">{children}</label>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-dc-gray-200 rounded-xl px-3 py-2 text-sm text-dc-gray-900 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none"
    />
  );
}

export function VisualEditor({
  contentType,
  postProps,
  carouselProps,
  reelProps,
  onUpdatePostProps,
  onUpdateCarouselProps,
  onUpdateReelProps,
}: VisualEditorProps) {
  // ── Post Editor ──
  if (contentType === "post" && postProps && onUpdatePostProps) {
    return (
      <div className="space-y-4">
        {/* Template picker */}
        <div>
          <SectionLabel>Template</SectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                onClick={() => onUpdatePostProps({ template: t.value })}
                className={`text-left px-3 py-2 rounded-xl text-xs transition-all ${
                  postProps.template === t.value
                    ? "bg-dc-blue-50 text-dc-blue-600 border border-dc-blue-600 ring-1 ring-dc-blue-600/20"
                    : "bg-white text-dc-gray-600 border border-dc-gray-200 hover:border-dc-gray-300"
                }`}
              >
                <div className="font-medium">{t.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <SectionLabel>Titulo</SectionLabel>
          <Input
            value={postProps.title || ""}
            onChange={(v) => onUpdatePostProps({ title: v })}
            placeholder="Titulo principal"
          />
        </div>

        {/* Subtitle */}
        <div>
          <SectionLabel>Subtitulo</SectionLabel>
          <Input
            value={postProps.subtitle || ""}
            onChange={(v) => onUpdatePostProps({ subtitle: v })}
            placeholder="Subtitulo"
          />
        </div>

        {/* Animation type */}
        <div>
          <SectionLabel>Animacion de entrada</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {ANIMATIONS.map((a) => (
              <button
                key={a.value}
                onClick={() => onUpdatePostProps({ enterAnimation: a.value } as Partial<DCPostVisualProps>)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  (postProps as unknown as Record<string, unknown>).enterAnimation === a.value
                    ? "bg-dc-blue-50 text-dc-blue-600 border border-dc-blue-600"
                    : "bg-dc-gray-100 text-dc-gray-600 border border-transparent hover:bg-dc-gray-200"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Variant toggle */}
        <div>
          <SectionLabel>Variante</SectionLabel>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onUpdatePostProps({ variant: v })}
                className={`flex-1 text-xs py-2 rounded-xl transition-all capitalize ${
                  postProps.variant === v
                    ? "bg-dc-blue-50 text-dc-blue-600 border border-dc-blue-600"
                    : "bg-dc-gray-100 text-dc-gray-600 border border-transparent"
                }`}
              >
                {v === "dark" ? "Oscuro" : "Claro"}
              </button>
            ))}
          </div>
        </div>

        {/* Metric value (conditional) */}
        {postProps.template === "metric" && (
          <div>
            <SectionLabel>Valor metrica</SectionLabel>
            <Input
              value={postProps.metricValue || ""}
              onChange={(v) => onUpdatePostProps({ metricValue: v })}
              placeholder="Ej: 85%"
            />
          </div>
        )}
      </div>
    );
  }

  // ── Carousel Editor ──
  if (contentType === "carousel" && carouselProps && onUpdateCarouselProps) {
    return (
      <div className="space-y-3">
        <SectionLabel>Editar Slides</SectionLabel>
        {carouselProps.slides.map((slide, i) => (
          <div key={i} className="bg-white border border-dc-gray-200 rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-bold text-dc-blue-600">Slide {slide.slideNumber}</span>
            <Input
              value={slide.title}
              onChange={(v) => {
                const newSlides = [...carouselProps.slides];
                newSlides[i] = { ...newSlides[i], title: v };
                onUpdateCarouselProps({ slides: newSlides });
              }}
              placeholder="Titulo"
            />
            <textarea
              value={slide.body}
              onChange={(e) => {
                const newSlides = [...carouselProps.slides];
                newSlides[i] = { ...newSlides[i], body: e.target.value };
                onUpdateCarouselProps({ slides: newSlides });
              }}
              rows={2}
              placeholder="Cuerpo"
              className="w-full bg-white border border-dc-gray-200 rounded-xl px-3 py-2 text-sm text-dc-gray-900 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none resize-none"
            />
          </div>
        ))}
      </div>
    );
  }

  // ── Reel Editor ──
  if (contentType === "reel" && reelProps && onUpdateReelProps) {
    const scenes: { key: keyof Pick<typeof reelProps, "hook" | "problem" | "solution" | "result" | "cta">; label: string }[] = [
      { key: "hook", label: "Gancho" },
      { key: "problem", label: "Problema" },
      { key: "solution", label: "Solucion" },
      { key: "result", label: "Resultado" },
      { key: "cta", label: "CTA" },
    ];

    return (
      <div className="space-y-3">
        <SectionLabel>Editar Escenas</SectionLabel>
        {scenes.map((scene) => (
          <div key={scene.key} className="bg-white border border-dc-gray-200 rounded-xl p-3">
            <span className="text-[10px] font-bold text-dc-blue-600 block mb-1">{scene.label}</span>
            <textarea
              value={reelProps[scene.key]}
              onChange={(e) => onUpdateReelProps({ [scene.key]: e.target.value })}
              rows={2}
              className="w-full bg-white border border-dc-gray-200 rounded-xl px-3 py-2 text-sm text-dc-gray-900 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none resize-none"
            />
          </div>
        ))}

        {/* Duration */}
        <div>
          <SectionLabel>Duracion (segundos)</SectionLabel>
          <input
            type="number"
            value={reelProps.durationSeconds || 35}
            onChange={(e) => onUpdateReelProps({ durationSeconds: parseInt(e.target.value) || 35 })}
            min={15}
            max={60}
            className="w-full bg-white border border-dc-gray-200 rounded-xl px-3 py-2 text-sm text-dc-gray-900 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  return null;
}
