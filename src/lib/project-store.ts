import { Project, AcademicPaper, ResearchStage, StructuredResearchGap, StructuredResearchQuestion, StructuredEvidenceStudy, StructuredLiteratureReview } from "./types";

const PROJECTS_STORAGE_KEY = "academic_ai_projects";
const ACTIVE_PROJECT_KEY = "academic_active_project_id";

export const DEFAULT_INITIAL_PROJECTS: Project[] = [
  {
    id: "proj_alzheimers_01",
    name: "Alzheimer's Disease & Neuroinflammation",
    description: "Investigating microglial activation, amyloid-beta cascade, and neuroprotective therapeutic avenues in Alzheimer's disease.",
    category: "Biomedical & Healthcare",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    researchQuestion: "What are the primary molecular drivers of neuroinflammation in early-stage Alzheimer's disease?",
    activeStage: "papers",
    savedPapers: [
      {
        id: "openalex_W2995589088",
        title: "Neuroinflammation in Alzheimer's Disease: Current Understanding and Future Directions",
        authors: ["Michael T. Heneka", "Douglas T. Golenbock", "Eicke Latz"],
        year: 2021,
        venue: "Nature Reviews Neurology",
        abstract: "Neuroinflammation is recognized as a key pathological hallmark of Alzheimer's disease alongside amyloid plaques and neurofibrillary tangles. Microglia and astrocytes undergo sustained activation, releasing pro-inflammatory cytokines that exacerbate synaptic loss and neuronal death.",
        doi: "10.1038/s41582-021-00561-2",
        url: "https://doi.org/10.1038/s41582-021-00561-2",
        citationCount: 480,
        source: "OpenAlex",
        isOpenAccess: true,
        topics: ["Alzheimer's Disease", "Neuroinflammation", "Microglia", "Cytokines"],
      },
    ],
    notes: [
      "Focus on TREM2 and NLRP3 inflammasome activation in microglia.",
      "Need to evaluate recent human trial results for disease-modifying therapies.",
    ],
    history: [],
  },
  {
    id: "proj_agentic_rag",
    name: "Autonomous Agentic RAG in Scholarly Discovery",
    description: "Evaluating multi-agent reflection and citation-grounded synthesis across federated academic repositories.",
    category: "AI & Computer Science",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    researchQuestion: "How do multi-agent reflection loops mitigate citation hallucination in automated literature syntheses?",
    activeStage: "synthesis",
    savedPapers: [],
    notes: ["Compare linear RAG against iterative graph exploration."],
    history: [],
  },
];

export function loadAllProjects(): Project[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load projects from storage:", err);
  }

  saveAllProjects(DEFAULT_INITIAL_PROJECTS);
  return DEFAULT_INITIAL_PROJECTS;
}

export function saveAllProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Failed to save projects to storage:", err);
  }
}

export function getActiveProjectId(): string {
  if (typeof window === "undefined") return DEFAULT_INITIAL_PROJECTS[0].id;
  try {
    const active = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (active) return active;
  } catch {}
  return DEFAULT_INITIAL_PROJECTS[0].id;
}

export function setActiveProjectId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch {}
}

export function getActiveProject(): Project {
  const projects = loadAllProjects();
  const activeId = getActiveProjectId();
  const found = projects.find((p) => p.id === activeId);
  return found || projects[0] || DEFAULT_INITIAL_PROJECTS[0];
}

export function saveProject(updatedProject: Project): void {
  const projects = loadAllProjects();
  const next = projects.map((p) =>
    p.id === updatedProject.id ? { ...updatedProject, updatedAt: new Date().toISOString() } : p
  );
  if (!next.some((p) => p.id === updatedProject.id)) {
    next.unshift(updatedProject);
  }
  saveAllProjects(next);
}

export function createNewProject(
  name: string,
  description = "",
  category = "Multidisciplinary",
  researchQuestion = ""
): Project {
  const newProj: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    name: name.trim(),
    description: description.trim(),
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    researchQuestion: researchQuestion.trim() || undefined,
    activeStage: "question",
    savedPapers: [],
    notes: [],
    history: [],
  };

  const projects = loadAllProjects();
  const next = [newProj, ...projects];
  saveAllProjects(next);
  setActiveProjectId(newProj.id);
  return newProj;
}

export function deleteProject(id: string): Project[] {
  const projects = loadAllProjects().filter((p) => p.id !== id);
  saveAllProjects(projects);
  if (getActiveProjectId() === id && projects.length > 0) {
    setActiveProjectId(projects[0].id);
  }
  return projects;
}

export function savePaperToProject(projectId: string, paper: AcademicPaper): Project {
  const projects = loadAllProjects();
  const target = projects.find((p) => p.id === projectId);
  if (!target) return getActiveProject();

  const exists = target.savedPapers.some((p) => p.id === paper.id || p.title === paper.title);
  if (!exists) {
    target.savedPapers = [paper, ...target.savedPapers];
    target.updatedAt = new Date().toISOString();
    saveProject(target);
  }
  return target;
}

export function removePaperFromProject(projectId: string, paperId: string): Project {
  const projects = loadAllProjects();
  const target = projects.find((p) => p.id === projectId);
  if (!target) return getActiveProject();

  target.savedPapers = target.savedPapers.filter((p) => p.id !== paperId);
  target.updatedAt = new Date().toISOString();
  saveProject(target);
  return target;
}

export function updateProjectStage(projectId: string, stage: ResearchStage): Project {
  const projects = loadAllProjects();
  const target = projects.find((p) => p.id === projectId);
  if (!target) return getActiveProject();

  target.activeStage = stage;
  target.updatedAt = new Date().toISOString();
  saveProject(target);
  return target;
}

export function updateProjectStructuredData(
  projectId: string,
  data: {
    researchQuestion?: string;
    literatureReview?: StructuredLiteratureReview;
    researchGaps?: StructuredResearchGap[];
    researchQuestions?: StructuredResearchQuestion[];
    evidenceMatrix?: StructuredEvidenceStudy[];
    manuscriptDraft?: string;
    activeStage?: ResearchStage;
  }
): Project {
  const projects = loadAllProjects();
  const target = projects.find((p) => p.id === projectId);
  if (!target) return getActiveProject();

  if (data.researchQuestion) target.researchQuestion = data.researchQuestion;
  if (data.literatureReview) target.literatureReview = data.literatureReview;
  if (data.researchGaps) target.researchGaps = data.researchGaps;
  if (data.researchQuestions) target.researchQuestions = data.researchQuestions;
  if (data.evidenceMatrix) target.evidenceMatrix = data.evidenceMatrix;
  if (data.manuscriptDraft) target.manuscriptDraft = data.manuscriptDraft;
  if (data.activeStage) target.activeStage = data.activeStage;

  target.updatedAt = new Date().toISOString();
  saveProject(target);
  return target;
}

export function exportProjectContextSummary(project: Project): string {
  const parts: string[] = [];
  parts.push(`Current Project: "${project.name}" (${project.category})`);
  if (project.description) parts.push(`Description: ${project.description}`);
  if (project.researchQuestion) parts.push(`Primary Research Question: ${project.researchQuestion}`);
  if (project.activeStage) parts.push(`Current Lifecycle Stage: ${project.activeStage.toUpperCase()}`);
  if (project.savedPapers.length > 0) {
    parts.push(`Saved Literature Anchor Papers (${project.savedPapers.length}):\n` + 
      project.savedPapers.slice(0, 5).map((p, i) => `  ${i + 1}. "${p.title}" (${p.year}) - ${p.authors.slice(0, 2).join(", ")} [DOI: ${p.doi || "N/A"}]`).join("\n")
    );
  }
  if (project.researchGaps && project.researchGaps.length > 0) {
    parts.push(`Identified Research Gaps (${project.researchGaps.length}):\n` +
      project.researchGaps.map((g, i) => `  Gap ${i + 1} [${g.type}]: "${g.title}" - ${g.description}`).join("\n")
    );
  }
  if (project.researchQuestions && project.researchQuestions.length > 0) {
    parts.push(`Formulated Research Questions (${project.researchQuestions.length}):\n` +
      project.researchQuestions.map((q, i) => `  RQ${i + 1}: "${q.question}" (Hypothesis: ${q.altHypothesis || "N/A"})`).join("\n")
    );
  }
  return parts.join("\n\n");
}
