import type { ColorwayId } from "@/config/colorways";
import type { CollectionDefinition, ImageAsset } from "./types";

/**
 * Collection definitions. In Phase 2 these become the `Collection` model and
 * are editable from /admin/collections; the shape stays the same.
 */

export function heroImage(colorway: ColorwayId, alt: string): ImageAsset {
  return { url: `/products/racket75-${colorway}-hero.webp`, alt, width: 2000, height: 1116 };
}

function stackHero(slug: string, alt: string): ImageAsset {
  return { url: `/collections/${slug}.webp`, alt, width: 2000, height: 1116 };
}

/** Every stack ships the board today; the mat and caps are honest "loading" teasers. */
function stackPieces(board: string) {
  return [
    { label: `${board} — shipping now`, status: "live" as const },
    { label: "Themed art desk mat — loading", status: "loading" as const },
    { label: "Custom keycap set — loading", status: "loading" as const },
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
    heroImage: heroImage("glacier", "RACKET K75 keyboard in Glacier Blue"),
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
    heroImage: heroImage("glacier", "RACKET K75 keyboard in Glacier Blue"),
  },
  {
    slug: "frostbite",
    title: "Frostbite",
    kind: "colorway",
    colorway: "glacier",
    eyebrow: "The stack · 01",
    headline: "Ice in the veins.",
    description:
      "The K75 Glacier Blue, a glacial-art desk mat and matching keycaps. The board ships today — the rest of the stack is loading.",
    scene: "glacier",
    heroImage: stackHero("frostbite", "RACKET K75 Glacier Blue on an ice-crystal art desk mat"),
    stack: stackPieces("K75 Glacier Blue"),
  },
  {
    slug: "touch-grass",
    title: "Touch Grass",
    kind: "colorway",
    colorway: "cedar",
    eyebrow: "The stack · 02",
    headline: "Outside, indoors.",
    description:
      "The K75 Cedar Green, a meadow-art desk mat and matching keycaps. The board ships today — the rest of the stack is loading.",
    scene: "cedar",
    heroImage: stackHero("touch-grass", "RACKET K75 Cedar Green on a meadow-art desk mat"),
    stack: stackPieces("K75 Cedar Green"),
  },
  {
    slug: "daydream",
    title: "Daydream",
    kind: "colorway",
    colorway: "cloud",
    eyebrow: "The stack · 03",
    headline: "Head in the clouds.",
    description:
      "The K75 Cloud Blue, a dreamy sky-art desk mat and matching keycaps. The board ships today — the rest of the stack is loading.",
    scene: "cloud",
    heroImage: stackHero("daydream", "RACKET K75 Cloud Blue on an anime sky-art desk mat"),
    stack: stackPieces("K75 Cloud Blue"),
  },
  {
    slug: "blackout",
    title: "Blackout",
    kind: "colorway",
    colorway: "midnight",
    eyebrow: "The stack · 04",
    headline: "Lights off. Locked in.",
    description:
      "The K75 Midnight, a neon-city desk mat and matching keycaps. The board ships today — the rest of the stack is loading.",
    scene: "midnight",
    heroImage: stackHero("blackout", "RACKET K75 Midnight on a cyberpunk city-art desk mat"),
    stack: stackPieces("K75 Midnight"),
  },
];

export function getCollectionDefinition(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** The curated stacks (board + mat + caps combos). */
export const STACK_COLLECTIONS = COLLECTIONS.filter((c) => c.stack);
export const COLORWAY_COLLECTIONS = STACK_COLLECTIONS;

/** Which stack a colorway belongs to — used when seeding product → collection links. */
export const STACK_SLUG_BY_COLORWAY: Record<ColorwayId, string> = {
  glacier: "frostbite",
  cedar: "touch-grass",
  cloud: "daydream",
  midnight: "blackout",
};
