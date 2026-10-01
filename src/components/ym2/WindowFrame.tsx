"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconClose, IconMax, IconMin } from "./icons";

export interface MenuDef {
  label: string;
  items: { label?: string; sep?: boolean; onClick?: () => void; checked?: boolean }[];
}

interface Props {
  title: string;
  icon?: React.ReactNode;
  titleExtra?: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minW?: number;
  minH?: number;
  z: number;
  focused: boolean;
  maximized?: boolean;
  shaking?: boolean;
  smooth?: boolean;
  menus?: MenuDef[];
  onMove: (x: number, y: number) => void;
  onResize?: (w: number, h: number) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax?: () => void;
  children: React.ReactNode;
}

export default function WindowFrame({
  title,
  icon,
  titleExtra,
  x,
  y,
  width,
  height,
  minW = 300,
  minH = 220,
  z,
  focused,
  maximized,
  shaking,
  smooth,
  menus,
  onMove,
  onResize,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  children,
}: Props) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenu === null) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [openMenu]);

  const startResize = (mode: "e" | "s" | "se") => (e: React.PointerEvent) => {
    if (maximized || !onResize) return;
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    const rect = rootRef.current!.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      let w = rect.width;
      let h = rect.height;
      if (mode === "e" || mode === "se") w = Math.max(minW, Math.min(ev.clientX - rect.left, window.innerWidth - rect.left - 12));
      if (mode === "s" || mode === "se") h = Math.max(minH, Math.min(ev.clientY - rect.top, window.innerHeight - 46 - rect.top));
      onResize(Math.round(w), Math.round(h));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startDrag = (e: React.PointerEvent) => {
    if (maximized) return;
    onFocus();
    drag.current = { dx: e.clientX - x, dy: e.clientY - y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const nx = Math.min(Math.max(e.clientX - drag.current.dx, -width + 120), window.innerWidth - 60);
    const ny = Math.min(Math.max(e.clientY - drag.current.dy, 0), window.innerHeight - 70);
    onMove(nx, ny);
  };
  const endDrag = () => (drag.current = null);

  return (
    <div
      ref={rootRef}
      className={`ym-window absolute ${shaking ? "animate-buzz" : ""} ${focused ? "" : "opacity-[0.98]"}`}
      style={
        maximized
          ? { left: "0px", top: "0px", width: "100%", height: "calc(100% - 34px)", zIndex: z }
          : {
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
              zIndex: z,
              transition: smooth ? "width 0.38s cubic-bezier(0.4,0,0.2,1), height 0.38s cubic-bezier(0.4,0,0.2,1)" : undefined,
            }
      }
      onPointerDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="ym-titlebar flex items-center gap-1.5 pl-2 pr-1 h-[27px] select-none cursor-default rounded-t-[7px]"
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onDoubleClick={() => onToggleMax?.()}
      >
        {icon}
        <span className="ym-titlebar-text text-[12px] font-bold tracking-wide truncate flex-1">{title}</span>
        {titleExtra && <span className="mr-1 flex items-center">{titleExtra}</span>}
        <button className="ym-winbtn" title="Minimize" onPointerDown={(e) => e.stopPropagation()} onClick={onMinimize}>
          <IconMin />
        </button>
        <button className="ym-winbtn" title="Maximize" onPointerDown={(e) => e.stopPropagation()} onClick={() => onToggleMax?.()}>
          <IconMax />
        </button>
        <button className="ym-winbtn ym-winbtn-close" title="Close" onPointerDown={(e) => e.stopPropagation()} onClick={onClose}>
          <IconClose />
        </button>
      </div>

      {/* Menu bar */}
      {menus && (
        <div className="ym-menubar relative flex items-stretch px-1 h-[22px] text-white text-[11.5px] select-none">
          {menus.map((m, i) => (
            <div key={m.label} className="relative">
              <button
                className={`ym-menu-item h-full px-2 ${openMenu === i ? "bg-white/25" : ""}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === i ? null : i);
                }}
                onMouseEnter={() => openMenu !== null && setOpenMenu(i)}
              >
                {m.label}
              </button>
              {openMenu === i && (
                <div
                  className="animate-pop absolute left-0 top-full min-w-[190px] bg-[#f6f5ec] border border-[#7a57c6] shadow-[3px_3px_8px_rgba(20,5,50,0.4)] py-0.5 text-[#222] z-50"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {m.items.map((it, j) =>
                    it.sep ? (
                      <div key={j} className="h-px mx-1 my-1 bg-[#c9c5b4]" />
                    ) : (
                      <button
                        key={j}
                        className="ym-dropdown-item w-full text-left px-5 py-[3px] relative"
                        onClick={() => {
                          setOpenMenu(null);
                          it.onClick?.();
                        }}
                      >
                        {it.checked && <span className="absolute left-1.5 text-[#2244cc] font-bold">✓</span>}
                        {it.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>

      {/* XP resize handles */}
      {!maximized && onResize && (
        <>
          <div className="absolute top-7 bottom-3 right-0 w-[5px] cursor-ew-resize z-30" onPointerDown={startResize("e")} />
          <div className="absolute left-2 right-4 bottom-0 h-[5px] cursor-ns-resize z-30" onPointerDown={startResize("s")} />
          <div className="absolute bottom-0 right-0 w-[16px] h-[16px] cursor-nwse-resize z-40 flex items-end justify-end p-[2px]" onPointerDown={startResize("se")}>
            <svg width="9" height="9" viewBox="0 0 9 9">
              <circle cx="7.5" cy="7.5" r="1" fill="#8e8b7a" />
              <circle cx="4.5" cy="7.5" r="1" fill="#8e8b7a" />
              <circle cx="7.5" cy="4.5" r="1" fill="#8e8b7a" />
              <circle cx="1.5" cy="7.5" r="1" fill="#8e8b7a" />
              <circle cx="7.5" cy="1.5" r="1" fill="#8e8b7a" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
