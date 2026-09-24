"use client";

import React, { useState } from "react";
import { PosterConfig } from "@/lib/types";
import { Presentation, Download, Printer, X, Palette, Sparkles } from "lucide-react";

interface PosterBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic: string;
  savedPapersCount: number;
}

export function PosterBuilderModal({
  isOpen,
  onClose,
  initialTopic,
  savedPapersCount,
}: PosterBuilderModalProps) {
  const [theme, setTheme] = useState<PosterConfig["theme"]>("classic-navy");
  const [title, setTitle] = useState(initialTopic || "ADVANCES IN OPEN-SOURCE SCHOLARLY AI PLATFORMS");
  const [authors, setAuthors] = useState("Lead Author¹, Senior Researcher², Principal Investigator¹");
  const [affiliations, setAffiliations] = useState("¹Institute for Advanced Academic Computing; ²Center for Open Science");

  const [col1, setCol1] = useState(
    "### 1. Problem & Context\nTraditional literature reviews suffer from citation fragmentation and paywalls.\n\n### 2. Research Objectives\n- Unified multi-database queries (OpenAlex, arXiv, PubMed, Crossref).\n- Zero-cost cloud-based open-source model orchestration."
  );
  const [col2, setCol2] = useState(
    "### 3. Architecture & Methodology\n- **Backend Pipeline:** RAG with high-precision embeddings.\n- **Verification:** Hallucination checker auditing claims against ground-truth DOI repositories.\n- **Performance:** 3.8x faster literature review completion."
  );
  const [col3, setCol3] = useState(
    "### 4. Key Results\n- **Citation Accuracy:** 99.4%\n- **Latency Reduction:** 65%\n- **Empirical Consensus:** Robust across multi-domain datasets.\n\n### 5. Conclusions\nDemocratizes high-level scholarly research without expensive commercial subscriptions."
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getThemeClass = () => {
    switch (theme) {
      case "classic-navy":
        return "bg-slate-900 text-slate-100 border-blue-600";
      case "emerald-nature":
        return "bg-emerald-950 text-emerald-50 border-emerald-500";
      case "dark-slate":
        return "bg-zinc-950 text-zinc-100 border-zinc-700";
      case "crimson-oxford":
        return "bg-rose-950 text-rose-50 border-rose-600";
      case "sunset-gradient":
        return "bg-purple-950 text-purple-100 border-purple-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="flex w-full max-w-6xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Poster Forge — Academic Conference Poster Studio</h2>
              <p className="text-xs text-muted-foreground">3-Column Publication-Grade Academic Conference Poster Layout</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Printer className="h-3.5 w-3.5 text-primary" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Poster Editor & Theme Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-border px-6 py-3 bg-muted/10 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Theme Palette:</span>
            {[
              { id: "classic-navy", name: "Oxford Navy" },
              { id: "emerald-nature", name: "Nature Emerald" },
              { id: "dark-slate", name: "Dark Slate" },
              { id: "crimson-oxford", name: "Crimson Red" },
              { id: "sunset-gradient", name: "Royal Violet" },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as any)}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  theme === th.id
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {th.name}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-muted-foreground">
            {savedPapersCount} Workspace literature anchors synthesized
          </span>
        </div>

        {/* Live Interactive Poster Blueprint Canvas */}
        <div className="p-6 bg-muted/20 overflow-x-auto">
          <div className={`mx-auto w-full max-w-5xl rounded-2xl border-4 p-8 shadow-2xl transition-all ${getThemeClass()}`}>
            {/* Poster Header */}
            <div className="border-b-2 border-primary/40 pb-6 text-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-center text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white focus:outline-none border-b border-dashed border-transparent hover:border-white/40 focus:border-white"
              />
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                className="mt-2 w-full bg-transparent text-center text-xs sm:text-sm font-medium text-white/90 focus:outline-none"
              />
              <input
                type="text"
                value={affiliations}
                onChange={(e) => setAffiliations(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-center text-[11px] italic text-white/70 focus:outline-none"
              />
            </div>

            {/* 3-Column Conference Layout */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
              {/* Column 1 */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Column 1: Introduction & Gaps</span>
                <textarea
                  value={col1}
                  onChange={(e) => setCol1(e.target.value)}
                  rows={10}
                  className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Column 2 */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Column 2: Methodology & Proof</span>
                <textarea
                  value={col2}
                  onChange={(e) => setCol2(e.target.value)}
                  rows={10}
                  className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Column 3 */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Column 3: Findings & Impact</span>
                <textarea
                  value={col3}
                  onChange={(e) => setCol3(e.target.value)}
                  rows={10}
                  className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Poster Footer */}
            <div className="mt-6 border-t border-white/20 pt-4 flex flex-wrap items-center justify-between text-[10px] text-white/60">
              <span>Presented at International Academic Research Symposium</span>
              <span>Open Science DOI Verified • Powered by AcademicAI V1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
