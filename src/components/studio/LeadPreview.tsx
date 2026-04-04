"use client";

interface LeadPreviewProps {
  temperature: string;
  reasoning: string;
  nextStep: string;
  suggestedMessage?: string;
}

const TEMP_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  CALIENTE: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  TIBIO: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  FRIO: { bg: "bg-dc-blue-50", text: "text-dc-blue-700", border: "border-dc-blue-100" },
};

export function LeadPreview({ temperature, reasoning, nextStep, suggestedMessage }: LeadPreviewProps) {
  const style = TEMP_STYLES[temperature] ?? TEMP_STYLES.FRIO;

  return (
    <div className="space-y-3">
      {/* Temperature badge */}
      <div className={`${style.bg} ${style.border} border rounded-2xl p-5 text-center`}>
        <p className={`text-2xl font-display font-bold ${style.text}`}>{temperature}</p>
        <p className="text-xs text-dc-gray-500 mt-1">Clasificacion del lead</p>
      </div>

      {/* Reasoning */}
      <div className="bg-white border border-dc-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1">Razonamiento</p>
        <p className="text-sm text-dc-gray-700 leading-relaxed">{reasoning}</p>
      </div>

      {/* Next step */}
      <div className="bg-white border border-dc-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1">Siguiente paso</p>
        <p className="text-sm text-dc-gray-700 leading-relaxed">{nextStep}</p>
      </div>

      {/* Suggested message */}
      {suggestedMessage && (
        <div className="bg-dc-blue-50 border border-dc-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-semibold text-dc-blue-600 uppercase tracking-wider">Mensaje sugerido</p>
            <button
              onClick={() => navigator.clipboard.writeText(suggestedMessage)}
              className="text-[10px] px-2 py-0.5 bg-dc-blue-600 text-white rounded-lg hover:bg-dc-blue-700 transition"
            >
              Copiar
            </button>
          </div>
          <p className="text-sm text-dc-gray-700 leading-relaxed whitespace-pre-wrap">{suggestedMessage}</p>
        </div>
      )}
    </div>
  );
}
