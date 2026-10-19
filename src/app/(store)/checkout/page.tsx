import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/marks";
import { ArrowGlyph, Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

/**
 * Checkout is intentionally not live: Razorpay credentials, server-side
 * pricing and order creation arrive in Phase 3. Nothing here takes payment.
 */
export default function CheckoutPage() {
  return (
    <div className="container-racket flex min-h-[80svh] flex-col items-center justify-center pt-[var(--header-h)] pb-24 text-center">
      <Emblem className="w-14 opacity-80" title={null} />
      <h1 className="type-display mt-8 text-[clamp(2.6rem,6vw,5rem)]">Checkout is loading.</h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
        The drop hasn&apos;t started — we&apos;re not taking payments yet. Your cart stays saved on this device, locked
        and loaded for day one.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/cart">Back to cart</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/collections/keyboards">
            Keep browsing <ArrowGlyph />
          </Link>
        </Button>
      </div>
    </div>
  );
}
