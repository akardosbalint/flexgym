import { describe, expect, it } from "vitest";
import { budapestDateKey, generateCheckInCode } from "./checkin-code";

describe("generateCheckInCode", () => {
  it("returns a 12-character hex string (6 random bytes)", () => {
    expect(generateCheckInCode()).toMatch(/^[0-9a-f]{12}$/);
  });

  it("is different on every call", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateCheckInCode()));
    expect(codes.size).toBe(50);
  });
});

describe("budapestDateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(budapestDateKey(new Date("2026-03-15T10:00:00Z"))).toBe("2026-03-15");
  });

  it("uses the Europe/Budapest calendar day, not UTC", () => {
    // 23:30 UTC on March 15th is already March 16th in Budapest (UTC+1/+2).
    expect(budapestDateKey(new Date("2026-03-15T23:30:00Z"))).toBe("2026-03-16");
  });

  it("returns the same key for two moments on the same Budapest day", () => {
    const morning = budapestDateKey(new Date("2026-06-01T05:00:00Z"));
    const evening = budapestDateKey(new Date("2026-06-01T20:00:00Z"));
    expect(morning).toBe(evening);
  });
});
