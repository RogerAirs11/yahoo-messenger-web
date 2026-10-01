'use client';

import React from 'react';

/* ------------------------------------------------------------------ */
/* Procedural cartoon avatars in the spirit of Yahoo! Avatars (YM 9).  */
/* Deterministic per name — every buddy gets a stable little face.     */
/* ------------------------------------------------------------------ */

const HAIRS = ['#4A2E18', '#6B3E14', '#C8862A', '#4A3A30', '#7A4A20', '#B4552A', '#D8B04A', '#5A5A66'];
const SKINS = ['#F2C9A0', '#E8B088', '#C98D5E', '#8C5A34', '#F7D7B8', '#A96C40'];
const SHIRTS = ['#3A7ABF', '#BF3A5A', '#3AA06A', '#7A3ABF', '#BF7A2A', '#3A8ABF', '#C04A3A', '#4A9A48'];
const STYLES = ['short', 'spiky', 'long', 'bald', 'cap', 'curly'];

export type AvatarSeed = {
  hair: string;
  skin: string;
  shirt: string;
  style: string;
  bg: string;
};

export function seedFor(name: string): AvatarSeed {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const bgs = ['#E8D8F5', '#D8E8F5', '#F5E8D8', '#D8F5E2', '#F5D8E2', '#EFEFE0'];
  return {
    hair: HAIRS[h % HAIRS.length],
    skin: SKINS[(h >> 3) % SKINS.length],
    shirt: SHIRTS[(h >> 6) % SHIRTS.length],
    style: STYLES[(h >> 9) % STYLES.length],
    bg: bgs[(h >> 12) % bgs.length],
  };
}

export function AvatarSvg({ seed, size = 32 }: { seed: AvatarSeed; size?: number }) {
  const { hair, skin, shirt, style, bg } = seed;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <rect width="32" height="32" rx="3" fill={bg} />
      {/* shoulders */}
      <path d="M4,32 Q4,24 16,24 Q28,24 28,32 Z" fill={shirt} />
      {/* head */}
      <circle cx="16" cy="13" r="8" fill={skin} />
      {/* hair styles */}
      {style === 'short' && <path d="M8,12 Q8,4.5 16,4.5 Q24,4.5 24,12 Q20,9 16,9.5 Q11,9 8,12 Z" fill={hair} />}
      {style === 'spiky' && (
        <path d="M8,12 L9.5,6 L11.5,9 L13.5,4.5 L15.5,8.5 L17.5,4.5 L19.5,9 L21.5,6 L24,12 Q20,8.5 16,9 Q11,8.5 8,12 Z" fill={hair} />
      )}
      {style === 'long' && (
        <>
          <path d="M6,21 L6,13 Q6,4.5 16,4.5 Q26,4.5 26,13 L26,21 Z" fill={hair} />
          <circle cx="16" cy="13.5" r="7.2" fill={skin} />
          <path d="M9,10.5 Q16,6.5 23,10.5 Q16,8.5 9,10.5 Z" fill={hair} />
        </>
      )}
      {style === 'bald' && <path d="M9,10 Q10,5.5 16,5.5 Q22,5.5 23,10" fill="none" stroke={hair} strokeWidth="1.4" />}
      {style === 'cap' && (
        <>
          <path d="M8,10.5 Q8,4.5 16,4.5 Q24,4.5 24,10.5 Z" fill={shirt} />
          <path d="M6,10.5 L26,10.5 L26,12 L6,12 Z" fill={shirt} />
        </>
      )}
      {style === 'curly' && (
        <g fill={hair}>
          <circle cx="10" cy="9" r="2.6" />
          <circle cx="13" cy="6.5" r="2.6" />
          <circle cx="16.5" cy="6" r="2.6" />
          <circle cx="20" cy="6.8" r="2.6" />
          <circle cx="22.5" cy="9.5" r="2.4" />
        </g>
      )}
      {/* eyes */}
      <circle cx="12.6" cy="12.6" r="1" fill="#2B1B10" />
      <circle cx="19.4" cy="12.6" r="1" fill="#2B1B10" />
      {/* smile */}
      <path d="M12.4,16.4 Q16,19.4 19.6,16.4" fill="none" stroke="#8A4A2A" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Buddies                                                             */
/* ------------------------------------------------------------------ */

export type BuddyStatus = 'online' | 'busy' | 'idle' | 'offline' | 'mobile';

export interface Buddy {
  id: string;
  name: string;
  group: string;
  status: BuddyStatus;
  statusMsg?: string;
  personality: 'chatty' | 'cool' | 'dramatic' | 'work' | 'music';
}

export const INITIAL_BUDDIES: Buddy[] = [
  { id: 'mmuchmore', name: 'Michael Muchmore', group: 'Friends', status: 'online', statusMsg: '', personality: 'chatty' },
  { id: 'sbacon', name: 'Sarah Bacon', group: 'Friends', status: 'online', statusMsg: 'Is it Friday yet? :)', personality: 'chatty' },
  { id: 'chris', name: 'Chris', group: 'Friends', status: 'mobile', statusMsg: "I'm mobile", personality: 'cool' },
  { id: 'davidf', name: 'David F.', group: 'Friends', status: 'mobile', statusMsg: "I'm mobile", personality: 'work' },
  { id: 'dee', name: 'Dee', group: 'Friends', status: 'busy', statusMsg: '', personality: 'dramatic' },
  { id: 'dudley', name: 'Dudley W', group: 'Co-Workers', status: 'online', statusMsg: '', personality: 'work' },
  { id: 'felix', name: 'Felix', group: 'Co-Workers', status: 'online', statusMsg: '', personality: 'cool' },
  { id: 'brian', name: 'Brian Yu', group: 'Co-Workers', status: 'online', statusMsg: '', personality: 'work' },
  { id: 'chinhuat', name: 'Chin-Huat Chang', group: 'Co-Workers', status: 'busy', statusMsg: 'Stepped Out', personality: 'work' },
  { id: 'sassi', name: 'Sassi', group: 'Family', status: 'online', statusMsg: '', personality: 'dramatic' },
  { id: 'dfeldman', name: 'David Feldman', group: 'Family', status: 'online', statusMsg: 'Eric Burke ate my inbox', personality: 'chatty' },
  { id: 'dgould', name: 'David Gould', group: 'Family', status: 'online', statusMsg: '', personality: 'cool' },
  { id: 'jared', name: 'Jared Freeze', group: 'Friends', status: 'online', statusMsg: "♫ The Choir - It's Cold Outside", personality: 'music' },
  { id: 'jaykota', name: 'Jay Kota', group: 'Friends', status: 'online', statusMsg: "I'm totally buying one of these", personality: 'music' },
  { id: 'johnd', name: 'John Dunning', group: 'Friends', status: 'offline', statusMsg: '', personality: 'chatty' },
  { id: 'kedara', name: 'Kedar Apte', group: 'Family', status: 'online', statusMsg: 'Buzz Down | Myanmar keeps Su...', personality: 'chatty' },
  { id: 'jimmy', name: 'jimmy', group: 'Friends', status: 'offline', statusMsg: '', personality: 'cool' },
  { id: 'erich', name: 'Erich Tupper', group: 'Co-Workers', status: 'offline', statusMsg: '', personality: 'work' },
];

export const GROUP_ORDER = ['Friends', 'Family', 'Co-Workers'];

/* ------------------------------------------------------------------ */
/* Status list (authentic YM 9 dropdown)                               */
/* ------------------------------------------------------------------ */

export const STATUS_MENU: { label: string; status: BuddyStatus | 'new' | 'signout' }[] = [
  { label: "I'm Available", status: 'online' },
  { label: 'Busy', status: 'busy' },
  { label: 'Be Right Back', status: 'idle' },
  { label: 'Not At My Desk', status: 'idle' },
  { label: 'Stepped Out', status: 'idle' },
  { label: 'Not In The Office', status: 'idle' },
  { label: 'On The Phone', status: 'idle' },
  { label: 'On Vacation', status: 'idle' },
  { label: 'Out To Lunch', status: 'idle' },
  { label: 'Invisible to Everyone', status: 'offline' },
  { label: 'New Status Message...', status: 'new' },
  { label: 'Sign Out', status: 'signout' },
];

/* ------------------------------------------------------------------ */
/* Ads / news ticker content                                           */
/* ------------------------------------------------------------------ */

export const AD_ROTATION: { kind: 'AD' | 'NEWS'; title: string; url: string }[] = [
  { kind: 'AD', title: 'DISH Network® - Official Site', url: 'www.DISHNetwork.com' },
  { kind: 'AD', title: 'Save on Flat Panel TVs - Dealtime®', url: 'www.DealTime.com' },
  { kind: 'AD', title: 'Get exclusive icons, content, and more!', url: 'emoticons.yahoo.com' },
  { kind: 'NEWS', title: 'ALP the same federally as in Tas: Libs', url: '(AAP)' },
  { kind: 'NEWS', title: 'Myanmar keeps Suu Kyi under house arrest', url: 'news.yahoo.com' },
  { kind: 'AD', title: 'Yahoo! Voice — Call phones for 1¢/min', url: 'voice.yahoo.com' },
  { kind: 'NEWS', title: 'Get exclusive icons, smileys and more!', url: 'yahoo.com' },
  { kind: 'AD', title: 'Radio on Yahoo! Music — 100+ stations', url: 'music.yahoo.com' },
];

/* ------------------------------------------------------------------ */
/* Audibles bar (Hellos)                                               */
/* ------------------------------------------------------------------ */

export const AUDIBLES: { label: string; text: string; pitch: number }[] = [
  { label: 'Hey there!', text: 'Hey there!', pitch: 520 },
  { label: 'Hello!!', text: 'HELLO!!!', pitch: 640 },
  { label: 'Yo!', text: 'YO!!!', pitch: 380 },
  { label: 'Whassup?!', text: 'WHASSUP?!', pitch: 300 },
  { label: 'Howdy!', text: 'HOWDY!', pitch: 460 },
  { label: 'Hi hi!', text: 'hi hi hi :)', pitch: 700 },
  { label: 'Greetings!', text: 'Greetings!', pitch: 400 },
  { label: 'Knock knock!', text: 'Knock knock!', pitch: 560 },
];

/* ------------------------------------------------------------------ */
/* Bot reply engine — nostalgic YM-flavored canned responses           */
/* ------------------------------------------------------------------ */

const REPLIES: Record<Buddy['personality'], string[]> = {
  chatty: [
    'lol :))',
    'omg i know right',
    'brb mom needs the phone',
    'did u see that?? :O',
    'hahaha XD',
    'so wut r u up to?',
    'n2m here just chattin',
    'my dial-up is SO slow today',
    'brb',
    'ttyl! *hugs* >:D<',
  ],
  cool: [
    'sup ;)',
    'nm u?',
    'cool cool',
    'ha nice B-)',
    'yeah i heard',
    'tru',
    'kewl :)',
    'l8r',
    'thats wassup',
  ],
  dramatic: [
    'OMG!!! :O',
    'NO WAY',
    'i cant believe he said that!!',
    'im telling EVERYONE',
    'brb crying :((',
    'u wont BELIEVE what happened today',
    'ok so basically...',
    'dont get me started lol',
    ':-S',
  ],
  work: [
    'in a meeting, brb',
    'did u send that report yet?',
    'ok sure',
    'lets discuss tomorrow',
    'ty',
    'on the phone with the client',
    'can u ping me in 10?',
    'noted :)',
  ],
  music: [
    "♪♪ this song is EVERYTHING ♪♪",
    "check out my new playlist!",
    "concert friday?? :D",
    "im listening to it right now ♫",
    "the chorus gives me chills",
    "ill burn u a cd ;)",
  ],
};

const GREETINGS = /\b(hi|hello|hey|yo|sup|wassup|hola)\b/i;
const THANKS = /\b(thx|thanks|ty)\b/i;
const BYE = /\b(brb|gtg|g2g|bye|ttyl|l8r|cya|night)\b/i;
const LAUGH = /\b(lol|lmao|rofl|haha|hehe|XD)\b/i;
const LOVE = /\b(love|<3|hug)\b/i;
const QUESTION = /\?\s*$/;

function ysearchResults(q: string): string[] {
  const query = q.trim().replace(/\s+/g, ' ') || 'yahoo messenger';
  return [
    `Web Results for "${query}" — about 1,240,000 results (0.28 seconds, dial-up charges may apply):`,
    `1. ${query} - Official Site » www.${query.toLowerCase().replace(/[^a-z0-9]/g, '') || 'yahoo'}.com — The #1 source for ${query} on the entire World Wide Web!`,
    `2. Top 10 ${query} Tips » geocities.com/~webmaster2008 — You won't BELIEVE #7!! :O`,
    `3. ${query} - Best Prices » shopping.yahoo.com — Compare and save! Free shipping on orders over $25.`,
    `Tip: Press "Buzz!" for faster results. (Not really. B-) )`,
  ];
}


export function botReply(buddy: Buddy, incoming: string): string[] {
  if (buddy.id === 'ysearch') return ysearchResults(incoming);
  const pool = REPLIES[buddy.personality];
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  const out: string[] = [];
  if (GREETINGS.test(incoming)) {
    out.push(['hey!', 'heyy :)', 'yo!', 'hi!! :D', 'sup'][Math.floor(Math.random() * 5)]);
  }
  if (incoming.toLowerCase().includes('buzz')) out.push('whoa!! the BUZZ!!! X(');
  if (THANKS.test(incoming)) out.push('np :)');
  if (BYE.test(incoming)) out.push(['cya!', 'ttyl >:D<', 'l8r!!', 'ok bye!! :)'][Math.floor(Math.random() * 4)]);
  else if (LAUGH.test(incoming)) out.push(':)) lol');
  else if (LOVE.test(incoming)) out.push('aww >:D<');
  else if (QUESTION.test(incoming)) out.push(['hmm good question :-S', 'idk lol', 'maybe??', 'yes totally :D', 'no way!!'][Math.floor(Math.random() * 5)]);
  else out.push(pick());
  if (Math.random() < 0.25) out.push(pick());
  return out;
}

export function botBuzzReaction(buddy: Buddy): string[] {
  const all = ['AHHH!!! BUZZ!!! X(', 'STOP THE BUZZING!! lol', 'ok ok im here!! :O', 'BUZZ WAR!!! >:)', 'that scared me!! :O'];
  const i = Math.floor(Math.random() * all.length);
  return [all[i]];
}
