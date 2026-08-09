import "server-only";
import { randomBytes } from "node:crypto";

/** Opaque token encoded in a member's personal check-in QR code. */
export function generateCheckInCode() {
  return randomBytes(6).toString("hex");
}
