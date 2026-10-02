#!/usr/bin/env python3
"""Download the genuine Luna blue-theme bitmaps from the XP SP1 source tree."""
import urllib.request, os, time

OUT = "/home/z/my-project/scripts/xp-refs/luna"
os.makedirs(OUT, exist_ok=True)
BASE = "https://raw.githubusercontent.com/tongzx/nt5src/master/Source/XPSP1/NT/shell/themes/themedir/luna/blue/"

FILES = [
    "startbutton.bmp", "startbuttonflag.bmp",
    "taskbarbackground.bmp", "toolbarbackground.bmp",
    "taskbandbutton.bmp", "taskbandbuttonnoedge.bmp",
    "taskbartoolbarbutton.bmp", "taskbartray.bmp", "taskbargripper.bmp",
    "startuserpanel.bmp", "usertilebackground.bmp",
    "startpanelmfubackground.bmp", "startpanelplacesbackground.bmp",
    "startpanellogoffbackground.bmp", "startpanellogoffbuttons.bmp",
    "startpanellogoffbuttonshot.bmp", "startgroupnewappbutton.bmp",
    "startgrouptoolbarbutton.bmp", "framecaption.bmp", "framemaximized.bmp",
    "frameleft.bmp", "frameright.bmp", "framebottom.bmp", "dialogbackground.bmp",
    "explorerbarheaderbackground.bmp", "explorernormalgroupbackground.bmp",
    "explorerspecialgroupbackground.bmp", "listviewheaderbackground.bmp",
]

for f in FILES:
    dest = os.path.join(OUT, f)
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        print("skip", f); continue
    ok = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(BASE + f, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=90).read()
            open(dest, "wb").write(data)
            print(f"OK {f:42s} {len(data):>7}B")
            ok = True
            break
        except Exception as e:
            print("retry", f, e); time.sleep(2)
    if not ok:
        print("FAIL", f)
    time.sleep(0.4)
