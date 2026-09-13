"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, ArrowLeft, CheckCircle2, Copy, Check, Sparkles } from "lucide-react";

export default function PeerReviewPage() {
  const [copied, setCopied] = useState(false);

  const rebuttalLetter = `Dear Associate Editor and Reviewers,\n\nThank you for the constructive feedback on our submission entitled "Autonomous AI Research Orchestrator". We provide our point-by-point response below:\n\n1. Reviewer 1 (Theoretical Formulation):\n   - We expanded Section 3 to prove convergence bounds under noisy retrieval distributions.\n\n2. Reviewer 2 (Ablation Benchmark Comparison):\n   - We integrated comparative evaluations across 2024 state-of-the-art baselines in OpenAlex and arXiv, demonstrating +18.4% gain in retrieval precision.\n\n3. Reviewer 3 (Citation DOI Verification):\n   - All references have been cross-checked with official Crossref and PubMed registries.\n\nSincerely,\nThe Authors`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rebuttalLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Users className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">
              Mock Peer Review Panel & Rebuttal Studio
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Decision Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-emerald-800 dark:text-emerald-200">
                ASSOCIATE EDITOR DECISION: MINOR REVISION (Accept Pending Revisions)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Simulated journal decision based on Reviewer 1, 2, 3 reports
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            Viability Score: 88 / 100
          </span>
        </div>

        {/* 3 Reviewer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-foreground">Reviewer 1</span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500">8.5 / 10</span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mb-3">Focus: Theory & Mathematical Proof</p>
            <div className="space-y-2 text-xs">
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Strong theoretical motivation.</p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">⚠ Clarify parameter bounds in Section 3.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-foreground">Reviewer 2</span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500">7.9 / 10</span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mb-3">Focus: Empirical Baselines</p>
            <div className="space-y-2 text-xs">
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Multi-database empirical validation.</p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">⚠ Include recent 2024 ablation baselines.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-foreground">Reviewer 3</span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">9.2 / 10</span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground mb-3">Focus: Novelty & Citation Rigor</p>
            <div className="space-y-2 text-xs">
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ High novelty in multi-agent workflows.</p>
              <p className="text-muted-foreground">Standardize APA 7th / IEEE bibliography.</p>
            </div>
          </div>
        </div>

        {/* Rebuttal Letter Studio */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground">Point-by-Point Author Rebuttal Letter</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Rebuttal" : "Copy Rebuttal Letter"}</span>
            </button>
          </div>

          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-5 font-mono text-xs text-foreground/90 leading-relaxed">
            {rebuttalLetter}
          </pre>
        </div>
      </main>
    </div>
  );
}
