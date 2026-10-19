/**
 * Colorway registry. Colorways are product attributes AND editorial scenes:
 * the same id drives swatches, collection pages and [data-scene] moods.
 * Every colorway here maps to a real product in the catalog.
 */

export type ColorwayId = "cedar" | "glacier" | "cloud" | "midnight";

export type Colorway = {
  id: ColorwayId;
  name: string;
  shortName: string;
  /** URL slug shared by the colorway collection and product (`/products/f75-{slug}`). */
  slug: string;
  /** Primary swatch tone (accent keycaps). */
  swatch: string;
  /** Secondary swatch tone (case / alphas). */
  swatchAlt: string;
  scene: ColorwayId;
  mood: string;
  description: string;
  dark: boolean;
};

export const COLORWAYS: Record<ColorwayId, Colorway> = {
  cedar: {
    id: "cedar",
    name: "Cedar Green",
    shortName: "Cedar",
    slug: "cedar-green",
    swatch: "#7F9C88",
    swatchAlt: "#B9BCCF",
    scene: "cedar",
    mood: "Grounded · Warm · Quiet",
    description:
      "Sage accents on a lavender-grey case with milk-white alphas. The calm one — until you start typing.",
    dark: false,
  },
  glacier: {
    id: "glacier",
    name: "Glacier Blue",
    shortName: "Glacier",
    slug: "glacier-blue",
    swatch: "#BFD8EC",
    swatchAlt: "#1E1F24",
    scene: "glacier",
    mood: "Crisp · Clear · Focused",
    description:
      "White on ice blue, cut with a black streak. Clean enough to disappear, sharp enough to get screenshotted.",
    dark: false,
  },
  cloud: {
    id: "cloud",
    name: "Cloud Blue",
    shortName: "Cloud",
    slug: "cloud-blue",
    swatch: "#7DB6EE",
    swatchAlt: "#F4F8FD",
    scene: "cloud",
    mood: "Airy · Dreamy · Glowing",
    description:
      "White melting into sky blue with RGB glowing underneath. Golden hour, but it's your desk.",
    dark: false,
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    shortName: "Midnight",
    slug: "midnight",
    swatch: "#1B1C21",
    swatchAlt: "#8D9199",
    scene: "midnight",
    mood: "Dark · Precise · Low-key",
    description:
      "Grey fading to black on a matte black case. Built for the 2AM push and the people who own it.",
    dark: true,
  },
};

export const SHOWCASE_COLORWAYS: ColorwayId[] = ["cedar", "glacier", "cloud", "midnight"];

export function getColorway(id: string | undefined | null): Colorway {
  return (id && COLORWAYS[id as ColorwayId]) || COLORWAYS.glacier;
}

export function isColorwayId(id: string): id is ColorwayId {
  return id in COLORWAYS;
}
