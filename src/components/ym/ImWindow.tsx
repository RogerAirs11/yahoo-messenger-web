'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { YmWindow, MenuBar, MenuDef } from './YmWindow';
import { useYM, ChatMessage } from '@/lib/ym/store';
import { Buddy, seedFor, AvatarSvg, AUDIBLES, AD_ROTATION } from '@/lib/ym/data';
import { Emoticon, EMOTICONS, codeFor, renderEmotes } from '@/lib/ym/emoticons';
import { sounds } from '@/lib/ym/sounds';

/* ---------- small svg icons for the toolbar ---------- */
const ICONS = {
  video: (
    <svg width="26" height="22" viewBox="0 0 26 22">
      <rect x="1.5" y="4" width="16" height="14" rx="3" fill="#7d7d84" stroke="#4a4a52" strokeWidth="1" />
      <circle cx="9.5" cy="11" r="4.2" fill="#3a3a42" stroke="#2a2a30" strokeWidth="0.8" />
      <circle cx="9.5" cy="11" r="2" fill="#8ab8e8" />
      <path d="M18.5,9.5 L24,6.5 L24,15.5 L18.5,12.5 Z" fill="#7d7d84" stroke="#4a4a52" strokeWidth="1" />
    </svg>
  ),
  mic: (
    <svg width="20" height="24" viewBox="0 0 20 24">
      <rect x="7" y="2" width="6" height="11" rx="3" fill="#7d7d84" stroke="#4a4a52" strokeWidth="1" />
      <path d="M4.5,11 C4.5,15 6.5,17 10,17 C13.5,17 15.5,15 15.5,11" fill="none" stroke="#4a4a52" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10,17 L10,21 M6,21.5 L14,21.5" stroke="#4a4a52" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  imv: (
    <svg width="26" height="22" viewBox="0 0 26 22">
      <path d="M13,2 L15.5,8.5 L22,9 L17,13.2 L18.8,20 L13,16.2 L7.2,20 L9,13.2 L4,9 L10.5,8.5 Z" fill="#e88a2a" stroke="#a85a10" strokeWidth="1" />
      <path d="M20,2 L21,4.5 L23.5,5 L21.5,6.8 L22.2,9.5 L20,8 L17.8,9.5 L18.5,6.8 L16.5,5 L19,4.5 Z" fill="#4aa8e8" stroke="#2070b0" strokeWidth="0.8" />
      <path d="M5,14 L6,16.5 L8.5,17 L6.5,18.8 L7.2,21 L5,19.8 L2.8,21 L3.5,18.8 L1.5,17 L4,16.5 Z" fill="#c84ac8" stroke="#883088" strokeWidth="0.8" />
    </svg>
  ),
  photos: (
    <svg width="26" height="22" viewBox="0 0 26 22">
      <rect x="4" y="2" width="16" height="13" rx="1.5" fill="#fff" stroke="#4a4a52" strokeWidth="1.2" />
      <rect x="6.5" y="4.5" width="11" height="8" fill="#9ac8e8" />
      <circle cx="12" cy="9" r="2.4" fill="#f2c9a0" stroke="#c89868" strokeWidth="0.7" />
      <rect x="9" y="7" width="16" height="13" rx="1.5" fill="#fff" stroke="#4a4a52" strokeWidth="1.2" />
      <rect x="11.5" y="9.5" width="11" height="8" fill="#c8e8a8" />
      <circle cx="17" cy="12.6" r="2" fill="#e8b088" stroke="#b08050" strokeWidth="0.7" />
    </svg>
  ),
};

function Knight() {
  return (
    <span style={{ fontSize: 22, lineHeight: '22px', color: '#5a5a62', fontFamily: 'Georgia, serif' }}>♞</span>
  );
}

const AUDIBLE_FACES = ['happy', 'big grin', 'winking', 'tongue', 'cool', 'blushing', 'laughing', 'angel'];

const COLORS = ['#000000', '#7a3fa8', '#4a57a8', '#2a7a3a', '#c87800', '#c81414', '#e858a8', '#3a8ab8'];
const FONTS = ['Arial', 'Tahoma', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS'];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18];

export function ImWindow({ buddyId }: { buddyId: string }) {
  const st = useYM();
  const buddy: Buddy | undefined = st.buddies.find((b) => b.id === buddyId);
  const w = st.windows.im[buddyId];
  const conv = st.conversations[buddyId] ?? { messages: [], typing: false, unread: 0 };
  const [text, setText] = useState('');
  const [showEmo, setShowEmo] = useState(false);
  const [showFmt, setShowFmt] = useState(true);
  const [audiblesOpen, setAudiblesOpen] = useState(true);
  const [fmt, setFmt] = useState<ChatMessage['fmt']>({});
  const [colorOpen, setColorOpen] = useState(false);
  const [shakeOn, setShakeOn] = useState(false);
  const [adIdx, setAdIdx] = useState(() => Math.floor(Math.random() * AD_ROTATION.length));
  const convoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const shakeCount = st.shakeIm[buddyId] ?? 0;
  useEffect(() => {
    if (shakeCount === 0) return;
    const t1 = setTimeout(() => setShakeOn(true), 0);
    const t2 = setTimeout(() => setShakeOn(false), 620);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shakeCount]);

  useEffect(() => {
    if (convoRef.current) convoRef.current.scrollTop = convoRef.current.scrollHeight;
  }, [conv.messages.length, conv.typing]);

  useEffect(() => {
    const t = setInterval(() => setAdIdx((i) => i + 1), 24000);
    return () => clearInterval(t);
  }, []);

  const statusText = useMemo(() => {
    if (!buddy) return '';
    if (buddy.id === 'ysearch') return 'Web Search';
    switch (buddy.status) {
      case 'online':
        return ' - Available';
      case 'busy':
        return ' - Busy';
      case 'idle':
        return ' - Idle';
      default:
        return ' - Offline';
    }
  }, [buddy]);

  if (!buddy || !w) return null;

  const send = () => {
    if (!text.trim()) return;
    st.sendMyMsg(buddyId, text, fmt);
    setText('');
    setFmt({});
  };

  const insertEmo = (label: string) => {
    setText((t) => (t ? t + ' ' : '') + codeFor(label) + ' ');
    setShowEmo(false);
    inputRef.current?.focus();
  };

  const menus: MenuDef[] = [
    {
      label: 'Conversation',
      items: [
        { label: 'Send an Instant Message...', onClick: () => inputRef.current?.focus() },
        { label: 'Send a File...' },
        { type: 'sep' },
        { label: 'Save Conversation...' },
        { label: 'Print...' },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Cut', onClick: () => document.execCommand('cut') },
        { label: 'Copy', onClick: () => document.execCommand('copy') },
        { label: 'Paste', onClick: () => inputRef.current?.focus() },
        { type: 'sep' },
        { label: 'Select All', onClick: () => inputRef.current?.select() },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Show Timestamps', checked: st.showTimestamps, onClick: () => st.toggleTimestamps() },
        { label: 'Show Audibles Bar', checked: audiblesOpen, onClick: () => setAudiblesOpen(!audiblesOpen) },
        { label: 'Show Formatting Bar', checked: showFmt, onClick: () => setShowFmt(!showFmt) },
        { type: 'sep' },
        { label: 'Emoticons...', onClick: () => setShowEmo(!showEmo) },
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'Buzz!', bold: true, onClick: () => st.sendMyBuzz(buddyId) },
        { type: 'sep' },
        { label: 'Invite to Conference...' },
        { label: 'Send a File...' },
        { label: 'Call Computer' },
        { type: 'sep' },
        { label: 'View Profile...' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Yahoo! Messenger Help' },
        { type: 'sep' },
        { label: 'Emoticon Shortcuts', onClick: () => setShowEmo(true) },
        { label: 'About Yahoo! Messenger' },
      ],
    },
  ];

  const ad = AD_ROTATION[adIdx % AD_ROTATION.length];

  return (
    <YmWindow
      width={442}
      height={478}
      x={w.x}
      y={w.y}
      z={w.z}
      visible={w.visible}
      shaking={shakeOn}
      logoIcon
      title={`${buddy.name}${buddy.id === 'ysearch' ? '' : ' - Instant Message'}`}
      onFocus={() => st.focusWin(buddyId)}
      onMove={(x, y) => st.moveWin(buddyId, x, y)}
      onMinimize={() => st.minimizeWin(buddyId)}
      onClose={() => st.closeIm(buddyId)}
      menuBar={<MenuBar menus={menus} />}
    >
      {/* ---------- toolbar ---------- */}
      <div className="ym-im-toolbar">
        <div className="ym-tool-btn" title="Start a Video Call">
          {ICONS.video}
          <span className="lbl">Video Call</span>
        </div>
        <div className="ym-tool-btn" title="Start a Voice Call">
          {ICONS.mic}
          <span className="lbl">
            Voice Call <span className="caret">▼</span>
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          <div className="ym-tool-btn" title="Change your IMVironment">
            {ICONS.imv}
            <span className="lbl">
              IMVironments <span className="caret">▼</span>
            </span>
          </div>
          <div className="ym-tool-btn" title="Play a game">
            <Knight />
            <span className="lbl">
              Activities <span className="caret">▼</span>
            </span>
          </div>
          <div className="ym-tool-btn" title="Share Photos">
            {ICONS.photos}
            <span className="lbl">Photos</span>
          </div>
        </div>
      </div>

      {/* ---------- status row ---------- */}
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: '#f7f2fc', borderBottom: '1px solid #d8c8ea' }}>
        <span className={`ym-dot ${buddy.status === 'offline' ? 'offline' : buddy.status === 'mobile' ? 'mobile' : buddy.status}`} />
        <b style={{ color: '#1c1c1c' }}>{buddy.name}</b>
        <span style={{ color: '#6a6a7a' }}>{statusText}</span>
        {buddy.statusMsg && buddy.id !== 'ysearch' && (
          <span style={{ color: '#8a7ba0', marginLeft: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {buddy.statusMsg}</span>
        )}
        <span style={{ marginLeft: 'auto', color: '#5a3a80', fontSize: 10, cursor: 'pointer' }}>
          <svg width="14" height="11" viewBox="0 0 14 11"><rect x="0.5" y="0.5" width="13" height="10" rx="2" fill="none" stroke="#5a3a80" strokeWidth="1.1" /><path d="M2.5,3 L7,6.2 L11.5,3" fill="none" stroke="#5a3a80" strokeWidth="1.1" /></svg>
        </span>
      </div>

      {/* ---------- conversation ---------- */}
      <div className="ym-convo" ref={convoRef}>
        {conv.messages.map((m, i) => (
          <ImLine key={i} m={m} buddyName={buddy.name} showTs={st.showTimestamps} myName={st.me.name} />
        ))}
        {conv.typing && (
          <div style={{ color: '#8a7ba0', fontStyle: 'italic' }}>{buddy.name} is typing...</div>
        )}
      </div>

      {/* ---------- audibles bar ---------- */}
      {audiblesOpen && (
        <div className="ym-audibles-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#2a54c8', fontWeight: 700, fontSize: 11.5 }}>Hellos</span>
            <span style={{ color: '#4a4a5a' }}>Select an Audible below</span>
            <button className="ym-btn" style={{ marginLeft: 'auto', fontSize: 10, padding: '1px 8px' }} onClick={() => sounds.audible(500)}>
              More Audibles
            </button>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4, overflowX: 'auto' }}>
            {AUDIBLES.map((a, i) => (
              <div key={i} className="ym-audible-thumb" title={a.label} onClick={() => st.sendMyAudible(buddyId, i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Emoticon type={AUDIBLE_FACES[i % AUDIBLE_FACES.length]} size={27} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- formatting bar ---------- */}
      {showFmt && (
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '3px 6px', background: '#f2ebfa', borderTop: '1px solid #d5c4ea', position: 'relative' }}>
          {(['bold', 'italic', 'underline'] as const).map((k) => (
            <button
              key={k}
              style={{
                width: 20,
                height: 19,
                fontSize: 11.5,
                fontFamily: 'Georgia, serif',
                fontWeight: k === 'bold' ? 700 : 400,
                fontStyle: k === 'italic' ? 'italic' : 'normal',
                textDecoration: k === 'underline' ? 'underline' : 'none',
                border: '1px solid ' + (fmt[k] ? '#7c4ba9' : '#c0a8d8'),
                background: fmt[k] ? '#e2d2f2' : '#fff',
                borderRadius: 3,
                cursor: 'pointer',
                color: '#2d1145',
              }}
              onClick={() => setFmt((f) => ({ ...f, [k]: !f[k] }))}
            >
              {k === 'bold' ? 'B' : k === 'italic' ? 'I' : 'U'}
            </button>
          ))}
          <div style={{ position: 'relative' }}>
            <button
              style={{ width: 26, height: 19, border: '1px solid #c0a8d8', background: '#fff', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
              onClick={() => setColorOpen(!colorOpen)}
              title="Font color"
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: fmt.color ?? '#c81414', fontWeight: 700 }}>A</span>
              <span style={{ fontSize: 7 }}>▼</span>
            </button>
            {colorOpen && (
              <div className="ym-dropdown" style={{ left: 0, bottom: 24, top: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 18px)', gap: 2, padding: 4, minWidth: 0 }}>
                {COLORS.map((c) => (
                  <div
                    key={c}
                    style={{ width: 16, height: 16, background: c, border: '1px solid #888', cursor: 'pointer', borderRadius: 2 }}
                    onClick={() => {
                      setFmt((f) => ({ ...f, color: c }));
                      setColorOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <select className="ym-select" style={{ height: 20, marginLeft: 3 }} value={fmt.font ?? 'Arial'} onChange={(e) => setFmt((f) => ({ ...f, font: e.target.value }))}>
            {FONTS.map((f) => (
              <option key={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
          <select className="ym-select" style={{ height: 20, width: 44 }} value={fmt.size ?? 10} onChange={(e) => setFmt((f) => ({ ...f, size: Number(e.target.value) }))}>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span style={{ marginLeft: 'auto', color: '#7a6a90', fontSize: 9.5 }}>Enter = Send</span>
        </div>
      )}

      {/* ---------- icon strip ---------- */}
      <div className="ym-iconstrip" style={{ position: 'relative' }}>
        <div className="ym-icon-btn" title="Emoticons" onClick={() => setShowEmo(!showEmo)}>
          <Emoticon type="happy" size={15} />
          <span style={{ fontSize: 7, color: '#4a3a60' }}>▼</span>
        </div>
        <div className="ym-icon-btn" title="Audibles" onClick={() => setAudiblesOpen(!audiblesOpen)}>
          <svg width="17" height="14" viewBox="0 0 17 14">
            <path d="M1.5,2 C1.5,1.2 2.2,0.5 3,0.5 L14,0.5 C14.8,0.5 15.5,1.2 15.5,2 L15.5,8.5 C15.5,9.3 14.8,10 14,10 L6,10 L2.5,13 L2.5,10 L3,10 C2.2,10 1.5,9.3 1.5,8.5 Z" fill="#fff" stroke="#4a3a60" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M4.5,4 L12.5,4 M4.5,6.5 L10.5,6.5" stroke="#4a3a60" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 7, color: '#4a3a60' }}>▼</span>
        </div>
        <div className="ym-icon-btn" title="Formatting" onClick={() => setShowFmt(!showFmt)}>
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 13, color: '#2d1145' }}>T</span>
        </div>
        <div className="ym-icon-btn" title="IMVironments" onClick={() => sounds.tick()}>
          <svg width="15" height="15" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="3" fill="none" stroke="#4a3a60" strokeWidth="1.3" />
            <g stroke="#4a3a60" strokeWidth="1.3">
              <path d="M8,1 L8,3.4 M8,12.6 L8,15 M1,8 L3.4,8 M12.6,8 L15,8 M3,3 L4.8,4.8 M11.2,11.2 L13,13 M13,3 L11.2,4.8 M4.8,11.2 L3,13" strokeLinecap="round" />
            </g>
          </svg>
          <span style={{ fontSize: 7, color: '#4a3a60' }}>▼</span>
        </div>
        <div className="ym-icon-btn" title="Send a File">
          <svg width="15" height="14" viewBox="0 0 16 15">
            <path d="M1.5,4 L6,4 L7.5,6 L14.5,6 L14.5,13 L1.5,13 Z" fill="#fff" stroke="#4a3a60" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M1.5,4 L1.5,2.5 L5.5,2.5 L6,4" fill="#fff" stroke="#4a3a60" strokeWidth="1.1" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="ym-icon-btn" style={{ marginLeft: 'auto' }} title="Invite a friend">
          <svg width="15" height="14" viewBox="0 0 16 14">
            <circle cx="6" cy="4.5" r="2.6" fill="none" stroke="#4a3a60" strokeWidth="1.2" />
            <path d="M1.5,13 C1.5,9.5 10.5,9.5 10.5,13" fill="none" stroke="#4a3a60" strokeWidth="1.2" />
            <path d="M12.5,3.5 L12.5,8.5 M10,6 L15,6" stroke="#2a7a3a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 7, color: '#4a3a60' }}>▼</span>
        </div>

        {showEmo && (
          <div className="ym-dropdown" style={{ left: 2, bottom: 26, top: 'auto', display: 'block' }}>
            <div className="ym-emo-grid">
              {EMOTICONS.map((e) => (
                <div key={e.label} className="ym-emo-cell" title={`${e.label}  ${e.codes[0]}`} onClick={() => insertEmo(e.label)}>
                  <Emoticon type={e.label} size={19} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- input + send ---------- */}
      <div style={{ flex: 'none', display: 'flex', gap: 6, padding: '4px 7px 5px 7px', background: '#f2ebfa' }}>
        <textarea
          ref={inputRef}
          className="ym-input"
          style={{ flex: 1, height: 46, resize: 'none', lineHeight: '15px' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder=""
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <button className="ym-btn" style={{ minWidth: 58, padding: '3px 12px' }} onClick={send}>
            Send
          </button>
        </div>
      </div>

      {/* ---------- AD / NEWS footer ---------- */}
      <div className="ym-adbar">
        <span style={{ color: ad.kind === 'NEWS' ? '#2a54c8' : '#8a8a9a', fontWeight: 700 }}>{ad.kind}</span>
        <b>{ad.title}</b>
        <span>{ad.url}</span>
      </div>
    </YmWindow>
  );
}

function ImLine({ m, buddyName, showTs, myName }: { m: ChatMessage; buddyName: string; showTs: boolean; myName: string }) {
  const ts = new Date(m.ts);
  const tstr = `${ts.getMonth() + 1}/${ts.getDate()}/${ts.getFullYear()} ${ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  if (m.kind === 'buzz') {
    return (
      <div className="ym-line buzz" style={{ margin: '3px 0' }}>
        BUZZ!!!
      </div>
    );
  }
  if (m.kind === 'system') {
    return (
      <div className="ym-line" style={{ margin: '2px 0' }}>
        <span className="sys">{m.text}</span>
      </div>
    );
  }
  if (m.kind === 'audible') {
    const mine = m.from === 'me';
    return (
      <div style={{ margin: '5px 0', textAlign: mine ? 'right' : 'left' }}>
        <span
          style={{
            display: 'inline-block',
            background: mine ? 'linear-gradient(180deg,#efe2fb,#ddc4f2)' : 'linear-gradient(180deg,#fff9d8,#ffe873)',
            border: '1px solid #b89dd8',
            borderRadius: 10,
            padding: '4px 12px',
            fontWeight: 700,
            fontSize: 14,
            color: '#5a2a8a',
            boxShadow: '0 1px 2px rgba(80,40,120,.25)',
          }}
        >
          {renderEmotes(m.text, 15)}
        </span>
        {showTs && <div style={{ fontSize: 9, color: '#9a8ab0' }}>{tstr}</div>}
      </div>
    );
  }
  const mine = m.from === 'me';
  const f = m.fmt;
  return (
    <div className="ym-line">
      {showTs && <span style={{ color: '#a898c0', fontSize: 9.5, marginRight: 4 }}>[{tstr}]</span>}
      <span className={mine ? 'who-me' : 'who-buddy'}>
        {mine ? myName || 'me' : buddyName}:
      </span>{' '}
      <span
        style={{
          fontWeight: f?.bold ? 700 : 400,
          fontStyle: f?.italic ? 'italic' : 'normal',
          textDecoration: f?.underline ? 'underline' : 'none',
          color: f?.color ?? (mine ? '#3a3a52' : '#1c1c1c'),
          fontSize: f?.size ? f.size : undefined,
          fontFamily: f?.font ?? undefined,
        }}
      >
        {renderEmotes(m.text, 16)}
      </span>
    </div>
  );
}
