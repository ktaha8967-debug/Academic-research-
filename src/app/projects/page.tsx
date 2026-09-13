"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { FolderGit2, Plus, Trash2, Download, ArrowLeft, Check, Upload } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_default",
      name: "Autonomous AI Research Orchestrator",
      description: "Investigation of agentic RAG and multi-agent synthesis across open scholarly literature.",
      category: "AI & Computer Science",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
            <span>ChatGPT Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">Project Workspaces</h1>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {showCreate && (
          <form onSubmit={handleCreate} className="rounded-2xl border border-primary/40 bg-primary/5 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-foreground">Create New Research Workspace</h3>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LLM Reasoning in Clinical Healthcare"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="AI & Computer Science">AI & Computer Science</option>
                <option value="Biomedical & Healthcare">Biomedical & Healthcare</option>
                <option value="Physics & Mathematics">Physics & Mathematics</option>
                <option value="Social Sciences & Economics">Social Sciences & Economics</option>
                <option value="Interdisciplinary Research">Interdisciplinary Research</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Research Objective</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Primary research hypothesis and target conference..."
                rows={2}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Create Workspace
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`flex items-center justify-between rounded-2xl border p-5 shadow-xs transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
                }`}
              >
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    localStorage.setItem("academic_active_project_id", proj.id);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate">{proj.name}</h3>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{proj.description || "No description provided."}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-2 py-0.5 font-medium">{proj.category}</span>
                    <span>• {proj.savedPapers.length} Papers Attached</span>
                    <span>• {proj.notes.length} Notes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleExport(proj)}
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Export JSON"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 rounded-lg border border-border hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
