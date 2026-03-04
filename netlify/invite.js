import { sql, getUser, ok, err, cors } from "./_utils.js";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailHtml = ({ name, role, clientName, inviterName, link, expiresHours = 48 }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F8FA;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);border:1px solid #E2E6EB">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0EA5A0,#0BC4BE);padding:36px 40px;text-align:center">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:rgba(255,255,255,0.2);border-radius:14px;font-size:22px;font-weight:900;color:#fff;margin-bottom:14px">LV</div>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px">Lead Virtual Training</h1>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85)">Internal Training & Compliance Platform</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 6px;font-size:13px;color:#8A96A3;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">You're invited</p>
          <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;color:#0F1923">Hi${name ? ` ${name.split(" ")[0]}` : ""},</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#4A5568;line-height:1.7">
            <strong style="color:#0F1923">${inviterName}</strong> has invited you to join the
            <strong style="color:#0F1923"> Lead Virtual Training Platform</strong> as a
            <strong style="color:#0EA5A0">${role}</strong>${clientName ? ` for <strong style="color:#0F1923">${clientName}</strong>` : ""}.
          </p>

          <!-- Details card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;border:1px solid #E2E6EB;border-radius:10px;margin-bottom:24px">
            <tr><td style="padding:18px 20px">
              ${name ? `<div style="margin-bottom:10px;font-size:13px;color:#4A5568"><span style="color:#8A96A3;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;display:block;margin-bottom:2px">Name</span><strong style="color:#0F1923">${name}</strong></div>` : ""}
              <div style="margin-bottom:10px;font-size:13px;color:#4A5568"><span style="color:#8A96A3;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;display:block;margin-bottom:2px">Role</span><strong style="color:#0F1923">${role}</strong></div>
              ${clientName ? `<div style="font-size:13px;color:#4A5568"><span style="color:#8A96A3;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;display:block;margin-bottom:2px">Assigned Client</span><strong style="color:#0F1923">${clientName}</strong></div>` : ""}
            </td></tr>
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:24px">
            <a href="${link}" style="display:inline-block;background:#0EA5A0;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:8px;letter-spacing:-0.2px;box-shadow:0 2px 8px rgba(14,165,160,0.35)">
              Accept Invitation →
            </a>
          </div>

          <p style="margin:0;font-size:12px;color:#8A96A3;text-align:center;line-height:1.6">
            This link expires in <strong>${expiresHours} hours</strong> and can only be used once.<br>
            If you didn't expect this, you can safely ignore this email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F7F8FA;border-top:1px solid #E2E6EB;padding:18px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#8A96A3">Lead Virtual · Internal Platform · <a href="https://leadvirtual.netlify.app" style="color:#0EA5A0;text-decoration:none">leadvirtual.netlify.app</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors };
  if (event.httpMethod !== "POST") return err("Method not allowed", 405);

  // Auth check
  const inviter = await getUser(event);
  if (!inviter) return err("Unauthorized", 401);

  // Only superadmin can invite admins; admin can invite agents
  const { email, name, role, clientId } = JSON.parse(event.body || "{}");
  if (!email || !role) return err("Email and role are required");

  const lowerEmail = email.toLowerCase().trim();

  // Permission check
  if (role === "admin" && inviter.role !== "superadmin") return err("Only super admins can invite admins", 403);
  if (role === "agent" && !["admin", "superadmin"].includes(inviter.role)) return err("Insufficient permissions", 403);

  // Check if already exists
  const existing = await sql`SELECT id FROM users WHERE email = ${lowerEmail}`;
  if (existing.length > 0) return err("A user with this email already exists");

  // Check for pending invite
  const pending = await sql`
    SELECT id FROM invitations
    WHERE email = ${lowerEmail} AND used_at IS NULL AND expires_at > NOW()
  `;
  if (pending.length > 0) return err("An active invitation already exists for this email");

  // Get client name for email
  let clientName = null;
  if (clientId) {
    const cl = await sql`SELECT name FROM clients WHERE id = ${clientId}`;
    clientName = cl[0]?.name || null;
  }

  // Create token + invitation record
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await sql`
    INSERT INTO invitations (email, name, role, client_id, token, invited_by, expires_at)
    VALUES (${lowerEmail}, ${name || ""}, ${role}, ${clientId || null}, ${token}, ${inviter.id}, ${expiresAt})
  `;

  const baseUrl = process.env.SITE_URL || "https://prolearn-training.netlify.app";
  const link = `${baseUrl}/accept-invite?token=${token}`;

  // Send email
  const { error: emailError } = await resend.emails.send({
    from: "Lead Virtual Training <onboarding@resend.dev>",
    to: lowerEmail,
    subject: `You're invited to Lead Virtual Training Platform`,
    html: emailHtml({
      name,
      role: role === "admin" ? "Admin" : "Agent",
      clientName,
      inviterName: inviter.name || inviter.email,
      link,
    }),
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return err("Failed to send invitation email", 500);
  }

  return ok({ message: `Invitation sent to ${lowerEmail}`, expiresAt });
};
