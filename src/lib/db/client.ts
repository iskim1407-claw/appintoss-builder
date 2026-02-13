import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getDB(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  }

  client = createClient({ url, authToken });
  return client;
}

export async function initDB(): Promise<void> {
  const db = getDB();
  
  await db.batch([
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      canvas_data TEXT NOT NULL DEFAULT '',
      app_info TEXT,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS project_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      canvas_data TEXT NOT NULL,
      change_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS exports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      app_name TEXT,
      status TEXT DEFAULT 'draft',
      submitted_at DATETIME,
      result_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ]);
}
