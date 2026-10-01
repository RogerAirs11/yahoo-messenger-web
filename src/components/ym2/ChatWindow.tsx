"use client";

import React, { useEffect, useRef, useState } from "react";
import WindowFrame, { MenuDef } from "./WindowFrame";
import {
  Emoticon,
  EMO_PALETTE,
  IconBubble,
  IconBuzz,
  IconChevron,
  IconClip,
  IconGearFlower,
  IconImviron,
  IconInvite,
  IconKnight,
  IconMic,
  IconPhotos,
  IconSmileySmall,
  IconVideoCam,
  StatusDot,
  WhiteFace,
  emojify,
  emojifyHtml,
} from "./icons";
import { AUDIBLE_CATEGORIES, AUTO_REPLIES, ChatMessage, Contact, ME, NEWS_TICKER } from "./data";
import { playBuzz, playKiss, playMessage, playSent, playWind } from "./sounds";
import { ImvScene, IMV_BG, IMV_LIST, ImvId } from "./Imvironments";

interface Props {
  contact: Contact;
  seed: ChatMessage[];
  x: number;
  y: number;
  z: number;
  focused: boolean;
  maximized?: boolean;
  buzzSignal?: number;
  onNotify?: () => void;
  width: number;
  height: number;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
}

const FONTS = ["Arial", "Verdana", "Tahoma", "Comic Sans MS", "Times New Roman", "Courier New", "Georgia"];
const SIZES = [8, 10, 12, 14, 18, 24, 36];
/* YM's "10" point option renders at ~13px on screen */
const SIZE_PX: Record<number, number> = { 8: 11, 10: 13, 12: 15, 14: 17, 18: 22, 24: 28, 36: 40 };
const DEFAULT_FONT = "Arial";
const DEFAULT_SIZE = 10;
/* the emoticon popup shows a fixed paged grid like the original client */
const EMO_PER_PAGE = 40;

export default function ChatWindow(p: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(p.seed);
  const [canSend, setCanSend] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [formatOpen, setFormatOpen] = useState(false);
  const [audiblesOpen, setAudiblesOpen] = useState(false);
  const [audibleCat, setAudibleCat] = useState(AUDIBLE_CATEGORIES[0].id);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [selAudible, setSelAudible] = useState<string | null>(null);
  const [emoPage, setEmoPage] = useState(0);
  const [imv, setImv] = useState<ImvId>("none");
  const [imvMenu, setImvMenu] = useState(false);
  const [gust, setGust] = useState(0);
  const [kisses, setKisses] = useState<number[]>([]);
  const [burst, setBurst] = useState(0);
  const [flurry, setFlurry] = useState(0);
  const [shake, setShake] = useState(false);
  const [font, setFont] = useState("Arial");
  const [fsize, setFsize] = useState(10);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const editor = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | null>(null);

  useEffect(() => {
    pane.current?.scrollTo({ top: pane.current.scrollHeight });
  }, [messages]);

  useEffect(
    () => () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  const push = (m: ChatMessage) => setMessages((prev) => [...prev, m]);

  const doBuzz = () => {
    if (imv === "luv") {
      const id = Date.now();
      setKisses((k) => [...k, id]);
      window.setTimeout(() => setKisses((k) => k.filter((x) => x !== id)), 3400);
      playKiss();
      setMessages((prev) => [...prev, { from: "me", buzz: true }]);
      return;
    }
    if (imv === "autumn") {
      setGust((g) => g + 1);
      playWind();
      setMessages((prev) => [...prev, { from: "me", buzz: true }]);
      return;
    }
    if (imv === "fireworks") {
      /* the buzz becomes a grand golden salute over the skyline */
      setBurst((b) => b + 1);
      playBuzz();
      setMessages((prev) => [...prev, { from: "me", buzz: true }]);
      return;
    }
    if (imv === "winter") {
      setFlurry((f) => f + 1);
      playWind();
      setMessages((prev) => [...prev, { from: "me", buzz: true }]);
      return;
    }
    setMessages((prev) => [...prev, { from: "me", buzz: true }]);
    setShake(true);
    playBuzz();
    window.setTimeout(() => setShake(false), 620);
  };

  const firstBuzz = useRef(true);
  useEffect(() => {
    if (firstBuzz.current) {
      firstBuzz.current = false;
      return;
    }
    doBuzz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.buzzSignal]);

  /* keep B/I/U button state in sync with the caret selection */
  useEffect(() => {
    const sync = () => {
      const el = editor.current;
      const sel = document.getSelection();
      if (!el || !sel || !sel.anchorNode || !el.contains(sel.anchorNode)) return;
      try {
        setBold(document.queryCommandState("bold"));
        setItalic(document.queryCommandState("italic"));
        setUnderline(document.queryCommandState("underline"));
      } catch {
        /* noop */
      }
    };
    document.addEventListener("selectionchange", sync);
    return () => document.removeEventListener("selectionchange", sync);
  }, []);

  const applyFont = (f: string) => {
    setFont(f);
    const el = editor.current;
    if (!el) return;
    el.style.fontFamily = f;
    el.focus();
    document.execCommand("fontName", false, f);
  };

  const applySize = (s: number) => {
    setFsize(s);
    const el = editor.current;
    if (!el) return;
    el.style.fontSize = `${SIZE_PX[s] ?? 13}px`;
    el.focus();
    const legacy = SIZES.indexOf(s);
    if (legacy > 0) document.execCommand("fontSize", false, String(legacy));
  };

  const toggle = (cmd: string) => {
    editor.current?.focus();
    document.execCommand(cmd, false);
    try {
      setBold(document.queryCommandState("bold"));
      setItalic(document.queryCommandState("italic"));
      setUnderline(document.queryCommandState("underline"));
    } catch {
      /* noop */
    }
  };

  const send = () => {
    const el = editor.current;
    if (!el || !el.textContent?.trim()) return;
    const inner = emojifyHtml(el.innerHTML);
    /* default settings render exactly like incoming messages (Arial @13px) */
    const custom = font !== DEFAULT_FONT || fsize !== DEFAULT_SIZE;
    push({
      from: "me",
      html: custom ? `<span style="font-family:${font};font-size:${SIZE_PX[fsize] ?? 13}px">${inner}</span>` : inner,
    });
    playSent();
    el.innerHTML = "";
    el.style.fontFamily = font;
    el.style.fontSize = `${SIZE_PX[fsize] ?? 13}px`;
    setCanSend(false);
    el.focus();
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages((prev) => [...prev, { from: "them", text: reply }]);
      playMessage();
      p.onNotify?.();
    }, 1100 + Math.random() * 1600);
  };

  const insertEmoticon = (code: string) => {
    editor.current?.focus();
    document.execCommand("insertText", false, code + " ");
    setPickerOpen(false);
    setCanSend(true);
  };

  const menus: MenuDef[] = [
    {
      label: "Conversation",
      items: [
        { label: "Send", onClick: send },
        { label: "Send a BUZZ!!!", onClick: doBuzz },
        { sep: true },
        { label: "Invite to Conference...", onClick: () => {} },
        { sep: true },
        { label: "Close", onClick: p.onClose },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Bold", onClick: () => toggle("bold") },
        { label: "Italic", onClick: () => toggle("italic") },
        { label: "Underline", onClick: () => toggle("underline") },
        { sep: true },
        { label: "Select All", onClick: () => editor.current?.focus() },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Show Contact Sidebar", checked: sidebar, onClick: () => setSidebar((v) => !v) },
        { label: "Text Formatting Bar", checked: formatOpen, onClick: () => setFormatOpen((v) => !v) },
        { label: "News Ticker", checked: true, onClick: () => {} },
      ],
    },
    {
      label: "Actions",
      items: [
        { label: "Video Call", onClick: () => {} },
        { label: "Voice Call", onClick: () => {} },
        { sep: true },
        { label: "Send File...", onClick: () => {} },
        { label: "Share Photos...", onClick: () => {} },
      ],
    },
    {
      label: "Help",
      items: [{ label: "About Yahoo! Messenger", onClick: () => {} }],
    },
  ];

  const tickerText = NEWS_TICKER.join("   •   ");

  return (
    <WindowFrame
      title={p.contact.name}
      icon={<StatusDot status={p.contact.status} />}
      x={p.x}
      y={p.y}
      width={p.width}
      height={p.height}
      minW={450}
      minH={420}
      onResize={p.onResize}
      z={p.z}
      focused={p.focused}
      maximized={p.maximized}
      shaking={shake}
      menus={menus}
      onMove={p.onMove}
      onFocus={p.onFocus}
      onClose={p.onClose}
      onMinimize={p.onMinimize}
      onToggleMax={p.onToggleMax}
    >
      {/* ---- Call toolbar ---- */}
      <div className="bg-[#f4f3ea] border-b border-[#d8d5c5] px-2 py-1.5 flex items-start">
        <ToolBtn icon={<IconVideoCam />} label="Video Call" />
        <ToolBtn icon={<IconMic />} label="Voice Call" caret />
        <div className="flex-1" />
        <div className="relative">
          <div className={imvMenu ? "[&>button]:bg-[#ddd0f2]" : ""}>
            <ToolBtn icon={<IconImviron />} label="IMVironments" caret onClick={() => setImvMenu((v) => !v)} active={imv !== "none"} />
          </div>
          {imvMenu && (
            <div className="animate-pop absolute right-0 top-full mt-[2px] w-[168px] bg-[#f6f5ec] border border-[#7a57c6] shadow-[3px_3px_8px_rgba(20,5,50,0.4)] py-0.5 z-50">
              {IMV_LIST.map((o) => (
                <button
                  key={o.id}
                  className="ym-dropdown-item w-full text-left px-3 py-[4px] text-[11.5px] flex items-center gap-2"
                  onClick={() => {
                    setImv(o.id);
                    setImvMenu(false);
                  }}
                >
                  <span className="w-[14px] flex justify-center">{o.icon}</span>
                  {imv === o.id ? "✓ " : ""}
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <ToolBtn icon={<IconKnight />} label="Activities" caret />
        <ToolBtn icon={<IconPhotos />} label="Photos" />
      </div>

      {/* ---- Status strip ---- */}
      <div className="bg-[#f1f0e3] px-3 py-1 flex items-center gap-1.5 text-[11px] text-[#777] border-b border-[#e0ddcd]">
        <StatusDot status={p.contact.status} />
        <span>
          {p.contact.status === "available" ? "Available" : p.contact.statusText ?? "Away"}
          {p.contact.customMsg ? ` — ${p.contact.customMsg}` : ""}
        </span>
      </div>

      {/* ---- Messages + sidebar ---- */}
      <div className="flex-1 min-h-0 flex bg-[#f1f0e3] p-1.5 gap-1.5">
        <div
          className="relative flex-1 min-h-0 border border-[#a9a595]"
          style={{
            background: IMV_BG[imv],
            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          {/* IMVironment ambience — lives BEHIND the message text */}
          <ImvScene imv={imv} kisses={kisses} gust={gust} burst={burst} flurry={flurry} />

          {/* message text, above the ambience */}
          <div
            ref={pane}
            className="ym-scroll absolute inset-0 overflow-y-auto px-2.5 py-2 leading-[1.6]"
            style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: SIZE_PX[DEFAULT_SIZE] }}
          >
            {messages.map((m, i) =>
              m.buzz ? (
                <div key={i} className="animate-msg text-[#d01818] font-bold">
                  BUZZ!!!
                </div>
              ) : m.audible ? (
                <div key={i} className="animate-msg my-1.5 flex items-start gap-2">
                  <span className="font-bold pt-1" style={{ color: m.from === "me" ? "#7b2fbd" : "#2244cc" }}>
                    {m.from === "me" ? ME.handle : p.contact.handle}:
                  </span>
                  <MessageVideo src={m.audible.src} />
                  <span className="pt-1 text-[#333] italic">&quot;{m.audible.caption}&quot;</span>
                </div>
              ) : (
                <div key={i} className="animate-msg break-words">
                  <span className="font-bold" style={{ color: m.from === "me" ? "#7b2fbd" : "#2244cc" }}>
                    {m.from === "me" ? ME.handle : p.contact.handle}:
                  </span>{" "}
                  {m.html ? (
                    <span dangerouslySetInnerHTML={{ __html: m.html }} />
                  ) : (
                    <span>{emojify(m.text ?? "")}</span>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {sidebar && (
          <div className="w-[108px] shrink-0 flex flex-col relative">
            {/* friend's picture (top) — fills its panel exactly */}
            <div className="h-[96px] shrink-0 bg-[#cfc6de]">
              {p.contact.avatar ? (
                <img src={p.contact.avatar} alt={p.contact.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#c3b8d8] flex items-center justify-center">
                  <WhiteFace size={70} />
                </div>
              )}
            </div>
            {/* my picture (bottom of the sidebar, full width) */}
            <div className="flex-1 bg-[#e2dfd2] flex items-end">
              {ME.avatar ? (
                <img src={ME.avatar} alt={ME.name} className="w-full h-[104px] object-cover" />
              ) : (
                <div className="w-full h-[104px] bg-[#d6d2c4] flex items-center justify-center">
                  <WhiteFace size={72} />
                </div>
              )}
            </div>
            {/* collapse control, dead-centre on the seam */}
            <button
              className="absolute left-1/2 -translate-x-1/2 top-[96px] -translate-y-1/2 w-[22px] h-[16px] rounded-full bg-white/95 shadow-[0_1px_3px_rgba(40,20,80,0.35)] border border-[#c2bad6] flex items-center justify-center text-[#7a6a9a] hover:bg-[#f3edfc] hover:scale-105 active:scale-95 transition-transform z-10"
              onClick={() => setSidebar(false)}
              title="Hide sidebar"
            >
              <IconChevron dir="right" />
            </button>
          </div>
        )}
        {!sidebar && (
          <button
            className="w-[16px] bg-[#e4e1d4] border-l border-[#cfccbc] text-[#666] hover:bg-[#f3edfc] flex items-center justify-center"
            onClick={() => setSidebar(true)}
            title="Show sidebar"
          >
            <IconChevron dir="down" />
          </button>
        )}
      </div>

      {/* ---- Audibles panel with category tabs ---- */}
      {audiblesOpen && (
        <div className="bg-[#f1f0e3] border-t border-[#d8d5c5] px-2 pt-1 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11.5px] text-[#555] truncate">{selAudible ?? "Select an Audible below"}</span>
            <div className="ml-auto relative shrink-0">
              <button
                className="xp-btn h-[20px] px-2.5 text-[11px] text-[#333] flex items-center gap-1"
                onClick={() => setCatMenuOpen((v) => !v)}
              >
                More Audibles
                <svg width="8" height="8" viewBox="0 0 10 10"><path d="M1.5 3 L5 7 L8.5 3" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
              {catMenuOpen && (
                <div className="animate-pop absolute right-0 top-full mt-[2px] w-[150px] bg-[#f6f5ec] border border-[#7a57c6] shadow-[3px_3px_8px_rgba(20,5,50,0.4)] py-0.5 z-50 ym-scroll ym-scroll-thin max-h-[240px] overflow-y-auto">
                  {AUDIBLE_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      className={`ym-dropdown-item w-full text-left px-3 py-[3px] text-[11.5px] ${c.id === audibleCat ? "font-bold" : ""}`}
                      onClick={() => {
                        setAudibleCat(c.id);
                        setSelAudible(null);
                        setCatMenuOpen(false);
                      }}
                    >
                      {c.id === audibleCat ? "✓ " : ""}
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* category tabs */}
          <div className="flex items-end gap-[2px] pl-1 overflow-x-hidden">
            {AUDIBLE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setAudibleCat(c.id);
                  setSelAudible(null);
                }}
                className={`px-2.5 h-[21px] text-[11px] rounded-t-[4px] border border-b-0 transition-colors shrink-0 whitespace-nowrap ${
                  c.id === audibleCat
                    ? "bg-white text-[#2244cc] font-bold border-[#b9b6a8]"
                    : "bg-[#e6e3d5] text-[#666] border-[#cfccbc] hover:bg-[#efeee1]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* strip */}
          <div className="ym-scroll ym-scroll-thin flex gap-1 overflow-x-auto bg-white border border-[#b9b6a8] p-1">
            {(AUDIBLE_CATEGORIES.find((c) => c.id === audibleCat)?.items ?? []).map((a) => (
              <button
                key={a.name}
                title={`${a.name} — "${a.caption}"`}
                className="w-[64px] h-[62px] shrink-0 overflow-hidden flex flex-col items-center justify-center hover:bg-[#f3edfc] active:bg-[#e9def8] rounded-[2px]"
                onMouseEnter={(e) => (e.currentTarget.querySelector("video") as HTMLVideoElement | null)?.play().catch(() => {})}
                onMouseLeave={(e) => {
                  const v = e.currentTarget.querySelector("video") as HTMLVideoElement | null;
                  if (v) {
                    v.pause();
                    v.currentTime = 0;
                  }
                }}
                onClick={() => {
                  setSelAudible(a.caption);
                  push({ from: "me", audible: { name: a.name, caption: a.caption, src: a.src } });
                }}
              >
                <video src={a.src} preload="metadata" muted loop playsInline className="w-[58px] h-[44px] object-cover pointer-events-none" />
                <span className="text-[9px] text-[#555] truncate w-full text-center leading-[15px]">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Format bar (toggled by the T button) ---- */}
      {formatOpen && (
        <div className="bg-[#f1f0e3] border-t border-[#e0ddcd] px-2 py-[3px] flex items-center gap-1">
          <button
            className={`ym-tool-btn w-[22px] h-[20px] font-bold text-[12px] text-[#333] ${bold ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggle("bold")}
            title="Bold"
          >
            B
          </button>
          <button
            className={`ym-tool-btn w-[22px] h-[20px] italic font-serif text-[12px] text-[#333] ${italic ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggle("italic")}
            title="Italic"
          >
            I
          </button>
          <button
            className={`ym-tool-btn w-[22px] h-[20px] underline text-[12px] text-[#333] ${underline ? "active" : ""}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggle("underline")}
            title="Underline"
          >
            U
          </button>
          <span className="mx-0.5" title="Text colour">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="7" fill="none" stroke="#888" />
              <circle cx="6.5" cy="7" r="1.6" fill="#d03030" />
              <circle cx="11.5" cy="7" r="1.6" fill="#3060d0" />
              <circle cx="9" cy="11.5" r="1.6" fill="#e0b020" />
            </svg>
          </span>
          <select
            className="ym-input h-[20px] text-[11px] px-1 flex-1 max-w-[170px]"
            value={font}
            onChange={(e) => applyFont(e.target.value)}
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
          <select
            className="ym-input h-[20px] text-[11px] px-1 w-[48px]"
            value={fsize}
            onChange={(e) => applySize(Number(e.target.value))}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ---- Icon row ---- */}
      <div className="bg-[#f1f0e3] px-2 pb-1.5 flex items-center gap-1 relative">
        <button
          className={`ym-tool-btn w-[26px] h-[24px] flex items-center justify-center ${pickerOpen ? "active" : ""}`}
          title="Emoticons"
          onClick={() => setPickerOpen((v) => !v)}
        >
          <IconSmileySmall />
        </button>
        <button
          className={`ym-tool-btn w-[26px] h-[24px] flex items-center justify-center ${audiblesOpen ? "active" : ""}`}
          title="Audibles"
          onClick={() => setAudiblesOpen((v) => !v)}
        >
          <IconBubble />
        </button>
        <button
          className={`ym-tool-btn w-[26px] h-[24px] flex items-center justify-center font-serif font-bold text-[14px] text-[#444] ${formatOpen ? "active" : ""}`}
          title="Toggle text formatting"
          onClick={() => setFormatOpen((v) => !v)}
        >
          T
        </button>
        <button className="ym-tool-btn w-[26px] h-[24px] flex items-center justify-center" title="IMVironments" onClick={() => setImvMenu((v) => !v)}>
          <IconGearFlower />
        </button>
        <button className="ym-tool-btn w-[26px] h-[24px] flex items-center justify-center" title="Attach a file">
          <IconClip />
        </button>
        <button
          className="ym-tool-btn w-[26px] h-[24px] flex items-center justify-center"
          title="Send a BUZZ!!!"
          onClick={doBuzz}
        >
          <IconBuzz />
        </button>
        <div className="flex-1" />
        <button className="ym-tool-btn w-[26px] h-[24px] flex items-center justify-center" title="Invite a contact">
          <IconInvite />
        </button>

        {pickerOpen && (
          <div className="animate-pop absolute left-1 bottom-full mb-1 bg-[#efeee1] border border-[#8663cf] shadow-[3px_3px_10px_rgba(20,5,50,0.35)] p-1 z-40 w-[272px]">
            {/* pager header, like the original paged palette */}
            <div className="flex items-center justify-between px-0.5 pb-0.5 mb-[2px] border-b border-[#d5cfbe]">
              <span className="text-[10.5px] font-bold text-[#6a5a9a]">Emoticons</span>
              <div className="flex items-center gap-1">
                <button
                  className="ym-tool-btn w-[19px] h-[16px] flex items-center justify-center text-[9px] text-[#555] disabled:opacity-40"
                  title="Previous page"
                  disabled={emoPage === 0}
                  onClick={() => setEmoPage((pg) => Math.max(0, pg - 1))}
                >
                  ◀
                </button>
                <span className="text-[10px] text-[#777] tabular-nums">
                  {emoPage + 1} / {Math.ceil(EMO_PALETTE.length / EMO_PER_PAGE)}
                </span>
                <button
                  className="ym-tool-btn w-[19px] h-[16px] flex items-center justify-center text-[9px] text-[#555] disabled:opacity-40"
                  title="Next page"
                  disabled={emoPage >= Math.ceil(EMO_PALETTE.length / EMO_PER_PAGE) - 1}
                  onClick={() => setEmoPage((pg) => Math.min(Math.ceil(EMO_PALETTE.length / EMO_PER_PAGE) - 1, pg + 1))}
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="w-[270px]">
              {/* official Yahoo palette order — one slot per emoticon, each GIF at
                  its native 1:1 pixel size (wide GIFs grow their own cell) */}
              <div className="flex flex-wrap items-center content-start gap-[2px] w-[268px]">
                {EMO_PALETTE.slice(emoPage * EMO_PER_PAGE, emoPage * EMO_PER_PAGE + EMO_PER_PAGE).map((e) => (
                  <button
                    key={e.code}
                    className="min-w-[24px] min-h-[24px] px-[2px] py-[1px] shrink-0 hover:bg-white hover:outline hover:outline-1 hover:outline-[#b39ae0] rounded-[2px] flex items-center justify-center"
                    title={`${e.name}  ${e.code}`}
                    onClick={() => insertEmoticon(e.code)}
                  >
                    <Emoticon file={e.file} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---- Input ---- */}
      <div className="bg-[#f1f0e3] px-1.5 pb-1.5">
        <div className="ym-chat-pane relative">
          <div
            ref={editor}
            className="ym-editable ym-scroll min-h-[44px] max-h-[80px] overflow-y-auto px-2 py-1.5 pr-[74px] outline-none"
            style={{ fontFamily: font, fontSize: `${SIZE_PX[fsize] ?? 13}px` }}
            contentEditable
            data-placeholder=""
            onInput={() => setCanSend(!!editor.current?.textContent?.trim())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="ym-send absolute right-1.5 bottom-1.5 h-[26px] w-[64px] text-[12px]"
            disabled={!canSend}
            onClick={send}
          >
            Send
          </button>
        </div>
      </div>

      {/* ---- News ticker ---- */}
      <div className="bg-[#e9e7da] border-t border-[#cfccbc] h-[22px] flex items-center overflow-hidden">
        <span className="shrink-0 px-2 text-[10.5px] font-bold text-[#7b2fbd] tracking-wide border-r border-[#cfccbc] h-full flex items-center">
          NEWS
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-ticker inline-block text-[11px] text-[#333]">
            <span className="font-bold">ALP</span> {tickerText}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="font-bold">ALP</span> {tickerText}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function MessageVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  /* plays once, with voice, right after being sent (user-gesture window) */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    const t = window.setTimeout(() => v.play().catch(() => {}), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <button
      className="relative block cursor-pointer group"
      title={ended ? "Click to play again" : "Audible"}
      onClick={() => {
        const v = ref.current;
        if (!v) return;
        if (v.paused || ended) {
          v.currentTime = 0;
          setEnded(false);
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      }}
    >
      <video
        ref={ref}
        src={src}
        playsInline
        onEnded={() => setEnded(true)}
        className="block w-[120px] h-[90px] object-cover"
      />
      {ended && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="12" fill="rgba(255,255,255,0.9)" />
            <path d="M10 8 L19 13 L10 18 Z" fill="#5a3ca6" />
          </svg>
        </span>
      )}
    </button>
  );
}

function ToolBtn({
  icon,
  label,
  caret,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  caret?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-2.5 py-0.5 rounded hover:bg-[#e9e2f6] active:bg-[#ddd0f2] transition-colors group ${
        active ? "bg-[#e3d7f6]" : ""
      }`}
    >
      <span className="flex items-center gap-0.5">
        {icon}
        {caret && <span className="text-[8px] text-[#777] mt-2">▼</span>}
      </span>
      <span className="text-[10.5px] text-[#333] mt-0.5 group-hover:text-[#222]">{label}</span>
    </button>
  );
}
