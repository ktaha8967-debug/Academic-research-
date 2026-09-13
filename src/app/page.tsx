"use client";

import React, { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chatgpt/ChatSidebar";
import { ChatNavbar } from "@/components/chatgpt/ChatNavbar";
import { ChatInterface } from "@/components/chatgpt/ChatInterface";
import { PaperSearchModal } from "@/components/PaperSearchModal";
import { SettingsModal } from "@/components/SettingsModal";
import {
  ChatSession,
  loadAllChats,
  saveAllChats,
  createNewChat,
  getActiveChatId,
  setActiveChatId,
} from "@/lib/chat-store";
import { AgentType, AcademicPaper, MessageHistoryItem, AIModelConfig } from "@/lib/types";

export default function ChatGPTDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [executionStep, setExecutionStep] = useState("");
  const [isPaperSearchOpen, setIsPaperSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    provider: "fallback",
    modelName: "llama-3.3-70b-versatile",
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load chats on mount
  useEffect(() => {
    const loaded = loadAllChats();
    setChats(loaded);
    const storedActive = getActiveChatId();
    if (storedActive && loaded.some((c) => c.id === storedActive)) {
      setActiveChatIdState(storedActive);
    } else if (loaded.length > 0) {
      setActiveChatIdState(loaded[0].id);
      setActiveChatId(loaded[0].id);
    }
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

  const handleToggleSavePaper = (paper: AcademicPaper) => {
    const exists = activeChat.attachedPapers.some((p) => p.id === paper.id || p.title === paper.title);
    let updatedPapers;
    if (exists) {
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
    const updatedPapers = activeChat.attachedPapers.filter((p) => p.id !== id);
    const updatedChats = chats.map((c) =>
      c.id === activeChatId ? { ...c, attachedPapers: updatedPapers } : c
    );
    setChats(updatedChats);
    saveAllChats(updatedChats);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

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
    const isAcademicWorkflow = activeChat.attachedPapers.length > 0 || (activeChat.agentId && activeChat.agentId !== "academic_chat");
    setExecutionStep(isAcademicWorkflow ? "Synthesizing research context..." : "Thinking...");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeChat.agentId,
          userPrompt: text.trim(),
          contextPapers: activeChat.attachedPapers,
          projectNotes: activeChat.notes,
          conversationHistory: activeChat.messages,
          config: aiConfig,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: MessageHistoryItem = {
          id: Math.random().toString(36).substring(7),
          agentId: activeChat.agentId,
          role: "assistant",
          content: data.content,
          structuredData: data.structuredData,
          sources: activeChat.attachedPapers.slice(0, data.sourcesUsed || 0),
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
          content: `⚠️ **Agent Error**: ${data.error || "Failed to process research request."}`,
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
      const errorMsg: MessageHistoryItem = {
        id: Math.random().toString(36).substring(7),
        agentId: activeChat.agentId,
        role: "assistant",
        content: `⚠️ **Connection Error**: ${err?.message || "Could not reach agent service."}`,
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ChatGPT Left Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Container */}
      <div className={`flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ${sidebarOpen ? "sm:pl-64" : ""}`}>
        {/* ChatGPT Top Navbar */}
        <ChatNavbar
          activeAgent={activeChat.agentId}
          onSelectAgent={handleSelectAgent}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearchPapers={() => setIsPaperSearchOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          attachedPapersCount={activeChat.attachedPapers.length}
        />

        {/* ChatGPT Message Stream & Floating Input Bar */}
        <ChatInterface
          agentId={activeChat.agentId}
          messages={activeChat.messages}
          attachedPapers={activeChat.attachedPapers}
          onSendMessage={handleSendMessage}
          loading={loading}
          executionStep={executionStep}
          onOpenSearchPapers={() => setIsPaperSearchOpen(true)}
          onRemovePaper={handleRemovePaper}
          onChainAgent={handleChainAgent}
          aiConfig={aiConfig}
        />
      </div>

      {/* Modals */}
      <PaperSearchModal
        isOpen={isPaperSearchOpen}
        onClose={() => setIsPaperSearchOpen(false)}
        savedPapers={activeChat.attachedPapers}
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
