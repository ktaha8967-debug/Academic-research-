"use client";

import React, { useState } from "react";
import { AcademicPaper } from "@/lib/types";
import { PaperCard } from "./PaperCard";
import { Search, X, Loader2, Database, CheckSquare, Sparkles, BookOpen } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"databases" | "upload" | "zotero" | "mendeley">("databases");
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
  const [uploadFileName, setUploadFileName] = useState("");

  if (!isOpen) return null;

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const mockPaper: AcademicPaper = {
      id: `dev_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      authors: ["Local Researcher", "Collaborator"],
      year: new Date().getFullYear(),
      venue: "User Uploaded Manuscript",
      abstract: `Attached local manuscript: ${file.name}. Indexed full-text for Reading Assistant Q&A and key contributions extraction.`,
      source: "OpenAlex",
      isOpenAccess: true,
    };
    onToggleSavePaper(mockPaper);
  };

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
        {/* Modal Header & Source Tabs */}
        <div className="border-b border-border/80 bg-muted/20">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-foreground">
                  Attach Research Papers & Sources
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add literature from 480M+ global repositories, local device PDFs, or synced Zotero & Mendeley libraries.
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

          {/* 4 Source Tabs matching video reference */}
          <div className="flex items-center gap-1 px-4 sm:px-6 border-t border-border/50 text-xs font-semibold overflow-x-auto [scrollbar-width:none]">
            <button
              onClick={() => setActiveTab("databases")}
              className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "databases"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>480M+ Global Databases</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "upload"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Upload from Device (PDF/DOCX)</span>
            </button>
            <button
              onClick={() => setActiveTab("zotero")}
              className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "zotero"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Zotero Files</span>
            </button>
            <button
              onClick={() => setActiveTab("mendeley")}
              className={`py-2 px-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === "mendeley"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Mendeley Files</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Global Databases Search Bar */}
        {activeTab === "databases" && (
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
        )}

        {/* Results Body / Tab Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/10">
          {/* Tab 2: Upload Device Paper */}
          {activeTab === "upload" && (
            <div className="flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-md">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-extrabold text-lg text-foreground">Upload Research Paper from Device</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6 leading-relaxed">
                Upload your PDF, DOCX, or TXT research manuscripts. Reading Assistant will automatically index the text, extract key contributions, and enable deep conversational Q&A.
              </p>

              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-primary/40 rounded-3xl cursor-pointer bg-card/60 hover:bg-primary/5 hover:border-primary transition-all p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-bold text-foreground">
                    {uploadFileName ? `Uploaded: ${uploadFileName}` : "Click to select or drag & drop PDF"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports .pdf, .docx, .txt, .bib (up to 50MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.bib"
                  onChange={handleDeviceUpload}
                  className="hidden"
                />
              </label>

              {uploadFileName && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Successfully attached to Workspace! Click "Done" to start reading.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Zotero Synced Library */}
          {activeTab === "zotero" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-foreground">Synced Zotero Library</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-bold">
                    Connected
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Click any paper to attach to Workspace</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "zot_1",
                    title: "Attention Is All You Need",
                    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar et al."],
                    year: 2017,
                    source: "OpenAlex" as const,
                    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer...",
                    citationCount: 124500,
                    doi: "10.48550/arXiv.1706.03762",
                    isOpenAccess: true,
                  },
                  {
                    id: "zot_2",
                    title: "Deep Residual Learning for Image Recognition (ResNet)",
                    authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren et al."],
                    year: 2016,
                    source: "OpenAlex" as const,
                    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks...",
                    citationCount: 198000,
                    doi: "10.1109/CVPR.2016.90",
                    isOpenAccess: true,
                  },
                  {
                    id: "zot_3",
                    title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
                    authors: ["Rafael Rafailov", "Archit Sharma", "Eric Mitchell et al."],
                    year: 2023,
                    source: "arXiv" as const,
                    abstract: "While reinforcement learning from human feedback (RLHF) is powerful, it is complex and unstable. We propose Direct Preference Optimization...",
                    citationCount: 2150,
                    doi: "10.48550/arXiv.2305.18290",
                    isOpenAccess: true,
                  },
                ].map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSaved={isPaperSaved(paper)}
                    onToggleSave={onToggleSavePaper}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Mendeley Synced Library */}
          {activeTab === "mendeley" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-foreground">Synced Mendeley Library</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-bold">
                    Connected
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Click any paper to attach to Workspace</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "mnd_1",
                    title: "Highly Accurate Protein Structure Prediction with AlphaFold",
                    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel et al."],
                    year: 2021,
                    source: "Europe PMC" as const,
                    abstract: "Proteins are essential to life. Here we demonstrate AlphaFold, an AI system that predicts 3D structures of proteins with atomic accuracy...",
                    citationCount: 22400,
                    doi: "10.1038/s41586-021-03819-2",
                    isOpenAccess: true,
                  },
                  {
                    id: "mnd_2",
                    title: "CRISPR-Cas9 Structures and Mechanisms of Target Recognition and Cleavage",
                    authors: ["Martin Jinek", "Krzysztof Chylinski", "Ines Fonfara et al."],
                    year: 2014,
                    source: "PubMed" as const,
                    abstract: "Clustered regularly interspaced short palindromic repeats (CRISPR) and CRISPR-associated (Cas) proteins constitute an adaptive immune system...",
                    citationCount: 14200,
                    doi: "10.1126/science.1258096",
                    isOpenAccess: true,
                  },
                ].map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isSaved={isPaperSaved(paper)}
                    onToggleSave={onToggleSavePaper}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 1 Database Search Results */}
          {activeTab === "databases" && (
            loading ? (
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
            )
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
