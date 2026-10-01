'use client';

import React, { useEffect, useState } from 'react';
import { useYM } from '@/lib/ym/store';
import { LoginWindow, SignInSplash } from './LoginWindow';
import { BuddyList } from './BuddyList';
import { ImWindow } from './ImWindow';
import { Emoticon } from '@/lib/ym/emoticons';
import { sounds } from '@/lib/ym/sounds';

function BlissWallpaper() {
  return (
    <div className="ym-bliss">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1200 800" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e56c8" />
            <stop offset="45%" stopColor="#4a90e2" />
            <stop offset="75%" stopColor="#8ec4f0" />
            <stop offset="100%" stopColor="#c8e4f8" />
          </linearGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ec83a" />
            <stop offset="40%" stopColor="#5aa822" />
            <stop offset="100%" stopColor="#2f7010" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#sky)" />
        <ellipse cx="260" cy="150" rx="150" ry="42" fill="#fff" opacity="0.85" />
        <ellipse cx="360" cy="170" rx="110" ry="34" fill="#fff" opacity="0.7" />
        <ellipse cx="900" cy="110" rx="180" ry="48" fill="#fff" opacity="0.75" />
        <ellipse cx="1030" cy="140" rx="110" ry="30" fill="#fff" opacity="0.6" />
        <ellipse cx="620" cy="230" rx="90" ry="26" fill="#fff" opacity="0.5" />
        <path d="M0,560 Q300,430 600,510 T1200,480 L1200,800 L0,800 Z" fill="url(#hill)" />
        <path d="M0,640 Q400,560 750,610 T1200,590 L1200,800 L0,800 Z" fill="#469018" opacity="0.6" />
      </svg>
    </div>
  );
}

function Taskbar() {
  const st = useYM();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(new Date()), 30);
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);

  const online = st.phase === 'online';
  const ims = Object.entries(st.windows.im);

  const flash = (id: string) => (st.conversations[id]?.unread ?? 0) > 0;

  return (
    <div className="ym-taskbar">
      <div className="ym-start" title="start">
        <svg width="17" height="17" viewBox="0 0 17 17">
          <rect x="1" y="1" width="7" height="7" fill="#f25022" transform="skewX(-8)" />
          <rect x="9" y="1" width="7" height="7" fill="#7fba00" transform="skewX(-8)" />
          <rect x="1" y="9" width="7" height="7" fill="#00a4ef" transform="skewX(-8)" />
          <rect x="9" y="9" width="7" height="7" fill="#ffb900" transform="skewX(-8)" />
        </svg>
        start
      </div>
      {online && (
        <div
          className={`ym-task-btn ${st.windows.buddylist.visible ? 'active' : ''}`}
          onClick={() => (st.windows.buddylist.visible ? st.minimizeWin('buddylist') : st.restoreWin('buddylist'))}
          title="Yahoo! Messenger"
        >
          <Emoticon type="happy" size={14} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Yahoo! Messenger</span>
        </div>
      )}
      {ims.map(([id, w]) => {
        const b = st.buddies.find((x) => x.id === id);
        if (!b) return null;
        return (
          <div
            key={id}
            className={`ym-task-btn ${w.visible ? 'active' : ''} ${flash(id) ? 'ym-taskbtn-flash' : ''}`}
            onClick={() => (w.visible ? st.minimizeWin(id) : st.restoreWin(id))}
          >
            <Emoticon type={b.id === 'ysearch' ? 'cool' : 'happy'} size={14} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
            {flash(id) && <span className="ym-unread-badge">{st.conversations[id].unread}</span>}
          </div>
        );
      })}
      <div className="ym-tray">
        <span
          title={online ? 'Yahoo! Messenger — click to show/hide' : 'Yahoo! Messenger'}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => {
            if (!online) return;
            if (st.windows.buddylist.visible) st.minimizeWin('buddylist');
            else st.restoreWin('buddylist');
          }}
        >
          <Emoticon type={online ? 'happy' : 'straight'} size={16} />
        </span>
        <span style={{ opacity: 0.9 }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7,1 C4,1 2,3.4 2,6.2 L2,9.4 L0.8,11.4 L13.2,11.4 L12,9.4 L12,6.2 C12,3.4 10,1 7,1 Z" fill="#e8e8e8" stroke="#888" strokeWidth="0.8" />
            <path d="M5.4,12.4 C5.6,13.2 6.2,13.6 7,13.6 C7.8,13.6 8.4,13.2 8.6,12.4 Z" fill="#c8c8c8" />
          </svg>
        </span>
        <span style={{ textShadow: '0 1px 1px rgba(0,0,60,.5)', fontVariantNumeric: 'tabular-nums' }}>
          {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
        </span>
      </div>
    </div>
  );
}

/** Keeps the world alive: buddies drift in & out, someone may IM you, rare buzz wars. */
function useLiveness() {
  const phase = useYM((s) => s.phase);
  useEffect(() => {
    if (phase !== 'online') return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const st = useYM.getState();
      const roll = Math.random();
      const nonSearch = st.buddies.filter((b) => b.id !== 'ysearch');
      if (roll < 0.22) {
        // someone signs in
        const offs = nonSearch.filter((b) => b.status === 'offline');
        if (offs.length) {
          const b = offs[Math.floor(Math.random() * offs.length)];
          st.setBuddyStatus(b.id, 'online');
        }
      } else if (roll < 0.36) {
        // someone signs out
        const ons = nonSearch.filter((b) => b.status !== 'offline');
        if (ons.length > 3) {
          const b = ons[Math.floor(Math.random() * ons.length)];
          st.setBuddyStatus(b.id, 'offline');
        }
      } else if (roll < 0.46) {
        // a status message changes
        const ons = nonSearch.filter((b) => b.status === 'online' && b.id !== 'ysearch');
        if (ons.length) {
          const b = ons[Math.floor(Math.random() * ons.length)];
          const msgs = ['Stepped Out', 'brb :)', "I'm mobile", 'Eric Burke ate my inbox', '♫ The Choir - Cold Outside', 'so sleepy :-S', 'Out To Lunch'];
          useYM.setState((s) => ({ buddies: s.buddies.map((x) => (x.id === b.id ? { ...x, statusMsg: msgs[Math.floor(Math.random() * msgs.length)] } : x)) }));
        }
      } else if (roll < 0.55) {
        // someone IMs you out of nowhere
        const ons = nonSearch.filter((b) => b.status === 'online');
        if (ons.length) {
          const b = ons[Math.floor(Math.random() * ons.length)];
          const lines = [
            ['heyyy u there?', 'did u get my email??'],
            ['ASL? jk jk lol :))', 'wut r u doing'],
            ['check out this song ♫', 'its SO good'],
            ['u free this weekend?', 'a few of us r hanging out'],
            ['BUZZ', 'haha jk :P'],
          ];
          const picked = lines[Math.floor(Math.random() * lines.length)];
          st.openIm(b.id, true);
          setTimeout(() => {
            useYM.getState().setTyping(b.id, true);
            setTimeout(() => {
              useYM.getState().setTyping(b.id, false);
              useYM.getState().buddySays(b.id, picked);
              if (picked[0] === 'BUZZ') setTimeout(() => useYM.getState().buddyBuzz(b.id), 1200);
            }, 1400);
          }, 700);
        }
      }
    };
    const iv = setInterval(tick, 17000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [phase]);
}

export function YMDesktop() {
  useLiveness();
  const st = useYM();
  const ims = Object.keys(st.windows.im);

  return (
    <div className="ym-root" style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <BlissWallpaper />
      <LoginWindow />
      <SignInSplash />
      <BuddyList />
      {ims.map((id) => (
        <ImWindow key={id} buddyId={id} />
      ))}
      <Taskbar />
    </div>
  );
}
