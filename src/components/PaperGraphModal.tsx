"use client";

import React, { useMemo, useState } from "react";
import { AcademicPaper } from "@/lib/types";
import { buildCitationGraph } from "@/lib/academic-search";
import { Network, X, Sparkles, Filter, Award, BookOpen } from "lucide-react";

interface PaperGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  papers: AcademicPaper[];
  onSelectPaper: (paper: AcademicPaper) => void;
}

export function PaperGraphModal({ isOpen, onClose, papers, onSelectPaper }: PaperGraphModalProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const graphData = useMemo(() => {
    return buildCitationGraph(papers);
  }, [papers]);

  if (!isOpen) return null;

  const selectedPaper = papers.find((p) => p.id === selectedNodeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Citation & Author Network Graph</h2>
              <p className="text-xs text-muted-foreground">Interactive visual mapping of connected scholarly literature</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Graph Canvas Area */}
        <div className="relative flex-1 bg-background/50 p-6 overflow-hidden flex flex-col md:flex-row gap-6">
          {/* Visual Network Visualizer */}
          <div className="flex-1 rounded-2xl border border-border/70 bg-card/60 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>{graphData.nodes.length} Papers Mapped</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> OpenAlex</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> arXiv</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> PubMed</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Crossref</span>
              </div>
            </div>

            {/* Simulated Force Graph Constellation */}
            <div className="flex-1 flex flex-wrap items-center justify-center gap-4 p-4 overflow-y-auto">
              {graphData.nodes.map((node, i) => {
                const isSelected = selectedNodeId === node.id;
                const sizeClass = node.citationCount > 50 ? "scale-110" : "scale-100";
                const colorBorder =
                  node.group === 1
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : node.group === 2
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : node.group === 3
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-purple-500 bg-purple-500/10 text-purple-400";

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 max-w-[200px] text-center ${colorBorder} ${sizeClass} ${
                      isSelected ? "ring-4 ring-primary shadow-xl scale-115 z-10" : "hover:scale-105"
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mb-1" />
                    <span className="font-bold text-xs text-foreground line-clamp-2">{node.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 truncate">{node.authors} ({node.year})</span>
                    <span className="mt-1 rounded-full bg-card px-1.5 py-0.2 text-[9px] font-bold text-foreground border border-border">
                      {node.citationCount} cites
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Detail Side Inspector */}
          <div className="w-full md:w-80 rounded-2xl border border-border/70 bg-card p-5 flex flex-col justify-between">
            {selectedPaper ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {selectedPaper.source}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedPaper.year}</span>
                </div>

                <h3 className="font-bold text-sm text-foreground leading-snug">{selectedPaper.title}</h3>
                <p className="text-xs text-muted-foreground font-medium">{selectedPaper.authors.join(", ")}</p>
                <p className="text-xs text-muted-foreground/90 line-clamp-6 leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/50">
                  {selectedPaper.abstract}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>{selectedPaper.citationCount || 0} peer citations</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-xs text-muted-foreground p-4">
                <Network className="h-10 w-10 text-primary/30 mb-2" />
                <p className="font-medium text-foreground">Click any paper node</p>
                <p className="mt-1">Inspect citation links, shared authors, and abstract context.</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Close Graph View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
