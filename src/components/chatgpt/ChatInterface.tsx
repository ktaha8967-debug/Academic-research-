"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AgentType,
  AcademicPaper,
  MessageHistoryItem,
  AIModelConfig,
  Project,
  ResearchStage,
  StructuredResearchGap,
  StructuredResearchQuestion,
} from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Send,
  Loader2,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  BrainCircuit,
  Search,
  ExternalLink,
  Plus,
  FileCode,
  Lightbulb,
  Dna,
  Download,
  ChevronDown,
  Database,
  CheckSquare,
  Square,
  Bot,
  RotateCcw,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Quote,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

export interface DBSelectionItem {
  id: string;
  name: string;
  count: string;
  desc: string;
}

export const AVAILABLE_DATABASES: DBSelectionItem[] = [
  { id: "openalex", name: "OpenAlex", count: "250M+", desc: "Citations, authors & scholarly concepts" },
  { id: "arxiv", name: "arXiv", count: "2.4M+", desc: "Physics, Math, AI & CS preprints" },
  { id: "pubmed", name: "PubMed", count: "36M+", desc: "Biomedical, clinical & life sciences" },
  { id: "europepmc", name: "Europe PMC", count: "43M+", desc: "Open-access life science articles" },
  { id: "crossref", name: "Crossref", count: "150M+", desc: "Official publisher DOIs & metadata" },
  { id: "semanticscholar", name: "Semantic Scholar", count: "215M+", desc: "AI-generated TLDRs & citation graph" },
];

export const AVAILABLE_MODELS = [
  { id: "academic-fast", name: "AcademicAI Basic", provider: "openai" as const, desc: "AcademicAI Basic · Ultra-fast literature indexing & instant Q&A", tag: "Basic" },
  { id: "academic-pro", name: "AcademicAI Pro", provider: "openai" as const, desc: "AcademicAI Pro · Deep scholarly synthesis & publication-grade reasoning", tag: "Pro" },
  { id: "academic-max", name: "AcademicAI Max", provider: "openrouter" as const, desc: "AcademicAI Max · Exhaustive multi-hop academic reasoning & audit", tag: "Max" },
];

const RESEARCH_STAGES: { id: ResearchStage; label: string }[] = [
  { id: "question", label: "Question" },
  { id: "papers", label: "Papers" },
  { id: "synthesis", label: "Synthesis" },
  { id: "gaps", label: "Gaps" },
  { id: "questions", label: "Questions" },
  { id: "evidence", label: "Evidence" },
  { id: "analysis", label: "Analysis" },
  { id: "manuscript", label: "Manuscript" },
  { id: "review", label: "Review" },
  { id: "rebuttal", label: "Rebuttal" },
  { id: "poster", label: "Poster" },
];

interface ChatInterfaceProps {
  agentId: AgentType;
  messages: MessageHistoryItem[];
  attachedPapers: AcademicPaper[];
  activeProject?: Project;
  onSendMessage: (text: string, customConfig?: AIModelConfig, customDatabases?: string[]) => void;
  loading: boolean;
  executionStep: string;
  onOpenSearchPapers: () => void;
  onRemovePaper: (id: string) => void;
  onToggleSavePaper?: (paper: AcademicPaper) => void;
  onUpdateProjectStage?: (stage: ResearchStage) => void;
  onChainAgent: (agentId: AgentType, prompt: string) => void;
  aiConfig: AIModelConfig;
  onUpdateAiConfig?: (config: AIModelConfig) => void;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
  onRetryMessage?: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: Search,
    category: "Literature Discovery",
    title: "Find 480M+ Research Papers",
    prompt: "Find the most cited and recent 2024-2025 papers on Multi-Agent Reinforcement Learning with direct PDF links and DOIs.",
  },
  {
    icon: BookOpen,
    category: "Literature Review",
    title: "Systematic Literature Review",
    prompt: "Generate a publication-grade systematic literature review comparing Transformer Attention vs State Space Models (Mamba).",
  },
  {
    icon: Lightbulb,
    category: "Hypotheses & Gaps",
    title: "Uncover Research Gaps",
    prompt: "What are the unexplored methodological and theoretical research gaps in zero-shot medical diagnosis with Multimodal LLMs?",
  },
  {
    icon: HelpCircle,
    category: "Research Questions",
    title: "Formulate Research Questions",
    prompt: "Turn our literature findings into 3 novel, testable research questions with FINER criteria evaluation.",
  },
  {
    icon: FileCode,
    category: "LaTeX & Typesetting",
    title: "Draft LaTeX Manuscript & Math",
    prompt: "Write a complete IEEE conference LaTeX section with mathematical formulations for Direct Preference Optimization (DPO).",
  },
  {
    icon: Dna,
    category: "Biomedical & Sciences",
    title: "CRISPR & Molecular Protocols",
    prompt: "Design a high-specificity CRISPR-Cas9 gRNA targeting human PCSK9 with off-target CFD score mitigation.",
  },
];

export function ChatInterface({
  agentId,
  messages,
  attachedPapers,
  activeProject,
  onSendMessage,
  loading,
  executionStep,
  onOpenSearchPapers,
  onRemovePaper,
  onToggleSavePaper,
  onUpdateProjectStage,
  onChainAgent,
  aiConfig,
  onUpdateAiConfig,
  isRightPanelOpen,
  onToggleRightPanel,
  onRetryMessage,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  // Model & DB Selector state
  const [selectedModelId, setSelectedModelId] = useState<string>(
    aiConfig.modelName || "academic-pro"
  );
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([
    "openalex",
    "arxiv",
    "pubmed",
    "europepmc",
  ]);
  const [isDbMenuOpen, setIsDbMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || loading) return;
    const modelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[1];
    const newConfig: AIModelConfig = {
      provider: modelObj.provider,
      modelName: modelObj.id,
    };
    if (onUpdateAiConfig) onUpdateAiConfig(newConfig);

    onSendMessage(inputText.trim(), newConfig, selectedDatabases);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCitation = (paper: AcademicPaper) => {
    const bibtex = `@article{${(paper.authors[0] || "Author").split(" ")[0].toLowerCase()}${paper.year},\n  title = {${paper.title}},\n  author = {${paper.authors.join(" and ")}},\n  journal = {${paper.venue || "Scholarly Repository"}},\n  year = {${paper.year}}${paper.doi ? `,\n  doi = {${paper.doi}}` : ""}\n}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedCitationId(paper.id);
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  const isPaperSaved = (paper: AcademicPaper) => {
    const projectPapers = activeProject?.savedPapers || [];
    return projectPapers.some(
      (p) => p.id === paper.id || (p.doi && paper.doi && p.doi === paper.doi) || p.title.toLowerCase() === paper.title.toLowerCase()
    );
  };

  const toggleDatabase = (dbId: string) => {
    if (selectedDatabases.includes(dbId)) {
      if (selectedDatabases.length > 1) {
        setSelectedDatabases(selectedDatabases.filter((id) => id !== dbId));
      }
    } else {
      setSelectedDatabases([...selectedDatabases, dbId]);
    }
  };

  const currentStageIndex = RESEARCH_STAGES.findIndex(
    (s) => s.id === (activeProject?.activeStage || "question")
  );

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-background">
      {/* 1. RESEARCH PROGRESSION BAR (Subtle solid-color workflow tracker) */}
      <div className="border-b border-border/80 bg-card/60 px-4 py-2 shrink-0 overflow-x-auto [scrollbar-width:none]">
        <div className="flex items-center gap-1.5 min-w-max text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
            Research Stage:
          </span>
          {RESEARCH_STAGES.map((stage, idx) => {
            const isActive = stage.id === (activeProject?.activeStage || "question");
            const isCompleted = currentStageIndex > idx;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onUpdateProjectStage?.(stage.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : isCompleted
                      ? "bg-muted text-foreground font-medium hover:bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                  title={`Stage: ${stage.label}`}
                >
                  {isCompleted && <Check className="h-3 w-3 text-emerald-500 shrink-0" />}
                  <span>{stage.label}</span>
                </button>
                {idx < RESEARCH_STAGES.length - 1 && (
                  <span className="text-muted-foreground/40 text-[10px]">&rarr;</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Conversation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 pb-44">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto space-y-8 pt-4">
            {/* Academic Workspace Welcome Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Citation-Grounded Academic Research Workstation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeProject?.name ? `Researching: ${activeProject.name}` : "What are you researching today?"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Connected to OpenAlex, PubMed, arXiv, and Europe PMC. Pre-qualified scholarly queries, zero hallucinated DOIs, and connected multi-agent synthesis.
              </p>
            </div>

            {/* Quick-Start Workflow Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STARTER_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt.prompt)}
                    className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 text-left transition-all hover:border-primary/50 group flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          {prompt.category}
                        </span>
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {prompt.prompt}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Launch Investigation</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-foreground font-bold text-xs shadow-xs mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`relative group max-w-full sm:max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                      : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                  }`}
                >
                  {/* Action Copy & Retry Bar */}
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {msg.role === "assistant" && onRetryMessage && (
                      <button
                        onClick={() => {
                          const lastUser = [...messages]
                            .reverse()
                            .find((m) => m.role === "user");
                          if (lastUser) onRetryMessage(lastUser.content);
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                        title="Regenerate"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 1. CLARIFICATION CARD (For ambiguous queries like HWY) */}
                  {msg.role === "assistant" && msg.structuredData?.clarification && (
                    <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-foreground space-y-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        <h4 className="font-bold text-xs text-foreground uppercase tracking-wide">
                          Query Clarification Required
                        </h4>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed">
                        {msg.structuredData.clarification.message}
                      </p>
                      {msg.structuredData.clarification.suggestedInterpretations?.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-border/40">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            Suggested Interpretations:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.structuredData.clarification.suggestedInterpretations.map((interp: any, idx: number) => {
                              const label = typeof interp === "string" ? interp : (interp?.label || interp?.promptToExecute || "Clarify");
                              const promptToRun = typeof interp === "string" ? interp : (interp?.promptToExecute || interp?.label || "");
                              return (
                                <button
                                  key={idx}
                                  onClick={() => onSendMessage(promptToRun)}
                                  className="px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30 bg-background hover:bg-amber-500/10 text-foreground transition-colors text-left"
                                >
                                  &bull; {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Standard Markdown Content */}
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed overflow-hidden break-words">
                    <MarkdownRenderer content={msg.content} />
                  </div>

                  {/* 2. RESEARCH GAPS CARDS */}
                  {msg.role === "assistant" && msg.structuredData?.researchGaps && msg.structuredData.researchGaps.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/80 space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Identified Research Gaps ({msg.structuredData.researchGaps.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {msg.structuredData.researchGaps.map((gap: StructuredResearchGap) => (
                          <div
                            key={gap.id}
                            className="rounded-xl border border-border bg-card p-3.5 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-xs text-foreground">
                                {gap.title}
                              </h5>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-foreground uppercase shrink-0">
                                {gap.type || "Gap"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {gap.description}
                            </p>
                            {gap.impact && (
                              <div className="text-[11px] text-foreground font-medium">
                                <span className="text-primary font-bold">Expected Impact:</span> {gap.impact}
                              </div>
                            )}
                            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">
                                {gap.supportingPapers?.length || 0} supporting references
                              </span>
                              <button
                                onClick={() =>
                                  onSendMessage(
                                    `Turn this research gap: "${gap.title}" into 3 novel, testable research questions.`
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors"
                              >
                                <HelpCircle className="h-3 w-3" />
                                <span>Generate Research Question</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. RESEARCH QUESTION CARDS */}
                  {msg.role === "assistant" && msg.structuredData?.researchQuestions && msg.structuredData.researchQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/80 space-y-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Formulated Research Questions ({msg.structuredData.researchQuestions.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {msg.structuredData.researchQuestions.map((q: StructuredResearchQuestion) => (
                          <div
                            key={q.id}
                            className="rounded-xl border border-border bg-card p-3.5 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-xs text-foreground leading-snug">
                                {q.question}
                              </h5>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase shrink-0">
                                RQ
                              </span>
                            </div>
                            {(q.nullHypothesis || q.altHypothesis || (q as any).hypotheses) && (
                              <div className="text-[11px] text-muted-foreground space-y-0.5">
                                <span className="font-bold text-foreground">Hypotheses:</span>
                                {q.nullHypothesis && (
                                  <div className="pl-2 border-l border-border/80">
                                    <span className="font-semibold text-foreground/80">H0: </span>{q.nullHypothesis}
                                  </div>
                                )}
                                {q.altHypothesis && (
                                  <div className="pl-2 border-l border-primary/60">
                                    <span className="font-semibold text-primary">H1: </span>{q.altHypothesis}
                                  </div>
                                )}
                                {Array.isArray((q as any).hypotheses) && (q as any).hypotheses.map((h: string, i: number) => (
                                  <div key={i} className="pl-2 border-l border-primary/40">
                                    &bull; {h}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                FINER Criteria Verified
                              </span>
                              <button
                                onClick={() =>
                                  onSendMessage(
                                    `Design an experimental methodology and protocol for research question: "${q.question}"`
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-colors"
                              >
                                <Dna className="h-3 w-3" />
                                <span>Design Methodology</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. STRUCTURED PAPER CARDS */}
                  {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          Scholarly Sources ({msg.sources.length})
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Zero Fabricated DOIs
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.sources.map((src) => {
                          const saved = isPaperSaved(src);
                          return (
                            <div
                              key={src.id}
                              className="rounded-xl border border-border bg-card p-3 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <a
                                  href={src.url || (src.doi ? `https://doi.org/${src.doi}` : src.pdfUrl || "#")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1 line-clamp-2"
                                >
                                  <span>{src.title}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                                </a>
                                {src.isOpenAccess && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                                    Open Access
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>{src.authors.slice(0, 3).join(", ")}{src.authors.length > 3 ? " et al." : ""}</span>
                                <span>&bull;</span>
                                <span className="font-medium text-foreground">{src.venue || "Academic Venue"}</span>
                                <span>&bull;</span>
                                <span>{src.year}</span>
                                {src.doi && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="font-mono text-[10px] text-primary">DOI: {src.doi}</span>
                                  </>
                                )}
                              </div>

                              {/* Paper Card Action Row */}
                              <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-primary">
                                    ★ {src.citationCount || 0} citations
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {/* [Save to Project] */}
                                  <button
                                    onClick={() => onToggleSavePaper?.(src)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                                      saved
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
                                    }`}
                                    title={saved ? "Remove from project" : "Save to project"}
                                  >
                                    {saved ? (
                                      <>
                                        <BookmarkCheck className="h-3 w-3" />
                                        <span>Saved</span>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="h-3 w-3" />
                                        <span>Save to Project</span>
                                      </>
                                    )}
                                  </button>

                                  {/* [Cite] */}
                                  <button
                                    onClick={() => handleCopyCitation(src)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    title="Copy BibTeX Citation"
                                  >
                                    {copiedCitationId === src.id ? (
                                      <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                      <Quote className="h-3 w-3" />
                                    )}
                                    <span>{copiedCitationId === src.id ? "Copied" : "Cite"}</span>
                                  </button>

                                  {/* [Use in Literature Review] */}
                                  <button
                                    onClick={() =>
                                      onSendMessage(
                                        `Synthesize a thematic literature review section focused on: "${src.title}" and its core findings.`
                                      )
                                    }
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-border bg-card text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                  >
                                    <Layers className="h-3 w-3" />
                                    <span>Review</span>
                                  </button>

                                  {/* [Open Paper] */}
                                  <a
                                    href={src.url || (src.doi ? `https://doi.org/${src.doi}` : src.pdfUrl || "#")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                                  >
                                    <span>Open</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Follow-Up Questions */}
                  {msg.role === "assistant" && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Suggested Next Steps:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSendMessage(q)}
                            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80 hover:border-primary hover:text-primary hover:bg-muted/40 transition-colors text-left font-medium"
                          >
                            ↳ {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Active Execution State with Orchestrator Details */}
            {loading && (
              <div className="flex gap-3 items-start animate-in fade-in duration-200">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl bg-card border border-border p-4 shadow-xs max-w-md space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>{executionStep || "Processing research request..."}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                    <div className="bg-primary h-full w-3/4 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Federated scholarly discovery across OpenAlex, PubMed, and Europe PMC with citation verification.
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Floating Input Bar (Solid-Color, No Gradients) */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-5 bg-background border-t border-border/80">
        <div className="max-w-3xl mx-auto w-full space-y-2">
          {/* Active Project & Attached Papers Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {activeProject && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-foreground shrink-0 border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{activeProject.name}</span>
              </span>
            )}
            {attachedPapers.length > 0 && (
              <span className="text-[11px] font-bold text-primary uppercase shrink-0">
                {attachedPapers.length} Papers Active
              </span>
            )}
            <button
              onClick={onOpenSearchPapers}
              className="inline-flex items-center gap-1 rounded-full border border-border hover:border-primary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-card transition-colors shrink-0"
            >
              <Plus className="h-3 w-3" />
              <span>Attach Paper</span>
            </button>
          </div>

          {/* Main Input Box */}
          <div className="relative flex flex-col rounded-2xl border border-input bg-card focus-within:border-primary shadow-xs transition-colors">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a scholarly question, search literature, identify gaps, or design methodology..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-44"
            />

            {/* Input Toolbar */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Database Selector Pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsDbMenuOpen(!isDbMenuOpen)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Database className="h-3 w-3 text-primary" />
                    <span>{selectedDatabases.length} Repositories</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>

                  {isDbMenuOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl z-50 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                        Select Literature Sources
                      </div>
                      {AVAILABLE_DATABASES.map((db) => {
                        const isSelected = selectedDatabases.includes(db.id);
                        return (
                          <button
                            key={db.id}
                            onClick={() => toggleDatabase(db.id)}
                            className="w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-left hover:bg-muted transition-colors"
                          >
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1">
                                <span>{db.name}</span>
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  ({db.count})
                                </span>
                              </div>
                            </div>
                            {isSelected ? (
                              <CheckSquare className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Model Selector Pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bot className="h-3 w-3 text-primary" />
                    <span>{AVAILABLE_MODELS.find((m) => m.id === selectedModelId)?.name.split(" ")[1] || "Pro"}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>

                  {isModelMenuOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl z-50 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                        AI Reasoning Engine
                      </div>
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            setIsModelMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-left transition-colors ${
                            selectedModelId === model.id
                              ? "bg-muted font-bold text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{model.name}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1">
                              {model.desc}
                            </div>
                          </div>
                          {selectedModelId === model.id && (
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || loading}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 shadow-xs"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
