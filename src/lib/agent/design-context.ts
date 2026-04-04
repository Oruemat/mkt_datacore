/**
 * Persistent design feedback context.
 * Stores design decisions and user preferences learned through chat interactions.
 * Loaded into the design agent's system prompt for continuous improvement.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const CONTEXT_DIR = join(process.cwd(), "data");
const CONTEXT_FILE = join(CONTEXT_DIR, "design-feedback.json");

export interface DesignFeedbackEntry {
  id: string;
  note: string;
  category: "preference" | "rule" | "improvement" | "general";
  createdAt: string;
}

export async function loadDesignFeedback(): Promise<DesignFeedbackEntry[]> {
  try {
    const raw = await readFile(CONTEXT_FILE, "utf-8");
    return JSON.parse(raw) as DesignFeedbackEntry[];
  } catch {
    return [];
  }
}

export async function saveDesignFeedback(entry: Omit<DesignFeedbackEntry, "id" | "createdAt">): Promise<void> {
  const entries = await loadDesignFeedback();

  entries.push({
    ...entry,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  // Keep last 50 entries
  const trimmed = entries.slice(-50);

  await mkdir(CONTEXT_DIR, { recursive: true });
  await writeFile(CONTEXT_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
}

export function formatFeedbackForPrompt(entries: DesignFeedbackEntry[]): string {
  if (entries.length === 0) return "";

  const lines = entries.slice(-20).map((e) => `- [${e.category}] ${e.note}`);
  return `\n## FEEDBACK ACUMULADO DEL USUARIO\nEstas son preferencias y reglas aprendidas de interacciones anteriores:\n${lines.join("\n")}`;
}
