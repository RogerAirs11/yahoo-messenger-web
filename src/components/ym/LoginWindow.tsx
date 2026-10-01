'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useYM } from '@/lib/ym/store';
import { YmWindow } from './Window';
import { MenuBar } from './MenuBar';
import { YmLoginLogo } from './icons';

const LANGUAGES = [
  'Deutsch (Deutschland)',
  'English (U.K.)',
  'English (U.S.)',
  'español (Argentina)',
  'español (España)',
  'español (México)',
  'español (Estados Unidos)',
  'français (France)',
  'Bahasa Indonesia (Indonesia)',
  'italiano (Italia)',
  'Korean (South Korea)',
  'português (Brasil)',
  'Thai (Thailand)',
  'Vietnamese (Vietnam)',
  'Chinese (Hong Kong)',
  'Chinese (Taiwan)',
];

export function LoginWindow() {
  const win = useYM((s) => s.windows.login);
  const focusWin = useYM((s) => s.focusWin);
  const signIn = useYM((s) => s.signIn);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [autoIn, setAutoIn] = useState(true);
  const [invisible, setInvisible] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('English (U.S.)');
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  const canSign = id.trim().length > 0;

  return (
    <YmWindow
      winKey="login"
      x={win.x}
      y={win.y}
      z={win.z}
      width={352}
      wordmark
      title={<YmLoginTitle />}
      onClose={() => useYM.setState((s) => ({ windows: { ...s.windows, login: { ...s.windows.login, visible: false } } }))}
    >
      <MenuBar
        menus={[
          {
            label: 'Messenger',
            items: [
              { label: 'Sign In', disabled: !canSign, onClick: () => canSign && signIn(id) },
              { label: 'My Account Info', disabled: true },
              { sep: true },
              { label: 'Preferences...', onClick: () => alert('Preferences') },
              { sep: true },
              { label: 'Exit', onClick: () => useYM.setState((s) => ({ windows: { ...s.windows, login: { ...s.windows.login, visible: false } } })) },
            ],
          },
          {
            label: 'Help',
            items: [
              { label: 'Yahoo! Messenger Help', onClick: () => alert('Welcome to Yahoo! Messenger 9 — the purple era of pure nostalgia.') },
              { sep: true },
              { label: 'About Yahoo! Messenger', onClick: () => alert('Yahoo! Messenger 9.0\nWeb Edition\n\n© 2008 Yahoo! Inc.\nRecreated with love for the nostalgia.') },
            ],
          },
        ]}
      />
      <div className="ym-login-body">
        <div className="ym-login-logo">
          <YmLoginLogo width={212} />
        </div>
        <div className="ym-login-form">
          <label>Yahoo! ID:</label>
          <input
            className="ym-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSign && signIn(id)}
            autoFocus
            spellCheck={false}
          />
          <label>Password:</label>
          <input
            className="ym-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSign && signIn(id)}
          />
          <div className="ym-login-checks">
            <span className={`ym-check${remember ? ' checked' : ''}`} onClick={() => setRemember(!remember)}>
              <span className="box" /> Remember my ID &amp; password
            </span>
            <span className={`ym-check${autoIn ? ' checked' : ''}`} onClick={() => setAutoIn(!autoIn)}>
              <span className="box" /> Sign in automatically
            </span>
            <span className={`ym-check${invisible ? ' checked' : ''}`} onClick={() => setInvisible(!invisible)}>
              <span className="box" /> Sign in as invisible to everyone
            </span>
          </div>
          <button className="ym-btn ym-signin-btn" disabled={!canSign} onClick={() => signIn(id)}>
            Sign In
          </button>
          <div style={{ marginTop: 18 }}>
            <label>Language:</label>
          </div>
          <div className="ym-select" ref={langRef} onClick={() => setLangOpen(!langOpen)}>
            <span className="sel-val">{lang}</span>
            <span className="sel-arrow"><svg width="8" height="6" viewBox="0 0 8 6"><path d="M0 0 L8 0 L4 5.5 Z" fill="#4a4a44" /></svg></span>
            {langOpen && (
              <div className="ym-select-list ym-scroll" onClick={(e) => e.stopPropagation()}>
                {LANGUAGES.map((l) => (
                  <div
                    key={l}
                    className={`ym-select-opt${l === lang ? ' sel' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLang(l);
                      setLangOpen(false);
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="ym-login-links">
          <a onClick={() => alert('Get a new Yahoo! ID — circa 2008, sign-up was free and took 3 minutes.')}>Create a New Yahoo! ID...</a>
          <a onClick={() => alert('Password help: try "password123" — kidding. This is a nostalgia piece.')}>Forgot your password?</a>
        </div>
      </div>
    </YmWindow>
  );
}

function YmLoginTitle() {
  return (
    <span className="tb-wordmark">
      <span className="yw">Yahoo!</span>
      <span className="ym">MESSENGER</span>
    </span>
  );
}
