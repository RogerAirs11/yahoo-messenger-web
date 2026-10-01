"""Extract GENUINE Yahoo! Messenger IMVironment sprites from the recovered
Yahoo CDN artwork — v2 with SEMANTIC color-rule masks per scene.

Each scene's art has distinct color families (red maples on cream, white
flakes on blue, red hearts on pink, purple trees on lavender). We build a
mask per family, clean it, and save transparent RGBA sprites + a manifest
of exact positions (in % of the frame) so the recreated IMVironments can
compose the REAL Yahoo artwork elements 1:1.
"""

import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/assets/imv"
OUT = "public/assets/imv/sprites"
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith(".png"):
        os.remove(f"{OUT}/{f}")

manifest = {}


def strip_border(im, b=3):
    w, h = im.size
    return im.crop((b, b, w - b, h - b)).convert("RGB")


def save(px, mask, name, pad=1, feather=0.6, grow=0):
    """save masked region as RGBA sprite; returns manifest entry"""
    if grow:
        mask = ndimage.binary_dilation(mask, iterations=grow)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return None
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    H, W = mask.shape
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(W - 1, x1 + pad), min(H - 1, y1 + pad)
    sub = px[y0 : y1 + 1, x0 : x1 + 1].astype(np.uint8)
    m = mask[y0 : y1 + 1, x0 : x1 + 1].astype(float)
    if feather:
        m = ndimage.gaussian_filter(m, feather)
        m = np.clip((m - 0.15) / 0.7, 0, 1)
    rgba = np.dstack([sub, (m * 255).astype(np.uint8)])
    Image.fromarray(rgba).save(f"{OUT}/{name}.png")
    H, W = mask.shape
    return {
        "name": name,
        "x": round(x0 / W * 100, 2),
        "y": round(y0 / H * 100, 2),
        "w": round((x1 - x0 + 1) / W * 100, 2),
        "h": round((y1 - y0 + 1) / H * 100, 2),
    }


def reg(scene, entry, note=""):
    if entry:
        entry = dict(entry, note=note)
        manifest.setdefault(scene, []).append(entry)


# ================= AUTUMN LEAVES =================
im = strip_border(Image.open(f"{SRC}/imv_leaves.gif"))
px = np.array(im).astype(int)
H, W = px.shape[:2]
R, G, B = px[:, :, 0], px[:, :, 1], px[:, :, 2]
bg = np.array([255, 239, 173])
dist = np.sqrt(((px - bg) ** 2).sum(axis=2))

# red maples
red = (R - G > 45) & (R > 120)
lab, n = ndimage.label(red)
for i in range(1, n + 1):
    m = lab == i
    if m.sum() < 120:
        continue
    reg("leaves", save(px, m, f"leaves-leaf{i}"), "genuine maple leaf")

# dappled canopy tree (stippled khaki in the upper-right two-thirds)
tree = (dist > 22) & (dist < 90) & (np.arange(W)[None, :] > W * 0.34) & (np.arange(H)[:, None] < H * 0.72)
tree = ndimage.binary_opening(tree, structure=np.ones((2, 2)))
reg("leaves", save(px, tree, "leaves-tree", pad=0, feather=0.8), "dappled canopy")

# diagonal tan hill (bottom)
hill = (dist > 22) & (dist < 90) & (np.arange(H)[:, None] >= H * 0.62)
hill = ndimage.binary_opening(hill, structure=np.ones((2, 2)))
reg("leaves", save(px, hill, "leaves-hill", pad=0, feather=0.5), "tan ground")

# ================= FISHTANK =================
im = strip_border(Image.open(f"{SRC}/imv_fish.gif"))
px = np.array(im).astype(int)
H, W = px.shape[:2]
R, G, B = px[:, :, 0], px[:, :, 1], px[:, :, 2]
warm = R >= B - 8          # orange / yellow / red / pink-silver bodies
dark = px.mean(axis=2) < 95  # dark fins / tails / bands
whiteish = (R > 215) & (G > 225) & (B > 235)  # white stripes on fish
fishy = warm | dark | whiteish
# manual bboxes measured from the genuine art (154x94 after border strip):
# goldfish top-left, big silver-red top-right, yellow tang centre, clownfish lower-centre
FISH_BOXES = [(18, 6, 52, 28), (88, 4, 154, 48), (72, 36, 124, 82), (36, 50, 78, 90)]
fi = 0
for (x0, y0, x1, y1) in FISH_BOXES:
    m = np.zeros((H, W), bool)
    m[y0 : y1 + 1, x0 : x1 + 1] = fishy[y0 : y1 + 1, x0 : x1 + 1]
    m = ndimage.binary_closing(m, structure=np.ones((3, 3)))
    lab2, n2 = ndimage.label(m)
    if n2 == 0:
        continue
    sizes = [(lab2 == i).sum() for i in range(1, n2 + 1)]
    m = lab2 == (int(np.argmax(sizes)) + 1)
    m = ndimage.binary_fill_holes(m)
    if m.sum() < 150:
        continue
    fi += 1
    reg("fish", save(px, m, f"fish{fi}"), "genuine fish")

# ================= SNOWFLAKE =================
im = strip_border(Image.open(f"{SRC}/imv_snow.gif"))
px = np.array(im).astype(int)
H, W = px.shape[:2]
R, G, B = px[:, :, 0], px[:, :, 1], px[:, :, 2]

# snowflakes: TWO families in the genuine art — pale blue-white ghosts
# (B>=253, R>=215) and brighter pure-white flakes; both small components
bgd = np.array([179, 216, 252])
paleflake = (B >= 253) & (R >= 215)
white = (R > 242) & (G > 242) & (B > 242)
lab, n = ndimage.label(paleflake | white)
si = 0
for i in range(1, n + 1):
    m = lab == i
    s = int(m.sum())
    if s < 8 or s > 2000:
        continue
    ys, xs = np.where(m)
    if ys.min() < H * 0.13:  # top cloud band — not a flake
        continue
    if ys.max() - ys.min() < 4 or xs.max() - xs.min() < 4:  # AA slivers
        continue
    if xs.min() > W * 0.55 and ys.min() > H * 0.42:  # snowman zone, handled below
        continue
    si += 1
    reg("snow", save(px, m, f"snow-flake{si}"), "genuine snowflake")

# snowman (bottom-right, any strong color incl. hat/bubble), merged
dist = np.sqrt(((px - bgd) ** 2).sum(axis=2))
region = np.zeros((H, W), bool)
region[int(H * 0.42) :, int(W * 0.55) :] = True
sm = (dist > 60) & region
sm = ndimage.binary_closing(sm, structure=np.ones((5, 5)))
reg("snow", save(px, sm, "snow-snowman", pad=1, grow=1), "snowman + Y! bubble")

# ================= FALLING HEARTS =================
im = strip_border(Image.open(f"{SRC}/imv_hearts.gif"))
px = np.array(im).astype(int)
H, W = px.shape[:2]
R, G, B = px[:, :, 0], px[:, :, 1], px[:, :, 2]

red = (R - G > 45) & (G < 140) & (R > 130)
lab, n = ndimage.label(red)
hi = 0
for i in range(1, n + 1):
    m = lab == i
    if m.sum() < 60:
        continue
    hi += 1
    reg("hearts", save(px, m, f"hearts-heart{hi}"), "glossy red heart")

# the giant pale heart backdrop
bgd = np.array([255, 204, 204])
dist = np.sqrt(((px - bgd) ** 2).sum(axis=2))
pale = (dist > 10) & (dist < 42)
lab, n = ndimage.label(pale)
for i in range(1, n + 1):
    m = lab == i
    if m.sum() > 4000:
        reg("hearts", save(px, m, "hearts-big", pad=0, feather=0.9), "giant pale heart")
        break

# ================= PURPLE LEAVES =================
im = Image.open(f"{SRC}/purpleleaves_gallery.jpg").convert("RGB")
im = im.crop((2, 2, im.size[0] - 2, im.size[1] - 14))  # trim gallery chrome
px = np.array(im).astype(int)
H, W = px.shape[:2]
R, G, B = px[:, :, 0], px[:, :, 1], px[:, :, 2]

purple = ((B - G > 16) & (R - G > 2) & (px.mean(axis=2) < 205)) | (px.mean(axis=2) < 120)
purple = ndimage.binary_opening(purple, structure=np.ones((2, 2)))
lab, n = ndimage.label(purple)
for i in range(1, n + 1):
    m = lab == i
    s = int(m.sum())
    if s < 60:
        continue
    ys, xs = np.where(m)
    x0, y0 = xs.min(), ys.min()
    if s > 800 and x0 > W * 0.4 and y0 > H * 0.3:
        reg("purple", save(px, m, "purple-trees", pad=0), "purple trees + hill")
    elif 50 < s < 800:
        reg("purple", save(px, m, f"purple-leaf{i}"), "purple maple")

white = (R > 240) & (G > 240) & (B > 240)
lab, n = ndimage.label(white)
ci = 0
for i in range(1, n + 1):
    m = lab == i
    ys, xs = np.where(m)
    if m.sum() > 120 and ys.max() - ys.min() >= 5 and xs.max() - xs.min() >= 5:
        ci += 1
        reg("purple", save(px, m, f"purple-cloud{ci}"), "white cloud")

with open(f"{OUT}/manifest.json", "w") as f:
    json.dump(manifest, f, indent=1)
print(json.dumps({k: len(v) for k, v in manifest.items()}))
print("done")
