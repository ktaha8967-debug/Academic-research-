"use client";

import React from "react";
import { BookOpen, Sparkles, Sliders, Moon, Sun, Search, Network, FolderGit2, Globe, Zap } from "lucide-react";
import { LanguageCode } from "@/lib/types";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openSettings: () => void;
  openPaperSearch: () => void;
  openProjects: () => void;
  openGraph: () => void;
  openUsage: () => void;
  savedPapersCount: number;
  currentProjectName: string;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
}

export function Header({
  darkMode,
  setDarkMode,
  openSettings,
  openPaperSearch,
  openProjects,
  openGraph,
  openUsage,
  savedPapersCount,
  currentProjectName,
  currentLang,
  onChangeLang,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Active Project */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-base sm:text-lg text-foreground">
                Academic<span className="text-primary">AI</span>
              </span>
              <button
                onClick={openProjects}
                className="hidden sm:inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground hover:bg-muted/80 border border-border"
                title="Switch Workspace Project"
              >
                <FolderGit2 className="h-3 w-3 text-primary" />
                <span className="truncate max-w-[130px]">{currentProjectName}</span>
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              480M+ Scholarly Works • Multi-Agent SaaS
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Projects Button (Mobile) */}
          <button
            onClick={openProjects}
            className="sm:hidden inline-flex items-center gap-1 rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
            title="Projects"
          >
            <FolderGit2 className="h-4 w-4" />
          </button>

          {/* Citation Graph Trigger */}
          <button
            onClick={openGraph}
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xs hover:bg-muted/80 transition-colors"
            title="View Citation Network Graph"
          >
            <Network className="h-3.5 w-3.5 text-primary" />
            <span>Citation Graph</span>
          </button>

          {/* Search Papers */}
          <button
            onClick={openPaperSearch}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-xs hover:bg-muted/80 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Search Papers</span>
            {savedPapersCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                {savedPapersCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value as LanguageCode)}
              className="appearance-none rounded-lg border border-border bg-card pl-6 pr-2 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer focus:outline-none"
            >
              <option value="en">English (EN)</option>
              <option value="ur">اردو (UR)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="zh">中文 (ZH)</option>
              <option value="ar">العربية (AR)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
            <Globe className="absolute left-2 pointer-events-none h-3 w-3 text-muted-foreground" />
          </div>

          {/* Usage / Quota trigger */}
          <button
            onClick={openUsage}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Usage Quota & SaaS Plan"
          >
            <Zap className="h-4 w-4 text-amber-500" />
          </button>

          {/* Settings */}
          <button
            onClick={openSettings}
            className="inline-flex items-center rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Cloud Open-Source Model Settings"
          >
            <Sliders className="h-4 w-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
