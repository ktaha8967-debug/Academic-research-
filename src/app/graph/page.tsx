"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AcademicPaper } from "@/lib/types";
import { buildCitationGraph } from "@/lib/academic-search";
import { Network, ArrowLeft, BookOpen, Award, Sparkles } from "lucide-react";

export default function GraphPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sample papers for rich demonstration
  const samplePapers: AcademicPaper[] = [
    {
      id: "p1",
      title: "Attention Is All You Need",
      authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
      year: 2017,
      venue: "NeurIPS",
      abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism.",
      citationCount: 124000,
      source: "arXiv",
    },
    {
      id: "p2",
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      authors: ["Lewis, P.", "Perez, E.", "Piktus, A."],
      year: 2020,
      venue: "NeurIPS",
      abstract: "Large pre-trained language models store factual knowledge in their parameters. We build RAG models where the parametric memory is combined with a non-parametric memory of Wikipedia articles.",
      citationCount: 4800,
      source: "arXiv",
    },
    {
      id: "p3",
      title: "OpenAlex: A fully-open index of scholarly works",
      authors: ["Priem, J.", "Piwowar, H.", "Orr, R."],
      year: 2022,
      venue: "arXiv Open Repository",
      abstract: "OpenAlex is a free and open dataset of 200M+ scholarly entities, offering a viable open-science alternative to proprietary citation indexes.",
      citationCount: 820,
      source: "OpenAlex",
    },
    {
      id: "p4",
      title: "Constitutional AI: Harmlessness from AI Feedback",
      authors: ["Bai, Y.", "Kadavath, S.", "Kundu, S."],
      year: 2022,
      venue: "Anthropic Research",
      abstract: "We explore methods for training a harmless AI assistant through self-improvement without human feedback labels for harms.",
      citationCount: 1650,
      source: "arXiv",
    },
    {
      id: "p5",
      title: "Crossref: The sustainable infrastructure for scholarly metadata",
      authors: ["Hendricks, G.", "Tkaczyk, D.", "Lin, J."],
      year: 2020,
      venue: "Quantitative Science Studies",
      abstract: "Crossref makes research objects easy to find, cite, link, assess, and reuse across global publishing ecosystems.",
      citationCount: 490,
      source: "Crossref",
    },
  ];

  const graphData = useMemo(() => buildCitationGraph(samplePapers), []);
  const selectedPaper = samplePapers.find((p) => p.id === selectedNodeId) || samplePapers[0];

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
            <Network className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">Citation & Author Network Graph</h1>
          </div>
        </div>
      </header>

      {/* Main Graph Grid */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row p-4 sm:p-6 gap-6">
        {/* Visual Graph Constellation */}
        <div className="flex-1 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span>{graphData.nodes.length} Scholarly Nodes Mapped</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> OpenAlex</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> arXiv</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Crossref</span>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-4 p-4 overflow-y-auto">
            {graphData.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id || (!selectedNodeId && node.id === "p1");
              const colorClass =
                node.group === 1
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : node.group === 2
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-purple-500 bg-purple-500/10 text-purple-400";

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 max-w-[220px] text-center flex flex-col items-center justify-center ${colorClass} ${
                    isSelected ? "ring-4 ring-primary shadow-2xl scale-110 z-10" : "hover:scale-105"
                  }`}
                >
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="font-bold text-xs text-foreground line-clamp-2">{node.title}</span>
                  <span className="text-[10px] text-muted-foreground mt-1 truncate">{node.authors} ({node.year})</span>
                  <span className="mt-2 rounded-full bg-card px-2 py-0.5 text-[10px] font-bold text-foreground border border-border">
                    {node.citationCount.toLocaleString()} citations
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Detail Panel */}
        <div className="w-full md:w-88 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {selectedPaper.source}
              </span>
              <span className="text-xs text-muted-foreground">{selectedPaper.year}</span>
            </div>

            <h3 className="font-extrabold text-base text-foreground leading-snug">{selectedPaper.title}</h3>
            <p className="text-xs font-medium text-muted-foreground">{selectedPaper.authors.join(", ")}</p>

            <div className="bg-muted/20 p-4 rounded-xl border border-border text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">Abstract:</p>
              <p className="line-clamp-6">{selectedPaper.abstract}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="h-4 w-4 text-amber-500" />
              <span>{selectedPaper.citationCount?.toLocaleString() || 0} Peer-Reviewed Citations</span>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground text-center hover:bg-primary/90 block"
          >
            Synthesize in Research Chat →
          </Link>
        </div>
      </main>
    </div>
  );
}
