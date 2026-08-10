import "server-only";

// In-memory sliding-window limiter, keyed per route + client IP. Good
// enough for a single-instance deployment; if this ever runs across
// multiple serverless instances/regions, swap for a shared store (e.g.
// Upstash Redis) since each instance would otherwise keep its own counts.
const hits = new Map<string, number[]>();

// Bound memory: drop old buckets once in a while instead of growing forever.
let lastSweep = Date.now();
function sweep(windowMs: number) {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < windowMs);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  sweep(windowMs);

  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const retryAfterSeconds = Math.ceil((timestamps[0] + windowMs - now) / 1000);
    return { ok: false, retryAfterSeconds };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { ok: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
