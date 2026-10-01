'use client';

/* ------------------------------------------------------------------ */
/* Yahoo! Messenger 9 data — buddy roster, audibles, news, ads.        */
/* Roster & status lines transcribed from the reference screenshots.  */
/* ------------------------------------------------------------------ */

export type BuddyStatus = 'online' | 'busy' | 'idle' | 'offline' | 'mobile';

export interface Buddy {
  id: string;
  name: string;
  status: BuddyStatus;
  statusMsg: string;
  statusColor?: 'gray' | 'blue';
  avatar: string; // public path
  playing?: string; // now-playing text (blue, with music note)
  personality: 'chatty' | 'cool' | 'work' | 'quirky';
}

const A = '/assets/avatars';

export const ME_DEFAULT = {
  name: 'Sarah B.',
  avatar: `${A}/cartoon/guy-red.png`,
};

export const INITIAL_BUDDIES: Buddy[] = [
  { id: 'sbacon',   name: 'Sarah Bacon',      status: 'online',  statusMsg: 'Is it Friday yet? :)', avatar: `${A}/cartoon/guy-red.png`,   personality: 'chatty' },
  { id: 'mmuchmore',name: 'Michael Muchmore', status: 'online',  statusMsg: 'Counting sheep',       avatar: `${A}/cartoon/girl-brown.png`, personality: 'work' },
  { id: 'chris',    name: 'Chris',            status: 'mobile',  statusMsg: "I'm mobile",           statusColor: 'blue', avatar: `${A}/cartoon/guy-blonde.png`, personality: 'cool' },
  { id: 'dfeld',    name: 'David F',          status: 'mobile',  statusMsg: "I'm mobile",           statusColor: 'blue', avatar: `${A}/men-32.jpg`,  personality: 'cool' },
  { id: 'dee',      name: 'Dee',              status: 'busy',    statusMsg: 'Stepped Out',          avatar: `${A}/women-21.jpg`, personality: 'cool' },
  { id: 'dudleyw',  name: 'Dudley W',         status: 'online',  statusMsg: '',                     avatar: `${A}/men-44.jpg`,  personality: 'quirky' },
  { id: 'felix',    name: 'Felix',            status: 'online',  statusMsg: '',                     avatar: `${A}/men-11.jpg`,  personality: 'chatty' },
  { id: 'karlad',   name: 'Karl Ad',          status: 'online',  statusMsg: '',                     avatar: `${A}/men-36.jpg`,  personality: 'work' },
  { id: 'kedar',    name: 'Kedar',            status: 'online',  statusMsg: '',                     avatar: `${A}/men-15.jpg`,  personality: 'cool' },
  { id: 'brianyu',  name: 'Brian Yu',         status: 'online',  statusMsg: '',                     avatar: `${A}/women-32.jpg`, personality: 'chatty' },
  { id: 'chinhuat', name: 'Chin-Huat Chang',  status: 'busy',    statusMsg: 'Stepped Out',          avatar: `${A}/men-33.jpg`,  personality: 'work' },
  { id: 'csaari',   name: 'Chris Saari',      status: 'mobile',  statusMsg: "I'm mobile",           statusColor: 'blue', avatar: `${A}/cartoon/guy-cool.png`, personality: 'cool' },
  { id: 'dfeldman', name: 'David Feldman',    status: 'online',  statusMsg: 'Eric Burke ate my inbox', avatar: `${A}/men-27.jpg`, personality: 'quirky' },
  { id: 'dgould',   name: 'David Gould',      status: 'online',  statusMsg: '',                     avatar: `${A}/men-19.jpg`,  personality: 'work' },
  { id: 'dudleywong', name: 'Dudley Wong',    status: 'idle',    statusMsg: '',                     avatar: `${A}/men-41.jpg`,  personality: 'work' },
  { id: 'jfreeze',  name: 'Jared Freeze',     status: 'online',  statusMsg: '', playing: 'The Choir - It\'s Cold Outside', avatar: `${A}/women-14.jpg`, personality: 'chatty' },
  { id: 'jkota',    name: 'Jay Kota',         status: 'online',  statusMsg: '',                     avatar: `${A}/men-22.jpg`,  personality: 'cool' },
  { id: 'jdunning', name: 'John Dunning',     status: 'online',  statusMsg: "I'm totally buying one of these", avatar: `${A}/men-30.jpg`, personality: 'quirky' },
  { id: 'kedara',   name: 'Kedar Apte',       status: 'idle',    statusMsg: 'Buzz Down',            avatar: `${A}/men-17.jpg`,  personality: 'work' },
  { id: 'etupper',  name: 'Erich Tupper',     status: 'offline', statusMsg: '',                     avatar: '', personality: 'work' },
  { id: 'jimmy',    name: 'jimmy',            status: 'offline', statusMsg: '',                     avatar: '', personality: 'chatty' },
  { id: 'jhampton', name: 'Jonathon Hampton', status: 'offline', statusMsg: '',                     avatar: '', personality: 'work' },
];

/* ---------------- Audibles (real MP4s from Yahoo! Messenger) ---------------- */

export interface AudibleCategory {
  label: string;
  dir: string;
  clips: { file: string; caption: string }[];
}

const cap = (file: string) =>
  file.replace('.mp4', '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function cat(dir: string, files: string[]): AudibleCategory {
  return { label: cap(dir), dir, clips: files.map((f) => ({ file: f, caption: cap(f) })) };
}

export const AUDIBLE_CATEGORIES: AudibleCategory[] = [
  cat('hello', ['dude.mp4', 'echo.mp4', 'expecting-you.mp4', 'guess.mp4', 'i-can-see-you.mp4', 'its-ok-now.mp4', 'ladies-in-da-house.mp4', 'nosepick.mp4', 'skin.mp4', 'sup.mp4']),
  cat('goodbyes', ['boss.mp4', 'buhbye.mp4', 'iM.mp4', 'meds.mp4', 'outta-here.mp4', 'parole.mp4', 'pee.mp4', 'reboot.mp4', 'see-ya.mp4', 'split.mp4']),
  cat('taunt', ['badabing.mp4', 'dont-make-me-hurt-you.mp4', 'gotta-hurt.mp4', 'hit-me-with-your-best-shot-grandma.mp4', 'hope-youre-hungry.mp4', 'mopping.mp4', 'muhahahaha.mp4']),
  cat('insults', ['barf.mp4', 'brain.mp4', 'funny.mp4', 'laughing.mp4', 'lonely.mp4', 'monkey.mp4', 'not-funny.mp4', 'rest-of-my-life.mp4', 'shower.mp4', 'snap.mp4', 'sock.mp4', 'spellcheck.mp4', 'stick.mp4', 'suck.mp4', 'talk-to-the-hand.mp4', 'typo.mp4', 'unplug.mp4', 'whine.mp4']),
  cat('flirt', ['booty.mp4', 'come-closer.mp4', 'cpr.mp4', 'cupid.mp4', 'dang.mp4', 'dead.mp4', 'heart-melt.mp4', 'hot.mp4', 'loves-me.mp4', 'real-slow.mp4', 'sexy.mp4', 'so.mp4']),
  cat('losing', ['best-two.mp4', 'cheater.mp4', 'confidence.mp4', 'nooo.mp4', 'on-now.mp4', 'to-someone-like-you.mp4', 'well-played-old-man.mp4']),
  cat('winning', ['greatest-ever.mp4', 'i-won.mp4', 'na-na-na-na-na.mp4', 'oh-yeah.mp4', 'so-badly.mp4', 'wake-me.mp4']),
  cat('football', ['airhorn.mp4', 'back.mp4', 'german-drummer.mp4', 'ich-habe-fertig.mp4', 'ole-Ole.mp4', 'pfeife.mp4', 'schiess-los.mp4']),
  cat('music', ['applause.mp4', 'drumroll.mp4', 'fanfare.mp4', 'tada.mp4']),
  cat('halloween', ['bad-side.mp4', 'boo.mp4', 'cute.mp4', 'happy-halloween.mp4', 'happy-howloeen.mp4', 'princess.mp4', 'scream.mp4', 'shut-up.mp4', 'trick-or-treat.mp4', 'what-are-you-supposed-to-be.mp4']),
  cat('happy-tree-friends', ['disco.mp4', 'flaky.mp4', 'flippy.mp4', 'giggles.mp4', 'nutty.mp4']),
  cat('madonna', ['ray-of-light.mp4']),
  cat('siedler', ['das-haben-wir-gleich.mp4', 'ihr-entkommt-mir-nicht.mp4']),
];

export const AUDIBLE_BAR_LABEL = 'Hellos';

/* ---------------- News ticker headlines (era-flavored) ---------------- */

export const NEWS_HEADLINES: string[] = [
  'ALP the same federally as in Tas: Libs (AAP)',
  'Yahoo! unveils new Messenger with voice and video',
  'Study: 8 in 10 teens send instant messages daily',
  'Dow closes up 114 on upbeat earnings reports',
  'New iPhone app store downloads top 100 million',
  'Weather: Sunny skies expected through the weekend',
  ' Scientists find water vapor on distant planet',
  'Stocks in play: YHOO, MSFT, AAPL, GOOG',
  'Trends: MP3 players outsell CD players 3-to-1',
  'Olympic countdown: Beijing 2008 torch relay begins',
];

/* ---------------- Ad banners (from the reference screenshots) ---------------- */

export const ADS: { tag: string; title: string; url: string }[] = [
  { tag: 'AD', title: 'Save on Flat Panel TVs - Dealtime®', url: 'www.DealTime.com' },
  { tag: 'AD', title: 'DISH Network® - Official Site', url: 'www.DISHNetwork.com' },
  { tag: 'AD', title: 'Free AOL® Radio - 200+ stations', url: 'www.AOLRadio.com' },
  { tag: 'AD', title: 'Ringtones for your phone - get 10 free', url: 'www.ringtones.com' },
];

/* ---------------- Status menu ---------------- */

export const STATUS_MENU: { label: string; status: BuddyStatus; msg?: string }[] = [
  { label: 'Available', status: 'online' },
  { label: 'Busy', status: 'busy' },
  { label: 'Stepped Out', status: 'busy', msg: 'Stepped Out' },
  { label: 'Be Right Back', status: 'busy', msg: 'Be Right Back' },
  { label: 'Not At My Desk', status: 'busy', msg: 'Not At My Desk' },
  { label: 'Not In The Office', status: 'busy', msg: 'Not In The Office' },
  { label: 'On The Phone', status: 'busy', msg: 'On The Phone' },
  { label: 'On Vacation', status: 'busy', msg: 'On Vacation' },
  { label: 'Out To Lunch', status: 'busy', msg: 'Out To Lunch' },
  { label: 'Invisible to Everyone', status: 'offline', msg: '' },
];

/* ---------------- Bot conversation engine ---------------- */

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function botReply(buddy: Buddy, text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes('buzz')) return [':O', 'whoa! that buzz gets me every time :))'];
  if (t.match(/\b(hi|hey|hello|yo|sup)\b/)) {
    return [pick(['hey!! :)', 'hiya!', 'hey hey :D']), pick(["what's up?", "how's it going?", 'long time no talk!!'])];
  }
  if (t.includes('?')) {
    return [pick(['hmm good question', 'lol idk', 'let me look it up brb']), pick(['brb 2 min', 'one sec...'])];
  }
  if (t.match(/\b(brb|bbs|gtg|g2g)\b/)) return ['ok ttyl!', 'later!! :>'];
  if (t.includes('lol') || t.includes('haha') || t.includes('joke')) return [pick([':))', '=))', 'LOL', 'xD'])];
  if (t.includes('bye')) return ['bye!! come back soon :x', 'ttyl!'];
  if (t.includes('call')) return ["can't talk now, on my cell... I'm mobile", 'call me later :X'];
  if (t.includes('photo') || t.includes('pic')) return ['send it! :">', 'omg send pics!!'];
  if (t.includes('video')) return ['my webcam is broken :(', 'ok but i look terrible today lol'];
  if (t.includes('music') || t.includes('song')) return ['listening to it right now!! o|^_^|o', 'omg i LOVE that song'];
  switch (buddy.personality) {
    case 'cool':
      return [pick(['cool cool', 'nice :)', 'sweet']), pick(['so whats new', 'anything fun happen today'])];
    case 'work':
      return [pick(['ok sounds good', 'got it, thanks', 'noted.']), pick(['did you finish the report?', 'the meeting got moved to 3pm'])];
    case 'quirky':
      return [pick(['whoa', 'no way!!', 'get out! :O']), pick(['btw did you see that video i sent you?', 'my status message is about you btw :">'])];
    default:
      return [
        pick(['omg really??', 'for real?? :O', 'hahaha :))']),
        pick(['tell me more!!', 'and then what happened??', 'same here!!!']),
        pick([':x', 'B-) cool cool', '=))']),
      ];
  }
}

export function botBuzzReaction(buddy: Buddy): string[] {
  return [pick(['AAAH!! :O', 'hey!! stop buzzing me!! >:(', 'X(  rude!!']), pick(['...ok fine, buzzing you back ;)', 'take THIS!!'])];
}

export function fmtTimestamp(d = new Date()): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}
