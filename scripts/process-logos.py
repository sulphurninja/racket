"""Builds transparent web logo assets from the master logo files (metal on black).

Outputs to public/brand. Favicons/app icons are built by scripts/make-icons-og.py
from the circular badge (public/fav.png). Run:
    python scripts/process-logos.py
"""
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-source" / "brand"
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

INK = (17, 18, 22)
GRAPHITE_HI = (112, 116, 128)


def cutout(path: Path, threshold: int = 14) -> tuple[Image.Image, Image.Image]:
    """Returns (metal_rgba, mask) where black background becomes transparent."""
    img = Image.open(path).convert("RGB")
    r, g, b = img.split()
    lum = ImageChops.lighter(ImageChops.lighter(r, g), b)
    # Soft alpha: anything near-black is background; ramp up quickly so edges stay crisp.
    mask = lum.point(lambda v: 0 if v < threshold else min(255, int((v - threshold) * 255 / 70)))
    # Un-premultiply from black so bright metal keeps its colour on any backdrop.
    metal = Image.merge(
        "RGB",
        [
            Image.eval(ch, lambda v: v)  # values already light; alpha handles blending
            for ch in (r, g, b)
        ],
    )
    rgba = metal.copy()
    rgba.putalpha(mask)
    bbox = mask.getbbox()
    return rgba.crop(bbox), mask.crop(bbox), lum.crop(bbox)


def graphite(mask: Image.Image, lum: Image.Image) -> Image.Image:
    """Dark brushed-graphite version for light backgrounds, keeping the metal shading."""
    w, h = mask.size
    out = Image.new("RGBA", (w, h))
    px_l = lum.load()
    px_m = mask.load()
    px_o = out.load()
    for y in range(h):
        for x in range(w):
            t = px_l[x, y] / 255
            t = t * t  # bias towards ink, highlights become graphite
            px_o[x, y] = (
                int(INK[0] + (GRAPHITE_HI[0] - INK[0]) * t),
                int(INK[1] + (GRAPHITE_HI[1] - INK[1]) * t),
                int(INK[2] + (GRAPHITE_HI[2] - INK[2]) * t),
                px_m[x, y],
            )
    return out


def save_pair(name: str, src: str, max_width: int):
    metal, mask, lum = cutout(SRC / src)
    if metal.width > max_width:
        ratio = max_width / metal.width
        size = (max_width, round(metal.height * ratio))
        metal = metal.resize(size, Image.LANCZOS)
        mask = mask.resize(size, Image.LANCZOS)
        lum = lum.resize(size, Image.LANCZOS)
    metal.save(OUT / f"{name}-metal.png", optimize=True)
    dark = graphite(mask, lum)
    dark.save(OUT / f"{name}-graphite.png", optimize=True)
    print(name, metal.size)
    return metal, dark


lockup_metal, lockup_dark = save_pair("racket-lockup", "racket-lockup.png", 1400)
emblem_metal, emblem_dark = save_pair("racket-emblem", "racket-emblem.png", 900)


def square_icon(img: Image.Image, size: int, bg=None, pad=0.12) -> Image.Image:  # noqa: unused — kept for ad-hoc use
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    inner = int(size * (1 - pad * 2))
    ratio = min(inner / img.width, inner / img.height)
    im = img.resize((round(img.width * ratio), round(img.height * ratio)), Image.LANCZOS)
    canvas.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    return canvas


print("brand assets written (icons live in scripts/make-icons-og.py)")
