/* ------------------------------------------------------------------ */
/*  Data: roster, audibles (114 real local MP4s), seeds, ticker        */
/*  All assets served locally from /public/assets — zero CDN deps.     */
/* ------------------------------------------------------------------ */

export type StatusKind =
  | "available"
  | "brb"
  | "busy"
  | "phone"
  | "lunch"
  | "steppedout"
  | "away"
  | "invisible"
  | "offline";

export interface Contact {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  status: StatusKind;
  statusText?: string;
  customMsg?: string;
  customMsgColor?: string;
  badge?: "crown" | "trophy" | "music" | "mobile";
  badgeText?: string;
}

const A = "/assets/avatars";

export const ME = {
  name: "Sarah Bacon",
  handle: "sarahbacon",
  avatar: `${A}/women-12.jpg`,
  statusMsg: "Is it Friday yet? :)",
};

export const CONTACTS: Contact[] = [
  { id: "brian",    handle: "brianyu",      name: "Brian Yu",         avatar: `${A}/men-32.jpg`,            status: "available" },
  { id: "chinhuat", handle: "chinhuatc",    name: "Chin-Huat Chang",  avatar: `${A}/men-33.jpg`,            status: "steppedout", statusText: "Stepped Out" },
  { id: "csaari",   handle: "chrissaari",   name: "Chris Saari",      avatar: `${A}/cartoon/guy-cool.png`,  status: "available", badge: "mobile", customMsg: "I'm mobile", customMsgColor: "#5a35c8" },
  { id: "dfeld",    handle: "davidf",       name: "David F",          avatar: `${A}/men-36.jpg`,            status: "available", badge: "mobile", customMsg: "I'm mobile", customMsgColor: "#5a35c8" },
  { id: "dfeldman", handle: "davidfeldman", name: "David Feldman",    avatar: `${A}/men-27.jpg`,            status: "available", statusText: "Eric Burke ate my inbox" },
  { id: "dgould",   handle: "davidgould",   name: "David Gould",      avatar: `${A}/men-19.jpg`,            status: "available" },
  { id: "dee",      handle: "dee",          name: "Dee",              avatar: `${A}/women-21.jpg`,          status: "busy", statusText: "Stepped Out" },
  { id: "dudley",   handle: "dudleywong",   name: "Dudley Wong",      avatar: `${A}/men-41.jpg`,            status: "available", badge: "crown" },
  { id: "felix",    handle: "felix",        name: "Felix",            avatar: `${A}/men-11.jpg`,            status: "available" },
  { id: "jared",    handle: "jaredfreeze",  name: "Jared Freeze",     avatar: `${A}/men-24.jpg`,            status: "available", badge: "music", customMsg: "The Choir - It's Cold Outside", customMsgColor: "#3355cc" },
  { id: "jay",      handle: "jaykota",      name: "Jay Kota",         avatar: `${A}/men-22.jpg`,            status: "available" },
  { id: "john",     handle: "johndunning",  name: "John Dunning",     avatar: `${A}/men-30.jpg`,            status: "available", customMsg: "I'm totally buying one of these", customMsgColor: "#5a35c8" },
  { id: "kedar",    handle: "kedarapte",    name: "Kedar Apte",       avatar: `${A}/men-17.jpg`,            status: "available", badge: "trophy", statusText: "Buzz Down", customMsg: "Myanmar keeps Su...", customMsgColor: "#3aa0c8" },
  { id: "horace",   handle: "horacebaria45", name: "horacebaria45",   avatar: `${A}/men-15.jpg`,            status: "available" },
  { id: "lady",     handle: "ladypersia45", name: "ladypersia45",     avatar: `${A}/women-23.jpg`,          status: "available" },
  { id: "etupper",  handle: "etupper",      name: "Erich Tupper",     avatar: `${A}/men-13.jpg`,            status: "offline" },
  { id: "jimmy",    handle: "jimmy",        name: "jimmy",            avatar: `${A}/women-25.jpg`,          status: "offline" },
  { id: "jhampton", handle: "jhampton",     name: "Jonathon Hampton", avatar: `${A}/men-28.jpg`,            status: "offline" },
];

export interface ChatMessage {
  from: "me" | "them";
  text?: string;
  html?: string;
  buzz?: boolean;
  audible?: { name: string; caption: string; src: string };
}

/* ---------------- Audibles: the complete 114-clip original set ---------------- */

const aud = (cat: string, f: string) => `/assets/audibles/${cat}/${f}.mp4`;

export interface Audible {
  name: string;
  caption: string;
  src: string;
}
export interface AudibleCategory {
  id: string;
  label: string;
  items: Audible[];
}

const item = (cat: string, file: string, name: string, caption: string): Audible => ({
  name,
  caption: caption || name,
  src: aud(cat, file),
});

export const AUDIBLE_CATEGORIES: AudibleCategory[] = [
  {
    id: "hello",
    label: "Hellos",
    items: [
      item("hello", "dude", "Dude", "Dude!"),
      item("hello", "echo", "Echo", "Hello? Hello? Hello?"),
      item("hello", "expecting-you", "Expecting you", "I've been expecting you..."),
      item("hello", "guess", "Guess who", "Guess who's back?"),
      item("hello", "i-can-see-you", "I can see you", "I can see you!"),
      item("hello", "its-ok-now", "It's OK now", "It's OK now"),
      item("hello", "ladies-in-da-house", "Ladies", "Ladies in da house!"),
      item("hello", "nosepick", "Nosepick", "Hmm... interesting"),
      item("hello", "skin", "Skin", "Sketchy..."),
      item("hello", "sup", "Sup", "Sup!"),
      item("hello", "whadup", "Whadup", "Whadup!"),
    ],
  },
  {
    id: "goodbyes",
    label: "Goodbyes",
    items: [
      item("goodbyes", "boss", "Boss", "Yes, boss!"),
      item("goodbyes", "buhbye", "Buh-bye", "Buh-bye!"),
      item("goodbyes", "iM", "iM", "Gotta run, iM me later"),
      item("goodbyes", "meds", "Meds", "Time for my meds"),
      item("goodbyes", "outta-here", "Outta here", "I'm outta here!"),
      item("goodbyes", "parole", "Parole", "My parole officer's here"),
      item("goodbyes", "pee", "Pee", "I gotta pee!"),
      item("goodbyes", "reboot", "Reboot", "Time to reboot"),
      item("goodbyes", "see-ya", "See ya", "See ya!"),
      item("goodbyes", "split", "Split", "Let's split!"),
    ],
  },
  {
    id: "taunt",
    label: "Taunts",
    items: [
      item("taunt", "badabing", "Badabing", "Badabing, badaboom!"),
      item("taunt", "dont-make-me-hurt-you", "Don't make me...", "Don't make me hurt you"),
      item("taunt", "gotta-hurt", "Gotta hurt", "That's gotta hurt!"),
      item("taunt", "hit-me-with-your-best-shot-grandma", "Best shot", "Hit me with your best shot, grandma!"),
      item("taunt", "hope-youre-hungry", "Hungry", "Hope you're hungry... for PAIN!"),
      item("taunt", "mopping", "Mopping", "Mopping the floor with you!"),
      item("taunt", "muhahahaha", "Evil laugh", "Muhahahaha!"),
    ],
  },
  {
    id: "insults",
    label: "Insults",
    items: [
      item("insults", "barf", "Barf", "Barf!"),
      item("insults", "brain", "Brain", "Use your brain!"),
      item("insults", "funny", "Funny", "You think that's funny?"),
      item("insults", "laughing", "Laughing", "Ha ha ha ha!"),
      item("insults", "lonely", "Lonely", "Aren't you lonely?"),
      item("insults", "man", "Man!", "Man!"),
      item("insults", "monkey", "Monkey", "You silly monkey!"),
      item("insults", "not-funny", "Not funny", "That's not funny."),
      item("insults", "rest-of-my-life", "Rest of my life", "I could do this all day"),
      item("insults", "shower", "Shower", "Take a shower!"),
      item("insults", "snap", "Snap!", "Snap!"),
      item("insults", "sock", "Sock", "Put a sock in it!"),
      item("insults", "spellcheck", "Spellcheck", "Ever heard of spellcheck?"),
      item("insults", "stick", "Stick", "Got a stick?"),
      item("insults", "suck", "Suck", "You suck!"),
      item("insults", "talk-to-the-hand", "Talk to the hand", "Talk to the hand!"),
      item("insults", "typo", "Typo", "Nice typo."),
      item("insults", "unplug", "Unplug", "Unplug your computer!"),
      item("insults", "whine", "Whine", "Stop whining!"),
      item("insults", "serioulsy", "Seriously", "Seriously?!"),
    ],
  },
  {
    id: "flirt",
    label: "Flirts",
    items: [
      item("flirt", "booty", "Booty", "Check out the booty!"),
      item("flirt", "come-closer", "Come closer", "Come closer..."),
      item("flirt", "cpr", "CPR", "I need CPR!"),
      item("flirt", "cupid", "Cupid", "Cupid got me!"),
      item("flirt", "dang", "Dang", "Daaaang!"),
      item("flirt", "dead", "Dead", "You're so hot you're killing me"),
      item("flirt", "fat-guys-with-no-money", "No money", "I love fat guys with no money"),
      item("flirt", "heart-melt", "Heart melt", "My heart just melted"),
      item("flirt", "hot", "Hot", "You're hot!"),
      item("flirt", "loves-me", "Loves me", "He loves me!"),
      item("flirt", "real-slow", "Real slow", "Talk real slow..."),
      item("flirt", "sexy", "Sexy", "Hey sexy!"),
      item("flirt", "so", "So...", "Soooo..."),
    ],
  },
  {
    id: "winning",
    label: "Winning",
    items: [
      item("winning", "greatest-ever", "Greatest ever", "I'm the greatest ever!"),
      item("winning", "i-won", "I won", "I won, I won!"),
      item("winning", "making-sandwich-for-the-past-10-minutes", "Sandwich", "I've been making this sandwich for the past 10 minutes!"),
      item("winning", "na-na-na-na-na", "Na na na na", "Na na na na, hey hey!"),
      item("winning", "oh-yeah", "Oh yeah", "Oh yeah!"),
      item("winning", "so-badly", "So badly", "I beat you so badly!"),
      item("winning", "wake-me", "Wake me", "Wake me when you win one"),
    ],
  },
  {
    id: "losing",
    label: "Losing",
    items: [
      item("losing", "best-two", "Best two", "Best two out of three?"),
      item("losing", "cheater", "Cheater", "You cheated!"),
      item("losing", "confidence", "Confidence", "You need more confidence"),
      item("losing", "nooo", "Nooo", "Noooooo!"),
      item("losing", "on-now", "On now", "I'm winning right now!"),
      item("losing", "to-someone-like-you", "Someone like you", "I lost to someone like you"),
      item("losing", "well-played-old-man", "Old man", "Well played, old man"),
    ],
  },
  {
    id: "football",
    label: "Football",
    items: [
      item("football", "airhorn", "Airhorn", "Blaaargh!"),
      item("football", "back", "Back", "Get back!"),
      item("football", "german-drummer", "Drummer", "Drumroll!"),
      item("football", "ich-habe-fertig", "Ich habe fertig", "Ich habe fertig!"),
      item("football", "ole-Ole", "Ole Ole", "Ole, ole, ole!"),
      item("football", "pfeife", "Whistle", "Pfeife!"),
      item("football", "schiess-los", "Shoot", "Schiess los!"),
      item("football", "tooooooooooooooooooooor", "GOOOAL", "Tooooooooor!"),
    ],
  },
  {
    id: "music",
    label: "Music",
    items: [
      item("music", "alles-chillig", "Alles chillig", "Alles chillig!"),
      item("music", "das-find-ich-nicht-gut-du", "Nicht gut", "Das find ich nicht gut, du!"),
      item("music", "des-is-nix-zum-schunkeln", "Schunkeln", "Des is nix zum Schunkeln!"),
      item("music", "krass", "Krass", "Kraaass!"),
    ],
  },
  {
    id: "halloween",
    label: "Halloween",
    items: [
      item("halloween", "bad-side", "Bad side", "You don't wanna see my bad side"),
      item("halloween", "bone-to-pick", "Bone to pick", "I've got a bone to pick with you"),
      item("halloween", "boo", "Boo", "Boo!"),
      item("halloween", "cute", "Cute", "Aren't you cute!"),
      item("halloween", "dont-cross-my-path", "Don't cross", "Don't cross my path"),
      item("halloween", "egg", "Egg", "Got any eggs?"),
      item("halloween", "happy-halloween", "Happy Halloween", "Happy Halloween!"),
      item("halloween", "happy-howloeen", "Howloween", "Happy Howloween!"),
      item("halloween", "hate-this-time", "Hate it", "I hate this time of year"),
      item("halloween", "not-feeling-it", "Not feeling it", "I'm not feeling it"),
      item("halloween", "princess", "Princess", "I'm a princess!"),
      item("halloween", "scream", "Scream", "AAAH!"),
      item("halloween", "shut-up", "Shut up", "Shut up!"),
      item("halloween", "tick-or-treat-smeel-my-feet", "Smell my feet", "Trick or treat, smell my feet!"),
      item("halloween", "too-old", "Too old", "Aren't you too old for this?"),
      item("halloween", "trick-or-treat", "Trick or treat", "Trick or treat!"),
      item("halloween", "trick-or-treat-2", "Trick or treat 2", "Trick or treat, give me something good to eat!"),
      item("halloween", "what-are-you-supposed-to-be", "What are you", "What are you supposed to be?!"),
      item("halloween", "whatever", "Whatever", "Whatever."),
    ],
  },
  {
    id: "happy-tree-friends",
    label: "Happy Tree Friends",
    items: [
      item("happy-tree-friends", "disco", "Disco", "Disco time!"),
      item("happy-tree-friends", "flaky", "Flaky", "Flaky here!"),
      item("happy-tree-friends", "flippy", "Flippy", "Flippy says hi!"),
      item("happy-tree-friends", "giggles", "Giggles", "Hee hee hee!"),
      item("happy-tree-friends", "nutty", "Nutty", "Nutty for candy!"),
    ],
  },
  {
    id: "madonna",
    label: "Madonna",
    items: [item("madonna", "ray-of-light", "Ray of Light", "Ray of light!")],
  },
  {
    id: "siedler",
    label: "Siedler",
    items: [
      item("siedler", "das-haben-wir-gleich", "Gleich", "Das haben wir gleich!"),
      item("siedler", "ihr-entkommt-mir-nicht", "Entkommt nicht", "Ihr entkommt mir nicht!"),
    ],
  },
];

/* ---------------- Seeded conversations (from the reference screenshots) ---------------- */

export const SEED_CONVERSATIONS: Record<string, ChatMessage[]> = {
  lady: [
    { from: "them", text: "Salam :)" },
    { from: "them", text: "Javab Salam vajeb e ha!" },
    { from: "them", text: "aloooooooooooooooooo" },
    { from: "them", text: "aloooooooooooooooooooooo" },
    { from: "them", text: "OK!" },
    { from: "them", text: "Bye!" },
  ],
  horace: [
    { from: "me", buzz: true },
    { from: "me", buzz: true },
    { from: "me", buzz: true },
    { from: "me", buzz: true },
    { from: "me", buzz: true },
    { from: "them", text: "<ding>" },
    { from: "them", text: ",din>" },
    { from: "me", buzz: true },
    { from: "me", buzz: true },
    { from: "me", buzz: true },
  ],
  brian: [
    { from: "them", text: "yo, did you see the new IMVironment?" },
    { from: "me", text: "not yet, send it over :D" },
  ],
};

export const AUTO_REPLIES = [
  "lol :D",
  "oh really?",
  "hahaha",
  "brb, phone",
  "that's awesome :)",
  "no way!!",
  "ok ok",
  "talk later?",
  ";)",
  "cool cool",
  "wait what",
  "omg :P",
  "for real?? :O",
  "and then what happened??",
  "same here!!!",
  "did you finish the report?",
  "my webcam is broken :(",
  "omg i LOVE that song",
];

export const NEWS_TICKER = [
  "ALP the same federally as in Tas: Libs (AAP)",
  "Yahoo! unveils new Messenger with voice and video",
  "Study: 8 in 10 teens send instant messages daily",
  "Dow closes up 114 on upbeat earnings reports",
  "New iPhone app store downloads top 100 million",
  "Weather: Sunny skies expected through the weekend",
  "Scientists find water vapor on distant planet",
  "Stocks in play: YHOO, MSFT, AAPL, GOOG",
  "Trends: MP3 players outsell CD players 3-to-1",
  "Olympic countdown: Beijing 2008 torch relay begins",
];
