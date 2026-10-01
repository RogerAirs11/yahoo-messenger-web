#!/usr/bin/env python3
"""Sample exact colors from real Yahoo IMVironment thumbnails for faithful SVG recreation."""
from PIL import Image
import os

def sample(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    pts = {
        "top-left": (int(w*0.08), int(h*0.10)),
        "top-center": (int(w*0.5), int(h*0.06)),
        "top-right": (int(w*0.92), int(h*0.10)),
        "center": (int(w*0.5), int(h*0.5)),
        "bottom-left": (int(w*0.08), int(h*0.92)),
        "bottom-center": (int(w*0.5), int(h*0.95)),
        "bottom-right": (int(w*0.92), int(h*0.92)),
        "mid-left": (int(w*0.06), int(h*0.5)),
        "mid-right": (int(w*0.94), int(h*0.5)),
    }
    name = os.path.basename(path)
    print(f"\n== {name} ({w}x{h}) ==")
    for label, (x, y) in pts.items():
        r, g, b = im.getpixel((x, y))
        print(f"  {label:14s} #{r:02x}{g:02x}{b:02x}")
    # dominant colors
    small = im.resize((40, 25))
    from collections import Counter
    c = Counter(small.getdata())
    print("  dominant:", " ".join(f"#{r:02x}{g:02x}{b:02x}({n})" for (r, g, b), n in c.most_common(8)))

base = "public/assets/imv/"
for f in ["imv_leaves.gif", "imv_fish.gif", "imv_snow.gif", "imv_hearts.gif", "imv_precious.gif", "purpleleaves_gallery.jpg", "emoticats_gallery.jpg", "doodle_gallery.gif"]:
    p = base + f
    if os.path.exists(p):
        try:
            sample(p)
        except Exception as e:
            print(f"{f}: ERR {e}")
