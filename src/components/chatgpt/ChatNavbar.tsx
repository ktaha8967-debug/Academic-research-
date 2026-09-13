"use client";

import React, { useState } from "react";
import { AgentType } from "@/lib/types";
import {
  Menu,
  ChevronDown,
  Sparkles,
  Moon,
  Sun,
  Search,
  Check,
  Zap,
  BookOpen,
  BrainCircuit,
  Code,
  FileCode,
  Globe,
  Sliders,
} from "lucide-react";

interface ChatNavbarProps {
  activeAgent: AgentType;
  onSelectAgent: (id: AgentType) => void;
  onToggleSidebar: () => void;
  onOpenSearchPapers: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  attachedPapersCount: number;
}

const UNIFIED_MODES = [
  {
    id: "academic_chat",
    name: "Auto (All-in-One Brain)",
    tag: "Recommended",
    desc: "Universal AI: Handles casual chat, coding, paper discovery, and all 75+ scientific disciplines automatically.",
    icon: Sparkles,
  },
  {
    id: "find_papers",
    name: "Deep 480M+ Paper Discovery",
    tag: "Research",
    desc: "Federated parallel queries across OpenAlex, arXiv, PubMed, Europe PMC, and Crossref with direct PDFs.",
    icon: Search,
  },
  {
    id: "literature_overview",
    name: "Systematic Literature Review",
    tag: "Synthesis",
    desc: "Generates thematic literature matrices, consensus vs debate, and verified BibTeX citations.",
    icon: BookOpen,
  },
  {
    id: "latex_compiler",
    name: "LaTeX & Overleaf Typesetter",
    tag: "Publishing",
    desc: "Direct publication-grade .tex generation, AMS math equations, tables, and subfigures.",
    icon: FileCode,
  },
  {
    id: "mock_peer_review",
    name: "Peer Review & Rebuttal Simulator",
    tag: "Editorial",
    desc: "Simulates Reviewers 1, 2, 3 and Associate Editor decision with actionable revision instructions.",
    icon: BrainCircuit,
  },
];

export function ChatNavbar({
  activeAgent,
  onSelectAgent,
  onToggleSidebar,
  onOpenSearchPapers,
  darkMode,
  setDarkMode,
  attachedPapersCount,
}: ChatNavbarProps) {
  const [showModelMenu, setShowModelMenu] = useState(false);

  const currentMode = UNIFIED_MODES.find((m) => m.id === activeAgent) || UNIFIED_MODES[0];
  const CurrentIcon = currentMode.icon;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Gemini / ChatGPT / Kimi Style Unified Model & Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent font-extrabold">
                AcademicAI 2.0
              </span>
              <span className="hidden md:inline text-xs font-semibold text-foreground">
                ({currentMode.name.split(" ")[0]})
              </span>
            </span>
            <span className="hidden sm:inline text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
              Omni Brain &bull; Free Cloud
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {showModelMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Unified All-in-One Engine</h4>
                  <p className="text-[11px] text-muted-foreground">Powered by OpenRouter Cloud / Llama 3.3 70B</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">
                  100% Free
                </span>
              </div>

              <div className="space-y-1.5">
                {UNIFIED_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = activeAgent === mode.id || (mode.id === "academic_chat" && !UNIFIED_MODES.some(m => m.id === activeAgent));

                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onSelectAgent(mode.id as AgentType);
                        setShowModelMenu(false);
                      }}
                      className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{mode.name}</span>
                          <span className="text-[9px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground font-semibold">
                            {mode.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{mode.desc}</p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 pt-2 border-t border-border/50 text-[10px] text-muted-foreground text-center">
                ✨ Automatically switches skills and queries 480M+ papers based on your prompt.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearchPapers}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">480M+ Papers</span>
          {attachedPapersCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
              {attachedPapersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
