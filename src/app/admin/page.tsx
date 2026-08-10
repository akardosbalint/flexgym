import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { QrScanner } from "@/components/admin/qr-scanner";

export const metadata: Metadata = { title: "Beléptetés (Admin)" };

export default async function AdminScanPage() {
  const recentCheckIns = await prisma.checkIn.findMany({
    orderBy: { checkedInAt: "desc" },
    take: 15,
    include: {
      user: { select: { name: true } },
      scannedBy: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-paper-fg">Beléptetés</h1>
        <p className="mt-1 text-muted-light">
          Olvasd be a tag QR-kódját a kamerával, vagy add meg a kódot kézzel.
        </p>
      </div>

      <QrScanner
        initialRecent={recentCheckIns.map((c) => ({
          id: c.id,
          memberName: c.user.name,
          checkedInAt: c.checkedInAt.toISOString(),
          staffName: c.scannedBy?.name ?? null,
          membershipValid: c.membershipValid,
        }))}
      />
    </div>
  );
}
