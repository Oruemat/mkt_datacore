"use client";

interface StatusIndicatorProps {
  status: "idle" | "running" | "completed" | "error";
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = {
    idle: { color: "bg-dc-muted", label: "Esperando", pulse: false },
    running: { color: "bg-dc-electric", label: "Procesando", pulse: true },
    completed: { color: "bg-green-500", label: "Completado", pulse: false },
    error: { color: "bg-red-500", label: "Error", pulse: false },
  };

  const { color, label, pulse } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`} />
      <span className="text-sm text-dc-muted">{label}</span>
    </div>
  );
}
