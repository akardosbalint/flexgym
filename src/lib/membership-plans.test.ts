import { describe, expect, it } from "vitest";
import { getPlan, PLAN_DURATIONS } from "./membership-plans";
import { PRICING } from "./site-data";

describe("getPlan", () => {
  it("returns pricing + duration merged for a known plan", () => {
    const plan = getPlan("1 havi bérlet");
    expect(plan).not.toBeNull();
    expect(plan?.days).toBe(30);
    expect(plan?.totalEntries).toBeNull();
    expect(plan?.adult).toBe(31500);
  });

  it("returns null for an unknown plan name", () => {
    expect(getPlan("nem-letezo-berlet")).toBeNull();
  });

  it("has a duration entry for every plan listed in PRICING", () => {
    for (const plan of PRICING) {
      expect(PLAN_DURATIONS[plan.name], `missing duration for "${plan.name}"`).toBeDefined();
    }
  });
});
