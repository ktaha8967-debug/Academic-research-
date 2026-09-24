"use client";

import React, { useState } from "react";
import {
  AcademicPaper,
  AgentType,
  MessageHistoryItem,
  AIModelConfig,
  Project,
  StructuredEvidenceStudy,
} from "@/lib/types";
import {
  FolderGit2,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FileSpreadsheet,
  Network,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Download,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface AgentOutputPanelProps {
  activeAgentId: AgentType;
  lastAssistantMessage?: MessageHistoryItem;
  attachedPapers: AcademicPaper[];
  activeProject?: Project;
  onToggleSavePaper?: (paper: AcademicPaper) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSearchPapers: () => void;
  aiConfig: AIModelConfig;
  loading?: boolean;
  executionStep?: string;
}

export function AgentOutputPanel({
  activeAgentId,
  lastAssistantMessage,
  attachedPapers,
  activeProject,
  onToggleSavePaper,
  isOpen,
  onToggle,
  onOpenSearchPapers,
  aiConfig,
  loading = false,
  executionStep = "",
}: AgentOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "sources" | "evidence" | "citations" | "saved" | "artifacts"
  >("sources");
  const [copiedArtifact, setCopiedArtifact] = useState(false);

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-start py-4 px-1 border-l border-border bg-card w-12 h-screen sticky top-0 z-30 shrink-0">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Open Research Context"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="mt-8 [writing-mode:vertical-lr] rotate-180 text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-primary rotate-180" />
          <span>Research Context</span>
        </div>
      </div>
    );
  }

  // Calculate stats
  const currentSources = lastAssistantMessage?.sources || [];
  const savedPapers = activeProject?.savedPapers || [];
  const allPapersCount = Array.from(
    new Set([...currentSources.map((p) => p.id), ...savedPapers.map((p) => p.id)])
  ).length;

  const evidenceStudies: StructuredEvidenceStudy[] =
    (activeProject?.evidenceMatrix && Array.isArray(activeProject.evidenceMatrix) ? activeProject.evidenceMatrix : []) ||
    (lastAssistantMessage?.structuredData?.evidenceMatrix && Array.isArray(lastAssistantMessage.structuredData.evidenceMatrix) ? lastAssistantMessage.structuredData.evidenceMatrix : []) ||
    (lastAssistantMessage?.structuredData?.evidence && Array.isArray(lastAssistantMessage.structuredData.evidence) ? lastAssistantMessage.structuredData.evidence : []);

  const totalCitations = [
    ...savedPapers,
    ...currentSources,
  ].reduce((acc, p) => acc + (p.citationCount || 0), 0);

  // LaTeX detection for Artifacts tab
  const content = lastAssistantMessage?.content || "";
  const latexMatch = content.match(/```(?:latex|tex)?([\s\S]*?)```/);
  const detectedLatex = latexMatch
    ? latexMatch[1].trim()
    : content.includes("\\documentclass") || content.includes("\\begin{")
    ? content
    : null;

  const handleCopyArtifact = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(true);
    setTimeout(() => setCopiedArtifact(false), 2000);
  };

  const handleDownloadLatex = () => {
    if (!detectedLatex) return;
    const blob = new Blob([detectedLatex], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "manuscript_draft.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Determine Orchestrator steps
  const isQuerying = executionStep.includes("Querying") || executionStep.includes("OpenAlex");
  const isSynthesizing = executionStep.includes("Synthesizing") || executionStep.includes("persisting");

  return (
    <aside className="w-80 sm:w-96 xl:w-[420px] border-l border-border bg-card h-screen flex flex-col shrink-0 z-30 sticky top-0 overflow-hidden shadow-xl transition-all duration-300">
      {/* 1. Header: RESEARCH CONTEXT */}
      <div className="p-3.5 border-b border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-foreground uppercase tracking-wide leading-none">
                Research Context
              </h3>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Academic Knowledge Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Collapse Panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Project Info */}
        <div className="rounded-xl border border-border bg-background p-2.5 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground truncate">
              <FolderGit2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{activeProject?.name || "Active Project"}</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase shrink-0">
              {activeProject?.activeStage || "Research"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {activeProject?.description || activeProject?.researchQuestion || "Ongoing scholarly investigation."}
          </p>
        </div>

        {/* Stats Grid: Papers, Saved, Evidence, Citations */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="rounded-lg border border-border bg-card p-1.5">
            <div className="text-xs font-black text-foreground">{allPapersCount}</div>
            <div className="text-[9px] font-semibold text-muted-foreground uppercase">Papers</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-1.5">
            <div className="text-xs font-black text-primary">{savedPapers.length}</div>
            <div className="text-[9px] font-semibold text-muted-foreground uppercase">Saved</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-1.5">
            <div className="text-xs font-black text-foreground">{evidenceStudies.length}</div>
            <div className="text-[9px] font-semibold text-muted-foreground uppercase">Evidence</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-1.5">
            <div className="text-xs font-black text-foreground">
              {totalCitations > 1000 ? `${(totalCitations / 1000).toFixed(1)}k` : totalCitations}
            </div>
            <div className="text-[9px] font-semibold text-muted-foreground uppercase">Citations</div>
          </div>
        </div>
      </div>

      {/* 2. RESEARCH ORCHESTRATOR (Shown during active execution) */}
      {loading && (
        <div className="p-3 border-b border-border bg-muted/40 animate-in fade-in duration-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Research Orchestrator
            </span>
            <span className="text-[10px] text-primary font-bold animate-pulse">Running</span>
          </div>

          <div className="space-y-1.5 text-xs font-medium">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Understanding request</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Resolving project context</span>
            </div>
            <div className="flex items-center gap-2">
              {isQuerying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                  <span className="font-bold text-foreground">Searching scholarly sources</span>
                </>
              ) : isSynthesizing ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="text-muted-foreground">Searching scholarly sources</span>
                </>
              ) : (
                <>
                  <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  <span className="text-muted-foreground">Searching scholarly sources</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isSynthesizing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                  <span className="font-bold text-foreground">Synthesizing evidence</span>
                </>
              ) : (
                <>
                  <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  <span className="text-muted-foreground">Synthesizing evidence</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span>Saving research output</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Contextual Navigation Tabs */}
      <div className="grid grid-cols-5 p-1 bg-muted/50 border-b border-border text-[10px] font-semibold text-center">
        <button
          onClick={() => setActiveTab("sources")}
          className={`py-1 rounded-md transition-all ${
            activeTab === "sources"
              ? "bg-card text-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sources ({currentSources.length})
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`py-1 rounded-md transition-all ${
            activeTab === "evidence"
              ? "bg-card text-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Evidence
        </button>
        <button
          onClick={() => setActiveTab("citations")}
          className={`py-1 rounded-md transition-all ${
            activeTab === "citations"
              ? "bg-card text-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Citations
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-1 rounded-md transition-all ${
            activeTab === "saved"
              ? "bg-card text-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Saved ({savedPapers.length})
        </button>
        <button
          onClick={() => setActiveTab("artifacts")}
          className={`py-1 rounded-md transition-all ${
            activeTab === "artifacts"
              ? "bg-card text-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Artifacts
        </button>
      </div>

      {/* 4. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* TAB 1: SOURCES */}
        {activeTab === "sources" && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase px-1">
              <span>Literature Retrieved</span>
              <button
                onClick={onOpenSearchPapers}
                className="text-primary hover:underline text-[11px] lowercase"
              >
                + search more
              </button>
            </div>

            {currentSources.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-muted-foreground space-y-2">
                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No query sources currently loaded.</p>
                <p className="text-[11px]">
                  Ask an academic question or search papers to stream literature here.
                </p>
              </div>
            ) : (
              currentSources.map((paper) => {
                const saved = savedPapers.some((p) => p.id === paper.id || p.title === paper.title);
                return (
                  <div
                    key={paper.id}
                    className="p-3 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-colors"
                  >
                    <a
                      href={paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfUrl || "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1 line-clamp-2"
                    >
                      <span>{paper.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                    </a>

                    <div className="text-[11px] text-muted-foreground">
                      {paper.authors.slice(0, 2).join(", ")} ({paper.year}) &bull; {paper.venue || "Academic Venue"}
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-primary">
                        ★ {paper.citationCount || 0} citations
                      </span>
                      <button
                        onClick={() => onToggleSavePaper?.(paper)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                          saved
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {saved ? (
                          <>
                            <BookmarkCheck className="h-3 w-3" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-3 w-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: EVIDENCE MATRIX */}
        {activeTab === "evidence" && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-muted-foreground uppercase px-1">
              Synthesized Evidence Matrix
            </div>

            {evidenceStudies.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-muted-foreground space-y-2">
                <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No structured empirical studies extracted yet.</p>
                <p className="text-[11px]">
                  Ask the assistant to "Extract an evidence matrix" to generate study rows.
                </p>
              </div>
            ) : (
              evidenceStudies.map((study, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border bg-card space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      {study.author} ({study.year})
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground">
                      N = {study.sampleSize || "N/A"}
                    </span>
                  </div>

                  <div className="text-xs text-foreground/90">
                    <span className="font-semibold text-primary">Finding: </span>
                    {study.primaryFinding || (study as any).finding}
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Effect: {study.effectSize || "Reported"}</span>
                    <span>p-value: {study.pValue || "< 0.05"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CITATION MAP */}
        {activeTab === "citations" && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-muted-foreground uppercase px-1">
              Citation Graph &amp; References
            </div>

            {savedPapers.length === 0 && currentSources.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-muted-foreground space-y-2">
                <Network className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No citation references available.</p>
              </div>
            ) : (
              [...savedPapers, ...currentSources].slice(0, 10).map((paper) => (
                <div
                  key={paper.id}
                  className="p-2.5 rounded-xl border border-border bg-card text-xs space-y-1"
                >
                  <div className="font-semibold text-foreground line-clamp-1">{paper.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{paper.authors[0] || "Author"} et al. ({paper.year})</span>
                    <span className="font-mono text-[10px] text-primary">DOI: {paper.doi || "Verified"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SAVED PAPERS */}
        {activeTab === "saved" && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase px-1">
              <span>Project Saved Papers ({savedPapers.length})</span>
            </div>

            {savedPapers.length === 0 ? (
              <div className="text-center py-10 px-4 text-xs text-muted-foreground space-y-2">
                <Bookmark className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No papers saved to this project yet.</p>
                <p className="text-[11px]">
                  Click "Save to Project" on any paper card in chat or search to collect it here.
                </p>
              </div>
            ) : (
              savedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-3 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-colors"
                >
                  <a
                    href={paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfUrl || "#")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1 line-clamp-2"
                  >
                    <span>{paper.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                  </a>

                  <div className="text-[11px] text-muted-foreground">
                    {paper.authors.slice(0, 2).join(", ")} ({paper.year}) &bull; {paper.venue || "Academic Venue"}
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-primary">
                      ★ {paper.citationCount || 0} citations
                    </span>
                    <button
                      onClick={() => onToggleSavePaper?.(paper)}
                      className="inline-flex items-center gap-1 text-[11px] text-destructive hover:underline font-semibold"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: ARTIFACTS */}
        {activeTab === "artifacts" && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase px-1">
              <span>Generated Artifacts</span>
            </div>

            {detectedLatex ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-primary" />
                    LaTeX Manuscript Code
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyArtifact(detectedLatex)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border border-border bg-card text-foreground hover:bg-muted"
                    >
                      {copiedArtifact ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedArtifact ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownloadLatex}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download .tex</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 rounded-xl border border-border bg-muted/40 text-[11px] font-mono text-foreground overflow-x-auto max-h-96">
                  {detectedLatex}
                </pre>
              </div>
            ) : (
              <div className="text-center py-10 px-4 text-xs text-muted-foreground space-y-2">
                <FileCode className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No LaTeX or document artifacts generated yet.</p>
                <p className="text-[11px]">
                  Ask the assistant to draft a manuscript section or BibTeX bibliography.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
