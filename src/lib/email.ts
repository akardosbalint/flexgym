import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransport() {
  if (cached) return cached;

  const user = process.env.GOOGLE_WORKSPACE_EMAIL;
  const pass = process.env.GOOGLE_WORKSPACE_APP_PASSWORD;
  if (!user || !pass) return null;

  cached = nodemailer.createTransport({
    host: process.env.GOOGLE_WORKSPACE_SMTP_HOST ?? "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return cached;
}

/**
 * Sends a transactional email through a Google Workspace mailbox (SMTP +
 * app password) if GOOGLE_WORKSPACE_EMAIL/GOOGLE_WORKSPACE_APP_PASSWORD are
 * configured; otherwise logs the content instead of sending, so
 * password-reset links and contact messages are still visible (e.g. in
 * server logs) during local dev/before a real mailbox is wired up. Mirrors
 * the same lazy, graceful-degradation pattern used for Stripe/Google
 * Wallet/Apple Wallet in this codebase.
 */
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const transport = getTransport();
  const from = process.env.GOOGLE_WORKSPACE_EMAIL
    ? `Forge Gym <${process.env.GOOGLE_WORKSPACE_EMAIL}>`
    : "Forge Gym <no-reply@forgegym.hu>";

  if (!transport) {
    console.log(`[email] GOOGLE_WORKSPACE_EMAIL / GOOGLE_WORKSPACE_APP_PASSWORD nincs beállítva - email a következő helyett naplózva:`);
    console.log(`  To: ${to}\n  Subject: ${subject}\n  ${text}`);
    return { delivered: false as const };
  }

  try {
    await transport.sendMail({ from, to, subject, text });
    return { delivered: true as const };
  } catch (err) {
    console.error("[email] Google Workspace SMTP küldési hiba:", err);
    return { delivered: false as const };
  }
}
