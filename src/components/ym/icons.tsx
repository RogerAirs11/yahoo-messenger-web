'use client';

import React from 'react';

/* ================= Title-bar / brand icons ================= */

/** The Y! winking smiley used in window title bars */
export function YmSmiley({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <radialGradient id="ymface" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="55%" stopColor="#f5b91e" />
          <stop offset="100%" stopColor="#d9770f" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14.5" fill="url(#ymface)" stroke="#a85a08" strokeWidth="1.4" />
      <path d="M9.5 12.5 q 3 -2.6 6 0" stroke="#5a3305" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="21.5" cy="12" r="2.2" fill="#5a3305" />
      <path d="M10 20 q 6 6.5 12.5 -1" stroke="#5a3305" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Big login logo — purple Y! + silver messenger orb (overlapping, like the original) */
export function YmLoginLogo({ width = 218 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.42} viewBox="0 0 218 92">
      <defs>
        <linearGradient id="yblob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a3fc0" />
          <stop offset="100%" stopColor="#5e1f8a" />
        </linearGradient>
        <radialGradient id="orb" cx="32%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#d8d8dc" />
          <stop offset="75%" stopColor="#9a9aa2" />
          <stop offset="100%" stopColor="#6e6e78" />
        </radialGradient>
      </defs>
      {/* Y! exclamation */}
      <text x="8" y="66" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontWeight="bold" fontSize="74" fill="url(#yblob)" stroke="#4a1770" strokeWidth="1.4">Y!</text>
      {/* silver orb w/ smile, overlapping the exclamation mark */}
      <circle cx="122" cy="52" r="32" fill="url(#orb)" stroke="#5c5c66" strokeWidth="1.6" />
      <ellipse cx="110" cy="39" rx="11.5" ry="6.5" fill="rgba(255,255,255,0.8)" transform="rotate(-18 110 39)" />
      <circle cx="111" cy="48" r="3.2" fill="#4a4a52" />
      <circle cx="133" cy="48" r="3.2" fill="#4a4a52" />
      <path d="M110 60 q 11.5 9.5 24 -1" stroke="#4a4a52" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** small wordmark for title bars: Yahoo! MESSENGER */
export function YmWordmark() {
  return (
    <span className="tb-wordmark">
      <span className="yw">Yahoo!</span>
      <span className="ym">MESSENGER</span>
    </span>
  );
}

/* ================= Status icons ================= */

function SmileyFace({ cx = 8, r = 6.6, mouth = 'smile', wink = false }: { cx?: number; r?: number; mouth?: 'smile' | 'flat' | 'grim'; wink?: boolean }) {
  return (
    <>
      <circle cx={cx} cy="8" r={r} fill="url(#st-smiley)" stroke="#8a5a08" strokeWidth="1" />
      {wink ? (
        <path d={`M${cx - 3.6} 6 q1.8 -1.5 3.6 0`} stroke="#4a2c05" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <circle cx={cx - 1.8} cy="6" r="1.05" fill="#4a2c05" />
      )}
      <circle cx={cx + 2.4} cy="6" r="1.05" fill="#4a2c05" />
      {mouth === 'smile' && <path d={`M${cx - 3.2} 9.6 q3.2 3.4 6.4 0`} stroke="#4a2c05" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
      {mouth === 'flat' && <path d={`M${cx - 2.8} 10.4 h5.6`} stroke="#4a2c05" strokeWidth="1.5" strokeLinecap="round" />}
      {mouth === 'grim' && <path d={`M${cx - 2.8} 11.2 q2.8 -2.6 5.6 0`} stroke="#4a2c05" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
    </>
  );
}

export function StatusIcon({ status, size = 16 }: { status: 'online' | 'busy' | 'idle' | 'offline' | 'mobile'; size?: number }) {
  const common = <defs>
    <radialGradient id="st-smiley" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stopColor="#ffdf6b" />
      <stop offset="60%" stopColor="#f5b91e" />
      <stop offset="100%" stopColor="#d3830e" />
    </radialGradient>
    <radialGradient id="st-red" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stopColor="#ff8a7a" />
      <stop offset="60%" stopColor="#e03424" />
      <stop offset="100%" stopColor="#a81408" />
    </radialGradient>
    <radialGradient id="st-gray" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stopColor="#e8e8ea" />
      <stop offset="60%" stopColor="#b8b8c0" />
      <stop offset="100%" stopColor="#88888f" />
    </radialGradient>
  </defs>;
  if (status === 'online')
    return <svg width={size} height={size} viewBox="0 0 16 16">{common}<SmileyFace /></svg>;
  if (status === 'busy')
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        {common}
        <circle cx="8" cy="8" r="6.6" fill="url(#st-red)" stroke="#8a1005" strokeWidth="1" />
        <rect x="4.4" y="6.9" width="7.2" height="2.2" rx="1.1" fill="#fff" />
      </svg>
    );
  if (status === 'idle')
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        {common}
        <SmileyFace mouth="flat" cx={7.2} r={5.6} />
        <circle cx="11.6" cy="11.4" r="4.4" fill="#fffde8" stroke="#a88a20" strokeWidth="1" />
        <path d="M11.6 9.2 v2.4 l1.8 1" stroke="#6a5a10" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    );
  if (status === 'mobile')
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        {common}
        <rect x="4.6" y="2.2" width="6.8" height="11.6" rx="1.6" fill="url(#st-smiley)" stroke="#8a5a08" strokeWidth="1" />
        <rect x="6" y="4" width="4" height="6" rx="0.5" fill="#fff" opacity="0.85" />
        <circle cx="8" cy="12" r="0.9" fill="#4a2c05" />
      </svg>
    );
  return <svg width={size} height={size} viewBox="0 0 16 16">{common}<SmileyFace cx={8} mouth="flat" /></svg>;
}

/** generic gray person placeholder used for offline contacts (YM style) */
export function OfflineAvatar({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26">
      <rect width="26" height="26" rx="2" fill="#e2e2e6" />
      <circle cx="13" cy="10" r="4.6" fill="#b4b4bc" />
      <path d="M4.5 24 Q4.5 16.5 13 16.5 Q21.5 16.5 21.5 24 Z" fill="#b4b4bc" />
    </svg>
  );
}

/* ================= Toolbar icons (gray-silver 3D style) ================= */

const silver = (
  <defs>
    <linearGradient id="sv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fafafa" />
      <stop offset="45%" stopColor="#c8c8cc" />
      <stop offset="100%" stopColor="#8e8e96" />
    </linearGradient>
    <linearGradient id="svd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e8e8ec" />
      <stop offset="100%" stopColor="#7e7e88" />
    </linearGradient>
  </defs>
);

export function WebcamIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22">
      {silver}
      <circle cx="12" cy="9" r="6.4" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" />
      <circle cx="12" cy="9" r="3.4" fill="#3a3a44" stroke="#222" strokeWidth="0.8" />
      <circle cx="10.6" cy="7.4" r="1.1" fill="#9ab8e8" />
      <path d="M4 19.5 Q4 15.5 12 15.5 Q20 15.5 20 19.5 Z" fill="url(#svd)" stroke="#5e5e66" strokeWidth="1" />
      <path d="M17 13.5 L22 18" stroke="#6e6e76" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22.6" cy="18.6" r="1.6" fill="url(#svd)" stroke="#5e5e66" strokeWidth="0.8" />
    </svg>
  );
}

export function MicIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22">
      {silver}
      <rect x="9.4" y="2" width="6" height="10.4" rx="3" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" />
      <path d="M6.6 10.5 a5.8 5.8 0 0 0 11.6 0" stroke="#5e5e66" strokeWidth="1.6" fill="none" />
      <line x1="12.4" y1="16.6" x2="12.4" y2="19" stroke="#5e5e66" strokeWidth="1.6" />
      <path d="M8.4 20 h8" stroke="#5e5e66" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.6 10.5 a5.8 5.8 0 0 0 11.6 0" fill="#b8d0f0" opacity="0.25" />
    </svg>
  );
}

export function ImvIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22">
      {silver}
      <path d="M13 2 L15 8 L21.4 8 L16.2 11.8 L18.2 18 L13 14.2 L7.8 18 L9.8 11.8 L4.6 8 L11 8 Z" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" strokeLinejoin="round" />
      <path d="M13 2 L15 8 L13 8 Z" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function ActivitiesIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22">
      {silver}
      <path d="M8 19 h11 l-1.6 -3.2 c2.4 -1 4 -3.4 4 -6.2 0 -4.4 -3.8 -7.4 -8.2 -7.4 -3.4 0 -5 1.6 -5.8 3.4 -0.6 1.4 -0.2 2.6 0.8 3 -1.6 0.6 -2.6 1.8 -2.4 3.6 0.2 2.4 2 3.4 2.6 3.6 Z" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="14" cy="7.6" r="1.1" fill="#5e5e66" />
      <path d="M10.4 12.4 q2.4 2 5.6 0.6" stroke="#5e5e66" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PhotosIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22">
      {silver}
      <rect x="3.4" y="5.4" width="13" height="11" rx="1.4" fill="url(#svd)" stroke="#5e5e66" strokeWidth="1" transform="rotate(-6 10 11)" />
      <rect x="9.6" y="6.4" width="13" height="11" rx="1.4" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" />
      <circle cx="13.6" cy="10.4" r="1.5" fill="#ffe066" stroke="#a08a20" strokeWidth="0.6" />
      <path d="M11 15.5 l3.4 -3.6 2.2 2.2 2 -2.8 3 4.2 Z" fill="#8fbf6a" stroke="#5e8e46" strokeWidth="0.6" />
    </svg>
  );
}

export function EmoSmileyBtn({ size = 17 }: { size?: number }) {
  return <YmSmiley size={size} />;
}

export function AudibleIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15">
      {silver}
      <path d="M2 4 h6 l4.4 -3 v13 L8 11 H2 Z" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" strokeLinejoin="round" />
      <path d="M14.6 5 q1.6 2.4 0 5" stroke="#5e5e66" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function FontColorIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15">
      <text x="4" y="10.5" fontFamily="Times New Roman, serif" fontWeight="bold" fontSize="12" fill="#333">T</text>
      <rect x="2" y="11.6" width="13" height="2.6" fill="#c02a2a" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15">
      {silver}
      <path d="M8 1.6 l1.2 1.8 2.1 -0.5 0.4 2.1 1.9 1 -1 1.9 1 1.9 -1.9 1 -0.4 2.1 -2.1 -0.5 L8 13.9 6.8 12.1 4.7 12.6 4.3 10.5 2.4 9.5 3.4 7.6 2.4 5.7 4.3 4.7 4.7 2.6 6.8 3.1 Z" fill="url(#sv)" stroke="#5e5e66" strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="8" cy="7.6" r="2.1" fill="#e8e8ec" stroke="#5e5e66" strokeWidth="0.9" />
    </svg>
  );
}

export function PaperclipIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15">
      <path d="M11.8 4.2 L6.4 9.6 a1.8 1.8 0 0 0 2.5 2.5 l5.4 -5.4 a3.6 3.6 0 0 0 -5 -5 L3.5 7.5 a5.4 5.4 0 0 0 7.6 7.6" stroke="#77777f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function BuzzBellIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15">
      {silver}
      <path d="M8 1.6 c2.6 0 4 2 4 4.6 0 3 1.4 4.4 1.4 4.4 H2.6 c0 0 1.4 -1.4 1.4 -4.4 0 -2.6 1.4 -4.6 4 -4.6 Z" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" />
      <circle cx="8" cy="12.4" r="1.5" fill="url(#svd)" stroke="#5e5e66" strokeWidth="0.8" />
      <path d="M12.5 2.5 q1.6 1.2 1.2 3" stroke="#c02a2a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AddContactIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15">
      {silver}
      <circle cx="6.6" cy="5" r="3" fill="url(#sv)" stroke="#5e5e66" strokeWidth="1" />
      <path d="M1.6 14 Q1.6 9.4 6.6 9.4 Q11.6 9.4 11.6 14 Z" fill="url(#svd)" stroke="#5e5e66" strokeWidth="1" />
      <path d="M13.6 5.6 v5 M11.1 8.1 h5" stroke="#3a7a2a" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function SmsIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <rect x="1" y="2.6" width="12" height="8.8" rx="1.6" fill="#8a55b0" stroke="#5e2b85" strokeWidth="0.8" />
      <path d="M4 11.4 h6" stroke="#5e2b85" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="3" y="4.6" width="8" height="1.2" rx="0.6" fill="#fff" opacity="0.9" />
      <rect x="3" y="6.8" width="5.4" height="1.2" rx="0.6" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export function PhoneIcon({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <path d="M3.2 1.8 c0.8 -0.8 1.8 -0.6 2.3 0.2 l0.8 1.4 c0.4 0.7 0.2 1.4 -0.4 1.9 l-0.5 0.4 c0.5 1.2 1.5 2.2 2.7 2.8 l0.4 -0.5 c0.5 -0.6 1.2 -0.8 1.9 -0.4 l1.4 0.8 c0.8 0.5 1 1.5 0.2 2.3 l-0.7 0.7 c-0.7 0.7 -1.7 0.9 -2.6 0.5 C5.4 10.6 3.4 8.6 2.1 5.4 1.7 4.5 1.9 3.5 2.5 2.8 Z" fill={color} stroke="rgba(60,20,90,0.5)" strokeWidth="0.6" />
    </svg>
  );
}

export function ComposeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <rect x="1.4" y="2.4" width="11.2" height="9.2" rx="1.2" fill="#fff" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
      <path d="M3.4 5.2 h7 M3.4 7 h7 M3.4 8.8 h4.4" stroke="#7c3fa8" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function YUpdatesStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M6 0.6 L7.4 4.2 L11.4 4.4 L8.2 6.8 L9.4 10.6 L6 8.4 L2.6 10.6 L3.8 6.8 L0.6 4.4 L4.6 4.2 Z" fill="#e88a1a" stroke="#a85a08" strokeWidth="0.7" />
    </svg>
  );
}

export function YBangIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2.4" fill="#5e1f8a" />
      <text x="2.6" y="10.6" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="10" fill="#fff">Y!</text>
    </svg>
  );
}
