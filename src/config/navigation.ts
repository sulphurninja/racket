import { COLORWAYS, SHOWCASE_COLORWAYS } from "@/config/colorways";
import { STACK_COLLECTIONS } from "@/lib/catalog/collections";
import { productAsset } from "@/lib/catalog/media";
import type { ImageAsset } from "@/lib/catalog/types";

export type NavLink = { label: string; href: string; swatch?: string; note?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  groups: NavGroup[];
  feature: { title: string; caption: string; href: string; image: ImageAsset; scene: string };
};

const colorwayLinks: NavLink[] = SHOWCASE_COLORWAYS.map((id) => ({
  label: COLORWAYS[id].name,
  href: `/products/f75-${COLORWAYS[id].slug}`,
  swatch: COLORWAYS[id].swatch,
}));

const stackLinks: NavLink[] = STACK_COLLECTIONS.map((c) => ({
  label: c.title,
  href: `/collections/${c.slug}`,
  swatch: c.colorway ? COLORWAYS[c.colorway].swatch : undefined,
}));

export const NAV: NavItem[] = [
  {
    label: "Keyboards",
    href: "/collections/keyboards",
    groups: [
      {
        title: "RACKET K75",
        links: colorwayLinks,
      },
      {
        title: "Shop",
        links: [
          { label: "All keyboards", href: "/collections/keyboards" },
          { label: "Explore the stacks", href: "/#stacks" },
        ],
      },
    ],
    feature: {
      title: "RACKET K75",
      caption: "75%. Gasket mount. Hot-swap. Four colorways.",
      href: "/collections/keyboards",
      image: {
        url: productAsset("/products/racket75-glacier-studio.webp"),
        alt: "RACKET K75 in Ice",
        width: 2000,
        height: 2000,
      },
      scene: "glacier",
    },
  },
  {
    label: "The Stacks",
    href: "/#stacks",
    groups: [
      { title: "Board + mat + caps", links: stackLinks },
      {
        title: "Explore",
        links: [
          { label: "Shop all", href: "/collections/all" },
          { label: "On the desk", href: "/#setups" },
        ],
      },
    ],
    feature: {
      title: "Daydream",
      caption: "One vibe, head to toe. Board now, mat and caps loading.",
      href: "/collections/daydream",
      image: {
        url: "/collections/daydream.webp",
        alt: "RACKET K75 in Sky on an anime sky-art desk mat",
        width: 2000,
        height: 1116,
      },
      scene: "cloud",
    },
  },
  {
    label: "Next Up",
    href: "/#next-up",
    groups: [
      {
        title: "In the lab",
        links: [
          { label: "Gaming chairs", href: "/#next-up", note: "Loading" },
          { label: "Desks", href: "/#next-up", note: "Loading" },
          { label: "Desk mats", href: "/#next-up", note: "Loading" },
          { label: "Workspace", href: "/#next-up", note: "Loading" },
        ],
      },
      {
        title: "Don't miss it",
        links: [
          { label: "Get drop alerts", href: "/#drops" },
          { label: "Shop keyboards now", href: "/collections/keyboards" },
        ],
      },
    ],
    feature: {
      title: "The whole room is coming",
      caption: "Chairs, desks, mats. The list hears first.",
      href: "/#drops",
      image: {
        url: productAsset("/products/racket75-cedar-lifestyle.webp"),
        alt: "RACKET K75 on a desk setup",
        width: 2000,
        height: 1493,
      },
      scene: "cedar",
    },
  },
];

export const FOOTER_LINKS: NavGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "All keyboards", href: "/collections/keyboards" },
      ...stackLinks.map(({ label, href }) => ({ label, href })),
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/pages/shipping" },
      { label: "Returns", href: "/pages/returns" },
      { label: "Warranty", href: "/pages/warranty" },
      { label: "Contact", href: "/pages/contact" },
    ],
  },
  {
    title: "RACKET",
    links: [
      { label: "About", href: "/pages/about" },
      { label: "Privacy", href: "/pages/privacy" },
      { label: "Terms", href: "/pages/terms" },
    ],
  },
];
