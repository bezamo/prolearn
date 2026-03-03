import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const method = req.method;

  // GET - admin lists all signatures, agent sees their own
  if (method === "GET") {
    if (user.role === "admin") {
      const rows = await sql(
        `SELECT ack.*, 
         u.first_name, u.last_name, u.email,
         m.title as module_title,
         c.name as client_name
         FROM acknowledgments ack
         JOIN users u ON ack.agent_id = u.id
         JOIN modules m ON ack.module_id = m.id
         LEFT JOIN clients c ON m.client_id = c.id
         ORDER BY ack.signed_at DESC`
      );
      return jsonOk(rows);
    } else {
      const rows = await sql(
        `SELECT ack.*, m.title as module_title, c.name as client_name
         FROM acknowledgments ack
         JOIN modules m ON ack.module_id = m.id
         LEFT JOIN clients c ON m.client_id = c.id
         WHERE ack.agent_id = $1
         ORDER BY ack.signed_at DESC`,
        [user.userId]
      );
      return jsonOk(rows);
    }
  }

  // POST - agent submits acknowledgment
  if (method === "POST") {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const { moduleId, fullName, signatureData } = await req.json();

    if (!signatureData || !fullName || !moduleId) {
      return jsonError("fullName, moduleId and signatureData are required", 400);
    }

    const rows = await sql(
      `INSERT INTO acknowledgments (agent_id, module_id, full_name, signature_data, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (agent_id, module_id) DO UPDATE SET full_name=$3, signature_data=$4, signed_at=NOW()
       RETURNING *`,
      [user.userId, moduleId, fullName, signatureData, ip, userAgent]
    );

    return jsonOk(rows[0], 201);
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/signatures" };
