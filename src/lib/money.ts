/**
 * Money is always stored and computed as integer minor units (paise for INR).
 * Never use floats for arithmetic; format only at the edge.
 */

export type MinorUnits = number;

export function assertMinor(value: number): MinorUnits {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`Invalid minor-unit amount: ${value}`);
  }
  return value;
}

const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, showPaise: boolean) {
  const key = `${currency}:${showPaise}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: showPaise ? 2 : 0,
      maximumFractionDigits: showPaise ? 2 : 0,
    });
    formatters.set(key, f);
  }
  return f;
}

/** Formats paise as ₹12,499 (or ₹12,499.50 when paise are non-zero). */
export function formatMoney(minor: MinorUnits, currency = "INR") {
  const showPaise = minor % 100 !== 0;
  return getFormatter(currency, showPaise).format(minor / 100);
}

export function multiplyMinor(minor: MinorUnits, quantity: number): MinorUnits {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new RangeError(`Invalid quantity: ${quantity}`);
  }
  return minor * quantity;
}

export function sumMinor(values: MinorUnits[]): MinorUnits {
  return values.reduce((acc, v) => acc + v, 0);
}

/** Percentage of an amount, rounded half-up to the nearest paisa. */
export function percentOf(minor: MinorUnits, percent: number): MinorUnits {
  return Math.round((minor * percent) / 100);
}
