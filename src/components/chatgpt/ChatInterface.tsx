"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AgentType,
  AcademicPaper,
  MessageHistoryItem,
  AIModelConfig,
} from "@/lib/types";
import {
  Send,
  Loader2,
  Sparkles,
  Paperclip,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Layers,
  FileSpreadsheet,
  Users,
  Presentation,
  BrainCircuit,
  Search,
  ExternalLink,
  Plus,
  Globe,
  FileCode,
  Zap,
  Lightbulb,
  Dna,
  Scale,
  DollarSign,
  Download,
  ChevronDown,
  Database,
  SlidersHorizontal,
  PanelRightClose,
  PanelRightOpen,
  CheckSquare,
  Square,
  Bot,
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
  { id: "gpt-4o-mini", name: "Fast (GPT-4o Mini)", provider: "openai" as const, desc: "Ultra-fast literature indexing & instant Q&A", tag: "Fast" },
  { id: "gpt-4o", name: "Pro (GPT-4o)", provider: "openai" as const, desc: "Deep scholarly synthesis & publication-grade reasoning", tag: "Pro" },
  { id: "deepseek/deepseek-chat", name: "Max (DeepSeek V3 / R1)", provider: "openrouter" as const, desc: "Exhaustive multi-hop academic reasoning & audit", tag: "Max" },
  { id: "llama-3.3-70b-versatile", name: "Groq Llama 3.3 70B", provider: "groq" as const, desc: "Ultra-fast open-source cloud inference", tag: "Groq Ultra" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "gemini" as const, desc: "Google Agent SDK 1M token context window", tag: "Google Free" },
];

interface ChatInterfaceProps {
  agentId: AgentType;
  messages: MessageHistoryItem[];
  attachedPapers: AcademicPaper[];
  onSendMessage: (text: string, customConfig?: AIModelConfig, customDatabases?: string[]) => void;
  loading: boolean;
  executionStep: string;
  onOpenSearchPapers: () => void;
  onRemovePaper: (id: string) => void;
  onChainAgent: (agentId: AgentType, prompt: string) => void;
  aiConfig: AIModelConfig;
  onUpdateAiConfig?: (config: AIModelConfig) => void;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: Search,
    category: "Literature Discovery",
    title: "Find 480M+ Research Papers",
    prompt: "Find the most cited and recent 2024-2025 papers on Multi-Agent Reinforcement Learning with direct PDF links and DOIs.",
  },
  {
    icon: Layers,
    category: "Literature Review",
    title: "Systematic Literature Review",
    prompt: "Generate a publication-grade systematic literature review comparing Transformer Attention vs State Space Models (Mamba).",
  },
  {
    icon: FileCode,
    category: "LaTeX & Typesetting",
    title: "Draft LaTeX Manuscript & Math",
    prompt: "Write a complete IEEE conference LaTeX section with mathematical formulations for Direct Preference Optimization (DPO).",
  },
  {
    icon: Lightbulb,
    category: "Hypotheses & Gaps",
    title: "Uncover Research Gaps",
    prompt: "What are the unexplored methodological and theoretical research gaps in zero-shot medical diagnosis with Multimodal LLMs?",
  },
  {
    icon: Dna,
    category: "Biomedical & Sciences",
    title: "CRISPR & Molecular Protocols",
    prompt: "Design a high-specificity CRISPR-Cas9 gRNA targeting human PCSK9 with off-target CFD score mitigation.",
  },
  {
    icon: Sparkles,
    category: "Universal Assistant",
    title: "General Chat & Coding",
    prompt: "Explain how quantum entanglement enables quantum key distribution (BB84 protocol) in simple terms with Python simulation.",
  },
];

export function ChatInterface({
  agentId,
  messages,
  attachedPapers,
  onSendMessage,
  loading,
  executionStep,
  onOpenSearchPapers,
  onRemovePaper,
  onChainAgent,
  aiConfig,
  onUpdateAiConfig,
  isRightPanelOpen,
  onToggleRightPanel,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deepSearchActive, setDeepSearchActive] = useState(true);
  const [deepReasoningActive, setDeepReasoningActive] = useState(false);

  // Model & DB Selector state
  const [selectedModelId, setSelectedModelId] = useState<string>(
    aiConfig.modelName === "gpt-5-nano" ? "gpt-4o-mini" : (aiConfig.modelName || "gpt-4o-mini")
  );
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([
    "openalex",
    "arxiv",
    "pubmed",
    "europepmc",
    "crossref",
    "semanticscholar",
  ]);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isDbPickerOpen, setIsDbPickerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);
  const dbPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelPickerRef.current && !modelPickerRef.current.contains(event.target as Node)) {
        setIsModelPickerOpen(false);
      }
      if (dbPickerRef.current && !dbPickerRef.current.contains(event.target as Node)) {
        setIsDbPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputText.trim() && !loading) {
      let finalPrompt = inputText.trim();
      if (deepReasoningActive) {
        finalPrompt = `[DEEP REASONING & MATHEMATICAL DERIVATIONS ENABLED]\n${finalPrompt}`;
      }
      const modelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModelId);
      const customConfig: AIModelConfig = {
        provider: modelObj?.provider || "openai",
        modelName: selectedModelId,
      };
      if (onUpdateAiConfig) {
        onUpdateAiConfig(customConfig);
      }
      onSendMessage(finalPrompt, customConfig, selectedDatabases);
      setInputText("");
      setIsModelPickerOpen(false);
      setIsDbPickerOpen(false);
    }
  };

  const toggleDatabase = (dbId: string) => {
    if (selectedDatabases.includes(dbId)) {
      if (selectedDatabases.length === 1) return; // Keep at least one
      setSelectedDatabases(selectedDatabases.filter((id) => id !== dbId));
    } else {
      setSelectedDatabases([...selectedDatabases, dbId]);
    }
  };

  const selectAllDatabases = () => {
    setSelectedDatabases(AVAILABLE_DATABASES.map((d) => d.id));
  };

  const selectedModelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatInlineText = (text: string) => {
    const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(formatBoldText(text.substring(lastIndex, match.index)));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-0.5 mx-0.5 transition-colors"
        >
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 inline shrink-0" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(formatBoldText(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : formatBoldText(text);
  };

  const formatBoldText = (text: string) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = "";
    const renderedElements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          const codeText = codeBlockContent.join("\n");
          renderedElements.push(
            <div key={`code-${idx}`} className="my-3 rounded-2xl bg-[#18181b] p-4 border border-border/80 font-mono text-xs overflow-x-auto relative group shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-400 text-[11px]">
                <span className="uppercase font-bold tracking-wider">{codeBlockLang || "code"}</span>
                <button
                  onClick={() => handleCopy(codeText, `code-${idx}`)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  title="Copy code"
                >
                  {copiedId === `code-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === `code-${idx}` ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="text-zinc-200 leading-relaxed overflow-x-auto">{codeText}</pre>
            </div>
          );
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = "";
        } else {
          inCodeBlock = true;
          codeBlockLang = line.replace("```", "").trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith("## ")) {
        renderedElements.push(<h2 key={idx} className="text-base sm:text-lg font-bold text-foreground mt-4 mb-2 pb-1 border-b border-border/60">{formatInlineText(line.replace("## ", ""))}</h2>);
        return;
      }
      if (line.startsWith("### ")) {
        renderedElements.push(<h3 key={idx} className="text-sm sm:text-base font-bold text-foreground mt-3 mb-1.5 text-primary">{formatInlineText(line.replace("### ", ""))}</h3>);
        return;
      }
      if (line.startsWith("#### ")) {
        renderedElements.push(<h4 key={idx} className="text-xs sm:text-sm font-bold text-foreground mt-2 mb-1">{formatInlineText(line.replace("#### ", ""))}</h4>);
        return;
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        renderedElements.push(
          <li key={idx} className="ml-4 list-disc text-foreground/90 leading-relaxed my-0.5 text-xs sm:text-sm">
            {formatInlineText(line.slice(2))}
          </li>
        );
        return;
      }
      if (line.startsWith("> ")) {
        renderedElements.push(
          <blockquote key={idx} className="border-l-4 border-primary/60 pl-3.5 py-1.5 my-2 bg-primary/5 rounded-r-xl italic text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {formatInlineText(line.replace("> ", ""))}
          </blockquote>
        );
        return;
      }
      if (line.startsWith("|")) {
        renderedElements.push(
          <div key={idx} className="overflow-x-auto text-xs py-1 font-mono text-foreground/80 bg-muted/30 px-2 rounded-lg my-1">
            {line}
          </div>
        );
        return;
      }
      if (line.trim() === "---") {
        renderedElements.push(<hr key={idx} className="border-border my-4" />);
        return;
      }
      if (!line.trim()) {
        renderedElements.push(<div key={idx} className="h-2" />);
        return;
      }

      renderedElements.push(<p key={idx} className="text-foreground/90 leading-relaxed text-xs sm:text-sm">{formatInlineText(line)}</p>);
    });

    return <div className="prose-academic space-y-1.5">{renderedElements}</div>;
  };

  return (
    <div className="flex flex-1 flex-col h-full relative overflow-hidden bg-background">
      {/* Scrollable Conversation Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          /* Gemini / Kimi / ChatGPT Unified Welcome Screen */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-white mb-5 shadow-xl shadow-primary/20 ring-4 ring-primary/10">
              <Sparkles className="h-8 w-8" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How can <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">AcademicAI</span> help you today?
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              One unified AI assistant powered by free cloud foundation models. Search 480M+ research papers, synthesize literature, draft LaTeX manuscripts, write code, or chat naturally.
            </p>

            {/* Quick Starter Suggestion Grid (ChatGPT / Gemini style) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl text-left">
              {STARTER_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/60 hover:bg-muted/40 hover:shadow-md transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px] uppercase tracking-wider">{item.category}</span>
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-primary leading-snug line-clamp-2">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                      "{item.prompt}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message Stream */
          <div className="space-y-6 pb-36">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-bold text-xs shadow-md mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[90%] sm:max-w-[82%] rounded-3xl p-4 sm:p-6 shadow-xs transition-all ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-br-xs"
                      : "bg-card border border-border text-foreground rounded-bl-xs shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-primary tracking-tight">
                          AcademicAI Brain
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.2 rounded-full">
                          Free Cloud
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <div>
                    {msg.role === "user" ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      renderMarkdown(msg.content)
                    )}
                  </div>

                  {/* Cited Papers Accordion / Direct PDF Links */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        Verified Peer-Reviewed Sources ({msg.sources.length}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src) => (
                          <div
                            key={src.id}
                            className="flex flex-col justify-between p-2.5 rounded-xl bg-muted/40 border border-border/70 hover:border-primary/50 transition-colors text-xs"
                          >
                            <div>
                              <a
                                href={src.url || (src.doi ? `https://doi.org/${src.doi}` : src.pdfUrl || "#")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-foreground hover:text-primary line-clamp-1 flex items-center gap-1"
                              >
                                <span>{src.title}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                              </a>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {src.authors.slice(0, 2).join(", ")} ({src.year}) &bull; {src.source}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-border/40">
                              <span className="font-bold text-primary">★ {src.citationCount || 0} citations</span>
                              {src.pdfUrl && (
                                <a
                                  href={src.pdfUrl}
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
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Suggested Follow-Up Questions (Chatademia Reference) */}
                  {msg.role === "assistant" && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Suggested Follow-up Questions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => onSendMessage(q)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/15 px-3 py-1 text-xs font-medium text-primary transition-all hover:scale-[1.01] active:scale-[0.99] text-left shadow-2xs"
                          >
                            <span>{q}</span>
                            <ArrowRight className="h-3 w-3 shrink-0 opacity-70" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Quick Skill Actions */}
                  {msg.role === "assistant" && (
                    <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase mr-1">
                        Explore Further:
                      </span>
                      {[
                        { id: "find_papers", label: "🔬 Search 480M+ Papers", prompt: "Find more peer-reviewed empirical papers and recent arXiv preprints on this topic with direct PDF links." },
                        { id: "literature_overview", label: "📑 Synthesize Literature", prompt: "Synthesize these findings into a publication-grade systematic literature overview with a thematic comparison table." },
                        { id: "latex_compiler", label: "📐 Convert to LaTeX", prompt: "Convert the key findings and equations from above into complete, compilable LaTeX manuscript code with BibTeX." },
                        { id: "research_gaps", label: "💡 Uncover Gaps", prompt: "What are the unexplored research gaps and open challenges based on this analysis?" },
                        { id: "mock_peer_review", label: "🏛️ Mock Peer Review", prompt: "Run a simulated rigorous peer-review evaluation on these findings and methods." },
                      ].map((action) => (
                        <button
                          key={action.id}
                          onClick={() => onSendMessage(action.prompt)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/60 hover:bg-muted transition-all shadow-2xs"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="h-3 w-3 text-primary" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-muted text-foreground font-bold text-xs shadow-xs mt-0.5">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 items-center text-xs text-primary font-medium animate-pulse bg-primary/5 p-4 rounded-2xl border border-primary/20 max-w-lg shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                <span>{executionStep || "Synthesizing research across 480M+ papers..."}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Curved Input Bar (Gemini / Kimi / ChatGPT style) */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-5 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-3xl mx-auto w-full space-y-2">
          {/* Attached Papers Pills */}
          {attachedPapers.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              <span className="text-[11px] font-bold text-primary uppercase shrink-0">Attached:</span>
              {attachedPapers.map((paper) => (
                <span
                  key={paper.id}
                  className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground shrink-0 shadow-xs"
                >
                  <BookOpen className="h-3 w-3 text-primary" />
                  <span className="truncate max-w-[150px]">{paper.title}</span>
                  <button
                    onClick={() => onRemovePaper(paper.id)}
                    className="text-muted-foreground hover:text-destructive ml-0.5 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Curved Floating Input Container */}
          <div className="relative flex flex-col rounded-3xl border border-border bg-card/95 backdrop-blur-md p-2 shadow-2xl focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, search 480M+ papers, write code, formulate hypotheses, or draft LaTeX..."
              rows={2}
              className="w-full max-h-36 resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
            />

            {/* Bottom Toolbar & Action Switches */}
            <div className="flex items-center justify-between pt-1.5 px-1 border-t border-border/40 mt-1 gap-1">
              <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
                {/* 1. Model Selector Dropdown */}
                <div className="relative" ref={modelPickerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModelPickerOpen(!isModelPickerOpen);
                      setIsDbPickerOpen(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition-all shrink-0 shadow-2xs"
                    title="Select AI Model"
                  >
                    <Bot className="h-3.5 w-3.5 text-primary" />
                    <span>{selectedModelObj.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>

                  {/* Model Selector Popover */}
                  {isModelPickerOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                      <div className="px-2 py-1.5 border-b border-border/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Select AI Model</span>
                        <span className="text-[10px] text-muted-foreground font-mono">5 Engines Active</span>
                      </div>
                      <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                        {AVAILABLE_MODELS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModelId(m.id);
                              setIsModelPickerOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                              selectedModelId === m.id
                                ? "bg-primary/15 border border-primary/30 text-primary font-bold"
                                : "hover:bg-muted text-foreground/90"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{m.name}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-muted border border-border text-muted-foreground font-mono">
                                  {m.tag}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{m.desc}</p>
                            </div>
                            {selectedModelId === m.id && <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Database Multi-Picker Popover */}
                <div className="relative" ref={dbPickerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDbPickerOpen(!isDbPickerOpen);
                      setIsModelPickerOpen(false);
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 ${
                      selectedDatabases.length === AVAILABLE_DATABASES.length
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                        : "bg-muted/80 text-foreground border border-border"
                    }`}
                    title="Select connected academic databases"
                  >
                    <Database className="h-3.5 w-3.5 text-emerald-500" />
                    <span>
                      {selectedDatabases.length === AVAILABLE_DATABASES.length
                        ? "All 6 DBs (480M+)"
                        : `${selectedDatabases.length} DBs Connected`}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>

                  {/* Database Multi-Select Popover */}
                  {isDbPickerOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                      <div className="px-1.5 py-1 border-b border-border/50 flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-foreground">Select Academic Databases</span>
                        <div className="flex items-center gap-1 text-[11px]">
                          <button
                            onClick={selectAllDatabases}
                            className="text-primary hover:underline font-semibold"
                          >
                            Select All
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {AVAILABLE_DATABASES.map((db) => {
                          const isSelected = selectedDatabases.includes(db.id);
                          return (
                            <div
                              key={db.id}
                              onClick={() => toggleDatabase(db.id)}
                              className={`p-2 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? "bg-primary/10 border border-primary/25 text-foreground"
                                  : "hover:bg-muted/60 text-muted-foreground opacity-70"
                              }`}
                            >
                              <div className="mt-0.5 text-primary shrink-0">
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4 text-primary" />
                                ) : (
                                  <Square className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`font-semibold text-xs ${isSelected ? "text-foreground font-bold" : ""}`}>
                                    {db.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    {db.count}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{db.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Attach Paper */}
                <button
                  onClick={onOpenSearchPapers}
                  className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  title="Search and Attach 480M+ Papers"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span>Attach</span>
                </button>

                {/* 4. Deep Reasoning Toggle */}
                <button
                  onClick={() => setDeepReasoningActive(!deepReasoningActive)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 ${
                    deepReasoningActive
                      ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 font-bold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                  title="Enable step-by-step mathematical reasoning"
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  <span>Reasoning</span>
                </button>
              </div>

              {/* Right Side: Right Panel Toggle & Send Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {onToggleRightPanel && (
                  <button
                    type="button"
                    onClick={onToggleRightPanel}
                    className={`p-2 rounded-full border transition-all text-xs ${
                      isRightPanelOpen
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                    }`}
                    title={isRightPanelOpen ? "Close Live Artifacts Panel" : "Open Live Artifacts Panel"}
                  >
                    {isRightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                  </button>
                )}

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || loading}
                  className={`rounded-full p-2.5 transition-all shrink-0 ${
                    inputText.trim() && !loading
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 scale-105"
                      : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                  }`}
                  title="Send Message"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* ChatGPT Disclaimer */}
          <p className="text-center text-[10px] text-muted-foreground/60">
            AcademicAI searches 480M+ global academic databases. Cites official DOIs &amp; verified peer-reviewed literature.
          </p>
        </div>
      </div>
    </div>
  );
}
