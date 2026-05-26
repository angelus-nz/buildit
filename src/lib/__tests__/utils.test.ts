import { describe, it, expect } from "vitest";

describe("scaffold smoke test", () => {
  it("imports resolve correctly", () => {
    expect(true).toBe(true);
  });

  it("formats currency correctly", () => {
    const amountCents = 15000;
    const formatted = new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
    }).format(amountCents / 100);
    expect(formatted).toContain("150");
  });
});
