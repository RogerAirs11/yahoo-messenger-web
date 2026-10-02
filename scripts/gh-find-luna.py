#!/usr/bin/env python3
"""Explore GitHub for genuine XP Luna assets + reference screenshots."""
import urllib.request, urllib.parse, json, os, sys, time

TOKEN = os.environ.get("GH_TOKEN", "")
OUT = "/home/z/my-project/scripts/xp-refs"
os.makedirs(OUT, exist_ok=True)

def gh(path, raw=False):
    url = path if path.startswith("http") else "https://api.github.com" + path
    req = urllib.request.Request(url, headers={
        "User-Agent": "xp-ref-fetcher",
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    })
    return urllib.request.urlopen(req, timeout=60)

# 1) ShizukuIchi/winXP full asset tree
try:
    t = json.load(gh("/repos/ShizukuIchi/winXP/git/trees/master?recursive=1"))
    assets = [it["path"] for it in t["tree"] if any(k in it["path"].lower() for k in
              ["start", "taskbar", "tray", "task", "icon", "bmp", "png"]) and "/windows" in it["path"].lower()]
    print("== winXP asset paths (start/task/tray):")
    for a in assets[:40]:
        print("  ", a)
    all_pngs = [it["path"] for it in t["tree"] if it["path"].endswith(".png")]
    print("   total pngs:", len(all_pngs))
    json.dump(all_pngs, open("/home/z/my-project/scripts/winxp-tree.json", "w"), indent=1)
except Exception as e:
    print("winXP tree FAIL:", e)

# 2) code search for genuine luna taskbar bitmaps
for q in ["startbutton extension:bmp", "luna.msstyles", "taskbar.bmp windows xp"]:
    try:
        r = json.load(gh("/search/code?q=" + urllib.parse.quote(q) + "&per_page=8"))
        print(f"== code search '{q}':", r.get("total_count"))
        for it in r.get("items", [])[:8]:
            print("  ", it["repository"]["full_name"], it["path"])
    except Exception as e:
        print(f"code search '{q}' FAIL:", e)
    time.sleep(2)
