export type AgentType =
  | "academic_chat"
  | "find_papers"
  | "literature_overview"
  | "research_gaps"
  | "research_questions"
  | "claim_evidence"
  | "find_citations"
  | "analysis_foundry"
  | "data_extraction"
  | "hallucination_checker"
  | "research_verdict"
  | "mock_peer_review"
  | "poster_forge"
  | "grant_architect"
  | "latex_compiler"
  | "reproducible_code"
  | "journal_rebuttal"
  | "power_analyzer"
  | "patent_prior_art"
  | "phd_defense_slides"
  | "cross_disciplinary"
  | "plagiarism_polisher"
  | "clinical_trials_consort"
  | "bioethics_irb"
  | "bibliometrics_map"
  | "psychometric_validator"
  | "theorem_prover"
  | "scientific_figure_tikz"
  | "journal_matcher"
  | "qualitative_thematic"
  | "dissertation_architect"
  | "cover_letter_editor"
  | "cv_biosketch_tenure"
  | "retrosynthesis_chemist"
  | "complexity_big_o"
  | "macro_dsge_econometrics"
  | "podcast_summarizer"
  | "meta_effect_size"
  | "cochrane_rob2"
  | "grade_certainty"
  | "animal_arrive"
  | "gwas_prs"
  | "scrna_seurat"
  | "alphafold_docking"
  | "crispr_off_target"
  | "synbio_circuits"
  | "microbiome_metagenomics"
  | "quantum_qiskit"
  | "condensed_dft"
  | "astrophysics_spectral"
  | "cfd_openfoam"
  | "gaafet_tcad"
  | "robotics_ros2"
  | "battery_electrolyte"
  | "green_hydrogen"
  | "civil_earthquake_fem"
  | "telecom_6g"
  | "econometric_iv_gmm"
  | "did_staggered"
  | "market_microstructure"
  | "game_theory_mechanism"
  | "behavioral_nudge"
  | "carbon_tax_econ"
  | "asset_pricing_fama"
  | "labor_automation"
  | "corporate_governance"
  | "fmri_spm_glm"
  | "eeg_erp"
  | "irac_legal_case"
  | "eu_ai_act_compliance"
  | "geopolitical_deterrence"
  | "computational_linguistics"
  | "philosophy_consciousness"
  | "pytorch_flashattention"
  | "dpo_rlhf"
  | "fair_data_plan";

export interface AgentInfo {
  id: AgentType;
  title: string;
  description: string;
  icon: string;
  category:
    | "Discovery & Literature"
    | "Ideation & Hypotheses"
    | "Biomedical & Genomics"
    | "Physics, Chemistry & Engineering"
    | "Economics & Quantitative Finance"
    | "Psychology, Law & Social Sciences"
    | "Statistics & Methodology"
    | "Editorial, Grants & Publishing";
  placeholder: string;
  suggestedPrompts: string[];
}

export interface AcademicPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  abstract: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  citationCount?: number;
  source: "OpenAlex" | "arXiv" | "Crossref" | "PubMed" | "Europe PMC" | "Semantic Scholar";
  isOpenAccess?: boolean;
  topics?: string[];
  referencedWorksCount?: number;
  tags?: string[];
}

export interface CitationGraphNode {
  id: string;
  title: string;
  authors: string;
  year: number;
  citationCount: number;
  source: string;
  group: number;
}

export interface CitationGraphLink {
  source: string;
  target: string;
  value: number;
  type: "citation" | "co-authorship" | "semantic";
}

export type ResearchStage =
  | "question"
  | "papers"
  | "synthesis"
  | "gaps"
  | "questions"
  | "evidence"
  | "analysis"
  | "manuscript"
  | "review"
  | "rebuttal"
  | "poster";

export interface StructuredResearchGap {
  id: string;
  title: string;
  type: "Methodological" | "Theoretical" | "Empirical" | "Population" | "Translational";
  description: string;
  impact: "High" | "Medium" | "Critical";
  supportingPapers?: string[];
  suggestedDirection?: string;
}

export interface StructuredResearchQuestion {
  id: string;
  question: string;
  nullHypothesis?: string;
  altHypothesis?: string;
  finerCriteria?: {
    feasible: string;
    interesting: string;
    novel: string;
    ethical: string;
    relevant: string;
  };
  recommendedMethodology?: string;
  targetMetrics?: string[];
}

export interface StructuredEvidenceStudy {
  id: string;
  author: string;
  year: number;
  sampleSize?: string;
  methodology?: string;
  independentVar?: string;
  dependentVar?: string;
  effectSize?: string;
  pValue?: string;
  primaryFinding: string;
  limitation?: string;
  verifiedDoi?: string;
}

export interface StructuredLiteratureReview {
  topic: string;
  themes: {
    id: string;
    name: string;
    consensus: string;
    papersCount: number;
    keyStudies: string[];
  }[];
  synthesisSummary: string;
  methodologicalTrends: string;
}

export interface ClarificationPrompt {
  isClarification: true;
  term: string;
  reason: string;
  suggestedInterpretations: {
    label: string;
    description: string;
    promptToExecute: string;
  }[];
}

export interface StructuredAgentOutput {
  type: "clarification" | "papers" | "gaps" | "questions" | "evidence" | "review" | "methodology" | "general";
  clarification?: ClarificationPrompt;
  papers?: AcademicPaper[];
  gaps?: StructuredResearchGap[];
  researchGaps?: StructuredResearchGap[];
  questions?: StructuredResearchQuestion[];
  researchQuestions?: StructuredResearchQuestion[];
  evidence?: StructuredEvidenceStudy[];
  evidenceMatrix?: StructuredEvidenceStudy[];
  literatureReview?: StructuredLiteratureReview;
  rawMarkdown?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  researchQuestion?: string;
  activeStage?: ResearchStage;
  savedPapers: AcademicPaper[];
  notes: string[];
  history: MessageHistoryItem[];
  literatureReview?: StructuredLiteratureReview;
  researchGaps?: StructuredResearchGap[];
  researchQuestions?: StructuredResearchQuestion[];
  evidenceMatrix?: StructuredEvidenceStudy[];
  manuscriptDraft?: string;
}

export interface MessageHistoryItem {
  id: string;
  agentId: AgentType;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  structuredData?: StructuredAgentOutput | any;
  sources?: AcademicPaper[];
  executionTimeMs?: number;
  followUpQuestions?: string[];
}

export interface SearchQueryParams {
  query: string;
  databases?: ("openalex" | "arxiv" | "crossref" | "pubmed" | "europepmc" | "semanticscholar")[];
  limit?: number;
  openAccessOnly?: boolean;
  yearFrom?: number;
  yearTo?: number;
}

export interface AIModelConfig {
  provider: "groq" | "openrouter" | "huggingface" | "openai" | "gemini" | "fallback";
  modelName: string;
  apiKey?: string;
  temperature?: number;
}

export type LanguageCode = "en" | "ur" | "es" | "fr" | "de" | "zh" | "ar" | "hi";

export interface UserUsageStats {
  searchesPerformed: number;
  agentRuns: number;
  savedPapersCount: number;
  plan: "Free Cloud" | "Academic Pro" | "Institutional Campus";
  maxSearchesDaily: number;
  tokensProcessed: number;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  pageNumber?: number;
}

export interface UserDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "docx" | "txt" | "bib";
  uploadedAt: string;
  pageCount?: number;
  authors?: string[];
  abstract?: string;
  sections: DocumentSection[];
  fullText: string;
  readingStatus: "to_read" | "in_progress" | "completed" | "starred";
  tags: string[];
  notes?: string;
  extractedKeyFindings?: string[];
  extractedCitations?: string[];
  pdfDataUrl?: string;
}

export interface AcademicDataset {
  id: string;
  name: string;
  domain: "Computer Science & AI" | "Biomedical & Healthcare" | "Physics & Materials" | "Economics & Finance" | "Social Sciences" | "Climate & Earth";
  task: string;
  modality: "Text / NLP" | "Vision / Images" | "Tabular / Structured" | "Genomic / Sequences" | "Audio / Speech" | "Graph / Networks" | "Multimodal";
  size: string;
  instancesCount: string;
  license: string;
  description: string;
  standardMetrics: string[];
  benchmarkLeaders: { model: string; score: string; year: number }[];
  paperTitle?: string;
  paperUrl?: string;
  downloadUrl?: string;
  source: "HuggingFace" | "PapersWithCode" | "Kaggle" | "Zenodo" | "Harvard Dataverse" | "NCBI";
}

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  domain: string;
  icon: string;
  paperCount: number;
  papers: AcademicPaper[];
}

export interface PosterSection {
  id: string;
  title: string;
  content: string;
  type: "text" | "bullet" | "stats" | "equation" | "chart";
}

export interface PosterConfig {
  title: string;
  authors: string;
  affiliations: string;
  theme: "classic-navy" | "emerald-nature" | "dark-slate" | "crimson-oxford" | "sunset-gradient";
  columns: 3;
  sections: PosterSection[];
}

