import { Suspense } from "react";
import { Skeleton } from "@/components/ui/primitives";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";

/**
 * Store information pages. Policies that RACKET hasn't confirmed yet say so
 * plainly instead of inventing terms. Phase 2 moves these into the CMS.
 */
const PAGES: Record<string, { title: string; intro: string; body: string[] }> = {
  about: {
    title: "About RACKET",
    intro: "Make some noise.",
    body: [
      "RACKET is a setup brand for gamers, streamers, coders, students, the nine-to-five. Anyone who lives at a desk and wants it to feel, and look, like theirs. Everybody needs a desk upgrade. Keyboards are chapter one. Chairs, desks and the rest of the room are on the way.",
      "We start with colorways we'd put on our own desks and pair them with boards that feel as good as they sound. Gasket-mounted, hot-swappable, lit from below. No filler products, no fake discounts, no noise that isn't the good kind.",
    ],
  },
  shipping: {
    title: "Shipping",
    intro: "Shipping details will be published here before sales open.",
    body: [
      "We're finalising delivery partners, regions and timelines. Shipping costs and estimated delivery dates will be shown at checkout before you pay.",
    ],
  },
  returns: {
    title: "Returns",
    intro: "Our returns policy will be published here before sales open.",
    body: ["We'll set out the returns window, condition requirements and how refunds are processed before we take any orders."],
  },
  warranty: {
    title: "Warranty",
    intro: "Warranty terms are being finalised.",
    body: ["We won't advertise warranty coverage until it's confirmed. Full terms will be published here and on each product page."],
  },
  contact: {
    title: "Contact",
    intro: "Say hello.",
    body: [`Email us at ${siteConfig.contactEmail} and we'll get back to you.`],
  },
  privacy: {
    title: "Privacy",
    intro: "How we handle your data.",
    body: [
      "Right now this site stores your cart and wishlist only in your own browser. We don't collect accounts, payment details or newsletter emails yet.",
      "A full privacy policy will be published here before accounts and checkout go live.",
    ],
  },
  terms: {
    title: "Terms",
    intro: "Terms of sale will be published before checkout opens.",
    body: ["This storefront is a preview. Prices shown are placeholders and no orders can be placed yet."],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/pages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Page not found", robots: { index: false, follow: false } };
  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/pages/${slug}` },
    openGraph: {
      url: `/pages/${slug}`,
      title: page.title,
      description: page.intro,
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "RACKET K75", type: "image/jpeg" }],
    },
  };
}

export default function InfoPage({ params }: PageProps<"/pages/[slug]">) {
  return (
    <Suspense fallback={<div className="container-racket max-w-3xl pt-[calc(var(--header-h)+4rem)] pb-28"><Skeleton className="h-20 w-2/3" /></div>}>
      {params.then(({ slug }) => (
        <InfoPageContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function InfoPageContent({ slug }: { slug: string }) {
  const page = PAGES[slug];
  if (!page) notFound();
  return (
    <article className="container-racket max-w-3xl pt-[calc(var(--header-h)+4rem)] pb-28">
      <p className="type-eyebrow text-ink/50">RACKET</p>
      <h1 className="type-display mt-5 text-[clamp(2.8rem,7vw,5.5rem)]">{page.title}</h1>
      <p className="mt-6 text-xl text-ink/75">{page.intro}</p>
      <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-ink/70">
        {page.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </article>
  );
}
