import { neon } from "@netlify/neon";
import { requireAuth, jsonError, jsonOk } from "./_utils.mjs";

const sql = neon();

export default async (req) => {
  const { user, error, status } = requireAuth(req);
  if (error) return jsonError(error, status);

  const url = new URL(req.url);
  const method = req.method;
  const moduleId = url.searchParams.get("moduleId");

  if (method === "GET" && moduleId) {
    const rows = await sql(
      "SELECT * FROM lessons WHERE module_id=$1 ORDER BY sort_order",
      [moduleId]
    );
    return jsonOk(rows);
  }

  if (method === "POST") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const { moduleId, title, type, contentUrl, contentText, durationMins, sortOrder } = await req.json();
    const rows = await sql(
      "INSERT INTO lessons (module_id, title, type, content_url, content_text, duration_mins, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [moduleId, title, type, contentUrl, contentText, durationMins || 5, sortOrder || 0]
    );
    return jsonOk(rows[0], 201);
  }

  if (method === "PUT") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const { id, title, type, contentUrl, contentText, durationMins, sortOrder } = await req.json();
    const rows = await sql(
      "UPDATE lessons SET title=$1, type=$2, content_url=$3, content_text=$4, duration_mins=$5, sort_order=$6, updated_at=NOW() WHERE id=$7 RETURNING *",
      [title, type, contentUrl, contentText, durationMins, sortOrder, id]
    );
    return jsonOk(rows[0]);
  }

  if (method === "DELETE") {
    if (user.role !== "admin") return jsonError("Forbidden", 403);
    const id = url.searchParams.get("id");
    await sql("DELETE FROM lessons WHERE id=$1", [id]);
    return jsonOk({ success: true });
  }

  return jsonError("Method not allowed", 405);
};

export const config = { path: "/api/lessons" };
