import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-racket pt-[calc(var(--header-h)+3rem)] pb-24">
      <h1 className="type-display text-[clamp(2.8rem,7vw,6rem)]">Cart.</h1>
      <CartView />
    </div>
  );
}
