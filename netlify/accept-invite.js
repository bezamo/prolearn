import { sql, hashPassword, signToken, ok, err, cors } from "./_utils.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };

  // GET: validate token and return invite details
  if (event.httpMethod === "GET") {
    const token = event.queryStringParameters?.token;
    if (!token) return err("Token is required");

    const rows = await sql`
      SELECT i.*, c.name as client_name
      FROM invitations i
      LEFT JOIN clients c ON c.id = i.client_id
      WHERE i.token = ${token}
        AND i.used_at IS NULL
        AND i.expires_at > NOW()
    `;

    if (!rows.length) return err("Invitation link is invalid or has expired", 404);

    const inv = rows[0];
    return ok({
      email: inv.email,
      name: inv.name,
      role: inv.role,
      clientName: inv.client_name,
    });
  }

  // POST: set password and activate account
  if (event.httpMethod === "POST") {
    const { token, password, name } = JSON.parse(event.body || "{}");
    if (!token || !password) return err("Token and password are required");
    if (password.length < 8) return err("Password must be at least 8 characters");

    const rows = await sql`
      SELECT * FROM invitations
      WHERE token = ${token}
        AND used_at IS NULL
        AND expires_at > NOW()
    `;
    if (!rows.length) return err("Invitation link is invalid or has expired", 404);

    const inv = rows[0];

    // Check user doesn't already exist
    const existing = await sql`SELECT id FROM users WHERE email = ${inv.email}`;
    if (existing.length > 0) return err("Account already exists for this email");

    const passwordHash = await hashPassword(password);
    const displayName = name || inv.name || inv.email.split("@")[0];

    // Create user
    const users = await sql`
      INSERT INTO users (email, name, role, client_id, password_hash, status)
      VALUES (${inv.email}, ${displayName}, ${inv.role}, ${inv.client_id}, ${passwordHash}, 'active')
      RETURNING id, email, name, role, client_id
    `;
    const user = users[0];

    // Mark invite as used
    await sql`UPDATE invitations SET used_at = NOW() WHERE id = ${inv.id}`;

    // Sign in automatically
    const jwtToken = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    return ok({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clientId: user.client_id,
      },
    });
  }

  return err("Method not allowed", 405);
};
