"use client";

import React, { useState } from "react";
import { AcademicPaper } from "@/lib/types";
import { PaperCard } from "./PaperCard";
import { Search, X, Loader2, Database, Filter, CheckSquare, Sparkles, BookOpen } from "lucide-react";

interface PaperSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPapers: AcademicPaper[];
  onToggleSavePaper: (paper: AcademicPaper) => void;
}

export function PaperSearchModal({
  isOpen,
  onClose,
  savedPapers,
  onToggleSavePaper,
}: PaperSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AcademicPaper[]>([]);
  const [selectedDbs, setSelectedDbs] = useState<string[]>([
    "openalex",
    "arxiv",
    "pubmed",
    "europepmc",
    "crossref",
  ]);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [yearFrom, setYearFrom] = useState<number | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search-papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          databases: selectedDbs,
          openAccessOnly,
          yearFrom,
          limit: 24,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.papers)) {
        setResults(data.papers);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Multi-database search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDb = (db: string) => {
    if (selectedDbs.includes(db)) {
      if (selectedDbs.length > 1) {
        setSelectedDbs(selectedDbs.filter((d) => d !== db));
      }
    } else {
      setSelectedDbs([...selectedDbs, db]);
    }
  };

  const saveAllResults = () => {
    results.forEach((p) => {
      if (!savedPapers.some((sp) => sp.id === p.id || sp.title === p.title)) {
        onToggleSavePaper(p);
      }
    });
  };

  const isPaperSaved = (paper: AcademicPaper) => {
    return savedPapers.some((p) => p.id === paper.id || p.title === paper.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 sm:px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-foreground">
                Global Academic Multi-Database Search
              </h2>
              <p className="text-xs text-muted-foreground">
                Live querying OpenAlex (250M+), arXiv (2.4M+), PubMed (36M+), Europe PMC (40M+), and Crossref (150M+)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar & Comprehensive Filters */}
        <div className="border-b border-border/80 p-4 sm:p-6 bg-card space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across 480M+ papers by topic, research question, author, or methodology..."
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>Search Databases</span>
            </button>
          </form>

          {/* Database Selector Badges & Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground font-semibold">Databases:</span>
              {[
                { id: "openalex", label: "OpenAlex (250M+)" },
                { id: "semanticscholar", label: "Semantic Scholar (210M+)" },
                { id: "arxiv", label: "arXiv (Preprints & PDFs)" },
                { id: "pubmed", label: "PubMed (Biomedical)" },
                { id: "europepmc", label: "Europe PMC (40M+)" },
                { id: "crossref", label: "Crossref (150M+ DOIs)" },
              ].map((db) => {
                const active = selectedDbs.includes(db.id);
                return (
                  <button
                    key={db.id}
                    type="button"
                    onClick={() => toggleDb(db.id)}
                    className={`rounded-full px-3 py-1 font-medium transition-all ${
                      active
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground border border-transparent hover:border-border"
                    }`}
                  >
                    {db.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={openAccessOnly}
                  onChange={(e) => setOpenAccessOnly(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span>Open Access Only</span>
              </label>

              <select
                onChange={(e) => setYearFrom(e.target.value ? parseInt(e.target.value) : undefined)}
                className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              >
                <option value="">All Years</option>
                <option value="2024">2024 – Present</option>
                <option value="2022">2022 – Present</option>
                <option value="2020">2020 – Present</option>
                <option value="2015">2015 – Present</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-9 w-9 animate-spin text-primary mb-3" />
              <p className="text-sm font-semibold text-foreground">
                Querying international academic repositories...
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Aggregating scholarly metadata across OpenAlex, arXiv, PubMed, Europe PMC, and Crossref.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                <span>
                  Retrieved <strong>{results.length}</strong> peer-reviewed scholarly works
                </span>
                <button
                  onClick={saveAllResults}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Bookmark All to Workspace</span>
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSaved={isPaperSaved(paper)}
                    onToggleSave={onToggleSavePaper}
                  />
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-foreground">No papers matched criteria</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Try widening your query keywords or adjusting database filters above.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Sparkles className="h-10 w-10 text-primary/40 mb-3" />
              <h3 className="font-bold text-base text-foreground">
                Search Global Academic Literature
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-lg">
                Connect your research workspace to over 480M+ scholarly works with full abstracts, citation counts, open access PDFs, and DOI records.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl">
                {[
                  "Reinforcement learning from human feedback",
                  "Quantum neural networks drug discovery",
                  "Retrieval augmented generation hallucination reduction",
                  "CRISPR gene editing off-target prediction",
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setQuery(sample);
                    }}
                    className="rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border/80 px-6 py-3.5 bg-muted/30 text-xs">
          <span className="text-muted-foreground">
            Current Workspace: <strong className="text-foreground">{savedPapers.length}</strong> papers attached
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
