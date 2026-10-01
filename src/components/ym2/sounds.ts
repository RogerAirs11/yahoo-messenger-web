/* Classic Yahoo! Messenger alert sounds — the GENUINE original WAVs from the
   Messenger Media folder, archived by the community (wink.messengergeek.com)
   and served locally from /public/assets/sounds. Web-Audio recreations act as
   fallbacks (and cover events that had no original WAV: kiss, wind, sent). */

const S = "/assets/sounds";

function playWav(file: string, fallback: () => void, volume = 0.9) {
  try {
    const a = new Audio(`${S}/${file}`);
    a.volume = volume;
    a.addEventListener("error", fallback, { once: true });
    a.addEventListener("stalled", fallback, { once: true });
    a.play().catch(fallback);
  } catch {
    fallback();
  }
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

/** The BUZZ!!! — the original buzz.wav from the Messenger install. */
export function playBuzz() {
  playWav("buzz.wav", synthBuzz);
}

/** Incoming message — the original "message.wav" door-knock, else synth. */
export function playMessage() {
  playWav("message.wav", playKnock);
}

/** Sign-in — the original "yahoo_online.wav" doorbell, else synth jingle. */
export function playLoginOriginal() {
  playWav("yahoo_online.wav", playLogin);
}

/** Sign-out / alert — the original "alert.wav", else synth creak. */
export function playAlertOriginal() {
  playWav("alert.wav", playLogout);
}

/** Voice-call ring — the original default_ring.wav. */
export function playRing() {
  playWav("default_ring.wav", () => {});
}

/* ---- wooden knock-knock (incoming IM fallback, like the original "knock") ---- */
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

/* ==================================================================
   IMVironment BUZZ sounds — layered realistic SFX synthesized
   offline (scripts/make_imv_sounds.py) and served from
   /assets/sounds/imv. Each IMVironment answers the BUZZ with its
   own acoustic scene, exactly like a real IMVironment flourish.
   ================================================================== */

const IMV_WAV: Record<string, string> = {
  aquarium: "aquarium_buzz.wav", // sonar ping + bubbles
  fireworks: "fireworks_buzz.wav", // mortar + whistle + boom + crackle
  hearts: "hearts_buzz.wav", // harp gliss + smack + heartbeat
  winter: "winter_buzz.wav", // arctic wind + sleigh bells
  autumn: "autumn_buzz.wav", // gust + leaf rustle
  beach: "beach_buzz.wav", // breaking wave + seagulls
  doodle: "doodle_buzz.wav", // boing + pencil scribble
};

/** Play the IMVironment-specific buzz sound (falls back to a synth). */
export function playImvBuzz(imv: string) {
  const f = IMV_WAV[imv];
  if (!f) {
    playBuzz();
    return;
  }
  playWav(`imv/${f}`, synthBuzz, 0.95);
}
