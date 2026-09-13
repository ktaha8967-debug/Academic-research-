"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GLOBAL_ACADEMIC_DISCIPLINES, AcademicDiscipline } from "@/lib/disciplines-data";
import { GLOBAL_LANDMARK_PAPERS } from "@/lib/landmark-corpus";
import { PaperCard } from "@/components/PaperCard";
import { createNewChat, saveAllChats, loadAllChats, setActiveChatId } from "@/lib/chat-store";
import { AcademicPaper } from "@/lib/types";
import {
  Globe,
  Search,
  BookOpen,
  Sparkles,
  Bot,
  ArrowRight,
  Database,
  Cpu,
  Stethoscope,
  Dna,
  FlaskConical,
  Cog,
  TrendingUp,
  Brain,
  Users,
  Calculator,
  BookMarked,
  ExternalLink,
  Award,
} from "lucide-react";

export default function DisciplinesTaxonomyPage() {
  const router = useRouter();
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>("cs_ai");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPapers, setSavedPapers] = useState<AcademicPaper[]>([]);

  const selectedDiscipline =
    GLOBAL_ACADEMIC_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    GLOBAL_ACADEMIC_DISCIPLINES[0];

  const handleLaunchSearch = (topic: string) => {
    // Jump to chat or search with this topic
    const newChat = createNewChat(
      "academic_chat",
      `Explore: ${topic}`
    );
    newChat.notes = [`Academic Discipline: ${selectedDiscipline.name}\nTopic of Interest: ${topic}`];

    const currentChats = loadAllChats();
    const updatedChats = [newChat, ...currentChats];
    saveAllChats(updatedChats);
    setActiveChatId(newChat.id);
    router.push("/");
  };

  const handleToggleSave = (paper: AcademicPaper) => {
    setSavedPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id);
      if (exists) return prev.filter((p) => p.id !== paper.id);
      return [paper, ...prev];
    });
  };

  const getDisciplineIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu": return Cpu;
      case "Stethoscope": return Stethoscope;
      case "Dna": return Dna;
      case "Sparkles": return Sparkles;
      case "FlaskConical": return FlaskConical;
      case "Cog": return Cog;
      case "TrendingUp": return TrendingUp;
      case "Brain": return Brain;
      case "Users": return Users;
      case "Calculator": return Calculator;
      case "BookMarked": return BookMarked;
      default: return Globe;
    }
  };

  const filteredDisciplines = GLOBAL_ACADEMIC_DISCIPLINES.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subfields.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            A
          </Link>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" />
              <span>Global Academic Disciplines & Scientific Taxonomy</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Explore billions of research papers across all 12 global scientific and humanistic domains
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>My Documents</span>
          </Link>
          <Link
            href="/datasets"
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <Database className="h-3.5 w-3.5 text-indigo-500" />
            <span>Datasets Hub</span>
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Research Chat</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Body: 2-Column Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: 12 Global Disciplines Directory */}
        <div className="w-full md:w-[360px] lg:w-[400px] flex flex-col border-r border-border bg-card/40 shrink-0 overflow-hidden">
          {/* Search Header */}
          <div className="p-3.5 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search disciplines, fields, or subfields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Disciplines List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredDisciplines.map((disc) => {
              const Icon = getDisciplineIcon(disc.icon);
              const isSelected = selectedDisciplineId === disc.id;

              return (
                <div
                  key={disc.id}
                  onClick={() => setSelectedDisciplineId(disc.id)}
                  className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xs text-foreground leading-snug">
                          {disc.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-mono font-semibold">
                          {disc.totalWorksEstimate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {disc.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {disc.subfields.slice(0, 3).map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-muted/80 text-muted-foreground px-1.5 py-0.5 rounded-md font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                    {disc.subfields.length > 3 && (
                      <span className="text-[9px] text-primary font-bold">
                        +{disc.subfields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Discipline Deep Dive & Landmark Corpus */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-background p-6 space-y-6">
          {/* Discipline Hero Banner */}
          <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary font-bold text-xs uppercase tracking-wider">
                  Global Discipline Index • {selectedDiscipline.totalWorksEstimate}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground mt-2 tracking-tight">
                  {selectedDiscipline.name}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  {selectedDiscipline.description}
                </p>
              </div>

              <button
                onClick={() => handleLaunchSearch(`Current breakthroughs in ${selectedDiscipline.name}`)}
                className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all self-start sm:self-center shrink-0"
              >
                <Bot className="h-4 w-4" />
                <span>AI Deep Synthesis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Primary Federated Databases Badges */}
            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-muted-foreground text-[11px] uppercase">Primary Repositories:</span>
              {selectedDiscipline.primaryDatabases.map((db, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground font-semibold text-[11px] border border-border"
                >
                  {db}
                </span>
              ))}
            </div>
          </div>

          {/* Subfields Taxonomy Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Specialized Subfields & Research Frontiers ({selectedDiscipline.subfields.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {selectedDiscipline.subfields.map((subfield, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLaunchSearch(subfield)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group shadow-2xs"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary leading-snug">
                    {subfield}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Global Landmark Scientific Papers in this Field */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>Landmark Scientific Papers & Nobel/Turing Breakthroughs</span>
              </h3>
              <Link
                href="/papers"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Search All 480M+ Papers</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOBAL_LANDMARK_PAPERS.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSaved={savedPapers.some((p) => p.id === paper.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
