"use client";

interface ReelPreviewProps {
  script: {
    hook: string;
    problem: string;
    solution: string;
    result: string;
    cta: string;
    durationSeconds: number;
  };
}

const SCENES: { key: "hook" | "problem" | "solution" | "result" | "cta"; label: string; color: string; borderColor: string }[] = [
  { key: "hook", label: "GANCHO", color: "bg-dc-orange-50 text-dc-orange-500", borderColor: "border-l-dc-orange-500" },
  { key: "problem", label: "PROBLEMA", color: "bg-red-50 text-red-600", borderColor: "border-l-red-500" },
  { key: "solution", label: "SOLUCION", color: "bg-dc-blue-50 text-dc-blue-600", borderColor: "border-l-dc-blue-600" },
  { key: "result", label: "RESULTADO", color: "bg-dc-green-50 text-dc-green-600", borderColor: "border-l-dc-green-600" },
  { key: "cta", label: "CTA", color: "bg-dc-orange-50 text-dc-orange-600", borderColor: "border-l-dc-orange-600" },
];

function computeTimeRanges(durationSeconds: number) {
  const weights = [0.10, 0.25, 0.30, 0.20, 0.15];
  let cumulative = 0;
  return weights.map((w) => {
    const start = Math.round(cumulative);
    cumulative += w * durationSeconds;
    return { start, end: Math.round(cumulative) };
  });
}

export function ReelPreview({ script }: ReelPreviewProps) {
  const timeRanges = computeTimeRanges(script.durationSeconds);

  return (
    <div className="space-y-2">
      {SCENES.map((scene, i) => {
        const range = timeRanges[i];
        const content = script[scene.key];

        return (
          <div key={scene.key} className={`bg-white border border-dc-gray-200 rounded-xl p-4 border-l-4 ${scene.borderColor}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${scene.color}`}>
                {scene.label}
              </span>
              <span className="text-[11px] font-mono text-dc-gray-400">
                {range.start}-{range.end}s
              </span>
            </div>
            <p className="text-sm text-dc-gray-700 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        );
      })}

      <div className="flex items-center justify-between bg-dc-gray-50 border border-dc-gray-200 rounded-xl px-4 py-2.5">
        <span className="text-xs text-dc-gray-500">
          Duracion total: <span className="text-dc-gray-900 font-semibold">{script.durationSeconds}s</span>
        </span>
      </div>
    </div>
  );
}
