import React from "react";

/* ---------- Window controls ---------- */
export const IconMin = () => (
  <svg width="9" height="9" viewBox="0 0 9 9">
    <rect x="1" y="6.5" width="7" height="2" fill="#fff" />
  </svg>
);
export const IconMax = () => (
  <svg width="9" height="9" viewBox="0 0 9 9">
    <rect x="0.75" y="0.75" width="7.5" height="7.5" fill="none" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
export const IconClose = () => (
  <svg width="9" height="9" viewBox="0 0 9 9">
    <path d="M1 1 L8 8 M8 1 L1 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ---------- Status dots ---------- */
export type { StatusKind } from "./data";

const yellowDot = (pulse: boolean) => (
  <span
    className={`inline-block w-[13px] h-[13px] rounded-full shrink-0 ${pulse ? "status-pulse" : ""}`}
    style={{
      background: "radial-gradient(circle at 35% 30%, #fff6b0, #ffd92e 45%, #f0ad00 90%)",
      border: "1px solid #c98f00",
    }}
  />
);
const greyDot = () => (
  <span
    className="inline-block w-[13px] h-[13px] rounded-full shrink-0"
    style={{ background: "radial-gradient(circle at 35% 30%, #eee, #b9b9b9 60%, #9a9a9a)", border: "1px solid #7d7d7d" }}
  />
);
const redDot = (minus: boolean) => (
  <span
    className="inline-block w-[13px] h-[13px] rounded-full shrink-0 relative"
    style={{ background: "radial-gradient(circle at 35% 30%, #ffb0a8, #e8524a 50%, #c9332b 90%)", border: "1px solid #a0241d" }}
  >
    {minus && <span className="absolute left-[2px] right-[2px] top-[5px] h-[2px] bg-white rounded" />}
  </span>
);

export const StatusDot = ({ status, pulse = false }: { status: string; pulse?: boolean }) => {
  switch (status) {
    case "available":
    case "brb":
    case "phone":
    case "lunch":
      return yellowDot(pulse);
    case "busy":
      return redDot(false);
    case "steppedout":
      return redDot(true);
    default:
      return greyDot();
  }
};

/* ---------- IMVironment glyphs ---------- */
export const HeartGlyph = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <path
      d="M10 17 C4 12 2 8.5 2 6 C2 3.5 4 2 6 2 C7.8 2 9.2 3 10 4.4 C10.8 3 12.2 2 14 2 C16 2 18 3.5 18 6 C18 8.5 16 12 10 17 Z"
      fill="#e8386a"
      stroke="#a81848"
      strokeWidth="0.8"
    />
    <ellipse cx="6.6" cy="5.6" rx="1.8" ry="1.2" fill="#fff" opacity="0.5" transform="rotate(-20 6.6 5.6)" />
  </svg>
);

export const LeafGlyph = ({ size = 14, hue = 24 }: { size?: number; hue?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <path
      d="M3 17 C3 8 9 3 17 3 C17 11 12 17 4 17 Z"
      fill={`hsl(${hue} 75% 45%)`}
      stroke={`hsl(${hue} 70% 30%)`}
      strokeWidth="0.7"
    />
    <path d="M4.5 15.5 C8 12 12 8 15.5 4.5" fill="none" stroke={`hsl(${hue} 60% 28%)`} strokeWidth="0.7" />
  </svg>
);

/* ---------- Luv IMVironment watermark: big glossy heart ---------- */
export const GlossyHeart = ({ size = 210 }: { size?: number }) => (
  <svg width={size} height={size * 0.88} viewBox="0 0 200 176" className="block">
    <defs>
      <radialGradient id="glh" cx="0.38" cy="0.3" r="0.95">
        <stop offset="0" stopColor="#ffd3e0" />
        <stop offset="0.45" stopColor="#ffabc4" />
        <stop offset="0.8" stopColor="#f985a8" />
        <stop offset="1" stopColor="#ef6c93" />
      </radialGradient>
    </defs>
    <path
      d="M100 168 C36 120 8 84 8 52 C8 26 28 8 52 8 C72 8 90 20 100 38 C110 20 128 8 148 8 C172 8 192 26 192 52 C192 84 164 120 100 168 Z"
      fill="url(#glh)"
    />
    <ellipse cx="66" cy="42" rx="26" ry="15" fill="#fff" opacity="0.45" transform="rotate(-22 66 42)" />
    <ellipse cx="56" cy="34" rx="9" ry="5" fill="#fff" opacity="0.7" transform="rotate(-22 56 34)" />
    <path d="M64 84 c-7-9 3-16 8-10 l2 3 2-3 c5-6 15 1 8 10 l-10 11 z" fill="#e0486f" opacity="0.85" />
    <path d="M126 92 c-6-8 3-14 7-9 l2 2 2-2 c4-5 13 1 7 9 l-9 10 z" fill="#e0486f" opacity="0.8" />
  </svg>
);

/* ---------- The classic red lipstick kiss stamp ---------- */
export const BigKiss = ({ size = 240 }: { size?: number }) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 220 150" className="block">
    <defs>
      <linearGradient id="lipg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d92645" />
        <stop offset="0.5" stopColor="#c01834" />
        <stop offset="1" stopColor="#9e0f28" />
      </linearGradient>
      <clipPath id="lipclip">
        <path d="M12 74 C30 40 68 36 94 54 C102 62 118 62 126 54 C152 36 190 40 208 74 C196 110 160 130 110 130 C60 130 24 110 12 74 Z" />
      </clipPath>
    </defs>
    <g transform="rotate(-4 110 75)">
      <path
        d="M12 74 C30 40 68 36 94 54 C102 62 118 62 126 54 C152 36 190 40 208 74 C196 110 160 130 110 130 C60 130 24 110 12 74 Z"
        fill="url(#lipg)"
      />
      <g clipPath="url(#lipclip)" stroke="#7d0a1e" strokeWidth="1.6" opacity="0.5">
        {Array.from({ length: 17 }).map((_, i) => {
          const x = 22 + i * 11;
          const top = 52 + Math.abs(i - 8) * 1.6;
          const bot = 128 - Math.abs(i - 8) * 2.2;
          return <line key={i} x1={x} y1={top} x2={x + (i - 8) * 1.4} y2={bot} />;
        })}
      </g>
      <path d="M14 74 C60 82 160 82 206 74" fill="none" stroke="#6d0818" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
      <path d="M94 54 C102 62 118 62 126 54" fill="none" stroke="#6d0818" strokeWidth="2" opacity="0.5" />
      <ellipse cx="70" cy="104" rx="22" ry="8" fill="#fff" opacity="0.18" transform="rotate(6 70 104)" />
      <ellipse cx="150" cy="100" rx="16" ry="6" fill="#fff" opacity="0.14" transform="rotate(-5 150 100)" />
      <ellipse cx="58" cy="50" rx="12" ry="5" fill="#fff" opacity="0.3" transform="rotate(-18 58 50)" />
    </g>
  </svg>
);

export const KissMark = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 44 36">
    <g fill="#d81f4f" opacity="0.92">
      <path d="M4 14 C6 8 12 6 16 8 C18 9 19 11 19 13 C19 11 20 9 22 8 C26 6 32 8 34 14 C35 18 32 21 28 21 L10 21 C6 21 3 18 4 14 Z" />
      <path d="M8 24 C12 22 16 23 19 25 C22 23 26 22 30 24 C32 25 32 28 30 29 C26 31 22 30 19 28 C16 30 12 31 8 29 C6 28 6 25 8 24 Z" />
      <ellipse cx="7" cy="12" rx="2.4" ry="3.4" transform="rotate(-24 7 12)" />
      <ellipse cx="31" cy="12" rx="2.4" ry="3.4" transform="rotate(24 31 12)" />
    </g>
    <ellipse cx="14" cy="11" rx="2.6" ry="1.4" fill="#fff" opacity="0.35" transform="rotate(-18 14 11)" />
  </svg>
);

/* ---------- Title bar smiley (real Yahoo happy.gif — local) ---------- */
export const EMO_GIF = (file: string) => `/assets/emoticons/${file}.gif`;

export const YahooSmiley = ({ size = 16 }: { size?: number }) => (
  <img src={EMO_GIF("happy")} width={size} height={size} alt="" draggable={false} className="inline-block shrink-0" />
);

/* ---------- Authentic Yahoo! Messenger emoticons — 118 ORIGINAL GIFs,
   recovered from Yahoo's CDN, mapped to their official shortcuts.
   Served locally from /public/assets/emoticons. ---------- */
export interface Emo {
  code: string;
  name: string;
  file: string;
}

const RAW: [string, string, string[]][] = [
  ["happy", "happy.gif", [":)", ":-)"]],
  ["sad", "sad.gif", [":(", ":-("]],
  ["winking", "winking.gif", [";)", ";-)"]],
  ["big grin", "big-grin.gif", [":D", ":-D"]],
  ["batting eyelashes", "batting-eyelashes.gif", [";;)"]],
  ["big hug", "big-hug.gif", [">:D<"]],
  ["confused", "confused.gif", [":-/", ":/"]],
  ["love struck", "love-struck.gif", [":x", ":X"]],
  ["love", "love-struck.gif", ["<3"]],
  ["blushing", "blushing.gif", [':">']],
  ["tongue", "tongue.gif", [":P", ":p"]],
  ["kiss", "kiss.gif", [":-*", ":*"]],
  ["broken heart", "broken-heart.gif", ["=(("]],
  ["surprise", "surprise.gif", [":-O", ":O", ":-o"]],
  ["angry", "angry.gif", ["X(", "x("]],
  ["smug", "smug.gif", [":>", ":->"]],
  ["cool", "cool.gif", ["B-)", "B)"]],
  ["worried", "worried.gif", [":-S", ":-s"]],
  ["whew", "whew.gif", ["#:-S"]],
  ["devil", "devil.gif", [">:)"]],
  ["crying", "crying.gif", [":-((", ":(("]],
  ["laughing", "laughing.gif", [":))"]],
  ["straight face", "straight-face.gif", [":|", ":-|"]],
  ["raised eyebrows", "raised-eyebrows.gif", ["/:)"]],
  ["rolling on the floor", "rolling-on-the-floor.gif", ["=))"]],
  ["angel", "angel.gif", ["O:-)", "O:)"]],
  ["nerd", "nerd.gif", [":-B", ":-b"]],
  ["talk to the hand", "talk-to-the-hand.gif", ["=;"]],
  ["sleepy", "sleepy.gif", ["I-)", "|-)"]],
  ["rolling eyes", "rolling-eyes.gif", ["8-|", "8|"]],
  ["loser", "loser.gif", ["L-)", "L)"]],
  ["sick", "sick.gif", [":-&", ":&"]],
  ["don't tell anyone", "dont-tell-anyone.gif", [":-$", ":$"]],
  ["no talking", "no-talking.gif", ["[-("]],
  ["clown", "clown.gif", [":O)", ":o)"]],
  ["silly", "silly.gif", ["8-}"]],
  ["party", "party.gif", ["<:-)"]],
  ["yawn", "yawn.gif", ["(:|"]],
  ["drooling", "drooling.gif", ["=P~"]],
  ["thinking", "thinking.gif", [":-?"]],
  ["applause", "applause.gif", ["=D>"]],
  ["nail biting", "nail-biting.gif", [":-SS", ":SS"]],
  ["hypnotized", "hypnotized.gif", ["@-)"]],
  ["liar", "liar.gif", [":^o"]],
  ["waiting", "waiting.gif", [":-w", ":-W"]],
  ["sigh", "sigh.gif", [":-<"]],
  ["phbbbbt", "phbbbbt.gif", [">:P"]],
  ["cowboy", "cowboy.gif", ["<):)"]],
  ["pig", "pig.gif", [":@)"]],
  ["cow", "cow.gif", ["3:-O"]],
  ["monkey", "monkey.gif", [":(|)"]],
  ["chicken", "chicken.gif", ["~:>"]],
  ["rose", "rose.gif", ["@};-", "@}--;-", "@};"]],
  ["good luck", "good-luck.gif", ["%%-"]],
  ["flag", "flag.gif", ["**=="]],
  ["pumpkin", "pumpkin.gif", ["(~~)"]],
  ["coffee", "coffee.gif", ["~O)"]],
  ["idea", "idea.gif", ["*-:)"]],
  ["skull", "skull.gif", ["8-X"]],
  ["bug", "bug.gif", ["=:)"]],
  ["alien", "alien.gif", [">-)"]],
  ["frustrated", "frustrated.gif", [":-L"]],
  ["praying", "praying.gif", ["[-o<"]],
  ["money eyes", "money-eyes.gif", ["$-)"]],
  ["whistling", "whistling.gif", [':-"']],
  ["feeling beat up", "feeling-beat-up.gif", ["b-("]],
  ["peace sign", "peace-sign.gif", [":)>-"]],
  ["shame on you", "shame-on-you.gif", ["[-X"]],
  ["dancing", "dancing.gif", ["\\:D/"]],
  ["bring it on", "bring-it-on.gif", [">:/", ">:D/"]],
  ["hee hee", "hee-hee.gif", [";))"]],
  ["hiro", "hiro.gif", ["o->"]],
  ["billy", "billy.gif", ["o=>"]],
  ["april", "april.gif", ["o-+"]],
  ["chatterbox", "chatterbox.gif", [":-<|"]],
  ["not worthy", "not-worthy.gif", ["^:)^"]],
  ["oh go on", "oh-go-on.gif", [":-j"]],
  ["star", "star.gif", ["(*)"]],
  ["on the phone", "on-the-phone.gif", [":)]"]],
  ["call me", "call-me.gif", [":-c"]],
  ["at wits' end", "at-wits-end.gif", ["~X("]],
  ["wave", "wave.gif", [":h", ":->h"]],
  ["time out", "time-out.gif", [":t"]],
  ["day dreaming", "day-dreaming.gif", ["8->"]],
  ["i don't know", "i-dont-know.gif", [":??"]],
  ["not listening", "not-listening.gif", ["%(", "%(-("]],
  ["puppy dog eyes", "puppy-dog-eyes.gif", [":o3"]],
  ["i don't want to see", "i-dont-want-to-see.gif", ["X_X"]],
  ["hurry up!", "hurry-up.gif", [":!!"]],
  ["rock on!", "rock-on.gif", ["\\m/"]],
  ["thumbs down", "thumbs-down.gif", [":q"]],
  ["thumbs up", "thumbs-up.gif", [":bd"]],
  ["it wasn't me", "it-wasnt-me.gif", ["^#(^"]],
  ["bee", "bee.gif", [":bz"]],
  ["cheer", "cheer.gif", ["~^o^~"]],
  ["dizzy", "dizzy.gif", ["@^@|||"]],
  ["cook", "cook.gif", ["[]"]],
  ["eat", "eat.gif", ["^o^||3"]],
  ["give up", "give-up.gif", [":(||>"]],
  ["cold", "cold.gif", ["+_+"]],
  ["hot", "hot.gif", [":::^^:::"]],
  ["music", "music.gif", ["o|^_^|o"]],
  ["vomit", "vomit.gif", [":puke!", ":puke"]],
  ["sing", "sing.gif", ["o|\\~"]],
  ["catch", "catch.gif", ["o|:)"]],
  ["fight", "fight.gif", [":(fight)"]],
  ["down on luck", "down-on-luck.gif", ["%*{"]],
  ["unlucky", "unlucky.gif", ["%||:{"]],
  ["gift", "gift.gif", ["&[]"]],
  ["tv", "tv.gif", [":(tv)"]],
  ["studying", "studying.gif", ["?@_@?"]],
  ["spooky", "spooky.gif", [":>~~"]],
  ["search me", "search-me.gif", ["@@"]],
  ["game", "game.gif", [":(game)"]],
  ["high five", "high-five.gif", [":)/\\:)"]],
  ["exercise", "exercise.gif", ["[]==[]"]],
  ["pirate", "pirate.gif", [":ar!"]],
  ["transformer", "transformer.gif", ["[..]"]],
  ["doh", "doh.gif", ["#-o", "#o"]],
];

/* flatten, de-dupe, and sort longest-code-first so :(( wins over :( etc. */
const seen = new Set<string>();
export const EMO: Emo[] = RAW.flatMap(([name, file, codes]) =>
  codes.map((code) => ({ code, name, file: file.replace(/\.gif$/, "") })),
)
  .filter((e) => (seen.has(e.code) ? false : (seen.add(e.code), true)))
  .sort((a, b) => b.code.length - a.code.length);

/* Emoticons always render at their native pixel size — never scaled. */
export const Emoticon = ({ file, white = false }: { file: string; white?: boolean }) => (
  <img
    src={EMO_GIF(file)}
    alt={file}
    draggable={false}
    className="inline-block align-[-4px]"
    style={{
      imageRendering: "pixelated",
      ...(white ? { filter: "grayscale(1) brightness(1.75) contrast(0.82)" } : null),
    }}
  />
);

/* ---------- Curvy translucent decoration for accent areas ---------- */
export const Swirls = ({ tint = "light", className = "" }: { tint?: "light" | "purple"; className?: string }) => {
  const stroke = tint === "light" ? "rgba(122, 87, 198, 0.18)" : "rgba(255, 255, 255, 0.16)";
  const stroke2 = tint === "light" ? "rgba(90, 120, 220, 0.14)" : "rgba(190, 220, 255, 0.13)";
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 400 100" preserveAspectRatio="none">
      <path d="M-20 78 C60 40 120 96 200 62 C280 28 330 84 420 46" fill="none" stroke={stroke} strokeWidth="2.4" />
      <path d="M-20 92 C70 60 140 110 230 74 C310 42 360 92 420 60" fill="none" stroke={stroke2} strokeWidth="1.6" />
      <path d="M250 -12 C300 30 350 6 420 34" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="352" cy="30" r="26" fill="none" stroke={stroke2} strokeWidth="1.4" />
      <circle cx="352" cy="30" r="15" fill="none" stroke={stroke} strokeWidth="1" />
    </svg>
  );
};

/* ---------- Buzz button icon ---------- */
export const IconBuzz = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M9 1 L10.6 6.4 L16 5 L12 9 L16 13 L10.6 11.6 L9 17 L7.4 11.6 L2 13 L6 9 L2 5 L7.4 6.4 Z" fill="#e8a020" stroke="#8a5a00" strokeWidth="0.7" />
    <path d="M9.8 4.5 L7.6 9.4 h2 l-1 4 L12 8.2 h-2 z" fill="#fff" opacity="0.9" />
  </svg>
);

export function emojify(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    let earliest = -1;
    let matched: Emo | null = null;
    for (const e of EMO) {
      const i = rest.indexOf(e.code);
      if (i !== -1 && (earliest === -1 || i < earliest || (i === earliest && matched && e.code.length > matched.code.length))) {
        earliest = i;
        matched = e;
      }
    }
    if (!matched || earliest === -1) {
      nodes.push(rest);
      break;
    }
    if (earliest > 0) nodes.push(rest.slice(0, earliest));
    nodes.push(<Emoticon key={key++} file={matched.file} />);
    rest = rest.slice(earliest + matched.code.length);
  }
  return nodes;
}

/* Replace emoticon codes inside a rich-HTML string without touching tags.
   EMO is sorted longest-first, so :(( is replaced before :( can bite it. */
export function emojifyHtml(html: string): string {
  return html
    .split(/(<[^>]*>)/g)
    .map((seg) => {
      if (seg.startsWith("<")) return seg;
      let out = seg.replace(/&lt;3/g, `<img src="${EMO_GIF("love-struck")}" class="inline-block align-[-4px]">`);
      for (const e of EMO) {
        if (e.code.includes("<") || e.code.includes(">")) continue;
        if (!out.includes(e.code)) continue;
        out = out.split(e.code).join(`<img src="${EMO_GIF(e.file)}" class="inline-block align-[-4px]" alt="${e.name}">`);
      }
      return out;
    })
    .join("");
}

/* ---------- Toolbar: calls & extras ---------- */
export const IconVideoCam = () => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <defs>
      <linearGradient id="vcg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a8a8a" />
        <stop offset="0.5" stopColor="#4a4a4a" />
        <stop offset="1" stopColor="#6e6e6e" />
      </linearGradient>
    </defs>
    <circle cx="13" cy="10" r="7.5" fill="url(#vcg)" stroke="#2f2f2f" />
    <circle cx="13" cy="10" r="4.6" fill="#1c1c1c" />
    <circle cx="13" cy="10" r="2.6" fill="#3f6fd8" />
    <circle cx="11.8" cy="8.8" r="1" fill="#bcd2ff" />
    <path d="M10 17.5 h6 l1.2 4 h-8.4 z" fill="#7a7a7a" stroke="#3a3a3a" strokeWidth="0.6" />
    <rect x="7" y="21.5" width="12" height="1.8" rx="0.9" fill="#5c5c5c" />
  </svg>
);

export const IconMic = () => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <defs>
      <linearGradient id="mg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9a9a9a" />
        <stop offset="0.5" stopColor="#e2e2e2" />
        <stop offset="1" stopColor="#7c7c7c" />
      </linearGradient>
    </defs>
    <rect x="9.5" y="2.5" width="7" height="12" rx="3.5" fill="url(#mg)" stroke="#4a4a4a" strokeWidth="0.7" />
    <path d="M7 11 a6 6 0 0 0 12 0" fill="none" stroke="#4a4a4a" strokeWidth="1.6" />
    <path d="M13 17 v3.5 M9.5 21.5 h7" stroke="#4a4a4a" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconImviron = () => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <path
      d="M13 2 L15 10 L23 8 L17 13 L24 17 L15.5 15.5 L14 24 L11.5 15.5 L3 18 L9 13 L3 8.5 L11 10 Z"
      fill="#8a8a8a"
      stroke="#3f3f3f"
      strokeWidth="0.7"
    />
    <circle cx="13" cy="13" r="2.4" fill="#5c5c5c" />
  </svg>
);

export const IconKnight = () => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <path
      d="M8 21.5 h10 v-1.6 c0-.6-.4-1-1-1 h-.6 c.2-3.2-.6-5.4-2.3-7.2 l2.6-4.4 c.4-.8 0-1.7-.9-2 L14.6 3.4 c-.3-.6-1-.8-1.5-.4 l-.8.7 -.7-.9 c-.4-.5-1.2-.4-1.5.2 l-.5 1 c-2.5 1.5-3.8 4-3.8 7 l-1.4 1.7 c-.3.4-.1 1 .4 1.1 l1-.1 c.5-.1 1 .2 1.1.7 z"
      fill="#8f8f8f"
      stroke="#404040"
      strokeWidth="0.8"
    />
    <circle cx="11.4" cy="7" r="0.9" fill="#2c2c2c" />
    <rect x="6.6" y="21.5" width="12.8" height="1.8" rx="0.6" fill="#6a6a6a" />
  </svg>
);

export const IconPhotos = () => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <rect x="3" y="4.5" width="20" height="17" rx="1.5" fill="#8f8f8f" stroke="#3f3f3f" strokeWidth="0.8" />
    <rect x="5" y="6.5" width="16" height="13" fill="#e8e8e8" />
    <circle cx="10" cy="11" r="2.4" fill="#6a6a6a" />
    <circle cx="16.4" cy="11.4" r="2" fill="#8a8a8a" />
    <path d="M6.5 19 c.6-3 2.2-4.4 3.5-4.4 s2.9 1.4 3.5 4.4 z" fill="#6a6a6a" />
    <path d="M13.6 19 c.5-2.4 1.7-3.6 2.8-3.6 s2.3 1.2 2.8 3.6 z" fill="#8a8a8a" />
  </svg>
);

/* ---------- Small toolbar icons (chat) ---------- */
export const IconSmileySmall = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <circle cx="9" cy="9" r="7.4" fill="none" stroke="#5a5a5a" strokeWidth="1.4" />
    <circle cx="6.4" cy="7.2" r="1" fill="#5a5a5a" />
    <circle cx="11.6" cy="7.2" r="1" fill="#5a5a5a" />
    <path d="M5.6 10.6 Q9 13.6 12.4 10.6" stroke="#5a5a5a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);
export const IconBubble = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M2 3.5 h14 v8 h-8 l-3.5 3 v-3 h-2.5 z" fill="none" stroke="#5a5a5a" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5 6.5 h8 M5 8.8 h5" stroke="#5a5a5a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
export const IconGearFlower = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <ellipse key={a} cx="9" cy="4.2" rx="1.7" ry="2.6" fill="none" stroke="#5a5a5a" strokeWidth="1" transform={`rotate(${a} 9 9)`} />
    ))}
    <circle cx="9" cy="9" r="2" fill="#5a5a5a" />
  </svg>
);
export const IconClip = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M6.5 8.5 l5-5 a2.6 2.6 0 0 1 3.7 3.7 l-6.8 6.8 a4 4 0 0 1 -5.7 -5.7 l6.6-6.5"
      fill="none"
      stroke="#5a5a5a"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);
export const IconInvite = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <circle cx="7" cy="6" r="3" fill="none" stroke="#5a5a5a" strokeWidth="1.4" />
    <path d="M2.5 15 c.7-3.6 2.6-5.2 4.5-5.2 s3.8 1.6 4.5 5.2" fill="none" stroke="#5a5a5a" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M13.5 6.5 h3 M15 5 v3" stroke="#5a5a5a" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/* ---------- Profile row icons ---------- */
export const IconPcPhone = () => (
  <svg width="20" height="16" viewBox="0 0 20 16">
    <rect x="1" y="2" width="11" height="8" rx="1" fill="none" stroke="#6a6a6a" strokeWidth="1.3" />
    <path d="M4.5 12.5 h4 M6.5 10 v2.5" stroke="#6a6a6a" strokeWidth="1.3" />
    <path d="M14 5.5 c1.2-1 2.8-1 4 0 l-1 1.4 c-.6-.5-1.4-.5-2 0 z" fill="#6a6a6a" />
    <rect x="15.2" y="7" width="1.6" height="5" rx="0.8" fill="#6a6a6a" />
  </svg>
);
export const IconHandset = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path
      d="M3.2 2.4 c-.8.8-1 2-.5 3.4 1 2.8 3.7 5.5 6.5 6.5 1.4.5 2.6.3 3.4-.5 l.9-.9 c.4-.4.3-1-.1-1.3 l-2-1.3 c-.4-.3-.9-.2-1.2.1 l-.7.7 c-1.3-.7-2.6-2-3.3-3.3 l.7-.7 c.3-.3.4-.8.1-1.2 l-1.3-2 c-.3-.4-.9-.5-1.3-.1 z"
      fill="#6a6a6a"
    />
  </svg>
);
export const IconMail = () => (
  <svg width="18" height="14" viewBox="0 0 18 14">
    <rect x="1" y="1.5" width="16" height="11" rx="1" fill="none" stroke="#6a6a6a" strokeWidth="1.3" />
    <path d="M1.5 2.5 L9 8 L16.5 2.5" fill="none" stroke="#6a6a6a" strokeWidth="1.3" />
  </svg>
);
export const IconSearchList = () => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path d="M2 2.5 h10 M2 5.5 h10 M2 8.5 h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10.5 9 l2.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ---------- Badges ---------- */
export const BadgeCrown = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" className="inline-block align-[-1px]">
    <path d="M1.5 9.5 L1 3.5 l3 2.5 L7 2 l3 4 l3-2.5 -.5 6 z" fill="#b9b9b9" stroke="#6e6e6e" strokeWidth="0.7" />
    <rect x="1.5" y="9.5" width="11" height="1.6" fill="#8f8f8f" />
  </svg>
);
export const BadgeTrophy = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" className="inline-block align-[-1px]">
    <path d="M3.5 1.5 h6 v2.5 a3 3 0 0 1 -6 0 z" fill="#a9a9a9" stroke="#5f5f5f" strokeWidth="0.7" />
    <path d="M3.5 2 H1.5 a2 2 0 0 0 2.2 2.6 M9.5 2 h2 a2 2 0 0 1 -2.2 2.6" fill="none" stroke="#5f5f5f" strokeWidth="0.8" />
    <path d="M6.5 7 v2 M4.8 10.8 h3.4 l-.4-1.8 h-2.6 z" fill="#8f8f8f" stroke="#5f5f5f" strokeWidth="0.6" />
  </svg>
);
export const BadgeMusic = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" className="inline-block align-[-2px]">
    <path d="M5 10 V3 l6-1.5 V8" fill="none" stroke="#3355cc" strokeWidth="1.4" />
    <circle cx="3.6" cy="10" r="1.8" fill="#3355cc" />
    <circle cx="9.6" cy="8" r="1.8" fill="#3355cc" />
  </svg>
);
export const BadgeMobile = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" className="inline-block align-[-2px]">
    <rect x="1.5" y="1" width="8" height="12" rx="1.4" fill="none" stroke="#5a35c8" strokeWidth="1.3" />
    <rect x="3" y="3" width="5" height="5" fill="#5a35c8" opacity="0.5" />
    <circle cx="5.5" cy="10.8" r="0.9" fill="#5a35c8" />
  </svg>
);

/* ---------- Misc ---------- */
export const IconPlus = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <path d="M6 1.5 v9 M1.5 6 h9" stroke="#5a5a5a" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const IconChevron = ({ dir = "down" }: { dir?: "down" | "up" | "right" }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    className="inline-block"
    style={{ transform: dir === "up" ? "rotate(180deg)" : dir === "right" ? "rotate(-90deg)" : undefined }}
  >
    <path d="M1.5 3 L5 7 L8.5 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const IconArrowGo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M2 8 h9 M8 3.5 L13 8 L8 12.5" fill="none" stroke="#3a3a3a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- The crisp white sidebar face ---------- */
export const WhiteFace = ({ size = 96 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-[0_1px_2px_rgba(90,70,140,0.25)]">
    <ellipse cx="36" cy="37" rx="6.5" ry="7.5" fill="#fff" />
    <ellipse cx="64" cy="37" rx="6.5" ry="7.5" fill="#fff" />
    <path d="M27 57 A 23 21 0 0 0 73 57 Z" fill="#fff" />
  </svg>
);

/* ---------- Sign-in sleeper: big Y! mark with the round buddy nestled at its
   lower right (like the Voice coin in the original), grey asleep → yellow awake ---------- */
export const SignInFace = ({ awake, size = 150 }: { awake: boolean; size?: number }) => (
  <svg width={size} height={size * (132 / 172)} viewBox="0 0 172 132" className="block overflow-visible">
    <defs>
      <radialGradient id="faceGrey" cx="0.36" cy="0.28" r="0.95">
        <stop offset="0" stopColor="#fdfdfd" />
        <stop offset="0.45" stopColor="#d4d4d4" />
        <stop offset="0.8" stopColor="#a4a4a4" />
        <stop offset="1" stopColor="#808080" />
      </radialGradient>
      <radialGradient id="faceYellow" cx="0.36" cy="0.28" r="0.95">
        <stop offset="0" stopColor="#fffbd6" />
        <stop offset="0.38" stopColor="#ffe14d" />
        <stop offset="0.78" stopColor="#f6bb00" />
        <stop offset="1" stopColor="#d99a00" />
      </radialGradient>
      <radialGradient id="yOval" cx="0.4" cy="0.3" r="1">
        <stop offset="0" stopColor="#9a55e0" />
        <stop offset="0.6" stopColor="#7b2fbd" />
        <stop offset="1" stopColor="#5f1f9e" />
      </radialGradient>
    </defs>

    {/* ground shadow under the buddy */}
    <ellipse
      className="face-shadow"
      cx="118"
      cy="126"
      rx="30"
      ry="4.5"
      fill={awake ? "rgba(170,120,0,0.3)" : "rgba(0,0,0,0.16)"}
    />
    <defs>
      <radialGradient id="faceShade" cx="0.5" cy="1.05" r="0.9">
        <stop offset="0.55" stopColor="rgba(0,0,0,0)" />
        <stop offset="1" stopColor="rgba(0,0,0,0.22)" />
      </radialGradient>
    </defs>

    {/* Y! mark — oval + fully visible bang, just like the original */}
    <g>
      <ellipse cx="58" cy="58" rx="42" ry="36" fill="url(#yOval)" transform="rotate(-8 58 58)" />
      <ellipse cx="44" cy="42" rx="13" ry="7" fill="#fff" opacity="0.18" transform="rotate(-18 44 42)" />
      <text x="58" y="76" textAnchor="middle" fontFamily="'Bitter', Georgia, serif" fontWeight="800" fontSize="52" fill="#fff">
        Y
      </text>
      <text x="100" y="82" fontFamily="'Bitter', Georgia, serif" fontWeight="800" fontSize="64" fill="#7b2fbd" transform="rotate(7 100 82)">
        !
      </text>
    </g>

    {/* the round buddy, nestled over the lower-right of the mark */}
    <g className={awake ? "animate-wake-lift" : "animate-breathe"}>
      <g transform="translate(118 93) scale(1.14) translate(-118 -93)">
        {/* base sphere */}
        <circle cx="118" cy="92" r="30" fill="url(#faceGrey)" />
        <circle
          cx="118"
          cy="92"
          r="30"
          fill="url(#faceYellow)"
          className="face-layer"
          style={{ opacity: awake ? 1 : 0, transition: "opacity 1s ease 0.15s" }}
        />
        {/* 3D shading: bottom inner shadow, rim light, specular */}
        <circle cx="118" cy="92" r="30" fill="url(#faceShade)" />
        <path d="M139 108 a27 27 0 0 0 8 -16" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="107" cy="78" rx="11" ry="7" fill="#fff" opacity="0.65" transform="rotate(-18 107 78)" />
        <ellipse cx="104" cy="75" rx="4" ry="2.4" fill="#fff" opacity="0.8" transform="rotate(-18 104 75)" />

        {/* sleeping features */}
        <g style={{ opacity: awake ? 0 : 1, transition: "opacity 0.4s ease" }}>
          <path d="M103 89 q5 4 10 0" stroke="#5c5c5c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M123 89 q5 4 10 0" stroke="#5c5c5c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M111 104 q7 -2 14 0" stroke="#6a6a6a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        {/* awake features: happy squint + big Yahoo laugh */}
        <g className={awake ? "animate-blink-once" : ""} style={{ opacity: awake ? 1 : 0, transition: awake ? "opacity 0.4s ease 0.75s" : "opacity 0.25s ease" }}>
          <path d="M102 88 q6 -7 12 0" stroke="#6e4300" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M122 88 q6 -7 12 0" stroke="#6e4300" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
        {/* clean open Yahoo grin */}
        <g
          style={{
            opacity: awake ? 1 : 0,
            transform: awake ? "scale(1)" : "scale(0.35)",
            transformOrigin: "50% 0%",
            transformBox: "fill-box",
            transition: awake
              ? "opacity 0.3s ease 0.95s, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.95s"
              : "none",
          }}
        >
          <path d="M104 97 Q118 121 132 97 Z" fill="#7a2a10" />
          <path d="M106.5 97.5 Q118 102 129.5 97.5 L129 100 Q118 104.5 107 100 Z" fill="#fff" />
          <ellipse cx="118" cy="110" rx="6.6" ry="4" fill="#ef8598" />
          <path d="M103 97 Q118 102 133 97" fill="none" stroke="#7a4a00" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <ellipse cx="99" cy="97" rx="4.6" ry="2.7" fill="#ff9a3c" style={{ opacity: awake ? 0.5 : 0, transition: "opacity 0.6s ease 1.4s" }} />
        <ellipse cx="137" cy="97" rx="4.6" ry="2.7" fill="#ff9a3c" style={{ opacity: awake ? 0.5 : 0, transition: "opacity 0.6s ease 1.4s" }} />
      </g>
    </g>

    {/* floating Zzz */}
    <g
      style={{ opacity: awake ? 0 : 1, transition: "opacity 0.45s ease" }}
      fontFamily="'Trebuchet MS', Tahoma, sans-serif"
      fontWeight="bold"
      fill="#9a9a9a"
    >
      <text className="zzz" x="136" y="56" fontSize="17" transform="rotate(-8 136 56)">z</text>
      <text className="zzz zzz-2" x="146" y="43" fontSize="23" transform="rotate(6 146 43)">z</text>
      <text className="zzz zzz-3" x="157" y="28" fontSize="30" transform="rotate(-5 157 28)">Z</text>
    </g>
  </svg>
);

/* ---------- Logos ---------- */
export const YahooWordmark = ({ size = 22, color = "#7b2fbd" }: { size?: number; color?: string }) => (
  <span className="font-yahoo" style={{ fontSize: size, color, letterSpacing: "0.2px", lineHeight: 1 }}>
    Yahoo!
  </span>
);

export const WinFlag = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M1.5 3.5 L7.5 2.5 v5.2 L1.5 8.5 z" fill="#f25022" />
    <path d="M8.7 2.3 L16.5 1.2 v6.3 L8.7 7.8 z" fill="#7fba00" />
    <path d="M1.5 9.7 L7.5 9 v5.2 L1.5 15 z" fill="#00a4ef" />
    <path d="M8.7 8.9 L16.5 8.6 v6.2 L8.7 16 z" fill="#ffb900" />
  </svg>
);
