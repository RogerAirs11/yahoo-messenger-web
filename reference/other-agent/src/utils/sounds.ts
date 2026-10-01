/* Classic Yahoo! Messenger alert sounds.
   The genuine original Media-folder WAVs are streamed from the community
   archive zip (wink.messengergeek.com) and unpacked at runtime; when the
   pack can't be reached we fall back to faithful Web-Audio recreations. */

import JSZip from "jszip";

const PACK_URL =
  "https://wink.messengergeek.com/uploads/default/original/2X/6/6772da86af49e39ff7f18d752b87da4e9c6f940d.zip";
const REAL_BUZZ_URL = "https://soundxpro.com/cloud_download/sound_68ab56ae21e2c.mp3";

/* ---------- original sound pack ----------
   The WAVs live in a community archive zip. Browsers block cross-origin
   fetches unless the host sends CORS headers, so we try the host directly
   and then fall back through public CORS proxies until one works. */
const pack: Record<string, string> = {};
let packLoading: Promise<void> | null = null;

const PROXIES = [
  (u: string) => u,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
];

export function loadOriginalPack(): Promise<void> {
  if (packLoading) return packLoading;
  packLoading = (async () => {
    let buffer: ArrayBuffer | null = null;
    for (const wrap of PROXIES) {
      try {
        const res = await fetch(wrap(PACK_URL));
        if (!res.ok) continue;
        const ab = await res.arrayBuffer();
        if (ab.byteLength > 4000) {
          buffer = ab;
          break;
        }
      } catch {
        /* try next proxy */
      }
    }
    if (!buffer) {
      packLoading = null; // allow a later retry
      return;
    }
    try {
      const zip = await JSZip.loadAsync(buffer);
      for (const name of Object.keys(zip.files)) {
        const f = zip.files[name];
        if (f.dir || !/\.(wav|mp3)$/i.test(name)) continue;
        const blob = await f.async("blob");
        pack[name.toLowerCase()] = URL.createObjectURL(new Blob([blob], { type: "audio/wav" }));
      }
    } catch {
      packLoading = null;
    }
  })();
  return packLoading;
}

/* kick a load attempt as early as possible */
if (typeof window !== "undefined") void loadOriginalPack();

const packUrl = (...keys: string[]) => {
  for (const k of keys) for (const n in pack) if (n.includes(k)) return pack[n];
  return null;
};

function playPack(keys: string[], fallback: () => void) {
  const url = packUrl(...keys);
  if (!url) {
    void loadOriginalPack(); // warm it so the next event plays the real file
    fallback();
    return;
  }
  const a = new Audio(url);
  a.volume = 0.9;
  a.addEventListener("error", fallback, { once: true });
  a.play().catch(fallback);
}

let ctx: AudioContext | null = null;
function ac(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/* ---- synthesised fallback: clean electric doorbell buzzer ---- */
function synthBuzz() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    const dur = 0.62;

    const master = c.createGain();
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.42, t0 + 0.012);
    master.gain.setValueAtTime(0.42, t0 + dur - 0.1);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 950;
    band.Q.value = 0.9;
    band.connect(master).connect(c.destination);

    // 38 Hz tremolo
    const lfo = c.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = 38;
    const trem = c.createGain();
    trem.gain.value = 0.8;
    const lfoAmt = c.createGain();
    lfoAmt.gain.value = 0.5;
    lfo.connect(lfoAmt).connect(trem.gain);

    const o1 = c.createOscillator();
    o1.type = "square";
    o1.frequency.value = 196; // G3
    const o2 = c.createOscillator();
    o2.type = "square";
    o2.frequency.value = 198.6; // slight detune → grit
    const o3 = c.createOscillator();
    o3.type = "sawtooth";
    o3.frequency.value = 98;

    o1.connect(trem);
    o2.connect(trem);
    o3.connect(trem);
    trem.connect(band);

    [lfo, o1, o2, o3].forEach((o) => {
      o.start(t0);
      o.stop(t0 + dur + 0.05);
    });
  } catch {
    /* audio unavailable */
  }
}

/** The BUZZ!!! — original wav from the pack, mirrored mp3, then synth. */
export function playBuzz() {
  playPack(["buzz"], () => {
    try {
      const a = new Audio(REAL_BUZZ_URL);
      a.volume = 0.9;
      const fb = () => synthBuzz();
      a.addEventListener("error", fb, { once: true });
      a.addEventListener("stalled", fb, { once: true });
      a.play().catch(fb);
    } catch {
      synthBuzz();
    }
  });
}

/** Incoming message — the original "message.wav" door-knock, else synth. */
export function playMessage() {
  playPack(["message"], playKnock);
}

/** Sign-in — the original "yahoo_online.wav", else synth jingle. */
export function playLoginOriginal() {
  playPack(["yahoo_online", "online"], playLogin);
}

/** Sign-out / alert — the original "alert.wav", else synth creak. */
export function playAlertOriginal() {
  playPack(["alert"], playLogout);
}

/* ---- wooden knock-knock (incoming IM, like the original "knock") ---- */
function knockAt(c: AudioContext, t: number) {
  const len = Math.floor(c.sampleRate * 0.09);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 240;
  bp.Q.value = 2.2;
  const g = c.createGain();
  g.gain.value = 0.9;
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
}
export function playKnock() {
  try {
    const c = ac();
    knockAt(c, c.currentTime);
    knockAt(c, c.currentTime + 0.22);
  } catch {
    /* noop */
  }
}

/** Message-sent tick — tiny paper-click blip. */
export function playSent() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    const o = c.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(1180, t0);
    o.frequency.exponentialRampToValueAtTime(720, t0 + 0.07);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + 0.12);
  } catch {
    /* noop */
  }
}

/** Sign-in jingle — bright "yahoo!" rising three-note chime. */
export function playLogin() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    [659.25, 830.6, 987.77].forEach((f, i) => {
      const t = t0 + i * 0.11;
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const h = c.createOscillator();
      h.type = "triangle";
      h.frequency.value = f * 2;
      const hg = c.createGain();
      hg.gain.value = 0.25;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g);
      h.connect(hg).connect(g);
      g.connect(c.destination);
      o.start(t);
      h.start(t);
      o.stop(t + 0.6);
      h.stop(t + 0.6);
    });
  } catch {
    /* noop */
  }
}

/** Sign-out — the old door creak-down: descending groan + latch. */
export function playLogout() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(420, t0);
    o.frequency.exponentialRampToValueAtTime(90, t0 + 0.5);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(900, t0);
    bp.frequency.exponentialRampToValueAtTime(220, t0 + 0.5);
    bp.Q.value = 6;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    o.connect(bp).connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + 0.6);
    knockAt(c, t0 + 0.62);
  } catch {
    /* noop */
  }
}

/** Kiss — the "luv" IMVironment buzz: soft smack + breath. */
export function playKiss() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    const len = Math.floor(c.sampleRate * 0.16);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const p = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.sin(p * Math.PI) * (1 - p * 0.4);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2400, t0);
    bp.frequency.exponentialRampToValueAtTime(900, t0 + 0.14);
    bp.Q.value = 1.4;
    const g = c.createGain();
    g.gain.value = 0.55;
    src.connect(bp).connect(g).connect(c.destination);
    src.start(t0);
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(620, t0 + 0.05);
    o.frequency.exponentialRampToValueAtTime(320, t0 + 0.2);
    const og = c.createGain();
    og.gain.setValueAtTime(0.0001, t0 + 0.05);
    og.gain.exponentialRampToValueAtTime(0.12, t0 + 0.08);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
    o.connect(og).connect(c.destination);
    o.start(t0 + 0.05);
    o.stop(t0 + 0.3);
  } catch {
    /* noop */
  }
}

/** Autumn gust — wind whoosh that sweeps the leaves. */
export function playWind() {
  try {
    const c = ac();
    const t0 = c.currentTime;
    const dur = 1.1;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t0);
    bp.frequency.exponentialRampToValueAtTime(1400, t0 + 0.45);
    bp.frequency.exponentialRampToValueAtTime(260, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(c.destination);
    src.start(t0);
  } catch {
    /* noop */
  }
}
