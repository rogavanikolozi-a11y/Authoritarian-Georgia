#!/usr/bin/env python3
"""
Make the "four faces" halftone portraits for the hero.

Each photo becomes an SVG: a red block with black dots whose size follows how
dark the photo is at that point (classic halftone). Ivanishvili also gets a
thick horizontal red bar across the eyes.

Usage (from the repo root):
    python3 tools/halftone.py portraits/ images/faces/

Source photos are NOT published: keep them in portraits/ (ignored by git)
and only commit the generated SVGs in images/faces/.

Crops live in CROPS below. Each crop is (left, top, size) as fractions of the
photo, chosen so that all four faces have the eyes at the same height
(EYE_LINE of the square). Adjust them if you swap a photo.
"""
import sys, os
from PIL import Image, ImageOps, ImageFilter
import numpy as np

RED = "#E30613"
INK = "#111111"
GRID = 58            # dots across (and down): same density for all four
EYE_LINE = 0.42      # eyes sit at 42% of the height in every portrait
BAR = (0.33, 0.50)   # Ivanishvili's bar: top and bottom, as a share of the height

# name: (file stem, (left, top, size) as fractions of the shorter side, bar?)
CROPS = {
    "putin":       ("putin",       (0.20, 0.10, 0.62), False),
    "orban":       ("orban",       (0.20, 0.10, 0.62), False),
    "lukashenko":  ("lukashenko",  (0.20, 0.10, 0.62), False),
    "ivanishvili": ("ivanishvili", (0.20, 0.10, 0.62), True),
}


def find(src_dir, stem):
    for f in os.listdir(src_dir):
        if os.path.splitext(f)[0].lower() == stem:
            return os.path.join(src_dir, f)
    raise SystemExit(f"missing photo for {stem} in {src_dir}")


def tone(img):
    """Square grayscale crop, evened out so the four portraits match in contrast."""
    g = ImageOps.grayscale(img)
    g = ImageOps.autocontrast(g, cutoff=2)
    g = ImageOps.equalize(g)
    return g.filter(ImageFilter.GaussianBlur(0.6))


def to_svg(gray, bar):
    small = gray.resize((GRID, GRID), Image.LANCZOS)
    a = np.asarray(small, dtype=float) / 255.0       # 1 = light, 0 = dark
    darkness = np.clip(1.0 - a, 0, 1) ** 1.15
    cell = 10.0
    size = GRID * cell
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size:.0f} {size:.0f}" role="img">',
           f'<rect width="100%" height="100%" fill="{RED}"/>', f'<g fill="{INK}">']
    for y in range(GRID):
        for x in range(GRID):
            r = darkness[y, x] * cell * 0.62
            if r < 0.6:
                continue
            out.append(f'<circle cx="{x*cell+cell/2:.0f}" cy="{y*cell+cell/2:.0f}" r="{r:.1f}"/>')
    out.append('</g>')
    if bar:
        out.append(f'<rect x="0" y="{BAR[0]*size:.0f}" width="{size:.0f}" height="{(BAR[1]-BAR[0])*size:.0f}" fill="{RED}"/>')
    out.append('</svg>')
    return "\n".join(out)


def main(src_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for name, (stem, (l, t, s), bar) in CROPS.items():
        im = Image.open(find(src_dir, stem)).convert("RGB")
        side = min(im.size)
        box = (int(l*im.width), int(t*im.height), int(l*im.width + s*side), int(t*im.height + s*side))
        svg = to_svg(tone(im.crop(box)), bar)
        path = os.path.join(out_dir, f"{name}.svg")
        open(path, "w").write(svg)
        print(f"{path}: {len(svg)//1024} KB")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "portraits", sys.argv[2] if len(sys.argv) > 2 else "images/faces")
