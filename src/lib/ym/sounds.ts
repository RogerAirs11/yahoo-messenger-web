'use client';

/*
 * Web-Audio synthesized recreations of the classic Yahoo! Messenger sounds:
 *  - IM receive ("ding"), send ("pop"), BUZZ (the iconic ratchet buzz),
 *  - door open/close for buddies signing in & out, sign-in chime, audible blips.
 */

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}
export function isMuted() {
  return muted;
}

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  opts: { type?: OscillatorType; gain?: number; slideTo?: number } = {},
) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type ?? 'sine';
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  if (opts.slideTo) {
    o.frequency.exponentialRampToValueAtTime(Math.max(30, opts.slideTo), c.currentTime + start + dur);
  }
  const peak = opts.gain ?? 0.16;
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(peak, c.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

function noise(start: number, dur: number, opts: { gain?: number; filter?: number; sweepTo?: number } = {}) {
  const c = ac();
  if (!c) return;
  const len = Math.ceil(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(opts.filter ?? 900, c.currentTime + start);
  if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, c.currentTime + start + dur);
  const g = c.createGain();
  const peak = opts.gain ?? 0.09;
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(peak, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(c.currentTime + start);
}

export const sounds = {
  /** classic two-tone IM receive ding */
  receive() {
    if (muted) return;
    tone(987, 0, 0.09, { type: 'triangle', gain: 0.15 });
    tone(1318, 0.085, 0.22, { type: 'triangle', gain: 0.15 });
  },
  /** short send pop */
  send() {
    if (muted) return;
    tone(620, 0, 0.07, { type: 'sine', gain: 0.09, slideTo: 320 });
  },
  /** THE buzz — low ratcheting motor, two bursts */
  buzz() {
    if (muted) return;
    for (let b = 0; b < 2; b++) {
      const base = b * 0.62;
      for (let i = 0; i < 16; i++) {
        tone(88 + (i % 2) * 14, base + i * 0.038, 0.036, { type: 'sawtooth', gain: 0.13 });
      }
    }
  },
  /** buddy signs in — door creak open */
  doorOpen() {
    if (muted) return;
    noise(0, 0.3, { gain: 0.05, filter: 500, sweepTo: 1600 });
    tone(240, 0.02, 0.16, { type: 'sine', gain: 0.07, slideTo: 420 });
    tone(160, 0.3, 0.08, { type: 'sine', gain: 0.05 });
  },
  /** buddy signs out — door close thud */
  doorClose() {
    if (muted) return;
    noise(0, 0.12, { gain: 0.05, filter: 800, sweepTo: 300 });
    tone(120, 0.1, 0.16, { type: 'sine', gain: 0.12, slideTo: 70 });
  },
  /** sign-in chime after door opens */
  signIn() {
    if (muted) return;
    tone(523, 0, 0.12, { type: 'triangle', gain: 0.13 });
    tone(659, 0.1, 0.12, { type: 'triangle', gain: 0.13 });
    tone(784, 0.2, 0.3, { type: 'triangle', gain: 0.15 });
  },
  /** audible cartoon blip */
  audible(pitch = 440) {
    if (muted) return;
    tone(pitch, 0, 0.09, { type: 'square', gain: 0.06 });
    tone(pitch * 1.5, 0.09, 0.14, { type: 'square', gain: 0.06 });
  },
  /** window open tick */
  tick() {
    if (muted) return;
    tone(1400, 0, 0.03, { type: 'sine', gain: 0.05 });
  },
};
