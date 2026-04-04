"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { AgentStep, SkillName, Platform, ContentPillar, BrandbookVerdict } from "@/lib/agent/types";
import type { DCCarouselProps } from "@/remotion/compositions/DCCarousel";
import type { DCReelProps } from "@/remotion/compositions/DCReel";
import { mapPostToRemotionProps, mapCarouselToRemotionProps, mapReelToRemotionProps } from "@/remotion/mapAgentToProps";
import { findJsonBlocks } from "@/lib/utils/jsonParser";

import { StudioLayout } from "@/components/studio/StudioLayout";
import { TaskPanel } from "@/components/studio/TaskPanel";
import { StatusIndicator } from "@/components/studio/StatusIndicator";
import { AgentDrawer } from "@/components/studio/AgentDrawer";
import { ContentPanel } from "@/components/studio/ContentPanel";
import type { ContentType } from "@/components/studio/ContentPanel";
import { ActionBar } from "@/components/studio/ActionBar";
import { PostPreview } from "@/components/studio/PostPreview";
import { CarouselPreview } from "@/components/studio/CarouselPreview";
import { ReelPreview } from "@/components/studio/ReelPreview";
import { CalendarPreview } from "@/components/studio/CalendarPreview";
import { EmailPreview } from "@/components/studio/EmailPreview";
import { LeadPreview } from "@/components/studio/LeadPreview";
import { ReportPreview } from "@/components/studio/ReportPreview";
import { VisualEditor } from "@/components/studio/VisualEditor";
import { StudioChat } from "@/components/studio/StudioChat";
import { IdlePlaceholder, SkeletonPreview } from "@/components/studio/LoadingStates";

const RemotionPreview = dynamic(
  () => import("@/components/studio/RemotionPreview").then((m) => ({ default: m.RemotionPreview })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse text-dc-gray-400 text-sm">Cargando preview...</div>
      </div>
    ),
  },
);

type AgentStatus = "idle" | "running" | "completed" | "error";

interface TaskInput {
  type: SkillName;
  topic: string;
  platform?: Platform;
  pillar?: ContentPillar;
  extraContext?: string;
}

interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
  designNotes: string;
}

interface ReelScript {
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

interface CalendarEntry {
  date: string;
  platform: string;
  format: string;
  pillar: string;
  topic: string;
  time: string;
}

interface EmailData {
  day: number;
  subject: string;
  body: string;
  objective: string;
}

interface LeadData {
  temperature: string;
  reasoning: string;
  nextStep: string;
  suggestedMessage?: string;
}

interface ReportData {
  highlights: string[];
  recommendations: string[];
  metrics?: Record<string, unknown>;
}

function skillToContentType(skill: SkillName): ContentType {
  switch (skill) {
    case "post_writer_instagram":
    case "post_writer_linkedin":
      return "post";
    case "carrusel_writer":
      return "carousel";
    case "reels_script":
      return "reel";
    case "calendar_planner":
      return "calendar";
    case "email_sequence_writer":
      return "email";
    case "lead_classifier":
      return "lead";
    case "weekly_performance_reporter":
      return "report";
    case "brandbook_enforcer":
      return "brandbook";
    default:
      return "post";
  }
}

export default function StudioPage() {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [contentType, setContentType] = useState<ContentType>("post");

  // Post state
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedVariantB, setGeneratedVariantB] = useState<string | undefined>();
  const [generatedVisualSuggestion, setGeneratedVisualSuggestion] = useState<string | undefined>();
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | undefined>();
  const [generatedImageTemplate, setGeneratedImageTemplate] = useState<string | undefined>();
  const [generatedImageTitle, setGeneratedImageTitle] = useState<string | undefined>();
  const [generatedSubtitle, setGeneratedSubtitle] = useState<string | undefined>();

  // Structured visual data for rich templates
  const [generatedMetricValue, setGeneratedMetricValue] = useState<string | undefined>();
  const [generatedMetricLabel, setGeneratedMetricLabel] = useState<string | undefined>();
  const [generatedComparisonBefore, setGeneratedComparisonBefore] = useState<string[] | undefined>();
  const [generatedComparisonAfter, setGeneratedComparisonAfter] = useState<string[] | undefined>();
  const [generatedTips, setGeneratedTips] = useState<string[] | undefined>();
  const [generatedDashboardMetrics, setGeneratedDashboardMetrics] = useState<Array<{ label: string; value: string }> | undefined>();

  // Carousel state
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

  // Reel state
  const [reelScript, setReelScript] = useState<ReelScript | null>(null);

  // Calendar state
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);

  // Structured content state
  const [emailData, setEmailData] = useState<EmailData[] | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const [currentPlatform, setCurrentPlatform] = useState<Platform>("instagram");
  const [brandVerdict, setBrandVerdict] = useState<BrandbookVerdict | null>(null);
  const [lastTask, setLastTask] = useState<TaskInput | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Prop overrides for visual editor
  const [postPropsOverrides, setPostPropsOverrides] = useState<Record<string, unknown>>({});
  const [carouselPropsOverrides, setCarouselPropsOverrides] = useState<Partial<DCCarouselProps>>({});
  const [reelPropsOverrides, setReelPropsOverrides] = useState<Partial<DCReelProps>>({});

  // Design chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auto-render: ready-to-download URLs
  const [readyPngUrl, setReadyPngUrl] = useState<string | null>(null);
  const [readyMp4Url, setReadyMp4Url] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<"idle" | "rendering_png" | "rendering_mp4" | "done">("idle");
  const autoRenderTriggered = useRef(false);

  // ── Remotion Props ──────────────────────────────────────

  const remotionPostProps = useMemo(() => {
    if (contentType !== "post" || !generatedCopy) return undefined;
    const base = mapPostToRemotionProps({
      copy: generatedCopy,
      hashtags: generatedHashtags,
      imageTemplate: generatedImageTemplate,
      imageTitle: generatedImageTitle,
      subtitle: generatedSubtitle,
      platform: currentPlatform,
      metricValue: generatedMetricValue,
      metricLabel: generatedMetricLabel,
      comparisonBefore: generatedComparisonBefore,
      comparisonAfter: generatedComparisonAfter,
      tips: generatedTips,
      dashboardMetrics: generatedDashboardMetrics,
    });
    return { ...base, ...postPropsOverrides } as typeof base;
  }, [contentType, generatedCopy, generatedHashtags, generatedImageTemplate, generatedImageTitle, generatedSubtitle, currentPlatform, generatedMetricValue, generatedMetricLabel, generatedComparisonBefore, generatedComparisonAfter, generatedTips, generatedDashboardMetrics, postPropsOverrides]);

  const remotionCarouselProps = useMemo(() => {
    if (contentType !== "carousel" || carouselSlides.length === 0) return undefined;
    const base = mapCarouselToRemotionProps(carouselSlides);
    return { ...base, ...carouselPropsOverrides } as typeof base;
  }, [contentType, carouselSlides, carouselPropsOverrides]);

  const remotionReelProps = useMemo(() => {
    if (contentType !== "reel" || !reelScript) return undefined;
    const base = mapReelToRemotionProps(reelScript);
    return { ...base, ...reelPropsOverrides } as typeof base;
  }, [contentType, reelScript, reelPropsOverrides]);

  // ── Reset ───────────────────────────────────────────────

  const resetOutput = useCallback(() => {
    setGeneratedCopy(null);
    setGeneratedHashtags([]);
    setGeneratedVariantB(undefined);
    setGeneratedVisualSuggestion(undefined);
    setGeneratedImagePrompt(undefined);
    setGeneratedImageTemplate(undefined);
    setGeneratedImageTitle(undefined);
    setGeneratedSubtitle(undefined);
    setGeneratedMetricValue(undefined);
    setGeneratedMetricLabel(undefined);
    setGeneratedComparisonBefore(undefined);
    setGeneratedComparisonAfter(undefined);
    setGeneratedTips(undefined);
    setGeneratedDashboardMetrics(undefined);
    setCarouselSlides([]);
    setReelScript(null);
    setCalendarEntries([]);
    setEmailData(null);
    setLeadData(null);
    setReportData(null);
    setBrandVerdict(null);
    setPostPropsOverrides({});
    setCarouselPropsOverrides({});
    setReelPropsOverrides({});
    // Reset auto-render
    if (readyPngUrl) URL.revokeObjectURL(readyPngUrl);
    if (readyMp4Url) URL.revokeObjectURL(readyMp4Url);
    setReadyPngUrl(null);
    setReadyMp4Url(null);
    setRenderStatus("idle");
    autoRenderTriggered.current = false;
  }, [readyPngUrl, readyMp4Url]);

  // ── Content Extraction ──────────────────────────────────

  const extractContent = useCallback((step: AgentStep) => {
    if (step.type !== "completed" && step.type !== "thinking") return;
    const content = step.content;
    try {
      const jsonBlocks = findJsonBlocks(content);

      for (const json of jsonBlocks) {
        // Post
        if (json.copy && typeof json.copy === "string") {
          setGeneratedCopy(json.copy as string);
          if (json.hashtags) setGeneratedHashtags(json.hashtags as string[]);
          if (json.variantB) setGeneratedVariantB(json.variantB as string);
          if (json.visualSuggestion) setGeneratedVisualSuggestion(json.visualSuggestion as string);
          if (json.imagePrompt) setGeneratedImagePrompt(json.imagePrompt as string);
          if (json.imageTemplate) setGeneratedImageTemplate(json.imageTemplate as string);
          if (json.imageTitle) setGeneratedImageTitle(json.imageTitle as string);
          if (json.subtitle) setGeneratedSubtitle(json.subtitle as string);
          // Structured visual data for rich templates
          if (json.metricValue) setGeneratedMetricValue(json.metricValue as string);
          if (json.metricLabel) setGeneratedMetricLabel(json.metricLabel as string);
          if (json.comparisonBefore && Array.isArray(json.comparisonBefore)) setGeneratedComparisonBefore(json.comparisonBefore as string[]);
          if (json.comparisonAfter && Array.isArray(json.comparisonAfter)) setGeneratedComparisonAfter(json.comparisonAfter as string[]);
          if (json.tips && Array.isArray(json.tips)) setGeneratedTips(json.tips as string[]);
          if (json.dashboardMetrics && Array.isArray(json.dashboardMetrics)) setGeneratedDashboardMetrics(json.dashboardMetrics as Array<{ label: string; value: string }>);
        }

        // Carousel
        if (json.slides && Array.isArray(json.slides)) {
          setCarouselSlides(json.slides as CarouselSlide[]);
          if (json.imagePrompt) setGeneratedImagePrompt(json.imagePrompt as string);
        }

        // Reel
        if (json.hook && json.problem && json.solution && json.cta) {
          setReelScript(json as unknown as ReelScript);
        }

        // Calendar
        if (json.entries && Array.isArray(json.entries) && json.entries[0]?.date) {
          setCalendarEntries(json.entries as CalendarEntry[]);
        }

        // Emails
        if (json.emails && Array.isArray(json.emails)) {
          setEmailData(json.emails as EmailData[]);
        }

        // Lead
        if (json.temperature && json.reasoning) {
          setLeadData(json as unknown as LeadData);
        }

        // Report
        if (json.highlights && json.recommendations) {
          setReportData(json as unknown as ReportData);
        }

        // Brand verdict
        if (json.verdict) {
          setBrandVerdict(json.verdict as BrandbookVerdict);
        }
      }
    } catch {
      if (step.type === "completed") {
        setGeneratedCopy((prev) => prev || content);
      }
    }
  }, []);

  // ── Run Agent ───────────────────────────────────────────

  const runAgent = useCallback(async (task: TaskInput) => {
    setSteps([]);
    resetOutput();
    setStatus("running");
    setLastTask(task);
    setCurrentPlatform(task.platform || "instagram");
    setContentType(skillToContentType(task.type));

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (currentEvent === "step") {
                const step = parsed as AgentStep;
                setSteps((prev) => [...prev, step]);
                extractContent(step);
              } else if (currentEvent === "done") {
                setStatus("completed");
              } else if (currentEvent === "error") {
                setStatus("error");
                setSteps((prev) => [...prev, {
                  id: "error-" + Date.now(),
                  type: "error" as const,
                  content: parsed.message,
                  timestamp: new Date().toISOString(),
                }]);
              }
            } catch {
              // skip malformed
            }
          }
        }
      }
      setStatus((prev) => prev === "running" ? "completed" : prev);
    } catch (err) {
      setStatus("error");
      setSteps((prev) => [...prev, {
        id: "error-" + Date.now(),
        type: "error" as const,
        content: err instanceof Error ? err.message : "Error de conexion",
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [resetOutput, extractContent]);

  // ── Handlers ────────────────────────────────────────────

  function handleCopyText() {
    let text = "";
    if (contentType === "post" && generatedCopy) {
      text = generatedHashtags.length > 0
        ? generatedCopy + "\n\n" + generatedHashtags.join(" ")
        : generatedCopy;
    } else if (contentType === "carousel" && carouselSlides.length > 0) {
      text = carouselSlides.map((s) => `Slide ${s.slideNumber}: ${s.title}\n${s.body}`).join("\n\n");
    } else if (contentType === "reel" && reelScript) {
      text = `GANCHO: ${reelScript.hook}\nPROBLEMA: ${reelScript.problem}\nSOLUCION: ${reelScript.solution}\nRESULTADO: ${reelScript.result}\nCTA: ${reelScript.cta}`;
    } else if (contentType === "calendar" && calendarEntries.length > 0) {
      text = calendarEntries.map((e) => `${e.date} ${e.time} | ${e.platform} | ${e.format} | ${e.pillar} | ${e.topic}`).join("\n");
    } else if (generatedCopy) {
      text = generatedCopy;
    }
    if (text) navigator.clipboard.writeText(text);
  }

  async function handleDownloadImage() {
    setIsRendering(true);
    try {
      let compositionId = "DCPostVisual";
      let inputProps = remotionPostProps || {};
      const width = 1080;
      const height = 1080;

      if (contentType === "carousel" && remotionCarouselProps) {
        compositionId = "DCCarousel";
        inputProps = remotionCarouselProps;
      }

      const response = await fetch("/api/render/still", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compositionId, inputProps, frame: 45, width, height }),
      });

      if (!response.ok) throw new Error("Render failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `datacore-${contentType}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download image error:", err);
    } finally {
      setIsRendering(false);
    }
  }

  async function handleDownloadVideo() {
    setIsRendering(true);
    try {
      let compositionId = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let inputProps: any = {};
      let width = 1080;
      let height = 1080;
      const fps = 30;
      let durationInFrames = 90; // 3 seconds default

      if (contentType === "reel" && remotionReelProps) {
        compositionId = "DCReel";
        inputProps = { ...remotionReelProps };
        width = 1080;
        height = 1920;
        durationInFrames = (remotionReelProps.durationSeconds || 35) * 30;
      } else if (contentType === "carousel" && remotionCarouselProps) {
        compositionId = "DCCarousel";
        inputProps = { ...remotionCarouselProps };
        // 3 seconds per slide
        durationInFrames = remotionCarouselProps.slides.length * 90;
      } else if (contentType === "post" && remotionPostProps) {
        compositionId = "DCPostVisual";
        inputProps = { ...remotionPostProps };
        durationInFrames = 90; // 3 seconds for post animation
      } else {
        setIsRendering(false);
        return;
      }

      const response = await fetch("/api/render/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compositionId, inputProps, width, height, fps, durationInFrames }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Render failed" }));
        throw new Error(err.error || "Render failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `datacore-reel-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download video error:", err);
    } finally {
      setIsRendering(false);
    }
  }

  function handleApprove() {
    setBrandVerdict("APROBADO");
  }

  function handleReject() {
    if (lastTask) {
      runAgent({
        ...lastTask,
        extraContext: (lastTask.extraContext || "") + " NOTA: La version anterior fue rechazada. Genera una version diferente con un hook distinto.",
      });
    }
  }

  // ── Computed ────────────────────────────────────────────

  const hasContent =
    !!generatedCopy ||
    carouselSlides.length > 0 ||
    !!reelScript ||
    calendarEntries.length > 0 ||
    !!emailData ||
    !!leadData ||
    !!reportData;

  const hasRemotionPreview =
    (contentType === "post" && !!remotionPostProps) ||
    (contentType === "carousel" && !!remotionCarouselProps) ||
    (contentType === "reel" && !!remotionReelProps);

  // Visual state for design chat context
  const chatVisualState = useMemo(() => ({
    contentType,
    template: remotionPostProps?.template || generatedImageTemplate,
    title: remotionPostProps?.title || generatedImageTitle,
    subtitle: remotionPostProps?.subtitle || generatedSubtitle,
    metricValue: remotionPostProps?.metricValue || generatedMetricValue,
    metricLabel: remotionPostProps?.metricLabel || generatedMetricLabel,
    comparisonBefore: remotionPostProps?.comparisonBefore || generatedComparisonBefore,
    comparisonAfter: remotionPostProps?.comparisonAfter || generatedComparisonAfter,
    tips: remotionPostProps?.tips || generatedTips,
    dashboardMetrics: remotionPostProps?.dashboardMetrics || generatedDashboardMetrics,
    variant: remotionPostProps?.variant,
    copy: generatedCopy || undefined,
    styles: (postPropsOverrides.styles as Record<string, unknown>) || undefined,
  }), [contentType, remotionPostProps, generatedImageTemplate, generatedImageTitle, generatedSubtitle, generatedMetricValue, generatedMetricLabel, generatedComparisonBefore, generatedComparisonAfter, generatedTips, generatedDashboardMetrics, generatedCopy, postPropsOverrides.styles]);

  const handleChatCommands = useCallback((commands: Array<{ action: string; props?: Record<string, unknown>; styles?: Record<string, unknown> }>) => {
    for (const cmd of commands) {
      if (cmd.action === "updateProps" && cmd.props) {
        if (cmd.props.template) setGeneratedImageTemplate(cmd.props.template as string);
        if (cmd.props.title) setGeneratedImageTitle(cmd.props.title as string);
        if (cmd.props.subtitle) setGeneratedSubtitle(cmd.props.subtitle as string);
        if (cmd.props.metricValue) setGeneratedMetricValue(cmd.props.metricValue as string);
        if (cmd.props.metricLabel) setGeneratedMetricLabel(cmd.props.metricLabel as string);
        if (cmd.props.comparisonBefore) setGeneratedComparisonBefore(cmd.props.comparisonBefore as string[]);
        if (cmd.props.comparisonAfter) setGeneratedComparisonAfter(cmd.props.comparisonAfter as string[]);
        if (cmd.props.tips) setGeneratedTips(cmd.props.tips as string[]);
        if (cmd.props.dashboardMetrics) setGeneratedDashboardMetrics(cmd.props.dashboardMetrics as Array<{ label: string; value: string }>);
        if (cmd.props.variant) setPostPropsOverrides((prev) => ({ ...prev, variant: cmd.props!.variant }));
      }
      if (cmd.action === "updateStyles" && cmd.styles) {
        // Merge style overrides into postPropsOverrides under the "styles" key
        setPostPropsOverrides((prev) => ({
          ...prev,
          styles: { ...((prev.styles as Record<string, unknown>) || {}), ...cmd.styles },
        }));
      }
    }
  }, []);

  // ── Auto-Render Effect ──────────────────────────────────
  // When agent finishes and we have a visual preview, auto-render PNG + MP4

  useEffect(() => {
    if (status !== "completed" || !hasRemotionPreview || autoRenderTriggered.current) return;
    autoRenderTriggered.current = true;

    // Determine composition details
    let compositionId = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let inputProps: any = {};
    let width = 1080;
    let height = 1080;
    let durationInFrames = 90;

    if (contentType === "post" && remotionPostProps) {
      compositionId = "DCPostVisual";
      inputProps = { ...remotionPostProps };
    } else if (contentType === "carousel" && remotionCarouselProps) {
      compositionId = "DCCarousel";
      inputProps = { ...remotionCarouselProps };
      durationInFrames = remotionCarouselProps.slides.length * 90;
    } else if (contentType === "reel" && remotionReelProps) {
      compositionId = "DCReel";
      inputProps = { ...remotionReelProps };
      width = 1080;
      height = 1920;
      durationInFrames = (remotionReelProps.durationSeconds || 35) * 30;
    } else {
      return;
    }

    async function autoRender() {
      // Render PNG
      setRenderStatus("rendering_png");
      try {
        const pngRes = await fetch("/api/render/still", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ compositionId, inputProps, frame: 45, width, height }),
        });
        if (pngRes.ok) {
          const blob = await pngRes.blob();
          setReadyPngUrl(URL.createObjectURL(blob));
        }
      } catch {
        // non-blocking
      }

      // Render MP4
      setRenderStatus("rendering_mp4");
      try {
        const mp4Res = await fetch("/api/render/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ compositionId, inputProps, width, height, fps: 30, durationInFrames }),
        });
        if (mp4Res.ok) {
          const blob = await mp4Res.blob();
          setReadyMp4Url(URL.createObjectURL(blob));
        }
      } catch {
        // non-blocking
      }

      setRenderStatus("done");
    }

    autoRender();
  }, [status, hasRemotionPreview, contentType, remotionPostProps, remotionCarouselProps, remotionReelProps]);

  // ── Copy Tab Content ────────────────────────────────────

  const copyTabContent = (
    <>
      {contentType === "post" && generatedCopy && (
        <PostPreview
          copy={generatedCopy}
          hashtags={generatedHashtags}
          platform={currentPlatform}
          variantB={generatedVariantB}
          visualSuggestion={generatedVisualSuggestion}
        />
      )}
      {contentType === "carousel" && carouselSlides.length > 0 && (
        <CarouselPreview slides={carouselSlides} />
      )}
      {contentType === "reel" && reelScript && (
        <ReelPreview script={reelScript} />
      )}
      {contentType === "calendar" && calendarEntries.length > 0 && (
        <CalendarPreview entries={calendarEntries} />
      )}
      {contentType === "email" && emailData && (
        <EmailPreview emails={emailData} />
      )}
      {contentType === "lead" && leadData && (
        <LeadPreview
          temperature={leadData.temperature}
          reasoning={leadData.reasoning}
          nextStep={leadData.nextStep}
          suggestedMessage={leadData.suggestedMessage}
        />
      )}
      {contentType === "report" && reportData && (
        <ReportPreview
          highlights={reportData.highlights}
          recommendations={reportData.recommendations}
          metrics={reportData.metrics as ReportData["metrics"]}
        />
      )}
      {/* Fallback for brandbook */}
      {contentType === "brandbook" && generatedCopy && (
        <div className="bg-white border border-dc-gray-200 rounded-xl p-4">
          <pre className="text-sm text-dc-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {generatedCopy}
          </pre>
        </div>
      )}
    </>
  );

  // ── Editor Tab Content ──────────────────────────────────

  const editorTabContent = hasRemotionPreview ? (
    <VisualEditor
      contentType={contentType}
      postProps={remotionPostProps}
      carouselProps={remotionCarouselProps}
      reelProps={remotionReelProps}
      onUpdatePostProps={(updates) => setPostPropsOverrides((prev) => ({ ...prev, ...updates }))}
      onUpdateCarouselProps={(updates) => setCarouselPropsOverrides((prev) => ({ ...prev, ...updates }))}
      onUpdateReelProps={(updates) => setReelPropsOverrides((prev) => ({ ...prev, ...updates }))}
    />
  ) : undefined;

  // ── Details Tab Content ─────────────────────────────────

  const detailsTabContent = generatedImagePrompt || generatedVisualSuggestion ? (
    <div className="space-y-3">
      {generatedImagePrompt && (
        <div className="bg-dc-orange-50 border border-dc-orange-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-dc-orange-600 uppercase tracking-wider">
              Prompt para IA externa
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(generatedImagePrompt)}
              className="text-[10px] px-2 py-0.5 bg-dc-orange-500 text-white rounded-lg hover:bg-dc-orange-600 transition"
            >
              Copiar
            </button>
          </div>
          <p className="text-xs text-dc-gray-600 whitespace-pre-wrap leading-relaxed">{generatedImagePrompt}</p>
          <p className="text-[10px] text-dc-gray-400 mt-2">
            Pega este prompt en Perplexity, DALL-E o Midjourney para generar la imagen.
          </p>
        </div>
      )}
      {generatedVisualSuggestion && (
        <div className="bg-dc-gray-50 border border-dc-gray-200 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-dc-gray-400 uppercase tracking-wider mb-1">Sugerencia visual</p>
          <p className="text-xs text-dc-gray-600 leading-relaxed">{generatedVisualSuggestion}</p>
        </div>
      )}
    </div>
  ) : undefined;

  // ── Render ──────────────────────────────────────────────

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <TaskPanel onSubmit={runAgent} isRunning={status === "running"} />
      </div>
      <AgentDrawer steps={steps} isRunning={status === "running"} />
    </div>
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {status === "idle" && !hasContent && <IdlePlaceholder />}

        {status === "running" && !hasContent && <SkeletonPreview contentType={contentType} />}

        {/* Remotion visual preview */}
        {hasRemotionPreview && (
          <RemotionPreview
            contentType={contentType}
            postProps={remotionPostProps}
            carouselProps={remotionCarouselProps}
            reelProps={remotionReelProps}
          />
        )}

        {/* Content tabs */}
        {hasContent && (
          <ContentPanel
            copyTab={copyTabContent}
            editorTab={editorTabContent}
            detailsTab={detailsTabContent}
            hasContent={hasContent}
          />
        )}
      </div>

      {/* Action bar */}
      <ActionBar
        contentType={contentType}
        brandVerdict={brandVerdict}
        hasContent={hasContent}
        isRunning={status === "running"}
        isRendering={isRendering}
        renderStatus={renderStatus}
        readyPngUrl={readyPngUrl}
        readyMp4Url={readyMp4Url}
        onCopyText={handleCopyText}
        onDownloadImage={handleDownloadImage}
        onDownloadVideo={handleDownloadVideo}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );

  return (
    <>
      <StudioLayout
        sidebar={sidebar}
        main={mainContent}
        status={<StatusIndicator status={status} />}
      />

      {/* Design chat toggle */}
      {hasContent && (
        <button
          onClick={() => setIsChatOpen((v) => !v)}
          className={`fixed right-4 bottom-4 z-40 w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
            isChatOpen
              ? "bg-dc-gray-200 text-dc-gray-600 hover:bg-dc-gray-300"
              : "bg-gradient-to-br from-dc-blue-600 to-dc-blue-700 text-white hover:shadow-xl hover:shadow-dc-blue-600/25"
          }`}
          title="Design Agent"
        >
          {isChatOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          )}
        </button>
      )}

      {/* Design chat panel */}
      <StudioChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        visualState={chatVisualState}
        onApplyCommands={handleChatCommands}
      />
    </>
  );
}
