#!/usr/bin/env python3
"""Download REAL BBC Sound Effects and cut polished loops/buzzes for each IMVironment.

Sources: sound-effects-media.bbcrewind.co.uk (RemArc licence, personal/educational use).
Smart segment picking via RMS analysis: finds the most eventful / cleanest window.
"""
import json, os, subprocess, tempfile
import numpy as np

MEDIA = "https://sound-effects-media.bbcrewind.co.uk/mp3/{}.mp3"
OUT = "/home/z/my-project/public/assets/sounds/imv"
TMP = "/tmp/bbc"
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

def fetch(id_):
    p = os.path.join(TMP, f"{id_}.mp3")
    if not os.path.exists(p) or os.path.getsize(p) < 10000:
        subprocess.run(["curl", "-sL", "-m", "120", MEDIA.format(id_), "-o", p], check=True)
        print(f"  fetched {id_}: {os.path.getsize(p)//1024}KB")
    return p

def load(p):
    """decode to mono float32 44.1k via ffmpeg"""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "44100", "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def rms_profile(x, win=8192):
    n = len(x) // win
    if n == 0:
        return np.array([np.sqrt(np.mean(x ** 2) + 1e-12)])
    return np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(axis=1) + 1e-12)

def pick_event(x, sr, dur, hold=0.35, search_from=0.5, search_to=None):
    """window starting just before the strongest transient (attack)."""
    search_to = search_to or (len(x) / sr)
    win = int(dur * sr)
    lo, hi = int(search_from * sr), min(int(search_to * sr), len(x) - win)
    if hi <= lo:
        return max(0, len(x) - win)
    step = max(1, int(0.01 * sr))
    best, best_score = lo, -1
    for s in range(lo, hi, step):
        seg = x[s : s + win]
        pre = x[max(0, s - int(0.3 * sr)) : s + int(0.05 * sr)]
        peak = np.abs(seg).max()
        prelvl = np.abs(pre).mean() if len(pre) else 0.0
        score = peak * (1.0 / (prelvl + 0.005))
        if peak > best_score:
            best_score, best = peak, s
    # back up so the attack has a touch of room
    return max(0, best - int(hold * sr))

def pick_dense(x, sr, dur, search_from=1.0):
    """window with the most transients (salvo / crunch burst)."""
    win = int(dur * sr)
    step = max(1, int(0.05 * sr))
    best, best_score = int(search_from * sr), -1
    for s in range(int(search_from * sr), max(int(search_from * sr) + 1, len(x) - win), step):
        seg = np.abs(x[s : s + win])
        # transient count: local maxima above 2x local mean
        w = 4410
        n = len(seg) // w
        if n < 2:
            continue
        blocks = seg[: n * w].reshape(n, w).max(axis=1)
        score = blocks.mean() + blocks.std() * 2
        if score > best_score:
            best_score, best = score, s
    return best

def pick_calm(x, sr, dur, avoid_first=2.0):
    """steady low-variance window (for ambient loops)."""
    win = int(dur * sr)
    lo = int(avoid_first * sr)
    step = max(1, int(0.1 * sr))
    best, best_score = lo, 1e18
    for s in range(lo, max(lo + 1, len(x) - win), step):
        seg = x[s : s + win]
        r = rms_profile(seg, 22050)
        score = r.std() / (r.mean() + 1e-6)  # flatness
        if score < best_score:
            best_score, best = score, s
    return best

def export(x, sr, start, dur, out, fades=0.03, norm=0.89, vol=1.0):
    win = int(dur * sr)
    seg = x[start : start + win].copy()
    if len(seg) < win:
        seg = np.pad(seg, (0, win - len(seg)))
    peak = np.abs(seg).max() + 1e-9
    seg = seg * (norm / peak) * vol
    f = int(fades * sr)
    if f > 0:
        env = np.ones(len(seg))
        env[:f] = np.linspace(0, 1, f)
        env[-f:] = np.linspace(1, 0, f)
        seg = seg * env
    p = os.path.join(OUT, out)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-",
         "-codec:a", "libmp3lame", "-b:a", "160k", p],
        input=seg.astype(np.float32).tobytes(), check=True)
    print(f"  -> {out}  {os.path.getsize(p)//1024}KB")

def process(id_, jobs):
    print(f"\n== {id_}")
    p = fetch(id_)
    x = load(p)
    sr = 44100
    for job in jobs:
        mode, dur, out = job
        if mode == "event":
            s = pick_event(x, sr, dur)
        elif mode == "dense":
            s = pick_dense(x, sr, dur)
        else:
            s = pick_calm(x, sr, dur)
        fades = 0.5 if mode == "ambient" else 0.04
        export(x, sr, s, dur, out, fades=fades)

SR = 44100
# ---- ambient loops (subtle background bed while the IMV is active) ----
process("07044003", [("ambient", 16.0, "beach_ambient.mp3")])        # seawash + gulls
process("0009070",  [("ambient", 14.0, "aquarium_ambient.mp3")])     # underwater bubbles
process("07038330", [("ambient", 15.0, "winter_ambient.mp3")])       # howling wind
process("07049089", [("ambient", 15.0, "autumn_ambient.mp3")])       # gusts + rustling leaves

# ---- buzz flourishes (the artistic answer to BUZZ) ----
process("07044109", [("event", 3.2, "beach_buzz.mp3")])              # large splash
process("07019117", [("dense", 5.0, "fireworks_buzz.mp3")])          # firework salvo
process("07012094", [("event", 4.0, "winter_buzz.mp3")])             # sleigh bells
process("07041195", [("dense", 4.0, "autumn_buzz.mp3")])             # crunching leaves
process("07042169", [("event", 2.6, "hearts_buzz.mp3")])             # real kiss
process("07005043", [("event", 2.8, "doodle_buzz.mp3")])             # jews-harp boing
process("07034088", [("event", 3.4, "aquarium_buzz.mp3")])           # real sonar ping
print("\nDONE")
