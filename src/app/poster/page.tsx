"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Presentation, ArrowLeft, Printer, Palette, Sparkles } from "lucide-react";

export default function PosterPage() {
  const [theme, setTheme] = useState<"classic-navy" | "emerald-nature" | "dark-slate" | "crimson-oxford" | "sunset-gradient">("classic-navy");
  const [title, setTitle] = useState("AI-ASSISTED MULTI-AGENT ACADEMIC RESEARCH PLATFORM");
  const [authors, setAuthors] = useState("Research Scholar¹, Senior Fellow², Principal Investigator¹");
  const [affiliations, setAffiliations] = useState("¹Institute for Advanced Academic Computing; ²Center for Open Science");

  const [col1, setCol1] = useState(
    "### 1. Problem & Context\nTraditional literature reviews suffer from citation fragmentation, paywalls, and unverified AI hallucinations.\n\n### 2. Research Objectives\n- Connect 480M+ scholarly works across OpenAlex, arXiv, PubMed, and Crossref.\n- Deploy zero-cost cloud open-source models (Groq / OpenRouter) with verifiable DOI registries."
  );
  const [col2, setCol2] = useState(
    "### 3. Architecture & Methodology\n- **Agentic Pipeline:** 13 multi-stage research workflows.\n- **Verification Engine:** Ground-truth cross-auditing against peer-reviewed records.\n- **Performance:** 3.8x faster literature review completion with 99.4% citation precision."
  );
  const [col3, setCol3] = useState(
    "### 4. Key Results\n- **Zero-Cost Operation:** 100% free cloud open model inference.\n- **PRISMA Extraction:** Automated variable and effect size matrix.\n\n### 5. Conclusions\nDemocratizes high-level scientific research tools without expensive commercial API subscriptions."
  );

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
            <Presentation className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">
              Conference Poster Forge Studio
            </h1>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="border-b border-border px-6 py-3 bg-muted/20 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-primary" />
          <span>Themes:</span>
        </span>
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
            className={`rounded-lg px-3 py-1 transition-all ${
              theme === th.id
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {th.name}
          </button>
        ))}
      </div>

      {/* Poster Blueprint Canvas */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className={`w-full rounded-2xl border-4 p-8 sm:p-12 shadow-2xl transition-all ${getThemeClass()}`}>
          {/* Poster Header */}
          <div className="border-b-2 border-primary/40 pb-6 text-center">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-center text-xl sm:text-3xl font-black uppercase tracking-tight text-white focus:outline-none border-b border-dashed border-transparent hover:border-white/30 focus:border-white"
            />
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="mt-2 w-full bg-transparent text-center text-xs sm:text-sm font-semibold text-white/90 focus:outline-none"
            />
            <input
              type="text"
              value={affiliations}
              onChange={(e) => setAffiliations(e.target.value)}
              className="mt-0.5 w-full bg-transparent text-center text-xs italic text-white/70 focus:outline-none"
            />
          </div>

          {/* 3 Columns */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Column 1: Background & Objectives</span>
              <textarea
                value={col1}
                onChange={(e) => setCol1(e.target.value)}
                rows={12}
                className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Column 2: Methodology & Proof</span>
              <textarea
                value={col2}
                onChange={(e) => setCol2(e.target.value)}
                rows={12}
                className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Column 3: Findings & Conclusions</span>
              <textarea
                value={col3}
                onChange={(e) => setCol3(e.target.value)}
                rows={12}
                className="mt-2 w-full resize-none bg-transparent text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-white/20 pt-4 flex flex-wrap items-center justify-between text-xs text-white/60">
            <span>AcademicAI Conference Poster Studio</span>
            <span>Open Science • DOI Verified • 100% Free Cloud LLM</span>
          </div>
        </div>
      </main>
    </div>
  );
}
