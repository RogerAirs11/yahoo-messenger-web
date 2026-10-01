#!/usr/bin/env python3
"""
Synthesize realistic per-IMVironment BUZZ sounds for the Yahoo! Messenger
web replica. Layered additive/filtered-noise synthesis -> 44.1kHz 16-bit WAV.

Each sound is designed to be a *realistic* acoustic event, not a beep:
  aquarium : sonar ping through water + bubble cluster + deep water bed
  fireworks: mortar thump, rising whistle, shell boom, crackle tail
  hearts   : harp glissando + lip smack + warm heartbeat
  winter   : arctic wind howl + sleigh-bell shimmer
  autumn   : leaf-crackle rustle swept by a gust
  beach    : breaking wave (swell -> crash -> foam) + seagull cries
  doodle   : pencil scribble flourish + cartoon boing
"""
import numpy as np
from scipy import signal as sp
from scipy.io import wavfile
import os

SR = 44100
OUT = "/home/z/my-project/public/assets/sounds/imv"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2008)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env_asr(n, a, r, hold=1.0):
    """attack-sustain-release envelope over n samples"""
    e = np.ones(n) * hold
    na, nr = int(a * SR), int(r * SR)
    na, nr = min(na, n), min(nr, n)
    if na > 0:
        e[:na] *= np.linspace(0, 1, na) ** 1.5
    if nr > 0:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.2
    return e


def bp(sig, lo, hi, order=4):
    sos = sp.butter(order, [max(lo, 20), min(hi, SR / 2 - 200)], btype="band", fs=SR, output="sos")
    return sp.sosfilt(sos, sig)


def lp(sig, fc, order=4):
    sos = sp.butter(order, min(fc, SR / 2 - 200), btype="low", fs=SR, output="sos")
    return sp.sosfilt(sos, sig)


def hp(sig, fc, order=4):
    sos = sp.butter(order, max(fc, 20), btype="high", fs=SR, output="sos")
    return sp.sosfilt(sos, sig)


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def mix_at(canvas, snd, at, gain=1.0):
    i = int(at * SR)
    j = min(len(canvas), i + len(snd))
    if j > i:
        canvas[i:j] += snd[: j - i] * gain


def save(name, x):
    x = norm(x)
    # 3 ms fade edges to kill clicks
    f = int(0.003 * SR)
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    wavfile.write(f"{OUT}/{name}.wav", SR, (x * 32767).astype(np.int16))
    print(f"  {name}.wav  {len(x)/SR:.2f}s")


# ---------------------------------------------------------------- widgets
def sine_sweep(dur, f0, f1, curve="exp"):
    tt = t(dur)
    if curve == "exp":
        f = f0 * (f1 / f0) ** (tt / dur)
    else:
        f = f0 + (f1 - f0) * (tt / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph)


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def sonar_ping(freq=780, dur=1.9, ping_at=0.0, fmed=1100):
    """ping -> reverberant underwater tail (band-limited echo repeats)"""
    n = int(dur * SR)
    out = np.zeros(n)
    ping = sine_sweep(0.16, freq * 1.12, freq) * env_asr(int(0.16 * SR), 0.004, 0.12)
    ping += sine_sweep(0.16, freq * 2.24, freq * 2) * env_asr(int(0.16 * SR), 0.004, 0.10) * 0.24
    for k, (dt, g) in enumerate([(0.0, 1.0), (0.42, 0.42), (0.86, 0.19), (1.32, 0.09)]):
        mix_at(out, lp(ping, fmed), ping_at + dt, g)
    return out


def bubble(dur=0.16, f0=420):
    """single 'blub' — rising sine chirp, resonant"""
    d = sine_sweep(dur, f0, f0 * 2.6) * env_asr(int(dur * SR), 0.004, dur * 0.7)
    return d + 0.3 * sine_sweep(dur, f0 * 2, f0 * 5.2) * env_asr(int(dur * SR), 0.004, dur * 0.7)


def bubble_cluster(n=9, span=1.1, f_lo=330, f_hi=760):
    out = np.zeros(int((span + 0.4) * SR))
    for _ in range(n):
        at = rng.uniform(0, span)
        f = rng.uniform(f_lo, f_hi)
        b = bubble(rng.uniform(0.09, 0.17), f)
        mix_at(out, b, at, rng.uniform(0.25, 0.6))
    return out


def boom(dur=1.6, punch=1.0):
    """explosive shell burst: sub drop + blast noise + tail"""
    n = int(dur * SR)
    tt = t(dur)
    sub = np.sin(2 * np.pi * (90 * np.exp(-tt * 3.2) + 34) * tt) * np.exp(-tt * 3.0)
    blast = lp(noise(dur), 900) * np.exp(-tt * 5.5)
    tail = lp(noise(dur), 320) * np.exp(-tt * 1.9) * 0.5
    x = (sub * 1.15 + blast * 0.9 * punch + tail) * env_asr(n, 0.002, dur * 0.5)
    return x


def crackle(dur=1.5, density=95):
    n = int(dur * SR)
    out = np.zeros(n)
    k = int(density * dur)
    for _ in range(k):
        at = rng.uniform(0, dur * 0.85)
        d = rng.uniform(0.008, 0.03)
        c = hp(noise(d), 1800) * np.exp(-t(d) * 140) * rng.uniform(0.2, 0.9)
        mix_at(out, c, at)
    return hp(out, 1200)


def whistle(dur=0.75, f0=640, f1=1650):
    """rocket ascent: wobbling glide"
    """
    tt = t(dur)
    vib = 1 + 0.02 * np.sin(2 * np.pi * 9.5 * tt)
    x = sine_sweep(dur, f0, f1) * vib
    breath = bp(noise(dur), f0 * 1.2, f1 * 1.4) * 0.16
    return (x + breath) * env_asr(int(dur * SR), 0.05, 0.06)


def pluck(freq, dur=1.2, bright=0.55):
    """Karplus-Strong string pluck (harp)"""
    n = int(dur * SR)
    period = int(SR / freq)
    buf = rng.standard_normal(period) * 0.9
    out = np.zeros(n)
    idx = 0
    damp = 0.9965 - bright * 0.04
    for i in range(n):
        out[i] = buf[idx]
        nxt = (idx + 1) % period
        buf[idx] = damp * 0.5 * (buf[idx] + buf[nxt])
        idx = nxt
    return out * env_asr(n, 0.002, dur * 0.85)


def smack(dur=0.22):
    """lip smack: fast band sweep pop"""
    x = bp(noise(dur), 700, 2600) * env_asr(int(dur * SR), 0.002, 0.16)
    sd = 0.10
    x[: int(sd * SR)] += sine_sweep(sd, 480, 190) * env_asr(int(sd * SR), 0.002, 0.07) * 0.7
    return x


def heartbeat(dur=2.0, bpm=64):
    """lub-dub through a warm chest"
    """
    n = int(dur * SR)
    out = np.zeros(n)
    period = 60 / bpm

    def thump(at, g):
        d = 0.16
        tt = t(d)
        s = np.sin(2 * np.pi * (58 * np.exp(-tt * 9) + 42) * tt) * np.exp(-tt * 17)
        s = lp(s, 130)
        mix_at(out, s, at, g)

    beats = np.arange(0.05, dur, period)
    for i, b in enumerate(beats):
        thump(b, 1.0)
        thump(b + period * 0.19, 0.62)
    return out


def wind_howl(dur=2.6, base=340):
    """arctic gust: wandering resonant band over breathy noise"""
    n = int(dur * SR)
    tt = t(dur)
    # slow random walk of the centre frequency
    steps = 24
    f_pts = base * np.exp(rng.normal(0, 0.28, steps) * np.sin(np.linspace(0, np.pi * 1.3, steps)))
    f_curve = np.interp(np.linspace(0, 1, n), np.linspace(0, 1, steps), f_pts)
    x = noise(dur)
    # time-varying band-pass via short chunks
    chunk = 1024
    y = np.zeros(n)
    for i in range(0, n, chunk):
        j = min(n, i + chunk)
        fc = np.clip(f_curve[i:j].mean(), 120, 1500)
        y[i:j] = bp(x[i:j], fc * 0.62, fc * 1.75)
    amp = env_asr(n, dur * 0.28, dur * 0.34) * (0.75 + 0.25 * np.sin(2 * np.pi * 1.7 * tt))
    return y * amp


def bells(dur=2.2, n_bells=13, f_lo=2100, f_hi=3900):
    """sleigh bells: inharmonic metallic jingles shaken over the gust"""
    out = np.zeros(int(dur * SR))
    for _ in range(n_bells):
        at = rng.uniform(0, dur - 0.3)
        d = rng.uniform(0.22, 0.42)
        f = rng.uniform(f_lo, f_hi)
        tt = t(d)
        partials = [1.0, 1.41, 1.93, 2.71]
        s = sum(np.sin(2 * np.pi * f * p * tt + rng.uniform(0, 6)) / (i + 1) for i, p in enumerate(partials))
        trem = 0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(24, 38) * tt)
        s *= trem * np.exp(-tt * 9) * env_asr(int(d * SR), 0.004, d * 0.5)
        mix_at(out, hp(s, 1400), at, rng.uniform(0.10, 0.2))
    return out


def leaf_crackle(dur=1.7, density=140):
    """dry leaves: crunchy short high-passed bursts"""
    n = int(dur * SR)
    out = np.zeros(n)
    for _ in range(int(density * dur)):
        at = rng.uniform(0, dur * 0.9)
        d = rng.uniform(0.006, 0.022)
        c = hp(noise(d), 2500) * np.exp(-t(d) * 220) * rng.uniform(0.25, 1.0)
        mix_at(out, c, at)
    return out


def wave(dur=2.4):
    """swell -> crest -> foam hiss spreading up the sand"""
    n = int(dur * SR)
    tt = t(dur)
    swell_env = np.where(tt < dur * 0.55, (tt / (dur * 0.55)) ** 2.4, np.exp(-(tt - dur * 0.55) * 4.2))
    body = lp(noise(dur), 560) * swell_env
    # the break: sharp mid thump at the crest
    crest_at = int(dur * 0.55 * SR)
    brk = bp(noise(dur * 0.5), 180, 900) * np.exp(-t(dur * 0.5) * 6)
    mix_at(body, brk, dur * 0.55, 0.9)
    foam = hp(noise(dur), 1500) * env_asr(n, dur * 0.5, dur * 0.28) * 0.5 * (1 + 0.3 * np.sin(2 * np.pi * 0.8 * tt))
    return body + foam * swell_env


def seagull(at_canvas=None, dur=0.75, f0=1250):
    """'keeer' — FM descending cry with vibrato"""
    tt = t(dur)
    fm = f0 * (1 - 0.42 * tt / dur) * (1 + 0.06 * np.sin(2 * np.pi * 13 * tt))
    ph = 2 * np.pi * np.cumsum(fm) / SR
    x = np.sin(ph) + 0.34 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    x = bp(x, 600, 3400)
    return x * env_asr(int(dur * SR), 0.045, 0.30)


def scribble(dur=0.85):
    """pencil on paper: resonant scratchy strokes with direction changes"""
    n = int(dur * SR)
    out = np.zeros(n)
    at = 0.0
    while at < dur - 0.1:
        d = rng.uniform(0.09, 0.16)
        f = rng.uniform(900, 2100)
        s = bp(noise(d), f * 0.8, f * 1.9, order=2) * env_asr(int(d * SR), 0.01, 0.03)
        mix_at(out, s, at, rng.uniform(0.5, 0.9))
        at += d + rng.uniform(0.015, 0.05)
    return out


def boing(dur=0.85):
    """cartoon spring: pitch drops with wobble"""
    tt = t(dur)
    f = 420 * np.exp(-tt * 2.6) * (1 + 0.16 * np.exp(-tt * 5) * np.sin(2 * np.pi * 27 * tt))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-tt * 3.4)
    x += 0.35 * np.sin(2 * ph) * np.exp(-tt * 4.5)
    return x * env_asr(int(dur * SR), 0.004, 0.5)


# ================================================================ scenes
def make_aquarium():
    print("aquarium")
    dur = 2.6
    c = np.zeros(int(dur * SR))
    mix_at(c, sonar_ping(780, 2.4, 0.0, 1150), 0.0, 0.85)
    mix_at(c, bubble_cluster(11, 1.3, 300, 720), 0.28, 0.8)
    # deep water bed + distant whale-ish moan for depth
    bed = lp(noise(dur), 160) * env_asr(int(dur * SR), 0.6, 1.2) * 0.5
    mix_at(c, bed, 0.0, 0.5)
    moan = sine_sweep(1.4, 165, 95) * env_asr(int(1.4 * SR), 0.35, 0.7)
    mix_at(c, lp(moan, 300), 0.7, 0.16)
    save("aquarium_buzz", c)


def make_fireworks():
    print("fireworks")
    dur = 3.4
    c = np.zeros(int(dur * SR))
    # mortar thump
    th = lp(sine_sweep(0.14, 120, 46) * env_asr(int(0.14 * SR), 0.003, 0.1), 200)
    mix_at(c, th, 0.0, 1.1)
    # ascent whistle
    mix_at(c, whistle(0.78, 560, 1750), 0.10, 0.5)
    # shell boom + crackle
    mix_at(c, boom(1.7, 1.15), 0.86, 1.0)
    mix_at(c, crackle(1.7, 120), 0.94, 0.55)
    # second smaller salute
    mix_at(c, boom(1.2, 0.7), 1.55, 0.55)
    mix_at(c, crackle(1.2, 90), 1.62, 0.4)
    save("fireworks_buzz", c)


def make_hearts():
    print("hearts")
    dur = 3.0
    c = np.zeros(int(dur * SR))
    # harp gliss up a major pentatonic, two octaves
    scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.7, 1318.5]
    for i, f in enumerate(scale):
        mix_at(c, pluck(f, 1.5, 0.5), i * 0.075, 0.34 if i % 2 else 0.42)
    # kiss smacks + heartbeat under
    mix_at(c, smack(), 0.72, 0.85)
    mix_at(c, smack(), 1.02, 0.6)
    mix_at(c, heartbeat(2.6, 66), 0.35, 0.9)
    mix_at(c, bells(1.2, 6, 2600, 4200), 0.0, 0.10)  # faint shimmer
    save("hearts_buzz", c)


def make_winter():
    print("winter")
    dur = 3.0
    c = np.zeros(int(dur * SR))
    mix_at(c, wind_howl(3.0, 300), 0.0, 1.0)
    mix_at(c, bells(2.4, 15), 0.25, 0.5)
    # icy sparkle tail
    mix_at(c, crackle(1.0, 40), 1.4, 0.12)
    save("winter_buzz", c)


def make_autumn():
    print("autumn")
    dur = 2.8
    c = np.zeros(int(dur * SR))
    gust = wind_howl(2.8, 420)
    mix_at(c, gust, 0.0, 0.95)
    leaves = leaf_crackle(2.2, 150)
    # rustle swells with the gust
    env = env_asr(len(leaves), 0.7, 0.9)
    mix_at(c, leaves * env, 0.15, 0.75)
    save("autumn_buzz", c)


def make_beach():
    print("beach")
    dur = 3.4
    c = np.zeros(int(dur * SR))
    mix_at(c, wave(2.9), 0.0, 1.0)
    g1 = seagull(None, 0.8, 1300)
    g2 = seagull(None, 0.62, 1500)
    mix_at(c, g1, 0.25, 0.34)
    mix_at(c, g2, 1.15, 0.26)
    g3 = seagull(None, 0.55, 1150)
    mix_at(c, g3, 2.2, 0.20)
    save("beach_buzz", c)


def make_doodle():
    print("doodle")
    dur = 1.7
    c = np.zeros(int(dur * SR))
    mix_at(c, boing(0.9), 0.0, 1.0)
    mix_at(c, scribble(0.8), 0.55, 0.8)
    mix_at(c, boing(0.5), 1.1, 0.35)
    save("doodle_buzz", c)


if __name__ == "__main__":
    make_aquarium()
    make_fireworks()
    make_hearts()
    make_winter()
    make_autumn()
    make_beach()
    make_doodle()
    print("done ->", OUT)
