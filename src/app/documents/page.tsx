"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadUserDocuments,
  saveUserDocuments,
  addUserDocument,
  updateUserDocument,
  deleteUserDocument,
} from "@/lib/documents-store";
import { createNewChat, saveAllChats, loadAllChats, setActiveChatId } from "@/lib/chat-store";
import { UserDocument } from "@/lib/types";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Star,
  BookOpen,
  Trash2,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  ArrowRight,
  Bot,
  Sparkles,
  Layers,
  FileCode,
  Tag,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Maximize2,
  FileSpreadsheet,
} from "lucide-react";

export default function DocumentsHubPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [activeDoc, setActiveDoc] = useState<UserDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [docNotes, setDocNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = loadUserDocuments();
    setDocuments(loaded);
    if (loaded.length > 0) {
      setActiveDoc(loaded[0]);
      setDocNotes(loaded[0].notes || "");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

      const newDoc = addUserDocument({
        title: cleanTitle,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.name.endsWith(".docx") ? "docx" : file.name.endsWith(".bib") ? "bib" : file.name.endsWith(".txt") ? "txt" : "pdf",
        fullText: text || `Full text extracted from uploaded file: ${file.name}. This document is ready for multi-agent synthesis, data extraction, and academic citation.`,
        authors: ["Uploaded Document Author"],
        readingStatus: "to_read",
        tags: ["Uploaded", "Research Workspace"],
      });

      const updated = loadUserDocuments();
      setDocuments(updated);
      setActiveDoc(newDoc);
      setDocNotes(newDoc.notes || "");
    };

    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".bib")) {
      reader.readAsText(file);
    } else {
      // For PDFs/DOCX, simulate text extraction
      reader.readAsText(file.slice(0, 50000));
    }
  };

  const handleStatusChange = (id: string, newStatus: UserDocument["readingStatus"]) => {
    const updated = updateUserDocument(id, { readingStatus: newStatus });
    setDocuments(updated);
    if (activeDoc?.id === id) {
      setActiveDoc({ ...activeDoc, readingStatus: newStatus });
    }
  };

  const handleSaveNotes = () => {
    if (!activeDoc) return;
    const updated = updateUserDocument(activeDoc.id, { notes: docNotes });
    setDocuments(updated);
    setActiveDoc({ ...activeDoc, notes: docNotes });
    setCopiedId("notes_saved");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteDoc = (id: string) => {
    const updated = deleteUserDocument(id);
    setDocuments(updated);
    if (activeDoc?.id === id) {
      setActiveDoc(updated[0] || null);
    }
  };

  const handleChatWithDoc = (doc: UserDocument) => {
    // Create new chat with this document pre-attached
    const newChat = createNewChat(
      "academic_chat",
      `Chat: ${doc.title.slice(0, 25)}...`
    );
    newChat.attachedPapers = [
      {
        id: doc.id,
        title: doc.title,
        authors: doc.authors || ["Author"],
        year: 2024,
        abstract: doc.abstract || doc.fullText.slice(0, 300),
        source: "OpenAlex",
        venue: "Uploaded Document",
      },
    ];
    newChat.notes = [`User Document: ${doc.title}\n${doc.abstract || ""}`];

    const currentChats = loadAllChats();
    const updatedChats = [newChat, ...currentChats];
    saveAllChats(updatedChats);
    setActiveChatId(newChat.id);
    router.push("/");
  };

  const allTags = Array.from(new Set(documents.flatMap((d) => d.tags)));

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.abstract || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || doc.readingStatus === statusFilter;

    const matchesTag = selectedTag === "all" || doc.tags.includes(selectedTag);

    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            A
          </Link>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              <span>Research Documents & PDF Library</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Ingest, annotate, extract sections, and chat with your uploaded papers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.bib"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Document</span>
          </button>

          <Link
            href="/"
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1"
          >
            <Bot className="h-3.5 w-3.5 text-primary" />
            <span>Back to Chat</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Body: 2-Column Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Document List & Filters */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-border bg-card/40 shrink-0 overflow-hidden">
          {/* Search & Filters Header */}
          <div className="p-3.5 border-b border-border space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents by title, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Reading Status Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
              {[
                { id: "all", label: "All Docs" },
                { id: "starred", label: "Starred ⭐" },
                { id: "in_progress", label: "Reading 📖" },
                { id: "to_read", label: "To Read ⏳" },
                { id: "completed", label: "Completed ✅" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    statusFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tags Scroll */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] pt-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold shrink-0">Tags:</span>
                <button
                  onClick={() => setSelectedTag("all")}
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                    selectedTag === "all" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      selectedTag === tag ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Document Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-foreground">No documents match your filter</p>
                <p className="text-[11px] text-muted-foreground mt-1">Upload a PDF or adjust your search terms</p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDoc(doc);
                    setDocNotes(doc.notes || "");
                  }}
                  className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    activeDoc?.id === doc.id
                      ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                        {doc.fileType.toUpperCase()} • {doc.fileSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(doc.id, doc.readingStatus === "starred" ? "to_read" : "starred");
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          doc.readingStatus === "starred"
                            ? "text-amber-400"
                            : "text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                        }`}
                        title="Star Document"
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-xs text-foreground mt-2 leading-snug line-clamp-2">
                    {doc.title}
                  </h3>

                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {doc.abstract || doc.fullText}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{doc.authors?.slice(0, 2).join(", ") || "Scholar"}</span>
                    <span>{doc.pageCount} Pages</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Full Document Reader & Section Inspector */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {activeDoc ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Document Header Panel */}
              <div className="p-6 border-b border-border bg-card/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] uppercase">
                      {activeDoc.fileType.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Uploaded {new Date(activeDoc.uploadedAt).toLocaleDateString()} • {activeDoc.fileSize}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-foreground leading-tight">
                    {activeDoc.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    <strong>Authors:</strong> {activeDoc.authors?.join(", ") || "Research Scholar"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleChatWithDoc(activeDoc)}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all"
                  >
                    <Bot className="h-4 w-4" />
                    <span>Chat with Document</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDoc(activeDoc.id)}
                    className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Document Content Scroll View */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
                {/* Abstract Section */}
                {activeDoc.abstract && (
                  <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Executive Abstract</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                      "{activeDoc.abstract}"
                    </p>
                  </div>
                )}

                {/* Key Findings Callout */}
                {activeDoc.extractedKeyFindings && activeDoc.extractedKeyFindings.length > 0 && (
                  <div className="p-4 rounded-2xl border border-border bg-card">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Key Extracted Findings</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {activeDoc.extractedKeyFindings.map((finding, idx) => (
                        <li key={idx} className="text-xs text-foreground/90 flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extracted Sections Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>Document Sections ({activeDoc.sections.length})</span>
                  </h3>

                  {activeDoc.sections.map((sec) => (
                    <div key={sec.id} className="p-4 rounded-2xl border border-border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-foreground">{sec.title}</h4>
                        {sec.pageNumber && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Page {sec.pageNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* User Notes Notepad */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-primary" />
                      <span>My Research Notes & Annotations</span>
                    </h3>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1"
                    >
                      {copiedId === "notes_saved" ? (
                        <>
                          <Check className="h-3 w-3" /> <span>Saved!</span>
                        </>
                      ) : (
                        <span>Save Notes</span>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={docNotes}
                    onChange={(e) => setDocNotes(e.target.value)}
                    placeholder="Write your research reflections, experimental critique, or thesis notes on this paper..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-12 w-12 text-muted-foreground opacity-40 mb-3" />
              <h3 className="font-bold text-base text-foreground">Select or upload a research document</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Upload PDFs, Word files, or BibTeX files to extract sections and chat with your literature.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
