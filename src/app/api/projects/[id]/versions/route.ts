import { NextRequest, NextResponse } from "next/server";
import { getDB, initDB } from "@/lib/db/client";
import { checkRateLimit, validateProjectId, validateCanvasData } from "@/lib/security";

// GET /api/projects/[id]/versions
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = checkRateLimit(req);
  if (rl) return rl;

  const idCheck = validateProjectId(params.id);
  if (!idCheck.valid) return NextResponse.json({ error: idCheck.error }, { status: 400 });

  try {
    await initDB();
    const db = getDB();
    const result = await db.execute({
      sql: "SELECT id, version, change_description, created_at FROM project_versions WHERE project_id = ? ORDER BY version DESC",
      args: [params.id],
    });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET versions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/projects/[id]/versions
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = checkRateLimit(req, { maxRequests: 20, windowMs: 60_000, keyPrefix: 'create-version' });
  if (rl) return rl;

  const idCheck = validateProjectId(params.id);
  if (!idCheck.valid) return NextResponse.json({ error: idCheck.error }, { status: 400 });

  try {
    await initDB();
    const db = getDB();
    const body = await req.json();

    const canvasCheck = validateCanvasData(body.canvasData);
    if (!canvasCheck.valid) return NextResponse.json({ error: canvasCheck.error }, { status: 400 });

    // description 길이 제한
    const description = typeof body.description === 'string' ? body.description.slice(0, 500) : null;

    // Get next version number
    const lastVersion = await db.execute({
      sql: "SELECT COALESCE(MAX(version), 0) as max_ver FROM project_versions WHERE project_id = ?",
      args: [params.id],
    });
    const nextVersion = (Number(lastVersion.rows[0].max_ver) || 0) + 1;

    await db.execute({
      sql: "INSERT INTO project_versions (project_id, version, canvas_data, change_description) VALUES (?, ?, ?, ?)",
      args: [params.id, nextVersion, body.canvasData || "", description],
    });

    return NextResponse.json({ version: nextVersion }, { status: 201 });
  } catch (error) {
    console.error("POST version error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
