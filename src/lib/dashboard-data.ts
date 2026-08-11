import "server-only";
import { prisma } from "@/lib/prisma";
import { getActiveCheckInCode } from "@/lib/checkin-code";

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

export async function getDashboardData(userId: string) {
  const [checkInCode, memberships, checkIns, purchases] = await Promise.all([
    getActiveCheckInCode(userId),
    prisma.membership.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
    }),
    prisma.checkIn.findMany({
      where: { userId },
      orderBy: { checkedInAt: "desc" },
    }),
    prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const now = Date.now();
  const activeMembership =
    memberships.find((m) => m.status === "ACTIVE" && m.endDate.getTime() >= now) ?? null;

  const checkInsLast30Days = checkIns.filter(
    (c) => now - c.checkedInAt.getTime() <= 30 * DAY,
  );

  const avgDurationMin = checkIns.length
    ? Math.round(
        checkIns.reduce((sum, c) => sum + (c.durationMin ?? 0), 0) / checkIns.length,
      )
    : 0;

  // Weekly check-in counts for the last 8 weeks, oldest first.
  const weeklyUsage = Array.from({ length: 8 }).map((_, i) => {
    const weekIndex = 7 - i;
    const weekStart = now - (weekIndex + 1) * WEEK;
    const weekEnd = now - weekIndex * WEEK;
    const count = checkIns.filter(
      (c) => c.checkedInAt.getTime() > weekStart && c.checkedInAt.getTime() <= weekEnd,
    ).length;
    const labelDate = new Date(weekEnd);
    return {
      label: labelDate.toLocaleDateString("hu-HU", { month: "short", day: "numeric" }),
      alkalom: count,
    };
  });

  return {
    checkInCode,
    memberships,
    activeMembership,
    checkIns,
    checkInsLast30Days,
    purchases,
    avgDurationMin,
    weeklyUsage,
  };
}
