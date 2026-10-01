"use client";

import { useEffect, useState } from "react";
import { WinFlag, YahooSmiley, StatusDot } from "./icons";
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
  onSignOut: () => void;
  onShowContacts: () => void;
}

export default function Taskbar({ items, flashing = {}, onTaskClick, onSignOut, onShowContacts }: Props) {
  const [now, setNow] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="xp-taskbar absolute bottom-0 left-0 right-0 h-[34px] flex items-stretch z-[9000] text-white select-none">
      <button
        className="xp-start flex items-center gap-1.5 px-3 font-bold italic text-[15px] relative"
        onClick={() => setStartOpen((v) => !v)}
      >
        <WinFlag />
        <span className="text-[15px] tracking-wide" style={{ fontFamily: "'Trebuchet MS', Tahoma, sans-serif", fontStyle: "italic", fontWeight: 700 }}>
          start
        </span>
      </button>

      {startOpen && (
        <div className="animate-pop absolute bottom-[34px] left-0 w-[230px] bg-[#3b7ce6] border border-[#1c4fae] rounded-t-lg shadow-2xl overflow-hidden z-50">
          <div className="bg-gradient-to-b from-[#4a6fd8] to-[#2a4cb8] px-3 py-2.5 flex items-center gap-2 border-b border-[#1c3f9e]">
            <div className="w-9 h-9 rounded border-2 border-white/70 overflow-hidden bg-white">
              <img src={ME.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[13px]" style={{ textShadow: "0 1px 2px rgba(0,0,30,0.6)" }}>{ME.name}</span>
          </div>
          <div className="py-1 bg-white/10">
            <button
              className="w-full text-left px-4 py-1.5 hover:bg-white/25 flex items-center gap-2 text-[12px]"
              onClick={() => {
                setStartOpen(false);
                onShowContacts();
              }}
            >
              <YahooSmiley size={15} /> Yahoo! Messenger
            </button>
            <button
              className="w-full text-left px-4 py-1.5 hover:bg-white/25 text-[12px]"
              onClick={() => {
                setStartOpen(false);
                onSignOut();
              }}
            >
              Sign Out...
            </button>
          </div>
          <div className="bg-gradient-to-b from-[#2a66d6] to-[#1e56c0] px-4 py-2 text-[11px] italic text-white/80">
            It&apos;s Friday almost. Hang in there.
          </div>
        </div>
      )}

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
