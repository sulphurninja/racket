/** Public origin. Every canonical, sitemap, and structured-data URL is built from this. */
export const SITE_URL = "https://weareracket.com";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export const siteConfig = {
  name: "RACKET",
  tagline: "Make some noise.",
  description:
    "RACKET makes loud-looking, great-sounding desk gear: 75% gasket-mount, hot-swap mechanical keyboards with RGB, plus chairs, desks and desk mats next. For gamers, creators and anyone whose setup is their statement.",
  url: SITE_URL,
  locale: "en-IN",
  currency: "INR",
  region: "India",
  contactEmail: "hello@weareracket.com",
  /**
   * Preview flag. While true, the storefront shows honest notices that prices
   * are placeholders and checkout is not live.
   */
  previewMode: true,
  /** Store policy values (configurable; mirrored into StoreSettings in Phase 2). */
  commerce: {
    freeShippingThresholdMinor: 2_999_00,
    standardShippingMinor: 149_00,
  },
  /**
   * Social profiles are only rendered as links once a verified handle is set.
   */
  social: [
    { label: "Instagram", href: null as string | null },
    { label: "YouTube", href: null as string | null },
    { label: "X", href: null as string | null },
    { label: "Discord", href: null as string | null },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
