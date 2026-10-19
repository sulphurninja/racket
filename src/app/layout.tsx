import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { INTRO_SCRIPT } from "@/components/brand/brand-loader";
import { siteConfig } from "@/config/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "RACKET — Mechanical Keyboards & Desk Setup Gear | Make Some Noise.",
    template: "%s · RACKET",
  },
  description: siteConfig.description,
  applicationName: "RACKET",
  keywords: [
    "mechanical keyboard",
    "75% mechanical keyboard",
    "gasket mount keyboard",
    "hot-swap mechanical keyboard",
    "RGB mechanical keyboard",
    "wireless mechanical keyboard",
    "custom keyboard India",
    "mechanical keyboard India",
    "desk setup",
    "desk setup accessories",
    "battlestation setup",
    "gaming keyboard",
    "keyboard with knob",
    "RACKET K75",
    "RACKET keyboards",
  ],
  category: "shopping",
  creator: "RACKET",
  publisher: "RACKET",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // OG/Twitter images come from app/opengraph-image.png + app/twitter-image.png (file convention).
  authors: [{ name: "RACKET", url: siteConfig.url }],
  openGraph: {
    type: "website",
    siteName: "RACKET",
    locale: "en_IN",
    title: "RACKET — Mechanical Keyboards & Desk Setup Gear",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "RACKET — Mechanical Keyboards & Desk Setup Gear",
    description: siteConfig.description,
  },
};

/** Organization + WebSite (with SearchAction) for rich results and answer engines. */
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#org`,
      name: "RACKET",
      url: siteConfig.url,
      email: siteConfig.contactEmail,
      slogan: "Make some noise.",
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.png`,
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: "RACKET",
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#org` },
      inLanguage: siteConfig.locale,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F5" },
    { media: "(prefers-color-scheme: dark)", color: "#111216" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
