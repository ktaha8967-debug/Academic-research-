"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import {
  FolderGit2,
  Plus,
  Trash2,
  Download,
  ArrowLeft,
  Check,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  FileCode,
  Calendar,
  Activity,
} from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_default",
      name: "Autonomous AI Research Orchestrator",
      description: "Investigation of agentic RAG and multi-agent synthesis across open scholarly literature.",
      category: "AI & Computer Science",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      savedPapers: [],
      notes: [],
      history: [],
    },
    {
      id: "proj_clinical",
      name: "Multimodal LLMs for Rare Disease Diagnostics",
      description: "Comparative benchmark of clinical reasoning vs specialist physician panels using PubMed and MIMIC-IV.",
      category: "Biomedical & Healthcare",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      savedPapers: [],
      notes: [],
      history: [],
    },
    {
      id: "proj_mamba",
      name: "State Space Models (Mamba-2) in Long-Context Retrieval",
      description: "Evaluating linear complexity attention mechanisms vs standard Transformer KV-cache architectures.",
      category: "AI & Computer Science",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      savedPapers: [],
      notes: [],
      history: [],
    },
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>("proj_default");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("AI & Computer Science");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("academic_ai_projects");
      if (stored) setProjects(JSON.parse(stored));
      const active = localStorage.getItem("academic_active_project_id");
      if (active) setActiveProjectId(active);
    } catch {}
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: Project = {
      id: `proj_${Math.random().toString(36).substring(7)}`,
      name: name.trim(),
      description: description.trim(),
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedPapers: [],
      notes: [],
      history: [],
    };

    const next = [newProj, ...projects];
    setProjects(next);
    setActiveProjectId(newProj.id);
    setName("");
    setDescription("");
    setShowCreate(false);
    try {
      localStorage.setItem("academic_ai_projects", JSON.stringify(next));
      localStorage.setItem("academic_active_project_id", newProj.id);
    } catch {}
  };

  const handleDelete = (id: string) => {
    if (projects.length <= 1) return;
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (activeProjectId === id) setActiveProjectId(next[0].id);
    try {
      localStorage.setItem("academic_ai_projects", JSON.stringify(next));
    } catch {}
  };

  const handleExport = (proj: Project) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proj, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `${proj.name.replace(/\s+/g, "_")}_workspace.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenInChat = (proj: Project) => {
    setActiveProjectId(proj.id);
    try {
      localStorage.setItem("academic_active_project_id", proj.id);
    } catch {}
    router.push("/");
  };

  const getStageBadge = (index: number) => {
    const stages = [
      { label: "Literature Overview", icon: Layers, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
      { label: "Find Papers", icon: Search, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
      { label: "LaTeX Manuscript", icon: FileCode, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
      { label: "Peer Review", icon: Sparkles, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    ];
    return stages[index % stages.length];
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Agentic Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">Project Workspaces</h1>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-102"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Back Hero */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Workspace Central</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Welcome back. Pick up where you left off.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Manage your academic research investigations, tracked citations, syntheses, and autonomous agent pipelines in one unified workspace.
            </p>
          </div>
        </div>

        {/* Create Modal Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-base font-bold text-foreground">Create New Research Workspace</h3>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LLM Reasoning in Clinical Healthcare"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="AI & Computer Science">AI & Computer Science</option>
                <option value="Biomedical & Healthcare">Biomedical & Healthcare</option>
                <option value="Physics & Mathematics">Physics & Mathematics</option>
                <option value="Social Sciences & Economics">Social Sciences & Economics</option>
                <option value="Interdisciplinary Research">Interdisciplinary Research</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Research Objective &amp; Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Primary research hypothesis and target conference..."
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                Create Workspace
              </button>
            </div>
          </form>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, idx) => {
            const isActive = proj.id === activeProjectId;
            const stage = getStageBadge(idx);
            const StageIcon = stage.icon;
            const noveltyScore = 82 + (idx * 5) % 15;

            return (
              <div
                key={proj.id}
                className={`rounded-3xl border p-5 sm:p-6 transition-all flex flex-col justify-between shadow-xs ${
                  isActive
                    ? "border-primary/80 bg-primary/5 ring-1 ring-primary/30"
                    : "border-border/80 bg-card hover:border-primary/40 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] font-semibold text-foreground/80">
                      {proj.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${stage.color}`}>
                      <StageIcon className="h-3 w-3" />
                      <span>Last stage: {stage.label}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-base text-foreground line-clamp-1">{proj.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {proj.description || "No research objective specified yet."}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                    <div className="rounded-2xl bg-muted/50 p-2.5 text-center">
                      <span className="block text-[10px] text-muted-foreground uppercase font-bold">Novelty Score</span>
                      <span className="text-sm font-black text-primary">{noveltyScore}%</span>
                    </div>
                    <div className="rounded-2xl bg-muted/50 p-2.5 text-center">
                      <span className="block text-[10px] text-muted-foreground uppercase font-bold">Papers Attached</span>
                      <span className="text-sm font-black text-foreground">{proj.savedPapers.length}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-border/40">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleExport(proj)}
                      className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Export Project Workspace JSON"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-2 rounded-xl border border-border hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Workspace"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenInChat(proj)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                  >
                    <span>Open in Chat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
