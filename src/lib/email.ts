import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;

function getResend() {
  if (cached) return cached;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  cached = new Resend(apiKey);
  return cached;
}

/**
 * Sends a transactional email if RESEND_API_KEY is configured; otherwise
 * logs the content instead of sending, so password-reset links and contact
 * messages are still visible (e.g. in server logs) during local dev/before
 * a real provider is wired up. Mirrors the same lazy, graceful-degradation
 * pattern used for Stripe/Google Wallet/Apple Wallet in this codebase.
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
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "Forge Gym <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email] RESEND_API_KEY nincs beállítva - email a következő helyett naplózva:`);
    console.log(`  To: ${to}\n  Subject: ${subject}\n  ${text}`);
    return { delivered: false as const };
  }

  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) {
    console.error("[email] Resend küldési hiba:", error);
    return { delivered: false as const };
  }
  return { delivered: true as const };
}
