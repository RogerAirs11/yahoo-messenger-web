'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface MenuItem {
  label?: string;
  sep?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: MenuItem[];
}

export interface MenuDef {
  label: string;
  items: MenuItem[];
}

/** Classic Yahoo! Messenger menu bar with dropdowns + submenus */
export function MenuBar({ menus }: { menus: MenuDef[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const [subOpen, setSubOpen] = useState<number | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setSubOpen(null);
      }
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  const openMenu = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos({ x: r.left, y: r.bottom });
    setOpen(open === i ? null : i);
    setSubOpen(null);
  };

  return (
    <div className="ym-menubar" ref={rootRef}>
      {menus.map((m, i) => (
        <span
          key={i}
          className={`ym-menu-item${open === i ? ' open' : ''}`}
          onMouseDown={(e) => openMenu(i, e.currentTarget)}
          onMouseEnter={(e) => { if (open !== null && open !== i) openMenu(i, e.currentTarget); }}
        >
          {m.label}
        </span>
      ))}
      {open !== null && menus[open] && (
        <div className="ym-menu-drop" style={{ left: pos.x, top: pos.y }}>
          {menus[open].items.map((it, j) =>
            it.sep ? (
              <div key={j} className="ym-menu-sep" />
            ) : it.submenu ? (
              <div
                key={j}
                className={`ym-menu-row${it.disabled ? ' disabled' : ''}`}
                onMouseEnter={() => setSubOpen(j)}
                style={{ position: 'relative' }}
              >
                {it.checked && <span className="chk">✓</span>}
                {it.label}
                <span className="sub-arrow">▶</span>
                {subOpen === j && <SubMenu items={it.submenu} x={pos.x + 165} y={pos.y + j * 20 - 3} />}
              </div>
            ) : (
              <div
                key={j}
                className={`ym-menu-row${it.disabled ? ' disabled' : ''}`}
                onMouseEnter={() => setSubOpen(null)}
                onClick={() => {
                  setOpen(null);
                  setSubOpen(null);
                  it.onClick?.();
                }}
              >
                {it.checked && <span className="chk">✓</span>}
                {it.label}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function SubMenu({ items, x, y }: { items: MenuItem[]; x: number; y: number }) {
  return (
    <div className="ym-menu-drop" style={{ left: x, top: y, position: 'fixed' }}>
      {items.map((it, j) =>
        it.sep ? (
          <div key={j} className="ym-menu-sep" />
        ) : (
          <div
            key={j}
            className={`ym-menu-row${it.disabled ? ' disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              it.onClick?.();
            }}
          >
            {it.checked && <span className="chk">✓</span>}
            {it.label}
          </div>
        ),
      )}
    </div>
  );
}
