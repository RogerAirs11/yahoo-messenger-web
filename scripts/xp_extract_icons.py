#!/usr/bin/env python3
"""Extract chosen genuine XP shell32 icons -> PNG (48px + 16px) for the app."""
from PIL import Image
import os

SRC = "/tmp/xpico"
DST = "/home/z/my-project/public/assets/xp/icons"
os.makedirs(DST, exist_ok=True)

PICK = {
    16: "my-computer",
    191: "recycle-empty",
    192: "recycle-full",
    512: "ie",
    4: "folder",
    235: "my-docs",
    237: "my-music",
    226: "my-pictures",
    256: "pictures-alt",
    210: "control-panel",
    24: "help",
    23: "search",
    221: "power",
    220: "user",
    19: "network",
    28: "error",
    1001: "info",
    17: "printer",
    8: "hdd",
    14: "globe",
    47: "mystery47",
    167: "msn",
    44: "star",
    21: "briefcase",
    18: "web-comp",
}

def best_frame(im: Image.Image, want: int):
    """ico may contain multiple sizes; pick the frame closest >= want."""
    sizes = sorted(set(im.info.get("it") or []), reverse=True) if False else None
    return im

for idx, name in PICK.items():
    src = os.path.join(SRC, f"ICON{idx}_1.ico")
    if not os.path.exists(src):
        print("missing", idx)
        continue
    im = Image.open(src)
    # iterate frames, pick largest
    largest = im.convert("RGBA")
    try:
        for s in im.info.get("sizes", []):
            im.size = s
            fr = im.convert("RGBA")
            if fr.width > largest.width:
                largest = fr
    except Exception as e:
        pass
    largest = largest.convert("RGBA")
    for size in (48, 16):
        f = largest.resize((size, size), Image.LANCZOS) if largest.width != size else largest.copy()
        out = os.path.join(DST, f"{name}-{size}.png")
        f.save(out)
    print(f"{idx:5} -> {name}  (src {largest.width}x{largest.height})")
