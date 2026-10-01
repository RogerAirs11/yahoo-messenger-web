'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useYM } from '@/lib/ym/store';
import { YmSmiley } from './icons';

export interface WinProps {
  winKey: 'login' | 'buddylist' | string;
  x: number;
  y: number;
  z: number;
  width: number;
  height?: number;
  title?: React.ReactNode;
  wordmark?: boolean;
  showStatusDot?: boolean;
  shake?: number;
  children: React.ReactNode;
  onClose?: () => void;
  bodyClass?: string;
}

/** Draggable Yahoo! Messenger window with XP purple chrome */
export function YmWindow({ winKey, x, y, z, width, height, title, wordmark, showStatusDot, shake = 0, children, onClose }: WinProps) {
  const focusWin = useYM((s) => s.focusWin);
  const minimizeWin = useYM((s) => s.minimizeWin);
  const moveWin = useYM((s) => s.moveWin);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [shaking, setShaking] = useState(false);

  const onTitleDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.tb-controls')) return;
      focusWin(winKey);
      dragRef.current = { dx: e.clientX - x, dy: e.clientY - y };
      setDragging(true);
      e.preventDefault();
    },
    [x, y, winKey, focusWin],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const nx = Math.max(-width + 90, Math.min(e.clientX - dragRef.current.dx, window.innerWidth - 80));
      const ny = Math.max(0, Math.min(e.clientY - dragRef.current.dy, window.innerHeight - 80));
      moveWin(winKey, nx, ny);
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, winKey, width, moveWin]);

  useEffect(() => {
    if (shake > 0) {
      const t1 = setTimeout(() => setShaking(true), 0);
      const t2 = setTimeout(() => setShaking(false), 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [shake]);

  return (
    <div
      className={`ym-win${shaking ? ' shake' : ''}`}
      style={{ left: x, top: y, zIndex: z, width, ...(height ? { height } : {}) }}
      onMouseDown={() => focusWin(winKey)}
    >
      <div className="ym-titlebar" onMouseDown={onTitleDown} onDoubleClick={() => minimizeWin(winKey)}>
        <YmSmiley size={15} />
        {wordmark ? title : <span className="tb-text">{title}</span>}
        <span style={{ flex: 1 }} />
        <div className="tb-controls">
          {showStatusDot && <span className="tb-dot" title="Available" />}
          <button className="tb-btn" title="Minimize" onClick={(e) => { e.stopPropagation(); minimizeWin(winKey); }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="5" width="6" height="2" fill="#fff" /></svg>
          </button>
          <button className="tb-btn" title="Maximize" onClick={(e) => e.stopPropagation()}>
            <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" fill="none" stroke="#fff" strokeWidth="1.6" /></svg>
          </button>
          <button className="tb-btn close" title="Close" onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
