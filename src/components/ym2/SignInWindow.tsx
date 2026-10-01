"use client";

import { useRef, useState } from "react";
import WindowFrame, { MenuDef } from "./WindowFrame";
import { SignInLogo, YahooSmiley } from "./icons";
import { ME } from "./data";
import { playLoginOriginal } from "./sounds";

/* languages shown in the original sign-in window, English (U.S.) default */
const LANGUAGES = [
  "Deutsch (Deutschland)",
  "English (U.K.)",
  "English (U.S.)",
  "español (Argentina)",
  "español (España)",
  "español (México)",
  "español (Estados Unidos)",
  "français (France)",
  "Bahasa Indonesia (Indonesia)",
  "italiano (Italia)",
  "Korean (South Korea)",
  "português (Brasil)",
  "Thai (Thailand)",
  "Vietnamese (Vietnam)",
  "Chinese (Hong Kong)",
  "Chinese (Taiwan)",
];

interface Props {
  x: number;
  y: number;
  z: number;
  focused: boolean;
  width: number;
  height: number;
  smooth?: boolean;
  onMove: (x: number, y: number) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function SignInWindow(p: Props) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [lang, setLang] = useState("English (U.S.)");
  const [remember, setRemember] = useState(true);
  const [auto, setAuto] = useState(true);
  const [invisible, setInvisible] = useState(false);
  const [signing, setSigning] = useState(false);
  const timer = useRef<number | null>(null);

  const menus: MenuDef[] = [
    {
      label: "Messenger",
      items: [
        { label: "Sign In", onClick: () => doSignIn() },
        { sep: true },
        { label: "Preferences...", onClick: () => {} },
        { sep: true },
        { label: "Exit", onClick: p.onClose },
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

  const doSignIn = () => {
    if (signing) return;
    setSigning(true);
    void playLoginOriginal(); // warm & play the original "yahoo_online" sound on this user gesture
    timer.current = window.setTimeout(p.onSignIn, 2100);
  };

  const cancelSignIn = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setSigning(false);
  };

  return (
    <WindowFrame
      title="Yahoo! Messenger"
      icon={<YahooSmiley size={16} />}
      x={p.x}
      y={p.y}
      width={p.width}
      height={p.height}
      minW={280}
      minH={500}
      smooth={p.smooth}
      z={p.z}
      focused={p.focused}
      menus={menus}
      onMove={p.onMove}
      onFocus={p.onFocus}
      onClose={p.onClose}
      onMinimize={p.onMinimize}
    >
      <div className="bg-[#f1f0e3] flex-1 min-h-0 flex flex-col items-center px-6 pt-4 pb-3 overflow-y-auto ym-scroll">
        {/* ---- the real YM9 branding: purple serif Y! + chrome smiley marble ---- */}
        <div className={`relative ${signing ? "animate-wake" : ""}`}>
          {signing && (
            <div
              className="signin-glow absolute rounded-full"
              style={{
                inset: "-14px",
                background: "radial-gradient(closest-side, rgba(150,110,230,0.35), transparent)",
              }}
            />
          )}
          <div className="relative">
            <SignInLogo width={180} signing={signing} />
          </div>
        </div>

        {signing ? (
          /* centred "signing in" state, like the original client */
          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="text-[12.5px] font-bold text-[#222]">Signing in as</div>
            <div className="text-[13px] text-[#333]">{ME.name}</div>
            <div className="text-[11px] text-[#777]">
              {invisible ? "(Invisible to Everyone)" : "(Available)"}
            </div>
            <button className="xp-btn mt-2 h-[24px] px-6 text-[11.5px] text-[#333]" onClick={cancelSignIn}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[200px] flex flex-col flex-1">
            <div className="w-full text-left text-[11.5px] text-[#222] mb-[3px] mt-2">Yahoo! ID:</div>
            <input
              className="ym-input w-full h-[21px] px-1.5 mb-2.5 text-[12px]"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
            />

            <div className="w-full text-left text-[11.5px] text-[#222] mb-[3px]">Password:</div>
            <input
              type="password"
              className="ym-input w-full h-[21px] px-1.5 mb-3 text-[12px]"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSignIn()}
            />

            <div className="flex flex-col items-start gap-[6px] w-full mb-3 text-left">
              <label className="flex items-center gap-[6px] text-[11.5px] cursor-pointer leading-none">
                <input type="checkbox" className="ym-check" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember my ID &amp; password
              </label>
              <label className="flex items-center gap-[6px] text-[11.5px] cursor-pointer leading-none">
                <input type="checkbox" className="ym-check" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
                Sign in automatically
              </label>
              <label className="flex items-center gap-[6px] text-[11.5px] cursor-pointer leading-none">
                <input type="checkbox" className="ym-check" checked={invisible} onChange={(e) => setInvisible(e.target.checked)} />
                Sign in as invisible to everyone
              </label>
            </div>

            <button className="ym-send h-[25px] w-[112px] mx-auto text-[12px] text-[#3c3c3c]" onClick={doSignIn}>
              Sign In
            </button>

            <div className="w-full text-left text-[11.5px] text-[#222] mb-[3px] mt-2.5">Idioma:</div>
            <select
              className="w-full h-[21px] text-[12px] bg-white border border-[#8e8b7a] rounded-[2px] px-0.5 outline-none"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <div className="flex-1" />

            <div className="flex flex-col items-center gap-1 pt-2.5 pb-0.5">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#2244cc] text-[11.5px] hover:underline">
                Get a new Yahoo! ID...
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#2244cc] text-[11.5px] hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
