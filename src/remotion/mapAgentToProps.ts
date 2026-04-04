import type { DCPostVisualProps, DCTemplate } from "./compositions/DCPostVisual";
import type { DCCarouselProps } from "./compositions/DCCarousel";
import type { DCReelProps } from "./compositions/DCReel";

interface PostData {
  copy: string | null;
  hashtags: string[];
  imageTemplate?: string;
  imageTitle?: string;
  subtitle?: string;
  platform: string;
  // Structured visual data from agent
  metricValue?: string;
  metricLabel?: string;
  comparisonBefore?: string[];
  comparisonAfter?: string[];
  tips?: string[];
  dashboardMetrics?: Array<{ label: string; value: string }>;
}

interface ReelData {
  hook: string;
  problem: string;
  solution: string;
  result: string;
  cta: string;
  durationSeconds: number;
  scenes?: Array<{
    timeRange: string;
    label: string;
    visual: string;
    audio: string;
    text_overlay: string;
  }>;
}

interface CarouselSlideData {
  slideNumber: number;
  title: string;
  body: string;
  designNotes?: string;
}

/**
 * Extract tips from copy text (lines starting with numbers or bullets)
 */
function extractTips(copy: string): string[] {
  const lines = copy.split("\n").filter((l) => l.trim());
  const tips: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[\d•\-✅❌✓]/.test(trimmed)) {
      tips.push(trimmed.replace(/^[\d.)\-•✅❌✓\s]+/, "").trim());
    }
  }
  return tips.length > 0 ? tips : [];
}

/**
 * Extract before/after items from copy text
 */
function extractComparison(copy: string): { before: string[]; after: string[] } {
  const before: string[] = [];
  const after: string[] = [];
  const lines = copy.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("❌") || trimmed.startsWith("✗")) {
      before.push(trimmed.replace(/^[❌✗\s]+/, "").trim());
    } else if (trimmed.startsWith("✅") || trimmed.startsWith("✓")) {
      after.push(trimmed.replace(/^[✅✓\s]+/, "").trim());
    }
  }

  return { before, after };
}

/**
 * Extract dashboard metrics from copy (lines with : separator or numbers)
 */
function extractMetrics(copy: string): Array<{ label: string; value: string }> {
  const metrics: Array<{ label: string; value: string }> = [];
  const lines = copy.split("\n").filter((l) => l.trim());

  for (const line of lines) {
    const match = line.match(/^(.+?):\s*(.+)$/);
    if (match) {
      metrics.push({ label: match[1].trim(), value: match[2].trim() });
    }
  }

  return metrics.slice(0, 6);
}

export function mapPostToRemotionProps(data: PostData): DCPostVisualProps {
  const template = (data.imageTemplate as DCTemplate) || "hero";
  const copy = data.copy || "";

  const baseProps: DCPostVisualProps = {
    template,
    title: data.imageTitle || copy.split("\n")[0]?.slice(0, 80) || "DataCore",
    subtitle: data.subtitle,
    copy,
    hashtags: data.hashtags,
    variant: "dark",
  };

  // Template-specific enrichments — prioritize agent-provided structured data
  switch (template) {
    case "metric": {
      baseProps.metricValue = data.metricValue || (() => {
        const numMatch = (data.imageTitle || copy).match(/[\d,.]+%?/);
        return numMatch ? numMatch[0] : data.imageTitle || "100%";
      })();
      baseProps.metricLabel = data.metricLabel || data.subtitle || "Mejora promedio";
      break;
    }
    case "comparison": {
      if (data.comparisonBefore && data.comparisonBefore.length > 0) {
        baseProps.comparisonBefore = data.comparisonBefore;
        baseProps.comparisonAfter = data.comparisonAfter || [];
      } else {
        const { before, after } = extractComparison(copy);
        baseProps.comparisonBefore = before.length > 0 ? before : ["Sin datos centralizados", "Reportes manuales", "Decisiones por intuicion"];
        baseProps.comparisonAfter = after.length > 0 ? after : ["Dashboard en tiempo real", "Reportes automatizados", "Decisiones basadas en datos"];
      }
      break;
    }
    case "tips": {
      if (data.tips && data.tips.length > 0) {
        baseProps.tips = data.tips;
      } else {
        const tips = extractTips(copy);
        baseProps.tips = tips.length > 0 ? tips : ["Centraliza tus fuentes de datos", "Automatiza reportes clave", "Mide lo que importa"];
      }
      break;
    }
    case "dashboard": {
      if (data.dashboardMetrics && data.dashboardMetrics.length > 0) {
        baseProps.dashboardMetrics = data.dashboardMetrics;
      } else {
        const metrics = extractMetrics(copy);
        baseProps.dashboardMetrics = metrics.length > 0
          ? metrics
          : [
              { label: "Conversion", value: "12.4%" },
              { label: "Leads", value: "847" },
              { label: "ROI", value: "3.2x" },
              { label: "Ahorro", value: "40hrs" },
            ];
      }
      break;
    }
  }

  return baseProps;
}

export function mapCarouselToRemotionProps(slides: CarouselSlideData[]): DCCarouselProps {
  return {
    slides: slides.map((s) => ({
      slideNumber: s.slideNumber,
      title: s.title,
      body: s.body,
      designNotes: s.designNotes,
    })),
  };
}

export function mapReelToRemotionProps(script: ReelData): DCReelProps {
  return {
    hook: script.hook,
    problem: script.problem,
    solution: script.solution,
    result: script.result,
    cta: script.cta,
    durationSeconds: script.durationSeconds || 35,
    scenes: script.scenes,
  };
}
