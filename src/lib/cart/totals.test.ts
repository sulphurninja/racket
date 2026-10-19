import { describe, expect, it } from "vitest";
import { clampQuantity, estimateCart, MAX_LINE_QUANTITY } from "./totals";

const policy = { freeShippingThresholdMinor: 2_999_00, standardShippingMinor: 149_00 };

describe("estimateCart", () => {
  it("is empty and free for an empty cart", () => {
    expect(estimateCart([], policy)).toMatchObject({ itemCount: 0, subtotalMinor: 0, shippingMinor: 0, totalMinor: 0 });
  });

  it("charges shipping below the threshold", () => {
    const est = estimateCart([{ priceMinor: 1_000_00, quantity: 2 }], policy);
    expect(est.subtotalMinor).toBe(2_000_00);
    expect(est.shippingMinor).toBe(149_00);
    expect(est.totalMinor).toBe(2_149_00);
    expect(est.freeShippingRemainingMinor).toBe(999_00);
  });

  it("ships free at or above the threshold", () => {
    const est = estimateCart([{ priceMinor: 6_499_00, quantity: 1 }], policy);
    expect(est.shippingMinor).toBe(0);
    expect(est.freeShippingProgress).toBe(1);
  });
});

describe("clampQuantity", () => {
  it("caps at stock and the per-line maximum", () => {
    expect(clampQuantity(5, 3)).toBe(3);
    expect(clampQuantity(50, 100)).toBe(MAX_LINE_QUANTITY);
    expect(clampQuantity(-2, 10)).toBe(0);
    expect(clampQuantity(2.7, 10)).toBe(2);
  });
});
