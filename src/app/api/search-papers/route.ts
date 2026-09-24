import { NextRequest, NextResponse } from "next/server";
import { searchAcademicPapers } from "@/lib/academic-search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("query");
    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const papers = await searchAcademicPapers({
      query: query.trim(),
      databases: ["openalex", "arxiv", "pubmed", "europepmc", "crossref", "semanticscholar"],
      limit,
    });
    return NextResponse.json({ success: true, count: papers.length, papers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to search papers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, databases, limit, openAccessOnly, yearFrom, yearTo } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const papers = await searchAcademicPapers({
      query: query.trim(),
      databases: (Array.isArray(databases) && databases.length > 0)
        ? databases
        : ["openalex", "arxiv", "pubmed", "europepmc", "crossref", "semanticscholar"],
      limit: limit || 16,
      openAccessOnly: Boolean(openAccessOnly),
      yearFrom: typeof yearFrom === "number" ? yearFrom : undefined,
      yearTo: typeof yearTo === "number" ? yearTo : undefined,
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
