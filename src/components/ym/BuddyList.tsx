'use client';

import React, { useMemo, useState } from 'react';
import { YmWindow, MenuBar, MenuDef } from './YmWindow';
import { useYM } from '@/lib/ym/store';
import { Buddy, GROUP_ORDER, STATUS_MENU, seedFor, AvatarSvg, AD_ROTATION } from '@/lib/ym/data';
import { Emoticon } from '@/lib/ym/emoticons';
import { sounds } from '@/lib/ym/sounds';

function StatusDot({ status }: { status: Buddy['status'] }) {
  return <span className={`ym-dot ${status}`} />;
}

function PhoneIcon({ color = '#3a6ab8' }: { color?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" style={{ flex: 'none' }}>
      <path d="M2.5,1.5 L4.5,1.5 L5.5,4 L4,5.2 C4.6,6.6 5.4,7.4 6.8,8 L8,6.5 L10.5,7.5 L10.5,9.5 C10.5,10.1 10.1,10.5 9.5,10.5 C5,10.2 1.8,7 1.5,2.5 C1.5,1.9 1.9,1.5 2.5,1.5 Z" fill={color} />
    </svg>
  );
}

export function BuddyList() {
  const st = useYM();
  const w = st.windows.buddylist;
  const visible = w.visible && (st.phase === 'online');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [statusMenu, setStatusMenu] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; buddyId: string } | null>(null);
  const [showOffline, setShowOffline] = useState(false);
  const [pluginsOpen, setPluginsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newId, setNewId] = useState('');
  const [adIdx, setAdIdx] = useState(0);
  const [statusEdit, setStatusEdit] = useState(false);

  const me = st.me;
  const mySeed = useMemo(() => seedFor(me.name || 'yahoo_user'), [me.name]);

  const groups = useMemo(() => {
    const map: Record<string, Buddy[]> = {};
    for (const g of GROUP_ORDER) map[g] = [];
    for (const b of st.buddies) {
      const match = !filter || b.name.toLowerCase().includes(filter.toLowerCase());
      if (!match) continue;
      if (b.status === 'offline' && !showOffline && !filter) continue;
      map[b.group]?.push(b);
    }
    return map;
  }, [st.buddies, filter, showOffline]);

  const onlineCount = (list: Buddy[]) => list.filter((b) => b.status !== 'offline').length;

  const menus: MenuDef[] = [
    {
      label: 'Messenger',
      items: [
        ...STATUS_MENU.filter((s) => s.status !== 'signout').map((s) => ({
          label: s.label,
          dot: (['online', 'busy', 'idle', 'offline'].includes(s.status) ? s.status : undefined) as 'online' | 'busy' | 'idle' | 'offline' | undefined,
          onClick: () => {
            if (s.status === 'new') { setStatusEdit(true); }
            else if (s.status !== 'signout') st.setMyStatus(s.status as Buddy['status'], s.label);
          },
        })),
        { type: 'sep' as const },
        { label: 'Sign Out', onClick: () => st.signOut() },
      ],
    },
    {
      label: 'Contacts',
      items: [
        { label: 'Add a Contact...', onClick: () => setAddOpen(true) },
        { label: 'Address Book...' },
        { type: 'sep' as const },
        { label: 'Show Offline Buddies', checked: showOffline, onClick: () => setShowOffline(!showOffline) },
        { label: 'Rename Groups...' },
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'Send an Instant Message...', onClick: () => { if (selected) st.openIm(selected); } },
        { label: 'Buzz!', onClick: () => { if (selected) { st.openIm(selected); setTimeout(() => st.sendMyBuzz(selected), 250); } } },
        { type: 'sep' as const },
        { label: 'Send a File...' },
        { label: 'Call a Phone Number...' },
        { label: 'Start a Conference...' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Yahoo! Messenger Help' },
        { label: 'Check for Updates...' },
        { type: 'sep' as const },
        { label: 'About Yahoo! Messenger' },
        { type: 'sep' as const },
        { label: st.soundOn ? 'Sounds: ON (click to mute)' : 'Sounds: OFF (click to unmute)', onClick: () => st.toggleSound() },
      ],
    },
  ];

  const openCtx = (e: React.MouseEvent, buddyId: string) => {
    e.preventDefault();
    setSelected(buddyId);
    setCtxMenu({ x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 190), buddyId });
  };

  const addContact = () => {
    const id = newId.trim();
    if (!id) return;
    useYM.setState((s) => ({
      buddies: [
        ...s.buddies,
        { id: id.toLowerCase(), name: id, group: 'Friends', status: 'online', statusMsg: '', personality: 'chatty' },
      ],
    }));
    sounds.doorOpen();
    setAddOpen(false);
    setNewId('');
  };

  const ad = AD_ROTATION[adIdx % AD_ROTATION.length];

  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
  const winH = Math.max(430, Math.min(560, vh - 42));

  return (
    <>
      <YmWindow
        width={307}
        height={winH}
        x={w.x}
        y={w.y}
        z={w.z}
        visible={visible}
        showLogo
        onFocus={() => st.focusWin('buddylist')}
        onMove={(x, y) => st.moveWin('buddylist', x, y)}
        onMinimize={() => st.minimizeWin('buddylist')}
        onClose={() => st.closeBuddyList()}
        menuBar={<MenuBar menus={menus} />}
      >
        {/* ------- header ------- */}
        <div className="ym-bl-header">
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 54, height: 54, flex: 'none', background: '#fff', border: '1px solid #a888c8', borderRadius: 3, padding: 1, boxShadow: '0 1px 2px rgba(80,40,120,.3)' }}>
              <AvatarSvg seed={mySeed} size={52} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                <StatusDot status={me.status === 'offline' ? 'offline' : me.status} />
                <b style={{ fontSize: 11.5, color: '#1c1c1c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</b>
                <span style={{ cursor: 'pointer', color: '#4a2a6e', fontSize: 9 }} onClick={() => setStatusMenu(!statusMenu)}>
                  ▼
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2, color: '#5a3a80', fontSize: 10, cursor: 'pointer' }}>
                  <svg width="12" height="10" viewBox="0 0 12 10"><rect x="0.5" y="1" width="11" height="8" rx="1.5" fill="none" stroke="#5a3a80" strokeWidth="1.2" /><path d="M2.5,3 L6,5.5 L9.5,3" fill="none" stroke="#5a3a80" strokeWidth="1.2" /></svg>
                  Insider
                </span>
                {statusMenu && (
                  <div className="ym-dropdown" style={{ left: 0, top: 16, minWidth: 210 }}>
                    {STATUS_MENU.map((s, i) =>
                      s.status === 'signout' ? (
                        <React.Fragment key={i}>
                          <div className="ym-dd-sep" />
                          <div className="ym-dd-item" onClick={() => { setStatusMenu(false); st.signOut(); }}>
                            {s.label}
                          </div>
                        </React.Fragment>
                      ) : (
                        <div key={i} className="ym-dd-item" onClick={() => { setStatusMenu(false); if (s.status === 'new') setStatusEdit(true); else st.setMyStatus(s.status as Buddy['status'], s.label); }}>
                          {(['online', 'busy', 'idle', 'offline'].includes(s.status)) && <span className={`dot ym-dot ${s.status}`} />}
                          {s.label}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
              <input
                className="ym-input"
                style={{ height: 19, fontSize: 10.5 }}
                placeholder="share a status message..."
                value={me.customStatus}
                onChange={(e) => st.setCustomStatus(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#4a3a60' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="1.5" fill="none" stroke="#4a3a60" strokeWidth="1.2" /><path d="M3.5,4 L8.5,4 M3.5,6 L8.5,6 M3.5,8 L6.5,8" stroke="#4a3a60" strokeWidth="1.1" /></svg>
                  <PhoneIcon color="#4a3a60" />
                  Yahoo! Voice <b>$12.49</b>
                </span>
                <span style={{ marginLeft: 'auto', cursor: 'pointer', color: '#5a3a80' }} title="Change display image">
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8.5,1.5 L10.5,3.5 L4,10 L1.5,10.5 L2,8 Z" fill="none" stroke="#5a3a80" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------- contact search ------- */}
        <div className="ym-searchbar">
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              className="ym-input"
              style={{ flex: 1, height: 20, borderRadius: 10 }}
              placeholder="type some contact information..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              title="Find a contact"
              style={{ width: 24, height: 22, borderRadius: 3, border: '1px solid #7a4aa8', background: 'linear-gradient(180deg,#a878d0,#7c4ba9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setFilter('')}
            >
              <svg width="13" height="12" viewBox="0 0 14 12"><rect x="1" y="1" width="12" height="10" rx="1.5" fill="#fff" /><circle cx="7" cy="4.6" r="1.8" fill="#7c4ba9" /><path d="M3.5,10 C3.5,7.8 10.5,7.8 10.5,10 Z" fill="#7c4ba9" /></svg>
            </button>
          </div>
        </div>

        {/* ------- the list ------- */}
        <div className="ym-list">
          {GROUP_ORDER.map((g) => {
            const list = groups[g];
            if (!list.length) return null;
            const isCollapsed = collapsed[g];
            return (
              <div key={g}>
                <div className="ym-group-header" onClick={() => setCollapsed((c) => ({ ...c, [g]: !c[g] }))}>
                  <span style={{ fontSize: 8, color: '#4a2a6e' }}>{isCollapsed ? '▶' : '▼'}</span>
                  {g} ({onlineCount(list)}/{list.length})
                </div>
                {!isCollapsed &&
                  list.map((b) => (
                    <div
                      key={b.id}
                      className={`ym-buddy-row ${b.status === 'offline' ? 'offline' : ''} ${selected === b.id ? 'selected' : ''}`}
                      onClick={() => setSelected(b.id)}
                      onDoubleClick={() => st.openIm(b.id)}
                      onContextMenu={(e) => openCtx(e, b.id)}
                      title={`${b.name} — double-click to send an IM`}
                    >
                      <div style={{ width: 30, height: 30, flex: 'none', border: '1px solid #c8b8dc', borderRadius: 2, background: '#fff', padding: 0.5, opacity: b.status === 'offline' ? 0.55 : 1 }}>
                        <AvatarSvg seed={seedFor(b.name)} size={27} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <StatusDot status={b.status} />
                          <span className="ym-buddy-name">{b.name}</span>
                        </div>
                        {b.statusMsg && (
                          <span className={`ym-buddy-status ${b.statusMsg.includes('mobile') ? 'im-mobile' : b.statusMsg.startsWith('♫') ? 'music' : b.statusMsg.includes('|') ? 'link' : ''}`}>
                            {b.statusMsg.startsWith('♫') ? (
                              <>
                                <span style={{ color: '#8a3ab8' }}>♫ </span>
                                {b.statusMsg.slice(2)}
                              </>
                            ) : b.statusMsg.includes('mobile') ? (
                              <>
                                <PhoneIcon /> {b.statusMsg}
                              </>
                            ) : (
                              b.statusMsg
                            )}
                          </span>
                        )}
                      </div>
                      {st.conversations[b.id]?.unread > 0 && (
                        <span className="ym-unread-badge" style={{ marginTop: 4 }}>
                          {st.conversations[b.id].unread}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
          {!Object.values(groups).some((l) => l.length) && (
            <div style={{ padding: 14, color: '#8a7ba0', textAlign: 'center' }}>No contacts found.</div>
          )}
        </div>

        {/* ------- add contact + plugins ------- */}
        <div style={{ flex: 'none', background: '#efe6f9', borderTop: '1px solid #c3aadf', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="ym-btn" style={{ fontSize: 10.5, padding: '2px 9px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setAddOpen(true)}>
            <b style={{ fontSize: 12, lineHeight: 1 }}>+</b> Add a Contact
          </button>
          <div
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 10.5, color: '#3a2460' }}
            onClick={() => setPluginsOpen(!pluginsOpen)}
          >
            Plug-ins
            <span style={{ fontSize: 8, border: '1px solid #9a76c2', background: '#e2d2f2', borderRadius: 2, padding: '0 3px' }}>{pluginsOpen ? '▼' : '▲'}</span>
          </div>
        </div>
        {pluginsOpen && (
          <div style={{ flex: 'none', background: '#f6f1fb', borderBottom: '1px solid #d5c4ea', padding: '5px 8px', display: 'flex', gap: 12, alignItems: 'center' }}>
            {[
              { n: 'Games', e: '🎮' },
              { n: 'Music', e: '♫' },
              { n: 'Weather', e: '☁' },
              { n: 'Calendar', e: '📅' },
              { n: 'Add Plug-ins...', e: '⊕' },
            ].map((p) => (
              <span key={p.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 9.5, color: '#4a2a6e', cursor: 'pointer' }}>
                <span style={{ fontSize: 15 }}>{p.e}</span>
                {p.n}
              </span>
            ))}
          </div>
        )}

        {/* ------- web search footer ------- */}
        <div style={{ flex: 'none', height: 26, background: 'linear-gradient(180deg,#a878d0,#7c4ba9)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 6px' }}>
          <div style={{ lineHeight: '9px', textAlign: 'left', flex: 'none' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontStyle: 'italic', fontSize: 10.5, letterSpacing: -0.3 }}>YAHOO!</div>
            <div style={{ color: '#d8c8ee', fontSize: 7.5, letterSpacing: 1.5 }}>WEB SEARCH</div>
          </div>
          <input className="ym-input" style={{ flex: 1, height: 19 }} placeholder="" onKeyDown={(e) => { if (e.key === 'Enter') { st.ensureBuddy('ysearch', 'Yahoo! Search'); st.openIm('ysearch'); (e.target as HTMLInputElement).blur(); } }} />
          <button style={{ width: 22, height: 19, background: 'linear-gradient(180deg,#5a2a8a,#43196e)', border: '1px solid #3a1460', color: '#fff', borderRadius: 3, cursor: 'pointer', fontSize: 11, lineHeight: 1 }} onClick={() => { st.ensureBuddy('ysearch', 'Yahoo! Search'); st.openIm('ysearch'); }}>
            →
          </button>
        </div>

        {/* ------- ad banner ------- */}
        <div
          style={{
            flex: 'none',
            height: 44,
            cursor: 'pointer',
            background: 'linear-gradient(90deg,#2a3a8a 0%,#3a54c8 30%,#ffd400 30%,#ffe873 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 8px',
            overflow: 'hidden',
          }}
          onClick={() => setAdIdx((i) => i + 1)}
          title="Click to rotate ads — just like 2008!"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
            <span style={{ transform: 'rotate(-8deg)' }}>
              <Emoticon type="cool" size={26} />
            </span>
            <span style={{ transform: 'rotate(6deg)', marginTop: 4 }}>
              <Emoticon type="laughing" size={22} />
            </span>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 11, textShadow: '0 1px 2px rgba(0,0,60,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ad.kind === 'AD' ? ad.title : ad.title}
              <div style={{ fontSize: 9, fontWeight: 400, color: '#f0e8ff' }}>{ad.url}</div>
            </div>
          </div>
          <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#fff', fontSize: 13, textShadow: '0 1px 2px rgba(0,0,60,.6)', flex: 'none' }}>Y!</span>
        </div>
      </YmWindow>

      {/* ------- buddy context menu ------- */}
      {ctxMenu && (
        <div className="ym-context-overlay" onMouseDown={() => setCtxMenu(null)} onContextMenu={(e) => { e.preventDefault(); setCtxMenu(null); }}>
          <div className="ym-dropdown" style={{ position: 'fixed', left: ctxMenu.x, top: ctxMenu.y, display: 'block' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="ym-dd-item" onClick={() => { st.openIm(ctxMenu.buddyId); setCtxMenu(null); }}>
              Send an Instant Message...
            </div>
            <div className="ym-dd-item" onClick={() => { st.openIm(ctxMenu.buddyId); setTimeout(() => st.sendMyBuzz(ctxMenu.buddyId), 250); setCtxMenu(null); }}>
              Buzz!
            </div>
            <div className="ym-dd-sep" />
            <div className="ym-dd-item" onClick={() => setCtxMenu(null)}>
              View Profile...
            </div>
            <div className="ym-dd-item" onClick={() => { useYM.setState((s) => ({ buddies: s.buddies.filter((b) => b.id !== ctxMenu.buddyId) })); setCtxMenu(null); }}>
              Remove Contact...
            </div>
          </div>
        </div>
      )}

      {/* ------- add contact dialog ------- */}
      {addOpen && (
        <div className="ym-context-overlay" onMouseDown={() => setAddOpen(false)}>
          <div
            className="ym-window"
            style={{ position: 'fixed', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', width: 280, zIndex: 3100 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="ym-titlebar">
              <span className="ym-title">Add a Contact</span>
              <div className="ym-tb-btns">
                <button className="ym-tb-btn close" onClick={() => setAddOpen(false)}>
                  <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5,1.5 L7.5,7.5 M7.5,1.5 L1.5,7.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
            <div style={{ background: '#fcfbf6', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>Enter the Yahoo! ID of the person you want to add:</div>
              <input className="ym-input" style={{ height: 20 }} value={newId} onChange={(e) => setNewId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addContact()} autoFocus placeholder="e.g. smiley_2008" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                <button className="ym-btn" onClick={addContact}>Add</button>
                <button className="ym-btn" onClick={() => setAddOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------- new status message dialog ------- */}
      {statusEdit && (
        <div className="ym-context-overlay" onMouseDown={() => setStatusEdit(false)}>
          <div
            className="ym-window"
            style={{ position: 'fixed', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', width: 280, zIndex: 3100 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="ym-titlebar">
              <span className="ym-title">New Status Message</span>
              <div className="ym-tb-btns">
                <button className="ym-tb-btn close" onClick={() => setStatusEdit(false)}>
                  <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5,1.5 L7.5,7.5 M7.5,1.5 L1.5,7.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
            <div style={{ background: '#fcfbf6', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>Type a new status message:</div>
              <StatusEditInput onDone={(t) => { st.setMyStatus('online', t || "I'm Available"); setStatusEdit(false); }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusEditInput({ onDone }: { onDone: (t: string) => void }) {
  const [t, setT] = useState('');
  return (
    <>
      <input className="ym-input" style={{ height: 20 }} value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onDone(t)} autoFocus placeholder="Is it Friday yet? :)" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <button className="ym-btn" onClick={() => onDone(t)}>OK</button>
        <button className="ym-btn" onClick={() => onDone('')}>Cancel</button>
      </div>
    </>
  );
}
