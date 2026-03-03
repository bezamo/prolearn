import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const url = new URL(req.url);
  const method = req.method;

  // GET agent's progress
  if (method === "GET") {
    const agentId = url.searchParams.get("agentId") || (user.role === "agent" ? user.userId : null);
    const moduleId = url.searchParams.get("moduleId");

    if (!agentId) return jsonError("agentId required", 400);
    if (user.role === "agent" && agentId !== user.userId) return jsonError("Forbidden", 403);

    const query = moduleId
      ? await sql(
          "SELECT lp.*, l.title as lesson_title, l.type FROM lesson_progress lp JOIN lessons l ON lp.lesson_id = l.id WHERE lp.agent_id=$1 AND lp.module_id=$2",
          [agentId, moduleId]
        )
      : await sql(
          `SELECT m.id as module_id, m.title,
           COUNT(l.id) as total_lessons,
           COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) as completed_lessons
           FROM assignments a
           JOIN modules m ON a.module_id = m.id
           LEFT JOIN lessons l ON l.module_id = m.id
           LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = $1
           WHERE a.agent_id = $1
           GROUP BY m.id, m.title`,
          [agentId]
        );

    return jsonOk(query);
  }

  // POST - mark lesson complete
  if (method === "POST") {
    const { lessonId, moduleId, responseText, responseUrl, timeSpent } = await req.json();

    const rows = await sql(
      `INSERT INTO lesson_progress (agent_id, lesson_id, module_id, completed_at, response_text, response_url, time_spent_seconds)
       VALUES ($1,$2,$3,NOW(),$4,$5,$6)
       ON CONFLICT (agent_id, lesson_id) DO UPDATE SET completed_at=NOW(), response_text=$4, response_url=$5, time_spent_seconds=$6
       RETURNING *`,
      [user.userId, lessonId, moduleId, responseText || null, responseUrl || null, timeSpent || 0]
    );

    // Check if module is now 100% complete — if so, issue certificate
    const [{ total, completed }] = await sql(
      `SELECT COUNT(l.id) as total,
       COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) as completed
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = $1
       WHERE l.module_id = $2`,
      [user.userId, moduleId]
    );

    let certificate = null;
    if (parseInt(total) > 0 && parseInt(total) === parseInt(completed)) {
      const certNum = `PL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const existing = await sql(
        "INSERT INTO certificates (agent_id, module_id, cert_number) VALUES ($1,$2,$3) ON CONFLICT (agent_id, module_id) DO NOTHING RETURNING *",
        [user.userId, moduleId, certNum]
      );
      certificate = existing[0] || null;
    }

    return jsonOk({ progress: rows[0], certificate });
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/progress" };
