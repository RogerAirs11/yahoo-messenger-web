#!/usr/bin/env python3
"""Fetch the genuine Luna blue.ini theme definition + bitmap inventory from nt5src."""
import urllib.request, urllib.parse, json, os

TOKEN = os.environ.get("GH_TOKEN", "")
OUT = "/home/z/my-project/scripts/xp-refs"
os.makedirs(OUT, exist_ok=True)

def gh(path):
    url = path if path.startswith("http") else "https://api.github.com" + path
    req = urllib.request.Request(url, headers={
        "User-Agent": "xp-ref-fetcher",
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    })
    return urllib.request.urlopen(req, timeout=90)

def raw(path):
    url = "https://raw.githubusercontent.com/tongzx/nt5src/master/" + path
    req = urllib.request.Request(url, headers={"User-Agent": "xp-ref-fetcher"})
    return urllib.request.urlopen(req, timeout=120).read()

# 1) blue.ini — the genuine Luna theme metrics
try:
    data = raw("Source/XPSP1/NT/shell/themes/themedir/luna/blue.ini")
    open(os.path.join(OUT, "luna-blue.ini"), "wb").write(data)
    print("blue.ini OK", len(data) // 1024, "KB")
except Exception as e:
    print("blue.ini FAIL", e)

# 2) list the luna themedir for bitmaps
try:
    r = json.load(gh("/repos/tongzx/nt5src/git/trees/master?recursive=1"))
    paths = [it["path"] for it in r["tree"] if "themes/themedir" in it["path"]]
    print("themedir entries:", len(paths))
    bmps = [p for p in paths if p.lower().endswith((".bmp", ".png", ".jpg", ".gif"))]
    print("bitmaps:", len(bmps))
    for p in bmps[:80]:
        print("  ", p)
    json.dump(paths, open(os.path.join(OUT, "luna-tree.json"), "w"), indent=1)
except Exception as e:
    print("tree FAIL", e)
