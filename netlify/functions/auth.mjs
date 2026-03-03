import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sql = neon();
const JWT_SECRET = Netlify.env.get("JWT_SECRET") || "dev-secret-change-in-production";

export default async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (req.method === "POST" && action === "login") {
    try {
      const { email, password } = await req.json();

      const rows = await sql(
        "SELECT u.*, c.name as client_name, c.color as client_color FROM users u LEFT JOIN clients c ON u.client_id = c.id WHERE u.email = $1 AND u.is_active = true",
        [email.toLowerCase()]
      );

      if (!rows.length) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return new Response(
        JSON.stringify({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            clientId: user.client_id,
            clientName: user.client_name,
            clientColor: user.client_color,
            jobRole: user.job_role,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Login error:", err);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (req.method === "POST" && action === "register") {
    try {
      const { email, password, firstName, lastName, role, clientId, jobRole } = await req.json();

      const hash = await bcrypt.hash(password, 10);

      const rows = await sql(
        "INSERT INTO users (email, password_hash, first_name, last_name, role, client_id, job_role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, email, first_name, last_name, role",
        [email.toLowerCase(), hash, firstName, lastName, role || "agent", clientId || null, jobRole || null]
      );

      return new Response(JSON.stringify({ user: rows[0] }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      if (err.message?.includes("unique")) {
        return new Response(JSON.stringify({ error: "Email already in use" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/api/auth",
};
