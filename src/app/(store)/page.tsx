import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrandLoader } from "@/components/brand/brand-loader";
import { Emblem } from "@/components/brand/marks";
import { Hero, type HeroSlide } from "@/components/home/hero";
import { StackShowcase, type StackItem } from "@/components/home/stack-showcase";
import { Reveal, RevealLines } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { ArrowGlyph, Button } from "@/components/ui/button";
import { COLORWAYS, type ColorwayId } from "@/config/colorways";
import { STACK_COLLECTIONS } from "@/lib/catalog/collections";
import { getAllProducts, getFeaturedProducts } from "@/lib/catalog/repository";
import { productImages } from "@/lib/catalog/seed-data";
import { defaultVariant, productColorways } from "@/lib/catalog/product-utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Ticker copy. Alternates solid and outlined for rhythm. */
const FEATURES = [
  "Make some noise",
  "Thock certified",
  "Gamers welcome",
  "9-to-5 approved",
  "Desk glow-up",
  "Hot-swap freedom",
  "Streamer-ready",
  "Chairs loading",
  "Desk mats loading",
  "Every desk deserves better",
];

/** Categories in the pipeline. Concept imagery only. No fake products, no fake prices. */
const NEXT_UP = [
  {
    title: "Gaming chairs",
    blurb: "Thrones for the long sessions.",
    image: { url: "/categories/gaming-chairs.webp", alt: "Futuristic matte black gaming chair with ice-blue LED accents" },
  },
  {
    title: "Desks",
    blurb: "The foundation everything sits on.",
    image: { url: "/categories/desks.webp", alt: "Dark carbon-top gaming desk with LED edge lighting" },
  },
  {
    title: "Desk mats",
    blurb: "Full-desk canvases, stitched edges.",
    image: { url: "/categories/desk-mats.webp", alt: "Desk mat printed with neon anime city artwork" },
  },
  {
    title: "Workspace",
    blurb: "Risers, trays, cables. The details.",
    image: { url: "/categories/workspace.webp", alt: "Headphone stand with underglow and a coiled cable on a dark desk" },
  },
] as const;

const HIGHLIGHTS: { colorway: ColorwayId; eyebrow: string; title: string; body: string }[] = [
  {
    colorway: "cedar",
    eyebrow: "Feel",
    title: "Softly sprung.",
    body: "A gasket structure and a single-key slotted PCB give every press a little cushion instead of a hard bottom-out.",
  },
  {
    colorway: "midnight",
    eyebrow: "Sound",
    title: "Five layers deep.",
    body: "Five layers of noise reduction inside the case keep the sound full and round. Loud in the good way.",
  },
  {
    colorway: "cloud",
    eyebrow: "Light",
    title: "Lit from below.",
    body: "RGB backlighting glows up through the keycaps and case edges. Turn it up for the stream, down for the late night.",
  },
];

const SPEC_KEYS = [
  { legend: "75% layout", sub: "With rotary knob" },
  { legend: "Gasket mount", sub: "Cushioned feel" },
  { legend: "Hot-swap", sub: "No soldering" },
  { legend: "Three-mode", sub: "Connectivity" },
];

export default async function HomePage() {
  const [products, featured] = await Promise.all([getAllProducts(), getFeaturedProducts(8)]);

  const byColorway = new Map(
    products.flatMap((p) => productColorways(p).map((c) => [c, p] as const)),
  );
  const order: ColorwayId[] = ["glacier", "cedar", "cloud", "midnight"];
  const live = order.filter((c) => byColorway.has(c));

  const slides: HeroSlide[] = live.map((c) => {
    const p = byColorway.get(c)!;
    return {
      colorway: c,
      slug: p.slug,
      priceMinor: defaultVariant(p).priceMinor,
      priceConfirmed: p.priceConfirmed,
      image: {
        url: `/products/racket75-${c}-front.webp`,
        alt: `RACKET K75 in ${COLORWAYS[c].name}, front view`,
      },
    };
  });

  const showcase = (["cedar", "glacier", "cloud", "midnight"] as const)
    .filter((c) => byColorway.has(c))
    .map((c) => ({ colorway: c, slug: byColorway.get(c)!.slug, lifestyle: productImages(c).lifestyle }));

  const stacks: StackItem[] = STACK_COLLECTIONS.filter((s) => s.colorway && byColorway.has(s.colorway)).map((s) => ({
      slug: s.slug,
      title: s.title,
      headline: s.headline,
      colorway: s.colorway!,
      image: s.heroImage,
      pieces: s.stack ?? [],
    }));

  return (
    <>
      <BrandLoader />
      <Hero slides={slides} />

      {/* Feature ticker */}
      <section aria-label="Key features" className="overflow-hidden border-b border-line bg-paper py-5">
        <div className="flex w-max animate-[rk-marquee_38s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {FEATURES.map((f, i) => (
                <li key={f} className="flex items-center gap-8 pr-8">
                  <span
                    className={cn(
                      "type-display text-2xl whitespace-nowrap uppercase md:text-[2rem]",
                      i % 2 && "text-transparent [-webkit-text-stroke:1.2px_var(--ink)]",
                    )}
                  >
                    {f}
                  </span>
                  <Emblem title={null} className="w-5 opacity-30" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Lineup */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Image src="/backgrounds/lineup.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="container-racket">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eyebrow flex items-center gap-2.5 text-ink/50">
              <Emblem title={null} className="w-4 opacity-40" /> The lineup · No filler
            </p>
            <RevealLines lines={["RACKET K75."]} className="type-display mt-5 text-[clamp(2.6rem,7vw,6.5rem)]" />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
              One layout. Four personalities. Gasket-mounted, hot-swappable, lit from below. Pick a vibe and go.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/collections/keyboards">
              Shop the lineup <ArrowGlyph />
            </Link>
          </Button>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {featured.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 0.06}>
                <ProductCard product={p} priority={i < 2} />
              </Reveal>
            </li>
          ))}
        </ul>
        </div>
      </section>

      <StackShowcase items={stacks} />

      {/* Highlights */}
      <section className="relative overflow-hidden bg-[#e9e9e5] py-24 md:py-32">
        <div className="container-racket">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <p className="type-eyebrow flex items-center gap-2.5 text-ink/50">
                <Emblem title={null} className="w-4 opacity-40" /> Under the keycaps
              </p>
              <RevealLines
                lines={[
                  "Built loud.",
                  <span key="t" className="text-transparent [-webkit-text-stroke:2px_var(--ink)]">
                    Tuned right.
                  </span>,
                ]}
                className="type-display mt-5 text-[clamp(2.3rem,7.2vw,7.5rem)]"
                lineClassName="whitespace-nowrap"
              />
            </div>
            <p className="max-w-xs text-[15px] leading-relaxed text-ink/60 lg:col-span-3 lg:justify-self-end">
              Three things decide whether a board feels cheap or feels right. This is how the K75 handles each one.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:mt-20 md:grid-cols-12 md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:gap-4 lg:h-[760px]">
            {HIGHLIGHTS.map((h, i) => {
              const img = productImages(h.colorway).detail;
              const big = i === 0;
              return (
                <Reveal
                  key={h.eyebrow}
                  delay={i * 0.08}
                  className={cn(big ? "md:col-span-7 md:row-span-2" : "md:col-span-5", "min-h-0")}
                >
                  <article className="group relative h-full min-h-[420px] overflow-hidden rounded-[28px] bg-ink text-paper md:min-h-[340px]">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes={big ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
                      className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />
                    <span
                      aria-hidden
                      className={cn(
                        "type-display absolute top-4 right-5 leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.55)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1",
                        big ? "text-[clamp(5rem,11vw,10rem)]" : "text-[clamp(4rem,7vw,6rem)]",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={cn("absolute inset-x-0 bottom-0", big ? "p-7 md:p-10" : "p-6 md:p-7")}>
                      <p className="type-eyebrow text-paper/60">{h.eyebrow}</p>
                      <h3 className={cn("type-display mt-3", big ? "text-[clamp(2.4rem,4.6vw,4.25rem)]" : "text-3xl md:text-4xl")}>
                        {h.title}
                      </h3>
                      <p className={cn("mt-3 leading-relaxed text-paper/75", big ? "max-w-md text-base" : "max-w-sm text-sm")}>
                        {h.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-label="At a glance">
            {SPEC_KEYS.map((k) => (
              <li key={k.legend}>
                <div className="relative h-24 rounded-[18px] bg-[#c9c9c4] shadow-[0_8px_0_#a6a6a1] transition-transform duration-75 active:translate-y-[6px] active:shadow-[0_2px_0_#a6a6a1] md:h-28">
                  <div className="absolute inset-[6px] bottom-[12px] flex flex-col justify-between rounded-[13px] bg-gradient-to-b from-white to-[#f1f1ee] p-4 shadow-[inset_0_1px_0_white]">
                    <span className="type-meta text-[11px] text-ink/45">{k.sub}</span>
                    <span className="text-lg font-semibold tracking-[-0.03em] md:text-xl">{k.legend}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* On the desk */}
      <section id="setups" className="scroll-mt-20 bg-paper py-24 text-ink md:py-32">
        <div className="container-racket">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="type-eyebrow flex items-center gap-2.5 text-ink/50">
                <Emblem title={null} className="w-4 opacity-40" /> On the desk
              </p>
              <RevealLines lines={["Your desk,", "turned up."]} className="type-display mt-5 text-[clamp(3rem,7vw,6.75rem)] text-ink" />
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/60">
                Same board. Four rooms. The desk is the rest of the sentence.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 lg:col-span-7">
            {showcase.map((s, i) => {
              const cw = COLORWAYS[s.colorway];
              return (
                <li key={s.colorway}>
                  <Reveal delay={i * 0.06}>
                  <Link href={`/products/${s.slug}`} className="group relative block rounded-[20px] bg-[#deded9] p-2 pb-3 shadow-[0_9px_0_#bdbdb8] transition-transform duration-75 active:translate-y-[6px] active:shadow-[0_2px_0_#bdbdb8]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[14px]">
                      <Image
                        src={s.lifestyle.url}
                        alt={s.lifestyle.alt}
                        fill
                        sizes="(min-width: 768px) 36vw, 100vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-paper/85 py-2 pr-4 pl-2.5 text-sm font-medium text-ink backdrop-blur-md">
                      <span
                        className="h-4 w-4 rounded-full ring-1 ring-black/10 ring-inset"
                        style={{ background: `linear-gradient(135deg, ${cw.swatch} 0 55%, ${cw.swatchAlt} 55%)` }}
                      />
                      K75 {cw.name}
                    </span>
                  </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      </section>

      {/* Next up. Future categories */}
      <section id="next-up" className="container-racket scroll-mt-20 py-24 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eyebrow flex items-center gap-2.5 text-ink/50">
              <Emblem title={null} className="w-4 opacity-40" /> Next up
            </p>
            <RevealLines lines={["The whole room", "is coming."]} className="type-display mt-5 text-[clamp(2.6rem,7vw,6.5rem)]" />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
              Keyboards were just the opening move. The rest of the setup is in the lab. The list hears about every
              drop first.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="#drops">
              Join the list <ArrowGlyph />
            </Link>
          </Button>
        </div>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NEXT_UP.map((n, i) => (
            <li key={n.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  href="#drops"
                  className="group/btn relative block h-full overflow-hidden rounded-[var(--radius-xl)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={n.image.url}
                      alt={n.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover/btn:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                    <h3 className="type-display-narrow text-[1.7rem]">{n.title}</h3>
                    <p className="mt-1.5 text-sm text-paper/75">{n.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-paper/85 transition-colors group-hover/btn:text-paper">
                      Get the alert <ArrowGlyph />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Brand story */}
      <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-ink text-paper">
        <Image src="/backgrounds/night.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-70" />
        <Image
          src="/backgrounds/keyboard-side.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="container-racket flex min-h-[80svh] flex-col justify-center py-24">
          <Image src="/brand/racket-badge.png" alt="" width={88} height={88} className="h-16 w-16 md:h-20 md:w-20" />
          <RevealLines
            lines={["Your setup.", "Your statement."]}
            className="type-display mt-8 max-w-4xl text-[clamp(2.6rem,7vw,6.5rem)]"
          />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-paper/70 md:text-base">
              Gamers, streamers, coders, students, the nine-to-five. Everybody lives at a desk, so it might as well go
              hard. Keyboards are chapter one. Chairs, desks and the rest of the room are loading.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="inverse">
                <Link href="/collections/keyboards">
                  Find your K75 <ArrowGlyph />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-inverse">
                <Link href="#drops">Get drop alerts</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
