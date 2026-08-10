import { describe, expect, it } from "vitest";
import { generateCheckInCode } from "./checkin-code";

describe("generateCheckInCode", () => {
  it("returns a 12-character hex string (6 random bytes)", () => {
    expect(generateCheckInCode()).toMatch(/^[0-9a-f]{12}$/);
  });

  it("is different on every call", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateCheckInCode()));
    expect(codes.size).toBe(50);
  });
});
