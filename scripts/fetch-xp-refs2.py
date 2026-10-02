#!/usr/bin/env python3
"""Fetch genuine XP screenshots via Wikipedia REST media-list + Special:FilePath."""
import json, urllib.request, urllib.parse, os, time

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36"}
OUT = "/home/z/my-project/scripts/xp-refs"
os.makedirs(OUT, exist_ok=True)

def rest_media_list(title):
    url = "https://en.wikipedia.org/api/rest_v1/page/media-list/" + urllib.parse.quote(title)
    req = urllib.request.Request(url, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=30))

def filepath_url(file_title):
    # Special:FilePath 302-redirects to the real upload.wikimedia.org URL
    name = file_title.replace("File:", "").replace(" ", "_")
    return "https://en.wikipedia.org/wiki/Special:FilePath/" + urllib.parse.quote(name)

def grab(file_title, name):
    url = filepath_url(file_title)
    try:
        req = urllib.request.Request(url, headers=UA)
        data = urllib.request.urlopen(req, timeout=60).read()
        if len(data) < 2000:
            print("  SMALL?", name, len(data)); return
        with open(os.path.join(OUT, name), "wb") as f:
            f.write(data)
        print("  OK  ", name, len(data) // 1024, "KB")
    except Exception as e:
        print("  FAIL", file_title, e)

def download(url, name):
    try:
        req = urllib.request.Request(url, headers=UA)
        data = urllib.request.urlopen(req, timeout=60).read()
        with open(os.path.join(OUT, name), "wb") as f:
            f.write(data)
        print("  OK  ", name, len(data) // 1024, "KB")
    except Exception as e:
        print("  FAIL", name, e)

WANT = ["desktop", "start", "menu", "xp", "bliss", "luna", "screenshot"]

try:
    for title in ["Windows XP", "Start menu"]:
        print("== REST", title)
        ml = rest_media_list(title)
        for it in ml.get("items", []):
            t = it.get("title", "")
            tl = t.lower()
            if tl.endswith((".png", ".jpg", ".jpeg")) and any(k in tl for k in WANT):
                safe = t.replace("File:", "").replace(" ", "_")
                grab(t, safe)
                time.sleep(1.5)
except Exception as e:
    print("REST failed:", e)
