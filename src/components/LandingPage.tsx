"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Database,
  Search,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Globe,
  Layers,
  BrainCircuit,
  FileSpreadsheet,
  Users,
  Presentation,
  Award,
  ChevronDown,
  Quote,
  Star,
  ExternalLink,
  Code2,
  Lock,
} from "lucide-react";
import { LanguageCode } from "@/lib/types";

interface LandingPageProps {
  onLaunchApp: (agentId?: string) => void;
  savedPapersCount: number;
}

export function LandingPage({ onLaunchApp, savedPapersCount }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<string>("literature");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* SaaS Marketing Topbar */}
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25 shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                Academic<span className="text-primary">AI</span>
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                100% Free Cloud
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <Link href="/documents" className="hover:text-foreground transition-colors">My Documents</Link>
            <Link href="/datasets" className="hover:text-foreground transition-colors">Datasets & Benchmarks</Link>
            <Link href="/disciplines" className="hover:text-foreground transition-colors">12 Global Disciplines</Link>
            <Link href="/papers" className="hover:text-foreground transition-colors">480M+ Papers</Link>
            <a href="#agents" className="hover:text-foreground transition-colors">13 Agents</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Free Cloud</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onLaunchApp()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <span>Open Research Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/60">
        {/* Glow backdrop effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-primary/20 via-blue-600/10 to-emerald-500/10 blur-3xl opacity-70" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-xs animate-in fade-in zoom-in duration-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Academic AI Research Platform — 480M+ Papers • 10,000+ Datasets • 12 Disciplines</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.15]">
            Supercharge Your Research from{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Idea to Publication
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Connected multi-agent research workspace searching <strong>480M+ scholarly works</strong> across OpenAlex, Semantic Scholar, arXiv, PubMed, Europe PMC, and Crossref. Zero subscription fees, zero local GPU requirements.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onLaunchApp()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <span>Get Started Free — Open Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/papers"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/70 transition-colors shadow-xs"
            >
              <Search className="h-4 w-4 text-primary" />
              <span>Search 480M+ Papers</span>
            </Link>
            <Link
              href="/disciplines"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/70 transition-colors shadow-xs"
            >
              <Globe className="h-4 w-4 text-emerald-500" />
              <span>Explore 12 Disciplines</span>
            </Link>
          </div>

          {/* Trust Metric Bar */}
          <div className="mt-14 border-y border-border/60 py-6 bg-muted/20">
            <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">480M+</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Scholarly Works Indexed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">10,000+</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Standardized Datasets</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-500">12 Global</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Scientific Disciplines</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">100% Free</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Cloud Open Models</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Agent Showcase Section */}
      <section id="agents" className="py-20 border-b border-border/60 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              13 Specialized Research Agents
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground mt-2">
              Every Stage of Scientific Discovery, Automated
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              Unlike generic chat assistants, each agent is engineered for peer-reviewed academic rigor with citation proofs.
            </p>
          </div>

          {/* Interactive Agent Feature Tabs */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {[
              { id: "discovery", label: "Paper Discovery & Search", icon: Search },
              { id: "literature", label: "Literature Synthesis", icon: Layers },
              { id: "gaps", label: "Gap & Hypothesis Detection", icon: BrainCircuit },
              { id: "data", label: "PRISMA Data Matrix", icon: FileSpreadsheet },
              { id: "peer_review", label: "Mock Peer Review", icon: Users },
              { id: "poster", label: "Conference Poster Forge", icon: Presentation },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Preview Card */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {activeTab === "discovery" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Find Papers Agent</span>
                  <span className="text-xs text-muted-foreground">Connected to 5 Databases</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Multi-Database Scholarly Search without Paywalls</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Queries 250M+ OpenAlex works, 2.4M+ arXiv preprints, 36M+ PubMed records, 40M+ Europe PMC papers, and 150M+ Crossref DOIs simultaneously with full inverted abstract reconstruction and citation count metrics.
                </p>
                <div className="p-3 bg-muted/20 rounded-xl border border-border/50 text-xs font-mono text-muted-foreground">
                  Query: "Reinforcement learning from human feedback hallucination reduction" → Found 24 Verified Papers with Open Access PDFs.
                </div>
              </div>
            )}

            {activeTab === "literature" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Literature Overview Agent</span>
                  <span className="text-xs text-muted-foreground">Thematic Synthesis</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Structured Thematic Review Matrix</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Synthesizes your bookmarked workspace papers into coherent publication-grade literature review sections, comparing historical baselines, contemporary models, and contested paradigms.
                </p>
                <div className="p-3 bg-muted/20 rounded-xl border border-border/50 text-xs font-mono text-muted-foreground">
                  | Study (2024) | Primary Focus | Key Metric | Source: OpenAlex | Citations: 84 |
                </div>
              </div>
            )}

            {activeTab === "gaps" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Research Gaps & Questions Agent</span>
                  <span className="text-xs text-muted-foreground">FINER Hypotheses</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Blindspot Detection & Hypothesis Formulation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Detects methodological, longitudinal, and domain generalizability blindspots in current literature, producing testable null and alternative hypotheses ($H_0$, $H_1$) ready for grant proposals.
                </p>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Data Extraction Matrix</span>
                  <span className="text-xs text-muted-foreground">PRISMA Format</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Systematic Review Variable Extraction</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Extracts sample sizes ($N$), experimental designs, independent/dependent variables, effect sizes ($d$), and limitations into clean tabular format with 1-click CSV/Excel export.
                </p>
              </div>
            )}

            {activeTab === "peer_review" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Mock Peer Review Studio</span>
                  <span className="text-xs text-muted-foreground">Journal Simulation</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Simulated Reviewer 1, 2, 3 & Rebuttal Generator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provides honest, critical evaluation across theoretical rigor, empirical data integrity, and novelty, generating a point-by-point Author Response Rebuttal Letter ready for submission.
                </p>
              </div>
            )}

            {activeTab === "poster" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-primary uppercase">Conference Poster Forge</span>
                  <span className="text-xs text-muted-foreground">3-Column Layout</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">Academic Conference Poster Builder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Converts research papers into formatted 36"x48" 3-column conference posters with 5 color themes (Oxford Navy, Nature Emerald, Dark Slate, Crimson Red, Gradient) and instant print/PDF export.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => onLaunchApp()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                <span>Try In Live Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Academic Databases Section */}
      <section id="databases" className="py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Global Scholarly Repositories
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground mt-2">
              480M+ International Academic Records Connected
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              We query open-access scientific repositories directly via official public APIs with zero paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: "OpenAlex",
                count: "250M+ Works",
                desc: "Full open science catalog, citations, concept tags, and reconstructed abstracts.",
                tag: "Global Open Science",
              },
              {
                name: "arXiv Repository",
                count: "2.4M+ Preprints",
                desc: "Computer Science, AI, Physics, Math, and Quantitative Finance preprints with direct PDF links.",
                tag: "Preprints & CS",
              },
              {
                name: "PubMed / NCBI",
                count: "36M+ Records",
                desc: "National Library of Medicine biomedical literature, clinical trials, and life sciences.",
                tag: "Biomedical & Med",
              },
              {
                name: "Europe PMC",
                count: "40M+ Articles",
                desc: "European biomedical and biological sciences database with fulltext open access indexing.",
                tag: "Life Sciences",
              },
              {
                name: "Crossref Registry",
                count: "150M+ DOIs",
                desc: "Official digital object identifier registry for journals, conference proceedings, and books.",
                tag: "Official DOIs",
              },
            ].map((db, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {db.tag}
                  </span>
                  <h3 className="font-extrabold text-base text-foreground mt-2">{db.name}</h3>
                  <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{db.count}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{db.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & SaaS Plans Section */}
      <section id="pricing" className="py-20 border-b border-border/60 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Transparent SaaS Plans
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-foreground mt-2">
              100% Free for Open Scientific Research
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              No hidden fees, no credit card required. Use free cloud-hosted open models out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border-2 border-primary bg-card p-6 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                Active Tier
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Community Cloud</h3>
                <p className="text-xs text-muted-foreground mt-1">For independent researchers and students</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">/ forever free</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited search across 480M+ papers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> All 13 Multi-Stage AI Research Agents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Groq & OpenRouter Cloud Open Models</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> BibTeX, PRISMA CSV, Poster Studio</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Project Workspace Storage</li>
                </ul>
              </div>
              <button
                onClick={() => onLaunchApp()}
                className="mt-8 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
              >
                Launch Platform Free
              </button>
            </div>

            {/* Academic Pro */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Academic Pro</h3>
                <p className="text-xs text-muted-foreground mt-1">For PhD candidates and university faculty</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">$12</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Everything in Community Cloud</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority ultra-fast cloud inference</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Multi-PDF vector batch ingestion</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> LaTeX Overleaf sync integration</li>
                </ul>
              </div>
              <button
                onClick={() => onLaunchApp()}
                className="mt-8 w-full rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-foreground hover:bg-muted"
              >
                Start Free Trial
              </button>
            </div>

            {/* Institutional */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Institutional Campus</h3>
                <p className="text-xs text-muted-foreground mt-1">For university libraries and research labs</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">Custom</span>
                  <span className="text-xs text-muted-foreground">/ university license</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> University SSO / SAML login</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Dedicated private model cluster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Lab co-authorship collaborative hubs</li>
                </ul>
              </div>
              <button
                onClick={() => onLaunchApp()}
                className="mt-8 w-full rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-foreground hover:bg-muted"
              >
                Contact Academic Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Do I need a paid API key or a local GPU to use this platform?",
                a: "No. The platform works 100% free out of the box using built-in high-precision cloud scholarly intelligence and free-tier cloud open-source providers (Groq Cloud, OpenRouter, Hugging Face). No GPU or local setup is needed.",
              },
              {
                q: "Which academic databases are searched?",
                a: "The platform queries OpenAlex (250M+ works), arXiv (2.4M+ preprints), PubMed (36M+ biomedical works), Europe PMC (40M+ life sciences), and Crossref (150M+ DOIs).",
              },
              {
                q: "How does the platform avoid AI hallucination in citations?",
                a: "Every retrieved paper includes verified DOI registries, real publication years, and source metadata. Our Hallucination Checker agent audits every claim directly against the retrieved paper text.",
              },
              {
                q: "Can I export my research to Zotero, Overleaf, or Word?",
                a: "Yes! You can export complete BibTeX (.bib) reference files, PRISMA Systematic Review CSV tables, Markdown files, or print 3-column conference posters directly to PDF.",
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${faqOpen === idx ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>
                {faqOpen === idx && (
                  <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern SaaS Footer */}
      <footer className="border-t border-border/80 bg-background py-12 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground">AcademicAI SaaS Platform V1</span>
            <span>• Open Source & Free Science</span>
          </div>

          <div className="flex items-center gap-6">
            <span>OpenAlex • arXiv • PubMed • Europe PMC • Crossref</span>
            <button
              onClick={() => onLaunchApp()}
              className="font-bold text-primary hover:underline"
            >
              Launch App →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
