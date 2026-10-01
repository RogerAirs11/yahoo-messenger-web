'use client';

import React, { useRef, useCallback } from 'react';

export interface YmWindowProps {
  title?: React.ReactNode;
  width: number | string;
  height?: number | string;
  x: number;
  y: number;
  z: number;
  visible?: boolean;
  shaking?: boolean;
  showLogo?: boolean; // full YAHOO! MESSENGER logo instead of plain title
  logoIcon?: boolean; // small Y! flower only
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onMinimize?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  menuBar?: React.ReactNode;
}

function YLogoSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flex: 'none' }}>
      <circle cx="8" cy="8" r="7" fill="#6D3FA8" stroke="#4A2378" strokeWidth="0.8" />
      <text x="8" y="11.6" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontStyle="italic" fontSize="10" fill="#fff">
        Y!
      </text>
    </svg>
  );
}

export function YmWindow(p: YmWindowProps) {
  const drag = useRef<{ ox: number; oy: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const onPointerDownTitle = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('.ym-tb-btn')) return;
      p.onFocus();
      drag.current = { ox: e.clientX - p.x, oy: e.clientY - p.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [p],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return;
      const nx = Math.min(Math.max(e.clientX - drag.current.ox, -p.width && -((p.width as number) - 60)), window.innerWidth - 60);
      const ny = Math.min(Math.max(e.clientY - drag.current.oy, 0), window.innerHeight - 60);
      p.onMove(nx, ny);
    },
    [p],
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  if (!p.visible) return null;

  return (
    <div
      ref={ref}
      className={`ym-window ${p.shaking ? 'ym-shaking' : ''}`}
      style={{ width: p.width, height: p.height, left: p.x, top: p.y, zIndex: p.z }}
      onMouseDown={p.onFocus}
    >
      <div className="ym-titlebar" onPointerDown={onPointerDownTitle} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onDoubleClick={() => p.onFocus()}>
        {p.showLogo ? (
          <span className="ym-logo">
            YAHOO!<span className="messenger">MESSENGER</span>
          </span>
        ) : (
          <>
            {p.logoIcon && <YLogoSmall />}
            <span className="ym-title">{p.title}</span>
          </>
        )}
        <div className="ym-tb-btns">
          {p.onMinimize && (
            <button className="ym-tb-btn" title="Minimize" onClick={p.onMinimize}>
              <svg width="9" height="9" viewBox="0 0 9 9"><rect x="1.5" y="6" width="6" height="1.6" fill="#fff" /></svg>
            </button>
          )}
          {p.onClose && (
            <button className="ym-tb-btn close" title="Close" onClick={p.onClose}>
              <svg width="9" height="9" viewBox="0 0 9 9">
                <path d="M1.5,1.5 L7.5,7.5 M7.5,1.5 L1.5,7.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {p.menuBar}
      {p.children}
    </div>
  );
}

/* ---------------- Menu bar with dropdowns ---------------- */

export interface MenuDef {
  label: string;
  items: (
    | { type: 'sep' }
    | {
        label: string;
        onClick?: () => void;
        checked?: boolean;
        dot?: 'online' | 'busy' | 'idle' | 'offline';
        bold?: boolean;
      }
  )[];
}

export function MenuBar({ menus, italic = false }: { menus: MenuDef[]; italic?: boolean }) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  return (
    <div className="ym-menubar" onMouseLeave={() => setOpenIdx(null)}>
      {menus.map((m, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <div
            className={`ym-menu-item ${openIdx === i ? 'open' : ''} ${italic ? 'italic' : ''}`}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            onMouseEnter={() => openIdx !== null && setOpenIdx(i)}
          >
            {m.label}
          </div>
          {openIdx === i && (
            <div className="ym-dropdown" style={{ left: 0 }}>
              {m.items.map((it, j) =>
                'type' in it ? (
                  <div key={j} className="ym-dd-sep" />
                ) : (
                  <div
                    key={j}
                    className="ym-dd-item"
                    onClick={() => {
                      setOpenIdx(null);
                      it.onClick?.();
                    }}
                  >
                    {it.dot && <span className={`dot ym-dot ${it.dot}`} />}
                    <span style={{ fontWeight: it.bold ? 700 : 400 }}>{it.label}</span>
                    {it.checked && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
