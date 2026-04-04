"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DCPostVisualProps } from "@/remotion/compositions/DCPostVisual";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  commands?: DesignCommand[];
  timestamp: string;
}

interface DesignCommand {
  action: "updateProps" | "updateStyles" | "feedback";
  props?: Partial<DCPostVisualProps>;
  styles?: Record<string, unknown>;
  note?: string;
  category?: string;
}

interface VisualState {
  contentType: string;
  template?: string;
  title?: string;
  subtitle?: string;
  metricValue?: string;
  metricLabel?: string;
  comparisonBefore?: string[];
  comparisonAfter?: string[];
  tips?: string[];
  dashboardMetrics?: Array<{ label: string; value: string }>;
  variant?: string;
  copy?: string;
}

interface StudioChatProps {
  isOpen: boolean;
  onClose: () => void;
  visualState: VisualState;
  onApplyCommands: (commands: DesignCommand[]) => void;
}

function parseCommands(text: string): DesignCommand[] {
  const match = text.match(/```json:commands\s*\n([\s\S]*?)```/);
  if (!match) return [];
  try {
    return JSON.parse(match[1]) as DesignCommand[];
  } catch {
    return [];
  }
}

function stripCommandBlock(text: string): string {
  return text.replace(/```json:commands\s*\n[\s\S]*?```/g, "").trim();
}

export function StudioChat({ isOpen, onClose, visualState, onApplyCommands }: StudioChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Placeholder for assistant response
    const assistantId = `msg-${Date.now()}-a`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date().toISOString() },
    ]);

    try {
      const response = await fetch("/api/chat/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          visualState,
        }),
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "delta") {
              fullText += data.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
              );
            } else if (data.type === "done") {
              // Parse and apply commands
              const commands = parseCommands(fullText);
              if (commands.length > 0) {
                const actionable = commands.filter((c) => c.action === "updateProps" || c.action === "updateStyles");
                if (actionable.length > 0) {
                  onApplyCommands(actionable);
                }
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullText, commands } : m
                )
              );
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `Error: ${err instanceof Error ? err.message : "Conexion fallida"}` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, visualState, onApplyCommands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[380px] bg-white border-l border-dc-gray-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dc-gray-200 bg-dc-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-dc-blue-600 to-dc-blue-700 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dc-gray-900">Design Agent</h3>
            <p className="text-[10px] text-dc-gray-400">Modifica el visual con lenguaje natural</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-dc-gray-200 flex items-center justify-center text-dc-gray-400 hover:text-dc-gray-600 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-dc-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-dc-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dc-gray-700 mb-1">Pedime cualquier cambio</p>
            <p className="text-xs text-dc-gray-400 leading-relaxed max-w-[260px] mx-auto">
              &ldquo;Cambialo a dashboard&rdquo;, &ldquo;Hacelo mas impactante&rdquo;, &ldquo;Agregale mas items&rdquo;
            </p>
            {/* Quick suggestions */}
            <div className="mt-6 flex flex-wrap gap-1.5 justify-center">
              {[
                "Cambia a template comparison",
                "Agrega mas metricas",
                "Hacelo mas visual",
                "Mejora el titulo",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg bg-dc-blue-50 text-dc-blue-600 hover:bg-dc-blue-100 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-dc-blue-600 text-white rounded-br-md"
                  : "bg-dc-gray-100 text-dc-gray-800 rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="space-y-1.5">
                  <div className="whitespace-pre-wrap">{stripCommandBlock(msg.content)}</div>
                  {msg.commands && msg.commands.filter((c) => c.action === "updateProps" || c.action === "updateStyles").length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-dc-gray-200">
                      <div className="w-4 h-4 rounded-full bg-dc-green-100 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-dc-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[11px] text-dc-green-600 font-medium">
                        Cambios aplicados al visual
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 px-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-dc-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-dc-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-dc-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-dc-gray-200 p-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe que cambio queres..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-dc-gray-200 bg-dc-gray-50 px-3 py-2.5 text-sm text-dc-gray-900 placeholder:text-dc-gray-400 focus:border-dc-blue-600 focus:ring-1 focus:ring-dc-blue-600/20 focus:outline-none"
            style={{ maxHeight: 100, minHeight: 40 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="w-9 h-9 rounded-xl bg-dc-blue-600 text-white flex items-center justify-center hover:bg-dc-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-dc-gray-400 mt-1.5 text-center">
          Enter para enviar &middot; Shift+Enter para nueva linea
        </p>
      </div>
    </div>
  );
}
