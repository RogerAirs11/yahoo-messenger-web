#!/usr/bin/env python3
"""Contact sheet of all shell32 .ico files with index labels for visual picking."""
from PIL import Image, ImageDraw
import os, math

SRC = "/tmp/xpico"
files = sorted(
    [f for f in os.listdir(SRC) if f.endswith(".ico")],
    key=lambda f: int(f.replace("ICON", "").split("_")[0]),
)
COLS = 10
CELL_W, CELL_H = 120, 132
rows = math.ceil(len(files) / COLS)
sheet = Image.new("RGB", (COLS * CELL_W, rows * CELL_H), (40, 40, 48))
draw = ImageDraw.Draw(sheet)
ok = 0
for i, f in enumerate(files):
    x = (i % COLS) * CELL_W
    y = (i // COLS) * CELL_H
    idx = f.replace("ICON", "").split("_")[0]
    try:
        im = Image.open(os.path.join(SRC, f))
        # pick largest frame
        try:
            im.size  # PIL picks largest by default via .ico
        except Exception:
            pass
        im = im.convert("RGBA")
        im.thumbnail((72, 72), Image.LANCZOS)
        # composite on light+dark checker to reveal alpha
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        sheet.paste(bg.convert("RGB"), (x + (CELL_W - im.width) // 2, y + 8 + (72 - im.height) // 2))
        ok += 1
    except Exception as e:
        draw.text((x + 4, y + 40), "ERR", fill=(255, 80, 80))
    draw.text((x + 6, y + 6), idx, fill=(255, 220, 120))
    draw.rectangle([x, y, x + CELL_W - 1, y + CELL_H - 1], outline=(70, 70, 80))
sheet.save("/tmp/xp_contact.png")
print(f"ok={ok}/{len(files)} -> /tmp/xp_contact.png  size={sheet.size}")
