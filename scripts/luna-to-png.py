#!/usr/bin/env python3
"""Convert genuine Luna BMPs to alpha PNGs for web use; fetch the missing few."""
import urllib.request, os, time
from PIL import Image

LUNA = "/home/z/my-project/scripts/xp-refs/luna"
DEST = "/home/z/my-project/public/assets/xp/luna"
os.makedirs(DEST, exist_ok=True)
BASE = "https://raw.githubusercontent.com/tongzx/nt5src/master/Source/XPSP1/NT/shell/themes/themedir/luna/blue/"

EXTRA = ["TaskbarSizingBarBottom.bmp", "CaptionButton.bmp", "CloseButton.bmp",
         "StartPanelMoreProgArrow.bmp", "StartPanelMoreProgArrowHot.bmp",
         "StartProgramsSeparator.bmp", "StartPlacesSeparator.bmp", "StartGroupBackground.bmp",
         "StartGroupSeperator.bmp", "TaskBandHover.bmp", "NormalGroupBackground.bmp",
         "NormalGroupHead.bmp", "SpecialGroupBackground.bmp", "SpecialGroupHead.bmp",
         "StatusBackground.bmp", "StatusPane.bmp", "BalloonClose.bmp", "TaskBandFlashButton.bmp",
         "PlaceBarBackground.bmp", "ExplorerBarHeaderBackground.bmp"]

for f in EXTRA:
    dest = os.path.join(LUNA, f)
    if os.path.exists(dest) and os.path.getsize(dest) > 400:
        continue
    for _ in range(3):
        try:
            req = urllib.request.Request(BASE + f, headers={"User-Agent": "Mozilla/5.0"})
            open(dest, "wb").write(urllib.request.urlopen(req, timeout=90).read())
            break
        except Exception as e:
            print("retry", f, e); time.sleep(2)

# convert: magenta(255,0,255) & red(255,0,0) masks -> alpha; P-mode -> RGB first
count = 0
for f in sorted(os.listdir(LUNA)):
    if not f.lower().endswith(".bmp"):
        continue
    try:
        im = Image.open(os.path.join(LUNA, f)).convert("RGB")
        im.load()
    except Exception as e:
        print("SKIP corrupt", f, e)
        os.remove(os.path.join(LUNA, f))
        continue
    w, h = im.size
    px = im.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if (r, g, b) == (255, 0, 255) or (r, g, b) == (255, 0, 0):
                op[x, y] = (r, g, b, 0)
            else:
                op[x, y] = (r, g, b, 255)
    name = f[:-4].lower() + ".png"
    out.save(os.path.join(DEST, name))
    count += 1
print("converted", count, "PNGs ->", DEST)
