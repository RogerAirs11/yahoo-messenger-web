"use client";

/* ==================================================================
   REAL Yahoo! Messenger IMVironments — composed from the GENUINE
   Yahoo artwork itself. The actual art elements (dappled oak canopy,
   tan hill, five maple leaves, four fish, six snowflakes, the snowman
   with his "Y!" bubble, the giant pale heart, glossy hearts, purple
   trees and maples, clouds) were extracted pixel-for-pixel from the
   original imvironments recovered from Yahoo's own CDN
   (public/assets/imv/sprites/*, positions from manifest.json).

   Layout percentages = the exact coordinates the elements occupy in
   the genuine 154x94 art, applied to the message pane. Idle motion is
   gentle; BUZZ does exactly what Yahoo's official text promises:
     • Autumn Leaves  — "Buzz blows the leaves with the wind"
     • Fishtank       — the school startles and darts away
     • Snowflake      — "watch the snowballs fly!"
     • Falling Hearts — "a virtual kiss for your loved one"
     • Purple Leaves  — "leaves flutter in the breeze"
   ================================================================== */

import React from "react";

const SPR = (name: string) => `/assets/imv/sprites/${name}.png`;

/* a genuine Yahoo art sprite, positioned in % of the pane exactly like
   the manifest recorded it from the original artwork */
function Sprite({
  name,
  x,
  y,
  w,
  flip = false,
  opacity = 1,
  className,
  style,
}: {
  name: string;
  x: number;
  y: number;
  w: number;
  flip?: boolean;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={SPR(name)}
      alt=""
      draggable={false}
      className={`absolute ${className ?? ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        opacity,
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
    />
  );
}

/* small helper: one falling genuine leaf (idle snow-globe motion) */
function FallingSprite({
  name,
  x,
  size,
  dur,
  sw,
  del,
  op = 0.9,
  flip,
}: {
  name: string;
  x: number;
  size: number;
  dur: number;
  sw: number;
  del: number;
  op?: number;
  flip?: boolean;
}) {
  return (
    <div className="imv-fall absolute w-px" style={{ left: `${x}%`, animationDuration: `${dur}s`, animationDelay: `${del}s` }}>
      <div className="imv-sway3" style={{ animationDuration: `${sw}s`, opacity: op }}>
        <img src={SPR(name)} alt="" draggable={false} style={{ width: `${size}%`, minWidth: 22, transform: flip ? "scaleX(-1)" : undefined }} />
      </div>
    </div>
  );
}

/* deterministic PRNG so layouts are stable across re-renders / SSR */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ==================================================================
   AUTUMN LEAVES — the genuine cream field (#ffefad), Yahoo's dappled
   oak canopy and diagonal tan hill at their true coordinates, and the
   five real maple leaves. Idle: leaves fall slowly. BUZZ: strong wind
   sweeps every leaf across the pane (official Yahoo behaviour).
   ================================================================== */

export function AutumnLeaves({ buzz }: { buzz: number }) {
  /* idle slow fall — genuine leaf art, two depths, deliberately calm */
  const rnd = seeded(7);
  const back = Array.from({ length: 5 }).map((_, i) => ({
    x: 6 + i * 19 + rnd() * 9,
    dur: 26 + rnd() * 12,
    sw: 5.5 + rnd() * 3,
    size: 4.5 + rnd() * 2.5,
    del: -rnd() * 30,
    name: i % 2 ? "leaves-leaf8" : "leaves-leaf4",
    op: 0.45,
  }));
  const front = Array.from({ length: 7 }).map((_, i) => ({
    x: 2 + i * 14 + rnd() * 7,
    dur: 17 + rnd() * 10,
    sw: 4.5 + rnd() * 3,
    size: 6 + rnd() * 4,
    del: -rnd() * 22,
    name: ["leaves-leaf4", "leaves-leaf7", "leaves-leaf8"][i % 3],
    op: 0.85,
  }));
  /* buzz gust — genuine leaves seized by the wind */
  const g = seeded(buzz * 13 + 3);
  const gust = Array.from({ length: 14 }).map((_, i) => ({
    y: 4 + ((i * 61) % 88),
    dur: 0.85 + g() * 0.5,
    spin: 0.55 + g() * 0.4,
    w: 5 + g() * 5,
    del: g() * 0.5,
    name: ["leaves-leaf4", "leaves-leaf7", "leaves-leaf8", "leaves-leaf1"][i % 4],
  }));
  const litter = Array.from({ length: 7 }).map((_, i) => ({
    x: 8 + ((i * 137) % 78),
    y: 80 + ((i * 29) % 12),
    w: 4 + ((i * 7) % 4),
    del: i * 0.06,
  }));

  return (
    <>
      {/* the REAL dappled canopy + tan hill, at the REAL coordinates */}
      <Sprite name="leaves-tree" x={39.61} y={4.26} w={54.55} className="imv-branch-shake" />
      <Sprite name="leaves-hill" x={6.49} y={62.77} w={93.51} />

      {/* the genuine maple leaves, exactly where Yahoo placed them */}
      <Sprite name="leaves-leaf1" x={34.42} y={-1.5} w={16.88} />
      <Sprite name="leaves-leaf4" x={81.82} y={17.02} w={18.18} />
      <Sprite name="leaves-leaf7" x={0} y={65.96} w={16.88} />
      <Sprite name="leaves-leaf8" x={55.19} y={69.15} w={14.94} />

      {/* IDLE: slow gentle leaf-fall of the same genuine leaves */}
      {back.map((l, i) => (
        <FallingSprite key={`b${i}`} name={l.name} x={l.x} size={l.size} dur={l.dur} sw={l.sw} del={l.del} op={l.op} />
      ))}
      {front.map((l, i) => (
        <FallingSprite key={`f${i}`} name={l.name} x={l.x} size={l.size} dur={l.dur} sw={l.sw} del={l.del} op={l.op} flip={i % 2 === 1} />
      ))}

      {/* BUZZ: STRONG WIND — bands + full-pane leaf sweep + litter liftoff */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-warmflash" style={{ animationDelay: "0.05s" }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={`band${i}`} className="imv-windband absolute" style={{ top: `${8 + i * 19}%`, animationDelay: `${i * 0.09}s`, animationDuration: "0.95s" }} />
          ))}
          {gust.map((l, i) => (
            <div key={`g${i}`} className="imv-windleaf absolute left-0 w-full" style={{ top: `${l.y}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
              <div className="imv-windspin" style={{ animationDuration: `${l.spin}s`, width: "fit-content" }}>
                <img src={SPR(l.name)} alt="" draggable={false} style={{ width: `${l.w}%`, minWidth: 26 }} />
              </div>
            </div>
          ))}
          {litter.map((l, i) => (
            <div key={`lit${i}`} className="imv-liftoff absolute" style={{ left: `${l.x}%`, top: `${l.y}%`, animationDelay: `${l.del}s` }}>
              <img src={SPR(i % 2 ? "leaves-leaf8" : "leaves-leaf4")} alt="" draggable={false} style={{ width: `${l.w}%`, minWidth: 20 }} />
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
   FISHTANK — Yahoo's real fish (silver-red drummer, yellow tang,
   clownfish, golden schoolmate) cruising pale water (#c2dae6 →
   #95b3b6) over soft kelp. BUZZ: the school startles and darts off
   in a burst of bubbles.
   ================================================================== */

const Kelp = ({ x, h, w = 12, color = "#9cb99b", delay = 0, dur = 5.5 }: { x: string; h: number; w?: number; color?: string; delay?: number; dur?: number }) => (
  <div className="imv-weed absolute" style={{ left: x, bottom: "-2px", animationDelay: `${delay}s`, animationDuration: `${dur}s`, transformOrigin: "50% 100%" }}>
    <svg width={w} height={h} viewBox="0 0 20 100" preserveAspectRatio="none">
      <path d="M10 100 C4 82 14 70 8 52 C3 38 12 26 9 8 C9 4 11 2 12 0 C13 18 8 30 13 46 C18 62 8 78 14 94 C14 97 12 99 10 100 z" fill={color} />
    </svg>
  </div>
);

export function Fishtank({ buzz }: { buzz: number }) {
  /* genuine fish drift gently around the exact coordinates Yahoo put them at */
  const residents = [
    { name: "fish1", x: 64.29, y: 21.28, w: 20.13, dur: 11, dr: 7 },
    { name: "fish2", x: 53.9, y: 46.81, w: 19.48, dur: 14, dr: -6 },
    { name: "fish3", x: 28.57, y: 59.57, w: 18.83, dur: 12, dr: 8 },
    { name: "fish1", x: 12, y: 8, w: 11, dur: 16, dr: -7 }, /* the little golden schoolmate */
  ];
  const bubbles = Array.from({ length: 7 }).map((_, i) => ({ x: 8 + i * 12.5, dur: 7 + (i % 4) * 2.4, del: -i * 1.7, s: 3 + (i % 3) * 2 }));
  const g = seeded(buzz * 5 + 11);
  const darters = Array.from({ length: 4 }).map((_, i) => ({ top: 16 + g() * 55, flip: i % 2 === 0, del: g() * 0.2, dur: 0.9 + g() * 0.3 }));

  return (
    <>
      {/* kelp — sage blades like the original art */}
      <Kelp x="2%" h={150} w={18} color="#a4c0a6" dur={6} />
      <Kelp x="7.5%" h={105} w={13} color="#93b29c" delay={1.4} dur={5.2} />
      <Kelp x="12%" h={70} w={10} color="#acc6ae" delay={2.6} dur={4.6} />
      <Kelp x="84%" h={165} w={20} color="#a4c0a6" delay={0.7} dur={6.4} />
      <Kelp x="90%" h={115} w={14} color="#93b29c" delay={2} dur={5.6} />
      <Kelp x="95%" h={80} w={10} color="#acc6ae" delay={3.1} dur={4.4} />
      <Kelp x="57%" h={60} w={9} color="#b2cab2" delay={2.2} dur={4.8} />

      {/* soft light dapple from the surface */}
      <div className="imv-caustic absolute left-[12%] top-[4%] h-[26%] w-[22%]" />
      <div className="imv-caustic absolute left-[55%] top-[10%] h-[20%] w-[18%]" style={{ animationDelay: "2.6s" }} />

      {/* the REAL fish, at the REAL coordinates, breathing gently */}
      {residents.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, animation: `imv-drift ${f.dur}s ease-in-out ${-i * 3}s infinite alternate` }}
        >
          <div className="imv-fishbob" style={{ animationDuration: `${2.6 + i * 0.5}s` }}>
            <img src={SPR(f.name)} alt="" draggable={false} style={{ width: "100%", transform: f.dr < 0 ? undefined : "scaleX(-1)" }} />
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

      {/* BUZZ: the school startles + bubble eruption + sonar ring */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 imv-ring" />
          {darters.map((d, i) => (
            <div key={i} className="imv-dash absolute" style={{ top: `${d.top}%`, animationDelay: `${d.del}s`, animationDuration: `${d.dur}s`, transform: d.flip ? "scaleX(-1)" : undefined }}>
              <img src={SPR(i % 2 ? "fish2" : "fish3")} alt="" draggable={false} style={{ width: 34 }} />
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
   SNOWFLAKE — Yahoo's baby-blue sky (#b3d8fc), pale cloud bands, the
   six genuine snowflakes and the genuine snowman with his "Y!" bubble.
   BUZZ: a snowball fight — "watch the snowballs fly!" (official).
   ================================================================== */

export function Snowflake({ buzz }: { buzz: number }) {
  const flakes = [
    { name: "snow-flake1", x: 2.6, y: 28.72, w: 8.44 },
    { name: "snow-flake2", x: 9.74, y: 32.98, w: 5.84 },
    { name: "snow-flake3", x: 3.9, y: 40.43, w: 4.55 },
    { name: "snow-flake4", x: 25.97, y: 45.74, w: 7.79 },
    { name: "snow-flake5", x: 22.08, y: 65.96, w: 8.44 },
    { name: "snow-flake6", x: 8.44, y: 74.47, w: 5.84 },
  ];
  const rnd = seeded(21);
  const falling = Array.from({ length: 6 }).map((_, i) => ({
    x: 4 + i * 16 + rnd() * 8,
    dur: 22 + rnd() * 14,
    sw: 6 + rnd() * 3,
    size: 3.5 + rnd() * 3,
    del: -rnd() * 30,
    name: flakes[i % flakes.length].name,
  }));
  const g = seeded(buzz * 9 + 2);
  const balls = Array.from({ length: 6 }).map((_, i) => ({
    top: 8 + g() * 55,
    dur: 0.8 + g() * 0.4,
    del: g() * 0.6,
    lr: i % 2 === 0,
    s: 9 + g() * 8,
  }));

  return (
    <>
      {/* pale cloud band along the top, like the genuine art */}
      <svg className="absolute top-0 left-0 w-full h-[16%]" viewBox="0 0 400 40" preserveAspectRatio="none">
        <path d="M0 40 L0 24 Q22 10 48 20 Q70 4 100 16 Q128 2 158 18 Q186 6 214 18 Q244 2 274 16 Q302 6 330 18 Q360 8 400 22 L400 40 z" fill="#cbe3fc" />
        <path d="M0 40 L0 32 Q40 22 84 30 Q130 20 176 30 Q224 20 268 30 Q316 22 400 32 L400 40 z" fill="#d8e9fc" opacity="0.8" />
      </svg>

      {/* the genuine snowflakes, parked where Yahoo put them */}
      {flakes.map((f, i) => (
        <Sprite key={i} name={f.name} x={f.x} y={f.y} w={f.w} className="imv-twinkle" style={{ animationDuration: `${4 + i * 0.7}s`, animationDelay: `${-i * 1.3}s` }} />
      ))}

      {/* extra flakes drifting down, same genuine art */}
      {falling.map((f, i) => (
        <FallingSprite key={`fall${i}`} name={f.name} x={f.x} size={f.size} dur={f.dur} sw={f.sw} del={f.del} op={0.85} />
      ))}

      {/* the REAL snowman with his "Y!" speech bubble */}
      <Sprite name="snow-snowman" x={58.44} y={50} w={41.56} />

      {/* white snow ground */}
      <svg className="absolute bottom-0 left-0 w-full h-[10%]" viewBox="0 0 400 24" preserveAspectRatio="none">
        <path d="M0 24 L0 12 Q30 4 62 10 Q96 2 130 10 Q166 3 200 9 Q236 2 270 10 Q306 3 340 9 Q372 4 400 11 L400 24 z" fill="#eef6ff" />
      </svg>

      {/* BUZZ: snowball fight — balls fly both ways, puffs on landing */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          {balls.map((b, i) =>
            b.lr ? (
              <div key={i} className="imv-snowball-lr absolute" style={{ top: `${b.top}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.del}s` }}>
                <div className="rounded-full" style={{ width: b.s, height: b.s, background: "radial-gradient(circle at 35% 30%, #ffffff, #dceafc 70%, #c6dcf2)", boxShadow: "0 1px 3px rgba(120,160,210,0.5)" }} />
              </div>
            ) : (
              <div key={i} className="imv-snowball-rl absolute" style={{ top: `${b.top}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.del}s` }}>
                <div className="rounded-full" style={{ width: b.s, height: b.s, background: "radial-gradient(circle at 35% 30%, #ffffff, #dceafc 70%, #c6dcf2)", boxShadow: "0 1px 3px rgba(120,160,210,0.5)" }} />
              </div>
            ),
          )}
          {[0, 1, 2].map((i) => (
            <div key={`p${i}`} className="imv-snowpuff absolute" style={{ left: `${18 + i * 30}%`, bottom: "12%", animationDelay: `${0.5 + i * 0.35}s` }} />
          ))}
        </div>
      )}
    </>
  );
}

/* ==================================================================
   FALLING HEARTS — flat pink (#ffcccc), the giant pale heart and the
   glossy red hearts from the genuine art. BUZZ: the official virtual
   kiss — a lipstick stamp and a burst of hearts.
   ================================================================== */

export function FallingHearts({ buzz }: { buzz: number }) {
  const rnd = seeded(11);
  const floaters = [
    { x: 8, y: 20, w: 5.5, dur: 6.5, del: 0, op: 0.9 },
    { x: 62, y: 62, w: 7, dur: 7.5, del: -2, op: 0.95 },
    { x: 90, y: 52, w: 4.5, dur: 6, del: -4, op: 0.8 },
    { x: 10, y: 78, w: 4, dur: 8, del: -1, op: 0.75 },
    { x: 88, y: 80, w: 6.5, dur: 7, del: -3, op: 0.85 },
    { x: 78, y: 8, w: 4, dur: 6.2, del: -5, op: 0.7 },
  ].map((f, i) => ({ ...f, x: f.x + rnd() * 4 - 2, name: `hearts-heart${(i % 3) + 1}` }));

  return (
    <>
      {/* the giant pale heart, exactly where the genuine art places it */}
      <Sprite name="hearts-big" x={9.74} y={0} w={81.17} className="imv-heartbeat" style={{ animationDuration: "7s" }} />

      {/* glossy red hearts, real positions */}
      <Sprite name="hearts-heart1" x={66.88} y={19.15} w={11.69} />
      <Sprite name="hearts-heart2" x={36.36} y={32.98} w={11.69} />
      <Sprite name="hearts-heart3" x={25.32} y={47.87} w={11.69} />

      {/* more of the same genuine hearts, floating gently */}
      {floaters.map((f, i) => (
        <div key={i} className="imv-float absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, opacity: f.op, animationDuration: `${f.dur}s`, animationDelay: `${f.del}s` }}>
          <img src={SPR(f.name)} alt="" draggable={false} style={{ width: "100%" }} />
        </div>
      ))}

      {/* BUZZ: the virtual kiss */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          <div className="absolute inset-0 imv-roseflash" />
          <div className="imv-kiss absolute" style={{ left: "38%", top: "30%" }} />
          <div className="imv-heartburst absolute left-1/2 top-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <img key={i} src={SPR(`hearts-heart${(i % 3) + 1}`)} alt="" draggable={false} className="absolute" style={{ width: 16 + (i % 3) * 8, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ==================================================================
   PURPLE LEAVES — lavender sky (#e7cfe7), Yahoo's purple trees on the
   dark hill, white clouds, genuine purple maples "gently fluttering in
   the breeze". BUZZ: a lavender gust sweeps the leaves.
   ================================================================== */

export function PurpleLeaves({ buzz }: { buzz: number }) {
  const rnd = seeded(31);
  const falling = Array.from({ length: 6 }).map((_, i) => ({
    x: 5 + i * 16 + rnd() * 8,
    dur: 20 + rnd() * 12,
    sw: 5.5 + rnd() * 3,
    size: 4 + rnd() * 3,
    del: -rnd() * 26,
    op: 0.5 + rnd() * 0.4,
  }));
  const g = seeded(buzz * 17 + 5);
  const gust = Array.from({ length: 12 }).map((_, i) => ({
    y: 6 + ((i * 53) % 84),
    dur: 0.9 + g() * 0.5,
    spin: 0.6 + g() * 0.4,
    w: 3.5 + g() * 4,
    del: g() * 0.5,
  }));

  return (
    <>
      {/* purple trees + hill — the genuine cluster, bottom right */}
      <Sprite name="purple-trees" x={63.46} y={39.29} w={36.54} className="imv-treesway" style={{ animationDuration: "9s" }} />

      {/* genuine white clouds */}
      <Sprite name="purple-cloud1" x={42.31} y={60.71} w={23.72} className="imv-clouddrift" style={{ animationDuration: "26s" }} />
      <Sprite name="purple-cloud1" x={58} y={44} w={14} opacity={0.8} className="imv-clouddrift" style={{ animationDuration: "34s", animationDelay: "-9s" }} />

      {/* genuine purple maples — one dark, the others pale like the art */}
      <Sprite name="purple-leaf1" x={66.67} y={9.52} w={9.62} />
      <Sprite name="purple-leaf1" x={28} y={18} w={7.5} opacity={0.38} flip />
      <Sprite name="purple-leaf1" x={38} y={47} w={5.5} opacity={0.5} className="imv-twinkle" style={{ animationDuration: "7.5s", animationDelay: "-2s" }} />

      {/* idle: gentle flutter-fall of the genuine leaf */}
      {falling.map((f, i) => (
        <FallingSprite key={i} name="purple-leaf1" x={f.x} size={f.size} dur={f.dur} sw={f.sw} del={f.del} op={f.op} flip={i % 2 === 1} />
      ))}

      {/* BUZZ: the breeze — lavender wind bands + leaf sweep */}
      {buzz > 0 && (
        <div key={buzz} className="absolute inset-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={`b${i}`} className="imv-windband-pl absolute" style={{ top: `${10 + i * 22}%`, animationDelay: `${i * 0.11}s` }} />
          ))}
          {gust.map((l, i) => (
            <div key={`g${i}`} className="imv-windleaf absolute left-0 w-full" style={{ top: `${l.y}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }}>
              <div className="imv-windspin" style={{ animationDuration: `${l.spin}s`, width: "fit-content" }}>
                <img src={SPR("purple-leaf1")} alt="" draggable={false} style={{ width: `${l.w}%`, minWidth: 20, opacity: i % 3 ? 1 : 0.5 }} />
              </div>
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`s${i}`} className="imv-streak-pl" style={{ top: `${28 + i * 30}%`, animationDelay: `${0.15 + i * 0.2}s` }} />
          ))}
        </div>
      )}
    </>
  );
}
