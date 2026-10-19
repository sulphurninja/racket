import { CartDrawer } from "@/components/cart/cart-drawer";
import { DropTicker, type DropAlert } from "@/components/layout/drop-ticker";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { StoreProviders } from "@/components/providers/store-providers";
import { Toaster } from "@/components/ui/toaster";
import { getColorway } from "@/config/colorways";
import { defaultVariant, productColorways } from "@/lib/catalog/product-utils";
import { getAllProducts } from "@/lib/catalog/repository";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  // Real first-run stock for the drop ticker. Honest hype only.
  const products = await getAllProducts();
  const alerts: DropAlert[] = products
    .map((p) => {
      const shot = p.media.find((m) => m.view === "studio") ?? p.media[0];
      return {
        slug: p.slug,
        name: `K75 ${getColorway(productColorways(p)[0]).name}`,
        stock: defaultVariant(p).stock,
        image: shot ? { url: shot.url, alt: shot.alt } : undefined,
      };
    })
    .filter((a) => a.stock > 0);

  return (
    <StoreProviders>
      <Header />
      <main id="main" className="min-h-[60dvh]">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <SearchOverlay />
      <Toaster />
      <DropTicker alerts={alerts} />
    </StoreProviders>
  );
}
