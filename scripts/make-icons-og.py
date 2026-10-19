"""Circular favicon set from public/fav.png + branded 1200x630 OG image.

    python scripts/make-icons-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "src" / "app"

# ── Circular favicon ──────────────────────────────────────────
src = Image.open(ROOT / "public" / "fav.png").convert("RGBA")
# Trim any outer margin, keep the metallic badge.
bbox = ImageOps.invert(src.convert("L")).getbbox()  # badge on white bg
src = src.crop(bbox)
side = min(src.size)
src = ImageOps.fit(src, (side, side), Image.LANCZOS)

scale = 4  # supersample the mask for clean edges
inset = round(side * scale * 0.015)  # shave the ragged outer rim
mask = Image.new("L", (side * scale, side * scale), 0)
ImageDraw.Draw(mask).ellipse((inset, inset, side * scale - 1 - inset, side * scale - 1 - inset), fill=255)
mask = mask.resize((side, side), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))

badge = src.copy()
badge.putalpha(mask)


def save(size: int, path: Path):
    badge.resize((size, size), Image.LANCZOS).save(path)


save(512, APP / "icon.png")
save(180, APP / "apple-icon.png")
save(512, ROOT / "public" / "brand" / "racket-badge.png")
badge.resize((64, 64), Image.LANCZOS).save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("icons ok", side)

# ── OG image: midnight hero + chrome lockup + tagline-safe space ──
W, H = 1200, 630
hero = Image.open(ROOT / "public" / "products" / "racket75-midnight-hero.webp").convert("RGB")
og = ImageOps.fit(hero, (W, H), Image.LANCZOS, centering=(0.72, 0.5))

# Darken the left side so the lockup pops.
grad = Image.new("L", (W, 1), 0)
for x in range(W):
    grad.putpixel((x, 0), int(190 * max(0.0, 1 - x / (W * 0.78))))
shade = Image.new("RGB", (W, H), (8, 9, 12))
og = Image.composite(shade, og, grad.resize((W, H)))

lockup = Image.open(ROOT / "public" / "brand" / "racket-lockup-metal.png").convert("RGBA")
lw = 560
lockup = lockup.resize((lw, round(lockup.height * lw / lockup.width)), Image.LANCZOS)
og.paste(lockup, (72, H // 2 - lockup.height // 2 - 20), lockup)

og.save(APP / "opengraph-image.png", optimize=True)
og.save(APP / "twitter-image.png", optimize=True)
print("og ok", og.size)
