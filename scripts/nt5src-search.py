#!/usr/bin/env python3
"""Mine the real XP SP1 source tree (nt5src) for Luna theme metrics."""
import urllib.request, urllib.parse, json, time

TOKEN = os.environ.get("GH_TOKEN", "")

def gh(path):
    url = path if path.startswith("http") else "https://api.github.com" + path
    req = urllib.request.Request(url, headers={
        "User-Agent": "xp-ref-fetcher",
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    })
    return urllib.request.urlopen(req, timeout=60)

def search(q, n=12):
    r = json.load(gh("/search/code?q=" + urllib.parse.quote(q) + "&per_page=%d" % n))
    print(f"== '{q}' total={r.get('total_count')}")
    for it in r.get("items", [])[:n]:
        print("  ", it["path"])
    return r

for q in [
    "STARTBUTTON repo:tongzx/nt5src",
    "Trebuchet repo:tongzx/nt5src",
    "luna repo:tongzx/nt5src path:shell/themes",
]:
    try:
        search(q)
    except Exception as e:
        print("FAIL", q, e)
    time.sleep(2)
