"use client";

import React from "react";
import { AcademicPaper } from "@/lib/types";
import { ExternalLink, Bookmark, BookmarkCheck, FileText, Award } from "lucide-react";

interface PaperCardProps {
  paper: AcademicPaper;
  isSaved: boolean;
  onToggleSave: (paper: AcademicPaper) => void;
}

export function PaperCard({ paper, isSaved, onToggleSave }: PaperCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {paper.source}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {paper.year}
            </span>
            {paper.venue && (
              <span className="truncate max-w-[200px] text-xs text-muted-foreground italic">
                • {paper.venue}
              </span>
            )}
            {paper.isOpenAccess && (
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Open Access
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleSave(paper)}
            className={`rounded-lg p-1.5 transition-colors ${
              isSaved
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={isSaved ? "Remove from workspace" : "Save to workspace"}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>

        <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug line-clamp-2 mt-1">
          {paper.title}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground font-medium truncate">
          {paper.authors.join(", ")}
        </p>

        <p className="mt-2 text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
          {paper.abstract}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>{paper.citationCount || 0} citations</span>
        </div>

        <div className="flex items-center gap-2">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>PDF</span>
            </a>
          )}

          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
            >
              <span>Source</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
