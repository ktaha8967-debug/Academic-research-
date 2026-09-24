"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChatSession } from "@/lib/chat-store";
import { AgentType, Project } from "@/lib/types";
import {
  BookOpen,
  FolderGit2,
  Plus,
  Search,
  MessageSquare,
  FileText,
  Files,
  Sliders,
  Sparkles,
  Lightbulb,
  HelpCircle,
  ShieldCheck,
  FileSpreadsheet,
  FileCode,
  Users,
  Reply,
  Presentation,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string;
  activeAgentId?: AgentType;
  activeProject?: Project;
  projects?: Project[];
  onSelectProject?: (id: string) => void;
  onCreateProject?: (name: string, description?: string) => void;
  onSelectAgent?: (id: AgentType) => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  activeAgentId = "academic_chat",
  activeProject,
  projects = [],
  onSelectProject,
  onCreateProject,
  onSelectAgent,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showChatHistory, setShowChatHistory] = useState(true);

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartRename = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && onCreateProject) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
      setIsCreatingProject(false);
      setShowProjectDropdown(false);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const lastWeek = today - 86400000 * 7;

  const todayChats: ChatSession[] = [];
  const yesterdayChats: ChatSession[] = [];
  const weekChats: ChatSession[] = [];
  const olderChats: ChatSession[] = [];

  filteredChats.forEach((chat) => {
    const chatTime = new Date(chat.updatedAt || chat.createdAt).getTime();
    if (chatTime >= today) {
      todayChats.push(chat);
    } else if (chatTime >= yesterday) {
      yesterdayChats.push(chat);
    } else if (chatTime >= lastWeek) {
      weekChats.push(chat);
    } else {
      olderChats.push(chat);
    }
  });

  if (!isOpen) {
    return (
      <div className="hidden sm:flex flex-col items-center justify-between py-4 px-2 border-r border-border bg-card w-16 h-screen shrink-0 sticky top-0 z-30">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={onNewChat}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Link href="/projects" className="p-2 text-muted-foreground hover:text-foreground" title="Projects">
            <FolderGit2 className="h-4 w-4" />
          </Link>
          <Link href="/latex-studio" className="p-2 text-muted-foreground hover:text-foreground" title="Manuscript">
            <FileCode className="h-4 w-4" />
          </Link>
          <Link href="/data-matrix" className="p-2 text-muted-foreground hover:text-foreground" title="Evidence Matrix">
            <FileSpreadsheet className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const renderChatGroup = (title: string, groupChats: ChatSession[]) => {
    if (groupChats.length === 0) return null;
    return (
      <div className="mb-2.5">
        <h4 className="px-2.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">
          {title}
        </h4>
        <div className="space-y-0.5">
          {groupChats.map((chat) => {
            const isActive = chat.id === activeChatId && (pathname === "/" || pathname.startsWith("/chat"));
            const isEditing = editingChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  if (pathname !== "/") router.push("/");
                  if (typeof window !== "undefined" && window.innerWidth < 640) onToggle();
                }}
                className={`group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? "bg-muted text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => handleSaveRename(chat.id, e)}
                    className="flex items-center gap-1 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none"
                      autoFocus
                    />
                    <button type="submit" className="p-1 text-emerald-500 hover:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingChatId(null)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(chat, e)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded"
                        title="Rename"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {chats.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 sm:hidden transition-opacity"
        onClick={onToggle}
        aria-label="Close sidebar overlay"
      />

      <aside className="fixed sm:relative inset-y-0 left-0 z-50 sm:z-30 flex flex-col justify-between border-r border-border bg-card w-72 shrink-0 h-screen transition-transform duration-300 shadow-xl sm:shadow-none">
        {/* Top Header & Brand */}
        <div className="p-3 border-b border-border/70 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-xs">
                AI
              </div>
              <span className="font-extrabold text-sm tracking-tight text-foreground">
                Academic<span className="text-primary">AI</span>
              </span>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* ACTIVE PROJECT SELECTOR NEAR TOP */}
          <div className="relative">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1 px-1">
              Active Project
            </label>
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-background/80 hover:bg-muted/70 px-2.5 py-2 text-left transition-colors"
            >
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground truncate">
                  <FolderGit2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{activeProject?.name || "Select Project"}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-muted font-semibold uppercase">
                    {activeProject?.activeStage || "Research"}
                  </span>
                  <span>&bull; {activeProject?.savedPapers?.length || 0} papers</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {showProjectDropdown && (
              <div className="absolute left-0 top-full mt-1 w-full rounded-xl border border-border bg-card p-1.5 shadow-xl z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                  Switch Project
                </div>
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      if (onSelectProject) onSelectProject(proj.id);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                      activeProject?.id === proj.id
                        ? "bg-muted font-bold text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    {activeProject?.id === proj.id && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}

                {isCreatingProject ? (
                  <form onSubmit={handleCreateProjectSubmit} className="pt-1 border-t border-border mt-1">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project title..."
                      className="w-full rounded border border-primary bg-background px-2 py-1 text-xs text-foreground focus:outline-none mb-1"
                      autoFocus
                    />
                    <div className="flex gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCreatingProject(false)}
                        className="px-2 py-0.5 rounded text-[11px] text-muted-foreground hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded text-[11px] bg-primary text-primary-foreground font-semibold"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsCreatingProject(true)}
                    className="w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs text-primary font-semibold hover:bg-muted/50 transition-colors pt-1 border-t border-border mt-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create New Project</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: New Chat & Search */}
          <div className="space-y-1.5">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Research Chat</span>
            </button>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research & chats..."
                className="w-full rounded-lg border border-input bg-background/70 pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Structured Sections Scroll Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {/* SECTION 1: WORKSPACE */}
          <div>
            <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Workspace
            </div>
            <div className="space-y-0.5">
              <Link
                href="/"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/" && activeAgentId === "academic_chat"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Home</span>
              </Link>
              <Link
                href="/projects"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/projects"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FolderGit2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Projects</span>
              </Link>
              <Link
                href="/papers"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/papers"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>My Papers</span>
              </Link>
              <Link
                href="/documents"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/documents"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Files className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Documents</span>
              </Link>
            </div>
          </div>

          {/* SECTION 2: RESEARCH */}
          <div>
            <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Research
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("academic_chat");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "academic_chat" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span>Research Chat</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("find_papers");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "find_papers" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span>Search Papers</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("literature_overview");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "literature_overview" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span>Literature Review</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("research_gaps");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "research_gaps" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                <span>Research Gaps</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("research_questions");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "research_questions" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Research Questions</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: ANALYSIS */}
          <div>
            <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Analysis
            </div>
            <div className="space-y-0.5">
              <Link
                href="/data-matrix"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/data-matrix"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Evidence Matrix</span>
              </Link>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("data_extraction");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "data_extraction" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Data Extraction</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("analysis_foundry");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "analysis_foundry" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Sliders className="h-3.5 w-3.5 shrink-0" />
                <span>Statistical Analysis</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectAgent) onSelectAgent("hallucination_checker");
                  if (pathname !== "/") router.push("/");
                }}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition-colors ${
                  activeAgentId === "hallucination_checker" && pathname === "/"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Citation Check</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: WRITING */}
          <div>
            <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Writing
            </div>
            <div className="space-y-0.5">
              <Link
                href="/latex-studio"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/latex-studio"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FileCode className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Manuscript</span>
              </Link>
              <Link
                href="/peer-review"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/peer-review"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Peer Review</span>
              </Link>
              <Link
                href="/rebuttal-studio"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/rebuttal-studio"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Reply className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Rebuttal</span>
              </Link>
              <Link
                href="/poster"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  pathname === "/poster"
                    ? "bg-muted text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Presentation className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Conference Poster</span>
              </Link>
            </div>
          </div>

          {/* SECTION 5: RECENT CHAT HISTORY (COLLAPSIBLE) */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Recent Chats ({chats.length})
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showChatHistory ? "rotate-180" : ""}`} />
            </button>

            {showChatHistory && (
              <div className="mt-2 space-y-1">
                {renderChatGroup("Today", todayChats)}
                {renderChatGroup("Yesterday", yesterdayChats)}
                {renderChatGroup("Previous 7 Days", weekChats)}
                {renderChatGroup("Older Chats", olderChats)}

                {filteredChats.length === 0 && (
                  <div className="text-center py-4 text-xs text-muted-foreground px-2">
                    No conversations found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate font-medium">OpenAlex &bull; PubMed &bull; arXiv</span>
          </div>
          <Link href="/settings" className="hover:text-foreground font-semibold" title="Settings">
            <Sliders className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
