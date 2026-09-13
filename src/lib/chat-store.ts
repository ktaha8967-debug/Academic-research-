import { AgentType, AcademicPaper, MessageHistoryItem } from "./types";

export interface ChatSession {
  id: string;
  title: string;
  agentId: AgentType;
  createdAt: string;
  updatedAt: string;
  messages: MessageHistoryItem[];
  attachedPapers: AcademicPaper[];
  notes: string[];
  pinned?: boolean;
}

const STORAGE_KEY = "academic_chat_sessions_v2";
const ACTIVE_CHAT_KEY = "academic_active_chat_id_v2";

export function createNewChat(agentId: AgentType = "academic_chat", title = "New Research Chat"): ChatSession {
  const newChat: ChatSession = {
    id: `chat_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    title,
    agentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    attachedPapers: [],
    notes: [],
  };
  return newChat;
}

export function loadAllChats(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load chats:", err);
  }

  // Default initial chat session
  const defaultChat: ChatSession = {
    id: "chat_welcome_01",
    title: "AI Academic Research Assistant",
    agentId: "academic_chat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "msg_welcome_1",
        agentId: "academic_chat",
        role: "assistant",
        content: `### 🎓 Welcome to AcademicAI

I am your **AI Academic Research Assistant**, powered by 100% free cloud open-source models and connected to **480M+ scholarly works** across OpenAlex, arXiv, PubMed, Europe PMC, and Crossref.

#### What we can do together:
* **Search Literature:** Query 480M+ peer-reviewed papers with verified citations & PDF links.
* **Synthesize Reviews:** Generate thematic literature overviews and PRISMA data matrices.
* **Detect Research Gaps:** Uncover unexplored blindspots and formulate testable FINER hypotheses.
* **Mock Peer Review:** Simulate journal reviewer critiques (Reviewers 1, 2, 3) and draft rebuttal letters.
* **Conference Posters:** Design 3-column academic conference posters with 1-click export.

How can I assist your research today?`,
        timestamp: new Date().toISOString(),
      },
    ],
    attachedPapers: [],
    notes: [],
  };

  saveAllChats([defaultChat]);
  return [defaultChat];
}

export function saveAllChats(chats: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (err) {
    console.error("Failed to save chats:", err);
  }
}

export function getActiveChatId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

export function setActiveChatId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_CHAT_KEY, id);
}
