'use client';

import React, { useState } from 'react';
import { YmWindow, MenuBar } from './YmWindow';
import { useYM } from '@/lib/ym/store';

function YahooLoginLogo() {
  return (
    <svg width="150" height="104" viewBox="0 0 150 104" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="sphere" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#d8d8dc" />
          <stop offset="100%" stopColor="#8a8a92" />
        </radialGradient>
        <linearGradient id="ybanner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a3fc0" />
          <stop offset="100%" stopColor="#5e1f96" />
        </linearGradient>
      </defs>
      {/* tilted purple Y! banner */}
      <g transform="rotate(-8 62 42)">
        <rect x="18" y="14" width="88" height="56" rx="10" fill="url(#ybanner)" stroke="#4a1478" strokeWidth="2" />
        <path d="M40,66 L34,84 L58,70 Z" fill="#5e1f96" stroke="#4a1478" strokeWidth="2" strokeLinejoin="round" />
        <text x="62" y="58" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="bold" fontStyle="italic" fontSize="42" fill="#fff">
          Y!
        </text>
      </g>
      {/* silver messenger sphere */}
      <g>
        <circle cx="106" cy="72" r="26" fill="url(#sphere)" stroke="#6a6a72" strokeWidth="1.5" />
        <ellipse cx="96" cy="66" rx="2.6" ry="3.2" fill="#4a4a52" />
        <ellipse cx="114" cy="66" rx="2.6" ry="3.2" fill="#4a4a52" />
        <path d="M96,80 Q106,89 116,79" fill="none" stroke="#4a4a52" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="98" cy="60" rx="4" ry="2.4" fill="#fff" opacity="0.7" />
      </g>
    </svg>
  );
}

export function LoginWindow() {
  const { windows, focusWin, moveWin, minimizeWin, zTop, signIn, phase } = useYM();
  const w = windows.login;
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(true);
  const [autoIn, setAutoIn] = useState(true);
  const [invisible, setInvisible] = useState(false);
  const [lang, setLang] = useState('English (U.S.)');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!id.trim()) {
      setErr('Please enter your Yahoo! ID.');
      return;
    }
    setErr('');
    signIn(id.trim().toLowerCase().replace(/\s+/g, '_'));
  };

  return (
    <YmWindow
      width={332}
      height={478}
      x={w.x}
      y={w.y}
      z={w.z}
      visible={w.visible && (phase === 'login')}
      showLogo
      onFocus={() => focusWin('login')}
      onMove={(x, y) => moveWin('login', x, y)}
      onMinimize={() => minimizeWin('login')}
      menuBar={
        <MenuBar
          menus={[
            {
              label: 'Messenger',
              items: [
                { label: 'Sign In', onClick: submit },
                { label: 'My Account Info...' },
                { type: 'sep' },
                { label: 'Preferences...' },
                { type: 'sep' },
                { label: 'Exit', onClick: () => setErr('Nice try — this is the only way in. :)') },
              ],
            },
            {
              label: 'Help',
              items: [
                { label: 'Yahoo! Messenger Help' },
                { label: 'Check for Updates...' },
                { type: 'sep' },
                { label: 'About Yahoo! Messenger' },
              ],
            },
          ]}
        />
      }
    >
      <div style={{ flex: 1, background: '#fcfbf6', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto' }}>
        <div style={{ height: 10 }} />
        <YahooLoginLogo />
        <div style={{ height: 14 }} />
        <div style={{ width: 236, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ color: '#2d2d2d', fontSize: 11 }}>Yahoo! ID:</label>
          <input
            className="ym-input"
            style={{ height: 20 }}
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
            spellCheck={false}
          />
          <label style={{ color: '#2d2d2d', fontSize: 11, marginTop: 2 }}>Password:</label>
          <input
            className="ym-input"
            type="password"
            style={{ height: 20 }}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#2d2d2d' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember my ID and password
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#2d2d2d' }}>
              <input type="checkbox" checked={autoIn} onChange={(e) => setAutoIn(e.target.checked)} />
              Sign in automatically
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#2d2d2d' }}>
              <input type="checkbox" checked={invisible} onChange={(e) => setInvisible(e.target.checked)} />
              Sign in as invisible to everyone
            </label>
          </div>
          {err && <div style={{ color: '#c81414', fontSize: 11 }}>{err}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <button className="ym-btn" style={{ padding: '4px 26px', fontSize: 12 }} onClick={submit}>
              Sign In
            </button>
          </div>
          <div style={{ marginTop: 12, color: '#2d2d2d' }}>Language:</div>
          <select className="ym-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {['English (U.S.)', 'English (U.K.)', 'español (Argentina)', 'español (España)', 'español (México)', 'français (France)', 'Bahasa Indonesia (Indonesia)', 'italiano (Italia)', 'português (Brasil)', 'Thai (Thailand)', 'Vietnamese (Vietnam)', 'Chinese (Hong Kong)'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingBottom: 12 }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#2a54c8', textDecoration: 'underline', fontSize: 11 }}>
            Get a new Yahoo! ID...
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#2a54c8', textDecoration: 'underline', fontSize: 11 }}>
            Forgot your password?
          </a>
        </div>
        <div style={{ marginTop: 'auto', width: '100%', height: 22, flex: 'none', background: 'linear-gradient(180deg,#9a68c8,#6d3f97)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <span style={{ color: '#e8d8f8', fontSize: 10 }}>© 2008 Yahoo! Inc. · Do not ding the messenger.</span>
        </div>
      </div>
    </YmWindow>
  );
}

export function SignInSplash() {
  const phase = useYM((s) => s.phase);
  const prog = useYM((s) => s.signingProgress);
  if (phase !== 'signing') return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ym-window" style={{ position: 'relative', width: 300, height: 168 }}>
        <div className="ym-titlebar">
          <span className="ym-logo">
            YAHOO!<span className="messenger">MESSENGER</span>
          </span>
        </div>
        <div style={{ flex: 1, background: '#fcfbf6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="34" height="34" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7.4" fill="#6D3FA8" stroke="#4A2378" strokeWidth="0.8" />
              <text x="8" y="11.8" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontStyle="italic" fontSize="10" fill="#fff">
                Y!
              </text>
            </svg>
            <span style={{ fontSize: 12, color: '#2d1145' }}>Signing in to Yahoo! Messenger...</span>
          </div>
          <div className="ym-progress-track">
            <div className="ym-progress-fill" style={{ width: `${prog}%` }} />
          </div>
          <span style={{ color: '#7a6a90', fontSize: 10 }}>Doors are opening for your friends...</span>
        </div>
      </div>
    </div>
  );
}
