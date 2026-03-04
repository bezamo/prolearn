import { sql, ok, err, cors } from "./_utils.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };

  // Protect with a secret so only you can run this
  const { secret } = JSON.parse(event.body || "{}");
  if (secret !== process.env.INIT_SECRET) return err("Unauthorized", 401);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email       TEXT UNIQUE NOT NULL,
        name        TEXT NOT NULL DEFAULT '',
        role        TEXT NOT NULL DEFAULT 'agent',   -- superadmin | admin | agent
        client_id   TEXT,                             -- links to clients table
        password_hash TEXT,
        status      TEXT NOT NULL DEFAULT 'pending', -- pending | active
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email       TEXT NOT NULL,
        name        TEXT NOT NULL DEFAULT '',
        role        TEXT NOT NULL DEFAULT 'agent',
        client_id   TEXT,
        token       TEXT UNIQUE NOT NULL,
        invited_by  UUID REFERENCES users(id),
        expires_at  TIMESTAMPTZ NOT NULL,
        used_at     TIMESTAMPTZ,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT NOT NULL,
        color       TEXT DEFAULT '#0EA5A0',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    return ok({ message: "Database initialized successfully" });
  } catch (e) {
    console.error(e);
    return err(e.message, 500);
  }
};
