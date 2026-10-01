#!/usr/bin/env python3
"""Parse wayback capture of messenger.yahoo.com/imvironments/ to extract IMV names + image URLs."""
import json, re, sys, html as htmllib

def main(path):
    d = json.load(open(path))
    data = d.get("data", d)
    h = data.get("html", "")
    print("HTML length:", len(h))
    open("scripts/imv_page.html", "w").write(h)
    # extract all <img> srcs
    imgs = re.findall(r'<img[^>]+src="([^"]+)"', h)
    print("\n--- IMAGES (%d) ---" % len(imgs))
    for i in imgs[:80]:
        print(i)
    # extract links to imv pages
    links = re.findall(r'href="([^"]*imv[^"]*)"', h, re.I)
    print("\n--- IMV LINKS ---")
    for l in sorted(set(links))[:60]:
        print(l)
    # find swf
    swfs = re.findall(r'([^"\']+\.swf[^"\']*)', h)
    print("\n--- SWF ---")
    for s in sorted(set(swfs))[:40]:
        print(s)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "scripts/wr_imv2009.json")
