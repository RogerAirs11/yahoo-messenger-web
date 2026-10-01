#!/usr/bin/env python3
"""Fetch GENUINE Windows XP shell32 icons (icon indices XP actually uses),
convert to crisp 48/32/16 PNGs with alpha, and place them in public/assets/xp/icons."""
import io, json, re, urllib.request
from PIL import Image

TOKEN = ""  # public raw files need no auth
REPO = "bartekl1/windows-ui-assets"
BRANCH = "main"
TREE = json.load(open("scripts/ui_assets_tree.json"))
paths = [t["path"] for t in TREE.get("tree", [])]

WANT = {
    15: "my-computer",   # My Computer (monitor + tower, Luna)
    17: "network",       # My Network Places (globe + computers)
    31: "recycle-empty", # Recycle Bin empty
    32: "recycle-full",  # Recycle Bin full
    235: "my-docs",      # My Documents (folder + paper)
    236: "my-pics",      # My Pictures
    238: "my-music",     # My Music
    3: "folder-open",
    4: "folder",
    21: "printer",
    220: "ie-doc",       # generic doc w/ globe (fallback)
    13: "docs2",
    16: "computers",     # computers pair
    18: "network-2",
    22: "computers-2",
}

def fetch_icon(idx):
    cands = [p for p in paths if re.match(rf"Icons/Windows XP/ico/shell32\.dll/ICON{idx}_\d+\.ico", p)]
    if not cands:
        return None
    p = cands[0]
    url = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/{urllib.request.quote(p)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return r.read()
    except Exception as e:
        print(f"  idx {idx}: fetch fail {e}")
        return None

def best_frame(ico_bytes):
    """Open the ICO and return the largest frame as RGBA."""
    im = Image.open(io.BytesIO(ico_bytes))
    sizes = sorted(im.info.get("sizes") or [], reverse=True)
    if sizes:
        w, h = sizes[0]
        im.size = (w, h)
        im.load()
    return im.convert("RGBA")

def save_png(im, name, px):
    out = im.resize((px, px), Image.LANCZOS) if im.size[0] != px else im
    out.save(f"public/assets/xp/icons/{name}-{px}.png")

for idx, name in WANT.items():
    b = fetch_icon(idx)
    if not b:
        print(f"idx {idx} ({name}): MISSING")
        continue
    try:
        im = best_frame(b)
    except Exception as e:
        print(f"idx {idx} ({name}): decode fail {e}")
        continue
    for px in (48, 32, 16):
        save_png(im, name, px)
    print(f"idx {idx} -> {name}: {im.size[0]}px OK")
