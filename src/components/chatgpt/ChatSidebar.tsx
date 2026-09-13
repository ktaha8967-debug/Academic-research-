"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChatSession } from "@/lib/chat-store";
import {
  MessageSquare,
  Plus,
  Search,
  BookOpen,
  FolderGit2,
  Network,
  Presentation,
  FileSpreadsheet,
  Users,
  Sliders,
  Trash2,
  Edit2,
  Check,
  X,
  Pin,
  ChevronLeft,
  ChevronRight,
  Database,
  Sparkles,
  Zap,
  FileText,
  Layers,
  Globe,
  FileCode,
  Award,
} from "lucide-react";

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string;
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

  // Filter chats by search
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats chronologically (Today, Yesterday, Previous 7 Days, Older)
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
      <div className="hidden sm:flex flex-col items-center justify-between py-4 px-2 border-r border-border/80 bg-card/90 w-16 h-screen sticky top-0 z-40">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={onNewChat}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Link href="/papers" className="p-2 text-muted-foreground hover:text-foreground" title="Search Papers">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/projects" className="p-2 text-muted-foreground hover:text-foreground" title="Projects">
            <FolderGit2 className="h-4 w-4" />
          </Link>
          <Link href="/settings" className="p-2 text-muted-foreground hover:text-foreground" title="Settings">
            <Sliders className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const renderChatGroup = (title: string, groupChats: ChatSession[]) => {
    if (groupChats.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="px-3 text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wider mb-1">
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
                }}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
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
    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-border/80 bg-card/95 backdrop-blur-md w-64 sm:w-72 h-screen transition-transform duration-300">
      {/* Top Header & New Chat */}
      <div className="p-3 border-b border-border/60">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground">
              Academic<span className="text-primary">AI</span>
            </span>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-between rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Research Chat</span>
          </div>
          <span className="text-[10px] bg-primary-foreground/20 px-1.5 py-0.2 rounded font-mono">⌘N</span>
        </button>

        {/* Search Chat History */}
        <div className="relative mt-2.5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-input bg-background/80 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation Tools List */}
      <div className="px-3 py-2 border-b border-border/50 space-y-0.5 text-xs font-medium">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Research Dashboard</span>
        </Link>
        <Link
          href="/documents"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/documents" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-emerald-500" />
          <span>My Documents & PDFs</span>
        </Link>
        <Link
          href="/datasets"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/datasets" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-indigo-500" />
          <span>Datasets & Benchmarks</span>
        </Link>
        <Link
          href="/disciplines"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/disciplines" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Globe className="h-3.5 w-3.5 text-amber-500" />
          <span>Global Disciplines</span>
        </Link>
        <Link
          href="/latex-studio"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/latex-studio" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileCode className="h-3.5 w-3.5 text-indigo-500" />
          <span>LaTeX & Overleaf Studio</span>
        </Link>
        <Link
          href="/rebuttal-studio"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/rebuttal-studio" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5 text-rose-500" />
          <span>Journal Rebuttal Builder</span>
        </Link>
        <Link
          href="/grant-forge"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/grant-forge" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>Grant Proposal Architect</span>
        </Link>
        <Link
          href="/papers"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/papers" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Database className="h-3.5 w-3.5 text-blue-500" />
          <span>480M+ Paper Explorer</span>
        </Link>
        <Link
          href="/projects"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/projects" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FolderGit2 className="h-3.5 w-3.5 text-amber-500" />
          <span>Project Workspaces</span>
        </Link>
        <Link
          href="/graph"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/graph" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Network className="h-3.5 w-3.5 text-teal-500" />
          <span>Citation Network Graph</span>
        </Link>
        <Link
          href="/poster"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/poster" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Presentation className="h-3.5 w-3.5 text-purple-500" />
          <span>Conference Poster Studio</span>
        </Link>
        <Link
          href="/data-matrix"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/data-matrix" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-500" />
          <span>PRISMA Data Matrix</span>
        </Link>
        <Link
          href="/peer-review"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
            pathname === "/peer-review" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5 text-rose-500" />
          <span>Mock Peer Review</span>
        </Link>
      </div>

      {/* Chat History Groups */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {renderChatGroup("Today", todayChats)}
        {renderChatGroup("Yesterday", yesterdayChats)}
        {renderChatGroup("Previous 7 Days", weekChats)}
        {renderChatGroup("Older Chats", olderChats)}

        {filteredChats.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground px-4">
            No conversations found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* User Profile & SaaS Settings Footer */}
      <div className="p-3 border-t border-border/70 bg-muted/20">
        <Link
          href="/settings"
          className="flex items-center justify-between rounded-xl p-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
              RA
            </div>
            <div>
              <p className="font-bold text-foreground text-xs leading-none">Researcher Account</p>
              <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">
                Free Cloud Open Models
              </span>
            </div>
          </div>
          <Sliders className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </aside>
  );
}
