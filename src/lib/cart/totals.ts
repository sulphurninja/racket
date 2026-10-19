import { siteConfig } from "@/config/site";
import { multiplyMinor, sumMinor, type MinorUnits } from "@/lib/money";

export type PricedLine = { priceMinor: MinorUnits; quantity: number };

export type CartEstimate = {
  itemCount: number;
  subtotalMinor: MinorUnits;
  shippingMinor: MinorUnits;
  totalMinor: MinorUnits;
  freeShippingRemainingMinor: MinorUnits;
  freeShippingProgress: number;
};

/**
 * Client-side ESTIMATE for display only. Authoritative totals (prices, stock,
 * coupons, shipping, tax) are always recomputed on the server at checkout.
 */
export type ShippingPolicy = { freeShippingThresholdMinor: MinorUnits; standardShippingMinor: MinorUnits };

export function estimateCart(
  lines: PricedLine[],
  policy: ShippingPolicy = siteConfig.commerce,
): CartEstimate {
  const itemCount = lines.reduce((acc, l) => acc + l.quantity, 0);
  const subtotalMinor = sumMinor(lines.map((l) => multiplyMinor(l.priceMinor, l.quantity)));
  const qualifies = subtotalMinor >= policy.freeShippingThresholdMinor;
  const shippingMinor = itemCount === 0 || qualifies ? 0 : policy.standardShippingMinor;
  return {
    itemCount,
    subtotalMinor,
    shippingMinor,
    totalMinor: subtotalMinor + shippingMinor,
    freeShippingRemainingMinor: Math.max(0, policy.freeShippingThresholdMinor - subtotalMinor),
    freeShippingProgress: Math.min(1, subtotalMinor / policy.freeShippingThresholdMinor),
  };
}

export const MAX_LINE_QUANTITY = 10;

export function clampQuantity(requested: number, stock: number) {
  const cap = Math.min(MAX_LINE_QUANTITY, Math.max(0, stock));
  return Math.max(0, Math.min(Math.floor(requested), cap));
}
