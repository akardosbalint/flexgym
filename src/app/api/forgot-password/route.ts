import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.email("Érvénytelen email cím."),
});

// Always responds with the same generic message regardless of whether the
// email exists, so this endpoint can't be used to enumerate registered
// accounts.
const GENERIC_RESPONSE = {
  ok: true,
  message: "Ha ez az email cím regisztrálva van nálunk, hamarosan kapsz egy jelszó-visszaállító linket.",
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok, retryAfterSeconds } = checkRateLimit(`forgot-password:${ip}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!ok) {
    // Still returns the generic shape (not a distinct error) so the 429
    // itself can't be used to distinguish "rate limited" from anything
    // else about the email - only slows down abuse.
    return NextResponse.json(GENERIC_RESPONSE, {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Hibás adatok." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const { rawToken, tokenHash } = generateResetToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = new URL("/jelszo-visszaallitas", request.url);
    resetUrl.searchParams.set("token", rawToken);

    await sendEmail({
      to: email,
      subject: "Jelszó visszaállítása - Forge Gym",
      text: `Szia!\n\nA jelszavad visszaállításához kattints az alábbi linkre (1 órán belül érvényes):\n${resetUrl.toString()}\n\nHa nem te kérted, hagyd figyelmen kívül ezt az emailt.`,
    });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
