import { BRAND_ASSETS } from "./marks";

/**
 * Signature intro (~3s): the chrome emblem rises out of a blur, light sweeps
 * across it twice while the bar fills, then the overlay dissolves into the hero.
 *
 * Pure CSS (see globals.css) so it never waits on hydration and never blocks
 * pointer input. Plays on every homepage load, including refresh, and holds
 * for 3 seconds. Skipped off the homepage and for reduced-motion users.
 */
export function BrandLoader() {
  const src = BRAND_ASSETS.emblem.metal;
  return (
    <div className="rk-loader" aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="rk-loader__mark relative w-[104px]" style={{ aspectRatio: "832 / 703" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="rk-loader__emblem absolute inset-0 h-full w-full" />
          <div
            className="rk-loader__shine absolute inset-0"
            style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
          />
        </div>
        <div className="rk-loader__tag mt-9 flex flex-col items-center gap-4">
          <p className="type-eyebrow text-[10px] tracking-[0.32em] text-white/55">Make some noise</p>
          <div className="rk-loader__bar h-px w-28 overflow-hidden bg-white/10">
            <span className="block h-full bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Runs before first paint: skip the intro off the homepage and for reduced motion. */
export const INTRO_SCRIPT = `(function(){try{var d=document.documentElement;var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||location.pathname!=='/'){d.setAttribute('data-intro','skip')}}catch(e){document.documentElement.setAttribute('data-intro','skip')}})()`;
