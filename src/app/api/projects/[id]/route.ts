import { NextRequest, NextResponse } from "next/server";
import { getDB, initDB } from "@/lib/db/client";
import { checkRateLimit, validateProjectId, validateProjectName, validateCanvasData } from "@/lib/security";

// GET /api/projects/[id]
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
      sql: "SELECT * FROM projects WHERE id = ?",
      args: [params.id],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/projects/[id]
export async function PUT(
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
    const body = await req.json();
    const { name, canvasData, appInfo, thumbnail } = body;

    // Validate inputs
    if (name !== undefined) {
      const nameCheck = validateProjectName(name);
      if (!nameCheck.valid) return NextResponse.json({ error: nameCheck.error }, { status: 400 });
    }
    if (canvasData !== undefined) {
      const canvasCheck = validateCanvasData(canvasData);
      if (!canvasCheck.valid) return NextResponse.json({ error: canvasCheck.error }, { status: 400 });
    }

    const sets: string[] = [];
    const args: (string | null)[] = [];

    if (name !== undefined) { sets.push("name = ?"); args.push(name); }
    if (canvasData !== undefined) { sets.push("canvas_data = ?"); args.push(canvasData); }
    if (appInfo !== undefined) { sets.push("app_info = ?"); args.push(appInfo); }
    if (thumbnail !== undefined) { sets.push("thumbnail = ?"); args.push(thumbnail); }
    
    if (sets.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    sets.push("updated_at = CURRENT_TIMESTAMP");
    args.push(params.id);

    await db.execute({
      sql: `UPDATE projects SET ${sets.join(", ")} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
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
    await db.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [params.id],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
