'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useYM, Buddy } from '@/lib/ym/store';
import { STATUS_MENU } from '@/lib/ym/data';
import { renderEmoticons } from '@/lib/ym/emoticons';
import { YmWindow } from './Window';
import { MenuBar } from './MenuBar';
import {
  StatusIcon, OfflineAvatar, SmsIcon, PhoneIcon, ComposeIcon, YUpdatesStar, YBangIcon,
} from './icons';

export function BuddyList() {
  const win = useYM((s) => s.windows.buddylist);
  const buddies = useYM((s) => s.buddies);
  const me = useYM((s) => s.me);
  const conversations = useYM((s) => s.conversations);
  const focusWin = useYM((s) => s.focusWin);
  const openIm = useYM((s) => s.openIm);
  const setMyStatus = useYM((s) => s.setMyStatus);
  const setCustomStatus = useYM((s) => s.setCustomStatus);
  const signOut = useYM((s) => s.signOut);
  const closeBuddyList = useYM((s) => s.closeBuddyList);

  const [tab, setTab] = useState<'contacts' | 'updates'>('contacts');
  const [query, setQuery] = useState('');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<string | null>(null);
  const statusInputRef = useRef<HTMLInputElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!statusMenuRef.current?.contains(e.target as Node)) setStatusMenuOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  const online = useMemo(
    () => buddies.filter((b) => b.status !== 'offline').sort((a, b) => a.name.localeCompare(b.name)),
    [buddies],
  );
  const offline = useMemo(
    () => buddies.filter((b) => b.status === 'offline').sort((a, b) => a.name.localeCompare(b.name)),
    [buddies],
  );

  const filtered = (list: Buddy[]) =>
    query.trim()
      ? list.filter(
          (b) =>
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.statusMsg.toLowerCase().includes(query.toLowerCase()),
        )
      : list;

  const shownOnline = filtered(online);
  const shownOffline = filtered(offline);

  const myStatusLabel =
    statusDraft !== null
      ? statusDraft
      : me.customStatus ||
        STATUS_MENU.find((s) => s.status === me.status)?.label ||
        'Available';

  const commitStatus = () => {
    if (statusDraft !== null) {
      setCustomStatus(statusDraft);
      if (statusDraft.trim() === '') setMyStatus('online');
      setStatusDraft(null);
    }
  };

  const myStatus: Buddy['status'] = me.customStatus ? 'online' : me.status;

  return (
    <YmWindow
      winKey="buddylist"
      x={win.x}
      y={win.y}
      z={win.z}
      width={254}
      height={548}
      wordmark
      showStatusDot
      title={<span className="tb-wordmark"><span className="yw">Yahoo!</span><span className="ym">MESSENGER</span></span>}
      onClose={closeBuddyList}
    >
      <MenuBar
        menus={[
          {
            label: 'Messenger',
            items: [
              {
                label: 'My Status',
                submenu: [
                  ...STATUS_MENU.slice(0, 3).map((s) => ({
                    label: s.label,
                    checked: me.status === s.status && !me.customStatus,
                    onClick: () => { setMyStatus(s.status, s.msg ?? ''); setCustomStatus(s.msg ?? ''); },
                  })),
                  { sep: true },
                  { label: 'New Status Message...', onClick: () => { setStatusDraft(''); setTimeout(() => statusInputRef.current?.focus(), 50); } },
                  { label: 'Invisible to Everyone', checked: me.status === 'offline', onClick: () => setMyStatus('offline', '') },
                  { sep: true },
                  { label: 'Sign Out', onClick: signOut },
                ],
              },
              { label: 'Preferences...', onClick: () => alert('Preferences\n\nSounds: ON\nDisplay images: ON\nSort contacts: Alphabetically') },
              { sep: true },
              { label: 'Sign Out', onClick: signOut },
              { label: 'Exit', onClick: closeBuddyList },
            ],
          },
          {
            label: 'Contacts',
            items: [
              { label: 'Add a Contact...', onClick: () => alert('Add a Contact\n\nEnter their Yahoo! ID and say hello!') },
              { sep: true },
              { label: 'Show Offline Contacts', checked: true, onClick: () => {} },
              { label: 'Sort Contacts by Name', checked: true, onClick: () => {} },
            ],
          },
          {
            label: 'Actions',
            items: [
              { label: 'Send an Instant Message...', onClick: () => openIm(shownOnline[0]?.id ?? 'sbacon') },
              { label: 'Send a Text Message (SMS)...', disabled: true },
              { sep: true },
              { label: 'Chat in a Yahoo! Room...', disabled: true },
              { label: 'Start a Conference...', disabled: true },
            ],
          },
          {
            label: 'Help',
            items: [
              { label: 'Yahoo! Messenger Help', onClick: () => alert('Tip: double-click a contact to open an IM window. Try Buzz! from the Actions menu in a conversation.') },
              { sep: true },
              { label: 'About Yahoo! Messenger', onClick: () => alert('Yahoo! Messenger 9.0\nWeb Edition') },
            ],
          },
        ]}
      />

      {/* purple identity header */}
      <div className="ym-bl-header">
        <div className="ym-bl-me">
          <img className="ym-bl-avatar" src={me.avatar} alt="My avatar" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ym-bl-name-row">
              <span className="ym-bl-name">{me.name || 'me'}</span>
              <StatusIcon status={myStatus} size={15} />
            </div>
          </div>
        </div>
        <div className="ym-bl-status-input" ref={statusMenuRef}>
          <input
            ref={statusInputRef}
            value={statusDraft ?? myStatusLabel}
            onChange={(e) => setStatusDraft(e.target.value)}
            onFocus={() => setStatusDraft(statusDraft ?? myStatusLabel)}
            onBlur={commitStatus}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitStatus();
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === 'Escape') {
                setStatusDraft(null);
                (e.target as HTMLInputElement).blur();
              }
            }}
            spellCheck={false}
          />
          <span
            className="dd"
            title="Change status"
            onMouseDown={(e) => { e.preventDefault(); setStatusMenuOpen(!statusMenuOpen); }}
          >
            <svg width="8" height="6" viewBox="0 0 8 6"><path d="M0 0 L8 0 L4 5.5 Z" fill="#4a4a44" /></svg>
          </span>
          {statusMenuOpen && (
            <div className="ym-menu-drop" style={{ left: win.x + 8, top: win.y + 96, minWidth: 186 }}>
              {STATUS_MENU.map((s, i) => (
                <div
                  key={i}
                  className="ym-menu-row"
                  onClick={() => {
                    setMyStatus(s.status, s.msg ?? '');
                    setCustomStatus(s.msg ?? '');
                    setStatusMenuOpen(false);
                  }}
                >
                  {s.label}
                </div>
              ))}
              <div className="ym-menu-sep" />
              <div className="ym-menu-row" onClick={() => { setStatusMenuOpen(false); signOut(); }}>
                Sign Out
              </div>
            </div>
          )}
        </div>
        <div className="ym-bl-links">
          <span className="lk" title="Send a text message"><SmsIcon /></span>
          <span className="lk" title="Yahoo! Voice"><PhoneIcon /></span>
          <span className="lk">Yahoo! Voice <b>$12.49</b></span>
          <span className="spacer" />
          <span className="lk" title="Compose"><ComposeIcon /></span>
        </div>
      </div>

      {/* tabs */}
      <div className="ym-tabs">
        <span className={`ym-tab${tab === 'contacts' ? ' active' : ''}`} onClick={() => setTab('contacts')}>
          Contacts
        </span>
        <span className={`ym-tab${tab === 'updates' ? ' active' : ''}`} onClick={() => setTab('updates')}>
          <YUpdatesStar />Y! Updates
        </span>
      </div>

      {tab === 'contacts' ? (
        <>
          <div style={{ flex: 'none', padding: '4px 6px', background: 'linear-gradient(180deg,#dcc2ef 0%,#d0b2e8 100%)' }}>
            <div className="ym-search-wrap">
              <input
                placeholder="type some contact information..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="ym-search-go" title="Search">
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <rect x="0" y="0" width="3" height="3" fill="#fff" />
                  <rect x="3.6" y="0" width="3" height="3" fill="#fff" />
                  <rect x="7" y="0" width="3" height="3" fill="#fff" />
                  <rect x="0" y="3.6" width="3" height="3" fill="#fff" />
                  <rect x="3.6" y="3.6" width="3" height="3" fill="#fff" />
                  <rect x="7" y="3.6" width="3" height="3" fill="#fff" />
                  <rect x="0" y="7" width="3" height="3" fill="#fff" />
                  <rect x="3.6" y="7" width="3" height="3" fill="#fff" />
                  <rect x="7" y="7" width="3" height="3" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>

          <div className="ym-bl-list ym-scroll">
            {shownOnline.map((b) => {
              const unread = conversations[b.id]?.unread ?? 0;
              return (
                <div
                  key={b.id}
                  className={`ym-buddy-row${b.status === 'offline' ? ' offline' : ''}${unread ? ' unread' : ''}`}
                  onDoubleClick={() => openIm(b.id)}
                  title={`${b.name} — double-click to message`}
                >
                  {b.avatar ? (
                    <img className="ym-buddy-ava" src={b.avatar} alt="" draggable={false} />
                  ) : (
                    <OfflineAvatar />
                  )}
                  <span className="ym-buddy-sticon">
                    <StatusIcon status={b.status === 'mobile' ? 'mobile' : b.status} size={15} />
                  </span>
                  <span className="ym-buddy-txt">
                    <span className="ym-buddy-name">{b.name}</span>
                    {b.playing ? (
                      <span className="ym-buddy-status nowplaying">
                        <span className="np-note">♫ </span>{b.playing}
                      </span>
                    ) : b.statusMsg ? (
                      <span className={`ym-buddy-status${b.statusColor === 'blue' ? ' blue' : ''}`}>{renderEmoticons(b.statusMsg, 13)}</span>
                    ) : null}
                  </span>
                </div>
              );
            })}
            {shownOffline.length > 0 && shownOnline.length > 0 && <div style={{ height: 6 }} />}
            {shownOffline.map((b) => (
              <div key={b.id} className="ym-buddy-row offline" onDoubleClick={() => openIm(b.id)} title={`${b.name} (offline)`}>
                <OfflineAvatar />
                <span className="ym-buddy-sticon">
                  <StatusIcon status="offline" size={15} />
                </span>
                <span className="ym-buddy-txt">
                  <span className="ym-buddy-name">{b.name}</span>
                </span>
              </div>
            ))}
            {shownOnline.length === 0 && shownOffline.length === 0 && (
              <div style={{ padding: 14, color: '#999', fontStyle: 'italic' }}>No contacts match "{query}"</div>
            )}
          </div>

          <div className="ym-bl-footer">
            <button className="ym-btn small" style={{ flex: 1 }} onClick={() => alert('Add a Contact\n\nEnter their Yahoo! ID and say hello!')}>
              + Add a Contact
            </button>
            <button className="ym-btn small" style={{ flex: 1 }} onClick={() => alert('Plug-ins\n\nY! Insights · Weather · Games · Music')}>
              Plug-ins <span style={{ fontSize: 8 }}>▲</span>
            </button>
          </div>
        </>
      ) : (
        <div className="ym-bl-list ym-scroll" style={{ padding: 6 }}>
          <UpdatesFeed />
        </div>
      )}

      {/* Yahoo! Web Search bar */}
      <div className="ym-bl-websearch">
        <span className="ym-yws-logo">
          <span className="y1">Yahoo!</span>
          <span className="y2">WEB SEARCH</span>
        </span>
        <div className="ym-search-wrap">
          <input
            placeholder="Search the web"
            onKeyDown={(e) => {
              if (e.key === 'Enter') alert('Yahoo! Web Search — results would open in a new window (nostalgia only).');
            }}
          />
          <button
            className="ym-search-go"
            title="Web Search"
            onClick={() => alert('Yahoo! Web Search — results would open in a new window (nostalgia only).')}
          >
            <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5 h7 M5 1.5 L8.5 5 L5 8.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <YBangFloat />
    </YmWindow>
  );
}

/** Y! Updates tab content */
function UpdatesFeed() {
  const buddies = useYM((s) => s.buddies);
  const active = buddies.filter((b) => b.status !== 'offline' && (b.statusMsg || b.playing));
  return (
    <>
      <div style={{ fontSize: 11, color: '#5e2b85', fontWeight: 'bold', margin: '2px 0 6px' }}>
        What your contacts are up to
      </div>
      {active.map((b) => (
        <div key={b.id} style={{ display: 'flex', gap: 6, padding: '4px 2px', borderBottom: '1px solid #eee' }}>
          <img src={b.avatar || undefined} alt="" width={22} height={22} style={{ borderRadius: 2, border: '1px solid #ccc', objectFit: 'cover', background: '#fff' }} />
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            <b>{b.name}</b>
            <div style={{ color: '#666' }}>{b.playing ? `♫ listening to ${b.playing}` : b.statusMsg}</div>
            <div style={{ color: '#a0a0a0', fontSize: 10 }}>{Math.floor(Math.random() * 40) + 2} minutes ago</div>
          </div>
        </div>
      ))}
      {active.length === 0 && <div style={{ color: '#999', fontStyle: 'italic', padding: 8 }}>No recent updates.</div>}
    </>
  );
}

/** floating Y! badge bottom-right of buddy list chrome (subtle authenticity) */
function YBangFloat() {
  return null;
}
