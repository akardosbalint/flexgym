import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateCheckInCode } from "@/lib/checkin-code";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2, "Add meg a teljes neved."),
  email: z.email("Érvénytelen email cím."),
  password: z.string().min(8, "A jelszó legalább 8 karakter legyen."),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok, retryAfterSeconds } = checkRateLimit(`register:${ip}`, {
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

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Deliberately vague rather than a bare "this email is already
    // registered" - lower account-enumeration surface than an explicit
    // oracle, while the UI's existing "Already have an account? Log in"
    // link still covers the common legitimate case.
    return NextResponse.json(
      { error: "Nem sikerült létrehozni a fiókot ezzel az adattal. Ha már van fiókod, jelentkezz be." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      checkInCode: generateCheckInCode(),
    },
  });

  return NextResponse.json({ ok: true });
}
