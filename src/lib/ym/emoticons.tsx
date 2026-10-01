'use client';

import React from 'react';

/*
 * Classic Yahoo! Messenger emoticons, redrawn as inline SVG.
 * The YM look: yellow radial-gradient face, warm brown outline,
 * simple expressive features. Includes the red devil & broken heart.
 */

export interface EmoticonDef {
  codes: string[];
  label: string;
  face:
    | 'yellow'
    | 'red'
    | 'none'; // none = icon only (broken heart)
  art: React.ReactNode;
}

const EYES_DOTS = (
  <>
    <circle cx="6.9" cy="7.8" r="1" fill="#5A3A00" />
    <circle cx="13.1" cy="7.8" r="1" fill="#5A3A00" />
  </>
);
const EYES_HAPPY = (
  <>
    <path d="M5.6,8.4 Q6.9,6.6 8.2,8.4" fill="none" stroke="#5A3A00" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M11.8,8.4 Q13.1,6.6 14.4,8.4" fill="none" stroke="#5A3A00" strokeWidth="1.1" strokeLinecap="round" />
  </>
);
const SMILE = (
  <path d="M6,11.6 Q10,15.8 14,11.6" fill="none" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
);
const BIG_GRIN = (
  <>
    <path d="M5.8,11.4 Q10,17.4 14.2,11.4 Z" fill="#7A3200" stroke="#5A3A00" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M6.6,11.7 Q10,12.4 13.4,11.7 L13.1,13 Q10,13.7 6.9,13 Z" fill="#fff" />
  </>
);
const FROWN = (
  <path d="M6,14.2 Q10,10.6 14,14.2" fill="none" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
);

export const EMOTICONS: EmoticonDef[] = [
  {
    codes: [':)', ':-)'],
    label: 'happy',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        {SMILE}
      </>
    ),
  },
  {
    codes: [':(', ':-('],
    label: 'sad',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        {FROWN}
      </>
    ),
  },
  {
    codes: [';)', ';-)'],
    label: 'winking',
    face: 'yellow',
    art: (
      <>
        <circle cx="6.9" cy="7.8" r="1" fill="#5A3A00" />
        <path d="M11.9,7.8 L14.3,7.8" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
        {SMILE}
      </>
    ),
  },
  {
    codes: [':D', ':-D', ':d'],
    label: 'big grin',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        {BIG_GRIN}
      </>
    ),
  },
  {
    codes: [';;)'],
    label: 'batting eyelashes',
    face: 'yellow',
    art: (
      <>
        <path d="M5.6,8 Q6.9,6.2 8.2,8" fill="none" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <path d="M5.4,6.6 L4.6,5.6" stroke="#5A3A00" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M6.9,6.1 L6.7,4.9" stroke="#5A3A00" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M11.8,8 Q13.1,6.2 14.4,8" fill="none" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <path d="M13.3,6.6 L14.1,5.6" stroke="#5A3A00" strokeWidth="0.8" strokeLinecap="round" />
        {BIG_GRIN}
      </>
    ),
  },
  {
    codes: ['>:D<'],
    label: 'big hug',
    face: 'yellow',
    art: (
      <>
        {EYES_HAPPY}
        {BIG_GRIN}
      </>
    ),
  },
  {
    codes: [':-/', ':-\\'],
    label: 'confused',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        <path d="M5.4,6.2 L8.2,6.8" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <path d="M7.4,13.4 L12.8,12.4" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: [':x', ':X', ':-x'],
    label: 'love struck',
    face: 'yellow',
    art: (
      <>
        <path d="M6.9,6.4 C5.9,5.2 4.2,6 4.7,7.4 C5,8.3 6.9,9.2 6.9,9.2 C6.9,9.2 8.8,8.3 9.1,7.4 C9.6,6 7.9,5.2 6.9,6.4 Z" fill="#E23A3A" />
        <path d="M13.1,6.4 C12.1,5.2 10.4,6 10.9,7.4 C11.2,8.3 13.1,9.2 13.1,9.2 C13.1,9.2 15,8.3 15.3,7.4 C15.8,6 14.1,5.2 13.1,6.4 Z" fill="#E23A3A" />
        {SMILE}
      </>
    ),
  },
  {
    codes: [':">'],
    label: 'blushing',
    face: 'yellow',
    art: (
      <>
        {EYES_HAPPY}
        <circle cx="5.6" cy="10.6" r="1.5" fill="#FF9E9E" opacity="0.85" />
        <circle cx="14.4" cy="10.6" r="1.5" fill="#FF9E9E" opacity="0.85" />
        {SMILE}
      </>
    ),
  },
  {
    codes: [':P', ':p', ':-P'],
    label: 'tongue',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        <path d="M6,12 Q10,15 14,11.8" fill="none" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="12.6" cy="13.6" rx="1.9" ry="2.4" fill="#FF7E9C" stroke="#D4486B" strokeWidth="0.5" transform="rotate(-18 12.6 13.6)" />
      </>
    ),
  },
  {
    codes: [':-*', ':*'],
    label: 'kiss',
    face: 'yellow',
    art: (
      <>
        <circle cx="6.9" cy="7.8" r="1" fill="#5A3A00" />
        <path d="M11.9,7.8 L14.3,7.8" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8.4,12 Q10,10.8 11.6,12 Q10,14.6 8.4,12 Z" fill="#E23A3A" stroke="#A81E1E" strokeWidth="0.5" />
      </>
    ),
  },
  {
    codes: ['=(('],
    label: 'broken heart',
    face: 'none',
    art: (
      <>
        <path d="M10,17.4 C4.6,13.6 2.6,10.4 3.4,7.4 C4,5.2 6.8,4.4 8.6,6 C9.2,6.5 9.7,7.2 10,7.9 C10.3,7.2 10.8,6.5 11.4,6 C13.2,4.4 16,5.2 16.6,7.4 C17.4,10.4 15.4,13.6 10,17.4 Z" fill="#E23A3A" stroke="#9E1616" strokeWidth="0.7" />
        <path d="M10,7.9 L8.8,10.2 L11,11.6 L9.4,13.8" fill="none" stroke="#9E1616" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    codes: [':O', ':o', ':-O'],
    label: 'surprise',
    face: 'yellow',
    art: (
      <>
        <circle cx="6.9" cy="7.6" r="1.35" fill="#fff" stroke="#5A3A00" strokeWidth="0.8" />
        <circle cx="13.1" cy="7.6" r="1.35" fill="#fff" stroke="#5A3A00" strokeWidth="0.8" />
        <ellipse cx="10" cy="13" rx="2" ry="2.6" fill="#7A3200" />
      </>
    ),
  },
  {
    codes: ['X(', 'x('],
    label: 'angry',
    face: 'yellow',
    art: (
      <>
        <path d="M5.2,6.2 L8.4,7.6" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14.8,6.2 L11.6,7.6" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="6.9" cy="8.6" r="0.9" fill="#5A3A00" />
        <circle cx="13.1" cy="8.6" r="0.9" fill="#5A3A00" />
        <path d="M6.4,14.6 Q10,11.2 13.6,14.6" fill="none" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: [':>', ':>'],
    label: 'smug',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        <path d="M5.4,6 L8.4,6.4" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <path d="M6.4,13.6 Q10.8,14.2 13.8,11" fill="none" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: ['B-)', 'B)'],
    label: 'cool',
    face: 'yellow',
    art: (
      <>
        <rect x="4.4" y="6.4" width="4.8" height="3.1" rx="0.8" fill="#1B1B1B" />
        <rect x="10.8" y="6.4" width="4.8" height="3.1" rx="0.8" fill="#1B1B1B" />
        <path d="M9.2,7.2 L10.8,7.2" stroke="#1B1B1B" strokeWidth="1" />
        <path d="M4.6,6.6 L3.6,6" stroke="#1B1B1B" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M15.4,6.6 L16.4,6" stroke="#1B1B1B" strokeWidth="0.9" strokeLinecap="round" />
        {SMILE}
      </>
    ),
  },
  {
    codes: [':-S', ':-s'],
    label: 'worried',
    face: 'yellow',
    art: (
      <>
        <path d="M5.4,6.4 Q6.9,5.4 8.4,6.4" fill="none" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <path d="M11.6,6.4 Q13.1,5.4 14.6,6.4" fill="none" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <circle cx="6.9" cy="8" r="1" fill="#5A3A00" />
        <circle cx="13.1" cy="8" r="1" fill="#5A3A00" />
        <path d="M6.4,13.8 Q7.6,12.6 9,13.4 Q10.6,14.3 12,12.8 Q12.8,12 13.8,12.6" fill="none" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: ['#:-S', '#:-s'],
    label: 'whew!',
    face: 'yellow',
    art: (
      <>
        {EYES_HAPPY}
        <path d="M6.2,12.8 Q10,15.4 13.8,12.2" fill="none" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14.6,4.4 Q16.4,6 15,7.6" fill="none" stroke="#5AA7E0" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: ['>:)', '>:-)'],
    label: 'devil',
    face: 'red',
    art: (
      <>
        <path d="M5.4,4.6 L3.4,1.8 L7,3.4 Z" fill="#C43838" stroke="#8E1A1A" strokeWidth="0.5" />
        <path d="M14.6,4.6 L16.6,1.8 L13,3.4 Z" fill="#C43838" stroke="#8E1A1A" strokeWidth="0.5" />
        <path d="M5.6,7.2 Q6.9,5.8 8.2,7.2" fill="none" stroke="#4A0E0E" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M11.8,7.2 Q13.1,5.8 14.4,7.2" fill="none" stroke="#4A0E0E" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M6,11.8 Q10,16.6 14,11.8 Z" fill="#5A0F0F" stroke="#4A0E0E" strokeWidth="0.6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    codes: [':((', ':(('],
    label: 'crying',
    face: 'yellow',
    art: (
      <>
        <circle cx="6.9" cy="7.8" r="1" fill="#5A3A00" />
        <circle cx="13.1" cy="7.8" r="1" fill="#5A3A00" />
        <path d="M5.9,9.4 Q5.5,12 6.3,14.6" fill="none" stroke="#4FA8E8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.1,9.4 Q14.5,12 13.7,14.6" fill="none" stroke="#4FA8E8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.4,15.4 Q10,12.4 13.6,15.4" fill="none" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: [':))'],
    label: 'laughing',
    face: 'yellow',
    art: (
      <>
        {EYES_HAPPY}
        {BIG_GRIN}
      </>
    ),
  },
  {
    codes: [':|', ':-|'],
    label: 'straight face',
    face: 'yellow',
    art: (
      <>
        {EYES_DOTS}
        <path d="M6.6,12.8 L13.4,12.8" stroke="#5A3A00" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: ['/:)'],
    label: 'raised eyebrows',
    face: 'yellow',
    art: (
      <>
        <path d="M5.4,6 L8.4,6.6" stroke="#5A3A00" strokeWidth="1" strokeLinecap="round" />
        <circle cx="6.9" cy="8.4" r="1" fill="#5A3A00" />
        <circle cx="13.1" cy="8.4" r="1" fill="#5A3A00" />
        {SMILE}
      </>
    ),
  },
  {
    codes: ['=))'],
    label: 'rolling on the floor',
    face: 'yellow',
    art: (
      <g transform="rotate(24 10 10)">
        {EYES_HAPPY}
        {BIG_GRIN}
      </g>
    ),
  },
  {
    codes: ['O:-)', 'O:)'],
    label: 'angel',
    face: 'yellow',
    art: (
      <>
        <ellipse cx="10" cy="2.6" rx="4.4" ry="1.5" fill="none" stroke="#E8B400" strokeWidth="1.2" />
        {EYES_HAPPY}
        <path d="M7,12.4 Q10,14.8 13,12.4" fill="none" stroke="#5A3A00" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ),
  },
  {
    codes: ['8-|', '8|'],
    label: 'nerd',
    face: 'yellow',
    art: (
      <>
        <rect x="4.2" y="6" width="5" height="4" rx="1" fill="#fff" stroke="#1B1B1B" strokeWidth="0.9" />
        <rect x="10.8" y="6" width="5" height="4" rx="1" fill="#fff" stroke="#1B1B1B" strokeWidth="0.9" />
        <path d="M9.2,7.6 L10.8,7.6" stroke="#1B1B1B" strokeWidth="0.9" />
        <circle cx="6.7" cy="8" r="0.8" fill="#5A3A00" />
        <circle cx="13.3" cy="8" r="0.8" fill="#5A3A00" />
        <path d="M8.6,12 L11.4,12 L11.4,14.6 L8.6,14.6 Z" fill="#fff" stroke="#5A3A00" strokeWidth="0.7" />
        <path d="M10,12 L10,14.6" stroke="#5A3A00" strokeWidth="0.6" />
      </>
    ),
  },
];

export const emoticonRegExp = (() => {
  // Sort longest-first so ">:D<" wins over ":D" etc.
  const all = EMOTICONS.flatMap((e) => e.codes).sort((a, b) => b.length - a.length);
  return new RegExp('(' + all.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
})();

/** Render a chat text line, converting emoticon codes into inline SVGs. */
export function renderEmotes(text: string, size = 16): React.ReactNode[] {
  const parts = text.split(emoticonRegExp);
  return parts.map((part, i) => {
    const emo = EMOTICONS.find((e) => e.codes.includes(part));
    if (emo) return <Emoticon key={i} type={emo.label} size={size} />;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function codeFor(label: string): string {
  const e = EMOTICONS.find((x) => x.label === label);
  return e ? e.codes[0] : ':)';
}

let gid = 0;
export function Emoticon({ type, size = 16 }: { type: string; size?: number }) {
  const uidRef = React.useRef('yg' + gid++);
  const def = EMOTICONS.find((e) => e.label === type);
  if (!def) return null;
  const idRef = uidRef;
  const fill =
    def.face === 'red'
      ? 'url(#' + idRef.current + 'r)'
      : def.face === 'yellow'
        ? 'url(#' + idRef.current + 'y)'
        : 'none';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={{ display: 'inline-block', verticalAlign: '-3px', margin: '0 1px' }}
      aria-label={def.label}
      role="img"
    >
      <defs>
        <radialGradient id={idRef.current + 'y'} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF9B8" />
          <stop offset="55%" stopColor="#FFDE39" />
          <stop offset="100%" stopColor="#F5A800" />
        </radialGradient>
        <radialGradient id={idRef.current + 'r'} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F98A7E" />
          <stop offset="55%" stopColor="#E04B3A" />
          <stop offset="100%" stopColor="#B42222" />
        </radialGradient>
      </defs>
      {def.face !== 'none' && (
        <circle
          cx="10"
          cy="10"
          r="8.5"
          fill={fill}
          stroke={def.face === 'red' ? '#8E1A1A' : '#C98A00'}
          strokeWidth="0.7"
        />
      )}
      {def.art}
    </svg>
  );
}
