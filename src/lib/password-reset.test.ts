import { describe, expect, it } from "vitest";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "./password-reset";

describe("generateResetToken", () => {
  it("returns a hex raw token and its sha256 hash", () => {
    const { rawToken, tokenHash } = generateResetToken();
    expect(rawToken).toMatch(/^[0-9a-f]{64}$/); // 32 bytes -> 64 hex chars
    expect(tokenHash).toBe(hashResetToken(rawToken));
    expect(tokenHash).not.toBe(rawToken);
  });

  it("never reuses a token across calls", () => {
    const a = generateResetToken();
    const b = generateResetToken();
    expect(a.rawToken).not.toBe(b.rawToken);
  });
});

describe("hashResetToken", () => {
  it("is deterministic", () => {
    expect(hashResetToken("abc")).toBe(hashResetToken("abc"));
  });

  it("differs for different inputs", () => {
    expect(hashResetToken("abc")).not.toBe(hashResetToken("abd"));
  });
});

describe("RESET_TOKEN_TTL_MS", () => {
  it("is 1 hour", () => {
    expect(RESET_TOKEN_TTL_MS).toBe(60 * 60 * 1000);
  });
});
