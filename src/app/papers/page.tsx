"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PaperCard } from "@/components/PaperCard";
import { AcademicPaper } from "@/lib/types";
import {
  Search,
  Database,
  ArrowLeft,
  Loader2,
  Filter,
  CheckSquare,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function PapersExplorerPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AcademicPaper[]>([]);
  const [savedPapers, setSavedPapers] = useState<AcademicPaper[]>([]);
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
          limit: 30,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.papers)) {
        setResults(data.papers);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Paper search error:", err);
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

  const handleToggleSavePaper = (paper: AcademicPaper) => {
    setSavedPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id || p.title === paper.title);
      if (exists) {
        return prev.filter((p) => p.id !== paper.id && p.title !== paper.title);
      }
      return [paper, ...prev];
    });
  };

  const isPaperSaved = (paper: AcademicPaper) => {
    return savedPapers.some((p) => p.id === paper.id || p.title === paper.title);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ChatGPT Dashboard</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">
              480M+ Scholarly Multi-Database Explorer
            </h1>
          </div>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          Saved in Session: <strong className="text-foreground">{savedPapers.length}</strong> papers
        </span>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Search Toolbar */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across 480M+ papers by topic, keyword, author, or research question..."
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>Search</span>
            </button>
          </form>

          {/* Database Selector Badges */}
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
                        ? "bg-primary/15 text-primary border border-primary/30 font-bold"
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

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-sm font-bold text-foreground">Querying global academic repositories...</p>
              <p className="text-xs text-muted-foreground mt-1">Aggregating OpenAlex, arXiv, PubMed, Europe PMC, and Crossref.</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Found <strong>{results.length}</strong> scholarly papers matching your query</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSaved={isPaperSaved(paper)}
                    onToggleSave={handleToggleSavePaper}
                  />
                ))}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-bold text-foreground">No papers matched criteria</h3>
              <p className="text-xs text-muted-foreground mt-1">Try widening your keywords or checking different database filters.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 p-8">
              <Sparkles className="h-12 w-12 text-primary/30 mb-3" />
              <h3 className="font-extrabold text-lg text-foreground">Search 480M+ Scholarly Works</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Enter any scientific query above to retrieve peer-reviewed journal papers, preprints, and open-access PDFs with verified citation counts.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
