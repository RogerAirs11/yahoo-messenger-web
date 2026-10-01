'use client';

import React, { useState } from 'react';
import { EMOTICONS, EMOTICON_BASE } from '@/lib/ym/emoticons';

/** Classic emoticon palette popup (8-column grid of real animated GIFs) */
export function EmoticonPicker({
  x, y, onPick, onClose,
}: {
  x: number;
  y: number;
  onPick: (code: string) => void;
  onClose: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? EMOTICONS : EMOTICONS.slice(0, 40);
  return (
    <div className="ym-emo-pop" style={{ left: Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 244), top: Math.max(8, Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - 320)) }} onMouseDown={(e) => e.stopPropagation()}>
      <div className="ym-emo-grid ym-scroll" style={showAll ? { maxHeight: 240, overflowY: 'auto' } : undefined}>
        {visible.map((e, i) => (
          <span
            key={i}
            className="ym-emo-cell"
            title={`${e.name}  ${e.codes[0]}`}
            onClick={() => {
              onPick(e.codes[0]);
              onClose();
            }}
          >
            <img src={`${EMOTICON_BASE}/${e.file}`} alt={e.name} draggable={false} />
          </span>
        ))}
      </div>
      <div className="ym-emo-more">
        <span className="clickable" style={{ color: '#2a44c5' }} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show fewer' : 'Show all 117 emoticons'}
        </span>
        <span>(hidden emoticons too!)</span>
      </div>
    </div>
  );
}

const COLORS = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27',
  '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e',
  '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
];

export function ColorPicker({ x, y, onPick }: { x: number; y: number; onPick: (c: string) => void }) {
  return (
    <div
      className="ym-color-pop"
      style={{ left: Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 130), top: Math.max(8, y - 110) }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {COLORS.map((c) => (
        <span key={c} className="ym-color-cell" style={{ background: c }} onClick={() => onPick(c)} title={c} />
      ))}
    </div>
  );
}
