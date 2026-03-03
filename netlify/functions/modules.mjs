import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const url = new URL(req.url);
  const method = req.method;

  // GET /api/modules - list modules
  if (method === "GET") {
    const clientFilter = url.searchParams.get("clientId");
    let rows;

    if (user.role === "admin") {
      rows = clientFilter
        ? await sql(
            `SELECT m.*, c.name as client_name, c.color as client_color,
             COUNT(DISTINCT l.id) as lesson_count
             FROM modules m
             LEFT JOIN clients c ON m.client_id = c.id
             LEFT JOIN lessons l ON l.module_id = m.id
             WHERE m.client_id = $1
             GROUP BY m.id, c.name, c.color
             ORDER BY m.sort_order, m.created_at DESC`,
            [clientFilter]
          )
        : await sql(
            `SELECT m.*, c.name as client_name, c.color as client_color,
             COUNT(DISTINCT l.id) as lesson_count
             FROM modules m
             LEFT JOIN clients c ON m.client_id = c.id
             LEFT JOIN lessons l ON l.module_id = m.id
             GROUP BY m.id, c.name, c.color
             ORDER BY m.sort_order, m.created_at DESC`
          );
    } else {
      // Agents only see their assigned published modules
      rows = await sql(
        `SELECT m.*, c.name as client_name, c.color as client_color,
         COUNT(DISTINCT l.id) as lesson_count,
         COUNT(DISTINCT lp.id) as completed_lessons
         FROM assignments a
         JOIN modules m ON a.module_id = m.id
         LEFT JOIN clients c ON m.client_id = c.id
         LEFT JOIN lessons l ON l.module_id = m.id
         LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = $1 AND lp.completed_at IS NOT NULL
         WHERE a.agent_id = $1 AND m.status = 'published'
         GROUP BY m.id, c.name, c.color
         ORDER BY m.sort_order`,
        [user.userId]
      );
    }

    return jsonOk(rows);
  }

  // POST /api/modules - create module (admin only)
  if (method === "POST") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const { clientId, title, description, roleTarget, status } = await req.json();
    const rows = await sql(
      "INSERT INTO modules (client_id, title, description, role_target, status, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [clientId, title, description, roleTarget || "All", status || "draft", user.userId]
    );
    return jsonOk(rows[0], 201);
  }

  // PUT /api/modules - update module
  if (method === "PUT") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const { id, title, description, roleTarget, status, sortOrder } = await req.json();
    const rows = await sql(
      "UPDATE modules SET title=$1, description=$2, role_target=$3, status=$4, sort_order=$5, updated_at=NOW() WHERE id=$6 RETURNING *",
      [title, description, roleTarget, status, sortOrder, id]
    );
    return jsonOk(rows[0]);
  }

  // DELETE /api/modules?id=xxx
  if (method === "DELETE") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const id = url.searchParams.get("id");
    await sql("DELETE FROM modules WHERE id=$1", [id]);
    return jsonOk({ success: true });
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/modules" };
