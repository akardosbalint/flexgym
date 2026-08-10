import { describe, expect, it } from "vitest";
import { getPlan, getPlanByPriceId, MEMBERSHIP_PLANS } from "./membership-plans";

describe("getPlan", () => {
  it("returns the plan for a known name", () => {
    const plan = getPlan("Havi bérlet");
    expect(plan).not.toBeNull();
    expect(plan?.kind).toBe("recurring");
    expect(plan?.days).toBe(30);
    expect(plan?.totalEntries).toBeNull();
    expect(plan?.priceHuf).toBe(11990);
  });

  it("returns the one-time Alkalmi plan correctly", () => {
    const plan = getPlan("Alkalmi belépő");
    expect(plan?.kind).toBe("one_time");
    expect(plan?.totalEntries).toBe(1);
  });

  it("returns null for an unknown plan name", () => {
    expect(getPlan("nem-letezo-berlet")).toBeNull();
  });
});

describe("getPlanByPriceId", () => {
  it("finds a plan by its Stripe Price ID", () => {
    const plan = getPlanByPriceId("price_1U2r76IowA5QPfnaDk8IpHqE");
    expect(plan?.name).toBe("Éves bérlet");
  });

  it("returns null for an unknown price id", () => {
    expect(getPlanByPriceId("price_does_not_exist")).toBeNull();
  });
});

describe("MEMBERSHIP_PLANS", () => {
  it("has a unique, non-empty Stripe Price ID for every plan", () => {
    const priceIds = MEMBERSHIP_PLANS.map((p) => p.priceId);
    expect(new Set(priceIds).size).toBe(priceIds.length);
    for (const id of priceIds) {
      expect(id).toMatch(/^price_/);
    }
  });

  it("only the Alkalmi plan is one-time; the rest are recurring", () => {
    for (const plan of MEMBERSHIP_PLANS) {
      const expectedKind = plan.name === "Alkalmi belépő" ? "one_time" : "recurring";
      expect(plan.kind, plan.name).toBe(expectedKind);
    }
  });
});
