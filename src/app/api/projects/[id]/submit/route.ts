import { NextRequest, NextResponse } from "next/server";
import { getDB, initDB } from "@/lib/db/client";
import { checkRateLimit, validateProjectId, validateAppName } from "@/lib/security";

// POST /api/projects/[id]/submit
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = checkRateLimit(req, { maxRequests: 5, windowMs: 60_000, keyPrefix: 'submit' });
  if (rl) return rl;

  const idCheck = validateProjectId(params.id);
  if (!idCheck.valid) return NextResponse.json({ error: idCheck.error }, { status: 400 });

  try {
    await initDB();
    const db = getDB();
    const body = await req.json();

    // Validate appName if provided
    if (body.appName) {
      const appNameCheck = validateAppName(body.appName);
      if (!appNameCheck.valid) return NextResponse.json({ error: appNameCheck.error }, { status: 400 });
    }

    // Validate status
    const allowedStatuses = ['draft', 'submitted', 'reviewing', 'approved', 'rejected'];
    const status = allowedStatuses.includes(body.status) ? body.status : 'submitted';

    // notes 길이 제한
    const notes = typeof body.notes === 'string' ? body.notes.slice(0, 2000) : null;

    await db.execute({
      sql: `INSERT INTO submissions (project_id, app_name, status, submitted_at, notes) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      args: [params.id, body.appName || null, status, notes],
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
