import { useRef, useState } from "react";
import WindowFrame, { MenuDef } from "./WindowFrame";
import { SignInFace, YahooSmiley } from "./icons";
import { ME } from "../data/contacts";
import { loadOriginalPack } from "../utils/sounds";

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
  const [remember, setRemember] = useState(false);
  const [auto, setAuto] = useState(false);
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
    void loadOriginalPack(); // warm the original sound pack on this gesture
    /* let the wake-up animation play out before entering the desktop */
    timer.current = window.setTimeout(p.onSignIn, 2700);
  };

  const cancelSignIn = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setSigning(false);
  };

  return (
    <WindowFrame
      title="Yahoo! Messenger with Voice (BETA)"
      icon={<YahooSmiley size={16} />}
      x={p.x}
      y={p.y}
      width={p.width}
      height={p.height}
      minW={280}
      minH={470}
      smooth={p.smooth}
      z={p.z}
      focused={p.focused}
      menus={menus}
      onMove={p.onMove}
      onFocus={p.onFocus}
      onClose={p.onClose}
      onMinimize={p.onMinimize}
    >
      <div className="bg-[#f1f0e3] flex-1 min-h-0 px-6 py-6 flex flex-col items-center justify-center text-center">
        <div className={`mb-5 ${signing ? "animate-wake" : ""}`}>
          <SignInFace awake={signing} size={148} />
        </div>

        {signing ? (
          /* centred "signing in" state, like the original client */
          <div className="flex flex-col items-center gap-2 mt-2">
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
          <div className="w-full max-w-[198px] flex flex-col items-center">
            <div className="w-full text-left text-[11.5px] text-[#222] mb-[3px]">Yahoo! ID:</div>
            <input
              className="ym-input w-full h-[21px] px-1.5 mb-3 text-[12px]"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
            />

            <div className="w-full text-left text-[11.5px] text-[#222] mb-[3px]">Password:</div>
            <input
              type="password"
              className="ym-input w-full h-[21px] px-1.5 mb-4 text-[12px]"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSignIn()}
            />

            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#2244cc] text-[11.5px] hover:underline mb-4">
              Get a new Yahoo! ID...
            </a>

            <div className="flex flex-col items-start gap-[6px] w-full mb-5 text-left">
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

            <button className="ym-send h-[24px] px-6 text-[11.5px] text-[#4a4a4a]" onClick={doSignIn}>
              Sign In
            </button>

            <a href="#" onClick={(e) => e.preventDefault()} className="mt-7 text-[#2244cc] text-[11.5px] hover:underline">
              Forgot your password?
            </a>
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
