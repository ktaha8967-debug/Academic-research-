"use client";

import React, { useState } from "react";
import { Users, CheckCircle, AlertTriangle, X, Download, Copy, Check } from "lucide-react";

interface PeerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export function PeerReviewModal({ isOpen, onClose, topic }: PeerReviewModalProps) {
  const [rebuttalGenerated, setRebuttalGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rebuttalText = `Dear Associate Editor and Reviewers,\n\nWe thank the reviewers for their constructive feedback on our manuscript entitled "${topic || "AI Academic Research Platform"}". Below is our point-by-point response:\n\n1. Response to Reviewer 1 (Theoretical Formulation):\n   - We have expanded Section 3 to clarify the mathematical proof and parameter convergence boundaries.\n\n2. Response to Reviewer 2 (Ablation Benchmark Comparison):\n   - We incorporated additional 2024 state-of-the-art baselines across OpenAlex and arXiv repositories, confirming a +18.4% gain in retrieval precision.\n\n3. Response to Reviewer 3 (Citation Consistency):\n   - All references have been standardized to IEEE/APA 7th guidelines with verified DOIs.\n\nSincerely,\nThe Authors`;

  const handleCopyRebuttal = () => {
    navigator.clipboard.writeText(rebuttalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">Mock Peer Review Panel & Rebuttal Studio</h2>
              <p className="text-xs text-muted-foreground">Simulated Editorial Board Decision (Reviewers 1, 2, 3)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Decision Banner */}
        <div className="flex flex-wrap items-center justify-between border-b border-border px-6 py-3 bg-emerald-500/10 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              EDITORIAL DECISION: MINOR REVISION (Accept Pending Revisions)
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
            Overall Viability: 86 / 100
          </span>
        </div>

        {/* Reviewer Breakdown Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Reviewer 1 */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">Reviewer 1</span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">8.5 / 10</span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">Focus: Methodology & Theory</p>
              <div className="space-y-2 text-xs text-foreground/90">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Strong theoretical motivation.</p>
                <p className="text-amber-600 dark:text-amber-400">⚠ Clarify parameter bounds in Section 3.</p>
              </div>
            </div>

            {/* Reviewer 2 */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">Reviewer 2</span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">7.8 / 10</span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">Focus: Empirical Validation & Baselines</p>
              <div className="space-y-2 text-xs text-foreground/90">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Rigorous multi-dataset evaluation.</p>
                <p className="text-amber-600 dark:text-amber-400">⚠ Include recent 2024 ablation baselines.</p>
              </div>
            </div>

            {/* Reviewer 3 */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">Reviewer 3</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">9.0 / 10</span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">Focus: Novelty & Citations</p>
              <div className="space-y-2 text-xs text-foreground/90">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">✓ High novelty in cloud agent chaining.</p>
                <p className="text-muted-foreground">Minor citation formatting alignment needed.</p>
              </div>
            </div>
          </div>

          {/* Point-by-Point Author Rebuttal Letter Generator */}
          <div className="mt-4 rounded-xl border border-border bg-muted/15 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Point-by-Point Author Response & Rebuttal Letter
              </h4>
              <button
                onClick={handleCopyRebuttal}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied Rebuttal" : "Copy Rebuttal Letter"}</span>
              </button>
            </div>

            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-card p-4 font-mono text-xs text-foreground/90 leading-relaxed">
              {rebuttalText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
