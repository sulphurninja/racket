import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/marks";
import { FOOTER_LINKS } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "./newsletter-form";

export async function Footer() {
  "use cache";
  cacheLife("days");
  const socials = siteConfig.social.filter((s) => s.href);
  return (
    <footer data-nav-theme="dark" className="relative overflow-hidden bg-ink text-paper">
      <div className="container-racket relative pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div id="drops" className="scroll-mt-28 lg:col-span-6">
            <p className="type-eyebrow text-paper/45">Drop alerts · Restocks · Early access</p>
            <h2 className="type-display mt-5 text-[clamp(2.6rem,6vw,5rem)]">
              The list
              <br />
              hears first.
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/60">
              New colorways, new categories, restocks. Straight to your inbox before anyone else. Zero spam, all
              signal.
            </p>
            <NewsletterForm className="mt-8" />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <p className="type-eyebrow text-paper/40">{group.title}</p>
                <ul className="mt-5 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[15px] text-paper/75 transition-colors hover:text-paper">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="relative mt-20 flex items-end justify-between gap-8">
          <Logo tone="metal" className="w-[min(52vw,300px)]" />
          <Image
            src="/brand/racket-badge.png"
            alt="RACKET emblem"
            width={512}
            height={512}
            unoptimized
            draggable={false}
            className="w-14 shrink-0 drop-shadow-[0_6px_24px_rgb(0_0_0/0.5)] select-none md:w-20"
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line-inverse pt-6 text-[13px] text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} RACKET. {siteConfig.tagline.toUpperCase()}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href!} target="_blank" rel="noreferrer" className="hover:text-paper">
                {s.label}
              </a>
            ))}
            <span>Prices in INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
