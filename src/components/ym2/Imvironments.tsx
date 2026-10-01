"use client";

import React from "react";
import { GlossyHeart, HeartGlyph, LeafGlyph, BigKiss } from "./icons";

/* ==================================================================
   IMVironments — recreations of the classic Yahoo! Messenger chat
   scenes. Each scene = a background + animated ambience that lives
   BEHIND the message text, exactly like the original client.
   ================================================================== */

export type ImvId = "none" | "luv" | "autumn" | "aquarium" | "fireworks" | "winter" | "notepad";

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
export const ImvIconPad = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    <rect x="2" y="1.5" width="10" height="11" rx="0.8" fill="#fdf7c8" stroke="#c9bd7a" strokeWidth="0.7" />
    <line x1="4.4" y1="1.5" x2="4.4" y2="12.5" stroke="#e08a8a" strokeWidth="0.8" />
    <line x1="6.4" y1="4.4" x2="10.4" y2="4.4" stroke="#a9c8e8" strokeWidth="0.8" />
    <line x1="6.4" y1="7" x2="10.4" y2="7" stroke="#a9c8e8" strokeWidth="0.8" />
    <line x1="6.4" y1="9.6" x2="10.4" y2="9.6" stroke="#a9c8e8" strokeWidth="0.8" />
  </svg>
);

export const IMV_LIST: { id: ImvId; label: string; icon: React.ReactNode | null }[] = [
  { id: "none", label: "None", icon: null },
  { id: "aquarium", label: "Aquarium", icon: <ImvIconFish /> },
  { id: "autumn", label: "Autumn", icon: <LeafGlyph size={13} /> },
  { id: "fireworks", label: "Fireworks", icon: <ImvIconBurst /> },
  { id: "luv", label: "Luv", icon: <HeartGlyph size={13} /> },
  { id: "notepad", label: "Notepad", icon: <ImvIconPad /> },
  { id: "winter", label: "Winter", icon: <ImvIconSnow /> },
];

/* ---------- pane backgrounds (kept light enough for black text) ---------- */
export const IMV_BG: Record<ImvId, string> = {
  none: "#ffffff",
  luv: "linear-gradient(180deg, #ffe9f1 0%, #ffd7e4 48%, #ffc9da 100%)",
  autumn: "linear-gradient(180deg, #fdf8ec 0%, #f9eed6 50%, #f3e0b8 100%)",
  aquarium: "linear-gradient(180deg, #d8eefb 0%, #a8d8f2 32%, #6fb2e2 68%, #4a94cf 100%)",
  fireworks: "linear-gradient(180deg, #6a7ec9 0%, #93a3dd 28%, #c3c9ec 62%, #ece7f5 100%)",
  winter: "linear-gradient(180deg, #eaf2fb 0%, #dde9f6 55%, #cfdeef 100%)",
  notepad: "linear-gradient(180deg, #fdf9cf 0%, #fbf6c6 100%)",
};

/* ==================================================================
   The scene component — drop behind the message text.
   kisses / gust / burst / flurry are "buzz tokens": each increment
   of the matching counter re-mounts that reaction layer once.
   ================================================================== */
interface Props {
  imv: ImvId;
  kisses: number[];
  gust: number;
  burst: number;
  flurry: number;
}

export function ImvScene({ imv, kisses, gust, burst, flurry }: Props) {
  if (imv === "none") return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {imv === "luv" && <Luv kisses={kisses} />}
      {imv === "autumn" && <Autumn gust={gust} />}
      {imv === "aquarium" && <Aquarium />}
      {imv === "fireworks" && <Fireworks burst={burst} />}
      {imv === "winter" && <Winter flurry={flurry} />}
      {imv === "notepad" && <Notepad />}
    </div>
  );
}

/* ================= LUV ================= */
function Luv({ kisses }: { kisses: number[] }) {
  return (
    <>
      {/* glossy watermark heart, gently breathing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="imv-heartbeat">
          <GlossyHeart size={210} />
        </div>
      </div>
      {/* drifting little hearts */}
      {Array.from({ length: 9 }).map((_, i) => (
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
      {/* twinkling sparkles */}
      {Array.from({ length: 7 }).map((_, i) => (
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
      {/* kiss stamps from buzzing */}
      {kisses.map((id, i) => (
        <div
          key={id}
          className="imv-kiss absolute"
          style={{ left: `${14 + ((i * 29) % 46)}%`, top: `${16 + ((i * 37) % 42)}%` }}
        >
          <BigKiss size={240} />
        </div>
      ))}
    </>
  );
}

/* ================= AUTUMN ================= */
function Autumn({ gust }: { gust: number }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(255,214,140,0.28), transparent 60%)" }}
      />
      {Array.from({ length: 14 }).map((_, i) => (
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
      {gust > 0 && (
        <div key={gust} className="absolute inset-0">
          <div className="imv-streak" style={{ top: "24%" }} />
          <div className="imv-streak" style={{ top: "58%", animationDelay: "0.12s" }} />
          {Array.from({ length: 18 }).map((_, i) => (
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

/* ================= AQUARIUM ================= */
function Aquarium() {
  return (
    <>
      {/* sun rays shafting down from the surface */}
      <div className="absolute inset-0 overflow-hidden">
        {[-8, 14, 4].map((r, i) => (
          <div
            key={i}
            className="imv-ray absolute"
            style={{
              left: `${12 + i * 26}%`,
              top: "-12%",
              width: `${9 + i * 4}%`,
              height: "85%",
              transform: `rotate(${r}deg)`,
              animationDelay: `${-i * 3.1}s`,
            }}
          />
        ))}
      </div>

      {/* sandy bottom with pebbles + starfish */}
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
          <path
            d="M13 3 L15.5 9 L22 9.6 L17 13.6 L18.6 20 L13 16.4 L7.4 20 L9 13.6 L4 9.6 L10.5 9 z"
            fill="#e8896a"
            stroke="#c96a4c"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* swaying seaweed */}
      {[6, 13, 22, 78, 88].map((x, i) => (
        <svg
          key={x}
          className="imv-weed absolute bottom-[9%]"
          width="20"
          height={54 + (i % 3) * 22}
          viewBox="0 0 20 80"
          style={{ left: `${x}%`, animationDelay: `${-i * 1.3}s`, animationDuration: `${3.4 + (i % 3) * 0.8}s` }}
        >
          <path
            d="M10 80 C4 62 16 52 9 36 C4 24 14 16 10 2"
            fill="none"
            stroke={i % 2 ? "#3f9a5f" : "#2f8a52"}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      ))}

      {/* rising bubbles */}
      {Array.from({ length: 12 }).map((_, i) => (
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

      {/* fish cruising across */}
      <Fish color="#f5803e" dark="#c85a1e" y="26%" size={34} dur={19} delay={-3} fromLeft />
      <Fish color="#f7c948" dark="#c9992a" y="48%" size={26} dur={26} delay={-14} />
      <Fish color="#7ea7e8" dark="#4f7cc0" y="66%" size={40} dur={23} delay={-8} fromLeft />
    </>
  );
}

function Fish({ color, dark, y, size, dur, delay, fromLeft }: { color: string; dark: string; y: string; size: number; dur: number; delay: number; fromLeft?: boolean }) {
  return (
    <div className="absolute w-full" style={{ top: y }}>
      <div
        className="imv-fish"
        style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, ["--fish-flip" as string]: fromLeft ? "1" : "-1" }}
      >
        <div className="imv-fishbob" style={{ animationDuration: `${2.6 + size / 40}s` }}>
          <svg width={size} height={size * 0.62} viewBox="0 0 40 25" style={{ transform: "scaleX(var(--fish-flip))" }}>
            <path d="M6 12.5 Q14 3 26 8.5 Q34 12.5 26 16.5 Q14 22 6 12.5 z" fill={color} stroke={dark} strokeWidth="1" />
            <path d="M6 12.5 L0.5 6.5 L0.5 18.5 z" fill={color} stroke={dark} strokeWidth="1" />
            <path d="M17 8 Q20 3.5 23.5 8" fill="none" stroke={dark} strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="27.5" cy="11" r="1.5" fill="#222" />
            <circle cx="28" cy="10.5" r="0.5" fill="#fff" />
            <path d="M14 10.5 Q17 12.5 14 14.5" fill="none" stroke={dark} strokeWidth="1" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ================= FIREWORKS ================= */
const FW_COLORS = ["#ffcf5a", "#ff6b6b", "#7fe3ff", "#c88bff", "#9dff8a"];
function Fireworks({ burst }: { burst: number }) {
  return (
    <>
      {/* twinkling stars */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={`s${i}`}
          className="imv-star absolute rounded-full bg-white"
          style={{
            left: `${(i * 53 + 7) % 96}%`,
            top: `${(i * 29 + 4) % 34}%`,
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            animationDelay: `${-(i * 1.3) % 5}s`,
          }}
        />
      ))}

      {/* looping fireworks — bursts at staggered positions */}
      {[
        { x: 22, y: 18, c: 0, d: 0 },
        { x: 62, y: 10, c: 1, d: 2.1 },
        { x: 42, y: 26, c: 2, d: 4.2 },
        { x: 80, y: 22, c: 3, d: 6.0 },
        { x: 10, y: 32, c: 4, d: 7.8 },
      ].map((f, i) => (
        <div key={i} className="imv-burst absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${-f.d}s`, ["--fw" as string]: FW_COLORS[f.c] }}>
          <BurstSvg />
        </div>
      ))}

      {/* BUZZ reaction — grand golden salute at center */}
      {burst > 0 && (
        <div key={burst} className="imv-burst absolute" style={{ left: "46%", top: "22%", animationDuration: "1.5s", ["--fw" as string]: "#ffd76a" }}>
          <BurstSvg size={150} />
        </div>
      )}

      {/* city skyline silhouette along the bottom */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" height="64" viewBox="0 0 520 64" preserveAspectRatio="none" style={{ opacity: 0.28 }}>
        <path
          d="M0 64 L0 40 L18 40 L18 26 L34 26 L34 40 L52 40 L52 18 L58 12 L64 18 L64 40 L84 40 L84 32 L102 32 L102 44 L120 44 L120 20 L136 20 L136 8 L142 14 L148 20 L148 44 L170 44 L170 34 L188 34 L188 46 L206 46 L206 24 L224 24 L224 12 L230 18 L236 24 L236 46 L258 46 L258 36 L276 36 L276 46 L296 46 L296 16 L312 16 L312 28 L330 28 L330 44 L352 44 L352 30 L370 30 L370 42 L390 42 L390 22 L406 22 L406 34 L424 34 L424 46 L446 46 L446 26 L462 26 L462 38 L482 38 L482 44 L520 44 L520 64 z"
          fill="#3a3f66"
        />
        <g fill="#ffe9a8">
          <rect x="55" y="24" width="2.4" height="2.4" />
          <rect x="60" y="30" width="2.4" height="2.4" />
          <rect x="139" y="26" width="2.4" height="2.4" />
          <rect x="143" y="32" width="2.4" height="2.4" />
          <rect x="228" y="30" width="2.4" height="2.4" />
          <rect x="300" y="21" width="2.4" height="2.4" />
          <rect x="304" y="27" width="2.4" height="2.4" />
          <rect x="394" y="27" width="2.4" height="2.4" />
          <rect x="450" y="31" width="2.4" height="2.4" />
        </g>
      </svg>
    </>
  );
}

function BurstSvg({ size = 92 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const r1 = 16;
        const r2 = 46;
        return (
          <g key={i}>
            <line
              x1={50 + r1 * Math.cos(a)}
              y1={50 + r1 * Math.sin(a)}
              x2={50 + r2 * Math.cos(a)}
              y2={50 + r2 * Math.sin(a)}
              stroke="var(--fw)"
              strokeWidth={i % 2 ? 1.6 : 2.6}
              strokeLinecap="round"
            />
            <circle cx={50 + (r2 + 5) * Math.cos(a)} cy={50 + (r2 + 5) * Math.sin(a)} r={i % 2 ? 1.6 : 2.4} fill="var(--fw)" />
          </g>
        );
      })}
      <circle cx="50" cy="50" r="6.5" fill="#fff" opacity="0.95" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="var(--fw)" strokeWidth="1.4" opacity="0.7" />
    </svg>
  );
}

/* ================= WINTER ================= */
function Winter({ flurry }: { flurry: number }) {
  return (
    <>
      {/* snow drifts */}
      <div
        className="absolute bottom-0 left-[-6%] right-[30%] h-[16%]"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef4fb 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.9 }}
      />
      <div
        className="absolute bottom-0 right-[-8%] left-[46%] h-[11%]"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #f2f7fd 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.85 }}
      />
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
      {/* falling snowflakes */}
      {Array.from({ length: 17 }).map((_, i) => (
        <span
          key={`f${i}`}
          className="imv-snow absolute rounded-full bg-white"
          style={{
            left: `${(i * 37 + 3) % 97}%`,
            width: 3 + (i % 4) * 1.6,
            height: 3 + (i % 4) * 1.6,
            opacity: 0.55 + (i % 4) * 0.13,
            animationDelay: `${-(i * 1.9) % 12}s`,
            animationDuration: `${7 + (i % 5) * 1.8}s`,
            boxShadow: "0 0 3px rgba(255,255,255,0.9)",
          }}
        />
      ))}
      {/* BUZZ reaction — whirling flurry */}
      {flurry > 0 && (
        <div key={flurry} className="absolute inset-0">
          <div className="imv-streak-winter" style={{ top: "30%" }} />
          <div className="imv-streak-winter" style={{ top: "62%", animationDelay: "0.1s" }} />
          {Array.from({ length: 16 }).map((_, i) => (
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

/* ================= NOTEPAD ================= */
function Notepad() {
  return (
    <>
      {/* ruled lines */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 21px, rgba(140,180,220,0.55) 21px, rgba(140,180,220,0.55) 22px)",
        }}
      />
      {/* red margin line */}
      <div className="absolute top-0 bottom-0" style={{ left: 34, width: 1.4, background: "rgba(224,120,120,0.75)" }} />
      {/* punched holes */}
      {[12, 34, 56, 78].map((t) => (
        <div
          key={t}
          className="absolute rounded-full"
          style={{ left: 12, top: `${t}%`, width: 9, height: 9, background: "var(--ym-cream)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.6)" }}
        />
      ))}
      {/* faint coffee ring, very subtle */}
      <div
        className="absolute rounded-full"
        style={{ right: "6%", bottom: "7%", width: 64, height: 58, border: "5px solid rgba(150,100,50,0.10)", transform: "rotate(-6deg)" }}
      />
      {/* dog-ear corner */}
      <div
        className="absolute top-0 right-0"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 26px 26px 0",
          borderColor: "transparent #efe6ad transparent transparent",
          filter: "drop-shadow(-2px 2px 2px rgba(120,100,40,0.18))",
        }}
      />
    </>
  );
}
