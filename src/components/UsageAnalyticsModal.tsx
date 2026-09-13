"use client";

import React from "react";
import { UserUsageStats } from "@/lib/types";
import { Zap, Shield, Check, Database, Sparkles, X, ArrowUpRight } from "lucide-react";

interface UsageAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserUsageStats;
}

export function UsageAnalyticsModal({ isOpen, onClose, stats }: UsageAnalyticsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">SaaS Usage & Academic Quotas</h2>
              <p className="text-xs text-muted-foreground">Account Plan: {stats.plan} (100% Free Cloud Access)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Usage Counters Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-2xl font-bold text-primary">{stats.searchesPerformed}</span>
              <p className="text-xs text-muted-foreground mt-1">Multi-DB Queries</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-2xl font-bold text-emerald-500">{stats.agentRuns}</span>
              <p className="text-xs text-muted-foreground mt-1">Agent Pipelines Run</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <span className="text-2xl font-bold text-amber-500">{stats.savedPapersCount}</span>
              <p className="text-xs text-muted-foreground mt-1">Papers in Workspaces</p>
            </div>
          </div>

          {/* Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Tier */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">Community Cloud</span>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">Active Plan</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Unlimited access to open-source models & public scholarly APIs</p>
                <ul className="space-y-1.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> OpenAlex, arXiv, PubMed, Crossref</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> 13 Multi-Stage AI Research Agents</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> BibTeX & Conference Poster Export</li>
                </ul>
              </div>
            </div>

            {/* Institutional Tier */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">Institutional Campus</span>
                  <span className="text-xs font-semibold text-muted-foreground">University SSO</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Dedicated university cluster & team collaboration</p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-muted-foreground" /> Shared lab workspaces & peer reviews</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-muted-foreground" /> Custom institutional vector embeddings</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-muted-foreground" /> Unlimited concurrent agent executions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-6 py-3 bg-muted/20">
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
