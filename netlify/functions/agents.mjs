import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req, ["admin"]);
  if (error) return jsonError(error, status);

  const url = new URL(req.url);
  const method = req.method;

  if (method === "GET") {
    const rows = await sql(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.job_role, u.is_active, u.created_at,
       c.id as client_id, c.name as client_name, c.color as client_color,
       COUNT(DISTINCT a.module_id) as assigned_modules,
       COUNT(DISTINCT lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) as completed_lessons,
       COUNT(DISTINCT cert.id) as certificates
       FROM users u
       LEFT JOIN clients c ON u.client_id = c.id
       LEFT JOIN assignments a ON a.agent_id = u.id
       LEFT JOIN lesson_progress lp ON lp.agent_id = u.id
       LEFT JOIN certificates cert ON cert.agent_id = u.id
       WHERE u.role = 'agent'
       GROUP BY u.id, c.id, c.name, c.color
       ORDER BY u.created_at DESC`
    );
    return jsonOk(rows);
  }

  if (method === "POST") {
    const { email, firstName, lastName, clientId, jobRole, password } = await req.json();
    const tempPassword = password || Math.random().toString(36).slice(-10);
    const hash = await bcrypt.hash(tempPassword, 10);
    const rows = await sql(
      "INSERT INTO users (email, password_hash, first_name, last_name, role, client_id, job_role) VALUES ($1,$2,$3,$4,'agent',$5,$6) RETURNING id, email, first_name, last_name",
      [email.toLowerCase(), hash, firstName, lastName, clientId || null, jobRole || null]
    );
    return jsonOk({ ...rows[0], tempPassword }, 201);
  }

  if (method === "PUT") {
    const { id, firstName, lastName, clientId, jobRole, isActive } = await req.json();
    const rows = await sql(
      "UPDATE users SET first_name=$1, last_name=$2, client_id=$3, job_role=$4, is_active=$5, updated_at=NOW() WHERE id=$6 RETURNING id, email, first_name, last_name",
      [firstName, lastName, clientId, jobRole, isActive, id]
    );
    return jsonOk(rows[0]);
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/agents" };
