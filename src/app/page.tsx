"use client";

import React, { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chatgpt/ChatSidebar";
import { ChatNavbar } from "@/components/chatgpt/ChatNavbar";
import { ChatInterface } from "@/components/chatgpt/ChatInterface";
import { AgentOutputPanel } from "@/components/chatgpt/AgentOutputPanel";
import { PaperSearchModal } from "@/components/PaperSearchModal";
import { SettingsModal } from "@/components/SettingsModal";
import { AnimatedResearchBackground } from "@/components/AnimatedResearchBackground";
import {
  ChatSession,
  loadAllChats,
  saveAllChats,
  createNewChat,
  getActiveChatId,
  setActiveChatId,
} from "@/lib/chat-store";
import {
  loadAllProjects,
  getActiveProject,
  getActiveProjectId,
  setActiveProjectId,
  saveProject,
  createNewProject,
  savePaperToProject,
  removePaperFromProject,
  updateProjectStage,
  updateProjectStructuredData,
} from "@/lib/project-store";
import {
  AgentType,
  AcademicPaper,
  MessageHistoryItem,
  AIModelConfig,
  Project,
  ResearchStage,
} from "@/lib/types";

export default function ChatGPTDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [executionStep, setExecutionStep] = useState("");
  const [isPaperSearchOpen, setIsPaperSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active Project State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project>(() => getActiveProject());

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    provider: "openai",
    modelName: "academic-pro",
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load chats and projects on mount
  useEffect(() => {
    const loadedChats = loadAllChats();
    setChats(loadedChats);
    const storedActiveChat = getActiveChatId();
    if (storedActiveChat && loadedChats.some((c) => c.id === storedActiveChat)) {
      setActiveChatIdState(storedActiveChat);
    } else if (loadedChats.length > 0) {
      setActiveChatIdState(loadedChats[0].id);
      setActiveChatId(loadedChats[0].id);
    }

    const loadedProjects = loadAllProjects();
    setProjects(loadedProjects);
    const currentProj = getActiveProject();
    setActiveProject(currentProj);
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0] || createNewChat();

  const handleSelectChat = (id: string) => {
    setActiveChatIdState(id);
    setActiveChatId(id);
  };

  const handleNewChat = () => {
    const newChat = createNewChat(activeChat.agentId || "academic_chat", "New Research Chat");
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    saveAllChats(updatedChats);
    setActiveChatIdState(newChat.id);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: string) => {
    if (chats.length <= 1) return;
    const updatedChats = chats.filter((c) => c.id !== id);
    setChats(updatedChats);
    saveAllChats(updatedChats);
    if (activeChatId === id) {
      setActiveChatIdState(updatedChats[0].id);
      setActiveChatId(updatedChats[0].id);
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    const updatedChats = chats.map((c) => (c.id === id ? { ...c, title: newTitle } : c));
    setChats(updatedChats);
    saveAllChats(updatedChats);
  };

  const handleSelectAgent = (agentId: AgentType) => {
    const updatedChats = chats.map((c) =>
      c.id === activeChatId ? { ...c, agentId } : c
    );
    setChats(updatedChats);
    saveAllChats(updatedChats);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    const current = getActiveProject();
    setActiveProject(current);
  };

  const handleCreateProject = (
    name: string,
    description?: string,
    category?: string,
    researchQuestion?: string
  ) => {
    const created = createNewProject(name, description, category, researchQuestion);
    setProjects(loadAllProjects());
    setActiveProject(created);
  };

  const handleUpdateProjectStage = (stage: ResearchStage) => {
    updateProjectStage(activeProject.id, stage);
    setActiveProject(getActiveProject());
  };

  const handleToggleSavePaper = (paper: AcademicPaper) => {
    // 1. Toggle in active project
    const existsInProject = (activeProject.savedPapers || []).some(
      (p) => p.id === paper.id || (p.doi && paper.doi && p.doi === paper.doi) || p.title.toLowerCase() === paper.title.toLowerCase()
    );
    if (existsInProject) {
      removePaperFromProject(activeProject.id, paper.id);
    } else {
      savePaperToProject(activeProject.id, paper);
    }
    const freshProject = getActiveProject();
    setActiveProject(freshProject);

    // 2. Toggle in active chat
    const existsInChat = activeChat.attachedPapers.some((p) => p.id === paper.id || p.title === paper.title);
    let updatedPapers;
    if (existsInChat) {
      updatedPapers = activeChat.attachedPapers.filter((p) => p.id !== paper.id && p.title !== paper.title);
    } else {
      updatedPapers = [paper, ...activeChat.attachedPapers];
    }

    const updatedChats = chats.map((c) =>
      c.id === activeChatId ? { ...c, attachedPapers: updatedPapers } : c
    );
    setChats(updatedChats);
    saveAllChats(updatedChats);
  };

  const handleRemovePaper = (id: string) => {
    removePaperFromProject(activeProject.id, id);
    setActiveProject(getActiveProject());

    const updatedPapers = activeChat.attachedPapers.filter((p) => p.id !== id);
    const updatedChats = chats.map((c) =>
      c.id === activeChatId ? { ...c, attachedPapers: updatedPapers } : c
    );
    setChats(updatedChats);
    saveAllChats(updatedChats);
  };

  const handleSendMessage = async (
    text: string,
    customConfig?: AIModelConfig,
    customDatabases?: string[]
  ) => {
    if (!text.trim() || loading) return;

    const configToUse = customConfig || aiConfig;

    // Auto update chat title from first user query
    let newTitle = activeChat.title;
    if (activeChat.messages.filter((m) => m.role === "user").length === 0) {
      newTitle = text.slice(0, 36) + (text.length > 36 ? "..." : "");
    }

    const userMsg: MessageHistoryItem = {
      id: Math.random().toString(36).substring(7),
      agentId: activeChat.agentId,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...activeChat.messages, userMsg];
    const updatedChats = chats.map((c) =>
      c.id === activeChatId
        ? {
            ...c,
            title: newTitle,
            messages: newMessages,
            updatedAt: new Date().toISOString(),
          }
        : c
    );
    setChats(updatedChats);
    saveAllChats(updatedChats);

    setLoading(true);
    setExecutionStep("Resolving project context and qualifying research request...");

    // Dynamic execution step updates
    const stepTimer1 = setTimeout(() => {
      setExecutionStep("Querying OpenAlex, PubMed, and Europe PMC for peer-reviewed literature...");
    }, 900);
    const stepTimer2 = setTimeout(() => {
      setExecutionStep("Synthesizing evidence, verifying DOIs, and persisting structured outputs...");
    }, 2400);

    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeChat.agentId || "academic_chat",
          userPrompt: text.trim(),
          project: activeProject,
          contextPapers: [
            ...(activeProject?.savedPapers || []),
            ...(activeChat.attachedPapers || []),
          ],
          projectNotes: [
            ...(activeProject?.notes || []),
            ...(activeChat.notes || []),
          ],
          conversationHistory: activeChat.messages || [],
          config: configToUse,
          selectedDatabases: customDatabases,
        }),
      });

      clearTimeout(abortTimeout);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (data.success) {
        // Persist structured agent outputs into active project
        if (data.structuredData) {
          updateProjectStructuredData(activeProject.id, {
            literatureReview: data.structuredData.literatureReview,
            researchGaps: data.structuredData.researchGaps || data.structuredData.gaps,
            researchQuestions: data.structuredData.researchQuestions || data.structuredData.questions,
            evidenceMatrix: data.structuredData.evidenceMatrix || data.structuredData.evidence,
          });
          setActiveProject(getActiveProject());
        }

        const assistantMsg: MessageHistoryItem = {
          id: Math.random().toString(36).substring(7),
          agentId: activeChat.agentId || "academic_chat",
          role: "assistant",
          content: data.content,
          structuredData: data.structuredData,
          sources: (data.sources && data.sources.length > 0) ? data.sources : (activeChat.attachedPapers || []).slice(0, data.sourcesUsed || 0),
          followUpQuestions: data.followUpQuestions,
          timestamp: data.timestamp,
        };

        const finalChats = chats.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                title: newTitle,
                messages: [...newMessages, assistantMsg],
                updatedAt: new Date().toISOString(),
              }
            : c
        );
        setChats(finalChats);
        saveAllChats(finalChats);
      } else {
        const errorMsg: MessageHistoryItem = {
          id: Math.random().toString(36).substring(7),
          agentId: activeChat.agentId,
          role: "assistant",
          content: `⚠️ **Agent Error**: ${data.error || "Failed to process research request."} Please click Retry Query below.`,
          timestamp: new Date().toISOString(),
        };
        const finalChats = chats.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [...newMessages, errorMsg],
                updatedAt: new Date().toISOString(),
              }
            : c
        );
        setChats(finalChats);
        saveAllChats(finalChats);
      }
    } catch (err: any) {
      clearTimeout(abortTimeout);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      const isTimeout = err?.name === "AbortError" || err?.message?.includes("aborted");
      const errorMsg: MessageHistoryItem = {
        id: Math.random().toString(36).substring(7),
        agentId: activeChat.agentId,
        role: "assistant",
        content: isTimeout
          ? `⚠️ **Request Timed Out**: The academic search or AI model took longer than usual. Click **Retry Query** below to re-submit.`
          : `⚠️ **Connection Error**: ${err?.message || "Could not reach agent service."} Click **Retry Query** below to re-submit.`,
        timestamp: new Date().toISOString(),
      };
      const finalChats = chats.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...newMessages, errorMsg],
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setChats(finalChats);
      saveAllChats(finalChats);
    } finally {
      setLoading(false);
      setExecutionStep("");
    }
  };

  const handleChainAgent = (newAgentId: AgentType, promptText: string) => {
    handleSelectAgent(newAgentId);
    handleSendMessage(promptText);
  };

  const latestAssistantMessage = [...activeChat.messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Global Interactive Academic Neural Canvas Engine (Strictly Solid Colors, No Gradients) */}
      <AnimatedResearchBackground />

      {/* 1. Left Sidebar: Academic Research Workspace Navigation & Active Project */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        activeAgentId={activeChat.agentId}
        activeProject={activeProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onSelectAgent={handleSelectAgent}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 2. Middle Column: Chat Conversation Stream & Input */}
      <div className="flex flex-1 flex-col h-full overflow-hidden transition-all duration-300">
        {/* Top Navbar */}
        <ChatNavbar
          activeAgent={activeChat.agentId}
          activeProject={activeProject}
          onSelectAgent={handleSelectAgent}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearchPapers={() => setIsPaperSearchOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          attachedPapersCount={(activeProject?.savedPapers?.length || 0) + activeChat.attachedPapers.length}
          isRightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        />

        {/* Message Stream & Floating Input Bar */}
        <ChatInterface
          agentId={activeChat.agentId}
          messages={activeChat.messages}
          attachedPapers={activeChat.attachedPapers}
          activeProject={activeProject}
          onSendMessage={handleSendMessage}
          loading={loading}
          executionStep={executionStep}
          onOpenSearchPapers={() => setIsPaperSearchOpen(true)}
          onRemovePaper={handleRemovePaper}
          onToggleSavePaper={handleToggleSavePaper}
          onUpdateProjectStage={handleUpdateProjectStage}
          onChainAgent={handleChainAgent}
          aiConfig={aiConfig}
          onUpdateAiConfig={setAiConfig}
          isRightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          onRetryMessage={handleSendMessage}
        />
      </div>

      {/* 3. Right Column: Research Context Panel */}
      <AgentOutputPanel
        activeAgentId={activeChat.agentId}
        lastAssistantMessage={latestAssistantMessage}
        attachedPapers={activeChat.attachedPapers}
        activeProject={activeProject}
        onToggleSavePaper={handleToggleSavePaper}
        isOpen={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        onOpenSearchPapers={() => setIsPaperSearchOpen(true)}
        aiConfig={aiConfig}
        loading={loading}
        executionStep={executionStep}
      />

      {/* Modals */}
      <PaperSearchModal
        isOpen={isPaperSearchOpen}
        onClose={() => setIsPaperSearchOpen(false)}
        savedPapers={activeProject?.savedPapers || activeChat.attachedPapers}
        onToggleSavePaper={handleToggleSavePaper}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSaveConfig={setAiConfig}
      />
    </div>
  );
}

