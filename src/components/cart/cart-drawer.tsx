"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button, ArrowGlyph } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantitySelector } from "@/components/ui/quantity";
import { ProductImage } from "@/components/product/product-image";
import { siteConfig } from "@/config/site";
import { estimateCart, MAX_LINE_QUANTITY } from "@/lib/cart/totals";
import { formatMoney } from "@/lib/money";
import { useCartStore, type CartLine } from "@/stores/cart-store";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 py-5"
    >
      <Link href={`/products/${line.slug}`} onClick={onNavigate} className="shrink-0">
        <ProductImage media={line.media} sizes="96px" className="h-24 w-24 rounded-[var(--radius-md)]" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${line.slug}`}
              onClick={onNavigate}
              className="block truncate text-[15px] font-medium tracking-[-0.01em] hover:underline"
            >
              {line.title}
            </Link>
            <p className="type-meta mt-1 text-ink/50">{line.sku}</p>
          </div>
          <p className="text-[15px] tabular">{formatMoney(line.priceMinor * line.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantitySelector
            size="sm"
            value={line.quantity}
            max={Math.min(MAX_LINE_QUANTITY, line.stock)}
            onChange={(n) => setQuantity(line.variantId, n)}
            label={`Quantity for ${line.title}`}
          />
          <button
            type="button"
            onClick={() => remove(line.variantId)}
            className="grid h-8 w-8 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label={`Remove ${line.title}`}
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function CartSummary({ lines }: { lines: CartLine[] }) {
  const est = estimateCart(lines);
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink/60">Subtotal</dt>
        <dd className="tabular">{formatMoney(est.subtotalMinor)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink/60">Shipping (estimate)</dt>
        <dd className="tabular">{est.shippingMinor === 0 ? "Free" : formatMoney(est.shippingMinor)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-[15px] font-medium">
        <dt>Estimated total</dt>
        <dd className="tabular">{formatMoney(est.totalMinor)}</dd>
      </div>
    </dl>
  );
}

export function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const setOpen = useCartStore((s) => s.setDrawer);
  const lines = useCartStore((s) => s.lines);
  const est = estimateCart(lines);
  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} title="Your cart" description="Review the items in your cart">
      <div className="flex items-baseline gap-3 border-b border-line px-6 pt-6 pb-5">
        <h2 className="type-display-narrow text-2xl">Your cart</h2>
        <span className="type-meta text-ink/50">{est.itemCount} {est.itemCount === 1 ? "item" : "items"}</span>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="Too quiet in here."
            description="Pick a colorway. Make some noise. It all lands here."
            action={
              <Button asChild onClick={close}>
                <Link href="/collections/keyboards">
                  Fix that <ArrowGlyph />
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {est.freeShippingRemainingMinor > 0 ? (
            <div className="px-6 pt-4">
              <p className="text-[13px] text-ink/70">
                Add <span className="font-medium text-ink tabular">{formatMoney(est.freeShippingRemainingMinor)}</span> for free shipping
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  className="h-full rounded-full bg-ink"
                  initial={false}
                  animate={{ width: `${est.freeShippingProgress * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ) : (
            <p className="px-6 pt-4 text-[13px] text-ink/70">
              Free shipping on orders over {formatMoney(siteConfig.commerce.freeShippingThresholdMinor)}.
            </p>
          )}
          <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLineItem key={line.variantId} line={line} onNavigate={close} />
              ))}
            </AnimatePresence>
          </ul>
          <div className="border-t border-line bg-bone/60 px-6 pt-5 pb-6">
            <CartSummary lines={lines} />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="secondary" asChild onClick={close}>
                <Link href="/cart">View cart</Link>
              </Button>
              <Button asChild onClick={close}>
                <Link href="/checkout">
                  Checkout <ArrowGlyph />
                </Link>
              </Button>
            </div>
            <p className="type-meta mt-3 text-center text-[10.5px] text-ink/45">
              Final prices, shipping and taxes are confirmed at checkout.
            </p>
          </div>
        </>
      )}
    </Drawer>
  );
}
