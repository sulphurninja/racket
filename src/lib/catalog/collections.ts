import type { ColorwayId } from "@/config/colorways";
import { productAsset } from "./media";
import type { CollectionDefinition, ImageAsset } from "./types";

/**
 * Collection definitions. In Phase 2 these become the `Collection` model and
 * are editable from /admin/collections; the shape stays the same.
 */

export function heroImage(colorway: ColorwayId, alt: string): ImageAsset {
  return { url: productAsset(`/products/racket75-${colorway}-hero.webp`), alt, width: 2000, height: 1116 };
}

function stackHero(slug: string, alt: string): ImageAsset {
  return { url: `/collections/${slug}.webp`, alt, width: 2000, height: 1116 };
}

/** Every stack ships the board today; the mat and caps are honest "loading" teasers. */
function stackPieces(board: string) {
  return [
    { label: `${board}. Shipping now`, status: "live" as const },
    { label: "Themed art desk mat. Loading", status: "loading" as const },
    { label: "Custom keycap set. Loading", status: "loading" as const },
  ];
}

export const COLLECTIONS: CollectionDefinition[] = [
  {
    slug: "all",
    title: "Shop All",
    kind: "all",
    eyebrow: "The full lineup",
    headline: "Everything that makes some noise.",
    description: "Every RACKET board and every stack, one page.",
    scene: "neutral",
    heroImage: heroImage("glacier", "RACKET K75 keyboard in Ice"),
  },
  {
    slug: "keyboards",
    title: "Keyboards",
    kind: "category",
    category: "keyboards",
    eyebrow: "Mechanical keyboards",
    headline: "Feel every keystroke.",
    description: "75% gasket-mount, hot-swap mechanical keyboards in four colorways.",
    scene: "glacier",
    heroImage: heroImage("glacier", "RACKET K75 keyboard in Ice"),
  },
  {
    slug: "frostbite",
    title: "Frostbite",
    kind: "colorway",
    colorway: "glacier",
    eyebrow: "The stack · 01",
    headline: "Ice in the veins.",
    description:
      "The K75 in Ice, an ice-art desk mat and matching keycaps. The board ships today. The rest of the stack is loading.",
    scene: "glacier",
    heroImage: stackHero("frostbite", "RACKET K75 in Ice on an ice-crystal art desk mat"),
    stack: stackPieces("K75 Ice"),
  },
  {
    slug: "touch-grass",
    title: "Touch Grass",
    kind: "colorway",
    colorway: "cedar",
    eyebrow: "The stack · 02",
    headline: "Outside, indoors.",
    description:
      "The K75 in Matcha, a meadow-art desk mat and matching keycaps. The board ships today. The rest of the stack is loading.",
    scene: "cedar",
    heroImage: stackHero("touch-grass", "RACKET K75 in Matcha on a meadow-art desk mat"),
    stack: stackPieces("K75 Matcha"),
  },
  {
    slug: "daydream",
    title: "Daydream",
    kind: "colorway",
    colorway: "cloud",
    eyebrow: "The stack · 03",
    headline: "Head in the clouds.",
    description:
      "The K75 in Sky, a sky-art desk mat and matching keycaps. The board ships today. The rest of the stack is loading.",
    scene: "cloud",
    heroImage: stackHero("daydream", "RACKET K75 in Sky on an anime sky-art desk mat"),
    stack: stackPieces("K75 Sky"),
  },
  {
    slug: "blackout",
    title: "Blackout",
    kind: "colorway",
    colorway: "midnight",
    eyebrow: "The stack · 04",
    headline: "Lights off. Locked in.",
    description:
      "The K75 in Ash, a neon-city desk mat and matching keycaps. The board ships today. The rest of the stack is loading.",
    scene: "midnight",
    heroImage: stackHero("blackout", "RACKET K75 in Ash on a neon-city desk mat"),
    stack: stackPieces("K75 Ash"),
  },
];

export function getCollectionDefinition(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** The curated stacks (board + mat + caps combos). */
export const STACK_COLLECTIONS = COLLECTIONS.filter((c) => c.stack);
export const COLORWAY_COLLECTIONS = STACK_COLLECTIONS;

/** Which stack a colorway belongs to. Used when seeding product to collection links. */
export const STACK_SLUG_BY_COLORWAY: Record<ColorwayId, string> = {
  glacier: "frostbite",
  cedar: "touch-grass",
  cloud: "daydream",
  midnight: "blackout",
};
