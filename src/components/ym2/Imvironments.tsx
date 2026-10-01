"use client";

import React, { useEffect, useRef, useState } from "react";
import { GlossyHeart, HeartGlyph, LeafGlyph, BigKiss } from "./icons";

/* ==================================================================
   IMVironments — rich, layered, hand-composed recreations of the
   classic Yahoo! Messenger chat scenes. Every scene is a little
   living world with a far layer, a mid layer, foreground dressing,
   ambient particles and its own lighting — and every scene answers
   a BUZZ in its own artistic, dramatic way, with its own realistic
   sound (see sounds.ts / /assets/sounds/imv).
   ================================================================== */

export type ImvId =
  | "none"
  | "aquarium"
  | "autumn"
  | "beach"
  | "doodle"
  | "fireworks"
  | "hearts"
  | "winter";

/* ---------- tiny menu icons (13px) ---------- */
export const ImvIconFish = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    <path d="M2 7 Q6 2.5 11 7 Q6 11.5 2 7 z" fill="#f5a623" stroke="#c47f0e" strokeWidth="0.7" />
    <path d="M11 7 L13.6 4.6 L13.6 9.4 z" fill="#f5a623" stroke="#c47f0e" strokeWidth="0.7" />
    <circle cx="4.4" cy="6.4" r="0.8" fill="#333" />
  </svg>
);
export const ImvIconBurst = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1="7" y1="7" x2={7 + 5.6 * Math.cos((i * Math.PI) / 4)} y2={7 + 5.6 * Math.sin((i * Math.PI) / 4)} stroke={i % 2 ? "#e8b23a" : "#d05050"} strokeWidth="1.6" strokeLinecap="round" />
    ))}
    <circle cx="7" cy="7" r="1.6" fill="#fff" stroke="#c9932a" strokeWidth="0.6" />
  </svg>
);
export const ImvIconSnow = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    {[0, 60, 120].map((a) => (
      <line key={a} x1="7" y1="1.4" x2="7" y2="12.6" stroke="#5a9bd4" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${a} 7 7)`} />
    ))}
  </svg>
);
export const ImvIconUmbrella = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    <path d="M1.6 7.4 A5.4 5.4 0 0 1 12.4 7.4 z" fill="#e05a5a" />
    <path d="M7 1.9 V12.2" stroke="#8a5a2a" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M7 12.2 q0 1.3 -1.2 1.3" fill="none" stroke="#8a5a2a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
export const ImvIconPencil = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    <path d="M3 11 L3.8 8.6 L10.4 2 L12 3.6 L5.4 10.2 z" fill="#f0b23a" stroke="#a86a10" strokeWidth="0.7" />
    <path d="M3.8 8.6 L5.4 10.2" stroke="#a86a10" strokeWidth="0.7" />
  </svg>
);

export const IMV_LIST: { id: ImvId; label: string; icon: React.ReactNode | null }[] = [
  { id: "none", label: "None", icon: null },
  { id: "aquarium", label: "Aquarium", icon: <ImvIconFish /> },
  { id: "autumn", label: "Autumn", icon: <LeafGlyph size={13} /> },
  { id: "beach", label: "Beach", icon: <ImvIconUmbrella /> },
  { id: "doodle", label: "Doodle", icon: <ImvIconPencil /> },
  { id: "fireworks", label: "Fireworks", icon: <ImvIconBurst /> },
  { id: "hearts", label: "Hearts", icon: <HeartGlyph size={13} /> },
  { id: "winter", label: "Winter", icon: <ImvIconSnow /> },
];

/* ---------- pane backgrounds — graded like little paintings ---------- */
export const IMV_BG: Record<ImvId, string> = {
  none: "#ffffff",
  hearts: "linear-gradient(165deg, #ffe9f1 0%, #ffd9e7 30%, #ffc7da 58%, #ffb3cb 100%)",
  autumn: "linear-gradient(180deg, #fdf6e4 0%, #fae7bd 32%, #f6d59c 62%, #efc489 100%)",
  aquarium: "linear-gradient(180deg, #8fd0ee 0%, #5fb0e2 20%, #3f93cf 44%, #2e7ab8 70%, #23619b 100%)",
  beach: "linear-gradient(180deg, #4fa8e0 0%, #7ec2ef 26%, #b5e0f7 46%, #ffeccb 62%, #f7e0b2 82%, #eed7a9 100%)",
  doodle: "#fdfcf6",
  fireworks: "linear-gradient(180deg, #23265e 0%, #3c4090 20%, #6a6fc0 42%, #a7a7e4 66%, #e6def2 88%, #efe9f5 100%)",
  winter: "linear-gradient(180deg, #2c517f 0%, #40689a 22%, #7295ba 50%, #a9c6de 74%, #dcebf5 100%)",
};

/* ==================================================================
   The scene component — drop behind the message text.
   `buzz` is a counter: each increment re-mounts that scene's one-shot
   reaction layer once (while the world itself keeps living).
   ================================================================== */
interface Props {
  imv: ImvId;
  buzz: number;
}

export function ImvScene({ imv, buzz }: Props) {
  if (imv === "none") return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {imv === "hearts" && <Hearts buzz={buzz} />}
      {imv === "autumn" && <Autumn buzz={buzz} />}
      {imv === "aquarium" && <Aquarium buzz={buzz} />}
      {imv === "fireworks" && <Fireworks buzz={buzz} />}
      {imv === "winter" && <Winter buzz={buzz} />}
      {imv === "beach" && <Beach buzz={buzz} />}
      {imv === "doodle" && <Doodle buzz={buzz} />}
    </div>
  );
}

/* deterministic PRNG so layouts are stable across re-renders */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* soft wash that keeps message text readable over busy art */
function ReadingGlow({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(115% 75% at 34% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.35) 55%, transparent 78%)", opacity }}
    />
  );
}

/* gentle vignette that gives every scene a composed, photographic feel */
function Vignette({ strength = 0.16 }: { strength?: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{ background: `radial-gradient(120% 96% at 50% 42%, transparent 62%, rgba(20,24,46,${strength}) 100%)` }}
    />
  );
}

/* ==================================================================
   AQUARIUM — a coral reef kingdom: deep graded water, shimmering
   surface, god rays, moving light caustics, a schooling silverfish
   trio, clownfish / tang / blue tang / angelfish residents, two
   jellyfish, a full reef (rocks, branching coral, brain coral, tube
   sponges, an anemone with waving tentacles, a clam with a pearl,
   a patrolling crab), tall kelp and rising bubbles.
   BUZZ: a sonar shockwave (3 rings) + white flash, the whole reef
  startles — fish dart for cover, a massive bubble column erupts
   from the floor, and the jellyfish flare.
   ================================================================== */
function Aquarium({ buzz }: { buzz: number }) {
  return (
    <>
      <ReadingGlow opacity={0.4} />

      {/* the surface, seen from below — two counter-sliding shimmer bands */}
      <div className="absolute top-0 left-0 right-0 h-[36px] overflow-hidden">
        <svg className="imv-surface absolute top-[2px] left-[-40px]" width="220%" height="34" viewBox="0 0 1200 34" preserveAspectRatio="none">
          <path d="M0 18 Q30 6 60 18 T120 18 T180 18 T240 18 T300 18 T360 18 T420 18 T480 18 T540 18 T600 18 T660 18 T720 18 T780 18 T840 18 T900 18 T960 18 T1020 18 T1080 18 T1140 18 T1200 18 V0 H0 z" fill="rgba(255,255,255,0.6)" />
          <path d="M0 18 Q30 6 60 18 T120 18 T180 18 T240 18 T300 18 T360 18 T420 18 T480 18 T540 18 T600 18 T660 18 T720 18 T780 18 T840 18 T900 18 T960 18 T1020 18 T1080 18 T1140 18 T1200 18" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
        </svg>
        <svg className="imv-surface absolute top-[8px] left-[-40px]" width="220%" height="34" viewBox="0 0 1200 34" preserveAspectRatio="none" style={{ animationDirection: "reverse", animationDuration: "13s", opacity: 0.6 }}>
          <path d="M0 22 Q40 12 80 22 T160 22 T240 22 T320 22 T400 22 T480 22 T560 22 T640 22 T720 22 T800 22 T880 22 T960 22 T1040 22 T1120 22 T1200 22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />
        </svg>
      </div>

      {/* god rays — six shafts at varied angles */}
      <div className="absolute inset-0 overflow-hidden">
        {[-11, 13, 3, -4, 8, -14].map((r, i) => (
          <div
            key={i}
            className="imv-ray absolute"
            style={{
              left: `${5 + i * 16}%`,
              top: "-14%",
              width: `${7 + (i % 3) * 3.5}%`,
              height: "92%",
              transform: `rotate(${r}deg)`,
              animationDelay: `${-i * 2.35}s`,
              animationDuration: `${6 + (i % 3)}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* light caustics — two drifting nets of soft light near the floor */}
      <div className="absolute left-[-10%] right-[-10%] bottom-[4%] h-[30%] overflow-hidden" style={{ opacity: 0.32 }}>
        <div className="imv-caustic absolute inset-0" />
        <div className="imv-caustic absolute inset-0" style={{ animationDelay: "-7s", transform: "scaleX(-1)" }} />
      </div>

      {/* jellyfish — two, pulsing upward with trailing tentacles */}
      <div className="imv-jellydrift absolute left-[72%] top-[14%]" style={{ animationDuration: "15s" }}>
        <div className="imv-jelly">
          <svg width="48" height="78" viewBox="0 0 44 72">
            <path d="M4 26 A18 17 0 0 1 40 26 Q40 33 33 32 Q26 35 22 32 Q18 35 11 32 Q4 33 4 26 z" fill="rgba(255,170,205,0.8)" stroke="rgba(225,115,165,0.85)" strokeWidth="1" />
            <ellipse cx="15" cy="20" rx="5" ry="3.4" fill="rgba(255,255,255,0.55)" transform="rotate(-18 15 20)" />
            <path d="M14 33 q-2 12 2 22 M22 33 q1 13 -1 24 M30 33 q3 11 0 21" fill="none" stroke="rgba(232,132,178,0.75)" strokeWidth="1.6" strokeLinecap="round" className="imv-tent" />
          </svg>
        </div>
      </div>
      <div className="imv-jellydrift absolute left-[20%] top-[30%]" style={{ animationDuration: "21s", animationDelay: "-9s" }}>
        <div className="imv-jelly" style={{ animationDuration: "3.1s" }}>
          <svg width="34" height="56" viewBox="0 0 44 72">
            <path d="M4 26 A18 17 0 0 1 40 26 Q40 33 33 32 Q26 35 22 32 Q18 35 11 32 Q4 33 4 26 z" fill="rgba(196,160,255,0.7)" stroke="rgba(150,110,220,0.8)" strokeWidth="1" />
            <path d="M14 33 q-2 12 2 22 M22 33 q1 13 -1 24 M30 33 q3 11 0 21" fill="none" stroke="rgba(168,130,235,0.7)" strokeWidth="1.6" strokeLinecap="round" className="imv-tent" />
          </svg>
        </div>
      </div>

      {/* sandy floor with ripple lines */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%]">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #f2e4bc 0%, #e4d0a2 55%, #d5bd8e 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
        <svg className="absolute inset-x-0 bottom-0 w-full" height="26" viewBox="0 0 400 26" preserveAspectRatio="none">
          <path d="M0 8 Q25 2 50 8 T100 8 T150 8 T200 8 T250 8 T300 8 T350 8 T400 8" fill="none" stroke="rgba(180,150,100,0.4)" strokeWidth="1.4" />
          <path d="M0 16 Q25 10 50 16 T100 16 T150 16 T200 16 T250 16 T300 16 T350 16 T400 16" fill="none" stroke="rgba(180,150,100,0.3)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* the reef — a full composed community */}
      <div className="absolute bottom-[8%] left-0 right-0 h-[26%]">
        {/* rock ridge */}
        <svg className="absolute bottom-0 left-[2%]" width="46%" height="58" viewBox="0 0 300 58">
          <ellipse cx="60" cy="52" rx="58" ry="26" fill="#8d8478" />
          <ellipse cx="150" cy="56" rx="70" ry="30" fill="#a29a8c" />
          <ellipse cx="240" cy="54" rx="55" ry="24" fill="#968d7f" />
          <ellipse cx="40" cy="36" rx="22" ry="12" fill="#b3aa9b" opacity="0.8" />
          <ellipse cx="180" cy="34" rx="26" ry="13" fill="#bcb3a3" opacity="0.7" />
        </svg>
        {/* branching coral */}
        <svg className="absolute bottom-[6px] left-[9%]" width="44" height="40" viewBox="0 0 44 40">
          <g fill="none" stroke="#e8875f" strokeWidth="3" strokeLinecap="round">
            <path d="M22 40 C22 26 20 16 12 6" />
            <path d="M22 40 C22 22 24 12 22 3" />
            <path d="M22 40 C23 26 28 16 36 8" />
            <path d="M22 32 C17 26 12 24 6 22" />
            <path d="M22 34 C28 28 33 27 39 26" />
          </g>
          <g fill="none" stroke="#f4a479" strokeWidth="1.2" strokeLinecap="round">
            <path d="M22 40 C22 26 20 16 12 6" />
            <path d="M22 40 C22 22 24 12 22 3" />
            <path d="M22 40 C23 26 28 16 36 8" />
          </g>
        </svg>
        <svg className="absolute bottom-[2px] left-[47%]" width="30" height="28" viewBox="0 0 44 40" style={{ opacity: 0.9 }}>
          <g fill="none" stroke="#d97a9a" strokeWidth="3" strokeLinecap="round">
            <path d="M22 40 C22 26 20 16 12 6" />
            <path d="M22 40 C22 22 24 12 22 3" />
            <path d="M22 40 C23 26 28 16 36 8" />
          </g>
        </svg>
        {/* brain coral */}
        <svg className="absolute bottom-0 left-[28%]" width="52" height="30" viewBox="0 0 52 30">
          <path d="M4 30 Q2 12 14 6 Q26 0 38 6 Q50 12 48 30 z" fill="#e0b06a" stroke="#c2914a" strokeWidth="1" />
          <path d="M8 24 Q16 18 24 24 T40 22 M6 27 Q18 22 28 27 T46 26" fill="none" stroke="#c2914a" strokeWidth="1.1" />
        </svg>
        {/* tube sponges */}
        <svg className="absolute bottom-[4px] right-[18%]" width="40" height="38" viewBox="0 0 40 38">
          <rect x="4" y="12" width="9" height="26" rx="4.5" fill="#7a6fc0" stroke="#5f54a3" strokeWidth="0.8" />
          <rect x="17" y="4" width="10" height="34" rx="5" fill="#8d80d4" stroke="#5f54a3" strokeWidth="0.8" />
          <rect x="30" y="16" width="8" height="22" rx="4" fill="#7a6fc0" stroke="#5f54a3" strokeWidth="0.8" />
          <ellipse cx="8.5" cy="13" rx="3.4" ry="1.6" fill="#4d4383" />
          <ellipse cx="22" cy="5" rx="3.8" ry="1.8" fill="#4d4383" />
          <ellipse cx="34" cy="17" rx="3" ry="1.4" fill="#4d4383" />
        </svg>
        {/* anemone with waving tentacles */}
        <svg className="absolute bottom-[10px] right-[7%]" width="56" height="42" viewBox="0 0 56 42" style={{ overflow: "visible" }}>
          <ellipse cx="28" cy="37" rx="17" ry="6" fill="#d98a5f" stroke="#b56f45" strokeWidth="1" />
          {Array.from({ length: 11 }).map((_, i) => {
            const x = 9 + i * 3.8;
            return (
              <path
                key={i}
                className="imv-tent"
                d={`M${x} 34 Q${x + (i % 2 ? 3 : -3)} ${20 - (i % 3) * 2} ${x + (i % 2 ? 6 : -5)} ${10 - (i % 4) * 2}`}
                fill="none"
                stroke={i % 2 ? "#f2a9b8" : "#e88ba0"}
                strokeWidth="2.6"
                strokeLinecap="round"
                style={{ animationDelay: `${-i * 0.19}s`, animationDuration: `${1.9 + (i % 3) * 0.35}s` }}
              />
            );
          })}
        </svg>
        {/* clam with pearl */}
        <svg className="absolute bottom-[2px] right-[31%]" width="30" height="20" viewBox="0 0 30 20">
          <path d="M2 16 Q4 6 15 6 Q26 6 28 16 z" fill="#cfd8e8" stroke="#9fb0cc" strokeWidth="0.9" />
          <path d="M2 16 Q15 10 28 16 Q15 20 2 16 z" fill="#e8eef8" stroke="#9fb0cc" strokeWidth="0.9" />
          <circle cx="15" cy="12" r="2.6" fill="#fdfbf0" stroke="#d8d2b8" strokeWidth="0.6" />
        </svg>
        {/* starfish on the rock + a patrolling crab */}
        <svg className="absolute bottom-[30px] left-[24%]" width="22" height="21" viewBox="0 0 26 24">
          <path d="M13 3 L15.5 9 L22 9.6 L17 13.6 L18.6 20 L13 16.4 L7.4 20 L9 13.6 L4 9.6 L10.5 9 z" fill="#e8896a" stroke="#c96a4c" strokeWidth="0.8" />
        </svg>
        <div className="imv-crabwalk absolute bottom-[3px] right-[38%]">
          <CrabSvg />
        </div>
      </div>

      {/* kelp forest — two depth layers of tall swaying blades */}
      {[3, 8, 14, 22, 68, 76, 84, 92].map((x, i) => (
        <svg
          key={x}
          className="imv-weed absolute bottom-[9%]"
          width="22"
          height={64 + (i % 3) * 34}
          viewBox="0 0 22 100"
          style={{ left: `${x}%`, animationDelay: `${-i * 0.97}s`, animationDuration: `${3.4 + (i % 3) * 0.9}s`, opacity: 0.5 + (i % 2) * 0.25 }}
        >
          <path d="M11 100 C4 78 17 64 9 44 C3 30 15 20 11 2" fill="none" stroke={i % 2 ? "#2e8a57" : "#227548"} strokeWidth="5.5" strokeLinecap="round" />
          {i % 2 === 0 && <path d="M11 78 q-8 -3 -10 -10 M11 56 q8 -3 10 -10 M11 34 q-7 -3 -9 -9" fill="none" stroke="#2e8a57" strokeWidth="3" strokeLinecap="round" />}
        </svg>
      ))}

      {/* the school — seven little fish travelling together */}
      {[
        { x: 0, y: 0, s: 1, d: 0 },
        { x: 26, y: 9, s: 0.85, d: 0 },
        { x: 52, y: -7, s: 0.9, d: 0 },
        { x: 74, y: 5, s: 0.8, d: 0 },
        { x: 14, y: 17, s: 0.75, d: 0 },
        { x: 40, y: 15, s: 0.82, d: 0 },
        { x: 64, y: 12, s: 0.7, d: 0 },
      ].map((f, i) => (
        <div key={`sch${i}`} className="absolute w-full" style={{ top: `${20 + f.y}%` }}>
          <div className="imv-fish" style={{ animationDuration: "26s", animationDelay: `${-3 - i * 0.14}s`, ["--fish-flip" as string]: "-1" }}>
            <div className="imv-fishbob" style={{ animationDuration: `${2 + i * 0.13}s`, animationDelay: `${-i * 0.4}s` }}>
              <svg width={15 * f.s + 8} height={9 * f.s + 5} viewBox="0 0 30 16" style={{ transform: "scaleX(var(--fish-flip))", overflow: "visible", marginLeft: f.x, opacity: 0.85 }}>
                <path d="M6 8 L1 3.5 L2 8 L1 12.5 z" fill="#9fc3d8" />
                <path d="M6 8 Q13 1.5 21 6 Q26 8 21 11 Q13 14.5 6 8 z" fill="#b8d8e8" stroke="#8ab0c6" strokeWidth="0.8" />
                <circle cx="23" cy="7.4" r="1" fill="#2a3a44" />
              </svg>
            </div>
          </div>
        </div>
      ))}

      {/* residents */}
      <Clownfish y="26%" size={40} dur={21} delay={-4} fromLeft />
      <Tang y="47%" size={32} dur={27} delay={-15} />
      <BlueTang y="64%" size={38} dur={24} delay={-9} fromLeft />
      <Clownfish y="73%" size={27} dur={31} delay={-20} />
      <Angelfish y="36%" size={42} dur={34} delay={-12} />

      {/* rising bubbles + a column from a crack in the reef */}
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={`b${i}`}
          className="imv-bubble absolute rounded-full"
          style={{
            left: `${(i * 37 + 5) % 95}%`,
            width: 4 + (i % 4) * 3,
            height: 4 + (i % 4) * 3,
            animationDelay: `${-(i * 2.7) % 12}s`,
            animationDuration: `${7 + (i % 5) * 2.2}s`,
            background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.25) 55%, rgba(220,240,255,0.12))",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <span
          key={`bc${i}`}
          className="imv-bubble absolute rounded-full"
          style={{
            left: `${50 + i * 1.4}%`,
            bottom: "10%",
            width: 5 + i,
            height: 5 + i,
            animationDelay: `${-i * 1.1}s`,
            animationDuration: `${4.4 + i * 0.5}s`,
            background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.3) 60%, rgba(220,240,255,0.12))",
            border: "1px solid rgba(255,255,255,0.55)",
          }}
        />
      ))}

      <Vignette strength={0.14} />

      {/* ---- BUZZ: sonar rings + flash + startle + bubble eruption ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-flash" style={{ animationDuration: "0.7s" }} />
          <div className="imv-ring absolute left-1/2 top-1/2" />
          <div className="imv-ring absolute left-1/2 top-1/2" style={{ animationDelay: "0.22s" }} />
          <div className="imv-ring absolute left-1/2 top-1/2" style={{ animationDelay: "0.44s" }} />
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="imv-ebubble absolute rounded-full"
              style={{
                left: `${20 + (i * 13) % 55}%`,
                width: 5 + (i % 4) * 3.6,
                height: 5 + (i % 4) * 3.6,
                animationDelay: `${(i % 7) * 0.06}s`,
                background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.3) 60%, rgba(220,240,255,0.12))",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            />
          ))}
          {/* the whole reef startles — fish bolt for cover */}
          <svg className="imv-dash absolute left-[-8%] top-[30%]" width="46" height="24" viewBox="0 0 40 22" style={{ transform: "scaleX(-1)" }}>
            <path d="M4 11 Q14 3 28 8 Q36 11 28 15 Q14 20 4 11 z" fill="rgba(248,128,62,0.9)" />
            <path d="M4 11 L0 5 L0 17 z" fill="rgba(248,128,62,0.9)" />
            <circle cx="30" cy="10" r="1.4" fill="#222" />
          </svg>
          <svg className="imv-dash absolute right-[-8%] top-[56%]" width="40" height="22" viewBox="0 0 40 22" style={{ animationDelay: "0.12s" }}>
            <path d="M4 11 Q14 3 28 8 Q36 11 28 15 Q14 20 4 11 z" fill="rgba(63,111,212,0.9)" />
            <path d="M4 11 L0 5 L0 17 z" fill="rgba(63,111,212,0.9)" />
          </svg>
          <svg className="imv-dash absolute left-[-8%] top-[44%]" width="36" height="20" viewBox="0 0 40 22" style={{ transform: "scaleX(-1)", animationDelay: "0.26s" }}>
            <path d="M4 11 Q14 3 28 8 Q36 11 28 15 Q14 20 4 11 z" fill="rgba(247,201,72,0.9)" />
            <path d="M4 11 L0 5 L0 17 z" fill="rgba(247,201,72,0.9)" />
          </svg>
          {/* the crab bolts too */}
          <div className="imv-dash absolute bottom-[9%] right-[38%]" style={{ animationDuration: "1.3s" }}>
            <CrabSvg />
          </div>
        </div>
      )}
    </>
  );
}

function CrabSvg() {
  return (
    <svg width="30" height="18" viewBox="0 0 30 18">
      <path d="M6 6 L2 2 M8 5 L5 1 M24 6 L28 2 M22 5 L25 1" stroke="#c96a4c" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="2.6" cy="2.6" r="1.6" fill="#e8896a" />
      <circle cx="27.4" cy="2.6" r="1.6" fill="#e8896a" />
      <ellipse cx="15" cy="10" rx="8.5" ry="5.5" fill="#e8896a" stroke="#c96a4c" strokeWidth="1" />
      <path d="M8 13 L5 16 M11 14 L9 17 M19 14 L21 17 M22 13 L25 16" stroke="#c96a4c" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12.5" cy="8.6" r="1" fill="#3a2418" />
      <circle cx="17.5" cy="8.6" r="1" fill="#3a2418" />
    </svg>
  );
}

/* ---------- fish species ---------- */
function FishFrame({ children, y, size, dur, delay, fromLeft }: { children: React.ReactNode; y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <div className="absolute w-full" style={{ top: y }}>
      <div className="imv-fish" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, ["--fish-flip" as string]: fromLeft ? "1" : "-1" }}>
        <div className="imv-fishbob" style={{ animationDuration: `${2.4 + size / 38}s` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Clownfish({ y, size, dur, delay, fromLeft }: { y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <FishFrame y={y} size={size} dur={dur} delay={delay} fromLeft={fromLeft}>
      <svg width={size} height={size * 0.62} viewBox="0 0 44 27" style={{ transform: "scaleX(var(--fish-flip))", overflow: "visible" }}>
        <g className="imv-tail" style={{ transformBox: "view-box", transformOrigin: "8px 13.5px" }}>
          <path d="M8 13.5 L1 6.5 L2.6 13.5 L1 20.5 z" fill="#f5803e" stroke="#c85a1e" strokeWidth="0.9" />
        </g>
        <path d="M7 13.5 Q16 3.5 28 9 Q36 13.5 28 18 Q16 23.5 7 13.5 z" fill="#f5803e" stroke="#c85a1e" strokeWidth="1" />
        <path d="M15.5 6.2 Q19 12 15.5 21 Q13 20 12 18.5 Q14.4 13 12.6 8.4 Q13.8 7 15.5 6.2 z" fill="#fff" stroke="#c85a1e" strokeWidth="0.7" />
        <path d="M27 8.6 Q29.6 13.5 27 18.4 Q25 18 24 17 Q25.6 13.5 24 10 Q25.2 9.1 27 8.6 z" fill="#fff" stroke="#c85a1e" strokeWidth="0.7" />
        <path d="M17 5.4 Q21 2.6 25 6 L22 8.4 Q19.4 6.4 17 5.4 z" fill="#f5803e" stroke="#c85a1e" strokeWidth="0.8" />
        <circle cx="32.6" cy="12" r="1.7" fill="#222" />
        <circle cx="33.1" cy="11.5" r="0.55" fill="#fff" />
      </svg>
    </FishFrame>
  );
}

function Tang({ y, size, dur, delay, fromLeft }: { y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <FishFrame y={y} size={size} dur={dur} delay={delay} fromLeft={fromLeft}>
      <svg width={size} height={size * 0.78} viewBox="0 0 38 30" style={{ transform: "scaleX(var(--fish-flip))", overflow: "visible" }}>
        <g className="imv-tail" style={{ transformBox: "view-box", transformOrigin: "7px 15px" }}>
          <path d="M7 15 L0.8 8.5 L2.2 15 L0.8 21.5 z" fill="#f7c948" stroke="#c9992a" strokeWidth="0.9" />
        </g>
        <path d="M7 15 Q15 4.5 26 9.5 Q33 15 26 20.5 Q15 25.5 7 15 z" fill="#f7c948" stroke="#c9992a" strokeWidth="1" />
        <path d="M16 7.5 Q20 4.4 24.5 8.2 L21 10.8 Q18.4 8.6 16 7.5 z" fill="#f7c948" stroke="#c9992a" strokeWidth="0.8" />
        <path d="M17 22.5 Q20 25 23.5 22" fill="none" stroke="#c9992a" strokeWidth="1" />
        <circle cx="29" cy="13.4" r="1.5" fill="#222" />
        <circle cx="29.5" cy="13" r="0.5" fill="#fff" />
        <path d="M31.4 15.6 q1.8 0.6 1.2 1.8" fill="none" stroke="#c9992a" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </FishFrame>
  );
}

function BlueTang({ y, size, dur, delay, fromLeft }: { y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <FishFrame y={y} size={size} dur={dur} delay={delay} fromLeft={fromLeft}>
      <svg width={size} height={size * 0.72} viewBox="0 0 42 30" style={{ transform: "scaleX(var(--fish-flip))", overflow: "visible" }}>
        <g className="imv-tail" style={{ transformBox: "view-box", transformOrigin: "8px 15px" }}>
          <path d="M8 15 L1 9.5 L2.4 15 L1 20.5 z" fill="#f2c53d" stroke="#c9992a" strokeWidth="0.9" />
        </g>
        <path d="M8 15 Q16 4.5 27 9 Q35 15 27 21 Q16 25.5 8 15 z" fill="#3f6fd4" stroke="#2b4fa0" strokeWidth="1" />
        <path d="M10 15 Q20 12.5 30 14.5 Q30 17 27 19.4 Q18 20.5 10 15 z" fill="#111d3a" opacity="0.85" />
        <path d="M15 6.8 Q19 4 23.5 7 L20.5 10 Q17.6 8 15 6.8 z" fill="#111d3a" opacity="0.8" />
        <circle cx="30.6" cy="13" r="1.5" fill="#0a0a14" />
        <circle cx="31.1" cy="12.6" r="0.5" fill="#fff" />
      </svg>
    </FishFrame>
  );
}

function Angelfish({ y, size, dur, delay, fromLeft }: { y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <FishFrame y={y} size={size} dur={dur} delay={delay} fromLeft={fromLeft}>
      <svg width={size} height={size * 0.95} viewBox="0 0 36 34" style={{ transform: "scaleX(var(--fish-flip))", overflow: "visible" }}>
        <g className="imv-tail" style={{ transformBox: "view-box", transformOrigin: "8px 17px" }}>
          <path d="M8 17 L1 10 L2.6 17 L1 24 z" fill="#e8b84a" stroke="#b8871e" strokeWidth="0.9" />
        </g>
        <path d="M8 17 Q14 3 24 8 Q32 13 30 20 Q27 29 16 27 Q9 24 8 17 z" fill="#f2d06b" stroke="#b8871e" strokeWidth="1" />
        <path d="M15 6.6 Q13 14 15.4 26.4 M21 7.4 Q19.6 15 21.8 25.4 M26 10.4 Q25.4 16 26.4 22.6" fill="none" stroke="#3a3a3a" strokeWidth="2" opacity="0.75" strokeLinecap="round" />
        <path d="M14 4.8 Q19 1.6 23 6 L20 9 Q17 6.4 14 4.8 z" fill="#e8b84a" stroke="#b8871e" strokeWidth="0.7" />
        <path d="M15 27.4 Q18 31.6 22 28.6" fill="none" stroke="#b8871e" strokeWidth="1.2" />
        <circle cx="28.6" cy="14.6" r="1.5" fill="#26170a" />
        <circle cx="29.1" cy="14.2" r="0.5" fill="#fff" />
      </svg>
    </FishFrame>
  );
}

/* ==================================================================
   BEACH — a tropical noon: deep summer sky, corona sun with rotating
   rays and a lens flare, drifting cumulus clouds, a sailboat on the
   horizon over a glittering sun path, rolling foam scallops with
   whitecaps, dune grass, footprints, shells and a sideways-walking
   crab, a tall coconut palm casting a shadow, umbrella + towel +
   beach ball, and gulls.
   BUZZ: a towering wave surges up the pane and crashes with spray,
   while a second foam shockwave races across the sand.
   ================================================================== */
function Beach({ buzz }: { buzz: number }) {
  return (
    <>
      <ReadingGlow opacity={0.34} />

      {/* sun with corona, slow rays and a lens flare */}
      <div className="absolute right-[8%] top-[5%]">
        <div className="imv-sunrays absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="190" height="190" viewBox="0 0 100 100">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1="50" y1="50" x2={50 + 48 * Math.cos((i * Math.PI) / 6)} y2={50 + 48 * Math.sin((i * Math.PI) / 6)} stroke="rgba(255,224,130,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </svg>
        </div>
        <div className="w-[54px] h-[54px] rounded-full" style={{ background: "radial-gradient(circle at 38% 34%, #fffbe8, #ffe592 52%, #ffc93d)", boxShadow: "0 0 34px 16px rgba(255,218,110,0.6), 0 0 80px 40px rgba(255,226,150,0.25)" }} />
        <div className="absolute top-[26px] left-[-52px] w-[120px] h-[2px] rotate-[-24deg]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)" }} />
        <span className="absolute top-[44px] left-[-38px] w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.65)", filter: "blur(1px)" }} />
        <span className="absolute top-[8px] left-[-20px] w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.5)", filter: "blur(1px)" }} />
      </div>

      {/* drifting clouds — one big cumulus with a shaded belly */}
      <div className="imv-cloud absolute top-[8%]" style={{ animationDuration: "50s" }}>
        <BigCloudSvg />
      </div>
      <div className="imv-cloud absolute top-[20%]" style={{ animationDuration: "70s", animationDelay: "-34s" }}>
        <CloudSvg scale={0.8} />
      </div>
      <div className="imv-cloud absolute top-[30%]" style={{ animationDuration: "88s", animationDelay: "-60s", opacity: 0.7 }}>
        <CloudSvg scale={0.55} />
      </div>

      {/* gulls */}
      <div className="imv-gull absolute top-[15%] left-0 w-full">
        <svg width="26" height="10" viewBox="0 0 26 10" className="imv-gullbob">
          <path d="M2 6 Q7 1 13 5 Q19 1 24 6" fill="none" stroke="#4a5b6d" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="imv-gull absolute top-[24%] left-0 w-full" style={{ animationDuration: "33s", animationDelay: "-19s" }}>
        <svg width="18" height="8" viewBox="0 0 26 10" className="imv-gullbob" style={{ animationDuration: "2.1s" }}>
          <path d="M2 6 Q7 1 13 5 Q19 1 24 6" fill="none" stroke="#5a6b7d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="imv-gull absolute top-[10%] left-0 w-full" style={{ animationDuration: "42s", animationDelay: "-8s" }}>
        <svg width="14" height="7" viewBox="0 0 26 10" className="imv-gullbob" style={{ animationDuration: "2.9s" }}>
          <path d="M2 6 Q7 1 13 5 Q19 1 24 6" fill="none" stroke="#6a7b8d" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      </div>

      {/* sailboat drifting along the horizon */}
      <div className="imv-cloud absolute top-[33.5%]" style={{ animationDuration: "120s", animationDelay: "-20s" }}>
        <svg width="44" height="30" viewBox="0 0 44 30" className="imv-boat">
          <path d="M20 2 L20 20 L6 20 z" fill="#fdfdf8" stroke="#c9c4b4" strokeWidth="0.7" />
          <path d="M22 5 L22 20 L34 20 z" fill="#f2ede0" stroke="#c9c4b4" strokeWidth="0.7" />
          <path d="M4 21 L38 21 L33 27 L9 27 z" fill="#b0563a" stroke="#8a3f2a" strokeWidth="0.8" />
        </svg>
      </div>

      {/* ocean — glitter path, foam rows, whitecaps */}
      <div className="absolute left-0 right-0" style={{ top: "38%", height: "24%" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #63b4e4 0%, #4a9ed6 40%, #3a8cc6 100%)" }} />
        {/* horizon lightening */}
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ background: "linear-gradient(180deg, rgba(255,244,214,0.85), transparent)" }} />
        {/* the sun's glitter road */}
        <div className="imv-glitter absolute top-[2px] right-[13%] w-[36px] h-[92%]" />
        {[
          { top: "10%", o: 0.45, w: 190, d: 12 },
          { top: "38%", o: 0.65, w: 155, d: 9.5 },
          { top: "66%", o: 0.88, w: 122, d: 7.5 },
        ].map((r, i) => (
          <div key={i} className="imv-surfrise absolute left-[-50%] w-[200%]" style={{ top: r.top, opacity: r.o, animationDuration: `${r.d}s`, animationDelay: `${-i * 2.6}s` }}>
            <FoamRow width={r.w} />
          </div>
        ))}
        {/* whitecaps twinkling */}
        {[12, 30, 47, 66, 81].map((x, i) => (
          <span key={`wc${i}`} className="imv-star absolute rounded-full bg-white" style={{ left: `${x}%`, top: `${28 + (i % 3) * 22}%`, width: 3, height: 2, animationDelay: `${-i * 1.2}s`, animationDuration: `${2.6 + (i % 3)}s`, opacity: 0.7 }} />
        ))}
      </div>

      {/* sand — with dune grass, footprints, shells, crab */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "38%", background: "linear-gradient(180deg, #f9e7c2 0%, #efd8aa 40%, #e2c88e 100%)" }}>
        <div className="absolute top-0 left-0 right-0 h-[16px]" style={{ background: "linear-gradient(180deg, rgba(120,170,200,0.5), transparent)" }} />
        {/* dune grass tufts */}
        {[5, 12, 62, 70, 88].map((x, i) => (
          <svg key={`g${i}`} className="imv-weed absolute bottom-[4%]" width="26" height={22 + (i % 2) * 10} viewBox="0 0 26 34" style={{ left: `${x}%`, animationDuration: `${3.4 + (i % 2)}s`, opacity: 0.75 }}>
            <path d="M13 34 Q9 22 4 14 M13 34 Q13 18 11 8 M13 34 Q17 20 22 12 M13 34 Q19 26 24 22" fill="none" stroke="#9aa858" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ))}
        {/* footprints wandering to the water */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={`fp${i}`}>
              <ellipse cx={34 + i * 6} cy={88 - i * 9} rx="1.6" ry="1" fill="rgba(150,110,60,0.28)" transform={`rotate(${i * 8 - 8} ${34 + i * 6} ${88 - i * 9})`} />
              <ellipse cx={37 + i * 6} cy={90 - i * 9} rx="1.6" ry="1" fill="rgba(150,110,60,0.24)" transform={`rotate(${i * 8 - 4} ${37 + i * 6} ${90 - i * 9})`} />
            </g>
          ))}
        </svg>
        {/* speckles */}
        {(() => {
          const rnd = seeded(7);
          return Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="absolute rounded-full" style={{ left: `${rnd() * 96}%`, top: `${16 + rnd() * 74}%`, width: 2.2, height: 2.2, background: "rgba(160,120,60,0.35)" }} />
          ));
        })()}
        {/* starfish + shells */}
        <svg className="absolute bottom-[10%] right-[15%]" width="24" height="22" viewBox="0 0 26 24">
          <path d="M13 3 L15.5 9 L22 9.6 L17 13.6 L18.6 20 L13 16.4 L7.4 20 L9 13.6 L4 9.6 L10.5 9 z" fill="#eb9a72" stroke="#c9774e" strokeWidth="0.8" />
          <circle cx="13" cy="11.5" r="1" fill="#c9774e" opacity="0.6" />
        </svg>
        <svg className="absolute bottom-[18%] left-[20%]" width="20" height="17" viewBox="0 0 20 17">
          <path d="M10 16 L2 6 Q10 -3 18 6 z" fill="#f3d9c2" stroke="#cfa984" strokeWidth="0.8" />
          <path d="M10 16 L6 4 M10 16 L10 2.6 M10 16 L14 4" stroke="#cfa984" strokeWidth="0.7" />
        </svg>
        <svg className="absolute bottom-[30%] right-[30%]" width="16" height="13" viewBox="0 0 20 17" style={{ opacity: 0.9 }}>
          <path d="M10 16 L2 6 Q10 -3 18 6 z" fill="#e8c9a8" stroke="#c9a074" strokeWidth="0.8" />
        </svg>
        {/* the crab patrols the dry sand */}
        <div className="imv-crabwalk absolute bottom-[6%] left-[46%]" style={{ animationDuration: "11s" }}>
          <CrabSvg />
        </div>
      </div>

      {/* coconut palm with shadow */}
      <div className="absolute bottom-[35%] right-[1%]">
        <div className="absolute bottom-[-14px] left-[-30px] w-[110px] h-[16px] rounded-full" style={{ background: "rgba(140,100,40,0.28)", filter: "blur(2px)", transform: "rotate(-8deg)" }} />
        <svg width="96" height="132" viewBox="0 0 110 150" style={{ overflow: "visible" }}>
          <path d="M62 148 C58 110 52 84 44 62" fill="none" stroke="#8a6238" strokeWidth="10" strokeLinecap="round" />
          <path d="M62 148 C58 110 52 84 44 62" fill="none" stroke="#a67a48" strokeWidth="5" strokeLinecap="round" />
          <path d="M55 120 l7 -3 M52 104 l7 -3 M49 88 l6.4 -2.6" stroke="#7a5230" strokeWidth="1.6" strokeLinecap="round" />
          <g className="imv-fronds" style={{ transformBox: "view-box", transformOrigin: "44px 60px" }}>
            {[
              "M44 60 Q18 42 4 52",
              "M44 60 Q24 28 8 26",
              "M44 60 Q40 20 26 10",
              "M44 60 Q58 22 74 14",
              "M44 60 Q68 34 92 32",
              "M44 60 Q72 48 96 58",
              "M44 60 Q62 14 80 6",
            ].map((d, i) => (
              <g key={i} className="imv-frond" style={{ transformBox: "view-box", transformOrigin: "44px 60px", animationDelay: `${-i * 0.35}s` }}>
                <path d={d} fill="none" stroke="#37854a" strokeWidth="5.4" strokeLinecap="round" />
                <path d={d} fill="none" stroke="#54a862" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            ))}
            <circle cx="40" cy="63" r="4.4" fill="#6a4a24" />
            <circle cx="50" cy="65" r="4.4" fill="#7a5a2e" />
            <circle cx="45" cy="68" r="3.8" fill="#5f4020" />
          </g>
        </svg>
      </div>

      {/* umbrella, towel, beach ball */}
      <div className="absolute bottom-[7%] left-[6%]">
        <svg width="60" height="80" viewBox="0 0 74 96">
          <ellipse cx="38" cy="92" rx="26" ry="4" fill="rgba(120,90,40,0.25)" />
          <line x1="36" y1="26" x2="36" y2="90" stroke="#b08a4a" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M4 30 A32 26 0 0 1 68 30 Q56 36 46 30 Q41 35 36 30 Q31 35 26 30 Q16 36 4 30 z" fill="#e05a5a" stroke="#b03c3c" strokeWidth="1" />
          <path d="M20 12.5 A32 26 0 0 1 36 4 L36 30 Q31 35 26 30 Q20 26 20 12.5 z" fill="#fff" opacity="0.92" />
          <path d="M52 12.5 A32 26 0 0 0 36 4 L36 30 Q41 35 46 30 Q52 26 52 12.5 z" fill="#fff" opacity="0.92" />
          <circle cx="36" cy="4" r="2.4" fill="#b03c3c" />
        </svg>
      </div>
      <div className="absolute bottom-[9%] left-[19%]">
        <svg width="64" height="30" viewBox="0 0 64 30">
          <rect x="2" y="2" width="60" height="26" rx="4" fill="#f7f2e2" stroke="#d8cba8" strokeWidth="1" transform="rotate(-2 32 15)" />
          <g transform="rotate(-2 32 15)">
            <rect x="8" y="2" width="7" height="26" fill="#5aa8d8" />
            <rect x="29" y="2" width="7" height="26" fill="#e8b84a" />
            <rect x="50" y="2" width="7" height="26" fill="#e07a6a" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-[4.5%] left-[33%]">
        <svg width="34" height="34" viewBox="0 0 40 40" className="imv-ball">
          <circle cx="20" cy="20" r="17" fill="#fff" stroke="#c9c2b4" strokeWidth="1" />
          <path d="M20 3 A17 17 0 0 1 34.7 11.5 L20 20 z" fill="#e05a5a" />
          <path d="M34.7 11.5 A17 17 0 0 1 34.7 28.5 L20 20 z" fill="#f2c53d" />
          <path d="M34.7 28.5 A17 17 0 0 1 20 37 L20 20 z" fill="#3f8ad4" />
          <path d="M20 37 A17 17 0 0 1 5.3 28.5 L20 20 z" fill="#e05a5a" />
          <path d="M5.3 28.5 A17 17 0 0 1 5.3 11.5 L20 20 z" fill="#f2c53d" />
          <path d="M5.3 11.5 A17 17 0 0 1 20 3 L20 20 z" fill="#3f8ad4" />
          <circle cx="20" cy="20" r="3.4" fill="#fff" stroke="#c9c2b4" strokeWidth="0.8" />
        </svg>
      </div>

      <Vignette strength={0.1} />

      {/* ---- BUZZ: the towering wave ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-bigwave absolute left-[-10%] right-[-10%] bottom-0" />
          {/* a racing foam shockwave across the sand */}
          <div className="imv-surfrise absolute left-[-50%] bottom-[6%] w-[200%] opacity-90" style={{ animationDuration: "1.4s" }}>
            <FoamRow width={90} />
          </div>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="imv-spray absolute rounded-full"
              style={{
                left: `${16 + (i * 29) % 66}%`,
                width: 4 + (i % 3) * 2.6,
                height: 4 + (i % 3) * 2.6,
                animationDelay: `${0.22 + (i % 6) * 0.08}s`,
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(210,235,250,0.5))",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

function CloudSvg({ scale = 1 }: { scale?: number }) {
  return (
    <svg width={90 * scale} height={34 * scale} viewBox="0 0 90 34">
      <g fill="rgba(255,255,255,0.92)">
        <circle cx="26" cy="22" r="12" />
        <circle cx="44" cy="16" r="15" />
        <circle cx="62" cy="22" r="11" />
        <rect x="22" y="22" width="44" height="11" rx="5.5" />
      </g>
    </svg>
  );
}

function BigCloudSvg() {
  return (
    <svg width="150" height="58" viewBox="0 0 150 58">
      <g fill="rgba(255,255,255,0.95)">
        <circle cx="42" cy="38" r="20" />
        <circle cx="74" cy="28" r="26" />
        <circle cx="108" cy="38" r="19" />
        <rect x="36" y="36" width="80" height="20" rx="10" />
      </g>
      <g fill="rgba(205,222,240,0.85)">
        <ellipse cx="60" cy="50" rx="16" ry="6" />
        <ellipse cx="98" cy="51" rx="14" ry="5" />
      </g>
    </svg>
  );
}

function FoamRow({ width = 140 }: { width?: number }) {
  const n = 14;
  const w = 2000;
  const step = w / n;
  return (
    <svg width="100%" height={width * 0.28} viewBox={`0 0 ${w} ${width * 0.28}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <path
        d={Array.from({ length: n })
          .map((_, i) => `M${i * step} ${width * 0.28} Q${i * step + step * 0.5} 0 ${(i + 1) * step} ${width * 0.28}`)
          .join(" ")}
        fill="rgba(255,255,255,0.85)"
      />
    </svg>
  );
}

/* ==================================================================
   DOODLE — a crayon playground on real-feeling paper: washi-taped
   corners, a coffee ring, ruled margin; the crayon world has a sun
   with sunglasses, a rainbow, puffy clouds with animated smoke from
   the house chimney, an apple tree, a dog, grass, a circling bee —
   and a REAL drawable canvas with pencil / eraser / clear tools.
   BUZZ: the page boings, a crayon "!!" slams in, and four paint
   splats splatter around it.
   ================================================================== */
type DoodleTool = "pencil" | "eraser";

function Doodle({ buzz }: { buzz: number }) {
  return (
    <>
      <ReadingGlow opacity={0.28} />
      {/* paper dressing — washi tape + coffee ring */}
      <div className="absolute top-[6px] left-[10px] w-[74px] h-[20px] rotate-[-5deg]" style={{ background: "rgba(250,214,120,0.5)", borderLeft: "2px dashed rgba(255,255,255,0.8)", borderRight: "2px dashed rgba(255,255,255,0.8)" }} />
      <div className="absolute bottom-[10px] right-[14px] w-[64px] h-[18px] rotate-[4deg]" style={{ background: "rgba(170,220,250,0.45)", borderLeft: "2px dashed rgba(255,255,255,0.8)", borderRight: "2px dashed rgba(255,255,255,0.8)" }} />
      <svg className="absolute right-[16%] bottom-[14%] opacity-[0.13]" width="66" height="66" viewBox="0 0 66 66">
        <circle cx="33" cy="33" r="28" fill="none" stroke="#6a4a20" strokeWidth="5" />
        <circle cx="33" cy="33" r="21" fill="none" stroke="#6a4a20" strokeWidth="1.6" />
      </svg>

      <DoodleArt />
      <Bee />
      <DoodleCanvas />

      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 imv-boing">
            <svg width="120" height="86" viewBox="0 0 120 86">
              <path d="M28 44 q-6 -22 8 -30 M64 40 q-2 -24 14 -30 M46 58 q-10 -26 4 -34" fill="none" stroke="#e2574c" strokeWidth="7" strokeLinecap="round" />
              <circle cx="88" cy="56" r="5" fill="#4a90d9" />
              <circle cx="99" cy="62" r="3.4" fill="#f2c53d" />
            </svg>
          </div>
          {/* paint splats */}
          {[
            { x: "16%", y: "20%", c: "#e2574c", s: 1, d: "0.1s" },
            { x: "74%", y: "26%", c: "#4a90d9", s: 0.8, d: "0.22s" },
            { x: "24%", y: "72%", c: "#58a55c", s: 0.9, d: "0.34s" },
            { x: "78%", y: "68%", c: "#f2c53d", s: 1.1, d: "0.46s" },
          ].map((s, i) => (
            <div key={i} className="imv-splat absolute" style={{ left: s.x, top: s.y, animationDelay: s.d }}>
              <svg width={54 * s.s} height={48 * s.s} viewBox="0 0 54 48">
                <path d="M27 8 q4 -6 7 0 q6 -4 6 3 q7 1 2 6 q5 4 -2 6 q2 6 -5 4 q-2 6 -8 2 q-6 4 -8 -2 q-7 2 -5 -4 q-7 -2 -2 -6 q-5 -5 2 -6 q0 -7 6 -3 q3 -6 7 0 z" fill={s.c} opacity="0.85" />
                <circle cx="44" cy="8" r="2.4" fill={s.c} opacity="0.7" />
                <circle cx="8" cy="34" r="1.8" fill={s.c} opacity="0.7" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* the crayon world — every stroke deliberately wobbly */
function DoodleArt() {
  return (
    <svg className="absolute inset-0 w-full h-full imv-doodleart" viewBox="0 0 400 300" preserveAspectRatio="none">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* sun with sunglasses */}
        <g transform="translate(52 46) rotate(-3)">
          <circle r="21" fill="rgba(247,208,56,0.5)" stroke="#f0a13a" strokeWidth="4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={27 * Math.cos((a * Math.PI) / 180)} y1={27 * Math.sin((a * Math.PI) / 180)} x2={35 * Math.cos((a * Math.PI) / 180)} y2={35 * Math.sin((a * Math.PI) / 180)} stroke="#f0a13a" strokeWidth="3.6" />
          ))}
          <g transform="translate(-9 -5)">
            <rect x="0" y="0" width="8.5" height="6" rx="1.4" fill="#3a3a3a" />
            <rect x="10.5" y="0" width="8.5" height="6" rx="1.4" fill="#3a3a3a" />
            <path d="M8.5 2.4 h2" stroke="#3a3a3a" strokeWidth="1.4" />
          </g>
          <path d="M-7 6 q7 7 14 0" stroke="#c2571e" strokeWidth="2.6" />
        </g>
        {/* rainbow */}
        <g transform="translate(150 96)" strokeWidth="3.4">
          <path d="M-34 24 A34 34 0 0 1 34 24" stroke="#e2574c" />
          <path d="M-28 24 A28 28 0 0 1 28 24" stroke="#f0a13a" />
          <path d="M-22 24 A22 22 0 0 1 22 24" stroke="#f2d13a" />
          <path d="M-16 24 A16 16 0 0 1 16 24" stroke="#58a55c" />
          <path d="M-10 24 A10 10 0 0 1 10 24" stroke="#4a90d9" />
        </g>
        {/* cloud */}
        <g transform="translate(268 38) rotate(2)" stroke="#4a90d9" strokeWidth="3.6">
          <path d="M0 12 Q2 -2 16 0 Q22 -10 34 -4 Q48 -12 52 2 Q64 4 58 14 Q46 20 30 16 Q12 22 0 12 z" />
        </g>
        {/* house with chimney + animated smoke */}
        <g transform="translate(46 178) rotate(-1)" stroke="#58a55c" strokeWidth="3.4">
          <rect x="0" y="18" width="58" height="46" />
          <path d="M-6 18 L29 -8 L64 18" />
          <rect x="10" y="30" width="14" height="12" stroke="#e2574c" />
          <rect x="36" y="36" width="14" height="28" stroke="#8a5fc0" />
          <path d="M64 64 L64 44 L74 40" stroke="#8a6238" />
          <rect x="46" y="2" width="9" height="14" stroke="#c2571e" strokeWidth="3" />
        </g>
        {/* apple tree */}
        <g transform="translate(318 128)">
          <path d="M0 66 Q-3 34 2 16" stroke="#8a6238" strokeWidth="6" />
          <path d="M2 22 Q-14 18 -18 6 M2 16 Q16 12 20 2 M2 18 Q-2 2 6 -6" stroke="#8a6238" strokeWidth="3.4" />
          <circle cx="0" cy="-8" r="26" fill="rgba(88,165,92,0.4)" stroke="#58a55c" strokeWidth="3.4" />
          <circle cx="-13" cy="-14" r="2.8" fill="#e2574c" />
          <circle cx="12" cy="-12" r="2.8" fill="#e2574c" />
          <circle cx="2" cy="0" r="2.8" fill="#e2574c" />
        </g>
        {/* flower */}
        <g transform="translate(292 232) rotate(3)" stroke="#e2574c" strokeWidth="3.4">
          <path d="M0 44 Q-4 24 2 4" stroke="#58a55c" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx={11 * Math.cos((a * Math.PI) / 180)} cy={11 * Math.sin((a * Math.PI) / 180)} rx="7.4" ry="5" transform={`rotate(${a} ${11 * Math.cos((a * Math.PI) / 180)} ${11 * Math.sin((a * Math.PI) / 180)})`} fill="rgba(226,87,76,0.35)" />
          ))}
          <circle r="6" fill="rgba(247,208,56,0.75)" stroke="#c9992a" />
        </g>
        {/* the dog */}
        <g transform="translate(150 240) rotate(-2)" stroke="#8a6238" strokeWidth="3">
          <ellipse cx="14" cy="14" rx="14" ry="9" fill="rgba(190,140,80,0.25)" />
          <circle cx="31" cy="7" r="6.5" />
          <path d="M36 3 q5 -3 4 3" />
          <path d="M28 1 l-2 -4" />
          <path d="M4 20 v8 M12 21 v7 M20 21 v7 M26 19 v9" />
          <path d="M0 12 q-6 -2 -4 -8" />
        </g>
        {/* grass tufts */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${18 + i * 34} 296 q${(i % 2) * 8 - 4} -14 ${(i % 2) * 10 - 3} -18`} stroke="#58a55c" strokeWidth="2.6" opacity="0.8" />
        ))}
        {/* smoke puffs — live in svg but animated via CSS class */}
        <g fill="rgba(160,160,160,0.55)">
          <circle className="imv-smoke" cx="99" cy="172" r="3.4" />
          <circle className="imv-smoke" cx="99" cy="172" r="4.4" style={{ animationDelay: "1.1s" }} />
          <circle className="imv-smoke" cx="99" cy="172" r="3" style={{ animationDelay: "2.2s" }} />
        </g>
      </g>
    </svg>
  );
}

/* the circling bee */
function Bee() {
  return (
    <div className="imv-bee absolute left-[30%] top-[24%]">
      <div className="imv-beebob">
        <svg width="18" height="15" viewBox="0 0 18 15">
          <ellipse cx="6" cy="7" rx="4.4" ry="3" fill="rgba(190,220,250,0.85)" className="imv-wing" />
          <ellipse cx="9" cy="9" rx="6" ry="4.4" fill="#f2c53d" stroke="#8a6a10" strokeWidth="0.8" />
          <path d="M6.4 5.4 L5.4 12.6 M9.4 5 L8.4 13 M12.4 5.6 L11.4 12.4" stroke="#3a2a08" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="14.4" cy="8.4" r="2.6" fill="#3a2a08" />
        </svg>
      </div>
    </div>
  );
}

/* the drawable canvas — strokes persist while the scene stays mounted */
function DoodleCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DoodleTool | null>(null);
  const strokesRef = useRef<{ pts: [number, number][]; tool: DoodleTool }[]>([]);
  const currentRef = useRef<{ pts: [number, number][]; tool: DoodleTool } | null>(null);

  const redraw = () => {
    const cv = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr;
      cv.height = h * dpr;
    }
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const all = currentRef.current ? [...strokesRef.current, currentRef.current] : strokesRef.current;
    for (const s of all) {
      if (s.pts.length < 2) continue;
      ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = "#3b3a36";
      ctx.lineWidth = s.tool === "eraser" ? 16 : 3.4;
      ctx.beginPath();
      ctx.moveTo(s.pts[0][0] * w, s.pts[0][1] * h);
      for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i][0] * w, s.pts[i][1] * h);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  useEffect(() => {
    redraw();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => redraw());
    ro.observe(wrap);
    return () => ro.disconnect();

  }, []);

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full imv-doodle-canvas"
        style={{ pointerEvents: tool ? "auto" : "none", cursor: tool ? "crosshair" : "default", touchAction: "none", zIndex: 30 }}
        onPointerDown={(e) => {
          if (!tool) return;
          try {
            (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
          } catch {
            /* synthetic pointer (automation) has no active pointer — safe to ignore */
          }
          currentRef.current = { pts: [pos(e)], tool };
          redraw();
        }}
        onPointerMove={(e) => {
          if (!tool || !currentRef.current) return;
          currentRef.current.pts.push(pos(e));
          redraw();
        }}
        onPointerUp={() => {
          if (currentRef.current && currentRef.current.pts.length > 1) strokesRef.current.push(currentRef.current);
          currentRef.current = null;
          redraw();
        }}
      />
      {/* tool pill */}
      <div className="absolute right-1.5 top-1.5 z-40 flex items-center gap-[3px] bg-[#fffdf4] border border-[#c9bd8a] rounded-[4px] shadow-[1px_2px_5px_rgba(60,40,10,0.25)] px-[3px] py-[2px]" style={{ pointerEvents: "auto" }}>
        <button
          title="Pencil"
          className={`w-[22px] h-[20px] rounded-[3px] flex items-center justify-center ${tool === "pencil" ? "bg-[#ffe9a8] border border-[#c9932a]" : "hover:bg-[#f6efd2]"}`}
          onClick={() => setTool((t) => (t === "pencil" ? null : "pencil"))}
        >
          <svg width="12" height="12" viewBox="0 0 14 14">
            <path d="M3 11 L3.8 8.6 L10.4 2 L12 3.6 L5.4 10.2 z" fill="#f0b23a" stroke="#a86a10" strokeWidth="0.8" />
          </svg>
        </button>
        <button
          title="Eraser"
          className={`w-[22px] h-[20px] rounded-[3px] flex items-center justify-center ${tool === "eraser" ? "bg-[#ffe9a8] border border-[#c9932a]" : "hover:bg-[#f6efd2]"}`}
          onClick={() => setTool((t) => (t === "eraser" ? null : "eraser"))}
        >
          <svg width="13" height="12" viewBox="0 0 14 13">
            <path d="M2 8.5 L7.5 3 L12 7.5 L8.5 11 L4 11 z" fill="#f3d9c2" stroke="#a88a62" strokeWidth="0.9" />
            <path d="M5 12.2 L12.6 12.2" stroke="#a88a62" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          title="Clear the doodle"
          className="w-[22px] h-[20px] rounded-[3px] flex items-center justify-center hover:bg-[#f6efd2]"
          onClick={() => {
            strokesRef.current = [];
            currentRef.current = null;
            redraw();
          }}
        >
          <svg width="11" height="12" viewBox="0 0 12 13">
            <path d="M2.5 3.5 h7 l-0.7 8 h-5.6 z" fill="none" stroke="#8a7a5a" strokeWidth="1" />
            <path d="M1 3.5 h10 M4.2 3.3 V2.2 h3.6 v1.1 M4.9 5.5 v4 M7.1 5.5 v4" stroke="#8a7a5a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ==================================================================
   FIREWORKS — festival night: deep indigo sky, twinkling stars and
   shooting stars, a glowing crescent moon, sky lanterns rising,
   rockets with sparkle trails, chrysanthemum + willow + ring bursts,
   and a city skyline with flickering windows and a blinking antenna.
   BUZZ: a grand five-shell finale — flash, golden shockwave, a
   willow heart in the centre, and every window in the skyline blazes.
   ================================================================== */
const FW_COLORS = ["#ffcf5a", "#ff7b6b", "#7fe3ff", "#c88bff", "#9dff8a", "#ffb3d9"];

function Fireworks({ buzz }: { buzz: number }) {
  return (
    <>
      <ReadingGlow opacity={0.3} />

      {/* stars */}
      {(() => {
        const rnd = seeded(42);
        return Array.from({ length: 34 }).map((_, i) => (
          <span
            key={`s${i}`}
            className="imv-star absolute rounded-full bg-white"
            style={{
              left: `${rnd() * 97}%`,
              top: `${rnd() * 40}%`,
              width: 1.6 + (i % 3),
              height: 1.6 + (i % 3),
              animationDelay: `${-rnd() * 5}s`,
              animationDuration: `${2.4 + (i % 4)}s`,
            }}
          />
        ));
      })()}

      {/* shooting stars — rare, diagonal, dazzling */}
      <div className="imv-shoot absolute" style={{ left: "8%", top: "6%" }}>
        <div className="w-[64px] h-[1.6px] rotate-[18deg]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95))" }} />
      </div>
      <div className="imv-shoot absolute" style={{ left: "55%", top: "3%", animationDelay: "4.6s", animationDuration: "9.5s" }}>
        <div className="w-[48px] h-[1.4px] rotate-[16deg]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(200,230,255,0.9))" }} />
      </div>

      {/* crescent moon with halo */}
      <div className="absolute right-[7%] top-[5%]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[74px] h-[74px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,244,200,0.4), transparent 70%)" }} />
        <svg width="38" height="38" viewBox="0 0 34 34">
          <path d="M24 3 A14.5 14.5 0 1 0 31 22 A12 12 0 0 1 24 3 z" fill="rgba(255,244,200,0.95)" />
        </svg>
      </div>

      {/* sky lanterns rising slowly */}
      {[{ x: 14, d: 0 }, { x: 37, d: -11 }, { x: 68, d: -22 }].map((l, i) => (
        <div key={i} className="imv-lantern absolute bottom-[24%]" style={{ left: `${l.x}%`, animationDelay: `${l.d}s` }}>
          <svg width="15" height="20" viewBox="0 0 15 20">
            <ellipse cx="7.5" cy="8" rx="6.5" ry="7.5" fill="rgba(255,190,90,0.85)" />
            <ellipse cx="7.5" cy="6" rx="4" ry="3.4" fill="rgba(255,240,170,0.95)" />
            <path d="M4 15.5 h7" stroke="rgba(200,120,40,0.9)" strokeWidth="1" />
            <path d="M6 16.5 l-0.6 3 M9 16.5 l0.6 3" stroke="rgba(200,120,40,0.7)" strokeWidth="0.8" />
          </svg>
        </div>
      ))}

      {/* rockets */}
      {[{ x: 24, d: 0 }, { x: 55, d: 2.1 }, { x: 82, d: 4.3 }].map((r, i) => (
        <div key={i} className="imv-rocket absolute bottom-[18%]" style={{ left: `${r.x}%`, animationDelay: `${-r.d}s` }}>
          <div className="w-[2px] h-[30px]" style={{ background: "linear-gradient(180deg, transparent, #ffe9a8)", marginLeft: 7 }} />
          <div className="w-[3px] h-[3px] rounded-full bg-[#fff6cf] -mt-[30px] ml-[6.5px]" />
        </div>
      ))}

      {/* looping bursts — chrysanthemums + a ring */}
      {[
        { x: 22, y: 16, c: 0, d: 0, s: 1, k: "mum" },
        { x: 60, y: 9, c: 1, d: 2.1, s: 0.8, k: "mum" },
        { x: 41, y: 24, c: 2, d: 4.2, s: 1.1, k: "willow" },
        { x: 79, y: 20, c: 3, d: 6.1, s: 0.9, k: "mum" },
        { x: 10, y: 30, c: 4, d: 7.9, s: 0.75, k: "ring" },
        { x: 90, y: 33, c: 5, d: 5.3, s: 0.7, k: "mum" },
      ].map((f, i) => (
        <div key={i} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, transform: `scale(${f.s})` }}>
          <div className="imv-burst" style={{ animationDelay: `${-f.d}s` }}>
            <BurstSvg color={FW_COLORS[f.c]} seed={i} kind={f.k} />
          </div>
        </div>
      ))}

      {/* ---- BUZZ: grand five-shell finale ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-flash" />
          <div className="imv-ring-gold absolute left-1/2 top-[34%]" />
          {[
            { x: 40, y: 20, d: 0, c: "#ffd76a" },
            { x: 55, y: 13, d: 0.14, c: "#ff9b8a" },
            { x: 47, y: 33, d: 0.28, c: "#8fe0ff" },
            { x: 28, y: 27, d: 0.44, c: "#c9a0ff" },
            { x: 68, y: 24, d: 0.6, c: "#a5f29a" },
          ].map((f, i) => (
            <div key={i} className="imv-burst-once absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${f.d}s` }}>
              <BurstSvg color={f.c} seed={i + 3} kind={i === 2 ? "willow" : "mum"} />
            </div>
          ))}
          {/* the skyline answers — every window blazes */}
          <div className="absolute bottom-0 left-0 right-0 imv-blaze" style={{ height: 72 }} />
        </div>
      )}

      {/* city skyline */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" height="72" viewBox="0 0 520 72" preserveAspectRatio="none" style={{ opacity: 0.5 }}>
        <path
          d="M0 72 L0 46 L18 46 L18 30 L34 30 L34 46 L52 46 L52 20 L58 14 L64 20 L64 46 L84 46 L84 36 L102 36 L102 50 L120 50 L120 24 L136 24 L136 10 L142 16 L148 22 L148 50 L170 50 L170 38 L188 38 L188 52 L206 52 L206 26 L224 26 L224 14 L230 20 L236 26 L236 52 L258 52 L258 40 L276 40 L276 52 L296 52 L296 18 L312 18 L312 32 L330 32 L330 50 L352 50 L352 34 L370 34 L370 46 L390 46 L390 24 L406 24 L406 38 L424 38 L424 52 L446 52 L446 28 L462 28 L462 42 L482 42 L482 50 L520 50 L520 72 z"
          fill="#2e3358"
        />
        <g fill="#ffe9a8" className="imv-windows">
          {[
            [55, 26], [60, 33], [70, 30], [139, 28], [143, 35], [150, 30], [228, 32], [232, 26],
            [258, 44], [300, 22], [304, 29], [310, 24], [394, 29], [400, 34], [450, 32], [455, 38], [464, 34],
            [22, 36], [38, 40], [90, 42], [126, 30], [176, 44], [212, 34], [244, 46], [340, 38], [360, 40], [414, 44], [470, 46],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="2.6" height="2.6" />
          ))}
        </g>
        {/* antenna with blinking beacon */}
        <path d="M142 16 L142 4" stroke="#2e3358" strokeWidth="1.6" />
        <circle className="imv-beacon" cx="142" cy="3.4" r="1.8" fill="#ff5a5a" />
      </svg>

      <Vignette strength={0.2} />
    </>
  );
}

function BurstSvg({ color, seed = 0, kind = "mum" }: { color: string; seed?: number; kind?: "mum" | "willow" | "ring" }) {
  const n = kind === "ring" ? 18 : 14;
  return (
    <svg width="104" height="104" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i * 2 * Math.PI) / n + seed * 0.4;
        const r = kind === "ring" ? 42 : 40 + ((i + seed) % 3) * 4;
        if (kind === "willow") {
          // drooping arcs with trailing tips
          const x = 50 + r * Math.cos(a);
          const y = 50 + r * Math.sin(a);
          return (
            <path
              key={i}
              className="imv-fwspark"
              d={`M50 50 Q${(50 + x) / 2} ${(50 + y) / 2 - 4} ${x} ${y + 8}`}
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ ["--tx" as string]: "0px", ["--ty" as string]: "0px", animationDelay: `${(i % 5) * 0.05}s` }}
            />
          );
        }
        return (
          <circle
            key={i}
            className="imv-fwspark"
            cx="50"
            cy="50"
            r={i % 3 === 0 ? 2.6 : 1.7}
            fill={i % 4 === 0 ? "#ffffff" : color}
            style={{
              ["--tx" as string]: `${(r * Math.cos(a)).toFixed(1)}px`,
              ["--ty" as string]: `${(r * Math.sin(a)).toFixed(1)}px`,
              animationDelay: `${(i % 5) * 0.03}s`,
            }}
          />
        );
      })}
      <circle cx="50" cy="50" r="5.5" fill="#fff" opacity="0.95" />
      <circle cx="50" cy="50" r="9" fill="none" stroke={color} strokeWidth="1.4" opacity="0.7" />
    </svg>
  );
}

/* ==================================================================
   HEARTS — a Valentine boudoir: layered rose gradient with soft
   bokeh, a giant beating glossy heart, rose vines blooming in two
   corners, Cupid sweeping across with his bow, drifting hearts,
   falling petals and twinkling sparkles.
   BUZZ: giant lipstick kisses stamp the pane while an explosion of
   little hearts bursts from the centre and the bokeh flares rose.
   ================================================================== */
function Hearts({ buzz }: { buzz: number }) {
  return (
    <>
      {/* soft bokeh field */}
      {(() => {
        const rnd = seeded(11);
        return Array.from({ length: 9 }).map((_, i) => (
          <span
            key={`bk${i}`}
            className="imv-bokeh absolute rounded-full"
            style={{
              left: `${rnd() * 92}%`,
              top: `${rnd() * 84}%`,
              width: 26 + rnd() * 44,
              height: 26 + rnd() * 44,
              animationDelay: `${-rnd() * 16}s`,
              animationDuration: `${14 + rnd() * 12}s`,
              background: i % 3 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,170,200,0.4)",
              filter: `blur(${6 + (i % 3) * 3}px)`,
            }}
          />
        ));
      })()}

      {/* watermark heart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="imv-heartbeat">
          <GlossyHeart size={225} />
        </div>
      </div>

      {/* rose vines in two corners */}
      <svg className="absolute top-0 left-0" width="150" height="110" viewBox="0 0 150 110" style={{ opacity: 0.75 }}>
        <path d="M-6 -4 Q40 22 74 18 Q112 14 142 44" fill="none" stroke="#3f7a4c" strokeWidth="2.6" />
        <path d="M40 16 q10 -12 18 -2 M96 15 q12 -8 12 6" fill="none" stroke="#3f7a4c" strokeWidth="2" />
        {[[42, 14], [100, 17], [136, 40]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5.4" rx="3.4" ry="5.4" fill={i % 2 ? "#e86a92" : "#e2557f"} transform={`rotate(${a})`} />
            ))}
            <circle r="2.6" fill="#f8d66a" />
          </g>
        ))}
        {[[24, 12], [76, 20], [118, 26]].map(([x, y], i) => (
          <ellipse key={`l${i}`} cx={x} cy={y} rx="6" ry="3" fill="#4c8a58" transform={`rotate(${i * 40 - 20} ${x} ${y})`} />
        ))}
      </svg>
      <svg className="absolute bottom-0 right-0" width="140" height="100" viewBox="0 0 150 110" style={{ opacity: 0.7, transform: "rotate(180deg)" }}>
        <path d="M-6 -4 Q40 22 74 18 Q112 14 142 44" fill="none" stroke="#3f7a4c" strokeWidth="2.6" />
        {[[42, 14], [100, 17], [136, 40]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5.4" rx="3.4" ry="5.4" fill="#e86a92" transform={`rotate(${a})`} />
            ))}
            <circle r="2.6" fill="#f8d66a" />
          </g>
        ))}
      </svg>

      {/* Cupid sweeping across */}
      <div className="imv-cupid absolute top-[9%] left-0 w-full">
        <svg width="34" height="26" viewBox="0 0 34 26">
          <ellipse cx="17" cy="10" rx="5" ry="7" fill="rgba(255,240,246,0.95)" stroke="rgba(220,150,180,0.6)" strokeWidth="0.8" />
          <path d="M12 8 Q6 2 10 0 Q13 3 13 7 M22 8 Q28 2 24 0 Q21 3 21 7" fill="rgba(255,255,255,0.85)" />
          <circle cx="17" cy="6.5" r="3.4" fill="#ffdfc4" />
          <path d="M13.5 6 Q17 10 20.5 6" fill="#e88ba0" opacity="0.6" />
          <path d="M9 22 Q17 14 26 20" fill="none" stroke="#a8763a" strokeWidth="1.4" />
          <path d="M9 22 L27 15 M27 15 l-3.4 0.6 M27 15 l-1.8 2.8" stroke="#a8763a" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* drifting hearts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="imv-float absolute"
          style={{
            left: `${(i * 41 + 6) % 90}%`,
            animationDelay: `${-(i * 2.3) % 14}s`,
            animationDuration: `${11 + (i % 4) * 3}s`,
          }}
        >
          <span className="imv-sway block" style={{ animationDuration: `${3.2 + (i % 3) * 1.1}s`, opacity: 0.6 }}>
            <HeartGlyph size={9 + (i % 3) * 5} />
          </span>
        </span>
      ))}

      {/* rose petals */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={`p${i}`}
          className="imv-petal absolute"
          style={{
            left: `${(i * 53 + 9) % 94}%`,
            animationDelay: `${-(i * 1.7) % 11}s`,
            animationDuration: `${8.5 + (i % 4) * 1.7}s`,
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" className="imv-petalspin" style={{ animationDuration: `${2.4 + (i % 3) * 0.8}s` }}>
            <path d="M1 6 Q3 0.5 12 1.5 Q8 9.5 1 6 z" fill={["#f7a8c2", "#f28bab", "#ef7fa4"][i % 3]} />
          </svg>
        </span>
      ))}

      {/* sparkles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <svg
          key={`sp${i}`}
          className="imv-sparkle absolute"
          width={8 + (i % 3) * 3}
          height={8 + (i % 3) * 3}
          viewBox="0 0 12 12"
          style={{ left: `${(i * 57 + 12) % 94}%`, top: `${(i * 31 + 8) % 86}%`, animationDelay: `${-(i * 1.7) % 6}s` }}
        >
          <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 z" fill="#fff" opacity="0.9" />
        </svg>
      ))}

      {/* ---- BUZZ: kiss stamps + heart explosion + rose flare ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-roseflash" />
          <div className="imv-kiss absolute" style={{ left: "18%", top: "18%" }}>
            <BigKiss size={235} />
          </div>
          <div className="imv-kiss absolute" style={{ right: "15%", top: "44%", animationDelay: "0.28s" }}>
            <BigKiss size={175} />
          </div>
          <div className="imv-kiss absolute" style={{ left: "44%", bottom: "8%", animationDelay: "0.6s" }}>
            <BigKiss size={120} />
          </div>
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i * 2 * Math.PI) / 18 + 0.3;
            return (
              <span
                key={`hb${i}`}
                className="imv-heartburst absolute left-1/2 top-1/2"
                style={{
                  ["--tx" as string]: `${(120 * Math.cos(a)).toFixed(0)}px`,
                  ["--ty" as string]: `${(94 * Math.sin(a)).toFixed(0)}px`,
                  animationDelay: `${(i % 4) * 0.05}s`,
                }}
              >
                <HeartGlyph size={11 + (i % 3) * 4} />
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   AUTUMN — a golden afternoon in the park: hazy sun, a distant
   treeline, a great oak with a swaying canopy of fall colour, a
   branch overhead, migrating birds, tumbling leaves and a leaf
   litter floor with mushrooms and an acorn.
   BUZZ: a whirlwind — wind streaks rip through, the whole leaf
   litter erupts and leaves whip across in arcing flurries.
   ================================================================== */
function Autumn({ buzz }: { buzz: number }) {
  return (
    <>
      {/* hazy sun + warm haze */}
      <div className="absolute right-[10%] top-[8%]">
        <div className="w-[44px] h-[44px] rounded-full" style={{ background: "radial-gradient(circle at 40% 36%, #fffbe8, #ffe9a8 55%, rgba(255,214,120,0.35))", boxShadow: "0 0 30px 14px rgba(255,220,130,0.4)" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(255,214,140,0.34), transparent 60%)" }} />

      {/* distant treeline — soft, muted, blurred */}
      <svg className="absolute left-0 right-0 w-full" style={{ top: "52%", height: 54, opacity: 0.3, filter: "blur(1.2px)" }} viewBox="0 0 400 54" preserveAspectRatio="none">
        <path d="M0 54 L0 34 Q10 18 22 34 Q30 12 44 32 Q56 8 68 30 Q80 16 92 34 Q104 10 118 32 Q130 14 142 34 Q154 8 168 30 Q180 16 192 34 Q204 12 218 32 Q230 8 244 30 Q256 16 268 34 Q280 10 294 32 Q306 14 318 34 Q330 8 344 30 Q356 16 368 34 Q380 12 400 32 L400 54 z" fill="#b07840" />
      </svg>

      {/* the great oak — trunk + swaying canopy */}
      <div className="absolute bottom-[16%] left-[1%]">
        <svg width="120" height="170" viewBox="0 0 120 170" style={{ overflow: "visible" }}>
          <path d="M58 170 C54 128 50 104 40 82" fill="none" stroke="#7a5230" strokeWidth="13" strokeLinecap="round" />
          <path d="M58 170 C54 128 50 104 40 82" fill="none" stroke="#93683e" strokeWidth="6" strokeLinecap="round" />
          <path d="M52 132 l-14 -10 M49 110 l-12 -8 M47 94 l10 -8" stroke="#6a4526" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 82 L28 66 M40 82 L54 64" stroke="#7a5230" strokeWidth="5" strokeLinecap="round" />
          <g className="imv-canopy" style={{ transformBox: "view-box", transformOrigin: "44px 52px" }}>
            <circle cx="30" cy="48" r="26" fill="#d98a3c" />
            <circle cx="62" cy="38" r="30" fill="#e8a848" />
            <circle cx="88" cy="56" r="22" fill="#c96a38" />
            <circle cx="52" cy="66" r="24" fill="#e0913f" />
            <circle cx="44" cy="34" r="18" fill="#f0bc58" opacity="0.9" />
            {[[20, 40], [58, 26], [92, 48], [40, 72], [74, 62]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y}) rotate(${i * 63})`}>
                <LeafGlyph size={13} hue={[24, 38, 14, 30][i % 4]} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* branch overhead */}
      <svg className="absolute top-0 right-0 imv-branch" width="180" height="90" viewBox="0 0 180 90">
        <path d="M180 6 Q120 14 96 34 Q84 44 78 58" fill="none" stroke="#7a5230" strokeWidth="5" strokeLinecap="round" />
        <path d="M120 16 Q104 12 92 16 M96 34 Q86 30 76 32" fill="none" stroke="#7a5230" strokeWidth="3" strokeLinecap="round" />
        {[
          [92, 14], [104, 15], [84, 30], [95, 33], [76, 52], [86, 42],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 47})`}>
            <LeafGlyph size={12 + (i % 2) * 4} hue={[18, 32, 44][i % 3]} />
          </g>
        ))}
      </svg>

      {/* migrating birds */}
      <div className="imv-birds absolute top-[16%] left-0 w-full">
        <svg width="66" height="18" viewBox="0 0 66 18">
          {[[4, 10], [18, 4], [32, 9], [46, 3], [58, 8]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y + 3} q3 -4 6 0 q3 -4 6 0`} fill="none" stroke="#7a6248" strokeWidth="1.3" strokeLinecap="round" />
          ))}
        </svg>
      </div>

      {/* tumbling leaves */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="imv-fall absolute"
          style={{
            left: `${(i * 31 + 4) % 96}%`,
            animationDelay: `${-(i * 1.9) % 12}s`,
            animationDuration: `${8 + (i % 5) * 1.6}s`,
          }}
        >
          <span className="imv-sway2 block" style={{ animationDuration: `${2.6 + (i % 4) * 0.9}s`, opacity: 0.9 }}>
            <LeafGlyph size={11 + (i % 3) * 4} hue={[18, 32, 44, 10][i % 4]} />
          </span>
        </span>
      ))}

      {/* leaf litter floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[13%]" style={{ background: "linear-gradient(180deg, rgba(214,160,88,0.34), rgba(190,130,70,0.42))" }} />
      {(() => {
        const rnd = seeded(23);
        return Array.from({ length: 16 }).map((_, i) => (
          <span key={`lit${i}`} className="absolute" style={{ left: `${rnd() * 94}%`, bottom: `${rnd() * 9}%`, opacity: 0.85, transform: `rotate(${rnd() * 360}deg)` }}>
            <LeafGlyph size={10 + rnd() * 7} hue={[16, 28, 40, 8, 34][i % 5]} />
          </span>
        ));
      })()}
      {/* mushrooms + acorn */}
      <svg className="absolute bottom-[2%] left-[24%]" width="24" height="20" viewBox="0 0 24 20">
        <path d="M9 11 Q9 18 10 20 h5 q1 -4 1 -9 z" fill="#f2e4cc" stroke="#c9a888" strokeWidth="0.8" />
        <path d="M2 11 Q2 2 12 2 Q22 2 22 11 z" fill="#c95a3a" stroke="#9a3f24" strokeWidth="0.8" />
        <circle cx="8" cy="7" r="1.4" fill="#f2e4cc" />
        <circle cx="15" cy="5.6" r="1.2" fill="#f2e4cc" />
      </svg>
      <svg className="absolute bottom-[4%] right-[26%]" width="16" height="18" viewBox="0 0 16 18">
        <ellipse cx="8" cy="12" rx="5.4" ry="6" fill="#a87840" stroke="#7a5222" strokeWidth="0.8" />
        <path d="M3 8 Q8 1 13 8 z" fill="#6a4526" />
        <path d="M8 2 l1.4 -2" stroke="#6a4526" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* ---- BUZZ: the whirlwind ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-streak" style={{ top: "24%" }} />
          <div className="imv-streak" style={{ top: "58%", animationDelay: "0.12s" }} />
          {/* the leaf litter erupts */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={`er${i}`}
              className="imv-leafburst absolute"
              style={{
                left: `${8 + (i * 31) % 84}%`,
                bottom: "4%",
                animationDelay: `${(i % 7) * 0.05}s`,
              }}
            >
              <LeafGlyph size={11 + (i % 3) * 5} hue={[20, 36, 12, 46][i % 4]} />
            </span>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="imv-gustleaf absolute"
              style={{
                top: `${(i * 19 + 4) % 92}%`,
                animationDelay: `${(i % 7) * 0.06}s`,
                animationDuration: `${0.95 + (i % 5) * 0.14}s`,
              }}
            >
              <LeafGlyph size={10 + (i % 3) * 5} hue={[20, 36, 12, 46][i % 4]} />
            </span>
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   WINTER — an aurora night: deep twilight, moon with halo, three
   aurora ribbons, a layered pine forest with snow, snow drifts, a
   top-hatted snowman and parallax snowfall.
   BUZZ: a blizzard — white gusts whip across, heavy snow slams
   sideways, and the aurora flares brilliant.
   ================================================================== */
function Winter({ buzz }: { buzz: number }) {
  return (
    <>
      {/* moon with halo */}
      <div className="absolute right-[12%] top-[7%]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86px] h-[86px] rounded-full" style={{ background: "radial-gradient(circle, rgba(230,240,255,0.5), transparent 70%)" }} />
        <div className="w-[30px] h-[30px] rounded-full" style={{ background: "radial-gradient(circle at 36% 34%, #ffffff, #dfe9f5 65%, #c4d4e6)", boxShadow: "0 0 14px 4px rgba(255,255,255,0.55)" }} />
      </div>

      {/* stars */}
      {(() => {
        const rnd = seeded(5);
        return Array.from({ length: 20 }).map((_, i) => (
          <span
            key={`st${i}`}
            className="imv-star absolute rounded-full bg-white"
            style={{
              left: `${rnd() * 96}%`,
              top: `${rnd() * 34}%`,
              width: 1.4 + (i % 3),
              height: 1.4 + (i % 3),
              animationDelay: `${-rnd() * 5}s`,
              animationDuration: `${2.8 + (i % 4)}s`,
              opacity: 0.8,
            }}
          />
        ));
      })()}

      {/* aurora ribbons — three, different hues */}
      <div className="imv-aurora absolute left-[-10%] right-[-10%] top-[3%] h-[36%]" style={{ background: "linear-gradient(100deg, transparent, rgba(110,230,180,0.4) 30%, rgba(150,190,255,0.28) 55%, transparent 85%)", filter: "blur(7px)" }} />
      <div className="imv-aurora absolute left-[-10%] right-[-10%] top-[10%] h-[28%]" style={{ background: "linear-gradient(80deg, transparent, rgba(190,140,240,0.26) 40%, rgba(120,220,210,0.24) 70%, transparent)", filter: "blur(9px)", animationDelay: "-3.2s" }} />
      <div className="imv-aurora absolute left-[-10%] right-[-10%] top-[16%] h-[20%]" style={{ background: "linear-gradient(94deg, transparent, rgba(140,235,255,0.24) 44%, rgba(255,170,230,0.18) 66%, transparent)", filter: "blur(11px)", animationDelay: "-7.4s", animationDuration: "14s" }} />

      {/* back snow (slow, soft) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={`bs${i}`}
          className="imv-snow absolute rounded-full bg-white"
          style={{
            left: `${(i * 41 + 8) % 96}%`,
            width: 2.4 + (i % 2),
            height: 2.4 + (i % 2),
            opacity: 0.5,
            filter: "blur(1px)",
            animationDelay: `${-(i * 2.3) % 14}s`,
            animationDuration: `${11 + (i % 4) * 2}s`,
          }}
        />
      ))}

      {/* distant forest — blurred silhouettes */}
      <svg className="absolute bottom-[10%] left-0 right-0 w-full" height="64" viewBox="0 0 400 64" preserveAspectRatio="none" style={{ opacity: 0.4, filter: "blur(1px)" }}>
        <path d="M0 64 L0 40 L12 40 L22 12 L32 40 L40 40 L40 64 z M36 64 L36 44 L46 44 L56 16 L66 44 L74 44 L74 64 z M70 64 L70 42 L80 42 L92 8 L104 42 L112 42 L112 64 z M150 64 L150 42 L160 42 L170 14 L180 42 L188 42 L188 64 z M240 64 L240 44 L250 44 L260 12 L270 44 L278 44 L278 64 z M330 64 L330 42 L340 42 L352 6 L364 42 L372 42 L372 64 z M372 64 L372 46 L382 46 L390 22 L398 46 L400 46 L400 64 z" fill="#4a7a94" />
      </svg>

      {/* snow drifts */}
      <div className="absolute bottom-0 left-[-6%] right-[30%] h-[16%]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef4fb 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.94 }} />
      <div className="absolute bottom-0 right-[-8%] left-[46%] h-[11%]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f2f7fd 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.9 }} />

      {/* front pines with snow */}
      {[
        { l: "3%", s: 1 },
        { l: "12%", s: 0.72 },
        { l: "30%", s: 0.6 },
        { l: "62%", s: 0.5 },
      ].map((t, i) => (
        <svg key={i} className="absolute" style={{ left: t.l, bottom: "9%", opacity: 0.95 }} width={40 * t.s} height={52 * t.s} viewBox="0 0 40 52">
          <rect x="17" y="42" width="6" height="9" fill="#7a5b3a" />
          <path d="M20 2 L32 20 L26 19 L36 34 L28 33 L38 46 L2 46 L12 33 L4 34 L14 19 L8 20 z" fill="#2f6a50" stroke="#245440" strokeWidth="1" />
          <path d="M20 2 L26 20 L20 19 z M12 33 L24 32 L28 33 L36 34 L2 46 L12 33 z" fill="#eef6fc" opacity="0.8" />
        </svg>
      ))}

      {/* snowman with top hat */}
      <svg className="absolute bottom-[6%] right-[7%]" width="62" height="76" viewBox="0 0 58 84">
        <ellipse cx="29" cy="78" rx="21" ry="4" fill="rgba(120,150,190,0.35)" />
        <circle cx="29" cy="60" r="15" fill="#fff" stroke="#c9d6e6" strokeWidth="1" />
        <circle cx="29" cy="36" r="11" fill="#fff" stroke="#c9d6e6" strokeWidth="1" />
        {/* top hat */}
        <rect x="18" y="18" width="22" height="3.4" rx="1.6" fill="#2a2a34" />
        <rect x="22.5" y="8" width="13" height="11" rx="1.4" fill="#2a2a34" />
        <rect x="22.5" y="15" width="13" height="2.6" fill="#c0392b" />
        <circle cx="24.5" cy="34" r="1.5" fill="#333" />
        <circle cx="33.5" cy="34" r="1.5" fill="#333" />
        <path d="M29 37 L35 38.5 L29 40 z" fill="#f08a2a" />
        <path d="M20 41 Q29 46 38 41 L37 45 Q29 49.5 21 45 z" fill="#c0392b" />
        <path d="M38 42 L44 44" stroke="#c0392b" strokeWidth="2.6" strokeLinecap="round" />
        {/* twig arms */}
        <path d="M15 56 L4 48 M6 49 l3 0.4 M7 52 l2.6 -1" stroke="#7a5b3a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M43 56 L54 50" stroke="#7a5b3a" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="29" cy="56" r="1.4" fill="#333" />
        <circle cx="29" cy="62" r="1.4" fill="#333" />
        <circle cx="29" cy="68" r="1.4" fill="#333" />
      </svg>

      {/* front snow */}
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={`f${i}`}
          className="imv-snow absolute rounded-full bg-white"
          style={{
            left: `${(i * 37 + 3) % 97}%`,
            width: 3.4 + (i % 4) * 1.8,
            height: 3.4 + (i % 4) * 1.8,
            opacity: 0.65 + (i % 4) * 0.12,
            animationDelay: `${-(i * 1.9) % 12}s`,
            animationDuration: `${7 + (i % 5) * 1.8}s`,
            boxShadow: "0 0 3px rgba(255,255,255,0.9)",
          }}
        />
      ))}

      <Vignette strength={0.15} />

      {/* ---- BUZZ: the blizzard ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          {/* the aurora flares */}
          <div className="imv-auroraflash absolute inset-0" />
          <div className="imv-streak-winter" style={{ top: "26%" }} />
          <div className="imv-streak-winter" style={{ top: "48%", animationDelay: "0.1s" }} />
          <div className="imv-streak-winter" style={{ top: "70%", animationDelay: "0.2s" }} />
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="imv-flurry absolute rounded-full bg-white"
              style={{
                top: `${(i * 23 + 6) % 90}%`,
                width: 3 + (i % 3) * 2.2,
                height: 3 + (i % 3) * 2.2,
                animationDelay: `${(i % 6) * 0.07}s`,
                animationDuration: `${1 + (i % 4) * 0.2}s`,
                boxShadow: "0 0 4px rgba(255,255,255,0.95)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
