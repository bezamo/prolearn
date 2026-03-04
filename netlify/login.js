import { sql, checkPassword, signToken, SUPER_ADMINS, ok, err, cors } from "./_utils.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };
  if (event.httpMethod !== "POST") return err("Method not allowed", 405);

  const { email, password } = JSON.parse(event.body || "{}");
  if (!email || !password) return err("Email and password are required");

  const lowerEmail = email.toLowerCase().trim();

  // Check superadmin override (env-defined accounts)
  const isSuperAdmin = SUPER_ADMINS.includes(lowerEmail);

  const rows = await sql`SELECT * FROM users WHERE email = ${lowerEmail}`;
  const user = rows[0];

  if (!user) return err("Invalid email or password", 401);
  if (user.status !== "active") return err("Account not yet activated. Check your invite email.", 401);

  const valid = await checkPassword(password, user.password_hash);
  if (!valid) return err("Invalid email or password", 401);

  const role = isSuperAdmin ? "superadmin" : user.role;
  const token = signToken({ id: user.id, email: user.email, role, name: user.name });

  return ok({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      clientId: user.client_id,
    },
  });
};
