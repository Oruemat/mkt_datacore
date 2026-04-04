import { NextRequest, NextResponse } from "next/server";
import { saveDesignChange, analyzeDesignPatterns } from "@/lib/agent/design-changes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, source, action, contentType, template, changes, before } = body;

    if (!sessionId || !source || !action || !contentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await saveDesignChange({
      sessionId,
      source,
      action,
      contentType,
      template: template || null,
      changes: changes || {},
      before: before || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const analysis = await analyzeDesignPatterns();
    return NextResponse.json(analysis);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
