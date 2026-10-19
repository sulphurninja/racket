// Dev utility: capture screenshots of local routes with the system Edge/Chrome.
// Usage: node scripts/screenshot.mjs <path> <out.png> [width] [height] [fullPage] [scrollY]
import { chromium } from "playwright-core";

const [, , route = "/", out = "shot.png", width = "1440", height = "900", full = "false", scrollY = "0"] = process.argv;
const base = process.env.SHOT_BASE ?? "http://localhost:3000";

const browser = await chromium.launch({ channel: process.env.SHOT_CHANNEL ?? "msedge" });
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: Number(width) < 600 ? 2 : 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.addInitScript(() => sessionStorage.setItem("rk-intro", "1"));
await page.goto(base + route, { waitUntil: "networkidle", timeout: 120_000 });
if (Number(scrollY)) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
}
await page.waitForTimeout(1500);
await page.screenshot({ path: out, fullPage: full === "true" });
if (errors.length) console.log("PAGE ERRORS:\n" + errors.join("\n"));
await browser.close();
