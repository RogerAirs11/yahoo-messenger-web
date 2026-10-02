#!/usr/bin/env python3
"""Fetch genuine Windows XP screenshots from Wikipedia for visual comparison."""
import json, urllib.request, urllib.parse, os

UA = {"User-Agent": "Mozilla/5.0 (research; pixel-reference-fetcher)"}
OUT = "/home/z/my-project/scripts/xp-refs"
os.makedirs(OUT, exist_ok=True)

def api(params, base="https://en.wikipedia.org/w/api.php"):
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=30))

def article_images(title):
    r = api({"action": "query", "titles": title, "prop": "images",
             "format": "json", "imlimit": "100"})
    pages = r["query"]["pages"]
    for p in pages.values():
        return [im["title"] for im in p.get("images", [])]
    return []

def image_url(file_title):
    r = api({"action": "query", "titles": file_title, "prop": "imageinfo",
             "iiprop": "url|size", "format": "json"})
    for p in r["query"]["pages"].values():
        ii = p.get("imageinfo", [])
        if ii:
            return ii[0].get("url"), ii[0].get("width"), ii[0].get("height")
    return None, None, None

def grab(file_title, name, max_w=1600):
    url, w, h = image_url(file_title)
    if not url:
        print("  MISS", file_title); return
    # use thumb for large PNGs to keep size sane, but keep 1:1 if small
    if w and w > max_w:
        m = os.path.splitext(name)
        url = url.replace("/wikipedia/commons/", "/wikipedia/commons/thumb/").replace("/wikipedia/en/", "/wikipedia/en/thumb/")
        url = f"{url}/{max_w}px-{m[0]}{m[1]}"
    try:
        req = urllib.request.Request(url, headers=UA)
        data = urllib.request.urlopen(req, timeout=60).read()
        path = os.path.join(OUT, name)
        with open(path, "wb") as f:
            f.write(data)
        print("  OK  ", name, len(data)//1024, "KB", w, "x", h)
    except Exception as e:
        print("  FAIL", file_title, e)

for title in ["Windows XP", "Start menu", "Windows XP visual styles", "Bliss (image)"]:
    print("==", title)
    for t in article_images(title):
        tl = t.lower()
        if tl.endswith((".png", ".jpg", ".jpeg")) and any(k in tl for k in
            ["xp", "desktop", "start", "menu", "screenshot", "bliss", "luna", "task"]):
            safe = t.replace("File:", "").replace(" ", "_")
            grab(t, safe)
