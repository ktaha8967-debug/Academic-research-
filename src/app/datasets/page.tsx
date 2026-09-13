"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACADEMIC_DATASETS_DATABASE } from "@/lib/datasets-data";
import { AcademicDataset } from "@/lib/types";
import { createNewChat, saveAllChats, loadAllChats, setActiveChatId } from "@/lib/chat-store";
import {
  Database,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  Download,
  Bot,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu,
  Dna,
  Globe,
  DollarSign,
  Users,
  Copy,
  Check,
} from "lucide-react";

export default function DatasetsHubPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedModality, setSelectedModality] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const domains = [
    { id: "all", label: "All Domains", icon: Database },
    { id: "Computer Science & AI", label: "AI & Computer Science", icon: Cpu },
    { id: "Biomedical & Healthcare", label: "Biomedical & Genomics", icon: Dna },
    { id: "Physics & Materials", label: "Physics & Materials", icon: Globe },
    { id: "Economics & Finance", label: "Economics & Finance", icon: DollarSign },
    { id: "Social Sciences", label: "Social Sciences & Ethics", icon: Users },
  ];

  const modalities = [
    "all",
    "Text / NLP",
    "Vision / Images",
    "Tabular / Structured",
    "Genomic / Sequences",
    "Graph / Networks",
    "Multimodal",
  ];

  const filteredDatasets = ACADEMIC_DATASETS_DATABASE.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain =
      selectedDomain === "all" || ds.domain === selectedDomain;

    const matchesModality =
      selectedModality === "all" || ds.modality === selectedModality;

    return matchesSearch && matchesDomain && matchesModality;
  });

  const handleAttachDatasetToChat = (dataset: AcademicDataset) => {
    const newChat = createNewChat(
      "analysis_foundry",
      `Dataset: ${dataset.name}`
    );
    newChat.notes = [
      `Selected Benchmark Dataset: ${dataset.name} (${dataset.domain})\nTask: ${dataset.task}\nModality: ${dataset.modality}\nSample Size: ${dataset.instancesCount}\nEvaluation Metrics: ${dataset.standardMetrics.join(", ")}\nDescription: ${dataset.description}`,
    ];

    const currentChats = loadAllChats();
    const updatedChats = [newChat, ...currentChats];
    saveAllChats(updatedChats);
    setActiveChatId(newChat.id);
    router.push("/");
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
              <Database className="h-4 w-4 text-primary" />
              <span>Academic Datasets & Benchmark Directory</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Explore 10,000+ benchmark corpora, tasks, leaderboards, and evaluation metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>My Documents</span>
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

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Search & Filter Header Banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm space-y-4">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Standardized Datasets & Evaluation Benchmarks
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Find gold-standard datasets for machine learning, clinical trials, economics, genomics, and social sciences with ground-truth leaderboards.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets by name, task (e.g., ImageNet, MMLU, MIMIC-IV), or metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
            />
          </div>

          {/* Domain Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {domains.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDomain === d.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modality Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            <span className="text-[11px] font-bold text-muted-foreground uppercase shrink-0">Modality:</span>
            {modalities.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModality(m)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-colors ${
                  selectedModality === m
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "all" ? "All Modalities" : m}
              </button>
            ))}
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all group"
            >
              <div className="space-y-3">
                {/* Card Top Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] uppercase">
                      {ds.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold text-[10px]">
                      {ds.modality}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">
                    {ds.size}
                  </span>
                </div>

                {/* Dataset Title & Task */}
                <div>
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {ds.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary/90 mt-0.5">
                    <strong>Primary Task:</strong> {ds.task}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ds.description}
                </p>

                {/* Metrics & Instances */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/50 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Instances / Size</span>
                    <span className="font-semibold text-foreground">{ds.instancesCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Key Metrics</span>
                    <span className="font-semibold text-foreground">{ds.standardMetrics.join(", ")}</span>
                  </div>
                </div>

                {/* Benchmark Leaderboard Snapshot */}
                {ds.benchmarkLeaders && ds.benchmarkLeaders.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Award className="h-3 w-3 text-amber-500" />
                      <span>Benchmark State-of-the-Art:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ds.benchmarkLeaders.map((lead, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-medium text-foreground"
                        >
                          <span className="font-bold text-primary">{lead.model}:</span>
                          <span>{lead.score}</span>
                          <span className="text-muted-foreground">({lead.year})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {ds.paperUrl && (
                    <a
                      href={ds.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 underline underline-offset-2"
                    >
                      <span>Paper</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                  {ds.downloadUrl && (
                    <a
                      href={ds.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 underline underline-offset-2"
                    >
                      <span>Repository</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleAttachDatasetToChat(ds)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/25 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Analyze in Chat</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
