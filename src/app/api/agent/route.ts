import { NextRequest, NextResponse } from "next/server";
import { executeAutonomousBrain } from "@/lib/brain-engine";
import { AgentType, AcademicPaper, AIModelConfig, MessageHistoryItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentId,
      userPrompt,
      contextPapers = [],
      attachedDocIds = [],
      projectNotes = [],
      conversationHistory = [],
      config,
      selectedDatabases,
    }: {
      agentId: AgentType;
      userPrompt: string;
      contextPapers?: AcademicPaper[];
      attachedDocIds?: string[];
      projectNotes?: string[];
      conversationHistory?: MessageHistoryItem[];
      config?: AIModelConfig;
      selectedDatabases?: string[];
    } = body;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return NextResponse.json({ error: "userPrompt is required" }, { status: 400 });
    }

    const resolvedAgentId: AgentType = agentId || "academic_chat";

    const brainResult = await executeAutonomousBrain({
      agentId: resolvedAgentId,
      userPrompt: userPrompt.trim(),
      attachedPapers: contextPapers,
      attachedDocIds,
      projectNotes,
      conversationHistory,
      config,
      selectedDatabases,
    });

    return NextResponse.json({
      success: true,
      agentId,
      intent: brainResult.intent,
      content: brainResult.content,
      structuredData: brainResult.structuredData,
      sources: brainResult.sources,
      sourcesUsed: brainResult.sources.length,
      datasets: brainResult.datasets,
      referencedDocs: brainResult.referencedDocs,
      executionTimeMs: brainResult.executionTimeMs,
      confidenceScore: brainResult.confidenceScore,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Brain execution error:", err);
    return NextResponse.json(
      { error: "Brain execution failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
