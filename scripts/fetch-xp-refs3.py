#!/usr/bin/env python3
"""Get genuine XP screenshots via Wayback Machine (bypasses Wikipedia throttle)."""
import urllib.request, re, os, time, json

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/90"}
OUT = "/home/z/my-project/scripts/xp-refs"
os.makedirs(OUT, exist_ok=True)

def get(url, timeout=90):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=timeout).read()

def wayback(url):
    """resolve a wayback snapshot for url"""
    return "https://web.archive.org/web/2020id_/" + url

# 1) article HTML from wayback, find fair-use screenshot URLs (wikipedia/en)
html = None
for attempt in ["https://web.archive.org/web/2021id_/https://en.wikipedia.org/wiki/Windows_XP",
                "https://web.archive.org/web/2019id_/https://en.wikipedia.org/wiki/Windows_XP"]:
    try:
        html = get(attempt).decode("utf-8", "ignore")
        print("got article HTML", len(html) // 1024, "KB from", attempt[:60])
        break
    except Exception as e:
        print("article fail", e)

found = set()
if html:
    for m in re.finditer(r'(//upload\.wikimedia\.org/wikipedia/(?:en|commons)/[^\s"\'>]+?\.(?:png|jpg|jpeg))', html, re.I):
        u = m.group(1)
        if re.search(r'(xp|desktop|start|bliss|screenshot|luna)', u, re.I):
            found.add(u)
    print("candidate images:")
    for u in sorted(found):
        print("  ", u)

# 2) download each via wayback
for u in sorted(found):
    name = u.split("/")[-1][:60]
    if os.path.exists(os.path.join(OUT, name)):
        print("skip", name); continue
    try:
        data = get("https:" + u if u.startswith("//") else u, timeout=60)
        if len(data) < 3000:
            print("small, try wayback:", name); raise Exception("small")
        with open(os.path.join(OUT, name), "wb") as f:
            f.write(data)
        print("  OK  ", name, len(data) // 1024, "KB")
    except Exception:
        try:
            data = get(wayback("https:" + u))
            with open(os.path.join(OUT, name), "wb") as f:
                f.write(data)
            print("  OK-WB", name, len(data) // 1024, "KB")
        except Exception as e:
            print("  FAIL", name, e)
    time.sleep(1)
