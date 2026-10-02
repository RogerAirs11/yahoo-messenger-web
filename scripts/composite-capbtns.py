#!/usr/bin/env python3
"""Composite genuine Luna caption buttons: background states + glyph states."""
from PIL import Image, ImageDraw

L = "/home/z/my-project/scripts/xp-refs/luna/"
OUT = "/home/z/my-project/public/assets/xp/luna/"

def load_states(path, sh):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = rgba.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            op[x, y] = (r, g, b, 0) if (r, g, b) == (255, 0, 255) else (r, g, b, 255)
    return [rgba.crop((0, i * sh, w, (i + 1) * sh)) for i in range(h // sh)]

btn = load_states(L + "captionbutton.bmp", 21)   # 8 bg states
cls = load_states(L + "closebutton.bmp", 21)
gmax = load_states(L + "maximizeglyph.bmp", 13)  # 8 glyph states
gcls = load_states(L + "closeglyph.bmp", 13)

def min_glyph():
    g = Image.new("RGBA", (13, 13), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    d.rectangle([3, 7, 9, 9], fill=(255, 255, 255, 255))     # white bar w/ shadow row
    d.rectangle([3, 9, 9, 9], fill=(160, 175, 215, 255))     # subtle lower shade
    return g

def composite(bg, glyph):
    out = bg.copy()
    out.alpha_composite(glyph, (4, 4))
    return out

# active window: states 0/1/2 ; inactive: 4/5
variants = [("normal", 0), ("hot", 1), ("pressed", 2), ("inactive", 4)]
for name, i in variants:
    composite(btn[i], gmax[i]).save(OUT + f"luna-cap-max-{name}.png")
    composite(cls[i], gcls[i]).save(OUT + f"luna-cap-close-{name}.png")
    mg = gmax[i] if i != 2 and i != 6 else min_glyph()  # pressed min keeps white bar? XP pressed min shows blue bar; draw plain
    if name in ("pressed",):
        g = Image.new("RGBA", (13, 13), (0, 0, 0, 0))
        d = ImageDraw.Draw(g)
        d.rectangle([3, 7, 9, 9], fill=(68, 108, 179, 255))
        mg = g
    composite(btn[i], mg).save(OUT + f"luna-cap-min-{name}.png")
print("composited caption buttons ->", OUT)
