/**
 * RACKET catalog seed.
 *
 * Products are the K75 keyboards supplied for RACKET. Photography in
 * /public/products is AI-generated from the supplier photos of each exact
 * keyboard (see scripts/fetch-product-media.py).
 *
 * ⚠ Prices and stock are working placeholders (`priceConfirmed: false`) until
 * RACKET confirms them. Specifications are as listed by the supplier and are
 * shown with that attribution (`specsVerified: false`).
 * The Phase 2 seed script imports this file into MongoDB.
 */

import { COLORWAYS, type ColorwayId } from "@/config/colorways";
import { STACK_SLUG_BY_COLORWAY } from "./collections";
import { productAsset } from "./media";
import type { Highlight, Product, ProductMedia, SpecGroup } from "./types";

/** Placeholder until RACKET confirms retail pricing. Integer paise. */
export const PLACEHOLDER_PRICE_MINOR = 6_499_00;
const PLACEHOLDER_STOCK = 25;

const COLOR_CODES: Record<ColorwayId, string> = {
  cedar: "CED",
  glacier: "GLC",
  cloud: "CLD",
  midnight: "MID",
};

const SIZES = {
  studio: { width: 2000, height: 2000 },
  lifestyle: { width: 2000, height: 1493 },
  detail: { width: 1611, height: 2000 },
  top: { width: 1024, height: 1016 },
  front: { width: 2400, height: 1350 },
} as const;

function media(colorway: ColorwayId, view: keyof typeof SIZES, alt: string): ProductMedia {
  return {
    id: `f75-${colorway}-${view}`,
    url: productAsset(`/products/racket75-${colorway}-${view}.webp`),
    alt,
    view,
    colorway,
    ...SIZES[view],
  };
}

export function productImages(colorway: ColorwayId) {
  const name = `RACKET K75 in ${COLORWAYS[colorway].name}`;
  return {
    front: media(colorway, "front", `${name}, front view`),
    studio: media(colorway, "studio", `${name}, studio shot`),
    lifestyle: media(colorway, "lifestyle", `${name} on a desk setup`),
    detail: media(colorway, "detail", `${name}, close-up of the keycaps and knob`),
  };
}

const SUPPLIER_SPECS: SpecGroup[] = [
  {
    group: "Layout",
    rows: [
      { label: "Form factor", value: "75% with rotary knob" },
      { label: "Lighting", value: "RGB backlight" },
    ],
  },
  {
    group: "Build",
    rows: [
      { label: "Structure", value: "Gasket mount" },
      { label: "PCB", value: "Single-key slotted PCB" },
      { label: "Switch sockets", value: "Hot-swappable" },
      { label: "Switch", value: "Reaper" },
      { label: "Acoustics", value: "Five layers of noise reduction" },
    ],
  },
  {
    group: "Connectivity",
    rows: [{ label: "Modes", value: "Three-mode" }],
  },
];

const STANDARD_FAQS = [
  {
    q: "Can I change the switches?",
    a: "Yes. The K75 is hot-swap: pull a switch, push in a new one, zero soldering. Change your mind as often as you like.",
  },
  {
    q: "What does three-mode mean?",
    a: "Three ways to connect to your setup. We're locking down the exact modes and pairing steps on production units and will publish them here before launch.",
  },
  {
    q: "When will my order ship?",
    a: "Soon. This store is in preview. Dispatch timelines go live at checkout the moment we start shipping.",
  },
  {
    q: "What warranty is included?",
    a: "We're finalising warranty terms now and will publish them here before sales open. We only promise what we can back.",
  },
];

function highlights(colorway: ColorwayId): Highlight[] {
  const img = productImages(colorway);
  return [
    {
      id: "gasket",
      eyebrow: "Feel",
      title: "Softly sprung. Zero slap.",
      body: "Gasket structure plus a single-key slotted PCB. Every press lands cushioned, not clacked-out. Your fingers will notice by row two.",
      image: img.detail,
    },
    {
      id: "sound",
      eyebrow: "Sound",
      title: "Five layers deep. All signal.",
      body: "Five layers of noise reduction tune out the ping and the rattle. What’s left is that deep, round thock. Make some noise. The good kind.",
      image: img.studio,
    },
    {
      id: "swap",
      eyebrow: "Make it yours",
      title: "Hot-swap. Commitment optional.",
      body: "Reaper switches out of the box, hot-swap sockets underneath. Pull, push, done. Rebuild the feel whenever the mood hits.",
      image: img.lifestyle,
    },
  ];
}

type K75Input = {
  colorway: ColorwayId;
  tagline: string;
  summary: string;
  description: string[];
  featuredRank: number;
  createdAt: string;
  extraMedia?: ProductMedia[];
};

function f75({ colorway, tagline, summary, description, featuredRank, createdAt, extraMedia = [] }: K75Input): Product {
  const cw = COLORWAYS[colorway];
  const slug = `f75-${cw.slug}`;
  const sku = `RK-K75-${COLOR_CODES[colorway]}`;
  const img = productImages(colorway);
  return {
    id: `p_f75_${colorway}`,
    slug,
    title: `RACKET K75 ${cw.name}`,
    family: "RACKET K75",
    category: "keyboards",
    subcategory: "Mechanical keyboards",
    collections: ["keyboards", STACK_SLUG_BY_COLORWAY[colorway]],
    tagline,
    summary,
    description,
    options: [{ key: "colorway", name: "Colorway", values: [{ value: colorway, label: cw.name }] }],
    variants: [
      {
        id: sku.toLowerCase(),
        sku,
        title: cw.name,
        options: { colorway },
        priceMinor: PLACEHOLDER_PRICE_MINOR,
        compareAtMinor: null,
        stock: PLACEHOLDER_STOCK,
      },
    ],
    media: [img.front, img.studio, img.lifestyle, img.detail, ...extraMedia],
    highlights: highlights(colorway),
    specs: SUPPLIER_SPECS,
    specsVerified: false,
    specsSource: "Final specs get locked and verified on production units before launch.",
    priceConfirmed: false,
    boxContents: [],
    compatibility: [],
    faqs: STANDARD_FAQS,
    badges: [],
    featured: true,
    featuredRank,
    status: "active",
    seo: {
      title: `K75 ${cw.name}. 75% gasket mount mechanical keyboard`,
      description: `The RACKET K75 in ${cw.name}: a 75% gasket-mount mechanical keyboard with hot-swap switches, RGB backlight, rotary knob and three-mode wireless. ${tagline}`,
    },
    createdAt,
  };
}

export const SEED_PRODUCTS: Product[] = [
  f75({
    colorway: "cedar",
    tagline: "Looks calm. Types loud.",
    summary: "The K75 in Matcha. Grey case, milk-white alphas, sage on the keys that matter.",
    description: [
      "Matcha keeps the sage on the spacebar, escape, enter and arrows. Grey case, milk-white alphas, slate modifiers.",
      "Underneath: a gasket structure, single-key slotted PCB, hot-swap sockets and five layers of noise reduction.",
    ],
    featuredRank: 1,
    createdAt: "2026-10-01T00:00:00.000Z",
  }),
  f75({
    colorway: "glacier",
    tagline: "Ice cold. Black streak.",
    summary: "The K75 in Ice. White case, icy-blue modifiers, black where it counts.",
    description: [
      "Ice stays cold. White case, white alphas, icy-blue modifiers, black spacebar, enter and arrows.",
      "Underneath: a gasket structure, single-key slotted PCB, hot-swap sockets and five layers of noise reduction.",
    ],
    featuredRank: 2,
    createdAt: "2026-10-02T00:00:00.000Z",
  }),
  f75({
    colorway: "cloud",
    tagline: "Sky fade. Lit from below.",
    summary: "The K75 in Sky. White fading into sky blue, RGB glowing underneath.",
    description: [
      "Sky fades from white on the function row to sky blue down low, with RGB glowing up through the edges.",
      "Underneath: a gasket structure, single-key slotted PCB, hot-swap Reaper switches and five layers of noise reduction.",
    ],
    featuredRank: 3,
    createdAt: "2026-10-03T00:00:00.000Z",
  }),
  f75({
    colorway: "midnight",
    tagline: "Grey to black. Made for 2AM.",
    summary: "The K75 in Ash. Matte black case, keys fading from grey to charcoal.",
    description: [
      "Ash is the low one. Black case, black knob, keys fading from light grey up top to charcoal at the bottom.",
      "Underneath: a gasket structure, single-key slotted PCB, hot-swap sockets and five layers of noise reduction.",
    ],
    featuredRank: 4,
    createdAt: "2026-10-04T00:00:00.000Z",
    extraMedia: [media("midnight", "top", "RACKET K75 in Ash, top-down view")],
  }),
];
