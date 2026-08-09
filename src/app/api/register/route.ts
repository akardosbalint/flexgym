import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateCheckInCode } from "@/lib/checkin-code";

const schema = z.object({
  name: z.string().trim().min(2, "Add meg a teljes neved."),
  email: z.email("Érvénytelen email cím."),
  password: z.string().min(8, "A jelszó legalább 8 karakter legyen."),
});

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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Ezzel az email címmel már regisztráltak." },
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
