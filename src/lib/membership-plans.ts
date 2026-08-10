export type PlanKind = "one_time" | "recurring";

export interface MembershipPlan {
  name: string;
  /** Stripe Price ID — not secret, safe to keep in source. */
  priceId: string;
  priceHuf: number;
  kind: PlanKind;
  /**
   * Validity window in days. For one_time plans this is the real, fixed
   * validity. For recurring plans this is only an initial fallback — the
   * real endDate comes from Stripe's subscription billing period and is
   * kept in sync by the webhook on every renewal.
   */
  days: number;
  totalEntries: number | null;
  /** Human label for how often it bills, shown next to the price. */
  cadenceLabel: string;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    name: "Alkalmi belépő",
    priceId: "price_1U2rAdIowA5QPfna2aZgVXId",
    priceHuf: 2999,
    kind: "one_time",
    days: 1,
    totalEntries: 1,
    cadenceLabel: "egyszeri",
  },
  {
    name: "Havi bérlet",
    priceId: "price_1U2r4WIowA5QPfna6eKNl14I",
    priceHuf: 11990,
    kind: "recurring",
    days: 30,
    totalEntries: null,
    cadenceLabel: "havonta",
  },
  {
    name: "Negyedéves bérlet",
    priceId: "price_1U2r5wIowA5QPfnaoMpStCpd",
    priceHuf: 29990,
    kind: "recurring",
    days: 91,
    totalEntries: null,
    cadenceLabel: "negyedévente",
  },
  {
    name: "Éves bérlet",
    priceId: "price_1U2r76IowA5QPfnaDk8IpHqE",
    priceHuf: 99900,
    kind: "recurring",
    days: 365,
    totalEntries: null,
    cadenceLabel: "évente",
  },
];

export function getPlan(planName: string): MembershipPlan | null {
  return MEMBERSHIP_PLANS.find((p) => p.name === planName) ?? null;
}

export function getPlanByPriceId(priceId: string): MembershipPlan | null {
  return MEMBERSHIP_PLANS.find((p) => p.priceId === priceId) ?? null;
}
