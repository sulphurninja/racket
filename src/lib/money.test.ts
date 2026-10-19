import { describe, expect, it } from "vitest";
import { assertMinor, formatMoney, multiplyMinor, percentOf, sumMinor } from "./money";

describe("money", () => {
  it("formats paise as rupees without trailing zeros", () => {
    expect(formatMoney(6_499_00)).toBe("₹6,499");
    expect(formatMoney(1_00_000_00)).toBe("₹1,00,000");
  });

  it("shows paise only when present", () => {
    expect(formatMoney(12_50)).toBe("₹12.50");
  });

  it("multiplies and sums in integer minor units", () => {
    expect(multiplyMinor(6_499_00, 3)).toBe(19_497_00);
    expect(sumMinor([10, 20, 30])).toBe(60);
    expect(() => multiplyMinor(100, 1.5)).toThrow(RangeError);
  });

  it("rounds percentages half-up to the nearest paisa", () => {
    expect(percentOf(999, 10)).toBe(100);
    expect(percentOf(6_499_00, 18)).toBe(1_169_82);
  });

  it("rejects non-integer or negative amounts", () => {
    expect(() => assertMinor(1.5)).toThrow();
    expect(() => assertMinor(-1)).toThrow();
    expect(assertMinor(0)).toBe(0);
  });
});
