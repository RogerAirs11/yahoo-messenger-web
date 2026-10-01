"use client";

/* ==================================================================
   REAL Yahoo! Messenger IMVironment recreations.
   Rebuilt from PRIMARY visual evidence recovered from the live
   l.yimg.com CDN + the archived messenger.yahoo.com/imvironments
   gallery (Oct/Nov 2011 wayback captures):

     • Autumn Leaves  — imv_leaves.gif   (#ffefad cream, faint tree
       sketch right, flat red maples; official text: "Watch autumn
       leaves fall ... make them blow with the wind when you Buzz")
     • Fishtank       — imv_fish.gif     (pale #b3d8fc water, sage
       seaweed silhouettes, small colourful fish, bubbles)
     • Snowflake      — imv_snow.gif     (#b3d8fc sky, white clouds,
       white snowflakes, snowman with a "Y!" bubble; official text:
       "hit buzz and watch the snowballs fly!")
     • Falling Hearts — imv_hearts.gif   (#ffcccc border, #fdbec1
       rounded inner panel, flat red hearts; official text: "use the
       buzz feature to give your loved one a virtual kiss")
     • Purple Leaves  — purpleleaves_gallery.jpg (#e7cfe7 lavender,
       white bottom clouds, deep-purple tree silhouettes; "gently
       falling purple leaves flutter in the breeze")

   Design language of the REAL scenes (verified from the artwork):
   flat vector shapes, LIGHT backgrounds so the dark chat text stays
   readable, art hugging the edges/corners, gentle idle motion.
   ================================================================== */

import React from "react";

/* deterministic PRNG so layouts are stable across re-renders / SSR */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ---------- shared flat shapes (vector, like the originals) ---------- */

export const MapleLeaf = ({ size = 14, color = "#d4381e", style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M12 1.6 C12.9 4.2 13.7 5.4 15.5 6 L19.2 4.8 L17.5 8.3 C18.9 9.3 20.5 9.8 22.2 10 L19.3 12.4 L20.8 15.7 L16.9 15.1 C16.5 17.1 16.9 18.8 18.1 20.6 L13.8 19.5 L12 22.6 L10.2 19.5 L5.9 20.6 C7.1 18.8 7.5 17.1 7.1 15.1 L3.2 15.7 L4.7 12.4 L1.8 10 C3.5 9.8 5.1 9.3 6.5 8.3 L4.8 4.8 L8.5 6 C10.3 5.4 11.1 4.2 12 1.6 Z"
      fill={color}
    />
    <path d="M12 13 L12 20.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const HeartShape = ({ size = 14, color = "#e8336d", style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M12 21 C6.4 16.3 2.6 12.7 2.6 8.7 C2.6 5.7 5 3.6 7.7 3.6 C9.5 3.6 11 4.5 12 6.1 C13 4.5 14.5 3.6 16.3 3.6 C19 3.6 21.4 5.7 21.4 8.7 C21.4 12.7 17.6 16.3 12 21 Z"
      fill={color}
    />
  </svg>
);

const SnowflakeShape = ({ size = 12, opacity = 0.9, style }: { size?: number; opacity?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style} opacity={opacity}>
    <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>
          <line x1="12" y1="1.5" x2="12" y2="22.5" />
          <path d="M12 5.5 L9 3.4 M12 5.5 L15 3.4 M12 18.5 L9 20.6 M12 18.5 L15 20.6" strokeWidth="1.6" fill="none" />
        </g>
      ))}
    </g>
  </svg>
);

/* ==================================================================
   AUTUMN LEAVES — flat cream field (#ffefad), tan ground band
   (#e7d69c), faint sketched tree on the right, flat red maples in
   the corners. IDLE: leaves fall slowly. BUZZ: a strong wind blows
   every leaf around (exactly what Yahoo's official text promises).
   ================================================================== */

const SketchTree = ({ buzz }: { buzz: number }) => (
  /* faint pencil-sketch tree, right side — like the original thumb */
  <svg
    className={`absolute top-[2%] right-[3%] h-[86%] w-auto opacity-[0.42] ${buzz ? "imv-branch-shake" : ""}`}
    viewBox="0 0 120 210"
  >
    <g fill="none" stroke="#a3a084" strokeLinecap="round">
      {/* trunk + branches */}
      <path d="M60 208 C58 170 56 140 58 112 C59 96 62 84 60 70" strokeWidth="5" />
      <path d="M59 150 C48 138 38 130 26 124 M59 132 C70 122 82 114 94 108 M58 112 C50 104 42 98 34 96 M60 96 C68 88 78 82 88 78 M60 78 C54 68 48 62 40 58 M60 74 C68 64 78 58 86 54" strokeWidth="2.6" />
      {/* sketchy foliage clumps */}
      <circle cx="60" cy="52" r="30" strokeWidth="2.2" />
      <circle cx="30" cy="72" r="21" strokeWidth="2" />
      <circle cx="92" cy="70" r="23" strokeWidth="2" />
      <circle cx="44" cy="34" r="16" strokeWidth="1.8" />
      <circle cx="80" cy="34" r="17" strokeWidth="1.8" />
      {/* little sketch strokes inside the canopy */}
      <path d="M50 46 q6 -6 12 -2 M70 40 q6 4 4 10 M36 74 q8 -2 10 4 M88 62 q8 0 10 6" strokeWidth="1.4" />
    </g>
    {/* leaves hanging in the sketch canopy */}
    <MapleLeaf size={9} color="#c85a3a" style={{ position: "absolute", left: "38%", top: "18%" }} />
    <MapleLeaf size={8} color="#d4381e" style={{ position: "absolute", left: "60%", top: "10%" }} />
    <MapleLeaf size={8} color="#c85a3a" style={{ position: "absolute", left: "70%", top: "28%" }} />
  </svg>
);

export function AutumnLeaves({ buzz }: { buzz: number }) {
  /* static corner leaves, straight from the original composition */
  const corner = [
    { x: "2%", y: "6%", s: 20, r: -18 },
    { x: "9%", y: "15%", s: 13, r: 24 },
    { x: "44%", y: "4%", s: 12, r: 10 },
    { x: "24%", y: "82%", s: 14, r: 40 },
    { x: "88%", y: "78%", s: 18, r: -30 },
    { x: "74%", y: "87%", s: 12, r: 70 },
  ];
  /* slow idle fall — two depths (user: "in non buzz leaves should be slowly falling") */
  const rnd = seeded(7);
  const back = Array.from({ length: 6 }).map((_, i) => ({
    x: 6 + i * 16 + rnd() * 8,
    dur: 24 + rnd() * 12,
    sw: 5 + rnd() * 3,
    size: 9 + rnd() * 4,
    del: -rnd() * 26,
    op: 0.4,
  }));
  const front = Array.from({ length: 9 }).map((_, i) => ({
    x: 3 + i * 11 + rnd() * 7,
    dur: 15 + rnd() * 10,
    sw: 4.5 + rnd() * 3,
    size: 12 + rnd() * 7,
    del: -rnd() * 20,
    op: 0.72,
  }));
  /* buzz gust — leaves seized by the wind and swept across the pane */
  const g = seeded(buzz * 13 + 3);
  const gust = Array.from({ length: 16 }).map((_, i) => ({
    y: 4 + ((i * 61) % 88),
    dur: 0.85 + g() * 0.5,
    spin: 0.55 + g() * 0.4,
    size: 10 + g() * 10,
    del: g() * 0.5,
  }));
  const litter = Array.from({ length: 7 }).map((_, i) => ({
    x: 8 + ((i * 137) % 78),
    y: 82 + ((i * 29) % 12),
    s: 11 + ((i * 7) % 8),
    del: i * 0.06,
  }));

  return (
    <>
      {/* faint treeline wash behind everything (very low, like paper grain) */}
      <div className="absolute inset-x-0 bottom-[12%] h-[30%] opacity-[0.12]" style={{ background: "linear-gradient(180deg, transparent, #d8d5ad 60%, #c9c69a)" }} />
      <SketchTree buzz={buzz} />

      {/* tan ground band with a soft irregular top edge, like the original */}
      <svg className="absolute bottom-0 left-0 w-full h-[15%]" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0 22 Q50 12 100 20 T200 18 T300 22 T400 16 L400 60 L0 60 z" fill="#e7d69c" />
        <path d="M0 30 Q60 22 130 28 T260 26 T400 24 L400 60 L0 60 z" fill="#e0cd8e" opacity="0.55" />
      </svg>

      {/* static corner maples */}
      {corner.map((c, i) => (
        <div key={i} className="absolute" style={{ left: c.x, top: c.y, transform: `rotate(${c.r}deg)`, opacity: 0.9 }}>
          <MapleLeaf size={c.s} />
        </div>
      ))}

      {/* IDLE: slow gentle leaf-fall */}
      {back.map((l, i) => (
        <div key={`b${i}`} className="imv-fall absolute w-px" style={{ left: `${l.x}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
          <div className="imv-sway3" style={{ animationDuration: `${l.sw}s`, opacity: l.op }}>
            <MapleLeaf size={l.size} color="#c8785a" />
          </div>
        </div>
      ))}
      {front.map((l, i) => (
        <div key={`f${i}`} className="imv-fall absolute w-px" style={{ left: `${l.x}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
          <div className="imv-sway3" style={{ animationDuration: `${l.sw}s`, opacity: l.op }}>
            <MapleLeaf size={l.size} />
          </div>
        </div>
      ))}

      {/* BUZZ: STRONG WIND — bands + full-pane leaf sweep + litter liftoff */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-warmflash" style={{ animationDelay: "0.05s" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`band${i}`}
              className="imv-windband absolute"
              style={{ top: `${8 + i * 19}%`, animationDelay: `${i * 0.09}s`, animationDuration: "0.95s" }}
            />
          ))}
          {gust.map((l, i) => (
            <div key={`g${i}`} className="imv-windleaf absolute left-0 w-full" style={{ top: `${l.y}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
              <div className="imv-windspin" style={{ animationDuration: `${l.spin}s`, width: "fit-content" }}>
                <MapleLeaf size={l.size} color={i % 3 ? "#d4381e" : "#b8422e"} />
              </div>
            </div>
          ))}
          {litter.map((l, i) => (
            <div key={`lit${i}`} className="imv-liftoff absolute" style={{ left: l.x, top: `${l.y}%`, animationDelay: `${l.del}s` }}>
              <MapleLeaf size={l.s} color="#c05236" />
            </div>
          ))}
          {[0, 1, 2].map((i) => (
            <div key={`s${i}`} className="imv-streak" style={{ top: `${22 + i * 26}%`, animationDelay: `${0.12 + i * 0.14}s` }} />
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   FISHTANK — pale blue water, sage seaweed silhouettes from the
   bottom, small colourful fish cruising, tiny bubbles. BUZZ: the
   fish startle and dart away in a burst of bubbles.
   ================================================================== */

const Fish = ({ body = "#f2cf46", belly, stripe, flip = false, size = 26 }: { body?: string; belly?: string; stripe?: string; flip?: boolean; size?: number }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 40 25" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M33 12.5 L39 7 L38 12.5 L39 18 z" fill={body} stroke="rgba(70,50,10,0.35)" strokeWidth="0.7" />
    <path d="M4 12.5 Q14 3 26 8.5 Q30 10.5 30 12.5 Q30 14.5 26 16.5 Q14 22 4 12.5 z" fill={body} stroke="rgba(70,50,10,0.35)" strokeWidth="0.7" />
    {belly && <path d="M8 14.5 Q16 19 26 15.5 Q22 19.5 14 18.5 Q10.5 17.5 8 14.5 z" fill={belly} opacity="0.85" />}
    {stripe && <path d="M17 6.2 Q21 12 17.6 18.4" stroke={stripe} strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.9" />}
    <path d="M14 8.5 L18 4.5 L20 9 z" fill={body} stroke="rgba(70,50,10,0.3)" strokeWidth="0.6" />
    <circle cx="7.4" cy="11.4" r="1.15" fill="#222" />
  </svg>
);

const Weed = ({ x, h, w = 14, color = "#9db9a4", delay = 0, dur = 5 }: { x: string; h: number; w?: number; color?: string; delay?: number; dur?: number }) => (
  <div className="imv-weed absolute" style={{ left: x, bottom: "-2px", animationDelay: `${delay}s`, animationDuration: `${dur}s`, transformOrigin: "50% 100%" }}>
    <svg width={w} height={h} viewBox="0 0 20 100" preserveAspectRatio="none">
      <path d="M10 100 C4 82 14 70 8 52 C3 38 12 26 9 8 C9 4 11 2 12 0 C13 18 8 30 13 46 C18 62 8 78 14 94 C14 97 12 99 10 100 z" fill={color} />
    </svg>
  </div>
);

export function Fishtank({ buzz }: { buzz: number }) {
  const fish = [
    { top: "18%", dur: 26, flip: true, delay: 0, kind: "yellow" as const, size: 30 },
    { top: "34%", dur: 34, flip: false, delay: -12, kind: "clown" as const, size: 26 },
    { top: "52%", dur: 40, flip: true, delay: -25, kind: "blue" as const, size: 24 },
    { top: "66%", dur: 30, flip: false, delay: -6, kind: "orange" as const, size: 28 },
    { top: "27%", dur: 46, flip: false, delay: -33, kind: "small" as const, size: 16 },
  ];
  const bubbles = Array.from({ length: 7 }).map((_, i) => ({ x: 6 + i * 13.5, dur: 7 + (i % 4) * 2.4, del: -i * 1.7, s: 3 + (i % 3) * 2 }));
  const g = seeded(buzz * 5 + 11);
  const darters = Array.from({ length: 4 }).map((_, i) => ({ top: 16 + g() * 55, flip: i % 2 === 0, del: g() * 0.2, dur: 0.9 + g() * 0.3 }));

  return (
    <>
      {/* soft light shafts, faint */}
      <div className="imv-ray absolute left-[16%] top-0 h-full w-[13%]" style={{ animationDelay: "0s" }} />
      <div className="imv-ray absolute left-[58%] top-0 h-full w-[9%]" style={{ animationDelay: "3s" }} />

      {/* seaweed — sage silhouettes like the original */}
      <Weed x="3%" h={150} w={18} color="#9db9a4" dur={6} />
      <Weed x="8%" h={110} w={13} color="#8fb096" delay={1.4} dur={5.2} />
      <Weed x="88%" h={170} w={20} color="#9db9a4" delay={0.7} dur={6.4} />
      <Weed x="94%" h={120} w={14} color="#8fb096" delay={2} dur={5.6} />
      <Weed x="55%" h={78} w={12} color="#a7c2ab" delay={2.8} dur={4.8} />

      {/* sandy-sage floor */}
      <div className="absolute bottom-0 left-0 w-full h-[9%]" style={{ background: "linear-gradient(180deg, #b9cfb9, #adc2ba)" }} />
      <div className="absolute bottom-[8.4%] left-0 w-full h-[2px] bg-[#d7e4d4] opacity-60" />

      {/* cruising fish (behind text, above weeds) */}
      {fish.map((f, i) => (
        <div key={i} className="imv-fish absolute" style={{ top: f.top, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>
          <div className="imv-fishbob" style={{ animationDuration: `${2.6 + i * 0.4}s` }}>
            {f.kind === "yellow" && <Fish body="#f2cf46" belly="#f7e08a" flip={f.flip} size={f.size} />}
            {f.kind === "clown" && <Fish body="#f08a3c" stripe="#fdf4e8" flip={f.flip} size={f.size} />}
            {f.kind === "blue" && <Fish body="#5a8fd4" belly="#8fb4e4" flip={f.flip} size={f.size} />}
            {f.kind === "orange" && <Fish body="#e06a4a" belly="#eda07f" flip={f.flip} size={f.size} />}
            {f.kind === "small" && <Fish body="#8fae6e" flip={f.flip} size={f.size} />}
          </div>
        </div>
      ))}

      {/* idle bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="imv-bubble absolute rounded-full"
          style={{ left: `${b.x}%`, width: b.s, height: b.s, background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.25))", border: "1px solid rgba(255,255,255,0.6)", animationDuration: `${b.dur}s`, animationDelay: `${b.del}s` }}
        />
      ))}

      {/* BUZZ: fish startle + bubble eruption + sonar ring */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 imv-ring" />
          {darters.map((d, i) => (
            <div key={i} className="imv-dash absolute" style={{ top: `${d.top}%`, animationDelay: `${d.del}s`, animationDuration: `${d.dur}s`, transform: d.flip ? "scaleX(-1)" : undefined }}>
              <Fish body="#f2cf46" size={22} flip />
            </div>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`eb${i}`}
              className="imv-ebubble absolute rounded-full"
              style={{
                left: `${12 + ((i * 79) % 74)}%`,
                width: 4 + (i % 3) * 3,
                height: 4 + (i % 3) * 3,
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.25))",
                border: "1px solid rgba(255,255,255,0.6)",
                animationDelay: `${(i % 5) * 0.09}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   SNOWFLAKE — baby-blue sky, soft clouds on top, white snowflakes
   drifting, snowman with a "Y!" bubble bottom-right. BUZZ: a
   snowball fight — "watch the snowballs fly!" (official text).
   ================================================================== */

const Cloud = ({ x, y, w, op = 0.9, drift = false, dur = 9 }: { x: string; y: string; w: number; op?: number; drift?: boolean; dur?: number }) => (
  <div className={`absolute ${drift ? "imv-clouddrift" : ""}`} style={{ left: x, top: y, opacity: op, animationDuration: `${dur}s` }}>
    <svg width={w} height={w * 0.42} viewBox="0 0 120 50">
      <path d="M14 44 Q2 44 3 34 Q4 24 16 25 Q18 12 32 12 Q44 6 54 14 Q68 6 78 16 Q94 12 98 26 Q112 26 112 36 Q112 44 100 44 z" fill="#f8fbff" />
    </svg>
  </div>
);

const Snowman = () => (
  <div className="absolute bottom-[4%] right-[3%] w-[92px] h-[110px]">
    {/* "Y!" speech bubble, like the original thumb */}
    <div className="absolute left-[-38px] top-[2px] bg-white border border-[#9db8d8] rounded-[6px] px-[6px] py-[1px] shadow-[1px_1px_3px_rgba(40,70,120,0.25)]">
      <span className="text-[13px] font-black italic text-[#7a2fd0] leading-none">Y!</span>
      <div className="absolute right-[-5px] top-[6px] w-[8px] h-[8px] bg-white border-r border-b border-[#9db8d8] rotate-[-45deg]" />
    </div>
    <svg width="92" height="110" viewBox="0 0 92 110">
      {/* stick arms */}
      <path d="M24 66 L6 52 M6 52 L1 45 M6 52 L2 58" stroke="#8a6a48" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M68 66 L86 54 M86 54 L91 48 M86 54 L90 60" stroke="#8a6a48" strokeWidth="2.4" strokeLinecap="round" />
      {/* body + head */}
      <circle cx="46" cy="82" r="26" fill="#ffffff" stroke="#c9dbee" strokeWidth="1.6" />
      <circle cx="46" cy="44" r="17" fill="#ffffff" stroke="#c9dbee" strokeWidth="1.6" />
      {/* top hat */}
      <rect x="30" y="20" width="32" height="4.5" rx="2" fill="#2a2a2a" />
      <rect x="36" y="6" width="20" height="16" rx="2" fill="#2a2a2a" />
      <rect x="36" y="17" width="20" height="3.4" fill="#d4381e" />
      {/* face */}
      <circle cx="40.5" cy="41" r="1.7" fill="#222" />
      <circle cx="51.5" cy="41" r="1.7" fill="#222" />
      <path d="M42 46 L57 44.5 L42.8 49 z" fill="#f09030" />
      {/* coal buttons */}
      <circle cx="46" cy="74" r="2.2" fill="#222" />
      <circle cx="46" cy="83" r="2.2" fill="#222" />
      <circle cx="46" cy="92" r="2.2" fill="#222" />
    </svg>
  </div>
);

export function Snowflake({ buzz }: { buzz: number }) {
  const rnd = seeded(21);
  const flakes = Array.from({ length: 14 }).map((_, i) => ({
    x: 2 + i * 7 + rnd() * 5,
    dur: 13 + rnd() * 14,
    del: -rnd() * 24,
    s: 6 + rnd() * 10,
    op: 0.5 + rnd() * 0.45,
  }));
  const dots = Array.from({ length: 10 }).map((_, i) => ({ x: rnd() * 98, y: rnd() * 90, s: 2 + rnd() * 2, op: 0.5 + rnd() * 0.4 }));

  const g = seeded(buzz * 17 + 5);
  const balls = Array.from({ length: 9 }).map((_, i) => ({
    y: 12 + g() * 62,
    dur: 0.75 + g() * 0.45,
    del: g() * 0.55,
    s: 9 + g() * 7,
    rtl: i % 2 === 1,
  }));

  return (
    <>
      <Cloud x="4%" y="4%" w={92} drift dur={11} />
      <Cloud x="40%" y="2%" w={70} op={0.75} drift dur={13} />
      <Cloud x="74%" y="6%" w={84} op={0.85} drift dur={9} />

      {/* snow ground */}
      <svg className="absolute bottom-0 left-0 w-full h-[13%]" viewBox="0 0 400 50" preserveAspectRatio="none">
        <path d="M0 20 Q60 8 140 16 T280 12 T400 18 L400 50 L0 50 z" fill="#f4f9ff" />
      </svg>

      <Snowman />

      {/* drifting flakes */}
      {flakes.map((f, i) => (
        <div key={i} className="imv-snow absolute w-px" style={{ left: `${f.x}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.del}s` }}>
          <SnowflakeShape size={f.s} opacity={f.op} />
        </div>
      ))}
      {/* static speckles */}
      {dots.map((d, i) => (
        <div key={`d${i}`} className="absolute rounded-full bg-white" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, opacity: d.op }} />
      ))}

      {/* BUZZ: SNOWBALL FIGHT */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          {balls.map((b, i) => (
            <div
              key={i}
              className={b.rtl ? "imv-snowball-rl absolute" : "imv-snowball-lr absolute"}
              style={{ top: `${b.y}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.del}s` }}
            >
              <div
                className="rounded-full"
                style={{
                  width: b.s,
                  height: b.s,
                  background: "radial-gradient(circle at 34% 30%, #ffffff, #e8f1fa 62%, #cfdeee)",
                  boxShadow: "0 1px 3px rgba(60,90,140,0.35)",
                }}
              />
            </div>
          ))}
          {/* impact puffs */}
          {[
            { x: "30%", y: "34%", d: "0.5s" },
            { x: "58%", y: "62%", d: "0.72s" },
            { x: "44%", y: "22%", d: "0.95s" },
          ].map((p, i) => (
            <div key={`p${i}`} className="imv-snowpuff absolute" style={{ left: p.x, top: p.y, animationDelay: p.d }}>
              <svg width="34" height="24" viewBox="0 0 34 24">
                <circle cx="10" cy="14" r="6" fill="#fff" opacity="0.9" />
                <circle cx="20" cy="10" r="7.5" fill="#fff" opacity="0.85" />
                <circle cx="26" cy="16" r="5" fill="#fff" opacity="0.8" />
              </svg>
            </div>
          ))}
          {/* extra flurry whipped up */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`fl${i}`} className="imv-flurry absolute" style={{ top: `${8 + i * 11}%`, animationDuration: `${0.8 + (i % 4) * 0.18}s`, animationDelay: `${i * 0.07}s` }}>
              <SnowflakeShape size={7} opacity={0.8} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   FALLING HEARTS — pink #ffcccc frame with the rounded #fdbec1
   inner panel, flat red hearts. IDLE: hearts fall slowly. BUZZ: a
   virtual kiss (official: "use the buzz feature to give your loved
   one a virtual kiss").
   ================================================================== */

const LipsKiss = ({ size = 110 }: { size?: number }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 110 68">
    {/* lipstick-print kiss */}
    <g fill="#c2185b">
      <path d="M55 14 Q47 2 36 6 Q30 8 30 14 Q22 12 18 18 Q15 23 21 27 Q14 31 17 39 Q20 46 30 44 Q28 54 40 53 Q46 52.5 50 47 Q52 44.5 55 44 Q58 44.5 60 47 Q64 52.5 70 53 Q82 54 80 44 Q90 46 93 39 Q96 31 89 27 Q95 23 92 18 Q88 12 80 14 Q80 8 74 6 Q63 2 55 14 z" opacity="0.92" />
      {/* cupid's bow highlight */}
      <path d="M48 12 Q55 8 62 12 Q55 15 48 12 z" fill="#e8648f" />
      <path d="M30 27 Q42 22 55 27 Q68 22 80 27 Q68 34 55 30 Q42 34 30 27 z" fill="#8e0f42" opacity="0.55" />
    </g>
  </svg>
);

export function FallingHearts({ buzz }: { buzz: number }) {
  /* the flat inner panel from the original thumb */
  const statics = [
    { x: "10%", y: "12%", s: 20, r: -14, c: "#e8336d" },
    { x: "84%", y: "9%", s: 16, r: 18, c: "#d42045" },
    { x: "78%", y: "78%", s: 22, r: -8, c: "#e8336d" },
    { x: "12%", y: "80%", s: 14, r: 26, c: "#f2779a" },
    { x: "47%", y: "88%", s: 12, r: -20, c: "#d42045" },
  ];
  const rnd = seeded(31);
  const falling = Array.from({ length: 10 }).map((_, i) => ({
    x: 5 + i * 9.5 + rnd() * 6,
    dur: 12 + rnd() * 11,
    sw: 4 + rnd() * 3,
    s: 8 + rnd() * 9,
    del: -rnd() * 18,
    op: 0.6 + rnd() * 0.35,
    c: ["#e8336d", "#d42045", "#f2779a"][i % 3],
  }));
  const burst = Array.from({ length: 8 }).map((_, i) => {
    const ang = (i / 8) * Math.PI * 2 + 0.4;
    return { mx: Math.cos(ang) * 90, my: Math.sin(ang) * 64, s: 10 + (i % 3) * 5, del: i * 0.05 };
  });

  return (
    <>
      {/* inner rounded panel, exactly like the original two-tone thumb */}
      <div className="absolute inset-[5.5%] rounded-[14px]" style={{ background: "#fdbec1", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }} />

      {statics.map((h, i) => (
        <div key={i} className="absolute" style={{ left: h.x, top: h.y, transform: `rotate(${h.r}deg)` }}>
          <HeartShape size={h.s} color={h.c} />
        </div>
      ))}

      {/* slow falling hearts */}
      {falling.map((h, i) => (
        <div key={i} className="imv-fall absolute w-px" style={{ left: `${h.x}%`, animationDuration: `${h.dur}s`, animationDelay: `${h.del}s` }}>
          <div className="imv-sway2" style={{ animationDuration: `${h.sw}s`, opacity: h.op }}>
            <HeartShape size={h.s} color={h.c} />
          </div>
        </div>
      ))}

      {/* BUZZ: virtual kiss */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 imv-kiss">
            <LipsKiss size={116} />
          </div>
          {burst.map((b, i) => (
            <div key={i} className="imv-heartburst absolute left-1/2 top-[44%]" style={{ animationDelay: `${b.del}s` }}>
              <div style={{ transform: `translate(${b.mx}px, ${b.my}px)` }}>
                <HeartShape size={b.s} color={i % 2 ? "#e8336d" : "#f2779a"} />
              </div>
            </div>
          ))}
          {["18%", "70%", "84%"].map((x, i) => (
            <div key={`sp${i}`} className="imv-sparkle absolute" style={{ left: x, top: `${18 + i * 22}%`, animationDelay: `${i * 0.5}s` }}>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 z" fill="#fff5b8" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   PURPLE LEAVES — lavender sky (#e7cfe7), white cloud band along
   the bottom, deep-purple tree silhouettes on the right, purple
   maples "gently falling / fluttering in the breeze". BUZZ: a
   purple gust sweeps the pane.
   ================================================================== */

const PurpleTree = ({ x, bottom, h, w, sway = false, dur = 6 }: { x: string; bottom: string; h: number; w: number; sway?: boolean; dur?: number }) => (
  <svg
    className={`absolute ${sway ? "imv-treesway" : ""}`}
    style={{ left: x, bottom, animationDuration: `${dur}s` }}
    width={w}
    height={h}
    viewBox="0 0 80 160"
  >
    <g fill="#52205b">
      <rect x="37" y="70" width="7" height="90" rx="3" />
      <path d="M40 96 L24 78 L28 76 L42 90 z" />
      <path d="M41 110 L58 92 L62 95 L44 114 z" />
      {/* canopies */}
      <ellipse cx="40" cy="34" rx="30" ry="26" />
      <ellipse cx="18" cy="52" rx="18" ry="15" />
      <ellipse cx="63" cy="52" rx="19" ry="15" />
      <ellipse cx="40" cy="62" rx="24" ry="16" />
    </g>
  </svg>
);

export function PurpleLeaves({ buzz }: { buzz: number }) {
  const rnd = seeded(51);
  const leaves = Array.from({ length: 12 }).map((_, i) => ({
    x: 3 + i * 8.2 + rnd() * 5,
    dur: 13 + rnd() * 12,
    sw: 4 + rnd() * 3,
    s: 9 + rnd() * 8,
    del: -rnd() * 20,
    op: 0.55 + rnd() * 0.4,
    c: ["#8a3d9f", "#6d2a78", "#a45cb0"][i % 3],
  }));
  const g = seeded(buzz * 23 + 9);
  const gust = Array.from({ length: 14 }).map((_, i) => ({
    y: 5 + ((i * 63) % 86),
    dur: 0.9 + g() * 0.5,
    spin: 0.6 + g() * 0.4,
    size: 9 + g() * 9,
    del: g() * 0.5,
  }));

  return (
    <>
      {/* soft lighter wash top-centre, like the original gradient sky */}
      <div className="absolute inset-x-0 top-0 h-[45%]" style={{ background: "linear-gradient(180deg, rgba(250,244,250,0.85), rgba(250,244,250,0) 90%)" }} />

      {/* small tree on the left, tall cluster on the right (original layout) */}
      <PurpleTree x="7%" bottom="10%" h={92} w={46} />
      <PurpleTree x="78%" bottom="0%" h={190} w={95} sway dur={6.5} />
      <PurpleTree x="64%" bottom="0%" h={140} w={70} sway dur={7.4} />

      {/* white cloud band along the bottom */}
      <svg className="absolute bottom-0 left-0 w-full h-[16%]" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0 40 Q30 26 62 36 Q90 22 122 34 Q150 20 185 32 Q215 18 250 30 Q285 20 315 34 Q350 24 400 34 L400 60 L0 60 z" fill="#f8faf7" />
        <path d="M0 50 Q60 40 120 48 T260 46 T400 48 L400 60 L0 60 z" fill="#ffffff" />
      </svg>
      <Cloud x="8%" y="58%" w={64} op={0.9} drift dur={14} />
      <Cloud x="52%" y="64%" w={52} op={0.7} drift dur={17} />

      {/* gently falling / fluttering purple leaves */}
      {leaves.map((l, i) => (
        <div key={i} className="imv-fall absolute w-px" style={{ left: `${l.x}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
          <div className="imv-sway2" style={{ animationDuration: `${l.sw}s`, opacity: l.op }}>
            <MapleLeaf size={l.s} color={l.c} />
          </div>
        </div>
      ))}

      {/* BUZZ: purple gust */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={`b${i}`} className="imv-windband-pl imv-windband absolute" style={{ top: `${10 + i * 22}%`, animationDelay: `${i * 0.1}s`, animationDuration: "0.95s" }} />
          ))}
          {gust.map((l, i) => (
            <div key={`g${i}`} className="imv-windleaf absolute left-0 w-full" style={{ top: `${l.y}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
              <div className="imv-windspin" style={{ animationDuration: `${l.spin}s`, width: "fit-content" }}>
                <MapleLeaf size={l.size} color={i % 2 ? "#8a3d9f" : "#6d2a78"} />
              </div>
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`s${i}`} className="imv-streak-pl imv-streak" style={{ top: `${30 + i * 30}%`, animationDelay: `${0.15 + i * 0.2}s` }} />
          ))}
        </div>
      )}
    </>
  );
}
