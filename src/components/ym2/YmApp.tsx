"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { playAlertOriginal, playXpStartup, playXpLogoff, playXpShutdown, playXpBalloon, playXpRecycle, stopImvAmbient } from "./sounds";
import { BootScreen, WelcomeScreen } from "./XpBoot";
import SignInWindow from "./SignInWindow";
import ContactListWindow from "./ContactListWindow";
import ChatWindow from "./ChatWindow";
import Taskbar, { TaskItem } from "./Taskbar";
import { StatusDot, YahooSmiley } from "./icons";
import { Contact, SEED_CONVERSATIONS, CONTACTS, ME } from "./data";

interface WinState {
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized?: boolean;
  w?: number;
  h?: number;
}

type Stage = "boot" | "welcome" | "signin" | "in";

const SIGNIN_W = 298;
const SIGNIN_H = () => Math.min(624, window.innerHeight - 70);
const CONTACT_W = 356;
const CONTACT_H = () => Math.min(820, window.innerHeight - 68);
const CHAT_W = 560;
const CHAT_H = () => Math.min(648, window.innerHeight - 90);
const PC_W = 640;
const PC_H = () => Math.min(480, window.innerHeight - 90);

const contactById = (id: string) => CONTACTS.find((c) => c.id === id);

const ICO = (name: string, size = 48) => `/assets/xp/icons/${name}-${size}.png`;

export default function YmApp() {
  const [stage, setStage] = useState<Stage>("boot");
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
  const [mypc, setMypc] = useState<WinState | null>(null);
  /* XP tray balloon: "you are signed in" */
  const [balloon, setBalloon] = useState(false);
  const balloonShown = useRef(false);
  const focusedRef = useRef(focusedId);
  useEffect(() => {
    focusedRef.current = focusedId;
  }, [focusedId]);

  const nextZ = () => ++zRef.current;
  const focus = (id: string, set: (fn: (w: WinState) => WinState) => void) => {
    set((w) => ({ ...w, z: nextZ(), minimized: false }));
    setFocusedId(id);
  };

  /* ---------- XP boot → welcome → desktop ---------- */
  const bootDone = useCallback(() => setStage("welcome"), []);
  const enterDesktop = useCallback(() => {
    /* the genuine XP startup sound, played from the welcome-tile user gesture;
       the "welcome" phase of the logon screen plays out before the desktop fades in */
    playXpStartup();
    window.setTimeout(() => setStage("signin"), 2050);
  }, []);
  const turnOff = useCallback(() => {
    /* XpBoot plays the shutdown sound; loop back to a fresh boot */
    window.setTimeout(() => {
      stopImvAmbient();
      setStage("boot");
    }, 2700);
  }, []);

  const logOff = () => {
    playXpLogoff();
    setStage("welcome");
  };

  /* ---------- windows ---------- */
  const handleSignIn = () => {
    morph();
    setStage("in");
    /* the buddy list opens IN the login window's exact frame, then grows
       into its real size — the window morphs in place like the real client */
    setContacts({ x: signin.x, y: signin.y, z: nextZ(), minimized: false, open: true, w: SIGNIN_W, h: signin.h });
    setFocusedId("contacts");
    window.setTimeout(() => {
      setContacts((w) => (w ? { ...w, w: CONTACT_W, h: CONTACT_H() } : w));
    }, 80);
    /* XP-style tray balloon the first time we land on the desktop */
    if (!balloonShown.current) {
      balloonShown.current = true;
      window.setTimeout(() => {
        setBalloon(true);
        playXpBalloon();
        window.setTimeout(() => setBalloon(false), 6500);
      }, 900);
    }
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
    if (id === "mypc") {
      setMypc((w) => {
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

  const openMyComputer = () => {
    if (mypc) {
      setMypc((w) => (w ? { ...w, minimized: false, z: nextZ() } : w));
    } else {
      setMypc({ x: 170, y: 90, z: nextZ(), minimized: false, w: PC_W, h: PC_H() });
    }
    setFocusedId("mypc");
  };

  /* ---------- My Computer: drag by the Luna titlebar ---------- */
  const mypcDrag = useRef<{ dx: number; dy: number } | null>(null);
  const mypcTitleDown = (e: React.PointerEvent) => {
    if (!mypc || mypc.maximized) return;
    e.stopPropagation();
    setMypc((w) => (w ? { ...w, z: nextZ(), minimized: false } : w));
    setFocusedId("mypc");
    mypcDrag.current = { dx: e.clientX - mypc.x, dy: e.clientY - mypc.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const mypcTitleMove = (e: React.PointerEvent) => {
    if (!mypcDrag.current || !mypc) return;
    const wW = mypc.w ?? PC_W;
    const nx = Math.min(Math.max(e.clientX - mypcDrag.current.dx, -(wW - 120)), window.innerWidth - 60);
    const ny = Math.min(Math.max(e.clientY - mypcDrag.current.dy, 0), window.innerHeight - 70);
    setMypc((w) => (w ? { ...w, x: nx, y: ny } : w));
  };
  const mypcTitleUp = () => {
    mypcDrag.current = null;
  };

  const buzzAll = (c: Contact) => {
    openChat(c);
    setBuzzReq((prev) => ({ ...prev, [c.id]: (prev[c.id] || 0) + 1 }));
  };

  /* ---------- taskbar items ---------- */
  const items: TaskItem[] = [];
  if (stage !== "boot" && stage !== "welcome") {
    if (stage === "signin") {
      items.push({ id: "signin", title: "Yahoo! Messenger with Voice", icon: <YahooSmiley size={14} />, minimized: signin.minimized, focused: focusedId === "signin" });
    } else {
      if (contacts)
        items.push({ id: "contacts", title: "Sarah Bacon - Yahoo! Messenger", icon: <YahooSmiley size={14} />, minimized: contacts.minimized, focused: focusedId === "contacts" });
      if (mypc)
        items.push({ id: "mypc", title: "My Computer", icon: <img src={ICO("my-computer", 48)} alt="" className="w-[14px] h-[14px]" draggable={false} />, minimized: mypc.minimized, focused: focusedId === "mypc" });
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
  }

  const topZ = Math.max(signin.z, contacts?.z ?? 0, mypc?.z ?? 0, ...Object.values(chats).map((c) => c.z));
  const desktopStage = stage === "signin" || stage === "in";

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

      {/* Desktop icons — the GENUINE XP Luna icons at the default 32px
          "Medium Icons" size, Tahoma 8pt labels; My Computer on top like
          the classic XP desktop (My Documents hidden) */}
      {desktopStage && (
        <div className="absolute left-0.5 top-0.5 flex flex-col z-[1]">
          {[
            { id: "pc", label: "My Computer", img: "my-computer" },
            { id: "docs", label: "My Documents", img: "my-docs" },
            { id: "net", label: "My Network Places", img: "network" },
            { id: "ie", label: "Internet Explorer", img: "ie" },
            { id: "bin", label: "Recycle Bin", img: "recycle-empty" },
          ].map((d) => (
            <button
              key={d.id}
              className="flex flex-col items-center justify-start w-[76px] min-h-[74px] pt-[3px] pb-[5px] rounded-[2px]"
              style={{ background: deskSel === d.id ? "rgba(49,106,197,0.4)" : "transparent", outline: deskSel === d.id ? "1px dotted rgba(255,255,255,0.8)" : "none", outlineOffset: "-1px" }}
              onClick={(e) => {
                e.stopPropagation();
                setDeskSel(d.id);
              }}
              onDoubleClick={() => {
                if (d.id === "pc") openMyComputer();
                if (d.id === "bin") playXpRecycle();
              }}
            >
              <img src={ICO(d.img, 32)} alt="" className="w-[32px] h-[32px]" draggable={false} />
              <span className="mt-[3px] text-[11px] leading-[13px] text-white text-center px-[1px]" style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.9)" }}>
                {d.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* My Computer window — real XP explorer chrome: Luna titlebar,
          menu bar, address bar with Go, light task pane with blue group
          headers, status bar */}
      {desktopStage && mypc && !mypc.minimized && (
        <div
          className="absolute flex flex-col rounded-t-[8px] overflow-hidden"
          style={{
            left: mypc.x, top: mypc.y, width: mypc.w ?? PC_W, height: mypc.h ?? PC_H(), zIndex: mypc.z,
            background: "#ece9d8",
            boxShadow: "0 8px 30px rgba(0,0,30,0.45)",
            border: "1px solid #0831d9",
          }}
          onMouseDown={() => {
            setMypc((w) => (w ? { ...w, z: nextZ(), minimized: false } : w));
            setFocusedId("mypc");
          }}
        >
          {/* GENUINE Luna caption: FrameCaption.bmp 9-sliced, 25px tall
              (CaptionBarHeight from the theme), Trebuchet MS bold title,
              real 21x21 caption buttons */}
          <div
            className="luna-caption relative h-[25px] shrink-0 cursor-default select-none"
            onPointerDown={mypcTitleDown}
            onPointerMove={mypcTitleMove}
            onPointerUp={mypcTitleUp}
          >
            <div className="absolute inset-0 flex items-center pl-[7px] pr-[4px]">
              <img src={ICO("my-computer", 16)} alt="" className="w-4 h-4 mr-[5px]" draggable={false} />
              <span
                className="text-white font-bold text-[13px] flex-1 truncate"
                style={{ fontFamily: "'Trebuchet MS',Tahoma,sans-serif", textShadow: "1px 1px 1px rgb(10,24,131)" }}
              >
                My Computer
              </span>
              <button className="luna-capbtn min" onPointerDown={(e) => e.stopPropagation()} onClick={() => setMypc((w) => (w ? { ...w, minimized: true } : w))} aria-label="Minimize" />
              <button className="luna-capbtn max ml-[3px]" onPointerDown={(e) => e.stopPropagation()} aria-label="Maximize" />
              <button className="luna-capbtn close ml-[3px]" onPointerDown={(e) => e.stopPropagation()} onClick={() => setMypc(null)} aria-label="Close" />
            </div>
          </div>
          {/* menu bar */}
          <div className="h-[21px] flex items-center px-1.5 gap-0.5 text-[11px] text-[#333] bg-[#ece9d8] border-b border-[#d4d0c0]">
            {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => (
              <span key={m} className="px-1.5 py-[1px] rounded hover:bg-[#316ac5] hover:text-white cursor-default">{m}</span>
            ))}
          </div>
          {/* address bar */}
          <div className="h-[27px] flex items-center gap-1.5 px-1.5 bg-[#ece9d8] border-b border-[#d4d0c0]">
            <span className="text-[11px] text-[#777] pl-0.5">Address</span>
            <span className="flex-1 h-[20px] bg-white border border-[#7f9db9] rounded-[2px] flex items-center gap-1 px-1 text-[11px] text-[#333]">
              <img src={ICO("my-computer", 48)} alt="" className="w-[13px] h-[13px]" />
              My Computer
            </span>
            <button className="flex items-center gap-1 text-[11px] text-[#2a5a0e] px-1.5 h-[20px] rounded hover:bg-[#e6f0d8]" title="Go">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 h6 M5.4 2.6 L9 6 L5.4 9.4" fill="none" stroke="#3d9028" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Go
            </button>
          </div>
          <div className="flex flex-1 min-h-0">
            {/* task pane — the real XP look: pale blue gradient with rounded
                blue group headers over white bodies */}
            <div
              className="w-[186px] p-2.5 overflow-y-auto"
              style={{ background: "linear-gradient(180deg, #7ba2e8 0%, #8fabdd 10%, #eef2fb 42%, #e9eef9 100%)" }}
            >
              {[
                {
                  head: "System Tasks",
                  items: ["View system information", "Add or remove programs", "Change a setting"],
                },
                {
                  head: "Other Places",
                  items: ["My Network Places", "My Documents", "Shared Documents", "Control Panel"],
                },
              ].map((g) => (
                <div key={g.head} className="rounded-[5px] overflow-hidden mb-2.5" style={{ boxShadow: "0 1px 3px rgba(30,60,130,0.25)" }}>
                  <div
                    className="px-2.5 h-[21px] flex items-center text-white text-[11px] font-bold"
                    style={{
                      backgroundImage: "url(/assets/xp/luna/normalgrouphead.png)",
                      backgroundSize: "100% 100%",
                    }}
                  >
                    {g.head}
                  </div>
                  <div className="bg-white/90 px-2.5 py-2 text-[11px] text-[#2c57a4] space-y-[7px]">
                    {g.items.map((it) => (
                      <div key={it} className="flex items-start gap-1.5 hover:text-[#e88c00] cursor-pointer leading-tight">
                        <span className="text-[#4a72cc] mt-[1px]">›</span>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* drives */}
            <div className="flex-1 bg-white p-4 overflow-y-auto">
              <div className="text-[12px] font-bold text-[#1c3f94] border-b border-[#c8d4e8] pb-1 mb-3">Files Stored on This Computer</div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 w-[190px]">
                  <img src={ICO("my-docs", 48)} alt="" className="w-[32px] h-[32px]" />
                  <div className="text-[11px] leading-tight">
                    <div className="text-[#1a4fae]">Shared Documents</div>
                  </div>
                </div>
              </div>
              <div className="text-[12px] font-bold text-[#1c3f94] border-b border-[#c8d4e8] pb-1 mb-3">Hard Disk Drives</div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 w-[190px]">
                  <img src={ICO("hdd", 48)} alt="" className="w-[32px] h-[32px]" />
                  <div className="text-[11px] leading-tight">
                    <div className="text-[#1a4fae]">Local Disk (C:)</div>
                  </div>
                </div>
              </div>
              <div className="text-[12px] font-bold text-[#1c3f94] border-b border-[#c8d4e8] pb-1 mb-3">Devices with Removable Storage</div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 w-[190px]">
                  <img src={ICO("cd-drive", 48)} alt="" className="w-[32px] h-[32px]" />
                  <div className="text-[11px] leading-tight">
                    <div className="text-[#1a4fae]">CD Drive (D:)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* status bar */}
          <div className="h-[20px] flex items-center px-2 text-[11px] text-[#444] bg-[#ece9d8] border-t border-[#d4d0c0] gap-0" style={{ backgroundImage: "url(/assets/xp/luna/statusbackground.png)", backgroundSize: "100% 100%" }}>
            <span className="flex-1">5 objects</span>
            <span className="w-[130px] border-l border-[#d4d0c0] pl-2 h-full flex items-center">My Computer</span>
            <span className="w-[26px] border-l border-[#d4d0c0] h-full flex items-center justify-center">
              <img src={ICO("my-computer", 48)} alt="" className="w-[12px] h-[12px]" />
            </span>
          </div>
        </div>
      )}

      {/* Yahoo! Messenger windows */}
      {desktopStage && stage === "signin" && !signin.minimized && (
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

      {/* XP tray balloon — signed in */}
      {stage === "in" && balloon && (
        <div className="absolute right-3 bottom-[38px] z-[9500] xp-balloon" style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,30,0.4))" }}>
          <div className="relative bg-[#ffffe1] border border-[#8a8875] rounded-[7px] p-2.5 w-[264px] text-[#1a1a1a]">
            <button
              className="absolute top-1 right-1.5 text-[#666] hover:text-black text-[11px] leading-none"
              onClick={() => setBalloon(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex gap-2">
              <img src={ICO("info", 48)} alt="" className="w-[17px] h-[17px] mt-0.5" />
              <div className="text-[11.5px] leading-snug">
                <div className="font-bold">Yahoo! Messenger</div>
                <div>
                  {ME.name} is now signed in and available. Click the buddy list to start chatting.
                </div>
              </div>
            </div>
            <div
              className="absolute -bottom-[9px] right-10 w-[14px] h-[14px] bg-[#ffffe1] border-b border-r border-[#8a8875]"
              style={{ transform: "rotate(45deg)" }}
            />
          </div>
        </div>
      )}

      {desktopStage && (
        <Taskbar
          items={items}
          flashing={flashing}
          onTaskClick={taskClick}
          onShowContacts={() => taskClick("contacts")}
          onLogOff={logOff}
          onTurnOff={turnOff}
          onOpenMyComputer={openMyComputer}
        />
      )}

      {/* the XP boot → welcome experience */}
      {stage === "boot" && <BootScreen onDone={bootDone} />}
      {stage === "welcome" && <WelcomeScreen onEnter={enterDesktop} onTurnOff={turnOff} />}
    </div>
  );
}
