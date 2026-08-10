import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({ password: z.string().min(1, "Add meg a jelszavad a megerősítéshez.") });

// GDPR Art. 17 (right to erasure). Requires re-entering the current
// password as a confirmation step for a destructive, irreversible action -
// same idea as WCAG 3.3.4 "review step for legal/financial actions" - and
// incidentally means a bare same-origin POST (no CSRF token on this route)
// can't delete an account without knowing the password.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nincs bejelentkezve." }, { status: 401 });
  }

  const { ok, retryAfterSeconds } = checkRateLimit(`account-delete:${session.user.id}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!ok) {
    return NextResponse.json(
      { error: "Túl sok próbálkozás. Kérjük, próbáld újra néhány perc múlva." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Hibás adatok." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Felhasználó nem található." }, { status: 404 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Hibás jelszó." }, { status: 403 });
  }

  // Cascades to memberships/check-ins/purchases/reset tokens per the
  // schema's onDelete: Cascade relations.
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
