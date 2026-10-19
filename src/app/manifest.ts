import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${siteConfig.url}/`,
    name: "RACKET",
    short_name: "RACKET",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F7F5",
    theme_color: "#F7F7F5",
    lang: siteConfig.locale,
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
