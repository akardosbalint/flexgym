import type { Membership } from "@/generated/prisma/client";

export function getMembershipProgress(membership: Membership) {
  const now = Date.now();
  const daysLeft = Math.max(0, Math.ceil((membership.endDate.getTime() - now) / 86_400_000));
  const totalDays = Math.max(
    1,
    Math.ceil((membership.endDate.getTime() - membership.startDate.getTime()) / 86_400_000),
  );
  const daysElapsed = Math.min(totalDays, totalDays - daysLeft);
  const timeProgress = Math.round((daysElapsed / totalDays) * 100);

  const entriesProgress = membership.totalEntries
    ? Math.min(100, Math.round((membership.usedEntries / membership.totalEntries) * 100))
    : null;

  return { daysLeft, timeProgress, entriesProgress };
}
