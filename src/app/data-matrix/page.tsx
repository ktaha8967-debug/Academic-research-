"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, ArrowLeft, Download, Plus, Trash2 } from "lucide-react";

interface ExtractionRow {
  id: string;
  study: string;
  sampleSize: string;
  methodology: string;
  iv: string;
  dv: string;
  outcome: string;
  limitations: string;
}

export default function DataMatrixPage() {
  const [rows, setRows] = useState<ExtractionRow[]>([
    {
      id: "1",
      study: "Vaswani et al. (2017)",
      sampleSize: "N = 36M tokens",
      methodology: "Deep Transformer Architecture",
      iv: "Multi-Head Self-Attention",
      dv: "BLEU Score & Training FLOPs",
      outcome: "+2.1 BLEU improvement on WMT 2014",
      limitations: "Quadratic memory scaling with sequence length",
    },
    {
      id: "2",
      study: "Lewis et al. (2020)",
      sampleSize: "N = 21M Wikipedia passages",
      methodology: "Parametric + Non-Parametric RAG",
      iv: "Dense Passage Retrieval",
      dv: "Factuality & Open QA Exact Match",
      outcome: "+4.4% Exact Match on Natural Questions",
      limitations: "Retrieval latency bottleneck under high concurrency",
    },
    {
      id: "3",
      study: "Priem et al. (2022)",
      sampleSize: "N = 209M works cataloged",
      methodology: "Open Graph Inverted Indexing",
      iv: "Open Access Data Pipeline",
      dv: "Citation Accuracy & Coverage",
      outcome: "98.7% Cross-validation with Scopus/WoS",
      limitations: "Author disambiguation for common Asian surnames",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Math.random().toString(36).substring(7),
        study: "New Empirical Study (2024)",
        sampleSize: "N = 250",
        methodology: "Double-Blind Evaluation",
        iv: "Independent Variable",
        dv: "Dependent Variable",
        outcome: "Primary Finding",
        limitations: "Sample limitation",
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const exportCSV = () => {
    const headers = ["Study", "Sample Size", "Methodology", "Independent Variable", "Dependent Variable", "Primary Outcome", "Limitations"];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => `"${r.study}","${r.sampleSize}","${r.methodology}","${r.iv}","${r.dv}","${r.outcome}","${r.limitations}"`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PRISMA_Data_Matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h1 className="font-extrabold text-sm sm:text-base text-foreground">
              PRISMA Systematic Review Data Extraction Matrix
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>Add Study</span>
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Main Table */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-xs">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                <th className="p-3.5">Study (Author/Year)</th>
                <th className="p-3.5">Sample ($N$)</th>
                <th className="p-3.5">Methodology</th>
                <th className="p-3.5">Independent Variable</th>
                <th className="p-3.5">Dependent Variable</th>
                <th className="p-3.5">Primary Outcome / Effect</th>
                <th className="p-3.5">Limitations</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-bold text-foreground">{row.study}</td>
                  <td className="p-3.5 text-muted-foreground">{row.sampleSize}</td>
                  <td className="p-3.5 text-foreground">{row.methodology}</td>
                  <td className="p-3.5 text-muted-foreground">{row.iv}</td>
                  <td className="p-3.5 text-muted-foreground">{row.dv}</td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{row.outcome}</td>
                  <td className="p-3.5 text-muted-foreground italic">{row.limitations}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleRemove(row.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
