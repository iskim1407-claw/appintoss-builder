import { NextRequest, NextResponse } from "next/server";
import { getDB, initDB } from "@/lib/db/client";
import { checkRateLimit, validateProjectId } from "@/lib/security";

// POST /api/projects/[id]/export
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = checkRateLimit(req, { maxRequests: 10, windowMs: 60_000, keyPrefix: 'export' });
  if (rl) return rl;

  const idCheck = validateProjectId(params.id);
  if (!idCheck.valid) return NextResponse.json({ error: idCheck.error }, { status: 400 });

  try {
    await initDB();
    const db = getDB();
    const body = await req.json();

    if (!body.type || !["html", "sdk", "submit"].includes(body.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await db.execute({
      sql: "INSERT INTO exports (project_id, type) VALUES (?, ?)",
      args: [params.id, body.type],
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
