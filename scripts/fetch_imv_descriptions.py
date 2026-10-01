#!/usr/bin/env python3
"""Fetch several wayback view pages via page_reader and print their description text."""
import json, re, subprocess, html as H

PAGES = {
    "fishtank": "https://web.archive.org/web/20111005032616/http://messenger.yahoo.com/imvironments/view/fishtank/",
    "snowflake": "https://web.archive.org/web/20111005032616/http://messenger.yahoo.com/imvironments/view/snowflake/",
    "hearts": "https://web.archive.org/web/20111005032616/http://messenger.yahoo.com/imvironments/view/hearts/",
    "doodle": "https://web.archive.org/web/20111005032616/http://messenger.yahoo.com/imvironments/view/doodle/",
    "emoticats": "https://web.archive.org/web/20111005032616/http://messenger.yahoo.com/imvironments/view/emoticats/",
    "purpleleaves": "https://web.archive.org/web/20111008043328/http://messenger.yahoo.com/imvironments/view/purpleleaves/",
}

for name, url in PAGES.items():
    out = f"scripts/wr_view_{name}.json"
    try:
        subprocess.run(["z-ai", "function", "-n", "page_reader", "-a", json.dumps({"url": url}), "-o", out],
                       capture_output=True, timeout=120)
        d = json.load(open(out))
        h = d.get("data", d).get("html", "")
        txt = re.sub(r"<script.*?</script>", "", h, flags=re.S)
        txt = re.sub(r"<style.*?</style>", "", txt, flags=re.S)
        txt = re.sub(r"<[^>]+>", " ", txt)
        txt = H.unescape(re.sub(r"\s+", " ", txt))
        # find the description chunk between 'New Y! Messenger' marker and 'IMVironment Categories'
        m = re.search(r"New Y! Messenger(.{0,400}?)IMVironment Categories", txt)
        desc = m.group(1).strip() if m else txt[:300]
        # also grab images
        imgs = [u for u in re.findall(r'<img[^>]+src="([^"]+)"', h) if "l.yimg" in u]
        print(f"== {name} ==\nDESC: {desc}\nIMGS: {imgs}\n")
    except Exception as e:
        print(f"== {name} == FAILED: {e}\n")
