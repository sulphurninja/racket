import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/primitives";
import { searchProducts } from "@/lib/catalog/repository";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 80).trim() ?? "";
  const items = await searchProducts(q, 24);
  return (
    <>
      <h1 className="type-display text-[clamp(2.4rem,6vw,5rem)]">{q ? `“${q}”` : "Search"}</h1>
      <p className="type-meta mt-3 text-ink/55">
        {items.length} {items.length === 1 ? "result" : "results"}
      </p>
      {items.length === 0 ? (
        <p className="mt-10 text-ink/65">Nothing matches that. Try a colorway like “Ice” or “Ash”.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {items.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="container-racket pt-[calc(var(--header-h)+3rem)] pb-24">
      <Suspense
        fallback={
          <div>
            <Skeleton className="h-16 w-72" />
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="aspect-[4/5]" />
              ))}
            </div>
          </div>
        }
      >
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
