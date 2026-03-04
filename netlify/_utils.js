import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const sql = neon(process.env.DATABASE_URL);
export const JWT_SECRET = process.env.JWT_SECRET || "prolearn-secret-change-me";

export const SUPER_ADMINS = (process.env.SUPER_ADMINS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

export const hashPassword = (pw) => bcrypt.hash(pw, 10);
export const checkPassword = (pw, hash) => bcrypt.compare(pw, hash);

export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
export const verifyToken = (token) => {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
};

export const getUser = async (req) => {
  const auth = req.headers?.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const rows = await sql`SELECT * FROM users WHERE id = ${payload.id} AND status = 'active'`;
  return rows[0] || null;
};

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export const ok = (body, status = 200) => ({
  statusCode: status,
  headers: { ...cors, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const err = (msg, status = 400) => ({
  statusCode: status,
  headers: { ...cors, "Content-Type": "application/json" },
  body: JSON.stringify({ error: msg }),
});
