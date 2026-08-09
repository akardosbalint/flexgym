import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";

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

    // Mock delivery: no email provider is wired up yet, so the reset link
    // is logged instead. Swap this for a real email send (e.g. Resend) when
    // one is configured.
    console.log(`[jelszo-visszaallitas] Reset link a(z) ${email} címhez: ${resetUrl.toString()}`);
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
