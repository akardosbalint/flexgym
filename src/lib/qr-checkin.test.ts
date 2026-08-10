import { describe, expect, it } from "vitest";
import { checkInCodeToQrContent, qrContentToCheckInCode, formatCheckInCode } from "./qr-checkin";

describe("checkInCodeToQrContent / qrContentToCheckInCode", () => {
  it("round-trips a check-in code through the QR content encoding", () => {
    const code = "a1b2c3d4e5f6";
    expect(qrContentToCheckInCode(checkInCodeToQrContent(code))).toBe(code);
  });

  it("rejects content that isn't ours", () => {
    expect(qrContentToCheckInCode("some-other-app:12345")).toBeNull();
    expect(qrContentToCheckInCode("")).toBeNull();
  });

  it("trims whitespace before checking the prefix", () => {
    expect(qrContentToCheckInCode("  forgegym:checkin:abc123  ")).toBe("abc123");
  });
});

describe("formatCheckInCode", () => {
  it("uppercases and dash-groups every 4 characters", () => {
    expect(formatCheckInCode("a1b2c3d4e5f6")).toBe("A1B2-C3D4-E5F6");
  });

  it("does not add a trailing dash when the length is an exact multiple of 4", () => {
    expect(formatCheckInCode("abcd")).toBe("ABCD");
    expect(formatCheckInCode("abcdefgh")).toBe("ABCD-EFGH");
  });

  it("handles lengths not divisible by 4", () => {
    expect(formatCheckInCode("abc")).toBe("ABC");
    expect(formatCheckInCode("abcde")).toBe("ABCD-E");
  });
});
