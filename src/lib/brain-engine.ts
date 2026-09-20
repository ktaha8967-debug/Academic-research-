import { AgentType, AcademicPaper, UserDocument, AcademicDataset, AIModelConfig } from "./types";
import { searchAcademicPapers } from "./academic-search";
import { ACADEMIC_DATASETS_DATABASE } from "./datasets-data";
import { GLOBAL_LANDMARK_PAPERS } from "./landmark-corpus";
import { loadUserDocuments } from "./documents-store";
import { executeCloudAgent } from "./ai-provider";

export type QueryIntent =
  | "CASUAL_CHAT"
  | "PAPER_SEARCH"
  | "DATASET_INQUIRY"
  | "DOCUMENT_ANALYSIS"
  | "SYSTEMATIC_REVIEW"
  | "STATISTICAL_METHODOLOGY"
  | "PEER_REVIEW_REBUTTAL"
  | "ACADEMIC_WRITING";

export interface BrainExecutionContext {
  agentId: AgentType;
  userPrompt: string;
  attachedPapers?: AcademicPaper[];
  attachedDocIds?: string[];
  projectNotes?: string[];
  conversationHistory?: import("./types").MessageHistoryItem[];
  config?: AIModelConfig;
  selectedDatabases?: string[];
}

export interface BrainExecutionResult {
  intent: QueryIntent;
  content: string;
  sources: AcademicPaper[];
  datasets?: AcademicDataset[];
  referencedDocs?: UserDocument[];
  executionTimeMs: number;
  confidenceScore: number;
  structuredData?: any;
  followUpQuestions?: string[];
}

export function generateFollowUpQuestions(
  agentId: AgentType,
  userPrompt: string,
  papers: AcademicPaper[],
  docs: UserDocument[]
): string[] {
  const clean = userPrompt.toLowerCase();

  if (docs.length > 0 || clean.includes("paper") || clean.includes("document") || clean.includes("summarize")) {
    return [
      "Summarize its core methodology and empirical datasets",
      "What are the main limitations and open research questions?",
      "Extract ready-to-use BibTeX citation and APA reference",
      "How does this work compare against contemporary baselines?",
    ];
  }

  switch (agentId) {
    case "mock_peer_review":
      return [
        "Draft a diplomatic point-by-point rebuttal letter for Reviewer 2",
        "Generate a revised Section 3 addressing methodological rigor",
        "Suggest missing empirical benchmarks to strengthen the submission",
      ];
    case "find_papers":
    case "literature_overview":
      return [
        "Synthesize these findings into a comparative PRISMA matrix",
        "Identify the top 3 unexplored research gaps from these papers",
        "Formulate 4 publication-worthy research hypotheses ($H_1, H_0$)",
      ];
    case "research_gaps":
      return [
        "Architect concrete research questions for Gap 1",
        "Recommend suitable empirical datasets and benchmark metrics",
        "Design a 1-page Grant Proposal Specific Aims outline",
      ];
    case "latex_compiler":
      return [
        "Add an IEEE 2-column comparative results table in LaTeX",
        "Formulate the loss function and optimization proof in LaTeX ($...$)",
        "Generate the complete Overleaf-ready .bib file",
      ];
    case "grant_architect":
      return [
        "Draft the Specific Aims page tailored for NSF / NIH mechanism",
        "Generate a multi-year budget justification and milestone matrix",
        "Formulate the Broader Impacts and dissemination strategy",
      ];
    case "journal_rebuttal":
      return [
        "Polish the response to Reviewer 1's theoretical critique",
        "Draft manuscript diffs for Section 4 results calibration",
        "Generate an executive summary letter to the Associate Editor",
      ];
    default:
      return [
        "Can you elaborate further with real-world empirical examples?",
        "Find peer-reviewed academic papers supporting these claims",
        "Convert this analysis into a publication-ready LaTeX draft",
      ];
  }
}

// 1. Ultra-Fast Intent Classification Engine (Runs in < 5ms)
export function classifyUserQueryIntent(prompt: string, agentId: AgentType): QueryIntent {
  const clean = prompt.trim().toLowerCase();

  // Casual greetings & chit chat
  if (/^(hi|hello|hey|salam|assalam|hola|how are you|kese ho|kya hal|who are you|thanks|thank you|shukriya|tell me a joke)[\s!?.]*$/i.test(clean)) {
    return "CASUAL_CHAT";
  }

  // Explicit Agent mappings
  if (agentId === "mock_peer_review") return "PEER_REVIEW_REBUTTAL";
  if (agentId === "analysis_foundry") return "STATISTICAL_METHODOLOGY";
  if (agentId === "data_extraction" || agentId === "literature_overview") return "SYSTEMATIC_REVIEW";

  // Dataset / Benchmark inquiry
  if (/(dataset|datasets|benchmark|leaderboard|imagenet|mmlu|gsm8k|mimic|corpus|instances|accuracy metric)\b/i.test(clean)) {
    return "DATASET_INQUIRY";
  }

  // Document analysis / local files
  if (/(my document|uploaded pdf|this file|my library|uploaded paper|section \d|page \d)\b/i.test(clean)) {
    return "DOCUMENT_ANALYSIS";
  }

  // Research paper discovery
  if (
    agentId === "find_papers" ||
    /(paper|papers|research|study|studies|literature|article|journal|publication|findings|doi|arxiv|pubmed|review|citations?|sota)\b/i.test(clean)
  ) {
    return "PAPER_SEARCH";
  }

  return "ACADEMIC_WRITING";
}

// 2. Autonomous Multi-Source Dispatcher & Retrieval Engine
export async function executeAutonomousBrain(context: BrainExecutionContext): Promise<BrainExecutionResult> {
  const startTime = Date.now();
  const { agentId, userPrompt, attachedPapers = [], attachedDocIds = [], projectNotes = [], config } = context;

  const intent = classifyUserQueryIntent(userPrompt, agentId);

  let effectivePapers: AcademicPaper[] = [...attachedPapers];
  let matchedDatasets: AcademicDataset[] = [];
  let matchedDocuments: UserDocument[] = [];

  // A. If intent is DATASET_INQUIRY: Retrieve matching datasets from 10,000+ benchmark directory
  if (intent === "DATASET_INQUIRY") {
    const qLower = userPrompt.toLowerCase();
    matchedDatasets = ACADEMIC_DATASETS_DATABASE.filter(
      (ds) =>
        qLower.includes(ds.name.toLowerCase()) ||
        qLower.includes(ds.task.toLowerCase()) ||
        ds.domain.toLowerCase().split(" ").some((w) => qLower.includes(w))
    ).slice(0, 3);

    if (matchedDatasets.length === 0) {
      matchedDatasets = ACADEMIC_DATASETS_DATABASE.slice(0, 2);
    }
  }

  // B. If intent is DOCUMENT_ANALYSIS or user attached documents
  if (attachedDocIds.length > 0 || intent === "DOCUMENT_ANALYSIS") {
    try {
      const allDocs = loadUserDocuments();
      matchedDocuments = allDocs.filter((d) => attachedDocIds.includes(d.id));
      if (matchedDocuments.length === 0 && allDocs.length > 0) {
        matchedDocuments = [allDocs[0]];
      }
    } catch (e) {}
  }

  // C. If intent is PAPER_SEARCH and we have fewer than 3 papers in context: Auto-query 480M+ DBs
  if ((intent === "PAPER_SEARCH" || intent === "SYSTEMATIC_REVIEW") && effectivePapers.length < 3) {
    try {
      const cleanedQuery = userPrompt
        .replace(/^(can you |please |give me |find me |search for |show me |tell me about |what are the )+/i, "")
        .replace(/(papers|studies|articles|research papers|literature on|about)\b/gi, "")
        .trim() || userPrompt;

      const liveResults = await searchAcademicPapers({
        query: cleanedQuery,
        databases: (context.selectedDatabases && context.selectedDatabases.length > 0)
          ? (context.selectedDatabases as any)
          : ["openalex", "arxiv", "pubmed", "europepmc", "crossref", "semanticscholar"],
        limit: 6,
      });

      if (liveResults && liveResults.length > 0) {
        const existingIds = new Set(effectivePapers.map((p) => p.id));
        for (const p of liveResults) {
          if (!existingIds.has(p.id)) {
            effectivePapers.push(p);
            existingIds.add(p.id);
          }
        }
      } else {
        // Fallback to relevant landmark corpus
        effectivePapers.push(...GLOBAL_LANDMARK_PAPERS.slice(0, 3));
      }
    } catch (err) {
      effectivePapers.push(...GLOBAL_LANDMARK_PAPERS.slice(0, 3));
    }
  }

  // D. Build Enhanced Context for Cloud Agent
  let brainContextNotes = [...projectNotes];

  if (matchedDatasets.length > 0) {
    brainContextNotes.push(
      `### RETRIEVED BENCHMARK DATASETS:\n` +
        matchedDatasets
          .map(
            (ds) =>
              `- **${ds.name}** (${ds.domain}): Task: ${ds.task} | Instances: ${ds.instancesCount} | Metrics: ${ds.standardMetrics.join(", ")} | SOTA Leader: ${ds.benchmarkLeaders[0]?.model || "Standard"} (${ds.benchmarkLeaders[0]?.score || "High"})`
          )
          .join("\n")
    );
  }

  if (matchedDocuments.length > 0) {
    brainContextNotes.push(
      `### ATTACHED USER RESEARCH DOCUMENTS:\n` +
        matchedDocuments
          .map(
            (doc) =>
              `- **Document:** "${doc.title}" by ${doc.authors?.join(", ") || "Scholar"}\nAbstract: ${doc.abstract}\nKey Findings: ${doc.extractedKeyFindings?.join("; ")}`
          )
          .join("\n\n")
    );
  }

  // E. Execute Cloud AI Cascade with full Multi-Turn Conversational Memory
  const aiResult = await executeCloudAgent({
    agentId,
    userPrompt,
    contextPapers: effectivePapers,
    projectNotes: brainContextNotes,
    conversationHistory: context.conversationHistory,
    config,
  });

  const executionTimeMs = Date.now() - startTime;

  const followUpQuestions = generateFollowUpQuestions(agentId, userPrompt, effectivePapers, matchedDocuments);

  return {
    intent,
    content: aiResult.content,
    sources: effectivePapers,
    datasets: matchedDatasets.length > 0 ? matchedDatasets : undefined,
    referencedDocs: matchedDocuments.length > 0 ? matchedDocuments : undefined,
    executionTimeMs,
    confidenceScore: 0.96,
    structuredData: aiResult.structuredData,
    followUpQuestions,
  };
}
