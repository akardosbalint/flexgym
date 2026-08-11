import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { qrContentToCheckInCode } from "@/lib/qr-checkin";
import { budapestDateKey } from "@/lib/checkin-code";

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
    select: { id: true, name: true, role: true, checkInCodeDate: true, profilePhotoUrl: true },
  });

  if (!member || member.role !== "MEMBER") {
    return NextResponse.json({ error: "Ismeretlen belépőkód." }, { status: 404 });
  }

  // The code rotates once per Europe/Budapest day (see getActiveCheckInCode)
  // but only when the member's dashboard is next opened - so a code from a
  // previous day can still sit unrotated in the DB. Reject it here too,
  // rather than relying solely on that lazy rotation, so a
  // screenshotted/forwarded QR code stops working after local midnight even
  // if the owner hasn't reopened the app yet today.
  if (budapestDateKey(member.checkInCodeDate) !== budapestDateKey()) {
    return NextResponse.json(
      { error: "Lejárt QR-kód. Kérd meg a tagot, hogy nyissa meg újra az alkalmazást, és próbáljátok újra." },
      { status: 410 },
    );
  }

  const now = new Date();

  const activeMembership = await prisma.membership.findFirst({
    where: { userId: member.id, status: "ACTIVE", endDate: { gte: now } },
    orderBy: { endDate: "desc" },
  });

  await prisma.checkIn.create({
    data: {
      userId: member.id,
      scannedById: session.user.id,
      checkedInAt: now,
      gate: "Forge Gym Budapest - Fő bejárat",
      membershipValid: Boolean(activeMembership),
    },
  });

  return NextResponse.json({
    ok: true,
    member: { name: member.name, profilePhotoUrl: member.profilePhotoUrl },
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
