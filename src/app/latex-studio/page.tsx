"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileText,
  FileCode,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";

interface LaTeXTemplate {
  id: string;
  name: string;
  venue: string;
  category: string;
  snippet: string;
}

const IEEE_SNIPPET = [
  "\\documentclass[conference]{IEEEtran}",
  "\\IEEEoverridecommandlockouts",
  "\\usepackage{cite}",
  "\\usepackage{amsmath,amssymb,amsfonts}",
  "\\usepackage{algorithmic}",
  "\\usepackage{graphicx}",
  "\\usepackage{textcomp}",
  "\\usepackage{xcolor}",
  "",
  "\\begin{document}",
  "",
  "\\title{Scalable Multi-Agent Foundation Models for Autonomous Scientific Discovery}",
  "",
  "\\author{\\IEEEauthorblockN{1\\textsuperscript{st} Lead Researcher}",
  "\\IEEEauthorblockA{\\textit{Institute of Advanced Scholarly Intelligence} \\\\",
  "Cambridge, MA, USA \\\\",
  "lead.researcher@academic-ai.org}",
  "\\and",
  "\\IEEEauthorblockN{2\\textsuperscript{nd} Senior Investigator}",
  "\\IEEEauthorblockA{\\textit{Department of Computational Science} \\\\",
  "Oxford, UK \\\\",
  "senior.pi@academic-ai.org}",
  "}",
  "",
  "\\maketitle",
  "",
  "\\begin{abstract}",
  "Recent advancements in open-source cloud foundation models have unlocked unprecedented capabilities in autonomous academic synthesis. In this paper, we formulate a decentralized multi-agent architecture capable of federated literature retrieval across 480M+ scholarly documents. Empirical benchmarks demonstrate a 3.8x acceleration in systematic literature extraction and a 99.4% citation authenticity rate under adversarial hallucination stress tests.",
  "\\end{abstract}",
  "",
  "\\begin{IEEEkeywords}",
  "Artificial Intelligence, Multi-Agent Systems, Scientific Discovery, Literature Synthesis, Open Science.",
  "\\end{IEEEkeywords}",
  "",
  "\\section{Introduction}",
  "Systematic literature reviews and experimental design have historically suffered from citation hallucination and fragmented bibliographic indices \\cite{vaswani2017attention}.",
  "",
  "Let $M = \\{m_1, m_2, \\dots, m_K\\}$ denote the federated agent collective operating over the scholarly manifold $\\mathcal{S}$. The objective function is formulated as:",
  "\\begin{equation}",
  "\\max_{\\theta} \\mathbb{E}_{q \\sim \\mathcal{D}} \\left[ \\sum_{i=1}^{K} \\log p_\\theta(a_i \\mid q, \\mathcal{C}_i) - \\lambda \\mathcal{H}(\\pi_\\theta) \\right]",
  "\\end{equation}",
  "where $\\mathcal{C}_i$ represents retrieved peer-reviewed DOI anchors.",
  "",
  "\\section{Empirical Evaluation}",
  "We evaluate our framework against five standardized benchmarks. Table~\\ref{tab:results} summarizes comparative performance.",
  "",
  "\\begin{table}[htbp]",
  "\\caption{Comparative Performance Across Multi-Agent Benchmarks}",
  "\\begin{center}",
  "\\begin{tabular}{|l|c|c|c|}",
  "\\hline",
  "\\textbf{Model Architecture} & \\textbf{Precision (\\%)} & \\textbf{Recall (\\%)} & \\textbf{Latency (s)} \\\\",
  "\\hline",
  "Baseline Monolithic LLM & 74.2 & 68.9 & 4.82 \\\\",
  "Standard RAG Pipeline & 83.6 & 79.4 & 2.15 \\\\",
  "\\textbf{AcademicAI Autonomous Brain} & \\textbf{99.4} & \\textbf{96.1} & \\textbf{0.78} \\\\",
  "\\hline",
  "\\end{tabular}",
  "\\label{tab:results}",
  "\\end{center}",
  "\\end{table}",
  "",
  "\\section{Conclusion}",
  "This paper demonstrates that zero-cost cloud serverless inference delivers publication-grade synthesis adhering to IEEE and ACM rigorous standards.",
  "",
  "\\begin{thebibliography}{00}",
  "\\bibitem{vaswani2017attention} A. Vaswani et al., ``Attention Is All You Need,'' in \\textit{Advances in Neural Information Processing Systems (NeurIPS)}, 2017, pp. 5998--6008.",
  "\\end{thebibliography}",
  "",
  "\\end{document}",
].join("\n");

const NEURIPS_SNIPPET = [
  "\\documentclass{article}",
  "\\usepackage[preprint]{neurips_2024}",
  "\\usepackage[utf8]{inputenc}",
  "\\usepackage[T1]{fontenc}",
  "\\usepackage{hyperref}",
  "\\usepackage{url}",
  "\\usepackage{booktabs}",
  "\\usepackage{amsfonts}",
  "\\usepackage{nicefrac}",
  "\\usepackage{microtype}",
  "\\usepackage{xcolor}",
  "\\usepackage{amsmath}",
  "",
  "\\title{Direct Preference Optimization on Scholarly Graphs}",
  "",
  "\\author{",
  "  Principal Investigator\\\\",
  "  Department of Computer Science\\\\",
  "  University of AI Research\\\\",
  "  \\texttt{pi@academic-ai.org}",
  "}",
  "",
  "\\begin{document}",
  "",
  "\\maketitle",
  "",
  "\\begin{abstract}",
  "Aligning large language models with rigorous academic peer-review rubrics requires verifiable reward modeling. We present a closed-form DPO objective optimized for scholarly citation integrity.",
  "\\end{abstract}",
  "",
  "\\section{Theoretical Formulation}",
  "The standard Direct Preference Optimization objective without reward parameterization is:",
  "\\begin{equation}",
  "\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right) \\right]",
  "\\end{equation}",
  "",
  "\\section{Broader Impact}",
  "This framework democratizes access to elite research intelligence across developing institutions worldwide.",
  "",
  "\\end{document}",
].join("\n");

const NATURE_SNIPPET = [
  "\\documentclass[journal=natcom,manuscript=article]{achemso}",
  "\\usepackage{amsmath,amssymb}",
  "\\usepackage{graphicx}",
  "",
  "\\title{High-Throughput Deep Learning for Structural De Novo Biocatalyst Engineering}",
  "",
  "\\author{Academic AI Research Consortium}",
  "\\affiliation{International Center for Biomedical & Quantum Intelligence}",
  "\\email{consortium@academic-ai.org}",
  "",
  "\\begin{document}",
  "",
  "\\begin{abstract}",
  "Here we show that integrated single-cell transcriptomics and molecular docking architectures predict enzyme stereoselectivity with sub-Angstrom precision.",
  "\\end{abstract}",
  "",
  "\\section*{Main}",
  "The challenge of catalytic transition-state stabilization has historically constrained de novo protein design \\cite{jumper2021highly}.",
  "",
  "\\end{document}",
].join("\n");

const TEMPLATES: LaTeXTemplate[] = [
  {
    id: "ieee",
    name: "IEEE Transactions & Conference",
    venue: "IEEE / Computer Society",
    category: "Engineering & Computer Science",
    snippet: IEEE_SNIPPET,
  },
  {
    id: "neurips",
    name: "NeurIPS / ICML Machine Learning",
    venue: "NeurIPS / ICML / ICLR",
    category: "Artificial Intelligence",
    snippet: NEURIPS_SNIPPET,
  },
  {
    id: "nature",
    name: "Nature & Springer Communications",
    venue: "Nature Portfolio / Springer",
    category: "Multidisciplinary Science",
    snippet: NATURE_SNIPPET,
  },
];

export default function LaTeXStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<LaTeXTemplate>(TEMPLATES[0]);
  const [latexCode, setLatexCode] = useState(TEMPLATES[0].snippet);
  const [copied, setCopied] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

  const handleSelectTemplate = (tpl: LaTeXTemplate) => {
    setSelectedTemplate(tpl);
    setLatexCode(tpl.snippet);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([latexCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.id}_manuscript.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAiGenerate = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "latex_compiler",
          userPrompt: `Generate a publication-grade LaTeX (.tex) manuscript for the following paper topic and venue template (${selectedTemplate.name}):\n"${topicInput}"\nInclude abstract, mathematical equations, results table, and clean BibTeX bibliography.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.content || "";
        const match = content.match(/```(?:latex|tex)?([\s\S]*?)```/);
        if (match && match[1]) {
          setLatexCode(match[1].trim());
        } else if (content.includes("\\documentclass")) {
          setLatexCode(content.trim());
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm text-foreground hover:text-primary transition-colors">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Academic<span className="text-primary">AI</span></span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-indigo-500" />
            <span className="font-extrabold text-sm">LaTeX &amp; Overleaf Manuscript Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-muted rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "split" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "editor" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Code Only
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "preview" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Compiled Readout
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied .tex" : "Copy .tex"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export .tex</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Toolbar / Template Selector */}
        <aside className="w-full lg:w-72 border-r border-border bg-card/40 p-4 space-y-4 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              1. Select Publication Template
            </h3>
            <div className="space-y-1.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedTemplate.id === tpl.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/70 hover:bg-muted text-foreground"
                  }`}
                >
                  <p className="font-semibold">{tpl.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{tpl.venue}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
              2. AI Manuscript Drafter
            </h3>
            <div className="space-y-2">
              <textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter paper title, methodology details, or equations to generate complete LaTeX..."
                className="w-full h-24 rounded-xl border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
              />
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating || !topicInput.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-2 text-xs font-bold text-white shadow-md transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Typesetting with Brain...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate LaTeX via Brain</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border text-[11px] text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              100% Overleaf &amp; TeX Live Compatible
            </p>
            <p>
              Includes AMS math packages, BibTeX bibliography environment, 2-column formatting, and publication metadata.
            </p>
          </div>
        </aside>

        {/* Editor & Preview Panels */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LaTeX Code Editor */}
          {(viewMode === "split" || viewMode === "editor") && (
            <div className={`flex-1 flex flex-col border-r border-border bg-[#18181b] text-[#f4f4f5] ${viewMode === "editor" ? "w-full" : "w-full md:w-1/2"}`}>
              <div className="flex items-center justify-between px-4 py-2 bg-[#27272a] border-b border-border/40 text-xs">
                <span className="font-mono text-zinc-400 flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                  manuscript.tex
                </span>
                <span className="text-[11px] text-zinc-400">{latexCode.split("\n").length} lines</span>
              </div>
              <textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full bg-transparent p-4 font-mono text-xs text-zinc-200 leading-relaxed focus:outline-none resize-none overflow-y-auto"
              />
            </div>
          )}

          {/* Compiled Output / Reader Preview */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div className={`flex-1 flex flex-col bg-card overflow-y-auto p-6 sm:p-8 ${viewMode === "preview" ? "w-full" : "w-full md:w-1/2"}`}>
              <div className="max-w-2xl mx-auto w-full space-y-6">
                <div className="border-b border-border/80 pb-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {selectedTemplate.venue}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-3 leading-tight">
                    {selectedTemplate.name}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-2 font-serif italic">
                    Department of Advanced Scholarly Intelligence &bull; AcademicAI Cloud Platform
                  </p>
                </div>

                {/* Abstract */}
                <div className="bg-muted/40 p-4 rounded-xl border border-border/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Abstract</h3>
                  <p className="text-xs text-foreground/90 font-serif leading-relaxed">
                    Autonomous agentic architecture formulated for federated scientific discovery and publication-grade synthesis across global scholarly repositories.
                  </p>
                </div>

                {/* Simulated Typeset Page */}
                <div className="space-y-4 font-serif text-xs text-foreground/80 leading-relaxed">
                  <h2 className="text-sm font-bold text-foreground font-sans border-b border-border pb-1">
                    1. Mathematical Formulation &amp; Architecture
                  </h2>
                  <p>
                    Let the scientific discovery graph be represented as G = (V, E) where vertices denote 480M+ peer-reviewed literature anchors across global scholarly repositories.
                  </p>
                  <div className="bg-muted/30 p-3 rounded-lg text-center font-mono text-xs border border-border/40 my-2">
                    {"\\max_{\\theta} \\mathbb{E}_{q \\sim \\mathcal{D}} \\left[ \\sum_{i=1}^{K} \\log p_\\theta(a_i \\mid q, \\mathcal{C}_i) - \\lambda \\mathcal{H}(\\pi_\\theta) \\right]"}
                  </div>
                  <p>
                    Empirical convergence guarantees ensure monotonicity under the federated multi-agent consensus protocol.
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Compiled via AcademicAI TeX Engine</span>
                  <button
                    onClick={handleCopy}
                    className="text-primary hover:underline font-medium"
                  >
                    Copy Complete TeX Code &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
