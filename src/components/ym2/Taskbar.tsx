"use client";

import { useEffect, useRef, useState } from "react";
import { YahooSmiley, StatusDot } from "./icons";
import { ME } from "./data";

export interface TaskItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  minimized: boolean;
  focused: boolean;
}

interface Props {
  items: TaskItem[];
  flashing?: Record<string, boolean>;
  onTaskClick: (id: string) => void;
  onShowContacts: () => void;
  onLogOff: () => void;
  onTurnOff: () => void;
  onOpenMyComputer: () => void;
}

const ICO = (name: string, size = 32) => `/assets/xp/icons/${name}-${size}.png`;
const LUNA = (name: string) => `/assets/xp/luna/${name}.png`;

/* GENUINE Luna metrics (from the Windows XP theme source, luna/blue/blue.ini):
   taskbar = 30px (2px sizing strip + 28px background), start button = 99x30,
   task buttons = 28px cells with art, start menu = 380x440
   (header 64 + body 336 + footer 40), left/right columns 190px each,
   all menu text Tahoma 8pt (11px), user name Franklin Gothic Medium 14pt. */

export default function Taskbar({ items, flashing = {}, onTaskClick, onShowContacts, onLogOff, onTurnOff, onOpenMyComputer }: Props) {
  const [now, setNow] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);

  /* close the start menu when clicking anywhere else */
  useEffect(() => {
    if (!startOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setStartOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [startOpen]);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="xp-taskbar absolute bottom-0 left-0 right-0 h-[30px] flex items-stretch z-[9000] text-white select-none">
      {/* Start button — the GENUINE Luna StartButton.bmp (3 states, 99x33 each,
          squeezed to the 30px bar exactly like uxtheme does), rendered 99x30 */}
      <button
        className={`xp-start-btn relative shrink-0 p-0 border-0 ${startOpen ? "pressed" : ""}`}
        onClick={() => setStartOpen((v) => !v)}
        title="Click here to begin"
        aria-label="start"
      />

      {/* Quick Launch — real XP: gripper ridge, IE, Show Desktop, WMP, gripper */}
      <div className="flex items-center pt-[2px] pl-[3px] pr-[2px] gap-[5px] shrink-0">
        <span className="xp-ql-grip" />
        <button className="h-[20px] flex items-center hover:brightness-125" title="Launch Internet Explorer Browser">
          <img src={ICO("ie", 16)} alt="IE" className="w-4 h-4" draggable={false} />
        </button>
        <button className="h-[20px] flex items-center hover:brightness-125" title="Show Desktop">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="1.5" y="2.5" width="13" height="9.5" rx="1" fill="#7ba7e8" stroke="#eef3fc" strokeWidth="1.2" />
            <path d="M4 14.5 h8" stroke="#eef3fc" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <button className="h-[20px] flex items-center hover:brightness-125" title="Windows Media Player">
          <img src={ICO("wmp", 16)} alt="WMP" className="w-4 h-4" draggable={false} />
        </button>
        <span className="xp-ql-grip" />
      </div>

      {/* the authentic two-column Luna start menu — 380x440 from the theme */}
      {startOpen && (
        <div ref={menuRef} className="animate-pop absolute bottom-[30px] left-0 z-50 xp-startmenu" style={{ width: 380, height: 440 }}>
          {/* user pane — genuine StartUserPanel.bmp, 380x64, rounded top baked in */}
          <div className="relative flex items-center" style={{ height: 64, backgroundImage: `url(${LUNA("startuserpanel")})`, backgroundSize: "100% 100%" }}>
            <div
              className="ml-[10px] shrink-0"
              style={{ width: 55, height: 55, backgroundImage: `url(${LUNA("usertilebackground")})`, backgroundSize: "100% 100%" }}
            >
              <img src={ME.avatar} alt="" className="mt-[8px] ml-[8px] w-[41px] h-[39px] object-cover" draggable={false} />
            </div>
            <span
              className="ml-[12px] font-bold text-white text-[19px] leading-tight"
              style={{ fontFamily: "'Franklin Gothic Medium','Franklin Gothic Book',Arial,sans-serif", textShadow: "2px 2px 2px rgba(9,66,139,0.95)" }}
            >
              {ME.name}
            </span>
          </div>

          <div className="flex" style={{ height: 336 }}>
            {/* left column — ProgList, genuine 190px wide. Real XP with no
                newly-installed apps: white panel, blue divider on the right
                (edge colors sampled from the genuine MFU bitmap) */}
            <div
              className="flex flex-col"
              style={{
                width: 190,
                background: "linear-gradient(90deg, #ffffff 0%, #ffffff calc(100% - 4px), #6f9be0 calc(100% - 4px), #2464bb 100%)",
                borderTop: "1px solid rgb(24,84,194)",
                borderLeft: "1px solid rgb(24,84,194)",
                padding: "9px 4px 5px 6px",
                color: "rgb(55,55,56)",
              }}
            >
              <button className="xp-menu-row items-start" style={{ minHeight: 40 }} onClick={() => setStartOpen(false)}>
                <img src={ICO("ie", 32)} alt="" className="w-8 h-8" draggable={false} />
                <span className="leading-tight text-left">
                  <span className="block text-[11px] font-bold">Internet</span>
                  <span className="block text-[11px] xp-menu-sub">Internet Explorer</span>
                </span>
              </button>
              <button className="xp-menu-row items-start" style={{ minHeight: 40 }} onClick={() => { setStartOpen(false); onShowContacts(); }}>
                <span className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <YahooSmiley size={30} />
                </span>
                <span className="leading-tight text-left">
                  <span className="block text-[11px] font-bold">E-mail</span>
                  <span className="block text-[11px] xp-menu-sub">Yahoo! Messenger</span>
                </span>
              </button>
              <img src={LUNA("startprogramsseparator")} alt="" className="my-[3px] ml-[26px] h-[2px] w-auto max-w-none" draggable={false} />
              <button className="xp-menu-row" onClick={() => { setStartOpen(false); onShowContacts(); }}>
                <span className="w-4 flex justify-center">
                  <YahooSmiley size={16} />
                </span>
                <span className="text-[11px]">Yahoo! Messenger</span>
              </button>
              <div className="flex-1" />
              <img src={LUNA("startprogramsseparator")} alt="" className="mb-[3px] ml-[26px] h-[2px] w-auto max-w-none" draggable={false} />
              <button
                className="xp-menu-row"
                style={{ height: 30, fontWeight: 700 }}
                onClick={() => setStartOpen(false)}
              >
                <span className="text-[11px] font-bold">All Programs</span>
                <img src={LUNA("startpanelmoreprogarrow")} alt="▸" className="w-4 h-6 max-w-none -mr-[2px]" draggable={false} />
              </button>
            </div>

            {/* right column — PlacesList, genuine 190px wide. Body color,
                divider and edges sampled from the genuine PlacesList bitmap
                (rgb 211,229,250 body; the baked orange "new app" glow omitted
                like a real XP with no new installs) */}
            <div
              className="flex flex-col"
              style={{
                width: 190,
                background: "linear-gradient(90deg, #95bdee 0px, #d3e5fa 1px, #d3e5fa calc(100% - 4px), #a6c2e6 calc(100% - 3px), #2b6dd1 calc(100% - 1px), #1854c2 100%)",
                borderTop: "1px solid rgb(27,107,209)",
                borderBottom: "1px solid rgb(27,105,206)",
                padding: "6px 5px 4px 4px",
                color: "rgb(10,36,106)",
              }}
            >
              {([
                ["my-docs", "My Documents", 24],
                [null, "My Recent Documents", 24],
                ["my-pictures", "My Pictures", 24],
                ["my-music", "My Music", 24],
                ["my-computer", "My Computer", 24],
              ] as const).map(([ic, label]) => (
                <button key={label} className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => { setStartOpen(false); if (label === "My Computer") onOpenMyComputer(); }}>
                  {ic ? (
                    <img src={ICO(ic, 32)} alt="" className="w-6 h-6" draggable={false} />
                  ) : (
                    <span className="w-6 h-6 flex items-center justify-center">
                      {/* folder-with-arrow like the real My Recent Documents */}
                      <svg width="20" height="18" viewBox="0 0 20 18">
                        <path d="M1.5 3.5 h5.5 l1.6 2.2 h9.4 v10 h-16.5 z" fill="#f6d388" stroke="#b98a2e" strokeWidth="0.9" />
                        <path d="M14 8 v4.4 M11.8 10.2 l2.2 2.2 l2.2 -2.2" fill="none" stroke="#2a5a0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  <span className="text-[11px] font-bold flex items-center gap-1">
                    {label}
                    {label === "My Recent Documents" && <span className="text-[9px] text-[#4a72cc]">▸</span>}
                  </span>
                </button>
              ))}
              <img src={LUNA("startplacesseparator")} alt="" className="my-[2px] mx-[4px] h-[2px] w-auto max-w-none" draggable={false} />
              <button className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => setStartOpen(false)}>
                <img src={ICO("control-panel", 32)} alt="" className="w-6 h-6" draggable={false} />
                <span className="text-[11px] font-bold">Control Panel</span>
              </button>
              <button className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => setStartOpen(false)}>
                <span className="w-6 h-6 flex items-center justify-center">
                  {/* Set Program Access and Defaults — globe with arrows */}
                  <svg width="19" height="19" viewBox="0 0 19 19">
                    <circle cx="9.5" cy="9.5" r="5.6" fill="#7ba7e8" stroke="#2f5fb0" strokeWidth="1" />
                    <path d="M4 9.5 h11 M9.5 4 a8.5 8.5 0 0 1 0 11 M9.5 4 a8.5 8.5 0 0 0 0 11" fill="none" stroke="#eef3fc" strokeWidth="0.9" />
                    <path d="M13.8 13.8 l3.4 3.4" stroke="#3d9028" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[11px] font-bold leading-[13px] text-left">Set Program Access and Defaults</span>
              </button>
              <img src={LUNA("startplacesseparator")} alt="" className="my-[2px] mx-[4px] h-[2px] w-auto max-w-none" draggable={false} />
              <button className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => setStartOpen(false)}>
                <img src={ICO("help", 32)} alt="" className="w-6 h-6" draggable={false} />
                <span className="text-[11px] font-bold">Help and Support</span>
              </button>
              <button className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => setStartOpen(false)}>
                <img src={ICO("search", 32)} alt="" className="w-6 h-6" draggable={false} />
                <span className="text-[11px] font-bold">Search</span>
              </button>
              <button className="xp-menu-row-blue" style={{ minHeight: 29, paddingTop: 3, paddingBottom: 3 }} onClick={() => setStartOpen(false)}>
                <span className="w-6 h-6 flex items-center justify-center">
                  {/* Run...: window-with-arrow glyph */}
                  <svg width="18" height="16" viewBox="0 0 18 16">
                    <rect x="1" y="2" width="13.5" height="10.5" rx="1" fill="#eef3fc" stroke="#4a72cc" strokeWidth="1" />
                    <rect x="1" y="2" width="13.5" height="2.8" fill="#7ba4e8" />
                    <path d="M10.5 10 l4.5 3 M15 13 l-0.6 -2.4 M15 13 l-2.4 -0.6" stroke="#4a72cc" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-[11px] font-bold">Run...</span>
              </button>
            </div>
          </div>

          {/* footer — genuine StartPanelLogoffBackground.bmp 380x40 with the
              real Log Off / Turn Off glyph buttons (hot state bitmap on hover) */}
          <div
            className="flex items-center justify-end gap-[14px] pr-[12px]"
            style={{ height: 40, backgroundImage: `url(${LUNA("startpanellogoffbackground")})`, backgroundSize: "100% 100%" }}
          >
            <button className="xp-logoff-btn" onClick={() => { setStartOpen(false); onLogOff(); }}>
              <span className="text-[11px] font-bold text-white">Log Off</span>
              <span className="luna-glyph luna-glyph-logoff" />
            </button>
            <button className="xp-logoff-btn" onClick={() => { setStartOpen(false); onTurnOff(); }}>
              <span className="text-[11px] font-bold text-white">Turn Off Computer</span>
              <span className="luna-glyph luna-glyph-turnoff" />
            </button>
          </div>
        </div>
      )}

      {/* task buttons — genuine TaskBandButton.bmp cells, 28px, Tahoma 8pt */}
      <div className="flex-1 flex items-end gap-[3px] px-[2px] pt-[2px] overflow-hidden">
        {items.map((it) => (
          <button
            key={it.id}
            className={`xp-task-btn h-[28px] max-w-[170px] min-w-[90px] flex items-center gap-[5px] px-[6px] text-[11px] truncate ${
              it.focused && !it.minimized ? "active" : ""
            } ${flashing[it.id] && !(it.focused && !it.minimized) ? "flash" : ""}`}
            onClick={() => onTaskClick(it.id)}
          >
            {it.icon}
            <span className="truncate">{it.title}</span>
          </button>
        ))}
      </div>

      {/* tray — genuine TaskbarTray.bmp with baked ridge; real XP icons + Tahoma clock */}
      <div className="xp-tray flex items-center gap-[6px] pl-[10px] pr-[11px] text-[11px] shrink-0">
        <img src={ICO("volume", 16)} alt="Volume" className="w-4 h-4" draggable={false} />
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1 l5 2 v4 c0 3-2.2 5-5 6 c-2.8-1-5-3-5-6 V3 z" fill="none" stroke="#fff" strokeWidth="1.2" />
          <path d="M5 7 l1.5 1.5 L9.5 5" stroke="#9f9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
        <StatusDot status="available" />
        <span className="pl-[6px] suppress-hydro" suppressHydrationWarning>
          {time}
        </span>
      </div>
    </div>
  );
}
