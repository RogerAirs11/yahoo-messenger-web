#!/usr/bin/env python3
"""Search BBC Sound Effects for real IMVironment sounds, show candidates."""
import json, subprocess

API = "https://sound-effects-api.bbcrewind.co.uk/api/sfx/search"
QUERIES = [
    "large wave crashing",
    "single seagull call",
    "harp gliss",
    "chalk writing blackboard",
    "whale call underwater",
    "sonar",
    "wind gust trees leaves",
    "dry leaves crunch footsteps",
    "water splash",
    "clock tick",
]

def search(q, n=6):
    body = json.dumps({"criteria": {"query": q}})
    out = subprocess.run(
        ["curl", "-s", "-m", "20", "-X", "POST", API, "-H", "Content-Type: application/json",
         "-H", "User-Agent: Mozilla/5.0", "-d", body],
        capture_output=True, text=True).stdout
    try:
        return json.loads(out).get("results", [])[:n]
    except Exception:
        return []

for q in QUERIES:
    rs = search(q)
    print(f"\n=== {q} ===")
    for r in rs:
        dur = r.get("duration", 0) / 1000
        cats = ",".join(c["className"] for c in r.get("categories", []))
        print(f"  {r['id']}  {dur:6.1f}s  [{cats}]  {r.get('description','')[:90]}")
