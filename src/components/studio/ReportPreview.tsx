"use client";

interface ReportPreviewProps {
  highlights: string[];
  recommendations: string[];
  metrics?: {
    linkedin?: Record<string, unknown>;
    instagram?: Record<string, unknown>;
    leads?: Record<string, unknown>;
  };
}

export function ReportPreview({ highlights, recommendations, metrics }: ReportPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Highlights */}
      <div className="bg-white border border-dc-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-semibold text-dc-green-600 uppercase tracking-wider mb-2">Highlights</p>
        <ul className="space-y-2">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 bg-dc-green-50 text-dc-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-dc-gray-700">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(metrics).map(([platform, data]) => (
            <div key={platform} className="bg-dc-gray-50 border border-dc-gray-200 rounded-xl p-3 text-center">
              <p className="text-[10px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1">{platform}</p>
              {data && typeof data === "object" ? (
                <div className="space-y-1">
                  {Object.entries(data).slice(0, 3).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-sm font-bold text-dc-gray-900">{String(val)}</p>
                      <p className="text-[10px] text-dc-gray-400">{key}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-dc-gray-400">Sin datos</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white border border-dc-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-semibold text-dc-blue-600 uppercase tracking-wider mb-2">Recomendaciones</p>
        <ul className="space-y-2">
          {recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-dc-gray-700">
              <span className="text-dc-blue-600 mt-1">&#8226;</span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
