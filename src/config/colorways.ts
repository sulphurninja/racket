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
    name: "Matcha",
    shortName: "Matcha",
    slug: "cedar-green",
    swatch: "#7F9C88",
    swatchAlt: "#B9BCCF",
    scene: "cedar",
    mood: "Calm · Green · Secretly loud",
    description:
      "Sage on a grey case, milk-white keys. Looks quiet. Types loud.",
    dark: false,
  },
  glacier: {
    id: "glacier",
    name: "Ice",
    shortName: "Ice",
    slug: "glacier-blue",
    swatch: "#BFD8EC",
    swatchAlt: "#1E1F24",
    scene: "glacier",
    mood: "Cold · Clean · Screenshot bait",
    description:
      "White on ice blue, cut with black. Clean enough to disappear. Sharp enough to screenshot.",
    dark: false,
  },
  cloud: {
    id: "cloud",
    name: "Sky",
    shortName: "Sky",
    slug: "cloud-blue",
    swatch: "#7DB6EE",
    swatchAlt: "#F4F8FD",
    scene: "cloud",
    mood: "Soft · Blue · Always glowing",
    description:
      "White melting into sky blue, RGB under the edges. Golden hour, but it's your desk.",
    dark: false,
  },
  midnight: {
    id: "midnight",
    name: "Ash",
    shortName: "Ash",
    slug: "midnight",
    swatch: "#1B1C21",
    swatchAlt: "#8D9199",
    scene: "midnight",
    mood: "Dark · Low · Made for 2AM",
    description:
      "Grey fading into black on a matte case. Built for the late push and the people who stay.",
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
