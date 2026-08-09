import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { qrContentToCheckInCode } from "@/lib/qr-checkin";

const schema = z.object({
  code: z.string().trim().min(1, "Hiányzó kód."),
});

function normalizeManualCode(input: string) {
  return input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STAFF") {
    return NextResponse.json({ error: "Nincs jogosultságod." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Hibás adatok." },
      { status: 400 },
    );
  }

  const raw = parsed.data.code;
  const checkInCode = qrContentToCheckInCode(raw) ?? normalizeManualCode(raw);

  const member = await prisma.user.findUnique({
    where: { checkInCode },
    select: { id: true, name: true, role: true },
  });

  if (!member || member.role !== "MEMBER") {
    return NextResponse.json({ error: "Ismeretlen belépőkód." }, { status: 404 });
  }

  const now = new Date();

  const [, activeMembership] = await Promise.all([
    prisma.checkIn.create({
      data: {
        userId: member.id,
        scannedById: session.user.id,
        checkedInAt: now,
        gate: "Forge Gym Budapest - Fő bejárat",
      },
    }),
    prisma.membership.findFirst({
      where: { userId: member.id, status: "ACTIVE", endDate: { gte: now } },
      orderBy: { endDate: "desc" },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    member: { name: member.name },
    checkedInAt: now.toISOString(),
    membership: activeMembership
      ? {
          valid: true,
          name: activeMembership.name,
          endDate: activeMembership.endDate.toISOString(),
        }
      : { valid: false },
  });
}
