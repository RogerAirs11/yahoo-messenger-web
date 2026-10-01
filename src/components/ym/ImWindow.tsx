'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useYM, ChatMessage } from '@/lib/ym/store';
import { AUDIBLE_CATEGORIES, ADS, NEWS_HEADLINES, Buddy } from '@/lib/ym/data';
import { renderEmoticons } from '@/lib/ym/emoticons';
import { sounds } from '@/lib/ym/sounds';
import { YmWindow } from './Window';
import { MenuBar } from './MenuBar';
import { EmoticonPicker, ColorPicker } from './Popups';
import {
  StatusIcon, WebcamIcon, MicIcon, ImvIcon, ActivitiesIcon, PhotosIcon,
  AudibleIcon, FontColorIcon, GearIcon, PaperclipIcon, BuzzBellIcon, AddContactIcon, YmSmiley,
} from './icons';

const FONTS = ['Arial', 'Tahoma', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS'];
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20];

export function ImWindow({ buddyId }: { buddyId: string }) {
  const win = useYM((s) => s.windows.im[buddyId]);
  const buddy = useYM((s) => s.buddies.find((b) => b.id === buddyId));
  const conv = useYM((s) => s.conversations[buddyId]);
  const me = useYM((s) => s.me);
  const shake = useYM((s) => s.shakeIm[buddyId] ?? 0);
  const focusWin = useYM((s) => s.focusWin);
  const closeIm = useYM((s) => s.closeIm);
  const sendMyMsg = useYM((s) => s.sendMyMsg);
  const sendMyBuzz = useYM((s) => s.sendMyBuzz);
  const sendMyAudible = useYM((s) => s.sendMyAudible);
  const showTimestamps = useYM((s) => s.showTimestamps);
  const toggleTimestamps = useYM((s) => s.toggleTimestamps);

  const [input, setInput] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(10);
  const [color, setColor] = useState('#1a1a1a');
  const [emoPop, setEmoPop] = useState<{ x: number; y: number } | null>(null);
  const [colorPop, setColorPop] = useState<{ x: number; y: number } | null>(null);
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [audCat, setAudCat] = useState(0);
  const [showAudibles, setShowAudibles] = useState(true);
  const [adIdx, setAdIdx] = useState(0);
  const [newsIdx, setNewsIdx] = useState(0);
  const convRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const statusLabel = useMemo(() => {
    if (!buddy) return '';
    if (buddy.status === 'offline') return '';
    return buddy.status === 'online' ? (buddy.statusMsg || 'Available') : buddy.statusMsg || buddy.status;
  }, [buddy]);

  useEffect(() => {
    const t1 = setInterval(() => setAdIdx((i) => (i + 1) % ADS.length), 9000);
    const t2 = setInterval(() => setNewsIdx((i) => (i + 1) % NEWS_HEADLINES.length), 6000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  useEffect(() => {
    if (convRef.current) convRef.current.scrollTop = convRef.current.scrollHeight;
  }, [conv?.messages.length, conv?.typing, buddyId]);

  // close popups on outside click
  useEffect(() => {
    if (!emoPop && !colorPop) return;
    const close = () => {
      setEmoPop(null);
      setColorPop(null);
    };
    const t = setTimeout(() => window.addEventListener('mousedown', close), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousedown', close);
    };
  }, [emoPop, colorPop]);

  const send = () => {
    if (!input.trim()) return;
    sendMyMsg(buddyId, input, {
      bold, italic, underline, color: color !== '#1a1a1a' ? color : undefined, size: size !== 10 ? size : undefined, font: font !== 'Arial' ? font : undefined,
    });
    setInput('');
    inputRef.current?.focus();
  };

  const insertEmo = (code: string) => {
    setInput((v) => (v.endsWith(' ') || v === '' ? v + code : v + ' ' + code));
    inputRef.current?.focus();
  };

  if (!buddy || !win) return null;

  const ad = ADS[adIdx];

  return (
    <YmWindow
      winKey={buddyId}
      x={win.x}
      y={win.y}
      z={win.z}
      width={434}
      shake={shake}
      title={`${buddy.name}`}
      onClose={() => closeIm(buddyId)}
    >
      <MenuBar
        menus={[
          {
            label: 'Conversation',
            items: [
              { label: 'Send an Instant Message...', disabled: true },
              { label: 'Send a File or Photo...', disabled: true },
              { sep: true },
              { label: 'Save Conversation As...', onClick: () => downloadConv(buddy, conv?.messages ?? []) },
              { label: 'Print...', disabled: true },
              { sep: true },
              { label: 'Close', onClick: () => closeIm(buddyId) },
            ],
          },
          {
            label: 'Edit',
            items: [
              { label: 'Cut', disabled: true },
              { label: 'Copy', disabled: true },
              { label: 'Paste', disabled: true },
              { sep: true },
              { label: 'Emoticons', onClick: () => setEmoPop({ x: win.x + 30, y: win.y + 240 }) },
            ],
          },
          {
            label: 'View',
            items: [
              { label: 'Show Timestamps', checked: showTimestamps, onClick: toggleTimestamps },
              { label: 'Show Audibles Bar', checked: showAudibles, onClick: () => setShowAudibles(!showAudibles) },
              { sep: true },
              { label: 'Use Big Emoticons', checked: false, onClick: () => {} },
            ],
          },
          {
            label: 'Actions',
            items: [
              { label: 'Buzz!', onClick: () => { sendMyBuzz(buddyId); } },
              { sep: true },
              { label: 'Invite to Conference...', disabled: true },
              { label: 'Play a Game...', disabled: true },
              { label: 'View Profile...', disabled: true },
              { label: 'Add to Contacts...', disabled: true },
            ],
          },
          {
            label: 'Help',
            items: [
              { label: 'Yahoo! Messenger Help', onClick: () => alert('Tip: press Ctrl+G to BUZZ! Type emoticon codes like :) :D ;) >:D< or pick from the smiley menu.') },
              { sep: true },
              { label: 'About Yahoo! Messenger', onClick: () => alert('Yahoo! Messenger 9.0\nWeb Edition') },
            ],
          },
        ]}
      />

      {/* call / feature toolbar */}
      <div className="ym-im-toolbar">
        <div className="ym-tb-group">
          <span className="ym-tb-btn" onClick={() => alert('Video Call\n\n(This is 2008 — your webcam driver needs a floppy disk.)')}>
            <span className="ico"><WebcamIcon /></span>
            <span className="lbl">Video Call</span>
          </span>
          <span className="ym-tb-sep" />
          <span className="ym-tb-btn" onClick={() => alert('Voice Call\n\nYahoo! PhoneOut: 1¢/min worldwide.')}>
            <span className="ico"><MicIcon /></span>
            <span className="lbl"><span className="lbl-with-dd">Voice Call <span className="mini-dd">▼</span></span></span>
          </span>
        </div>
        <div className="ym-tb-group">
          <span className="ym-tb-btn" onClick={() => { setShowAudibles(true); alert('IMVironments\n\nPick a background for this conversation.'); }}>
            <span className="ico"><ImvIcon /></span>
            <span className="lbl"><span className="lbl-with-dd">IMVironments <span className="mini-dd">▼</span></span></span>
          </span>
          <span className="ym-tb-btn" onClick={() => alert('Activities\n\nGames · Doodle · Poker · Pool')}>
            <span className="ico"><ActivitiesIcon /></span>
            <span className="lbl"><span className="lbl-with-dd">Activities <span className="mini-dd">▼</span></span></span>
          </span>
          <span className="ym-tb-btn" onClick={() => alert('Photos\n\nShare photos right in the conversation.')}>
            <span className="ico"><PhotosIcon /></span>
            <span className="lbl">Photos</span>
          </span>
        </div>
      </div>

      {/* status strip */}
      <div className="ym-im-statusrow">
        <StatusIcon status={buddy.status === 'offline' ? 'offline' : buddy.status === 'mobile' ? 'mobile' : buddy.status} size={15} />
        {conv?.typing ? (
          <span className="st-typing">{buddy.name} is typing...</span>
        ) : (
          <>
            <span className="st-name">{buddy.name}</span>
            {buddy.status !== 'offline' && (
              <span className="st-suffix">- {renderEmoticons(statusLabel || 'Idle', 13)}</span>
            )}
            {buddy.status === 'offline' && <span className="st-suffix">(Offline)</span>}
          </>
        )}
      </div>

      {/* conversation */}
      <div className="ym-im-conv ym-scroll" ref={convRef}>
        {(conv?.messages ?? []).map((m, i) => (
          <ImLine key={i} m={m} buddy={buddy} meName={me.name || 'Me'} showTs={showTimestamps} />
        ))}
      </div>

      {/* audibles strip */}
      {showAudibles && (
        <div className="ym-audible-strip">
          <div className="strip-head">
            <span className="cat-link" onClick={() => setAudCat((audCat + 1) % AUDIBLE_CATEGORIES.length)} title="Click to cycle categories">
              {AUDIBLE_CATEGORIES[audCat].label}s
            </span>
            <span className="hint">Select an Audible below</span>
            <button className="ym-btn small more" onClick={() => setAudCat((audCat + 1) % AUDIBLE_CATEGORIES.length)}>
              More Audibles
            </button>
          </div>
          <div className="ym-audible-thumbs">
            {AUDIBLE_CATEGORIES[audCat].clips.slice(0, 8).map((clip, i) => (
              <span
                key={i}
                className="ym-audible-thumb"
                title={`Send audible: ${clip.caption}`}
                onClick={() => sendMyAudible(buddyId, audCat, i)}
              >
                <video src={`/assets/audibles/${AUDIBLE_CATEGORIES[audCat].dir}/${clip.file}`} preload="metadata" muted />
              </span>
            ))}
            <span className="ym-audible-arrow" onClick={() => setAudCat((audCat + 1) % AUDIBLE_CATEGORIES.length)} title="Next category">▶</span>
          </div>
        </div>
      )}

      {/* formatting toolbar row 1: B I U + smiley + font + size */}
      <div className="ym-im-format1">
        <button
          className={`ym-fbtn${bold ? ' on' : ''}`}
          title="Bold"
          style={{ fontWeight: 'bold', fontFamily: 'Times New Roman, serif', fontSize: 13 }}
          onClick={() => setBold(!bold)}
        >
          B
        </button>
        <button
          className={`ym-fbtn${italic ? ' on' : ''}`}
          title="Italic"
          style={{ fontStyle: 'italic', fontFamily: 'Times New Roman, serif', fontSize: 13 }}
          onClick={() => setItalic(!italic)}
        >
          I
        </button>
        <button
          className={`ym-fbtn${underline ? ' on' : ''}`}
          title="Underline"
          style={{ textDecoration: 'underline', fontFamily: 'Times New Roman, serif', fontSize: 13 }}
          onClick={() => setUnderline(!underline)}
        >
          U
        </button>
        <button className="ym-fbtn" title="Emoticons" onClick={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setEmoPop({ x: r.left, y: r.bottom + 2 });
        }}>
          <YmSmiley size={16} />
        </button>
        <span style={{ width: 6 }} />
        <Combo
          value={font}
          options={FONTS}
          open={fontOpen}
          setOpen={(o) => { setFontOpen(o); setSizeOpen(false); }}
          onPick={(f) => setFont(String(f))}
          width={128}
        />
        <Combo
          value={String(size)}
          options={SIZES.map(String)}
          open={sizeOpen}
          setOpen={(o) => { setSizeOpen(o); setFontOpen(false); }}
          onPick={(s) => setSize(Number(s))}
          width={46}
          small
        />
      </div>

      {/* formatting toolbar row 2 */}
      <div className="ym-im-format2">
        <button className="ym-fbtn" title="Emoticons" onClick={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setEmoPop({ x: r.left, y: r.bottom + 2 });
        }}>
          <YmSmiley size={16} />
          <span style={{ fontSize: 8, marginLeft: 1 }}>▼</span>
        </button>
        <button className="ym-fbtn" title="Audibles" onClick={() => setShowAudibles(!showAudibles)}>
          <AudibleIcon />
        </button>
        <button className="ym-fbtn" title="Font color" onClick={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setColorPop({ x: r.left, y: r.bottom + 2 });
        }}>
          <FontColorIcon />
        </button>
        <button className="ym-fbtn" title="Conversation settings" onClick={() => alert('Conversation settings\n\nTimestamps, emoticon size, sounds...')}>
          <GearIcon />
        </button>
        <button className="ym-fbtn" title="Send a file" onClick={() => alert('Send a file\n\nMax size: 1 GB (it was 2008 — huge!)')}>
          <PaperclipIcon />
        </button>
        <span className="ym-f2-spacer" />
        <button className="ym-fbtn" title="BUZZ!!!" onClick={() => sendMyBuzz(buddyId)}>
          <BuzzBellIcon />
        </button>
        <button className="ym-fbtn" title="Add a contact" onClick={() => alert('Add a Contact\n\nEnter their Yahoo! ID and say hello!')}>
          <AddContactIcon />
        </button>
      </div>

      {/* input */}
      <div className="ym-im-inputrow">
        <textarea
          ref={inputRef}
          className="ym-im-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder=""
        />
        <img className="ym-im-myava" src={me.avatar} alt="My display image" title="My display image" />
      </div>
      <div className="ym-im-sendrow">
        <button className="ym-btn ym-send-btn" onClick={send} disabled={!input.trim()}>
          Send
        </button>
      </div>

      {/* ad bar */}
      <div className="ym-im-adbar">
        <span className="adtag">{ad.tag}</span>
        <span className="adtitle">{ad.title}</span>
        <span className="adurl">{ad.url}</span>
      </div>

      {/* news ticker */}
      <div className="ym-im-newsbar">
        <span className="newstag">NEWS</span>
        <span className="headline">{NEWS_HEADLINES[newsIdx]}</span>
      </div>

      {emoPop && <EmoticonPicker x={emoPop.x} y={emoPop.y} onPick={insertEmo} onClose={() => setEmoPop(null)} />}
      {colorPop && (
        <ColorPicker
          x={colorPop.x}
          y={colorPop.y}
          onPick={(c) => {
            setColor(c);
            setColorPop(null);
          }}
        />
      )}
    </YmWindow>
  );
}

/* ---------------- message line ---------------- */

function ImLine({ m, buddy, meName, showTs }: { m: ChatMessage; buddy: Buddy; meName: string; showTs: boolean }) {
  if (m.kind === 'buzz') {
    return (
      <div className={`ym-im-line${m.from === 'me' ? ' me' : ''}`}>
        <span className="buzz-text">BUZZ!!!</span>
        {showTs && <span className="ts">{fmtTime(m.ts)}</span>}
      </div>
    );
  }
  if (m.kind === 'system') {
    return (
      <div className="ym-im-line system">
        {m.text}
      </div>
    );
  }
  if (m.kind === 'audible' && m.audible) {
    return (
      <div className={`ym-im-line${m.from === 'me' ? ' me' : ''}`}>
        <span className="sender">{m.from === 'me' ? meName : buddy.name}: </span>
        <span className="ym-im-audible" title="Audible — click to play">
          <video src={`/assets/audibles/${m.audible.cat}/${m.audible.file}`} controls preload="metadata" />
          <span>
            <span className="cap">{m.audible.caption}</span>
            <br />
            <span className="playhint">Audible</span>
          </span>
        </span>
      </div>
    );
  }
  const style: React.CSSProperties = {};
  if (m.fmt?.bold) style.fontWeight = 'bold';
  if (m.fmt?.italic) style.fontStyle = 'italic';
  if (m.fmt?.underline) style.textDecoration = 'underline';
  if (m.fmt?.color) style.color = m.fmt.color;
  if (m.fmt?.size) style.fontSize = m.fmt.size;
  if (m.fmt?.font) style.fontFamily = m.fmt.font;
  return (
    <div className={`ym-im-line${m.from === 'me' ? ' me' : ''}`}>
      <span className="sender" style={m.from === 'me' && m.fmt?.color ? { color: m.fmt.color } : undefined}>
        {m.from === 'me' ? meName : buddy.name}:
      </span>{' '}
      <span style={style}>{renderEmoticons(m.text, 18)}</span>
      {showTs && <span className="ts">{fmtTime(m.ts)}</span>}
    </div>
  );
}

/* ---------------- XP combo box ---------------- */

function Combo({
  value, options, open, setOpen, onPick, width, small,
}: {
  value: string;
  options: string[];
  open: boolean;
  setOpen: (o: boolean) => void;
  onPick: (v: string) => void;
  width: number;
  small?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [setOpen]);
  return (
    <div className={`ym-combo${small ? ' small' : ''}`} style={{ width }} ref={ref}>
      <div className="cur" onMouseDown={(e) => { e.preventDefault(); setOpen(!open); }}>
        <span className="val" style={small ? {} : { fontFamily: value }}>{value}</span>
        <span className="arr">
          <svg width="8" height="6" viewBox="0 0 8 6"><path d="M0 0 L8 0 L4 5.5 Z" fill="#4a4a44" /></svg>
        </span>
      </div>
      {open && (
        <div className="ym-combo-list ym-scroll">
          {options.map((o) => (
            <div
              key={o}
              className={`ym-combo-opt${o === value ? ' sel' : ''}`}
              style={small ? {} : { fontFamily: o }}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(o);
                setOpen(false);
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function downloadConv(buddy: Buddy, messages: ChatMessage[]) {
  const lines = messages.map((m) => {
    const who = m.kind === 'buzz' ? 'BUZZ' : m.kind === 'system' ? '' : m.from === 'me' ? 'Me' : buddy.name;
    const t = new Date(m.ts).toLocaleString();
    return who ? `[${t}] ${who}: ${m.text}` : `[${t}] ${m.text}`;
  });
  const blob = new Blob([`Conversation with ${buddy.name}\n\n${lines.join('\n')}\n`], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${buddy.id}-conversation.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}
