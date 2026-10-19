"""Downloads the generated RACKET product photography and writes optimised WebP
files to public/products. Sources are kept in assets-source/generated.

    python scripts/fetch-product-media.py
"""
import subprocess
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets-source" / "generated"
OUT = ROOT / "public" / "products"
RAW.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_3JaQjmNRYzTeb05XXEoL45vk5gn/"
MEDIA = {
    "racket75-cedar-studio": "hf_20261018_194430_7501ce8d-4c73-4701-94ff-aa8857747450.png",
    "racket75-glacier-studio": "hf_20261018_194431_423579a8-38eb-4903-bafa-46c18ca9f932.png",
    "racket75-cloud-studio": "hf_20261018_194430_0a634b2c-7fe6-4024-a5fb-6dc17f731a14.png",
    "racket75-midnight-studio": "hf_20261018_194430_70b5433e-5b68-448f-b213-fdef2111a046.png",
    "racket75-cedar-lifestyle": "hf_20261018_194429_4228a607-1c78-480b-96d0-85469cec28e6.png",
    "racket75-glacier-lifestyle": "hf_20261018_194430_c79f9365-5209-4280-8366-2191996f5eb8.png",
    "racket75-cloud-lifestyle": "hf_20261018_194430_5f72fd8d-fcd1-4afa-a6d5-988fe7ca4159.png",
    "racket75-midnight-lifestyle": "hf_20261018_194430_24ba804a-e490-4782-9265-dac6999388a9.png",
    "racket75-cedar-detail": "hf_20261018_194430_9d280091-26fc-4ab1-9e0e-7d09036faf86.png",
    "racket75-glacier-detail": "hf_20261018_194430_94157690-b6e1-4aa0-8e71-f20fec9288ad.png",
    "racket75-cloud-detail": "hf_20261018_194432_7e059199-955c-4377-9374-be7cd10e86a3.png",
    "racket75-midnight-detail": "hf_20261018_194430_eaa66176-1fd9-4bda-b47d-ad6e62c2f344.png",
    "racket75-cedar-hero": "hf_20261018_194806_6ebe34d9-a5fc-4569-95e9-351bf9d68e97.png",
    "racket75-glacier-hero": "hf_20261018_194806_343d94f8-2b17-449c-9510-5e43ecad413c.png",
    "racket75-cloud-hero": "hf_20261018_194806_68d5d3a5-cde7-49c4-882a-5c4f7128efc1.png",
    "racket75-midnight-hero": "hf_20261018_194806_661c818e-7395-4ecf-8190-b47184573861.png",
}

# Supplier photos without third-party branding or captions, published as-is.
ORIGINALS = {
    "racket75-midnight-top": "f75-midnight.png",
}


def to_webp(img: Image.Image, name: str, max_side=2000):
    img = img.convert("RGB")
    if max(img.size) > max_side:
        img.thumbnail((max_side, max_side), Image.LANCZOS)
    img.save(OUT / f"{name}.webp", "WEBP", quality=86, method=6)
    return name, img.size


def is_valid(path: Path) -> bool:
    try:
        Image.open(path).load()
        return True
    except Exception:
        return False


def fetch(item):
    """The CDN resets connections intermittently, so curl retries until the PNG decodes."""
    name, file = item
    raw = RAW / f"{name}.png"
    for _ in range(15):
        if raw.exists() and is_valid(raw):
            break
        subprocess.run(
            ["curl", "-sS", "--retry", "5", "--retry-all-errors", "-o", str(raw), BASE + file],
            capture_output=True,
        )
    if not is_valid(raw):
        raise RuntimeError(f"could not download {name}")
    return to_webp(Image.open(BytesIO(raw.read_bytes())), name)


with ThreadPoolExecutor(3) as pool:
    for name, size in pool.map(fetch, MEDIA.items()):
        print("generated", name, size)

for name, file in ORIGINALS.items():
    print("original", *to_webp(Image.open(ROOT / "assets-source" / "products" / file), name))
