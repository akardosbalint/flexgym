const QR_PREFIX = "forgegym:checkin:";

export function checkInCodeToQrContent(checkInCode: string) {
  return `${QR_PREFIX}${checkInCode}`;
}

/** Parses raw QR scan content back into a check-in code, or null if it isn't ours. */
export function qrContentToCheckInCode(content: string): string | null {
  const trimmed = content.trim();
  if (trimmed.startsWith(QR_PREFIX)) {
    return trimmed.slice(QR_PREFIX.length);
  }
  return null;
}

export function formatCheckInCode(checkInCode: string) {
  return checkInCode.toUpperCase().replace(/(.{4})(?=.)/g, "$1-");
}
