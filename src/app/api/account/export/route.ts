import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GDPR Art. 20 (right to data portability): lets a member download every
// record we hold about them as a single JSON file. Always scoped to the
// authenticated session's own id - never takes an id from the request, so
// there's no IDOR surface here.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nincs bejelentkezve." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      memberships: true,
      checkIns: {
        select: { id: true, checkedInAt: true, durationMin: true, gate: true },
      },
      purchases: {
        select: { id: true, item: true, amountHuf: true, invoiceNo: true, method: true, status: true, createdAt: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Felhasználó nem található." }, { status: 404 });
  }

  const exportedAt = new Date().toISOString();
  const body = JSON.stringify({ exportedAt, ...user }, null, 2);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="forge-gym-adataim.json"',
    },
  });
}
