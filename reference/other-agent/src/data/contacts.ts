export type Status = "available" | "steppedout" | "offline";

export interface Contact {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  status: Status;
  statusText?: string;
  customMsg?: string;
  customMsgColor?: string;
  badge?: "crown" | "trophy" | "music" | "mobile";
  badgeText?: string;
}

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=120&w=120`;

export const ME = {
  name: "Sarah Bacon",
  handle: "sarahbacon",
  avatar: px(693429),
  statusMsg: "Is it Friday yet? :)",
};

export const CONTACTS: Contact[] = [
  { id: "brian", handle: "brianyu", name: "Brian Yu", avatar: px(749091), status: "available" },
  {
    id: "chinhuat",
    handle: "chinhuatc",
    name: "Chin-Huat Chang",
    avatar: px(16160855),
    status: "steppedout",
    statusText: "Stepped Out",
  },
  {
    id: "chris",
    handle: "chrissaari",
    name: "Chris Saari",
    avatar: px(17265008),
    status: "available",
    badge: "mobile",
    customMsg: "I'm mobile",
    customMsgColor: "#5a35c8",
  },
  {
    id: "davef",
    handle: "davidfeldman",
    name: "David Feldman",
    avatar: px(8253795),
    status: "available",
    statusText: "Eric Burke ate my inbox",
  },
  { id: "daveg", handle: "davidgould", name: "David Gould", avatar: px(33680674), status: "available" },
  { id: "dudley", handle: "dudleywong", name: "Dudley Wong", avatar: px(25851303), status: "available", badge: "crown" },
  {
    id: "jared",
    handle: "jaredfreeze",
    name: "Jared Freeze",
    avatar: px(10230832),
    status: "available",
    badge: "music",
    customMsg: "The Choir - It's Cold Outside",
    customMsgColor: "#3355cc",
  },
  { id: "jay", handle: "jaykota", name: "Jay Kota", avatar: px(37117955), status: "available" },
  {
    id: "john",
    handle: "johndunning",
    name: "John Dunning",
    avatar: px(33680709),
    status: "available",
    customMsg: "I'm totally buying one of these",
    customMsgColor: "#5a35c8",
  },
  {
    id: "kedar",
    handle: "kedarapte",
    name: "Kedar Apte",
    avatar: px(16120622),
    status: "available",
    badge: "trophy",
    statusText: "Buzz Down",
    customMsg: "Myanmar keeps Su...",
    customMsgColor: "#3aa0c8",
  },
  { id: "horace", handle: "horacebaria45", name: "horacebaria45", avatar: px(31637223), status: "available" },
  { id: "lady", handle: "ladypersia45", name: "ladypersia45", avatar: px(2586339), status: "available" },
];

export interface ChatMessage {
  from: "me" | "them";
  text?: string;
  html?: string;
  buzz?: boolean;
  audible?: { name: string; caption: string; src: string };
}

const audibleUrl = (cat: string, f: string) =>
  `https://cdn.jsdelivr.net/gh/alexpreli/yahoo-emoticons-discord@main/assets/yahoo-audibles/${cat}/${f}.mp4`;

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

export const AUDIBLE_CATEGORIES: AudibleCategory[] = [
  {
    id: "hello",
    label: "Hellos",
    items: [
      { name: "Dude", caption: "Dude!", src: audibleUrl("hello", "dude") },
      { name: "Echo", caption: "Hello? Hello? Hello?", src: audibleUrl("hello", "echo") },
      { name: "Expecting you", caption: "I've been expecting you...", src: audibleUrl("hello", "expecting-you") },
      { name: "Guess who", caption: "Guess who's back?", src: audibleUrl("hello", "guess") },
      { name: "I can see you", caption: "I can see you!", src: audibleUrl("hello", "i-can-see-you") },
      { name: "It's OK now", caption: "It's OK now", src: audibleUrl("hello", "its-ok-now") },
      { name: "Ladies", caption: "Ladies in da house!", src: audibleUrl("hello", "ladies-in-da-house") },
      { name: "Nosepick", caption: "Hmm... interesting", src: audibleUrl("hello", "nosepick") },
    ],
  },
  {
    id: "flirt",
    label: "Flirts",
    items: [
      { name: "Booty", caption: "Check out the booty!", src: audibleUrl("flirt", "booty") },
      { name: "Come closer", caption: "Come closer...", src: audibleUrl("flirt", "come-closer") },
      { name: "CPR", caption: "I need CPR!", src: audibleUrl("flirt", "cpr") },
      { name: "Cupid", caption: "Cupid got me!", src: audibleUrl("flirt", "cupid") },
      { name: "Dang", caption: "Daaaang!", src: audibleUrl("flirt", "dang") },
      { name: "Heart melt", caption: "My heart just melted", src: audibleUrl("flirt", "heart-melt") },
    ],
  },
  {
    id: "goodbyes",
    label: "Goodbyes",
    items: [
      { name: "Boss", caption: "Yes, boss!", src: audibleUrl("goodbyes", "boss") },
      { name: "Buh-bye", caption: "Buh-bye!", src: audibleUrl("goodbyes", "buhbye") },
      { name: "iM", caption: "Gotta run, iM me later", src: audibleUrl("goodbyes", "iM") },
      { name: "Meds", caption: "Time for my meds", src: audibleUrl("goodbyes", "meds") },
      { name: "Outta here", caption: "I'm outta here!", src: audibleUrl("goodbyes", "outta-here") },
      { name: "Reboot", caption: "Time to reboot", src: audibleUrl("goodbyes", "reboot") },
    ],
  },
  {
    id: "music",
    label: "Music",
    items: [
      { name: "Alles chillig", caption: "Alles chillig!", src: audibleUrl("music", "alles-chillig") },
      { name: "Krass", caption: "Kraaass!", src: audibleUrl("music", "krass") },
      { name: "Rock & roll", caption: "Rock and roll!", src: audibleUrl("music", "rock-and-roll") },
      { name: "Schunkeln", caption: "Des is nix zum Schunkeln", src: audibleUrl("music", "des-is-nix-zum-schunkeln") },
    ],
  },
  {
    id: "football",
    label: "Football",
    items: [
      { name: "Airhorn", caption: "Blaaargh!", src: audibleUrl("football", "airhorn") },
      { name: "Ole Ole", caption: "Ole, ole, ole!", src: audibleUrl("football", "ole-Ole") },
      { name: "Whistle", caption: "Pfeife!", src: audibleUrl("football", "pfeife") },
      { name: "GOOOAL", caption: "Tooooooooor!", src: audibleUrl("football", "tooooooooooooooooooooor") },
      { name: "Back!", caption: "Get back!", src: audibleUrl("football", "back") },
      { name: "Shoot", caption: "Schiess los!", src: audibleUrl("football", "schiess-los") },
    ],
  },
  {
    id: "insults",
    label: "Taunts",
    items: [
      { name: "Barf", caption: "Barf!", src: audibleUrl("insults", "barf") },
      { name: "Brain", caption: "Use your brain!", src: audibleUrl("insults", "brain") },
      { name: "Funny", caption: "You think that's funny?", src: audibleUrl("insults", "funny") },
      { name: "Laughing", caption: "Ha ha ha ha!", src: audibleUrl("insults", "laughing") },
      { name: "Lonely", caption: "Aren't you lonely?", src: audibleUrl("insults", "lonely") },
      { name: "Monkey", caption: "You silly monkey!", src: audibleUrl("insults", "monkey") },
    ],
  },
];

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
    { from: "me", buzz: true },
  ],
  brian: [{ from: "them", text: "yo, did you see the new IMVironment?" }, { from: "me", text: "not yet, send it over :D" }],
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
];

export const NEWS_TICKER = [
  "ALP the same federally as in Tas: Libs (AAP)",
  "Yahoo! launches new emoticon packs for Messenger members",
  "Broadband reaches 60% of households — voice calls get clearer",
  "IMVironments voted favourite way to personalise chats",
  "Weekend forecast: partly cloudy with a chance of buzzing",
];

export const WALLPAPER =
  "https://images.pexels.com/photos/28578392/pexels-photo-28578392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";

export const BALLOON =
  "https://images.pexels.com/photos/37514310/pexels-photo-37514310.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=160&w=160";
