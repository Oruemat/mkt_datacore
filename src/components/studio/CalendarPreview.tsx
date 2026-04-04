"use client";

import { useState, useMemo, useCallback } from "react";

interface CalendarEntry {
  date: string;
  platform: string;
  format: string;
  pillar: string;
  topic: string;
  time: string;
}

interface CalendarPreviewProps {
  entries: CalendarEntry[];
}

const PLATFORM_STYLES: Record<string, string> = {
  instagram: "bg-purple-50 text-purple-700",
  linkedin: "bg-dc-blue-50 text-dc-blue-600",
};

const FORMAT_STYLES: Record<string, string> = {
  post: "bg-dc-blue-50 text-dc-blue-600",
  carrusel: "bg-dc-orange-50 text-dc-orange-500",
  reel: "bg-dc-green-50 text-dc-green-600",
};

const PILLAR_BORDERS = [
  "border-l-dc-blue-600",
  "border-l-dc-orange-500",
  "border-l-dc-green-600",
  "border-l-purple-500",
  "border-l-pink-500",
];

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

export function CalendarPreview({ entries }: CalendarPreviewProps) {
  const [statuses, setStatuses] = useState<("pending" | "approved" | "rejected")[]>(
    () => entries.map(() => "pending"),
  );

  const allPillars = useMemo(() => Array.from(new Set(entries.map((e) => e.pillar))), [entries]);

  const grouped = useMemo(() => {
    const map = new Map<string, Array<{ entry: CalendarEntry; idx: number }>>();
    entries.forEach((entry, i) => {
      const list = map.get(entry.date) ?? [];
      list.push({ entry, idx: i });
      map.set(entry.date, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [entries]);

  const toggleStatus = useCallback((idx: number, target: "approved" | "rejected") => {
    setStatuses((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === target ? "pending" : target;
      return next;
    });
  }, []);

  return (
    <div className="space-y-4">
      {grouped.map(([date, items]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-dc-blue-600 uppercase tracking-wider">
              {formatDate(date)}
            </span>
            <div className="flex-1 h-px bg-dc-gray-200" />
            <span className="text-[11px] text-dc-gray-400">{items.length} posts</span>
          </div>

          <div className="space-y-1.5">
            {items.map(({ entry, idx }) => {
              const status = statuses[idx];
              const pillarIdx = allPillars.indexOf(entry.pillar);
              const borderClass = PILLAR_BORDERS[pillarIdx % PILLAR_BORDERS.length];

              return (
                <div
                  key={idx}
                  className={`bg-white border border-dc-gray-200 rounded-xl p-3 border-l-4 transition-all ${borderClass} ${
                    status === "approved" ? "ring-1 ring-dc-green-600/20 bg-dc-green-50/30" :
                    status === "rejected" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-mono text-dc-gray-400">{entry.time}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PLATFORM_STYLES[entry.platform.toLowerCase()] ?? "bg-dc-gray-100 text-dc-gray-600"}`}>
                      {entry.platform}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${FORMAT_STYLES[entry.format.toLowerCase()] ?? "bg-dc-gray-100 text-dc-gray-600"}`}>
                      {entry.format}
                    </span>
                    <span className="text-[10px] text-dc-gray-400 ml-auto">{entry.pillar}</span>
                    <div className="flex gap-1 ml-1">
                      <button
                        onClick={() => toggleStatus(idx, "approved")}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition ${
                          status === "approved" ? "bg-dc-green-100 text-dc-green-600" : "bg-dc-gray-100 text-dc-gray-400 hover:bg-dc-green-50 hover:text-dc-green-600"
                        }`}
                      >&#10003;</button>
                      <button
                        onClick={() => toggleStatus(idx, "rejected")}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition ${
                          status === "rejected" ? "bg-red-100 text-red-600" : "bg-dc-gray-100 text-dc-gray-400 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >&#10005;</button>
                    </div>
                  </div>
                  <p className={`text-sm text-dc-gray-700 leading-snug ${status === "rejected" ? "line-through text-dc-gray-400" : ""}`}>
                    {entry.topic}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-dc-gray-50 border border-dc-gray-200 rounded-xl p-4">
        <p className="text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-2">Resumen</p>
        <p className="text-xs text-dc-gray-600">
          Total: <span className="font-semibold text-dc-gray-900">{entries.length}</span> publicaciones
        </p>
      </div>
    </div>
  );
}
