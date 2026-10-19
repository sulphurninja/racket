import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/marks";
import { ArrowGlyph, Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="container-racket flex min-h-[80svh] flex-col items-center justify-center pt-[var(--header-h)] pb-24 text-center">
      <Emblem className="w-14 opacity-80" title={null} />
      <h1 className="type-display mt-8 text-[clamp(2.6rem,6vw,5rem)]">Accounts drop with checkout.</h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
        Sign-in, order history, saved addresses — all landing with checkout. Till then your cart and wishlist live
        safely on this device.
      </p>
      <Button asChild size="lg" className="mt-9">
        <Link href="/wishlist">
          View wishlist <ArrowGlyph />
        </Link>
      </Button>
    </div>
  );
}
