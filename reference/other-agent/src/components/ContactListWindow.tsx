import { useMemo, useState } from "react";
import WindowFrame, { MenuDef } from "./WindowFrame";
import {
  BadgeCrown,
  BadgeMobile,
  BadgeMusic,
  BadgeTrophy,
  IconArrowGo,
  IconChevron,
  IconHandset,
  IconMail,
  IconPcPhone,
  IconPlus,
  IconSearchList,
  StatusDot,
  StatusKind,
  Swirls,
  YahooWordmark,
} from "./icons";

const STATUS_OPTIONS: { kind: StatusKind; label: string }[] = [
  { kind: "available", label: "Available" },
  { kind: "brb", label: "Be Right Back" },
  { kind: "busy", label: "Busy" },
  { kind: "steppedout", label: "Stepped Out" },
  { kind: "phone", label: "On the Phone" },
  { kind: "lunch", label: "Out to Lunch" },
  { kind: "away", label: "Not at My Desk" },
  { kind: "invisible", label: "Invisible" },
];
import { CONTACTS, Contact, ME } from "../data/contacts";

interface Props {
  x: number;
  y: number;
  z: number;
  focused: boolean;
  maximized?: boolean;
  width: number;
  height: number;
  smooth?: boolean;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onOpenChat: (c: Contact) => void;
  onSignOut: () => void;
  onBuzzAll?: (c: Contact) => void;
}

export default function ContactListWindow(p: Props) {
  const [query, setQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState(ME.statusMsg);
  const [selected, setSelected] = useState<string | null>(null);
  const [groups, setGroups] = useState({ friends: true, offline: false });
  const [myStatus, setMyStatus] = useState<StatusKind>("available");
  const [statusMenu, setStatusMenu] = useState(false);
  const [msgMenu, setMsgMenu] = useState(false);
  const [msgHistory, setMsgHistory] = useState<string[]>(["Is it Friday yet? :)", "BRB — coffee", "listening to music"]);

  const commitStatusMsg = () => {
    const t = statusMsg.trim();
    if (!t) return;
    setMsgHistory((h) => [t, ...h.filter((x) => x !== t)].slice(0, 6));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTACTS;
    return CONTACTS.filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q));
  }, [query]);

  const online = filtered.filter((c) => c.status !== "offline");
  const offline = filtered.filter((c) => c.status === "offline");

  const menus: MenuDef[] = [
    {
      label: "Messenger",
      items: [
        { label: "My Status", onClick: () => {} },
        { label: "Set Custom Message...", onClick: () => {} },
        { sep: true },
        { label: "Preferences...", onClick: () => {} },
        { sep: true },
        { label: "Sign Out", onClick: p.onSignOut },
      ],
    },
    {
      label: "Contacts",
      items: [
        { label: "Add a Contact...", onClick: () => {} },
        { label: "View Offline Contacts", checked: true, onClick: () => {} },
        { sep: true },
        { label: "Sort by Status", onClick: () => {} },
        { label: "Sort by Name", onClick: () => {} },
      ],
    },
    {
      label: "Actions",
      items: [
        { label: "Send Instant Message", onClick: () => selected && p.onOpenChat(CONTACTS.find((c) => c.id === selected)!) },
        {
          label: "Send a BUZZ!!!",
          onClick: () => {
            const c = CONTACTS.find((x) => x.id === selected);
            if (c) p.onBuzzAll?.(c);
          },
        },
        { sep: true },
        { label: "Start Video Call", onClick: () => {} },
        { label: "Start Voice Call", onClick: () => {} },
      ],
    },
    {
      label: "Help",
      items: [
        { label: "Help Topics", onClick: () => {} },
        { sep: true },
        { label: "About Yahoo! Messenger", onClick: () => {} },
      ],
    },
  ];

  return (
    <WindowFrame
      title=""
      icon={
        <span className="flex items-baseline gap-1.5 pr-1">
          <span className="font-yahoo text-white text-[15px] leading-none" style={{ textShadow: "0 1px 2px rgba(40,10,90,.6)" }}>
            Yahoo!
          </span>
          <span className="ym-titlebar-text text-[11px] font-bold tracking-[0.12em]">MESSENGER</span>
        </span>
      }
      x={p.x}
      y={p.y}
      width={p.width}
      height={p.height}
      minW={316}
      minH={430}
      smooth={p.smooth}
      onResize={p.onResize}
      z={p.z}
      focused={p.focused}
      maximized={p.maximized}
      menus={menus}
      onMove={p.onMove}
      onFocus={p.onFocus}
      onClose={p.onClose}
      onMinimize={p.onMinimize}
      onToggleMax={p.onToggleMax}
    >
      {/* ---- Profile header ---- */}
      <div className="bg-gradient-to-b from-[#f7f6ec] to-[#efeee1] px-1.5 pt-1.5 pb-1.5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{ background: "radial-gradient(circle at 85% 20%, rgba(190,160,235,0.5), transparent 55%)" }}
        />
        <Swirls tint="light" />
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 160% at 95% -20%, rgba(96,140,240,0.25), transparent 55%), radial-gradient(110% 150% at 0% 120%, rgba(180,100,230,0.22), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="w-[56px] h-[56px] shrink-0 overflow-hidden" style={{ borderRadius: 2 }}>
            <img src={ME.avatar} alt="me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <StatusDot status={myStatus} pulse={myStatus === "available"} />
              <span className="text-[15px] font-bold text-[#222] truncate">{ME.name}</span>
              <div className="relative">
                <button
                  className="text-[#555] hover:text-[#222] px-0.5"
                  title="Set my status"
                  onClick={() => setStatusMenu((v) => !v)}
                >
                  <IconChevron dir="down" />
                </button>
                {statusMenu && (
                  <div className="animate-pop absolute left-0 top-full mt-[2px] w-[158px] bg-[#f6f5ec] border border-[#7a57c6] shadow-[3px_3px_8px_rgba(20,5,50,0.4)] py-0.5 z-50">
                    {STATUS_OPTIONS.map((o) => (
                      <button
                        key={o.kind}
                        className="ym-dropdown-item w-full text-left px-2.5 py-[3px] text-[11.5px] flex items-center gap-2"
                        onClick={() => {
                          setMyStatus(o.kind);
                          setStatusMenu(false);
                        }}
                      >
                        <StatusDot status={o.kind} />
                        {myStatus === o.kind ? "✓ " : ""}
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex mt-1 relative">
              <input
                className="ym-input flex-1 h-[22px] px-1.5 text-[11.5px]"
                value={statusMsg}
                onChange={(e) => setStatusMsg(e.target.value)}
                onBlur={commitStatusMsg}
                onKeyDown={(e) => e.key === "Enter" && commitStatusMsg()}
                title="Custom message"
              />
              <button
                className="xp-btn w-[21px] -ml-px flex items-center justify-center text-[#555]"
                title="Recent messages"
                onClick={() => setMsgMenu((v) => !v)}
              >
                <IconChevron dir="down" />
              </button>
              {msgMenu && (
                <div className="animate-pop absolute right-0 top-full mt-[2px] w-[210px] bg-[#f6f5ec] border border-[#7a57c6] shadow-[3px_3px_8px_rgba(20,5,50,0.4)] py-0.5 z-50">
                  {msgHistory.map((m) => (
                    <button
                      key={m}
                      className="ym-dropdown-item w-full text-left px-2.5 py-[3px] text-[11.5px] truncate"
                      onClick={() => {
                        setStatusMsg(m);
                        setMsgMenu(false);
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[#6a6a6a] text-[11px]">
              <span className="flex items-center gap-1">
                <IconPcPhone />
              </span>
              <span className="flex items-center gap-1.5">
                <IconHandset /> Yahoo! Voice $12.49
              </span>
              <span className="ml-auto">
                <IconMail />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Search band ---- */}
      <div className="ym-searchband px-2 py-[5px] flex items-center gap-1.5 relative overflow-hidden">
        <Swirls tint="purple" />
        <input
          className="flex-1 h-[24px] rounded-[3px] border border-[#8a5cc0] px-2 text-[11.5px] italic text-[#8a8a8a] bg-white outline-none focus:not-italic focus:text-[#222]"
          placeholder="type some contact information..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="h-[24px] w-[30px] rounded-[3px] border border-[#8a5cc0] bg-white/20 hover:bg-white/35 flex items-center justify-center gap-[3px] text-white">
          <IconSearchList />
          <IconChevron dir="down" />
        </button>
      </div>

      {/* ---- Contact list with collapsible groups ---- */}
      <div className="flex-1 min-h-0 bg-white">
        <div className="ym-scroll h-full overflow-y-auto">
          <GroupHeader
            label={`Friends (${online.length})`}
            open={groups.friends}
            onToggle={() => setGroups((g) => ({ ...g, friends: !g.friends }))}
          />
          {groups.friends &&
            online.map((c) => (
              <Row key={c.id} c={c} selected={selected === c.id} onSelect={() => setSelected(c.id)} onOpen={() => p.onOpenChat(c)} />
            ))}

          <GroupHeader
            label={`Offline (${offline.length})`}
            open={groups.offline}
            onToggle={() => setGroups((g) => ({ ...g, offline: !g.offline }))}
          />
          {groups.offline &&
            offline.map((c) => (
              <Row key={c.id} c={c} selected={selected === c.id} onSelect={() => setSelected(c.id)} onOpen={() => p.onOpenChat(c)} />
            ))}
          {groups.offline && offline.length === 0 && (
            <div className="px-3 py-2 text-[11px] text-[#aaa] italic">Nobody is offline right now.</div>
          )}

          {filtered.length === 0 && (
            <div className="p-6 text-center text-[#999] text-[12px]">No contacts match "{query}"</div>
          )}
        </div>
      </div>

      {/* ---- Bottom buttons ---- */}
      <div className="bg-[#efeee1] border-t border-[#d8d5c5] px-1.5 py-1.5 flex gap-1.5">
        <button className="xp-btn flex-[1.55] h-[27px] flex items-center justify-center gap-1.5 text-[12px] text-[#333]">
          <IconPlus /> Add a Contact
        </button>
        <button className="xp-btn flex-1 h-[27px] text-[12px] text-[#333]">Plug-ins</button>
        <button className="xp-btn w-[30px] h-[27px] flex items-center justify-center text-[#555]">
          <IconChevron dir="up" />
        </button>
      </div>

      {/* ---- Web search footer ---- */}
      <div className="bg-[#f7f6ec] px-2 py-2 flex items-center gap-2 border-t border-[#c9c5b4]">
        <div className="flex flex-col leading-none shrink-0 w-[68px]">
          <YahooWordmark size={18} />
          <span className="text-[8px] font-bold tracking-[0.14em] text-[#444] mt-[2px]">WEB SEARCH</span>
        </div>
        <input className="ym-input flex-1 h-[25px] px-1.5 border-[#7b2fbd]" />
        <button className="xp-btn w-[31px] h-[25px] flex items-center justify-center">
          <IconArrowGo />
        </button>
      </div>
    </WindowFrame>
  );
}

function GroupHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      className="w-full flex items-center gap-1.5 px-2 py-[4px] bg-[#f4f3ea] border-y border-[#e2e0d2] text-[#444] hover:bg-[#efedda] transition-colors"
      onClick={onToggle}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" className="text-[#5a4a8a]" style={{ transform: open ? "none" : "rotate(-90deg)", transition: "transform 0.15s" }}>
        <path d="M1.5 3 L5 7 L8.5 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="text-[11.5px] font-bold">{label}</span>
    </button>
  );
}

function Row({ c, selected, onSelect, onOpen }: { c: Contact; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  return (
    <div
      className={`ym-list-row flex gap-2 px-1.5 py-[5px] cursor-pointer ${selected ? "selected" : ""}`}
      onClick={onSelect}
      onDoubleClick={onOpen}
      title={`Double-click to message ${c.name}`}
    >
      <div className="w-[44px] h-[44px] shrink-0 overflow-hidden" style={{ borderRadius: 2 }}>
        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 pt-[3px]">
        <div className="flex items-center gap-1.5">
          <StatusDot status={c.status} />
          <span className="text-[13px] truncate text-[#1a1a1a]">{c.name}</span>
          {c.badge === "crown" && <BadgeCrown />}
          {c.badge === "trophy" && <BadgeTrophy />}
        </div>
        {c.statusText && <div className="text-[11.5px] text-[#8f8f8f] truncate mt-[3px]">{c.statusText}</div>}
        {c.customMsg && (
          <div className="text-[12px] truncate mt-[3px]" style={{ color: c.customMsgColor }}>
            {c.badge === "mobile" && <BadgeMobile />}
            {c.badge === "music" && <BadgeMusic />} {c.customMsg}
          </div>
        )}
      </div>
    </div>
  );
}
