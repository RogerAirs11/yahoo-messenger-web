#!/usr/bin/env python3
"""Fetch GENUINE Windows XP sounds + icons from bartekl1/windows-ui-assets (GitHub)."""
import os, subprocess, json, urllib.parse

TOKEN = subprocess.check_output(
    ["git", "config", "--get", "remote.origin.url"], text=True, cwd="/home/z/my-project"
).split(":")[1].split("@")[0]

BASE = "https://raw.githubusercontent.com/bartekl1/windows-ui-assets/main"
ENC = lambda p: urllib.parse.quote(p)

# ---- sounds ----
SND = {
    "Windows XP Startup.wav": "xp_startup.wav",
    "Windows XP Logon Sound.wav": "xp_logon.wav",
    "Windows XP Logoff Sound.wav": "xp_logoff.wav",
    "Windows XP Shutdown.wav": "xp_shutdown.wav",
    "Windows XP Balloon.wav": "xp_balloon.wav",
    "Windows XP Recycle.wav": "xp_recycle.wav",
    "Windows XP Menu Command.wav": "xp_menu.wav",
    "Windows XP Ding.wav": "xp_ding.wav",
    "Windows XP Error.wav": "xp_error.wav",
    "Windows XP Start.wav": "xp_start.wav",
    "Windows XP Minimize.wav": "xp_minimize.wav",
    "Windows XP Restore.wav": "xp_restore.wav",
    "Windows XP Notify.wav": "xp_notify.wav",
}
DST_SND = "/home/z/my-project/public/assets/sounds/xp"
os.makedirs(DST_SND, exist_ok=True)
for src, dst in SND.items():
    url = f"{BASE}/Sounds/Windows%20XP/{ENC(src)}"
    out = os.path.join(DST_SND, dst)
    r = subprocess.run(["curl", "-sL", "-m", "40", url, "-o", out])
    ok = os.path.exists(out) and os.path.getsize(out) > 1000
    print(("OK  " if ok else "FAIL") + f" {dst} {os.path.getsize(out) if os.path.exists(out) else 0}")

# ---- icons: grab every shell32 icon for inspection ----
with open("/tmp/uiassets.json") as f:
    tree = json.load(f)["tree"]
icopaths = [t["path"] for t in tree if t["path"].startswith("Icons/Windows XP/ico/shell32.dll/")]
os.makedirs("/tmp/xpico", exist_ok=True)
got = 0
for p in icopaths:
    name = p.split("/")[-1]
    out = f"/tmp/xpico/{name}"
    if os.path.exists(out) and os.path.getsize(out) > 100:
        got += 1
        continue
    url = f"{BASE}/{ENC(p)}"
    subprocess.run(["curl", "-sL", "-m", "30", url, "-o", out], check=False)
    if os.path.exists(out) and os.path.getsize(out) > 100:
        got += 1
print(f"icons downloaded: {got}/{len(icopaths)}")
