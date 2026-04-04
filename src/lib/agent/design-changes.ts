import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase/client";

export interface DesignChangeEntry {
  id: string;
  sessionId: string;
  source: "chat" | "editor" | "auto";
  action: string; // "updateProps" | "updateStyles" | "feedback"
  contentType: string;
  template: string | null;
  changes: Record<string, unknown>;
  before: Record<string, unknown> | null;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CHANGES_FILE = path.join(DATA_DIR, "design-changes.json");
const MAX_LOCAL_ENTRIES = 500;

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch { /* exists */ }
}

export async function loadDesignChanges(): Promise<DesignChangeEntry[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(CHANGES_FILE, "utf-8");
    return JSON.parse(raw) as DesignChangeEntry[];
  } catch {
    return [];
  }
}

export async function saveDesignChange(entry: Omit<DesignChangeEntry, "id" | "createdAt">): Promise<void> {
  const full: DesignChangeEntry = {
    ...entry,
    id: `dc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  // Save to local JSON
  await ensureDataDir();
  const existing = await loadDesignChanges();
  existing.push(full);
  // Keep last N entries
  const trimmed = existing.slice(-MAX_LOCAL_ENTRIES);
  await fs.writeFile(CHANGES_FILE, JSON.stringify(trimmed, null, 2), "utf-8");

  // Also save to Supabase if available
  try {
    const supabase = getSupabase();
    if (supabase) {
      await (supabase.from("design_changes") as ReturnType<typeof supabase.from>).insert({
        session_id: full.sessionId,
        source: full.source,
        action: full.action,
        content_type: full.contentType,
        template: full.template,
        changes_json: JSON.stringify(full.changes),
        before_json: full.before ? JSON.stringify(full.before) : null,
      } as Record<string, unknown>);
    }
  } catch {
    // Supabase not available — local file is the fallback
  }
}

/**
 * Analyze patterns in design changes for improving templates.
 * Returns a summary of the most common modifications.
 */
export async function analyzeDesignPatterns(): Promise<{
  totalChanges: number;
  bySource: Record<string, number>;
  byAction: Record<string, number>;
  byTemplate: Record<string, number>;
  topStyleChanges: Array<{ property: string; count: number; avgValue?: number }>;
  topPropChanges: Array<{ property: string; count: number }>;
}> {
  const changes = await loadDesignChanges();

  const bySource: Record<string, number> = {};
  const byAction: Record<string, number> = {};
  const byTemplate: Record<string, number> = {};
  const styleFreq: Record<string, { count: number; values: number[] }> = {};
  const propFreq: Record<string, number> = {};

  for (const entry of changes) {
    bySource[entry.source] = (bySource[entry.source] || 0) + 1;
    byAction[entry.action] = (byAction[entry.action] || 0) + 1;
    if (entry.template) byTemplate[entry.template] = (byTemplate[entry.template] || 0) + 1;

    if (entry.action === "updateStyles" && entry.changes) {
      for (const [key, value] of Object.entries(entry.changes)) {
        if (!styleFreq[key]) styleFreq[key] = { count: 0, values: [] };
        styleFreq[key].count++;
        if (typeof value === "number") styleFreq[key].values.push(value);
      }
    }

    if (entry.action === "updateProps" && entry.changes) {
      for (const key of Object.keys(entry.changes)) {
        propFreq[key] = (propFreq[key] || 0) + 1;
      }
    }
  }

  const topStyleChanges = Object.entries(styleFreq)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([property, data]) => ({
      property,
      count: data.count,
      avgValue: data.values.length > 0
        ? Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)
        : undefined,
    }));

  const topPropChanges = Object.entries(propFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([property, count]) => ({ property, count }));

  return {
    totalChanges: changes.length,
    bySource,
    byAction,
    byTemplate,
    topStyleChanges,
    topPropChanges,
  };
}
