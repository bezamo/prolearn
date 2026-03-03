import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const method = req.method;
  const url = new URL(req.url);

  if (method === "GET") {
    const agentId = url.searchParams.get("agentId");
    if (!agentId) return jsonError("agentId required", 400);
    if (user.role === "agent" && agentId !== user.userId) return jsonError("Forbidden", 403);

    const rows = await sql(
      `SELECT a.*, m.title as module_title, m.status as module_status,
       c.name as client_name, c.color as client_color
       FROM assignments a
       JOIN modules m ON a.module_id = m.id
       LEFT JOIN clients c ON m.client_id = c.id
       WHERE a.agent_id = $1
       ORDER BY a.assigned_at DESC`,
      [agentId]
    );
    return jsonOk(rows);
  }

  if (user.role !== "admin") return jsonError("Forbidden", 403);

  if (method === "POST") {
    const { agentId, moduleId, dueDate } = await req.json();
    const rows = await sql(
      `INSERT INTO assignments (agent_id, module_id, assigned_by, due_date)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (agent_id, module_id) DO NOTHING
       RETURNING *`,
      [agentId, moduleId, user.userId, dueDate || null]
    );
    return jsonOk(rows[0] || { message: "Already assigned" }, 201);
  }

  if (method === "DELETE") {
    const { agentId, moduleId } = await req.json();
    await sql("DELETE FROM assignments WHERE agent_id=$1 AND module_id=$2", [agentId, moduleId]);
    return jsonOk({ success: true });
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/assignments" };
