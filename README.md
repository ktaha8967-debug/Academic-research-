# AcademicAI — AI Academic Research Platform V1

A publication-grade, open-source AI Academic Research Platform built with **Next.js 14, TypeScript, Tailwind CSS**, and powered by **100% Free Cloud-Hosted Open-Source Models** and **Public Academic Databases**.

Inspired by the research workflows of **ChatAcademia**.

---

## 🌟 Key Capabilities & Research Agents

The platform connects 13 specialized agentic workflows with shared project context:

1. **Academic Chat:** High-level scholarly discussion, hypothesis testing, and methodology reasoning.
2. **Find Papers:** Live multi-database query engine connecting to **OpenAlex**, **arXiv**, and **Crossref** without paywalls.
3. **Literature Overview:** Thematic review generator synthesizing multiple papers into structured synthesis tables.
4. **Identify Research Gaps:** Uncovers methodological, conceptual, and empirical blindspots in current literature.
5. **Research Questions:** FINER-criteria compliant hypotheses, testable equations, and experimental designs.
6. **Claim Evidence:** Fact-checking academic assertions against empirical literature with citation metrics.
7. **Find Citations:** Formats APA 7th, MLA 9th, IEEE, and export-ready BibTeX for Zotero/Mendeley.
8. **Analysis Foundry:** Statistical modeling, variable operationalization, and power calculation blueprints.
9. **Extract Data:** Tabular extraction of sample sizes, methodologies, effect sizes, and p-values.
10. **Hallucination Checker:** Audits drafts against ground-truth literature to ensure zero fabricated citations.
11. **Research Verdict:** Editorial board feasibility, novelty, and scientific viability index (1-100).
12. **Mock Peer Review:** Simulates Reviewer 1, Reviewer 2, Reviewer 3, and Editor decision letters.
13. **Poster Forge:** Generates 3-column academic conference poster layouts.

---

## 🚀 100% Free Cloud Open-Source Strategy (Zero Local GPU Needed)

This platform runs entirely in the cloud with zero paid API lock-in:

* **Groq Cloud (Free Tier):** Hosted open-source models like `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`.
* **OpenRouter (Free Tier):** Cloud-hosted `meta-llama/llama-3.3-70b-instruct:free`, `qwen/qwen-2.5-72b-instruct:free`.
* **Hugging Face Serverless Inference API (Free Tier):** Open weights models without local installation.
* **Public Scholarly APIs (Zero Cost, No API Key Required):**
  * **OpenAlex API:** 250M+ open access papers, inverted abstracts, citation metrics.
  * **arXiv API:** Physics, CS, Math, AI preprints and direct PDF links.
  * **Crossref API:** Official DOI registry and academic metadata.
* **Built-in Cloud Intelligence Fallback:** Works immediately out of the box even before adding free API keys!

---

## 🛠️ Quick Start & Running Locally

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Start
```bash
npm run build
npm start
```
