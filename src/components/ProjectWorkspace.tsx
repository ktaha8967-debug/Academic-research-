"use client";

import React, { useState } from "react";
import { AcademicPaper } from "@/lib/types";
import { Bookmark, FileText, Trash2, Plus, ExternalLink, Sparkles } from "lucide-react";

interface ProjectWorkspaceProps {
  savedPapers: AcademicPaper[];
  onRemovePaper: (id: string) => void;
  notes: string[];
  onAddNote: (note: string) => void;
  onRemoveNote: (index: number) => void;
  onOpenSearch: () => void;
}

export function ProjectWorkspace({
  savedPapers,
  onRemovePaper,
  notes,
  onAddNote,
  onRemoveNote,
  onOpenSearch,
}: ProjectWorkspaceProps) {
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"papers" | "notes">("papers");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote("");
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("papers")}
            className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "papers"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Saved Papers ({savedPapers.length})
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "notes"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Research Notes ({notes.length})
          </button>
        </div>

        {activeTab === "papers" && (
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {activeTab === "papers" ? (
          savedPapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <Bookmark className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-medium text-foreground">No papers saved yet</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Search open-access papers and bookmark them to feed all research agents.
              </p>
              <button
                onClick={onOpenSearch}
                className="mt-3 rounded-lg border border-border px-3 py-1 text-xs font-medium text-primary hover:bg-muted"
              >
                Search Papers
              </button>
            </div>
          ) : (
            savedPapers.map((paper) => (
              <div
                key={paper.id}
                className="group relative rounded-lg border border-border/60 bg-muted/20 p-2.5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                    {paper.source}
                  </span>
                  <button
                    onClick={() => onRemovePaper(paper.id)}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    title="Remove paper"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <h4 className="font-medium text-xs text-foreground line-clamp-2 mt-1">
                  {paper.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {paper.authors.slice(0, 2).join(", ")} ({paper.year})
                </p>
              </div>
            ))
          )
        ) : (
          <div>
            <form onSubmit={handleAddNote} className="mb-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a research hypothesis, constraint, or dataset note..."
                rows={2}
                className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="mt-1 w-full rounded-lg bg-primary py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              >
                Save Note
              </button>
            </form>

            {notes.length === 0 ? (
              <p className="text-center text-[11px] text-muted-foreground py-6">
                No notes saved. Notes are shared across all agent runs.
              </p>
            ) : (
              notes.map((n, i) => (
                <div
                  key={i}
                  className="group flex items-start justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 p-2 text-xs text-foreground mb-1.5"
                >
                  <p className="text-xs leading-relaxed">{n}</p>
                  <button
                    onClick={() => onRemoveNote(i)}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
