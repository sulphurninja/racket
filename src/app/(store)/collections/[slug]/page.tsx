import { Suspense } from "react";
import { Skeleton } from "@/components/ui/primitives";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CollectionGrid } from "@/components/collection/collection-grid";
import { getColorway } from "@/config/colorways";
import { absoluteUrl } from "@/config/site";
import { COLLECTIONS } from "@/lib/catalog/collections";
import { getCatalogPage, getCollection } from "@/lib/catalog/repository";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  const title = collection.stack
    ? `${collection.title} Stack. Keyboard, desk mat and keycaps`
    : `${collection.title}. 75% mechanical keyboards`;
  return {
    title,
    description: collection.description,
    keywords: [
      "75% mechanical keyboard",
      "gasket mount keyboard",
      "hot-swap mechanical keyboard",
      "RGB mechanical keyboard",
      "mechanical keyboard India",
      "desk setup combo",
      "keyboard and desk mat combo",
      `${collection.title.toLowerCase()} mechanical keyboard`,
    ],
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      url: `/collections/${slug}`,
      title: `${title} · RACKET`,
      description: collection.description,
      images: [{ url: collection.heroImage.url, alt: collection.heroImage.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[62svh] rounded-none" />}>
      {params.then(({ slug }) => (
        <CollectionPageContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function CollectionPageContent({ slug }: { slug: string }) {
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const page = await getCatalogPage({
    collection: collection.kind === "all" ? undefined : collection.slug,
    category: collection.category,
    perPage: 48,
  });
  const dark = collection.scene !== "neutral" && getColorway(collection.scene).dark;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: absoluteUrl(`/collections/${collection.slug}`),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: page.items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: absoluteUrl(`/products/${p.slug}`),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section
        data-scene={collection.scene}
        data-nav-theme={dark ? "dark" : "light"}
        className="scene-surface relative isolate flex min-h-[62svh] items-end overflow-hidden"
      >
        <Image
          src={collection.heroImage.url}
          alt={collection.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[72%_center] md:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[color-mix(in_oklab,var(--scene-bg)_80%,transparent)] via-transparent to-transparent md:bg-gradient-to-r md:from-[color-mix(in_oklab,var(--scene-bg)_70%,transparent)]" />
        <div className="container-racket pt-[calc(var(--header-h)+3rem)] pb-12 md:pb-16">
          <p className="intro-rise type-eyebrow opacity-60">{collection.eyebrow}</p>
          <h1 className="type-display mt-4 text-[clamp(3rem,9vw,8rem)]">
            <span className="intro-mask">
              <span>{collection.title}</span>
            </span>
          </h1>
          <p className="intro-rise mt-4 max-w-md text-[15px] leading-relaxed opacity-75 md:text-base" style={{ ["--d" as string]: "120ms" }}>
            {collection.headline} {collection.description}
          </p>
        </div>
      </section>

      <div className="container-racket pb-24 md:pb-32">
        <CollectionGrid items={page.items} showColorFilter={collection.kind !== "colorway"} />
      </div>
    </>
  );
}
