"use client";

import React, { useState } from "react";
import { Project, AcademicPaper } from "@/lib/types";
import { FolderGit2, Plus, Trash2, Download, Upload, Check, FolderOpen, X } from "lucide-react";

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string, category: string) => void;
  onDeleteProject: (id: string) => void;
  onExportProject: (project: Project) => void;
  onImportProject: (imported: Project) => void;
}

export function ProjectManager({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onExportProject,
  onImportProject,
}: ProjectManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("AI & Computer Science");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject(name.trim(), description.trim(), category);
      setName("");
      setDescription("");
      setShowCreateForm(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.name) {
            onImportProject(parsed);
          }
        } catch (err) {
          alert("Invalid project JSON file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Research Workspaces & Projects</h2>
              <p className="text-xs text-muted-foreground">Manage multi-project repositories, saved papers, and notes</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-3 bg-card">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Research Project</span>
          </button>

          <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:bg-muted transition-colors">
            <Upload className="h-3.5 w-3.5 text-primary" />
            <span>Import Workspace JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="border-b border-border bg-muted/10 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Create New Project</h4>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LLM Reasoning in Medical Diagnostics"
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Domain / Field</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="AI & Computer Science">AI & Computer Science</option>
                <option value="Biomedical & Healthcare">Biomedical & Healthcare</option>
                <option value="Physics & Mathematics">Physics & Mathematics</option>
                <option value="Social Sciences & Economics">Social Sciences & Economics</option>
                <option value="Interdisciplinary Research">Interdisciplinary Research</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Description / Target Goal</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Primary research hypothesis and target conference/journal..."
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Create Project
              </button>
            </div>
          </form>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/30"
                }`}
              >
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectProject(proj.id)}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-foreground truncate">{proj.name}</h3>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Check className="h-3 w-3" />
                        Active Workspace
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{proj.description || "No description provided."}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5 font-medium">{proj.category}</span>
                    <span>• {proj.savedPapers.length} Papers</span>
                    <span>• {proj.notes.length} Notes</span>
                    <span>• Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-4">
                  <button
                    onClick={() => onExportProject(proj)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Export workspace to JSON"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
