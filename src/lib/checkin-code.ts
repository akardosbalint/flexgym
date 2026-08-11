import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Opaque token encoded in a member's personal check-in QR code. */
export function generateCheckInCode() {
  return randomBytes(6).toString("hex");
}

/**
 * Calendar date in Europe/Budapest, as a sortable "YYYY-MM-DD" key - used to
 * decide whether a check-in code was minted "today" regardless of the
 * server's own timezone or DST.
 */
export function budapestDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Returns the member's current check-in code, minting a fresh one first if
 * the stored code was generated on an earlier Europe/Budapest day. Called
 * whenever the QR card is rendered, so a code shown/shared on one day stops
 * matching what's shown from the next day onward.
 */
export async function getActiveCheckInCode(userId: string): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { checkInCode: true, checkInCodeDate: true },
  });

  if (budapestDateKey(user.checkInCodeDate) === budapestDateKey()) {
    return user.checkInCode;
  }

  const checkInCode = generateCheckInCode();
  await prisma.user.update({
    where: { id: userId },
    data: { checkInCode, checkInCodeDate: new Date() },
  });
  return checkInCode;
}
