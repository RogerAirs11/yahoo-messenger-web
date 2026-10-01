"use client";

import { useEffect, useRef, useState } from "react";
import { playAlertOriginal, playLoginOriginal } from "./sounds";
import SignInWindow from "./SignInWindow";
import ContactListWindow from "./ContactListWindow";
import ChatWindow from "./ChatWindow";
import Taskbar, { TaskItem } from "./Taskbar";
import { StatusDot, YahooSmiley } from "./icons";
import { Contact, SEED_CONVERSATIONS, CONTACTS } from "./data";

interface WinState {
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized?: boolean;
  w?: number;
  h?: number;
}

const SIGNIN_W = 298;
const SIGNIN_H = () => Math.min(624, window.innerHeight - 70);
const CONTACT_W = 356;
const CONTACT_H = () => Math.min(820, window.innerHeight - 68);
const CHAT_W = 560;
const CHAT_H = () => Math.min(648, window.innerHeight - 90);

const contactById = (id: string) => CONTACTS.find((c) => c.id === id);

export default function YmApp() {
  const [stage, setStage] = useState<"signin" | "in">("signin");
  const zRef = useRef(10);
  const [focusedId, setFocusedId] = useState("signin");
  const [signin, setSignin] = useState<WinState>(() => ({
    x: 30,
    y: 14,
    z: 10,
    minimized: false,
    w: SIGNIN_W,
    /* deterministic SSR value; snapped to the real viewport after mount */
    h: 624,
  }));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- snap the SSR-safe height to the real viewport after mount
    setSignin((w) => ({ ...w, h: SIGNIN_H() }));
  }, []);
  const [morphing, setMorphing] = useState(false);
  const morph = () => {
    setMorphing(true);
    window.setTimeout(() => setMorphing(false), 480);
  };
  const [contacts, setContacts] = useState<(WinState & { open: boolean }) | null>(null);
  const [chats, setChats] = useState<Record<string, WinState>>({});
  const [buzzReq, setBuzzReq] = useState<Record<string, number>>({});
  const [flashing, setFlashing] = useState<Record<string, boolean>>({});
  const [deskSel, setDeskSel] = useState<string | null>(null);
  const focusedRef = useRef(focusedId);
  useEffect(() => {
    focusedRef.current = focusedId;
  }, [focusedId]);

  const nextZ = () => ++zRef.current;
  const focus = (id: string, set: (fn: (w: WinState) => WinState) => void) => {
    set((w) => ({ ...w, z: nextZ(), minimized: false }));
    setFocusedId(id);
  };

  /* one container: compact while signed out, expands to the friend list in place */
  const handleSignIn = () => {
    morph();
    setStage("in");
    setContacts({ x: signin.x, y: signin.y, z: nextZ(), minimized: false, open: true, w: CONTACT_W, h: CONTACT_H() });
    setFocusedId("contacts");
  };

  const handleSignOut = () => {
    morph();
    playAlertOriginal();
    setStage("signin");
    setContacts(null);
    setChats({});
    setBuzzReq({});
    setSignin((w) => ({ ...w, minimized: false, z: nextZ(), x: contacts?.x ?? 30, y: contacts?.y ?? 14, w: SIGNIN_W, h: SIGNIN_H() }));
    setFocusedId("signin");
  };

  const openChat = (c: Contact) => {
    if (chats[c.id]) {
      setChats((prev) => ({ ...prev, [c.id]: { ...prev[c.id], z: nextZ(), minimized: false } }));
      setFocusedId(`chat:${c.id}`);
      return;
    }
    const n = Object.keys(chats).length;
    setChats((prev) => ({
      ...prev,
      [c.id]: { x: 150 + n * 26, y: 44 + n * 26, z: nextZ(), minimized: false, w: CHAT_W, h: CHAT_H() },
    }));
    setFocusedId(`chat:${c.id}`);
  };

  const closeChat = (id: string) =>
    setChats((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const taskClick = (id: string) => {
    if (id === "signin") {
      setSignin((w) => {
        if (w.minimized || focusedId !== id) {
          setFocusedId(id);
          return { ...w, minimized: false, z: nextZ() };
        }
        return { ...w, minimized: true };
      });
      return;
    }
    if (id === "contacts") {
      setContacts((w) => {
        if (!w) return w;
        if (w.minimized || focusedId !== id) {
          setFocusedId(id);
          return { ...w, minimized: false, z: nextZ() };
        }
        return { ...w, minimized: true };
      });
      return;
    }
    const cid = id.slice(5);
    setFlashing((f) => ({ ...f, [id]: false }));
    setChats((prev) => {
      const w = prev[cid];
      if (!w) return prev;
      if (w.minimized || focusedId !== id) {
        setFocusedId(id);
        return { ...prev, [cid]: { ...w, minimized: false, z: nextZ() } };
      }
      return { ...prev, [cid]: { ...w, minimized: true } };
    });
  };

  const buzzAll = (c: Contact) => {
    openChat(c);
    setBuzzReq((prev) => ({ ...prev, [c.id]: (prev[c.id] || 0) + 1 }));
  };

  /* ---------- taskbar items ---------- */
  const items: TaskItem[] = [];
  if (stage === "signin") {
    items.push({ id: "signin", title: "Yahoo! Messenger with Voice", icon: <YahooSmiley size={14} />, minimized: signin.minimized, focused: focusedId === "signin" });
  } else {
    if (contacts)
      items.push({ id: "contacts", title: "Sarah Bacon - Yahoo! Messenger", icon: <YahooSmiley size={14} />, minimized: contacts.minimized, focused: focusedId === "contacts" });
    Object.keys(chats).forEach((cid) => {
      const c = contactById(cid);
      items.push({
        id: `chat:${cid}`,
        title: c?.name ?? cid,
        icon: <StatusDot status={c?.status ?? "available"} />,
        minimized: chats[cid].minimized,
        focused: focusedId === `chat:${cid}`,
      });
    });
  }

  const topZ = Math.max(signin.z, contacts?.z ?? 0, ...Object.values(chats).map((c) => c.z));

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={() => setDeskSel(null)}>
      {/* Wallpaper — the REAL Windows XP "Bliss" photograph (Sonoma Valley,
          Charles O'Rear), served locally; gradient underlay while it loads */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #2565c8 0%, #3a7bd5 30%, #5d9ad9 55%, #8db8dd 66%)",
        }}
      >
        <img
          src="/assets/wallpaper/bliss-real.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center bottom" }}
        />
      </div>

      {/* Desktop icons */}
      {stage === "in" && (
        <div className="absolute left-3 top-3 flex flex-col gap-4 z-[1]">
          {[
            { id: "pc", label: "My Computer", icon: <DeskPc /> },
            { id: "bin", label: "Recycle Bin", icon: <DeskBin /> },
          ].map((d) => (
            <button
              key={d.id}
              className="flex flex-col items-center gap-1 w-[74px] py-1 rounded"
              style={{ background: deskSel === d.id ? "rgba(60,90,200,0.45)" : "transparent", outline: deskSel === d.id ? "1px dotted rgba(255,255,255,0.7)" : "none" }}
              onClick={(e) => {
                e.stopPropagation();
                setDeskSel(d.id);
              }}
            >
              {d.icon}
              <span className="text-[11px] text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
                {d.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Windows */}
      {stage === "signin" && !signin.minimized && (
        <SignInWindow
          x={signin.x}
          y={signin.y}
          z={signin.z}
          focused={focusedId === "signin" && signin.z === topZ}
          width={signin.w ?? SIGNIN_W}
          height={signin.h ?? SIGNIN_H()}
          smooth={morphing}
          onMove={(x, y) => setSignin((w) => ({ ...w, x, y }))}
          onFocus={() => focus("signin", (fn) => setSignin(fn))}
          onClose={handleSignOut}
          onMinimize={() => setSignin((w) => ({ ...w, minimized: true }))}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
      )}

      {stage === "in" && contacts && !contacts.minimized && (
        <ContactListWindow
          x={contacts.x}
          y={contacts.y}
          z={contacts.z}
          focused={focusedId === "contacts"}
          maximized={contacts.maximized}
          width={contacts.w ?? CONTACT_W}
          height={contacts.h ?? CONTACT_H()}
          smooth={morphing}
          onResize={(w, h) => setContacts((s) => (s ? { ...s, w, h } : s))}
          onMove={(x, y) => setContacts((w) => (w ? { ...w, x, y } : w))}
          onFocus={() => {
            setContacts((w) => (w ? { ...w, z: nextZ(), minimized: false } : w));
            setFocusedId("contacts");
          }}
          onClose={() => setContacts((w) => (w ? { ...w, minimized: true } : w))}
          onMinimize={() => setContacts((w) => (w ? { ...w, minimized: true } : w))}
          onToggleMax={() => setContacts((w) => (w ? { ...w, maximized: !w.maximized } : w))}
          onOpenChat={openChat}
          onSignOut={handleSignOut}
          onBuzzAll={buzzAll}
        />
      )}

      {stage === "in" &&
        Object.entries(chats).map(([cid, w]) => {
          if (w.minimized) return null;
          const c = contactById(cid);
          if (!c) return null;
          return (
            <ChatWindow
              key={cid}
              contact={c}
              seed={SEED_CONVERSATIONS[cid] ?? []}
              buzzSignal={buzzReq[cid] ?? 0}
              onNotify={() => {
                if (focusedRef.current !== `chat:${cid}`) setFlashing((f) => ({ ...f, [`chat:${cid}`]: true }));
              }}
              x={w.x}
              y={w.y}
              z={w.z}
              focused={focusedId === `chat:${cid}`}
              maximized={w.maximized}
              width={w.w ?? CHAT_W}
              height={w.h ?? CHAT_H()}
              onResize={(nw, nh) => setChats((prev) => ({ ...prev, [cid]: { ...prev[cid], w: nw, h: nh } }))}
              onMove={(x, y) => setChats((prev) => ({ ...prev, [cid]: { ...prev[cid], x, y } }))}
              onFocus={() => {
                setChats((prev) => ({ ...prev, [cid]: { ...prev[cid], z: nextZ(), minimized: false } }));
                setFocusedId(`chat:${cid}`);
                setFlashing((f) => ({ ...f, [`chat:${cid}`]: false }));
              }}
              onClose={() => closeChat(cid)}
              onMinimize={() => setChats((prev) => ({ ...prev, [cid]: { ...prev[cid], minimized: true } }))}
              onToggleMax={() => setChats((prev) => ({ ...prev, [cid]: { ...prev[cid], maximized: !prev[cid].maximized } }))}
            />
          );
        })}

      <Taskbar items={items} flashing={flashing} onTaskClick={taskClick} onSignOut={handleSignOut} onShowContacts={() => taskClick("contacts")} />
    </div>
  );
}

function DeskPc() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <rect x="4" y="5" width="26" height="18" rx="1.5" fill="#c9c2a8" stroke="#6e6a58" />
      <rect x="6.5" y="7.5" width="21" height="13" fill="#2a66d6" />
      <rect x="6.5" y="7.5" width="21" height="5" fill="#5b9bf0" />
      <rect x="13" y="23" width="8" height="3" fill="#a9a28a" />
      <rect x="9" y="26" width="16" height="2.5" rx="1" fill="#c9c2a8" stroke="#6e6a58" strokeWidth="0.6" />
    </svg>
  );
}
function DeskBin() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <path d="M9 10 h16 l-1.8 18 h-12.4 z" fill="#dfe8f2" stroke="#6a7a8a" />
      <path d="M9 10 h16 l-.4 4 H9.4 z" fill="#b9c8d8" />
      <rect x="7" y="7.5" width="20" height="3" rx="1.5" fill="#9aabbc" stroke="#6a7a8a" strokeWidth="0.6" />
      <path d="M14 6.5 h6 v1.5 h-6 z" fill="#9aabbc" />
      <path d="M13 15 l8 9 M21 15 l-8 9" stroke="#8a9aa8" strokeWidth="1.2" />
    </svg>
  );
}
