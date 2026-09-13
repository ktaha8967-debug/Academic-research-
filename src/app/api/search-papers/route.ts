import { NextRequest, NextResponse } from "next/server";
import { searchAcademicPapers } from "@/lib/academic-search";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, databases, limit } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const papers = await searchAcademicPapers({
      query: query.trim(),
      databases: databases || ["openalex", "arxiv", "crossref"],
      limit: limit || 15,
    });

    return NextResponse.json({
      success: true,
      query,
      count: papers.length,
      papers,
    });
  } catch (err: any) {
    console.error("API search-papers error:", err);
    return NextResponse.json(
      { error: "Failed to fetch academic papers", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
