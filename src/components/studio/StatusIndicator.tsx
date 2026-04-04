"use client";

type Status = "idle" | "running" | "completed" | "error";

const STATUS_CONFIG: Record<Status, { label: string; dot: string; text: string }> = {
  idle: { label: "Listo", dot: "bg-dc-gray-400", text: "text-dc-gray-500" },
  running: { label: "Generando...", dot: "bg-dc-blue-600 animate-pulse", text: "text-dc-blue-600" },
  completed: { label: "Completado", dot: "bg-dc-green-600", text: "text-dc-green-600" },
  error: { label: "Error", dot: "bg-red-500", text: "text-red-500" },
};

export function StatusIndicator({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
    </div>
  );
}
