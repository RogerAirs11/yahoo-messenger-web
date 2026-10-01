"use client";

import React, { useEffect, useRef, useState } from "react";
import { GlossyHeart, HeartGlyph, LeafGlyph, BigKiss } from "./icons";

/* ==================================================================
   IMVironments — rich, animated recreations of the classic Yahoo!
   Messenger chat scenes. Every scene is a layered little world that
   lives BEHIND the message text, and every scene answers a BUZZ in
   its own artistic way, with its own realistic sound (see sounds.ts).
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

/* ---------- pane backgrounds (kept light enough for black text) ---------- */
export const IMV_BG: Record<ImvId, string> = {
  none: "#ffffff",
  hearts: "linear-gradient(180deg, #ffe9f1 0%, #ffd7e4 48%, #ffc9da 100%)",
  autumn: "linear-gradient(180deg, #fdf8ec 0%, #f9eed6 50%, #f3e0b8 100%)",
  aquarium: "linear-gradient(180deg, #e4f3fc 0%, #bcdff6 30%, #8cc4ec 66%, #6aade0 100%)",
  beach: "linear-gradient(180deg, #bfe4fb 0%, #d3edfc 34%, #ffeed2 55%, #f7e3bd 78%, #eed7a9 100%)",
  doodle: "#fdfcf7",
  fireworks: "linear-gradient(180deg, #5f6fc0 0%, #8f9ddd 26%, #c2c4e9 56%, #ece5f2 100%)",
  winter: "linear-gradient(180deg, #e6f0fb 0%, #dde9f6 55%, #cfdeef 100%)",
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

/* soft wash that keeps message text readable over busy art */
function ReadingGlow({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(115% 75% at 34% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.35) 55%, transparent 78%)", opacity }}
    />
  );
}

/* ==================================================================
   AQUARIUM — sun shafts, cruising fish (tail wiggle), a jellyfish,
   seaweed forest, sandy bottom. BUZZ: sonar shockwave rings + fish
   dart away + a column of bubbles erupts from the floor.
   ================================================================== */
function Aquarium({ buzz }: { buzz: number }) {
  return (
    <>
      <ReadingGlow opacity={0.42} />

      {/* the surface, seen from below — shimmering band */}
      <div className="absolute top-0 left-0 right-0 h-[34px] overflow-hidden">
        <svg className="imv-surface absolute top-[2px] left-[-40px]" width="220%" height="34" viewBox="0 0 1200 34" preserveAspectRatio="none">
          <path d="M0 18 Q30 6 60 18 T120 18 T180 18 T240 18 T300 18 T360 18 T420 18 T480 18 T540 18 T600 18 T660 18 T720 18 T780 18 T840 18 T900 18 T960 18 T1020 18 T1080 18 T1140 18 T1200 18 V0 H0 z" fill="rgba(255,255,255,0.55)" />
          <path d="M0 18 Q30 6 60 18 T120 18 T180 18 T240 18 T300 18 T360 18 T420 18 T480 18 T540 18 T600 18 T660 18 T720 18 T780 18 T840 18 T900 18 T960 18 T1020 18 T1080 18 T1140 18 T1200 18" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        </svg>
      </div>

      {/* god rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[-9, 13, 3, -4].map((r, i) => (
          <div
            key={i}
            className="imv-ray absolute"
            style={{
              left: `${8 + i * 23}%`,
              top: "-14%",
              width: `${8 + i * 3}%`,
              height: "88%",
              transform: `rotate(${r}deg)`,
              animationDelay: `${-i * 2.9}s`,
            }}
          />
        ))}
      </div>

      {/* jellyfish pulsing upward */}
      <div className="imv-jellydrift absolute left-[74%] top-[16%]">
        <div className="imv-jelly">
          <svg width="44" height="72" viewBox="0 0 44 72">
            <path d="M4 26 A18 17 0 0 1 40 26 Q40 33 33 32 Q26 35 22 32 Q18 35 11 32 Q4 33 4 26 z" fill="rgba(255,170,205,0.75)" stroke="rgba(220,110,160,0.8)" strokeWidth="1" />
            <path d="M14 33 q-2 12 2 22 M22 33 q1 13 -1 24 M30 33 q3 11 0 21" fill="none" stroke="rgba(230,130,175,0.7)" strokeWidth="1.6" strokeLinecap="round" className="imv-tent" />
          </svg>
        </div>
      </div>

      {/* sandy floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[13%]">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #f0e2b8 0%, #e3cfa0 60%, #d9c294 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
        <svg className="absolute bottom-1 left-[8%]" width="46" height="16" viewBox="0 0 46 16">
          <ellipse cx="8" cy="12" rx="5" ry="3.4" fill="#c9b184" />
          <ellipse cx="22" cy="13" rx="7" ry="4" fill="#d6c096" />
          <ellipse cx="38" cy="12" rx="5.5" ry="3.6" fill="#c0a377" />
        </svg>
        <svg className="absolute bottom-2 right-[10%]" width="26" height="24" viewBox="0 0 26 24">
          <path d="M13 3 L15.5 9 L22 9.6 L17 13.6 L18.6 20 L13 16.4 L7.4 20 L9 13.6 L4 9.6 L10.5 9 z" fill="#e8896a" stroke="#c96a4c" strokeWidth="0.8" />
        </svg>
        {/* coral fan */}
        <svg className="absolute bottom-[7px] left-[40%]" width="30" height="26" viewBox="0 0 30 26">
          <g fill="none" stroke="#e07a5f" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
            <path d="M15 26 C15 16 13 10 8 4" />
            <path d="M15 26 C15 14 16 8 15 2" />
            <path d="M15 26 C15 16 18 10 22 5" />
            <path d="M15 26 C14 18 10 14 5 11" />
            <path d="M15 26 C16 18 21 14 25 12" />
          </g>
        </svg>
      </div>

      {/* seaweed — two depth layers */}
      {[4, 11, 18, 30, 72, 82, 91].map((x, i) => (
        <svg
          key={x}
          className="imv-weed absolute bottom-[9%]"
          width="20"
          height={50 + (i % 3) * 24}
          viewBox="0 0 20 80"
          style={{ left: `${x}%`, animationDelay: `${-i * 1.13}s`, animationDuration: `${3.2 + (i % 3) * 0.8}s`, opacity: 0.55 + (i % 2) * 0.25 }}
        >
          <path d="M10 80 C4 62 16 52 9 36 C4 24 14 16 10 2" fill="none" stroke={i % 2 ? "#3f9a5f" : "#2f8a52"} strokeWidth="5" strokeLinecap="round" />
        </svg>
      ))}

      {/* rising bubbles */}
      {Array.from({ length: 13 }).map((_, i) => (
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

      {/* residents */}
      <Clownfish y="24%" size={38} dur={21} delay={-4} fromLeft />
      <Tang y="46%" size={30} dur={27} delay={-15} />
      <BlueTang y="63%" size={36} dur={24} delay={-9} fromLeft />
      <Clownfish y="72%" size={26} dur={31} delay={-20} />

      {/* ---- BUZZ: sonar rings + startle dash + bubble eruption ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-ring absolute left-1/2 top-1/2" />
          <div className="imv-ring absolute left-1/2 top-1/2" style={{ animationDelay: "0.22s" }} />
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="imv-ebubble absolute rounded-full"
              style={{
                left: `${26 + (i * 13) % 44}%`,
                width: 5 + (i % 4) * 3.4,
                height: 5 + (i % 4) * 3.4,
                animationDelay: `${(i % 6) * 0.07}s`,
                background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.3) 60%, rgba(220,240,255,0.12))",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            />
          ))}
          {/* startled fish darting for cover */}
          <svg className="imv-dash absolute left-[-8%] top-[30%]" width="40" height="22" viewBox="0 0 40 22" style={{ transform: "scaleX(-1)" }}>
            <path d="M4 11 Q14 3 28 8 Q36 11 28 15 Q14 20 4 11 z" fill="rgba(30,60,90,0.55)" />
            <path d="M4 11 L0 5 L0 17 z" fill="rgba(30,60,90,0.55)" />
          </svg>
          <svg className="imv-dash absolute right-[-8%] top-[58%]" width="34" height="19" viewBox="0 0 40 22" style={{ animationDelay: "0.12s" }}>
            <path d="M4 11 Q14 3 28 8 Q36 11 28 15 Q14 20 4 11 z" fill="rgba(30,60,90,0.45)" />
            <path d="M4 11 L0 5 L0 17 z" fill="rgba(30,60,90,0.45)" />
          </svg>
        </div>
      )}
    </>
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

/* ==================================================================
   BEACH — noon sun with slow rays, drifting clouds, rolling surf
   with foam scallops, palm tree, umbrella, beach ball, gulls.
   BUZZ: a big wave surges up the pane with spray, fronds whip.
   ================================================================== */
function Beach({ buzz }: { buzz: number }) {
  return (
    <>
      {/* sun + slow rays */}
      <div className="absolute right-[9%] top-[7%]">
        <div className="imv-sunrays absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="150" height="150" viewBox="0 0 100 100">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="50" y1="50" x2={50 + 48 * Math.cos((i * Math.PI) / 5)} y2={50 + 48 * Math.sin((i * Math.PI) / 5)} stroke="rgba(255,220,120,0.5)" strokeWidth="1.6" strokeLinecap="round" />
            ))}
          </svg>
        </div>
        <div className="w-[46px] h-[46px] rounded-full" style={{ background: "radial-gradient(circle at 38% 34%, #fff9e0, #ffe084 55%, #ffc93d)", boxShadow: "0 0 26px 10px rgba(255,214,110,0.55)" }} />
      </div>

      {/* drifting clouds */}
      <div className="imv-cloud absolute top-[9%]" style={{ animationDuration: "46s" }}>
        <CloudSvg scale={1} />
      </div>
      <div className="imv-cloud absolute top-[22%]" style={{ animationDuration: "64s", animationDelay: "-30s", transform: "scale(0.72)", opacity: 0.85 }}>
        <CloudSvg scale={0.72} />
      </div>

      {/* gulls */}
      <div className="imv-gull absolute top-[16%] left-0 w-full">
        <svg width="26" height="10" viewBox="0 0 26 10" className="imv-gullbob">
          <path d="M2 6 Q7 1 13 5 Q19 1 24 6" fill="none" stroke="#5a6b7d" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="imv-gull absolute top-[27%] left-0 w-full" style={{ animationDuration: "31s", animationDelay: "-17s" }}>
        <svg width="18" height="8" viewBox="0 0 26 10" className="imv-gullbob" style={{ animationDuration: "2.1s" }}>
          <path d="M2 6 Q7 1 13 5 Q19 1 24 6" fill="none" stroke="#6a7b8d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* ocean — three foam rows rolling */}
      <div className="absolute left-0 right-0" style={{ top: "38%", height: "23%" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #7fc3ea 0%, #5aa9dd 45%, #3f93cf 100%)" }} />
        {[
          { top: "8%", o: 0.5, w: 190, d: 11 },
          { top: "38%", o: 0.7, w: 150, d: 9 },
          { top: "68%", o: 0.9, w: 120, d: 7 },
        ].map((r, i) => (
          <div key={i} className="imv-surfrise absolute left-[-50%] w-[200%]" style={{ top: r.top, opacity: r.o, animationDuration: `${r.d}s`, animationDelay: `${-i * 2.4}s` }}>
            <FoamRow width={r.w} />
          </div>
        ))}
      </div>

      {/* sand */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "39%", background: "linear-gradient(180deg, #f7e3bd 0%, #eed7a9 40%, #e3c98f 100%)" }}>
        {/* wet sheen where the surf meets sand */}
        <div className="absolute top-0 left-0 right-0 h-[14px]" style={{ background: "linear-gradient(180deg, rgba(120,170,200,0.45), transparent)" }} />
        {/* speckles */}
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: `${(i * 41 + 7) % 96}%`, top: `${18 + ((i * 23) % 70)}%`, width: 2.2, height: 2.2, background: "rgba(160,120,60,0.35)" }} />
        ))}
        {/* starfish + shell */}
        <svg className="absolute bottom-[9%] right-[16%]" width="24" height="22" viewBox="0 0 26 24">
          <path d="M13 3 L15.5 9 L22 9.6 L17 13.6 L18.6 20 L13 16.4 L7.4 20 L9 13.6 L4 9.6 L10.5 9 z" fill="#eb9a72" stroke="#c9774e" strokeWidth="0.8" />
        </svg>
        <svg className="absolute bottom-[16%] left-[22%]" width="20" height="17" viewBox="0 0 20 17">
          <path d="M10 16 L2 6 Q10 -3 18 6 z" fill="#f3d9c2" stroke="#cfa984" strokeWidth="0.8" />
          <path d="M10 16 L6 4 M10 16 L10 2.6 M10 16 L14 4" stroke="#cfa984" strokeWidth="0.7" />
        </svg>
      </div>

      {/* palm tree, right edge */}
      <div className="absolute bottom-[36%] right-[1%]">
        <svg width="82" height="112" viewBox="0 0 110 150" style={{ overflow: "visible" }}>
          <path d="M62 148 C58 110 52 84 44 62" fill="none" stroke="#8a6238" strokeWidth="9" strokeLinecap="round" />
          <path d="M62 148 C58 110 52 84 44 62" fill="none" stroke="#a67a48" strokeWidth="5" strokeLinecap="round" />
          <g className="imv-fronds" style={{ transformBox: "view-box", transformOrigin: "44px 60px" }}>
            {[
              { d: "M44 60 Q18 42 4 52", r: 0 },
              { d: "M44 60 Q24 28 8 26", r: 0 },
              { d: "M44 60 Q40 20 26 10", r: 0 },
              { d: "M44 60 Q58 22 74 14", r: 0 },
              { d: "M44 60 Q68 34 92 32", r: 0 },
              { d: "M44 60 Q72 48 96 58", r: 0 },
            ].map((f, i) => (
              <g key={i} className="imv-frond" style={{ transformBox: "view-box", transformOrigin: "44px 60px", animationDelay: `${-i * 0.35}s` }}>
                <path d={f.d} fill="none" stroke="#3f8a4c" strokeWidth="5" strokeLinecap="round" />
                <path d={f.d} fill="none" stroke="#58a862" strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
            <circle cx="40" cy="63" r="4" fill="#6a4a24" />
            <circle cx="50" cy="65" r="4" fill="#7a5a2e" />
          </g>
        </svg>
      </div>

      {/* umbrella + beach ball */}
      <div className="absolute bottom-[8%] left-[7%]">
        <svg width="58" height="76" viewBox="0 0 74 96">
          <ellipse cx="38" cy="92" rx="26" ry="4" fill="rgba(120,90,40,0.25)" />
          <line x1="36" y1="26" x2="36" y2="90" stroke="#b08a4a" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M4 30 A32 26 0 0 1 68 30 Q56 36 46 30 Q41 35 36 30 Q31 35 26 30 Q16 36 4 30 z" fill="#e05a5a" stroke="#b03c3c" strokeWidth="1" />
          <path d="M20 12.5 A32 26 0 0 1 36 4 L36 30 Q31 35 26 30 Q20 26 20 12.5 z" fill="#fff" opacity="0.9" />
          <path d="M52 12.5 A32 26 0 0 0 36 4 L36 30 Q41 35 46 30 Q52 26 52 12.5 z" fill="#fff" opacity="0.9" />
          <circle cx="36" cy="4" r="2.4" fill="#b03c3c" />
        </svg>
      </div>
      <div className="absolute bottom-[5%] left-[30%]">
        <svg width="32" height="32" viewBox="0 0 40 40" className="imv-ball">
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

      {/* ---- BUZZ: the big wave ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-bigwave absolute left-[-10%] right-[-10%] bottom-0" />
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="imv-spray absolute rounded-full"
              style={{
                left: `${20 + (i * 29) % 60}%`,
                width: 4 + (i % 3) * 2.4,
                height: 4 + (i % 3) * 2.4,
                animationDelay: `${0.25 + (i % 5) * 0.09}s`,
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
   DOODLE — crayon paper: pre-drawn sun/clouds/house/flower live in
   the corners, and a REAL drawable canvas covers the pane. The
   floating tool pill (pencil / eraser / clear) works like the
   original Doodle IMVironment. BUZZ: the paper does a jelly wobble
   and a crayon "!!" pops in the middle.
   ================================================================== */
type DoodleTool = "pencil" | "eraser";

function Doodle({ buzz }: { buzz: number }) {
  return (
    <>
      <DoodleArt />
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
        {/* sun */}
        <g transform="translate(58 52) rotate(-3)" stroke="#f0a13a" strokeWidth="4">
          <circle r="20" fill="rgba(247,208,56,0.5)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={27 * Math.cos((a * Math.PI) / 180)} y1={27 * Math.sin((a * Math.PI) / 180)} x2={34 * Math.cos((a * Math.PI) / 180)} y2={34 * Math.sin((a * Math.PI) / 180)} strokeWidth="3.6" />
          ))}
        </g>
        {/* cloud */}
        <g transform="translate(210 44) rotate(2)" stroke="#4a90d9" strokeWidth="3.6">
          <path d="M0 12 Q2 -2 16 0 Q22 -10 34 -4 Q48 -12 52 2 Q64 4 58 14 Q46 20 30 16 Q12 22 0 12 z" />
        </g>
        {/* house */}
        <g transform="translate(52 176) rotate(-1)" stroke="#58a55c" strokeWidth="3.4">
          <rect x="0" y="18" width="58" height="46" />
          <path d="M-6 18 L29 -8 L64 18" />
          <rect x="10" y="30" width="14" height="12" stroke="#e2574c" />
          <rect x="36" y="36" width="14" height="28" stroke="#8a5fc0" />
          <path d="M64 64 L64 44 L74 40" stroke="#8a6238" />
        </g>
        {/* flower */}
        <g transform="translate(300 208) rotate(3)" stroke="#e2574c" strokeWidth="3.4">
          <path d="M0 60 Q-4 30 2 0" stroke="#58a55c" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx={12 * Math.cos((a * Math.PI) / 180)} cy={12 * Math.sin((a * Math.PI) / 180)} rx="8" ry="5.4" transform={`rotate(${a} ${12 * Math.cos((a * Math.PI) / 180)} ${12 * Math.sin((a * Math.PI) / 180)})`} fill="rgba(226,87,76,0.35)" />
          ))}
          <circle r="6.5" fill="rgba(247,208,56,0.75)" stroke="#c9992a" />
        </g>
        {/* grass tufts */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${18 + i * 34} 296 q${(i % 2) * 8 - 4} -14 ${(i % 2) * 10 - 3} -18`} stroke="#58a55c" strokeWidth="2.6" opacity="0.8" />
        ))}
      </g>
    </svg>
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
   FIREWORKS — violet night over a city: stars, crescent moon,
   ascending rockets, chrysanthemum bursts with flying sparks.
   BUZZ: a grand three-shell salute with a shockwave ring + flash,
   and the skyline windows blaze.
   ================================================================== */
const FW_COLORS = ["#ffcf5a", "#ff7b6b", "#7fe3ff", "#c88bff", "#9dff8a", "#ffb3d9"];

function Fireworks({ buzz }: { buzz: number }) {
  return (
    <>
      {/* stars */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={`s${i}`}
          className="imv-star absolute rounded-full bg-white"
          style={{
            left: `${(i * 47 + 6) % 97}%`,
            top: `${(i * 23 + 3) % 38}%`,
            width: 1.6 + (i % 3),
            height: 1.6 + (i % 3),
            animationDelay: `${-(i * 1.13) % 5}s`,
            animationDuration: `${2.8 + (i % 4)}s`,
          }}
        />
      ))}

      {/* crescent moon */}
      <svg className="absolute right-[8%] top-[6%]" width="34" height="34" viewBox="0 0 34 34">
        <path d="M24 3 A14.5 14.5 0 1 0 31 22 A12 12 0 0 1 24 3 z" fill="rgba(255,244,200,0.9)" />
      </svg>

      {/* rockets */}
      {[{ x: 24, d: 0 }, { x: 55, d: 2.1 }, { x: 82, d: 4.3 }].map((r, i) => (
        <div key={i} className="imv-rocket absolute bottom-[18%]" style={{ left: `${r.x}%`, animationDelay: `${-r.d}s` }}>
          <div className="w-[2px] h-[26px]" style={{ background: "linear-gradient(180deg, transparent, #ffe9a8)", marginLeft: 7 }} />
          <div className="w-[3px] h-[3px] rounded-full bg-[#fff6cf] -mt-[26px] ml-[6.5px]" />
        </div>
      ))}

      {/* looping bursts */}
      {[
        { x: 22, y: 16, c: 0, d: 0, s: 1 },
        { x: 60, y: 9, c: 1, d: 2.1, s: 0.8 },
        { x: 41, y: 24, c: 2, d: 4.2, s: 1.1 },
        { x: 79, y: 20, c: 3, d: 6.1, s: 0.9 },
        { x: 10, y: 30, c: 4, d: 7.9, s: 0.75 },
        { x: 90, y: 33, c: 5, d: 5.3, s: 0.7 },
      ].map((f, i) => (
        <div key={i} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, transform: `scale(${f.s})` }}>
          <div className="imv-burst" style={{ animationDelay: `${-f.d}s` }}>
            <BurstSvg color={FW_COLORS[f.c]} seed={i} />
          </div>
        </div>
      ))}

      {/* ---- BUZZ: grand salute ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-flash" />
          <div className="imv-ring-gold absolute left-1/2 top-[34%]" />
          {[
            { x: 42, y: 22, d: 0 },
            { x: 55, y: 14, d: 0.16 },
            { x: 48, y: 34, d: 0.32 },
          ].map((f, i) => (
            <div key={i} className="imv-burst-once absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${f.d}s` }}>
              <BurstSvg color="#ffd76a" seed={i + 3} />
            </div>
          ))}
        </div>
      )}

      {/* city skyline */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" height="72" viewBox="0 0 520 72" preserveAspectRatio="none" style={{ opacity: 0.42 }}>
        <path
          d="M0 72 L0 46 L18 46 L18 30 L34 30 L34 46 L52 46 L52 20 L58 14 L64 20 L64 46 L84 46 L84 36 L102 36 L102 50 L120 50 L120 24 L136 24 L136 10 L142 16 L148 22 L148 50 L170 50 L170 38 L188 38 L188 52 L206 52 L206 26 L224 26 L224 14 L230 20 L236 26 L236 52 L258 52 L258 40 L276 40 L276 52 L296 52 L296 18 L312 18 L312 32 L330 32 L330 50 L352 50 L352 34 L370 34 L370 46 L390 46 L390 24 L406 24 L406 38 L424 38 L424 52 L446 52 L446 28 L462 28 L462 42 L482 42 L482 50 L520 50 L520 72 z"
          fill="#2e3358"
        />
        <g fill="#ffe9a8" className="imv-windows">
          {[
            [55, 26], [60, 33], [70, 30], [139, 28], [143, 35], [150, 30], [228, 32], [232, 26],
            [258, 44], [300, 22], [304, 29], [310, 24], [394, 29], [400, 34], [450, 32], [455, 38], [464, 34],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="2.6" height="2.6" />
          ))}
        </g>
      </svg>
    </>
  );
}

function BurstSvg({ color, seed = 0 }: { color: string; seed?: number }) {
  const n = 14;
  return (
    <svg width="104" height="104" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i * 2 * Math.PI) / n + seed * 0.4;
        const r = 40 + ((i + seed) % 3) * 4;
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
   HEARTS — the romance scene: breathing glossy heart, drifting
   hearts, falling rose petals, sparkles. BUZZ: giant lipstick kiss
   stamps + an explosion of little hearts from the centre.
   ================================================================== */
function Hearts({ buzz }: { buzz: number }) {
  return (
    <>
      {/* watermark heart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="imv-heartbeat">
          <GlossyHeart size={215} />
        </div>
      </div>

      {/* drifting hearts */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="imv-float absolute"
          style={{
            left: `${(i * 41 + 6) % 90}%`,
            animationDelay: `${-(i * 2.3) % 14}s`,
            animationDuration: `${11 + (i % 4) * 3}s`,
          }}
        >
          <span className="imv-sway block" style={{ animationDuration: `${3.2 + (i % 3) * 1.1}s`, opacity: 0.55 }}>
            <HeartGlyph size={9 + (i % 3) * 5} />
          </span>
        </span>
      ))}

      {/* rose petals */}
      {Array.from({ length: 8 }).map((_, i) => (
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
      {Array.from({ length: 8 }).map((_, i) => (
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

      {/* ---- BUZZ: kiss stamps + heart explosion ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-kiss absolute" style={{ left: "18%", top: "18%" }}>
            <BigKiss size={230} />
          </div>
          <div className="imv-kiss absolute" style={{ right: "16%", top: "44%", animationDelay: "0.28s" }}>
            <BigKiss size={170} />
          </div>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 2 * Math.PI) / 16 + 0.3;
            return (
              <span
                key={`hb${i}`}
                className="imv-heartburst absolute left-1/2 top-1/2"
                style={{
                  ["--tx" as string]: `${(110 * Math.cos(a)).toFixed(0)}px`,
                  ["--ty" as string]: `${(86 * Math.sin(a)).toFixed(0)}px`,
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
   AUTUMN — golden afternoon: warm haze, a swaying branch overhead,
   tumbling leaves. BUZZ: a whirlwind — leaves whip across in arcs.
   ================================================================== */
function Autumn({ buzz }: { buzz: number }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(255,214,140,0.3), transparent 60%)" }}
      />
      {/* branch from the top-right */}
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

      {/* tumbling leaves */}
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className="imv-fall absolute"
          style={{
            left: `${(i * 31 + 4) % 96}%`,
            animationDelay: `${-(i * 1.9) % 12}s`,
            animationDuration: `${8 + (i % 5) * 1.6}s`,
          }}
        >
          <span className="imv-sway2 block" style={{ animationDuration: `${2.6 + (i % 4) * 0.9}s`, opacity: 0.85 }}>
            <LeafGlyph size={11 + (i % 3) * 4} hue={[18, 32, 44, 10][i % 4]} />
          </span>
        </span>
      ))}

      {/* ---- BUZZ: whirlwind ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-streak" style={{ top: "24%" }} />
          <div className="imv-streak" style={{ top: "58%", animationDelay: "0.12s" }} />
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
   WINTER — blue dusk: faint aurora ribbons, pine forest, snowman,
   parallax snowfall. BUZZ: a blizzard gust whips the snow flat.
   ================================================================== */
function Winter({ buzz }: { buzz: number }) {
  return (
    <>
      {/* aurora ribbons */}
      <div className="imv-aurora absolute left-[-10%] right-[-10%] top-[4%] h-[34%]" style={{ background: "linear-gradient(100deg, transparent, rgba(110,230,180,0.35) 30%, rgba(150,180,255,0.25) 55%, transparent 85%)", filter: "blur(7px)" }} />
      <div className="imv-aurora absolute left-[-10%] right-[-10%] top-[10%] h-[26%]" style={{ background: "linear-gradient(80deg, transparent, rgba(190,140,240,0.22) 40%, rgba(120,220,210,0.2) 70%, transparent)", filter: "blur(9px)", animationDelay: "-3.2s" }} />

      {/* back snow (slow, soft) */}
      {Array.from({ length: 12 }).map((_, i) => (
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

      {/* snow drifts */}
      <div className="absolute bottom-0 left-[-6%] right-[30%] h-[16%]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef4fb 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.92 }} />
      <div className="absolute bottom-0 right-[-8%] left-[46%] h-[11%]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f2f7fd 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.88 }} />

      {/* pines */}
      <svg className="absolute bottom-[9%] left-[4%]" width="40" height="52" viewBox="0 0 40 52">
        <rect x="17" y="42" width="6" height="9" fill="#7a5b3a" />
        <path d="M20 2 L32 20 L26 19 L36 34 L28 33 L38 46 L2 46 L12 33 L4 34 L14 19 L8 20 z" fill="#3f7a5c" stroke="#2f6348" strokeWidth="1" />
        <path d="M20 2 L26 20 L20 19 z" fill="#eef6fc" opacity="0.75" />
      </svg>
      <svg className="absolute bottom-[8%] left-[13%]" width="26" height="34" viewBox="0 0 40 52" style={{ opacity: 0.9 }}>
        <rect x="17" y="42" width="6" height="9" fill="#7a5b3a" />
        <path d="M20 2 L32 20 L26 19 L36 34 L28 33 L38 46 L2 46 L12 33 L4 34 L14 19 L8 20 z" fill="#4a8a68" stroke="#2f6348" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-[9%] right-[30%]" width="20" height="26" viewBox="0 0 40 52" style={{ opacity: 0.75 }}>
        <rect x="17" y="42" width="6" height="9" fill="#7a5b3a" />
        <path d="M20 2 L32 20 L26 19 L36 34 L28 33 L38 46 L2 46 L12 33 L4 34 L14 19 L8 20 z" fill="#3f7a5c" stroke="#2f6348" strokeWidth="1" />
      </svg>

      {/* snowman */}
      <svg className="absolute bottom-[6%] right-[7%]" width="58" height="66" viewBox="0 0 58 66">
        <ellipse cx="29" cy="60" rx="21" ry="4" fill="rgba(120,150,190,0.35)" />
        <circle cx="29" cy="44" r="15" fill="#fff" stroke="#c9d6e6" strokeWidth="1" />
        <circle cx="29" cy="22" r="11" fill="#fff" stroke="#c9d6e6" strokeWidth="1" />
        <circle cx="24.5" cy="20" r="1.5" fill="#333" />
        <circle cx="33.5" cy="20" r="1.5" fill="#333" />
        <path d="M29 23 L35 24.5 L29 26 z" fill="#f08a2a" />
        <path d="M20 27 Q29 32 38 27 L37 31 Q29 35.5 21 31 z" fill="#c0392b" />
        <path d="M38 28 L44 30" stroke="#c0392b" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="29" cy="40" r="1.4" fill="#333" />
        <circle cx="29" cy="46" r="1.4" fill="#333" />
        <circle cx="29" cy="52" r="1.4" fill="#333" />
      </svg>

      {/* front snow */}
      {Array.from({ length: 15 }).map((_, i) => (
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

      {/* ---- BUZZ: blizzard ---- */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="imv-streak-winter" style={{ top: "30%" }} />
          <div className="imv-streak-winter" style={{ top: "62%", animationDelay: "0.1s" }} />
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="imv-flurry absolute rounded-full bg-white"
              style={{
                top: `${(i * 23 + 6) % 90}%`,
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                animationDelay: `${(i % 6) * 0.07}s`,
                animationDuration: `${1 + (i % 4) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
