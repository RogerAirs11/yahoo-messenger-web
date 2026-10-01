#!/usr/bin/env python3
"""Fetch a range of XP shell32 icons and render one contact sheet for visual ID."""
import io, re, urllib.request
from PIL import Image, ImageDraw

REPO = "bartekl1/windows-ui-assets"
BRANCH = "main"
TREE = json.load(open("scripts/ui_assets_tree.json")) if False else None
import json
TREE = json.load(open("scripts/ui_assets_tree.json"))
paths = [t["path"] for t in TREE.get("tree", [])]

WANT = list(range(8, 26)) + list(range(28, 36)) + list(range(218, 244))

def fetch_icon(idx):
    cands = [p for p in paths if re.match(rf"Icons/Windows XP/ico/shell32\.dll/ICON{idx}_\d+\.ico", p)]
    if not cands:
        return None
    url = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/{urllib.request.quote(cands[0])}"
    try:
        with urllib.request.urlopen(url, timeout=25) as r:
            return r.read()
    except Exception:
        return None

cell = 56
cols = 10
rows = (len(WANT) + cols - 1) // cols
sheet = Image.new("RGBA", (cols * cell, rows * (cell + 14)), (240, 240, 240, 255))
draw = ImageDraw.Draw(sheet)
for i, idx in enumerate(WANT):
    b = fetch_icon(idx)
    x = (i % cols) * cell
    y = (i // cols) * (cell + 14)
    if b:
        try:
            im = Image.open(io.BytesIO(b))
            sizes = sorted(im.info.get("sizes") or [], reverse=True)
            if sizes:
                im.size = sizes[0]
                im.load()
            im = im.convert("RGBA")
            if im.size[0] > 48:
                im = im.resize((48, 48), Image.LANCZOS)
            sheet.alpha_composite(im, (x + (cell - im.size[0]) // 2, y + (48 - im.size[1]) // 2))
        except Exception as e:
            draw.text((x + 4, y + 20), "ERR", fill=(200, 0, 0))
    draw.text((x + 6, y + cell - 2), str(idx), fill=(0, 0, 0))
sheet.convert("RGB").save("scripts/xp_icon_sheet.png")
print("saved scripts/xp_icon_sheet.png")
