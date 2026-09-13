"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AgentSelector } from "@/components/AgentSelector";
import { PaperSearchModal } from "@/components/PaperSearchModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ProjectWorkspace } from "@/components/ProjectWorkspace";
import { ProjectManager } from "@/components/ProjectManager";
import { PaperGraphModal } from "@/components/PaperGraphModal";
import { PosterBuilderModal } from "@/components/PosterBuilderModal";
import { DataExtractionModal } from "@/components/DataExtractionModal";
import { PeerReviewModal } from "@/components/PeerReviewModal";
import { UsageAnalyticsModal } from "@/components/UsageAnalyticsModal";

import { AGENTS_LIST } from "@/lib/agents-data";
import { TRANSLATIONS } from "@/lib/translations";
import {
  AgentType,
  AcademicPaper,
  MessageHistoryItem,
  AIModelConfig,
  Project,
  LanguageCode,
  UserUsageStats,
} from "@/lib/types";
import {
  Send,
  Loader2,
  Sparkles,
  Paperclip,
  Database,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Layers,
  FileDown,
  Presentation,
  FileSpreadsheet,
  Users,
  Network,
  Download,
  ArrowLeft,
} from "lucide-react";

interface AppWorkspaceProps {
  initialAgent?: string;
  onBackToLanding: () => void;
}

export function AppWorkspace({ initialAgent, onBackToLanding }: AppWorkspaceProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [activeAgent, setActiveAgent] = useState<AgentType>(
    (initialAgent as AgentType) || "academic_chat"
  );
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [executionStep, setExecutionStep] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-Project State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_default",
      name: "Autonomous AI Research Orchestrator",
      description: "Investigation of agentic RAG and multi-agent synthesis across open scholarly literature.",
      category: "AI & Computer Science",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedPapers: [],
      notes: [
        "Compare zero-shot vs few-shot retrieval accuracy.",
        "Ensure all claims link directly to verified DOIs in OpenAlex/arXiv.",
      ],
      history: [],
    },
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>("proj_default");

  // SaaS Usage Tracker
  const [usageStats, setUsageStats] = useState<UserUsageStats>({
    searchesPerformed: 18,
    agentRuns: 12,
    savedPapersCount: 0,
    plan: "Free Cloud",
    maxSearchesDaily: 500,
    tokensProcessed: 185000,
  });

  // Modal States
  const [isPaperSearchOpen, setIsPaperSearchOpen] = useState(initialAgent === "find_papers");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isDataExtractOpen, setIsDataExtractOpen] = useState(false);
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    provider: "fallback",
    modelName: "llama-3.3-70b-versatile",
  });

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load stored state on mount
  useEffect(() => {
    try {
      const storedProjs = localStorage.getItem("academic_ai_projects");
      if (storedProjs) {
        setProjects(JSON.parse(storedProjs));
      }
      const storedActiveId = localStorage.getItem("academic_active_project_id");
      if (storedActiveId) {
        setActiveProjectId(storedActiveId);
      }
      const storedConfig = localStorage.getItem("academic_ai_config");
      if (storedConfig) {
        setAiConfig(JSON.parse(storedConfig));
      }
    } catch {}
  }, []);

  const updateProject = (updated: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, ...updated, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem("academic_ai_projects", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCreateProject = (name: string, description: string, category: string) => {
    const newProj: Project = {
      id: `proj_${Math.random().toString(36).substring(7)}`,
      name,
      description,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedPapers: [],
      notes: [],
      history: [],
    };
    const nextProjects = [newProj, ...projects];
    setProjects(nextProjects);
    setActiveProjectId(newProj.id);
    try {
      localStorage.setItem("academic_ai_projects", JSON.stringify(nextProjects));
      localStorage.setItem("academic_active_project_id", newProj.id);
    } catch {}
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (activeProjectId === id) {
      setActiveProjectId(next[0].id);
    }
    try {
      localStorage.setItem("academic_ai_projects", JSON.stringify(next));
    } catch {}
  };

  const handleExportProject = (proj: Project) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(proj, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `${proj.name.replace(/\s+/g, "_")}_workspace.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportProject = (imported: Project) => {
    const newProj = {
      ...imported,
      id: `proj_${Math.random().toString(36).substring(7)}`,
      updatedAt: new Date().toISOString(),
    };
    const next = [newProj, ...projects];
    setProjects(next);
    setActiveProjectId(newProj.id);
    try {
      localStorage.setItem("academic_ai_projects", JSON.stringify(next));
    } catch {}
  };

  const handleToggleSavePaper = (paper: AcademicPaper) => {
    const exists = activeProject.savedPapers.some(
      (p) => p.id === paper.id || p.title === paper.title
    );
    let updated;
    if (exists) {
      updated = activeProject.savedPapers.filter(
        (p) => p.id !== paper.id && p.title !== paper.title
      );
    } else {
      updated = [paper, ...activeProject.savedPapers];
    }
    updateProject({ savedPapers: updated });
    setUsageStats((prev) => ({ ...prev, savedPapersCount: updated.length }));
  };

  const handleRemovePaper = (id: string) => {
    const updated = activeProject.savedPapers.filter((p) => p.id !== id);
    updateProject({ savedPapers: updated });
  };

  const handleAddNote = (note: string) => {
    const updated = [note, ...activeProject.notes];
    updateProject({ notes: updated });
  };

  const handleRemoveNote = (idx: number) => {
    const updated = activeProject.notes.filter((_, i) => i !== idx);
    updateProject({ notes: updated });
  };

  const currentAgentInfo =
    AGENTS_LIST.find((a) => a.id === activeAgent) || AGENTS_LIST[0];

  const handleSubmit = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    if (activeAgent === "find_papers" && (!activeProject.savedPapers.length || customPrompt)) {
      setIsPaperSearchOpen(true);
    }

    const userMsg: MessageHistoryItem = {
      id: Math.random().toString(36).substring(7),
      agentId: activeAgent,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...activeProject.history, userMsg];
    updateProject({ history: newHistory });
    setPrompt("");
    setLoading(true);
    setExecutionStep("Connecting to cloud open-source agent...");

    try {
      setTimeout(() => setExecutionStep("Retrieving 480M+ scholarly literature context..."), 400);
      setTimeout(() => setExecutionStep("Synthesizing multi-database evidence with verified citations..."), 900);

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeAgent,
          userPrompt: textToSend.trim(),
          contextPapers: activeProject.savedPapers,
          projectNotes: activeProject.notes,
          config: aiConfig,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: MessageHistoryItem = {
          id: Math.random().toString(36).substring(7),
          agentId: activeAgent,
          role: "assistant",
          content: data.content,
          structuredData: data.structuredData,
          sources: activeProject.savedPapers.slice(0, data.sourcesUsed || 0),
          timestamp: data.timestamp,
        };
        updateProject({ history: [...newHistory, assistantMsg] });
        setUsageStats((prev) => ({
          ...prev,
          agentRuns: prev.agentRuns + 1,
          tokensProcessed: prev.tokensProcessed + 2400,
        }));
      } else {
        const errorMsg: MessageHistoryItem = {
          id: Math.random().toString(36).substring(7),
          agentId: activeAgent,
          role: "assistant",
          content: `⚠️ **Agent Error**: ${data.error || "Failed to process research request."}`,
          timestamp: new Date().toISOString(),
        };
        updateProject({ history: [...newHistory, errorMsg] });
      }
    } catch (err: any) {
      const errorMsg: MessageHistoryItem = {
        id: Math.random().toString(36).substring(7),
        agentId: activeAgent,
        role: "assistant",
        content: `⚠️ **Connection Error**: ${err?.message || "Could not reach agent service."}`,
        timestamp: new Date().toISOString(),
      };
      updateProject({ history: [...newHistory, errorMsg] });
    } finally {
      setLoading(false);
      setExecutionStep("");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportAllBibtex = () => {
    if (activeProject.savedPapers.length === 0) {
      alert("No papers saved in workspace yet. Search and bookmark papers first.");
      return;
    }
    const bibtex = activeProject.savedPapers
      .map((p, i) => {
        const key = `${(p.authors[0] || "author").split(" ").pop()?.toLowerCase() || "ref"}${p.year || 2024}_${i + 1}`;
        return `@article{${key},\n  title = {${p.title}},\n  author = {${p.authors.join(" and ")}},\n  journal = {${p.venue || "Academic Journal"}},\n  year = {${p.year}},\n  doi = {${p.doi || ""}},\n  url = {${p.url || ""}}\n}`;
      })
      .join("\n\n");

    const blob = new Blob([bibtex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject.name.replace(/\s+/g, "_")}_references.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="prose-academic space-y-2 text-foreground/90">
        {lines.map((line, idx) => {
          if (line.startsWith("## ")) return <h2 key={idx}>{line.replace("## ", "")}</h2>;
          if (line.startsWith("### ")) return <h3 key={idx}>{line.replace("### ", "")}</h3>;
          if (line.startsWith("#### ")) return <h4 key={idx}>{line.replace("#### ", "")}</h4>;
          if (line.startsWith("* ") || line.startsWith("- ")) {
            return (
              <li key={idx} className="ml-4 list-disc">
                {line.slice(2)}
              </li>
            );
          }
          if (line.startsWith("> ")) return <blockquote key={idx}>{line.replace("> ", "")}</blockquote>;
          if (line.startsWith("|")) {
            return (
              <pre key={idx} className="overflow-x-auto text-xs py-1">
                {line}
              </pre>
            );
          }
          if (line.trim() === "---") return <hr key={idx} className="border-border my-4" />;
          if (!line.trim()) return <div key={idx} className="h-1" />;
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top In-App Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openSettings={() => setIsSettingsOpen(true)}
        openPaperSearch={() => setIsPaperSearchOpen(true)}
        openProjects={() => setIsProjectsOpen(true)}
        openGraph={() => setIsGraphOpen(true)}
        openUsage={() => setIsUsageOpen(true)}
        savedPapersCount={activeProject.savedPapers.length}
        currentProjectName={activeProject.name}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
      />

      {/* Main SaaS App Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>

            <span className="text-xs text-muted-foreground hidden sm:inline">
              Workspace: <strong className="text-foreground">{activeProject.name}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPosterOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors"
            >
              <Presentation className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t.posterBuilder}</span>
            </button>
            <button
              onClick={() => setIsDataExtractOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-blue-500" />
              <span>{t.dataExtract}</span>
            </button>
            <button
              onClick={() => setIsPeerReviewOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors"
            >
              <Users className="h-3.5 w-3.5 text-amber-500" />
              <span>{t.peerReview}</span>
            </button>
          </div>
        </div>

        {/* Agent Navigation Carousel */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specialized Research Agents
            </span>
            <span className="text-xs text-primary font-medium">
              13 Interconnected Workflows
            </span>
          </div>
          <AgentSelector activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
        </section>

        {/* 2-Column Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
          {/* Main Agent Chat & Output Column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Active Agent Hero & Input Box */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-foreground">
                      {currentAgentInfo.title}
                    </h1>
                    <p className="text-xs text-muted-foreground">{currentAgentInfo.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <Cpu className="h-3 w-3" />
                    {aiConfig.provider === "groq"
                      ? "Groq Cloud (Llama-3.3-70B)"
                      : aiConfig.provider === "openrouter"
                      ? "OpenRouter Cloud"
                      : "Open Cloud Intelligence"}
                  </span>
                </div>
              </div>

              {/* 1-Click Suggested Prompts */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {currentAgentInfo.suggestedPrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(sp);
                      handleSubmit(sp);
                    }}
                    className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-colors text-left"
                  >
                    "{sp}"
                  </button>
                ))}
              </div>

              {/* Main Input Box */}
              <div className="relative rounded-xl border border-border bg-background shadow-inner focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit();
                    }
                  }}
                  placeholder={currentAgentInfo.placeholder}
                  rows={3}
                  className="w-full resize-none bg-transparent p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between border-t border-border/50 px-3 py-2 bg-muted/10 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaperSearchOpen(true)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Attach or search scholarly papers"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-primary" />
                      <span>{activeProject.savedPapers.length} Papers Connected</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPaperSearchOpen(true)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Database className="h-3.5 w-3.5 text-emerald-500" />
                      <span>OpenAlex / arXiv / PubMed / Crossref</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading || !prompt.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-40 transition-colors"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    <span>{t.executeAgent}</span>
                  </button>
                </div>
              </div>

              {/* Live Streaming Step Indicator */}
              {loading && executionStep && (
                <div className="mt-3 flex items-center gap-2 text-xs text-primary font-medium animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{executionStep}</span>
                </div>
              )}
            </div>

            {/* Conversation Output Timeline */}
            <div className="space-y-4">
              {activeProject.history.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/40">
                  <BookOpen className="h-10 w-10 text-primary/30 mb-3" />
                  <h3 className="font-bold text-base text-foreground">
                    Research Workspace: {activeProject.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-md">
                    Select an agent above or search 480M+ scholarly works across OpenAlex, arXiv, PubMed, and Crossref.
                  </p>
                </div>
              ) : (
                activeProject.history.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border p-5 shadow-xs transition-all ${
                      msg.role === "user"
                        ? "border-border/80 bg-muted/30 ml-4 sm:ml-12"
                        : "border-border bg-card shadow-sm mr-2 sm:mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                          {msg.role === "user" ? "Researcher" : `${msg.agentId.replace("_", " ")} Agent`}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Copy Markdown"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-sm">{renderMarkdown(msg.content)}</div>

                    {/* Agent Chaining Buttons */}
                    {msg.role === "assistant" && (
                      <div className="mt-5 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {t.chainPipeline}
                        </span>
                        {[
                          { id: "literature_overview", label: "Literature Overview" },
                          { id: "research_gaps", label: "Find Gaps" },
                          { id: "mock_peer_review", label: "Peer Review" },
                          { id: "poster_forge", label: "Poster Forge" },
                          { id: "data_extraction", label: "Extract Data" },
                        ]
                          .filter((st) => st.id !== msg.agentId)
                          .map((st) => (
                            <button
                              key={st.id}
                              onClick={() => {
                                setActiveAgent(st.id as AgentType);
                                handleSubmit(`Continue research pipeline on previous output: ${msg.content.slice(0, 150)}...`);
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
                            >
                              <span>{st.label}</span>
                              <ArrowRight className="h-3 w-3 text-primary" />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar: Project Workspace */}
          <div className="lg:col-span-1 flex flex-col gap-4 sticky top-20">
            <ProjectWorkspace
              savedPapers={activeProject.savedPapers}
              onRemovePaper={handleRemovePaper}
              notes={activeProject.notes}
              onAddNote={handleAddNote}
              onRemoveNote={handleRemoveNote}
              onOpenSearch={() => setIsPaperSearchOpen(true)}
            />

            {/* Quick SaaS Exporters */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-xs">
              <h4 className="font-bold text-foreground">SaaS Export Actions</h4>
              <button
                onClick={exportAllBibtex}
                className="w-full flex items-center justify-between rounded-lg border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <span>{t.exportBibtex}</span>
                <Download className="h-3.5 w-3.5 text-primary" />
              </button>
              <button
                onClick={() => setIsPosterOpen(true)}
                className="w-full flex items-center justify-between rounded-lg border border-border p-2 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <span>Conference Poster Studio</span>
                <Presentation className="h-3.5 w-3.5 text-emerald-500" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* All SaaS Modals */}
      <PaperSearchModal
        isOpen={isPaperSearchOpen}
        onClose={() => setIsPaperSearchOpen(false)}
        savedPapers={activeProject.savedPapers}
        onToggleSavePaper={handleToggleSavePaper}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSaveConfig={setAiConfig}
      />

      <ProjectManager
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setIsProjectsOpen(false);
        }}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
      />

      <PaperGraphModal
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        papers={activeProject.savedPapers}
        onSelectPaper={() => {}}
      />

      <PosterBuilderModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        initialTopic={activeProject.name}
        savedPapersCount={activeProject.savedPapers.length}
      />

      <DataExtractionModal
        isOpen={isDataExtractOpen}
        onClose={() => setIsDataExtractOpen(false)}
        papers={activeProject.savedPapers}
        topic={activeProject.name}
      />

      <PeerReviewModal
        isOpen={isPeerReviewOpen}
        onClose={() => setIsPeerReviewOpen(false)}
        topic={activeProject.name}
      />

      <UsageAnalyticsModal
        isOpen={isUsageOpen}
        onClose={() => setIsUsageOpen(false)}
        stats={usageStats}
      />
    </div>
  );
}
