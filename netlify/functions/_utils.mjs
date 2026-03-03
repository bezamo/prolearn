import jwt from "jsonwebtoken";

const JWT_SECRET = Netlify.env.get("JWT_SECRET") || "dev-secret-change-in-production";

export function verifyToken(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAuth(req, allowedRoles = []) {
  const user = verifyToken(req);
  if (!user) return { error: "Unauthorized", status: 401 };
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return { error: "Forbidden", status: 403 };
  }
  return { user };
}

export function jsonError(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function jsonOk(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
