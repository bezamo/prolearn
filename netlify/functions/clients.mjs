import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const method = req.method;

  if (method === "GET") {
    const rows = await sql(
      `SELECT c.*,
       COUNT(DISTINCT u.id) as agent_count,
       COUNT(DISTINCT m.id) as module_count
       FROM clients c
       LEFT JOIN users u ON u.client_id = c.id AND u.role = 'agent'
       LEFT JOIN modules m ON m.client_id = c.id
       WHERE c.is_active = true
       GROUP BY c.id
       ORDER BY c.name`
    );
    return jsonOk(rows);
  }

  if (user.role !== "admin") return jsonError("Forbidden", 403);

  if (method === "POST") {
    const { name, color, description } = await req.json();
    const rows = await sql(
      "INSERT INTO clients (name, color, description) VALUES ($1,$2,$3) RETURNING *",
      [name, color || "#6366f1", description]
    );
    return jsonOk(rows[0], 201);
  }

  if (method === "PUT") {
    const { id, name, color, description } = await req.json();
    const rows = await sql(
      "UPDATE clients SET name=$1, color=$2, description=$3 WHERE id=$4 RETURNING *",
      [name, color, description, id]
    );
    return jsonOk(rows[0]);
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/clients" };
