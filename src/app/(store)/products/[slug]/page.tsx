import { Suspense } from "react";
import { Skeleton } from "@/components/ui/primitives";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Accordion } from "@/components/ui/accordion";
import { getColorway } from "@/config/colorways";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getFamily, getProductBySlug, getProductSlugs, getRelated } from "@/lib/catalog/repository";
import { defaultVariant, productColorways } from "@/lib/catalog/product-utils";
import type { Product } from "@/lib/catalog/types";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const image = product.media[0];
  const colorway = getColorway(productColorways(product)[0]);
  return {
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.summary,
    keywords: [
      "75% mechanical keyboard",
      "gasket mount keyboard",
      "hot-swap mechanical keyboard",
      "RGB mechanical keyboard",
      "wireless mechanical keyboard",
      "keyboard with rotary knob",
      "mechanical keyboard India",
      `${colorway.name.toLowerCase()} keyboard`,
      `RACKET K75 ${colorway.name}`,
    ],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${product.slug}`,
      title: product.seo.title ?? product.title,
      description: product.seo.description ?? product.summary,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title ?? product.title,
      description: product.seo.description ?? product.summary,
    },
  };
}

function productJsonLd(product: Product) {
  const variant = defaultVariant(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.summary,
    sku: variant.sku,
    brand: { "@type": "Brand", name: "RACKET" },
    image: product.media.map((m) => absoluteUrl(m.url)),
    color: productColorways(product).map((c) => getColorway(c).name).join(", "),
    // Offers are only published once prices are confirmed, so search engines never index placeholders.
    ...(product.priceConfirmed
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: siteConfig.currency,
            price: (variant.priceMinor / 100).toFixed(2),
            availability: variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: absoluteUrl(`/products/${product.slug}`),
          },
        }
      : {}),
  };
}

/** BreadcrumbList + FAQPage alongside Product — strong signals for rich results and answer engines. */
function supportingJsonLd(product: Product) {
  const colorway = getColorway(productColorways(product)[0]);
  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Keyboards", item: absoluteUrl("/collections/keyboards") },
        { "@type": "ListItem", position: 3, name: `K75 ${colorway.name}` },
      ],
    },
  ];
  if (product.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: product.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="container-racket pt-[calc(var(--header-h)+1.5rem)]"><div className="grid gap-10 lg:grid-cols-12"><Skeleton className="aspect-square lg:col-span-7" /><Skeleton className="h-96 lg:col-span-5" /></div></div>}>
      {params.then(({ slug }) => (
        <ProductPageContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function ProductPageContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [family, related] = await Promise.all([getFamily(slug), getRelated(slug, 4)]);
  const variant = defaultVariant(product);
  const colorway = getColorway(productColorways(product)[0]);
  const relatedOthers = related.filter((r) => !family.some((f) => f.id === r.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportingJsonLd(product)).replace(/</g, "\\u003c") }}
      />

      <div className="container-racket pt-[calc(var(--header-h)+1.5rem)]">
        <nav aria-label="Breadcrumb" className="type-meta mb-6 text-ink/50">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/collections/keyboards" className="hover:text-ink">Keyboards</Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">{colorway.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery media={product.media} title={product.title} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <ProductPurchase
                family={family}
                product={{
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  family: product.family,
                  tagline: product.tagline,
                  summary: product.summary,
                  priceConfirmed: product.priceConfirmed,
                  variant,
                  media: product.media[0] ?? null,
                }}
              />

              <Accordion
                className="mt-10"
                defaultValue={["specs"]}
                items={[
                  {
                    value: "details",
                    title: "Details",
                    content: (
                      <div className="space-y-3">
                        {product.description.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    ),
                  },
                  {
                    value: "specs",
                    title: "Specifications",
                    content: (
                      <div>
                        {product.specs.map((g) => (
                          <div key={g.group} className="mb-5 last:mb-0">
                            <p className="type-eyebrow mb-2 text-ink/45">{g.group}</p>
                            <dl className="divide-y divide-line">
                              {g.rows.map((r) => (
                                <div key={r.label} className="flex justify-between gap-6 py-2 text-sm">
                                  <dt className="text-ink/55">{r.label}</dt>
                                  <dd className="text-right text-ink">{r.value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                        {!product.specsVerified && product.specsSource ? (
                          <p className="type-meta mt-4 text-[11px] text-ink/45">{product.specsSource}</p>
                        ) : null}
                      </div>
                    ),
                  },
                  ...(product.boxContents.length
                    ? [
                        {
                          value: "box",
                          title: "In the box",
                          content: (
                            <ul className="list-disc space-y-1 pl-5">
                              {product.boxContents.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          ),
                        },
                      ]
                    : []),
                  {
                    value: "shipping",
                    title: "Shipping & returns",
                    content: (
                      <p>
                        Shipping options, delivery estimates and the returns window will be shown at checkout once
                        fulfilment is live. See our <Link href="/pages/shipping" className="underline">shipping</Link> and{" "}
                        <Link href="/pages/returns" className="underline">returns</Link> pages for updates.
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {product.highlights.length ? (
        <section data-scene={colorway.scene} data-nav-theme={colorway.dark ? "dark" : "light"} className="scene-surface mt-24 py-24 md:mt-32 md:py-32">
          <div className="container-racket">
            <p className="type-eyebrow opacity-60">Why the K75</p>
            <h2 className="type-display mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)]">Small board. Big feelings.</h2>
            <div className="mt-16 space-y-20 md:space-y-28">
              {product.highlights.map((h, i) => (
                <Reveal key={h.id}>
                  <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                    {h.image ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)]">
                        <Image src={h.image.url} alt={h.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="max-w-md">
                      <p className="type-eyebrow opacity-60">{h.eyebrow}</p>
                      <h3 className="type-display-narrow mt-4 text-[clamp(1.8rem,3.4vw,3rem)]">{h.title}</h3>
                      <p className="mt-4 text-[15px] leading-relaxed opacity-75 md:text-base">{h.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {product.faqs.length ? (
        <section className="container-racket grid gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <p className="type-eyebrow text-ink/50">Questions</p>
            <h2 className="type-display mt-5 text-[clamp(2.2rem,4.5vw,4rem)]">Good to know.</h2>
          </div>
          <Accordion
            className="md:col-span-8"
            items={product.faqs.map((f, i) => ({ value: `faq-${i}`, title: f.q, content: <p>{f.a}</p> }))}
          />
        </section>
      ) : null}

      {/* Other colorways */}
      <section className="border-t border-line bg-bone py-20 md:py-28">
        <div className="container-racket">
          <p className="type-eyebrow text-ink/50">Same board, different mood</p>
          <h2 className="type-display mt-5 text-[clamp(2.2rem,4.5vw,4rem)]">Other colorways.</h2>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {[...family.filter((f) => f.slug !== slug), ...relatedOthers].slice(0, 4).map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
