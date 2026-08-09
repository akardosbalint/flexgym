import { PRICING } from "@/lib/site-data";

export const PLAN_DURATIONS: Record<string, { days: number; totalEntries: number | null }> = {
  "1 alkalom": { days: 1, totalEntries: 1 },
  "2 alkalom": { days: 14, totalEntries: 2 },
  "10 alkalom": { days: 49, totalEntries: 10 },
  "20 alkalom": { days: 70, totalEntries: 20 },
  "1 havi bérlet": { days: 30, totalEntries: null },
  "1 éves bérlet": { days: 365, totalEntries: null },
};

export function getPlan(planName: string) {
  const plan = PRICING.find((p) => p.name === planName);
  const duration = PLAN_DURATIONS[planName];
  if (!plan || !duration) return null;
  return { ...plan, ...duration };
}
