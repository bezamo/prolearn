import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req, ["admin"]);
  if (error) return jsonError(error, status);

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "overview";

  if (type === "overview") {
    const [agents] = await sql("SELECT COUNT(*) as count FROM users WHERE role='agent' AND is_active=true");
    const [modules] = await sql("SELECT COUNT(*) as count FROM modules WHERE status='published'");
    const [sigs] = await sql("SELECT COUNT(*) as count FROM acknowledgments");
    const [certs] = await sql("SELECT COUNT(*) as count FROM certificates");

    const completionStats = await sql(
      `SELECT 
       COUNT(*) FILTER (WHERE completed_lessons = total_lessons AND total_lessons > 0) as fully_completed,
       COUNT(*) FILTER (WHERE completed_lessons > 0 AND completed_lessons < total_lessons) as in_progress,
       COUNT(*) FILTER (WHERE completed_lessons = 0) as not_started,
       COUNT(*) as total_assignments
       FROM (
         SELECT a.agent_id, a.module_id,
         COUNT(l.id) as total_lessons,
         COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) as completed_lessons
         FROM assignments a
         JOIN modules m ON a.module_id = m.id AND m.status = 'published'
         LEFT JOIN lessons l ON l.module_id = m.id
         LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = a.agent_id
         GROUP BY a.agent_id, a.module_id
       ) sub`
    );

    return jsonOk({
      totalAgents: parseInt(agents.count),
      publishedModules: parseInt(modules.count),
      signatures: parseInt(sigs.count),
      certificates: parseInt(certs.count),
      completion: completionStats[0],
    });
  }

  if (type === "by-client") {
    const rows = await sql(
      `SELECT c.id, c.name, c.color,
       COUNT(DISTINCT u.id) as agent_count,
       COUNT(DISTINCT m.id) as module_count,
       COUNT(DISTINCT ack.id) as signatures,
       ROUND(AVG(sub.pct)) as avg_completion
       FROM clients c
       LEFT JOIN users u ON u.client_id = c.id AND u.role = 'agent'
       LEFT JOIN modules m ON m.client_id = c.id
       LEFT JOIN acknowledgments ack ON ack.module_id = m.id
       LEFT JOIN (
         SELECT a.agent_id, m2.client_id,
         CASE WHEN COUNT(l.id) = 0 THEN 0
         ELSE ROUND(100.0 * COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) / COUNT(l.id))
         END as pct
         FROM assignments a
         JOIN modules m2 ON a.module_id = m2.id
         LEFT JOIN lessons l ON l.module_id = m2.id
         LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = a.agent_id
         GROUP BY a.agent_id, m2.client_id
       ) sub ON sub.client_id = c.id
       WHERE c.is_active = true
       GROUP BY c.id, c.name, c.color`
    );
    return jsonOk(rows);
  }

  if (type === "agent-detail") {
    const rows = await sql(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.job_role,
       c.name as client_name, c.color as client_color,
       m.id as module_id, m.title as module_title,
       COUNT(l.id) as total_lessons,
       COUNT(lp.id) FILTER (WHERE lp.completed_at IS NOT NULL) as completed_lessons,
       MAX(lp.completed_at) as last_activity,
       ack.signed_at, cert.cert_number
       FROM users u
       LEFT JOIN clients c ON u.client_id = c.id
       LEFT JOIN assignments a ON a.agent_id = u.id
       LEFT JOIN modules m ON a.module_id = m.id
       LEFT JOIN lessons l ON l.module_id = m.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.agent_id = u.id
       LEFT JOIN acknowledgments ack ON ack.agent_id = u.id AND ack.module_id = m.id
       LEFT JOIN certificates cert ON cert.agent_id = u.id AND cert.module_id = m.id
       WHERE u.role = 'agent' AND u.is_active = true
       GROUP BY u.id, c.name, c.color, m.id, m.title, ack.signed_at, cert.cert_number
       ORDER BY u.last_name, m.title`
    );
    return jsonOk(rows);
  }

  return jsonError("Invalid report type", 400);
};

export const config = { path: "/api/reports" };
