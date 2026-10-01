"use client";

import { useEffect, useRef, useState } from "react";
import { XpFlag } from "./XpBoot";
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
    <div className="xp-taskbar absolute bottom-0 left-0 right-0 h-[34px] flex items-stretch z-[9000] text-white select-none">
      {/* Start button — green pill with the flying flag */}
      <button
        className="xp-start flex items-end gap-1 pl-2.5 pr-3 pb-[5px] font-bold italic text-[15px] relative"
        onClick={() => setStartOpen((v) => !v)}
      >
        <XpFlag size={19} />
        <span
          className="text-[15.5px]"
          style={{ fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', Tahoma, sans-serif", fontStyle: "italic", fontWeight: 700, textShadow: "0 1px 2px rgba(0,40,0,0.7)" }}
        >
          start
        </span>
      </button>

      {/* Quick Launch */}
      <div className="flex items-center px-2 gap-1.5">
        <span className="xp-ql-sep" />
        <button className="hover:brightness-125" title="Launch Internet Explorer Browser">
          <img src={ICO("ie", 48)} alt="IE" className="w-[17px] h-[17px]" draggable={false} />
        </button>
        <button className="hover:brightness-125" title="Show Desktop">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="1.5" y="2.5" width="13" height="9.5" rx="1" fill="#7ba7e8" stroke="#eef3fc" strokeWidth="1.2" />
            <path d="M4 14.5 h8" stroke="#eef3fc" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="xp-ql-sep" />
      </div>

      {/* the authentic two-column Luna start menu */}
      {startOpen && (
        <div ref={menuRef} className="animate-pop absolute bottom-[33px] left-0 z-50" style={{ width: 396 }}>
          {/* header with user tile */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-t-[8px]"
            style={{
              background: "linear-gradient(180deg, #2f71d8 0%, #1e56c8 60%, #1a4cb8 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
              borderBottom: "2px solid #e88c00",
            }}
          >
            <span className="w-[42px] h-[42px] rounded-[4px] bg-white p-[2px] inline-flex shadow">
              <img src={ME.avatar} alt="" className="w-full h-full rounded-[2px] object-cover" />
            </span>
            <span className="font-bold text-[15px]" style={{ textShadow: "0 1px 2px rgba(0,10,60,0.7)" }}>
              {ME.name}
            </span>
          </div>

          <div className="flex" style={{ boxShadow: "0 -2px 14px rgba(0,10,60,0.5)" }}>
            {/* left column — pinned + programs */}
            <div className="w-[196px] bg-white py-1.5 px-1 flex flex-col text-[#1a1a1a]">
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => { setStartOpen(false); }}>
                <img src={ICO("ie", 48)} alt="" className="w-[26px] h-[26px]" draggable={false} />
                <span className="leading-tight">
                  <span className="block text-[12px] font-bold">Internet</span>
                  <span className="block text-[10.5px] text-[#555]">Internet Explorer</span>
                </span>
              </button>
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => { setStartOpen(false); onShowContacts(); }}>
                <YahooSmiley size={26} />
                <span className="leading-tight">
                  <span className="block text-[12px] font-bold">E-mail</span>
                  <span className="block text-[10.5px] text-[#555]">Yahoo! Messenger</span>
                </span>
              </button>
              <div className="h-[1px] bg-[#c8d4e8] my-1 mx-2" />
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => { setStartOpen(false); onShowContacts(); }}>
                <YahooSmiley size={22} />
                <span className="text-[12px]">Yahoo! Messenger</span>
              </button>
              <div className="flex-1" />
              <div className="h-[1px] bg-[#c8d4e8] my-1 mx-2" />
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => { setStartOpen(false); onOpenMyComputer(); }}>
                <img src={ICO("my-computer", 48)} alt="" className="w-[22px] h-[22px]" draggable={false} />
                <span className="text-[12px] font-bold">My Computer</span>
              </button>
            </div>

            {/* right column — places */}
            <div
              className="w-[200px] py-1.5 px-1 flex flex-col text-[#12233f]"
              style={{ background: "linear-gradient(180deg, #d3e5fa 0%, #c4dcf8 100%)" }}
            >
              {([
                ["my-docs", "My Documents"],
                ["my-pictures", "My Pictures"],
                ["my-music", "My Music"],
                ["my-computer", "My Computer"],
              ] as const).map(([ic, label]) => (
                <button key={ic} className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => { setStartOpen(false); if (ic === "my-computer") onOpenMyComputer(); }}>
                  <img src={ICO(ic, 48)} alt="" className="w-[22px] h-[22px]" draggable={false} />
                  <span className="text-[12px] font-bold">{label}</span>
                </button>
              ))}
              <div className="h-[1px] bg-[#a8c4e8] my-1 mx-2" />
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => setStartOpen(false)}>
                <img src={ICO("control-panel", 48)} alt="" className="w-[22px] h-[22px]" draggable={false} />
                <span className="text-[12px]">Control Panel</span>
              </button>
              <div className="h-[1px] bg-[#a8c4e8] my-1 mx-2" />
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => setStartOpen(false)}>
                <img src={ICO("help", 48)} alt="" className="w-[22px] h-[22px]" draggable={false} />
                <span className="text-[12px]">Help and Support</span>
              </button>
              <button className="flex items-center gap-2 px-2 py-[5px] rounded hover:bg-[#2f71d8] hover:text-white text-left" onClick={() => setStartOpen(false)}>
                <img src={ICO("search", 48)} alt="" className="w-[22px] h-[22px]" draggable={false} />
                <span className="text-[12px]">Search</span>
              </button>
            </div>
          </div>

          {/* footer strip: log off + turn off */}
          <div
            className="flex items-center justify-end gap-4 px-4 py-[7px] rounded-b-[8px]"
            style={{
              background: "linear-gradient(180deg, #2f71d8 0%, #1e56c8 60%, #1a4cb8 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <button className="flex items-center gap-1.5 text-white text-[12px] hover:underline" onClick={() => { setStartOpen(false); onLogOff(); }}>
              <img src={ICO("user", 48)} alt="" className="w-[18px] h-[18px]" draggable={false} />
              Log Off
            </button>
            <button className="flex items-center gap-1.5 text-white text-[12px] hover:underline" onClick={() => { setStartOpen(false); onTurnOff(); }}>
              <img src={ICO("turnoff", 48)} alt="" className="w-[18px] h-[18px]" draggable={false} />
              Turn Off Computer
            </button>
          </div>
        </div>
      )}

      {/* task buttons */}
      <div className="flex-1 flex items-center gap-1 px-1.5 overflow-hidden">
        {items.map((it) => (
          <button
            key={it.id}
            className={`xp-task-btn h-[25px] max-w-[170px] min-w-[90px] flex items-center gap-1.5 px-2 text-[11.5px] truncate ${
              it.focused && !it.minimized ? "active" : ""
            } ${flashing[it.id] && !(it.focused && !it.minimized) ? "flash" : ""}`}
            onClick={() => onTaskClick(it.id)}
          >
            {it.icon}
            <span className="truncate">{it.title}</span>
          </button>
        ))}
      </div>

      {/* tray */}
      <div className="xp-tray flex items-center gap-2 px-3 text-[11.5px]">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M2 5.5 h2 l3-3 v9 l-3-3 h-2 z" fill="#fff" />
          <path d="M9.5 4.5 a3.5 3.5 0 0 1 0 5" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1 l5 2 v4 c0 3-2.2 5-5 6 c-2.8-1-5-3-5-6 V3 z" fill="none" stroke="#fff" strokeWidth="1.2" />
          <path d="M5 7 l1.5 1.5 L9.5 5" stroke="#9f9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
        <StatusDot status="available" />
        <span className="pl-1 border-l border-white/30" suppressHydrationWarning>
          {time}
        </span>
      </div>
    </div>
  );
}
