#!/usr/bin/env python3
"""
Build the hero collage: Putin, Ivanishvili, Orban and Lukashenko cut out of their
photos, overlapped as one group, then rendered as ONE halftone (black dots on a
transparent background, same dot grid for everyone).

Usage (from the repo root):
    pip install pillow numpy rembg onnxruntime
    python3 tools/collage.py portraits/ images/faces/

Source photos stay in portraits/ (ignored by git). Only images/faces/collage.webp
is published. The red circle and the optional red bar over Ivanishvili's eyes are
drawn in CSS (swiss.css), so they stay red in dark mode; this script prints the
bar position to paste into swiss.css if you change the layout.
"""
import sys, os
import numpy as np
from PIL import Image, ImageOps, ImageDraw
from rembg import remove, new_session

W, H = 1000, 1000          # square canvas: the red circle fills it
CELL = 9                   # halftone grid: one dot every 9 px, the same for all four
OUT_W = 900                # published image width

# Each person: photo stem, eye centre and eye distance in the PHOTO (pixels),
# then where the eye centre goes on the CANVAS and how far apart the eyes should be there.
# Drawn back to front.
PEOPLE = [
    # name         stem           eye_x eye_y eye_d   canvas_x canvas_y canvas_d
    ("putin",       "putin",       382, 405, 170,      420,     330,     128),
    ("ivanishvili", "ivanishvili", 600, 392, 150,      735,     545,     80),
    ("orban",       "orban",       385, 390, 170,      255,     690,     76),
    ("lukashenko",  "lukashenko",  292, 196, 95,       520,     790,     76),
]


def find(src, stem):
    for f in os.listdir(src):
        if os.path.splitext(f)[0].lower() == stem:
            return os.path.join(src, f)
    raise SystemExit(f"missing photo: {stem}")


def cutout(path, session):
    """Grayscale person + alpha, contrast normalised inside the person only."""
    im = Image.open(path).convert("RGB")
    rgba = remove(im, session=session)
    a = np.asarray(rgba.getchannel("A"), dtype=float) / 255.0
    g = np.asarray(ImageOps.grayscale(im), dtype=float) / 255.0
    lo, hi = np.percentile(g[a > 0.8], [3, 97])
    g = np.clip((g - lo) / max(hi - lo, 1e-3), 0, 1)
    # fade the bottom and the sides of the photo so its edges leave no hard lines
    h, w = a.shape
    fy = np.clip((1.0 - np.linspace(0, 1, h)) / 0.18, 0, 1)[:, None]
    xs = np.linspace(0, 1, w)
    fx = np.clip(np.minimum(xs, 1.0 - xs) / 0.08, 0, 1)[None, :]
    return g, a * fy * fx


def place(canvas_g, canvas_a, g, a, ex, ey, ed, cx, cy, cd):
    s = cd / ed
    h, w = g.shape
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    g2 = np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS), dtype=float) / 255
    a2 = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS), dtype=float) / 255
    ox, oy = round(cx - ex * s), round(cy - ey * s)
    x0, y0, x1, y1 = max(ox, 0), max(oy, 0), min(ox + nw, W), min(oy + nh, H)
    if x0 >= x1 or y0 >= y1:
        return
    sg, sa = g2[y0 - oy:y1 - oy, x0 - ox:x1 - ox], a2[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    cg, ca = canvas_g[y0:y1, x0:x1], canvas_a[y0:y1, x0:x1]
    canvas_g[y0:y1, x0:x1] = sg * sa + cg * (1 - sa)          # person in front
    canvas_a[y0:y1, x0:x1] = sa + ca * (1 - sa)


def halftone(g, a):
    k = OUT_W / W
    sup = 3                                                   # supersample for smooth dots
    img = Image.new("L", (round(W * k * sup), round(H * k * sup)), 0)
    d = ImageDraw.Draw(img)
    for y in range(CELL // 2, H, CELL):
        for x in range(CELL // 2, W, CELL):
            yy, xx = slice(y - CELL // 2, y + CELL // 2 + 1), slice(x - CELL // 2, x + CELL // 2 + 1)
            cov = a[yy, xx].mean()
            if cov < 0.15:
                continue
            dark = (1.0 - g[yy, xx].mean()) ** 0.8 * 0.92 + 0.06
            r = dark * min(1.0, cov * 1.3) * CELL * 0.62 * k * sup
            if r < 0.5 * sup:
                continue
            cx, cy = x * k * sup, y * k * sup
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    alpha = img.resize((round(W * k), round(H * k)), Image.LANCZOS)
    out = Image.new("RGBA", alpha.size, (17, 17, 17, 0))
    out.putalpha(alpha)
    return out


def main(src, dst):
    os.makedirs(dst, exist_ok=True)
    session = new_session("u2net_human_seg")
    cg, ca = np.ones((H, W)), np.zeros((H, W))
    for name, stem, ex, ey, ed, cx, cy, cd in PEOPLE:
        g, a = cutout(find(src, stem), session)
        place(cg, ca, g, a, ex, ey, ed, cx, cy, cd)
    # keep every dot inside the circle (with a small margin)
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.hypot(xx - W / 2, yy - H / 2) / (W / 2)
    ca *= np.clip((0.97 - dist) / 0.04, 0, 1)
    path = os.path.join(dst, "collage.webp")
    halftone(cg, ca).save(path, "WEBP", quality=70, method=6)
    print(f"{path}: {os.path.getsize(path)//1024} KB")
    iv = [p for p in PEOPLE if p[0] == "ivanishvili"][0]
    cx, cy, cd = iv[5], iv[6], iv[7]
    print("Ivanishvili eye bar (CSS %%): left %.1f, top %.1f, width %.1f, height %.1f" % (
        (cx - 0.95 * cd) / W * 100, (cy - 0.17 * cd) / H * 100, 1.9 * cd / W * 100, 0.34 * cd / H * 100))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "portraits", sys.argv[2] if len(sys.argv) > 2 else "images/faces")
