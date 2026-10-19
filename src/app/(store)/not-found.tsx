import Link from "next/link";
import { Emblem } from "@/components/brand/marks";
import { ArrowGlyph, Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-racket flex min-h-[80svh] flex-col items-center justify-center pt-[var(--header-h)] pb-24 text-center">
      <Emblem className="w-14 opacity-80" title={null} />
      <p className="type-eyebrow mt-8 text-ink/50">404</p>
      <h1 className="type-display mt-4 text-[clamp(2.6rem,6vw,5rem)]">Wrong key.</h1>
      <p className="mt-5 max-w-md text-[15px] text-ink/65">That page doesn&apos;t exist. The keyboards very much do.</p>
      <Button asChild size="lg" className="mt-9">
        <Link href="/collections/keyboards">
          Shop keyboards <ArrowGlyph />
        </Link>
      </Button>
    </div>
  );
}
