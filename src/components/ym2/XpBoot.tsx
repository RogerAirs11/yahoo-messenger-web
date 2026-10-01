"use client";

import { useEffect, useState } from "react";
import { ME } from "./data";
import { playXpShutdown } from "./sounds";

/* =====================================================================
   The genuine Windows XP boot → welcome experience.
   Boot: black screen, Microsoft Windows XP logo, the classic 3-block
   blue progress bar sliding forever, copyright footer.
   Welcome: the blue Luna welcome screen — "To begin, click your user
   name" + user tile. Clicking the tile fires onEnter (parent plays the
   REAL XP startup sound as the desktop fades in).
   ===================================================================== */

/* The Windows flag — 4 wavy panes, faithful proportions */
export function XpFlag({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.92} viewBox="0 0 48 44" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,30,0.4))" }}>
      {/* left column (red / blue) */}
      <path d="M3 9 C9.5 3.6 16.5 2.2 22.4 3 L22.4 18.6 C16.5 17.8 9.5 19.2 3 24.4 Z" fill="#f14c14" />
      <path d="M3 27.6 C9.5 22.6 16.5 21.4 22.4 22.2 L22.4 37.6 C16.5 36.8 9.5 38.2 3 43.2 Z" fill="#0f9fe0" />
      {/* right column (green / yellow), lifted like a flying flag */}
      <path d="M25.6 3.3 C31.5 4.2 39 6 45 8.6 L45 24 C39 21.6 31.5 19.8 25.6 18.9 Z" fill="#7db700" />
      <path d="M25.6 22 C31.5 22.9 39 24.7 45 27.3 L45 42.4 C39 40.2 31.5 38.4 25.6 37.5 Z" fill="#ffb900" />
    </svg>
  );
}

/* Boot screen -------------------------------------------------------- */
export function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 4300);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="absolute inset-0 z-[10000] bg-black flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onDone}
      title="Click to skip"
    >
      {/* logo — flag LEFT of the wordmark, exactly like the real boot screen */}
      <div className="flex items-center" style={{ marginTop: "-6vh", gap: 18 }}>
        <XpFlag size={94} />
        <div className="leading-none" style={{ fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
          <div className="text-white/90 text-[14px] tracking-wide mb-1.5">Microsoft®</div>
          <div
            className="text-white text-[48px] font-bold italic tracking-tight"
            style={{ textShadow: "0 2px 8px rgba(120,160,255,0.35)" }}
          >
            Windows<span className="align-top text-[25px] font-bold ml-1" style={{ color: "#f65314" }}>xp</span>
          </div>
        </div>
      </div>

      {/* the classic progress bar: recessed track, 3 blue blocks sliding */}
      <div className="mt-16">
        <div
          className="w-[216px] h-[16px] rounded-[8px] overflow-hidden relative"
          style={{
            background: "linear-gradient(180deg, #101010, #1c1c1c)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9), inset 0 -1px 1px rgba(255,255,255,0.08), 0 0 0 1px #2a2a2a",
          }}
        >
          <div className="xp-bootbar absolute top-[2px] bottom-[2px] flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[15px] rounded-[4px]"
                style={{
                  background: "linear-gradient(180deg, #8ab2f5 0%, #4a80e8 45%, #2a5fc4 100%)",
                  boxShadow: "0 0 7px rgba(90,140,255,0.6)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="absolute bottom-5 left-0 right-0 flex items-end justify-between px-8 text-white/55 text-[11px]">
        <span>Copyright © 1985-2001 Microsoft Corporation</span>
        <span className="italic font-bold text-[15px] text-white/70" style={{ fontFamily: "'Franklin Gothic Medium', Arial, sans-serif" }}>
          Microsoft
        </span>
      </div>
    </div>
  );
}

/* Welcome screen ----------------------------------------------------- */
export function WelcomeScreen({ onEnter, onTurnOff }: { onEnter: () => void; onTurnOff: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [off, setOff] = useState(false);

  const enter = () => {
    if (leaving || off) return;
    setLeaving(true);
    onEnter(); // parent plays the genuine XP startup sound on this user gesture
  };

  const turnOff = () => {
    if (off || leaving) return;
    setOff(true);
    playXpShutdown();
    window.setTimeout(onTurnOff, 2600);
  };

  return (
    <div
      className="absolute inset-0 z-[10000] select-none xp-welcome"
      style={{
        opacity: off ? 1 : leaving ? 0 : 1,
        transition: off ? "opacity 1.2s ease 0.3s" : "opacity 0.7s ease 1.1s",
        pointerEvents: off ? "none" : "auto",
      }}
    >
      {/* top band */}
      <div className="absolute top-0 left-0 right-0 h-[72px] xp-welcome-band" />

      {/* bottom band */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[64px] xp-welcome-band"
        style={{ boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.14), 0 -2px 8px rgba(0,10,50,0.4)" }}
      />

      {/* VERTICAL divider between the halves, like the real logon screen —
          it swings away once a user is picked */}
      <div
        className="absolute top-[74px] bottom-[66px] left-1/2 w-[2px] -ml-[1px]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.8) 14%, rgba(255,255,255,0.8) 86%, transparent 100%)",
          boxShadow: "0 0 7px rgba(190,215,255,0.55)",
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateX(-160px)" : "none",
          transition: "opacity 0.5s ease, transform 0.7s ease",
        }}
      />

      {/* left half — the XP brand; after picking a user the big italic
          "welcome" fades in beneath it, exactly like the real logonui flow */}
      <div className="absolute left-0 top-[72px] bottom-[64px] w-1/2 flex flex-col items-center justify-center gap-9">
        <div className="flex items-center gap-4">
          <XpFlag size={62} />
          <div className="leading-none" style={{ fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            <div className="text-white/90 text-[13px] tracking-wide mb-1.5">Microsoft®</div>
            <div
              className="text-white text-[33px] font-bold italic tracking-tight"
              style={{ textShadow: "0 2px 6px rgba(0,10,60,0.6)" }}
            >
              Windows<span className="align-top text-[18px] font-bold ml-1" style={{ color: "#ffb03a" }}>xp</span>
            </div>
          </div>
        </div>
        <div
          style={{
            maxHeight: leaving ? 110 : 0,
            opacity: leaving ? 1 : 0,
            transition: "max-height 0.75s cubic-bezier(0.3, 0.7, 0.3, 1) 0.12s, opacity 0.6s ease 0.18s",
          }}
        >
          <div
            className="text-white"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 76,
              fontWeight: 500,
              textShadow: "0 2px 12px rgba(0,10,60,0.7)",
              letterSpacing: "0.01em",
            }}
          >
            welcome
          </div>
        </div>
      </div>

      {/* right half — instruction at the TOP, user list below it; the whole
          pane slides away when a user is picked, like the real thing */}
      <div
        className="absolute right-0 top-[72px] bottom-[64px] w-1/2 flex flex-col pt-[9%]"
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateX(-70px)" : "none",
          transition: "opacity 0.45s ease, transform 0.55s ease",
          pointerEvents: leaving ? "none" : "auto",
        }}
      >
        <div className="text-white/95 text-[13.5px] mb-7 pl-[10%]">To begin, click your user name</div>
        <button
          className="xp-welcome-tile flex items-center gap-3.5 p-2.5 rounded w-[300px] text-left ml-[8%]"
          onClick={enter}
        >
          <span className="w-[54px] h-[54px] rounded-[5px] bg-white p-[3px] shadow-md inline-flex shrink-0">
            <img src={ME.avatar} alt="" className="w-full h-full rounded-[3px] object-cover" />
          </span>
          <span className="text-white text-[19px] font-semibold" style={{ textShadow: "0 1px 3px rgba(0,10,60,0.6)" }}>
            {ME.name}
          </span>
        </button>
      </div>

      {/* Turn off computer — bottom band, RIGHT corner like the real welcome */}
      <div className="absolute bottom-0 right-0 h-[64px] flex items-center pr-[4.5%] z-10">
        <button
          className="flex items-center gap-2 text-white/90 hover:text-white text-[13px] px-3 py-1.5 rounded hover:bg-white/10"
          onClick={turnOff}
        >
          <span className="xp-turnoff-dot" />
          Turn off computer
        </button>
      </div>

      {/* shutting-down black overlay */}
      <div
        className="absolute inset-0 bg-black flex items-center justify-center"
        style={{ opacity: off ? 1 : 0, transition: "opacity 1.2s ease 0.3s", pointerEvents: off ? "auto" : "none" }}
      >
        <span className="text-white/85 text-[15px]" style={{ fontFamily: "'Franklin Gothic Medium', Arial, sans-serif" }}>
          Windows is shutting down…
        </span>
      </div>
    </div>
  );
}
