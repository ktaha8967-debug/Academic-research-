"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileText,
  UserCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface RebuttalItem {
  id: string;
  reviewer: string;
  comment: string;
  draftResponse: string;
  manuscriptDiff: string;
  status: "pending" | "addressed" | "polished";
}

export default function RebuttalStudioPage() {
  const [paperTitle, setPaperTitle] = useState("Federated Multi-Agent Architecture for Scholarly Synthesis");
  const [journalName, setJournalName] = useState("Nature Machine Intelligence");
  const [tone, setTone] = useState<"diplomatic" | "concise" | "thorough">("diplomatic");
  const [rawReviewerText, setRawReviewerText] = useState(
    `Reviewer 1:\n1. The baseline comparisons lack evaluation against the most recent 2024 state-of-the-art models.\n2. Clarify the mathematical proof for convergence in Theorem 2.\n\nReviewer 2:\n1. The sample size in the ablation study is too small to draw statistically significant conclusions.\n2. How does the system handle hallucinated citations from unindexed preprints?`
  );
  const [rebuttalItems, setRebuttalItems] = useState<RebuttalItem[]>([
    {
      id: "rev1-1",
      reviewer: "Reviewer 1 - Point 1",
      comment: "The baseline comparisons lack evaluation against the most recent 2024 state-of-the-art models.",
      draftResponse:
        "We thank the reviewer for this insightful comment. In response, we have incorporated comprehensive benchmark evaluations against DeepSeek-V3, Llama 3.3-70B, and Claude 3.5 Sonnet across all five evaluation tasks.",
      manuscriptDiff: "Section 4.2 and Table 3 (Page 6) have been expanded with recent 2024 SOTA baselines.",
      status: "polished",
    },
    {
      id: "rev1-2",
      reviewer: "Reviewer 1 - Point 2",
      comment: "Clarify the mathematical proof for convergence in Theorem 2.",
      draftResponse:
        "We appreciate the reviewer highlighting this nuance. We have added a step-by-step derivation in Appendix B showing monotonic convergence under the Lipschitz continuity condition.",
      manuscriptDiff: "Appendix B (Page 14) now includes the complete 4-step convergence proof.",
      status: "addressed",
    },
    {
      id: "rev2-1",
      reviewer: "Reviewer 2 - Point 1",
      comment: "The sample size in the ablation study is too small to draw statistically significant conclusions.",
      draftResponse:
        "We are grateful for this constructive feedback. We have tripled the ablation cohort size from N=150 to N=450 queries, confirming statistical significance with p < 0.001 (two-tailed Welch's t-test).",
      manuscriptDiff: "Figure 4 and Section 5.1 (Pages 7-8) updated with N=450 statistical power analysis.",
      status: "polished",
    },
    {
      id: "rev2-2",
      reviewer: "Reviewer 2 - Point 2",
      comment: "How does the system handle hallucinated citations from unindexed preprints?",
      draftResponse:
        "We thank the reviewer for this critical question. We have added an explicit Academic Integrity & Hallucination Audit section describing our automated cross-check against OpenAlex and Crossref registries.",
      manuscriptDiff: "Section 3.4 (Page 5) now details the real-time DOI verification protocol.",
      status: "addressed",
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateRebuttal = async () => {
    if (!rawReviewerText.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "journal_rebuttal",
          userPrompt: `Paper Title: "${paperTitle}"\nJournal: "${journalName}"\nDesired Tone: ${tone}\n\nReviewer Comments to Rebut:\n${rawReviewerText}\n\nGenerate an authoritative, polite, and persuasive point-by-point author response letter with manuscript modification diffs.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Set new draft
        if (data.content) {
          // Parse or update first item
          setRebuttalItems((prev) => [
            {
              id: "gen-1",
              reviewer: "Associate Editor & Reviewers",
              comment: "Comprehensive synthesis of reviewer concerns",
              draftResponse: data.content,
              manuscriptDiff: "Manuscript updated throughout Sections 1-6.",
              status: "polished",
            },
            ...prev,
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFullRebuttalMarkdown = () => {
    return `# Response to Reviewers & Editorial Decision
**Manuscript Title:** ${paperTitle}
**Target Journal:** ${journalName}
**Submission Date:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

Dear Editor and Reviewers,

We would like to express our sincere gratitude to the Associate Editor and the anonymous reviewers for their constructive, thorough, and highly insightful feedback. We have carefully addressed all reviewer comments in this revised manuscript. 

Below, please find our point-by-point responses to each specific critique, along with details of the corresponding revisions made to the manuscript.

---

${rebuttalItems
  .map(
    (item, idx) => `### **[Comment ${idx + 1}] (${item.reviewer})**
> *"${item.comment}"*

**Response:**
${item.draftResponse}

**Manuscript Revisions:**
* **Action:** ${item.manuscriptDiff}

---`
  )
  .join("\n\n")}

Thank you again for considering our revised manuscript.

Sincerely,
The Authors
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullRebuttalMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getFullRebuttalMarkdown()], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `response_to_reviewers.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <MessageSquare className="h-4 w-4 text-rose-500" />
            <span className="font-extrabold text-sm">Journal Rebuttal & Editorial Strategist</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied Rebuttal" : "Copy All"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Letter (.md)</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Reviewer Input & Configuration */}
        <aside className="w-full lg:w-96 border-r border-border bg-card/40 p-4 space-y-4 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Manuscript Title
            </label>
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Target Academic Journal
            </label>
            <input
              type="text"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Rebuttal Diplomacy & Tone
            </label>
            <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setTone("diplomatic")}
                className={`py-1 rounded-lg text-center transition-all ${
                  tone === "diplomatic" ? "bg-card text-foreground font-bold shadow-xs" : "text-muted-foreground"
                }`}
              >
                Diplomatic
              </button>
              <button
                onClick={() => setTone("thorough")}
                className={`py-1 rounded-lg text-center transition-all ${
                  tone === "thorough" ? "bg-card text-foreground font-bold shadow-xs" : "text-muted-foreground"
                }`}
              >
                Thorough
              </button>
              <button
                onClick={() => setTone("concise")}
                className={`py-1 rounded-lg text-center transition-all ${
                  tone === "concise" ? "bg-card text-foreground font-bold shadow-xs" : "text-muted-foreground"
                }`}
              >
                Concise
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Paste Raw Reviewer Comments
            </label>
            <textarea
              value={rawReviewerText}
              onChange={(e) => setRawReviewerText(e.target.value)}
              rows={8}
              placeholder="Paste Reviewer 1, Reviewer 2, or Editor rejection/revision comments here..."
              className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerateRebuttal}
            disabled={isGenerating || !rawReviewerText.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Generating Diplomatic Rebuttal...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Build Point-by-Point Rebuttal</span>
              </>
            )}
          </button>
        </aside>

        {/* Right Panel: Interactive Rebuttal Cards */}
        <main className="flex-1 p-6 overflow-y-auto bg-card space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Point-by-Point Author Response Letter</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {rebuttalItems.length} peer-review critiques systematically addressed with evidence anchors.
              </p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              Q1 Journal Ready
            </span>
          </div>

          <div className="space-y-4">
            {rebuttalItems.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    {item.reviewer}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Point {idx + 1}
                  </span>
                </div>

                {/* Reviewer Critique Box */}
                <div className="bg-rose-500/10 border-l-4 border-rose-500 p-3 rounded-r-xl">
                  <p className="text-xs text-foreground/90 font-serif italic">
                    "{item.comment}"
                  </p>
                </div>

                {/* Author Response Draft */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Author Response:
                  </label>
                  <textarea
                    value={item.draftResponse}
                    onChange={(e) => {
                      const updated = [...rebuttalItems];
                      updated[idx].draftResponse = e.target.value;
                      setRebuttalItems(updated);
                    }}
                    rows={3}
                    className="w-full rounded-xl border border-input bg-card p-2.5 text-xs text-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Manuscript Diff Reference */}
                <div className="flex items-center gap-2 text-xs bg-muted/40 p-2.5 rounded-xl border border-border/50">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground shrink-0 font-semibold">Manuscript Diff:</span>
                  <input
                    type="text"
                    value={item.manuscriptDiff}
                    onChange={(e) => {
                      const updated = [...rebuttalItems];
                      updated[idx].manuscriptDiff = e.target.value;
                      setRebuttalItems(updated);
                    }}
                    className="w-full bg-transparent text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
