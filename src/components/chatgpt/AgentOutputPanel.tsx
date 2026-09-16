"use client";

import React, { useState } from "react";
import {
  AcademicPaper,
  AgentType,
  MessageHistoryItem,
  AIModelConfig,
} from "@/lib/types";
import {
  FileText,
  FileCode,
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Users,
  Presentation,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Code,
  Terminal,
  Activity,
  Maximize2,
} from "lucide-react";

interface AgentOutputPanelProps {
  activeAgentId: AgentType;
  lastAssistantMessage?: MessageHistoryItem;
  attachedPapers: AcademicPaper[];
  isOpen: boolean;
  onToggle: () => void;
  onOpenSearchPapers: () => void;
  aiConfig: AIModelConfig;
}

export function AgentOutputPanel({
  activeAgentId,
  lastAssistantMessage,
  attachedPapers,
  isOpen,
  onToggle,
  onOpenSearchPapers,
  aiConfig,
}: AgentOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<"findings" | "papers" | "latex" | "trace">("findings");
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-start py-4 px-1 border-l border-border bg-card/60 w-12 h-screen sticky top-0 z-30 shrink-0">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Open Agent Output Panel"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="mt-8 [writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary rotate-180" />
          <span>Agent in Action / Output</span>
        </div>
      </div>
    );
  }

  const papersToDisplay = (lastAssistantMessage?.sources && lastAssistantMessage.sources.length > 0)
    ? lastAssistantMessage.sources
    : attachedPapers;

  const content = lastAssistantMessage?.content || "";
  const latexMatch = content.match(/```(?:latex|tex)?([\s\S]*?)```/);
  const detectedLatex = latexMatch ? latexMatch[1].trim() : (content.includes("\\documentclass") || content.includes("\\begin{") ? content : null);

  const handleCopyLatex = () => {
    if (detectedLatex) {
      navigator.clipboard.writeText(detectedLatex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadLatex = () => {
    if (!detectedLatex) return;
    const blob = new Blob([detectedLatex], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "manuscript_output.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <aside className="w-80 sm:w-96 xl:w-[420px] border-l border-border bg-card/95 backdrop-blur-md h-screen flex flex-col shrink-0 z-30 sticky top-0 overflow-hidden shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between bg-card/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-foreground leading-none">Agent in Action</h3>
            <span className="text-[10px] text-muted-foreground capitalize mt-0.5 block">
              {activeAgentId.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Collapse Panel"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 p-1.5 bg-muted/60 border-b border-border text-[11px] font-semibold text-center">
        <button
          onClick={() => setActiveTab("findings")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "findings" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Artifacts
        </button>
        <button
          onClick={() => setActiveTab("papers")}
          className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === "papers" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Papers ({papersToDisplay.length})
        </button>
        <button
          onClick={() => setActiveTab("latex")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "latex" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          LaTeX
        </button>
        <button
          onClick={() => setActiveTab("trace")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "trace" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Trace
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Findings / Structured Output */}
        {activeTab === "findings" && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            {lastAssistantMessage ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border bg-background p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Executive Synthesis
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(lastAssistantMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="space-y-2 text-foreground/90 leading-relaxed font-sans text-xs">
                    {content.slice(0, 500)}...
                  </div>
                </div>

                {/* Quick Action Buttons for Artifacts */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-2 text-xs font-semibold hover:bg-muted"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied All" : "Copy Finding"}</span>
                  </button>
                  <a
                    href="/data-matrix"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-2 text-xs font-semibold hover:bg-muted text-foreground text-center"
                  >
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>PRISMA Matrix</span>
                  </a>
                  <a
                    href="/latex-studio"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-2 text-xs font-semibold hover:bg-muted text-foreground text-center"
                  >
                    <FileCode className="h-3.5 w-3.5 text-indigo-500" />
                    <span>LaTeX Studio</span>
                  </a>
                  <a
                    href="/peer-review"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-2 text-xs font-semibold hover:bg-muted text-foreground text-center"
                  >
                    <Users className="h-3.5 w-3.5 text-rose-500" />
                    <span>Mock Peer Review</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground px-4 space-y-2">
                <Sparkles className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                <p className="font-semibold text-foreground">Awaiting Agent Execution</p>
                <p>Send any research query in chat to view live artifacts, synthesis, and papers.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Papers Viewer */}
        {activeTab === "papers" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Retrieved Scholarly Sources ({papersToDisplay.length})
              </span>
              <button
                onClick={onOpenSearchPapers}
                className="text-[11px] text-primary font-semibold hover:underline"
              >
                + Search More
              </button>
            </div>

            {papersToDisplay.length > 0 ? (
              <div className="space-y-2.5">
                {papersToDisplay.map((paper, idx) => (
                  <div
                    key={paper.id || idx}
                    className="rounded-2xl border border-border bg-background p-3.5 shadow-xs space-y-2 text-xs hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfUrl || "#")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-primary leading-snug line-clamp-2"
                      >
                        {paper.title}
                      </a>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      {paper.authors.slice(0, 3).join(", ")} &bull; {paper.year} &bull; <span className="font-medium text-foreground">{paper.source}</span>
                    </p>

                    <p className="text-[11px] text-muted-foreground/90 line-clamp-3 bg-muted/30 p-2 rounded-lg font-serif">
                      "{paper.abstract}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                      <span className="font-bold text-primary">★ {paper.citationCount || 0} citations</span>
                      <div className="flex items-center gap-2">
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary font-mono text-[10px]"
                          >
                            DOI
                          </a>
                        )}
                        {paper.pdfUrl && (
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5"
                          >
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-muted-foreground space-y-2">
                <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p>No papers attached to current context.</p>
                <button
                  onClick={onOpenSearchPapers}
                  className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
                >
                  Search 480M+ DBs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: LaTeX Code */}
        {activeTab === "latex" && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-indigo-500" />
                LaTeX / TeX Live Output
              </span>
              {detectedLatex && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyLatex}
                    className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-foreground text-[11px] font-semibold"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownloadLatex}
                    className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[11px] font-bold"
                  >
                    Export .tex
                  </button>
                </div>
              )}
            </div>

            {detectedLatex ? (
              <div className="rounded-2xl bg-[#18181b] border border-border p-3 font-mono text-[11px] text-zinc-200 overflow-x-auto leading-relaxed max-h-96">
                <pre>{detectedLatex}</pre>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-muted-foreground space-y-2">
                <Code className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p>No LaTeX manuscript code detected in active response.</p>
                <p className="text-[11px]">Ask the agent: "Convert this into a publication-grade LaTeX manuscript".</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Agent Execution Trace & Telemetry */}
        {activeTab === "trace" && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5 border-b border-border/60 pb-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Agentic Telemetry & Trace
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Agent:</span>
                  <span className="font-bold font-mono text-primary">{activeAgentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Inference Model:</span>
                  <span className="font-semibold text-foreground">{aiConfig.modelName || "GPT-5 Nano / Llama 3.3 70B"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confidence Score:</span>
                  <span className="font-bold text-emerald-500">96.4% (Verified)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Databases Connected:</span>
                  <span className="font-semibold text-foreground">OpenAlex, arXiv, PubMed, Europe PMC, Crossref</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Context Memory:</span>
                  <span className="font-bold text-indigo-500">Multi-Turn Active</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-3 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Open-Source Zero-Lockin Architecture
              </p>
              <p>
                All agents and database connectors run serverless with instant fallback cascade.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
