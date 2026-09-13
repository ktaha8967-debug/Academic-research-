"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Award,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface GrantAgency {
  id: string;
  name: string;
  mechanism: string;
  maxFunding: string;
  duration: string;
  sections: string[];
}

const AGENCIES: GrantAgency[] = [
  {
    id: "nih_r01",
    name: "NIH (National Institutes of Health)",
    mechanism: "R01 Research Project Grant",
    maxFunding: "$2,500,000",
    duration: "5 Years",
    sections: ["Specific Aims (1 Page)", "Significance", "Innovation", "Approach & Research Design"],
  },
  {
    id: "nsf_career",
    name: "NSF (National Science Foundation)",
    mechanism: "Faculty Early Career Development (CAREER)",
    maxFunding: "$600,000",
    duration: "5 Years",
    sections: ["Project Summary", "Intellectual Merit", "Broader Impacts", "Integrated Education Plan"],
  },
  {
    id: "erc_starting",
    name: "European Research Council (ERC)",
    mechanism: "ERC Starting Grant (Horizon Europe)",
    maxFunding: "€1,500,000",
    duration: "5 Years",
    sections: ["Extended Synopsis (5 Pages)", "Scientific Proposal: State of the Art", "Methodology & Risk Mitigation"],
  },
  {
    id: "darpa_baa",
    name: "DARPA (Defense Advanced Research Projects Agency)",
    mechanism: "Broad Agency Announcement (BAA)",
    maxFunding: "$3,000,000+",
    duration: "3-4 Years",
    sections: ["Heilmeier Catechism", "Technical Approach", "Milestone Schedule", "Government Transition Plan"],
  },
];

export default function GrantForgePage() {
  const [selectedAgency, setSelectedAgency] = useState<GrantAgency>(AGENCIES[0]);
  const [projectTitle, setProjectTitle] = useState("Autonomous AI Systems for High-Throughput Biomolecular Target Discovery");
  const [piName, setPiName] = useState("Dr. Elena Vance, Ph.D.");
  const [institution, setInstitution] = useState("Institute for Advanced Research & Computational Biology");
  const [researchSummary, setResearchSummary] = useState(
    "Developing a decentralized, multi-agent reinforcement learning foundation model to predict protein-ligand binding kinetics and de novo biocatalyst folding under non-equilibrium cellular dynamics."
  );

  const [aim1, setAim1] = useState(
    "Aim 1: Architect high-fidelity geometric graph neural networks for sub-Angstrom binding site representation."
  );
  const [aim2, setAim2] = useState(
    "Aim 2: Formulate direct preference optimization (DPO) algorithms aligned with empirical X-ray crystallographic assays."
  );
  const [aim3, setAim3] = useState(
    "Aim 3: Validate predicted candidate inhibitors in-vitro across mammalian cell line cohorts with zero off-target toxicity."
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "grant_architect",
          userPrompt: `Agency & Mechanism: ${selectedAgency.name} - ${selectedAgency.mechanism}\nProject Title: ${projectTitle}\nPI: ${piName} (${institution})\nResearch Summary: ${researchSummary}\nSpecific Aims:\n- ${aim1}\n- ${aim2}\n- ${aim3}\n\nDraft a complete, publication-grade, fundable 1-page Specific Aims document and Research Strategy following exact agency guidelines.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setGeneratedProposal(data.content);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFullGrantMarkdown = () => {
    if (generatedProposal) return generatedProposal;

    return `# ${selectedAgency.name.toUpperCase()} GRANT PROPOSAL
## Mechanism: ${selectedAgency.mechanism}
**Project Title:** ${projectTitle}
**Principal Investigator (PI):** ${piName}
**Institution:** ${institution}
**Requested Budget:** ${selectedAgency.maxFunding} | **Period:** ${selectedAgency.duration}

---

### 1. SPECIFIC AIMS (1-Page Executive Blueprint)

Despite monumental advances in computational structural biology, the accurate prediction of allosteric transitions in non-equilibrium environments remains an unresolved scientific bottleneck. Conventional single-state docking algorithms exhibit a 42% false-positive rate when applied to disordered catalytic pockets.

**Central Hypothesis:** We hypothesize that an autonomous federated multi-agent architecture incorporating geometric graph equivariance will reduce off-target binding prediction errors by >60% while accelerating candidate screening turnaround by an order of magnitude.

Our long-term goal is to establish an open-science platform for high-throughput therapeutic target design. To achieve this objective, we propose the following three Specific Aims:

* **${aim1}**
  * *Milestone:* Deliver a validated geometric GNN benchmark achieving < 0.8 Å RMSD on PDBBind test sets within Month 12.
* **${aim2}**
  * *Milestone:* Implement closed-loop preference optimization with verified experimental assay checkpoints by Month 24.
* **${aim3}**
  * *Milestone:* Complete in-vitro validation across 500 candidate compounds by Month 48.

---

### 2. SIGNIFICANCE & INNOVATION
* **Significance:** Solves the critical translational gap in modern oncology drug discovery.
* **Innovation:** First closed-form integration of non-equilibrium physics into deep foundation models with zero-hallucination verification.

---

### 3. PROJECT TIMELINE & GANTT MILESTONES

| Specific Aim | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Key Deliverable |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Aim 1: GNN Architecture** | █ | █ | | | | Open-source PyTorch Model |
| **Aim 2: Closed-Loop DPO** | | █ | █ | | | High-Throughput Pipeline |
| **Aim 3: In-Vitro Assays** | | | █ | █ | █ | Peer-Reviewed Publication & Open Data |

---

### 4. BUDGET JUSTIFICATION SUMMARY
* **Personnel (PI, 2 Postdocs, 2 PhD Students):** $1,450,000
* **Computational Cloud Infrastructure & GPUs:** $450,000
* **Laboratory Reagents & In-Vitro Assays:** $350,000
* **Indirect Costs (F&A 52%):** Included
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullGrantMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getFullGrantMarkdown()], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedAgency.id}_proposal.md`;
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
            <Award className="h-4 w-4 text-amber-500" />
            <span className="font-extrabold text-sm">Grant & Funding Proposal Architect</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied Grant" : "Copy Proposal"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Proposal (.md)</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Grant Parameters & Aims */}
        <aside className="w-full lg:w-96 border-r border-border bg-card/40 p-4 space-y-4 shrink-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              1. Funding Agency & Mechanism
            </label>
            <div className="space-y-1.5">
              {AGENCIES.map((agency) => (
                <button
                  key={agency.id}
                  onClick={() => setSelectedAgency(agency)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedAgency.id === agency.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border/70 hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{agency.name}</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-mono">
                      {agency.maxFunding}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{agency.mechanism}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Principal Investigator & Institution
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={piName}
                onChange={(e) => setPiName(e.target.value)}
                placeholder="PI Name"
                className="w-full rounded-xl border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institution"
                className="w-full rounded-xl border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Specific Aims
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={aim1}
                onChange={(e) => setAim1(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={aim2}
                onChange={(e) => setAim2(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={aim3}
                onChange={(e) => setAim3(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateProposal}
            disabled={isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Architecting Grant Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Architect Full Grant Proposal</span>
              </>
            )}
          </button>
        </aside>

        {/* Right Panel: Rendered Grant Document */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-card space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  {selectedAgency.mechanism}
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-2 leading-tight">
                  {projectTitle}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>PI:</strong> {piName} &bull; <strong>Institution:</strong> {institution} &bull;{" "}
                  <strong>Target:</strong> {selectedAgency.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-primary block">{selectedAgency.maxFunding}</span>
                <span className="text-[11px] text-muted-foreground">{selectedAgency.duration} Horizon</span>
              </div>
            </div>

            {/* Generated / Blueprint Proposal Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none font-serif leading-relaxed text-xs sm:text-sm space-y-4">
              <div className="whitespace-pre-wrap bg-background p-6 rounded-2xl border border-border/80 shadow-xs font-sans text-xs sm:text-sm leading-relaxed">
                {getFullGrantMarkdown()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
