#!/usr/bin/env python3
"""Download the genuine high-res Windows XP icons from softwarehistorysociety/XPIcons
and normalize them into public/assets/xp/icons at 48/32/16 px (Lanczos, alpha kept)."""
import urllib.parse, urllib.request
from PIL import Image
import io

REPO = "softwarehistorysociety/XPIcons"
BRANCH = "HEAD"

WANT = {
    "InternetExplorer6.png": "ie",
    "MyComputer.png": "my-computer",
    "MyDocuments.png": "my-docs",
    "MyNetworkPlaces.png": "network",
    "RecycleBin(empty).png": "recycle-empty",
    "RecycleBin(full).png": "recycle-full",
    "MyMusic.png": "my-music",
    "MyPictures.png": "my-pictures",
    "ControlPanel.png": "control-panel",
    "HelpandSupport.png": "help",
    "Search.png": "search",
    "Run.png": "run",
    "Volume.png": "volume",
    "LogOff.png": "logoff-xp",
    "Restart.png": "restart-xp",
    "Standby.png": "standby-xp",
    "WindowsMedia.png": None,  # probe
    "UserAccounts.png": "users",
}

def dl(name):
    url = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}/{urllib.parse.quote('XP/' + name)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return r.read()
    except Exception as e:
        print(f"  {name}: FAIL {e}")
        return None

for src, dst in WANT.items():
    b = dl(src)
    if not b:
        continue
    im = Image.open(io.BytesIO(b)).convert("RGBA")
    w, h = im.size
    # square-pad if needed
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((side - w) // 2, (side - h) // 2))
    if dst is None:
        print(f"  {src}: exists {im.size}")
        continue
    for px in (48, 32, 16):
        canvas.resize((px, px), Image.LANCZOS).save(f"public/assets/xp/icons/{dst}-{px}.png")
    print(f"  {src} -> {dst}: src {im.size} OK")
