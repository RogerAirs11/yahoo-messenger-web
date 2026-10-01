'use client';

import React, { useEffect, useState } from 'react';
import { useYM } from '@/lib/ym/store';
import { LoginWindow } from './LoginWindow';
import { BuddyList } from './BuddyList';
import { ImWindow } from './ImWindow';
import { YmSmiley, YBangIcon } from './icons';

export function Desktop() {
  const phase = useYM((s) => s.phase);
  const windows = useYM((s) => s.windows);
  const me = useYM((s) => s.me);
  const buddies = useYM((s) => s.buddies);
  const conversations = useYM((s) => s.conversations);
  const focusWin = useYM((s) => s.focusWin);
  const minimizeWin = useYM((s) => s.minimizeWin);

  // ambient life: random buddy status changes while online
  useEffect(() => {
    if (phase !== 'online') return;
    const t = setInterval(() => {
      const s = useYM.getState();
      const active = s.buddies.filter((b) => b.id !== 'sbacon');
      const b = active[Math.floor(Math.random() * active.length)];
      if (!b) return;
      if (Math.random() < 0.5 && b.status !== 'offline') {
        s.setBuddyStatus(b.id, 'offline');
        if (s.conversations[b.id]) {
          s.pushMsg(b.id, { kind: 'system', from: 'sys', text: `${b.name} has signed out. (${new Date().toLocaleString()})`, ts: Date.now() });
        }
      } else if (b.status === 'offline') {
        s.setBuddyStatus(b.id, 'online');
        if (s.conversations[b.id]) {
          s.pushMsg(b.id, { kind: 'system', from: 'sys', text: `${b.name} has signed back in. (${new Date().toLocaleString()})`, ts: Date.now() });
        }
      }
    }, 24000);
    return () => clearInterval(t);
  }, [phase]);

  // occasional incoming BUZZ from Michael
  useEffect(() => {
    if (phase !== 'online') return;
    const t = setInterval(() => {
      if (Math.random() < 0.3 && useYM.getState().windows.im['mmuchmore']) {
        useYM.getState().buddyBuzz('mmuchmore');
      }
    }, 45000);
    return () => clearInterval(t);
  }, [phase]);

  const taskWins: { key: string; label: string; icon: string }[] = [];
  if (phase === 'online' && windows.buddylist.open) {
    taskWins.push({ key: 'buddylist', label: 'Yahoo! Messenger', icon: '/favicon-yahoo.ico' });
  }
  Object.keys(windows.im).forEach((k) => {
    const b = buddies.find((x) => x.id === k);
    if (b) taskWins.push({ key: k, label: b.name, icon: b.avatar || '' });
  });

  const unreadFor = (key: string) => (conversations[key]?.unread ?? 0) > 0;

  return (
    <div className="ym-desktop">
      {phase === 'login' && windows.login.visible && <LoginWindow />}
      {phase === 'signing' && <SigningDialog />}
      {phase === 'online' && windows.buddylist.visible && <BuddyList />}
      {Object.keys(windows.im).map((k) =>
        windows.im[k].visible ? <ImWindow key={k} buddyId={k} /> : null,
      )}

      {/* XP taskbar */}
      <div className="ym-taskbar">
        <span className="ym-start">
          <svg width="17" height="17" viewBox="0 0 17 17">
            <rect x="1" y="1" width="7" height="7" rx="1" fill="#f65314" />
            <rect x="9" y="1" width="7" height="7" rx="1" fill="#7cbb00" />
            <rect x="1" y="9" width="7" height="7" rx="1" fill="#00a1f1" />
            <rect x="9" y="9" width="7" height="7" rx="1" fill="#ffbb00" />
          </svg>
          start
        </span>
        <div className="ym-taskbtns">
          {taskWins.map((t) => (
            <span
              key={t.key}
              className={`ym-taskbtn${unreadFor(t.key) ? ' active' : ''}`}
              title={t.label}
              onClick={(e) => {
                const w = t.key === 'buddylist' ? windows.buddylist : windows.im[t.key];
                if (!w) return;
                if (w.visible && w.z === useYM.getState().zTop) minimizeWin(t.key);
                else focusWin(t.key);
              }}
            >
              {t.key === 'buddylist' ? <YBangIcon size={14} /> : <img src={t.icon} alt="" />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
            </span>
          ))}
        </div>
        <div className="ym-tray">
          <span title="Yahoo! Messenger" style={{ display: 'flex' }}><YmSmiley size={15} /></span>
          <span title="Volume">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M2 5 h2.4 L8 2 v10 L4.4 9 H2 Z" fill="#fff" />
              <path d="M9.6 4.6 q1.8 2.4 0 4.8 M11.4 3 q2.8 4 0 8" stroke="#fff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <Clock />
        </div>
      </div>
      {me.name && phase === 'online' && null}
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);
  if (!now) return <span className="ym-clock">--:--</span>;
  return (
    <span className="ym-clock">
      {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
    </span>
  );
}

/** the classic "Signing in..." dialog with progress bar */
function SigningDialog() {
  const progress = useYM((s) => s.signingProgress);
  return (
    <div className="ym-signing" style={{ left: '50%', top: '38%', transform: 'translate(-50%,-50%)', zIndex: 99999 }}>
      <div className="ym-titlebar">
        <YmSmiley size={15} />
        <span className="tb-text">Yahoo! Messenger</span>
      </div>
      <div className="ym-signing-body">
        <YmSmiley size={44} />
        <div style={{ flex: 1 }}>
          <div className="ym-signing-txt">
            <b>Signing in to Yahoo! Messenger...</b>
            <div style={{ marginTop: 3, color: '#666' }}>{me_label()}</div>
          </div>
          <div className="ym-signing-progress">
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function me_label() {
  const name = useYM.getState().me.name;
  return name ? `${name}@yahoo.com` : '';
}
