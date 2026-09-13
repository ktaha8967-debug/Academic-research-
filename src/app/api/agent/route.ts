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
    }: {
      agentId: AgentType;
      userPrompt: string;
      contextPapers?: AcademicPaper[];
      attachedDocIds?: string[];
      projectNotes?: string[];
      conversationHistory?: MessageHistoryItem[];
      config?: AIModelConfig;
    } = body;

    if (!userPrompt || !agentId) {
      return NextResponse.json({ error: "agentId and userPrompt are required" }, { status: 400 });
    }

    const brainResult = await executeAutonomousBrain({
      agentId,
      userPrompt,
      attachedPapers: contextPapers,
      attachedDocIds,
      projectNotes,
      conversationHistory,
      config,
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
