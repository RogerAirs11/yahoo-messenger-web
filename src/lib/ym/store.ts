'use client';

import { create } from 'zustand';
import { INITIAL_BUDDIES, Buddy, BuddyStatus, botReply, botBuzzReaction, AUDIBLE_CATEGORIES, fmtTimestamp, ME_DEFAULT } from './data';
import { sounds } from './sounds';

export type { Buddy } from './data';
export type Phase = 'login' | 'signing' | 'online' | 'signout';

export interface ChatMessage {
  kind: 'msg' | 'system' | 'buzz' | 'audible';
  from: 'me' | 'buddy' | 'sys';
  text: string;
  ts: number;
  audible?: { cat: string; file: string; caption: string };
  fmt?: { bold?: boolean; italic?: boolean; underline?: boolean; color?: string; size?: number; font?: string };
}

export interface WinState {
  open: boolean;
  visible: boolean;
  x: number;
  y: number;
  z: number;
}

export interface ConvState {
  messages: ChatMessage[];
  typing: boolean;
  unread: number;
}

interface YMStore {
  phase: Phase;
  me: { id: string; name: string; status: BuddyStatus; customStatus: string; avatar: string };
  buddies: Buddy[];
  windows: { login: WinState; buddylist: WinState; im: Record<string, WinState> };
  zTop: number;
  conversations: Record<string, ConvState>;
  shakeIm: Record<string, number>; // counter triggers shake
  soundOn: boolean;
  showTimestamps: boolean;
  signingProgress: number;

  setPhase: (p: Phase) => void;
  signIn: (id: string) => void;
  signOut: () => void;
  setMyStatus: (s: BuddyStatus, label?: string) => void;
  setCustomStatus: (s: string) => void;
  toggleSound: () => void;
  toggleTimestamps: () => void;

  focusWin: (key: 'login' | 'buddylist' | string) => void;
  moveWin: (key: 'login' | 'buddylist' | string, x: number, y: number) => void;
  minimizeWin: (key: 'login' | 'buddylist' | string) => void;
  restoreWin: (key: 'login' | 'buddylist' | string) => void;
  closeIm: (buddyId: string) => void;
  closeBuddyList: () => void;

  openIm: (buddyId: string, fromBuddy?: boolean) => void;
  pushMsg: (buddyId: string, msg: ChatMessage) => void;
  sendMyMsg: (buddyId: string, text: string, fmt?: ChatMessage['fmt']) => void;
  sendMyBuzz: (buddyId: string) => void;
  sendMyAudible: (buddyId: string, catIdx: number, clipIdx: number) => void;
  buddyAudible: (buddyId: string) => void;
  buddySays: (buddyId: string, texts: string[]) => void;
  buddyBuzz: (buddyId: string) => void;
  setTyping: (buddyId: string, t: boolean) => void;
  setBuddyStatus: (buddyId: string, status: BuddyStatus, msg?: string) => void;
  ensureBuddy: (id: string, name: string) => void;
}

const W = (x: number, y: number, z: number, open = true, visible = true): WinState => ({ x, y, z, open, visible });

const timers: ReturnType<typeof setTimeout>[] = [];
const later = (fn: () => void, ms: number) => {
  timers.push(setTimeout(fn, ms));
};

export const useYM = create<YMStore>((set, get) => ({
  phase: 'login',
  me: { id: '', name: '', status: 'online', customStatus: '', avatar: ME_DEFAULT.avatar },
  buddies: INITIAL_BUDDIES.map((b) => ({ ...b })),
  windows: { login: W(500, 150, 10), buddylist: W(180, 24, 5, false, false), im: {} },
  zTop: 10,
  conversations: {},
  shakeIm: {},
  soundOn: true,
  showTimestamps: true,
  signingProgress: 0,

  setPhase: (p) => set({ phase: p }),

  signIn: (id) => {
    const name = id.trim() || 'yahoo_user';
    set((st) => ({ phase: 'signing', signingProgress: 0, me: { ...st.me, name } }));
    const prog = setInterval(() => {
      const p = get().signingProgress;
      if (p >= 100) return clearInterval(prog);
      set({ signingProgress: Math.min(100, p + 8 + Math.random() * 14) });
    }, 160);
    // staggered buddies coming online
    set((st) => ({
      buddies: st.buddies.map((b) => (b.status === 'offline' ? b : { ...b, status: b.status })),
    }));
    later(() => {
      clearInterval(prog);
      set({ signingProgress: 100 });
      const buddiesOnline = get()
        .buddies.filter((b) => b.status !== 'offline')
        .slice(0, 6);
      buddiesOnline.forEach((b, i) => {
        later(() => sounds.doorOpen(), 300 + i * 700);
      });
      later(() => sounds.signIn(), 300);
      set((st) => ({
        phase: 'online',
        windows: {
          ...st.windows,
          login: { ...st.windows.login, open: false },
          buddylist: { ...st.windows.buddylist, open: true, visible: true, z: st.zTop + 1 },
        },
        zTop: st.zTop + 1,
      }));
      // after a few seconds Michael says hi
      later(() => {
        get().openIm('mmuchmore', true);
        later(() => {
          get().setTyping('mmuchmore', true);
          later(() => {
            get().setTyping('mmuchmore', false);
            get().buddySays('mmuchmore', ["How's it going?"]);
          }, 1600);
        }, 900);
      }, 5000);
    }, 2400);
  },

  signOut: () => {
    set((st) => ({
      phase: 'login',
      conversations: {},
      windows: { login: W(500, 150, 20, true, true), buddylist: W(180, 24, 5, false, false), im: {} },
      zTop: 20,
      me: { ...st.me, customStatus: '' },
    }));
  },

  setMyStatus: (s, label) => {
    set((st) => ({ me: { ...st.me, status: s, customStatus: label !== undefined ? label : st.me.customStatus } }));
  },
  setCustomStatus: (s) => set((st) => ({ me: { ...st.me, customStatus: s } })),
  toggleSound: () => {
    const on = !get().soundOn;
    set({ soundOn: on });
    void import('./sounds').then((m) => m.setMuted(!on));
  },
  toggleTimestamps: () => set((st) => ({ showTimestamps: !st.showTimestamps })),

  focusWin: (key) => {
    const z = get().zTop + 1;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    set((st) => {
      const clamp = (w: WinState, ww: number, wh: number): WinState => ({
        ...w,
        x: Math.max(-ww + 80, Math.min(w.x, vw - 80)),
        y: Math.max(0, Math.min(w.y, vh - wh - 34)),
      });
      if (key === 'login') return { windows: { ...st.windows, login: { ...st.windows.login, z } }, zTop: z };
      if (key === 'buddylist')
        return {
          windows: { ...st.windows, buddylist: { ...clamp(st.windows.buddylist, 307, 540), z, visible: true } },
          zTop: z,
        };
      const im = st.windows.im[key] ?? W(140, 60, z);
      return {
        windows: { ...st.windows, im: { ...st.windows.im, [key]: { ...clamp(im, 442, 478), z, open: true, visible: true } } },
        zTop: z,
      };
    });
  },
  moveWin: (key, x, y) =>
    set((st) => {
      if (key === 'login') return { windows: { ...st.windows, login: { ...st.windows.login, x, y } } };
      if (key === 'buddylist') return { windows: { ...st.windows, buddylist: { ...st.windows.buddylist, x, y } } };
      const im = st.windows.im[key];
      if (!im) return {};
      return { windows: { ...st.windows, im: { ...st.windows.im, [key]: { ...im, x, y } } } };
    }),
  minimizeWin: (key) =>
    set((st) => {
      if (key === 'login') return { windows: { ...st.windows, login: { ...st.windows.login, visible: false } } };
      if (key === 'buddylist') return { windows: { ...st.windows, buddylist: { ...st.windows.buddylist, visible: false } } };
      const im = st.windows.im[key];
      if (!im) return {};
      return { windows: { ...st.windows, im: { ...st.windows.im, [key]: { ...im, visible: false } } } };
    }),
  restoreWin: (key) => get().focusWin(key),
  closeIm: (buddyId) =>
    set((st) => {
      const im = { ...st.windows.im };
      delete im[buddyId];
      return { windows: { ...st.windows, im } };
    }),
  closeBuddyList: () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out of Yahoo! Messenger?')) {
      get().signOut();
    }
  },

  openIm: (buddyId, fromBuddy) => {
    const st = get();
    const z = st.zTop + 1;
    const count = Object.keys(st.windows.im).length;
    const x = Math.min(90 + count * 28, window.innerWidth - 460);
    const y = Math.min(60 + count * 24, Math.max(10, window.innerHeight - 520));
    const conv = st.conversations[buddyId] ?? { messages: [], typing: false, unread: 0 };
    set({
      zTop: z,
      windows: {
        ...st.windows,
        buddylist: { ...st.windows.buddylist },
        im: { ...st.windows.im, [buddyId]: st.windows.im[buddyId] ?? W(x, y, z) },
      },
      conversations: { ...st.conversations, [buddyId]: { ...conv, unread: fromBuddy ? conv.unread : 0 } },
    });
    if (!fromBuddy) sounds.tick();
  },

  pushMsg: (buddyId, msg) =>
    set((st) => {
      const conv = st.conversations[buddyId] ?? { messages: [], typing: false, unread: 0 };
      return { conversations: { ...st.conversations, [buddyId]: { ...conv, messages: [...conv.messages, msg] } } };
    }),

  sendMyMsg: (buddyId, text, fmt) => {
    if (!text.trim()) return;
    get().pushMsg(buddyId, { kind: 'msg', from: 'me', text, ts: Date.now(), fmt });
    sounds.send();
    const buddy = get().buddies.find((b) => b.id === buddyId);
    if (!buddy || buddy.status === 'offline') {
      later(() => {
        get().pushMsg(buddyId, { kind: 'system', from: 'sys', text: `${buddy?.name ?? buddyId} is offline and can't receive messages.`, ts: Date.now() });
      }, 500);
      return;
    }
    const replies = botReply(buddy, text);
    later(() => get().setTyping(buddyId, true), 500 + Math.random() * 600);
    let delay = 1400 + Math.random() * 900;
    replies.forEach((r) => {
      later(() => {
        get().setTyping(buddyId, false);
        get().buddySays(buddyId, [r]);
      }, delay);
      delay += 1200 + Math.random() * 1400;
    });
  },

  sendMyBuzz: (buddyId) => {
    get().pushMsg(buddyId, { kind: 'buzz', from: 'me', text: 'BUZZ!!!', ts: Date.now() });
    sounds.buzz();
    set((st) => ({ shakeIm: { ...st.shakeIm, [buddyId]: (st.shakeIm[buddyId] ?? 0) + 1 } }));
    const buddy = get().buddies.find((b) => b.id === buddyId);
    if (!buddy || buddy.status === 'offline') return;
    later(() => get().setTyping(buddyId, true), 900);
    later(() => {
      get().setTyping(buddyId, false);
      get().buddySays(buddyId, botBuzzReaction(buddy));
    }, 2200);
  },

  sendMyAudible: (buddyId, catIdx, clipIdx) => {
    const catd = AUDIBLE_CATEGORIES[catIdx];
    const clip = catd?.clips[clipIdx];
    if (!catd || !clip) return;
    get().pushMsg(buddyId, { kind: 'audible', from: 'me', text: clip.caption, ts: Date.now(), audible: { cat: catd.dir, file: clip.file, caption: clip.caption } });
    const buddy = get().buddies.find((b) => b.id === buddyId);
    if (!buddy || buddy.status === 'offline') return;
    later(() => {
      get().buddyAudible(buddyId);
    }, 1800 + Math.random() * 1200);
  },

  buddyAudible: (buddyId) => {
    const catd = AUDIBLE_CATEGORIES[Math.floor(Math.random() * 3)];
    const clip = catd.clips[Math.floor(Math.random() * catd.clips.length)];
    const buddy = get().buddies.find((b) => b.id === buddyId);
    get().pushMsg(buddyId, { kind: 'audible', from: 'buddy', text: clip.caption, ts: Date.now(), audible: { cat: catd.dir, file: clip.file, caption: clip.caption } });
  },

  buddySays: (buddyId, texts) => {
    texts.forEach((t) => get().pushMsg(buddyId, { kind: 'msg', from: 'buddy', text: t, ts: Date.now() }));
    const st = get();
    const im = st.windows.im[buddyId];
    const focused = im?.visible && im.z === st.zTop;
    sounds.receive();
    set((st2) => {
      const conv = st2.conversations[buddyId];
      if (!conv) return {};
      return {
        conversations: { ...st2.conversations, [buddyId]: { ...conv, unread: focused ? 0 : conv.unread + 1 } },
      };
    });
    // occasionally the buddy signs out after chatting (never the demo host)
    if (buddyId !== 'mmuchmore' && Math.random() < 0.06) {
      later(() => {
        get().setBuddyStatus(buddyId, 'offline');
        get().pushMsg(buddyId, { kind: 'system', from: 'sys', text: `${get().buddies.find((b) => b.id === buddyId)?.name} has signed out. (${fmtTimestamp()})`, ts: Date.now() });
      }, 8000 + Math.random() * 6000);
    }
  },

  buddyBuzz: (buddyId) => {
    get().pushMsg(buddyId, { kind: 'buzz', from: 'buddy', text: 'BUZZ!!!', ts: Date.now() });
    sounds.buzz();
    set((st) => ({ shakeIm: { ...st.shakeIm, [buddyId]: (st.shakeIm[buddyId] ?? 0) + 1 } }));
  },

  setTyping: (buddyId, t) =>
    set((st) => {
      const conv = st.conversations[buddyId] ?? { messages: [], typing: false, unread: 0 };
      return { conversations: { ...st.conversations, [buddyId]: { ...conv, typing: t } } };
    }),

  setBuddyStatus: (buddyId, status, msg) => {
    const b = get().buddies.find((x) => x.id === buddyId);
    if (!b || b.status === status) return;
    if (status === 'offline') sounds.doorClose();
    else if (b.status === 'offline') sounds.doorOpen();
    set((st) => ({ buddies: st.buddies.map((x) => (x.id === buddyId ? { ...x, status, statusMsg: msg ?? x.statusMsg } : x)) }));
  },

  ensureBuddy: (id, name) => {
    if (get().buddies.some((b) => b.id === id)) return;
    set((st) => ({
      buddies: [...st.buddies, { id, name, status: 'online', statusMsg: '', avatar: '', personality: 'work' }],
    }));
  },
}));
