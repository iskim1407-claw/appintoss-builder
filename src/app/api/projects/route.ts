import { NextRequest, NextResponse } from "next/server";
import { getDB, initDB } from "@/lib/db/client";
import { checkRateLimit, validateProjectName, validateCanvasData, validateProjectId } from "@/lib/security";

// GET /api/projects — 목록
export async function GET(req: NextRequest) {
  const rl = checkRateLimit(req);
  if (rl) return rl;

  try {
    await initDB();
    const db = getDB();
    const result = await db.execute(
      `SELECT id, name, app_info, thumbnail, created_at, updated_at,
        (SELECT COUNT(*) FROM exports e WHERE e.project_id = p.id) as export_count
       FROM projects p ORDER BY updated_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/projects — 생성
export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, { maxRequests: 5, windowMs: 60_000, keyPrefix: 'create-project' });
  if (rl) return rl;

  try {
    await initDB();
    const db = getDB();
    const body = await req.json();
    const { id, name, canvasData, appInfo, thumbnail } = body;

    // Input validation
    const idCheck = validateProjectId(id);
    if (!idCheck.valid) return NextResponse.json({ error: idCheck.error }, { status: 400 });

    const nameCheck = validateProjectName(name);
    if (!nameCheck.valid) return NextResponse.json({ error: nameCheck.error }, { status: 400 });

    const canvasCheck = validateCanvasData(canvasData);
    if (!canvasCheck.valid) return NextResponse.json({ error: canvasCheck.error }, { status: 400 });

    await db.execute({
      sql: `INSERT INTO projects (id, name, canvas_data, app_info, thumbnail) VALUES (?, ?, ?, ?, ?)`,
      args: [id, name, canvasData || "", appInfo || null, thumbnail || null],
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
